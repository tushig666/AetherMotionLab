
import { create } from 'zustand';

/**
 * @fileOverview Global state for AI Engine health and resilience mode.
 */

export type EngineStatus = 'operational' | 'degraded' | 'offline';

interface ResilienceState {
  status: EngineStatus;
  isFallbackActive: boolean;
  cooldownRemaining: number;
  totalFallbacksTriggered: number;
  
  // Actions
  setEngineStatus: (status: EngineStatus) => void;
  triggerFallback: () => void;
  resetResilience: () => void;
  tickCooldown: () => void;
}

export const useResilienceStore = create<ResilienceState>((set) => ({
  status: 'operational',
  isFallbackActive: false,
  cooldownRemaining: 0,
  totalFallbacksTriggered: 0,

  setEngineStatus: (status) => set({ status }),
  
  triggerFallback: () => set((state) => ({ 
    status: 'degraded', 
    isFallbackActive: true,
    totalFallbacksTriggered: state.totalFallbacksTriggered + 1,
    cooldownRemaining: 60 // 60s cooldown for AI retry
  })),

  resetResilience: () => set({ 
    status: 'operational', 
    isFallbackActive: false,
    cooldownRemaining: 0 
  }),

  tickCooldown: () => set((state) => ({
    cooldownRemaining: Math.max(0, state.cooldownRemaining - 1),
    status: state.cooldownRemaining <= 1 ? 'operational' : state.status,
    isFallbackActive: state.cooldownRemaining <= 1 ? false : state.isFallbackActive
  }))
}));
