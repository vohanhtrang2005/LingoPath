import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { VocabularyPractice } from '../components/vocabulary/VocabularyPractice';
import { vocabularyLesson } from '../data/vocabulary';

const EASE = [0.23, 1, 0.32, 1] as const;

export function VocabularyPracticePage() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/learn/today/vocabulary')}
          className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to theory
        </button>

        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
              Day {vocabularyLesson.day} · {vocabularyLesson.section} practice
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 font-display text-xs font-bold text-[#3b6a94]">
              {vocabularyLesson.level}
            </span>
          </div>

          <h1 className="mt-4 font-display text-[1.85rem] font-bold leading-snug text-ink sm:text-[2.15rem]">
            {vocabularyLesson.title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Questions come from the approved source material for this lesson. Answers are checked
            automatically and your review schedule updates from the results.
          </p>
        </motion.header>

        <VocabularyPractice />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => navigate('/learn/today/vocabulary')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 20 }}
            className="gk-well flex flex-1 items-center justify-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to theory
          </motion.button>

          <motion.button
            type="button"
            onClick={() => navigate('/learn/today')}
            whileHover={{ y: -2, scale: 1.015 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 18 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-peach-500 px-6 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.9)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            Continue to next section
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </main>);

}