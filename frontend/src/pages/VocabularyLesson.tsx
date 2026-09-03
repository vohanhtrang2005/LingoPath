import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, LayersIcon, SearchIcon, SparklesIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { VocabularyCard } from '../components/vocabulary/VocabularyCard';
import { vocabularyItems, vocabularyLesson } from '../data/vocabulary';
import { useVocabularyProgress } from '../contexts/VocabularyProgressContext';

const EASE = [0.23, 1, 0.32, 1] as const;

type Filter = 'all' | 'new' | 'practice' | 'known';

const FILTERS: {id: Filter;label: string;}[] = [
{ id: 'all', label: 'All' },
{ id: 'new', label: 'To learn' },
{ id: 'practice', label: 'Practicing' },
{ id: 'known', label: 'Known' }];


export function VocabularyLesson() {
  const navigate = useNavigate();
  const { statusOf, knownCount } = useVocabularyProgress();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return vocabularyItems.filter((item) => {
      const matchesQuery =
      needle === '' ||
      [item.word, item.reading, item.meaning, item.example].some((field) =>
      field.toLowerCase().includes(needle)
      );
      const matchesFilter = filter === 'all' || statusOf(item.id) === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter, statusOf]);

  const progress = Math.round(knownCount / vocabularyItems.length * 100);

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/learn/today')}
          className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Today&apos;s sections
        </button>

        {/* Lesson header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
              Day {vocabularyLesson.day} · {vocabularyLesson.section}
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 font-display text-xs font-bold text-[#3b6a94]">
              {vocabularyLesson.level}
            </span>
          </div>

          <h1 className="mt-4 font-display text-[1.85rem] font-bold leading-snug text-ink sm:text-[2.15rem]">
            {vocabularyLesson.title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Read through the words, then a short practice round updates your progress
            automatically.
          </p>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-sm font-bold text-ink">
                {knownCount} of {vocabularyItems.length} words feel comfortable
              </p>
              <p className="text-xs font-semibold text-ink-soft">{progress}%</p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: EASE }}
                className="h-full rounded-full bg-mint-400" />
              
            </div>
          </div>

          <motion.button
            type="button"
            onClick={() => navigate('/learn/today/vocabulary/flashcards')}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 620, damping: 18 }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-display text-sm font-bold text-peach-600 shadow-[0_14px_28px_-18px_rgba(150,110,86,0.9)] transition-colors duration-200 ease-out hover:bg-cream-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            <LayersIcon className="h-4 w-4" aria-hidden="true" />
            Flashcard mode · review only
          </motion.button>
        </motion.header>

        {/* Search + filters */}
        <div className="mt-7">
          <label htmlFor="vocab-search" className="sr-only">
            Search this word list
          </label>
          <div className="gk-well flex items-center gap-3 rounded-4xl bg-cream-100/90 px-4 py-3">
            <SearchIcon className="h-5 w-5 shrink-0 text-ink-faint" aria-hidden="true" />
            <input
              id="vocab-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a word, reading or meaning…"
              className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" />
            
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {FILTERS.map((option) => {
              const active = filter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(option.id)}
                  className={`rounded-full px-4 py-2 font-display text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
                  active ?
                  'bg-peach-500 text-white' :
                  'bg-white/80 text-ink-soft hover:bg-white hover:text-ink'}`
                  }>
                  
                  {option.label}
                </button>);

            })}
          </div>
        </div>

        {/* Word list */}
        {visibleItems.length > 0 ?
        <ul className="mt-5 space-y-4">
            {visibleItems.map((item, index) =>
          <VocabularyCard
            key={item.id}
            item={item}
            status={statusOf(item.id)}
            index={index} />

          )}
          </ul> :

        <p className="mt-6 rounded-[1.75rem] bg-white/80 px-6 py-8 text-center text-sm font-semibold text-ink-soft">
            Nothing matches that yet 🍃
          </p>
        }

        {/* Practice lives on its own screen — theory stays calm */}
        <motion.button
          type="button"
          onClick={() => navigate('/learn/today/vocabulary/practice')}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 620, damping: 18 }}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-peach-500 px-7 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.9)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
          
          <SparklesIcon className="h-5 w-5" aria-hidden="true" />
          Practice these words
        </motion.button>

        <p className="mt-3 text-center text-xs font-semibold text-ink-faint">
          Source-backed questions from your book — results update your review schedule.
        </p>
      </div>
    </main>);

}