import { create } from 'zustand';

// --- Types ---
export type GamePhase = 'MENU' | 'PLAYING' | 'ENDING_GOOD' | 'ENDING_BAD' | 'ENDING_PAYROLL';
export type HeaterMode = 'ORANGE' | 'BLUE';

interface GameStore {
  // Global State
  gameState: GamePhase;
  currentHour: number;
  sanity: number;
  
  // Environment
  heaterColor: HeaterMode;
  isWaterStill: boolean;
  isRadioSilent: boolean;

  // Actions
  advanceHour: () => void;
  setHeaterMode: (mode: HeaterMode) => void;
  setWaterStill: (isStill: boolean) => void; // Exposed helper for other stores
  triggerViolation: (reason: string) => void;
  triggerWin: (type: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'MENU',
  currentHour: 0,
  sanity: 100,
  heaterColor: 'ORANGE',
  isWaterStill: false, // Default dangerous
  isRadioSilent: false,

  advanceHour: () => set((state) => ({ currentHour: state.currentHour + 1 })),
  
  setHeaterMode: (mode) => set({ heaterColor: mode }),
  
  setWaterStill: (isStill) => set({ isWaterStill: isStill }),

  triggerViolation: (reason) => {
    console.log(`💀 GAME OVER: ${reason}`);
    set({ gameState: 'ENDING_BAD' });
  },

  triggerWin: (type) => set({ gameState: type as GamePhase }),
}));