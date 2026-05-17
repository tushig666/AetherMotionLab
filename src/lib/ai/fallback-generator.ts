/**
 * @fileOverview Elite Procedural SVG Fallback Generator.
 * Generates cinematic, high-fidelity motion graphics locally when AI is unavailable.
 */

import { GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';

export type FallbackStyle = 'pulse' | 'grid' | 'waves' | 'monolith';

/**
 * Procedurally generates an Aether-tier motion scene.
 */
export function generateProceduralFallback(prompt: string): GenerateSvgMotionFromPromptOutput {
  const styles: FallbackStyle[] = ['pulse', 'grid', 'waves', 'monolith'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  
  const colors = [
    ['#7C3AED', '#22D3EE', '#000000'],
    ['#EC4899', '#8B5CF6', '#111827'],
    ['#10B981', '#3B82F6', '#060606'],
    ['#F59E0B', '#EF4444', '#000000']
  ];
  const palette = colors[Math.floor(Math.random() * colors.length)];

  switch (style) {
    case 'grid':
      return generateQuantumGrid(prompt, palette);
    case 'waves':
      return generateSolarisWaves(prompt, palette);
    case 'monolith':
      return generateAetherMonolith(prompt, palette);
    case 'pulse':
    default:
      return generateAetherPulse(prompt, palette);
  }
}

function generateAetherPulse(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "AETHER PULSE [LOCAL SYNTHESIS]",
    description: "A procedurally generated solaris core exhibiting harmonic resonance.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["core", "rings", "haze"],
    animations: ["pulse", "orbit"],
    colorPalette: palette,
    morphTargets: ["core"],
    css: `
      @keyframes haze-drift { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 0.3; transform: scale(1); } }
      #haze { animation: haze-drift 8s infinite ease-in-out; filter: blur(60px); }
    `,
    gsap: `
      const tl = gsap.timeline({ repeat: -1 });
      tl.to("#core", { duration: 2, scale: 1.1, ease: "sine.inOut", yoyo: true, repeat: -1 });
      tl.to("#ring-1", { duration: 10, rotation: 360, transformOrigin: "center", ease: "none", repeat: -1 }, 0);
      tl.to("#ring-2", { duration: 15, rotation: -360, transformOrigin: "center", ease: "none", repeat: -1 }, 0);
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="coreGrad">
            <stop offset="0%" stop-color="${palette[0]}" />
            <stop offset="100%" stop-color="${palette[1]}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle id="haze" cx="600" cy="600" r="400" fill="url(#coreGrad)" opacity="0.4" />
        <g id="rings">
          <circle id="ring-1" cx="600" cy="600" r="300" fill="none" stroke="${palette[0]}" stroke-width="2" stroke-dasharray="10 20" opacity="0.5" />
          <circle id="ring-2" cx="600" cy="600" r="350" fill="none" stroke="${palette[1]}" stroke-width="1" stroke-dasharray="5 15" opacity="0.3" />
        </g>
        <circle id="core" cx="600" cy="600" r="150" fill="url(#coreGrad)" />
      </svg>
    `
  };
}

function generateQuantumGrid(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "QUANTUM GRID [LOCAL SYNTHESIS]",
    description: "A perspective data grid with floating kinetic nodes.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["grid", "nodes"],
    animations: ["drift", "flicker"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      @keyframes grid-flicker { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
      #grid-lines { animation: grid-flicker 4s infinite; }
    `,
    gsap: `
      gsap.to(".node", { 
        duration: "random(2, 4)", 
        y: "-=50", 
        opacity: "random(0.2, 0.8)", 
        repeat: -1, 
        yoyo: true, 
        stagger: { each: 0.2, from: "random" } 
      });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <g id="grid-lines" stroke="${palette[0]}" stroke-width="1" opacity="0.2">
          ${Array.from({length: 12}).map((_, i) => `<line x1="${i*100}" y1="0" x2="${i*100}" y2="1200" />`).join('')}
          ${Array.from({length: 12}).map((_, i) => `<line x1="0" y1="${i*100}" x2="1200" y2="${i*100}" />`).join('')}
        </g>
        <g id="nodes">
          ${Array.from({length: 20}).map((_, i) => {
            const x = Math.random() * 1200;
            const y = Math.random() * 1200;
            return `<circle class="node" cx="${x}" cy="${y}" r="4" fill="${palette[1]}" />`;
          }).join('')}
        </g>
      </svg>
    `
  };
}

function generateSolarisWaves(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "SOLARIS WAVES [LOCAL SYNTHESIS]",
    description: "Fluid harmonic oscillations across a light spectrum.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["waves"],
    animations: ["flow"],
    colorPalette: palette,
    morphTargets: [],
    css: "",
    gsap: `
      gsap.to(".wave-path", {
        duration: 5,
        attr: { d: "M0,600 Q300,400 600,600 T1200,600" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5
      });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <path class="wave-path" d="M0,600 Q300,800 600,600 T1200,600" fill="none" stroke="${palette[0]}" stroke-width="4" opacity="0.6" />
        <path class="wave-path" d="M0,650 Q300,850 600,650 T1200,650" fill="none" stroke="${palette[1]}" stroke-width="2" opacity="0.4" />
        <path class="wave-path" d="M0,550 Q300,750 600,550 T1200,550" fill="none" stroke="${palette[0]}" stroke-width="1" opacity="0.3" />
      </svg>
    `
  };
}

function generateAetherMonolith(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "AETHER MONOLITH [LOCAL SYNTHESIS]",
    description: "A geometric vector structure with internal glowing circuitry.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["monolith", "circuitry"],
    animations: ["glow", "shimmer"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      @keyframes shimmer { 0% { stop-opacity: 0.2; } 50% { stop-opacity: 0.8; } 100% { stop-opacity: 0.2; } }
      .shimmer-stop { animation: shimmer 3s infinite; }
    `,
    gsap: `
      gsap.to("#monolith-main", { duration: 4, y: "-=20", repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".circuit", { duration: 1, opacity: 0.2, repeat: -1, yoyo: true, stagger: 0.1 });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="monolithGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${palette[0]}" />
            <stop offset="100%" stop-color="${palette[1]}" />
          </linearGradient>
        </defs>
        <g id="monolith-main">
          <rect x="400" y="200" width="400" height="800" fill="url(#monolithGrad)" opacity="0.9" rx="10" />
          <g id="circuitry">
            ${Array.from({length: 10}).map((_, i) => `<rect class="circuit" x="420" y="${300 + i*60}" width="360" height="2" fill="white" opacity="0.5" />`).join('')}
          </g>
        </g>
      </svg>
    `
  };
}
