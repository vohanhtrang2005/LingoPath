import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

interface ChoiceCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  meta?: string;
  selected: boolean;
  onSelect: () => void;
}

export function ChoiceCard({ emoji, title, subtitle, meta, selected, onSelect }: ChoiceCardProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 600, damping: 22 }}
      className={`relative w-full rounded-[1.75rem] p-5 text-left transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
      selected ?
      'bg-peach-100 shadow-[0_18px_32px_-20px_rgba(233,110,63,0.9)] ring-2 ring-peach-400' :
      'gk-well bg-cream-100/90 hover:bg-white'}`
      }>
      
      {selected ?
      <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-peach-500 text-white">
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        </span> :
      null}

      <span className="block text-3xl" aria-hidden="true">
        {emoji}
      </span>
      <span className="mt-3 block font-display text-lg font-bold text-ink">{title}</span>
      <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">{subtitle}</span>
      {meta ?
      <span className="mt-2 inline-block rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-bold text-ink-soft">
          {meta}
        </span> :
      null}
    </motion.button>);

}