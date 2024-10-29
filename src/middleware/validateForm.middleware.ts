import { Request, Response, NextFunction } from 'express';
import type { FormRequestBody } from '../routes/api.routes'; // Import the type

// Create a reference object that matches the interface
const formRequestReference: FormRequestBody = {
  sentToEmail: '',
  subject: '',
  text: ''
};

export const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get expected keys from the reference object
  const expectedKeys = Object.keys(formRequestReference);
  
  // Check if any value is empty or undefined
  const emptyKeys = expectedKeys.filter(key => !req.body[key]);
  
  if (emptyKeys.length > 0) {
    return res.status(400).json({
      error: 'Empty required fields',
      emptyFields: emptyKeys
    });
  }

  next();
};
