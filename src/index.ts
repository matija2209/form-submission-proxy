import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import session from 'express-session';

dotenv.config();

const app: Express = express();
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);
  
  
const port = process.env.PORT || 3000;

// Middleware

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://schnellsite.de',"https://www.nikolas-gebaeudereinigung.de","https://nikolas-gebaeudereinigung.de"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // if you're using cookies or authentication
}));

app.use(express.json());
app.use(cookieParser());

// So to get the JWT token there needs to be some kind of authnetication done. JWT bascially is helped to identify the client. While SECRET is a express way of knowing whether that session in genuine

app.use(session({
    secret: randomUUID(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict'
    }
  }));

// Routes
app.use('/form', apiRouter);

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;