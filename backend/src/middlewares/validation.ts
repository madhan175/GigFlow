import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const validateRegister = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return next(new AppError('Name must be at least 2 characters long.', 400));
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long.', 400));
  }

  if (role && !['admin', 'sales'].includes(role)) {
    return next(new AppError('Role must be either admin or sales.', 400));
  }

  next();
};

export const validateLogin = (req: Request, _res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return next(new AppError('Email is required.', 400));
  }

  if (!password || typeof password !== 'string') {
    return next(new AppError('Password is required.', 400));
  }

  next();
};

export const validateLead = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, status, source } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Lead name is required.', 400));
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Please provide a valid email address for the lead.', 400));
  }

  if (status && !['new', 'contacted', 'qualified', 'lost'].includes(status)) {
    return next(new AppError('Status must be new, contacted, qualified, or lost.', 400));
  }

  if (!source || !['website', 'instagram', 'referral'].includes(source)) {
    return next(new AppError('Source is required and must be website, instagram, or referral.', 400));
  }

  next();
};

export const validateProfileUpdate = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return next(new AppError('Name must be at least 2 characters long.', 400));
  }

  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (!name && !email) {
    return next(new AppError('Please provide a name or email to update.', 400));
  }

  next();
};

export const validateLeadUpdate = (req: Request, _res: Response, next: NextFunction): void => {
  const { name, email, status, source } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return next(new AppError('Lead name cannot be empty.', 400));
  }

  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  if (status !== undefined && !['new', 'contacted', 'qualified', 'lost'].includes(status)) {
    return next(new AppError('Status must be new, contacted, qualified, or lost.', 400));
  }

  if (source !== undefined && !['website', 'instagram', 'referral'].includes(source)) {
    return next(new AppError('Source must be website, instagram, or referral.', 400));
  }

  next();
};
