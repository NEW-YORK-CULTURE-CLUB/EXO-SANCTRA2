'use client';

import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save, Cookie, Eye, Shield, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CookieSettings() {
  const { t } = useTranslation();
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const handleToggle = (type: string) => {
    if (type === 'essential') return;
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    });
  };

  const rejectAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false
    });
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
              <Cookie className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold">
                <span className="text-muted-foreground">Cookie </span>
                <span className="text-foreground">Settings</span>
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">
              Manage your cookie preferences to control how we collect and use data to improve your experience on ExhibitIQ.
            </p>

            <div className="space-y-8">
              <section className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-lg">
                  <li>Remembering your preferences and settings</li>
                  <li>Analyzing how you use our website to improve performance</li>
                  <li>Providing personalized content and features</li>
                  <li>Ensuring security and preventing fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Cookie Categories</h2>
                
                <div className="space-y-6">
                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Essential Cookies</h3>
                          <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                        </div>
                      </div>
                      <Switch checked={cookiePreferences.essential} disabled />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and form submissions.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> Authentication, security, session management
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Analytics Cookies</h3>
                          <p className="text-sm text-muted-foreground">Help us understand how visitors interact with our website</p>
                        </div>
                      </div>
                      <Switch 
                        checked={cookiePreferences.analytics} 
                        onCheckedChange={() => handleToggle('analytics')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      These cookies collect information about how visitors use our website, such as which pages are visited most often and if users get error messages.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> Google Analytics, page views, user behavior tracking
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Eye className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Functional Cookies</h3>
                          <p className="text-sm text-muted-foreground">Enable enhanced functionality and personalization</p>
                        </div>
                      </div>
                      <Switch 
                        checked={cookiePreferences.functional} 
                        onCheckedChange={() => handleToggle('functional')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> Language preferences, region settings, user interface customization
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Cookie className="w-6 h-6 text-orange-600" />
                        <div>
                          <h3 className="text-xl font-semibold">Marketing Cookies</h3>
                          <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements and track marketing campaign performance</p>
                        </div>
                      </div>
                      <Switch 
                        checked={cookiePreferences.marketing} 
                        onCheckedChange={() => handleToggle('marketing')}
                      />
                    </div>
                    <p className="text-base leading-relaxed mb-4">
                      These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for individual users.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> Social media integration, advertising networks, remarketing
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Manage Your Preferences</h2>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button onClick={acceptAll} variant="default" size="lg">
                    Accept All Cookies
                  </Button>
                  <Button onClick={rejectAll} variant="outline" size="lg">
                    Reject Non-Essential
                  </Button>
                  <Button onClick={savePreferences} variant="secondary" size="lg" className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </Button>
                </div>

                <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Current Cookie Status</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Essential Cookies:</span>
                      <span className="font-semibold text-green-600">Always Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics Cookies:</span>
                      <span className={`font-semibold ${cookiePreferences.analytics ? 'text-green-600' : 'text-red-600'}`}>
                        {cookiePreferences.analytics ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Functional Cookies:</span>
                      <span className={`font-semibold ${cookiePreferences.functional ? 'text-green-600' : 'text-red-600'}`}>
                        {cookiePreferences.functional ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Marketing Cookies:</span>
                      <span className={`font-semibold ${cookiePreferences.marketing ? 'text-green-600' : 'text-red-600'}`}>
                        {cookiePreferences.marketing ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-muted p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p className="text-lg leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email</h3>
                    <p className="text-primary font-medium">hello@exosanctra.com</p>
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
