'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, Users, Moon, Sun, Star, Zap, BookOpen, ExternalLink, User, Shield, Palette } from 'lucide-react'
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

function AboutEXSA() {
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

  // Alina's story sections
  const storySections = [
    {
      title: "The Alien Arrival",
      description: "Alina came to Earth as an alien trapped in a human body, arriving in New York as a teenager with no language, no connections and no place to belong.",
      image: "/vault/Alina with artworks and portraits/a1.jpg",
      highlight: "No language, no connections, no place to belong"
    },
    {
      title: "The Journey Through Loneliness",
      description: "She grew up through loneliness, bullying, and the constant weight of being 'too strange' for every system she was placed into.",
      image: "/vault/Alina with artworks and portraits/Alina 2.jpg",
      highlight: "Too strange for every system"
    },
    {
      title: "Creating Her Own Universe",
      description: "Without roots, culture, religion, or tradition to hold on to, she created her own universe-sanctuary — one that lived inside her soul.",
      image: "/vault/Alina with artworks and portraits/Alina 3.jpg",
      highlight: "Her own universe-sanctuary"
    },
    {
      title: "The Rebellion",
      description: "Her entire life has been a rebellion against the cages of Earth: family rules, social norms, human superficiality. Through it all, she chose only one way — to trust and follow her inner world.",
      image: "/vault/Alina with artworks and portraits/Alina 4.jpg",
      highlight: "Rebellion against the cages of Earth"
    },
    {
      title: "The Birth of EXSA",
      description: "EXSA (Exo Sanctra) is the embodiment of that world. It is not just Alina's art — it is her way of surviving and transforming alienation into belonging. Here, your world and soul will become free too.",
      image: "/vault/Alina with artworks and portraits/Alina 5.jpg",
      highlight: "Transforming alienation into belonging"
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
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
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
                      <span className="text-white/90">ABOUT</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        EXSA
                      </span>
                    </h1>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/80 tracking-widest">
                      Exo Sanctra
                    </h2>
                  </motion.div>

                  <motion.p 
                    className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    A living interdimensional sanctuary where art, technology, and soul-expression merge 
                    into a unified phygital universe. Each physical artwork becomes a portal into a micro-world.
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
                      Start Your Journey
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                      onClick={() => router.push('/store-of-essence')}
                    >
                      Explore Store
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Mission Section */}
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
                  Our Mission
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Creating a sanctuary for souls who feel alien to society
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="w-40 h-40 mx-auto  rounded-full flex items-center justify-center text-white mb-6 overflow-hidden">
                    <Image
                      src="/vault/About EXSA Page/for alien souls_symbol icon.png"
                      alt="Symbol"
                      width={200}
                      height={200}
                      className="opacity-90 object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">For Alien Souls</h3>
                  <p className="text-white/80">
                    For souls who feel alien to society — without belonging to anything that exists. 
                    For those lost between times, rejected, "too strange" or "too bright."
                  </p>
                </motion.div>

                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white mb-6">
                    <Image
                      src="/vault/About EXSA Page/a safe place_symbol icon.png"
                      alt="Crystal"
                      width={200}
                      height={200}
                      className="opacity-90 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">A Safe Space</h3>
                  <p className="text-white/80">
                    A safe yet radical space, free of Earth's rules and human limitations — 
                    a sanctuary of endless self-discovery and collective awakening.
                  </p>
                </motion.div>

                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden text-center"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white mb-6">
                    <Image
                      src="/vault/About EXSA Page/power through authenticity_ symbol icon.png"
                      alt="Star"
                      width={200}
                      height={200}
                      className="opacity-90"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Power Through Authenticity</h3>
                  <p className="text-white/80">
                    Within EXSA, you find a space where your alien self and authenticity 
                    becomes your power. Scars and imperfections are sacred.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alina's Story Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/3.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                  Alina's Story
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  The journey from alien to creator of sanctuary
                </p>
              </motion.div>

              <div className="space-y-16">
                {storySections.map((section, index) => (
                  <motion.div
                    key={index}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                      <div className={`relative h-96 lg:h-[600px] rounded-2xl overflow-hidden ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                        <Image
                          src={section.image}
                          alt={section.title}
                          fill
                          className="object-cover object-center"
                          style={{ objectPosition: 'center' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      
                      <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                        <h3 className="text-3xl font-bold text-white">{section.title}</h3>
                        <p className="text-white/80 text-lg leading-relaxed">{section.description}</p>
                        <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-2xl">
                          <p className="text-purple-300 font-semibold italic">"{section.highlight}"</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* What EXSA Offers Section */}
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
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                  What EXSA Offers
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  A complete ecosystem for soul activation and community connection
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    title: "Soul Activation Art Altars",
                    description: "Original artworks with microchips that unlock your digital profile",
                    icon: <Palette className="w-8 h-8" />,
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Community Rituals",
                    description: "Sacred ceremonies that activate your essence and connect you with others",
                    icon: <Users className="w-8 h-8" />,
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Digital Universe",
                    description: "Your personal sanctuary where you can explore your unlocked portals",
                    icon: <Globe className="w-8 h-8" />,
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Soul Family",
                    description: "Connect with other fantastic souls who understand your journey",
                    icon: <Heart className="w-8 h-8" />,
                    color: "from-orange-500 to-red-500"
                  }
                ].map((offering, index) => (
                  <motion.div
                    key={offering.title}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden text-center group hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className={`w-40 h-40 mx-auto flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                      {offering.title === "Soul Activation Art Altars" && (
                        <Image src="/vault/Art Altars/Altar 1.jpg" alt="Soul Activation Art Altar" width={200} height={200} className="opacity-90  object-cover" />
                      )}
                      {offering.title === "Community Rituals" && (
                        <Image src="/vault/Elements for Web Decoration/Planet.png" alt="Planet" width={200} height={200} className="opacity-90" />
                      )}
                      {offering.title === "Digital Universe" && (
                        <Image src="/vault/Elements for Web Decoration/Earth.png" alt="Earth" width={200} height={200} className="opacity-90" />
                      )}
                      {offering.title === "Soul Family" && (
                        <Image src="/vault/Characters for AR_Art Collection/My Freak Family.jpg" alt="Soul Family" width={200} height={200} className="opacity-90 object-cover" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{offering.title}</h3>
                    <p className="text-white/80 text-sm">{offering.description.replace(/they/g, 'you').replace(/their/g, 'your')}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/5.jpg)' }}
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
                  Ready to Find Your Sanctuary?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Join a community of souls who are exploring their world in EXSA. 
                  Your journey of self-discovery and authentic connection starts here.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="lg:px-12 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                    onClick={() => router.push('/soul-activation')}
                  >
                    Get Your Soul Altar
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                    onClick={() => router.push('/community-rituals')}
                  >
                    Join Community Rituals
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

export default AboutEXSA
