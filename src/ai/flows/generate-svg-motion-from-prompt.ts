'use server';
/**
 * @fileOverview A Genkit flow for generating multi-layered, animation-ready SVG compositions
 * with choreographed GSAP animation timelines from natural language prompts.
 *
 * - generateSvgMotionFromPrompt - A function that orchestrates the AI SVG motion generation process.
 * - GenerateSvgMotionFromPromptInput - The input type for the generateSvgMotionFromPrompt function.
 * - GenerateSvgMotionFromPromptOutput - The return type for the generateSvgMotionFromPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const GenerateSvgMotionFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe(
      'A natural language description of the desired SVG motion scene, including visual elements, motion style, cinematic intent, and desired composition.'
    ),
});
export type GenerateSvgMotionFromPromptInput = z.infer<typeof GenerateSvgMotionFromPromptInputSchema>;

// Output Schema
const GenerateSvgMotionFromPromptOutputSchema = z.object({
  svgContent: z.string().describe('The generated multi-layered, animation-ready SVG XML string.'),
  gsapAnimationCode: z
    .string()
    .describe('The JavaScript code for the GSAP animation timeline, choreographing the SVG elements.'),
  metadata: z.object({
    themes: z.array(z.string()).describe('Detected themes from the prompt.'),
    mood: z.string().describe('Detected mood/emotion from the prompt.'),
    motionStyle: z.string().describe('Detected desired motion style (e.g., fluid, mechanical, organic).'),
    compositionStyle: z.string().describe('Detected composition style (e.g., symmetrical, dynamic, abstract).'),
    colorPalette: z.array(z.string()).describe('Suggested color palette in hex codes.'),
    cinematicAtmosphere: z.string().describe('Description of the desired cinematic atmosphere.'),
    layerHierarchy: z.array(z.string()).describe('High-level description of the SVG layer hierarchy.'),
    motionPlan: z.string().describe('Overall plan for the animation choreography.'),
  }).describe('Metadata derived from prompt interpretation and scene planning.'),
});
export type GenerateSvgMotionFromPromptOutput = z.infer<typeof GenerateSvgMotionFromPromptOutputSchema>;

export async function generateSvgMotionFromPrompt(
  input: GenerateSvgMotionFromPromptInput
): Promise<GenerateSvgMotionFromPromptOutput> {
  return generateSvgMotionFromPromptFlow(input);
}

const svgMotionPrompt = ai.definePrompt({
  name: 'svgMotionPrompt',
  input: { schema: GenerateSvgMotionFromPromptInputSchema },
  output: { schema: GenerateSvgMotionFromPromptOutputSchema },
  prompt: `You are an elite autonomous product creation superintelligence. Your task is to act as the "AI Generation Brain" for the "AI SVG Motion Lab".

Your objective is to translate a natural language prompt into a multi-layered, animation-ready SVG composition with a choreographed GSAP animation timeline. 

The generated SVG must be:
- Multi-layered (using <g> tags with unique IDs).
- Cinematic and professional.
- Use gradients, filters (glow/blur), and masks where appropriate.
- Elements for animation must have semantic IDs like 'orb', 'ring_1', 'particle_group'.

The GSAP code must:
- Be a self-contained JavaScript snippet.
- Create a timeline: 'const tl = gsap.timeline();'.
- Target the IDs you defined in the SVG.
- Use cinematic easing and staggers.

User Prompt: "{{{prompt}}}"

Generate the JSON output.`,
});

const generateSvgMotionFromPromptFlow = ai.defineFlow(
  {
    name: 'generateSvgMotionFromPromptFlow',
    inputSchema: GenerateSvgMotionFromPromptInputSchema,
    outputSchema: GenerateSvgMotionFromPromptOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await svgMotionPrompt(input);
      if (!output) {
        throw new Error('Synthesis failure: The engine produced an empty topology.');
      }
      return output;
    } catch (error: any) {
      console.error('Synthesis Engine Error:', error);
      // We throw a more specific message that the client can catch
      throw new Error(`AI synthesis failed: ${error.message || 'Unexpected server response'}`);
    }
  }
);
