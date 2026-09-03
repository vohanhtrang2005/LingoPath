import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ClockIcon, LayersIcon, SparklesIcon } from 'lucide-react';
import { TypeBadge } from './TypeBadge';
import { learner, todayLesson } from '../../data/lessons';

const EASE = [0.23, 1, 0.32, 1] as const;

interface TodayLessonCardProps {
  onStart: () => void;
}

export function TodayLessonCard({ onStart }: TodayLessonCardProps) {
  const progress = Math.round(learner.chapterDone / learner.chapterTotal * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: EASE, delay: 0.04 }}
      className="gk-card-shadow relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-7 backdrop-blur-xl sm:p-9"
      aria-labelledby="today-lesson-title">
      
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-peach-100/70 blur-2xl" />
      

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
            Today · Day {todayLesson.day}
          </span>
          <TypeBadge type={todayLesson.type} />
        </div>

        <h2
          id="today-lesson-title"
          className="mt-5 font-display text-[1.75rem] font-bold leading-snug text-ink sm:text-[2rem]">
          
          {todayLesson.title}
        </h2>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
          {todayLesson.subtitle}
        </p>

        <dl className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-ink-soft">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
            <dt className="sr-only">Length</dt>
            <dd>{todayLesson.minutes} min</dd>
          </div>
          <div className="flex items-center gap-2">
            <LayersIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
            <dt className="sr-only">New items</dt>
            <dd>{todayLesson.items} new words</dd>
          </div>
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
            <dt className="sr-only">Reward</dt>
            <dd>+{todayLesson.xp} XP</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
          <motion.button
            type="button"
            onClick={onStart}
            whileHover={{ y: -2, scale: 1.015 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 18 }}
            className="flex items-center justify-center gap-2 rounded-full bg-peach-500 px-7 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            Start Learning
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>

          <button
            type="button"
            className="rounded-full px-4 py-3 font-display text-sm font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            Peek at the word list
          </button>
        </div>

        <div className="mt-8 border-t border-cream-200 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-sm font-bold text-ink">{learner.chapter}</p>
            <p className="text-xs font-semibold text-ink-soft">
              {learner.chapterDone} of {learner.chapterTotal} lessons
            </p>
          </div>
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
              className="h-full rounded-full bg-peach-400" />
            
          </div>
        </div>
      </div>
    </motion.article>);

}