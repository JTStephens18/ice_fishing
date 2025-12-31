import { useState } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'

import { OrbitControls, Grid, TransformControls, KeyboardControls, Text, Line } from '@react-three/drei'
import type { KeyboardControlsEntry } from '@react-three/drei'

import { Perf } from 'r3f-perf'

import { Physics } from '@react-three/rapier'
import { RigidBody } from '@react-three/rapier'

import { DebugInterface } from './components/debugInterface'
import { FishingRod } from './components/fishingRod'

function Floor() {
  return (
    <RigidBody type="fixed" colliders="cuboid">

      <Grid 
        position={[0, 0, 0]} 
        args={[100.5, 100.5]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={3} 
        sectionThickness={1} 
        sectionColor="#9d4b4b" 
        fadeDistance={70} 
      />

      {/* An invisible physical box for the floor */}
      {/* Args: [width, height, depth] -> Wide and thin */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[100, 0.2, 100]} />
        <meshStandardMaterial visible={false} /> 
      </mesh>
    </RigidBody>
  )
}


  // Define the input map
  export const Controls = {
    forward: 'forward',
    backward: 'backward',
    left: 'left',
    right: 'right',
    jump: 'jump',
  } as const;

  export type Controls = typeof Controls[keyof typeof Controls];

  const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.forward, keys: ['ArrowUp', 'w', 'W'] },
    { name: Controls.backward, keys: ['ArrowDown', 's', 'S'] },
    { name: Controls.left, keys: ['ArrowLeft', 'a', 'A'] },
    { name: Controls.right, keys: ['ArrowRight', 'd', 'D'] },
    { name: Controls.jump, keys: ['Space'] },
  ]

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <KeyboardControls map={map}>
        <Canvas 
          camera={{ position: [4, 4, 10], fov: 50 }}
          // onPointerMissed={() => {
          //   // Deselect on background click (Only in Editor)
          //   if (mode === 'editor') setSelectedObj(null)
          // }}
        >
        <Perf position="top-left" />
        <Physics>
          <Floor />
        </Physics>

          <FishingRod />
        <OrbitControls makeDefault />
        <DebugInterface />
      </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default App
