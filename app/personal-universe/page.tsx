'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, User, Key, Eye, Zap, Star, Shield, Users } from 'lucide-react'
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
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function PersonalUniverse() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const [ceremonySignups, setCeremonySignups] = useState<any[]>([])
  const router = useRouter()
  const { user, userData } = useAuth()
  const { t } = useTranslation()

  // Simulate hero loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Fetch ceremony signups
  useEffect(() => {
    const fetchCeremonySignups = async () => {
      if (!user) return

      try {
        const signupsRef = collection(db, 'ceremony_signups')
        let q

        // Query by userId if available, otherwise by email or wallet
        if (user.uid) {
          q = query(signupsRef, where('userId', '==', user.uid))
        } else if (user.email) {
          q = query(signupsRef, where('email', '==', user.email.toLowerCase()))
        } else {
          return
        }

        const querySnapshot = await getDocs(q)
        const signups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setCeremonySignups(signups)
      } catch (error) {
        console.error('Error fetching ceremony signups:', error)
      }
    }

    fetchCeremonySignups()
  }, [user])

  // Mock user data - in real app this would come from the database
  const userUniverse = {
    soulLevel: 'Awakening',
    unlockedPortals: 12,
    totalPortals: 25,
    communityRank: 'Soul Seeker',
    nextRitual: 'Full Moon Ceremony',
    ownedArtworks: [
      {
        id: 1,
        title: "Unchained Wildness",
        type: "NFT",
        image: "/vault/Art Altars/Altar 2.jpg",
        unlocked: true,
        arExperience: false,
        link: "https://exchange.art/single/6pyq5aVdUVumEazQ7uCKycUcESta5czcJiTsjuMyL74c"
      },
      {
        id: 2,
        title: "The Awakening",
        type: "Soul Altar",
        image: "/vault/Art Altars/Altar 1.jpg",
        unlocked: true,
        arExperience: true,
        isAltar: true,
        link: "https://exchange.art/single/6pyq5aVdUVumEazQ7uCKycUcESta5czcJiTsjuMyL74c"
      },
      {
        id: 3,
        title: "My Freak Family",
        type: "Phygital Art",
        image: "/vault/Characters for AR_Art Collection/My Freak Family.jpg",
        unlocked: true,
        arExperience: true,
        link: "https://exchange.art/single/6pyq5aVdUVumEazQ7uCKycUcESta5czcJiTsjuMyL74c"
      }
    ],
    recentActivity: [
      {
        type: "ritual",
        title: "Free ritual/meditation/etc",
        time: "2 hours ago",
        status: "completed"
      },
      {
        type: "purchase",
        title: "The Awakening Soul Altar",
        time: "1 day ago",
        status: "completed"
      },
      {
        type: "community",
        title: "Joined alien ceremony",
        time: "3 days ago",
        status: "upcoming"
      }
    ]
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        
        {/* Hero Section with Background Image */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/5.jpg)' }}
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
                      <span className="text-white/90">YOUR</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        UNIVERSE
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
                    Welcome to your personal sanctuary, {(userData as any)?.name || (userData as any)?.displayName || user?.email?.split('@')[0] || 'Soul'}. 
                    Here you can explore your unlocked portals, track your journey, and connect with your essence.
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
                      Explore Store
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/30 bg-transparent text-white px-6 lg:px-12 py-6 rounded-full lg:text-base text-sm"
                      onClick={() => router.push('/community-rituals')}
                    >
                      Join Rituals
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Soul Level & Progress Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/6.png)' }}
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
                  Your Soul Journey
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Track your progress through the EXSA universe and unlock new levels of consciousness
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Soul Level Card */}
                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src="/vault/My Universe - Profile/soul level_symbol icon.png"
                        alt="Soul Level"
                        width={200}
                        height={200}
                        className="opacity-90 object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Soul Level</h3>
                    <div className="text-4xl font-bold text-purple-400">{userUniverse.soulLevel}</div>
                    <p className="text-white/80">Your current consciousness level</p>
                  </div>
                </motion.div>

                {/* Portals Unlocked Card */}
                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src="/vault/My Universe - Profile/portals unlocked_symbol icon.png"
                        alt="Portals Unlocked"
                        width={200}
                        height={200}
                        className="opacity-90 object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Portals Unlocked</h3>
                    <div className="text-4xl font-bold text-blue-400">
                      {userUniverse.unlockedPortals}/{userUniverse.totalPortals}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(userUniverse.unlockedPortals / userUniverse.totalPortals) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-white/80">Continue your journey</p>
                  </div>
                </motion.div>

                {/* Community Rank Card */}
                <motion.div
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <div className="text-center space-y-4">
                    <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        src="/vault/sp.gif"
                        alt="Community Rank"
                        width={200}
                        height={200}
                        className="opacity-90 object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Community Rank</h3>
                    <div className="text-2xl font-bold text-green-400">{userUniverse.communityRank}</div>
                    <p className="text-white/80">Your status in the EXSA community</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Owned Artworks Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/7.jpg)' }}
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
                  Your Soul Collection
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  The portals and artifacts you've unlocked in your journey
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {userUniverse.ownedArtworks.map((artwork, index) => (
                  <motion.div
                    key={artwork.id}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  >
                    <div className="relative h-96 mb-4 rounded-2xl overflow-hidden">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                        style={{ objectPosition: 'center' }}
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 text-white text-xs rounded-full ${
                          artwork.unlocked ? 'bg-green-500/80' : 'bg-orange-500/80'
                        }`}>
                          {artwork.unlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      {artwork.arExperience && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-2 py-1 bg-purple-500/80 text-white text-xs rounded-full flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            AR Ready
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-white">{artwork.title}</h3>
                      <p className="text-white/80 text-sm">{artwork.type}</p>
                      <div className="flex items-center justify-between">
                        {artwork.isAltar ? (
                          <Button 
                            size="sm"
                            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => router.push('/soul-activation-order')}
                          >
                            Activate
                          </Button>
                        ) : artwork.link ? (
                          <Button 
                            size="sm"
                            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => window.open(artwork.link, '_blank')}
                          >
                            View NFT
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => router.push('/store-of-essence')}
                          >
                            Purchase
                          </Button>
                        )}
                        {artwork.arExperience && artwork.unlocked && !artwork.isAltar && (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="border-white/30 bg-transparent text-white rounded-full"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            AR View
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Ceremonies Section */}
        {ceremonySignups.length > 0 && (
          <motion.div 
            className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: 'url(/vault/bg/7.jpg)' }}
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
                    My Ceremonies
                  </h2>
                  <p className="text-lg text-white/80 max-w-2xl mx-auto">
                    Your signed up ceremonies and ritual details
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {ceremonySignups.map((signup, index) => (
                    <motion.div
                      key={signup.id}
                      className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">{signup.ceremonyTitle}</h3>
                          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                            Signed Up
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-white/80 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>Date: {signup.createdAt ? new Date(signup.createdAt.seconds * 1000).toLocaleDateString() : 'To be announced'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/80 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>Time: To be announced</span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/80 text-sm">
                            <Users className="w-4 h-4" />
                            <span>Details will be sent to your {signup.email ? 'email' : 'wallet'}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full py-2"
                          onClick={() => router.push('/community-rituals')}
                        >
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/8.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-4xl mx-auto">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
                  Your Recent Journey
                </h2>
                
                <div className="space-y-6">
                  {userUniverse.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-white/10 rounded-2xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        activity.type === 'ritual' ? 'bg-purple-500/80' :
                        activity.type === 'purchase' ? 'bg-blue-500/80' :
                        'bg-green-500/80'
                      }`}>
                        {activity.type === 'ritual' ? <Zap className="w-6 h-6 text-white" /> :
                         activity.type === 'purchase' ? <Heart className="w-6 h-6 text-white" /> :
                         <Globe className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
                        <p className="text-white/80 text-sm">{activity.time}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs ${
                        activity.status === 'completed' ? 'bg-green-500/80 text-white' :
                        activity.status === 'upcoming' ? 'bg-yellow-500/80 text-white' :
                        'bg-blue-500/80 text-white'
                      }`}>
                        {activity.status}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3"
                    onClick={() => router.push('/community-rituals')}
                  >
                    View All Activities
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

export default PersonalUniverse
