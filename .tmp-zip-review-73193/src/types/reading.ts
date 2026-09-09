import type { SourceReference, SupportNote } from './grammar';

export type ReadingQuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

/** Maps to KnowledgeItem (type = READING). */
export interface ReadingKnowledgeItem {
  id: string;
  type: 'READING';
  title: string;
  passageText: string;
  translation?: string;
  topic: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  orderIndex: number;
  sourceReferences: SourceReference[];
}

/** Maps to PracticeItem for reading questions. */
export interface ReadingPracticeItem {
  id: string;
  passageId: string;
  practiceType: ReadingQuestionType;
  prompt: string;
  choices?: string[];
  correctAnswer: string;
  explanation: string;
  /** The exact line in the passage that proves the answer. */
  passageEvidence: string;
  relatedKnowledgeItemIds: string[];
  sourceReference: string;
  evidenceText: string;
}

/** Revealed only after submission. */
export interface PostReadingExplanation {
  passageId: string;
  importantVocabulary: {
    knowledgeItemId: string;
    word: string;
    reading?: string;
    meaning: string;
  }[];
  importantGrammar: {
    knowledgeItemId: string;
    pattern: string;
    meaning: string;
  }[];
  supportExplanations: SupportNote[];
  relatedKnowledgeItemIds: string[];
  evidenceText: string;
}

export interface ReadingSectionMeta {
  id: string;
  type: 'READING';
  title: string;
  orderIndex: number;
  dayIndex: number;
  language: string;
  levelSystem: string;
  levelCode: string;
}