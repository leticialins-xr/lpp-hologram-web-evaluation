import { useState } from 'react'
import { fossils } from './data/fossils'
import StartScreen from './screens/StartScreen'
import HologramScreen from './screens/HologramScreen'
import InfoScreen from './screens/InfoScreen'
import './styles.css'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentFossil = fossils[currentIndex]

  function goToNextFossil() {
    setCurrentIndex((previousIndex) =>
      previousIndex === fossils.length - 1 ? 0 : previousIndex + 1
    )
  }

  function goToPreviousFossil() {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0 ? fossils.length - 1 : previousIndex - 1
    )
  }

  function handleStart() {
    setScreen('hologram')
  }

  function handleOpenInfo() {
    setScreen('info')
  }

  function handleCloseInfo() {
    setScreen('hologram')
  }

  function handleExit() {
    setScreen('start')
  }

  return (
    <>
      {screen === 'start' && <StartScreen onStart={handleStart} />}

      {screen === 'hologram' && (
        <HologramScreen
          fossil={currentFossil}
          currentIndex={currentIndex}
          totalFossils={fossils.length}
          onNext={goToNextFossil}
          onPrevious={goToPreviousFossil}
          onInfo={handleOpenInfo}
          onExit={handleExit}
        />
      )}

      {screen === 'info' && (
        <InfoScreen
          fossil={currentFossil}
          onBack={handleCloseInfo}
        />
      )}
    </>
  )
}