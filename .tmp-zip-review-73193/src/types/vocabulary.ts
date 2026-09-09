/** Study status of a single knowledge item, updated as the learner studies. */
export type VocabStatus = 'new' | 'known' | 'practice';

/**
 * Shape mirrors the future KnowledgeItem API payload, so the mock data
 * in `data/vocabulary.ts` can be swapped for a fetch without touching the UI.
 */
export interface KnowledgeItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  note: string;
  source: {
    label: string;
    url?: string;
  };
}

export type PracticeType = 'meaning' | 'word-in-sentence' | 'fill-blank' | 'match' | 'reading';

/** Mirrors the backend PracticeItem record: approved, source-backed questions. */
export interface VocabularyPracticeItem {
  id: string;
  practiceType: PracticeType;
  prompt: string;
  choices?: string[];
  /** Left/right pairs for `match` questions. */
  pairs?: {left: string;right: string;}[];
  correctAnswer: string;
  explanation: string;
  relatedKnowledgeItemIds: string[];
  sourceReference: string;
  evidenceText: string;
}

export interface VocabularyLessonMeta {
  day: number;
  level: string;
  title: string;
  section: string;
}