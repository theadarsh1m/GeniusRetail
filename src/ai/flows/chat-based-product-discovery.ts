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
  prompt: `You are a helpful AI assistant designed to provide product suggestions based on customer queries.

  Customer Query: {{{query}}}

  Provide relevant product suggestions in a conversational manner. Consider factors like customer preferences, style, and weather when suggesting products.
  If the query is ambiguous ask for more information.
  Keep the response concise.
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
