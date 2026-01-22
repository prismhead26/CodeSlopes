/**
 * Seed script to populate the database with tutorial categories
 *
 * Usage: npm run seed:categories
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as path from 'path';

// Try to load service account from file
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

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
  createdAt: FirebaseFirestore.Timestamp;
}

// Tutorial categories matching the Tutorial type
const categories: Omit<CategoryData, 'createdAt' | 'postCount'>[] = [
  {
    name: 'Networking',
    slug: 'networking',
    description: 'Network administration, troubleshooting, protocols, and infrastructure.',
    icon: '🌐',
    color: '#3B82F6', // blue
  },
  {
    name: 'Linux',
    slug: 'linux',
    description: 'Linux system administration, command line, shell scripting, and server management.',
    icon: '🐧',
    color: '#F97316', // orange
  },
  {
    name: 'Windows',
    slug: 'windows',
    description: 'Windows administration, PowerShell, Active Directory, and development environment setup.',
    icon: '🪟',
    color: '#0EA5E9', // sky blue
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Cybersecurity best practices, application security, and secure coding.',
    icon: '🔒',
    color: '#EF4444', // red
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, containerization, cloud infrastructure, and automation.',
    icon: '⚙️',
    color: '#8B5CF6', // purple
  },
  {
    name: 'General',
    slug: 'general',
    description: 'General programming topics, tools, and best practices.',
    icon: '📚',
    color: '#10B981', // green
  },
];

async function seedCategories() {
  console.log('Starting category seeding...\n');

  const now = Timestamp.now();
  let successCount = 0;
  let skipCount = 0;

  for (const category of categories) {
    // Check if category already exists
    const existingQuery = await db.collection('categories').where('slug', '==', category.slug).get();

    if (!existingQuery.empty) {
      console.log(`⏭️  Skipping "${category.name}" - already exists`);
      skipCount++;
      continue;
    }

    const categoryData: CategoryData = {
      ...category,
      postCount: 0,
      createdAt: now,
    };

    try {
      const docRef = await db.collection('categories').add(categoryData);
      console.log(`✅ Created: "${category.name}" (${docRef.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create "${category.name}":`, error);
    }
  }

  console.log(`\n✨ Seeding complete!`);
  console.log(`   Created: ${successCount}`);
  console.log(`   Skipped: ${skipCount}`);
  console.log(`   Total: ${categories.length}`);
}

// Run the seed function
seedCategories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
