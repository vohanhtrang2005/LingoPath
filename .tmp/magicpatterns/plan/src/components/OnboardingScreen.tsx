import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, WandSparklesIcon } from 'lucide-react';
import type { ExamIntent, OnboardingAnswers } from '../types/onboarding';
import { todayISO } from '../utils/date';
import { StepLanguage } from './StepLanguage';
import { StepRhythm } from './StepRhythm';
import { StepAbout } from './StepAbout';
import { PlanReady } from './PlanReady';

const TOTAL_STEPS = 3;

export function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    languageId: null,
    levelId: null,
    months: 6,
    startDate: todayISO(),
    examIntent: 'none',
    examDate: '',
    currentLevel: '',
    struggle: ''
  });

  const update = <K extends keyof OnboardingAnswers,>(
  key: K,
  value: OnboardingAnswers[K]) =>
  setAnswers((prev) => ({ ...prev, [key]: value }));

  /** Changing the language invalidates any level chosen from the old scale. */
  const handleLanguageChange = (languageId: string) =>
  setAnswers((prev) => ({
    ...prev,
    languageId,
    levelId: prev.languageId === languageId ? prev.levelId : null
  }));

  const handleExamIntentChange = (intent: ExamIntent) =>
  setAnswers((prev) => ({
    ...prev,
    examIntent: intent,
    examDate: intent === 'none' ? '' : prev.examDate
  }));

  const { canContinue, hint } = useMemo(() => {
    if (step === 1) {
      if (!answers.languageId) return { canContinue: false, hint: 'Pick a language to begin ✨' };
      if (!answers.levelId)
      return { canContinue: false, hint: 'Now choose where you want to arrive ✨' };
      return { canContinue: true, hint: '' };
    }
    if (step === 2) {
      if (!answers.months || answers.months < 1)
      return { canContinue: false, hint: 'How many months feel doable? ✨' };
      if (!answers.startDate)
      return { canContinue: false, hint: 'Pick a start date ✨' };
      if (answers.examIntent === 'date' && !answers.examDate)
      return { canContinue: false, hint: 'Add your exam date ✨' };
      return { canContinue: true, hint: '' };
    }
    return { canContinue: true, hint: '' };
  }, [step, answers]);

  const goNext = () => {
    if (!canContinue) return;
    if (step === TOTAL_STEPS) {
      setSubmitted(true);
      return;
    }
    setStep((current) => current + 1);
  };

  const restart = () => {
    setSubmitted(false);
    setStep(1);
    setAnswers({
      languageId: null,
      levelId: null,
      months: 6,
      startDate: todayISO(),
      examIntent: 'none',
      examDate: '',
      currentLevel: '',
      struggle: ''
    });
  };

  return (
    <div className="w-full rounded-[2.5rem] bg-[#FFFCF8] p-6 shadow-card sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={submitted ? 'done' : step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
          {submitted ?
          <PlanReady answers={answers} onRestart={restart} /> :

          <>
              {step === 1 &&
            <StepLanguage
              languageId={answers.languageId}
              levelId={answers.levelId}
              onLanguageChange={handleLanguageChange}
              onLevelChange={(levelId) => update('levelId', levelId)} />

            }
              {step === 2 &&
            <StepRhythm
              months={answers.months}
              startDate={answers.startDate}
              examIntent={answers.examIntent}
              examDate={answers.examDate}
              onMonthsChange={(months) => update('months', months)}
              onStartDateChange={(value) => update('startDate', value)}
              onExamIntentChange={handleExamIntentChange}
              onExamDateChange={(value) => update('examDate', value)} />

            }
              {step === 3 &&
            <StepAbout
              currentLevel={answers.currentLevel}
              struggle={answers.struggle}
              onCurrentLevelChange={(value) => update('currentLevel', value)}
              onStruggleChange={(value) => update('struggle', value)} />

            }

              <footer className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t-2 border-peach-100 pt-6">
                {step === 1 ?
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="text-sm font-semibold text-ink-400 transition-colors duration-200 ease-out hover:text-ink-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                    Skip for now
                  </button> :

              <button
                type="button"
                onClick={() => setStep((current) => current - 1)}
                className="inline-flex items-center gap-2 rounded-full bg-peach-50 px-5 py-3 font-display text-base font-semibold text-ink-700 transition-[background-color,transform] duration-200 ease-out hover:bg-peach-100 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                    <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
              }

                <div className="flex items-center gap-4">
                  {hint &&
                <span className="text-sm font-semibold text-ink-400">
                      {hint}
                    </span>
                }
                  <button
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue}
                  className={[
                  'inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-display text-base font-semibold text-white transition-[background-color,transform,opacity] duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-300',
                  canContinue ?
                  'bg-peach-500 shadow-soft hover:bg-peach-600 active:scale-[0.97]' :
                  'cursor-not-allowed bg-peach-300'].
                  join(' ')}>
                  
                    {step === TOTAL_STEPS ?
                  <>
                        <WandSparklesIcon className="h-4 w-4" aria-hidden="true" />
                        Generate My Plan
                      </> :

                  <>
                        Next
                        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                      </>
                  }
                  </button>
                </div>
              </footer>
            </>
          }
        </motion.div>
      </AnimatePresence>
    </div>);

}