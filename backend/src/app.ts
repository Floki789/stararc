import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import subscriptionRoutes from './routes/subscriptions';
import stripeRoutes from './routes/stripe';
import twoFactorRoutes from './routes/twoFactor';
import publicRoutes from './routes/public';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables (resolve path relative to this file for reliability)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3004;

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Force HTTPS redirect middleware
app.use((req, res, next) => {
  // Skip redirect in development or if already HTTPS
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Check if request came through HTTPS
  const isHttps = req.header('x-forwarded-proto') === 'https' || 
                  req.secure;
  
  if (!isHttps) {
    const httpsUrl = `https://${req.header('host')}${req.url}`;
    return res.redirect(301, httpsUrl);
  }
  
  // Add HSTS header for enhanced security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  next();
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'", 
        "https://api.stripe.com",
        "https://spaceship-app-05fdc7b20f43.herokuapp.com",
        "https://stararc-app-e576e504324e.herokuapp.com",
        "https://spaceship.stararc.one",
        "https://stararc.one",
        "https://www.stararc.one"
      ],
      frameSrc: ["'self'", "https://js.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3003',
    process.env.SPACESHIP_URL || 'http://localhost:3001', // Spaceship app
    'http://localhost:3000', // Fallback for testing
    'http://localhost:3001',
    'http://localhost:3003',
    'https://spaceship-app-05fdc7b20f43.herokuapp.com', // Production Spaceship Heroku domain
    'https://spaceship.stararc.one', // Production Spaceship custom domain
    'https://stararc-app-e576e504324e.herokuapp.com', // Production StarArc Heroku domain
    'https://stararc.one', // Production StarArc custom domain
    'https://www.stararc.one' // Production StarArc custom www domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 500 : 1000, // Increased for testing: 500 in production, 1000 in dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  headers: true,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// Stripe webhook middleware (must be before body parsing)
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Body parsing middleware
app.use(express.json({ 
  limit: '10mb',
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Stararc Backend API',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/public', publicRoutes);

// Privacy policy endpoint
app.get('/api/privacy', (req, res) => {
  res.json({
    policy: 'Swiss Privacy-by-Design',
    principles: [
      'Zero data retention policy',
      'No tracking or analytics',
      'Client-side encryption only',
      'Automatic document deletion',
      'No data sales or sharing',
      'Swiss privacy standards'
    ],
    contact: 'privacy@stararc.one'
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  // Catch all handler: send back React's index.html file for SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
  });
} else {
  // Development: Just serve API endpoints
  app.get('/', (req, res) => {
    res.json({ message: 'Stararc API - Development Mode' });
  });
}

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Stararc backend running on port ${PORT}`);
    console.log(`🛡️ Privacy-by-Design API ready`);
    console.log(`🇨🇭 Swiss privacy standards enabled`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;