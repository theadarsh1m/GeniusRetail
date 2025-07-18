// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview A restocking suggestion AI agent.
 *
 * - getRestockingSuggestions - A function that handles the restocking suggestion process.
 * - GetRestockingSuggestionsInput - The input type for the getRestockingSuggestions function.
 * - GetRestockingSuggestionsOutput - The return type for the getRestockingSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRestockingSuggestionsInputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the product.'),
    stock: z.number().describe('The current stock level of the product.'),
    description: z.string().describe('The description of the product.'),
    category: z.string().describe('The category of the product.'),
    price: z.number().describe('The price of the product.'),
    tags: z.array(z.string()).describe('The tags associated with the product.'),
  })
).describe('An array of products with their details, including name, stock level, description, category, price and tags.');

export type GetRestockingSuggestionsInput = z.infer<typeof GetRestockingSuggestionsInputSchema>;

const GetRestockingSuggestionsOutputSchema = z.array(
  z.object({
    productName: z.string().describe('The name of the product to restock.'),
    suggestion: z.string().describe('The suggested quantity to restock and the reason for the suggestion.'),
  })
).describe('An array of restocking suggestions for each product.');

export type GetRestockingSuggestionsOutput = z.infer<typeof GetRestockingSuggestionsOutputSchema>;

export async function getRestockingSuggestions(
  input: GetRestockingSuggestionsInput
): Promise<GetRestockingSuggestionsOutput> {
  return getRestockingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRestockingSuggestionsPrompt',
  input: {schema: GetRestockingSuggestionsInputSchema},
  output: {schema: GetRestockingSuggestionsOutputSchema},
  prompt: `You are an AI assistant that analyzes current stock levels and generates restocking suggestions for low-stock items.

Analyze the following product data and provide restocking suggestions for each product, including the quantity to restock and the reason for the suggestion. Focus on items with low stock levels.

Product Data:
{{#each this}}
- Name: {{name}}
  Stock: {{stock}}
  Description: {{description}}
  Category: {{category}}
  Price: {{price}}
  Tags: {{tags}}
{{/each}}

Restocking Suggestions (productName, suggestion):
`,
});

const getRestockingSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRestockingSuggestionsFlow',
    inputSchema: GetRestockingSuggestionsInputSchema,
    outputSchema: GetRestockingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
