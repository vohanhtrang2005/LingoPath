export type LessonType = 'Vocabulary' | 'Grammar' | 'Listening' | 'Reading' | 'Kanji';

export type LessonStatus = 'complete' | 'today' | 'upcoming';

export interface Lesson {
  id: string;
  day: number;
  title: string;
  subtitle: string;
  type: LessonType;
  minutes: number;
  items: number;
  xp: number;
  status: LessonStatus;
  /** Score in percent, only for completed lessons. */
  score?: number;
  /** When an upcoming lesson unlocks, e.g. "Opens tomorrow". */
  unlocksAt?: string;
}

export type SectionStatus = 'done' | 'in-progress' | 'todo';

export interface DailySection {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  minutes: number;
  status: SectionStatus;
  /** Completion percent, only for the in-progress section. */
  progress?: number;
  /** When set, the section only appears for this language. */
  onlyForLanguage?: string;
}

export interface StreakDay {
  label: string;
  done: boolean;
  today?: boolean;
}
