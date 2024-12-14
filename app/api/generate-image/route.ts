
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
