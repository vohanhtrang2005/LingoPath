import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, LockIcon, MapPinIcon } from 'lucide-react';
import { TypeBadge, TypeTile } from './TypeBadge';
import type { Lesson } from '../../types/lesson';

const EASE = [0.23, 1, 0.32, 1] as const;

interface LessonPathItemProps {
  lesson: Lesson;
  index: number;
  isLast: boolean;
}

export function LessonPathItem({ lesson, index, isLast }: LessonPathItemProps) {
  const complete = lesson.status === 'complete';
  const today = lesson.status === 'today';
  const upcoming = lesson.status === 'upcoming';

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: 0.08 + index * 0.05 }}
      className="relative flex gap-4 pb-5 last:pb-0">
      
      {/* Journey path rail */}
      <div className="relative flex w-9 shrink-0 flex-col items-center">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
          complete ?
          'bg-mint-300 text-white' :
          today ?
          'bg-peach-500 text-white ring-4 ring-peach-100' :
          'bg-cream-200 text-ink-faint'}`
          }
          aria-hidden="true">
          
          {complete ?
          <CheckIcon className="h-4 w-4" strokeWidth={3} /> :
          today ?
          <MapPinIcon className="h-4 w-4" /> :

          <LockIcon className="h-3.5 w-3.5" />
          }
        </span>
        {!isLast ?
        <span
          aria-hidden="true"
          className={`mt-1 w-[3px] flex-1 rounded-full ${
          complete ? 'bg-mint-200' : 'bg-cream-200'}`
          } /> :

        null}
      </div>

      {/* Lesson card */}
      <div
        className={`flex-1 rounded-[1.75rem] p-4 transition-[transform,box-shadow] duration-200 ease-out sm:p-5 ${
        today ?
        'bg-peach-100/80 shadow-[0_16px_30px_-22px_rgba(150,110,86,0.9)]' :
        'bg-white/80 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-22px_rgba(120,88,70,0.9)]'} ${
        upcoming ? 'opacity-80' : ''}`}>
        
        <div className="flex items-start gap-4">
          <TypeTile type={lesson.type} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
                Day {lesson.day}
              </p>
              {today ?
              <span className="rounded-full bg-peach-500 px-2.5 py-0.5 font-display text-[11px] font-bold text-white">
                  You are here
                </span> :
              null}
            </div>

            <h3 className="mt-0.5 font-display text-[17px] font-bold leading-snug text-ink">
              {lesson.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{lesson.subtitle}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TypeBadge type={lesson.type} />
              <span className="text-xs font-semibold text-ink-faint">{lesson.minutes} min</span>
              {complete ?
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-mint-100 px-3 py-1 font-display text-xs font-bold text-[#38795c]">
                  <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  {lesson.score}%
                </span> :
              null}
              {upcoming ?
              <span className="ml-auto text-xs font-semibold text-ink-faint">
                  {lesson.unlocksAt}
                </span> :
              null}
              {today ?
              <span className="ml-auto text-xs font-bold text-[#a1552c]">Ready to start</span> :
              null}
            </div>
          </div>
        </div>
      </div>
    </motion.li>);

}