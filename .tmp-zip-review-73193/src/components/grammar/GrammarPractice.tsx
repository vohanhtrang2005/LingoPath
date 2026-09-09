import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, SparklesIcon } from 'lucide-react';
import { GrammarPracticeQuestion } from './GrammarPracticeQuestion';
import { grammarItems } from '../../data/grammar';
import { grammarPracticeItems } from '../../data/grammarPractice';
import { useGrammarProgress } from '../../contexts/GrammarProgressContext';
import type { GrammarPracticeItem } from '../../types/grammar';

const EASE = [0.23, 1, 0.32, 1] as const;

export function GrammarPractice() {
  const { recordPractice, weakItemIds } = useGrammarProgress();
  const [results, setResults] = useState<Record<string, boolean>>({});

  const handleAnswered = (item: GrammarPracticeItem, correct: boolean) => {
    setResults((prev) => ({ ...prev, [item.id]: correct }));
    recordPractice(item.relatedKnowledgeItemIds, correct);
  };

  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const total = grammarPracticeItems.length;
  const done = answered === total;
  const weakPatterns = grammarItems.filter((item) => weakItemIds.includes(item.id));

  return (
    <section aria-labelledby="grammar-practice-title" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="grammar-practice-title" className="font-display text-xl font-bold text-ink">
            Grammar practice from your book
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-soft">
            Part of today&apos;s lesson. Answers are checked against the approved records, and your
            progress and review schedule update from the results.
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
        {grammarPracticeItems.map((item, index) =>
        <GrammarPracticeQuestion
          key={item.id}
          item={item}
          index={index}
          onAnswered={handleAnswered} />

        )}
      </ul>

      {done ?
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: EASE }}
        className="mt-5 rounded-[1.75rem] bg-mint-100/85 px-6 py-5">
        
          <p className="flex items-center gap-2 font-display text-sm font-bold text-[#2f6a4f]">
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            Practice complete — {correct} of {total} correct. Review schedule updated
            automatically.
          </p>

          {weakPatterns.length > 0 ?
        <div className="mt-3">
              <p className="text-sm font-semibold text-[#38795c]">
                We&apos;ll bring these back sooner:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weakPatterns.map((pattern) =>
            <a
              key={pattern.id}
              href={`#grammar-${pattern.id}`}
              className="rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-ink transition-colors duration-150 ease-out hover:text-peach-600">
              
                    {pattern.pattern} — review explanation
                  </a>
            )}
              </div>
            </div> :

        <p className="mt-2 text-sm text-[#38795c]">
              No weak patterns detected in this round — nicely done.
            </p>
        }
        </motion.div> :
      null}
    </section>);

}