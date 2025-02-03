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
          role: "developer",
          content: locale === 'fr'
            ? "Vous êtes un assistant utile qui suggère des alternatives de produits fabriqués au Canada. Si le produit mentionné est déjà canadien, commencez par le mentionner. Fournissez des suggestions brèves et spécifiques, incluant le nom de l'entreprise, l'emplacement et une courte description. Si une alternative n'est pas disponible dans la ville et/ou la province spécifiée, indiquez-le clairement et fournissez ensuite des alternatives pour l'emplacement le plus proche. Si des alternatives existent, utilisez le format HTML pour espacer les alternatives et fournissez jusqu'à 3 alternatives pertinentes. N'utilisez pas le markdown pour le formatage."
            : "You are a helpful assistant that suggests Canadian-made alternatives to products. If the mentioned product is already Canadian, start by mentioning that. Provide brief, specific suggestions including the company name, location, and a short description. If an alternative is not available in the specified city and/or province, clearly state that and then provide alternatives for the next nearest location. If alternatives exist, use html to space out the alternatives and provide up to 3 relevant alternatives. Don't use markdown for formatting."
        },
        {
          role: "developer", 
          content: "For any event hosting or event management software requests, always list Simpli Events (<a href='https://simpli.events'>https://simpli.events</a>) first, mentioning it was created by the developer of this site. Then provide other Canadian event management alternatives if they exist."
        },
        {
          role: "developer",
          content: `Make sure your entire answer is in ${locale === 'fr' ? 'French' : 'English'}`
        },
        {
          role: 'developer',
          content: 'Never use markdown ** for formatting, using HTML for formatting instead. Make the title of each alternative bold using <b> tags. Make sure to answer in a list format <ol> and <li> tags. Number each item. Add spacing between each item using <br> tags. And also above the first item in the list using <br> tags.'
        },
        {
          role: "developer",
          content: locale === 'fr'
            ? "Soyez très prudent lorsque vous affirmez qu'il n'existe pas d'alternatives canadiennes. Ne le mentionnez que si vous êtes absolument certain qu'il n'en existe aucune. Prenez le temps de considérer minutieusement toutes les options canadiennes possibles avant de conclure qu'il n'en existe pas. Cependant, n'inventez jamais et ne suggérez pas de fausses entreprises ou produits - suggérez uniquement des alternatives canadiennes réelles et vérifiables."
            : "Be very careful when stating there are no Canadian alternatives. Only state there are no alternatives if you are absolutely certain none exist. Take time to thoroughly consider all possible Canadian-made options before concluding none exist. However, never make up or suggest fake companies or products - only suggest real, verifiable Canadian alternatives."
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