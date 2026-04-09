'use client';

import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Custom succession animation hook
const useSuccessionAnimation = (delay = 0) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return isVisible
}

interface ExhibitIQWelcomeProps {
  onComplete: () => void
}

export default function ExhibitIQWelcome({ onComplete }: ExhibitIQWelcomeProps) {
  const [showWelcome, setShowWelcome] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  // Check if user has visited before
  useEffect(() => {
    // Temporarily disabled localStorage check for testing
    // const hasVisited = localStorage.getItem('hasVisitedExhibitIQ')
    
    // if (hasVisited) {
    //   // Skip welcome screen for returning users
    //   setShowWelcome(false)
    //   onComplete()
    // } else {
    //   // Mark as visited for first-time users
    //   localStorage.setItem('hasVisitedExhibitIQ', 'true')
    // }
    
    // For testing - always show welcome screen
    setShowWelcome(true)
    localStorage.setItem('hasVisitedExhibitIQ', 'true')
  }, [onComplete])

  // Succession animations for different text elements
  const welcomeVisible = useSuccessionAnimation(300)
  const subtitleVisible = useSuccessionAnimation(800)
  const taglineVisible = useSuccessionAnimation(1300)
  const logoVisible = useSuccessionAnimation(1800)

  useEffect(() => {
    // Only show welcome animation if showWelcome is true
    if (showWelcome) {
      // Reduced total wait time to 2-3 seconds (2500ms total: 1800ms animation + 700ms hold)
      const totalWaitTime = 1800 + 700 // ~2.5 seconds total
      
      const timer = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setShowWelcome(false)
          onComplete()
        }, 500) // Faster fade out duration
      }, totalWaitTime)

      return () => clearTimeout(timer)
    }
  }, [showWelcome, onComplete])

  // Determine if we're in dark mode
  const isDark = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

  if (showWelcome) {
    return (
        <div className="fixed inset-0 flex w-full h-full bg-black items-center justify-center z-50 transition-opacity duration-1000"> 
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000"
        style={{
          background: isDark 
            ? `radial-gradient(circle at center, 
                rgba(64, 64, 64, 0.6) 0%,   
                rgba(38, 38, 38, 0.7) 15%,
                rgba(23, 23, 23, 0.85) 35%,
                rgba(13, 13, 13, 0.95) 55%,
                rgb(13, 13, 13) 75%,
                rgb(0, 0, 0) 100%)`
            : `radial-gradient(circle at center, 
               rgba(64, 64, 64, 0.6) 0%,
                rgba(38, 38, 38, 0.7) 15%,
                rgba(23, 23, 23, 0.85) 35%,
                rgba(13, 13, 13, 0.95) 55%,
                rgb(13, 13, 13) 75%,
                rgb(0, 0, 0) 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={`text-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          {/* Logo */}

          {/* Main Title */}
          {/* <motion.h1 
            className={`text-4xl md:text-8xl font-light text-white mb-4 tracking-[0.3em] transition-all duration-1000 ${
              welcomeVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}
            style={{
              fontWeight: 700
            }}
          >
            EXHIBITIQ
          </motion.h1> */}
            <motion.img 
            className={`transition-all duration-1000 lg:w-[500px] w-[400px] ${
              welcomeVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}
            src="/main1.png" alt="ExhibitIQ Logo" width={200} height={200} />
        </div>
      </motion.div>
      </div>
    )
  }

  return null
}
