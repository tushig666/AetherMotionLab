'use server';
/**
 * @fileOverview This file implements the Genkit flow for the Vector Topology Morpher.
 *
 * - morphSvgBetweenGeneratedStates - A function that calculates and animates the transformation
 *   of complex SVG paths between two distinct generated states using generative AI,
 *   outputting GSAP animation code.
 * - SvgMorphInput - The input type for the morphSvgBetweenGeneratedStates function.
 * - SvgMorphOutput - The return type for the morphSvgBetweenGeneratedStates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SvgMorphInputSchema = z.object({
  svgContent1: z.string().describe('The first SVG scene as a complete XML string, representing the starting state.'),
  svgContent2: z.string().describe('The second SVG scene as a complete XML string, representing the ending state.'),
  morphDurationSeconds: z.number().default(2).describe('The desired duration for the morph animation in seconds. Default is 2 seconds.'),
  morphStyleDescription: z.string().optional().describe('A natural language description of the desired morphing style (e.g., "fluid and organic", "sharp and mechanical", "blurry transition", "cinematic and dramatic"). This will influence easing and animation properties.'),
});
export type SvgMorphInput = z.infer<typeof SvgMorphInputSchema>;

const SvgMorphOutputSchema = z.object({
  gsapAnimationCode: z.string().describe('A JavaScript string containing the GSAP timeline code to smoothly morph between the two SVGs. This code should handle path data, transforms, opacity, and other relevant attributes, preserving semantic IDs where possible. It must be production-ready and executable in a browser environment with GSAP and MorphSVGPlugin loaded. The code should be wrapped in an immediately invoked function expression (IIFE) for scope isolation.'),
  morphStrategyExplanation: z.string().describe('A detailed explanation of the topological analysis and morphing strategy employed, describing how elements were matched and interpolated, and any challenges encountered. Include reasoning for element matching and animation choices.'),
  matchedElements: z.array(z.object({
    fromId: z.string().optional().describe('The ID of the element in svgContent1 that was matched.'),
    toId: z.string().optional().describe('The ID of the element in svgContent2 that it was matched to.'),
    type: z.string().describe('The type of SVG element (e.g., "path", "circle", "g").'),
    description: z.string().describe('A brief description of how these elements were matched and what morphing logic is applied.'),
  })).describe('An array describing the intelligent matching of elements between the two SVGs, focusing on morphable shapes and groups.'),
});
export type SvgMorphOutput = z.infer<typeof SvgMorphOutputSchema>;

export async function morphSvgBetweenGeneratedStates(input: SvgMorphInput): Promise<SvgMorphOutput> {
  return morphSvgFlow(input);
}

const morphSvgPrompt = ai.definePrompt({
  name: 'morphSvgPrompt',
  input: { schema: SvgMorphInputSchema },
  output: { schema: SvgMorphOutputSchema },
  prompt: `You are an elite "Vector Topology Morpher" and "Cinematic Motion Choreographer". Your task is to analyze two complex SVG structures and generate production-ready GSAP JavaScript code to seamlessly and cinematically morph the first SVG (svgContent1) into the second SVG (svgContent2).

## Core Directives:
1.  **Analyze and Match**: Intelligently parse both SVGs. Identify geometrically or semantically similar elements, especially paths, circles, rectangles, polygons, and groups, that can be morphed or animated. Prioritize matching elements by ID if they exist, then by tag name and relative position/size.
2.  **Generate GSAP Code**: Produce a self-contained JavaScript string (IIFE) that utilizes GSAP and MorphSVGPlugin to perform the morph. Assume GSAP and MorphSVGPlugin are already loaded in the environment.
    *   For path data morphing, use 'MorphSVGPlugin.path()' or 'gsap.to(element, {morphSVG: targetElement})'.
    *   For other properties (opacity, fill, stroke, transforms like scale/rotate/translate, blur filters, gradient stops, clipPath changes), use standard 'gsap.to()' or 'gsap.fromTo()' animations.
    *   Orchestrate animations into a master timeline (gsap.timeline()) for cinematic pacing.
3.  **Cinematic Motion**: Apply cinematic easing (e.g., 'power2.inOut', 'elastic.out', 'circ.inOut') and staggering where appropriate. The morph should feel fluid, physically believable, and emotionally immersive, guided by the 'morphStyleDescription'.
4.  **Semantic Preservation**: If elements have IDs, try to preserve their semantic meaning and morph them to their corresponding counterpart. If an element in svgContent1 has no direct match in svgContent2, consider animating its opacity to 0 or scaling it down, and vice-versa for new elements in svgContent2.
5.  **Output Structure**: The output must strictly adhere to the provided JSON schema. Ensure the 'gsapAnimationCode' is a valid, executable JavaScript string.

## Input SVGs:
SVG 1 (Starting State):
{{{svgContent1}}}

SVG 2 (Ending State):
{{{svgContent2}}}

Duration: {{morphDurationSeconds}} seconds
Morph Style: {{{morphStyleDescription}}}

## Example GSAP Code Structure:
```javascript
(function() {
  // Ensure SVGs are appended to the DOM before animating
  // e.g., document.getElementById('svg-container').innerHTML = svgContent1;
  // then select elements using IDs or classes.

  const masterTimeline = gsap.timeline({ defaults: { duration: {{morphDurationSeconds}} } });

  // Example: morphing a path
  // masterTimeline.to("#path1_from_svg1", { morphSVG: "#path1_from_svg2", ease: "power2.inOut" });

  // Example: animating opacity
  // masterTimeline.to("#circleA_from_svg1", { opacity: 0, ease: "power1.out" }, "<"); // "<" starts at same time as previous animation

  // Example: animating fill color
  // masterTimeline.to("#rectB_from_svg1", { fill: "red", ease: "power2.inOut" }, "<0.2"); // starts 0.2s after previous

  // Add more animations for other matched elements
})();
```

Based on the provided SVGs and morph style, generate the complete 'gsapAnimationCode', a 'morphStrategyExplanation', and an array of 'matchedElements'.
`,
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
      return output!;
    } catch (error: any) {
      console.error('Morph Engine Error:', error);
      throw new Error('Topological morphing failed due to an unexpected server response.');
    }
  }
);
