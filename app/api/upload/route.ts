import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`;
    
    // Save to public/uploads directory
    const uploadsDir = join(process.cwd(), 'public/uploads');
    const path = join(uploadsDir, filename);

    try {
      await writeFile(path, buffer);
      return NextResponse.json(
        { 
          message: 'File uploaded successfully',
          url: `/uploads/${filename}`
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Error saving the file.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 