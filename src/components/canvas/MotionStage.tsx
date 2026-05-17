"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Maximize2, RefreshCw, Play, Pause, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { validateAndRepairSvg, isValidTarget } from '@/lib/svg/safe-svg-utils';

interface MotionStageProps {
  svgContent: string;
  gsapCode: string;
  cssContent?: string;
  className?: string;
  isLoading?: boolean;
}

export const MotionStage: React.FC<MotionStageProps> = ({ 
  svgContent, 
  gsapCode, 
  cssContent,
  className,
  isLoading 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Hydration Guard
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted || !stageRef.current || !svgContent) return;

    setRenderError(null);

    // 1. Inject CSS safely
    try {
      if (!styleRef.current) {
        const style = document.createElement('style');
        styleRef.current = style;
        document.head.appendChild(style);
      }
      styleRef.current.innerHTML = cssContent || '';
    } catch (e) {
      console.warn('[Stage-CSS] Failed to inject styles:', e);
    }

    // 2. Inject & Validate SVG
    try {
      const safeSvg = validateAndRepairSvg(svgContent);
      stageRef.current.innerHTML = safeSvg;
    } catch (e) {
      setRenderError('Structural integrity failure.');
      return;
    }
    
    // 3. Execute GSAP code with safety boundary
    // We delay slightly to ensure DOM reflow has completed
    const animationTimeout = setTimeout(() => {
      try {
        if (!stageRef.current) return;
        
        // Clear previous animations
        gsap.killTweensOf(stageRef.current.querySelectorAll('*'));
        
        // Define a safe execution scope
        const execute = new Function('gsap', 'container', `
          try {
            ${gsapCode}
          } catch (err) {
            console.warn('[GSAP-Runtime] Blueprint execution error:', err);
          }
        `);
        
        execute(gsap, stageRef.current);
        setIsPlaying(true);
      } catch (e: any) {
        console.warn("[GSAP-Fatal] Animation engine failed to start:", e);
        setRenderError(`Kinetic failure: ${e.message}`);
      }
    }, 50);

    return () => {
      clearTimeout(animationTimeout);
      if (styleRef.current) {
        styleRef.current.innerHTML = '';
      }
    };
  }, [isMounted, svgContent, gsapCode, cssContent]);

  const handleTogglePlay = () => {
    if (!stageRef.current) return;
    const allElements = stageRef.current.querySelectorAll('*');
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
    toast({ title: "TIMELINE RESET" });
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        toast({ variant: "destructive", title: "FULLSCREEN ERROR" });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownloadSVG = () => {
    if (!stageRef.current || !svgContent) return;
    const svgData = stageRef.current.innerHTML;
    const svgBlob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aether-export-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "VECTOR EXPORTED" });
  };

  if (!isMounted) return <div className={cn("flex-1 bg-background", className)} />;

  return (
    <div className={cn("relative flex-1 flex flex-col items-center justify-center cinematic-grid overflow-hidden min-h-[400px]", className)} ref={containerRef}>
      <div className="noise-bg absolute inset-0 pointer-events-none" />
      <div className="aurora opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none z-10" />

      {renderError ? (
        <div className="z-50 flex flex-col items-center gap-4 p-8 glass border-destructive/20 text-center max-w-md animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h3 className="text-lg font-headline font-bold uppercase tracking-widest">Rendering Conflict</h3>
          <p className="text-xs text-muted-foreground font-body leading-relaxed">{renderError}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-2 text-[10px] uppercase tracking-widest">
            Reload Interface
          </Button>
        </div>
      ) : (
        <div 
          ref={stageRef}
          className={cn(
            "relative z-20 w-full h-full flex items-center justify-center p-8 transition-all duration-1000",
            isLoading ? "opacity-20 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
          )}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin glow-primary" />
            <p className="text-primary font-headline animate-pulse tracking-widest text-[10px] uppercase">Synthesizing Topology...</p>
          </div>
        </div>
      )}

      {!isLoading && svgContent && !renderError && (
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
