import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon, BookMarkedIcon, ChevronDownIcon, LifeBuoyIcon } from 'lucide-react';
import type { GrammarKnowledgeItem, LearningProgress } from '../../types/grammar';
const EASE = [0.23, 1, 0.32, 1] as const;
interface GrammarCardProps {
  item: GrammarKnowledgeItem;
  progress: LearningProgress;
  index: number;
}
export function GrammarCard({
  item,
  progress,
  index
}: GrammarCardProps) {
  const [showSource, setShowSource] = useState(false);
  return <motion.li id={`grammar-${item.id}`} initial={{
    opacity: 0,
    y: 12
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.26,
    ease: EASE,
    delay: Math.min(index, 4) * 0.05
  }} className="gk-card-shadow rounded-[2.25rem] border border-white/70 bg-white/85 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 font-display text-[11px] font-bold text-[#3b6a94]">
              {item.levelSystem} {item.levelCode}
            </span>
            <span className="rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold text-ink-soft">
              Pattern {item.orderIndex}
            </span>
          </div>

          <h3 className="mt-3 font-display text-[1.6rem] font-bold leading-tight text-ink">
            {item.pattern}
          </h3>
          {item.reading ? <p className="mt-1 text-sm font-semibold text-peach-600">{item.reading}</p> : null}
          <p className="mt-2 font-display text-[15px] font-bold text-ink">{item.meaning}</p>
        </div>

        {progress.status === 'mastered' ? <span className="rounded-full bg-mint-300 px-3 py-1 font-display text-xs font-bold text-white">
            Mastered · {progress.masteryScore}%
          </span> : progress.status === 'needs-review' ? <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
            Needs review
          </span> : progress.status === 'learning' ? <span className="rounded-full bg-peach-100 px-3 py-1 font-display text-xs font-bold text-[#a1552c]">
            Learning
          </span> : null}
      </div>

      {/* Formation */}
      <p className="mt-5 rounded-[1.25rem] bg-cream-100/90 px-4 py-3 font-display text-sm font-bold text-ink">
        {item.formation}
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{item.explanation}</p>

      {/* Examples */}
      <ul className="mt-5 space-y-3">
        {item.examples.map((example) => <li key={example.sentence} className="rounded-[1.4rem] bg-white/90 px-4 py-3.5">
            <p className="text-[15px] font-semibold text-ink">{example.sentence}</p>
            {example.reading ? <p className="mt-0.5 text-xs font-semibold text-peach-600">{example.reading}</p> : null}
            <p className="mt-1 text-sm text-ink-soft">{example.translation}</p>
            {example.note ? <p className="mt-2 text-xs font-semibold text-ink-faint">{example.note}</p> : null}
          </li>)}
      </ul>

      {/* Inline prerequisite support */}
      {item.supportNotes.length > 0 ? <div className="mt-5 rounded-[1.4rem] bg-sky-100/70 px-4 py-4">
          <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-[#3b6a94]">
            <LifeBuoyIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Support explanation
          </p>
          <ul className="mt-2.5 space-y-2">
            {item.supportNotes.map((note) => <li key={note.term} className="text-sm leading-relaxed text-[#3f5f7a]">
                <span className="font-bold">{note.term}</span>{' '}
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-[#3b6a94]">
                  {note.levelCode}
                </span>{' '}
                — {note.explanation}
              </li>)}
          </ul>
        </div> : null}

      {/* Usage notes */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
          <div className="h-3.5 w-3.5" aria-hidden="true" />
          Usage notes
        </p>
        <ul className="mt-2 space-y-1.5">
          {item.usageNotes.map((note) => <li key={note} className="text-sm leading-relaxed text-ink-soft">
              · {note}
            </li>)}
        </ul>
      </div>

      {/* Common mistakes */}
      <div className="mt-5 rounded-[1.4rem] bg-peach-100/70 px-4 py-4">
        <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-[#a1552c]">
          <AlertCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Common mistake
        </p>
        {item.commonMistakes.map((mistake) => <div key={mistake.wrong} className="mt-2.5">
            <p className="text-sm font-semibold text-[#b9524f] line-through">{mistake.wrong}</p>
            <p className="mt-0.5 text-sm font-semibold text-[#2f6a4f]">{mistake.right}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{mistake.why}</p>
          </div>)}
      </div>

      {/* Related vocabulary */}
      {item.relatedVocabulary.length > 0 ? <div className="mt-5 flex flex-wrap gap-2">
          {item.relatedVocabulary.map((word) => <span key={word.word} className="rounded-full bg-cream-100 px-3 py-1.5 text-xs font-bold text-ink-soft">
              {word.word}
              {word.reading ? ` · ${word.reading}` : ''} — {word.meaning}
            </span>)}
        </div> : null}

      {/* Source evidence */}
      <button type="button" onClick={() => setShowSource((prev) => !prev)} aria-expanded={showSource} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
        <BookMarkedIcon className="h-3.5 w-3.5" aria-hidden="true" />
        View source evidence
        <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-200 ease-out ${showSource ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {showSource ? <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} transition={{
        duration: 0.22,
        ease: EASE
      }} className="overflow-hidden">
            <div className="mt-3 space-y-2">
              {item.sourceReferences.map((source) => <div key={source.label} className="rounded-[1.2rem] bg-cream-100/90 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                    {source.label}
                  </p>
                  <p className="mt-1 text-sm italic leading-relaxed text-ink-soft">
                    “{source.evidenceText}”
                  </p>
                </div>)}
            </div>
          </motion.div> : null}
      </AnimatePresence>
    </motion.li>;
}