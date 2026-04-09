'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/auth-context';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import WhereToSkeleton from '@/components/where-to-skeleton';

const WhereToPage = () => {
  const router = useRouter();
  const { user, loading, userData } = useAuth();
  const { t } = useTranslation();
  const [navigating, setNavigating] = useState(false);
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return <WhereToSkeleton />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const destinations = [
    {
      title: 'ExhibitIQ - OS',
      description: t('galleryOSDescription') || 'Manage your gallery operations and analytics',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?',
      path: '/dashboard'
    },
    {
      title: 'ArtistIQ - OS',
      description: t('artistOSDescription') || 'Create and manage your artist profile and artwork',
      image: 'https://images.unsplash.com/photo-1588786849373-642245e7bd15?',
      path: '/dashboard'
    },
    {
      title: 'CollectorIQ - OS',
      description: t('collectorOSDescription') || 'Browse, collect, and manage your collection',
      image: 'https://images.unsplash.com/photo-1580687580441-96dbadf8f3c8?',
      path: '/dashboard'
    },
    // {
    //   title: 'Global Marketplace',
    //   description: 'Access worldwide art markets and trading platforms',
    //   image: '/vault/COMPANY/CONTACT.png',
    //   // image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&crop=center',
    //   path: '/marketplace'
    // },
    // {
    //   title: 'Home',
    //   description: 'Return to the main homepage',
    //   image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?',
    //   path: '/'
    // },
  ];

  const handleDestinationClick = (path: string) => {
    setNavigating(true);
    router.push(path);
  };

  // Show navigation loading overlay
  if (navigating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Navigating to your destination...</p>
        </div>
      </div>
    );
  }



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Show navigation loading overlay
  if (navigating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Navigating to your destination...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border"> */}
        <div className="container mx-auto px-4 py-8 lg:mt-20">
          {/* <motion.h1 
            className="text-6xl md:text-8xl font-extrabold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
      <span className="text-muted-foreground"> Where </span>
  <span className="text-foreground"> To ?</span>
                </motion.h1> */}
          <motion.p 
            className="text-lg text-muted-foreground text-center mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Welcome back, {userData?.fullname || user?.email}! Choose your destination below.
          </motion.p>
        </div>
      {/* </div> */}

      {/* Destinations Grid */}
      <div className="container mx-auto px-4 lg:py-8 py-0">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {destinations.map((destination, index) => (
            <motion.div
              key={index}
              className="group cursor-pointer rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-background border-0 border-border/50 hover:border-primary/50"
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => handleDestinationClick(destination.path)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl mb-2">{destination.title}</h3>
                  <p className="text-xs text-gray-200 opacity-90 leading-relaxed">
                    {destination.description}
                  </p>
                </div>
                
                {/* Hover overlay */}
                {/* <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-primary px-6 py-3 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Go to {destination.title}
                  </div>
                </div> */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back button */}
        {/* <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-muted hover:bg-muted/80 text-muted-foreground rounded-full font-medium transition-colors duration-200"
          >
            ← Go Back
          </button>
        </motion.div> */}
      </div>
    </div>
  );
};

export default WhereToPage;
