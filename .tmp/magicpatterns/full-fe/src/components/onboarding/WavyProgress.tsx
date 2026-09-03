import React, { useId } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1] as const;

interface WavyProgressProps {
  /** 0–100 */
  value: number;
  step: number;
  totalSteps: number;
}

export function WavyProgress({ value, step, totalSteps }: WavyProgressProps) {
  const clipId = useId();

  return (
    <div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={step + 1}
        aria-label={`Step ${step + 1} of ${totalSteps}`}
        className="overflow-hidden rounded-full">
        
        <svg viewBox="0 0 1200 34" preserveAspectRatio="none" className="h-5 w-full" role="presentation">
          <defs>
            <clipPath id={clipId}>
              <path d="M0 14C150 0 250 28 400 14S650 0 800 14s250 14 400 0V34H0Z" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect x="0" y="0" width="1200" height="34" fill="#F9E8D8" />
            <motion.rect
              y="0"
              height="34"
              fill="#FF9A6B"
              initial={false}
              animate={{ width: value / 100 * 1200 }}
              transition={{ duration: 0.3, ease: EASE }} />
            
          </g>
        </svg>
      </div>

      <ol className="mt-3 flex items-center justify-between px-1">
        {Array.from({ length: totalSteps }, (_, index) =>
        <li
          key={index}
          className={`font-display text-xs font-bold ${
          index <= step ? 'text-[#a1552c]' : 'text-ink-faint'}`
          }>
          
            {index + 1}. {['Language', 'Rhythm', 'About you'][index]}
          </li>
        )}
      </ol>
    </div>);

}