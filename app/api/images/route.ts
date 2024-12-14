import { NextResponse } from 'next/server'
import { readdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public/uploads')
    const files = await readdir(uploadsDir)
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map(file => ({
        url: `/uploads/${file}`,
        name: file
      }))

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error reading images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
} 