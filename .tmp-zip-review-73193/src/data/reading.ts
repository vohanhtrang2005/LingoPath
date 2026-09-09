import type {
  PostReadingExplanation,
  ReadingKnowledgeItem,
  ReadingPracticeItem,
  ReadingSectionMeta } from
'../types/reading';

export const readingSection: ReadingSectionMeta = {
  id: 'ds-024-reading',
  type: 'READING',
  title: 'Reading',
  orderIndex: 4,
  dayIndex: 24,
  language: 'Japanese',
  levelSystem: 'JLPT',
  levelCode: 'N5'
};

export const readingPassages: ReadingKnowledgeItem[] = [
{
  id: 'r-1',
  type: 'READING',
  title: 'カフェのメニュー',
  topic: 'Café menu',
  difficulty: 2,
  orderIndex: 1,
  passageText:
  'さくらカフェのメニューです。コーヒーは四百円、お茶は三百五十円です。ケーキは一つ四百五十円です。\n午前十時から午後六時まで開いています。持ち帰りもできます。店の中で写真を撮ってもいいですが、大きい声で話さないでください。',
  sourceReferences: [
  {
    label: 'Minna no Nihongo · Reading pack L13, p.44',
    evidenceText: 'さくらカフェのメニューです。コーヒーは四百円、お茶は三百五十円です。'
  }]

},
{
  id: 'r-2',
  type: 'READING',
  title: '田中さんのメモ',
  topic: "A short note to a friend",
  difficulty: 2,
  orderIndex: 2,
  passageText:
  'リンさんへ\n明日の午後三時に、駅の前のさくらカフェで会いましょう。私は温かいお茶にします。リンさんは何にしますか。\nケーキも一つ買いますから、お金は要りません。\n田中',
  sourceReferences: [
  {
    label: 'Genki I · Reading practice Ch.4, p.108',
    evidenceText: '明日の午後三時に、駅の前のカフェで会いましょう。'
  }]

}];


export const readingQuestions: ReadingPracticeItem[] = [
{
  id: 'rq-1',
  passageId: 'r-1',
  practiceType: 'multiple-choice',
  prompt: 'How much is one cake?',
  choices: ['350 yen', '400 yen', '450 yen', '600 yen'],
  correctAnswer: '450 yen',
  explanation: '四百五十円 = 450 yen, and 一つ tells you it is the price for one cake.',
  passageEvidence: 'ケーキは一つ四百五十円です。',
  relatedKnowledgeItemIds: ['v-4'],
  sourceReference: 'Minna no Nihongo · Reading pack L13, p.44',
  evidenceText: 'ケーキは一つ四百五十円です。— One cake is 450 yen.'
},
{
  id: 'rq-2',
  passageId: 'r-1',
  practiceType: 'true-false',
  prompt: 'You can take your order away from this café.',
  choices: ['True', 'False'],
  correctAnswer: 'True',
  explanation: '持ち帰りもできます means takeaway is also possible.',
  passageEvidence: '持ち帰りもできます。',
  relatedKnowledgeItemIds: ['v-8'],
  sourceReference: 'Minna no Nihongo · Reading pack L13, p.44',
  evidenceText: '持ち帰りもできます。— Takeaway is also available.'
},
{
  id: 'rq-3',
  passageId: 'r-1',
  practiceType: 'multiple-choice',
  prompt: 'Which activity is allowed inside the café?',
  choices: ['Taking photos', 'Talking loudly', 'Bringing outside food', 'Staying after 7 pm'],
  correctAnswer: 'Taking photos',
  explanation:
  '写真を撮ってもいいです grants permission, while 話さないでください forbids talking loudly.',
  passageEvidence: '店の中で写真を撮ってもいいですが、大きい声で話さないでください。',
  relatedKnowledgeItemIds: ['g-3'],
  sourceReference: 'Minna no Nihongo · Reading pack L13, p.45',
  evidenceText: '写真を撮ってもいいですか。— May I take a photo?'
},
{
  id: 'rq-4',
  passageId: 'r-2',
  practiceType: 'multiple-choice',
  prompt: 'When does Tanaka want to meet?',
  choices: ['Tomorrow at 3 pm', 'Today at 3 pm', 'Tomorrow at 10 am', 'Tomorrow at 6 pm'],
  correctAnswer: 'Tomorrow at 3 pm',
  explanation: '明日 = tomorrow, 午後三時 = 3 in the afternoon.',
  passageEvidence: '明日の午後三時に、駅の前のさくらカフェで会いましょう。',
  relatedKnowledgeItemIds: ['v-1'],
  sourceReference: 'Genki I · Reading practice Ch.4, p.108',
  evidenceText: '明日の午後三時に会いましょう。— Let’s meet tomorrow at 3 pm.'
},
{
  id: 'rq-5',
  passageId: 'r-2',
  practiceType: 'short-answer',
  prompt: 'Type the drink Tanaka has decided on (in Japanese).',
  correctAnswer: '温かいお茶',
  explanation: '温かいお茶にします states the decision using 〜にします.',
  passageEvidence: '私は温かいお茶にします。',
  relatedKnowledgeItemIds: ['g-2', 'v-5'],
  sourceReference: 'Genki I · Reading practice Ch.4, p.108',
  evidenceText: '私は温かいお茶にします。— I will have warm tea.'
}];


export const postReadingExplanations: PostReadingExplanation[] = [
{
  passageId: 'r-1',
  importantVocabulary: [
  { knowledgeItemId: 'v-8', word: '持ち帰り', reading: 'mochikaeri', meaning: 'takeaway' },
  { knowledgeItemId: 'v-4', word: '一つ', reading: 'hitotsu', meaning: 'one (counter)' }],

  importantGrammar: [
  { knowledgeItemId: 'g-3', pattern: '〜てもいいです', meaning: 'you may ~ / it is allowed' }],

  supportExplanations: [
  {
    term: '〜ないでください',
    levelCode: 'N5',
    explanation: 'Support: a polite prohibition — "please do not ~". 話さないでください = please don’t talk.'
  },
  {
    term: '〜から〜まで',
    levelCode: 'N5',
    explanation: 'Support: from ~ until ~, used here for opening hours (十時から六時まで).'
  }],

  relatedKnowledgeItemIds: ['v-4', 'v-8', 'g-3'],
  evidenceText: '店の中で写真を撮ってもいいですが、大きい声で話さないでください。'
},
{
  passageId: 'r-2',
  importantVocabulary: [
  { knowledgeItemId: 'v-5', word: '温かい', reading: 'atatakai', meaning: 'warm' },
  { knowledgeItemId: 'v-2', word: '飲み物', reading: 'nomimono', meaning: 'drink' }],

  importantGrammar: [
  { knowledgeItemId: 'g-2', pattern: '〜にします', meaning: "I'll go with ~ (a decision)" }],

  supportExplanations: [
  {
    term: '〜ましょう',
    levelCode: 'N5',
    explanation: 'Support: a friendly invitation — 会いましょう = let’s meet.'
  },
  {
    term: '〜から (reason)',
    levelCode: 'N5',
    explanation: 'Support: gives a reason — 買いますから = because I will buy it.'
  }],

  relatedKnowledgeItemIds: ['v-2', 'v-5', 'g-2'],
  evidenceText: '私は温かいお茶にします。リンさんは何にしますか。'
}];