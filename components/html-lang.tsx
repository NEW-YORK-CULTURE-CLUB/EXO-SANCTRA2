'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function HtmlLang() {
  const { locale } = useTranslation();

  useEffect(() => {
    // Update the HTML lang attribute when locale changes
    document.documentElement.lang = locale;
  }, [locale]);

  return null; // This component doesn't render anything
}
