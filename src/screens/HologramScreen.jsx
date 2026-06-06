import { useEffect, useRef, useState } from 'react'
import HologramProjection from '../components/HologramProjection'

const JOYSTICK_RADIUS = 46
const JOYSTICK_ROTATION_SPEED = 0.028

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

  const joystickDirectionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)

  useEffect(() => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setIsAutoRotating(false)
    setJoystickPosition({ x: 0, y: 0 })
    setIsDraggingJoystick(false)
    joystickDirectionRef.current = { x: 0, y: 0 }
  }, [fossil.id])

  useEffect(() => {
    function rotateWithJoystick() {
      const direction = joystickDirectionRef.current

      if (direction.x !== 0 || direction.y !== 0) {
        setRotation((previousRotation) => ({
          x: previousRotation.x + direction.y * JOYSTICK_ROTATION_SPEED,
          y: previousRotation.y + direction.x * JOYSTICK_ROTATION_SPEED
        }))
      }

      animationFrameRef.current = requestAnimationFrame(rotateWithJoystick)
    }

    animationFrameRef.current = requestAnimationFrame(rotateWithJoystick)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

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

    joystickDirectionRef.current = {
      x: limitedX / JOYSTICK_RADIUS,
      y: limitedY / JOYSTICK_RADIUS
    }
  }

  function handleJoystickPointerDown(event) {
    setIsDraggingJoystick(true)

    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    updateJoystick(event)
  }

  function handleJoystickPointerMove(event) {
    if (!isDraggingJoystick) return
    updateJoystick(event)
  }

  function handleJoystickPointerUp() {
    setIsDraggingJoystick(false)
    setJoystickPosition({ x: 0, y: 0 })
    joystickDirectionRef.current = { x: 0, y: 0 }
  }

  function handleReset() {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setIsAutoRotating(false)
    setJoystickPosition({ x: 0, y: 0 })
    joystickDirectionRef.current = { x: 0, y: 0 }
  }

  function handleZoomIn() {
    setZoom((previousZoom) => Math.min(previousZoom + 0.12, 2.2))
  }

  function handleZoomOut() {
    setZoom((previousZoom) => Math.max(previousZoom - 0.12, 0.55))
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
          <HologramProjection
            modelPath={fossil.model}
            rotation={rotation}
            zoom={zoom}
            isAutoRotating={isAutoRotating}
            projectionScale={fossil.projectionScale}
          />
        </section>

        <div
          className="joystick"
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
          onPointerLeave={handleJoystickPointerUp}
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