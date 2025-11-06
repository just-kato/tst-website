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

    // Enhanced bot detection with stronger patterns
    const suspiciousIndicators = [
      !userAgent || userAgent.includes('bot') || userAgent.includes('crawler'),
      !submissionTime || (Date.now() - submissionTime) > 300000, // Older than 5 minutes
      name.toLowerCase().includes('bot') || email.toLowerCase().includes('bot'),
      // Check for random string patterns in names (like the bots we found)
      /^[A-Za-z]{15,}$/.test(name) && !/\s/.test(name), // Long names without spaces
      // Check for suspicious email patterns
      email.toLowerCase().includes('test') || email.toLowerCase().includes('spam'),
      // Check for submission timing that's too fast
      submissionTime && (Date.now() - submissionTime) < 1000, // Less than 1 second
    ];

    const suspiciousCount = suspiciousIndicators.filter(Boolean).length;

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

    // Verify botpoison and determine security status
    let botpoisonVerified = false;
    let securityStatus = 'unverified';

    if (emergencyDisable) {
      securityStatus = 'emergency_disabled';
    } else if (isDev && devBypass && botpoison === 'dev-bypass-token') {
      securityStatus = 'dev_bypass';
    } else if (botpoison) {
      // Actually verify the botpoison solution
      botpoisonVerified = await verifyBotpoison(botpoison);
      if (botpoisonVerified) {
        securityStatus = 'verified';
      }
    }

    // Strict enforcement: Block unverified submissions unless in dev/emergency mode
    if (!emergencyDisable && !(isDev && devBypass && botpoison === 'dev-bypass-token')) {
      if (!botpoisonVerified) {
        console.log('🚫 Botpoison verification required but failed/missing');
        return NextResponse.json(
          { error: 'Security verification failed. Please ensure JavaScript is enabled and try again.' },
          { status: 400 }
        );
      }

      // Also block obviously suspicious submissions even with botpoison
      if (suspiciousCount >= 2) {
        console.log('🚫 Multiple suspicious indicators detected despite botpoison verification');
        return NextResponse.json(
          { error: 'Submission flagged by security system. Please contact us directly if this is an error.' },
          { status: 400 }
        );
      }
    }

    // Determine if this submission needs review
    const needsReview = !botpoisonVerified || suspiciousCount > 0;

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
        botpoisonVerified: botpoisonVerified
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