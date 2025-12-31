# Tech Stack & Architecture Overview

## Tech Stack
- **Core:** React, TypeScript, Vite.
- **3D Engine:** React Three Fiber (R3F) / Three.js.
- **State Management:** Zustand (External store).
- **UI/Debug:** Leva (Tweakpane).

---

## Architectural Patterns

### 1. State Management (The "Brain")
- **Pattern:** "Smart Store" / Flux-like.
- **Rule:** All game logic, rules, RNG, and state transitions must reside in `useGameStore` actions.
- **Constraint:** UI components (Leva) and 3D meshes (R3F) must call the exact same store actions to ensure consistent behavior.
> **Avoid:** Do not write game logic (e.g., "Check if caught fish") inside React Event Handlers (`onClick`).

### 2. 3D Components (The "Body")
- **Pattern:** Reactive / "Dumb" View.
- **Rule:** Components render based on read-only state from the store.
- **Interactivity:** `onClick` events should only fire Store Actions (e.g., `castLine()`).
- **Visuals:** Use `useEffect` or `useFrame` to subscribe to state changes for imperative animations (Sound, Particles, Rod Bending) that bridge the "Ref Gap."

### 3. Debugging (Leva)
- **Rule:** Use `useControls` with named folders (e.g., `useControls('Folder', ...)`).
- **Syncing:** Debug controls must sync with the store manually via `useEffect` if the game logic updates state internally.

---

## Key Types (Reference)

```typescript
type GamePhase = 'MENU' | 'PLAYING' | 'ENDING_GOOD' | 'ENDING_BAD' ...
type FishingPhase = 'IDLE' | 'CASTING' | 'WAITING' | 'BITE' | 'REELING'
type HeaterMode = 'ORANGE' | 'BLUE'