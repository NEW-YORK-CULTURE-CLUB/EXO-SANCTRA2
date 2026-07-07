import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailTransporter,
  emailNotConfiguredPayload,
  getEmailConfig,
} from '@/lib/email';

// Email Template Generator for Gift Claim
function generateGiftClaimEmailTemplate(data: any) {
  const commonStyles = `
    <style>
      body { 
        font-family: 'Inter', 'Arial', sans-serif; 
        line-height: 1.6; 
        color: #000000; 
        max-width: 600px; 
        margin: 0 auto; 
        padding: 20px; 
        background-color: #ffffff;
      }
      .container {
        background-color: #ffffff;
        border-radius: 8px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
      }
      .header {
        background-color: #000000;
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 32px;
        color: #000000;
      }
      .content h2 {
        margin: 0 0 24px 0;
        font-size: 20px;
        font-weight: 600;
        color: #000000;
      }
      .footer {
        background-color: #f8f8f8;
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: #666666;
        border-top: 1px solid #e5e5e5;
      }
      .info-section {
        background-color: #f8f8f8;
        padding: 16px;
        border-radius: 6px;
        margin: 16px 0;
        border-left: 3px solid #000000;
      }
      .field-label {
        font-weight: 600;
        color: #000000;
      }
      .field-value {
        color: #333333;
        margin-left: 8px;
      }
      p {
        margin: 8px 0;
      }
    </style>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${commonStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Alien Gift Claim</h1>
        </div>
        <div class="content">
          <h2>Alien Gift Claim - Data Collection</h2>
          <p style="color: #666666; margin-bottom: 24px;">A user has claimed an alien gift. All collected data is below:</p>
          
          <div class="info-section">
            <p><span class="field-label">Gift Type:</span><span class="field-value">${data.giftType || 'Not provided'}</span></p>
            <p><span class="field-label">Gift Title:</span><span class="field-value">${data.giftTitle || 'Not provided'}</span></p>
            <p><span class="field-label">Claim Method:</span><span class="field-value">${data.claimMethod === 'email' ? 'Email' : 'Wallet'}</span></p>
          </div>

          <div class="info-section">
            <p style="font-weight: 600; color: #000000; margin-bottom: 8px;">Contact Information:</p>
            ${data.email ? `<p><span class="field-label">Email Address:</span><span class="field-value">${data.email}</span></p>` : ''}
            ${data.walletAddress ? `<p><span class="field-label">Crypto Wallet Address:</span><span class="field-value">${data.walletAddress}</span></p>` : ''}
            ${data.userId ? `<p><span class="field-label">User ID:</span><span class="field-value">${data.userId}</span></p>` : ''}
            ${!data.email && !data.walletAddress && !data.userId ? '<p style="color: #999999;">No contact information provided</p>' : ''}
          </div>

          <div class="info-section">
            <p><span class="field-label">Claim Timestamp:</span><span class="field-value">${new Date().toLocaleString()}</span></p>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} EXO SANCTRA. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.giftType) {
      return NextResponse.json(
        { error: 'Gift type is required' },
        { status: 400 }
      );
    }

    const transporter = createEmailTransporter();
    if (!transporter) {
      return NextResponse.json(emailNotConfiguredPayload(), { status: 503 });
    }
    const emailConfig = getEmailConfig()!;

    // Generate HTML content
    const htmlContent = generateGiftClaimEmailTemplate(data);

    // Prepare mail options
    const mailOptions = {
      from: emailConfig.from,
      to: [process.env.SMTP_NOTIFICATION_TO?.trim() || 'hello@exosanctra.com'],
      subject: `New Alien Gift Claim - ${data.giftType}`,
      text: `
New Alien Gift Claim - Data Collection

A user has claimed an alien gift. All collected data is below:

GIFT INFORMATION:
- Gift Type: ${data.giftType || 'Not provided'}
- Gift Title: ${data.giftTitle || 'Not provided'}
- Claim Method: ${data.claimMethod === 'email' ? 'Email' : 'Wallet'}

CONTACT INFORMATION:
${data.email ? `- Email Address: ${data.email}` : ''}
${data.walletAddress ? `- Crypto Wallet Address: ${data.walletAddress}` : ''}
${data.userId ? `- User ID: ${data.userId}` : ''}

TIMESTAMP:
- Claimed At: ${new Date().toLocaleString()}

---
Note: This is data collection only. Gifts will be sent later.
      `,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Gift claim email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send gift claim email' },
      { status: 500 }
    );
  }
}

