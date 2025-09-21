// src/app/api/newsletter/send/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { marked } from 'marked';
import { getEmailHtml } from '@/lib/email-template';
import { createNewsletterBroadcast, sendNewsletterBroadcast } from '@/lib/resend-email-sender';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

marked.setOptions({ breaks: true, gfm: true });

export async function POST(request: Request) {
  try {
    // Env checks
    const requiredEnv = {
      RESEND_AUDIENCE_API_KEY: !!process.env.RESEND_AUDIENCE_API_KEY,
      RESEND_AUDIENCE_ID: !!process.env.RESEND_AUDIENCE_ID,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    };
    const missing = Object.entries(requiredEnv).filter(([, ok]) => !ok).map(([k]) => k);
    if (missing.length) {
      return NextResponse.json({ error: `Missing env: ${missing.join(', ')}` }, { status: 500 });
    }

    let postData;
    try {
      postData = await request.json();
      console.log('📥 Post data received:', {
        hasSubject: !!postData?.subject,
        hasTitle: !!postData?.title,
        keys: Object.keys(postData || {})
      });
    } catch (jsonError) {
      console.error('❌ Failed to parse request JSON:', jsonError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    // Validate required fields
    if (!postData?.subject || !postData?.title) {
      return NextResponse.json(
        { error: 'Both "subject" and "title" are required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Upsert the post as published (but DO NOT set sent_at yet)
    const { data: savedPost, error: postError } = await supabase
      .from('posts')
      .upsert({ ...postData, status: 'published' })
      .select()
      .single();
    if (postError) throw new Error(`Error saving post: ${postError.message}`);

    // Fetch archive posts only if present
    const archiveIds: string[] = Array.isArray(savedPost.archive_posts) ? savedPost.archive_posts : [];
    let archivePosts:
      | { title: string; image_url: string | null; slug: string; subtext: string | null }[]
      = [];
    if (archiveIds.length) {
      const { data, error: archiveError } = await supabase
        .from('posts')
        .select('title, image_url, slug, subtext')
        .in('id', archiveIds);
      if (archiveError) throw new Error(`Error fetching archive posts: ${archiveError.message}`);
      archivePosts = data ?? [];
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
      .format(new Date(now));

    // Build email HTML (your template includes {{{RESEND_UNSUBSCRIBE_URL}}})
    const emailData = {
      header_title: savedPost.title || 'A note on healing',
      formatted_date: formattedDate,
      main_image_url:
        savedPost.image_url ||
        'https://placehold.co/640x360/F9F5F2/000000?text=Main+Article+Image',
      main_title: savedPost.title,
      main_body: marked.parse(savedPost.body || ''),
      toasty_take: marked.parse(savedPost.toasty_take || ''),
      archive_posts: archivePosts,
    };
    const finalHtml = getEmailHtml(emailData);

    // Create broadcast
    const createResult = await createNewsletterBroadcast(
      savedPost.subject,
      finalHtml,
      'Kay from Toasted Sesame',
      'care@toastedsesametherapy.com'
    );
    if (!createResult.success) throw new Error(createResult.error || 'Failed to create broadcast');

    console.log('📤 Broadcast created, now sending...', { broadcastId: createResult.emailId });

    // Send broadcast immediately
    const sendResult = await sendNewsletterBroadcast(createResult.emailId!, 'now');
    if (!sendResult.success) throw new Error(sendResult.error || 'Failed to send broadcast');

    // Mark as sent AFTER successful send
    const { error: updateError } = await supabase
      .from('posts')
      .update({ sent_at: now })
      .eq('id', savedPost.id);
    if (updateError) {
      // Log but still return success (you can reconcile with emailId)
      console.warn('Sent but failed to update sent_at:', updateError.message);
    }

    return NextResponse.json({
      message: 'Newsletter sent successfully!',
      broadcastId: createResult.emailId,
      sendId: sendResult.emailId,
      postId: savedPost.id,
      slug: savedPost.slug,
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('❌ Newsletter API Error:', { message: error.message, stack: error.stack });
    return NextResponse.json(
      { error: `Newsletter API Error: ${error.message || 'Unexpected error'}` },
      { status: 500 }
    );
  }
}
