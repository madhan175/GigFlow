import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes';
import leadRouter from './routes/leadRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/errors';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (include PATCH for profile updates)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request Body Parser
app.use(express.json());

// API Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Register API Routers
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

// Fallback Unhandled Routes
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB & Start Server
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-leads';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('💚 Connected to MongoDB database successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server is active on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error('💥 Database connection failed:', err.message);
    process.exit(1);
  });

export default app;
