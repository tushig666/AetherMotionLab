"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { MotionStage } from '@/components/canvas/MotionStage';
import { AITerminal } from '@/components/terminal/AITerminal';
import { LiveInspector } from '@/components/panels/LiveInspector';
import { generateSvgMotionFromPrompt, type GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2, ChevronRight, Share, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [result, setResult] = useState<GenerateSvgMotionFromPromptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    try {
      const output = await generateSvgMotionFromPrompt({ prompt });
      setResult(output);
      toast({
        title: "GENERATION COMPLETE",
        description: "Vector topology and motion choreography synthesized successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "SYNTHESIS FAILED",
        description: "An error occurred during the AI generation process.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex h-full w-full overflow-hidden">
        {/* Main Work Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Header Bar */}
          <header className="h-14 glass-darker border-b border-white/5 px-6 flex items-center justify-between z-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse glow-accent" />
                <span className="text-[10px] font-code uppercase tracking-widest text-muted-foreground">Studio Runtime v4.2</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
              <h1 className="text-xs font-headline font-bold uppercase tracking-[0.2em] text-foreground">
                {result ? "Active Workspace" : "New Scene Pipeline"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline">
                <Share className="w-3.5 h-3.5" />
                Collaborate
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline border-white/10 hover:bg-primary/10 hover:text-primary transition-all">
                <Layers className="w-3.5 h-3.5" />
                Export Assets
              </Button>
              <Button size="sm" className="h-8 text-[10px] gap-2 bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest font-headline">
                <Sparkles className="w-3.5 h-3.5" />
                Deploy Production
              </Button>
            </div>
          </header>

          {/* Stage Area */}
          <div className="flex-1 relative">
            <MotionStage 
              svgContent={result?.svgContent || ''} 
              gsapCode={result?.gsapAnimationCode || ''} 
              isLoading={isLoading}
            />
            
            {/* Contextual Overlay when Empty */}
            {!result && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-[500px] text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 glow-primary backdrop-blur-sm">
                    <Wand2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">The Future is Vector.</h2>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">
                      Enter a prompt below to synthesize a cinematic SVG motion scene using high-end AI choreography.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Area */}
          <div className="p-8 pb-10 z-50">
            <AITerminal onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Inspector Panel */}
        <aside className="w-[400px] h-full hidden xl:block z-50">
          <LiveInspector 
            svgContent={result?.svgContent || ''} 
            gsapCode={result?.gsapAnimationCode || ''} 
            metadata={result?.metadata}
          />
        </aside>
      </div>
    </AppShell>
  );
}
