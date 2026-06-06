import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function normalizeModel(object) {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()

  box.getSize(size)
  box.getCenter(center)

  const maxAxis = Math.max(size.x, size.y, size.z)
  const scale = 1.85 / maxAxis

  object.scale.multiplyScalar(scale)

  object.position.x -= center.x * scale
  object.position.y -= center.y * scale
  object.position.z -= center.z * scale
}

export default function HologramProjection({
  modelPath,
  rotation,
  zoom,
  isAutoRotating,
  projectionScale = 1
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const propsRef = useRef({
    rotation,
    zoom,
    isAutoRotating,
    projectionScale
  })

  useEffect(() => {
    propsRef.current = {
      rotation,
      zoom,
      isAutoRotating,
      projectionScale
    }
  }, [rotation, zoom, isAutoRotating])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    renderer.autoClear = false

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0.5, 5)
    camera.lookAt(0, 0, 0)

    const viewRoot = new THREE.Group()
    const modelGroup = new THREE.Group()

    viewRoot.add(modelGroup)
    scene.add(viewRoot)

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
    directionalLight.position.set(3, 5, 4)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0xffffff, 0.8)
    backLight.position.set(-3, 2, -4)
    scene.add(backLight)

    let animationFrameId = null
    let model = null
    let autoRotation = 0

    const clock = new THREE.Clock()
    const loader = new GLTFLoader()

    loader.load(
      modelPath,
      (gltf) => {
        model = gltf.scene
        normalizeModel(model)
        modelGroup.clear()
        modelGroup.add(model)
      },
      undefined,
      (error) => {
        console.error('Erro ao carregar modelo:', error)
      }
    )

    function resizeRenderer() {
      const width = container.clientWidth
      const height = container.clientHeight

      renderer.setSize(width, height, false)
    }

    function renderHologramViews() {
      const width = container.clientWidth
      const height = container.clientHeight

      if (width === 0 || height === 0) return

      renderer.clear()

      camera.aspect = 1
      camera.updateProjectionMatrix()

      const margin = 12

      const availableWidth = width - margin * 2
      const availableHeight = height - margin * 2

      const cellSizeByWidth = availableWidth / 3
      const cellSizeByHeight = availableHeight / 3

      const viewSize = Math.floor(Math.min(cellSizeByWidth, cellSizeByHeight))

      const gridWidth = viewSize * 3
      const gridHeight = viewSize * 3

      const startX = Math.floor((width - gridWidth) / 2)
      const startY = Math.floor((height - gridHeight) / 2)

      const views = [
        {
          name: 'top',
          col: 1,
          row: 0,
          rotationZ: 0
        },
        {
          name: 'left',
          col: 0,
          row: 1,
          rotationZ: Math.PI / 2
        },
        {
          name: 'right',
          col: 2,
          row: 1,
          rotationZ: -Math.PI / 2
        },
        {
          name: 'bottom',
          col: 1,
          row: 2,
          rotationZ: Math.PI
        }
      ]

      for (const view of views) {
        const x = startX + view.col * viewSize
        const y = startY + view.row * viewSize

        renderer.setViewport(
          x,
          height - y - viewSize,
          viewSize,
          viewSize
        )

        renderer.setScissor(
          x,
          height - y - viewSize,
          viewSize,
          viewSize
        )

        renderer.setScissorTest(true)

        viewRoot.rotation.z = view.rotationZ

        renderer.render(scene, camera)
      }

      renderer.setScissorTest(false)
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate)

      const delta = clock.getDelta()
      const currentProps = propsRef.current

      if (currentProps.isAutoRotating) {
        autoRotation += delta * 0.45
      }

      modelGroup.rotation.x = currentProps.rotation.x
      modelGroup.rotation.y = currentProps.rotation.y + autoRotation
      modelGroup.scale.setScalar(currentProps.zoom * currentProps.projectionScale)

      renderHologramViews()
    }

    resizeRenderer()
    animate()

    const resizeObserver = new ResizeObserver(() => {
      resizeRenderer()
    })

    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      renderer.dispose()
    }
  }, [modelPath])

  return (
    <div className="hologram-canvas-wrapper" ref={containerRef}>
      <canvas ref={canvasRef} className="hologram-canvas" />
    </div>
  )
}