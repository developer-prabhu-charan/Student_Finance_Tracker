import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './db.js';
import financeRoutes from './routes/finance.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/finance', financeRoutes);

const port = process.env.PORT || 4000;

(async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`🚀 Finance API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
