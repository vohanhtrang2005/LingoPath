import React from 'react';
import { languages, levelsByLanguage } from '../data/languages';
import { ChoiceCard } from './ChoiceCard';
import { StepHeader } from './StepHeader';

interface StepLanguageProps {
  languageId: string | null;
  levelId: string | null;
  onLanguageChange: (languageId: string) => void;
  onLevelChange: (levelId: string) => void;
}

export function StepLanguage({
  languageId,
  levelId,
  onLanguageChange,
  onLevelChange
}: StepLanguageProps) {
  const levels = languageId ? levelsByLanguage[languageId] ?? [] : [];
  const selectedLanguage = languages.find((item) => item.id === languageId);

  return (
    <div>
      <StepHeader
        step={1}
        total={3}
        title="What are we learning?"
        subtitle="Two quick taps and we know where your path begins." />
      

      <section className="mt-8" aria-labelledby="language-label">
        <h2
          id="language-label"
          className="font-display text-base font-semibold text-ink-900">
          
          Which language are we walking toward?
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {languages.map((language) =>
          <ChoiceCard
            key={language.id}
            selected={language.id === languageId}
            onSelect={() => onLanguageChange(language.id)}
            eyebrow={language.code}
            title={language.name}
            blurb={language.blurb}
            tag={language.nativeTag} />

          )}
        </div>
      </section>

      <section className="mt-9" aria-labelledby="level-label">
        <h2
          id="level-label"
          className="font-display text-base font-semibold text-ink-900">
          
          Where would you like to arrive?
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          {selectedLanguage ?
          `These are the ${selectedLanguage.name} levels we can plan around.` :
          'Pick a language first and your level options will appear here.'}
        </p>

        {levels.length > 0 ?
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {levels.map((level) =>
          <ChoiceCard
            key={level.id}
            selected={level.id === levelId}
            onSelect={() => onLevelChange(level.id)}
            eyebrow={<span aria-hidden="true">{level.emoji}</span>}
            title={level.title}
            blurb={level.blurb}
            tag={level.scale} />

          )}
          </div> :

        <div className="mt-4 rounded-4xl border-2 border-dashed border-peach-200 bg-peach-50/70 p-8 text-center">
            <p className="text-sm font-semibold text-ink-500">
              Waiting on a language <span aria-hidden="true">🍡</span>
            </p>
          </div>
        }
      </section>
    </div>);

}