import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'finance_db';

if (!uri) {
  console.error('MONGODB_URI not set in environment. Copy .env.example to .env and set it.');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    const dataPath = path.resolve(process.cwd(), '..', 'src', 'data', 'mockData.json');
    if (!fs.existsSync(dataPath)) {
      console.error('mockData.json not found at', dataPath);
      process.exit(1);
    }

    const raw = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(raw);

    // Clear existing collections and insert
    const collections = ['users','accounts','transactions','budgets','goals','alerts','insights','monthlyStats'];
    for (const col of collections) {
      try {
        await db.collection(col).drop();
      } catch (e) {
        // ignore if doesn't exist
      }
    }

    if (data.user) await db.collection('users').insertOne(data.user);
    if (data.accounts) await db.collection('accounts').insertMany(data.accounts);
    if (data.transactions) await db.collection('transactions').insertMany(data.transactions);
    if (data.budgets) await db.collection('budgets').insertMany(data.budgets);
    if (data.goals) await db.collection('goals').insertMany(data.goals);
    if (data.alerts) await db.collection('alerts').insertMany(data.alerts);
    if (data.insights) await db.collection('insights').insertMany(data.insights);

    // monthlyStats: store each month as a document with { month: '2024-01', ... }
    if (data.monthlyStats) {
      const months = Object.entries(data.monthlyStats);
      for (const [month, stats] of months) {
        await db.collection('monthlyStats').insertOne({ month, ...stats });
      }
    }

    console.log('✅ Database seeded successfully');
  } catch (err) {
    console.error('Seeding failed', err);
  } finally {
    await client.close();
  }
}

seed();
