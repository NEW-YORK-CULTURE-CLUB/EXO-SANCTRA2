"use client"

import React, { useState, useEffect } from 'react'
import { RiWhatsappFill } from "react-icons/ri";
import { useSettings } from '@/contexts/settings-context'

interface WhatsAppFloatProps {
  phoneNumber: string
  message?: string
}

export default function WhatsAppFloat({ 
  phoneNumber, 
  message = "Hello! I'm interested in your luxury services." 
}: WhatsAppFloatProps) {
  const { settings } = useSettings()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      // Show WhatsApp icon when user scrolls down more than 100px
      setIsVisible(scrollTop > 100)
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleWhatsAppClick = () => {
    // Format phone number to international format (remove leading 0 and add country code)
    const formattedNumber = phoneNumber.startsWith('0') 
      ? `234${phoneNumber.slice(1)}` 
      : phoneNumber
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
       <style>
        {`
          @keyframes borderTravel {
            0% { 
              border-top-color: white;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            25% { 
              border-top-color: transparent;
              border-right-color: white;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
            50% { 
              border-top-color: transparent;
              border-right-color: transparent;
              border-bottom-color: white;
              border-left-color: transparent;
            }
            75% { 
              border-top-color: transparent;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: white;
            }
            100% { 
              border-top-color: white;
              border-right-color: transparent;
              border-bottom-color: transparent;
              border-left-color: transparent;
            }
          }
          
          .animated-border {
            animation: borderTravel 6s linear infinite;
          }
          
          .animated-border-slow {
            animation: borderTravel 8s linear infinite;
          }
          
          .animated-border-slower {
            animation: borderTravel 10s linear infinite;
          }
        `}
      </style>
     <div className={`fixed bottom-10 right-6 z-50 transition-all duration-500 ${
       isVisible 
         ? 'opacity-100 translate-y-0' 
         : 'opacity-0 translate-y-4 pointer-events-none'
     }`}>
      <button
        onClick={handleWhatsAppClick}
        style={{ border: '1px solid transparent' }}
        className={`group relative p-5 animated-border rounded-full shadow-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 ${
             'bg-[rgba(52,52,52,0.3)] backdrop-blur-lg text-white'
        }`}
        aria-label="Contact us on WhatsApp"
      >
        <RiWhatsappFill className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className={`absolute right-full mr-3 top-1/2 transform -translate-y-1/2 text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none ${
          settings.theme === 'dark' 
            ? 'bg-card text-card-foreground border border-border' 
            : 'bg-card text-card-foreground border border-border'
        }`}>
          Chat with us on WhatsApp
          <div className={`absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent ${
            settings.theme === 'dark' 
              ? 'border-l-card' 
              : 'border-l-card'
          }`}></div>
        </div>
        
        {/* Pulse animation */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
          settings.theme === 'dark' 
            ? 'bg-primary' 
            : 'bg-primary'
        }`}></div>
      </button>
    </div>
    </>
  )
}
