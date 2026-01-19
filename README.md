# CopeSlopes Blog

A modern, full-featured tech and lifestyle blog with a powerful admin dashboard. Built with Next.js 15, Firebase, and TypeScript.

[![Deploy to Firebase](https://github.com/prismhead26/CodeSlopes/actions/workflows/deploy.yml/badge.svg)](https://github.com/prismhead26/CodeSlopes/actions/workflows/deploy.yml)

**Live Site:** [https://codeslopes.web.app](https://codeslopes.web.app)

## 🚀 Quick Start (TL;DR)

```bash
# First time setup
npm run setup
cp .env.example .env
# Edit .env with your Firebase credentials

# Run the app
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Admin Dashboard](#-admin-dashboard)
- [Firebase Setup](#-firebase-setup)
- [Troubleshooting](#-troubleshooting)
- [Available Scripts](#-available-scripts)
- [Tech Stack](#-tech-stack)

---

## ✨ Features

### Blog Features
- 📝 **Rich Text Editor** - Tiptap editor with markdown support
- 🏷️ **Categories & Tags** - Organize content efficiently
- 💬 **Comment System** - User comments with approval workflow
- 🔍 **Search & Filter** - Easy content discovery
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Beautiful dark/light theme toggle
- 🎨 **SEO Optimized** - Meta tags, Open Graph, structured data

### Admin Dashboard Features
- 📊 **Real-Time Analytics** - Live metrics with CSV export
- 🖼️ **Image Upload** - Firebase Storage integration with progress tracking
- ⚡ **Live Updates** - Real-time data synchronization with Firestore listeners
- 🗂️ **Bulk Operations** - Bulk delete, publish, approve for posts & comments
- 📈 **Engagement Metrics** - Views, likes, reading time, top posts
- 🔐 **Secure Access** - Admin-only routes with Firebase Auth
- 📤 **CSV Export** - Download analytics data for analysis

### Technical Features
- 🔥 **Firebase Backend** - Auth, Firestore, Storage
- 🤖 **AI Integration** - OpenAI for content assistance (optional)
- ✅ **Comprehensive Testing** - Jest, React Testing Library, Playwright
- 🎯 **TypeScript** - Full type safety
- 🚀 **CI/CD Ready** - GitHub Actions workflows

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Firebase Account** ([Sign up free](https://firebase.google.com/))
- **Google Account** (for Firebase authentication)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CodeSlopes.git
cd CodeSlopes
```

### 2. Install Dependencies

```bash
npm run setup
# Or manually:
npm install
```

### 3. Environment Configuration

**Copy the example environment file:**

```bash
cp .env.example .env
```

**Edit `.env` with your Firebase credentials:**

```env
# Firebase Client Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (optional - for server-side operations)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OpenAI (optional - for AI features)
OPENAI_API_KEY=sk-...
```

**Where to find Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to "Your apps" → Click on your web app
5. Copy the config values to your `.env` file

### 4. Firebase Setup

See [Firebase Setup](#-firebase-setup) section below for detailed instructions.

---

## 🎮 Running the Application

### Development Mode

```bash
# Standard development server
npm run dev

# Development with clean cache (if you encounter build issues)
npm run dev:clean
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Clean Build Cache

If you encounter build issues:

```bash
npm run clean
npm run dev
```

---

## 🔐 Admin Dashboard

### Accessing the Admin Dashboard

1. **Navigate to:** [http://localhost:3000/admin](http://localhost:3000/admin)
2. **Sign in** with your Google account
3. **Ensure your user is an admin** (see Firebase Setup below)

### Admin Features

| Route | Description |
|-------|-------------|
| `/admin` | Main dashboard with quick stats |
| `/admin/posts` | Manage all posts (edit, delete, bulk actions) |
| `/admin/posts/new` | Create new blog post |
| `/admin/posts/[id]/edit` | Edit existing post |
| `/admin/categories` | Manage categories (CRUD operations) |
| `/admin/comments` | Moderate comments (approve, delete, bulk actions) |
| `/admin/analytics` | View metrics & export CSV |
| `/admin/settings` | Configure site settings |

### Key Admin Capabilities

- ✅ **Real-time updates** - Changes appear instantly across all pages
- ✅ **Bulk operations** - Select multiple items and act on them at once
- ✅ **Image uploads** - Upload cover images directly to Firebase Storage
- ✅ **CSV export** - Download analytics data as CSV
- ✅ **Dark mode** - All admin pages support dark/light themes

---

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `CodeSlopes` (or your choice)
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, click **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method

### 3. Create Firestore Database

1. Click **Firestore Database**
2. Click **"Create database"**
3. Choose **Production mode** or **Test mode** (you'll update rules later)
4. Select a location (choose closest to your users)

### 4. Enable Firebase Storage

1. Click **Storage**
2. Click **"Get started"**
3. Accept the default security rules
4. Click **"Done"**

### 5. Deploy Firestore Security Rules

**Option A: Firebase Console (Easiest)**
1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents from `firestore.rules` in your project
3. Paste into the console editor
4. Click **"Publish"**

**Option B: Firebase CLI**
```bash
# Install Firebase CLI globally (one time)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
npm run firebase:deploy:rules
```

### 6. Set Up Admin User

Your user needs admin privileges to access the dashboard:

1. **Sign in to your app** with Google (this creates your user)
2. **Get your User UID:**
   - Firebase Console → **Authentication** → **Users** tab
   - Copy the **User UID** column for your account
3. **Add yourself as admin:**
   - Go to **Firestore Database** → **Data** tab
   - Click **"Start collection"**
   - Collection ID: `admins`
   - Document ID: **paste your User UID**
   - Add a field (optional): `role` = `admin`
   - Click **"Save"**

### 7. Storage Rules (Optional but Recommended)

Go to **Storage** → **Rules** tab and paste:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    match /images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

Click **"Publish"**

---

## 🐛 Troubleshooting

### Build Issues

**Problem:** Next.js build cache errors

**Solution:**
```bash
npm run dev:clean
# Or manually:
rm -rf .next
npm run dev
```

### Permission Denied Errors

**Problem:** "Missing or insufficient permissions" when accessing admin pages

**Solutions:**
1. **Check Firestore rules are deployed** (see Firebase Setup step 5)
2. **Verify you're in the admins collection** (see Firebase Setup step 6)
3. **Sign out and sign in again** to refresh your auth token
4. **Check browser console** for specific error messages

### Images Not Loading

**Problem:** "Invalid src prop" or images not displaying

**Solutions:**
1. **Check `next.config.ts`** includes Firebase Storage domain:
   ```typescript
   images: {
     domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
   }
   ```
2. **Restart dev server** after config changes

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solutions:**
```bash
# Kill the process on port 3000 (Windows)
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Firebase Not Initialized

**Problem:** "Firebase: No Firebase App '[DEFAULT]' has been created"

**Solutions:**
1. **Check `.env` file exists** and has correct values
2. **Verify environment variables** start with `NEXT_PUBLIC_` (for client-side)
3. **Restart dev server** after changing `.env`
4. **Check for typos** in environment variable names

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run dev:clean` | Clean cache and start dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run clean` | Remove build cache (.next folder) |
| `npm run setup` | Install dependencies with setup guide |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run firebase:emulators` | Start Firebase emulators |
| `npm run firebase:deploy` | Deploy to Firebase |
| `npm run firebase:deploy:rules` | Deploy only Firestore rules |

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **UI Components:** Custom + Heroicons
- **Rich Text Editor:** Tiptap 2
- **State Management:** Zustand
- **Forms:** React Hook Form
- **Toast Notifications:** React Hot Toast

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Google, Email/Password)
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting (optional)

### Development
- **Testing:** Jest, React Testing Library, Playwright
- **Code Quality:** ESLint, TypeScript strict mode
- **Git Hooks:** Husky (optional)
- **CI/CD:** GitHub Actions

### Optional Integrations
- **AI:** OpenAI GPT-4 API
- **Analytics:** Google Analytics 4 (via Firebase)

---

## 📁 Project Structure

```
CodeSlopes/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── posts/          # Post management
│   │   │   ├── categories/     # Category management
│   │   │   ├── comments/       # Comment moderation
│   │   │   ├── analytics/      # Analytics & export
│   │   │   └── settings/       # Site settings
│   │   ├── blog/               # Blog pages
│   │   ├── auth/               # Authentication pages
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── analytics/          # Analytics components
│   │   └── categories/         # Category components
│   ├── contexts/               # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   └── firebase/           # Firebase CRUD operations
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── .env                        # Environment variables (create from .env.example)
├── .env.example                # Example environment variables
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## 📚 Additional Documentation

- **[Setup Guide](SETUP.md)** - Detailed setup instructions
- **[ENV Setup](ENV_SETUP_GUIDE.md)** - Environment variables guide
- **[Contributing](CONTRIBUTING.md)** - How to contribute
- **[Firestore Rules](firestore.rules)** - Database security rules

---

## 🎯 About

CopeSlopes is a tech and lifestyle blog documenting the journey of a Software and IT Engineer navigating the intersection of code, AI, and Colorado's outdoor adventures.

---

## 📝 License

All rights reserved.

---

## 🤝 Support

Need help? Check:
1. **[Troubleshooting](#-troubleshooting)** section above
2. **Browser console** for error messages
3. **Firebase Console** for database/auth issues
4. **GitHub Issues** for bug reports

---

## 🎉 You're All Set!

Run `npm run dev` and visit [http://localhost:3000](http://localhost:3000)

Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

Happy blogging! 🚀
