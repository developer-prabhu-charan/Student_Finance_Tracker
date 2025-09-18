# Finance API (Express + MongoDB)

Simple backend for the finance dashboard app.

Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `DB_NAME`.
2. Install dependencies and run locally:

```powershell
cd server
npm install
npm run dev
```

API endpoints

GET /api/finance/user
GET /api/finance/accounts
GET /api/finance/transactions?accountId=acc1
GET /api/finance/budgets
GET /api/finance/goals
GET /api/finance/alerts
GET /api/finance/insights
GET /api/finance/monthly-stats/:month

Seeding

Seed your MongoDB with documents matching the structure found in `src/data/mockData.json` to start with realistic data.
