// Language detection and utility functions

// Get browser language
export const getBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0];
  
  // Map browser language codes to our supported languages
  const languageMap = {
    'en': 'en',
    'zh': 'zh',
    'es': 'es',
    'fr': 'fr',
    'ar': 'ar',
    'hi': 'hi',
    'nl': 'nl',
  };
  
  return languageMap[langCode] || 'en';
};

// Get user's preferred language from various sources
export const getUserPreferredLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  // Check localStorage first
  const savedLang = localStorage.getItem('locale');
  if (savedLang) return savedLang;
  
  // Check browser language
  const browserLang = getBrowserLanguage();
  if (browserLang !== 'en') return browserLang;
  
  // Check Accept-Language header (if available)
  const acceptLang = navigator.languages?.[0];
  if (acceptLang) {
    const langCode = acceptLang.split('-')[0];
    const languageMap = {
      'en': 'en',
      'zh': 'zh',
      'es': 'es',
      'fr': 'fr',
      'ar': 'ar',
      'hi': 'hi',
      'nl': 'nl',
    };
    if (languageMap[langCode]) return languageMap[langCode];
  }
  
  return 'en';
};

// Format date according to locale
export const formatDate = (date, locale = 'en') => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  try {
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    // Fallback to English if locale is not supported
    return dateObj.toLocaleDateString('en', options);
  }
};

// Format number according to locale
export const formatNumber = (number, locale = 'en') => {
  if (typeof number !== 'number') return number;
  
  try {
    return number.toLocaleString(locale);
  } catch (error) {
    // Fallback to English if locale is not supported
    return number.toLocaleString('en');
  }
};

// Format currency according to locale
export const formatCurrency = (amount, currency = 'USD', locale = 'en') => {
  if (typeof amount !== 'number') return amount;
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to English if locale is not supported
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
};

// Get language display name
export const getLanguageDisplayName = (locale) => {
  const languageNames = {
    en: 'English',
    zh: '中文',
    es: 'Español',
    fr: 'Français',
    ar: 'العربية',
    hi: 'हिंदी',
    nl: 'Nederlands',
  };
  
  return languageNames[locale] || locale;
};

// Check if language is RTL
export const isRTL = (locale) => {
  return locale === 'ar';
};

// Get text direction
export const getTextDirection = (locale) => {
  return isRTL(locale) ? 'rtl' : 'ltr';
};

// Get language flag emoji (for UI display)
export const getLanguageFlag = (locale) => {
  const flagMap = {
    en: '🇺🇸',
    zh: '🇨🇳',
    es: '🇪🇸',
    fr: '🇫🇷',
    ar: '🇸🇦',
    hi: '🇮🇳',
    nl: '🇳🇱',
  };
  
  return flagMap[locale] || '🌐';
};

// Validate locale
export const isValidLocale = (locale) => {
  const validLocales = ['en', 'zh', 'es', 'fr', 'ar', 'hi', 'nl'];
  return validLocales.includes(locale);
};

// Get fallback locale
export const getFallbackLocale = (locale) => {
  if (isValidLocale(locale)) return locale;
  return 'en';
};

// Parse Accept-Language header
export const parseAcceptLanguage = (acceptLanguage) => {
  if (!acceptLanguage) return [];
  
  return acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality = '1'] = lang.trim().split(';q=');
      return {
        code: code.split('-')[0],
        quality: parseFloat(quality),
      };
    })
    .sort((a, b) => b.quality - a.quality)
    .map(lang => lang.code);
};

// Get supported languages with metadata
export const getSupportedLanguages = () => {
  return [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false,
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      flag: '🇮🇳',
      rtl: false,
    },
    {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      flag: '🇳🇱',
      rtl: false,
    },
  ];
};

// Detect if user is in a region that commonly uses a specific language
export const detectRegionalLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Map timezones to likely languages
  const timezoneLanguageMap = {
    'Asia/Shanghai': 'zh',
    'Asia/Hong_Kong': 'zh',
    'Asia/Taipei': 'zh',
    'Asia/Seoul': 'ko', // Not supported, fallback to en
    'Asia/Tokyo': 'ja', // Not supported, fallback to en
    'Europe/Madrid': 'es',
    'Europe/Paris': 'fr',
    'Europe/Amsterdam': 'nl',
    'Asia/Riyadh': 'ar',
    'Asia/Dubai': 'ar',
    'Asia/Kolkata': 'hi',
    'America/Mexico_City': 'es',
    'America/Argentina/Buenos_Aires': 'es',
    'America/Sao_Paulo': 'pt', // Not supported, fallback to en
  };
  
  const detectedLang = timezoneLanguageMap[timezone];
  if (detectedLang && isValidLocale(detectedLang)) {
    return detectedLang;
  }
  
  return 'en';
};

// Get language suggestions based on user's location and preferences
export const getLanguageSuggestions = () => {
  const browserLang = getBrowserLanguage();
  const regionalLang = detectRegionalLanguage();
  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
  
  const suggestions = [];
  
  // Add saved language first if it exists
  if (savedLang && isValidLocale(savedLang)) {
    suggestions.push(savedLang);
  }
  
  // Add browser language if different from saved
  if (browserLang !== savedLang && isValidLocale(browserLang)) {
    suggestions.push(browserLang);
  }
  
  // Add regional language if different from previous suggestions
  if (regionalLang !== savedLang && regionalLang !== browserLang && isValidLocale(regionalLang)) {
    suggestions.push(regionalLang);
  }
  
  // Add English as fallback
  if (!suggestions.includes('en')) {
    suggestions.push('en');
  }
  
  return suggestions;
};
