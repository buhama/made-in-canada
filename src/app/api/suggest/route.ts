import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { product, locale } = await req.json();

    console.log(product, locale);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: locale === 'fr'
            ? "Vous êtes un assistant utile qui suggère des alternatives de produits fabriqués au Canada. Si le produit mentionné est déjà canadien, commencez par le mentionner. Fournissez des suggestions brèves et spécifiques, incluant le nom de l'entreprise, l'emplacement et une courte description. S'il n'existe pas d'alternative canadienne appropriée, indiquez clairement qu'il n'y a pas de bonnes alternatives canadiennes disponibles pour ce produit pour le moment, et expliquez brièvement pourquoi si possible. Si des alternatives existent, utilisez le format HTML pour espacer les alternatives et fournissez jusqu'à 5 alternatives pertinentes. N'utilisez pas le markdown pour le formatage."
            : "You are a helpful assistant that suggests Canadian-made alternatives to products. If the mentioned product is already Canadian, start by mentioning that. Provide brief, specific suggestions including the company name, location, and a short description. If no suitable Canadian alternative exists, clearly state that there are no good Canadian alternatives available for this product at the moment, and briefly explain why if possible. If alternatives exist, use html to space out the alternatives and provide up to 5 relevant alternatives. Don't use markdown for formatting."
        },
        {
          role: "system",
          content: `Make sure your entire answer is in ${locale === 'fr' ? 'French' : 'English'}`
        },
        {
          role: "user",
          content: locale === 'fr'
            ? `Suggérez une alternative fabriquée au Canada pour : ${product}`
            : `Suggest a Canadian-made alternative for: ${product}`
        }
      ],
      max_tokens: 350,
      temperature: 0.1,
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