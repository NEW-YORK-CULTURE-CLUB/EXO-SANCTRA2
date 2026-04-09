'use client';

import React from 'react'
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion'
import { FaFacebookF, FaXTwitter, FaInstagram, FaPinterestP, FaWeixin, FaWeibo, FaYoutube, FaLinkedin, FaTiktok } from 'react-icons/fa6'
import { useTranslation } from '@/lib/i18n'
import Link from 'next/link'

function Footer() {
  const { ref, isInView } = useScrollAnimation(0.1);
  const { t } = useTranslation();

  return (
    <motion.footer 
      ref={ref}
      className="bg-card text-card-foreground py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Accordion type="multiple" className="border-none bg-transparent">
          <AccordionItem value="privacy">
            <AccordionTrigger className="text-lg font-semibold">{t('legal')}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/legal/terms" className="block w-full">{t('termsAndConditions')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/legal/privacy" className="block w-full">{t('privacy')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/legal/security" className="block w-full">{t('security')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/legal/cookies" className="block w-full">{t('cookieSettings')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/legal/do-not-sell" className="block w-full">{t('doNotSellPersonalInfo')}</Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="help">
            <AccordionTrigger className="text-lg font-semibold">{t('help')}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/contact" className="block w-full">{t('contactUs')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/help" className="block w-full">{t('helpCenter')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/community" className="block w-full">{t('community')}</Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="about">
            <AccordionTrigger className="text-lg font-semibold">{t('aboutUs')}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/about" className="block w-full">{t('whoWeAre')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/about" className="block w-full">{t('ourMission')}</Link>
                </li>
                <li className="hover:text-foreground cursor-pointer transition-colors">
                  <Link href="/about" className="block w-full">{t('ourValues')}</Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>


        {/* Social Media Icons */}
        <div className="flex justify-center space-x-5 mt-8 mb-4">
          <a href="https://x.com/exosanctra" aria-label="X" className="hover:text-foreground transition-colors">
            <FaXTwitter size={18} />
          </a>
          <a href="https://www.linkedin.com/company/exo-sanctra" aria-label="LinkedIn" className="hover:text-foreground transition-colors">
            <FaLinkedin size={18} />
          </a>
          <a href="https://www.tiktok.com/@exosanctra" aria-label="TikTok" className="hover:text-foreground transition-colors">
            <FaTiktok size={18} />
          </a>
          <a href="https://www.instagram.com/exosanctra/" aria-label="Instagram" className="hover:text-foreground transition-colors">
            <FaInstagram size={18} />
          </a>
          <a href="https://www.youtube.com/@exosanctra" aria-label="YouTube" className="hover:text-foreground transition-colors">
            <FaYoutube size={18} />
          </a>
          <a href="https://www.facebook.com/exosanctra/" aria-label="Facebook" className="hover:text-foreground transition-colors">
            <FaFacebookF size={18} />
          </a>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-8 pt-6 text-center text-xs text-muted-foreground">
          {t('copyright')}
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer 