import { writeFile, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'File not found.' }, { status: 404 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = file.name.replaceAll(' ', '-');
  const path = `./public/uploads/${fileName}`;
  await writeFile(path, buffer);

  return NextResponse.json(
    {
      message: 'File uploaded successfuly.',
      path: `/uploads/${fileName}`,
      name: fileName,
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
