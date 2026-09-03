import type { VocabularyPracticeItem } from '../types/vocabulary';

/**
 * Approved, source-backed practice items for today's vocabulary.
 * Shape mirrors the backend PracticeItem record — swap for a fetch later.
 */
export const vocabularyPracticeItems: VocabularyPracticeItem[] = [
{
  id: 'p-1',
  practiceType: 'meaning',
  prompt: 'What does 飲み物 mean?',
  choices: ['drink, beverage', 'menu', 'seat', 'the bill'],
  correctAnswer: 'drink, beverage',
  explanation: '飲む (to drink) + 物 (thing) → something you drink.',
  relatedKnowledgeItemIds: ['v-2'],
  sourceReference: 'Core 2k · #418',
  evidenceText: '飲み物は何にしますか。— What would you like to drink?'
},
{
  id: 'p-2',
  practiceType: 'word-in-sentence',
  prompt: 'Which word completes a polite order? ケーキを一つ＿＿。',
  choices: ['お願いします', '会計', '席', '持ち帰り'],
  correctAnswer: 'お願いします',
  explanation: 'Requests end with お願いします — "one cake, please".',
  relatedKnowledgeItemIds: ['v-3', 'v-4'],
  sourceReference: 'Genki I · Ch. 2',
  evidenceText: 'コーヒーを一つお願いします。— One coffee, please.'
},
{
  id: 'p-3',
  practiceType: 'fill-blank',
  prompt: 'Type the missing word: お＿＿をお願いします。(asking for the bill)',
  correctAnswer: '会計',
  explanation: 'お会計をお願いします is the standard way to ask for the bill.',
  relatedKnowledgeItemIds: ['v-6'],
  sourceReference: 'Genki I · Ch. 4',
  evidenceText: 'お会計をお願いします。— The bill, please.'
},
{
  id: 'p-4',
  practiceType: 'match',
  prompt: 'Match each word with its meaning.',
  pairs: [
  { left: 'メニュー', right: 'menu' },
  { left: '席', right: 'seat' },
  { left: '持ち帰り', right: 'takeaway' }],

  correctAnswer: '',
  explanation: 'All three appear in the café dialogue on this page of the book.',
  relatedKnowledgeItemIds: ['v-1', 'v-7', 'v-8'],
  sourceReference: 'Minna no Nihongo · L13',
  evidenceText: 'この席はあいていますか。/ 持ち帰りでお願いします。'
},
{
  id: 'p-5',
  practiceType: 'reading',
  prompt: 'How is 温かい read?',
  choices: ['atatakai', 'atsui', 'nurui', 'tsumetai'],
  correctAnswer: 'atatakai',
  explanation: '温かい (atatakai) is warm to the touch; 熱い (atsui) is hot.',
  relatedKnowledgeItemIds: ['v-5'],
  sourceReference: 'Core 2k · #602',
  evidenceText: '温かいお茶をください。— Warm tea, please.'
}];