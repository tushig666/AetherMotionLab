"use client";

import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Home, History, Box, Settings, Share2, HelpCircle, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
        <Sidebar className="glass-darker border-r border-white/5 w-[240px]" collapsible="icon">
          <SidebarHeader className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary glow-primary flex items-center justify-center text-white">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
                Aether<span className="text-primary">Motion</span>
              </span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 space-y-2 py-4">
            <SidebarNavItem icon={Home} label="Studio Stage" active />
            <SidebarNavItem icon={History} label="Generations" />
            <SidebarNavItem icon={Crown} label="Master Library" />
            <SidebarNavItem icon={Share2} label="Collaborations" />
          </SidebarContent>

          <SidebarFooter className="p-4 mt-auto space-y-2">
            <SidebarNavItem icon={Settings} label="Engine Settings" />
            <SidebarNavItem icon={HelpCircle} label="Documentation" />
            
            <div className="mt-4 p-4 rounded-xl glass-darker border-white/5 group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent overflow-hidden">
                  <User className="w-full h-full p-1.5 opacity-50" />
                </div>
                <div>
                  <p className="text-xs font-medium">Guest Entity</p>
                  <p className="text-[10px] text-muted-foreground">Free Tier</p>
                </div>
              </div>
              <Button size="sm" className="w-full text-[10px] h-8 bg-white/5 hover:bg-white/10 text-white font-headline font-bold uppercase tracking-widest">
                Upgrade Engine
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 relative flex flex-col h-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const SidebarNavItem = ({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) => (
  <button className={cn(
    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden",
    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
  )}>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full glow-primary" />}
    <Icon className={cn("w-5 h-5", active && "glow-primary")} />
    <span className="text-sm font-medium font-headline tracking-tight group-data-[collapsible=icon]:hidden">
      {label}
    </span>
  </button>
);
