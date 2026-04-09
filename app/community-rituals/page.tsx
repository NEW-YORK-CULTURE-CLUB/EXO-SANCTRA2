'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, Users, Moon, Sun, Star, Zap, X, Mail, Wallet } from 'lucide-react'
import { FaArrowDownLong } from "react-icons/fa6"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.jsx'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation' 
import { useAuth } from '@/contexts/auth-context'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { AnimatedSection, StaggeredContainer, StaggeredItem } from '@/components/ui/animated-section'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { useTranslation } from '@/lib/i18n'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { collection, addDoc, query, where, getDocs, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

function CommunityRituals() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const [selectedRitual, setSelectedRitual] = useState<any>(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()

  // Simulate hero loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle wallet connection for ceremony signup
  useEffect(() => {
    if (isConnected && address && selectedRitual && isConnectingWallet) {
      handleJoinCeremony('wallet', address)
    }
  }, [isConnected, address, selectedRitual, isConnectingWallet])

  // Open join modal when ritual is selected
  useEffect(() => {
    if (selectedRitual) {
      setShowJoinModal(true)
    }
  }, [selectedRitual])

  const handleJoinCeremony = async (method: 'email' | 'wallet', identifier: string) => {
    if (!selectedRitual) return

    setIsSubmitting(true)
    try {
      // Check if user is already signed up
      const signupsRef = collection(db, 'ceremony_signups')
      let existingSignup = null

      if (method === 'email') {
        const emailQuery = query(
          signupsRef,
          where('ceremonyId', '==', selectedRitual.id),
          where('email', '==', identifier.toLowerCase())
        )
        const emailSnapshot = await getDocs(emailQuery)
        if (!emailSnapshot.empty) {
          existingSignup = emailSnapshot.docs[0]
        }
      } else {
        const walletQuery = query(
          signupsRef,
          where('ceremonyId', '==', selectedRitual.id),
          where('walletAddress', '==', identifier.toLowerCase())
        )
        const walletSnapshot = await getDocs(walletQuery)
        if (!walletSnapshot.empty) {
          existingSignup = walletSnapshot.docs[0]
        }
      }

      if (existingSignup) {
        toast.info('You are already signed up for this ceremony!')
        setShowJoinModal(false)
        setSelectedRitual(null)
        setIsSubmitting(false)
        return
      }

      // Create signup document
      const signupData = {
        ceremonyId: selectedRitual.id,
        ceremonyTitle: selectedRitual.title,
        email: method === 'email' ? identifier.toLowerCase() : null,
        walletAddress: method === 'wallet' ? identifier.toLowerCase() : null,
        userId: user?.uid || null,
        signupMethod: method,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(signupsRef, signupData)

      // If user is logged in, also update their user document
      if (user?.uid) {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {
          ceremonySignups: arrayUnion({
            ceremonyId: selectedRitual.id,
            ceremonyTitle: selectedRitual.title,
            signupDate: new Date(),
            status: 'signed_up'
          })
        })
      }

      toast.success('Successfully signed up for the ceremony! Check your My Universe profile for details.')
      setShowJoinModal(false)
      setSelectedRitual(null)
      setEmail('')
      setIsConnectingWallet(false)
    } catch (error) {
      console.error('Error joining ceremony:', error)
      toast.error('Failed to sign up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async () => {
    if (!email || !selectedRitual) return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    await handleJoinCeremony('email', email)
  }

  const handleWalletConnect = async () => {
    if (!selectedRitual) return

    if (isConnected && address) {
      setIsConnectingWallet(false)
      await handleJoinCeremony('wallet', address)
    } else if (openConnectModal) {
      setIsConnectingWallet(true)
      openConnectModal()
    } else {
      toast.error('Wallet connection is not available.')
    }
  }

  // Mock ritual data
  const upcomingRituals = [
    {
      id: 1,
      title: "Alien Soul Activation",
      description: "A powerful private ceremony to align with your true energy and activate your creative flow",
      date: "Sign up to get on the list",
      time: "",
      type: "Live Ceremony in New York City",
      participants: 15,
      maxParticipants: 15,
      image: "/vault/Alien Ceremonies - Events_Footage/Photo 1_Alien Ceremony.png",
      requirements: "Soul Altar, OM'RAK art",
      energy: "High energy"
    },
    {
      id: 2,
      title: "Feel your world",
      description: "Disconnect from Earth to connect with your real emotions and inner truth in a sacred EXSA universe.",
      date: "Sign up to get on the list",
      time: "",
      type: "Digital Ritual",
      participants: 22,
      maxParticipants: 22,
      image: "/vault/Alien Ceremonies - Events_Footage/Photo 2_Alien Ceremony.png",
      requirements: "Any EXSA portal",
      energy: "Medium Energy"
    },
    {
      id: 3,
      title: "ALIEN ART SHOW",
      description: "Connect with your real voice and soul family in an intimate ceremony of recognition. Dive into the inner reality of Earth through interactive art experience. Here, everything comes to life.",
      date: "to be revealed soon",
      time: "",
      type: "Interactive Art Experience",
      participants: 77,
      maxParticipants: 77,
      image: "/vault/Alien Ceremonies - Events_Footage/Photo 3_Alien Ceremony.png",
      requirements: "sign up to EXSA (leaving email/wallet)",
      energy: "Intense energy"
    }
  ]

  const ritualTypes = [
    {
      name: "Live Ceremonies",
      description: "Real-time rituals with Alina and the community",
      iconImage: "/vault/Community Rituals/exclusive events_symbol icon.png",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Digital Rituals",
      description: "Guided experiences you can join from anywhere",
      iconImage: "/vault/Community Rituals/self guided_symbol icon.png",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Exclusive Events",
      description: "Intimate gatherings for advanced soul levels",
      iconImage: "/vault/Community Rituals/exclusive events_symbol icon.png",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Self-Guided",
      description: "Personal rituals you can perform independently",
      iconImage: "/vault/Community Rituals/self guided_symbol icon.png",
      color: "from-orange-500 to-red-500"
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
                      <span className="text-white/90">COMMUNITY</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        RITUALS
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
                    Join our community of souls in sacred ceremonies that activate your essence 
                    and connect you with your cosmic family.
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <Button 
                      className="lg:px-12 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                      onClick={() => router.push('/store-of-essence')}
                    >
                      Get Your Portal
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                      onClick={() => router.push('/personal-universe')}
                    >
                      View Your Journey
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Ritual Types Section */}
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
                  Types of Ceremonies
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Choose the ritual experience that resonates with your soul's current needs
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {ritualTypes.map((type, index) => (
                  <motion.div
                    key={type.name}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                      <div className="text-center space-y-4">
                      <div className={`w-40 h-40 mx-auto rounded-full flex items-center justify-center text-white overflow-hidden`}>
                        {type.iconImage && (
                          <Image 
                            src={type.iconImage} 
                            alt={type.name} 
                            width={200} 
                            height={200} 
                            className="object-contain p-2" 
                          />
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white">{type.name}</h3>
                      <p className="text-white/80 text-sm">{type.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Rituals Section */}
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
                  Upcoming Ceremonies
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Join our community in these powerful rituals of transformation
                </p>
              </motion.div>

              <div className="space-y-8">
                {upcomingRituals.map((ritual, index) => (
                  <motion.div
                    key={ritual.id}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="relative h-64 rounded-2xl overflow-hidden">
                        <Image
                          src={ritual.image}
                          alt={ritual.title}
                          fill
                          className="object-cover object-top"
                          style={{ objectPosition: 'top' }}
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 text-white text-xs rounded-full ${
                            ritual.energy === 'High energy' ? 'bg-red-500/80' :
                            ritual.energy === 'Medium Energy' ? 'bg-yellow-500/80' :
                            'bg-purple-500/80'
                          }`}>
                            {ritual.energy}
                          </span>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{ritual.title}</h3>
                          <p className="text-white/80">{ritual.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-white/60 text-sm">Date and Time</p>
                              <p className="text-white font-semibold">{ritual.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Users className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-white/60 text-sm">Participants</p>
                              <p className="text-white font-semibold">{ritual.participants}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 col-span-2">
                            <Zap className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-white/60 text-sm">Requirements</p>
                              <p className="text-white font-semibold text-sm">{ritual.requirements}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:items-center items-start justify-between">
                          <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                            {ritual.type}
                          </span>
                          <span className="px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm">
                            {ritual.energy}
                          </span>
                          <Button 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 py-2"
                            onClick={() => setSelectedRitual(ritual)}
                          >
                            Join Ceremony
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Community Gallery Section */}
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
                  Community Moments
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Witness the power of collective transformation in our community
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "/vault/Alien Ceremonies - Events_Footage/Photo 4_Alien Ceremony.png",
                  "/vault/Alien Ceremonies - Events_Footage/Photo 5_Alien Ceremony.png",
                  "/vault/Alien Ceremonies - Events_Footage/Photo 6_Alien Ceremony.png",
                  "/vault/Alien Ceremonies - Events_Footage/Photo 7_Alien Ceremony.png",
                  "/vault/Alien Ceremonies - Events_Footage/Photo 8_Alien Ceremony.png",
                  "/vault/Alien Ceremonies - Events_Footage/Photo 9_Alien Ceremony.png"
                ].map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative h-64 rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  >
                    <Image
                      src={image}
                      alt={`Community ceremony ${index + 1}`}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      style={{ objectPosition: 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-semibold">Sacred Ceremony</p>
                        <p className="text-white/80 text-xs">Community Transformation</p>
                      </div>
                    </div>
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
                  Ready to Join the Ceremony?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Your soul family is waiting. Step into the sacred space where transformation begins 
                  and authentic connection flourishes.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="lg:px-12 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                    onClick={() => router.push('/store-of-essence')}
                  >
                    Get Your Portal First
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                    onClick={() => router.push('/personal-universe')}
                  >
                    View Your Journey
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Join Ceremony Modal */}
      <AnimatePresence>
        {showJoinModal && selectedRitual && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowJoinModal(false)
                setSelectedRitual(null)
              }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white/10 backdrop-blur-2xl rounded-2xl p-6 lg:p-8 max-w-lg w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowJoinModal(false)
                  setSelectedRitual(null)
                }}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mt-4">
                  Join {selectedRitual.title}
                </h2>
                <p className="text-white/80 text-lg">
                  {selectedRitual.description}
                </p>

                <div className="space-y-4 pt-4">
                  <p className="text-white/70 text-sm">
                    {user ? 'You are signed in. Your ceremony will appear in your My Universe profile.' : 'Enter your email or connect your wallet to join this ceremony'}
                  </p>
                  
                  {!user && (
                    <>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                          />
                        </div>
                        <Button
                          onClick={handleEmailSubmit}
                          disabled={!email || isSubmitting}
                          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white rounded-full px-6 py-3 disabled:opacity-50 transition-all duration-200"
                        >
                          {isSubmitting ? 'Signing up...' : 'Sign Up'}
                        </Button>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-transparent text-white/70">or</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        onClick={handleWalletConnect}
                        disabled={isConnectingWallet || isSubmitting}
                        className="w-full border-white/30 bg-white/10 backdrop-blur-sm text-white rounded-full py-3 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        {isConnectingWallet || isSubmitting ? 'Connecting...' : isConnected ? 'Sign Up with Wallet' : 'Connect Crypto Wallet'}
                      </Button>
                    </>
                  )}

                  {user && (
                    <Button
                      onClick={async () => {
                        if (isConnected && address) {
                          await handleJoinCeremony('wallet', address)
                        } else if (user.email) {
                          await handleJoinCeremony('email', user.email)
                        } else {
                          toast.error('Please connect a wallet or add an email to your account')
                        }
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-3 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Signing up...' : 'Confirm Sign Up'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </>
  )
}

export default CommunityRituals
