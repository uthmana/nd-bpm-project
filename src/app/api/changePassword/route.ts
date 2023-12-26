import { NextResponse } from 'next/server';
//import crypto from 'crypto';
import { hash } from 'bcryptjs';
import prisma from 'app/lib/db1';
// eslint-disable-next-line no-use-before-define
import crypto from 'node:crypto';

const secretKey = process.env.CHANGE_PASSWORD_SECRET;
const validityMinutes = process.env.CHANGE_PASSWORD_SESSION_TIME;

function decryptWithTimestamp(encryptedData: string, key: Buffer): string {
  const [encrypted, ivHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // eslint-disable-next-line no-use-before-define
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  // eslint-disable-next-line no-use-before-define
  decrypted += decipher.final('utf-8');

  const decryptedObject = JSON.parse(decrypted);

  // Verify timestamp or expiration time
  const currentTimestamp = Date.now();
  if (
    decryptedObject.expirationTime &&
    currentTimestamp > decryptedObject.expirationTime
  ) {
    throw new Error('Time expired has expired');
  }

  return decryptedObject.text;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { encryptedToken, newPassword } = body;

  try {
    const decryptedText = decryptWithTimestamp(
      encryptedToken,
      Buffer.from(secretKey, 'hex'),
    );

    //encrypt new password and insert into database
    const TobeUpdatedpassword = await hash(newPassword, 12);

    //update password of user with the token decrypted
    await prisma.user.update({
      where: { email: decryptedText },
      data: { password: TobeUpdatedpassword },
    });
    return NextResponse.json(
      { message: 'Password Changed :)' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Decryption Error:', error.message);
    return NextResponse.json(
      { error: 'Decryption failed or data has expired' },
      { status: 401 },
    );
  }
}
