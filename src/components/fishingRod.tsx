import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFishingStore } from '../fishingStore'; // Path to your store
import { getRandomLoot } from '../LootTable';
import * as THREE from 'three';

export const FishingRod: React.FC = () => {
  // Select specific state to prevent unnecessary re-renders
  // const fishingState = useFishingStore((state) => state.fishingState);
  // const castLine = useFishingStore((state) => state.castLine);
  // const setFishingState = useFishingStore((state) => state.setFishingState); // Helper needed in store
  // const setCurrentCatch = useFishingStore((state) => state.setCurrentCatch); // Helper needed in store

  const { fishingState, castLine, reelIn, setFishingState, setCurrentCatch } = useFishingStore()
  
  // Refs for animation
  const rodRef = useRef<THREE.Group>(null);

  // --- Logic: Handle The Bite ---
  useEffect(() => {
    let biteTimer: NodeJS.Timeout;

    if (fishingState === 'CASTING') {
      // 1. Transition from CASTING to WAITING quickly
      setTimeout(() => setFishingState('WAITING'), 1000);
    } 
    
    if (fishingState === 'WAITING') {
      // 2. Random time before a bite occurs (3 to 8 seconds)
      const timeToBite = Math.random() * 5000 + 3000;
      
      biteTimer = setTimeout(() => {
        setFishingState('BITE');
        // Optional: Play Sound "Splash"
      }, timeToBite);
    }

    return () => clearTimeout(biteTimer);
  }, [fishingState, setFishingState]);


  // --- Logic: Input Handler ---
const handleClick = (e: any) => {
    e.stopPropagation(); // Prevent clicking through the rod

    // DELETE the old 'switch' statement entirely.
    // Replace it with this simplified check:
    
    if (fishingState === 'IDLE') {
       // If we aren't fishing, Cast.
       castLine();
    } else {
       // If we ARE fishing (WAITING, BITE, etc), just tell the store to "Reel In".
       // The store will decide if it's "Too Early" or a "Success".
       reelIn();
    }
  };

  // --- Animation: Rod Bend ---
  useFrame((state) => {
    if (!rodRef.current) return;
    
    // Simple procedural animation based on state
    const time = state.clock.getElapsedTime();
    
    if (fishingState === 'WAITING') {
      // Gentle breathing motion
      rodRef.current.rotation.x = Math.sin(time) * 0.05;
    } else if (fishingState === 'BITE') {
      // Violent shaking
      rodRef.current.rotation.x = Math.sin(time * 20) * 0.2;
    } else {
      // Reset
      rodRef.current.rotation.x = THREE.MathUtils.lerp(rodRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group 
      ref={rodRef} 
      position={[0.5, -0.5, -1]} // Adjust position relative to camera
      onClick={handleClick}
    >
      {/* Visual: The Rod Handle */}
      <mesh position={[0, 0, 0.5]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#5c3a21" />
      </mesh>

      {/* Visual: The Fishing Line (Only visible when cast) */}
      {fishingState !== 'IDLE' && (
        <mesh position={[0, 1, 2]}>
           <line>
             <bufferGeometry />
             <lineBasicMaterial color="white" transparent opacity={0.5} />
             {/* Note: Actual line rendering in R3F usually requires a different approach 
                 like <Line> from @react-three/drei linking Rod Tip to Water Surface */}
           </line>
        </mesh>
      )}
    </group>
  );
};