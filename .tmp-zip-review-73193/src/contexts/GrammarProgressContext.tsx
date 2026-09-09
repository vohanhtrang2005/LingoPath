import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { LearningProgress, ProgressStatus } from '../types/grammar';

function nextStatus(correct: number, attempts: number): ProgressStatus {
  if (attempts === 0) return 'new';
  const score = correct / attempts;
  if (score >= 0.8) return 'mastered';
  if (score >= 0.5) return 'learning';
  return 'needs-review';
}

interface GrammarProgressValue {
  progress: Record<string, LearningProgress>;
  progressOf: (knowledgeItemId: string) => LearningProgress;
  /** Deterministic checking happens in the UI; this records the outcome. */
  recordPractice: (knowledgeItemIds: string[], correct: boolean) => void;
  masteredCount: number;
  weakItemIds: string[];
}

const GrammarProgressContext = createContext<GrammarProgressValue | null>(null);

function emptyProgress(id: string): LearningProgress {
  return {
    knowledgeItemId: id,
    status: 'new',
    exposureCount: 0,
    practiceAttemptCount: 0,
    correctCount: 0,
    wrongCount: 0,
    masteryScore: 0
  };
}

export function GrammarProgressProvider({ children }: {children: React.ReactNode;}) {
  const [progress, setProgress] = useState<Record<string, LearningProgress>>({});

  const recordPractice = useCallback((knowledgeItemIds: string[], correct: boolean) => {
    setProgress((prev) => {
      const next = { ...prev };
      knowledgeItemIds.forEach((id) => {
        const current = next[id] ?? emptyProgress(id);
        const practiceAttemptCount = current.practiceAttemptCount + 1;
        const correctCount = current.correctCount + (correct ? 1 : 0);
        const wrongCount = current.wrongCount + (correct ? 0 : 1);
        next[id] = {
          ...current,
          exposureCount: current.exposureCount + 1,
          practiceAttemptCount,
          correctCount,
          wrongCount,
          masteryScore: Math.round(correctCount / practiceAttemptCount * 100),
          status: nextStatus(correctCount, practiceAttemptCount)
        };
      });
      return next;
    });
  }, []);

  const value = useMemo<GrammarProgressValue>(() => {
    const records = Object.values(progress);
    return {
      progress,
      progressOf: (id) => progress[id] ?? emptyProgress(id),
      recordPractice,
      masteredCount: records.filter((record) => record.status === 'mastered').length,
      weakItemIds: records.
      filter((record) => record.status === 'needs-review').
      map((record) => record.knowledgeItemId)
    };
  }, [progress, recordPractice]);

  return <GrammarProgressContext.Provider value={value}>{children}</GrammarProgressContext.Provider>;
}

export function useGrammarProgress(): GrammarProgressValue {
  const context = useContext(GrammarProgressContext);
  if (!context) {
    throw new Error('useGrammarProgress must be used inside a GrammarProgressProvider');
  }
  return context;
}