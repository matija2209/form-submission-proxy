import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendMailerSendEmail(options: EmailOptions) {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY as string,
  });

  const sentFrom = new Sender(
    "forms@schnellsite.de",
    "SchnellSite Form"
  );
  const recipients = [new Recipient(options.to, "Recipient")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(options.subject)
    .setHtml(options.html)
    .setText(options.text);

  try {
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email" };
  }
}