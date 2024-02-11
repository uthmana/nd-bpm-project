import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  return NextResponse.json({ message: 'Hello, Next.js!' });
}

// export async function POST(request: Request, context: any) {
//   try {
//     const { data, outputPath } = await request.json();

//     const options = {
//       width: 300,
//       height: 300,
//     };

//     const file = await QRCode.toFile(outputPath, data, options);
//     return NextResponse.json(file, { status: 200 });
//   } catch (err) {
//     console.log(err);
//   }
// }
