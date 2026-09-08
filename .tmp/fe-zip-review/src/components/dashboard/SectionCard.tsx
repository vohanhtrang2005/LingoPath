import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import type { DailySection } from '../../types/lesson';

const EASE = [0.23, 1, 0.32, 1] as const;

interface SectionCardProps {
  section: DailySection;
  index: number;
  onOpen: (section: DailySection) => void;
}

export function SectionCard({ section, index, onOpen }: SectionCardProps) {
  const done = section.status === 'done';
  const active = section.status === 'in-progress';

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: 0.06 + index * 0.04 }}>
      
      <motion.button
        type="button"
        onClick={() => onOpen(section)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 600, damping: 20 }}
        aria-label={`${section.title} — ${
        done ? 'completed' : active ? 'in progress' : 'not started yet'}`
        }
        className={`flex w-full items-center gap-4 rounded-[1.75rem] p-4 text-left transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 sm:p-5 ${
        active ?
        'bg-peach-100 shadow-[0_18px_32px_-22px_rgba(233,110,63,0.95)] ring-2 ring-peach-300' :
        done ?
        'bg-mint-100/80 shadow-[0_14px_28px_-24px_rgba(80,120,100,0.9)] hover:bg-mint-100' :
        'gk-well bg-cream-100/85 hover:bg-white'}`
        }>
        
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.3rem] bg-white text-2xl"
          aria-hidden="true">
          
          {section.emoji}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[17px] font-bold text-ink">{section.title}</span>
            {done ?
            <span className="inline-flex items-center gap-1 rounded-full bg-mint-300 px-2.5 py-0.5 font-display text-[11px] font-bold text-white">
                <CheckIcon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                Done
              </span> :
            null}
            {active ?
            <span className="rounded-full bg-peach-500 px-2.5 py-0.5 font-display text-[11px] font-bold text-white">
                In progress
              </span> :
            null}
          </span>

          <span className="mt-1 block truncate text-sm text-ink-soft">{section.subtitle}</span>

          {active && typeof section.progress === 'number' ?
          <span className="mt-2.5 block h-2 w-full overflow-hidden rounded-full bg-white/80">
              <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${section.progress}%` }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
              className="block h-full rounded-full bg-peach-400" />
            
            </span> :

          <span className="mt-1.5 block text-xs font-semibold text-ink-faint">
              {section.minutes} min
            </span>
          }
        </span>

        <ChevronRightIcon className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden="true" />
      </motion.button>
    </motion.li>);

}