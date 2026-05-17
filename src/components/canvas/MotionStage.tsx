"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Maximize2, RefreshCw, Play, Pause, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MotionStageProps {
  svgContent: string;
  gsapCode: string;
  className?: string;
  isLoading?: boolean;
}

export const MotionStage: React.FC<MotionStageProps> = ({ 
  svgContent, 
  gsapCode, 
  className,
  isLoading 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!stageRef.current || !svgContent) return;

    // Inject SVG
    stageRef.current.innerHTML = svgContent;
    
    // Execute GSAP code
    try {
      // Clear existing animations
      gsap.killTweensOf(stageRef.current.querySelectorAll('*'));
      
      // Execute the code
      // The generated code usually contains an IIFE or starts a timeline
      const execute = new Function('gsap', 'container', gsapCode);
      execute(gsap, stageRef.current);
    } catch (e) {
      console.warn("GSAP execution error:", e);
    }
  }, [svgContent, gsapCode]);

  const handleTogglePlay = () => {
    const timelines = gsap.getTweensOf(stageRef.current?.querySelectorAll('*') || []);
    // This is simplified; in a real app we'd track a master timeline
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (!stageRef.current) return;
    gsap.killTweensOf(stageRef.current.querySelectorAll('*'));
    const execute = new Function('gsap', 'container', gsapCode);
    execute(gsap, stageRef.current);
    setIsPlaying(true);
  };

  return (
    <div className={cn("relative flex-1 flex flex-col items-center justify-center cinematic-grid overflow-hidden min-h-[400px]", className)} ref={containerRef}>
      <div className="noise-bg absolute inset-0 pointer-events-none" />
      <div className="aurora opacity-30" />
      
      {/* Stage Backdrop Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />

      {/* Main Rendering Stage */}
      <div 
        ref={stageRef}
        className={cn(
          "relative z-20 w-full h-full flex items-center justify-center p-8 transition-all duration-1000",
          isLoading ? "opacity-20 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
        )}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin glow-primary" />
            <p className="text-primary font-headline animate-pulse tracking-widest text-sm">ARCHITECTING MOTION...</p>
          </div>
        </div>
      )}

      {/* Controls HUD */}
      {!isLoading && svgContent && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 glass px-4 py-2 rounded-full border-white/5 shadow-2xl">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" onClick={handleTogglePlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
