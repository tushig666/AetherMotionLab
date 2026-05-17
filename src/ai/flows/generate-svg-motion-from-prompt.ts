'use server';
/**
 * @fileOverview Elite AI synthesis flow for generating cinematic SVG motion scenes.
 * This flow utilizes advanced prompt engineering to ensure high-fidelity, animation-ready vector output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Elite Output Schema - Matches the strict JSON requirement
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

// Input Schema
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
  model: 'googleai/gemini-1.5-flash',
  input: { schema: GenerateSvgMotionFromPromptInputSchema },
  output: { schema: GenerateSvgMotionFromPromptOutputSchema },
  prompt: `You are an elite AI SVG Motion Graphics Engine running inside a Firebase + Gemini production environment.

Your task is to generate:
1. Advanced SVG artwork
2. CSS animations
3. GSAP animation timelines
4. Structured scene metadata

Return ONLY strict valid JSON.

DO NOT:
- use markdown
- use code blocks
- explain anything
- add extra text
- add comments

SVG RULES:
- Generate premium cinematic SVG scenes
- SVG must be layered using <g> tags with semantic IDs
- SVG must be animation-ready
- Use semantic IDs/classes (e.g., #energy-core, #orbit-ring)
- Use grouped structures
- Use complex gradients and defs
- Use glow filters and masking
- Use transform-friendly layouts
- Use visually impressive composition (cinematic, futuristic, premium)

MANDATORY SVG GROUPS TO CONSIDER:
- #background-layer
- #main-object
- #particles-layer
- #energy-core
- #orbit-ring
- #light-trails

ANIMATION RULES:
Generate BOTH advanced CSS keyframes and GSAP timelines.
Motion must feel: cinematic, organic, futuristic, fluid, premium.

MANDATORY ANIMATION TYPES:
- floating & scale breathing
- pulsing glow effects
- orbital movement & parallax drift
- stagger animations for groups
- particle motion & light trails

GSAP RULES:
- Use gsap.timeline()
- Use repeat: -1
- Use yoyo: true where useful
- Use stagger: 0.1 or similar
- Use power2.inOut or similar easing
- Use transformOrigin: "50% 50%" or "center center"

CSS RULES:
Generate advanced keyframes including: float, pulse, drift, rotate, shimmer, flicker, glowPulse.

COLOR RULES:
Use cinematic futuristic palettes: neon cyan, electric purple, holographic blue, deep black, atmospheric gradients.

QUALITY RULES:
The generated scene must feel world-class, visually expensive, and highly detailed.
NEVER generate simplistic SVG, flat icons, or poor compositions.

MORPHING SUPPORT:
Keep SVG groups modular and organized to support future morph transitions.

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
        throw new Error('Synthesis failure: The elite engine produced an empty state.');
      }
      return output;
    } catch (error: any) {
      console.error('Elite Synthesis Error:', error);
      throw new Error(`AI synthesis failed: ${error.message || 'Unexpected server response'}`);
    }
  }
);
