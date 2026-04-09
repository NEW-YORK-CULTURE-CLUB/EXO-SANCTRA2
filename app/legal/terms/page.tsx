'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-8">
                <span className="text-muted-foreground">Terms of </span>
                <span className="text-foreground">Service</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <p className="text-muted-foreground mb-8 text-center text-lg">
              <strong>Last Updated:</strong> August 14, 2025
            </p>
            
            <p className="mb-6">
              These Terms of Service ("Terms") govern your access to and use of the websites, applications, software, and services provided by Parallel Worlds, Inc. ("Parallel Worlds," "we," "us," or our), including ExhibitIQ, all associated domains, intellectual property, blockchain integrations, and related services (collectively, the "Services").
            </p>

            <p className="mb-6">
              By accessing or using the Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, you may not use the Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">1. Eligibility</h2>
            <p className="mb-4">
              You must be at least 18 years old or the legal age of majority in your jurisdiction. By using the Services, you represent and warrant that you meet these requirements and have the authority to enter into these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">2. Account Registration</h2>
            <p className="mb-4">
              To access certain features, you may be required to register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your credentials</li>
              <li>Be responsible for all activity under your account</li>
            </ul>
            <p className="mb-4">
              We may suspend or terminate accounts that violate these Terms or are used for unlawful purposes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">3. Acceptable Use</h2>
            <p className="mb-4">
              You agree not to use the Services to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Upload or distribute stolen, counterfeit, or infringing works</li>
              <li>Misrepresent authorship, provenance, or ownership of any asset</li>
              <li>Commit fraud or engage in deceptive practices</li>
              <li>Upload malicious code or attempt to gain unauthorized system access</li>
              <li>Violate any applicable art-market, export/import, or cultural property laws</li>
            </ul>
            <p className="mb-4">
              We reserve the right to remove or restrict content and accounts at our discretion.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">4. Intellectual Property</h2>
            <p className="mb-4">
              All content, features, and functionality of the Services — including text, graphics, logos, icons, images, software, and trademarks — are the exclusive property of Parallel Worlds, Inc. or its licensors.
            </p>
            <p className="mb-4">
              You retain ownership of any artwork, images, or metadata you upload ("User Content"), but you grant Parallel Worlds a non-exclusive, worldwide, royalty-free license to store, display, transmit, and reproduce such content as necessary to operate, promote, and improve the Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">5. Blockchain-Specific Terms</h2>
            <p className="mb-4">
              The Services may interact with public blockchain networks. We have no control over these networks and cannot guarantee their availability, performance, or security. All blockchain transactions are final and irreversible.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">6. Payment and Fees</h2>
            <p className="mb-4">
              We charge transaction-related fees on the movement of physical and digital assets through the Services. For blockchain-based assets, we may be included as a beneficiary in smart contracts governing such assets.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">7. Service Availability</h2>
            <p className="mb-4">
              We strive for high availability but do not guarantee uninterrupted access. We may suspend Services for maintenance, updates, or security reasons.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">8. Compliance and Indemnification</h2>
            <p className="mb-4">
              You agree to comply with all applicable laws and indemnify Parallel Worlds, Inc. from any claims arising from your use of the Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Parallel Worlds, Inc. will not be liable for any indirect, incidental, consequential, special, or punitive damages.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">10. Governing Law</h2>
            <p className="mb-4">
              These Terms are governed by the laws of the State of New York, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-primary">11. Contact Information</h2>
            <p className="mb-4">
              <strong>Parallel Worlds, Inc.</strong><br />
              16192 Coastal Highway<br />
              Lewes, Delaware 19958<br />
              Email: admin@parallelworlds.us
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
