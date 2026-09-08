import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheckIcon, CalendarHeartIcon } from 'lucide-react';
import type { StudyPlanDraft } from '../../types/plan';

const EASE = [0.23, 1, 0.32, 1] as const;

interface StepScheduleProps {
  draft: StudyPlanDraft;
  onChange: <K extends keyof StudyPlanDraft>(key: K, value: StudyPlanDraft[K]) => void;
}

export function StepSchedule({ draft, onChange }: StepScheduleProps) {
  const weeklyPace = draft.months > 0 ? Math.max(2, Math.round(72 / draft.months)) : 0;

  const handleMonths = (raw: string) => {
    const digitsOnly = raw.replace(/[^\d]/g, '');
    if (digitsOnly === '') {
      onChange('months', 0);
      return;
    }
    onChange('months', Math.min(120, Math.max(1, Number(digitsOnly))));
  };

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-display text-base font-bold text-ink">
          How many months feel doable?
        </legend>
        <p className="mt-1 text-sm text-ink-soft">
          Type any number that fits your life — you can change it later.
        </p>

        <div className="gk-well mt-4 flex items-center gap-4 rounded-[2rem] bg-cream-100/90 px-6 py-5">
          <input
            id="months-input"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            step={1}
            value={draft.months === 0 ? '' : draft.months}
            onChange={(event) => handleMonths(event.target.value)}
            placeholder="5"
            aria-label="Number of months"
            className="w-28 bg-transparent text-center font-display text-5xl font-bold text-peach-600 outline-none placeholder:text-peach-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
          
          <span className="font-display text-2xl font-bold text-ink-soft">months</span>
        </div>

        <p className="mt-3 text-sm text-ink-soft">
          {draft.months > 0 ?
          <>
              That&apos;s about <span className="font-bold text-ink">{weeklyPace} lessons a week</span>{' '}
              — gentle enough to keep, quick enough to feel progress.
            </> :

          "Pop in a number above and we'll do the maths ✨"
          }
        </p>
      </fieldset>

      <fieldset>
        <legend className="font-display text-base font-bold text-ink">
          When does your path begin?
        </legend>

        <div className="mt-4">
          <label
            htmlFor="start-date"
            className="mb-1.5 block font-display text-sm font-semibold text-ink">
            
            Start date
          </label>
          <div className="gk-well flex items-center gap-3 rounded-4xl bg-cream-100/90 px-4 py-3">
            <CalendarCheckIcon className="h-5 w-5 shrink-0 text-mint-400" aria-hidden="true" />
            <input
              id="start-date"
              type="date"
              value={draft.startDate}
              onChange={(event) => onChange('startDate', event.target.value)}
              className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none" />
            
          </div>
          <p className="mt-1.5 pl-2 text-xs font-semibold text-ink-faint">Defaults to today.</p>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-base font-bold text-ink">
          Any exam on the horizon?
        </legend>
        <p className="mt-1 text-sm text-ink-soft">Optional — we&apos;ll pace the plan around it.</p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button
            type="button"
            aria-pressed={!draft.hasExam}
            onClick={() => {
              onChange('hasExam', false);
              onChange('examDate', '');
            }}
            className={`rounded-full px-5 py-2.5 font-display text-sm font-bold transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            !draft.hasExam ?
            'bg-mint-300 text-white' :
            'gk-well bg-cream-100/90 text-ink hover:bg-white'}`
            }>
            
            No exam, just for me 🍵
          </button>
          <button
            type="button"
            aria-pressed={draft.hasExam}
            onClick={() => onChange('hasExam', true)}
            className={`rounded-full px-5 py-2.5 font-display text-sm font-bold transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            draft.hasExam ?
            'bg-peach-500 text-white' :
            'gk-well bg-cream-100/90 text-ink hover:bg-white'}`
            }>
            
            Yes, I have a date 📅
          </button>
        </div>

        {draft.hasExam ?
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="mt-4">
          
            <label
            htmlFor="exam-date"
            className="mb-1.5 block font-display text-sm font-semibold text-ink">
            
              Exam date
            </label>
            <div className="gk-well flex items-center gap-3 rounded-4xl bg-cream-100/90 px-4 py-3">
              <CalendarHeartIcon className="h-5 w-5 shrink-0 text-peach-500" aria-hidden="true" />
              <input
              id="exam-date"
              type="date"
              min={draft.startDate || undefined}
              value={draft.examDate}
              onChange={(event) => onChange('examDate', event.target.value)}
              className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none" />
            
            </div>
          </motion.div> :
        null}
      </fieldset>
    </div>);

}