import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  getCheckoutAmount,
  getCheckoutDescription,
  getCheckoutLabel,
  type CheckoutProductType,
  type PriceTier,
} from '@/app/omrak-collection/pricing';

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET!, {
  apiVersion: '2026-04-22.dahlia',
});

const VALID_TYPES: CheckoutProductType[] = [
  'original',
  'print-standard',
  'print-large',
  'altar-9x12',
  'altar-11x14',
  'altar-16x20',
  'soul-altar-9x12',
  'soul-altar-11x14',
  'soul-altar-16x20',
];

export async function POST(req: NextRequest) {
  try {
    const { productId, title, type, priceTier } = await req.json();

    if (!productId || !title || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!VALID_TYPES.includes(type as CheckoutProductType)) {
      return NextResponse.json({ error: 'Invalid product type' }, { status: 400 });
    }

    const checkoutType = type as CheckoutProductType;

    const tierRequired =
      checkoutType === 'original' ||
      checkoutType === 'print-standard' ||
      checkoutType === 'print-large';

    if (tierRequired && !priceTier) {
      return NextResponse.json({ error: 'Missing price tier' }, { status: 400 });
    }

    let amount: number;
    try {
      amount = getCheckoutAmount(
        checkoutType,
        tierRequired ? (priceTier as PriceTier) : undefined,
      );
    } catch {
      return NextResponse.json({ error: 'Could not resolve price' }, { status: 400 });
    }

    const origin =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const variantLabel = getCheckoutLabel(checkoutType);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: `${title} — ${variantLabel}`,
              description: getCheckoutDescription(checkoutType),
              metadata: { productId, type: checkoutType },
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        productId,
        title,
        type: checkoutType,
        priceTier: priceTier ?? '',
      },
      shipping_address_collection: {
        allowed_countries: [
          'US',
          'CA',
          'GB',
          'AU',
          'DE',
          'FR',
          'NL',
          'ES',
          'IT',
          'JP',
          'SG',
          'AE',
          'UA',
          'PL',
        ],
      },
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Stripe checkout error:', err);
    const message = err instanceof Error ? err.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
