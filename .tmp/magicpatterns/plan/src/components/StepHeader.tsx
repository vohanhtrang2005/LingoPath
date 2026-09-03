import React, { useId } from 'react';

const stepLabels = ['1. Language', '2. Rhythm', '3. About you'];

interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  subtitle: string;
}

/** A chunky, slightly tapered wave ribbon — the signature LingoPath progress bar. */
const RIBBON_PATH = [
'M6 13',
'C 90 5, 180 6, 270 11',
'C 360 16, 450 19, 540 15',
'C 600 12, 660 10, 714 11',
'L714 21',
'C 660 20, 600 22, 540 25',
'C 450 29, 360 26, 270 21',
'C 180 16, 90 15, 6 23',
'Z'].
join(' ');

export function StepHeader({ step, total, title, subtitle }: StepHeaderProps) {
  const clipId = useId();
  const progress = step / total;

  return (
    <header>
      <svg
        viewBox="0 0 720 32"
        preserveAspectRatio="none"
        className="h-5 w-full"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${step} of ${total}`}>
        
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={720 * progress} height="32" />
          </clipPath>
        </defs>
        <path d={RIBBON_PATH} fill="#FFE7D6" />
        <path d={RIBBON_PATH} fill="#F5824E" clipPath={`url(#${clipId})`} />
      </svg>

      <ol className="mt-3 flex items-center justify-between text-xs font-semibold">
        {stepLabels.map((label, index) =>
        <li
          key={label}
          className={index + 1 <= step ? 'text-peach-600' : 'text-ink-400'}>
          
            {label}
          </li>
        )}
      </ol>

      <p className="mt-7 text-sm font-bold text-peach-600">
        Step {step} of {total}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
    </header>);

}