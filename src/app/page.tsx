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
  CreditCard,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, updateDoc, collection, addDoc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
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
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const { user } = useUser();
  const db = useFirestore();
  
  const userProfileRef = useMemo(() => (user && db) ? doc(db, 'users', user.uid) : null, [user, db]);
  const generationsRef = useMemo(() => (user && db) ? collection(db, 'users', user.uid, 'generations') : null, [user, db]);
  const historyQuery = useMemo(() => generationsRef ? query(generationsRef, orderBy('createdAt', 'desc'), limit(20)) : null, [generationsRef]);

  const { data: profile } = useDoc(userProfileRef);
  const { data: firestoreHistory } = useCollection(historyQuery);
  
  const { toast } = useToast();

  useEffect(() => {
    if (user?.displayName) {
      setNewName(user.displayName);
    }
  }, [user]);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;
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

      if (generationsRef && user) {
        addDoc(generationsRef, {
          ...generationData,
          createdAt: serverTimestamp(),
          userId: user.uid
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
        setLocalHistory(prev => [{ ...generationData, id: Math.random().toString() }, ...prev]);
      }

      toast({
        title: "GENERATION COMPLETE",
        description: "Vector topology and motion choreography synthesized successfully.",
      });
    } catch (error: any) {
      console.error('Generation Error:', error);
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
      toast({ title: "IDENTITY UPDATED" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "UPDATE FAILED", description: error.message });
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
    toast({ title: "ASSETS EXPORTED" });
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
                <Button variant="ghost" size="sm" className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "LINK COPIED" });
                }}>
                  <Share className="w-3.5 h-3.5" />
                  Collaborate
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[10px] gap-2 uppercase tracking-widest font-headline border-white/10" onClick={handleExport}>
                  <Layers className="w-3.5 h-3.5" />
                  Export Assets
                </Button>
                <Button size="sm" className="h-8 text-[10px] gap-2 bg-primary hover:bg-primary/90 glow-primary uppercase tracking-widest font-headline" onClick={() => toast({ title: "DEPLOYMENT SIMULATED" })}>
                  <Sparkles className="w-3.5 h-3.5" />
                  Deploy Production
                </Button>
              </div>
            </header>

            <div className="flex-1 relative">
              <MotionStage svgContent={result?.svgContent || ''} gsapCode={result?.gsapAnimationCode || ''} isLoading={isLoading} />
              {!result && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20 glow-primary">
                    <Wand2 className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold tracking-tight text-glow mb-2">The Future is Vector.</h2>
                  <p className="text-muted-foreground max-w-md">Enter a prompt below to synthesize a cinematic SVG motion scene using high-end AI choreography.</p>
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
          <div className="flex-1 p-8 space-y-8 flex flex-col overflow-hidden">
            <div>
              <h2 className="text-3xl font-headline font-bold tracking-tight text-glow">Generation History</h2>
              <p className="text-muted-foreground">Revisit previously synthesized motion blueprints.</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-12">
                {combinedHistory.map((item, idx) => (
                  <Card key={item.id || idx} className="glass-darker border-white/5 p-6 hover:border-primary/20 transition-all flex gap-6 overflow-hidden">
                    <div className="w-32 h-32 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                      <div className="scale-[0.25] pointer-events-none" dangerouslySetInnerHTML={{ __html: item.svgContent }} />
                    </div>
                    <div className="flex-1 space-y-4">
                      <p className="text-sm font-medium italic line-clamp-2">"{item.prompt}"</p>
                      <Button variant="outline" size="sm" className="w-full text-[10px] uppercase tracking-widest" onClick={() => {
                        setResult(item);
                        setActiveSection('stage');
                      }}>Load Scene</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        );
      case 'profile':
        return (
          <div className="flex-1 p-8 space-y-12 max-w-5xl mx-auto w-full overflow-auto">
            <header className="flex items-end gap-8 pb-12 border-b border-white/5">
              <Avatar className="w-32 h-32 rounded-2xl border-2 border-white/10 glow-primary">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-4xl font-headline font-bold text-glow">{user?.displayName || 'Vanguard Entity'}</h2>
                <Badge className="bg-primary/20 text-primary mt-4">{profile?.plan?.toUpperCase() || 'FREE TIER'}</Badge>
              </div>
              <Button onClick={() => setIsProfileModalOpen(true)} variant="outline" className="border-white/10 gap-2 font-headline uppercase tracking-widest">
                <Edit3 className="w-4 h-4" />
                Update Identity
              </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className={cn("glass p-6 space-y-6", profile?.plan === 'free' && "border-primary/40")}>
                <h4 className="font-headline font-bold text-lg">Aether Free</h4>
                <p className="text-xs text-muted-foreground">Standard AI synthesis with web-tier performance.</p>
                <div className="text-3xl font-headline font-bold">$0</div>
                <Button variant="outline" className="w-full" disabled={profile?.plan === 'free'}>ACTIVE</Button>
              </Card>
              <Card className={cn("glass p-6 space-y-6", profile?.plan === 'pro' && "border-accent/40")}>
                <h4 className="font-headline font-bold text-lg">Aether Pro</h4>
                <p className="text-xs text-muted-foreground">Elite GPU synthesis with cinematic morphing.</p>
                <div className="text-3xl font-headline font-bold">$29</div>
                <Button onClick={handleUpgradePlan} className="w-full bg-accent text-accent-foreground font-bold" disabled={profile?.plan === 'pro'}>UPGRADE</Button>
              </Card>
            </div>

            <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
              <DialogContent className="glass-darker border-white/10">
                <DialogHeader><DialogTitle className="font-headline uppercase tracking-widest">Update Identity Protocol</DialogTitle></DialogHeader>
                <div className="py-4 space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">New Display Name</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-white/5 border-white/10" />
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsProfileModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile} className="bg-primary glow-primary" disabled={isUpdatingProfile}>Update Protocol</Button>
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
            <LiveInspector svgContent={result?.svgContent || ''} gsapCode={result?.gsapAnimationCode || ''} metadata={result?.metadata} />
          </aside>
        )}
      </div>
    </AppShell>
  );
}
