'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, User, Key, Eye, Zap, Star, Shield, Palette, Wand2, Sparkle } from 'lucide-react'
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
import { SoulAltarCheckout } from '@/components/soul-altar-checkout'

function SoulActivation() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
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

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: "Soul Questionnaire",
      description: "Share your essence through our sacred questionnaire",
      icon: <User className="w-8 h-8" />,
      duration: "5-10 minutes"
    },
    {
      step: 2,
      title: "Alien Channeling",
      description: "Alina enters her alien state to scan your soul energy",
      icon: <Wand2 className="w-8 h-8" />,
      duration: "2-3 days"
    },
    {
      step: 3,
      title: "Art Creation",
      description: "Your soul altar is brought to life with high-quality materials",
      icon: <Palette className="w-8 h-8" />,
      duration: "3-5 days"
    },
    {
      step: 4,
      title: "Microchip Activation",
      description: "Your artwork is embedded with a microchip for digital access",
      icon: <Zap className="w-8 h-8" />,
      duration: "1 day"
    },
    {
      step: 5,
      title: "Ritual Performance",
      description: "Alina performs a sacred activation ritual captured on video",
      icon: <Sparkle className="w-8 h-8" />,
      duration: "30 minutes"
    },
    {
      step: 6,
      title: "Delivery & Unlock",
      description: "Your soul altar arrives with full digital access unlocked",
      icon: <Key className="w-8 h-8" />,
      duration: "2-3 days"
    }
  ]

  // What you receive
  const whatYouReceive = [
    {
      title: "Original Framed Artwork",
      description: "A unique soul portrait created with colored pencils and markers",
      image: "/vault/Art Altars/Altar 1.jpg",
      features: ["High-quality materials", "Professional framing", "Unique to your essence"]
    },
    {
      title: "Microchip Integration",
      description: "Embedded technology that unlocks your digital EXSA profile",
      image: "/vault/Art Altars/Altar 2.jpg",
      features: ["AR Experience", "Digital Profile", "Community Access", "Ritual Integration"]
    },
    {
      title: "Performance Art Video",
      description: "A sacred ritual where Alina activates your artwork through movement",
      image: "/vault/Art Altars/Altar 3.jpg",
      features: ["Personal Ritual", "Energy Activation", "Sacred Movement", "Digital Keepsake"]
    },
    {
      title: "Written Transmission",
      description: "Alina's intuitive reflections and guidance for your journey",
      image: "/vault/Art Altars/Artist with Art Altar.jpg",
      features: ["Personal Guidance", "Soul Insights", "Self-Exploration Tips", "Sacred Phrases"]
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        
        {/* Hero Section with Background Image */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/6.png)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Glassmorphism Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="text-center space-y-6 sm:space-y-8">
                  <motion.div 
                    className="space-y-3 sm:space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      <span className="text-white/90">SOUL ACTIVATION</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        ART ALTAR
                      </span>
                    </h1>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white/80 tracking-widest">
                      EXSA
                    </h2>
                  </motion.div>

                  <motion.p 
                    className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto px-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    A sacred mirror of your true essence created through Alina's alien channeling. 
                    Each artwork becomes a portal into your micro-world of self-discovery.
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Button 
                      className="w-full sm:w-auto lg:px-12 py-4 sm:py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black text-sm sm:text-base lg:text-base shadow-md"
                      onClick={() => {window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpbG7Nuc22-iPjlaVQsoV0yEn67je7kXlsifL0lI4Nj6iL9Q/viewform', '_blank')}}
                    >
                      Begin Your Journey
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full sm:w-auto border-white/30 bg-transparent text-white px-6 lg:px-12 py-4 sm:py-6 rounded-full text-sm sm:text-base lg:text-base"
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

        {/* What You Receive Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/7.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  What You Receive
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-2">
                  A complete soul activation package designed to guide, protect, and remind you of who you truly are
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {whatYouReceive.map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="relative h-40 sm:h-48 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                      <p className="text-sm sm:text-base text-white/80">{item.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wide">Includes</h4>
                        <div className="space-y-1">
                          {item.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <Sparkle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                              <span className="text-white/80 text-xs sm:text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Process Steps Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/8.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  The Creation Process
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-2">
                  Your soul altar is created through a sacred 6-step process that ensures 
                  every piece is perfectly attuned to your essence
                </p>
              </motion.div>

              <div className="space-y-6 sm:space-y-8">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="flex-shrink-0 flex items-center space-x-4 w-full sm:w-auto">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                          {step.icon}
                        </div>
                        <div className="text-2xl sm:text-4xl font-bold text-purple-400">0{step.step}</div>
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-2">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{step.title}</h3>
                          <span className="px-2 sm:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm w-fit">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm sm:text-base lg:text-lg">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Who Is It For Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/1.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div 
                className="text-center mb-12 sm:mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Who Is This For?
                </h2>
                <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-2">
                  This experience is designed for souls ready to embrace their authentic essence
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {[
                  {
                    title: "Fantastic Souls",
                    description: "Those in transformation seeking their true essence",
                    icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />
                  },
                  {
                    title: "Emotional Beings",
                    description: "Souls with locked emotions seeking expression and power",
                    icon: <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
                  },
                  {
                    title: "Truth Seekers",
                    description: "Those craving to feel alive and in touch with their essence",
                    icon: <Eye className="w-6 h-6 sm:w-8 sm:h-8" />
                  },
                  {
                    title: "Visual Anchors",
                    description: "Beings longing for a bright visual reminder of their truth",
                    icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                  }
                ].map((profile, index) => (
                  <motion.div
                    key={profile.title}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-3 sm:mb-4">
                      {profile.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{profile.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm">{profile.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/2.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16 sm:py-20 lg:py-28">
            <div className="w-full max-w-4xl mx-auto text-center">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Activate Your Soul?
                </h2>
                <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Begin your journey of self-discovery with a sacred altar that serves as your 
                  daily tool for empowerment and protection against the noise of humanity.
                </p>

                <div className="max-w-xl mx-auto mb-6 sm:mb-8">
                  <p className="text-xs uppercase tracking-widest text-white/50 mb-3 text-center">
                    Purchase your Soul Activation Art Altar
                  </p>
                  <SoulAltarCheckout />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button 
                    className="w-full sm:w-auto lg:px-12 py-4 sm:py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black text-sm sm:text-base lg:text-base shadow-md"
                    onClick={() => {window.open('https://docs.google.com/forms/d/e/1FAIpQLSfpbG7Nuc22-iPjlaVQsoV0yEn67je7kXlsifL0lI4Nj6iL9Q/viewform', '_blank')}}
                  >
                    Start Your Soul Questionnaire
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 bg-transparent text-white px-6 lg:px-12 py-4 sm:py-6 rounded-full text-sm sm:text-base lg:text-base"
                    onClick={() => router.push('/community-rituals')}
                  >
                    Learn About Rituals
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

export default SoulActivation
