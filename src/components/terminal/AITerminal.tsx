"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Zap, Sparkles, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AITerminalProps {
  onGenerate: (prompt: string) => void;
  isLoading?: boolean;
}

export const AITerminal: React.FC<AITerminalProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition duration-1000" />
      
      <div className="relative glass-darker border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-2 mb-3 px-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
          </div>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-code uppercase tracking-widest">
            <Command className="w-3 h-3" />
            <span>Gen-Alpha Engine</span>
          </div>
          {isLoading && (
            <div className="ml-auto flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse glow-primary" />
              <span className="text-[10px] text-primary font-code uppercase tracking-widest animate-pulse">Thinking</span>
            </div>
          )}
        </div>

        <div className="relative flex items-end gap-3 px-2">
          <div className="flex-1 min-h-[60px] relative">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="‖ Enter motion blueprint prompt..."
              className="w-full bg-transparent border-none resize-none focus:ring-0 text-foreground font-body py-2 text-lg placeholder:text-muted-foreground/30 h-[60px] scrollbar-none"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="rounded-xl px-6 py-6 h-auto bg-primary hover:bg-primary/90 glow-primary transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap className={cn("w-5 h-5", isLoading && "animate-spin")} />
          </Button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 px-2 no-scrollbar">
          {[
            "Fluid Neumorphic Orb",
            "Orbital Circuitry",
            "Celestial Pulse",
            "Bionic Bloom"
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => setPrompt(tag)}
              className="whitespace-nowrap px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors uppercase tracking-widest font-code"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
