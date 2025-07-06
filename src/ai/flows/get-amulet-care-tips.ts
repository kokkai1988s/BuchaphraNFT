'use server';
/**
 * @fileOverview Provides AI-driven care tips for amulets.
 *
 * - getAmuletCareTips - A function that returns care tips for a given amulet description.
 * - GetAmuletCareTipsInput - The input type for the getAmuletCareTips function.
 * - GetAmuletCareTipsOutput - The return type for the getAmuletCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAmuletCareTipsInputSchema = z.object({
  amuletDescription: z.string().describe('The description of the amulet.'),
});
export type GetAmuletCareTipsInput = z.infer<typeof GetAmuletCareTipsInputSchema>;

const GetAmuletCareTipsOutputSchema = z.object({
  careTips: z.string().describe('Care tips for the amulet based on its description.'),
});
export type GetAmuletCareTipsOutput = z.infer<typeof GetAmuletCareTipsOutputSchema>;

export async function getAmuletCareTips(input: GetAmuletCareTipsInput): Promise<GetAmuletCareTipsOutput> {
  return getAmuletCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getAmuletCareTipsPrompt',
  input: {schema: GetAmuletCareTipsInputSchema},
  output: {schema: GetAmuletCareTipsOutputSchema},
  prompt: `คุณเป็นผู้เชี่ยวชาญในการดูแลและรักษาเครื่องราง จากคำอธิบายของเครื่องรางที่ให้มา ให้สร้างเคล็ดลับการดูแลเพื่อรับประกันความทนทานและรักษาสภาพของมัน\n\nคำอธิบายเครื่องราง: {{{amuletDescription}}}\n\nเคล็ดลับการดูแล:`,
});

const getAmuletCareTipsFlow = ai.defineFlow(
  {
    name: 'getAmuletCareTipsFlow',
    inputSchema: GetAmuletCareTipsInputSchema,
    outputSchema: GetAmuletCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
