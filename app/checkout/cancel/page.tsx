'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        >
          <XCircle className="w-20 h-20 text-white/30" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-3">Purchase cancelled.</h1>
        <p className="text-white/60 mb-8">
          No charge was made. The artwork is still waiting for you.
        </p>

        <div className="space-y-3">
          <Link
            href="/omrak-collection"
            className="flex items-center justify-center gap-2 w-full rounded-full bg-white text-black py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to collection
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
