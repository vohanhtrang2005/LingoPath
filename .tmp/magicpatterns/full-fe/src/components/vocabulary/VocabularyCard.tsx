import React from 'react';
import { motion } from 'framer-motion';
import { BookMarkedIcon, CheckIcon, LightbulbIcon, RefreshCwIcon } from 'lucide-react';
import type { KnowledgeItem, VocabStatus } from '../../types/vocabulary';

const EASE = [0.23, 1, 0.32, 1] as const;

interface VocabularyCardProps {
  item: KnowledgeItem;
  status: VocabStatus;
  index: number;
}

export function VocabularyCard({ item, status, index }: VocabularyCardProps) {
  const known = status === 'known';
  const practicing = status === 'practice';

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: Math.min(index, 6) * 0.04 }}
      className={`rounded-[1.75rem] p-5 transition-colors duration-200 ease-out sm:p-6 ${
      known ?
      'bg-mint-100/80 shadow-[0_14px_28px_-24px_rgba(80,120,100,0.9)]' :
      practicing ?
      'bg-peach-100/70 shadow-[0_14px_28px_-24px_rgba(233,110,63,0.8)]' :
      'bg-white/85 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)]'}`
      }>
      
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold leading-tight text-ink">{item.word}</h3>
          <p className="mt-1 text-sm font-semibold text-peach-600">{item.reading}</p>
        </div>

        {known ?
        <span className="inline-flex items-center gap-1 rounded-full bg-mint-300 px-3 py-1 font-display text-xs font-bold text-white">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            Known
          </span> :
        practicing ?
        <span className="inline-flex items-center gap-1 rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
            <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Practicing
          </span> :
        null}
      </div>

      <p className="mt-3 font-display text-[15px] font-bold text-ink">{item.meaning}</p>

      <div className="mt-4 rounded-[1.25rem] bg-white/80 px-4 py-3">
        <p className="text-[15px] font-semibold text-ink">{item.example}</p>
        <p className="mt-1 text-sm text-ink-soft">{item.exampleMeaning}</p>
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
        <LightbulbIcon className="mt-0.5 h-4 w-4 shrink-0 text-peach-400" aria-hidden="true" />
        {item.note}
      </p>

      <button
        type="button"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
        
        <BookMarkedIcon className="h-3.5 w-3.5" aria-hidden="true" />
        {item.source.label}
      </button>
    </motion.li>);

}