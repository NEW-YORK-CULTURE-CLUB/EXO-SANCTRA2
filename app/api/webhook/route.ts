import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET!, {
  apiVersion: '2026-04-22.dahlia',
});

// Firebase (server-side client SDK)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Webhook verification failed';
      console.error('Webhook signature verification failed:', message);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else {
    // No webhook secret configured — parse directly (dev/test only)
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await addDoc(collection(db, 'orders'), {
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        productId: session.metadata?.productId ?? '',
        title: session.metadata?.title ?? '',
        type: session.metadata?.type ?? '',
        amount: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_details?.email ?? '',
        customerName: session.customer_details?.name ?? '',
        shippingAddress: (session as { shipping?: { address?: object } }).shipping?.address ?? null,
        status: 'paid',
        fulfillmentStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('Order saved for session:', session.id);
    } catch (err) {
      console.error('Failed to save order to Firestore:', err);
    }
  }

  return NextResponse.json({ received: true });
}
