'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Users, Award, Globe, Shield, MapPin, Clock, Briefcase, ArrowRight, Heart, Zap, Target, Users2 } from 'lucide-react'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function Careers() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenApplication = () => {
    // TODO: Implement open application functionality
    // This could open a modal, redirect to a form, or open an email client
    console.log('Open application clicked');
    // For now, we'll redirect to contact page with a pre-filled message
    router.push('/contact?subject=Open Application&message=I am interested in joining the ExhibitIQ team. Please let me know about available opportunities.');
  };

  const handleViewPositions = () => {
    // TODO: Implement view positions functionality
    // This could scroll to positions section or show a modal with available positions
    console.log('View positions clicked');
    // For now, we'll scroll to the positions section
    const positionsSection = document.getElementById('positions');
    if (positionsSection) {
      positionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactRecruiting = () => {
    // TODO: Implement contact recruiting functionality
    console.log('Contact recruiting clicked');
    // Redirect to contact page with recruiting-specific subject
    router.push('/contact?subject=Recruiting Inquiry&message=I would like to learn more about career opportunities at ExhibitIQ.');
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-10 lg:py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?"
              alt="Careers and team background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-muted-foreground">Join </span>
                <span className="text-foreground">Our </span>
                <span className="text-muted-foreground">Growing </span>
                <span className="text-foreground">Team</span>
              </h1>
              <p className="text-muted-foreground mb-0 max-w-2xl mx-auto">
                Help us revolutionize the art world through technology. We're looking for passionate individuals who want to make a difference in how art is experienced, collected, and managed.
              </p>
            </div>
          </div>
        </section>

        {/* Company Culture Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-light mb-6 text-foreground">Why Work at ExhibitIQ?</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  At ExhibitIQ, we believe that the intersection of art and technology creates endless possibilities. Our team is driven by innovation, creativity, and a shared passion for transforming the art industry. We offer a collaborative environment where your ideas matter and your growth is prioritized.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Passion-Driven</h3>
                      <p className="text-sm text-muted-foreground">Work with people who love art and technology</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Innovation-First</h3>
                      <p className="text-sm text-muted-foreground">Build cutting-edge solutions for the art world</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Impact-Focused</h3>
                      <p className="text-sm text-muted-foreground">Make a real difference in the art industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Users2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Collaborative</h3>
                      <p className="text-sm text-muted-foreground">Work with experts across multiple disciplines</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-8 shadow-sm">
                <h3 className="text-2xl font-light mb-6 text-foreground">Perks & Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Competitive salary and equity packages</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Flexible remote work options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Health, dental, and vision insurance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Unlimited PTO and paid holidays</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Professional development budget</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Art gallery and museum memberships</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">Team events and art experiences</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section id="positions" className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light mb-6 text-foreground">Open Positions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                No positions currently available.
              </p>
              {/* <p className="text-muted-foreground max-w-2xl mx-auto">
                We're always looking for talented individuals to join our team. Browse our current openings and find the perfect role for you.
              </p> */}
            </div>
            
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  title: "Senior Full-Stack Developer",
                  department: "Engineering",
                  type: "Full-time",
                  location: "Remote / New York",
                  experience: "5+ years",
                  description: "Join our engineering team to build scalable, user-friendly applications that revolutionize how galleries and museums manage their operations.",
                  skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"]
                },
                {
                  title: "Product Manager",
                  department: "Product",
                  type: "Full-time",
                  location: "New York",
                  experience: "3+ years",
                  description: "Lead product strategy and development for our platform, working closely with customers and engineering teams to deliver exceptional user experiences.",
                  skills: ["Product Strategy", "User Research", "Agile", "Analytics", "Art Industry Knowledge"]
                },
                {
                  title: "Art Industry Specialist",
                  department: "Business Development",
                  type: "Full-time",
                  location: "Remote / Los Angeles",
                  experience: "2+ years",
                  description: "Leverage your art world expertise to help galleries and museums understand how ExhibitIQ can transform their operations.",
                  skills: ["Art History", "Gallery Operations", "Sales", "Relationship Building", "Technology Adoption"]
                },
                {
                  title: "UX/UI Designer",
                  department: "Design",
                  type: "Full-time",
                  location: "Remote",
                  experience: "3+ years",
                  description: "Create beautiful, intuitive interfaces that make complex art management tasks simple and enjoyable for our users.",
                  skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"]
                },
                {
                  title: "Marketing Manager",
                  department: "Marketing",
                  type: "Full-time",
                  location: "Remote / New York",
                  experience: "4+ years",
                  description: "Develop and execute marketing strategies to grow our brand presence and drive customer acquisition in the art world.",
                  skills: ["Digital Marketing", "Content Strategy", "Social Media", "Analytics", "B2B Marketing"]
                },
                {
                  title: "Customer Success Manager",
                  department: "Customer Success",
                  type: "Full-time",
                  location: "Remote",
                  experience: "2+ years",
                  description: "Ensure our customers achieve success with ExhibitIQ through onboarding, training, and ongoing support.",
                  skills: ["Customer Success", "Training", "Support", "Art Industry", "Technology"]
                }
              ].map((position, index) => (
                <div key={index} className="bg-card rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">{position.title}</h3>
                      <p className="text-primary font-medium text-sm mb-1">{position.department}</p>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">{position.type}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {position.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {position.experience}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{position.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-medium text-foreground mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {position.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div> */}
            
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">Don't see a position that fits? We'd still love to hear from you!</p>
              <Button 
                variant="outline" 
                size="lg" 
                className="hover:bg-accent"
                onClick={handleOpenApplication}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Redirecting...' : 'Send Open Application'}
              </Button>
            </div>
          </div>
        </section>

        {/* Application Process Section */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-12 text-center text-foreground">Our Application Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Apply",
                  description: "Submit your application with resume and portfolio. Tell us why you're excited about joining ExhibitIQ.",
                  icon: "📝"
                },
                {
                  step: "2",
                  title: "Interview",
                  description: "Meet with our team to discuss your experience, skills, and how you can contribute to our mission.",
                  icon: "🤝"
                },
                {
                  step: "3",
                  title: "Join the Team",
                  description: "Welcome aboard! We'll help you get up to speed and start making an impact from day one.",
                  icon: "🎉"
                }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{process.icon}</span>
                  </div>
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-medium">
                    {process.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{process.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light mb-6 text-foreground">Ready to Join Our Mission?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Help us revolutionize the art world through innovative technology. We're building something special, and we want you to be part of it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleViewPositions}
              >
                View All Positions
              </Button>
              <Button 
                variant="outline" 
                className="hover:bg-accent"
                onClick={handleContactRecruiting}
              >
                Contact Recruiting
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Careers
