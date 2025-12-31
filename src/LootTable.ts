import { Fish } from './fishingStore'; // Assuming Fish interface is in your store file

interface LootItem extends Fish {
  type: 'FISH' | 'JUNK' | 'LORE' | 'HORROR';
  description: string;
  weightProbability: number; // Higher number = more likely to catch
}

const LOOT_POOL: LootItem[] = [
  // --- COMMON FISH (High Probability) ---
  { 
    id: 'perch', 
    name: 'Yellow Perch', 
    weight: 1.2, 
    type: 'FISH', 
    description: 'A common catch in these frozen waters.',
    weightProbability: 50 
  },
  { 
    id: 'bluegill', 
    name: 'Bluegill', 
    weight: 0.8, 
    type: 'FISH', 
    description: 'Small, but it keeps the hunger away.',
    weightProbability: 40 
  },

  // --- UNCOMMON FISH ---
  { 
    id: 'walleye', 
    name: 'Walleye', 
    weight: 4.5, 
    type: 'FISH', 
    description: 'Glassy eyes that seem to stare back at you.',
    weightProbability: 20 
  },

  // --- JUNK (Annoying but safe) ---
  { 
    id: 'boot', 
    name: 'Frozen Boot', 
    weight: 0, 
    type: 'JUNK', 
    description: 'Someone left this here a long time ago.',
    weightProbability: 15 
  },
  { 
    id: 'can', 
    name: 'Rusted Tin Can', 
    weight: 0, 
    type: 'JUNK', 
    description: 'Label is peeled off. Smells like peaches.',
    weightProbability: 15 
  },

  // --- LORE (The Story) ---
  { 
    id: 'tape_wet', 
    name: 'Wet Cassette Tape', 
    weight: 0, 
    type: 'LORE', 
    description: 'The magnetic tape is tangled, but maybe it still plays?',
    weightProbability: 5 
  },

  // --- HORROR (Rare, Game Events) ---
  { 
    id: 'finger', 
    name: 'Severed Finger', 
    weight: 0.1, 
    type: 'HORROR', 
    description: 'It is still warm. The nail is painted blue.',
    weightProbability: 2 
  },
  { 
    id: 'teeth', 
    name: 'Clump of Teeth', 
    weight: 0.2, 
    type: 'HORROR', 
    description: 'Wrapped in human hair.',
    weightProbability: 1 
  },
];

export const getRandomLoot = (): Fish => {
  // 1. Calculate total weight
  const totalWeight = LOOT_POOL.reduce((sum, item) => sum + item.weightProbability, 0);

  // 2. Pick a random number between 0 and totalWeight
  let randomNum = Math.random() * totalWeight;

  // 3. Find which item corresponds to the random number
  for (const item of LOOT_POOL) {
    if (randomNum < item.weightProbability) {
      return item;
    }
    randomNum -= item.weightProbability;
  }

  // Fallback (should rarely happen)
  return LOOT_POOL[0];
};