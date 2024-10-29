import express, { Request, Response, Router,RequestHandler } from 'express';
import { formPostController } from '../controllers/form.controllers';
import { validateRequestBody } from '../middleware/validateForm.middleware';

const apiRouter: Router = express.Router();

apiRouter.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello, world!' });
});

export interface FormRequestBody {
  email: string;
  subject: string;
  message: string;
}

apiRouter.post<{}, {}, FormRequestBody>('/',  [validateRequestBody], formPostController);

export default apiRouter
