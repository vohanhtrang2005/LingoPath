import React from 'react';
import type { ExamIntent } from '../types/onboarding';
import { StepHeader } from './StepHeader';

interface StepRhythmProps {
  months: number | null;
  startDate: string;
  examIntent: ExamIntent;
  examDate: string;
  onMonthsChange: (months: number | null) => void;
  onStartDateChange: (value: string) => void;
  onExamIntentChange: (intent: ExamIntent) => void;
  onExamDateChange: (value: string) => void;
}

const dateFieldClasses =
'w-full rounded-3xl border-2 border-peach-100 bg-peach-50 px-5 py-4 font-display text-base font-semibold text-ink-900 transition-colors duration-200 ease-out focus:border-peach-400 focus:bg-white focus:outline-none';

export function StepRhythm({
  months,
  startDate,
  examIntent,
  examDate,
  onMonthsChange,
  onStartDateChange,
  onExamIntentChange,
  onExamDateChange
}: StepRhythmProps) {
  const lessonsPerWeek = months ? Math.max(2, Math.min(7, Math.round(36 / months))) : null;

  const handleMonthsInput = (raw: string) => {
    const digitsOnly = raw.replace(/[^0-9]/g, '');
    if (digitsOnly === '') {
      onMonthsChange(null);
      return;
    }
    const parsed = Number(digitsOnly);
    if (parsed < 1) {
      onMonthsChange(null);
      return;
    }
    onMonthsChange(Math.min(parsed, 120));
  };

  return (
    <div>
      <StepHeader
        step={2}
        total={3}
        title="How much time do you have?"
        subtitle="Set a rhythm you can actually keep — you can change it any time." />
      

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink-900">
          How many months feel doable?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Type any number that fits your life.
        </p>

        <div className="mt-4 rounded-5xl border-2 border-peach-100 bg-peach-50 p-6">
          <label
            htmlFor="months"
            className="block text-sm font-semibold text-ink-700">
            
            My plan should run for
          </label>
          <div className="mt-3 flex items-baseline gap-3">
            <input
              id="months"
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              step={1}
              value={months ?? ''}
              onChange={(event) => handleMonthsInput(event.target.value)}
              placeholder="6"
              aria-describedby="months-hint"
              className="w-36 rounded-4xl border-2 border-peach-200 bg-white px-6 py-3 text-center font-display text-5xl font-bold text-peach-600 shadow-soft transition-colors duration-200 ease-out placeholder:text-peach-200 focus:border-peach-400 focus:outline-none" />
            
            <span className="font-display text-2xl font-semibold text-ink-700">
              months
            </span>
          </div>
          <p id="months-hint" className="mt-4 text-sm text-ink-500">
            {lessonsPerWeek ?
            <>
                That&apos;s about{' '}
                <strong className="font-bold text-ink-900">
                  {lessonsPerWeek} lessons a week
                </strong>{' '}
                — gentle enough to keep, quick enough to feel progress.
              </> :

            'Pop in a positive number and I’ll work out your weekly rhythm.'
            }
          </p>
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-display text-base font-semibold text-ink-900">
          When shall we begin?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Starting today by default — nudge it if you&apos;d rather ease in.
        </p>
        <div className="mt-4">
          <label
            htmlFor="start-date"
            className="mb-2 block text-sm font-semibold text-ink-700">
            
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className={dateFieldClasses} />
          
        </div>
      </section>

      <section className="mt-9">
        <h2 className="font-display text-base font-semibold text-ink-900">
          Any exam on the horizon?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Optional — we&apos;ll pace the plan around it.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onExamIntentChange('none')}
            aria-pressed={examIntent === 'none'}
            className={[
            'rounded-full px-6 py-3 font-display text-base font-semibold transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-mint-200',
            examIntent === 'none' ?
            'bg-mint-400 text-white shadow-soft' :
            'bg-peach-50 text-ink-700 hover:bg-peach-100'].
            join(' ')}>
            
            No exam, just for me <span aria-hidden="true">☕</span>
          </button>
          <button
            type="button"
            onClick={() => onExamIntentChange('date')}
            aria-pressed={examIntent === 'date'}
            className={[
            'rounded-full px-6 py-3 font-display text-base font-semibold transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-300',
            examIntent === 'date' ?
            'bg-peach-500 text-white shadow-soft' :
            'bg-peach-50 text-ink-700 hover:bg-peach-100'].
            join(' ')}>
            
            Yes, I have a date <span aria-hidden="true">📅</span>
          </button>
        </div>

        {examIntent === 'date' &&
        <div className="mt-4">
            <label
            htmlFor="exam-date"
            className="mb-2 block text-sm font-semibold text-ink-700">
            
              Exam date
            </label>
            <input
            id="exam-date"
            type="date"
            min={startDate}
            value={examDate}
            onChange={(event) => onExamDateChange(event.target.value)}
            className={dateFieldClasses} />
          
          </div>
        }
      </section>
    </div>);

}