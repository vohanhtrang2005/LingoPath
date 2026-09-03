import React from 'react';
import { motion } from 'framer-motion';
import { BookMarkedIcon, CheckCircle2Icon, QuoteIcon, XCircleIcon } from 'lucide-react';
import type { ReadingPracticeItem } from '../../types/reading';

const EASE = [0.23, 1, 0.32, 1] as const;

interface ResultQuestionCardProps {
  question: ReadingPracticeItem;
  number: number;
  studentAnswer: string;
  correct: boolean;
  index: number;
}

export function ResultQuestionCard({
  question,
  number,
  studentAnswer,
  correct,
  index
}: ResultQuestionCardProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: Math.min(index, 5) * 0.04 }}
      className={`rounded-[1.75rem] p-5 sm:p-6 ${
      correct ?
      'bg-mint-100/80 shadow-[0_14px_28px_-24px_rgba(80,120,100,0.9)]' :
      'bg-peach-100/70 shadow-[0_14px_28px_-24px_rgba(233,110,63,0.8)]'}`
      }>
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-white/85 px-3 py-1 font-display text-[11px] font-bold text-ink-soft">
          Question {number}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-[11px] font-bold text-white ${
          correct ? 'bg-mint-300' : 'bg-peach-500'}`
          }>
          
          {correct ?
          <CheckCircle2Icon className="h-3 w-3" aria-hidden="true" /> :

          <XCircleIcon className="h-3 w-3" aria-hidden="true" />
          }
          {correct ? 'Correct' : 'Incorrect'}
        </span>
      </div>

      <p className="mt-3 font-display text-[17px] font-bold leading-snug text-ink">
        {question.prompt}
      </p>

      <dl className="mt-4 space-y-2">
        <div className="flex flex-wrap items-baseline gap-2 rounded-[1.1rem] bg-white/80 px-4 py-2.5">
          <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Your answer</dt>
          <dd className="text-sm font-semibold text-ink">
            {studentAnswer || 'No answer given'}
          </dd>
        </div>
        {!correct ?
        <div className="flex flex-wrap items-baseline gap-2 rounded-[1.1rem] bg-white/80 px-4 py-2.5">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Correct answer
            </dt>
            <dd className="text-sm font-bold text-peach-600">{question.correctAnswer}</dd>
          </div> :
        null}
      </dl>

      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{question.explanation}</p>

      <div className="mt-3 rounded-[1.2rem] bg-white/80 px-4 py-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
          <QuoteIcon className="h-3 w-3" aria-hidden="true" />
          Evidence in the passage
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{question.passageEvidence}</p>
      </div>

      <div className="mt-2.5 rounded-[1.2rem] bg-white/80 px-4 py-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
          <BookMarkedIcon className="h-3 w-3" aria-hidden="true" />
          Source · {question.sourceReference}
        </p>
        <p className="mt-1.5 text-sm italic leading-relaxed text-ink-soft">
          “{question.evidenceText}”
        </p>
      </div>

      {question.relatedKnowledgeItemIds.length > 0 ?
      <div className="mt-3 flex flex-wrap gap-2">
          {question.relatedKnowledgeItemIds.map((id) =>
        <span
          key={id}
          className="rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold text-ink-soft">
          
              KnowledgeItem · {id}
            </span>
        )}
        </div> :
      null}
    </motion.li>);

}