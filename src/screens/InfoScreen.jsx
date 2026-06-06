import { useEffect, useRef, useState } from 'react'
import ModelViewer from '../components/ModelViewer'

export default function InfoScreen({ fossil, onBack }) {
  const audioRef = useRef(null)
  const [audioStatus, setAudioStatus] = useState('idle')

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    setAudioStatus('idle')
  }

  async function handleAudioButton() {
    if (audioStatus === 'playing') {
      stopAudio()
      return
    }

    if (!fossil.audio) {
      setAudioStatus('no-audio')
      return
    }

    try {
      const audio = new Audio(fossil.audio)
      audioRef.current = audio

      audio.onended = () => {
        setAudioStatus('idle')
        audioRef.current = null
      }

      await audio.play()
      setAudioStatus('playing')
    } catch (error) {
      setAudioStatus('no-audio')
    }
  }

  function handleBack() {
    stopAudio()
    onBack()
  }

  return (
    <main className="phone-stage info-stage">
      <section className="app-frame info-frame">
        <p className="reading-warning">
          Para melhor leitura, retire a pirâmide da tela.
        </p>

        <div className="info-layout">
          <section className="info-left-column">
            <h1>{fossil.name}</h1>

            <div className="description-box">
              <p>{fossil.description}</p>
            </div>

            <div className="info-buttons">
              <button className="listen-button" type="button" onClick={handleAudioButton}>
                {audioStatus === 'no-audio'
                  ? 'SEM ÁUDIO'
                  : audioStatus === 'playing'
                    ? 'PARAR'
                    : 'OUVIR'}
              </button>

              <button className="back-button" type="button" onClick={handleBack}>
                VOLTAR
              </button>
            </div>
          </section>

          <section className="info-right-column">
            <div className="illustration-area">
              <img src={fossil.illustration} alt={`Ilustração de ${fossil.name}`} />
            </div>

            <div className="small-preview-3d">
              <ModelViewer
                modelPath={fossil.model}
                rotation={{ x: 0, y: 0 }}
                zoom={1.4}
                isAutoRotating
                modelScale={fossil.infoScale ?? 1}
              />
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}