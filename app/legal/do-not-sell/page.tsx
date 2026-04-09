'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Eye, X, Check, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DoNotSell() {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState({
    dataSharing: false,
    marketing: false,
    analytics: false,
    thirdParty: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [reset, setReset] = useState(false);

  const handleToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const handleSubmit = () => {
    // Save preferences to localStorage or send to backend
    localStorage.setItem('doNotSellPreferences', JSON.stringify(preferences));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleReset = () => {
    setPreferences({
      dataSharing: false,
      marketing: false,
      analytics: false,
      thirdParty: false
    });
    setReset(true);
    setTimeout(() => setReset(false), 3000);
  };

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
            <div className="flex items-center gap-3 mb-8">
              <Shield className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">
                <span className="text-muted-foreground">Do Not Sell My </span>
                <span className="text-foreground">Personal Information</span>
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              Under the California Consumer Privacy Act (CCPA) and other privacy laws, you have the right to opt out of the "sale" of your personal information. Use this page to manage your data sharing preferences.
            </p>

            <div className="space-y-8">
              <section className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">What This Means</h2>
                <p className="text-lg leading-relaxed mb-4">
                  The CCPA defines "selling" personal information broadly to include sharing, disclosing, or making available personal information to a third party for monetary or other valuable consideration. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Sharing data with advertising partners</li>
                  <li>Providing information to analytics services</li>
                  <li>Making data available to third-party service providers</li>
                  <li>Sharing information for marketing purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Your Data Sharing Preferences</h2>
                
                <div className="space-y-6">
                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Eye className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Data Sharing with Third Parties</h3>
                          <p className="text-sm text-muted-foreground">Allow sharing of your data with third-party service providers</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.dataSharing} 
                        onCheckedChange={() => handleToggle('dataSharing')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      This includes sharing data with payment processors, analytics services, and other third-party providers necessary for our services.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Current Status:</strong> {preferences.dataSharing ? 'Sharing Enabled' : 'Sharing Disabled'}
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Marketing Communications</h3>
                          <p className="text-sm text-muted-foreground">Allow us to use your data for marketing purposes</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.marketing} 
                        onCheckedChange={() => handleToggle('marketing')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      This includes sending promotional emails, targeted advertisements, and other marketing communications.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Current Status:</strong> {preferences.marketing ? 'Marketing Enabled' : 'Marketing Disabled'}
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Analytics and Research</h3>
                          <p className="text-sm text-muted-foreground">Allow us to use your data for analytics and research</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.analytics} 
                        onCheckedChange={() => handleToggle('analytics')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      This includes using your data to improve our services, analyze usage patterns, and conduct research.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Current Status:</strong> {preferences.analytics ? 'Analytics Enabled' : 'Analytics Disabled'}
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <X className="w-6 h-6 text-red-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Third-Party Advertising</h3>
                          <p className="text-sm text-muted-foreground">Allow third-party advertising networks to access your data</p>
                        </div>
                      </div>
                      <Switch 
                        checked={preferences.thirdParty} 
                        onCheckedChange={() => handleToggle('thirdParty')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      This includes allowing advertising networks and partners to use your data for targeted advertising.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Current Status:</strong> {preferences.thirdParty ? 'Third-Party Ads Enabled' : 'Third-Party Ads Disabled'}
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Manage Your Preferences</h2>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button onClick={handleSubmit} variant="default" size="lg" className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Save Preferences
                  </Button>
                  <Button onClick={handleReset} variant="outline" size="lg" className="flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Reset to Defaults
                  </Button>
                </div>

                {submitted && (
                  <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Your preferences have been saved successfully!</span>
                    </div>
                  </div>
                )}

                {reset && (
                  <div className="bg-blue-100 border border-blue-200 text-blue-800 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      <span>Your preferences have been reset to defaults!</span>
                    </div>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Important Notes</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Opting out of data sharing may affect some features and services</li>
                    <li>• We will still collect and use data necessary for providing our core services</li>
                    <li>• Your preferences will be applied to future data collection and sharing</li>
                    <li>• You can change these preferences at any time</li>
                  </ul>
                </div>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-lg leading-relaxed mb-4">
                  If you have questions about your privacy rights or need help managing your preferences, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Privacy Team</h3>
                    <p className="text-primary font-medium">admin@parallelworlds.us</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">
                      Parallel Worlds, Inc.<br />
                      16192 Coastal Highway<br />
                      Lewes, Delaware 19958
                    </p>
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
