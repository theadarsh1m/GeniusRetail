'use server';
/**
 * @fileOverview Implements a chat-based product discovery flow, allowing customers to ask questions and receive product suggestions.
 *
 * - chatBasedProductDiscovery - A function that initiates the product discovery process.
 * - ChatBasedProductDiscoveryInput - The input type for the chatBasedProductDiscovery function.
 * - ChatBasedProductDiscoveryOutput - The return type for the chatBasedProductDiscovery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatBasedProductDiscoveryInputSchema = z.object({
  query: z.string().describe('The customer query about products.'),
});
export type ChatBasedProductDiscoveryInput = z.infer<typeof ChatBasedProductDiscoveryInputSchema>;

const ChatBasedProductDiscoveryOutputSchema = z.object({
  response: z.string().describe('The AI response with product suggestions.'),
});
export type ChatBasedProductDiscoveryOutput = z.infer<typeof ChatBasedProductDiscoveryOutputSchema>;

export async function chatBasedProductDiscovery(input: ChatBasedProductDiscoveryInput): Promise<ChatBasedProductDiscoveryOutput> {
  return chatBasedProductDiscoveryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatBasedProductDiscoveryPrompt',
  input: {schema: ChatBasedProductDiscoveryInputSchema},
  output: {schema: ChatBasedProductDiscoveryOutputSchema},
  prompt: `You are a fashion stylist AI helping users find clothing and outfit suggestions based on their preferences, mood, and occasion.

Your job is to:
- Understand user inputs like "I want something for college", "I feel lazy today", or "I like black"
- Immediately respond with specific outfit ideas or items (not more questions)
- Always suggest 2–3 outfit ideas with:
    - Top
    - Bottom
    - Footwear
    - Accessories (optional)
    - Color/style reasoning

✅ Sample Output Format:
👗 Outfit 1 – Chill College Vibe:
- Top: Oversized white hoodie
- Bottom: Black joggers
- Shoes: White sneakers
- Why: Comfortable and casual, perfect for laid-back days.

👗 Outfit 2 – Sleek & Minimal:
- Top: Slim black t-shirt
- Bottom: Beige chinos
- Shoes: Loafers or clean canvas shoes
- Why: This balances a dark color with a lighter tone for a clean look.

IMPORTANT: Keep replies short, direct, and focused on clothing suggestions. Don’t ask too many follow-up questions unless really needed.

Customer Query: {{{query}}}
`,
});

const chatBasedProductDiscoveryFlow = ai.defineFlow(
  {
    name: 'chatBasedProductDiscoveryFlow',
    inputSchema: ChatBasedProductDiscoveryInputSchema,
    outputSchema: ChatBasedProductDiscoveryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
