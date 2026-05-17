
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Maximize2, RefreshCw, Play, Pause, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    if (!stageRef.current || !svgContent) return;

    // Inject SVG
    stageRef.current.innerHTML = svgContent;
    
    // Execute GSAP code
    try {
      // Clear existing animations on the whole stage
      gsap.killTweensOf(stageRef.current.querySelectorAll('*'));
      
      // Execute the code
      // The generated code usually contains an IIFE or starts a timeline targeting IDs
      const execute = new Function('gsap', 'container', gsapCode);
      execute(gsap, stageRef.current);
      setIsPlaying(true);
    } catch (e) {
      console.warn("GSAP execution error:", e);
    }
  }, [svgContent, gsapCode]);

  const handleTogglePlay = () => {
    const allElements = stageRef.current?.querySelectorAll('*');
    if (!allElements) return;

    const tweens = gsap.getTweensOf(allElements);
    
    if (isPlaying) {
      tweens.forEach(t => t.pause());
      setIsPlaying(false);
    } else {
      tweens.forEach(t => t.play());
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (!stageRef.current) return;
    gsap.killTweensOf(stageRef.current.querySelectorAll('*'));
    const execute = new Function('gsap', 'container', gsapCode);
    execute(gsap, stageRef.current);
    setIsPlaying(true);
    toast({
      title: "TIMELINE RESET",
      description: "Animation sequence restarted from initial vector state.",
    });
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          variant: "destructive",
          title: "FULLSCREEN ERROR",
          description: "Could not enter immersive mode.",
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownloadSVG = () => {
    if (!stageRef.current || !svgContent) return;
    
    const svgData = stageRef.current.innerHTML;
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `aether-vector-${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "VECTOR EXPORTED",
      description: "Static SVG asset saved to local storage.",
    });
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
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" onClick={handleReset} title="Reset Animation">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" onClick={handleTogglePlay} title={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" onClick={handleFullscreen} title="Toggle Fullscreen">
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8" onClick={handleDownloadSVG} title="Download SVG">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
