'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTranslation } from '@/lib/i18n';

export default function ArtFeatureCards() {
  const { ref, isInView } = useScrollAnimation(0.1);
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="lg:py-14 pt-8 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="w-full">
        {/* Section Title with Logo */}
        <motion.div 
          className="text-center mb-12 px-4"
          variants={cardVariants}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Image src="/light.png" alt="Exhibit-IQ" width={200} height={200} className='w-20 h-20 dark:hidden'/>
            <Image src="/dark.png" alt="Exhibit-IQ" width={200} height={200} className='w-20 h-20 hidden dark:block'/>
            <h2 className="text-2xl lg:text-7xl font-bold">
              <span className="text-muted-foreground">{t('poweredBy')} </span>
              <span className="text-foreground">{t('exhibitIQ')}</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            {t('featureCardsSubtitle')}
          </p>
        </motion.div>

        <div className="relative">
          <motion.div 
            className="flex overflow-x-auto lg:gap-6 h-[400px] md:h-[600px] scrollbar-hide scroll-smooth lg:px-4 px-2 gap-2" 
            id="feature-scroll"
            variants={cardVariants}
          >
            {/* Section 1 - Art Global Marketplace */}
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600/80 via-gray-700/80 to-zinc-800/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-between pr-0 md:pr-6 mb-4 py-6 lg:py-12 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('globalMarketplace')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('globalMarketplaceTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('marketplaceStats')}</h3>
                      <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('globalUsers')}</span>
                        <span className="font-semibold">45.2K</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('countries')}</span>
                        <span className="text-slate-300 font-bold">127</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('monthlySales')}</span>
                        <span className="font-semibold">$2.1M</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                <div className="w-full md:w-1/2 flex items-center lg:pt-12 pt-0 justify-center">
                  <Image
                    // src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    src="/vault/pp1.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>

              {/* Section 5 - Operating System/Art Management */}
              <motion.div 
                className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-800 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
                variants={cardVariants}
              >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-800/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-between pr-0 md:pr-6 mb-4 py-6 lg:py-12 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('operatingSystem')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('operatingSystemTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('artManagement')}</h3>
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('totalArtworks')}</span>
                        <span className="font-semibold">2,847</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('activeCollections')}</span>
                        <span className="text-purple-300 font-bold">156</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('automationTasks')}</span>
                        <span className="font-semibold">89%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                <div className="w-full md:w-1/2 flex items-center lg:pt-12 pt-0 justify-center">
                  <Image
                    // src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    src="/vault/pp3.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>

       

            {/* Section 3 - Instant Settlements */}
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-rose-400 via-pink-500 to-indigo-600 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/80 via-pink-500/80 to-indigo-600/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col py-6 lg:py-12 justify-between pr-0 md:pr-6 mb-4 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('instantSettlements')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('instantSettlementsTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('paymentProcessing')}</h3>
                      <span className="text-rose-300 text-base font-bold">{t('instant')}</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('transactionSpeed')}</span>
                        <span className="font-semibold">&lt; 30 seconds</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('successRate')}</span>
                        <span className="font-semibold">99.9%</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('processingFee')}</span>
                        <span className="text-rose-300 font-bold">2.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                <div className="w-full md:w-1/2 flex items-center lg:pt-12 justify-center">
                  <Image
                    src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    // src="/vault/pp1.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>


            

            {/* Section 4 - Digital Walls */}
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/80 via-indigo-600/80 to-purple-700/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col py-6 lg:py-12 justify-between pr-0 md:pr-6 mb-4 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('digitalWalls')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('digitalWallsTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('qrCodeAccess')}</h3>
                      <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('activeQrCodes')}</span>
                        <span className="font-semibold">1,247</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('scansToday')}</span>
                        <span className="text-indigo-300 font-bold">+23%</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('galleryViews')}</span>
                        <span className="font-semibold">5.2K</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                <div className="w-full md:w-1/2 flex items-center lg:pt-12 pt-0 justify-center">
                  <Image
                    // src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    src="/vault/pp4.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>

               {/* Section 2 - Digital Vault */}
               <motion.div 
                className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
                variants={cardVariants}
              >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/80 to-teal-600/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-between pr-0 md:pr-6 mb-4 py-6 lg:py-12 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('digitalVault')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('digitalVaultTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('digitalVaultAccess')}</h3>
                      <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('vaultId')}</span>
                        <span className="font-semibold">#VAULT-2024-001</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('securityStatus')}</span>
                        <span className="text-emerald-300 font-bold">{t('protected')}</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('accessLevel')}</span>
                        <span className="text-blue-300 font-semibold">{t('premium')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                  <div className="w-full md:w-1/2 flex items-center lg:pt-12 pt-0 justify-center">
                  <Image
                    // src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    src="/vault/pp7.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>

            {/* Section 6 - Price History */}
            <motion.div 
              className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 w-[80%] min-w-[80%] rounded-2xl"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/80 to-orange-500/80"></div>
              <div className="relative z-10 px-6 md:px-12 h-full flex flex-col md:flex-row">
                {/* Left Side - Text Content (50%) */}
                <div className="w-full md:w-1/2 flex flex-col py-6 lg:py-12 justify-between pr-0 md:pr-6 mb-4 md:mb-0">
                  <div className="text-white">
                    <p className="text-xs font-medium tracking-wide uppercase mb-3 opacity-90">{t('priceHistory')}</p>
                    <h2 className="text-2xl lg:text-4xl font-bold leading-tight mb-4 hidden md:block">
                      {t('priceHistoryTitle')}
                    </h2>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl hidden md:block">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{t('artworkValuation')}</h3>
                      <span className="text-green-300 text-base font-bold">+12.5%</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('currentValue')}</span>
                        <span className="font-semibold">$45,000</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('purchasePrice')}</span>
                        <span className="font-semibold">$40,000</span>
                      </div>
                      <div className="flex justify-between text-white/80 text-sm">
                        <span>{t('appreciation')}</span>
                        <span className="text-green-300 font-bold">$5,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image (50%) */}
                <div className="w-full md:w-1/2 flex items-center lg:pt-12 pt-0 justify-center">
                  <Image
                    // src="https://cdn.prod.website-files.com/6360022338a81bd6fdbb1145/683ebb4a552463589e61ce75_hand-with-card.avif"
                    src="/vault/pp5.png"
                    alt="Hand with card"
                    width={500}
                    height={600}
                    className="rounded-2xl w-full h-full object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Glass Navigation Buttons - Left */}
          <button 
            onClick={() => {
              const container = document.getElementById('feature-scroll');
              if (container) {
                container.scrollBy({ left: -container.offsetWidth * 0.8, behavior: 'smooth' });
              }
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-full p-4 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Glass Navigation Buttons - Right */}
          <button 
            onClick={() => {
              const container = document.getElementById('feature-scroll');
              if (container) {
                container.scrollBy({ left: container.offsetWidth * 0.8, behavior: 'smooth' });
              }
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300 rounded-full p-4 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.section>
  );
} 