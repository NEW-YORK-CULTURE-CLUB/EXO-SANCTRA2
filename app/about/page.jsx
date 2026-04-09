'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Users, Award, Globe, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import ContactModal from '@/components/contact-modal'
import NewsletterModal from '@/components/newsletter-modal'

function About() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-10 lg:py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?"
              alt="Art and creativity background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-7xl font-bold mb-6">
                <span className="text-muted-foreground">About </span>
                <span className="text-foreground">ExhibitIQ</span>
              </h1>
              <p className="text-muted-foreground mb-0 max-w-2xl mx-auto">
              ExhibitIQ is a data-driven operating system built to modernize the art experience for galleries, museums, artists, and collectors alike. In an industry long burdened by fragmented tools and opaque systems, we provide a unified platform that bridges the physical and digital worlds of art.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-0 bg-background text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
              {/* <div className="bg-muted rounded-xl h-96 flex items-center justify-center"> */}
                <img src="/light.png" alt="Mission" className="w-full h-full dark:hidden object-cover" />
                <img src="/dark.png" alt="Mission" className="w-full h-full hidden dark:block object-cover" />
              {/* </div> */}
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  <span className="text-muted-foreground">Our </span>
                  <span className="text-foreground">Mission</span>
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                ExhibitIQ's mission is to empower art stakeholders by providing a single, data-driven operating system that seamlessly connects operations to audience engagement. This platform is designed to:

                </p>
                <ul className="text-muted-foreground mb-6 space-y-2 list-disc list-inside">
                  <li>Streamline operations from intake to sale.</li>
                  <li>Unify coordination across CRM, marketing, and exhibitions.</li>
                  <li>Provide real-time insights and reporting for smarter decisions.</li>
                  <li>Enhance collector engagement and retention.</li>
                  <li>Support authenticity and provenance through a secure Digital Vault that syncs artwork for display in both physical and digital formats.</li>
                </ul>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                By offering this comprehensive solution, ExhibitIQ serves galleries, museums, artists, and collectors directly, enabling them to navigate the increasingly digital art world with greater efficiency, transparency, and confidence.
</p>
                  {/* <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Learn More
                  </Button> */}
              </div>
            </div>
          </div>
        </section>

           {/* Team Section */}
           <section className="pb-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="text-muted-foreground">Our </span>
                <span className="text-foreground">Team</span>
              </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                {
                  name: "Brian R. Yurachek",
                  role: "Partner & Chief Executive Officer",
                  bio: "11+ years of Asset Management experience (460M AUM), Multidisciplinary Artist, Avid Runner",
                  image: "/vault/brian.jpg"
                },
                {
                  name: "Darshan Dorsey",
                  role: "Partner & Chief Experience Officer",
                  bio: "12+ years of experience in OSINT & Visual Analytics, AI-driven Creative Technologist, Starbucks",
                  image: "/vault/DARSHAN.jpg"
                },
                {
                  name: "Lily Primamore",
                  role: "Partner & Chief Revenue Officer",
                  bio: "12+ years of experience as a Blue Chip Art Advisor, Multidisciplinary Artist, Reality TV Connoisseur",
                  image: "/vault/lily.jpg"
                },
                {
                  name: "Patrick Leonard",
                  role: "SVP, Business Development",
                  bio: "12+ years of experience as a contemporary art specialist, writer & lecturer, Brazilian Jiu Jitsu Enthusiast",
                  image: "/vault/patrick.png"
                },
                {
                  name: "Risa Oze",
                  role: "Partner & Advisor",
                  bio: "10+ years of experience in Digital Media & GTM-Strategy, Artist, World Traveler",
                  image: "/vault/risa.jpg"
                },
              ].map((member, index) => (
                <div key={index} className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white mb-4 shadow-md"
                  />
                  <h3 className="font-semibold mb-1 text-foreground text-sm">{member.name}</h3>
                  <p className="text-xs text-primary mb-1 font-semibold">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        {/* <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-12 text-center text-foreground">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Accessibility",
                  description: "Making fine art accessible to everyone through digital innovation",
                  icon: "🎨"
                },
                {
                  title: "Authenticity",
                  description: "Ensuring the provenance and authenticity of every artwork",
                  icon: "🔍"
                },
                {
                  title: "Innovation",
                  description: "Pioneering new ways to experience and collect art",
                  icon: "💡"
                }
              ].map((value, index) => (
                <div key={index} className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

     

        {/* Contact Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-muted-foreground">Get </span>
                <span className="text-foreground">in </span>
                <span className="text-muted-foreground">Touch</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Have questions about our platform or want to learn more about our services? 
                We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Contact Us
                </Button>
                <Button 
                  variant="outline" 
                  className="hover:bg-accent"
                  onClick={() => setIsNewsletterModalOpen(true)}
                >
                  Join Our Newsletter
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      
      {/* Modals */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <NewsletterModal 
        isOpen={isNewsletterModalOpen} 
        onClose={() => setIsNewsletterModalOpen(false)} 
      />
    </>
  )
}

export default About 