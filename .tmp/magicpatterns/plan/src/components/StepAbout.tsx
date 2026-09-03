import React from 'react';
import { struggleChips } from '../data/languages';
import { StepHeader } from './StepHeader';

interface StepAboutProps {
  currentLevel: string;
  struggle: string;
  onCurrentLevelChange: (value: string) => void;
  onStruggleChange: (value: string) => void;
}

const MAX_LENGTH = 300;

const textareaClasses =
'w-full resize-none rounded-4xl border-2 border-peach-100 bg-peach-50 p-5 text-sm text-ink-900 transition-colors duration-200 ease-out placeholder:text-peach-300 focus:border-peach-400 focus:bg-white focus:outline-none';

export function StepAbout({
  currentLevel,
  struggle,
  onCurrentLevelChange,
  onStruggleChange
}: StepAboutProps) {
  return (
    <div>
      <StepHeader
        step={3}
        total={3}
        title="Tell me about you"
        subtitle="The more you share, the smarter your daily lessons get." />
      

      <section className="mt-8">
        <h2 className="font-display text-base font-semibold text-ink-900">
          Where are you right now?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Anything counts — apps you tried, classes you took, dramas you binge.
        </p>
        <textarea
          id="current-level"
          rows={4}
          maxLength={MAX_LENGTH}
          value={currentLevel}
          onChange={(event) => onCurrentLevelChange(event.target.value)}
          placeholder="I know hiragana and katakana, and maybe 100 words from watching anime..."
          className={`mt-4 ${textareaClasses}`} />
        
        <p className="mt-2 text-right text-xs font-semibold text-ink-400">
          {currentLevel.length}/{MAX_LENGTH}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-base font-semibold text-ink-900">
          What trips you up the most?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          We&apos;ll weight your daily lessons toward this — no judgment, promise.
        </p>
        <textarea
          id="struggle"
          rows={4}
          maxLength={MAX_LENGTH}
          value={struggle}
          onChange={(event) => onStruggleChange(event.target.value)}
          placeholder="I struggle with kanji — I recognise them but can never recall the readings."
          className={`mt-4 ${textareaClasses}`} />
        
        <div className="mt-3 flex flex-wrap gap-2">
          {struggleChips.map((chip) =>
          <button
            key={chip}
            type="button"
            onClick={() => onStruggleChange(chip)}
            className="rounded-full bg-peach-50 px-4 py-2 text-xs font-semibold text-ink-500 transition-colors duration-200 ease-out hover:bg-peach-100 hover:text-ink-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
              {chip}
            </button>
          )}
        </div>
      </section>
    </div>);

}