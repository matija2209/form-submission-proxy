import { Request, Response,RequestHandler } from "express";
import { sendMailerSendEmail } from "../lib/mailersend";
import { FormRequestBody } from "../routes/api.routes";



export const formPostController = async (
  req: Request<{}, {}, FormRequestBody>,
  res: Response
) => {
  const { email, subject, message } = req.body;
  
  await sendMailerSendEmail({ to: email, subject, html: message, text: message });
  res.json({ message: 'Email sent successfully' });
};
