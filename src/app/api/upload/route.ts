import { writeFile, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'File not found.' }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const now = new Date();
  const padZero = (num: number): string => num.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${padZero(
    now.getMonth() + 1,
  )}-${padZero(now.getDate())}_${padZero(now.getHours())}-${padZero(
    now.getMinutes(),
  )}-${padZero(now.getSeconds())}`;

  const randomString = uuidv4().replace(/-/g, '').slice(0, 10);

  // Extract the file extension from the original file name
  const originalFileName = file.name;
  const fileExtension = extname(originalFileName);

  // Rename the file here
  const newFileName = 'nd_industries';
  const uniqueFileName = `${timestamp}_${randomString}_${newFileName}${fileExtension}`;

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
