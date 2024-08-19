'use client'

import React, { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Sparkles, useGLTF } from '@react-three/drei'
import { Group } from 'three'

type GLTFResult = {
  nodes: any
  materials: any
  animations: any
  scene: Group
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url) as GLTFResult
  const modelRef = useRef<Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime()
      modelRef.current.rotation.y = Math.sin(t / 4) / 8
      modelRef.current.position.y = Math.sin(t / 1.5) / 10
    }
  })

  return <primitive object={scene} ref={modelRef} />
}

function HelmetModel() {
  const { scene } = useGLTF('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf') as GLTFResult
  const modelRef = useRef<Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime()
      modelRef.current.rotation.y = Math.sin(t / 4) / 8
      modelRef.current.position.y = Math.sin(t / 1.5) / 10
    }
  })

  return <primitive object={scene} ref={modelRef} />
}

interface GamePreview3DProps {
  modelUrl?: string
}

export default function GamePreview3D({ modelUrl }: GamePreview3DProps) {
  return (
    <div className="h-96 w-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          {modelUrl ? <Model url={modelUrl} /> : <HelmetModel />}
          {/* Adding sparkles to make the scene more dynamic */}
          <Sparkles size={5} scale={[10, 10, 10]} position={[0, 0, 0]} />
        </Suspense>
        <Environment preset="sunset" background />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
