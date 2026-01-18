# CodeSlopes Deployment Guide

## 🎉 Build Status: SUCCESS!

Your blog is now production-ready with:
- ✅ Firebase Hosting with Next.js SSR support
- ✅ Comprehensive security (CSP headers, input validation, XSS prevention, rate limiting)
- ✅ Firebase Cloud Functions for AI endpoints
- ✅ GitHub Actions CI/CD (auto-deploy, security scanning, preview deployments, performance monitoring)
- ✅ All 17 pages building successfully

---

## 📋 Next Steps to Deploy

### 1. Configure Firebase Cloud Functions (Required for AI features)

```bash
# Install Cloud Functions dependencies (already done)
cd functions
npm install

# Set OpenAI API key for Cloud Functions
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"

# Return to project root
cd ..
```

### 2. Deploy to Firebase

```bash
# Login to Firebase (if not already logged in)
firebase login

# Deploy everything (hosting + functions)
firebase deploy

# Or deploy separately:
firebase deploy --only hosting
firebase deploy --only functions
```

### 3. Set Up GitHub Secrets for CI/CD

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

**Firebase Service Account:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Project Settings → Service Accounts
4. Click "Generate new private key"
5. Copy the entire JSON content
6. Add as secret: `FIREBASE_SERVICE_ACCOUNT`

**Firebase Project ID:**
- Add secret: `FIREBASE_PROJECT_ID`
- Value: Your Firebase project ID (e.g., "codeslopes-blog")

**Firebase Environment Variables:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

(Get these from Firebase Console → Project Settings → Your apps)

### 4. Push Changes to GitHub

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "feat: add Firebase Hosting, security, and full CI/CD automation

- Configure Next.js for Firebase Hosting with SSR
- Add comprehensive security (CSP headers, input validation, XSS prevention)
- Create Firebase Cloud Functions for AI endpoints with rate limiting
- Set up GitHub Actions (auto-deploy, security scanning, preview deployments, performance monitoring)
- Add Dependabot for automated dependency updates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to main branch (triggers auto-deploy!)
git push origin main
```

---

## 🔐 Security Features Implemented

### 1. Security Headers (firebase.json)
- ✅ Content Security Policy (CSP)
- ✅ Strict Transport Security (HSTS)
- ✅ X-Frame-Options (clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing protection)
- ✅ XSS Protection
- ✅ Referrer Policy
- ✅ Permissions Policy

### 2. Input Validation & Sanitization
- ✅ Zod schemas for posts, comments, categories (`src/lib/validation/schemas.ts`)
- ✅ DOMPurify HTML sanitization (`src/lib/security/sanitize.ts`)
- ✅ URL validation

### 3. API Protection & Rate Limiting (Cloud Functions)
- ✅ Admin authentication required for AI endpoints
- ✅ Rate limiting: 10 requests/hour, 50 requests/day per user
- ✅ Input validation on all function parameters

### 4. Firestore Security Rules
- ✅ Field-level validation
- ✅ Admin-only write access
- ✅ Published posts only for public reads

---

## 🚀 GitHub Actions Workflows

### Auto-Deploy (`.github/workflows/deploy.yml`)
- Triggers on push to `main`
- Runs tests before deployment
- Deploys to Firebase Hosting production

### Security Scanning
- **CodeQL** (`.github/workflows/codeql.yml`) - Weekly security analysis
- **Secret Scanning** (`.github/workflows/secret-scan.yml`) - Detects leaked secrets
- **npm audit** - Dependency vulnerability scanning in CI

### Preview Deployments (`.github/workflows/preview.yml`)
- Creates preview URLs for pull requests
- Auto-comments on PR with preview link
- Expires after 7 days

### Performance Monitoring
- **Lighthouse CI** (`.github/workflows/lighthouse.yml`) - Performance budgets
- **Bundle Size** (`.github/workflows/bundle-size.yml`) - Size monitoring

### Automated Updates (`.github/dependabot.yml`)
- Weekly npm dependency updates
- Weekly GitHub Actions updates

---

## 📊 What's Been Built

### Pages (17 total)
- **Static**: Home, About, Admin dashboard, Blog listing, Auth pages
- **Dynamic**: Blog posts (`/blog/[slug]`), Admin edit (`/admin/posts/[id]/edit`)
- **API Routes**: AI suggest and summarize endpoints

### Components
- Server components for better SEO
- Client components for interactivity
- Proper separation of concerns

### Firebase Cloud Functions
- `suggest` - AI content suggestions
- `summarize` - AI content summarization
- Both with admin auth + rate limiting

---

## 🧪 Testing Checklist

Before going live, test these features:

- [ ] **Authentication**: Sign in with Google works
- [ ] **Admin Access**: Can access `/admin` dashboard
- [ ] **Create Post**: Can create and publish blog posts
- [ ] **View Posts**: Published posts appear on `/blog`
- [ ] **Dynamic Routes**: Blog post pages load correctly
- [ ] **Comments**: Can add and moderate comments
- [ ] **Categories**: Can create and manage categories
- [ ] **Analytics**: Dashboard shows correct metrics
- [ ] **CSV Export**: Can export analytics data
- [ ] **Image Upload**: Can upload cover images to Firebase Storage
- [ ] **Dark Mode**: Theme toggle works across all pages
- [ ] **Security Headers**: Check response headers (use browser DevTools)

---

## 💰 Estimated Costs

**Firebase Hosting (Next.js SSR):**
- Free tier: Generous limits for blogs
- Estimated: $0-10/month for moderate traffic

**Cloud Functions:**
- Free tier: 2M invocations/month, 400K GB-seconds
- Estimated: $5-20/month depending on AI usage

**Firestore:**
- Free tier: 50K reads/day, 20K writes/day
- Estimated: $0-5/month

**Firebase Storage:**
- Free tier: 5GB storage, 1GB/day download
- Estimated: $0-5/month

**Total:** ~$5-40/month (very low for a production blog)

**GitHub Actions:**
- Free for public repos
- Private repos: 2000 minutes/month free

---

## 🔧 Useful Commands

```bash
# Development
npm run dev                  # Start dev server
npm run dev:clean            # Clean cache and start dev

# Building
npm run build                # Build for production
npm run clean                # Remove build cache

# Testing
npm test                     # Run unit tests
npm run test:e2e             # Run E2E tests
npm run lint                 # Run ESLint

# Firebase
firebase emulators:start     # Start local emulators (requires Java)
firebase deploy              # Deploy everything
firebase deploy --only hosting    # Deploy only hosting
firebase deploy --only functions  # Deploy only Cloud Functions
firebase hosting:channel:deploy preview  # Deploy to preview channel

# GitHub
git status                   # Check what's changed
git add .                    # Stage all changes
git commit -m "message"      # Commit changes
git push origin main         # Push and trigger auto-deploy
```

---

## 📝 Important Files

### Configuration
- `next.config.ts` - Next.js configuration
- `firebase.json` - Firebase Hosting + Functions config
- `.env` - Environment variables (keep secret!)
- `tsconfig.json` - TypeScript configuration

### Security
- `src/lib/security/sanitize.ts` - XSS prevention
- `src/lib/validation/schemas.ts` - Input validation
- `firestore.rules` - Database security rules
- `storage.rules` - Storage security rules

### Cloud Functions
- `functions/src/index.ts` - Function exports
- `functions/src/ai/suggest.ts` - AI suggestions
- `functions/src/ai/summarize.ts` - AI summaries
- `functions/src/middleware/auth.ts` - Admin verification
- `functions/src/middleware/rateLimit.ts` - Rate limiting

### GitHub Actions
- `.github/workflows/deploy.yml` - Auto-deploy
- `.github/workflows/codeql.yml` - Security analysis
- `.github/workflows/secret-scan.yml` - Secret detection
- `.github/workflows/preview.yml` - PR previews
- `.github/workflows/bundle-size.yml` - Size monitoring
- `.github/dependabot.yml` - Dependency updates

---

## 🐛 Troubleshooting

### Build Fails
```bash
npm run clean
npm run build
```

### Functions Not Deploying
```bash
cd functions
npm install
cd ..
firebase deploy --only functions --force
```

### Authentication Issues
1. Check Firebase Console → Authentication → Users
2. Verify user is in `admins` collection in Firestore
3. Sign out and sign in again

### Environment Variables Not Working
1. Check `.env` file exists in project root
2. Verify all variables start with `NEXT_PUBLIC_` (for client-side)
3. Restart dev server after changing `.env`

### GitHub Actions Failing
1. Verify all GitHub secrets are set correctly
2. Check workflow logs in GitHub Actions tab
3. Ensure Firebase service account JSON is valid

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site loads at your Firebase Hosting URL
- ✅ Can sign in with Google
- ✅ Admin dashboard accessible at `/admin`
- ✅ Can create and publish blog posts
- ✅ Blog posts appear on `/blog`
- ✅ Dynamic routes work (`/blog/[slug]`)
- ✅ Security headers present (check DevTools)
- ✅ GitHub Actions workflows pass
- ✅ PR previews deploy automatically

---

## 📞 Next Steps

1. **Now**: Configure Firebase Functions OpenAI API key
2. **Now**: Deploy to Firebase with `firebase deploy`
3. **Now**: Add GitHub secrets
4. **Now**: Push to GitHub to trigger CI/CD
5. **After deploy**: Test all features on live site
6. **After deploy**: Set up custom domain (optional)
7. **Ongoing**: Monitor GitHub Actions for security alerts
8. **Ongoing**: Review and merge Dependabot PRs

---

## 🎉 You're Ready to Deploy!

All the hard work is done. Follow the steps above and your blog will be live with enterprise-level security and automation!

Good luck! 🚀
