import { NextResponse } from 'next/server';
import crypto from 'crypto';

const secretKey = process.env.NEXTAUTH_SECRET
const validityMinutes = process.env.CHANGE_PASSWORD_SESSION_TIME

function decryptAndCheckValidity(encryptedText, secret, validityMinutes) {
  const decipher = crypto.createDecipher('aes-256-cbc', secret);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  // Extract timestamp from decrypted data
  const timestamp = parseInt(decrypted.substring(decrypted.length - 13), 16);
  const email = decrypted.substring(0, decrypted.length - 13);

  // Calculate the current timestamp
  const currentTimestamp = Date.now();

  // Calculate the time difference in minutes
  const timeDifferenceMinutes = (currentTimestamp - timestamp) / (60 * 1000);

  // Check if the validity period has not exceeded
  const isValid = timeDifferenceMinutes <= validityMinutes;

  return { email, timestamp, isValid };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { encryptedToken , newPassword } = body;
  if (encryptedToken && newPassword) {

    // Extract timestamp and email from decrypted data token
    const { email, timestamp, isValid } = decryptAndCheckValidity(encryptedToken, secretKey, validityMinutes);
    
    console.log('Decrypted Data:', email);
    console.log('Timestamp:', new Date(timestamp));
    console.log('Is Valid:', isValid);
   

   if(isValid){
      //token session is valid and password can be updated

      //update password (password need to be encrypted )
      await prisma.user.update({
        where: { email: email },
        data: { newPassword },
      });

   }else{
    console.log("Session Time out. Request for new password change link")
   }

    
    return NextResponse.json(
      { message: 'Password Changed :)' },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { message: 'Token is invalid or expired' },
      { status: 404 },
    );
  }
}