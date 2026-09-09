import React from 'react';
import { weaknessSuggestions } from '../../data/onboardingOptions';
import type { StudyPlanDraft } from '../../types/plan';

interface StepNotesProps {
  draft: StudyPlanDraft;
  onChange: <K extends keyof StudyPlanDraft>(key: K, value: StudyPlanDraft[K]) => void;
}

const MAX = 300;

export function StepNotes({ draft, onChange }: StepNotesProps) {
  return (
    <div className="space-y-7">
      <div>
        <label htmlFor="current-note" className="font-display text-base font-bold text-ink">
          Where are you right now?
        </label>
        <p className="mt-1 text-sm text-ink-soft">
          Anything counts — apps you tried, classes you took, dramas you binge.
        </p>
        <textarea
          id="current-note"
          rows={4}
          maxLength={MAX}
          value={draft.currentNote}
          onChange={(event) => onChange('currentNote', event.target.value)}
          placeholder="I know hiragana and katakana, and maybe 100 words from watching anime…"
          className="gk-well mt-3 w-full resize-none rounded-[1.75rem] bg-cream-100/90 px-5 py-4 text-[15px] leading-relaxed text-ink outline-none transition-shadow duration-200 ease-out placeholder:text-ink-faint" />
        
        <p className="mt-1 pr-2 text-right text-xs font-semibold text-ink-faint">
          {draft.currentNote.length}/{MAX}
        </p>
      </div>

      <div>
        <label htmlFor="weakness-note" className="font-display text-base font-bold text-ink">
          What trips you up the most?
        </label>
        <p className="mt-1 text-sm text-ink-soft">
          We&apos;ll weight your daily lessons toward this — no judgment, promise.
        </p>
        <textarea
          id="weakness-note"
          rows={4}
          maxLength={MAX}
          value={draft.weaknessNote}
          onChange={(event) => onChange('weaknessNote', event.target.value)}
          placeholder="I struggle with kanji — I recognise them but can never recall the readings."
          className="gk-well mt-3 w-full resize-none rounded-[1.75rem] bg-cream-100/90 px-5 py-4 text-[15px] leading-relaxed text-ink outline-none transition-shadow duration-200 ease-out placeholder:text-ink-faint" />
        

        <div className="mt-3 flex flex-wrap gap-2">
          {weaknessSuggestions.map((suggestion) =>
          <button
            key={suggestion}
            type="button"
            onClick={() => onChange('weaknessNote', suggestion)}
            className="rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors duration-150 ease-out hover:bg-peach-100 hover:text-[#a1552c] focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
              {suggestion}
            </button>
          )}
        </div>
      </div>
    </div>);

}