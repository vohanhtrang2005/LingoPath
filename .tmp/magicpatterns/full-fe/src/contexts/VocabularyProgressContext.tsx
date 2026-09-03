import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { VocabStatus } from '../types/vocabulary';

interface VocabularyProgressValue {
  statuses: Record<string, VocabStatus>;
  statusOf: (id: string) => VocabStatus;
  markKnown: (id: string) => void;
  markPractice: (id: string) => void;
  /** Practice results drive LearningProgress / ReviewSchedule automatically. */
  recordPractice: (ids: string[], correct: boolean) => void;
  knownCount: number;
  practiceCount: number;
}

const VocabularyProgressContext = createContext<VocabularyProgressValue | null>(null);

export function VocabularyProgressProvider({ children }: {children: React.ReactNode;}) {
  const [statuses, setStatuses] = useState<Record<string, VocabStatus>>({});

  const markKnown = useCallback((id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'known' }));
  }, []);

  const markPractice = useCallback((id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'practice' }));
  }, []);

  const recordPractice = useCallback((ids: string[], correct: boolean) => {
    setStatuses((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = correct ? 'known' : 'practice';
      });
      return next;
    });
  }, []);

  const value = useMemo<VocabularyProgressValue>(() => {
    const entries = Object.values(statuses);
    return {
      statuses,
      statusOf: (id) => statuses[id] ?? 'new',
      markKnown,
      markPractice,
      recordPractice,
      knownCount: entries.filter((status) => status === 'known').length,
      practiceCount: entries.filter((status) => status === 'practice').length
    };
  }, [statuses, markKnown, markPractice, recordPractice]);

  return (
    <VocabularyProgressContext.Provider value={value}>
      {children}
    </VocabularyProgressContext.Provider>);

}

export function useVocabularyProgress(): VocabularyProgressValue {
  const context = useContext(VocabularyProgressContext);
  if (!context) {
    throw new Error('useVocabularyProgress must be used inside a VocabularyProgressProvider');
  }
  return context;
}