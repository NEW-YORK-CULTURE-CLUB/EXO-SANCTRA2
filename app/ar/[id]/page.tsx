'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Scan, Share2, Link2, QrCode, X } from 'lucide-react';
import QRCode from 'react-qr-code';

// ─── Data ─────────────────────────────────────────────────────────────────────

const AR_ARTWORKS = [
  {
    id: 'planet-of-love',
    path: '/vault/AR/artwork 1_planet of love_character.glb',
    usdzPath: '/vault/AR/artwork 1_planet of love_character.usdz',
    label: 'Planet of Love',
    description: 'What if every hidden part of you had a place to gather, to hold each other and give love without fear?',
  },
  {
    id: 'the-unburied-ones',
    path: '/vault/AR/artwork 2_the unburied ones_character.glb',
    usdzPath: '/vault/AR/artwork 2_the unburied ones_character.usdz',
    label: 'The Unburied Ones',
    description: "There is something in this world that never disappears. The past doesn't stay buried—it breathes quietly through your bones.",
  },
  {
    id: 'ugly-is-beautiful',
    path: '/vault/AR/artwork 3_ugly is beautiful_character.glb',
    usdzPath: '/vault/AR/artwork 3_ugly is beautiful_character.usdz',
    label: 'Ugly is Beautiful',
    description: 'Beauty is not given — it is survived. What they called ugly was simply the truest thing about you.',
  },
  {
    id: 'my-freak-family',
    path: '/vault/AR/artwork 4_my freak family_character.glb',
    usdzPath: '/vault/AR/artwork 4_my freak family_character.usdz',
    label: 'My Freak Family',
    description: 'Your true family is the ones who can sit with your dark corners and still grow gardens from them.',
  },
  {
    id: 'exorcise-me-whole',
    path: '/vault/AR/artwork 5_exorcise me whole_character.glb',
    usdzPath: '/vault/AR/artwork 5_exorcise me whole_character.glb',
    label: 'Exorcise Me Whole',
    description: 'Not a piece of you cast out — but all of it invited in. The exorcism that heals instead of hollows.',
  },
  {
    id: 'homebound-galaxy',
    path: '/vault/AR/artwork 6_homebound galaxy_character.glb',
    usdzPath: '/vault/AR/artwork 6_homebound galaxy_character.usdz',
    label: 'Homebound Galaxy',
    description: 'Home is not a place you return to. It is a universe you carry — stars made of every version of yourself.',
  },
  {
    id: 'liquid-desire',
    path: '/vault/AR/artwork 7_liquid desire_character.glb',
    usdzPath: '/vault/AR/artwork 7_liquid desire_character.usdz',
    label: 'Liquid Desire',
    description: 'Desire is a leak you learn to trust. It finds the seams you thought were sewn shut.',
  },
  {
    id: 'cleansing-rite',
    path: '/vault/AR/artwork 8_cleansing rite_character.glb',
    usdzPath: '/vault/AR/artwork 8_cleansing rite_character.usdz',
    label: 'Cleansing Rite',
    description: 'Sometimes things inside you have to die. The ritual is not neat or painless — you scrape, you wash, you choose your clean.',
  },
  {
    id: 'taste-the-power',
    path: '/vault/AR/artwork 9_taste the power_character.glb',
    usdzPath: '/vault/AR/artwork 9_taste the power_character.usdz',
    label: 'Taste the Power',
    description: 'Power was never meant to be borrowed. This is what it feels like when it grows from inside you.',
  },
  {
    id: 'necroflora',
    path: '/vault/AR/artwork 10_necroflora_character.glb',
    usdzPath: '/vault/AR/artwork 10_necroflora_character.usdz',
    label: 'Necroflora',
    description: 'Where others close graves, something else opens — colorful, wet, and free. Decay becomes soil.',
  },
  {
    id: 'let-go',
    path: '/vault/AR/artwork 11_let go_character.glb',
    usdzPath: '/vault/AR/artwork 11_let go_character.usdz',
    label: 'Let Go',
    description: 'The hardest thing you will ever hold is the thing you are finally ready to release.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ARViewerPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const artwork = AR_ARTWORKS.find((a) => a.id === id) ?? AR_ARTWORKS[0];

  const [mounted, setMounted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const shareRef = useRef<HTMLDivElement>(null);
  const modelViewerRef = useRef<HTMLElement>(null);

  // Load model-viewer script + set page URL on mount
  useEffect(() => {
    setMounted(true);
    setPageUrl(window.location.href);

    if (!document.querySelector('script[data-mv]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
      script.setAttribute('data-mv', '1');
      document.head.appendChild(script);
    }
  }, []);

  // Re-trigger animations when AR session starts
  useEffect(() => {
    const mv = modelViewerRef.current as (HTMLElement & { play?: (opts?: { repetitions?: number }) => void }) | null;
    if (!mv) return;

    const handleArStatus = (e: Event) => {
      const status = (e as CustomEvent<{ status: string }>).detail?.status;
      if (status === 'session-started' && typeof mv.play === 'function') {
        mv.play({ repetitions: Infinity });
      }
    };

    mv.addEventListener('ar-status', handleArStatus);
    return () => mv.removeEventListener('ar-status', handleArStatus);
  }, [mounted]);

  // Close share dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close QR on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setQrOpen(false); setShareOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setShareOpen(false);
    setQrOpen(false);
    setTimeout(() => setCopied(false), 2500);
  }, [pageUrl]);

  const handleOpenQR = useCallback(() => {
    setShareOpen(false);
    setQrOpen(true);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-black overflow-hidden">

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <Link
          href="/ar"
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium hidden sm:inline">AR Gallery</span>
        </Link>

        <span className="text-sm font-medium text-white/90 absolute left-1/2 -translate-x-1/2">
          {artwork.label}
        </span>

        {/* Share button */}
        <div className="relative" ref={shareRef}>
          <button
            type="button"
            onClick={() => setShareOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            aria-label="Share"
          >
            {copied && (
              <motion.span
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-medium text-white/70 hidden sm:inline"
              >
                Link copied!
              </motion.span>
            )}
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </span>
          </button>

          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-44 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden z-40"
              >
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Link2 className="w-4 h-4 flex-shrink-0" />
                  Copy link
                </button>
                <div className="h-px bg-white/10 mx-3" />
                <button
                  type="button"
                  onClick={handleOpenQR}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <QrCode className="w-4 h-4 flex-shrink-0" />
                  View QR code
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── model-viewer (3D + AR) ── */}
      <div className="flex-1 relative min-h-0">
        {mounted && (
          <model-viewer
            ref={modelViewerRef}
            src={artwork.path}
            {...(artwork.usdzPath ? { 'ios-src': artwork.usdzPath } : {})}
            alt={artwork.label}
            ar
            ar-modes="scene-viewer webxr quick-look"
            ar-scale="auto"
            camera-controls
            auto-rotate
            auto-rotate-delay={2000}
            rotation-per-second="20deg"
            autoplay
            shadow-intensity="1"
            exposure="1"
            loading="eager"
            reveal="auto"
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              '--poster-color': 'transparent',
            } as React.CSSProperties}
          >
            {/* Loading slot */}
            <div slot="progress-bar" />

            {/* Custom AR button */}
            <button
              slot="ar-button"
              className="absolute bottom-16 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all shadow-lg"
            >
              <Scan className="w-4 h-4" />
              View in AR
            </button>
          </model-viewer>
        )}

        {/* Hint text — sits above model-viewer but below the AR button */}
        <p className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs pointer-events-none">
          Drag to rotate · Pinch to zoom · Tap &ldquo;View in AR&rdquo; to place in your space
        </p>
      </div>

      {/* ── QR Code Modal ── */}
      <AnimatePresence>
        {qrOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQrOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="px-6 pt-7 pb-4 text-center">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">AR Experience</p>
                <h2 className="text-white text-xl font-semibold leading-tight">{artwork.label}</h2>
                <p className="text-xs text-white/40 mt-1">Scan to open this AR experience</p>
              </div>

              {/* QR code */}
              <div className="mx-6 mb-6 rounded-2xl bg-white p-5 flex items-center justify-center">
                <QRCode
                  value={pageUrl || `https://www.exosanctra.com/ar/${artwork.id}`}
                  size={240}
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                  level="M"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* URL pill */}
              <div className="mx-6 mb-4 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 flex items-center gap-2">
                <Link2 className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <span className="text-xs text-white/50 truncate flex-1 font-mono">
                  {pageUrl || `exosanctra.com/ar/${artwork.id}`}
                </span>
              </div>

              {/* Copy link */}
              <div className="px-6 pb-7">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full rounded-full bg-white text-black text-sm font-semibold py-3 hover:bg-white/90 transition-colors"
                >
                  {copied ? 'Link copied!' : 'Copy link'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
