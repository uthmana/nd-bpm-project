import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string,
) => {
  try {
    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: 'hello_world',
          language: { code: 'en_US' },
          //   components: [
          //     {
          //       type: 'body',
          //       parameters: [
          //         {
          //           type: 'text',
          //           text: message,
          //         },
          //       ],
          //     },
          //   ],
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(
        `Failed to send WhatsApp message to ${phoneNumber}:`,
        result.error,
      );
    }

    console.log(result);
  } catch (error) {
    console.error(`Error sending WhatsApp message to ${phoneNumber}:`, error);
  }
};

export const sendEmailNotification = async (
  emails: string[],
  title: string,
  description: string,
  link: string,
) => {
  const emailBody = {
    from: 'ND Industries <info@ndindustries.com.tr>',
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
