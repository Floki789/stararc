import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  } else {
    // In production, log to monitoring service
    console.error('Error ID:', Date.now(), err.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { ...error, message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = { ...error, message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message).join(', ');
    error = { ...error, message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = { ...error, message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your token has expired. Please log in again.';
    error = { ...error, message, statusCode: 401 };
  }

  // PostgreSQL errors
  if (err.name === 'error' && (err as any).code) {
    switch ((err as any).code) {
      case '23505': // unique_violation
        error = { ...error, message: 'Duplicate entry', statusCode: 400 };
        break;
      case '23503': // foreign_key_violation
        error = { ...error, message: 'Referenced resource not found', statusCode: 400 };
        break;
      case '23502': // not_null_violation
        error = { ...error, message: 'Required field missing', statusCode: 400 };
        break;
      default:
        error = { ...error, message: 'Database error', statusCode: 500 };
    }
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};