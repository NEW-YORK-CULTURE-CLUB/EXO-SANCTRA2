'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation' 
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import { toast } from 'sonner'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function SoulActivationOrder() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    try {
      // Save email to Firebase
      const ordersRef = collection(db, 'soul_activation_orders')
      await addDoc(ordersRef, {
        email: email.toLowerCase(),
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
        status: 'pending'
      })

      toast.success('Order submitted successfully! Check your email for next steps.')
      setEmail('')
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        
        {/* Hero Section */}
        <motion.div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/vault/bg/1.jpg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          
          <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-28">
            <div className="w-full max-w-4xl mx-auto">
              <motion.div 
                className="relative backdrop-blur-lg bg-[rgba(52,52,52,0.3)] border border-white/20 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                    Soul Activation <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Art Altar</span>
                  </h1>
                  
                  <div className="relative h-64 lg:h-96 mb-8 rounded-2xl overflow-hidden">
                    <Image
                      src="/vault/Art Altars/Altar 1.jpg"
                      alt="Soul Activation Art Altar"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-6 text-white/90 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What it is</h2>
                    <p className="text-lg leading-relaxed">
                      A Soul Activation ART ALTAR is a sacred mirror of people's true essence created through
                      Alina's alien channeling. Each artwork is a framed original drawing made with a microchip that
                      connects people directly to EXSA: unlocking their digital profile and/or interactive AR
                      experience.
                      It is an altar made to guide, protect, and remind people of who they truly are.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What you receive</h2>
                    <ul className="space-y-2 text-lg">
                      <li>• Original framed artwork of your soul, activated with a microchip that opens your EXSA profile and/or AR micro-world.</li>
                      <li>• Performance Art Activation — a ritual captured in video where Alina activates the artwork through movement.</li>
                      <li>• Written transmission — Alina's intuitive reflections on what she felt during the art process, with personal guidance on your self-exploration journey.</li>
                      <li>• Sacred phrase — a secret message inscribed within the artwork, a mantra for your spirit.</li>
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">The Process</h2>
                    <ol className="space-y-2 text-lg list-decimal list-inside">
                      <li>Fill out a short questionnaire before creation</li>
                      <li>Alina reads your answers, then enters her alien state of flow, scanning your soul and energy</li>
                      <li>Intuitive visuals come into her spirit and are translated onto paper</li>
                      <li>The artwork becomes your personal altar</li>
                      <li>You receive your artwork that serves as a daily tool for self-discovery, empowerment, and protection</li>
                    </ol>
                  </div>
                </div>

                <div className="bg-purple-500/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Ready to begin?</h3>
                  <p className="text-white/90 mb-4">
                    Fill out the questionnaire to start your journey:
                  </p>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfpbG7Nuc22-iPjlaVQsoV0yEn67je7kXlsifL0lI4Nj6iL9Q/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 underline"
                  >
                    Open Questionnaire <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Enter your email address to receive updates:
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-3 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="text-center mt-8">
                  <Button 
                    variant="outline"
                    className="border-white/30 bg-transparent text-white rounded-full px-6 py-3"
                    onClick={() => router.push('/personal-universe')}
                  >
                    Back to My Universe
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

export default SoulActivationOrder

