# CodeSlopes Environment Setup Guide

This guide will help you configure all the necessary API keys and environment variables for the CodeSlopes blog application.

## Quick Setup Checklist

- [ ] Copy `.env.example` to `.env.local`
- [ ] Configure Firebase Web App credentials
- [ ] Configure Firebase Admin SDK credentials
- [ ] Configure OpenAI API key
- [ ] (Optional) Configure Anthropic API key
- [ ] Install dependencies
- [ ] Run the development server

---

## 1. Create Your Environment File

First, create your local environment file:

```bash
cp .env.example .env.local
```

**IMPORTANT**: Never commit `.env.local` to version control! It's already in `.gitignore`.

---

## 2. Firebase Configuration

### 2.1 Firebase Web App (Client-side)

1. Go to [Firebase Console](https://console.firebase.google.com/project/codeslopes/settings/general)
2. Navigate to **Project Settings** > **General**
3. Scroll to **Your apps** section
4. If you don't have a web app yet:
   - Click **Add app** > Select **Web** (</> icon)
   - Register the app with nickname "CodeSlopes Web"
5. Copy the configuration values to your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=codeslopes.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=codeslopes
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=codeslopes.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ
```

### 2.2 Firebase Admin SDK (Server-side)

1. Go to [Firebase Service Accounts](https://console.firebase.google.com/project/codeslopes/settings/serviceaccounts/adminsdk)
2. Click **Generate New Private Key**
3. Download the JSON file
4. Open the downloaded JSON file and copy the values:

```env
FIREBASE_ADMIN_PROJECT_ID=codeslopes
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@codeslopes.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgk...\n-----END PRIVATE KEY-----\n"
```

**Note**: For the private key, make sure to:
- Keep the `\n` characters (newlines)
- Wrap it in double quotes
- Include the BEGIN and END markers

### 2.3 Set Up Admin User

To create blog posts, you need at least one admin user:

1. Create a user account through your app's sign-up flow
2. Go to [Firestore Database](https://console.firebase.google.com/project/codeslopes/firestore)
3. Create a new collection called `admins`
4. Add a document with the user's UID as the document ID:
   - Document ID: `[your-user-uid]`
   - No fields needed (empty document is fine)

To find your user UID:
- Go to [Authentication](https://console.firebase.google.com/project/codeslopes/authentication/users)
- Find your user and copy the UID

---

## 3. OpenAI API Configuration

The blog uses OpenAI for AI-powered features like content suggestions, writing improvements, and summarization.

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new secret key (if you don't have one)
3. Copy the key to your `.env.local`:

```env
OPENAI_API_KEY=sk-proj-...
```

**Note**: The app uses the `gpt-4o-mini` model which is cost-effective for blog content generation.

---

## 4. Anthropic API (Optional)

Currently not used, but available for future Claude AI integration:

1. Go to [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create a new API key
3. Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 5. Site Configuration

Set your site URL:

**For development:**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**For production:**
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## 6. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run with Firebase emulators (recommended for local development)
npm run dev:emulators
```

Visit [http://localhost:3000](http://localhost:3000) to see your blog!

---

## Verification Checklist

After setup, verify everything works:

### Firebase
- [ ] Can access the homepage without errors
- [ ] Can sign up for a new account
- [ ] Can sign in with existing account
- [ ] Can view published blog posts

### Admin Features (requires admin user setup)
- [ ] Can access `/admin` page
- [ ] Can create new blog posts
- [ ] Can upload images
- [ ] Can publish/unpublish posts

### AI Features (requires OpenAI key)
- [ ] AI content suggestions work in post editor
- [ ] Content summarization works
- [ ] Writing improvements work

---

## Troubleshooting

### Firebase Errors

**Error: "Firebase: Error (auth/api-key-not-valid)"**
- Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correct
- Ensure there are no extra spaces or quotes

**Error: "Permission denied" when reading/writing data**
- Check Firestore security rules are deployed
- Run `npm run firebase:deploy` to deploy rules
- Verify you're signed in with the correct account

**Error: "Admin SDK private key invalid"**
- Make sure the private key includes `\n` characters
- Wrap the key in double quotes
- Include BEGIN and END markers

### OpenAI Errors

**Error: "Incorrect API key provided"**
- Verify your OpenAI API key is correct
- Check you have credits/billing set up in OpenAI

**Error: "Rate limit exceeded"**
- You've hit OpenAI's rate limit
- Wait a few minutes and try again
- Consider upgrading your OpenAI plan

### General Issues

**Error: "Module not found" or "Cannot find module"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Server won't start**
```bash
# Check if port 3000 is already in use
lsof -i :3000
# Kill the process if needed
kill -9 [PID]
```

---

## Environment Variables Reference

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ Yes | Firebase web API key | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ Yes | Firebase auth domain | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ Yes | Firebase project ID | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ Yes | Firebase storage bucket | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ Yes | Firebase messaging sender ID | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ Yes | Firebase app ID | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | ⚠️ Optional | Google Analytics measurement ID | Firebase Console > Project Settings |
| `FIREBASE_ADMIN_PROJECT_ID` | ✅ Yes | Firebase admin project ID | Service Account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | ✅ Yes | Firebase admin service account email | Service Account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | ✅ Yes | Firebase admin private key | Service Account JSON |
| `OPENAI_API_KEY` | ⚠️ Optional* | OpenAI API key for AI features | OpenAI Platform |
| `ANTHROPIC_API_KEY` | ❌ No | Anthropic API key (future use) | Anthropic Console |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes | Your site URL | N/A |

*AI features won't work without OpenAI key, but the rest of the app will function.

---

## Security Best Practices

1. ✅ **Never commit `.env.local`** - It's in `.gitignore` for a reason
2. ✅ **Use environment variables** - Don't hardcode API keys in code
3. ✅ **Rotate keys regularly** - Especially if they might be compromised
4. ✅ **Limit Firebase API key restrictions** - Set HTTP referrer restrictions in Firebase Console
5. ✅ **Use service account with minimal permissions** - Don't use owner-level service accounts
6. ✅ **Enable Firebase App Check** - Protect your backend from abuse (recommended for production)

---

## Next Steps

Once your environment is configured:

1. **Deploy Firestore Rules & Indexes**
   ```bash
   npm run firebase:deploy
   ```

2. **Create Your First Admin User**
   - Sign up through the app
   - Add your UID to Firestore `admins` collection

3. **Create Your First Blog Post**
   - Navigate to `/admin`
   - Click "New Post"
   - Use AI features to help with content!

4. **Customize Your Blog**
   - Update site metadata in `src/app/layout.tsx`
   - Customize colors in `tailwind.config.ts`
   - Add your logo/branding

---

Need help? Check out:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
