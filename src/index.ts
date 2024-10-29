import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.routes';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import session from 'express-session';
import jwt from 'jsonwebtoken';
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

app.use(cors());
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
  
// JWT Authentication Middleware
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
const token = req.headers.authorization?.split(' ')[1];

if (!token) {
    return res.status(401).json({ message: 'No token provided' });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
} catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
}
};

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