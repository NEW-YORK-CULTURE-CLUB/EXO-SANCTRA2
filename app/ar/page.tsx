'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Scan } from 'lucide-react';
import Navbar from '@/components/Navbar.jsx';
import Footer from '@/components/Footer.jsx';

const AR_ARTWORKS = [
  {
    id: 'planet-of-love',
    label: 'Planet of Love',
    image: '/vault/Characters for AR_Art Collection/Planet of Love.jpg',
    description: 'What if every hidden part of you had a place to gather, to hold each other and give love without fear?',
  },
  {
    id: 'the-unburied-ones',
    label: 'The Unburied Ones',
    image: '/vault/Characters for AR_Art Collection/The Unburied Ones.jpg',
    description: "There is something in this world that never disappears. The past doesn't stay buried—it breathes quietly through your bones.",
  },
  {
    id: 'ugly-is-beautiful',
    label: 'Ugly is Beautiful',
    image: '/vault/Characters for AR_Art Collection/Ugly is Beautiful.jpg',
    description: 'Beauty is not given — it is survived. What they called ugly was simply the truest thing about you.',
  },
  {
    id: 'my-freak-family',
    label: 'My Freak Family',
    image: '/vault/Characters for AR_Art Collection/My Freak Family.jpg',
    description: 'Your true family is the ones who can sit with your dark corners and still grow gardens from them.',
  },
  {
    id: 'exorcise-me-whole',
    label: 'Exorcise Me Whole',
    image: '/vault/Characters for AR_Art Collection/Exorcise Me Whole.jpg',
    description: 'Not a piece of you cast out — but all of it invited in. The exorcism that heals instead of hollows.',
  },
  {
    id: 'homebound-galaxy',
    label: 'Homebound Galaxy',
    image: '/vault/Characters for AR_Art Collection/Homebound Galaxy.jpg',
    description: 'Home is not a place you return to. It is a universe you carry — stars made of every version of yourself.',
  },
  {
    id: 'liquid-desire',
    label: 'Liquid Desire',
    image: '/vault/Characters for AR_Art Collection/Liquid Desire.jpg',
    description: 'Desire is a leak you learn to trust. It finds the seams you thought were sewn shut.',
  },
  {
    id: 'cleansing-rite',
    label: 'Cleansing Rite',
    image: '/vault/Characters for AR_Art Collection/Cleansing Rite.jpg',
    description: 'Sometimes things inside you have to die. The ritual is not neat or painless — you scrape, you wash, you choose your clean.',
  },
  {
    id: 'taste-the-power',
    label: 'Taste the Power',
    image: '/vault/Characters for AR_Art Collection/Taste the Power.jpg',
    description: 'Power was never meant to be borrowed. This is what it feels like when it grows from inside you.',
  },
  {
    id: 'necroflora',
    label: 'Necroflora',
    image: '/vault/Characters for AR_Art Collection/Necroflora.jpg',
    description: 'Where others close graves, something else opens — colorful, wet, and free. Decay becomes soil.',
  },
  {
    id: 'let-go',
    label: 'Let Go',
    image: '/vault/Characters for AR_Art Collection/Let Go.jpg',
    description: 'The hardest thing you will ever hold is the thing you are finally ready to release.',
  },
] as const;

export default function ARGalleryPage() {
  return (
    <>
      <div className="min-h-screen bg-black">
        <Navbar />

        {/* Hero */}
        <motion.div
          className="relative min-h-[60vh] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/vault/bg/1.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          <div className="relative z-10 min-h-[60vh] flex items-center justify-center px-4 pt-32 pb-10">
            <div className="w-full mx-auto text-center">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  AR Experience
                </h1>
                <div className="space-y-4 max-w-3xl mx-auto">
                  <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
                    Step inside the OM&apos;RAK universe — explore each being in full 3D, then
                    place them inside your own space through augmented reality.
                  </p>
                  <p className="text-base lg:text-lg text-white/70">
                    11 AR beings · View in 3D · Place in your room
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Gallery */}
        <div className="relative bg-black py-20 px-4">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  The 11 AR beings
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-2xl">
                  Tap any artwork to explore it in 3D — rotate, zoom, and inspect every detail.
                  Then place it in your room through AR.
                </p>
              </div>
              <div className="text-sm text-white/60">
                11 pieces · 3D + AR enabled
              </div>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {AR_ARTWORKS.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href={`/ar/${artwork.id}`}
                    className="group relative block overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.label}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* 3D · AR badge */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 border border-white/20 rounded-full px-2.5 py-1 backdrop-blur-sm">
                        <Scan className="w-3 h-3 text-white/80" />
                        <span className="text-[10px] text-white/80 font-medium">3D · AR</span>
                      </div>

                      {/* Hover overlay — desktop */}
                      <div className="absolute hidden lg:block bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-lg font-semibold mb-1">{artwork.label}</h3>
                        <p className="text-white/80 text-xs line-clamp-2">{artwork.description}</p>
                      </div>
                    </div>

                    {/* Title overlay — mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent sm:hidden">
                      <h3 className="text-white text-base font-semibold mb-1">{artwork.label}</h3>
                      <p className="text-white/80 text-xs line-clamp-2">{artwork.description}</p>
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
