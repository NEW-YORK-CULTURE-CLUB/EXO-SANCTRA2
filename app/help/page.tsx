'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, HelpCircle, MessageCircle, BookOpen, Video, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HelpCenter() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner and fill in your details. You can also sign up using your Google or Apple account for convenience.'
        },
        {
          question: 'What are the different user types?',
          answer: 'We support Artists, Galleries, Collectors, and Patrons. Each type has access to different features and tools tailored to their needs.'
        },
        {
          question: 'How do I verify my account?',
          answer: 'After signing up, check your email for a verification link. You may also need to provide additional documentation depending on your user type.'
        }
      ]
    },
    {
      title: 'Artwork Management',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          question: 'How do I upload artwork?',
          answer: 'Go to your dashboard and click "Add Artwork". You can upload images, add descriptions, set prices, and configure blockchain settings.'
        },
        {
          question: 'What file formats are supported?',
          answer: 'We support JPEG, PNG, WebP, and TIFF formats. For 3D models, we support GLB, GLTF, and OBJ files.'
        },
        {
          question: 'How do I set pricing for my artwork?',
          answer: 'You can set fixed prices, auction starting bids, or reserve prices. You can also enable dynamic pricing based on market demand.'
        }
      ]
    },
    {
      title: 'Transactions & Payments',
      icon: <MessageCircle className="w-5 h-5" />,
      items: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept credit cards, bank transfers, and various cryptocurrencies including Bitcoin, Ethereum, and our native token.'
        },
        {
          question: 'How do I track my transactions?',
          answer: 'All transactions are visible in your wallet dashboard. You can view transaction history, pending payments, and download receipts.'
        },
        {
          question: 'What are the transaction fees?',
          answer: 'Fees vary by transaction type and payment method. Standard platform fees are 2.5% for sales and 1% for transfers.'
        }
      ]
    },
    {
      title: 'Digital Vault & Blockchain',
      icon: <Video className="w-5 h-5" />,
      items: [
        {
          question: 'How does the digital vault work?',
          answer: 'The digital vault securely stores high-resolution images and metadata on blockchain networks, ensuring authenticity and provenance.'
        },
        {
          question: 'What blockchain networks are supported?',
          answer: 'We support Ethereum, Polygon, Solana, and other major networks. You can choose which network to use for each artwork.'
        },
        {
          question: 'How do I access my digital assets?',
          answer: 'Digital assets are accessible through your wallet and can be viewed, transferred, or sold through our marketplace.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: <HelpCircle className="w-5 h-5" />,
      items: [
        {
          question: 'What browsers are supported?',
          answer: 'We support Chrome, Firefox, Safari, and Edge. For the best experience, use the latest version of your browser.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Use the "Report Issue" button in the help menu or email our support team with details about the problem you encountered.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'Yes, we have mobile apps for iOS and Android. You can download them from the App Store or Google Play Store.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-muted-foreground">Help </span>
                <span className="text-foreground">Center</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions, learn how to use our platform, and get the support you need.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Button variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-3">
                <MessageCircle className="w-8 h-8" />
                <span>Live Chat</span>
              </Button>
              <Button variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-3">
                <Mail className="w-8 h-8" />
                <span>Email Support</span>
              </Button>
              <Button variant="outline" size="lg" className="h-24 flex flex-col items-center justify-center gap-3">
                <Phone className="w-8 h-8" />
                <span>Phone Support</span>
              </Button>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {filteredFAQs.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    {category.icon}
                    <h2 className="text-2xl font-semibold">{category.title}</h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <span className="font-medium">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-8 mt-12 text-center"
            >
              <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our support team is here to help you with any questions or issues you may have.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="default" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Start Live Chat
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Email
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call Us
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
