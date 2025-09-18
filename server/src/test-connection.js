import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'finance_db';

if (!uri) {
  console.error('MONGODB_URI not set in server/.env');
  process.exit(1);
}

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    // Ping the server
    const res = await client.db(dbName).command({ ping: 1 });
    console.log('✅ Connected and pinged MongoDB:', res);
  } catch (err) {
    console.error('Connection test failed:', err);
  } finally {
    await client.close();
  }
}

test();
