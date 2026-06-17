'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push('/omrak-collection');
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <div className="relative">
            <CheckCircle className="w-20 h-20 text-green-400" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">Your artwork is secured.</h1>
        <p className="text-white/60 mb-2">
          Thank you for collecting OM&apos;RAK. A confirmation email is on its way.
        </p>
        <p className="text-white/40 text-sm mb-8">
          We&apos;ll be in touch within 2–3 business days about shipping and activation.
        </p>

        {sessionId && (
          <p className="text-white/30 text-xs font-mono mb-8 break-all">
            Order ref: {sessionId}
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/omrak-collection"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to collection
          </Link>
          <Link
            href="/store-of-essence"
            className="flex items-center justify-center w-full rounded-full border border-white/20 text-white/70 py-3 text-sm hover:bg-white/5 transition-colors"
          >
            Explore more of EXSA
          </Link>
        </div>

        <p className="text-white/20 text-xs mt-6">
          Redirecting to collection in {countdown}s…
        </p>
      </motion.div>
    </div>
  );
}
