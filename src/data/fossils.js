const baseUrl = import.meta.env.BASE_URL

export const fossils = [
  {
    id: 'fossil-01',
    name: 'Fóssil 01',
    model: `${baseUrl}/models/fossil-01.glb`,
    projectionScale: 1,
    infoScale: 0.7,
    illustration: `${baseUrl}/images/fossil-01.png`,
    audio: `${baseUrl}/audio/evaluation-narration.mp3`,
    description:
      'UFAC 1673 - Dente de Purussaurus brasiliensis.\nColetado em outubro de 1988 no Sítio Fossilífero Niterói, às margens do rio Acre, entre Rio Branco e Senador Guiomard. A base subcircular e a coroa ligeiramente achatada são características dos dentes da espécie. Sua curvatura e as cristas pseudozifodontes contribuíam para perfurar e cortar, indicando um grande predador de vertebrados.\nComprimento: 8,7 cm\nIdade: Mioceno'
  },
  {
    id: 'fossil-02',
    name: 'Fóssil 02',
    model: `${baseUrl}/models/fossil-02.glb`,
    projectionScale: 1.7,
    infoScale: 1.6,
    illustration: `${baseUrl}/images/fossil-02.png`,
    audio: `${baseUrl}/audio/evaluation-narration.mp3`,
    description:
      'UFAC 4515 - Crânio de Neoepiblema acreensis.\n Coletado em 1993 no Sítio Fossilífero Niterói, às margens do rio Acre, entre Rio Branco e Senador Guiomard. É o crânio mais completo da espécie conhecido. Estudos do crânio indicam que esse roedor tinha encefalização relativamente pequena. Uma hipótese é que isso esteja relacionado à ausência de predadores especializados, como felinos, na época em que viveu.\nComprimento: 30 cm\nIdade: Mioceno'
  },
  {
    id: 'fossil-03',
    name: 'Fóssil 03',
    model: `${baseUrl}/models/fossil-03.glb`,
    projectionScale: 1.5,
    infoScale: 1.5,
    illustration: `${baseUrl}/images/fossil-03.png`,
    audio: `${baseUrl}/audio/evaluation-narration.mp3`,
    description:
      'UFAC 035 - Ramo mandibular direito de uma anta jovem (Tapirus sp.)\nColetado em agosto de 1978 no Sítio Fossilífero Torre da Lua, no alto rio Juruá. A peça pertence à família Tapiridae. O terceiro molar, também chamado de dente do siso ou dente serotino, ainda não havia nascido. Isso indica que o animal era juvenil e ainda estava em fase de crescimento.\nComprimento: 17,9 cm\nIdade: Quaternário'
  }
]
