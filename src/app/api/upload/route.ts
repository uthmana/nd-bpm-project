import { writeFile, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'File not found.' }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique file name using timestamp and uuid
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const randomString = uuidv4().replace(/-/g, '');
  const uniqueFileName = `${timestamp}_${randomString}_${file.name.replaceAll(
    ' ',
    '-',
  )}`;

  const filePath = `./public/uploads/${uniqueFileName}`;
  await writeFile(filePath, buffer);

  return NextResponse.json(
    {
      message: 'File uploaded successfully.',
      path: `/uploads/${uniqueFileName}`,
      name: uniqueFileName,
    },
    { status: 200 },
  );
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  const path = `./public/uploads/${name}`;
  try {
    await unlink(path);
    return NextResponse.json({ message: 'File deleted.' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err?.message }, { status: 500 });
  }
}
