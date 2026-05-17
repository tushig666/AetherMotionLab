'use server';
/**
 * @fileOverview Elite AI synthesis flow with resilience and quota awareness.
 */

import { ai, MODEL_ID } from '@/ai/genkit';
import { z } from 'genkit';
import { withRetry } from '@/lib/ai/resilience-utils';

const GenerateSvgMotionFromPromptOutputSchema = z.object({
  title: z.string().describe('Cinematic title of the generated scene.'),
  description: z.string().describe('Detailed artistic description of the composition.'),
  svg: z.string().describe('The complete, detailed, multi-layered SVG XML string.'),
  css: z.string().describe('Advanced CSS keyframe animations for the SVG elements.'),
  gsap: z.string().describe('Professional GSAP timeline code for choreographed motion.'),
  background: z.string().describe('Suggested background styling or color.'),
  viewBox: z.string().describe('The viewBox for the SVG (e.g., "0 0 1200 1200").'),
  layers: z.array(z.string()).describe('List of IDs for the semantic layers created.'),
  animations: z.array(z.string()).describe('Names of the animation sequences implemented.'),
  colorPalette: z.array(z.string()).describe('Cinematic color palette used (hex codes).'),
  morphTargets: z.array(z.string()).describe('IDs of elements designed for potential morphing.'),
});

export type GenerateSvgMotionFromPromptOutput = z.infer<typeof GenerateSvgMotionFromPromptOutputSchema>;

const GenerateSvgMotionFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the desired SVG motion scene.'),
});

export type GenerateSvgMotionFromPromptInput = z.infer<typeof GenerateSvgMotionFromPromptInputSchema>;

export async function generateSvgMotionFromPrompt(
  input: GenerateSvgMotionFromPromptInput
): Promise<GenerateSvgMotionFromPromptOutput> {
  return generateSvgMotionFromPromptFlow(input);
}

const eliteSvgMotionPrompt = ai.definePrompt({
  name: 'eliteSvgMotionPrompt',
  model: MODEL_ID,
  input: { schema: GenerateSvgMotionFromPromptInputSchema },
  output: { schema: GenerateSvgMotionFromPromptOutputSchema },
  prompt: `You are an elite AI SVG Motion Graphics Engine.

Your task is to generate:
1. Advanced SVG artwork
2. CSS animations
3. GSAP animation timelines
4. Structured scene metadata

Return ONLY strict valid JSON. No markdown, no comments.

SVG REQUIREMENTS:
- Premium cinematic multi-layered SVG.
- Semantic IDs (e.g., #core, #rings, #particles).
- Complex gradients and filters.

ANIMATION REQUIREMENTS:
- Smooth, cinematic, futuristic motion.
- CSS for basic loops, GSAP for complex choreography.

USER PROMPT:
"{{{prompt}}}"`,
});

const generateSvgMotionFromPromptFlow = ai.defineFlow(
  {
    name: 'generateSvgMotionFromPromptFlow',
    inputSchema: GenerateSvgMotionFromPromptInputSchema,
    outputSchema: GenerateSvgMotionFromPromptOutputSchema,
  },
  async (input) => {
    return withRetry(async () => {
      try {
        const { output } = await eliteSvgMotionPrompt(input);
        if (!output) {
          throw new Error('Synthesis failure: The elite engine produced an empty state.');
        }
        return output;
      } catch (error: any) {
        console.error('[AI-Flow-Error]', error);
        throw error;
      }
    });
  }
);
