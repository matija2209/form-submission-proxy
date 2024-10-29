import express, { Request, Response, Router,RequestHandler } from 'express';
import { formPostController } from '../controllers/form.controllers';
import { validateRequestBody } from '../middleware/validateForm.middleware';
import { asyncWrapper } from '../utils/asyncWrapper';

const apiRouter: Router = express.Router();

apiRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

export interface FormRequestBody {
  senderEmail?: string;
  senderName?: string;
  sentToEmail: string;
  subject: string;
  text: string;
}

apiRouter.post<{}, {}, FormRequestBody>('/',  [validateRequestBody], asyncWrapper(formPostController));

export default apiRouter
