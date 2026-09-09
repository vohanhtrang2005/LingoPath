import type { KnowledgeItem, VocabularyLessonMeta } from '../types/vocabulary';

export const vocabularyLesson: VocabularyLessonMeta = {
  day: 24,
  level: 'JLPT N5',
  title: 'Ordering at a café',
  section: 'Vocabulary'
};

export const vocabularyItems: KnowledgeItem[] = [
{
  id: 'v-1',
  word: 'メニュー',
  reading: 'menyū',
  meaning: 'menu',
  example: 'メニューをお願いします。',
  exampleMeaning: 'The menu, please.',
  note: 'A katakana loanword — stretch the ゅー sound.',
  source: { label: 'Minna no Nihongo · L13' }
},
{
  id: 'v-2',
  word: '飲み物',
  reading: 'nomimono',
  meaning: 'drink, beverage',
  example: '飲み物は何にしますか。',
  exampleMeaning: 'What would you like to drink?',
  note: 'From 飲む (to drink) + 物 (thing).',
  source: { label: 'Core 2k · #418' }
},
{
  id: 'v-3',
  word: 'お願いします',
  reading: 'onegaishimasu',
  meaning: 'please (when requesting)',
  example: 'コーヒーを一つお願いします。',
  exampleMeaning: 'One coffee, please.',
  note: 'The friendliest way to order anything.',
  source: { label: 'Genki I · Ch. 2' }
},
{
  id: 'v-4',
  word: '一つ',
  reading: 'hitotsu',
  meaning: 'one (general counter)',
  example: 'ケーキを一つください。',
  exampleMeaning: 'One cake, please.',
  note: 'Works for almost anything when you forget the counter.',
  source: { label: 'Minna no Nihongo · L11' }
},
{
  id: 'v-5',
  word: '温かい',
  reading: 'atatakai',
  meaning: 'warm (to the touch)',
  example: '温かいお茶をください。',
  exampleMeaning: 'Warm tea, please.',
  note: 'Cafés often ask ホット or アイス instead.',
  source: { label: 'Core 2k · #602' }
},
{
  id: 'v-6',
  word: '会計',
  reading: 'kaikei',
  meaning: 'the bill, checkout',
  example: 'お会計をお願いします。',
  exampleMeaning: 'The bill, please.',
  note: 'Add the polite お at the front in shops.',
  source: { label: 'Genki I · Ch. 4' }
},
{
  id: 'v-7',
  word: '席',
  reading: 'seki',
  meaning: 'seat',
  example: 'この席はあいていますか。',
  exampleMeaning: 'Is this seat free?',
  note: 'あいていますか literally asks "is it open?".',
  source: { label: 'Minna no Nihongo · L13' }
},
{
  id: 'v-8',
  word: '持ち帰り',
  reading: 'mochikaeri',
  meaning: 'takeaway, to go',
  example: '持ち帰りでお願いします。',
  exampleMeaning: 'To go, please.',
  note: 'Staff may ask 店内で？ (for here?) instead.',
  source: { label: 'Core 2k · #1104' }
}];