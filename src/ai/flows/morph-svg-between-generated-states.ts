'use server';
/**
 * @fileOverview This file implements the Genkit flow for the Vector Topology Morpher.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SvgMorphInputSchema = z.object({
  svgContent1: z.string().describe('The first SVG scene as a complete XML string, representing the starting state.'),
  svgContent2: z.string().describe('The second SVG scene as a complete XML string, representing the ending state.'),
  morphDurationSeconds: z.number().default(2).describe('The desired duration for the morph animation in seconds. Default is 2 seconds.'),
  morphStyleDescription: z.string().optional().describe('A natural language description of the desired morphing style.'),
});
export type SvgMorphInput = z.infer<typeof SvgMorphInputSchema>;

const SvgMorphOutputSchema = z.object({
  gsapAnimationCode: z.string().describe('A JavaScript string containing the GSAP timeline code to smoothly morph between the two SVGs.'),
  morphStrategyExplanation: z.string().describe('A detailed explanation of the topological analysis and morphing strategy employed.'),
  matchedElements: z.array(z.object({
    fromId: z.string().optional().describe('The ID of the element in svgContent1 that was matched.'),
    toId: z.string().optional().describe('The ID of the element in svgContent2 that it was matched to.'),
    type: z.string().describe('The type of SVG element.'),
    description: z.string().describe('A brief description of the matching logic.'),
  })).describe('An array describing the intelligent matching of elements.'),
});
export type SvgMorphOutput = z.infer<typeof SvgMorphOutputSchema>;

export async function morphSvgBetweenGeneratedStates(input: SvgMorphInput): Promise<SvgMorphOutput> {
  return morphSvgFlow(input);
}

const morphSvgPrompt = ai.definePrompt({
  name: 'morphSvgPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SvgMorphInputSchema },
  output: { schema: SvgMorphOutputSchema },
  prompt: `You are an elite "Vector Topology Morpher" and "Cinematic Motion Choreographer". Your task is to analyze two complex SVG structures and generate production-ready GSAP JavaScript code to seamlessly and cinematically morph the first SVG into the second.

SVG 1 (Starting State):
{{{svgContent1}}}

SVG 2 (Ending State):
{{{svgContent2}}}

Duration: {{morphDurationSeconds}} seconds
Morph Style: {{{morphStyleDescription}}}

Generate the GSAP code and strategy description.`,
});

const morphSvgFlow = ai.defineFlow(
  {
    name: 'morphSvgBetweenGeneratedStatesFlow',
    inputSchema: SvgMorphInputSchema,
    outputSchema: SvgMorphOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await morphSvgPrompt(input);
      if (!output) throw new Error('Morphing failure: No topology output generated.');
      return output;
    } catch (error: any) {
      throw new Error(`Topological morphing failed: ${error.message || 'Unexpected server response'}`);
    }
  }
);
