
"use client";

import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarHeader, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { Home, History, Box, Settings, Share2, HelpCircle, User, Crown, LogOut, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useAuth } from '@/firebase';
import { AuthModal } from '@/components/auth/AuthModal';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

export type SectionID = 'stage' | 'history' | 'library' | 'collab' | 'settings' | 'docs' | 'profile';

interface AppShellProps {
  children: React.ReactNode;
  activeSection: SectionID;
  onSectionChange: (section: SectionID) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeSection, onSectionChange }) => {
  const { user } = useUser();
  const auth = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSignOut = () => {
    if (auth) signOut(auth);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/30">
        <Sidebar className="glass-darker border-r border-white/5 w-[240px]" collapsible="icon">
          <SidebarHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-primary glow-primary flex items-center justify-center text-white shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <span className="font-headline font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">
                Aether<span className="text-primary">Motion</span>
              </span>
            </div>
            <SidebarTrigger className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-white/5 transition-all" />
          </SidebarHeader>

          <SidebarContent className="px-3 space-y-1 py-4">
            <SidebarNavItem 
              icon={Home} 
              label="Studio Stage" 
              active={activeSection === 'stage'} 
              onClick={() => onSectionChange('stage')}
            />
            <SidebarNavItem 
              icon={History} 
              label="Generations" 
              active={activeSection === 'history'} 
              onClick={() => onSectionChange('history')}
            />
            <SidebarNavItem 
              icon={Crown} 
              label="Master Library" 
              active={activeSection === 'library'} 
              onClick={() => onSectionChange('library')}
            />
            <SidebarNavItem 
              icon={Share2} 
              label="Collaborations" 
              active={activeSection === 'collab'} 
              onClick={() => onSectionChange('collab')}
            />
          </SidebarContent>

          <SidebarFooter className="p-4 mt-auto space-y-1">
            <SidebarNavItem 
              icon={Settings} 
              label="Engine Settings" 
              active={activeSection === 'settings'} 
              onClick={() => onSectionChange('settings')}
            />
            <SidebarNavItem 
              icon={HelpCircle} 
              label="Documentation" 
              active={activeSection === 'docs'} 
              onClick={() => onSectionChange('docs')}
            />
            
            <div className="mt-4 group-data-[collapsible=icon]:hidden">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl glass border-white/5 hover:border-primary/20 transition-all text-left group">
                      <Avatar className="w-8 h-8 rounded-full border border-primary/20">
                        <AvatarImage src={user.photoURL || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {user.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{user.displayName || 'Entity'}</p>
                        <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest">Free Tier</p>
                      </div>
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="center" className="w-[208px] glass-darker border-white/10">
                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Account Systems</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onSectionChange('profile')} className="gap-2 cursor-pointer focus:bg-primary/10">
                      <User className="w-3.5 h-3.5" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSectionChange('settings')} className="gap-2 cursor-pointer focus:bg-primary/10">
                      <Settings className="w-3.5 h-3.5" />
                      Preferences
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-red-400 focus:bg-red-400/10 focus:text-red-400">
                      <LogOut className="w-3.5 h-3.5" />
                      Terminate Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Card className="p-4 rounded-xl glass-darker border-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">Sync Generations</p>
                  <Button size="sm" onClick={() => setIsAuthModalOpen(true)} className="w-full text-[10px] h-8 bg-primary hover:bg-primary/90 glow-primary font-headline font-bold uppercase tracking-widest">
                    Sign In
                  </Button>
                </Card>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 relative flex flex-col h-full">
          {children}
        </main>

        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

interface SidebarNavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarNavItem = ({ icon: Icon, label, active, onClick }: SidebarNavItemProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
    )}
  >
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-full glow-primary" />}
    <Icon className={cn("w-5 h-5", active && "glow-primary")} />
    <span className="text-sm font-medium font-headline tracking-tight group-data-[collapsible=icon]:hidden">
      {label}
    </span>
  </button>
);

import { Card } from '@/components/ui/card';
