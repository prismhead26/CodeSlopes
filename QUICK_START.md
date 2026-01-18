# CodeSlopes - Quick Start Guide

## 🚀 Running the Application (Quick Reference)

### First Time Setup (One-time only)
```bash
# 1. Install dependencies
npm run setup

# 2. Create .env file
cp .env.example .env
# Then edit .env with your Firebase credentials

# 3. Done! Now run the app:
npm run dev
```

---

## 📱 Running the App

### Every Time You Want to Run the App:
```bash
npm run dev
```

Then visit: **http://localhost:3000**

### If You Get Build Errors:
```bash
npm run dev:clean
```

---

## 🔐 Admin Dashboard

**URL:** http://localhost:3000/admin

**Login:** Use your Google account

**Make sure you're an admin:**
1. Go to Firebase Console
2. Firestore Database → Data
3. Check that `admins` collection has a document with your User UID

---

## 🛠️ Useful Commands

| Command | What It Does |
|---------|-------------|
| `npm run dev` | Start the app |
| `npm run dev:clean` | Clean cache & start (fixes most errors) |
| `npm run build` | Build for production |
| `npm run clean` | Just clean the cache |

---

## 🔥 Firebase Checklist

If you get permission errors, check:

- [ ] **.env file exists** with Firebase credentials
- [ ] **Firestore rules deployed** (Firebase Console → Firestore → Rules → Publish)
- [ ] **You're in admins collection** (Firebase Console → Firestore → Data → admins → your-uid)
- [ ] **Signed in with Google** in the app

---

## 🐛 Common Issues

### Port 3000 Already in Use
```bash
npx kill-port 3000
npm run dev
```

### Permission Denied Errors
1. Deploy Firestore rules (see Firebase Checklist above)
2. Add yourself to admins collection
3. Sign out and sign in again

### Images Not Loading
Check `next.config.ts` has Firebase Storage domain

### Build Cache Errors
```bash
npm run dev:clean
```

---

## 📍 Admin Routes

- `/admin` - Dashboard
- `/admin/posts` - Manage posts
- `/admin/posts/new` - Create post
- `/admin/categories` - Manage categories
- `/admin/comments` - Moderate comments
- `/admin/analytics` - View stats & export CSV
- `/admin/settings` - Site settings

---

## 🎯 That's It!

**TL;DR:**
1. `npm run dev` to run
2. Go to http://localhost:3000
3. Admin at http://localhost:3000/admin

For detailed docs, see [README.md](README.md)
