import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, FlameIcon, LogOutIcon } from 'lucide-react';
import { learner } from '../../data/lessons';

const EASE = [0.23, 1, 0.32, 1] as const;

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="relative">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-white shadow-[0_12px_24px_-14px_rgba(150,110,86,0.8)]">
            <span className="font-display text-lg font-bold text-peach-600">学</span>
          </span>
          <span className="font-display text-base font-bold tracking-[0.16em] text-[#8a5638]">
            LingoPath
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-2 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            {learner.course}
            <ChevronDownIcon className="h-4 w-4 text-ink-faint" aria-hidden="true" />
          </button>

          <span className="hidden items-center gap-1.5 rounded-full bg-white/75 px-3.5 py-2 font-display text-sm font-bold text-ink backdrop-blur sm:inline-flex">
            <FlameIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
            {learner.streak}
          </span>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 ease-out hover:bg-white/70 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            <LogOutIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="mt-10">
        
        <p className="font-display text-sm font-semibold text-[#a1552c]">{today}</p>
        <h1 className="mt-1 font-display text-[2.15rem] font-bold leading-tight text-ink sm:text-[2.5rem]">
          Good morning, {learner.name}!
        </h1>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">
          You&apos;re {learner.chapterTotal - learner.chapterDone} lessons from finishing{' '}
          {learner.chapter}. Take it one cosy step at a time.
        </p>
      </motion.div>
    </header>);

}