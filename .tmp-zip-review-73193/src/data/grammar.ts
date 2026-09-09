import type { GrammarKnowledgeItem, GrammarLessonMeta } from '../types/grammar';

export const grammarLesson: GrammarLessonMeta = {
  dailyLessonId: 'dl-024',
  dayIndex: 24,
  lessonDate: '2026-09-02',
  sectionId: 'ds-024-grammar',
  sectionTitle: 'Grammar',
  language: 'Japanese',
  levelSystem: 'JLPT',
  levelCode: 'N5'
};

export const grammarItems: GrammarKnowledgeItem[] = [
{
  id: 'g-1',
  language: 'ja',
  levelSystem: 'JLPT',
  levelCode: 'N5',
  type: 'GRAMMAR',
  status: 'APPROVED',
  orderIndex: 1,
  difficulty: 1,
  pattern: '〜をください',
  reading: '〜を ください',
  meaning: 'Please give me ~ / I would like ~',
  formation: 'noun + を + ください',
  explanation:
  'The everyday way to order or request an object. Attach を to the thing you want, then ください.',
  examples: [
  {
    sentence: 'コーヒーを一つください。',
    reading: 'kōhī o hitotsu kudasai.',
    translation: 'One coffee, please.',
    note: 'The counter 一つ sits between the noun and ください.'
  },
  {
    sentence: '温かいお茶をください。',
    reading: 'atatakai ocha o kudasai.',
    translation: 'Warm tea, please.'
  }],

  usageNotes: [
  'Use for things, not actions — for actions use 〜てください.',
  'お願いします is slightly softer and works when pointing at a menu.'],

  commonMistakes: [
  {
    wrong: 'コーヒーはください。',
    right: 'コーヒーをください。',
    why: 'は marks the topic; the requested object takes を.'
  }],

  relatedVocabulary: [
  { word: 'お茶', reading: 'ocha', meaning: 'tea' },
  { word: '一つ', reading: 'hitotsu', meaning: 'one (general counter)' }],

  supportNotes: [
  {
    term: 'を (particle)',
    levelCode: 'N5',
    explanation: 'Marks the direct object — the thing being requested or acted on.'
  }],

  sourceReferences: [
  {
    label: 'Minna no Nihongo · L2, p.28',
    evidenceText: 'この本をください。— Please give me this book.'
  }]

},
{
  id: 'g-2',
  language: 'ja',
  levelSystem: 'JLPT',
  levelCode: 'N5',
  type: 'GRAMMAR',
  status: 'APPROVED',
  orderIndex: 2,
  difficulty: 2,
  pattern: '〜にします',
  reading: '〜に します',
  meaning: "I'll go with ~ / I decide on ~",
  formation: 'noun + に + します',
  explanation:
  'Used when choosing between options — deciding on one item from a menu or a list.',
  examples: [
  {
    sentence: '飲み物はコーヒーにします。',
    reading: 'nomimono wa kōhī ni shimasu.',
    translation: "For drinks, I'll go with coffee.",
    note: 'は sets "drinks" as the topic, then に marks the choice.'
  },
  {
    sentence: '持ち帰りにします。',
    reading: 'mochikaeri ni shimasu.',
    translation: "I'll take it to go."
  }],

  usageNotes: [
  'にします = a decision now; がいいです = a preference.',
  'Staff often ask 何にしますか — "what will you have?".'],

  commonMistakes: [
  {
    wrong: 'コーヒーをします。',
    right: 'コーヒーにします。',
    why: 'The choice is marked with に, not を.'
  }],

  relatedVocabulary: [
  { word: '飲み物', reading: 'nomimono', meaning: 'drink' },
  { word: '持ち帰り', reading: 'mochikaeri', meaning: 'takeaway' }],

  supportNotes: [
  {
    term: 'は (topic particle)',
    levelCode: 'N5',
    explanation: 'Sets what the sentence is about before the choice is stated.'
  }],

  sourceReferences: [
  {
    label: 'Genki I · Ch. 4, p.101',
    evidenceText: 'わたしは天ぷらにします。— I will have tempura.'
  }]

},
{
  id: 'g-3',
  language: 'ja',
  levelSystem: 'JLPT',
  levelCode: 'N5',
  type: 'GRAMMAR',
  status: 'APPROVED',
  orderIndex: 3,
  difficulty: 3,
  pattern: '〜てもいいですか',
  reading: '〜ても いいですか',
  meaning: 'May I ~? / Is it alright if I ~?',
  formation: 'verb て-form + も + いいですか',
  explanation:
  'Asks permission politely. Common in shops and cafés when checking whether something is allowed.',
  examples: [
  {
    sentence: 'この席に座ってもいいですか。',
    reading: 'kono seki ni suwatte mo ii desu ka.',
    translation: 'May I sit at this seat?',
    note: 'Answer: はい、どうぞ / すみません、ちょっと…'
  },
  {
    sentence: '写真を撮ってもいいですか。',
    reading: 'shashin o totte mo ii desu ka.',
    translation: 'May I take a photo?'
  }],

  usageNotes: [
  'A soft refusal is usually ちょっと… rather than a direct no.',
  'Drop ですか with friends: 座ってもいい？'],

  commonMistakes: [
  {
    wrong: '座るもいいですか。',
    right: '座ってもいいですか。',
    why: 'The verb must be in て-form before もいいですか.'
  }],

  relatedVocabulary: [{ word: '席', reading: 'seki', meaning: 'seat' }],
  supportNotes: [
  {
    term: 'て-form',
    levelCode: 'N5',
    explanation:
    'Support: 座る → 座って. Group 1 verbs ending in る become って before もいいですか.'
  },
  {
    term: 'に (location of existence)',
    levelCode: 'N5',
    explanation: 'Support: 席に座る — に marks where you settle, not を.'
  }],

  sourceReferences: [
  {
    label: 'Minna no Nihongo · L15, p.122',
    evidenceText: '写真を撮ってもいいですか。— May I take a photo?'
  }]

}];