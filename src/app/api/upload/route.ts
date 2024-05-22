import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { customAlphabet } from 'nanoid';
import { revalidatePath } from 'next/cache';

export const runtime = 'edge';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
); // 7-character random string
export async function POST(req: NextRequest) {
  //const file = req.body || '';
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;
  const contentType = file?.type || 'text/plain';
  const filename = `${nanoid()}.${contentType.split('/')[1]}`;
  const blob = await put(`pdfs/${filename}`, file, {
    contentType,
    access: 'public',
  });
  //revalidatePath('/');

  return NextResponse.json(blob);
}

export async function DELETE(req: Request) {
  try {
    // Parse the incoming request body
    const result = await req.json();
    const { url, name } = result;
    const urlToDelete = url;
    await del(urlToDelete).catch((error) => {
      throw error; // Re-throw the error to be caught later
    });

    return NextResponse.json({ message: 'File deleted.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: err?.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
