# Firebase Authentication Setup

## Prerequisites
1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase Authentication enabled in your project

## Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Console Setup

### 1. Enable Email/Password Authentication
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Optionally enable "Email link (passwordless sign-in)"

### 2. Get Your Configuration
1. Go to Firebase Console > Project Settings
2. Scroll down to "Your apps" section
3. Click on the web app (or create one if you haven't)
4. Copy the configuration object values to your `.env.local` file

### 3. Set Up Authentication Rules (Optional)
If you're using Firestore, you may want to set up security rules to protect your data based on authentication.

## Features Included

### Authentication Pages
- **Login** (`/auth/login`) - Email/password login with beautiful UI
- **Register** (`/auth/register`) - Create new admin accounts
- **Forgot Password** (`/auth/forgot-password`) - Password reset via email

### Features
- ✅ Email/password authentication
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ Automatic redirects
- ✅ Loading states
- ✅ Error handling
- ✅ Responsive design
- ✅ Dark mode support
- ✅ User profile in navigation
- ✅ Logout functionality

### UI Components
- Split-screen layout matching the reference image
- Custom logo with animated elements
- Form validation and error messages
- Password visibility toggle
- Loading states and transitions
- Responsive design for mobile and desktop

## Usage

### Creating a Test User
1. Go to `/auth/register`
2. Create an account with email and password
3. You'll be automatically redirected to the dashboard

### Logging In
1. Go to `/auth/login`
2. Enter your email and password
3. Click "Continue" to access the admin panel

### Logging Out
1. Click on your profile avatar in the top navigation
2. Select "Log out"
3. You'll be redirected to the login page

## Security Notes
- All authentication is handled by Firebase
- Passwords are securely hashed by Firebase
- Session management is automatic
- Protected routes prevent unauthorized access
- Environment variables keep your Firebase config secure

## Customization
- Update the logo and branding in the auth pages
- Modify the color scheme by updating the purple/pink gradient classes
- Add additional authentication providers (Google, GitHub, etc.) in `lib/firebase.ts`
- Customize the user profile display in `components/top-nav.tsx` 