import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, LoaderCircleIcon, WandSparklesIcon } from 'lucide-react';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { WavyProgress } from '../components/onboarding/WavyProgress';
import { StepLanguage } from '../components/onboarding/StepLanguage';
import { StepSchedule } from '../components/onboarding/StepSchedule';
import { StepNotes } from '../components/onboarding/StepNotes';
import { PlanSummary } from '../components/onboarding/PlanSummary';
import { STEP_TITLES, useStudyPlanWizard } from '../hooks/useStudyPlanWizard';

const EASE = [0.23, 1, 0.32, 1] as const;

const STEP_SUBTITLES = [
'Two quick taps and we know where your path begins.',
'Set a rhythm you can actually keep — you can change it any time.',
'The more you share, the smarter your daily lessons get.'];


export function Onboarding() {
  const navigate = useNavigate();
  const {
    step,
    draft,
    update,
    canContinue,
    next,
    back,
    generate,
    generating,
    planReady,
    editPlan,
    progress
  } = useStudyPlanWizard();

  const isLast = step === 2;

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white shadow-[0_12px_24px_-14px_rgba(150,110,86,0.8)]">
            <span className="font-display text-base font-bold text-peach-600">学</span>
          </span>
          <span className="font-display text-sm font-bold tracking-[0.18em] text-[#8a5638]">
            LingoPath
          </span>
        </div>

        <div className="gk-card-shadow mt-6 rounded-[2.5rem] border border-white/70 bg-white/80 p-6 backdrop-blur-xl sm:p-9">
          {planReady ?
          <PlanSummary
            draft={draft}
            onEdit={editPlan}
            onConfirm={() => navigate('/learn')} /> :


          <>
          <WavyProgress value={progress} step={step} totalSteps={3} />

          <div className="mt-7">
            <p className="font-display text-sm font-semibold text-peach-500">
              Step {step + 1} of 3
            </p>
            <h1 className="mt-1 font-display text-[1.75rem] font-bold leading-snug text-ink sm:text-[2rem]">
              {STEP_TITLES[step]}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              {STEP_SUBTITLES[step]}
            </p>
          </div>

          <div className="mt-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.24, ease: EASE }}>
                  
                {step === 0 ? <StepLanguage draft={draft} onChange={update} /> : null}
                {step === 1 ? <StepSchedule draft={draft} onChange={update} /> : null}
                {step === 2 ? <StepNotes draft={draft} onChange={update} /> : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-9 flex items-center gap-3 border-t border-cream-200 pt-6">
            {step > 0 ?
              <motion.button
                type="button"
                onClick={back}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 620, damping: 20 }}
                className="gk-well flex items-center gap-2 rounded-full bg-cream-100/90 px-5 py-3.5 font-display text-sm font-bold text-ink transition-colors duration-200 ease-out hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
                
                <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
                Back
              </motion.button> :

              <button
                type="button"
                onClick={() => navigate('/learn')}
                className="rounded-full px-3 py-3 font-display text-sm font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                Skip for now
              </button>
              }

            <div className="ml-auto flex items-center gap-3">
              {!canContinue ?
                <p className="hidden text-xs font-semibold text-ink-faint sm:block">
                  {step === 0 ? 'Pick a language and a goal ✨' : 'Fill in the dates above ✨'}
                </p> :
                null}

              {isLast ?
                <motion.button
                  type="button"
                  onClick={generate}
                  disabled={generating}
                  whileHover={generating ? undefined : { y: -2, scale: 1.02 }}
                  whileTap={generating ? undefined : { scale: 0.96 }}
                  animate={
                  generating ?
                  {} :
                  {
                    boxShadow: [
                    '0 18px 30px -14px rgba(233,110,63,0.85)',
                    '0 22px 44px -12px rgba(233,110,63,0.95)',
                    '0 18px 30px -14px rgba(233,110,63,0.85)']

                  }
                  }
                  transition={{
                    boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                    default: { type: 'spring', stiffness: 620, damping: 18 }
                  }}
                  className="flex items-center gap-2 rounded-full bg-peach-500 px-7 py-4 font-display text-base font-bold text-white transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 disabled:cursor-default">
                  
                  {generating ?
                  <>
                      <LoaderCircleIcon className="h-5 w-5 animate-spin" aria-hidden="true" />
                      Crafting your plan…
                    </> :

                  <>
                      <WandSparklesIcon className="h-5 w-5" aria-hidden="true" />
                      Generate My Plan
                    </>
                  }
                </motion.button> :

                <motion.button
                  type="button"
                  onClick={next}
                  disabled={!canContinue}
                  whileHover={canContinue ? { y: -2, scale: 1.015 } : undefined}
                  whileTap={canContinue ? { scale: 0.96 } : undefined}
                  transition={{ type: 'spring', stiffness: 620, damping: 18 }}
                  className={`flex items-center gap-2 rounded-full px-7 py-4 font-display text-base font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
                  canContinue ?
                  'bg-peach-500 shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] hover:bg-peach-400' :
                  'cursor-not-allowed bg-peach-200'}`
                  }>
                  
                  Next
                  <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                }
            </div>
          </div>
            </>
          }
        </div>

        <p className="mt-6 text-center text-xs font-semibold text-ink-faint">
          You can reshape this plan any time from your profile.
        </p>
      </div>
    </main>);

}