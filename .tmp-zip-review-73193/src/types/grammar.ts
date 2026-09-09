export type LevelSystem = 'JLPT' | 'CEFR' | 'HSK' | 'TOPIK';

export interface SourceReference {
  label: string;
  evidenceText: string;
}

export interface GrammarExample {
  sentence: string;
  reading?: string;
  translation: string;
  note?: string;
}

export interface CommonMistake {
  wrong: string;
  right: string;
  why: string;
}

/** A lower-level point appearing inside a target-level example. */
export interface SupportNote {
  term: string;
  levelCode: string;
  explanation: string;
}

/** Maps to KnowledgeItem (type = GRAMMAR); contentJson is flattened here. */
export interface GrammarKnowledgeItem {
  id: string;
  language: string;
  levelSystem: LevelSystem;
  levelCode: string;
  type: 'GRAMMAR';
  status: 'APPROVED' | 'DRAFT';
  orderIndex: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  pattern: string;
  reading?: string;
  meaning: string;
  formation: string;
  explanation: string;
  examples: GrammarExample[];
  usageNotes: string[];
  commonMistakes: CommonMistake[];
  relatedVocabulary: {word: string;reading?: string;meaning: string;}[];
  supportNotes: SupportNote[];
  sourceReferences: SourceReference[];
}

export type GrammarPracticeType =
'pattern-choice' |
'meaning-choice' |
'fill-blank' |
'reorder' |
'usage-choice' |
'transform';

/** Maps to PracticeItem for grammar. */
export interface GrammarPracticeItem {
  id: string;
  practiceType: GrammarPracticeType;
  prompt: string;
  targetPattern: string;
  choices?: string[];
  /** Shuffled tokens for `reorder` questions. */
  tokens?: string[];
  correctAnswer: string;
  explanation: string;
  wrongChoiceExplanations?: Record<string, string>;
  relatedKnowledgeItemIds: string[];
  sourceReference: string;
  evidenceText: string;
}

export type ProgressStatus = 'new' | 'learning' | 'needs-review' | 'mastered';

/** Maps to LearningProgress. */
export interface LearningProgress {
  knowledgeItemId: string;
  status: ProgressStatus;
  exposureCount: number;
  practiceAttemptCount: number;
  correctCount: number;
  wrongCount: number;
  masteryScore: number;
}

export interface GrammarLessonMeta {
  dailyLessonId: string;
  dayIndex: number;
  lessonDate: string;
  sectionId: string;
  sectionTitle: string;
  language: string;
  levelSystem: LevelSystem;
  levelCode: string;
}