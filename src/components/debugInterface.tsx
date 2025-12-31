import { useEffect } from 'react';
import { useControls, button } from 'leva';
import { useGameStore } from '../gameStore'; 
import { useFishingStore } from '../fishingStore';

export const DebugInterface = () => {
  const store = useGameStore();
  const fishingStore = useFishingStore();

  // --- 1. Game Section ---
  // We pass the folder name 'Game' as the first argument
  const [, setGame] = useControls('Game', () => ({
    Phase: { 
      value: store.gameState, 
      options: ['MENU', 'PLAYING', 'ENDING_GOOD', 'ENDING_BAD', 'ENDING_RECURSION'],
      onChange: (v) => useGameStore.setState({ gameState: v }) 
    },
    Hour: {
      value: store.currentHour,
      min: 0,
      max: 24,
      step: 1,
      onChange: (v) => useGameStore.setState({ currentHour: v })
    },
    Sanity: {
      value: store.sanity,
      min: 0,
      max: 100,
      onChange: (v) => useGameStore.setState({ sanity: v })
    },
    'Next Hour': button(() => store.advanceHour()),
  }));

  // --- 2. Environment Section ---
  const [, setEnv] = useControls('Environment', () => ({
    Heater: {
      options: { Orange: 'ORANGE', Blue: 'BLUE' },
      value: store.heaterColor,
      onChange: (v) => store.setHeaterMode(v)
    },
    'Water Still?': {
      value: store.isWaterStill,
      onChange: (v) => useGameStore.setState({ isWaterStill: v })
    },
    'Radio Silent': {
      value: store.isRadioSilent,
      onChange: (v) => useGameStore.setState({ isRadioSilent: v })
    }
  }));

  // --- 3. Fishing Section ---
  const [, setFishing] = useControls('Fishing', () => ({
    Status: { 
      value: fishingStore.fishingState, 
      editable: false // Read-only
    },
    Bait: {
      value: fishingStore.baitCount,
      min: 0,
      max: 10,
      onChange: (v) => useFishingStore.setState({ baitCount: v })
    },
    'Toss Bait': button(() => fishingStore.tossBait()),
    'Cast Line': button(() => fishingStore.castLine()),
    'Reel In': button(() => fishingStore.reelIn()),
  }));

  // --- 4. Debug Section ---
  useControls('Debug', () => ({
    'Kill Player': button(() => store.triggerViolation('DEBUG_KILL')),
    'Force Win': button(() => store.triggerWin('ENDING_PAYROLL')),
  }), { collapsed: true });

  // --- 5. SYNC LOGIC ---
  // Sync the UI when the store changes internally (e.g., game logic updates)
  useEffect(() => {
    setGame({ Phase: store.gameState, Hour: store.currentHour, Sanity: store.sanity });
  }, [store.gameState, store.currentHour, store.sanity, setGame]);

  useEffect(() => {
    setEnv({ 'Water Still?': store.isWaterStill, Heater: store.heaterColor });
  }, [store.isWaterStill, store.heaterColor, setEnv]);

  useEffect(() => {
    setFishing({ Status: fishingStore.fishingState, Bait: fishingStore.baitCount });
  }, [fishingStore.fishingState, fishingStore.baitCount, setFishing]);

  return null;
};