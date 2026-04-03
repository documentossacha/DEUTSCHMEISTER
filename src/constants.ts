export const INITIAL_SLOTS = [
  {
    id: 'time',
    label: 'Tiempo (Wann)',
    placeholder: 'Heute...',
    options: ['Heute', 'Gestern', 'Morgen', 'Nächste Woche', 'Am Montag', 'Um 8 Uhr', 'Später', 'Bald', 'Jeden Tag', 'Letztes Jahr']
  },
  {
    id: 'aux',
    label: 'Verbo Auxiliar',
    placeholder: 'habe / bin...',
    options: ['habe', 'hast', 'hat', 'haben', 'bin', 'bist', 'ist', 'sind', 'werde', 'wirst', 'wird', 'muss', 'kann', 'will']
  },
  {
    id: 'subject',
    label: 'Sujeto',
    placeholder: 'ich / du...',
    options: ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'Sie', 'der Arzt', 'die Krankenschwester', 'der Lehrer', 'meine Mutter', 'der Patient', 'der Schüler']
  },
  {
    id: 'dative',
    label: 'Objeto Dativo',
    placeholder: 'mir / dir...',
    options: ['-', 'mir', 'dir', 'ihm', 'ihr', 'uns', 'euch', 'ihnen', 'meinem Freund', 'der Patientin', 'dem Kind', 'meiner Schwester']
  },
  {
    id: 'place',
    label: 'Lugar (Wo)',
    placeholder: 'zu Hause...',
    options: ['zu Hause', 'im Krankenhaus', 'in der Schule', 'nach Berlin', 'im Park', 'beim Arzt', 'in der Küche', 'im Büro', 'nach Hause']
  },
  {
    id: 'manner',
    label: 'Modo (Wie)',
    placeholder: 'schnell...',
    options: ['schnell', 'gerne', 'vorsichtig', 'mit Freude', 'pünktlich', 'leise', 'laut', 'langsam', 'gut', 'schlecht']
  },
  {
    id: 'accusative',
    label: 'Objeto Acusativo',
    placeholder: 'einen Apfel...',
    options: ['-', 'einen Apfel', 'das Buch', 'die Medikamente', 'den Brief', 'einen Kaffee', 'die Hausaufgaben', 'das Frühstück', 'den Termin']
  },
  {
    id: 'complement',
    label: 'Complemento',
    placeholder: '...',
    options: ['-', 'fertig', 'sauber', 'bereit', 'glücklich', 'müde', 'krank', 'gesund']
  },
  {
    id: 'participle',
    label: 'Participio / Infinitiv',
    placeholder: 'gegeben...',
    options: ['gegeben', 'gegessen', 'getrunken', 'gemacht', 'geholfen', 'besucht', 'gekauft', 'geschrieben', 'gelesen', 'gearbeitet', 'gesehen', 'gekommen']
  },
  {
    id: 'adverb',
    label: 'Adverbio',
    placeholder: 'oft / nie...',
    options: ['oft', 'nie', 'manchmal', 'immer', 'vielleicht', 'leider', 'glücklicherweise', 'besonders', 'ziemlich', 'sehr']
  },
  {
    id: 'preposition',
    label: 'Preposición',
    placeholder: 'mit / für...',
    options: ['mit', 'für', 'ohne', 'gegen', 'nach', 'zu', 'von', 'aus', 'bei', 'seit']
  },
  {
    id: 'adjective',
    label: 'Adjetivo',
    placeholder: 'schön / groß...',
    options: ['schön', 'groß', 'klein', 'neu', 'alt', 'gut', 'schlecht', 'wichtig', 'einfach', 'schwer']
  },
  {
    id: 'conjunction',
    label: 'Conjunción',
    placeholder: 'und / aber...',
    options: ['und', 'aber', 'oder', 'weil', 'dass', 'wenn', 'obwohl', 'denn', 'sondern', 'da']
  }
];

export const CONTEXTS = ['hogar', 'hospital', 'educación', 'vida diaria', 'trabajo', 'viajes', 'restaurante', 'compras'];
export const LEVELS = ['A1', 'A2', 'B1', 'B2'];
