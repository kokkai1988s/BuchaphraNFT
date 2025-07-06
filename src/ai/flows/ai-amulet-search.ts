'use server';
/**
 * @fileOverview AI-enhanced amulet search functionality.
 *
 * - aiAmuletSearch - A function that performs an AI-enhanced search for amulets based on a query.
 * - AiAmuletSearchInput - The input type for the aiAmuletSearch function.
 * - AiAmuletSearchOutput - The return type for the aiAmuletSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAmuletSearchInputSchema = z.object({
  query: z.string().describe('The search query, which can be a description or related traits.'),
});
export type AiAmuletSearchInput = z.infer<typeof AiAmuletSearchInputSchema>;

const AiAmuletSearchOutputSchema = z.object({
  results: z.string().describe('The search results based on the AI-enhanced query.'),
});
export type AiAmuletSearchOutput = z.infer<typeof AiAmuletSearchOutputSchema>;

export async function aiAmuletSearch(input: AiAmuletSearchInput): Promise<AiAmuletSearchOutput> {
  return aiAmuletSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAmuletSearchPrompt',
  input: {schema: AiAmuletSearchInputSchema},
  output: {schema: AiAmuletSearchOutputSchema},
  prompt: `คุณคือเครื่องมือค้นหาเครื่องรางขั้นสูง ผู้ใช้จะป้อนคำค้นหา และคุณควรตอบกลับด้วยเครื่องรางที่เกี่ยวข้องกับคำค้นหา คำค้นหาไม่จำเป็นต้องเป็นคำหลักที่ตรงกัน แต่อาจเป็นคำอธิบายเชิงแนวคิดหรือลักษณะที่เกี่ยวข้อง

คำค้นหา: {{{query}}}

ผลการค้นหา:`,
});

const aiAmuletSearchFlow = ai.defineFlow(
  {
    name: 'aiAmuletSearchFlow',
    inputSchema: AiAmuletSearchInputSchema,
    outputSchema: AiAmuletSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
