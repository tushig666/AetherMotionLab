
/**
 * @fileOverview Intelligent resilience utilities for AI infrastructure.
 * Provides exponential backoff, retry logic, and quota management.
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 2000,
  maxDelay: 10000,
};

export class QuotaExhaustedError extends Error {
  constructor(message: string = 'AI Quota Exhausted') {
    super(message);
    this.name = 'QuotaExhaustedError';
  }
}

/**
 * Executes a function with exponential backoff retries.
 * Specifically detects 429 (Resource Exhausted) errors.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay } = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Detailed error check
      const errorMsg = error.message?.toUpperCase() || '';
      const isQuotaError = 
        errorMsg.includes('429') || 
        errorMsg.includes('RESOURCE_EXHAUSTED') ||
        errorMsg.includes('QUOTA') ||
        error.status === 429;

      if (isQuotaError && attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        console.warn(`[AI-Resilience] Quota exceeded. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (isQuotaError) {
        // We throw this specifically so the caller (Server Action or Page)
        // can decide whether to trigger the fallback engine.
        throw new QuotaExhaustedError();
      }

      throw error;
    }
  }

  throw lastError;
}
