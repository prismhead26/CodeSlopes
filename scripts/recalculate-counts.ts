/**
 * Recalculate category post counts (includes both posts and tutorials)
 *
 * Usage: npm run seed:recalculate
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, '../service-account.json');
const fs = require('fs');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing service-account.json file in project root.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

async function recalculateCounts() {
  console.log('Recalculating category counts...\n');

  // Get all categories
  const categoriesSnapshot = await db.collection('categories').get();
  const categories = categoriesSnapshot.docs.map(doc => ({
    id: doc.id,
    slug: doc.data().slug,
    name: doc.data().name,
  }));

  // Get all posts
  const postsSnapshot = await db.collection('posts').get();
  const postCountBySlug = new Map<string, number>();
  postsSnapshot.docs.forEach(doc => {
    const category = doc.data().category;
    if (category) {
      postCountBySlug.set(category, (postCountBySlug.get(category) || 0) + 1);
    }
  });

  // Get all tutorials
  const tutorialsSnapshot = await db.collection('tutorials').get();
  const tutorialCountBySlug = new Map<string, number>();
  tutorialsSnapshot.docs.forEach(doc => {
    const category = doc.data().category;
    if (category) {
      tutorialCountBySlug.set(category, (tutorialCountBySlug.get(category) || 0) + 1);
    }
  });

  console.log('Posts by category:', Object.fromEntries(postCountBySlug));
  console.log('Tutorials by category:', Object.fromEntries(tutorialCountBySlug));
  console.log('');

  // Update each category
  for (const category of categories) {
    const postCount = postCountBySlug.get(category.slug) || 0;
    const tutorialCount = tutorialCountBySlug.get(category.slug) || 0;
    const totalCount = postCount + tutorialCount;

    await db.collection('categories').doc(category.id).update({
      postCount: totalCount,
    });

    console.log(`✅ ${category.name}: ${totalCount} (${postCount} posts + ${tutorialCount} tutorials)`);
  }

  console.log('\n✨ Recalculation complete!');
}

recalculateCounts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Recalculation failed:', error);
    process.exit(1);
  });
