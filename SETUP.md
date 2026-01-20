# CodeSlopes Setup Guide

This guide will help you set up and run the CodeSlopes blog application locally and deploy it to Firebase.

## Prerequisites

- Node.js 18.x or 20.x
- npm or yarn
- Firebase account
- OpenAI API key (for AI features)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your Firebase and API credentials in `.env`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (for server-side)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email
FIREBASE_ADMIN_PRIVATE_KEY=your_private_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Firebase

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Enable Storage
5. Download service account credentials for Admin SDK

### 4. Initialize Firebase Locally

```bash
firebase login
firebase init
```

Select:
- Firestore
- Hosting
- Storage
- Emulators

### 5. Set Up Admin User

To make yourself an admin, add a document in the `admins` collection in Firestore:

```
Collection: admins
Document ID: your-user-id
Fields: (empty or add any metadata)
```

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 7. Run Firebase Emulators (Optional)

For local testing with Firebase services:

```bash
npm run firebase:emulators
```

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run E2E Tests

```bash
npm run test:e2e
```

### Run E2E Tests with UI

```bash
npm run test:e2e:ui
```

## Building for Production

```bash
npm run build
```

## Deployment

### Deploy to Firebase Hosting

```bash
npm run firebase:deploy
```

### GitHub Actions Auto-Deployment

The application is configured to auto-deploy to Firebase Hosting when you push to the `main` branch.

#### Required GitHub Secrets

Set up these secrets in your GitHub repository settings:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `FIREBASE_SERVICE_ACCOUNT` (JSON of your service account)
- `FIREBASE_PROJECT_ID`
- `OPENAI_API_KEY`

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Firebase (Auth, Firestore, Storage, Hosting)
- ✅ Rich Text Editor (Tiptap)
- ✅ AI Integration (OpenAI GPT-4)
- ✅ Authentication (Email/Password, Google)
- ✅ Admin Dashboard
- ✅ Blog Post Management
- ✅ Unit Tests (Jest)
- ✅ E2E Tests (Playwright)
- ✅ CI/CD (GitHub Actions)
- ✅ Auto-deployment to Firebase

## Project Structure

```
codeslopes/
├── .github/
│   └── workflows/          # GitHub Actions workflows
├── e2e/                    # E2E tests (Playwright)
├── src/
│   ├── app/               # Next.js app router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   └── blog/         # Blog pages
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   │   ├── firebase/    # Firebase utilities
│   │   └── ai.ts        # AI integration
│   └── types/            # TypeScript types
├── firebase.json          # Firebase configuration
├── firestore.rules       # Firestore security rules
├── storage.rules         # Storage security rules
└── jest.config.js        # Jest configuration
```

## Common Tasks

### Creating a Blog Post

1. Sign in as an admin
2. Navigate to `/admin`
3. Click "Create New Post"
4. Fill in the details and content
5. Use AI features to improve content
6. Publish or save as draft

### Managing Users

Admin users are managed in the `admins` collection in Firestore. Add user UIDs there to grant admin access.

### Customizing Styles

Edit `src/app/globals.css` and `tailwind.config.ts` to customize the look and feel.

## Troubleshooting

### Firebase Connection Issues

- Ensure your `.env` file has correct Firebase credentials
- Check Firebase console for enabled services
- Verify Firestore security rules allow your operations

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Test Failures

- Ensure all dependencies are installed
- Check that mock data matches your types
- Run tests individually to isolate issues

## Support

For issues or questions, please open an issue on GitHub.

## License

This project is private and proprietary.
