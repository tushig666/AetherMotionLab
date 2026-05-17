
"use client";

import React, { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Github, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const syncUserProfile = async (user: any) => {
    if (!db) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName || name || 'New User',
        email: user.email,
        photoURL: user.photoURL || '',
        plan: 'free',
        createdAt: serverTimestamp()
      });
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        await syncUserProfile(res.user);
        toast({ title: "ACCOUNT CREATED", description: "Welcome to AetherMotion Lab." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "WELCOME BACK", description: "Authentication successful." });
      }
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "AUTH ERROR", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (providerName: 'google' | 'github') => {
    if (!auth) return;
    const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      await syncUserProfile(res.user);
      toast({ title: "SOCIAL AUTH SUCCESS", description: `Signed in with ${providerName}.` });
      onClose();
    } catch (error: any) {
      toast({ variant: "destructive", title: "AUTH ERROR", description: error.message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] glass-darker border-white/10 p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-headline font-bold tracking-tight text-glow">
              {isSignUp ? "Create Protocol" : "Access Terminal"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isSignUp ? "Initialize your cloud identity." : "Sign in to synchronize your motions."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Identity Name</Label>
                <Input 
                  placeholder="Vanguard Entity" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Communication Link</Label>
              <Input 
                type="email" 
                placeholder="email@aether.io" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Security Key</Label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 glow-primary h-11" disabled={loading}>
              {loading ? "PROCESSING..." : (isSignUp ? "INITIALIZE" : "ENTER")}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-white/10" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
              <span className="bg-[#07070D] px-2 text-muted-foreground">Or connect via</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={() => handleSocialAuth('google')}>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 gap-2" onClick={() => handleSocialAuth('github')}>
              <Github className="w-4 h-4" />
              GitHub
            </Button>
          </div>

          <div className="text-center pt-2">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
            >
              {isSignUp ? "Already have a key? Sign in" : "Need a profile? Initialize here"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
