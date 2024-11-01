import { Request, Response,RequestHandler } from "express";
import { sendMailerSendEmail } from "../lib/mailersend.js";
import { FormRequestBody } from "../routes/api.routes.js";



export const formPostController = async (
  req: Request<{}, {}, FormRequestBody>,
  res: Response
) => {
  const { sentToEmail, subject, text } = req.body;
  const { senderEmail, senderName } = req.body;
  const html = textToHTML(text);
  await sendMailerSendEmail("noreply@schnellsite.de", "SchnellSite Form Submission", { to: sentToEmail, subject, html, text });
  res.json({ message: 'Email sent successfully' });
};

function textToHTML(text:string) {
  return `
    <html>
      <body>
        <p>${text.replace(/\n/g, '<br>')}</p>
      </body>
    </html>
  `;
}