import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { PracticeQuestion } from './PracticeQuestion';
import { vocabularyPracticeItems } from '../../data/vocabularyPractice';
import { useVocabularyProgress } from '../../contexts/VocabularyProgressContext';
import type { VocabularyPracticeItem } from '../../types/vocabulary';

const EASE = [0.23, 1, 0.32, 1] as const;

export function VocabularyPractice() {
  const { recordPractice } = useVocabularyProgress();
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleAnswered = (item: VocabularyPracticeItem, correct: boolean) => {
    setResults((prev) => ({ ...prev, [item.id]: correct }));
    recordPractice(item.relatedKnowledgeItemIds, correct);
  };

  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const total = vocabularyPracticeItems.length;
  const done = answered === total;

  return (
    <section aria-labelledby="practice-title" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="practice-title" className="font-display text-xl font-bold text-ink">
            Practice from your book
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            Part of today&apos;s lesson — your progress and review schedule update from these
            answers.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3.5 py-2 text-xs font-bold text-[#38795c]">
          <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
          Source-backed items
        </span>
      </div>

      <div className="mt-4 rounded-[1.5rem] bg-white/70 px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-sm font-bold text-ink">
            {answered} of {total} answered
          </p>
          <p className="text-xs font-semibold text-ink-soft">{correct} correct</p>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
          <motion.div
            initial={false}
            animate={{ width: `${answered / total * 100}%` }}
            transition={{ duration: 0.3, ease: EASE }}
            className="h-full rounded-full bg-peach-400" />
          
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {vocabularyPracticeItems.map((item, index) =>
        <PracticeQuestion
          key={item.id}
          item={item}
          index={index}
          onAnswered={handleAnswered} />

        )}
      </ul>

      {done ?
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: EASE }}
        className="mt-5 flex items-center justify-center gap-2 rounded-[1.5rem] bg-mint-100/85 px-5 py-4 text-center text-sm font-bold text-[#2f6a4f]">
        
          <SparklesIcon className="h-4 w-4" aria-hidden="true" />
          Practice complete — {correct}/{total} correct. Review schedule updated automatically.
        </motion.p> :
      null}
    </section>);

}