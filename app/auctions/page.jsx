'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { MapPin, Calendar } from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { NotificationModal } from '@/components/notification-modal'

function Auctions() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1569196296865-2508f52e4593?"
              alt="Auction house background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-7xl font-bold mb-6 text-foreground">Auctions</h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover upcoming auctions, browse lots, and participate in live bidding events
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-background border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">All Auctions</Button>
              <Button variant="outline" size="sm" className="hover:bg-accent">Online Only</Button>
              <Button variant="outline" size="sm" className="hover:bg-accent">Live Auctions</Button>
              <Button variant="outline" size="sm" className="hover:bg-accent">Happening Near You</Button>
            </div>
          </div>
        </section>

        {/* No Live Auctions Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Animated Icon */}
              <div className="relative mb-6 sm:mb-8">
                <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center animate-pulse-glow">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center animate-float">
                    <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                {/* Floating particles */}
                <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-primary/30 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-2 h-2 sm:w-3 sm:h-3 bg-primary/40 rounded-full animate-ping animation-delay-1000"></div>
                <div className="absolute top-3 -right-3 sm:top-4 sm:-right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/50 rounded-full animate-ping animation-delay-2000"></div>
                <div className="absolute -top-3 right-6 sm:-top-4 sm:right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary/20 rounded-full animate-ping animation-delay-3000"></div>
                <div className="absolute bottom-6 -left-4 sm:bottom-8 sm:-left-6 w-2 h-2 sm:w-3 sm:h-3 bg-primary/25 rounded-full animate-ping animation-delay-1500"></div>
              </div>

              {/* Main Content */}
              <div className="space-y-4 sm:space-y-6 animate-fade-in-up">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                  No Live Auctions
                  <span className="block text-xl sm:text-2xl lg:text-3xl font-light text-muted-foreground mt-1 sm:mt-2">
                    at the moment
                  </span>
                </h2>
                
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                  We're currently preparing exciting new auction events. Check back soon for upcoming live auctions featuring exceptional artworks and collectibles.
                </p>

                {/* Animated Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                  <div className="group feature-card p-4 sm:p-6 bg-card/50 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-card/80 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">Upcoming Events</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">New auctions are being scheduled regularly</p>
                    </div>
                  </div>

                  <div className="group feature-card p-4 sm:p-6 bg-card/50 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-card/80 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">Global Reach</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Auctions from galleries worldwide</p>
                    </div>
                  </div>

                  <div className="group feature-card p-4 sm:p-6 bg-card/50 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-card/80 relative overflow-hidden sm:col-span-2 lg:col-span-1">
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4 mx-auto group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-sm sm:text-base">Live Bidding</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">Real-time competitive bidding experience</p>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
                  <Button 
                    size="lg" 
                    onClick={() => setShowNotificationModal(true)}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    Get Notified
                  </Button>
                  <p className="text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
                    We'll notify you when new auctions are announced
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        
      </div>
      <Footer />
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
      />
    </>
  )
}

export default Auctions 