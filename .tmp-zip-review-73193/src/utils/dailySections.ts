import type { DailySection } from '../types/lesson';

/** Keeps only the sections that belong to the learner's current language. */
export function sectionsForLanguage(sections: DailySection[], language: string): DailySection[] {
  return sections.filter(
    (section) => !section.onlyForLanguage || section.onlyForLanguage === language
  );
}

export function countDone(sections: DailySection[]): number {
  return sections.filter((section) => section.status === 'done').length;
}