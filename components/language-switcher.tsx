'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const LanguageSwitcher = () => {
  const { locale, changeLocale, t, availableLocales } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languageFlags = {
    en: '🇺🇸',
    zh: '🇨🇳',
    es: '🇪🇸',
    fr: '🇫🇷',
    ar: '🇸🇦',
    hi: '🇮🇳',
    nl: '🇳🇱',
  };

  const languageNames = {
    en: 'English',
    zh: '中文',
    es: 'Español',
    fr: 'Français',
    hi: 'हिंदी',
    ar: 'العربية',
    nl: 'Dutch',
  };

  const handleLanguageChange = (newLocale: string) => {
    changeLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <span
            // variant="ghost"
          // size="sm"
          className="flex items-center cursor-pointer hover:bg-transparent"
        >
          <Globe className="h-4 w-4" />
          <span className="text-lg ml-1">{languageFlags[locale as keyof typeof languageFlags]}</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-none">
        {availableLocales.map((lang: string) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{languageFlags[lang as keyof typeof languageFlags]}</span>
              <span className="text-sm">{languageNames[lang as keyof typeof languageNames]}</span>
            </span>
            {locale === lang && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
