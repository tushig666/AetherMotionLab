/**
 * @fileOverview Fault-tolerant SVG utilities for safe matrix math and DOM access.
 * Prevents "Cannot read properties of null (reading 'matrix')" errors.
 */

/**
 * Safely retrieves the CTM (Current Transformation Matrix) of an SVG element.
 * Provides a fallback identity matrix if the element is not yet in the DOM.
 */
export function safeGetCTM(el: SVGGraphicsElement | null): DOMMatrix {
  if (!el || !el.getCTM) {
    return new DOMMatrix();
  }
  
  try {
    const ctm = el.getCTM();
    return ctm || new DOMMatrix();
  } catch (e) {
    console.warn('[SVG-Safety] Failed to retrieve CTM, providing fallback.', e);
    return new DOMMatrix();
  }
}

/**
 * Safely retrieves the Screen CTM.
 */
export function safeGetScreenCTM(el: SVGGraphicsElement | null): DOMMatrix {
  if (!el || !el.getScreenCTM) {
    return new DOMMatrix();
  }
  
  try {
    const ctm = el.getScreenCTM();
    return ctm || new DOMMatrix();
  } catch (e) {
    console.warn('[SVG-Safety] Failed to retrieve ScreenCTM, providing fallback.', e);
    return new DOMMatrix();
  }
}

/**
 * Validates if an element is a valid animation target.
 */
export function isValidTarget(target: any): boolean {
  if (!target) return false;
  if (typeof target === 'string') {
    return !!document.querySelector(target);
  }
  return target instanceof Element && document.body.contains(target);
}

/**
 * Sanitizes and repairs common AI-generated SVG issues before injection.
 */
export function validateAndRepairSvg(svg: string): string {
  if (!svg) return '';
  
  // Ensure IDs are unique-ish or at least present for targeting
  // Note: Deep sanitization should be handled by a library, 
  // but we ensure basic structural integrity here.
  let repaired = svg.trim();
  
  if (!repaired.startsWith('<svg')) {
    repaired = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">${repaired}</svg>`;
  }
  
  // Ensure we have a namespace if missing
  if (!repaired.includes('xmlns=')) {
    repaired = repaired.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  return repaired;
}
