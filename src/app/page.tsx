"use client";

import React, { useState, useEffect } from 'react';
import { AppShell, type SectionID } from '@/components/layout/AppShell';
import { MotionStage } from '@/components/canvas/MotionStage';
import { AITerminal } from '@/components/terminal/AITerminal';
import { LiveInspector } from '@/components/panels/LiveInspector';
import { generateSvgMotionFromPrompt, type GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2, ChevronRight, Share, Layers, History, Play, Trash2, Library, BookOpen, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionID>('stage');
  const [result, setResult] = useState<GenerateSvgMotionFromPromptOutput | null>(null);
  const [history, setHistory] = useState<(GenerateSvgMotionFromPromptOutput & { id: string, timestamp: number, prompt: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setActiveSection('stage');
    try {
      const output = await generateSvgMotionFromPrompt({ prompt });
      setResult(output);
      
      const newGeneration = {
        ...output,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        prompt: prompt
      };
      
      setHistory(prev => [newGeneration, ...prev]);

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

  const renderContent = () => {
    switch (activeSection) {
      case 'stage':
        return (
          <div className="flex-1 flex flex-col relative h-full">
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

            <div className="flex-1 relative">
              <MotionStage 
                svgContent={result?.svgContent || ''} 
                gsapCode={result?.gsapAnimationCode || ''} 
                isLoading={isLoading}
              />
              
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

            <div className="p-8 pb-10 z-50">
              <AITerminal onGenerate={handleGenerate} isLoading={isLoading} />
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="flex-1 p-8 space-y-8 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">Generation History</h2>
                <p className="text-muted-foreground">Revisit and refine your previously synthesized motion blueprints.</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest font-headline border-white/10" onClick={() => setHistory([])}>
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Clear Archives
              </Button>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
                {history.length > 0 ? history.map((item) => (
                  <Card key={item.id} className="glass-darker border-white/5 p-6 hover:border-primary/20 transition-all group overflow-hidden">
                    <div className="flex gap-6 h-full">
                      <div className="w-32 h-32 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
                        <div className="scale-[0.3] pointer-events-none" dangerouslySetInnerHTML={{ __html: item.svgContent }} />
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button size="icon" variant="ghost" className="text-white" onClick={() => {
                            setResult(item);
                            setActiveSection('stage');
                          }}>
                            <Play className="w-5 h-5 fill-current" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] uppercase font-code border-white/10">{item.metadata.mood}</Badge>
                            <span className="text-[10px] font-code text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm font-medium line-clamp-2 italic text-foreground/80 leading-relaxed">
                            "{item.prompt}"
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Button variant="outline" size="sm" className="h-7 text-[10px] uppercase tracking-widest font-headline border-white/5 flex-1" onClick={() => {
                            setResult(item);
                            setActiveSection('stage');
                          }}>Load Scene</Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                            <Share className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-full h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl opacity-50">
                    <History className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="font-headline tracking-widest text-sm uppercase">No Synthesized History Found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        );
      case 'library':
        return (
          <div className="flex-1 p-8 space-y-8 overflow-hidden flex flex-col">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">Master Library</h2>
              <p className="text-muted-foreground">Curated high-end templates for professional motion graphics systems.</p>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {[
                  { title: "Fluid Neumorphic Orb", category: "Abstract", complexity: "Advanced" },
                  { title: "Orbital Circuitry", category: "Sci-Fi", complexity: "High" },
                  { title: "Holographic Interface", category: "UI", complexity: "Expert" },
                  { title: "Bionic Bloom", category: "Organic", complexity: "Medium" },
                  { title: "Cybernetic Grid", category: "Environmental", complexity: "High" },
                  { title: "Aetheric Pulse", category: "Particles", complexity: "Advanced" }
                ].map((item, idx) => (
                  <Card key={idx} className="glass border-white/5 group hover:border-primary/50 transition-all overflow-hidden cursor-pointer" onClick={() => handleGenerate(item.title)}>
                    <div className="aspect-video bg-black/40 relative flex items-center justify-center overflow-hidden">
                      <div className="w-20 h-20 rounded-full border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Library className="w-8 h-8 text-primary/40" />
                      </div>
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-primary/20 text-primary text-[9px] border-none uppercase tracking-widest">{item.category}</Badge>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-headline font-bold text-sm tracking-tight">{item.title}</h3>
                      <div className="flex items-center justify-between text-[10px] font-code text-muted-foreground uppercase">
                        <span>Complexity: {item.complexity}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 p-8 space-y-12 max-w-2xl mx-auto w-full">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">Engine Settings</h2>
              <p className="text-muted-foreground">Calibrate the AetherMotion synthesis engine parameters.</p>
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-[10px] font-code text-primary uppercase tracking-widest flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" />
                  Synthesis Intelligence
                </h3>
                <Card className="glass-darker border-white/5 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Model Priority</p>
                      <p className="text-xs text-muted-foreground">Choose between speed or cinematic detail.</p>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary">High Fidelity</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Auto-Optimization</p>
                      <p className="text-xs text-muted-foreground">Automatically simplify paths for web performance.</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase tracking-widest border-white/5">Enabled</Button>
                  </div>
                </Card>
              </section>

              <section className="space-y-4">
                <h3 className="text-[10px] font-code text-accent uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  Workspace Runtime
                </h3>
                <Card className="glass-darker border-white/5 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Live Inspector Auto-Scroll</p>
                      <p className="text-xs text-muted-foreground">Follow code generation in real-time.</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase tracking-widest border-white/5">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">GPU Acceleration</p>
                      <p className="text-xs text-muted-foreground">Use system GPU for rendering complex timelines.</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase tracking-widest border-white/5">Active</Button>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="flex-1 p-8 space-y-8 max-w-4xl">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">Documentation</h2>
              <p className="text-muted-foreground">Master the art of AI-driven vector motion choreography.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Prompt Engineering", desc: "How to write perfect blueprints for the synthesis engine.", icon: BookOpen },
                { title: "GSAP Integration", desc: "Exporting and integrating AI animations into your apps.", icon: Code2 },
                { title: "Custom Properties", desc: "Controlling layer IDs and semantic target IDs.", icon: Layers },
                { title: "Engine Runtime", desc: "Understanding the technical architecture of AetherMotion.", icon: Settings2 }
              ].map((doc, idx) => (
                <Card key={idx} className="glass border-white/5 p-6 hover:bg-white/5 transition-all cursor-pointer group">
                  <doc.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-headline font-bold text-lg mb-2">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{doc.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">Initializing Interface...</p>
          </div>
        );
    }
  };

  return (
    <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="flex h-full w-full overflow-hidden">
        {/* Main Work Area */}
        {renderContent()}

        {/* Right Inspector Panel - Only show in stage view */}
        {activeSection === 'stage' && (
          <aside className="w-[400px] h-full hidden xl:block z-50">
            <LiveInspector 
              svgContent={result?.svgContent || ''} 
              gsapCode={result?.gsapAnimationCode || ''} 
              metadata={result?.metadata}
            />
          </aside>
        )}
      </div>
    </AppShell>
  );
}

import { Code2 } from 'lucide-react';
