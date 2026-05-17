"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Zap,
  CheckCircle2,
  Code2,
  Github,
  Edit3,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, updateDoc, collection, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
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
import { generateStandaloneHtml } from '@/lib/export-utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionID>('stage');
  const [result, setResult] = useState<GenerateSvgMotionFromPromptOutput | null>(null);
  const [localHistory, setLocalHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile editing state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { user } = useUser();
  const db = useFirestore();
  
  // Memoize refs
  const userProfileRef = useMemo(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
  const generationsRef = useMemo(() => (user && db) ? collection(db, 'users', user.uid, 'generations') : null, [user, db]);
  const historyQuery = useMemo(() => generationsRef ? query(generationsRef, orderBy('timestamp', 'desc'), limit(20)) : null, [generationsRef]);

  const { data: profile } = useDoc(userProfileRef);
  const { data: firestoreHistory } = useCollection(historyQuery);
  
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
      
      const generationData = {
        ...output,
        timestamp: Date.now(),
        prompt: prompt
      };

      // Save to Firestore if logged in
      if (generationsRef) {
        addDoc(generationsRef, {
          ...generationData,
          createdAt: serverTimestamp(),
          userId: user?.uid
        }).catch(err => {
          if (err.code === 'permission-denied') {
            errorEmitter.emitPermissionError(new FirestorePermissionError({
              path: generationsRef.path,
              operation: 'create',
              requestResourceData: generationData
            }));
          }
        });
      } else {
        // Fallback for anonymous users
        setLocalHistory(prev => [{ ...generationData, id: Math.random().toString() }, ...prev]);
      }

      toast({
        title: "GENERATION COMPLETE",
        description: "Vector topology and motion choreography synthesized successfully.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "SYNTHESIS FAILED",
        description: error.message || "An error occurred during the AI generation process.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradePlan = () => {
    if (!userProfileRef) return;
    updateDoc(userProfileRef, { plan: 'pro' })
      .catch(async (err) => {
        if (err.code === 'permission-denied') {
          errorEmitter.emitPermissionError(new FirestorePermissionError({
            path: userProfileRef.path,
            operation: 'update',
            requestResourceData: { plan: 'pro' }
          }));
        }
      });
  };

  const handleUpdateProfile = async () => {
    if (!user || !newName.trim() || !userProfileRef) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: newName });
      updateDoc(userProfileRef, { displayName: newName })
        .catch(async (err) => {
          if (err.code === 'permission-denied') {
            errorEmitter.emitPermissionError(new FirestorePermissionError({
              path: userProfileRef.path,
              operation: 'update',
              requestResourceData: { displayName: newName }
            }));
          }
        });
      
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

  const combinedHistory = useMemo(() => {
    const fHistory = firestoreHistory || [];
    return [...fHistory, ...localHistory].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [firestoreHistory, localHistory]);

  const handleExport = () => {
    if (!result) return;
    const html = generateStandaloneHtml(result.svgContent, result.gsapAnimationCode);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aether-motion-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "LINK COPIED" });
                  }}
                >
                  <Share className="w-3.5 h-3.5" />
                  Collaborate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline border-white/10"
                  onClick={handleExport}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Export Assets
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 text-[10px] gap-2 bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest font-headline"
                  onClick={() => toast({ title: "DEPLOYMENT SIMULATED" })}
                >
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
            </div>
            
            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
                {combinedHistory.length > 0 ? combinedHistory.map((item, idx) => (
                  <Card key={item.id || idx} className="glass-darker border-white/5 p-6 hover:border-primary/20 transition-all group overflow-hidden">
                    <div className="flex gap-6 h-full">
                      <div className="w-32 h-32 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
                        <div className="scale-[0.25] pointer-events-none origin-center" dangerouslySetInnerHTML={{ __html: item.svgContent }} />
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
                            <Badge variant="outline" className="text-[10px] uppercase font-code border-white/10">{item.metadata?.mood || 'Generated'}</Badge>
                            <span className="text-[10px] font-code text-muted-foreground">
                              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Recent'}
                            </span>
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
                      <Button onClick={handleUpgradePlan} className="w-full bg-accent hover:bg-accent/90 glow-accent text-accent-foreground font-bold" disabled={profile?.plan === 'pro'}>
                        {profile?.plan === 'pro' ? "PRO SYSTEM ACTIVE" : "UPGRADE PROTOCOL"}
                      </Button>
                    </Card>
                  </div>
                </section>
              </div>
            </div>

            {/* Profile Update Dialog */}
            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
              <DialogContent className="glass-darker border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-headline font-bold tracking-tight text-glow uppercase">Update Identity Protocol</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">New Display Name</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="bg-white/5 border-white/10 col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile} className="bg-primary hover:bg-primary/90 glow-primary" disabled={isUpdatingProfile}>
                    Update Protocol
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell activeSection={activeSection} onSectionChange={setActiveSection}>
      <div className="flex h-full w-full overflow-hidden">
        {renderContent()}
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
