import { create } from 'zustand';
import { getRandomLoot } from './LootTable';
import { useGameStore } from './gameStore'; // Import the other store

export type FishingPhase = 'IDLE' | 'CASTING' | 'WAITING' | 'BITE' | 'REELING';

export interface Fish {
  id: string;
  name: string;
  weight?: number;
  type?: 'FISH' | 'JUNK' | 'LORE' | 'HORROR'; // Added
  description?: string; // Added
}


interface FishingStore {
  fishingState: FishingPhase;
  currentCatch: Fish | null;
  baitCount: number;

  // Actions
  castLine: () => void;
  reelIn: () => void;
  tossBait: () => void;
  
  // Helpers (for the component/timers)
  setFishingState: (state: FishingPhase) => void;
  setCurrentCatch: (fish: Fish | null) => void;
}

export const useFishingStore = create<FishingStore>((set, get) => ({
  fishingState: 'IDLE',
  currentCatch: null,
  baitCount: 3,

  setFishingState: (status) => set({ fishingState: status }),
  setCurrentCatch: (fish) => set({ currentCatch: fish }),

  tossBait: () => {
    const { baitCount } = get();
    // Access the Global Store to change the environment
    const gameStore = useGameStore.getState(); 

    if (baitCount > 0) {
      console.log("🍖 Bait tossed. Water is safe for a moment.");
      set({ baitCount: baitCount - 1 });
      
      // Update global world state
      gameStore.setWaterStill(false);
      
      // Reset water to dangerous (Still) after 10 seconds
      // Ideally, track this timer ID to clear it if needed
      setTimeout(() => {
        gameStore.setWaterStill(true);
        console.log("🌊 The water settles. It is dangerous again.");
      }, 10000);
    }
  },

  castLine: () => {
    const { fishingState } = get();
    
    // 1. Cross-Store Check: Get latest world data
    const { isWaterStill, triggerViolation } = useGameStore.getState();

    if (fishingState !== 'IDLE') return;

    // 2. Enforce Global Rule
    if (isWaterStill) {
      triggerViolation("CAST_IN_STILL_WATER"); // Kill the player
      return; 
    }

    set({ fishingState: 'CASTING' });
  },

  reelIn: () => {
    const { fishingState } = get();

    if (fishingState === 'WAITING') {
      console.log("⚠️ Too early!");
      set({ fishingState: 'IDLE' });
    } else if (fishingState === 'BITE') {
      const loot = getRandomLoot();
      console.log(`🐟 CAUGHT: ${loot.name}`);
      set({ currentCatch: loot, fishingState: 'REELING' });
      
      setTimeout(() => set({ fishingState: 'IDLE' }), 2000);
    }
  }
}));