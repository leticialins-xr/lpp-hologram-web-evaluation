export default function StartScreen({ onStart }) {
  return (
    <main className="phone-stage start-stage">
      <section className="app-frame start-frame">
        <div className="phone-notch" />

        <div className="start-content">
          <img
            className="lpp-logo"
            src="/images/lpp-logo.png"
            alt="Logo do Laboratório de Pesquisas Paleontológicas da UFAC"
            />

          <h1>Holograma Interativo de Fósseis</h1>

          <p className="subtitle">
            Laboratório de Pesquisas Paleontológicas da UFAC • LPP
          </p>

          <div className="instructions-box">
            <p>Instruções de uso</p>

            <ol>
              <li>Posicione a pirâmide transparente sobre a área de projeção - entre os 4 fósseis.</li>
              <li>Use o joystick para rotacionar o fóssil.</li>
              <li>Use os controles de zoom para aproximar ou afastar a visualização.</li>
              <li>Navegue pelo acervo com os botões PRÓXIMO e ANTERIOR.</li>
              <li>Toque em INFO para acessar mais informações sobre o fóssil.</li>
            </ol>
          </div>

          <p className="web-version-notice">
            Versão web reduzida para avaliação heurística, com acervo limitado
            a três fósseis e conteúdo explicativo padronizado.
          </p>

          <button className="start-button" type="button" onClick={onStart}>
            INICIAR
          </button>
        </div>
      </section>
    </main>
  )
}