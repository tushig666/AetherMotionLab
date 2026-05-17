
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell, type SectionID } from '@/components/layout/AppShell';
import { MotionStage } from '@/components/canvas/MotionStage';
import { AITerminal } from '@/components/terminal/AITerminal';
import { LiveInspector } from '@/components/panels/LiveInspector';
import { generateSvgMotionFromPrompt, type GenerateSvgMotionFromPromptOutput } from '@/ai/flows/generate-svg-motion-from-prompt';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Wand2, 
  ChevronRight, 
  Share, 
  Layers, 
  History, 
  Play, 
  Trash2, 
  Library, 
  BookOpen, 
  Settings2,
  User as UserIcon,
  CreditCard,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Code2,
  Github,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionID>('stage');
  const [result, setResult] = useState<GenerateSvgMotionFromPromptOutput | null>(null);
  const [history, setHistory] = useState<(GenerateSvgMotionFromPromptOutput & { id: string, timestamp: number, prompt: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile editing state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { user } = useUser();
  const db = useFirestore();
  const userProfileRef = user ? doc(db!, 'users', user.uid) : null;
  const { data: profile } = useDoc(userProfileRef);
  
  const { toast } = useToast();

  useEffect(() => {
    if (user?.displayName) {
      setNewName(user.displayName);
    }
  }, [user]);

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

  const handleUpgradePlan = () => {
    if (!user || !userProfileRef) return;
    updateDoc(userProfileRef, { plan: 'pro' });
    toast({
      title: "PLAN UPGRADED",
      description: "Welcome to AetherMotion Pro. Full GPU acceleration enabled.",
    });
  };

  const handleUpdateProfile = async () => {
    if (!user || !newName.trim() || !userProfileRef) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: newName });
      await updateDoc(userProfileRef, { displayName: newName });
      setIsProfileModalOpen(false);
      toast({
        title: "IDENTITY UPDATED",
        description: "Your entity signature has been successfully recalibrated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "UPDATE FAILED",
        description: error.message || "Could not synchronize identity changes.",
      });
    } finally {
      setIsUpdatingProfile(false);
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
      case 'profile':
        return (
          <div className="flex-1 p-8 space-y-12 max-w-5xl mx-auto w-full">
            <header className="flex items-end gap-8 pb-12 border-b border-white/5">
              <div className="relative group">
                <Avatar className="w-32 h-32 rounded-2xl border-2 border-white/10 glow-primary">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center border-4 border-[#07070D]">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-4xl font-headline font-bold tracking-tight text-glow">
                    {user?.displayName || 'Identity Initializing...'}
                  </h2>
                  <p className="text-muted-foreground font-code text-sm tracking-widest uppercase">
                    ID: {user?.uid.slice(0, 12)}...
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-primary/20 text-primary border-none px-4 py-1 text-xs uppercase tracking-widest font-bold">
                    {profile?.plan || 'Free Tier'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Active since {profile?.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
              <Button 
                onClick={() => setIsProfileModalOpen(true)}
                variant="outline" 
                className="border-white/10 h-11 px-8 uppercase tracking-widest font-headline hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Update Identity
              </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-code text-primary uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    Subscription Matrix
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className={cn(
                      "glass border-white/5 p-6 space-y-6 relative overflow-hidden transition-all",
                      profile?.plan === 'free' ? "border-primary/40 ring-1 ring-primary/20" : ""
                    )}>
                      {profile?.plan === 'free' && <div className="absolute top-0 right-0 p-2"><CheckCircle2 className="text-primary w-4 h-4" /></div>}
                      <div className="space-y-2">
                        <h4 className="font-headline font-bold text-lg">Aether Free</h4>
                        <p className="text-xs text-muted-foreground">Standard AI synthesis with web-tier performance.</p>
                      </div>
                      <div className="text-3xl font-headline font-bold">$0<span className="text-sm font-normal text-muted-foreground ml-1">/mo</span></div>
                      <ul className="space-y-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                        <li className="flex items-center gap-2 opacity-50"><CheckCircle2 className="w-3 h-3" /> 10 Generates / Day</li>
                        <li className="flex items-center gap-2 opacity-50"><CheckCircle2 className="w-3 h-3" /> Basic GSAP Runtimes</li>
                      </ul>
                      <Button variant="outline" className="w-full border-white/10" disabled={profile?.plan === 'free'}>
                        {profile?.plan === 'free' ? "ACTIVE SYSTEM" : "DOWNGRADE"}
                      </Button>
                    </Card>

                    <Card className={cn(
                      "glass border-white/5 p-6 space-y-6 relative overflow-hidden group transition-all",
                      profile?.plan === 'pro' ? "border-accent/40 ring-1 ring-accent/20" : "hover:border-accent/40"
                    )}>
                      <div className="absolute top-0 right-0 p-3 rotate-12 opacity-10 group-hover:rotate-0 transition-all">
                        <Zap className="w-12 h-12 text-accent" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-headline font-bold text-lg">Aether Pro</h4>
                          <Badge className="bg-accent/20 text-accent text-[8px] border-none uppercase">Recommended</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Elite GPU synthesis with cinematic morphing.</p>
                      </div>
                      <div className="text-3xl font-headline font-bold">$29<span className="text-sm font-normal text-muted-foreground ml-1">/mo</span></div>
                      <ul className="space-y-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Unlimited Synthesis</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Advanced Morph Engine</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-accent" /> Raw Source Exports</li>
                      </ul>
                      <Button onClick={handleUpgradePlan} className="w-full bg-accent hover:bg-accent/90 glow-accent text-accent-foreground font-bold" disabled={profile?.plan === 'pro'}>
                        {profile?.plan === 'pro' ? "PRO SYSTEM ACTIVE" : "UPGRADE PROTOCOL"}
                      </Button>
                    </Card>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-code text-primary uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    Resource Consumption
                  </h3>
                  <Card className="glass-darker border-white/5 p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                        <span className="text-muted-foreground">Monthly Credits</span>
                        <span className="text-foreground">842 / 1000</span>
                      </div>
                      <Progress value={84} className="h-1.5 bg-white/5" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                        <span className="text-muted-foreground">GPU Compute Units</span>
                        <span className="text-foreground">Unlimited (Pro)</span>
                      </div>
                      <Progress value={100} className="h-1.5 bg-white/5" />
                    </div>
                  </Card>
                </section>
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-code text-muted-foreground uppercase tracking-widest">Connected Links</h3>
                  <Card className="glass border-white/5 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Github className="w-4 h-4" /></div>
                        <span className="text-xs">GitHub Identity</span>
                      </div>
                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 text-[8px] uppercase">Link Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Code2 className="w-4 h-4" /></div>
                        <span className="text-xs">API Gateway</span>
                      </div>
                      <Badge variant="outline" className="border-white/10 text-muted-foreground text-[8px] uppercase">Inactive</Badge>
                    </div>
                  </Card>
                </section>

                <Card className="glass-darker border-white/5 p-6 text-center space-y-4">
                  <ShieldCheck className="w-12 h-12 text-primary mx-auto opacity-50" />
                  <div className="space-y-1">
                    <h4 className="font-headline font-bold text-sm">Session Security</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">2FA is recommended for master entities.</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-[10px] uppercase tracking-widest border-white/5">Configure MFA</Button>
                </Card>
              </div>
            </div>

            {/* Profile Update Dialog */}
            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
              <DialogContent className="glass-darker border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-headline font-bold tracking-tight text-glow uppercase">Update Identity Protocol</DialogTitle>
                  <DialogDescription className="text-muted-foreground text-xs uppercase tracking-widest">
                    Synchronize your display name across the AetherMotion cloud.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">New Display Name</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-white/5 border-white/10 col-span-3 focus:border-primary/50 transition-all"
                      placeholder="Enter identity label..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsProfileModalOpen(false)}
                    className="text-xs uppercase tracking-widest font-headline"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-primary hover:bg-primary/90 glow-primary text-xs uppercase tracking-widest font-headline"
                    disabled={isUpdatingProfile || !newName.trim()}
                  >
                    {isUpdatingProfile ? "Synchronizing..." : "Update Protocol"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
