export interface LanguageOption {
  id: string;
  name: string;
  native: string;
  emoji: string;
  blurb: string;
}

export interface LevelOption {
  id: string;
  emoji: string;
  label: string;
  blurb: string;
}

export interface StudyPlanDraft {
  language: string;
  level: string;
  months: number;
  startDate: string;
  hasExam: boolean;
  examDate: string;
  currentNote: string;
  weaknessNote: string;
}

export type WizardStep = 0 | 1 | 2;