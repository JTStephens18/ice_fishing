# Project Architecture Guide

## Tech Stack
- **Core:** React, TypeScript, Vite.
- **3D Engine:** React Three Fiber (R3F) / Three.js.
- **State Management:** Zustand (Split Stores).
- **UI/Debug:** Leva (Tweakpane).

---

## Architectural Patterns

### 1. State Management (Split Domain Stores)
- **Pattern:** "Global World" vs. "Local Mechanics."
- **Global Store (`gameStore.ts`):** Handles the "Universe Rules" (Time, Environment, Sanity, Win/Loss). This is the Single Source of Truth for the game loop.
- **Mechanic Stores (`fishingStore.ts`, etc.):** Handle isolated gameplay systems (Rod physics, specific inventory, mini-game states).

### 2. Cross-Store Communication
- **Rule:** Stores should remain decoupled where possible.
- **Dependency Direction:** Mechanic stores may depend on the Global store, but the Global store should not depend on Mechanic stores.
- **Implementation:** To read or modify global state from a mechanic action, use `useGameStore.getState()` directly.
> **Example:** `fishingStore` calls `useGameStore.getState().triggerViolation()` if a rule is broken.

### 3. Logic & Components
- **Smart Actions:** Logic remains in the stores (not components). Components trigger actions like `castLine()`.
- **Selective Subscription:** Components should import only the specific store hook they need (e.g., `FishingRod.tsx` only imports `useFishingStore`).
- **Visual Bridge:** Components use `useEffect` to subscribe to store changes for imperative visuals (animations, sounds).

### 4. Debugging (Leva)
- **Rule:** The Debug component (`DebugInterface.tsx`) is the exception to the separation rule; it imports all stores to visualize the entire system state.
- **Syncing:** Use separate `useControls` folders for each store domain.

---

## Key Store Roles

### Global Store (`useGameStore`)
- **State:** `GamePhase`, `CurrentHour`, `Sanity`, `HeaterMode`, `isWaterStill`.
- **Responsibility:** Managing the simulation clock, environment safety, and win/loss triggers.

### Fishing Store (`useFishingStore`)
- **State:** `FishingPhase`, `CurrentCatch`, `BaitCount`.
- **Responsibility:** Rod state machine (`IDLE` -> `CASTING` -> `BITE`), loot RNG, and validating actions against Global Rules via `getState()`.