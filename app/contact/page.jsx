'use client';

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    // Pre-fill form with URL parameters
    const subject = searchParams.get('subject');
    const message = searchParams.get('message');
    
    if (subject) {
      setFormData(prev => ({ ...prev, subject }));
    }
    if (message) {
      setFormData(prev => ({ ...prev, message }));
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-8 shadow-sm">
      <h3 className="text-2xl font-light mb-6 text-foreground">Send us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Your last name"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">Company/Organization</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Your company or organization"
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select a subject</option>
            <option value="demo">Request a Demo</option>
            <option value="pricing">Pricing Information</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership Opportunities</option>
            <option value="careers">Career Opportunities</option>
            <option value="recruiting">Recruiting Inquiry</option>
            <option value="open-application">Open Application</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Tell us how we can help you..."
          ></textarea>
        </div>
        
        {submitMessage && (
          <div className={`text-sm p-3 rounded-lg ${
            submitMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {submitMessage}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}

function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-muted to-muted/50 py-10 lg:py-16 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?"
              alt="Contact and communication background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-muted/90 via-muted/80 to-muted/60"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-muted-foreground">Contact </span>
                <span className="text-foreground">Us</span>
              </h1>
              <p className="text-muted-foreground mb-0 max-w-2xl mx-auto">
                Ready to transform your art business? Get in touch with our team to learn how ExhibitIQ can help you modernize your operations and enhance audience engagement.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-light mb-6 text-foreground">Get in Touch</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Whether you're a gallery looking to streamline operations, an artist seeking better exposure, or a collector wanting to enhance your experience, we're here to help. Our team of art industry experts is ready to answer your questions and guide you through the ExhibitIQ platform.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground">admin@parallelworlds.us</p>
                      <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground">+1 347-746-6990</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Office</h3>
                      <p className="text-muted-foreground">16192 Coastal Highway<br />
                      Lewes, Delaware 19958</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                      <p className="text-sm text-muted-foreground">Weekend appointments available by request</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Suspense fallback={<div className="bg-card rounded-xl p-8 shadow-sm"><div className="animate-pulse">Loading form...</div></div>}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Team Contact Section */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light mb-12 text-center text-foreground">Connect with Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Brian R. Yurachek",
                  role: "Partner & Chief Executive Officer",
                  email: "brian@exhibitiq.art",
                  phone: "+1 347-746-6990",
                  image: "/vault/brian.jpg"
                },
                {
                  name: "Lily Primamore",
                  role: "Partner & Chief Revenue Officer",
                  email: "lily@exhibitiq.art",
                  phone: "+1 347-746-6990",
                  image: "/vault/lily.jpg"
                },
                {
                  name: "Patrick Leonard",
                  role: "SVP, Business Development",
                  email: "patrick@exhibitiq.art",
                  phone: "+1 347-746-6990",
                  image: "/vault/patrick.png"
                },
                {
                  name: "Risa Oze",
                  role: "Partner & Advisor",
                  email: "risa@exhibitiq.art",
                  phone: "+1 347-746-6990",
                  image: "/vault/risa.jpg"
                }
              ].map((member, index) => (
                <div key={index} className="bg-card rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-white mb-4 shadow-md mx-auto"
                  />
                  <h3 className="font-semibold mb-1 text-foreground text-sm">{member.name}</h3>
                  <p className="text-xs text-primary mb-3 font-semibold">{member.role}</p>
                  <div className="space-y-2 text-xs">
                    <p className="text-muted-foreground">{member.email}</p>
                    <p className="text-muted-foreground">{member.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-light mb-6 text-foreground">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the growing number of galleries, museums, and art professionals who are already transforming their operations with ExhibitIQ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Request a Demo
                </Button>
                <Button variant="outline" className="hover:bg-accent">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </>
  )
}

export default Contact
