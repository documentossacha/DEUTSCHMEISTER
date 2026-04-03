export interface QuestionPart {
  text: string;
  translation: string;
  grammaticalCategory?: string;
  audioUrl?: string;
}

export interface GermanQuestion {
  id: string;
  parts: QuestionPart[];
  fullText: string;
  translation: string;
  answerParts: QuestionPart[];
  answerFullText: string;
  answerTranslation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  context: string;
}

export interface AnswerSlot {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  image?: string;
}

export type LearningMode = 'free' | 'guided' | 'challenge';

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
  corrections?: string;
}
