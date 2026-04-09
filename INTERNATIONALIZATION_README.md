# Internationalization (i18n) Implementation

This document describes the comprehensive internationalization system implemented for the ExhibitIQ application, supporting multiple languages with proper RTL support and localization features.

## Supported Languages

The application supports the following languages:

1. **English (en)** - Default language
2. **Chinese (zh)** - 中文
3. **Spanish (es)** - Español
4. **French (fr)** - Français
5. **Arabic (ar)** - العربية (RTL support)
6. **Hindi (hi)** - हिंदी
7. **Dutch (nl)** - Nederlands

## Features

### 🌍 Multi-language Support
- Complete translation coverage for all UI elements
- Dynamic language switching without page reload
- Persistent language preference storage
- Automatic language detection based on browser settings

### 📱 RTL Language Support
- Full right-to-left (RTL) support for Arabic
- Automatic layout adjustments for RTL languages
- Proper text alignment and positioning
- RTL-aware component layouts

### 🔧 Smart Language Detection
- Browser language detection
- Regional language detection based on timezone
- User preference persistence
- Fallback to English for unsupported languages

### 🎨 UI Components
- Language switcher dropdown in navigation
- Flag emojis for visual language identification
- Native language names in language selector
- Responsive design for all language content

## Implementation Details

### Core Files

#### `lib/i18n.js`
Main internationalization library containing:
- Translation data for all supported languages
- React context for language management
- Language switching functionality
- RTL support integration

#### `lib/language-utils.js`
Utility functions for:
- Language detection and validation
- Date, number, and currency formatting
- RTL language identification
- Regional language detection

#### `components/language-switcher.tsx`
Language selection component with:
- Dropdown menu for language selection
- Visual indicators for current language
- Flag emojis and native language names
- Smooth language switching

#### `styles/i18n.css`
CSS styles for:
- RTL layout adjustments
- Language-specific font configurations
- Responsive design for different languages
- Animation and transition support

### Configuration

#### Next.js Configuration
The `next.config.mjs` file includes i18n configuration:

```javascript
i18n: {
  locales: ['en', 'zh', 'es', 'fr', 'ar', 'hi', 'nl'],
  defaultLocale: 'en',
  localeDetection: true,
}
```

#### Root Layout Integration
The `I18nProvider` wraps the entire application in `app/layout.tsx`:

```jsx
<I18nProvider>
  <ThemeProvider>
    {/* Rest of the app */}
  </ThemeProvider>
</I18nProvider>
```

## Usage

### Basic Translation

```jsx
import { useTranslation } from '@/lib/i18n';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home')}</h1>
      <p>{t('heroSubtitle')}</p>
    </div>
  );
}
```

### Language Switching

```jsx
import { useTranslation } from '@/lib/i18n';

function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslation();
  
  const handleLanguageChange = (newLocale) => {
    changeLocale(newLocale);
  };
  
  return (
    <select value={locale} onChange={(e) => handleLanguageChange(e.target.value)}>
      <option value="en">English</option>
      <option value="zh">中文</option>
      <option value="es">Español</option>
      {/* ... other languages */}
    </select>
  );
}
```

### RTL Support

```jsx
import { useTranslation } from '@/lib/i18n';

function RTLComponent() {
  const { isRTL } = useTranslation();
  
  return (
    <div className={isRTL ? 'rtl-layout' : 'ltr-layout'}>
      {/* Content that adapts to text direction */}
    </div>
  );
}
```

## Translation Structure

### Navigation
- `home`, `about`, `services`, `gallery`, `contact`
- `dashboard`, `profile`, `settings`, `logout`
- `login`, `signup`

### Home Page
- `heroTitle`, `heroSubtitle`
- `getStarted`, `learnMore`, `discoverArt`
- `featuredArtists`, `featuredArtworks`
- `viewAll`, `exploreMarketplace`

### Common Actions
- `save`, `cancel`, `edit`, `delete`
- `add`, `remove`, `search`, `filter`
- `sort`, `view`, `download`, `upload`

### Forms
- `email`, `password`, `confirmPassword`
- `firstName`, `lastName`, `phone`, `address`
- `city`, `country`, `submit`, `loading`

### Messages
- `success`, `error`, `warning`, `info`
- `confirm`, `areYouSure`, `yes`, `no`

### Art Related
- `artwork`, `artist`, `title`, `description`
- `medium`, `dimensions`, `year`, `price`
- `category`, `tags`

### Gallery Management
- `inventory`, `analytics`, `visitors`
- `sales`, `events`, `exhibitions`

## Adding New Languages

### 1. Add Translation Data
Add new language translations to `lib/i18n.js`:

```javascript
const translations = {
  // ... existing languages
  newLang: {
    home: 'New Language Home',
    about: 'New Language About',
    // ... all other keys
  }
};
```

### 2. Update Configuration
Add the new language code to `next.config.mjs`:

```javascript
i18n: {
  locales: ['en', 'zh', 'es', 'fr', 'ar', 'hi', 'nl', 'newLang'],
  defaultLocale: 'en',
  localeDetection: true,
}
```

### 3. Update Utilities
Add language metadata to `lib/language-utils.js`:

```javascript
export const getSupportedLanguages = () => {
  return [
    // ... existing languages
    {
      code: 'newLang',
      name: 'New Language',
      nativeName: 'Native Name',
      flag: '🏳️',
      rtl: false, // or true for RTL languages
    },
  ];
};
```

### 4. Add RTL Support (if needed)
If the new language is RTL, update the `isRTL` function:

```javascript
export const isRTL = (locale) => {
  return ['ar', 'newLang'].includes(locale);
};
```

## Best Practices

### 1. Translation Keys
- Use descriptive, hierarchical keys
- Keep keys consistent across components
- Use lowercase with camelCase for compound keys
- Group related translations together

### 2. Text Content
- Avoid hardcoded strings in components
- Use translation keys for all user-facing text
- Provide context for translators when needed
- Consider text length variations between languages

### 3. RTL Considerations
- Test layouts with RTL languages
- Use CSS logical properties when possible
- Ensure proper text alignment and positioning
- Test navigation and component layouts

### 4. Performance
- Lazy load language-specific content when possible
- Use efficient language detection
- Minimize re-renders during language switches
- Cache translation data appropriately

## Testing

### Language Switching
- Test switching between all supported languages
- Verify RTL layout for Arabic
- Check text alignment and positioning
- Test component layouts in different languages

### Content Display
- Verify all text is properly translated
- Check for missing translations
- Test with long text content
- Verify proper fallback to English

### Responsive Design
- Test language switcher on mobile devices
- Verify RTL layouts on different screen sizes
- Check component behavior across breakpoints
- Test navigation in all languages

## Troubleshooting

### Common Issues

#### Missing Translations
- Check if translation key exists in all languages
- Verify key spelling and case
- Ensure fallback to English works

#### RTL Layout Problems
- Check CSS direction properties
- Verify RTL-specific styles are applied
- Test with Arabic language enabled

#### Language Detection Issues
- Clear localStorage and test browser detection
- Verify Accept-Language header parsing
- Check timezone-based detection

#### Performance Issues
- Monitor re-render frequency during language switches
- Check for unnecessary component updates
- Verify efficient translation lookup

### Debug Tools

#### Browser DevTools
- Check `document.documentElement.dir` for RTL
- Monitor localStorage for language persistence
- Verify CSS custom properties for spacing

#### React DevTools
- Monitor context updates during language changes
- Check component re-render patterns
- Verify translation function calls

## Future Enhancements

### Planned Features
- Server-side language detection
- Dynamic translation loading
- Translation management interface
- User language preference API
- Automated translation suggestions

### Scalability
- Support for additional languages
- Regional dialect variations
- Cultural adaptation features
- Accessibility improvements
- Performance optimizations

## Support

For questions or issues related to internationalization:

1. Check this documentation
2. Review the implementation files
3. Test with different languages
4. Verify RTL support for Arabic
5. Check browser console for errors

## Contributing

When contributing to the internationalization system:

1. Follow the established patterns
2. Add translations for all supported languages
3. Test with RTL languages if applicable
4. Update documentation as needed
5. Ensure backward compatibility

---

*This internationalization system provides a robust foundation for multi-language support while maintaining excellent user experience across all supported languages and regions.*
