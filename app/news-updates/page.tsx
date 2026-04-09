'use client';

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Calendar, Globe, MapPin, Heart, Play, ArrowLeft, ArrowRight, Clock, Sparkles, Users, Moon, Sun, Star, Zap, BookOpen, ExternalLink } from 'lucide-react'
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

function NewsUpdates() {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [api, setApi] = React.useState(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [heroLoading, setHeroLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
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

  // News articles data
  const newsArticles = [
    {
      id: 1,
      title: "From Puddles to Valleys – What It Takes to Build the Future We Deserve",
      excerpt: "We do not lack the ability to create the future we deserve. That era of limitation ended decades ago. We have the knowledge to decarbonize our energy systems, to design cities that heal instead of deplete, and to build economies that repair as much as they produce.",
      image: "https://static.wixstatic.com/media/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg/v1/fill/w_1390,h_1042,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_48b57eb7c7bf4083acb4ce84401147ab~mv2.jpg",
      category: "Leadership",
      date: "September 5, 2025",
      author: "Brian R. Yurachek",
      readTime: "4 min read",
      link: "https://www.brainzmagazine.com/post/from-puddles-to-valleys-what-it-takes-to-build-the-future-we-deserve"
    },
    {
      id: 2,
      title: "Who Owns Color? The Future of the Art Market",
      excerpt: "In 2016 Anish Kapoor reached an agreement granting him exclusive rights to use Vantablack, a pigment that absorbs virtually all light. The move sent shockwaves through the art world.",
      image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6CKg04dkIlW-srhd4qCRJQ.png",
      category: "Industry News",
      date: "August 29, 2025",
      author: "Brian R. Yurachek",
      readTime: "3 min read",
      link: "https://medium.com/@brian_96176/who-owns-color-the-future-of-the-art-market-399e8c8e3832"
    },
    {
      id: 3,
      title: "The Hidden Crisis Behind Gallery Closures",
      excerpt: "Arusha Gallery's legal battle over unpaid fees is not an exception but a symptom of an art world still running on trust without infrastructure.",
      image: "https://images.unsplash.com/photo-1515169273894-7e876dcf13da?",
      category: "Industry News",
      date: "August 27, 2025",
      author: "Lily Primamore",
      readTime: "8 min read",
      link: "https://medium.com/@lily_76419/the-hidden-crisis-behind-gallery-closures-6142edf7f234"
    },
    {
      id: 4,
      title: "The Algorithm Ate the Art World",
      excerpt: "In today's galleries, the silent hand of the algorithm is already shaping what we see, how we engage, and what ultimately survives.",
      image: "https://static.wixstatic.com/media/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg/v1/fill/w_1390,h_834,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/194202_a5706aa86bb4455c9a210430121f0260~mv2.jpg",
      category: "Industry News",
      date: "August 15, 2025",
      author: "Brian R. Yurachek",
      readTime: "5 min read",
      link: "https://www.brainzmagazine.com/post/the-algorithm-ate-the-art-world-and-how-data-is-rewriting-gallery-culture"
    },
    {
      id: 5,
      title: "EXSA Community Reaches 10,000 Souls",
      excerpt: "Our interdimensional sanctuary has welcomed its 10,000th soul, marking a milestone in collective awakening and authentic self-expression.",
      image: "/vault/Alien Ceremonies - Events_Footage/Photo 1_Alien Ceremony.png",
      category: "Community",
      date: "January 10, 2025",
      author: "EXSA Team",
      readTime: "2 min read",
      link: "#"
    },
    {
      id: 6,
      title: "New Soul Activation Portal Opens",
      excerpt: "Alina has created a new portal for soul activation, featuring enhanced AR experiences and deeper community integration.",
      image: "/vault/Art Altars/Altar 1.jpg",
      category: "Product Updates",
      date: "January 8, 2025",
      author: "EXSA Team",
      readTime: "3 min read",
      link: "#"
    }
  ]

  const categories = ['All', 'Leadership', 'Industry News', 'Community', 'Product Updates']

  const filteredArticles = activeFilter === 'All' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeFilter)

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        
        {/* Hero Section with Background Image */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/3.jpg)' }}
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
                      <span className="text-white/90">NEWS &</span>
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        UPDATES
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
                    Stay connected with the latest insights, community stories, and updates 
                    from our interdimensional sanctuary.
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
                      Join Community
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Featured Article Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/4.jpg)' }}
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
                  Featured Story
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Deep insights and transformative stories from our community
                </p>
              </motion.div>

              <motion.div
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="relative h-96 rounded-2xl overflow-hidden">
                    <Image
                      src={newsArticles[0].image}
                      alt={newsArticles[0].title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500/80 text-white text-xs rounded-full">
                        {newsArticles[0].category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">{newsArticles[0].title}</h3>
                      <p className="text-white/80 text-lg leading-relaxed">{newsArticles[0].excerpt}</p>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-white/60">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{newsArticles[0].date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">{newsArticles[0].readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{newsArticles[0].author}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3"
                      onClick={() => window.open(newsArticles[0].link, '_blank')}
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* News Grid Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/5.jpg)' }}
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
                  Latest Stories
                </h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto">
                  Stay updated with the latest news and insights from our community
                </p>
              </motion.div>

              {/* Category Filter */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeFilter === category ? "default" : "outline"}
                    className={`rounded-full px-6 py-2 ${
                      activeFilter === category 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                        : 'border-white/30 bg-transparent text-white hover:bg-white/10'
                    }`}
                    onClick={() => setActiveFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.slice(1).map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="relative h-48 mb-4 rounded-2xl overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-purple-500/80 text-white text-xs rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white line-clamp-2">{article.title}</h3>
                      <p className="text-white/80 text-sm line-clamp-3">{article.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-white/60 text-xs">
                        <div className="flex items-center space-x-4">
                          <span>{article.date}</span>
                          <span>{article.readTime}</span>
                        </div>
                        <span>{article.author}</span>
                      </div>
                      
                      <Button 
                        size="sm"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full"
                        onClick={() => window.open(article.link, '_blank')}
                      >
                        Read More
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Signup Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/6.png)' }}
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
                  Stay Connected
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Join our newsletter to receive the latest updates, community stories, 
                  and exclusive insights from the EXSA universe.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3"
                  >
                    Subscribe
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

export default NewsUpdates
