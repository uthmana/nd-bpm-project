import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { customAlphabet } from 'nanoid';

export const runtime = 'edge';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
);
export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;
  const contentType = file?.type || 'text/plain';
  const filename = `${nanoid()}.${contentType.split('/')[1]}`;
  const blob = await put(`pdfs/${filename}`, file, {
    contentType,
    access: 'public',
  });

  return NextResponse.json(blob);
}

export async function DELETE(req: Request) {
  try {
    const result = await req.json();
    const { url } = result;
    const urlToDelete = url;
    await del(urlToDelete).catch((error) => {
      throw error;
    });

    return NextResponse.json({ message: 'File deleted.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: err?.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
