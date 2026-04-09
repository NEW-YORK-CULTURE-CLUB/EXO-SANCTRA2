'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles } from 'lucide-react'
import { FaArrowDownLong } from "react-icons/fa6"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel.jsx'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation' 
import { ArtistService } from '@/lib/artist-service'
import { isArtist } from '@/lib/utils'
import { ArtworkService } from '@/lib/artwork-service'
import { useAuth } from '@/contexts/auth-context'
import DemoFormModal from '@/components/demo-form-modal'
// Import placeholder images
// Remove all image imports
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import ArtFeatureCards from '@/components/ArtFeatureCards.tsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { AnimatedSection, StaggeredContainer, StaggeredItem } from '@/components/ui/animated-section'
import ExhibitIQWelcome from '@/components/exhibitiq-welcome'
import { HeroSkeleton, HeroImageSkeleton } from '@/components/hero-skeleton'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from '@/lib/i18n'
import AlienGiftPopup from '@/components/alien-gift-popup'


function Home() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [artists, setArtists] = useState([])
  const [artistsLoading, setArtistsLoading] = useState(true)
  const [artwork, setArtwork] = useState([])
  const [artworkLoading, setArtworkLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(true)
  const [heroLoading, setHeroLoading] = useState(true)
  const [showDemoPopup, setShowDemoPopup] = useState(false)
  const [showGiftPopup, setShowGiftPopup] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false)
  const [isViewAllLoading, setIsViewAllLoading] = useState(false)
  const [isArtworkLoading, setIsArtworkLoading] = useState(false)
  const [isArtistLoading, setIsArtistLoading] = useState(false)
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false)
  const [activeNewsFilter, setActiveNewsFilter] = useState('All')
  const [activeArtworkFilter, setActiveArtworkFilter] = useState('Artworks')
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()

  // Scroll-based reveal for sections
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.scroll-reveal-section')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const sectionHeight = rect.height
        
        // Calculate how much of the section is visible
        // When section enters from top: progress goes from 0 to 1
        let progress = 0
        if (rect.top < windowHeight && rect.bottom > 0) {
          // Section is in viewport
          // Calculate progress based on how much has scrolled past the top
          const scrolledPast = windowHeight - rect.top
          const totalScrollable = windowHeight + sectionHeight
          progress = Math.min(1, Math.max(0, scrolledPast / totalScrollable))
        } else if (rect.top >= windowHeight) {
          // Section hasn't entered viewport yet
          progress = 0
        } else {
          // Section has completely passed
          progress = 1
        }
        
        // Convert progress to background position (200% to -100%)
        // Start at 200% (bottom, hidden), end at -100% (top, fully revealed)
        const bgPosition = 200 - (progress * 300)
        const overlay = section.querySelector('.ambient-bg-overlay-scroll')
        if (overlay) {
          overlay.style.backgroundPosition = `0 ${bgPosition}%`
          overlay.style.maskPosition = `0 ${bgPosition}%`
          overlay.style.webkitMaskPosition = `0 ${bgPosition}%`
          overlay.style.setProperty('--scroll-progress', `${bgPosition}%`)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll() // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // News filtering functions
  const handleNewsFilterClick = (filter) => {
    setActiveNewsFilter(filter);
  };

  // Artwork filtering functions
  const handleArtworkFilterClick = (filter) => {
    setActiveArtworkFilter(filter);
  };

  const getFilteredArtwork = () => {
    if (activeArtworkFilter === 'Artworks') {
      return artwork.filter(item => item.type === 'artwork' || !item.type);
    } else if (activeArtworkFilter === 'NFTs') {
      return artwork.filter(item => item.type === 'nft');
    } else if (activeArtworkFilter === 'Collectibles') {
      return artwork.filter(item => item.type === 'collectible');
    } else if (activeArtworkFilter === 'Objects') {
      return artwork.filter(item => item.type === 'object');
    }
    return artwork;
  };

  const getFilteredNewsArticles = () => {
    const allArticles = [
      {
        title: "From Puddles to Valleys – What It Takes to Build the Future We Deserve",
        excerpt: "We do not lack the ability to create the future we deserve. That era of limitation ended decades ago. We have the knowledge to decarbonize our energy systems, to design cities that heal instead of deplete, and to build economies that repair as much as they produce.",
        image: "https://static.wixstatic.com/media/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg/v1/fill/w_1390,h_1042,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg",
        category: "Leadership",
        date: "September 5, 2025",
        author: "",
        readTime: "4 min read",
        link: "https://www.brainzmagazine.com/post/from-puddles-to-valleys-what-it-takes-to-build-the-future-we-deserve"
      },
      {
        title: "Who Owns Color? The Future of the Art Market",
        excerpt: "In 2016 Anish Kapoor reached an agreement granting him exclusive rights to use Vantablack, a pigment that absorbs virtually all light. The move sent shockwaves through the art world.",
        image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6CKg04dkIlW-srhd4qCRJQ.png",
        category: "Industry News",
        date: "August 29, 2025",
        author: "",
        readTime: "3 min read",
        link: "https://medium.com/@brian_96176/who-owns-color-the-future-of-the-art-market-399e8c8e3832"
      },
      {
        title: "The Hidden Crisis Behind Gallery Closures",
        excerpt: "Arusha Gallery's legal battle over unpaid fees is not an exception but a symptom of an art world still running on trust without infrastructure.",
        image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?",
        category: "Industry News",
        date: "August 27, 2025",
        author: "",
        readTime: "8 min read",
        link: "https://medium.com/@lily_76419/the-hidden-crisis-behind-gallery-closures-6142edf7f234"
      },
      {
        title: "The Algorithm Ate the Art World",
        excerpt: "In today's galleries, the silent hand of the algorithm is already shaping what we see, how we engage, and what ultimately survives.",
        image: "https://static.wixstatic.com/media/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg/v1/fill/w_1390,h_834,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg",
        category: "Industry News",
        date: "August 15, 2025",
        author: "",
        readTime: "5 min read",
        link: "https://www.brainzmagazine.com/post/the-algorithm-ate-the-art-world-and-how-data-is-rewriting-gallery-culture"
      }
    ];

    if (activeNewsFilter === 'All') {
      return allArticles;
    }
    
    return allArticles.filter(article => article.category === activeNewsFilter);
  };

  // Fetch artists from database
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setArtistsLoading(true)
        const allArtists = await ArtistService.getAllArtistProfiles()
        // Take first 3 artists without repetition
        const displayArtists = allArtists.slice(0, 3)
        setArtists(displayArtists)
      } catch (error) {
        console.error('Error fetching artists:', error)
        // Fallback to empty array if fetch fails
        setArtists([])
      } finally {
        setArtistsLoading(false)
      }
    }

    fetchArtists()
  }, [])

  // Fetch artwork from database
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setArtworkLoading(true)
        const allArtwork = await ArtworkService.getAllArtwork()
        // Take first 6 artwork items without repetition
        const displayArtwork = allArtwork.slice(0, 6)
        setArtwork(displayArtwork)
      } catch (error) {
        console.error('Error fetching artwork:', error)
        // Fallback to empty array if fetch fails
        setArtwork([])
      } finally {
        setArtworkLoading(false)
      }
    }

    fetchArtwork()
  }, [])

  // Simulate hero loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroLoading(false)
    }, 1500) // Show skeleton for 1.5 seconds

    return () => clearTimeout(timer)
  }, [])

  // Show gift popup after 6 seconds
  useEffect(() => {
    if (!showWelcome && !heroLoading) {
      const timer = setTimeout(() => {
        setShowGiftPopup(true)
      }, 15000) // 15 seconds after page loads

      return () => clearTimeout(timer)
    }
  }, [showWelcome, heroLoading])

  // Keep currentSlide in sync with carousel
  React.useEffect(() => {
    if (api) {
      const updateSlide = () => {
        setCurrentSlide(api.selectedScrollSnap())
      }
      
      api.on('select', updateSlide)
      api.on('slideChange', updateSlide)
      
      return () => {
        api.off('select', updateSlide)
        api.off('slideChange', updateSlide)
      }
    }
  }, [api])

  // Function to style titles with alternating colors
  const styleTitleWithColors = (title) => {
    const words = title.split(' ');
    return words.map((word, index) => (
      <span key={index} className={index % 2 === 0 ? 'text-muted-foreground' : 'text-foreground'}>
        {word}{index < words.length - 1 ? ' ' : ''}
      </span>
    ));
  };

  // Carousel slides data
  const slides = [
    {
      type: 'image',
      src: '/vault/jw.png',
      title: `“Jordan Wings”, 2024`,
      subtitle: "MASTERPIECE",
      description: "Explore works by today's most significant modern and contemporary artists",
      date: "2–22 JUL",
      location: "ONLINE",
      overlay: "Art Showcase"
    },
    {
        type: 'video',
        src: '/vault/vid.mp4',
        title: `The Making of “Jordan Wings”`,
      subtitle: "FEATURED MASTERPIECE",
      description: "Discover the brilliance of post-impressionist masterpieces",
      date: "15–30 JUL",
      location: "ON SALE",
      overlay: "A Masterpiece The Making"
    },
    {
      type: 'image',
      src: '/vault/jj.png',
      title: `“Jordan Wings”, Close Up`,
      subtitle: "MASTERPIECE",
      description: "Art from antiquity to the 21st century",
      date: "2–22 JUL",
      location: "ONLINE",
      overlay: "Collection"
    },

  ]

  const handleWelcomeComplete = () => {

    setShowWelcome(false)
  }

  // Show welcome screen first
  if (showWelcome) {
    return <ExhibitIQWelcome onComplete={handleWelcomeComplete} />
  }
  return (
    <>
      <div className="min-h-screen bg-black relative">
      {/* Fixed Parallax Video Background */}
      <div 
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      >
        <video
          src="/vault/earth.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0)' }}
        />
        {/* Black overlay for video */}
        <div className="absolute inset-0 ambient-bg-overlay" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute inset-0 ambient-light-overlay" style={{ transform: 'translateZ(0)' }}></div>
      </div>
      
      {/* Navbar - above video */}
      <div className="relative z-20">
        <Navbar />
      </div>
      
      {/* Content wrapper that scrolls over the video */}
      <div className="relative z-10 min-h-screen">
        {/* X Snyder Design Section */}
        <div className="relative min-h-screen">
       
          {/* Glassmorphism Hero Section */}
          {heroLoading ? (
            <>
              <HeroSkeleton />
              <HeroImageSkeleton />
            </>
          ) : (
            <div className="relative min-h-screen flex items-center justify-center py-28 overflow-hidden">

              <div className="relative z-10 w-full mx-auto">
                {/* Unified Glassmorphism Container */}
                <motion.div 
                  className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] md:backdrop-blur-none md:bg-transparent rounded-3xl lg:rounded-none p-4 lg:py-8 shadow-2xl lg:shadow-none overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <div className="grid lg:grid-cols-2 gap-6 lg:px-6 lg:gap-12 items-center justify-center">
                    
                    {/* Left Side - Text Content */}
                    <motion.div 
                      className="space-y-6 lg:mt-0 order-2 lg:order-1"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {/* Main Title */}
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        <h1 className="text-4xl lg:text-7xl font-bold leading-tight">
                          <span className="text-neutral-500">INTERDIMENSIONAL</span>
                          <br />
                          <span className="text-white">
                          {/* <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"> */}
                            SANCTUARY
                          </span>
                        </h1>
                      </motion.div>

                      {/* Brand Name */}
                      <motion.div 
                        className="mt-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white/80 tracking-widest">
                          EXSA
                        </h2>
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-white/70 tracking-wider">
                          Exo Sanctra
                        </h3>
                      </motion.div>

                      {/* Description */}
                      <motion.p 
                        className="text-sm sm:text-base lg:text-base text-white/80 leading-relaxed mt-6"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                      >
                        A living sanctuary where art, technology, and soul-expression merge.
                      </motion.p>

                      <motion.div 
                        className="space-y-2 mt-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                      >
                        <p className="text-white/70 text-sm sm:text-base">
                          For souls who feel alien to society.
                        </p>
                        <p className="text-white/70 text-sm sm:text-base">
                          For those without belonging—until now.
                        </p>
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div 
                        className="flex flex-col sm:flex-row gap-4 mt-8"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                      >
                        <Button 
                          className="lg:px-12 lg:py-8 py-6 px-5 rounded-full hover:shadow-lg bg-gradient-to-r from-white/60 to-white text-black lg:text-base text-sm shadow-md"
                          onClick={() => router.push('/personal-universe')}
                        >
                          Enter Your Universe
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-white/30 bg-transparent text-white px-6 lg:px-12 lg:py-8 py-6 rounded-full lg:text-base text-sm"
                          onClick={() => router.push('/store-of-essence')}
                        >
                          Explore the Sanctuary
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Middle - Image */}
                    {/* <motion.div 
                      className="relative order-3 lg:order-2"
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        y: [0, -80, 0]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: 0.6,
                        y: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <div className="relative rounded-2xl w-full h-[500px] overflow-hidden">
                        <Image
                          src="/vault/Ch1.png"
                          alt="Crystallized background"
                          fill
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </motion.div> */}

                    {/* Right Side - Video */}
                    <motion.div 
                      className="relative order-1 lg:justify-center lg:flex lg:order-3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {/* Mobile: Keep exactly as is */}
                      <div className="relative rounded-2xl overflow-hidden lg:hidden">
                        <video
                          src="/vault/1.mp4"
                          playsInline
                          autoPlay
                          muted
                          loop
                          webkit-playsinline="true"
                          x5-playsinline="true"
                          x5-video-player-type="h5"
                          x5-video-player-fullscreen="false"
                          x5-video-orientation="portrait"
                          preload="metadata"
                          disablePictureInPicture
                          controlsList="nodownload nofullscreen noremoteplayback"
                          className="w-full h-[500px] object-cover rounded-2xl"
                        />
                      </div>
                      
                      {/* Desktop: Glass iPad Frame */}
                      <div className="hidden lg:block relative">
                        <motion.div
                          className="relative"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {/* Outer glass frame */}
                          <div className="relative p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 rounded-[2.5rem]">
                            {/* Inner frame border */}
                            <div className="absolute inset-4 rounded-[2rem]"></div>
                            
                            {/* Screen bezel effect */}
                            <div className="relative rounded-[1.5rem] overflow-hidden bg-black/20 backdrop-blur-sm">
                              {/* Home indicator (iPad style) */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full z-10"></div>
                              
                              {/* Video content */}
                              <video
                                src="/vault/1.mp4"
                                playsInline
                                autoPlay
                                muted
                                loop
                                webkit-playsinline="true"
                                x5-playsinline="true"
                                x5-video-player-type="h5"
                                x5-video-player-fullscreen="false"
                                x5-video-orientation="portrait"
                                preload="metadata"
                                disablePictureInPicture
                                controlsList="nodownload nofullscreen noremoteplayback"
                                className="w-full h-[480px] object-cover"
                              />
                            </div>
                            
                            {/* Glass reflection effect */}
                            <div className="absolute top-8 left-8 right-8 h-32 bg-gradient-to-b from-white/10 to-transparent rounded-t-[1.5rem] pointer-events-none"></div>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

             </motion.div>
              </div>

              {/* Scroll Indicator */}
              {/* <motion.div 
                className="absolute bottom-20 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1 backdrop-blur-sm bg-white/10">
                  <motion.div 
                    className="w-1 h-3 bg-white rounded-full mx-auto"
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div> */}
            </div>
          )}

          {/* About EXSA Section */}
          <motion.div 
            className=" lg:h-[120vh] h-[100vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] rounded-3xl p-4 lg:p-12 shadow-2xl overflow-hidden max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                    <Image
                      src="/vault/Alina with artworks and portraits/a1.jpg"
                      alt="Alina"
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute top-4 right-4 hidden lg:block">
                      <Image
                        src="/vault/Elements for Web Decoration/old frame.jpg"
                        alt="Old frame"
                        width={50}
                        height={50}
                        className="opacity-80"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src="/vault/Elements for Web Decoration/Alien_Sign.png"
                        alt="Alien Sign"
                        width={30}
                        height={30}
                        className="opacity-90 lg:w-[40px] lg:h-[40px]"
                      />
                      <h2 className="text-2xl lg:text-4xl font-bold text-white">
                        About <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">EXSA</span>
                      </h2>
                    </div>
                    <p className="text-white/80 text-sm lg:text-lg">
                      A living interdimensional sanctuary where art, technology, and soul-expression merge 
                      <span className=""> into a unified phygital universe. For souls who feel alien to society.</span>
                    </p>
                    <div className="hidden lg:flex items-center space-x-4">
                      <Image
                        src="/vault/Elements for Web Decoration/Earth.png"
                        alt="Earth"
                        width={30}
                        height={30}
                        className="opacity-80"
                      />
                      <span className="text-white/70">For souls without belonging—until now</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                      <Button 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                        onClick={() => router.push('/about-exsa')}
                      >
                        Learn More
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-white/30 bg-transparent text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                        onClick={() => router.push('/soul-activation')}
                      >
                        Start Journey
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Soul Activation Section */}
          <motion.div 
            className=" lg:h-[100vh] h-[100vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="relative h-80 lg:h-[500px] rounded-2xl overflow-hidden order-2 lg:order-1">
                    <Image
                      src="/vault/Art Altars/Altar 1.jpg"
                      alt="Soul Altar"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 hidden lg:block">
                      <Image
                        src="/vault/Elements for Web Decoration/Eye_Waves_.png"
                        alt="Eye waves"
                        width={40}
                        height={40}
                        className="opacity-90"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
                    <h2 className="text-2xl lg:text-4xl font-bold text-white">
                      Soul Activation <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Art Altar</span>
                    </h2>
                    <p className="text-white/80 text-sm lg:text-lg">
                      A sacred mirror of your true essence created through alien channeling. 
                      <span className="hidden lg:inline"> Each artwork becomes a portal into your micro-world of self-discovery.</span>
                    </p>
                    <div className="hidden lg:flex items-center space-x-4">
                      <Image
                        src="/vault/Elements for Web Decoration/gemstones.jpg"
                        alt="Gemstones"
                        width={30}
                        height={30}
                        className="opacity-80"
                      />
                      <span className="text-white/70">Microchip Activated</span>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base w-full lg:w-auto"
                      onClick={() => router.push('/soul-activation')}
                    >
                      Begin Your Journey
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Community Rituals Section */}
          <motion.div 
            className=" lg:h-[150vh] h-[230vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 py-8 z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] rounded-3xl p-4 lg:p-12 shadow-2xl overflow-hidden max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-center mb-6 lg:mb-8">
                  <div className="hidden lg:flex justify-center mb-4">
                    <Image
                      src="/vault/Elements for Web Decoration/Planet.png"
                      alt="Planet"
                      width={50}
                      height={50}
                      className="opacity-80"
                    />
                  </div>
                  <h2 className="text-2xl lg:text-5xl font-bold text-white mb-4">
                    Community <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Rituals</span>
                  </h2>
                  <p className="text-sm lg:text-lg text-white/80 max-w-2xl mx-auto">
                    Join our community of souls in sacred ceremonies that activate your essence 
                    <span className="hidden lg:inline"> and connect you with your cosmic family.</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                  {[
                    { 
                      title: "Full Moon Soul Activation", 
                      image: "/vault/Alien Ceremonies - Events_Footage/Photo 1_Alien Ceremony.png",
                      date: "Saturday, January 15th, 2025",
                      time: "8:00pm - 9:30pm",
                      tag: "Live Ceremonies",
                      tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
                      link: "/community-rituals"
                    },
                    { 
                      title: "New Moon Intention Setting", 
                      image: "/vault/Alien Ceremonies - Events_Footage/Photo 2_Alien Ceremony.png",
                      date: "Wednesday, January 29th, 2025",
                      time: "7:00pm - 8:30pm",
                      tag: "Digital Rituals",
                      tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      link: "/community-rituals"
                    },
                    { 
                      title: "Soul Family Gathering", 
                      image: "/vault/Alien Ceremonies - Events_Footage/Photo 3_Alien Ceremony.png",
                      date: "Sunday, February 5th, 2025",
                      time: "6:00pm - 8:00pm",
                      tag: "Exclusive Events",
                      tagColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                      link: "/community-rituals"
                    }
                  ].map((ritual, index) => (
                    <motion.div
                      key={ritual.title}
                      className="backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all cursor-pointer group"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                      viewport={{ once: true }}
                      onClick={() => router.push(ritual.link)}
                    >
                      {/* Image */}
                      <div className="relative w-full h-48 lg:h-64 overflow-hidden">
                        <Image
                          src={ritual.image}
                          alt={ritual.title}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 lg:p-6">
                        {/* Tag */}
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs lg:text-sm font-medium border ${ritual.tagColor}`}>
                            {ritual.tag}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-lg lg:text-xl font-bold text-white mb-3 line-clamp-2">
                          {ritual.title}
                        </h3>
                        
                        {/* Date and Time */}
                        <div className="space-y-1 mb-4">
                          <div className="flex items-center text-sm text-white/80">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{ritual.date}</span>
                          </div>
                          <div className="flex items-center text-sm text-white/80">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{ritual.time}</span>
                          </div>
                        </div>
                        
                        {/* Learn More Link */}
                        <button 
                          className="text-pink-400 hover:text-pink-300 font-medium text-sm lg:text-base flex items-center group-hover:underline transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(ritual.link);
                          }}
                        >
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="text-center mt-4 lg:mt-8">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                    onClick={() => router.push('/community-rituals')}
                  >
                    Join Ceremonies
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Personal Universe Section */}
          <motion.div 
            className=" lg:h-[120vh] h-[100vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] rounded-3xl p-4 lg:p-12 shadow-2xl overflow-hidden max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <Image
                        src="/vault/Elements for Web Decoration/Blue_Alien.png"
                        alt="Blue Alien"
                        width={40}
                        height={40}
                        className="opacity-90 lg:w-[50px] lg:h-[50px]"
                      />
                      <h2 className="text-2xl lg:text-4xl font-bold text-white">
                        Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Universe</span>
                      </h2>
                    </div>
                    <p className="text-white/80 text-sm lg:text-lg">
                      Welcome to your personal sanctuary. Track your soul journey, 
                      <span className="hidden lg:inline"> explore unlocked portals, and connect with your essence.</span>
                    </p>
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      <div className="p-3 lg:p-4 bg-white/10 rounded-2xl text-center">
                        <div className="text-xl lg:text-2xl font-bold text-purple-400">12/25</div>
                        <div className="text-white/70 text-xs lg:text-sm">Portals Unlocked</div>
                      </div>
                      <div className="p-3 lg:p-4 bg-white/10 rounded-2xl text-center">
                        <div className="text-xl lg:text-2xl font-bold text-blue-400">Awakening</div>
                        <div className="text-white/70 text-xs lg:text-sm">Soul Level</div>
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base w-full lg:w-auto"
                      onClick={() => router.push('/personal-universe')}
                    >
                      Enter Your Universe
                    </Button>
                  </div>
                  <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden order-1 lg:order-2">
                    <Image
                      src="/vault/Art Altars/Altar 2.jpg"
                      alt="Personal Universe"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 hidden lg:block">
                      <Image
                        src="/vault/Elements for Web Decoration/stars.jpg"
                        alt="Stars"
                        width={40}
                        height={40}
                        className="opacity-80"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* Store of Essence Section */}
          <motion.div 
            className=" lg:h-[120vh] h-[80vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] rounded-3xl p-4 lg:p-12 shadow-2xl overflow-hidden max-w-7xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="hidden lg:flex justify-center mb-6">
                  <Image
                    src="/vault/Elements for Web Decoration/Star, Small, Dresden Trim - Silver Pair.jpg"
                    alt="Star decoration"
                    width={60}
                    height={60}
                    className="opacity-80"
                  />
                </div>
                <h2 className="text-2xl lg:text-5xl font-bold text-white mb-4">
                  Store of <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Essence</span>
                </h2>
                <p className="text-sm lg:text-lg text-white/80 mb-6 lg:mb-8 max-w-2xl mx-auto">
                  Where physical and digital merge into portals of self-discovery. 
                  <span className="hidden lg:inline"> Each piece unlocks a micro-world of your authentic essence.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                    onClick={() => router.push('/store-of-essence')}
                  >
                    Explore Store
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                    onClick={() => router.push('/soul-activation')}
                  >
                    Create Soul Altar
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Final Call to Action Section */}
          <motion.div 
            className=" lg:h-[120vh] h-[80vh] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-4 z-10">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] rounded-3xl p-4 lg:p-12 shadow-2xl overflow-hidden max-w-7xl mx-auto text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="hidden lg:flex justify-center mb-6">
                  <Image
                    src="/vault/Elements for Web Decoration/space element.jpg"
                    alt="Space element"
                    width={80}
                    height={80}
                    className=""
                  />
                </div>
                <h2 className="text-2xl lg:text-5xl font-bold text-white mb-4 lg:mb-6">
                  Ready to Find Your <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Sanctuary?</span>
                </h2>
                <p className="text-sm lg:text-lg text-white/80 mb-6 lg:mb-8 max-w-2xl mx-auto">
                  Join thousands of souls who have found their home in EXSA. 
                  <span className="hidden lg:inline"> Your journey of self-discovery and authentic connection begins here.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
                  <Button 
                    className="bg-gradient-to-r from-white/60 to-white text-black rounded-full px-6 lg:px-8 py-2 lg:py-3 hover:shadow-lg text-sm lg:text-base"
                    onClick={() => router.push('/soul-activation')}
                  >
                    Start Your Journey
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white rounded-full px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base"
                    onClick={() => router.push('/store-of-essence')}
                  >
                    Explore Store
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
      </div>
      
      {/* Demo Form Modal */}
      {/* <DemoFormModal 
        isOpen={showDemoPopup} 
        onClose={() => setShowDemoPopup(false)} 
      /> */}
      
      {/* Alien Gift Popup */}
      <AlienGiftPopup 
        isOpen={showGiftPopup} 
        onClose={() => setShowGiftPopup(false)} 
      />
      
      <Footer />
    </>
  )
}

export default Home 