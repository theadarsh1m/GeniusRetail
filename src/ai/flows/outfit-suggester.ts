'use server';
/**
 * @fileOverview An AI flow that suggests outfit combinations based on an image or text description of a clothing item.
 *
 * - suggestOutfit - A function that suggests complementary clothing items.
 * - OutfitSuggesterInput - The input type for the suggestOutfit function.
 * - OutfitSuggesterOutput - The return type for the suggestOutfit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutfitSuggesterInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a single fashion item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ).optional(),
  description: z.string().describe('A text description of the fashion item.').optional(),
})
.refine(data => data.photoDataUri || data.description, {
    message: "Either a photo or a description must be provided."
});

export type OutfitSuggesterInput = z.infer<typeof OutfitSuggesterInputSchema>;

export const OutfitSuggesterOutputSchema = z.object({
  mainItem: z.string().describe('The name and description of the main clothing item identified from the input.'),
  complementary: z
    .array(z.string())
    .describe('An array of 2-3 complementary items or accessories that match the main item.'),
});
export type OutfitSuggesterOutput = z.infer<typeof OutfitSuggesterOutputSchema>;

export async function suggestOutfit(input: OutfitSuggesterInput): Promise<OutfitSuggesterOutput> {
  // The schema is validated here to ensure at least one input is provided.
  OutfitSuggesterInputSchema.parse(input);
  return outfitSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'outfitSuggesterPrompt',
  input: {schema: OutfitSuggesterInputSchema},
  output: {schema: OutfitSuggesterOutputSchema},
  prompt: `You are an expert fashion stylist AI. Your task is to analyze a single clothing item provided either as a photo or a text description and suggest a complete outfit.

1.  **Analyze the Item**: First, identify the main clothing item. Note its category (e.g., kurti, shirt, jeans), color, style (e.g., casual, ethnic, formal), and fabric if possible.

2.  **Suggest an Outfit**: Based on your analysis, suggest 2-3 matching accessories and complementary clothing items. Follow these rules:
    *   **Style Cohesion**: Ensure the suggested items match the style of the main item (e.g., ethnic items with ethnic wear, formal with formal).
    *   **Color Harmony**: Use color theory to suggest complementary colors (e.g., maroon pairs well with beige, gold, or cream).
    *   **Relevance**: Keep suggestions practical and relevant for typical occasions.

3.  **Format the Output**: Return your suggestions in the specified JSON format.

{{#if photoDataUri}}
Analyze the item in this photo:
Photo: {{media url=photoDataUri}}
{{/if}}

{{#if description}}
Analyze the item from this description:
Description: {{{description}}}
{{/if}}
`,
});

const outfitSuggesterFlow = ai.defineFlow(
  {
    name: 'outfitSuggesterFlow',
    inputSchema: OutfitSuggesterInputSchema,
    outputSchema: OutfitSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
