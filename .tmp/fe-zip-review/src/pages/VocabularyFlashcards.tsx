import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, CheckIcon, RefreshCwIcon, RotateCwIcon, SparklesIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { vocabularyItems, vocabularyLesson } from '../data/vocabulary';
import { useVocabularyProgress } from '../contexts/VocabularyProgressContext';
import type { KnowledgeItem } from '../types/vocabulary';

const EASE = [0.23, 1, 0.32, 1] as const;

export function VocabularyFlashcards() {
  const navigate = useNavigate();
  const { markKnown, markPractice } = useVocabularyProgress();

  const [deck, setDeck] = useState<KnowledgeItem[]>(vocabularyItems);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);
  const [trickyIds, setTrickyIds] = useState<string[]>([]);

  const total = deck.length;
  const finished = index >= total;
  const card = finished ? null : deck[index];

  const advance = () => {
    setFlipped(false);
    setIndex((prev) => prev + 1);
  };

  const handleKnown = () => {
    if (!card) return;
    markKnown(card.id);
    setKnew((prev) => prev + 1);
    setTrickyIds((prev) => prev.filter((id) => id !== card.id));
    advance();
  };

  const handlePractice = () => {
    if (!card) return;
    markPractice(card.id);
    setTrickyIds((prev) => prev.includes(card.id) ? prev : [...prev, card.id]);
    advance();
  };

  const startRound = (nextDeck: KnowledgeItem[]) => {
    setDeck(nextDeck);
    setIndex(0);
    setFlipped(false);
    setKnew(0);
    setTrickyIds([]);
  };

  const trickyCards = vocabularyItems.filter((item) => trickyIds.includes(item.id));

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/learn/today/vocabulary')}
            className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Word list
          </button>

          <span className="rounded-full bg-white/75 px-4 py-2 font-display text-sm font-bold text-ink-soft backdrop-blur">
            {Math.min(index + 1, total)} / {total}
          </span>
        </div>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
          <motion.div
            initial={false}
            animate={{ width: `${Math.min(index, total) / total * 100}%` }}
            transition={{ duration: 0.3, ease: EASE }}
            className="h-full rounded-full bg-peach-400" />
          
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {card ?
          <motion.section
            key={card.id}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.26, ease: EASE }}
            className="mt-6">
            
              {/* Flippable card */}
              <button
              type="button"
              onClick={() => setFlipped((prev) => !prev)}
              aria-pressed={flipped}
              aria-label={flipped ? 'Show the word again' : 'Flip the card to see the answer'}
              className="gk-perspective block w-full rounded-[2.5rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
              
                <motion.div
                className="gk-flip relative h-[23rem] w-full"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.28, ease: EASE }}>
                
                  {/* Front */}
                  <div className="gk-face gk-card-shadow absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] border border-white/70 bg-white/85 p-8 backdrop-blur-xl">
                    <p className="font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
                      Day {vocabularyLesson.day} · {vocabularyLesson.level}
                    </p>
                    <p className="mt-6 text-center font-display text-5xl font-bold leading-tight text-ink">
                      {card.word}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-4 py-2 text-xs font-bold text-ink-soft">
                      <RotateCwIcon className="h-3.5 w-3.5 text-peach-500" aria-hidden="true" />
                      Tap the card to flip
                    </span>
                  </div>

                  {/* Back */}
                  <div
                  className="gk-face gk-face-back gk-card-shadow absolute inset-0 flex flex-col justify-center rounded-[2.5rem] border border-white/70 bg-cream-50/95 p-8 backdrop-blur-xl">
                  
                    <p className="text-center text-sm font-bold text-peach-600">{card.reading}</p>
                    <p className="mt-2 text-center font-display text-2xl font-bold text-ink">
                      {card.meaning}
                    </p>

                    <div className="mt-6 rounded-[1.5rem] bg-white/85 px-5 py-4 text-left">
                      <p className="text-[15px] font-semibold text-ink">{card.example}</p>
                      <p className="mt-1 text-sm text-ink-soft">{card.exampleMeaning}</p>
                    </div>

                    <p className="mt-4 text-center text-xs font-semibold text-ink-faint">
                      {card.note}
                    </p>
                  </div>
                </motion.div>
              </button>

              {/* Answer buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <motion.button
                type="button"
                onClick={handlePractice}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 620, damping: 20 }}
                className="gk-well flex flex-1 items-center justify-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                  <RefreshCwIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
                  Practice this more
                </motion.button>

                <motion.button
                type="button"
                onClick={handleKnown}
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 620, damping: 18 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mint-400 px-5 py-3.5 font-display text-sm font-bold text-white shadow-[0_14px_26px_-14px_rgba(58,140,104,0.9)] transition-colors duration-200 ease-out hover:bg-[#5cbb91] focus:outline-none focus-visible:ring-4 focus-visible:ring-mint-200">
                
                  <CheckIcon className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                  I knew this
                </motion.button>
              </div>
            </motion.section> :

          <motion.section
            key="summary"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/85 p-8 text-center backdrop-blur-xl sm:p-10">
            
              <span
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-mint-100 text-3xl"
              aria-hidden="true">
              
                🌸
              </span>

              <h1 className="mt-4 font-display text-[1.75rem] font-bold text-ink">
                Round complete!
              </h1>
              <p className="mt-2 text-[15px] text-ink-soft">
                Your progress updated on its own — pick what to review next.
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[1.5rem] bg-mint-100/80 px-4 py-5">
                  <dt className="text-xs font-bold text-[#38795c]">Felt easy</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-[#2f6a4f]">{knew}</dd>
                </div>
                <div className="rounded-[1.5rem] bg-peach-100/80 px-4 py-5">
                  <dt className="text-xs font-bold text-[#a1552c]">To practice</dt>
                  <dd className="mt-1 font-display text-3xl font-bold text-peach-600">
                    {trickyCards.length}
                  </dd>
                </div>
              </dl>

              {trickyCards.length > 0 ?
            <p className="mt-4 rounded-[1.25rem] bg-cream-100/90 px-4 py-3 text-sm font-semibold text-ink-soft">
                  Tricky ones: {trickyCards.map((item) => item.word).join(' · ')}
                </p> :
            null}

              <div className="mt-7 space-y-3">
                {trickyCards.length > 0 ?
              <motion.button
                type="button"
                onClick={() => startRound(trickyCards)}
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 620, damping: 18 }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-peach-500 px-6 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                    <RefreshCwIcon className="h-5 w-5" aria-hidden="true" />
                    Review the {trickyCards.length} tricky{' '}
                    {trickyCards.length === 1 ? 'word' : 'words'}
                  </motion.button> :
              null}

                <motion.button
                type="button"
                onClick={() => startRound(vocabularyItems)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 620, damping: 20 }}
                className="gk-well flex w-full items-center justify-center gap-2 rounded-full bg-cream-100/90 px-6 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                  <SparklesIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
                  Review all {vocabularyItems.length} words
                </motion.button>

                <button
                type="button"
                onClick={() => navigate('/learn/today')}
                className="w-full rounded-full px-6 py-3 font-display text-sm font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                  Back to today&apos;s sections
                </button>
              </div>
            </motion.section>
          }
        </AnimatePresence>
      </div>
    </main>);

}