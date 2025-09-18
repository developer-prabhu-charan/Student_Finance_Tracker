import express from 'express';
const router = express.Router();
import { getDb } from '../db.js';

// Helper to fetch collection safely
const fetchCollection = (name) => getDb().collection(name);

router.get('/user', async (req, res) => {
  try {
    const user = await fetchCollection('users').findOne({}) || null;
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/accounts', async (req, res) => {
  try {
    const accounts = await fetchCollection('accounts').find({}).toArray();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const { accountId } = req.query;
    const q = accountId ? { accountId } : {};
    const transactions = await fetchCollection('transactions').find(q).sort({ date: -1 }).toArray();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/budgets', async (req, res) => {
  try {
    const budgets = await fetchCollection('budgets').find({}).toArray();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/goals', async (req, res) => {
  try {
    const goals = await fetchCollection('goals').find({}).toArray();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const alerts = await fetchCollection('alerts').find({}).sort({ timestamp: -1 }).toArray();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/insights', async (req, res) => {
  try {
    const insights = await fetchCollection('insights').find({}).toArray();
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/monthly-stats/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const stats = await fetchCollection('monthlyStats').findOne({ month }) || null;
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Create a new transaction and update related aggregates (account balance, monthly stats)
router.post('/transactions', async (req, res) => {
  try {
    const tx = req.body;
    // Basic validation
    if (!tx || typeof tx.amount === 'undefined' || !tx.date) {
      return res.status(400).json({ error: 'Invalid transaction payload' });
    }

    // Normalize
    const transaction = {
      accountId: tx.accountId || 'acc1',
      amount: Number(tx.amount),
      description: tx.description || '',
      category: tx.category || 'Other',
      date: new Date(tx.date).toISOString(),
      merchant: tx.merchant || '',
      status: tx.status || 'completed',
      createdAt: new Date().toISOString()
    };

    const coll = fetchCollection('transactions');
    const result = await coll.insertOne(transaction);
    const inserted = await coll.findOne({ _id: result.insertedId });

    // Update account balance
    if (transaction.accountId) {
      const accountsColl = fetchCollection('accounts');
      await accountsColl.updateOne(
        { id: transaction.accountId },
        { $inc: { balance: transaction.amount } }
      );
    }

    // Update monthlyStats (upsert)
    const month = transaction.date.slice(0,7); // YYYY-MM
    const statsColl = fetchCollection('monthlyStats');
    const isIncome = transaction.amount > 0;
    const absAmount = Math.abs(transaction.amount);

  const update = { $inc: {} };
    if (isIncome) {
      update.$inc['income'] = absAmount;
    } else {
      update.$inc['expenses'] = absAmount;
    }
    update.$inc[`categories.${transaction.category}`] = absAmount;

    await statsColl.updateOne(
      { month },
      { $setOnInsert: { month }, ...update },
      { upsert: true }
    );

    res.status(201).json(inserted);
  } catch (err) {
    console.error('Failed to create transaction', err);
    res.status(500).json({ error: String(err) });
  }
});

export default router;
