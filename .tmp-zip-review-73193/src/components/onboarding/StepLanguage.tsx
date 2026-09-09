import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChoiceCard } from './ChoiceCard';
import { languageOptions, levelsByLanguage } from '../../data/onboardingOptions';
import type { StudyPlanDraft } from '../../types/plan';

const EASE = [0.23, 1, 0.32, 1] as const;

interface StepLanguageProps {
  draft: StudyPlanDraft;
  onChange: <K extends keyof StudyPlanDraft>(key: K, value: StudyPlanDraft[K]) => void;
}

export function StepLanguage({ draft, onChange }: StepLanguageProps) {
  const levels = draft.language ? levelsByLanguage[draft.language] ?? [] : [];
  const languageName = languageOptions.find((option) => option.id === draft.language)?.name;

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-display text-base font-bold text-ink">
          Which language are we walking toward?
        </legend>
        <div role="radiogroup" className="mt-4 grid gap-3 sm:grid-cols-2">
          {languageOptions.map((option) =>
          <ChoiceCard
            key={option.id}
            emoji={option.emoji}
            title={option.name}
            subtitle={option.blurb}
            meta={option.native}
            selected={draft.language === option.id}
            onSelect={() => onChange('language', option.id)} />

          )}
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-base font-bold text-ink">
          Where would you like to arrive?
        </legend>
        <p className="mt-1 text-sm text-ink-soft">
          {languageName ?
          `The levels that matter for ${languageName}.` :
          'Pick a language above and your level options will appear here.'}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {levels.length > 0 ?
          <motion.div
            key={draft.language}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: EASE }}
            role="radiogroup"
            className="mt-4 grid gap-3 sm:grid-cols-2">
            
              {levels.map((level) =>
            <ChoiceCard
              key={level.id}
              emoji={level.emoji}
              title={level.label}
              subtitle={level.blurb}
              selected={draft.level === level.id}
              onSelect={() => onChange('level', level.id)} />

            )}
            </motion.div> :

          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="gk-well mt-4 rounded-[1.75rem] bg-cream-100/80 px-5 py-6 text-center text-sm font-semibold text-ink-faint">
            
              Your goal levels are waiting just behind that choice ✨
            </motion.p>
          }
        </AnimatePresence>
      </fieldset>
    </div>);

}