import { useCallback, useMemo, useState } from 'react';
import type { StudyPlanDraft, WizardStep } from '../types/plan';

export const STEP_TITLES = [
'What are we learning?',
'How much time do you have?',
'Tell me about you'] as
const;

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

const INITIAL_DRAFT: StudyPlanDraft = {
  language: '',
  level: '',
  months: 6,
  startDate: todayISO(),
  hasExam: false,
  examDate: '',
  currentNote: '',
  weaknessNote: ''
};

function mapLanguage(language: string) {
  if (language === 'ja') return { targetLanguage: 'JAPANESE', targetLevelSystem: 'JLPT' };
  if (language === 'en') return { targetLanguage: 'ENGLISH', targetLevelSystem: 'CEFR' };
  return { targetLanguage: language.toUpperCase(), targetLevelSystem: 'CUSTOM' };
}

function mapLevelCode(level: string) {
  if (level.startsWith('n')) return level.toUpperCase();
  if (level === 'b1') return 'B1';
  return level.toUpperCase();
}

async function createStudyPlan(draft: StudyPlanDraft) {
  const token = localStorage.getItem('accessToken');
  const { targetLanguage, targetLevelSystem } = mapLanguage(draft.language);

  const response = await fetch('/api/learning/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({
      targetLanguage,
      targetLevelSystem,
      targetLevelCode: mapLevelCode(draft.level),
      durationMonths: draft.months,
      startDate: draft.startDate,
      examDate: draft.hasExam ? draft.examDate : null,
      currentLevelNote: draft.currentNote,
      weaknessNote: draft.weaknessNote
    })
  });

  if (!response.ok) {
    throw new Error('Could not create study plan.');
  }

  return response.json();
}

export function useStudyPlanWizard() {
  const [step, setStep] = useState<WizardStep>(0);
  const [draft, setDraft] = useState<StudyPlanDraft>(INITIAL_DRAFT);
  const [generating, setGenerating] = useState(false);
  const [planReady, setPlanReady] = useState(false);

  const update = useCallback(<K extends keyof StudyPlanDraft,>(key: K, value: StudyPlanDraft[K]) => {
    setDraft((prev) => {
      // Levels belong to a language, so switching language clears the level.
      if (key === 'language' && value !== prev.language) {
        return { ...prev, language: value as string, level: '' };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const canContinue = useMemo(() => {
    if (step === 0) return Boolean(draft.language && draft.level);
    if (step === 1) {
      return draft.months > 0 && Boolean(draft.startDate) && (!draft.hasExam || Boolean(draft.examDate));
    }
    return true;
  }, [draft, step]);

  const next = useCallback(() => {
    setStep((prev) => prev < 2 ? prev + 1 as WizardStep : prev);
  }, []);

  const back = useCallback(() => {
    setStep((prev) => prev > 0 ? prev - 1 as WizardStep : prev);
  }, []);

  /** Builds the plan, then reveals the summary so the learner can confirm or edit. */
  const generate = useCallback(async () => {
    setGenerating(true);
    try {
      await createStudyPlan(draft);
      setGenerating(false);
      setPlanReady(true);
    } catch {
      setGenerating(false);
    }
  }, [draft]);

  const editPlan = useCallback(() => {
    setPlanReady(false);
    setStep(0);
  }, []);

  const progress = (step + 1) / 3 * 100;

  return {
    step,
    draft,
    update,
    canContinue,
    next,
    back,
    generate,
    generating,
    planReady,
    editPlan,
    progress
  };
}
