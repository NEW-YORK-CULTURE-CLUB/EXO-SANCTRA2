'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Share2, Scan, Link2, QrCode, X, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { omrakArtworks } from '../data';

export default function ArtworkPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const currentIndex = omrakArtworks.findIndex((a) => a.slug === slug);
  const artwork = omrakArtworks[currentIndex];

  const [isIOS, setIsIOS] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent));
    setPageUrl(window.location.href);
  }, [slug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const prevArtwork = currentIndex > 0 ? omrakArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < omrakArtworks.length - 1 ? omrakArtworks[currentIndex + 1] : null;

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setShareOpen(false);
    setTimeout(() => setCopied(false), 2500);
  }, [pageUrl]);

  const handleOpenQR = useCallback(() => {
    setShareOpen(false);
    setQrOpen(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (qrOpen && e.key === 'Escape') { setQrOpen(false); return; }
      if (e.key === 'ArrowLeft' && prevArtwork) router.push(`/omrak-collection/${prevArtwork.slug}`);
      else if (e.key === 'ArrowRight' && nextArtwork) router.push(`/omrak-collection/${nextArtwork.slug}`);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevArtwork, nextArtwork, router, qrOpen]);

  if (!artwork) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Artwork not found.</p>
          <Link href="/omrak-collection" className="text-white underline underline-offset-4 hover:text-white/80">
            Back to collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* ── Top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-b from-black/80 to-transparent">

        {/* Back */}
        <Link
          href="/omrak-collection"
          className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </span>
          <span className="text-sm font-medium hidden sm:inline">Collection</span>
        </Link>

        {/* Share dropdown */}
        <div className="relative" ref={shareRef}>
          <button
            type="button"
            onClick={() => setShareOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            aria-label="Share artwork"
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
      </div>

      {/* ── Main content ── */}
      <motion.div
        key={artwork.slug}
        className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 px-4 pt-20 pb-24 lg:pt-24 lg:pb-8 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image */}
        <div className="relative w-full lg:flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-lg lg:max-w-none h-[55vw] max-h-[70vh] lg:h-[75vh]">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 90vw, 55vw"
              priority
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-[380px] xl:w-[420px] bg-white/5 backdrop-blur-md rounded-2xl p-5 lg:p-6 border border-white/10 flex-shrink-0">
          <p className="text-xs text-white/50 mb-1">
            {currentIndex + 1} of {omrakArtworks.length} · OM&apos;RAK Collection
          </p>
          <h1 className="text-white text-2xl lg:text-3xl font-semibold mb-1">{artwork.title}</h1>
          <p className="text-xs text-white/50 mb-4">11×14 inches · Colored pencils &amp; ink on paper</p>

          <div className="max-h-40 lg:max-h-52 overflow-y-auto pr-1 text-sm text-white/80 leading-relaxed mb-5">
            <p>{artwork.description}</p>
          </div>

          {/* AR View */}
          {artwork.arId && (
            <div className="mb-4">
              {isIOS && artwork.usdzPath ? (
                <a
                  href={artwork.usdzPath}
                  rel="ar"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full border border-white/40 text-white px-4 py-2.5 text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors"
                >
                  <Scan className="w-4 h-4" />
                  View in AR
                </a>
              ) : (
                <Link
                  href={`/ar?artwork=${artwork.arId}`}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full border border-white/40 text-white px-4 py-2.5 text-sm font-semibold tracking-wide hover:bg-white/10 transition-colors"
                >
                  <Scan className="w-4 h-4" />
                  View in AR
                </Link>
              )}
            </div>
          )}

          {/* Purchase */}
          <div className="space-y-3">
            <div className="text-xs text-white/70">
              <p className="font-semibold text-white mb-1">Collect this OM&apos;RAK:</p>
              <p>Originals are one-of-one. Prints are high-quality archival reproductions, made to order.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:freakisslin@gmail.com?subject=OM'RAK Original Inquiry – ${encodeURIComponent(artwork.title)}`}
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-4 py-2 text-xs font-semibold tracking-wide hover:bg-white/90 transition-colors"
              >
                Inquire about original
              </a>
              <a
                href={`mailto:freakisslin@gmail.com?subject=OM'RAK Print Inquiry – ${encodeURIComponent(artwork.title)}`}
                className="inline-flex items-center justify-center rounded-full border border-white/60 text-white px-4 py-2 text-xs font-semibold tracking-wide hover:bg-white/10 transition-colors"
              >
                Request a print
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Bottom nav ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-4 bg-gradient-to-t from-black/90 to-transparent">
        {prevArtwork ? (
          <Link
            href={`/omrak-collection/${prevArtwork.slug}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </span>
            <span className="text-sm hidden sm:inline truncate max-w-[140px]">{prevArtwork.title}</span>
          </Link>
        ) : <div />}

        <div className="flex items-center gap-1.5">
          {omrakArtworks.map((a, i) => (
            <Link
              key={a.slug}
              href={`/omrak-collection/${a.slug}`}
              className={`block rounded-full transition-all duration-200 ${
                i === currentIndex ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={a.title}
            />
          ))}
        </div>

        {nextArtwork ? (
          <Link
            href={`/omrak-collection/${nextArtwork.slug}`}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <span className="text-sm hidden sm:inline truncate max-w-[140px]">{nextArtwork.title}</span>
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        ) : <div />}
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Modal card */}
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
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">OM'RAK Collection</p>
                <h2 className="text-white text-xl font-semibold leading-tight">{artwork.title}</h2>
                <p className="text-xs text-white/40 mt-1">Scan to open this artwork</p>
              </div>

              {/* QR code */}
              <div className="mx-6 mb-6 rounded-2xl bg-white p-5 flex items-center justify-center">
                <QRCode
                  value={pageUrl || `https://exsa.com/omrak-collection/${artwork.slug}`}
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
                  {pageUrl || `exsa.com/omrak-collection/${artwork.slug}`}
                </span>
              </div>

              {/* Copy link button */}
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
