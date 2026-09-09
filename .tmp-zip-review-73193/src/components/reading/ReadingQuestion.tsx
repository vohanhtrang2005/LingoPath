import React from 'react';
import { motion } from 'framer-motion';
import type { ReadingPracticeItem } from '../../types/reading';

interface ReadingQuestionProps {
  question: ReadingPracticeItem;
  number: number;
  answer: string;
  onAnswer: (value: string) => void;
}

export function ReadingQuestion({ question, number, answer, onAnswer }: ReadingQuestionProps) {
  const answered = Boolean(answer);

  return (
    <li className="rounded-[1.75rem] bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cream-100 px-3 py-1 font-display text-[11px] font-bold text-ink-soft">
          Question {number}
        </span>
        {answered ?
        <span className="rounded-full bg-mint-100 px-3 py-1 font-display text-[11px] font-bold text-[#38795c]">
            Answered
          </span> :

        <span className="rounded-full bg-peach-100 px-3 py-1 font-display text-[11px] font-bold text-[#a1552c]">
            Not answered yet
          </span>
        }
      </div>

      <p className="mt-3 font-display text-[17px] font-bold leading-snug text-ink">
        {question.prompt}
      </p>

      {question.practiceType === 'short-answer' ?
      <input
        type="text"
        value={answer}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder="Type your answer…"
        aria-label={`Answer for question ${number}`}
        className="gk-well mt-4 w-full rounded-4xl bg-cream-100/90 px-5 py-3.5 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" /> :


      <div
        className={`mt-4 grid gap-2.5 ${
        question.practiceType === 'true-false' ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`
        }>
        
          {(question.choices ?? []).map((choice) => {
          const picked = answer === choice;
          return (
            <motion.button
              key={choice}
              type="button"
              onClick={() => onAnswer(choice)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22, duration: 0.2 }}
              aria-pressed={picked}
              className={`rounded-[1.4rem] px-4 py-3 text-left font-display text-sm font-bold transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
              picked ?
              'bg-peach-100 text-ink ring-2 ring-peach-300' :
              'gk-well bg-cream-100/90 text-ink hover:bg-white'}`
              }>
              
                {choice}
              </motion.button>);

        })}
        </div>
      }
    </li>);

}