import { NextRequest, NextResponse } from 'next/server';
import {
  createEmailTransporter,
  emailNotConfiguredPayload,
  getEmailConfig,
} from '@/lib/email';

// Email Template Generator for Patron Communications
function generatePatronEmailTemplate(data: any) {
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
      .message-content {
        background-color: #f8f8f8;
        padding: 20px;
        border-radius: 6px;
        margin: 20px 0;
        border-left: 3px solid #000000;
        white-space: pre-line;
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      ${commonStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ExhibitIQ Gallery Communication</h1>
        </div>
        
        <div class="content">
          <h2>${data.subject}</h2>
          
          <div class="info-section">
            <p><span class="field-label">From:</span> <span class="field-value">${data.galleryName}</span></p>
            <p><span class="field-label">To:</span> <span class="field-value">${data.recipients}</span></p>
            <p><span class="field-label">Template:</span> <span class="field-value">${data.template}</span></p>
            <p><span class="field-label">Date:</span> <span class="field-value">${new Date().toLocaleDateString()}</span></p>
          </div>
          
          <div class="message-content">
            ${data.message}
          </div>
          
          <p>Thank you for your continued interest in our gallery.</p>
          
          <p>Best regards,<br>
          <strong>${data.galleryName} Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This email was sent from ExhibitIQ Gallery Management System</p>
          <p>If you no longer wish to receive these communications, please contact us to update your preferences.</p>
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
    if (!data.subject || !data.message || !data.recipients || !data.galleryName) {
      return NextResponse.json(
        { error: 'Subject, message, recipients, and gallery name are required' },
        { status: 400 }
      );
    }

    const transporter = createEmailTransporter();
    if (!transporter) {
      return NextResponse.json(emailNotConfiguredPayload(), { status: 503 });
    }
    const emailConfig = getEmailConfig()!;

    // Generate HTML content
    const htmlContent = generatePatronEmailTemplate(data);

    // Prepare mail options
    const mailOptions = {
      from: emailConfig.from,
      to: data.recipients,
      subject: data.subject,
      text: `
${data.subject}

From: ${data.galleryName}
Template: ${data.template}
Date: ${new Date().toLocaleDateString()}

Message:
${data.message}

Thank you for your continued interest in our gallery.

Best regards,
${data.galleryName} Team

---
This email was sent from ExhibitIQ Gallery Management System
If you no longer wish to receive these communications, please contact us to update your preferences.
      `,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
