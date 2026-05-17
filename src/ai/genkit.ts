
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Centralized AI Infrastructure Provider
 * - Single source of truth for Genkit and Model selection.
 * - Prevents 404 errors by using stable, production-ready identifiers.
 * - Centralizes fallback logic and runtime diagnostics.
 */

// Force stable production model - Gemini 2.0 Flash
// This model is universally available and more robust than 1.5-flash
export const MODEL_ID = 'googleai/gemini-2.0-flash';

export const ai = genkit({
  plugins: [
    googleAI(), // Automatically uses GEMINI_API_KEY from environment
  ],
});

// Runtime diagnostic to log the initialized state (Server side only)
if (typeof window === 'undefined') {
  console.log(`[AI-INFRA] Synthesis Engine Initialized with: ${MODEL_ID}`);
}
