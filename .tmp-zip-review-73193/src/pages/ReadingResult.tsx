import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, ShieldCheckIcon, SproutIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { ResultQuestionCard } from '../components/reading/ResultQuestionCard';
import { PostReadingPanel } from '../components/reading/PostReadingPanel';
import {
  postReadingExplanations,
  readingPassages,
  readingQuestions,
  readingSection } from
'../data/reading';
import { useReadingSession } from '../contexts/ReadingSessionContext';

const EASE = [0.23, 1, 0.32, 1] as const;

export function ReadingResult() {
  const navigate = useNavigate();
  const { submitted, answers, resultOf, correctCount, total, weakKnowledgeItemIds, reset } =
  useReadingSession();

  if (!submitted) return <Navigate to="/learn/today/reading" replace />;

  const score = Math.round(correctCount / total * 100);

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/learn/today')}
          className="flex items-center gap-2 rounded-full bg-white/75 px-4 py-2.5 font-display text-sm font-bold text-ink backdrop-blur transition-colors duration-150 ease-out hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to daily lesson
        </button>

        {/* Score */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 text-center backdrop-blur-xl sm:p-9">
          
          <span className="rounded-full bg-peach-500 px-3 py-1 font-display text-xs font-bold text-white">
            Day {readingSection.dayIndex} · {readingSection.title} result
          </span>

          <p className="mt-5 font-display text-5xl font-bold leading-none text-ink">
            {correctCount}
            <span className="text-2xl text-ink-faint">/{total}</span>
          </p>
          <p className="mt-2 font-display text-sm font-bold text-peach-600">{score}% correct</p>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-cream-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.1 }}
              className="h-full rounded-full bg-mint-400" />
            
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Scoring is checked directly against the approved answers. Your progress and review
            schedule have been updated.
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mint-100 px-3.5 py-2 text-xs font-bold text-[#38795c]">
            <ShieldCheckIcon className="h-4 w-4" aria-hidden="true" />
            Source-backed items
          </span>
        </motion.header>

        {/* Per question */}
        <section aria-labelledby="answers-title" className="mt-8">
          <h2 id="answers-title" className="font-display text-xl font-bold text-ink">
            Your answers
          </h2>
          <ul className="mt-5 space-y-4">
            {readingQuestions.map((question, index) =>
            <ResultQuestionCard
              key={question.id}
              question={question}
              number={index + 1}
              studentAnswer={answers[question.id] ?? ''}
              correct={resultOf(question.id)}
              index={index} />

            )}
          </ul>
        </section>

        {/* Post-reading explanations */}
        <section aria-labelledby="explain-title" className="mt-10">
          <h2 id="explain-title" className="font-display text-xl font-bold text-ink">
            What was inside the passages
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Revealed after submission so the reading itself stayed a real test.
          </p>

          <div className="mt-5 space-y-5">
            {readingPassages.map((passage, index) => {
              const explanation = postReadingExplanations.find(
                (item) => item.passageId === passage.id
              );
              if (!explanation) return null;
              return (
                <PostReadingPanel
                  key={passage.id}
                  passage={passage}
                  explanation={explanation}
                  index={index} />);


            })}
          </div>
        </section>

        {/* Weak items */}
        <section
          aria-labelledby="weak-title"
          className="mt-8 rounded-[1.75rem] bg-cream-100/90 px-6 py-5">
          
          <h2
            id="weak-title"
            className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            
            <SproutIcon className="h-4 w-4 text-mint-400" aria-hidden="true" />
            Coming back sooner in your reviews
          </h2>

          {weakKnowledgeItemIds.length > 0 ?
          <div className="mt-3 flex flex-wrap gap-2">
              {weakKnowledgeItemIds.map((id) =>
            <span
              key={id}
              className="rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-ink-soft">
              
                  KnowledgeItem · {id}
                </span>
            )}
            </div> :

          <p className="mt-2 text-sm text-ink-soft">
              Nothing flagged this time — every question was answered correctly.
            </p>
          }
        </section>

        {/* Navigation */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => {
              reset();
              navigate('/learn/today/reading');
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 20 }}
            className="gk-well flex flex-1 items-center justify-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Read it again
          </motion.button>

          <motion.button
            type="button"
            onClick={() => navigate('/learn/today')}
            whileHover={{ y: -2, scale: 1.015 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 620, damping: 18 }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-peach-500 px-6 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.9)] transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
            
            Continue to next section
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        </div>
      </div>
    </main>);

}