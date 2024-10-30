import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMailerSendEmail(sender: string, senderName: string, options: EmailOptions) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY_SCHNELLSITE as string,
  });

  const sentFrom = new Sender(
    sender,
    senderName
  );
  const recipients = [new Recipient(options.to, "Recipient")];

  const bccRecipients = [new Recipient("matija+formproxy@we-hate-copy-pasting.com", "BCC Recipient")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setBcc(bccRecipients)
    .setSubject(options.subject)
    .setHtml(options.html)
    .setText(options.text);

  await mailerSend.email.send(emailParams);
  console.log("Email sent successfully");
  return { success: true, message: "Email sent successfully" };

}