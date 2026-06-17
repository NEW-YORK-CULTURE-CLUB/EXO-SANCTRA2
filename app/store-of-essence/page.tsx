'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, ShoppingBag, Eye, Zap } from 'lucide-react'
import { FaArrowDownLong } from "react-icons/fa6"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.jsx'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation' 
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { AnimatedSection, StaggeredContainer, StaggeredItem } from '@/components/ui/animated-section'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { useTranslation } from '@/lib/i18n'

function StoreOfEssence() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()

  // Simulate hero loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Product categories data
  const productCategories = [
    {
      id: 'soul-altars',
      title: 'Soul Activation Art Altar',
      description: 'Original framed artworks with microchips that unlock your digital profile and AR experience',
      image: '/vault/Art Altars/Altar 1.jpg',
      price: 'From $399',
      features: ['Microchip Activation', 'AR Experience', 'Personal Guidance Video', 'Sacred Phrase']
    },
    {
      id: 'nft-collections',
      title: 'Inner Reality Truth',
      description: 'NFTs representing your inner essence, created through Alina\'s alien channeling',
      image: '/vault/Art Altars/Altar 2.jpg',
      price: 'From 3.2 SOL',
      features: ['Blockchain Verified', 'Unique Metadata', 'Community Access', 'Ritual Integration']
    },
    {
      id: 'physical-products',
      title: 'Chipped Clothing & Objects',
      description: 'Physical items embedded with microchips that connect to your EXSA universe',
      image: '/vault/Essence Hall/essence hall - chipped clothing.png',
      price: 'From $89',
      features: ['Microchip Embedded', 'AR Unlock', 'Community Portal', 'Soul Expression']
    },
    {
      id: 'ritual-tools',
      title: 'Ceremony Accessories',
      description: 'Tools and objects for personal and community rituals within the EXSA universe',
      image: '/vault/Art Altars/Artist with Art Altar.jpg',
      price: 'From $45',
      features: ['Ritual Ready', 'Energy Charged', 'Community Bond', 'Soul Activation']
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        
        {/* Hero Section with Background Image */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/1.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Black overlay */}
          <div className="ambient-bg-overlay"></div>
          {/* Ambient light animation */}
          <div className="ambient-light-overlay"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="text-center space-y-8">
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                      <span className="text-white/90">ESSENCE</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        HALL
                      </span>
                    </h1>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/80 tracking-widest">
                      EXSA
                    </h2>
                  </motion.div>

                  <motion.p 
                    className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    Where physical and digital merge into portals of self-discovery. 
                    Each piece unlocks a micro-world of your authentic essence.
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Button 
                      className="lg:px-12 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                      onClick={() => router.push('/soul-activation')}
                    >
                      Create Your Soul Altar
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                      onClick={() => router.push('/community-rituals')}
                    >
                      Join Community Rituals
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Product Categories Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/2.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                  Choose Your Portal
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Each product is a gateway to deeper self-discovery and community connection
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="relative h-96 mb-6 rounded-2xl overflow-hidden bg-black/20">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                      <p className="text-white/80">{category.description}</p>
                      <div className="text-2xl font-bold text-purple-400">{category.price}</div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wide">Features</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {category.id === 'soul-altars' || category.id === 'physical-products' ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-3"
                          onClick={() => {
                            // Open email client or contact form
                            window.location.href = 'mailto:hello@exosanctra.com?subject=Inquiry about ' + encodeURIComponent(category.title)
                          }}
                        >
                          Inquire
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-3"
                          onClick={() => {window.open('https://exchange.art/single/6pyq5aVdUVumEazQ7uCKycUcESta5czcJiTsjuMyL74c', '_blank')}}
                        >
                          Explore Collection
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* OM'RAK Collection Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/4.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    OM'RAK Collection
                  </h2>
                  <p className="text-lg text-white/80 max-w-3xl mx-auto mb-6">
                    Clumped dirt between the toes, a torn voice, a burst lightbulb, a decaying body,
                    broken connections, fog, disappearing galaxies. Your footprints are still warm
                    here, even though you're still sitting in this dark room. Someone erased the
                    boundaries between you and what you kept in the dirtiest corners of your
                    consciousness. You were summoned to unravel. You are unacceptable and here,
                    you are loved exactly like that. Your pain is not subject to explanation. Your
                    darkness — not subject to cleansing. You won't be shown the way out.
                  </p>
                  <p className="text-lg text-white/80 max-w-3xl mx-auto mb-6">
                    11 icons see right through you — symbols with which you fall apart and find
                    freedom in honesty and love for the dirty basement of the soul. Wash yourself in
                    your inner mold, don't cleanse the soul, just open it.
                    Enjoy the aesthetic of organic, honest, decaying freedom — the one that smells
                    like truth, not human incense.
                    See and love yourself completely with OM'RAK — a collection of PHYGITAL
                    artworks. Pshhh.
                  </p>
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">Phygital Dimension (AR + NFTs)</h3>
                    <ul className="text-left text-white/80 space-y-2 max-w-2xl mx-auto">
                      <li>• Embedded microchips unlock AR experiences — characters come to life and guide your journey of self-discovery.</li>
                      <li>• NFT certificates ensure authenticity, secure royalties, and open portals into the digital realm.</li>
                      <li>• Together, they form a phygital bridge — where a physical piece becomes an interactive universe, one that continues to live, evolve, and connect with the community.</li>
                      <li>• Art Activations take the form of dance performances — each collector receives a personalized ritual, where the artist activates the artwork and its spirit specifically for them.</li>
                    </ul>
                    <p className="text-white/90 mt-4 max-w-2xl mx-auto">
                      ★ For each artwork there is an option to buy either the original or a print – to make EXSA accessible beyond high-end collectors. Holders of the original artworks will have a full AR experience, access to VIP community, bonuses and full art activation.
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className="cursor-pointer group"
                  onClick={() => router.push('/omrak-collection')}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden border-4 border-purple-500/50 group-hover:border-purple-400 transition-colors">
                    <Image
                      src="/vault/Ch1.png"
                      alt="OM'RAK Collection"
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <h3 className="text-3xl font-bold text-white mb-2">View OM'RAK Collection</h3>
                      <p className="text-white/90 text-lg">11 Original Artworks • 11*14 inches • Colored Pencils, Ink on Paper</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/4.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-4xl mx-auto text-center">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Unlock Your Universe?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of souls who have found their sanctuary in EXSA. 
                  Your journey of self-discovery begins with a single step.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="lg:px-12 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                    onClick={() => router.push('/soul-activation')}
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                    onClick={() => router.push('/about-exsa')}
                  >
                    Learn More About EXSA
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </>
  )
}

export default StoreOfEssence
