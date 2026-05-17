import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @fileOverview Centralized Genkit AI Configuration
 * This file serves as the single source of truth for the AI infrastructure.
 * Centralizing the model here prevents 404 errors caused by inconsistent model identifiers.
 */

export const ai = genkit({
  plugins: [
    googleAI(), // Uses GEMINI_API_KEY from environment
  ],
});

/**
 * Centralized Model Reference
 * Using 'gemini-1.5-flash' which is the current stable production model.
 * If 404 persists, this is the only line that needs to be updated.
 */
export const MODEL_ID = 'googleai/gemini-1.5-flash';

// Alternative models for fallback strategies
export const FALLBACK_MODEL_ID = 'googleai/gemini-1.5-flash-latest';
