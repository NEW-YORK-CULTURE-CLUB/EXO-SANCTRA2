'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Key, Database, Globe, Server, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Security() {
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
              <span className="text-muted-foreground">Security</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your security and privacy are our top priorities. Learn about the comprehensive security measures we implement to protect your data and assets.
            </p>

            <div className="space-y-8">
              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-semibold">Data Protection</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  We implement industry-standard encryption protocols to protect your data both in transit and at rest. All sensitive information is encrypted using AES-256 encryption, and we use TLS 1.3 for secure communications.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>End-to-end encryption for all data transmissions</li>
                  <li>Secure storage with encrypted databases</li>
                  <li>Regular security audits and penetration testing</li>
                </ul>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-semibold">Access Control</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  Multi-factor authentication and role-based access controls ensure that only authorized personnel can access sensitive information. We implement the principle of least privilege across all systems.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Two-factor authentication (2FA) for all accounts</li>
                  <li>Role-based permissions and access controls</li>
                  <li>Session management and automatic logout</li>
                </ul>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl font-semibold">Infrastructure Security</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  Our infrastructure is hosted on secure, enterprise-grade cloud platforms with multiple layers of security. We maintain redundant systems and implement disaster recovery procedures.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Secure cloud hosting with enterprise-grade security</li>
                  <li>Regular security updates and patch management</li>
                  <li>24/7 monitoring and threat detection</li>
                </ul>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-8 h-8 text-orange-600" />
                  <h2 className="text-2xl font-semibold">Privacy & Compliance</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  We adhere to strict privacy standards and comply with relevant data protection regulations. Our privacy practices are regularly reviewed and updated to meet evolving requirements.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>GDPR and CCPA compliance</li>
                  <li>Regular privacy impact assessments</li>
                  <li>Transparent data handling practices</li>
                </ul>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-8 h-8 text-red-600" />
                  <h2 className="text-2xl font-semibold">Blockchain Security</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  For blockchain-based features, we implement additional security measures to protect digital assets and ensure the integrity of smart contracts and transactions.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Secure wallet integration and management</li>
                  <li>Smart contract security audits</li>
                  <li>Transaction verification and validation</li>
                </ul>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-2xl font-semibold">Security Team</h2>
                </div>
                <p className="text-lg leading-relaxed mb-4">
                  Our dedicated security team continuously monitors threats and implements best practices. We maintain relationships with security researchers and participate in responsible disclosure programs.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Dedicated security operations center (SOC)</li>
                  <li>Regular security training for all staff</li>
                  <li>Bug bounty and responsible disclosure programs</li>
                </ul>
              </section>

              <section className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-primary">Report Security Issues</h2>
                <p className="text-lg leading-relaxed mb-4">
                  If you discover a security vulnerability, please report it to our security team immediately. We take all security reports seriously and will respond promptly.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Security Email</h3>
                    <p className="text-primary font-medium">admin@parallelworlds.us</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">PGP Key</h3>
                    <p className="text-muted-foreground">Available upon request for secure communications</p>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
