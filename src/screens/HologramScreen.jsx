import { useEffect, useState } from 'react'
import ModelViewer from '../components/ModelViewer'

const JOYSTICK_RADIUS = 46
const JOYSTICK_SENSITIVITY = 0.0014

export default function HologramScreen({
  fossil,
  currentIndex,
  totalFossils,
  onNext,
  onPrevious,
  onInfo,
  onExit
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 })
  const [isDraggingJoystick, setIsDraggingJoystick] = useState(false)

  useEffect(() => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setIsAutoRotating(false)
    setJoystickPosition({ x: 0, y: 0 })
  }, [fossil.id])

  function updateJoystick(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const limitedDistance = Math.min(distance, JOYSTICK_RADIUS)
    const angle = Math.atan2(deltaY, deltaX)

    const limitedX = Math.cos(angle) * limitedDistance
    const limitedY = Math.sin(angle) * limitedDistance

    setJoystickPosition({ x: limitedX, y: limitedY })

    setRotation((previousRotation) => ({
      x: previousRotation.x + limitedY * JOYSTICK_SENSITIVITY,
      y: previousRotation.y + limitedX * JOYSTICK_SENSITIVITY
    }))
  }

  function handleJoystickPointerDown(event) {
    setIsDraggingJoystick(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    updateJoystick(event)
  }

  function handleJoystickPointerMove(event) {
    if (!isDraggingJoystick) return
    updateJoystick(event)
  }

  function handleJoystickPointerUp() {
    setIsDraggingJoystick(false)
    setJoystickPosition({ x: 0, y: 0 })
  }

  function handleReset() {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setIsAutoRotating(false)
    setJoystickPosition({ x: 0, y: 0 })
  }

  function handleZoomIn() {
    setZoom((previousZoom) => Math.min(previousZoom + 0.12, 1.8))
  }

  function handleZoomOut() {
    setZoom((previousZoom) => Math.max(previousZoom - 0.12, 0.45))
  }

  function handleAutoToggle() {
    setIsAutoRotating((currentValue) => !currentValue)
  }

  return (
    <main className="phone-stage hologram-stage">
      <section className="app-frame hologram-frame">
        <div className="fossil-label-card">
          <p className="fossil-title">{fossil.name}</p>
          <p className="fossil-counter">
            Fóssil {currentIndex + 1} de {totalFossils}
          </p>
        </div>

        <section className="projection-area">
          <div className="hologram-face face-top">
            <ModelViewer
              modelPath={fossil.model}
              rotation={rotation}
              zoom={zoom}
              isAutoRotating={isAutoRotating}
              modelScale={0.42}
            />
          </div>

          <div className="hologram-face face-right">
            <ModelViewer
              modelPath={fossil.model}
              rotation={rotation}
              zoom={zoom}
              isAutoRotating={isAutoRotating}
              modelScale={0.42}
            />
          </div>

          <div className="hologram-face face-bottom">
            <ModelViewer
              modelPath={fossil.model}
              rotation={rotation}
              zoom={zoom}
              isAutoRotating={isAutoRotating}
              modelScale={0.42}
            />
          </div>

          <div className="hologram-face face-left">
            <ModelViewer
              modelPath={fossil.model}
              rotation={rotation}
              zoom={zoom}
              isAutoRotating={isAutoRotating}
              modelScale={0.42}
            />
          </div>
        </section>

        <div
          className="joystick"
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
        >
          <div
            className="joystick-knob"
            style={{
              transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`
            }}
          />
        </div>

        <aside className="controls-box">
          <h2>CONTROLES</h2>

          <button
            className={`control-button auto-button ${isAutoRotating ? 'stop-active' : ''}`}
            type="button"
            onClick={handleAutoToggle}
          >
            {isAutoRotating ? 'STOP' : 'AUTO'}
          </button>

          <button className="control-button reset-button" type="button" onClick={handleReset}>
            RESET
          </button>

          <div className="zoom-row">
            <button className="zoom-button" type="button" onClick={handleZoomIn}>
              🔍+
            </button>

            <button className="zoom-button" type="button" onClick={handleZoomOut}>
              🔍-
            </button>
          </div>

          <button className="control-button dark-button" type="button" onClick={onNext}>
            PRÓXIMO
          </button>

          <button className="control-button dark-button" type="button" onClick={onPrevious}>
            ANTERIOR
          </button>

          <button className="control-button info-button" type="button" onClick={onInfo}>
            INFO
          </button>

          <button className="control-button exit-button" type="button" onClick={onExit}>
            SAIR
          </button>
        </aside>
      </section>
    </main>
  )
}