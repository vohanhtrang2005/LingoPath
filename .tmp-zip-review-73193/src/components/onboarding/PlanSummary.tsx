import React from 'react';
import { motion } from 'framer-motion';
import { addMonths, format, parseISO } from 'date-fns';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { languageOptions, levelsByLanguage } from '../../data/onboardingOptions';
import type { StudyPlanDraft } from '../../types/plan';

const EASE = [0.23, 1, 0.32, 1] as const;

interface PlanSummaryProps {
  draft: StudyPlanDraft;
  onEdit: () => void;
  onConfirm: () => void;
}

function prettyDate(iso: string): string {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), 'd MMM yyyy');
  } catch {
    return iso;
  }
}

export function PlanSummary({ draft, onEdit, onConfirm }: PlanSummaryProps) {
  const language = languageOptions.find((option) => option.id === draft.language);
  const level = (levelsByLanguage[draft.language] ?? []).find((item) => item.id === draft.level);

  const finish = draft.startDate ?
  format(addMonths(parseISO(draft.startDate), draft.months), 'd MMM yyyy') :
  '—';

  const rows: {label: string;value: string;}[] = [
  { label: 'Language', value: language ? language.name : '—' },
  { label: 'Target level', value: level ? level.label : '—' },
  { label: 'Duration', value: `${draft.months} months` },
  { label: 'Start date', value: prettyDate(draft.startDate) },
  { label: 'Wrapping up', value: finish },
  {
    label: 'Exam',
    value: draft.hasExam ? prettyDate(draft.examDate) : 'No exam, just for me'
  }];


  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="text-center">
      
      <span
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-peach-100 text-3xl"
        aria-hidden="true">
        
        🎉
      </span>

      <h1 className="mt-4 font-display text-[1.85rem] font-bold text-ink sm:text-[2.15rem]">
        Your path is ready
      </h1>
      <p className="mt-2 text-[15px] text-ink-soft">
        Here&apos;s the plan we&apos;ll build your daily lessons around.
      </p>

      <dl className="mt-7 overflow-hidden rounded-[1.75rem] bg-cream-100/80 text-left">
        {rows.map((row, index) =>
        <div
          key={row.label}
          className={`flex items-center justify-between gap-4 px-5 py-4 ${
          index > 0 ? 'border-t border-white/90' : ''}`
          }>
          
            <dt className="text-sm font-semibold text-ink-soft">{row.label}</dt>
            <dd className="text-right font-display text-sm font-bold text-ink">{row.value}</dd>
          </div>
        )}
      </dl>

      {draft.weaknessNote ?
      <p className="mt-4 rounded-[1.5rem] bg-mint-100/80 px-5 py-4 text-left text-sm leading-relaxed text-[#38795c]">
          We&apos;ll weight your lessons toward: <span className="font-bold">{draft.weaknessNote}</span>
        </p> :
      null}

      <div className="mt-8 flex flex-col-reverse items-center gap-3 border-t border-cream-200 pt-6 sm:flex-row">
        <motion.button
          type="button"
          onClick={onEdit}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 620, damping: 20 }}
          className="gk-well flex w-full items-center justify-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 sm:w-auto">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to edit
        </motion.button>

        <motion.button
          type="button"
          onClick={onConfirm}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 620, damping: 18 }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-peach-500 px-7 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 sm:ml-auto sm:w-auto">
          
          Let&apos;s Learn!
          <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </div>
    </motion.div>);

}