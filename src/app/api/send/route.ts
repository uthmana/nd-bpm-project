// pages/api/send.js
import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const secretKey = process.env.NEXTAUTH_SECRET
const validityMinutes = process.env.CHANGE_PASSWORD_SESSION_TIME


function encryptWithTimestamp(text, secret, validityMinutes) {
  const timestamp = Date.now().toString();
  const dataToEncrypt = `${text}${timestamp}`;

  const cipher = crypto.createCipher('aes-256-cbc', secret);
  let encrypted = cipher.update(dataToEncrypt, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
// // functions for token generation
// function generateToken(email, secret) {
//   const seesionTime = generateSession (10); //Date.now().toString(); // Example: 10 minutes validity

//   // Concatenate email, secret, and timestamp
//   const dataToEncrypt = `${email}${secret}${seesionTime}`;

//   // Use a secure hash function to generate a hash
//   const hash = crypto.createHash('sha256').update(dataToEncrypt).digest('hex');

//   return hash;
// }

// function generateSession(validityMinutes) {
//   const tokenValidityMilliseconds = validityMinutes * 60 * 1000; // Convert minutes to milliseconds

//   // Calculate the expiration timestamp by adding the validity duration to the current time
//   const expirationTimestamp = Date.now() + tokenValidityMilliseconds;

//   // Convert the timestamp to a hexadecimal string
//   const expirationHex = expirationTimestamp.toString(16);

//   // Generate a random buffer and convert it to a hexadecimal string
//   const session = crypto.randomBytes(10).toString('hex') + expirationHex;

//   return session;
// }

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (formData.type === 'send_email_for_change_password') {
      const user = await prisma.user.findUnique({
        where: { email: formData.email },
      });

      // Log the user information for debugging
      console.log("User that requested a change for password: ", user);

      if (user) {
        // Generate an encrypted token of the user email with a secret key and make it expire after some time
        const name = encryptWithTimestamp(formData.email, secretKey, validityMinutes); //userType should be token

        // Assuming there's a 'token' field in the user model
        await prisma.user.update({
          where: { email: formData.email },
          data: { name},
        });

        const link = `localhost://3000/auth/change-password?token=${name}`;

        const data = await resend.emails.send({
          from: 'ND <info@ndindustriesbmp.com>',
          to: formData.email,
          subject: formData.subject,
          html: `<p>${formData.message + " use this link to change password    " + link}</p>`,
        });

        console.log("Updated user : ", user);
        console.log("Link to change password \n : ", link);
        return NextResponse.json(data);
      } else {
        console.log("The user does not exit check email and try agian");
        return NextResponse.json({ error: 'User not found' });
      }
    }
  } catch (error) {
    // Handle errors, log them, and provide an appropriate response
    console.error('Error from api side:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' });
  } finally {
    // Close the Prisma client connection in the finally block
    await prisma.$disconnect();
  }
}
