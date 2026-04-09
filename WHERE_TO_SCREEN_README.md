# Where To Screen - Exhibit IQ

## Overview
The "Where To" screen is a destination selection interface that follows the same styling as the OS dropdown in the navbar. It provides users with 5 main destinations after they log in, allowing them to choose where they want to go in the platform.

## Features

### 5 Destination Boxes
1. **Gallery OS** - Manage gallery operations and analytics
2. **Artist OS** - Create and manage artist profile and artwork  
3. **Collector OS** - Browse, collect, and manage art collection
4. **Global Marketplaces** - Access worldwide art markets and trading platforms
5. **Home** - Return to the main homepage

### Styling Features
- **Responsive Grid Layout**: Adapts from 1 column on mobile to 5 columns on large screens
- **Hover Effects**: Scale, shadow, and overlay animations on hover
- **Image Overlays**: Gradient overlays with titles and descriptions
- **Smooth Animations**: Framer Motion animations with staggered entrance effects
- **Consistent Design**: Matches the navbar OS dropdown styling

## File Structure

```
app/where-to/
├── page.tsx          # Main "Where To" screen component
└── layout.tsx        # Layout wrapper with metadata

components/
└── where-to-redirect.tsx  # Redirect component for login flow
```

## Usage

### 1. Direct Navigation
Users can navigate directly to `/where-to` to see the destination selection screen.

### 2. Post-Login Redirect
Use the `WhereToRedirect` component to automatically redirect users after login:

```tsx
import WhereToRedirect from '@/components/where-to-redirect';

// In your login success handler
<WhereToRedirect redirectPath="/where-to">
  {/* Optional children to show while redirecting */}
</WhereToRedirect>
```

### 3. Integration with Auth Flow
To integrate with your existing auth flow, you can:

- Replace dashboard redirects with the "Where To" screen
- Use it as an intermediate step after login
- Allow users to choose their destination based on their role

## Customization

### Adding New Destinations
To add more destinations, modify the `destinations` array in `page.tsx`:

```tsx
const destinations = [
  // ... existing destinations
  {
    title: 'New Destination',
    description: 'Description of the new destination',
    image: 'https://example.com/image.jpg',
    path: '/new-path'
  }
];
```

### Styling Modifications
The component uses Tailwind CSS classes and can be easily customized:
- Change colors by modifying the `from-primary` and `to-primary` classes
- Adjust spacing with the `gap-6` and `p-12` classes
- Modify animations by changing the Framer Motion variants

### Image Sources
Currently uses Unsplash images, but you can replace with:
- Local images from `/public/` directory
- Firebase Storage URLs
- Any other image hosting service

## Responsive Behavior

- **Mobile (1 column)**: Stacked layout with compact design
- **Tablet (2-3 columns)**: Medium grid layout
- **Desktop (5 columns)**: Full grid layout matching navbar dropdown

## Dependencies

- `framer-motion` for animations
- `next/image` for optimized images
- `@/contexts/auth-context` for user authentication
- `@/lib/i18n` for internationalization

## Future Enhancements

- Role-based destination filtering
- Recent destinations tracking
- Customizable destination order
- Analytics tracking for destination selection
- Integration with user preferences
