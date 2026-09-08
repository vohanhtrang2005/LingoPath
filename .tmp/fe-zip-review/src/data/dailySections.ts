import type { DailySection } from '../types/lesson';

/**
 * Today's section deck. Sections carrying `onlyForLanguage` are skipped
 * unless the learner's course matches — Kanji is Japanese-only.
 * Every section is open: learners choose their own order.
 */
export const dailySections: DailySection[] = [
{
  id: 'vocabulary',
  emoji: '📖',
  title: 'Vocabulary',
  subtitle: '12 café words: メニュー, お願いします, おいしい…',
  minutes: 6,
  status: 'done'
},
{
  id: 'grammar',
  emoji: '🧩',
  title: 'Grammar',
  subtitle: 'Polite requests with 〜をください',
  minutes: 8,
  status: 'in-progress',
  progress: 40
},
{
  id: 'kanji',
  emoji: '⛩️',
  title: 'Kanji',
  subtitle: 'Three characters you just met: 食 · 飲 · 店',
  minutes: 10,
  status: 'todo',
  onlyForLanguage: 'Japanese'
},
{
  id: 'reading',
  emoji: '📚',
  title: 'Reading',
  subtitle: 'A short café menu, top to bottom',
  minutes: 7,
  status: 'todo'
},
{
  id: 'listening',
  emoji: '🎧',
  title: 'Listening',
  subtitle: 'Ordering at the counter, twice — slow then natural',
  minutes: 5,
  status: 'todo'
},
{
  id: 'review',
  emoji: '🧠',
  title: 'Review',
  subtitle: 'Spaced repetition of everything above',
  minutes: 4,
  status: 'todo'
}];