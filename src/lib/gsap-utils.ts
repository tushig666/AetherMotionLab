import { gsap } from 'gsap';

/**
 * Safely executes a string of GSAP code.
 * Assumes the code defines a timeline or manipulates elements with IDs.
 */
export function executeGsapCode(code: string, containerId: string) {
  try {
    // Create a temporary script function
    // We pass gsap as an argument to make it available in the scope
    const wrappedCode = `
      (function(gsap, containerId) {
        ${code}
      })(args.gsap, args.containerId);
    `;
    
    // Using Function constructor to evaluate
    const runner = new Function('args', code);
    runner({ gsap, containerId });
  } catch (error) {
    console.error('Error executing GSAP code:', error);
  }
}
