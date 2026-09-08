import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, BookOpenTextIcon, SendIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { ReadingQuestion } from '../components/reading/ReadingQuestion';
import { readingPassages, readingQuestions, readingSection } from '../data/reading';
import { useReadingSession } from '../contexts/ReadingSessionContext';
import { useVocabularyProgress } from '../contexts/VocabularyProgressContext';
import { useGrammarProgress } from '../contexts/GrammarProgressContext';

const EASE = [0.23, 1, 0.32, 1] as const;

export function ReadingPractice() {
  const navigate = useNavigate();
  const { answers, setAnswer, submit, answeredCount, total, resultOf } = useReadingSession();
  const { recordPractice: recordVocabulary } = useVocabularyProgress();
  const { recordPractice: recordGrammar } = useGrammarProgress();

  const [passageIndex, setPassageIndex] = useState(0);
  const passage = readingPassages[passageIndex];
  const questions = readingQuestions.filter((question) => question.passageId === passage.id);

  const handleSubmit = () => {
    // Deterministic scoring first, then push the outcome into learning progress.
    readingQuestions.forEach((question) => {
      const correct = resultOf(question.id);
      const vocabularyIds = question.relatedKnowledgeItemIds.filter((id) => id.startsWith('v-'));
      const grammarIds = question.relatedKnowledgeItemIds.filter((id) => id.startsWith('g-'));
      if (vocabularyIds.length > 0) recordVocabulary(vocabularyIds, correct);
      if (grammarIds.length > 0) recordGrammar(grammarIds, correct);
    });
    submit();
    navigate('/learn/today/reading/result');
  };

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate('/learn/today')}
          className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to daily lesson
        </button>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-8">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
              Day {readingSection.dayIndex} · {readingSection.title}
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 font-display text-xs font-bold text-[#3b6a94]">
              {readingSection.language} · {readingSection.levelSystem} {readingSection.levelCode}
            </span>
          </div>

          <h1 className="mt-4 font-display text-[1.85rem] font-bold leading-snug text-ink sm:text-[2.15rem]">
            Read, then answer
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Work through the passage on your own. Vocabulary, grammar and explanations appear once
            you submit.
          </p>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-sm font-bold text-ink">
                {answeredCount} of {total} questions answered
              </p>
              <p className="text-xs font-semibold text-ink-soft">
                Passage {passageIndex + 1} of {readingPassages.length}
              </p>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
              <motion.div
                initial={false}
                animate={{ width: `${answeredCount / total * 100}%` }}
                transition={{ duration: 0.3, ease: EASE }}
                className="h-full rounded-full bg-peach-400" />
              
            </div>
          </div>
        </motion.header>

        {/* Passage navigation */}
        {readingPassages.length > 1 ?
        <div className="mt-6 flex flex-wrap items-center gap-2">
            {readingPassages.map((item, index) => {
            const active = index === passageIndex;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setPassageIndex(index)}
                className={`rounded-full px-4 py-2 font-display text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
                active ?
                'bg-peach-500 text-white' :
                'bg-white/80 text-ink-soft hover:bg-white hover:text-ink'}`
                }>
                
                  Passage {index + 1}
                </button>);

          })}
          </div> :
        null}

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          {/* Passage */}
          <motion.article
            key={passage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            aria-labelledby="passage-title"
            className="gk-card-shadow rounded-[2.25rem] border border-white/70 bg-white/85 p-6 backdrop-blur-xl sm:p-7 lg:sticky lg:top-6">
            
            <p className="flex items-center gap-1.5 font-display text-xs font-bold uppercase tracking-wide text-ink-faint">
              <BookOpenTextIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {passage.topic}
            </p>
            <h2 id="passage-title" className="mt-2 font-display text-xl font-bold text-ink">
              {passage.title}
            </h2>

            <div className="mt-4 space-y-3 rounded-[1.5rem] bg-cream-100/80 px-5 py-5">
              {passage.passageText.split('\n').map((paragraph) =>
              <p key={paragraph} className="text-[16px] leading-8 text-ink">
                  {paragraph}
                </p>
              )}
            </div>
          </motion.article>

          {/* Questions */}
          <section aria-labelledby="questions-title">
            <h2 id="questions-title" className="font-display text-lg font-bold text-ink">
              Questions for passage {passageIndex + 1}
            </h2>

            <ul className="mt-4 space-y-4">
              {questions.map((question) =>
              <ReadingQuestion
                key={question.id}
                question={question}
                number={readingQuestions.indexOf(question) + 1}
                answer={answers[question.id] ?? ''}
                onAnswer={(value) => setAnswer(question.id, value)} />

              )}
            </ul>

            {passageIndex < readingPassages.length - 1 ?
            <motion.button
              type="button"
              onClick={() => setPassageIndex((prev) => prev + 1)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 620, damping: 20 }}
              className="gk-well mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
              
                Next passage
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </motion.button> :
            null}
          </section>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <motion.button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            whileHover={answeredCount === 0 ? undefined : { y: -2, scale: 1.015 }}
            whileTap={answeredCount === 0 ? undefined : { scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 18 }}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 font-display text-base font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            answeredCount === 0 ?
            'cursor-not-allowed bg-peach-200' :
            'bg-peach-500 shadow-[0_18px_30px_-14px_rgba(233,110,63,0.9)] hover:bg-peach-400'}`
            }>
            
            <SendIcon className="h-5 w-5" aria-hidden="true" />
            Submit answers
          </motion.button>

          <p className="mt-3 text-center text-xs font-semibold text-ink-faint">
            {answeredCount < total ?
            `${total - answeredCount} question${total - answeredCount === 1 ? '' : 's'} still unanswered` :
            'All questions answered'}
          </p>
        </div>
      </div>
    </main>);

}