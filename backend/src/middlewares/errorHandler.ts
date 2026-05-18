import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  // Log non-operational errors (skip expected JWT errors — handled below)
  if (!err.isOperational && err.name !== 'JsonWebTokenError' && err.name !== 'TokenExpiredError') {
    console.error('💥 Unhandled Error:', err);
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    res.status(400).json({
      status: 'fail',
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((el: any) => el.message);
    res.status(400).json({
      status: 'fail',
      message: `Invalid input data: ${messages.join('. ')}`,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.',
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status,
      message: err.message,
    });
    return;
  }

  // Fallback for unhandled/unexpected exceptions
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Something went wrong on our end.',
  });
};
export default errorHandler;
