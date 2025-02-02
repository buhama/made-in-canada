import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { product } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that suggests Canadian-made alternatives to products. Provide brief, specific suggestions including the company name, location, and a short description. If no suitable Canadian alternative exists, suggest the closest possible Canadian-made option. Dont use markdown or any other formatting. Provide around 5 alternatives."
        },
        {
          role: "user",
          content: `Suggest a Canadian-made alternative for: ${product}`
        }
      ],
      max_tokens: 150,
      temperature: 0.2,
    });

    return NextResponse.json({ suggestion: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestion' },
      { status: 500 }
    );
  }
} 