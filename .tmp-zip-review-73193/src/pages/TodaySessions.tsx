import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { SectionCard } from '../components/dashboard/SectionCard';
import { TypeBadge } from '../components/dashboard/TypeBadge';
import { dailySections } from '../data/dailySections';
import { todayLesson } from '../data/lessons';
import { countDone, sectionsForLanguage } from '../utils/dailySections';

const EASE = [0.23, 1, 0.32, 1] as const;

interface TodaySessionsProps {
  /** Mock course language — the Kanji section only exists for Japanese. */
  selectedLanguage: string;
}

export function TodaySessions({ selectedLanguage }: TodaySessionsProps) {
  const navigate = useNavigate();

  const sections = sectionsForLanguage(dailySections, selectedLanguage);
  const done = countDone(sections);
  const progress = Math.round(done / sections.length * 100);
  const totalMinutes = sections.reduce((sum, section) => sum + section.minutes, 0);
  const nextSection = sections.find((section) => section.status !== 'done');

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/learn')}
          className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </button>

        <motion.article
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-labelledby="today-sections-title"
          className="gk-card-shadow relative mt-6 overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-9">
          
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-peach-100/70 blur-2xl" />
          

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
                    Day {todayLesson.day}
                  </span>
                  <TypeBadge type={todayLesson.type} />
                </div>

                <h1
                  id="today-sections-title"
                  className="mt-4 font-display text-[1.85rem] font-bold leading-snug text-ink sm:text-[2.15rem]">
                  
                  {todayLesson.title}
                </h1>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
                  {sections.length} little steps, all open — start wherever you feel like today.
                </p>
              </div>

              <span className="flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 text-xs font-bold text-ink-soft">
                <ClockIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
                {totalMinutes} min total
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-sm font-bold text-ink">
                  {done} of {sections.length} sections done
                </p>
                <p className="text-xs font-semibold text-ink-soft">{progress}%</p>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
                  className="h-full rounded-full bg-peach-400" />
                
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {sections.map((section, index) =>
              <SectionCard
                key={section.id}
                section={section}
                index={index}
                onOpen={(item) => {
                  if (item.id === 'vocabulary') navigate('/learn/today/vocabulary');
                  if (item.id === 'grammar') navigate('/learn/today/grammar');
                  if (item.id === 'reading') navigate('/learn/today/reading');
                }} />

              )}
            </ul>

            <div className="mt-8 border-t border-cream-200 pt-6">
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 620, damping: 18 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-peach-500 px-7 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                {nextSection ? `Continue ${nextSection.title}` : "Review today's lesson"}
                <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
              </motion.button>
            </div>
          </div>
        </motion.article>

        <p className="mt-6 text-center text-xs font-semibold text-ink-faint">
          Finish any three sections to keep your streak alive.
        </p>
      </div>
    </main>);

}