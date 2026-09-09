import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { readingQuestions } from '../data/reading';

interface ReadingSessionValue {
  answers: Record<string, string>;
  setAnswer: (questionId: string, value: string) => void;
  submitted: boolean;
  submit: () => void;
  reset: () => void;
  /** Deterministic scoring — no AI involved. */
  resultOf: (questionId: string) => boolean;
  correctCount: number;
  answeredCount: number;
  total: number;
  weakKnowledgeItemIds: string[];
}

const ReadingSessionContext = createContext<ReadingSessionValue | null>(null);

function normalise(value: string): string {
  return value.replace(/[。、\s]/g, '').toLowerCase();
}

export function ReadingSessionProvider({ children }: {children: React.ReactNode;}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const submit = useCallback(() => setSubmitted(true), []);

  const reset = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
  }, []);

  const value = useMemo<ReadingSessionValue>(() => {
    const resultOf = (questionId: string) => {
      const question = readingQuestions.find((item) => item.id === questionId);
      if (!question) return false;
      return normalise(answers[questionId] ?? '') === normalise(question.correctAnswer);
    };

    const weakKnowledgeItemIds = Array.from(
      new Set(
        readingQuestions.
        filter((question) => !resultOf(question.id)).
        flatMap((question) => question.relatedKnowledgeItemIds)
      )
    );

    return {
      answers,
      setAnswer,
      submitted,
      submit,
      reset,
      resultOf,
      correctCount: readingQuestions.filter((question) => resultOf(question.id)).length,
      answeredCount: readingQuestions.filter((question) => Boolean(answers[question.id])).length,
      total: readingQuestions.length,
      weakKnowledgeItemIds
    };
  }, [answers, submitted, setAnswer, submit, reset]);

  return <ReadingSessionContext.Provider value={value}>{children}</ReadingSessionContext.Provider>;
}

export function useReadingSession(): ReadingSessionValue {
  const context = useContext(ReadingSessionContext);
  if (!context) {
    throw new Error('useReadingSession must be used inside a ReadingSessionProvider');
  }
  return context;
}