import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailNotification = async (
  emails: string[],
  title: string,
  description: string,
  link: string,
) => {
  const emailBody = {
    from: `ND Industries <info@${process.env.VERIFIED_DOMAIN}>`,
    to: emails,
    subject: title,
    html: `<h1>${title}</h1><p>${description}</p><p><a href="${link}">${link}</a></p>`,
  };

  try {
    const { data, error } = await resend.emails.send(emailBody);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    return null;
  }
};
