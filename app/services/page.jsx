'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import DemoFormModal from '@/components/demo-form-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from '@/lib/i18n'

import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { motion } from 'framer-motion'
import ArtFeatureCards from '@/components/ArtFeatureCards';
import Image from 'next/image';

function Services() {
  const [showDemoPopup, setShowDemoPopup] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useTranslation()

  const services = [
    {
      image: "/vault/CORE/ARTWORKMGMT.png",
      title: "Artwork Management",
      description: "Complete catalog management with detailed artwork information, artist profiles, and inventory tracking.",
      features: [
        "Comprehensive artwork database",
        "Artist profile management",
        "Inventory tracking & organization",
        "Featured artwork selection",
        "Digital asset management"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      image: "/vault/CORE/GALLERYOPERATIONS.png",
      title: "Gallery Operations",
      description: "Streamlined gallery management with auction planning, patron management, and operational tools.",
      features: [
        "Auction management system",
        "Patron & collector CRM",
        "Gallery settings & configuration",
        "Record vault & documentation",
        "Operational workflow automation"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      image: "/vault/CORE/ANALYTICS.png",
      title: "Analytics & Insights",
      description: "Data-driven insights with comprehensive performance metrics and revenue optimization tools.",
      features: [
        "Revenue tracking & analytics",
        "User activity monitoring",
        "Performance metrics",
        "Top performers identification",
        "Custom reporting & insights"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      image: "/vault/CORE/DIGITALEXPERIENCES.png",
      title: "Digital Experience",
      description: "Interactive digital displays with QR code integration and modern user experiences.",
      features: [
        "QR code integration",
        "Digital floor displays",
        "Interactive artwork viewing",
        "Mobile-optimized interface",
        "Real-time engagement tracking"
      ],
      color: "from-orange-500 to-red-500"
    },
    {
      image: "/vault/CORE/SECURITY.png",
      title: "Security & Compliance",
      description: "Secure digital vault with provenance tracking and authenticity verification.",
      features: [
        "Secure digital vault",
        "Provenance tracking",
        "Authenticity verification",
        "Data encryption",
        "Compliance management"
      ],
      color: "from-indigo-500 to-blue-500"
    },
    {
      image: "/vault/CORE/COLLECTORENGAGEMENT.png",
      title: "Collector Engagement",
      description: "Enhanced collector relationships with personalized experiences and engagement tools.",
      features: [
        "Collector profiles",
        "Personalized recommendations",
        "Engagement tracking",
        "Communication tools",
        "Loyalty programs"
      ],
      color: "from-teal-500 to-green-500"
    }
  ]

  const additionalFeatures = [
    {
      image: "/vault/PLATFORM/MULTI-PLATFORMSUPPORT.png",
      title: "Multi-Platform Support",
      description: "Access your gallery management system from anywhere with our cloud-based platform."
    },
    {
      image: "/vault/PLATFORM/MOBILEFIRST.png",
      title: "Mobile-First Design",
      description: "Optimized for all devices with responsive design and mobile app capabilities."
    },
    {
      image: "/vault/PLATFORM/SCALABLEINFRASTRUCTURE.png",
      title: "Scalable Infrastructure",
      description: "Built to grow with your gallery using modern, scalable cloud technology."
    },
    {
      image: "/vault/PLATFORM/COMPREHENSIVEDOCUMENTATION.png",
      title: "Comprehensive Documentation",
      description: "Complete API documentation and support for seamless integration."
    },
    {
      image: "/vault/PLATFORM/CUSTOMSOLUTIONS.png",
      title: "Custom Solutions",
      description: "Tailored solutions to meet your specific gallery needs and requirements."
    },
    {
      image: "/vault/PLATFORM/REALTIMEUPDATES.png",
      title: "Real-Time Updates",
      description: "Live data synchronization across all platforms and devices."
    }
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-10 lg:py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?"
              alt="Art gallery background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-4xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-muted-foreground">Our </span>
                <span className="text-foreground">Services</span>
              </motion.h1>
              <motion.p 
                className="text-muted-foreground mb-0 max-w-3xl mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                ExhibitIQ provides a comprehensive suite of services designed to modernize and powers art stakeholders with a single platform that connects
                operations to audience.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services */}
        <ArtFeatureCards />

        {/* Main Services Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-light mb-12 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Core Services
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                                                     <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center mb-4 ml-0 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-light mb-12 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Platform Features
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light mb-6 text-foreground">Built with Modern Technology</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform is built using cutting-edge technologies to ensure reliability, 
                performance, and scalability for your gallery operations.
              </p>
            </motion.div>
            
            {/* <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                { name: "Next.js 14", description: "Modern React framework" },
                { name: "TypeScript", description: "Type-safe development" },
                { name: "Tailwind CSS", description: "Utility-first styling" },
                { name: "Firebase", description: "Scalable backend services" }
              ].map((tech, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-primary rounded"></div>
                  </div>
                  <h3 className="font-semibold mb-1 text-foreground">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </motion.div> */}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-light mb-6 text-foreground">Ready to Transform Your Gallery?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the growing number of galleries that have modernized their operations with ExhibitIQ. 
                Get started today and experience the future of gallery management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={async () => {
                    setIsButtonLoading(true);
                    try {
                      if (user) {
                          await router.push('/home');
                      } else {
                        await router.push('/auth/register');
                      }
                    } catch (error) {
                      console.error('Navigation error:', error);
                    } finally {
                      setIsButtonLoading(false);
                    }
                  }}
                  disabled={isButtonLoading}
                  className="bg-primary text-primary-foreground lg:text-base text-xs font-semibold lg:py-5 py-2 lg:w-64 w-36 lg:rounded-2xl rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isButtonLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Skeleton className="h-4 w-16 bg-white/20" />
                      <Skeleton className="h-4 w-4 rounded-full bg-white/20 animate-pulse" />
                    </div>
                  ) : (
                    t('getStarted')
                  )}
                </button>
                <button 
                  onClick={() => setShowDemoPopup(true)}
                  className="bg-transparent text-secondary-foreground lg:text-base text-xs font-semibold lg:py-5 py-2 lg:w-64 w-40 lg:rounded-2xl rounded-xl transition-colors duration-200 hover:shadow-lg"
                >
                  Schedule A Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      
      {/* Demo Form Modal */}
      <DemoFormModal 
        isOpen={showDemoPopup} 
        onClose={() => setShowDemoPopup(false)} 
      />
      
      <Footer />
    </>
  )
}

export default Services
