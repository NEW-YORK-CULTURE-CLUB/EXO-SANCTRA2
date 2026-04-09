'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Scan, Smartphone, Share2, Link2, QrCode, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import type { Group } from 'three';

// ─── Data ─────────────────────────────────────────────────────────────────────

const AR_ARTWORKS = [
  {
    id: 'planet-of-love',
    path: '/vault/AR/artwork 1_planet of love_character.glb',
    usdzPath: '/vault/AR/artwork 1_planet of love_character.usdz',
    label: 'Planet of Love',
    image: '/vault/Characters for AR_Art Collection/Planet of Love.jpg',
    description: 'What if every hidden part of you had a place to gather, to hold each other and give love without fear?',
  },
  {
    id: 'the-unburied-ones',
    path: '/vault/AR/artwork 2_the unburied ones_character.glb',
    usdzPath: '/vault/AR/artwork 2_the unburied ones_character.usdz',
    label: 'The Unburied Ones',
    image: '/vault/Characters for AR_Art Collection/The Unburied Ones.jpg',
    description: "There is something in this world that never disappears. The past doesn't stay buried—it breathes quietly through your bones.",
  },
  {
    id: 'ugly-is-beautiful',
    path: '/vault/AR/artwork 3_ugly is beautiful_character.glb',
    usdzPath: null,
    label: 'Ugly is Beautiful',
    image: '/vault/Characters for AR_Art Collection/Ugly is Beautiful.jpg',
    description: 'Beauty is not given — it is survived. What they called ugly was simply the truest thing about you.',
  },
  {
    id: 'my-freak-family',
    path: '/vault/AR/artwork 4_my freak family_character.glb',
    usdzPath: '/vault/AR/artwork 4_my freak family_character.usdz',
    label: 'My Freak Family',
    image: '/vault/Characters for AR_Art Collection/My Freak Family.jpg',
    description: 'Your true family is the ones who can sit with your dark corners and still grow gardens from them.',
  },
  {
    id: 'exorcise-me-whole',
    path: '/vault/AR/artwork 5_exorcise me whole_character.glb',
    usdzPath: null,
    label: 'Exorcise Me Whole',
    image: '/vault/Characters for AR_Art Collection/Exorcise Me Whole.jpg',
    description: 'Not a piece of you cast out — but all of it invited in. The exorcism that heals instead of hollows.',
  },
  {
    id: 'homebound-galaxy',
    path: '/vault/AR/artwork 6_homebound galaxy_character.glb',
    usdzPath: null,
    label: 'Homebound Galaxy',
    image: '/vault/Characters for AR_Art Collection/Homebound Galaxy.jpg',
    description: 'Home is not a place you return to. It is a universe you carry — stars made of every version of yourself.',
  },
  {
    id: 'liquid-desire',
    path: '/vault/AR/artwork 7_liquid desire_character.glb',
    usdzPath: '/vault/AR/artwork 7_liquid desire_character.usdz',
    label: 'Liquid Desire',
    image: '/vault/Characters for AR_Art Collection/Liquid Desire.jpg',
    description: 'Desire is a leak you learn to trust. It finds the seams you thought were sewn shut.',
  },
  {
    id: 'cleansing-rite',
    path: '/vault/AR/artwork 8_cleansing rite_character.glb',
    usdzPath: null,
    label: 'Cleansing Rite',
    image: '/vault/Characters for AR_Art Collection/Cleansing Rite.jpg',
    description: 'Sometimes things inside you have to die. The ritual is not neat or painless — you scrape, you wash, you choose your clean.',
  },
  {
    id: 'taste-the-power',
    path: '/vault/AR/artwork 9_taste the power_character.glb',
    usdzPath: null,
    label: 'Taste the Power',
    image: '/vault/Characters for AR_Art Collection/Taste the Power.jpg',
    description: 'Power was never meant to be borrowed. This is what it feels like when it grows from inside you.',
  },
  {
    id: 'necroflora',
    path: '/vault/AR/artwork 10_necroflora_character.glb',
    usdzPath: null,
    label: 'Necroflora',
    image: '/vault/Characters for AR_Art Collection/Necroflora.jpg',
    description: 'Where others close graves, something else opens — colorful, wet, and free. Decay becomes soil.',
  },
  {
    id: 'let-go',
    path: '/vault/AR/artwork 11_let go_character.glb',
    usdzPath: null,
    label: 'Let Go',
    image: '/vault/Characters for AR_Art Collection/Let Go.jpg',
    description: 'The hardest thing you will ever hold is the thing you are finally ready to release.',
  },
];

// ─── Dynamic imports (no SSR) ─────────────────────────────────────────────────

const Canvas = dynamic(() => import('@react-three/fiber').then((m) => m.Canvas), { ssr: false });

const ModelViewer3D = dynamic(() => import('../model-viewer-3d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="text-white/50 text-sm">Loading 3D model…</p>
      </div>
    </div>
  ),
});

// ─── Platform detection ───────────────────────────────────────────────────────

function useARPlatform() {
  const [state, setState] = useState<{
    isIOS: boolean;
    isAndroid: boolean;
    webXRSupported: boolean;
    checking: boolean;
  }>({ isIOS: false, isAndroid: false, webXRSupported: false, checking: true });

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      setState((s) => ({ ...s, checking: false }));
      return;
    }
    const ua = navigator.userAgent || '';
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);

    if (!navigator.xr) {
      setState({ isIOS, isAndroid, webXRSupported: false, checking: false });
      return;
    }
    navigator.xr
      .isSessionSupported('immersive-ar')
      .then((supported) => setState({ isIOS, isAndroid, webXRSupported: supported, checking: false }))
      .catch(() => setState({ isIOS, isAndroid, webXRSupported: false, checking: false }));
  }, []);

  return state;
}

// ─── WebXR model placement ────────────────────────────────────────────────────

function PlacedModel({
  path,
  placedPoseRef,
  ...props
}: {
  path: string;
  placedPoseRef: React.MutableRefObject<{
    position: [number, number, number];
    quaternion: [number, number, number, number];
  } | null>;
} & React.ComponentProps<'group'>) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(path);
  const clone = React.useMemo(() => scene.clone(), [scene]);

  useFrame(() => {
    const group = groupRef.current;
    const pose = placedPoseRef.current;
    if (!group || !pose) return;
    group.position.set(...pose.position);
    group.quaternion.set(...pose.quaternion);
    group.visible = true;
  });

  return (
    <group ref={groupRef} {...props} visible={false}>
      <primitive object={clone} scale={0.5} />
    </group>
  );
}

function ARExperience({
  modelPath,
  placedPoseRef,
  onSessionStarted,
  onSessionEnded,
  exitRequested,
  onExitHandled,
  initialSessionRef,
}: {
  modelPath: string;
  placedPoseRef: React.MutableRefObject<{
    position: [number, number, number];
    quaternion: [number, number, number, number];
  } | null>;
  onSessionStarted: () => void;
  onSessionEnded: () => void;
  exitRequested: boolean;
  onExitHandled: () => void;
  initialSessionRef: React.MutableRefObject<XRSession | null>;
}) {
  const sessionRef = useRef<XRSession | null>(null);
  const hitTestSourceRef = useRef<XRTransientInputHitTestSource | null>(null);
  const viewerSpaceRef = useRef<XRReferenceSpace | null>(null);
  const placedAtRef = useRef<{
    position: [number, number, number];
    quaternion: [number, number, number, number];
  } | null>(null);

  const { gl } = useThree();
  const xrManager = gl.xr;

  useEffect(() => {
    const session = initialSessionRef.current;
    if (!session || !xrManager) return;
    let cancelled = false;
    sessionRef.current = session;
    xrManager.enabled = true;

    const setup = async () => {
      try {
        await xrManager.setSession(session);
        if (cancelled) return;
        onSessionStarted();

        const viewerSpace = await session.requestReferenceSpace('viewer');
        if (cancelled) return;
        viewerSpaceRef.current = viewerSpace;

        try {
          const fn = session.requestHitTestSourceForTransientInput;
          if (fn) {
            const src = await fn.call(session, { profile: 'generic-touchscreen' });
            if (src) hitTestSourceRef.current = src;
          }
        } catch {
          try {
            const fn = session.requestHitTestSource;
            if (fn) {
              const src = await fn.call(session, {
                space: viewerSpace,
                offsetRay: new XRRay({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -1 }),
              });
              if (src)
                (hitTestSourceRef as React.MutableRefObject<XRHitTestSource | null>).current = src;
            }
          } catch {
            // hit-test optional
          }
        }

        session.addEventListener('end', () => {
          sessionRef.current = null;
          hitTestSourceRef.current = null;
          viewerSpaceRef.current = null;
          onExitHandled();
          onSessionEnded();
        });
      } catch (err) {
        console.warn('AR setup failed:', err);
        onSessionEnded();
      } finally {
        initialSessionRef.current = null;
      }
    };

    setup();
    return () => {
      cancelled = true;
      if (sessionRef.current) sessionRef.current.end().catch(() => {});
      xrManager.enabled = false;
    };
  }, [xrManager, onSessionStarted, onSessionEnded, onExitHandled, initialSessionRef]);

  useEffect(() => {
    if (exitRequested && sessionRef.current) {
      sessionRef.current.end().catch(() => {});
      onExitHandled();
    }
  }, [exitRequested, onExitHandled]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!session || !viewerSpaceRef.current) return;

    const onSelect = (event: XRInputSourceEvent) => {
      const frame = event.frame;
      const src = hitTestSourceRef.current;
      if (!frame || !src || !viewerSpaceRef.current) return;

      let hitResult: XRHitTestResult | null = null;
      const ft = frame as XRFrame & {
        getHitTestResultsForTransientInput?(s: XRTransientInputHitTestSource): XRTransientInputHitTestResult[];
      };
      if (typeof ft.getHitTestResultsForTransientInput === 'function') {
        const results = ft.getHitTestResultsForTransientInput(src as XRTransientInputHitTestSource);
        const forThis = results?.find((r) => r.inputSource === event.inputSource);
        if (forThis?.results?.length) hitResult = forThis.results[0];
        if (!hitResult && results?.length) hitResult = results[0].results?.[0] ?? null;
      }
      if (!hitResult && 'getHitTestResults' in frame) {
        const results = (frame as XRFrame).getHitTestResults(src as XRHitTestSource);
        if (results?.length) hitResult = results[0];
      }
      if (!hitResult) return;

      const pose = hitResult.getPose(viewerSpaceRef.current);
      if (!pose) return;

      const p = pose.transform.position;
      const o = pose.transform.orientation;
      placedAtRef.current = {
        position: [p.x, p.y, p.z],
        quaternion: [o.x, o.y, o.z, o.w],
      };
      if (placedPoseRef) placedPoseRef.current = placedAtRef.current;
    };

    session.addEventListener('select', onSelect);
    return () => session.removeEventListener('select', onSelect);
  }, [placedPoseRef]);

  useFrame(() => {
    if (placedAtRef.current && placedPoseRef.current) {
      placedPoseRef.current.position = placedAtRef.current.position;
      placedPoseRef.current.quaternion = placedAtRef.current.quaternion;
    }
  });

  return (
    <>
      <color attach="background" args={['transparent']} />
      <PlacedModel path={modelPath} placedPoseRef={placedPoseRef} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ARViewerPage() {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';
  const artwork = AR_ARTWORKS.find((a) => a.id === id) ?? AR_ARTWORKS[0];

  // AR session state
  const [arActive, setArActive] = useState(false);
  const [exitRequested, setExitRequested] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const placedPoseRef = useRef<{
    position: [number, number, number];
    quaternion: [number, number, number, number];
  } | null>(null);
  const initialSessionRef = useRef<XRSession | null>(null);

  // Share state
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState('');
  const shareRef = useRef<HTMLDivElement>(null);

  const { isIOS, webXRSupported, checking } = useARPlatform();

  // Set page URL on mount
  useEffect(() => {
    setPageUrl(window.location.href);
  }, [id]);

  // Preload models
  useEffect(() => {
    AR_ARTWORKS.forEach(({ path }) => {
      try { useGLTF.preload(path); } catch { /* ignore */ }
    });
  }, []);

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

  const handleStartAR = useCallback(async () => {
    setSessionError(null);
    if (typeof navigator === 'undefined' || !navigator.xr) {
      setSessionError('AR is not available in this browser.');
      return;
    }
    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        optionalFeatures: ['hit-test'],
      });
      initialSessionRef.current = session;
      placedPoseRef.current = null;
      setArActive(true);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : 'Could not start AR');
    }
  }, []);

  const handleSessionStarted = useCallback(() => setArActive(true), []);
  const handleSessionEnded = useCallback(() => { setArActive(false); setExitRequested(false); }, []);
  const handleExitAR = useCallback(() => setExitRequested(true), []);
  const handleExitHandled = useCallback(() => setExitRequested(false), []);

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

      {/* ── Main ── */}
      <div className="flex-1 relative min-h-0">

        {/* 3D Viewer (shown when AR is not active) */}
        {!arActive && (
          <div className="absolute inset-0">
            <ModelViewer3D modelPath={artwork.path} />

            {/* Bottom action bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col items-center gap-3">
              <p className="text-white/40 text-xs">Drag to rotate · Scroll to zoom</p>

              {checking ? (
                <div className="h-12 flex items-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                </div>
              ) : isIOS && artwork.usdzPath ? (
                <a
                  rel="ar"
                  href={artwork.usdzPath}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  View in AR
                </a>
              ) : isIOS && !artwork.usdzPath ? (
                <p className="text-white/40 text-xs text-center max-w-xs">
                  AR placement is available on Android. On iPhone, explore in 3D above.
                </p>
              ) : webXRSupported ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartAR}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-95 transition-all"
                  >
                    <Scan className="w-4 h-4" />
                    View in AR
                  </button>
                  {sessionError && (
                    <p className="text-amber-400/90 text-xs max-w-xs text-center">{sessionError}</p>
                  )}
                </>
              ) : artwork.usdzPath ? (
                <a
                  rel="ar"
                  href={artwork.usdzPath}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/20 text-white font-semibold text-sm border border-white/30 hover:bg-white/30 active:scale-95 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  Try AR (iPhone / Safari)
                </a>
              ) : (
                <p className="text-white/40 text-xs text-center max-w-xs">
                  AR is not supported in this browser. Open on a mobile device for the full experience.
                </p>
              )}
            </div>
          </div>
        )}

        {/* WebXR AR view */}
        {arActive && (
          <div className="absolute inset-0">
            <Canvas
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              camera={{ fov: 70, near: 0.01, far: 100 }}
              dpr={[1, 2]}
            >
              <ARExperience
                modelPath={artwork.path}
                placedPoseRef={placedPoseRef}
                onSessionStarted={handleSessionStarted}
                onSessionEnded={handleSessionEnded}
                exitRequested={exitRequested}
                onExitHandled={handleExitHandled}
                initialSessionRef={initialSessionRef}
              />
            </Canvas>
            <div className="absolute bottom-20 left-0 right-0 px-4 flex flex-col items-center gap-3">
              <p className="text-white/80 text-sm drop-shadow-lg">Tap a surface to place the artwork</p>
              <button
                type="button"
                onClick={handleExitAR}
                className="px-5 py-2 rounded-full bg-black/60 text-white text-sm font-medium border border-white/20 hover:bg-black/80 transition-colors"
              >
                Exit AR
              </button>
            </div>
          </div>
        )}
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
                  value={pageUrl || `https://exsa.com/ar/${artwork.id}`}
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
                  {pageUrl || `exsa.com/ar/${artwork.id}`}
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
