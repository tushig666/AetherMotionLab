
/**
 * @fileOverview Elite Procedural SVG Fallback Generator.
 * Generates cinematic, high-fidelity motion graphics locally when AI is unavailable.
 */

import { GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';

export type FallbackStyle = 'celestial' | 'quantum' | 'solaris' | 'monolith' | 'holographic';

/**
 * Procedurally generates an Aether-tier motion scene.
 */
export function generateProceduralFallback(prompt: string): GenerateSvgMotionFromPromptOutput {
  const styles: FallbackStyle[] = ['celestial', 'quantum', 'solaris', 'monolith', 'holographic'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  
  const colors = [
    ['#7C3AED', '#22D3EE', '#000000'], // Electric Purple/Cyan
    ['#EC4899', '#8B5CF6', '#111827'], // Pink/Violet
    ['#10B981', '#3B82F6', '#060606'], // Emerald/Blue
    ['#F59E0B', '#EF4444', '#000000'], // Amber/Red
    ['#6366F1', '#A855F7', '#030712']  // Indigo/Purple
  ];
  const palette = colors[Math.floor(Math.random() * colors.length)];

  switch (style) {
    case 'quantum':
      return generateQuantumGrid(prompt, palette);
    case 'solaris':
      return generateSolarisWaves(prompt, palette);
    case 'monolith':
      return generateAetherMonolith(prompt, palette);
    case 'holographic':
      return generateHolographicRing(prompt, palette);
    case 'celestial':
    default:
      return generateCelestialOrb(prompt, palette);
  }
}

function generateCelestialOrb(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "CELESTIAL ORB [RESILIENCE SYNTHESIS]",
    description: "A cosmic singularity exhibiting high-energy gravitational lensing and orbital resonance.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["singularity", "event-horizon", "orbital-debris"],
    animations: ["resonate", "orbit", "shimmer"],
    colorPalette: palette,
    morphTargets: ["singularity"],
    css: `
      @keyframes glow-pulse { 0%, 100% { filter: drop-shadow(0 0 20px ${palette[0]}); opacity: 0.8; } 50% { filter: drop-shadow(0 0 60px ${palette[1]}); opacity: 1; } }
      #singularity { animation: glow-pulse 4s infinite ease-in-out; }
      .particle { animation: shimmer 2s infinite alternate ease-in-out; }
      @keyframes shimmer { from { opacity: 0.2; } to { opacity: 0.8; } }
    `,
    gsap: `
      const tl = gsap.timeline({ repeat: -1 });
      tl.to("#singularity", { duration: 3, scale: 1.05, ease: "sine.inOut", yoyo: true, repeat: -1 });
      tl.to("#debris-layer", { duration: 20, rotation: 360, transformOrigin: "center", ease: "none", repeat: -1 });
      gsap.to(".orbit-path", { duration: 15, rotation: -360, transformOrigin: "center", ease: "none", repeat: -1 });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${palette[0]}" />
            <stop offset="70%" stop-color="${palette[1]}" stop-opacity="0.4" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>
          <filter id="bloom">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g id="debris-layer">
          ${Array.from({length: 40}).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const radius = 300 + Math.random() * 200;
            const x = 600 + Math.cos(angle) * radius;
            const y = 600 + Math.sin(angle) * radius;
            return `<circle class="particle" cx="${x}" cy="${y}" r="${Math.random() * 3}" fill="${palette[1]}" opacity="0.4" />`;
          }).join('')}
        </g>
        <circle class="orbit-path" cx="600" cy="600" r="400" fill="none" stroke="${palette[0]}" stroke-width="1" stroke-dasharray="20 40" opacity="0.2" />
        <circle id="singularity" cx="600" cy="600" r="180" fill="url(#orbGrad)" filter="url(#bloom)" />
      </svg>
    `
  };
}

function generateQuantumGrid(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "QUANTUM PERSPECTIVE [RESILIENCE SYNTHESIS]",
    description: "Multi-dimensional data field visualized through a kinetic perspective grid.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["grid-base", "data-nodes", "scan-line"],
    animations: ["perspective-shift", "data-flicker"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      @keyframes scan { 0% { transform: translateY(-600px); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(600px); opacity: 0; } }
      #scan-line { animation: scan 6s infinite linear; background: linear-gradient(to bottom, transparent, ${palette[0]}, transparent); }
    `,
    gsap: `
      gsap.to(".node", { 
        duration: "random(1, 3)", 
        opacity: "random(0.1, 1)", 
        repeat: -1, 
        yoyo: true, 
        stagger: { amount: 2, grid: [12, 12], from: "center" }
      });
      gsap.to("#grid-container", { duration: 10, rotationX: 20, ease: "sine.inOut", yoyo: true, repeat: -1 });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <g id="grid-container" transform="perspective(800px) rotateX(45deg)">
          <g id="grid-lines" stroke="${palette[0]}" stroke-width="0.5" opacity="0.15">
            ${Array.from({length: 25}).map((_, i) => `<line x1="${i*50}" y1="0" x2="${i*50}" y2="1200" />`).join('')}
            ${Array.from({length: 25}).map((_, i) => `<line x1="0" y1="${i*50}" x2="1200" y2="${i*50}" />`).join('')}
          </g>
          <g id="nodes">
            ${Array.from({length: 144}).map((_, i) => {
              const r = Math.floor(i / 12);
              const c = i % 12;
              return `<circle class="node" cx="${100 + c * 90}" cy="${100 + r * 90}" r="2" fill="${palette[1]}" />`;
            }).join('')}
          </g>
        </g>
        <rect id="scan-line" x="0" y="0" width="1200" height="2" fill="${palette[0]}" />
      </svg>
    `
  };
}

function generateSolarisWaves(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "SOLARIS FLOW [RESILIENCE SYNTHESIS]",
    description: "Ethereal wave propagation across a chromatic light field.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["chroma-waves", "light-leak"],
    animations: ["wave-harmonic", "chroma-shift"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      .wave { mix-blend-mode: screen; }
    `,
    gsap: `
      gsap.to(".wave-path", {
        duration: 8,
        attr: { d: "M-100,600 Q300,300 600,600 T1300,600" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { amount: 2, from: "start" }
      });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${palette[0]}" stop-opacity="0" />
            <stop offset="50%" stop-color="${palette[1]}" stop-opacity="0.8" />
            <stop offset="100%" stop-color="${palette[0]}" stop-opacity="0" />
          </linearGradient>
        </defs>
        ${Array.from({length: 6}).map((_, i) => `
          <path class="wave-path" d="M-100,${500 + i * 40} Q300,${800 - i * 50} 600,${600 + i * 20} T1300,${500 + i * 40}" 
            fill="none" stroke="url(#waveGrad)" stroke-width="${10 - i}" class="wave" opacity="${0.8 - i * 0.1}" />
        `).join('')}
      </svg>
    `
  };
}

function generateAetherMonolith(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "AETHER MONOLITH [RESILIENCE SYNTHESIS]",
    description: "An architectural vector construct embedded with bio-luminescent circuitry.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["monolith-core", "circuit-paths", "aura"],
    animations: ["breathe", "circuit-trace"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      .circuit { stroke-dasharray: 100; stroke-dashoffset: 100; animation: trace 3s infinite linear; }
      @keyframes trace { to { stroke-dashoffset: -100; } }
    `,
    gsap: `
      gsap.to("#monolith-group", { y: "-=40", duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".circuit-group", { opacity: 0.8, duration: 2, repeat: -1, yoyo: true });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <g id="monolith-group" transform="translate(600, 600)">
          <rect x="-150" y="-300" width="300" height="600" fill="${palette[0]}" opacity="0.9" rx="8" />
          <rect x="-140" y="-290" width="280" height="580" fill="none" stroke="${palette[1]}" stroke-width="1" opacity="0.4" rx="6" />
          <g class="circuit-group">
            ${Array.from({length: 12}).map((_, i) => `
              <line class="circuit" x1="-120" y1="${-240 + i * 45}" x2="120" y2="${-240 + i * 45}" stroke="white" stroke-width="0.5" opacity="0.3" />
            `).join('')}
          </g>
        </g>
      </svg>
    `
  };
}

function generateHolographicRing(prompt: string, palette: string[]): GenerateSvgMotionFromPromptOutput {
  return {
    title: "HOLOGRAPHIC RESONANCE [RESILIENCE SYNTHESIS]",
    description: "Concentric holographic fields vibrating at harmonic frequencies.",
    background: palette[2],
    viewBox: "0 0 1200 1200",
    layers: ["rings", "glitch-artifacts"],
    animations: ["spin", "pulse", "glitch"],
    colorPalette: palette,
    morphTargets: [],
    css: `
      .ring { transform-box: fill-box; transform-origin: center; }
    `,
    gsap: `
      gsap.to(".ring-1", { rotation: 360, duration: 10, repeat: -1, ease: "none" });
      gsap.to(".ring-2", { rotation: -360, duration: 15, repeat: -1, ease: "none" });
      gsap.to(".ring-3", { rotation: 180, duration: 20, repeat: -1, ease: "none" });
      gsap.to(".ring", { scale: 1.1, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.2 });
    `,
    svg: `
      <svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <circle class="ring ring-1" cx="600" cy="600" r="200" fill="none" stroke="${palette[0]}" stroke-width="20" stroke-dasharray="100 50" opacity="0.6" />
        <circle class="ring ring-2" cx="600" cy="600" r="300" fill="none" stroke="${palette[1]}" stroke-width="10" stroke-dasharray="40 20" opacity="0.4" />
        <circle class="ring ring-3" cx="600" cy="600" r="400" fill="none" stroke="${palette[0]}" stroke-width="5" stroke-dasharray="200 100" opacity="0.2" />
        <circle cx="600" cy="600" r="50" fill="${palette[1]}" filter="blur(20px)" />
      </svg>
    `
  };
}
