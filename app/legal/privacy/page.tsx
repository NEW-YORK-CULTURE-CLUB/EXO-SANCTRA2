'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <h1 className="text-4xl font-bold mb-8">
              <span className="text-muted-foreground">Privacy </span>
              <span className="text-foreground">Policy</span>
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Last updated:</strong> August 14, 2025
            </p>
            
            <p className="mb-6">
              At Parallel Worlds, Inc. ("Parallel Worlds," "we," "us," or "our") we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and disclose information and data when you use the ExhibitIQ website and web application (collectively, the "Site") and the ExhibitIQ platform, software, and related services (collectively, the "Services").
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What Personal Data We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">1. Information you provide to us</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Account registration</strong> – Email address and basic profile information to establish an account.</li>
              <li><strong>Optional service information</strong> – Additional details you provide when using specific features, requesting enhanced Services, or participating in optional functions.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2. Information collected automatically</h3>
            <p className="mb-4">When you access or use our Site or Services, we automatically collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address, browser type, device type, operating system, referral URLs, and device identifiers</li>
              <li>Usage data such as pages viewed, time on page, click paths, and interaction logs</li>
              <li>For logged-in users, activity associated with your account</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3. Transaction and payment information</h3>
            <p className="mb-4">
              We do not store credit card details. Payment processing is handled by secure third-party providers (e.g., Stripe) in accordance with their privacy practices.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Personal Data</h2>
            <p className="mb-4">We process your data to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and operate the Services</li>
              <li>Authenticate account access and maintain security</li>
              <li>Facilitate transactions and payment processing</li>
              <li>Communicate about your account, the Site, or Services</li>
              <li>Improve platform functionality, performance, and usability</li>
              <li>Detect, prevent, and investigate fraud or abuse</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing and Disclosure</h2>
            <p className="mb-4">
              We do not sell personal information. We may share data with payment processors and technical service providers necessary to operate the Services, with analytics providers to improve platform performance, in response to legal requests, or to protect security and safety.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Privacy Choices</h2>
            <p className="mb-4">You can:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access, update, or delete your personal data via account settings or by contacting us</li>
              <li>Opt out of marketing communications via unsubscribe links or settings</li>
              <li>Manage cookie and tracking preferences through your browser settings</li>
              <li>Request account deletion by emailing hello@exosanctra.com</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="mb-4">
              We implement industry-standard measures to safeguard personal data, including encryption, access controls, and secure hosting environments. While we take reasonable precautions, no system is entirely immune from unauthorized access or breaches.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
            <p className="mb-4">
              This Privacy Policy and any disputes related to it are governed by the laws of the State of New York, without regard to its conflict of law principles. Any legal actions must be brought exclusively in the state and federal courts located in New York County, New York.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="mb-4">
              <strong>Parallel Worlds, Inc.</strong><br />
              16192 Coastal Highway<br />
              Lewes, Delaware 19958<br />
              Email: hello@exosanctra.com
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
