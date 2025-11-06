import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCleanPhoneNumber } from '@/lib/validation';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyBotpoison(solution: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.botpoison.com/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secretKey: process.env.BOTPOISON_SECRET_KEY,
        solution,
      }),
    });

    const data = await response.json();
    // Botpoison API returns { ok: true } for successful verification
    return data.ok === true;
  } catch (error) {
    console.error('Botpoison verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, variant = 'contact', botpoison, userAgent, submissionTime } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Smart bot protection with fallbacks
    const isDev = process.env.NODE_ENV === 'development';
    const devBypass = process.env.BOTPOISON_DEV_BYPASS === 'true';
    const emergencyDisable = process.env.BOTPOISON_EMERGENCY_DISABLE === 'true';

    if (emergencyDisable) {
      console.log('🚨 Emergency disable active - skipping all bot protection');
    } else if (isDev && devBypass && botpoison === 'dev-bypass-token') {
      console.log('🚧 Development bypass used - skipping botpoison verification');
    } else {
      // Check for obvious bot indicators first
      const suspiciousIndicators = [
        !userAgent || userAgent.includes('bot') || userAgent.includes('crawler'),
        !submissionTime || (Date.now() - submissionTime) > 300000, // Older than 5 minutes
        name.toLowerCase().includes('bot') || email.toLowerCase().includes('bot'),
      ];

      const suspiciousCount = suspiciousIndicators.filter(Boolean).length;

      if (botpoison) {
        // If we have a botpoison token, verify it
        const isVerified = await verifyBotpoison(botpoison);
        if (!isVerified) {
          console.log('Botpoison verification failed - checking other indicators');

          // If botpoison fails but user seems legitimate, allow with warning
          if (suspiciousCount === 0 && userAgent && submissionTime) {
            console.log('⚠️  Botpoison failed but user appears legitimate - allowing with warning');
            // Continue to create contact but flag for review
          } else {
            return NextResponse.json(
              { error: 'Security verification failed. Please try again or contact us directly.' },
              { status: 400 }
            );
          }
        }
      } else {
        // No botpoison token - check other indicators
        if (suspiciousCount >= 2) {
          console.log('No botpoison token and multiple suspicious indicators detected');
          return NextResponse.json(
            { error: 'Security verification required. Please enable JavaScript and try again.' },
            { status: 400 }
          );
        } else if (suspiciousCount >= 1) {
          console.log('⚠️  No botpoison but some suspicious indicators - allowing with warning');
          // Continue but flag for review
        }
      }
    }

    // Check for existing contact
    const { data: existingContact, error: checkError } = await supabase
      .from('contacts')
      .select('id, email, name')
      .eq('email', email.toLowerCase())
      .single();

    if (existingContact) {
      return NextResponse.json(
        {
          error: 'An account with this email already exists. Please contact care@toastedsesametherapy.com directly for assistance.',
          contactExists: true,
        },
        { status: 409 }
      );
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError);
      return NextResponse.json(
        { error: 'Failed to check existing contacts' },
        { status: 500 }
      );
    }

    // Determine if this submission needs review
    const needsReview = !botpoison || suspiciousCount > 0;
    const securityStatus = botpoison ? 'verified' : 'unverified';

    // Create new contact
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone_number: phone ? getCleanPhoneNumber(phone) : null,
      contact_status: 'ACTIVE',
      appointment_status: null,
      segments: variant === 'trauma' ? ['Trauma Booking Lead'] : ['Contact Form Lead'],
      crm_notes: variant === 'trauma'
        ? `Trauma booking form submission on ${new Date().toLocaleDateString()}`
        : `Contact form submission on ${new Date().toLocaleDateString()}`,
      custom_fields: {
        source: variant === 'trauma' ? 'trauma_booking_form' : 'contact_form',
        variant: variant,
        submittedAt: new Date().toISOString(),
        securityStatus: securityStatus,
        needsReview: needsReview,
        userAgent: userAgent,
        botpoisonVerified: !!botpoison
      },
      archived: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select('id, name, email, phone_number, contact_status, segments, created_at')
      .single();

    if (error) {
      console.error('Contact creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create contact' },
        { status: 500 }
      );
    }

    // Create dashboard notification
    try {
      await supabase.from('notifications').insert({
        type: variant === 'trauma' ? 'trauma_booking' : 'contact',
        title: variant === 'trauma' ? 'New Trauma Booking' : 'New Contact Submission',
        message: `${name} submitted a ${variant === 'trauma' ? 'trauma booking' : 'contact'} form`,
        contact_id: data.id,
        contact_name: name,
        contact_email: email.toLowerCase(),
        read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notificationError) {
      console.warn('Failed to create notification:', notificationError);
      // Don't fail the whole request if notification fails
    }

    // Send email notification to admin
    try {
      const emailSubject = variant === 'trauma'
        ? `New Trauma Booking Form Submission - ${name}`
        : `New Contact Form Submission - ${name}`;

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            ${variant === 'trauma' ? 'New Trauma Booking' : 'New Contact'} Form Submission
          </h2>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 8px 0;"><strong>Form Type:</strong> ${variant === 'trauma' ? 'Trauma Booking' : 'Contact Form'}</p>
            <p style="margin: 8px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #1976d2;">
              <strong>Next Steps:</strong> This contact has been automatically added to your CRM with the segment "${variant === 'trauma' ? 'Trauma Booking Lead' : 'Contact Form Lead'}".
              Consider reaching out within 24 hours for best engagement.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from your website's contact form submission system.
            </p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: 'Toasted Sesame Therapy <noreply@toastedsesametherapy.com>',
        to: process.env.ADMIN_EMAIL!,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Contact created successfully',
      contact: data,
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}