// enhance-amulet-description.ts
'use server';
/**
 * @fileOverview Enhances amulet descriptions using AI.
 *
 * - enhanceAmuletDescription - A function that enhances a given amulet description.
 * - EnhanceAmuletDescriptionInput - The input type for the enhanceAmuletDescription function.
 * - EnhanceAmuletDescriptionOutput - The return type for the enhanceAmuletDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceAmuletDescriptionInputSchema = z.object({
  amuletDescription: z.string().describe('The basic description of the amulet to be enhanced.'),
});
export type EnhanceAmuletDescriptionInput = z.infer<typeof EnhanceAmuletDescriptionInputSchema>;

const EnhanceAmuletDescriptionOutputSchema = z.object({
  enhancedDescription: z.string().describe('The AI-enhanced description of the amulet.'),
});
export type EnhanceAmuletDescriptionOutput = z.infer<typeof EnhanceAmuletDescriptionOutputSchema>;

export async function enhanceAmuletDescription(input: EnhanceAmuletDescriptionInput): Promise<EnhanceAmuletDescriptionOutput> {
  return enhanceAmuletDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceAmuletDescriptionPrompt',
  input: {schema: EnhanceAmuletDescriptionInputSchema},
  output: {schema: EnhanceAmuletDescriptionOutputSchema},
  prompt: `คุณเป็นผู้เชี่ยวชาญในการสร้างคำอธิบายที่น่าสนใจและมีรายละเอียดสำหรับเครื่องราง เพิ่มประสิทธิภาพคำอธิบายพื้นฐานที่ให้มาเพื่อสร้างผลงานที่น่าสนใจและให้ข้อมูลมากขึ้น

คำอธิบายเครื่องรางพื้นฐาน: {{{amuletDescription}}}

คำอธิบายที่เพิ่มประสิทธิภาพ:`, 
});

const enhanceAmuletDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceAmuletDescriptionFlow',
    inputSchema: EnhanceAmuletDescriptionInputSchema,
    outputSchema: EnhanceAmuletDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
