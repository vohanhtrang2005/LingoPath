export type LessonType = 'Vocabulary' | 'Grammar' | 'Listening' | 'Kanji';

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

export interface StreakDay {
  label: string;
  done: boolean;
  today?: boolean;
}