import React from 'react';
import { motion } from 'framer-motion';
import { BookMarkedIcon, LifeBuoyIcon, PenLineIcon, SpellCheckIcon } from 'lucide-react';
import type { PostReadingExplanation, ReadingKnowledgeItem } from '../../types/reading';

const EASE = [0.23, 1, 0.32, 1] as const;

interface PostReadingPanelProps {
  passage: ReadingKnowledgeItem;
  explanation: PostReadingExplanation;
  index: number;
}

export function PostReadingPanel({ passage, explanation, index }: PostReadingPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: 0.05 + index * 0.05 }}
      aria-labelledby={`post-reading-${passage.id}`}
      className="gk-card-shadow rounded-[2.25rem] border border-white/70 bg-white/85 p-6 backdrop-blur-xl sm:p-7">
      
      <h3 id={`post-reading-${passage.id}`} className="font-display text-lg font-bold text-ink">
        {passage.title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">{passage.topic}</p>

      {/* Vocabulary */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
          <SpellCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Important vocabulary in this passage
        </p>
        <ul className="mt-2.5 space-y-2">
          {explanation.importantVocabulary.map((word) =>
          <li
            key={word.knowledgeItemId}
            className="rounded-[1.2rem] bg-mint-100/70 px-4 py-3 text-sm text-[#2f6a4f]">
            
              <span className="font-display text-base font-bold text-ink">{word.word}</span>
              {word.reading ?
            <span className="ml-2 text-xs font-semibold text-peach-600">{word.reading}</span> :
            null}
              <span className="ml-2 text-ink-soft">— {word.meaning}</span>
              <span className="ml-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-ink-faint">
                {word.knowledgeItemId}
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Grammar */}
      <div className="mt-5">
        <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
          <PenLineIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Important grammar in this passage
        </p>
        <ul className="mt-2.5 space-y-2">
          {explanation.importantGrammar.map((pattern) =>
          <li
            key={pattern.knowledgeItemId}
            className="rounded-[1.2rem] bg-peach-100/70 px-4 py-3 text-sm text-ink-soft">
            
              <span className="font-display text-base font-bold text-ink">{pattern.pattern}</span>
              <span className="ml-2">— {pattern.meaning}</span>
              <span className="ml-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-ink-faint">
                {pattern.knowledgeItemId}
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* Lower-level support */}
      {explanation.supportExplanations.length > 0 ?
      <div className="mt-5 rounded-[1.4rem] bg-sky-100/70 px-4 py-4">
          <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-[#3b6a94]">
            <LifeBuoyIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Support explanation
          </p>
          <ul className="mt-2.5 space-y-2">
            {explanation.supportExplanations.map((note) =>
          <li key={note.term} className="text-sm leading-relaxed text-[#3f5f7a]">
                <span className="font-bold">{note.term}</span>{' '}
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-[#3b6a94]">
                  {note.levelCode}
                </span>{' '}
                — {note.explanation}
              </li>
          )}
          </ul>
        </div> :
      null}

      {/* Source */}
      <div className="mt-5 rounded-[1.2rem] bg-cream-100/90 px-4 py-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
          <BookMarkedIcon className="h-3 w-3" aria-hidden="true" />
          {passage.sourceReferences[0]?.label}
        </p>
        <p className="mt-1.5 text-sm italic leading-relaxed text-ink-soft">
          “{explanation.evidenceText}”
        </p>
      </div>
    </motion.section>);

}