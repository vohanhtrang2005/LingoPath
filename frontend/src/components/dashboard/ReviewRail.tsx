import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshakeIcon, RotateCcwIcon, SproutIcon } from 'lucide-react';
import { learner, reviewQueue, weekStreak } from '../../data/lessons';

const EASE = [0.23, 1, 0.32, 1] as const;

export function ReviewRail() {
  const goalProgress = Math.min(
    100,
    Math.round(learner.minutesToday / learner.minutesGoal * 100)
  );

  return (
    <div className="space-y-5">
      {/* SRS review */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE, delay: 0.1 }}
        aria-labelledby="review-title"
        className="rounded-[2rem] bg-mint-100/90 p-6 shadow-[0_18px_34px_-26px_rgba(80,120,100,0.9)]">
        
        <div className="flex items-center gap-2">
          <RotateCcwIcon className="h-4 w-4 text-[#38795c]" aria-hidden="true" />
          <h2 id="review-title" className="font-display text-sm font-bold text-[#38795c]">
            Flashcards due
          </h2>
        </div>

        <p className="mt-3 font-display text-[2.5rem] font-bold leading-none text-[#2f6a4f]">
          {reviewQueue.due}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#4a7a64]">
          A quick 3-minute round keeps today&apos;s words from slipping away.
        </p>

        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 620, damping: 18 }}
          className="mt-5 w-full rounded-full bg-mint-400 px-5 py-3 font-display text-sm font-bold text-white shadow-[0_14px_26px_-14px_rgba(58,140,104,0.9)] transition-colors duration-200 ease-out hover:bg-[#5cbb91] focus:outline-none focus-visible:ring-4 focus-visible:ring-mint-200">
          
          Review now
        </motion.button>

        <p className="mt-3 text-center text-xs font-semibold text-[#4a7a64]">
          Next batch in {reviewQueue.nextIn} · {reviewQueue.mastered} words mastered
        </p>
      </motion.section>

      {/* Streak + daily goal */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE, delay: 0.15 }}
        aria-labelledby="streak-title"
        className="rounded-[2rem] bg-white/80 p-6 shadow-[0_18px_34px_-26px_rgba(120,88,70,0.9)] backdrop-blur">
        
        <h2 id="streak-title" className="font-display text-sm font-bold text-ink">
          {learner.streak}-day streak
        </h2>

        <ul className="mt-4 flex justify-between">
          {weekStreak.map((day, index) =>
          <li key={`${day.label}-${index}`} className="flex flex-col items-center gap-1.5">
              <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold ${
              day.done ?
              'bg-peach-300 text-white' :
              day.today ?
              'bg-white text-peach-600 ring-2 ring-peach-300' :
              'bg-cream-100 text-ink-faint'}`
              }>
              
                {day.label}
              </span>
            </li>
          )}
        </ul>

        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-bold text-ink-soft">Today&apos;s goal</p>
            <p className="text-xs font-semibold text-ink-faint">
              {learner.minutesToday}/{learner.minutesGoal} min
            </p>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.2 }}
              className="h-full rounded-full bg-sky-300" />
            
          </div>
        </div>
      </motion.section>

      {/* Gentle note */}
      <motion.aside
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: EASE, delay: 0.2 }}
        className="flex gap-3 rounded-[2rem] bg-cream-100/90 p-5">
        
        <SproutIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-ink-soft">
          Missed yesterday? Nothing is lost — your path simply waits for you.{' '}
          <HeartHandshakeIcon className="inline h-4 w-4 text-peach-400" aria-hidden="true" />
        </p>
      </motion.aside>
    </div>);

}