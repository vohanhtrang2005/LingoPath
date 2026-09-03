import React from 'react';
import { SparklesIcon } from 'lucide-react';
import { languages, levelsByLanguage } from '../data/languages';
import type { OnboardingAnswers } from '../types/onboarding';
import { finishDate, formatFriendly } from '../utils/date';

interface PlanReadyProps {
  answers: OnboardingAnswers;
  onRestart: () => void;
}

export function PlanReady({ answers, onRestart }: PlanReadyProps) {
  const language = languages.find((item) => item.id === answers.languageId);
  const level = answers.languageId ?
  (levelsByLanguage[answers.languageId] ?? []).find(
    (item) => item.id === answers.levelId
  ) :
  undefined;

  const rows: {label: string;value: string;}[] = [
  { label: 'Language', value: language?.name ?? 'Not set' },
  { label: 'Target level', value: level ? level.scale : 'Not set' },
  {
    label: 'Duration',
    value: answers.months ? `${answers.months} months` : 'Not set'
  },
  { label: 'Start date', value: formatFriendly(answers.startDate) },
  {
    label: 'Wrapping up',
    value:
    answers.months && answers.startDate ?
    finishDate(answers.startDate, answers.months) :
    '—'
  },
  {
    label: 'Exam',
    value:
    answers.examIntent === 'date' && answers.examDate ?
    formatFriendly(answers.examDate) :
    'No exam, just for me'
  }];


  return (
    <div className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-peach-100 text-3xl">
        <span aria-hidden="true">🎉</span>
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold text-ink-900">
        Your path is ready
      </h1>
      <p className="mt-2 text-sm text-ink-500">
        Here&apos;s the plan I&apos;ll build your daily lessons around.
      </p>

      <dl className="mt-7 divide-y-2 divide-peach-100 overflow-hidden rounded-4xl border-2 border-peach-100 bg-peach-50 text-left">
        {rows.map((row) =>
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 px-5 py-4">
          
            <dt className="text-sm font-semibold text-ink-500">{row.label}</dt>
            <dd className="font-display text-base font-semibold text-ink-900">
              {row.value}
            </dd>
          </div>
        )}
      </dl>

      <button
        type="button"
        onClick={onRestart}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-peach-500 px-7 py-3.5 font-display text-base font-semibold text-white shadow-soft transition-[background-color,transform] duration-200 ease-out hover:bg-peach-600 active:scale-[0.97] focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-300">
        
        <SparklesIcon className="h-4 w-4" aria-hidden="true" />
        Start over
      </button>
    </div>);

}