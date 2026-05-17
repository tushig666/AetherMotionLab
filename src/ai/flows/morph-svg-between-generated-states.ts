
'use server';
/**
 * @fileOverview Vector Topology Morpher utilizing centralized AI Infrastructure.
 */

import { ai, MODEL_ID } from '@/ai/genkit';
import { z } from 'genkit';

const SvgMorphInputSchema = z.object({
  svgContent1: z.string().describe('The first SVG scene as a complete XML string.'),
  svgContent2: z.string().describe('The second SVG scene as a complete XML string.'),
  morphDurationSeconds: z.number().default(2),
  morphStyleDescription: z.string().optional(),
});
export type SvgMorphInput = z.infer<typeof SvgMorphInputSchema>;

const SvgMorphOutputSchema = z.object({
  gsapAnimationCode: z.string().describe('GSAP timeline code for morphing.'),
  morphStrategyExplanation: z.string(),
  matchedElements: z.array(z.object({
    fromId: z.string().optional(),
    toId: z.string().optional(),
    type: z.string(),
    description: z.string(),
  })),
});
export type SvgMorphOutput = z.infer<typeof SvgMorphOutputSchema>;

export async function morphSvgBetweenGeneratedStates(input: SvgMorphInput): Promise<SvgMorphOutput> {
  return morphSvgFlow(input);
}

const morphSvgPrompt = ai.definePrompt({
  name: 'morphSvgPrompt',
  model: MODEL_ID, // Use centralized stable model
  input: { schema: SvgMorphInputSchema },
  output: { schema: SvgMorphOutputSchema },
  prompt: `You are an elite Vector Topology Morpher. Generate GSAP code to morph SVG 1 into SVG 2.

SVG 1: {{{svgContent1}}}
SVG 2: {{{svgContent2}}}
Duration: {{morphDurationSeconds}}s
Style: {{{morphStyleDescription}}}`,
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
      console.error('[Morphing-Error]', error);
      throw new Error(`Topological morphing failed: ${error.message || 'Unexpected engine response'}`);
    }
  }
);
