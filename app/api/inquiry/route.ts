import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email Template Generator for Art Inquiry
function generateInquiryEmailTemplate(data: any) {
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
          <h1>New Art Inquiry</h1>
        </div>
        <div class="content">
          <h2>Art Inquiry Details</h2>
          
          <div class="info-section">
            <p><span class="field-label">Full Name:</span><span class="field-value">${data.fullName}</span></p>
            <p><span class="field-label">Email:</span><span class="field-value">${data.email}</span></p>
            ${data.phone ? `<p><span class="field-label">Phone:</span><span class="field-value">${data.phone}</span></p>` : ''}
          </div>

          <div class="info-section">
            <p><span class="field-label">Inquiring about specific artwork:</span><span class="field-value">${data.inquiringAboutSpecific === 'yes' ? 'Yes' : 'No'}</span></p>
            ${data.artworkTitle ? `<p><span class="field-label">Artwork Title:</span><span class="field-value">${data.artworkTitle}</span></p>` : ''}
          </div>

          <div class="info-section">
            <p><span class="field-label">Nature of Interest:</span><span class="field-value">${data.interestNature}</span></p>
            ${data.otherInterest ? `<p><span class="field-label">Other Interest:</span><span class="field-value">${data.otherInterest}</span></p>` : ''}
          </div>

          ${data.whatDrewYou ? `
            <div class="info-section">
              <p><span class="field-label">What drew them to the artwork:</span></p>
              <p class="field-value">${data.whatDrewYou}</p>
            </div>
          ` : ''}

          <div class="info-section">
            <p><span class="field-label">Schedule consultation:</span><span class="field-value">${data.scheduleConsultation === 'yes' ? 'Yes' : 'No'}</span></p>
            ${data.preferredDateTime ? `<p><span class="field-label">Preferred date/time:</span><span class="field-value">${data.preferredDateTime}</span></p>` : ''}
          </div>

          <div class="info-section">
            <p><span class="field-label">Preferred response method:</span><span class="field-value">${data.responseMethod}</span></p>
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} ExhibitIQ. All rights reserved.
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

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vestrybooking@gmail.com',
        pass: 'fjiq yzyr qhns qhnp',
      },
    });

    // Generate HTML content
    const htmlContent = generateInquiryEmailTemplate(data);

    // Prepare mail options
    const mailOptions = {
      from: 'ExhibitIQ',
      to: 'admin@exhibitiq.art',
      subject: `New Art Inquiry from ${data.fullName}`,
      text: `
New Art Inquiry

Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Inquiring about specific artwork: ${data.inquiringAboutSpecific === 'yes' ? 'Yes' : 'No'}
${data.artworkTitle ? `Artwork Title: ${data.artworkTitle}` : ''}

Nature of Interest: ${data.interestNature}
${data.otherInterest ? `Other Interest: ${data.otherInterest}` : ''}

${data.whatDrewYou ? `What drew them: ${data.whatDrewYou}` : ''}

Schedule consultation: ${data.scheduleConsultation === 'yes' ? 'Yes' : 'No'}
${data.preferredDateTime ? `Preferred date/time: ${data.preferredDateTime}` : ''}

Preferred response method: ${data.responseMethod}
      `,
      html: htmlContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Inquiry sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send inquiry email' },
      { status: 500 }
    );
  }
} 