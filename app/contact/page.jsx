'use client';

import React, { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Mail, Send } from 'lucide-react'
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
      <h3 className="text-2xl font-light mb-6 text-foreground">Send a Message</h3>
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
              <h1 className="text-4xl lg:text-5xl font-bold mb-0 text-foreground tracking-tight">
                GET IN TOUCH
              </h1>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <p className="text-lg text-foreground font-light leading-relaxed">
                  If you feel the connection - follow it.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you&apos;re a collector, looking to collaborate, have a special request, or simply want to learn more about the artworks or the universe, you can reach out here.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Alina, creator of EXO SANCTRA, will personally review your message and get back to you.
                </p>

                <div className="space-y-6 pt-2">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <a
                        href="mailto:hello@exosanctra.com"
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        hello@exosanctra.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        For general inquiries and notifications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <a
                        href="mailto:alinaalien.creator@exosanctra.com"
                        className="font-medium text-foreground hover:text-primary transition-colors break-all"
                      >
                        alinaalien.creator@exosanctra.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        For artwork-related inquiries
                      </p>
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
