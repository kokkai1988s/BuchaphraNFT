'use server';
/**
 * @fileOverview Provides AI-driven, personalized care tips for amulets based on material and historical context.
 *
 * - provideAmuletCareTips - A function that returns personalized care tips for a given amulet's material and historical context.
 * - ProvideAmuletCareTipsInput - The input type for the provideAmuletCareTips function.
 * - ProvideAmuletCareTipsOutput - The return type for the provideAmuletCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAmuletCareTipsInputSchema = z.object({
  amuletMaterial: z.string().describe('The material of the amulet.'),
  historicalContext: z.string().describe('The historical context of the amulet.'),
});
export type ProvideAmuletCareTipsInput = z.infer<typeof ProvideAmuletCareTipsInputSchema>;

const ProvideAmuletCareTipsOutputSchema = z.object({
  careTips: z.string().describe('Personalized care tips for the amulet based on its material and historical context.'),
});
export type ProvideAmuletCareTipsOutput = z.infer<typeof ProvideAmuletCareTipsOutputSchema>;

export async function provideAmuletCareTips(input: ProvideAmuletCareTipsInput): Promise<ProvideAmuletCareTipsOutput> {
  return provideAmuletCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAmuletCareTipsPrompt',
  input: {schema: ProvideAmuletCareTipsInputSchema},
  output: {schema: ProvideAmuletCareTipsOutputSchema},
  prompt: `คุณเป็นผู้เชี่ยวชาญในการดูแลและรักษาเครื่องราง โดยให้เคล็ดลับการดูแลส่วนบุคคลตามวัสดุและบริบททางประวัติศาสตร์ของเครื่องราง\n\nAmulet Material: {{{amuletMaterial}}}\nHistorical Context: {{{historicalContext}}}\n\nเคล็ดลับการดูแล:`,
});

const provideAmuletCareTipsFlow = ai.defineFlow(
  {
    name: 'provideAmuletCareTipsFlow',
    inputSchema: ProvideAmuletCareTipsInputSchema,
    outputSchema: ProvideAmuletCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
