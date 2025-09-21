/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/email-template.ts

// Add this security function at the top
function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// NEW: Function to sanitize HTML content while preserving safe tags
function sanitizeHtmlContent(content: string): string {
  if (!content) return '';

  // First, escape any potential script tags and dangerous content
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick, onload, etc.
    .replace(/style\s*=\s*['""][^'"]*['"]/gi, ''); // Remove style attributes to prevent CSS injection

  return sanitized;
}

// IMPROVED: Helper function to validate and process image URLs for email compatibility
function getSafeImageUrl(url: string, fallback: string = ''): string {
  if (!url) return fallback;

  // Ensure absolute URLs for email compatibility
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return escapeHtml(url);
  }

  // Convert relative URLs to absolute (adjust domain as needed)
  if (url.startsWith('/')) {
    return escapeHtml(`https://toastedsesametherapy.com${url}`);
  }

  return fallback;
}

// Helper function to build the HTML for a single archive post
const createArchiveItemHtml = (post: any) => {
  // Escape user-provided content (these should be escaped as they're displayed as text)
  const safeTitle = escapeHtml(post.title || '');
  const safeSubtext = escapeHtml(post.subtext || '');
  const safeSlug = escapeHtml(post.slug || '');

  // FIXED: Better image URL handling with proper fallback
  const safeImageUrl = getSafeImageUrl(
    post.image_url,
    'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/cho-cloud-hero.png'
  );

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:2px solid #eeeeee;">
    <tr>
      <td style="padding:20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="80" valign="top" style="width:80px;" class="archive-img">
              <img src="${safeImageUrl}"
                   width="80"
                   height="80"
                   alt="${safeTitle}"
                   style="width:80px;height:80px;object-fit:cover;border:0;display:block;">
            </td>
            <td valign="top" style="padding-left:20px;" class="archive-text">
              <h3 style="font-family:'Work Sans',Arial,sans-serif;font-size:18px;font-weight:bold;color:#000;margin:0 0 5px;">${safeTitle}</h3>
              <p style="font-family:'Work Sans',Arial,sans-serif;font-size:14px;color:#000;margin:0 0 10px;">${safeSubtext}</p>
              <a href="https://toastedsesametherapy.com/posts/${safeSlug}" target="_blank" style="font-family:'Work Sans',Arial,sans-serif;font-weight:bold;color:#000;">Read more &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;
};

// This is the main function that builds the entire email.
export const getEmailHtml = (data: any): string => {
  // Escape text content (titles, dates) but NOT HTML content (main_body, toasty_take)
  const safeHeaderTitle = escapeHtml(data.header_title || '');
  const safeFormattedDate = escapeHtml(data.formatted_date || '');
  const safeMainTitle = escapeHtml(data.main_title || '');

  // Use sanitizeHtmlContent for content that should allow HTML tags
  const safeMainBody = sanitizeHtmlContent(data.main_body || '');
  const safeToastyTake = sanitizeHtmlContent(data.toasty_take || '');

  // FIXED: Better main image URL handling
  const safeMainImageUrl = getSafeImageUrl(
    data.main_image_url,
    'https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/cho-cloud-hero.png'
  );

  const archiveHtml =
    data.archive_posts?.map(createArchiveItemHtml).join('') || '';

  return `
  <!DOCTYPE html>
  <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,date=no,address=no,email=no,url=no">
    <title>toasty tidbits</title>

    <!--[if !mso]><!-->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700;900&display=swap" rel="stylesheet">
    <!--<![endif]-->

    <style>
      html, body {
        margin: 0 auto !important;
        padding: 0 !important;
        height: 100% !important;
        width: 100% !important;
        background: #F9F5F2;
        font-family: 'Work Sans', Arial, sans-serif;
      }
      table, td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        margin: 0 auto !important;
      }
      img {
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
        height: auto;
        display: block;
        border: 0;
        outline: none;
        text-decoration: none;
      }
      a {
        text-decoration: none;
        outline: none;
        cursor: pointer !important;
      }

      a[href] {
        cursor: pointer !important;
        text-decoration: underline !important;
      }

      .unsubscribe-link {
        color: #C5A1FF !important;
        text-decoration: underline !important;
        font-weight: bold !important;
        cursor: pointer !important;
        display: inline-block !important;
      }

      /* FIXED: Better image handling for email clients */
      .main-image {
        width: 100% !important;
        max-width: 640px !important;
        height: auto !important;
        display: block !important;
        border: 0 !important;
      }

      .logo-image {
        width: 300px !important;
        max-width: 300px !important;
        height: auto !important;
        display: block !important;
        margin: 0 auto 20px auto !important;
      }

      .icon-image {
        width: 250px !important;
        max-width: 250px !important;
        height: auto !important;
        display: block !important;
      }

      /* Add better styling for main body content */
      .main-content {
        font-family: 'Work Sans', Arial, sans-serif !important;;
        font-size: 18px !important;;
        line-height: 1.6 !important;;
        color: #000000;
      }
      .main-content p {
        margin: 0 0 16px 0;
        font-size:  18px !important;
        line-height: 1.6 !important;
      }
      .main-content h1, .main-content h2, .main-content h3 {
        margin: 20px 0 12px 0;
        font-weight: bold;
      }

      @media screen and (max-width: 680px) {
          .email-container { width: 100% !important; }
          .card-wrapper { padding: 0 10px 20px 10px !important; }
          .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
          .h1 { font-size: 32px !important; line-height: 1.2 !important; }
          .h2 { font-size: 24px !important; line-height: 1.3 !important; }
          .archive-img { width: 60px !important; height: 60px !important; }
          .archive-img img { width: 60px !important; height: 60px !important; }
          .archive-text { padding-left: 15px !important; }
          .main-content { font-size: 15px !important; }
          .main-content p { font-size: 15px !important; }
          .logo-image { width: 250px !important; max-width: 250px !important; }
          .icon-image { width: 200px !important; max-width: 200px !important; }
      }

      /* Outlook specific fixes */
      <!--[if mso]>
      .main-image { width: 640px !important; }
      .logo-image { width: 300px !important; }
      .icon-image { width: 250px !important; }
      <![endif]-->
    </style>
  </head>

  <body width="100%" style="margin:0; padding:0; background-color:#F9F5F2;">
    <center style="width:100%; background-color:#F9F5F2;">
      <div style="max-width:680px; margin:0 auto;" class="email-container">
        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="680" style="width:680px;" align="center">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
          <!-- Header -->
          <tr>
            <td style="padding:40px 30px; text-align:center;" class="mobile-padding">
              <img src="https://mcusercontent.com/f4b2666465f26c26e8f765b7e/images/bae03227-4033-0c24-6304-fc4189935fd5.png"
                   class="logo-image"
                   alt="Toasted Sesame Therapy Logo"
                   style="width:300px;max-width:300px;height:auto;display:block;margin:0 auto 20px auto;border:0;">
              <h1 class="h1" style="font-family:'Work Sans',Arial,sans-serif; font-size:44px; font-weight:900; line-height:1.1; color:#000000; margin:0;">${safeHeaderTitle}</h1>
              <p style="font-family:'Work Sans',Arial,sans-serif; font-size:18px; line-height:1.5; color:#000000; margin:10px 0 0;">${safeFormattedDate}</p>
            </td>
          </tr>
          <!-- Main Article -->
          <tr>
            <td style="padding:0 20px 20px 20px;" class="card-wrapper">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#ffffff; border:3px solid #000000; ">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <img src="${safeMainImageUrl}"
                               class="main-image"
                               alt="Main Article Image"
                               style="width:100%;max-width:640px;height:auto;display:block;border:0;">
                        </td>
                      </tr>
                      <tr><td style="padding:20px 30px 0 30px;" class="mobile-padding"><h2 class="h2" style="font-family:'Work Sans',Arial,sans-serif; font-size:30px; font-weight:bold; color:#000000; margin:0;">${safeMainTitle}</h2></td></tr>
                      <tr><td style="padding:15px 30px 30px 30px;" class="mobile-padding"><div class="main-content" style="font-family:'Work Sans',Arial,sans-serif; font-size:18px; line-height:1.5; color:#000000;">${safeMainBody}</div></td></tr>
                    </table>
                  </td>
                  <td width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                </tr>
                <tr>
                  <td height="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                  <td height="4" width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Toasty Tidbit -->
          <tr>
              <td style="padding:0 20px 20px 20px;" class="card-wrapper">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                          <td style="background-color:#7FBC8C; border:3px solid #000000; ">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding:20px 30px 10px 30px;" class="mobile-padding">
                                      <img src="https://mcusercontent.com/f4b2666465f26c26e8f765b7e/images/f55df04f-ec82-a245-d156-765ea70160d7.png"
                                           class="icon-image"
                                           alt="Toasty Tidbit Icon"
                                           style="width:250px;max-width:250px;height:auto;display:block;border:0;">
                                    </td>
                                  </tr>
                                  <tr><td style="padding:0 30px 30px 30px;" class="mobile-padding"><div style="font-family:'Work Sans',Arial,sans-serif; font-size:18px; line-height:1.5; color:#000000;">${safeToastyTake}<br><br>&ndash; Your favorite therapist, Kay</div></td></tr>
                              </table>
                          </td>
                          <td width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td height="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                          <td height="4" width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <!-- From the Archive -->
          <tr>
              <td style="padding:0 20px 20px 20px;" class="card-wrapper">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                          <td style="background-color:#ffffff; border:3px solid #000000; ">
                              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr><td style="padding:20px 30px 0 30px;" class="mobile-padding"><h2 class="h2" style="font-family:'Work Sans',Arial,sans-serif; font-size:28px; font-weight:bold; color:#000000; margin:0;">From the Archive</h2></td></tr>
                                  <tr><td style="padding:15px 30px 30px 30px;" class="mobile-padding">${archiveHtml}</td></tr>
                              </table>
                          </td>
                          <td width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td height="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                          <td height="4" width="4" style="font-size:1px; line-height:1px; background-color: #000000;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td style="padding:20px 30px;" class="mobile-padding">
              <h2 class="h2" style="font-family:'Work Sans',Arial,sans-serif; font-size:28px; font-weight:bold; text-align:center; color:#000000; margin:0 0 20px;">Ready to go deeper?</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center"><a href="https://toastedsesametherapy.com/contact" target="_blank" style="display:inline-block; padding:12px 25px; font-family:'Work Sans',Arial,sans-serif; font-size:16px; font-weight:bold; text-decoration:none; color:#000000; background-color:#F7BD01; border:2px solid #000000; box-shadow:4px 4px 0 0; ">Book a Free Consultation</a></td></tr></table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px; text-align:center;" class="mobile-padding">
              <p style="font-family:'Work Sans',Arial,sans-serif; font-size:13px; font-style:italic; line-height:1.5; color:#666666; margin:0 0 15px;">These toasty thoughts are here to offer warmth and connection... Please remember, this content isn't a substitute for personalized therapy...</p>
              <p style="font-family:'Work Sans',Arial,sans-serif; font-size:12px; line-height:1.5; color:#666666; margin:0 0 15px 0;">
              <a href="https://toastedsesametherapy.com" target="_blank" style="font-weight:bold; color:#C5A1FF; text-decoration:none;">Toasted Sesame Therapy</a><br><br><br>You are receiving this email because you opted in.</p>
            <p style="font-family:'Work Sans',Arial,sans-serif; font-size:12px; line-height:1.5; color:#666666; margin:10px 0 0; text-align:center;">
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" class="unsubscribe-link" target="_blank" style="color:#C5A1FF; text-decoration:underline; font-weight:bold;">
                Unsubscribe
              </a>
            </p>
            </td>
          </tr>
        </table>
        </div>
        <!--[if mso | IE]>
        </td>
        </tr>
        </table>
        <![endif]-->
    </center>
    </body>
    </html>
  `;
};
