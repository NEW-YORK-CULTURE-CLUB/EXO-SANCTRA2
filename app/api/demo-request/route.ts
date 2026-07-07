import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailTransporter,
  emailNotConfiguredPayload,
  getEmailConfig,
} from '@/lib/email';

// Email Template Generator for Demo Request
function generateDemoRequestEmailTemplate(data: any) {
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
          <h1>New Demo Request</h1>
        </div>
        <div class="content">
          <h2>Demo Request Details</h2>
          
          <div class="info-section">
            <p><span class="field-label">Full Name:</span><span class="field-value">${data.fullName}</span></p>
            <p><span class="field-label">Email:</span><span class="field-value">${data.email}</span></p>
            ${data.phone ? `<p><span class="field-label">Phone:</span><span class="field-value">${data.phone}</span></p>` : ''}
          </div>

          <div class="info-section">
            <p><span class="field-label">Organization:</span><span class="field-value">${data.organizationName || 'Not provided'}</span></p>
            <p><span class="field-label">Role:</span><span class="field-value">${data.role || 'Not provided'}</span></p>
          </div>

          <div class="info-section">
            <p><span class="field-label">Primary Interest:</span><span class="field-value">${data.helpAreas.length > 0 ? data.helpAreas.join(', ') : 'Not specified'}</span></p>
            ${data.helpAreas.includes('other') && data.otherHelp ? `<p><span class="field-label">Other Details:</span><span class="field-value">${data.otherHelp}</span></p>` : ''}
          </div>



          ${data.additionalInfo ? `
            <div class="info-section">
              <p><span class="field-label">Additional Information:</span></p>
              <p class="field-value">${data.additionalInfo}</p>
            </div>
          ` : ''}
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
    if (!data.fullName || !data.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      );
    }

    const transporter = createEmailTransporter();
    if (!transporter) {
      return NextResponse.json(emailNotConfiguredPayload(), { status: 503 });
    }
    const emailConfig = getEmailConfig()!;

    // Generate HTML content
    const htmlContent = generateDemoRequestEmailTemplate(data);

    // Prepare mail options
    const mailOptions = {
      from: emailConfig.from,
      to: [process.env.SMTP_NOTIFICATION_TO?.trim() || 'hello@exosanctra.com'],
      subject: `New demo request - ${data.fullName}`,
      text: `
New Demo Request

Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Organization: ${data.organizationName || 'Not provided'}
Role: ${data.role || 'Not provided'}

Primary Interest: ${data.helpAreas.length > 0 ? data.helpAreas.join(', ') : 'Not specified'}
${data.helpAreas.includes('other') && data.otherHelp ? `Other Details: ${data.otherHelp}` : ''}

${data.additionalInfo ? `Additional Information: ${data.additionalInfo}` : ''}
      `,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Demo request sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send demo request email' },
      { status: 500 }
    );
  }
} 