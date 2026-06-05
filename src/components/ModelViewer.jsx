import { Canvas, useFrame } from '@react-three/fiber'
import { Bounds, Center, Environment, useGLTF } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'

function FossilModel({ modelPath, rotation, zoom, isAutoRotating, modelScale }) {
  const groupRef = useRef()
  const autoRotationRef = useRef(0)
  const { scene } = useGLTF(modelPath)

  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (isAutoRotating) {
      autoRotationRef.current += delta * 0.75
    }

    groupRef.current.rotation.x = rotation.x
    groupRef.current.rotation.y = rotation.y + autoRotationRef.current
    groupRef.current.scale.setScalar(zoom * modelScale)
  })

  return (
    <group ref={groupRef}>
      <Bounds fit clip observe margin={1.8}>
        <Center>
          <primitive object={clonedScene} />
        </Center>
      </Bounds>
    </group>
  )
}

export default function ModelViewer({
  modelPath,
  rotation = { x: 0, y: 0 },
  zoom = 1,
  isAutoRotating = false,
  modelScale = 0.55,
  cameraPosition = [0, 0.2, 4.2]
}) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-3, 2, -4]} intensity={0.7} />

      <Suspense fallback={null}>
        <FossilModel
          modelPath={modelPath}
          rotation={rotation}
          zoom={zoom}
          isAutoRotating={isAutoRotating}
          modelScale={modelScale}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}