'use server';
/**
 * @fileOverview Elite AI synthesis flow for generating cinematic SVG motion scenes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateSvgMotionFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A natural language description of the desired SVG motion scene.'
    ),
});
export type GenerateSvgMotionFromPromptInput = z.infer<typeof GenerateSvgMotionFromPromptInputSchema>;

// Elite Output Schema
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

export async function generateSvgMotionFromPrompt(
  input: GenerateSvgMotionFromPromptInput
): Promise<GenerateSvgMotionFromPromptOutput> {
  return generateSvgMotionFromPromptFlow(input);
}

const eliteSvgMotionPrompt = ai.definePrompt({
  name: 'eliteSvgMotionPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: GenerateSvgMotionFromPromptInputSchema },
  output: { schema: GenerateSvgMotionFromPromptOutputSchema },
  prompt: `You are an elite AI Creative Technologist and SVG Motion Graphics Engine.

Your task is to generate a COMPLETE animated SVG scene from a user prompt.

CRITICAL SVG RULES:
- Generate highly detailed SVG.
- SVG must be multi-layered using <g> tags with unique semantic IDs (e.g., #core, #rings, #particles).
- SVG must be animation-ready.
- Use gradients, filters (glow/blur), and masks.
- SVG must look premium, cinematic, and artist-grade.
- Ensure the SVG uses the specified viewBox.

ANIMATION RULES:
Generate BOTH advanced CSS keyframes and professional GSAP animations.
- Animations must feel cinematic, smooth, and organic.
- Features: floating, staggered motion, glow pulsing, orbital movement, scale breathing.

GSAP REQUIREMENTS:
- Use gsap.timeline() targeting the semantic IDs.
- Use transformOrigin: "center center" for rotations.
- Loop timelines with repeat: -1.

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
    try {
      const { output } = await eliteSvgMotionPrompt(input);
      if (!output) {
        throw new Error('Synthesis failure: The creative engine produced an empty state.');
      }
      return output;
    } catch (error: any) {
      console.error('Elite Synthesis Error:', error);
      throw new Error(`AI synthesis failed: ${error.message || 'Unexpected server response'}`);
    }
  }
);
