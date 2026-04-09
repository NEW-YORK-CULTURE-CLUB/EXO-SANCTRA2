'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';
import { omrakArtworks } from './data';

function OmrakCollection() {
  const [showWhatYouReceive, setShowWhatYouReceive] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-black">
        <Navbar />

        {/* Hero Section */}
        <motion.div
          className="relative min-h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/vault/bg/4.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

          <div className="relative z-10 min-h-[60vh] flex items-center justify-center px-4 py-32">
            <div className="w-full mx-auto text-center -pb-20 lg:-pb-0">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  OM'RAK Collection
                </h1>
                <div className="space-y-4 max-w-3xl mx-auto">
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
                    11 portals into your inner underworld — each one a companion for the parts
                    of you that are loud, quiet, strange, grieving, erotic, and gloriously alive.
                  </p>
                  <p className="text-base lg:text-lg text-white/70">
                    11 original artworks • 11×14 inches • Colored pencils & ink on paper.
                  </p>
                </div>
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2.5 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors"
                      onClick={() => setShowWhatYouReceive(!showWhatYouReceive)}
                    >
                      What you receive when you collect OM&apos;RAK
                    </button>
                  </div>

                  <AnimatePresence>
                    {showWhatYouReceive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-6 md:grid-cols-[2fr,3fr] text-left bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 overflow-hidden"
                      >
                        <div className="space-y-3">
                          <h2 className="text-white text-xl font-semibold">
                            What you receive when you collect OM&apos;RAK
                          </h2>
                          <ul className="text-sm lg:text-base text-white/75 space-y-2">
                            <li>
                              <span className="font-semibold text-white">Original or fine art print:</span>{' '}
                              choose between the hand-drawn 11×14&quot; piece or a high-quality archival print.
                            </li>
                            <li>
                              <span className="font-semibold text-white">A daily altar ally:</span> each artwork
                              is designed to sit in your sacred space as a mirror for a specific
                              emotional or spiritual process.
                            </li>
                            <li>
                              <span className="font-semibold text-white">Energetic invitation:</span> every piece
                              carries a written transmission that you can read, speak aloud, or
                              meditate with as part of your own ritual.
                            </li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-white text-xl font-semibold">
                            Originals &amp; prints — how to buy
                          </h3>
                          <p className="text-sm lg:text-base text-white/75">
                            Click any artwork below to open its full image and story. From there you can
                            send a direct request to purchase the original piece or a print of that
                            specific artwork. Originals are one-of-one. Prints are limited and made
                            to order.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Section */}
        <div className="relative bg-black py-20 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  The 11 OM&apos;RAK beings
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-2xl">
                  Browse the full constellation of OM&apos;RAK. Each artwork opens its own
                  emotional universe — click to read the full transmission and explore original
                  and print options.
                </p>
              </div>
              <div className="text-sm text-white/60">
                11 pieces · 11×14 inches · Colored pencils & ink on paper
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {omrakArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href={`/omrak-collection/${artwork.slug}`}
                    className="group relative block overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute hidden lg:block bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-lg font-semibold mb-1">
                          {artwork.title}
                        </h3>
                        <p className="text-white/80 text-xs line-clamp-2">
                          {artwork.description}
                        </p>
                      </div>
                    </div>

                    {/* Title overlay - visible on mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent sm:hidden">
                      <h3 className="text-white text-base font-semibold mb-1">
                        {artwork.title}
                      </h3>
                      <p className="text-white/80 text-xs line-clamp-2">
                        {artwork.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default OmrakCollection;
