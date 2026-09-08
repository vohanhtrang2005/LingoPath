import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookMarkedIcon, CheckCircle2Icon, RefreshCwIcon, XCircleIcon } from 'lucide-react';
import { vocabularyItems } from '../../data/vocabulary';
import type { PracticeType, VocabularyPracticeItem } from '../../types/vocabulary';

const EASE = [0.23, 1, 0.32, 1] as const;

const TYPE_LABEL: Record<PracticeType, string> = {
  meaning: 'Choose the meaning',
  'word-in-sentence': 'Choose the word',
  'fill-blank': 'Fill in the blank',
  match: 'Match word and meaning',
  reading: 'Choose the reading'
};

interface PracticeQuestionProps {
  item: VocabularyPracticeItem;
  index: number;
  onAnswered: (item: VocabularyPracticeItem, correct: boolean) => void;
}

export function PracticeQuestion({ item, index, onAnswered }: PracticeQuestionProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [pairAnswers, setPairAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const meaningChoices = useMemo(
    () => (item.pairs ?? []).map((pair) => pair.right),
    [item.pairs]
  );

  const related = vocabularyItems.filter((word) => item.relatedKnowledgeItemIds.includes(word.id));

  const isCorrect = (() => {
    if (item.practiceType === 'fill-blank') return typed.trim() === item.correctAnswer;
    if (item.practiceType === 'match') {
      return (item.pairs ?? []).every((pair) => pairAnswers[pair.left] === pair.right);
    }
    return choice === item.correctAnswer;
  })();

  const canSubmit = (() => {
    if (submitted) return false;
    if (item.practiceType === 'fill-blank') return typed.trim().length > 0;
    if (item.practiceType === 'match') {
      return (item.pairs ?? []).every((pair) => Boolean(pairAnswers[pair.left]));
    }
    return choice !== null;
  })();

  const submit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    onAnswered(item, isCorrect);
  };

  const retry = () => {
    setSubmitted(false);
    setChoice(null);
    setTyped('');
    setPairAnswers({});
  };

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold text-ink-soft">
          <BookMarkedIcon className="h-3 w-3" aria-hidden="true" />
          {item.sourceReference}
        </span>
      </div>

      <p className="mt-4 font-display text-[17px] font-bold leading-snug text-ink">{item.prompt}</p>

      {/* Answer input */}
      {item.practiceType === 'fill-blank' ?
      <input
        type="text"
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        disabled={submitted}
        placeholder="Type your answer…"
        aria-label="Your answer"
        className="gk-well mt-4 w-full rounded-4xl bg-cream-100/90 px-5 py-3.5 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" /> :

      item.practiceType === 'match' ?
      <div className="mt-4 space-y-3">
          {(item.pairs ?? []).map((pair) =>
        <div key={pair.left} className="rounded-[1.5rem] bg-cream-100/80 p-3.5">
              <p className="font-display text-base font-bold text-ink">{pair.left}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {meaningChoices.map((meaning) => {
              const picked = pairAnswers[pair.left] === meaning;
              const showRight = submitted && meaning === pair.right;
              const showWrong = submitted && picked && meaning !== pair.right;
              return (
                <button
                  key={meaning}
                  type="button"
                  disabled={submitted}
                  onClick={() => setPairAnswers((prev) => ({ ...prev, [pair.left]: meaning }))}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
                  showRight ?
                  'bg-mint-300 text-white' :
                  showWrong ?
                  'bg-[#f7d7d7] text-[#b9524f]' :
                  picked ?
                  'bg-peach-500 text-white' :
                  'bg-white text-ink-soft hover:text-ink'}`
                  }>
                  
                      {meaning}
                    </button>);

            })}
              </div>
            </div>
        )}
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

      {/* Submit */}
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

      {/* Feedback */}
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
              {isCorrect ? 'Correct!' : 'Not quite — here it is'}
            </p>

            {!isCorrect && item.practiceType !== 'match' ?
          <p className="mt-2 text-sm font-semibold text-ink">
                Correct answer: <span className="text-peach-600">{item.correctAnswer}</span>
              </p> :
          null}

            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.explanation}</p>

            {related.length > 0 ?
          <div className="mt-3 flex flex-wrap gap-2">
                {related.map((word) =>
            <span
              key={word.id}
              className="rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-ink">
              
                    {word.word} · {word.reading} — {word.meaning}
                  </span>
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