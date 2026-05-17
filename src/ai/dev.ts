import { config } from 'dotenv';
config();

import '@/ai/flows/generate-svg-motion-from-prompt.ts';
import '@/ai/flows/morph-svg-between-generated-states.ts';