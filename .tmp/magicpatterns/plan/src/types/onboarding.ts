export interface LanguageOption {
  id: string;
  code: string;
  name: string;
  blurb: string;
  nativeTag: string;
}

export interface LevelOption {
  /** Stable id, e.g. "jp-n5" */
  id: string;
  /** The exam-scale label for this language, e.g. "JLPT N5" or "IELTS 6.5" */
  scale: string;
  title: string;
  blurb: string;
  emoji: string;
}

export type ExamIntent = 'none' | 'date';

export interface OnboardingAnswers {
  languageId: string | null;
  levelId: string | null;
  months: number | null;
  startDate: string;
  examIntent: ExamIntent;
  examDate: string;
  currentLevel: string;
  struggle: string;
}