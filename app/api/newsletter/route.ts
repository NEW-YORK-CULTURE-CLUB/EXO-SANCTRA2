import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, interests, agreeToTerms } = body;

    // Validate required fields - email is required, other fields are optional
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to newsletter database
    // 2. Add to email marketing service (Mailchimp, ConvertKit, etc.)
    // 3. Send welcome email
    // 4. Update user preferences
    
    // For now, we'll just log the newsletter signup data
    console.log('Newsletter signup:', {
      email,
      firstName,
      interests,
      agreeToTerms,
      timestamp: new Date().toISOString()
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter',
        id: `newsletter_${Date.now()}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
