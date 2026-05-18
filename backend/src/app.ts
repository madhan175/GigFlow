import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import leadRouter from './routes/leadRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/errors';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-leads';

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    status: dbReady ? 'ok' : 'degraded',
    database: dbReady ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

const mongoOptions = {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDatabase = async (maxAttempts = 5): Promise<void> => {
  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('💥 MONGODB_URI is not set. Add it in Render Environment variables.');
    throw new Error('MONGODB_URI missing');
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await mongoose.connect(MONGO_URI, mongoOptions);
      console.log('💚 Connected to MongoDB database successfully!');
      return;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`💥 MongoDB attempt ${attempt}/${maxAttempts} failed: ${message}`);
      if (attempt === maxAttempts) throw err;
      await sleep(5000);
    }
  }
};

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is active on port ${PORT}...`);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('💥 Database connection failed:', message);
    console.error('');
    console.error('Atlas fix: Network Access → Add IP → Allow 0.0.0.0/0 (all IPs)');
    console.error('https://www.mongodb.com/docs/atlas/security-whitelist/');
    process.exit(1);
  }
};

startServer();

export default app;
