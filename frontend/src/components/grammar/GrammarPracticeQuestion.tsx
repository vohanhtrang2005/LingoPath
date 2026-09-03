import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookMarkedIcon, CheckCircle2Icon, RefreshCwIcon, XCircleIcon } from 'lucide-react';
import { grammarItems } from '../../data/grammar';
import type { GrammarPracticeItem, GrammarPracticeType } from '../../types/grammar';

const EASE = [0.23, 1, 0.32, 1] as const;

const TYPE_LABEL: Record<GrammarPracticeType, string> = {
  'pattern-choice': 'Choose the pattern',
  'meaning-choice': 'Choose the meaning',
  'fill-blank': 'Fill in the blank',
  reorder: 'Reorder the words',
  'usage-choice': 'Choose the correct sentence',
  transform: 'Transform the sentence'
};

interface GrammarPracticeQuestionProps {
  item: GrammarPracticeItem;
  index: number;
  onAnswered: (item: GrammarPracticeItem, correct: boolean) => void;
}

export function GrammarPracticeQuestion({
  item,
  index,
  onAnswered
}: GrammarPracticeQuestionProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [order, setOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const tokens = item.tokens ?? [];

  const isTyping = item.practiceType === 'fill-blank' || item.practiceType === 'transform';
  const isReorder = item.practiceType === 'reorder';

  const related = grammarItems.filter((grammar) =>
  item.relatedKnowledgeItemIds.includes(grammar.id)
  );

  const normalise = (value: string) => value.replace(/[。\s]/g, '');

  const isCorrect = isReorder ?
  order.map((tokenIndex) => tokens[tokenIndex]).join(' ') === item.correctAnswer :
  isTyping ?
  normalise(typed) === normalise(item.correctAnswer) :
  choice === item.correctAnswer;

  const canSubmit = submitted ?
  false :
  isReorder ?
  order.length === tokens.length :
  isTyping ?
  typed.trim().length > 0 :
  choice !== null;

  const submit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onAnswered(item, isCorrect);
  };

  const retry = () => {
    setSubmitted(false);
    setChoice(null);
    setTyped('');
    setOrder([]);
  };

  const remainingTokenIndexes = tokens.
  map((_, tokenIndex) => tokenIndex).
  filter((tokenIndex) => !order.includes(tokenIndex));

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: EASE, delay: Math.min(index, 5) * 0.04 }}
      className="rounded-[1.75rem] bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
      
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-100 px-3 py-1 font-display text-[11px] font-bold text-[#3b6a94]">
          {TYPE_LABEL[item.practiceType]}
        </span>
        <span className="rounded-full bg-peach-100 px-3 py-1 font-display text-[11px] font-bold text-[#a1552c]">
          {item.targetPattern}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold text-ink-soft">
          <BookMarkedIcon className="h-3 w-3" aria-hidden="true" />
          {item.sourceReference}
        </span>
      </div>

      <p className="mt-4 font-display text-[17px] font-bold leading-snug text-ink">{item.prompt}</p>

      {/* Answer input */}
      {isTyping ?
      <input
        type="text"
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        disabled={submitted}
        placeholder="Type your answer…"
        aria-label="Your answer"
        className="gk-well mt-4 w-full rounded-4xl bg-cream-100/90 px-5 py-3.5 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" /> :

      isReorder ?
      <div className="mt-4">
          <div className="gk-well flex min-h-[3.5rem] flex-wrap items-center gap-2 rounded-[1.4rem] bg-cream-100/90 px-4 py-3">
            {order.length === 0 ?
          <span className="text-sm font-semibold text-ink-faint">
                Tap the words below in order…
              </span> :

          order.map((tokenIndex, position) =>
          <button
            key={`${tokenIndex}-${position}`}
            type="button"
            disabled={submitted}
            onClick={() => setOrder((prev) => prev.filter((_, i) => i !== position))}
            className="rounded-full bg-peach-500 px-3.5 py-1.5 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
                  {tokens[tokenIndex]}
                </button>
          )
          }
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {remainingTokenIndexes.map((tokenIndex) =>
          <button
            key={`pool-${tokenIndex}`}
            type="button"
            disabled={submitted}
            onClick={() => setOrder((prev) => [...prev, tokenIndex])}
            className="rounded-full bg-white px-3.5 py-1.5 text-sm font-bold text-ink shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
                {tokens[tokenIndex]}
              </button>
          )}
          </div>
        </div> :

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {(item.choices ?? []).map((option) => {
          const picked = choice === option;
          const showRight = submitted && option === item.correctAnswer;
          const showWrong = submitted && picked && option !== item.correctAnswer;
          return (
            <motion.button
              key={option}
              type="button"
              disabled={submitted}
              onClick={() => setChoice(option)}
              whileHover={submitted ? undefined : { y: -2 }}
              whileTap={submitted ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 600, damping: 22 }}
              className={`rounded-[1.4rem] px-4 py-3 text-left font-display text-sm font-bold transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
              showRight ?
              'bg-mint-200 text-[#2f6a4f]' :
              showWrong ?
              'bg-[#fbe3e3] text-[#b9524f]' :
              picked ?
              'bg-peach-100 text-ink ring-2 ring-peach-300' :
              'gk-well bg-cream-100/90 text-ink hover:bg-white'}`
              }>
              
                {option}
              </motion.button>);

        })}
        </div>
      }

      {!submitted ?
      <motion.button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        whileHover={canSubmit ? { y: -2 } : undefined}
        whileTap={canSubmit ? { scale: 0.97 } : undefined}
        transition={{ type: 'spring', stiffness: 620, damping: 20 }}
        className={`mt-5 w-full rounded-full px-6 py-3.5 font-display text-sm font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
        canSubmit ? 'bg-peach-500 hover:bg-peach-400' : 'cursor-not-allowed bg-peach-200'}`
        }>
        
          Check answer
        </motion.button> :
      null}

      <AnimatePresence initial={false}>
        {submitted ?
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: EASE }}
          className={`mt-5 rounded-[1.5rem] p-4 sm:p-5 ${
          isCorrect ? 'bg-mint-100/85' : 'bg-peach-100/80'}`
          }>
          
            <p
            className={`flex items-center gap-2 font-display text-sm font-bold ${
            isCorrect ? 'text-[#2f6a4f]' : 'text-[#a1552c]'}`
            }>
            
              {isCorrect ?
            <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" /> :

            <XCircleIcon className="h-4 w-4" aria-hidden="true" />
            }
              {isCorrect ? 'Correct' : 'Not quite — here it is'}
            </p>

            {!isCorrect ?
          <p className="mt-2 text-sm font-semibold text-ink">
                Correct answer: <span className="text-peach-600">{item.correctAnswer}</span>
              </p> :
          null}

            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.explanation}</p>

            {!isCorrect && choice && item.wrongChoiceExplanations?.[choice] ?
          <p className="mt-2 rounded-[1.1rem] bg-white/80 px-4 py-3 text-sm leading-relaxed text-ink-soft">
                Why “{choice}” doesn&apos;t work: {item.wrongChoiceExplanations[choice]}
              </p> :
          null}

            {related.length > 0 ?
          <div className="mt-3 flex flex-wrap gap-2">
                {related.map((grammar) =>
            <a
              key={grammar.id}
              href={`#grammar-${grammar.id}`}
              className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-ink transition-colors duration-150 ease-out hover:text-peach-600">
              
                    Review {grammar.pattern} · {grammar.id}
                  </a>
            )}
              </div> :
          null}

            <div className="mt-3 rounded-[1.2rem] bg-white/80 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                <BookMarkedIcon className="h-3 w-3" aria-hidden="true" />
                Evidence · {item.sourceReference}
              </p>
              <p className="mt-1.5 text-sm italic leading-relaxed text-ink-soft">
                “{item.evidenceText}”
              </p>
            </div>

            {!isCorrect ?
          <button
            type="button"
            onClick={retry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
                <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </button> :
          null}
          </motion.div> :
        null}
      </AnimatePresence>
    </motion.li>);

}