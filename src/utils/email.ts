const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: process.env.MAILGUN_DOMAIN || "",
  key: process.env.MAILGUN_API_KEY || "",
});
export async function sendEmail(to: string, subject: string, text: string) {
  const data = {
    from: "postmaster@" + process.env.MAILGUN_DOMAIN,
    to,
    subject,
    text,
  };

  try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: true, message: "Failed to send verification email" }; // Return error object
  }
}
