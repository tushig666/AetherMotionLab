'use server';
/**
 * @fileOverview Elite AI synthesis flow with zero-failure resilience.
 */

import { ai, MODEL_ID } from '@/ai/genkit';
import { z } from 'genkit';
import { withRetry } from '@/lib/ai/resilience-utils';
import { generateProceduralFallback } from '@/lib/ai/fallback-generator';

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
  isFallback: z.boolean().optional().describe('Internal flag indicating a procedurally generated result.'),
});

export type GenerateSvgMotionFromPromptOutput = z.infer<typeof GenerateSvgMotionFromPromptOutputSchema>;

const GenerateSvgMotionFromPromptInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the desired SVG motion scene.'),
});

export type GenerateSvgMotionFromPromptInput = z.infer<typeof GenerateSvgMotionFromPromptInputSchema>;

/**
 * High-level Safe Action for SVG synthesis.
 * Ensures a zero-failure experience by returning a procedural fallback if the AI engine fails.
 */
export async function generateSvgMotionFromPrompt(
  input: GenerateSvgMotionFromPromptInput
): Promise<GenerateSvgMotionFromPromptOutput> {
  try {
    return await generateSvgMotionFromPromptFlow(input);
  } catch (error: any) {
    console.warn('[AI-Synthesis-Pipeline] Engine failure detected. Activating procedural fallback.', error.message);
    
    // Generate a world-class fallback locally on the server
    const fallback = generateProceduralFallback(input.prompt);
    
    return {
      ...fallback,
      isFallback: true
    };
  }
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
      const { output } = await eliteSvgMotionPrompt(input);
      if (!output) {
        throw new Error('Synthesis failure: The elite engine produced an empty state.');
      }
      return output;
    });
  }
);
