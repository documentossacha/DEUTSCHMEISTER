import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Play, RefreshCw, CheckCircle2, XCircle, Volume2, Languages, Eye, EyeOff, HelpCircle, Settings2, Trophy, BookOpen, Stethoscope, Home, GraduationCap, ChevronDown, Copy, Check, Newspaper, Lightbulb, Moon, Sun } from 'lucide-react';
import { cn } from './lib/utils';
import { GermanQuestion, AnswerSlot, LearningMode, EvaluationResult } from './types';
import { INITIAL_SLOTS, CONTEXTS } from './constants';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [question, setQuestion] = useState<GermanQuestion | null>(null);
  const [slots, setSlots] = useState<AnswerSlot[]>(INITIAL_SLOTS.map(s => ({ ...s, value: '' })));
  const [mode, setMode] = useState<LearningMode>('free');
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [realTimeTranslation, setRealTimeTranslation] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const [generalSuggestion, setGeneralSuggestion] = useState('');
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);

  const FONT_SIZES = [
    { level: 1, size: 12, label: 'Muy Pequeño' },
    { level: 2, size: 14, label: 'Pequeño' },
    { level: 3, size: 16, label: 'Normal' },
    { level: 4, size: 20, label: 'Grande' },
    { level: 5, size: 24, label: 'Muy Grande' },
  ];

  // Estados para sugerencias
  const [suggestions, setSuggestions] = useState<Record<string, string>>(
    INITIAL_SLOTS.reduce((acc, slot) => ({ ...acc, [slot.id]: '' }), {})
  );
  const [suggestionTarget, setSuggestionTarget] = useState<'question' | 'answer'>('question');

  const fullSentence = useMemo(() => {
    return slots.map(s => s.value).filter(v => v && v !== '-').join(' ');
  }, [slots]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const generateQuestion = async () => {
    setLoading(true);
    setEvaluation(null);
    
    const activeSuggestions = Object.entries(suggestions)
      .filter(([_, value]) => value.trim() !== '')
      .map(([id, value]) => `${INITIAL_SLOTS.find(s => s.id === id)?.label}: ${value}`)
      .join(', ');

    const fullPrompt = [
      activeSuggestions, 
      generalSuggestion,
      difficulty ? `La ${suggestionTarget === 'question' ? 'PREGUNTA' : 'RESPUESTA'} debe tener exactamente ${difficulty} elementos (palabras/partes).` : ''
    ].filter(Boolean).join('. ');

    const prompt = suggestionTarget === 'question'
      ? `Genera una PREGUNTA en alemán (Nivel A1-B2) usando estas sugerencias: ${fullPrompt}. Luego genera su respuesta correspondiente.`
      : `Genera una RESPUESTA en alemán (Nivel A1-B2) usando estas sugerencias: ${fullPrompt}. Luego genera la PREGUNTA correspondiente que daría lugar a esa respuesta.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompt} Contextos: ${CONTEXTS.join(', ')}.
        Divide tanto la pregunta como la respuesta en partes gramaticales. 
        Para cada parte, proporciona: el texto en alemán, la traducción al español y la CATEGORÍA GRAMATICAL (ej: Sujeto, Verbo, Adverbio, Objeto, etc.) en español.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fullText: { type: Type.STRING },
              translation: { type: Type.STRING },
              answerFullText: { type: Type.STRING },
              answerTranslation: { type: Type.STRING },
              level: { type: Type.STRING },
              context: { type: Type.STRING },
              parts: { type: Type.ARRAY, items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  grammaticalCategory: { type: Type.STRING }
                }
              } },
              answerParts: { type: Type.ARRAY, items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  translation: { type: Type.STRING },
                  grammaticalCategory: { type: Type.STRING }
                }
              } }
            }
          }
        }
      });
      setQuestion({ ...JSON.parse(response.text || '{}'), id: Math.random().toString(36).substr(2, 9) });
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={cn(
        "min-h-screen transition-colors duration-300 pb-20",
        darkMode ? "bg-[#121212] text-gray-100" : "bg-[#F7F9FC] text-[#3C3C3C]"
      )}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Header */}
      <header className={cn(
        "border-b py-6 px-4 sticky top-0 z-50 shadow-sm transition-colors duration-300",
        darkMode ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold text-[#58CC02] tracking-tight flex items-center gap-3">
                <Trophy className="w-8 h-8" /> DeutschMeister
              </h1>
              <span className="text-sm font-medium text-gray-400">
                by Jeanpierre Francis Sacha Gutierrez
              </span>
            </div>
            <div className="mt-1 sm:ml-11">
              <span className="text-xs text-gray-400">
                mail: <a href="mailto:documentos.sacha@gmail.com" className="hover:text-[#1CB0F6] transition-colors font-medium underline decoration-dotted">documentos.sacha@gmail.com</a>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className={cn(
                  "p-3 rounded-xl transition-all flex items-center gap-2 font-bold",
                  darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                )}
                title="Ajustar tamaño de fuente"
              >
                <span className="text-xs">A</span>
                <span className="text-lg">A</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", showFontSizeMenu && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {showFontSizeMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowFontSizeMenu(false)} 
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-2xl z-50 w-48 overflow-hidden"
                    >
                      <div className="p-3 border-b dark:border-gray-700">
                        <p className="text-[10px] font-black uppercase text-gray-400">Tamaño de fuente</p>
                      </div>
                      <div className="p-1">
                        {FONT_SIZES.map((f) => (
                          <button
                            key={f.level}
                            onClick={() => {
                              setFontSize(f.size);
                              setShowFontSizeMenu(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-3 text-sm font-bold rounded-xl transition-colors flex items-center justify-between",
                              fontSize === f.size ? "bg-[#1CB0F6] text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                            )}
                          >
                            <span>{f.level}. {f.label}</span>
                            <span style={{ fontSize: `${f.size}px` }}>A</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <a 
              href="https://www.tagesschau.de/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1CB0F6] text-white font-bold py-2 px-4 rounded-xl btn-shadow-blue text-sm"
            >
              <Newspaper className="w-4 h-4" /> News
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn(
                "p-3 rounded-xl transition-all",
                darkMode ? "bg-yellow-500/20 text-yellow-500" : "bg-gray-100 text-gray-600"
              )}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Módulo de Pregunta y Respuesta Generada */}
        <section className={cn(
          "rounded-3xl p-8 shadow-xl border-2 relative overflow-hidden transition-colors duration-300",
          darkMode ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#1CB0F6]" />
              Reto del día
            </h2>
            <button
              onClick={generateQuestion}
              disabled={loading}
              className="bg-[#1CB0F6] text-white font-bold py-3 px-8 rounded-2xl btn-shadow-blue disabled:opacity-50"
            >
              {loading ? 'Generando...' : 'Generar pregunta y respuesta'}
            </button>
          </div>

          {question && (
            <div className="space-y-12">
              {/* Pregunta */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1CB0F6] text-white text-xs font-bold px-2 py-1 rounded-lg uppercase">Pregunta</span>
                    <button onClick={() => speak(question.fullText)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                      <Volume2 className="w-5 h-5 text-[#1CB0F6]" />
                    </button>
                    <button onClick={() => copyToClipboard(question.fullText)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {question.parts.map((part, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col gap-1 border-2 rounded-2xl p-4 min-w-[120px] transition-all",
                        darkMode ? "bg-[#2A2A2A] border-gray-700" : "bg-white border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-bold">{part.text}</span>
                        <div className="flex gap-1">
                          <button onClick={() => speak(part.text)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Volume2 className="w-3 h-3 text-[#1CB0F6]" />
                          </button>
                          <button onClick={() => copyToClipboard(part.text)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-[#1CB0F6] font-medium">{part.translation}</span>
                      <span className="text-[10px] font-black uppercase text-gray-400">({part.grammaticalCategory || 'N/A'})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Respuesta Sugerida */}
              <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#58CC02] text-white text-xs font-bold px-2 py-1 rounded-lg uppercase">Respuesta Sugerida</span>
                    <button onClick={() => speak(question.answerFullText)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                      <Volume2 className="w-5 h-5 text-[#58CC02]" />
                    </button>
                    <button onClick={() => copyToClipboard(question.answerFullText)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {question.answerParts.map((part, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col gap-1 border-2 rounded-2xl p-4 min-w-[120px] transition-all",
                        darkMode ? "bg-[#2A2A2A] border-gray-700" : "bg-white border-gray-200"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-lg font-bold">{part.text}</span>
                        <div className="flex gap-1">
                          <button onClick={() => speak(part.text)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Volume2 className="w-3 h-3 text-[#58CC02]" />
                          </button>
                          <button onClick={() => copyToClipboard(part.text)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <span className="text-sm text-[#58CC02] font-medium">{part.translation}</span>
                      <span className="text-[10px] font-black uppercase text-gray-400">({part.grammaticalCategory || 'N/A'})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="text-[#1CB0F6] font-bold flex items-center gap-2 self-start"
                >
                  {showTranslation ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  {showTranslation ? 'Ocultar traducciones globales' : 'Ver traducciones globales'}
                </button>
                
                <AnimatePresence>
                  {showTranslation && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "p-6 rounded-2xl space-y-4",
                        darkMode ? "bg-[#2A2A2A]" : "bg-gray-50"
                      )}
                    >
                      <div>
                        <p className="text-xs font-black uppercase text-gray-400 mb-1">Traducción Pregunta:</p>
                        <p className="text-lg italic opacity-80">"{question.translation}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-gray-400 mb-1">Traducción Respuesta:</p>
                        <p className="text-lg italic opacity-80">"{question.answerTranslation}"</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${question.fullText}\n${question.answerFullText}`)}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1CB0F6]"
                      >
                        {copied ? <Check className="w-4 h-4 text-[#58CC02]" /> : <Copy className="w-4 h-4" />}
                        {copied ? '¡Copiado!' : 'Copiar texto completo'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </section>

        {/* Sección de Sugerencias para la IA */}
        <section className={cn(
          "rounded-3xl p-8 shadow-xl border-2 transition-colors duration-300",
          darkMode ? "bg-[#1E1E1E] border-gray-800" : "bg-white border-gray-100"
        )}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div className="flex-shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#1CB0F6]" />
                Sugerencias para la IA
              </h2>
              <p className="text-sm text-gray-500">Configura palabras específicas para la generación</p>
            </div>

            <div className="flex-grow w-full max-w-lg">
              <textarea
                placeholder="Escribe aquí cualquier sugerencia adicional (ej: 'usa el subjuntivo', 'sobre medicina', 'una oración larga'...)"
                value={generalSuggestion}
                onChange={(e) => setGeneralSuggestion(e.target.value)}
                className={cn(
                  "w-full rounded-xl p-3 text-sm font-medium outline-none border-2 transition-all resize-none h-12 focus:h-24",
                  darkMode ? "bg-[#2A2A2A] border-gray-700 focus:border-[#1CB0F6]" : "bg-gray-50 border-transparent focus:border-[#1CB0F6]"
                )}
              />
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                    difficulty ? "bg-white dark:bg-gray-700 shadow-sm text-[#E91E63]" : "text-gray-500"
                  )}
                >
                  <Trophy className="w-3 h-3" />
                  {difficulty ? `${difficulty} elementos` : 'Dificultad'}
                  <ChevronDown className={cn("w-3 h-3 transition-transform", showDifficultyMenu && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {showDifficultyMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDifficultyMenu(false)} 
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-2xl z-50 w-48 overflow-hidden"
                      >
                        <div className="p-2 border-b dark:border-gray-700">
                          <p className="text-[10px] font-black uppercase text-gray-400 px-3 py-1">Número de elementos</p>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-1 grid grid-cols-2 gap-1">
                          <button
                            onClick={() => {
                              setDifficulty(null);
                              setShowDifficultyMenu(false);
                            }}
                            className="col-span-2 text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 font-bold rounded-xl"
                          >
                            Cualquiera
                          </button>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(num => (
                            <button
                              key={num}
                              onClick={() => {
                                setDifficulty(num);
                                setShowDifficultyMenu(false);
                              }}
                              className={cn(
                                "text-center px-2 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 font-bold rounded-xl transition-colors",
                                difficulty === num ? "bg-[#E91E63] text-white" : "text-gray-600 dark:text-gray-300"
                              )}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setSuggestionTarget('question')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  suggestionTarget === 'question' ? "bg-white dark:bg-gray-700 shadow-sm text-[#1CB0F6]" : "text-gray-500"
                )}
              >
                Para Pregunta
              </button>
              <button
                onClick={() => setSuggestionTarget('answer')}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                  suggestionTarget === 'answer' ? "bg-white dark:bg-gray-700 shadow-sm text-[#58CC02]" : "text-gray-500"
                )}
              >
                Para Respuesta
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_SLOTS.map((slot) => (
              <div key={slot.id} className="space-y-3">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">{slot.label}</label>
                <div className="space-y-2">
                  {/* Dropdown de usuales */}
                  <select
                    value={suggestions[slot.id]}
                    onChange={(e) => setSuggestions(prev => ({ ...prev, [slot.id]: e.target.value }))}
                    className={cn(
                      "w-full rounded-xl p-3 text-sm font-bold outline-none border-2 transition-all",
                      darkMode ? "bg-[#2A2A2A] border-gray-700 focus:border-[#1CB0F6]" : "bg-gray-50 border-transparent focus:border-[#1CB0F6]"
                    )}
                  >
                    <option value="">Seleccionar usual...</option>
                    {slot.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {/* Entrada manual */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={slot.placeholder}
                      value={suggestions[slot.id]}
                      onChange={(e) => setSuggestions(prev => ({ ...prev, [slot.id]: e.target.value }))}
                      className={cn(
                        "w-full rounded-xl p-3 text-sm font-bold outline-none border-2 transition-all",
                        darkMode ? "bg-[#2A2A2A] border-gray-700 focus:border-[#1CB0F6]" : "bg-gray-50 border-transparent focus:border-[#1CB0F6]"
                      )}
                    />
                    <Settings2 className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={() => {
                setSuggestions(INITIAL_SLOTS.reduce((acc, slot) => ({ ...acc, [slot.id]: '' }), {}));
                setGeneralSuggestion('');
                setDifficulty(null);
              }}
              className="text-gray-400 hover:text-red-500 text-sm font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Limpiar todas las sugerencias
            </button>
            
            <button
              onClick={generateQuestion}
              disabled={loading}
              className={cn(
                "w-full sm:w-auto font-bold py-4 px-10 rounded-2xl btn-shadow transition-all flex items-center justify-center gap-3",
                suggestionTarget === 'question' ? "bg-[#1CB0F6] text-white btn-shadow-blue" : "bg-[#58CC02] text-white btn-shadow-green",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {suggestionTarget === 'question' ? 'Generar Pregunta' : 'Generar Respuesta'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
