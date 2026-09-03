import type { GrammarPracticeItem } from '../types/grammar';

/** Approved, source-backed grammar PracticeItem records for Day 24. */
export const grammarPracticeItems: GrammarPracticeItem[] = [
{
  id: 'gp-1',
  practiceType: 'pattern-choice',
  prompt: 'You want one coffee. Which pattern fits? コーヒーを一つ＿＿。',
  targetPattern: '〜をください',
  choices: ['ください', 'にします', 'てもいいですか', 'でした'],
  correctAnswer: 'ください',
  explanation: 'Requesting an object uses noun + を + ください.',
  wrongChoiceExplanations: {
    にします: 'にします states a decision, and it needs に rather than を.',
    てもいいですか: 'That asks for permission to do an action, not for an item.',
    でした: 'Past tense of です — it cannot make a request.'
  },
  relatedKnowledgeItemIds: ['g-1'],
  sourceReference: 'Minna no Nihongo · L2, p.28',
  evidenceText: 'この本をください。— Please give me this book.'
},
{
  id: 'gp-2',
  practiceType: 'meaning-choice',
  prompt: 'What does 飲み物はコーヒーにします mean?',
  targetPattern: '〜にします',
  choices: [
  "For drinks, I'll go with coffee.",
  'Please give me a coffee.',
  'May I drink coffee?',
  'The drink was coffee.'],

  correctAnswer: "For drinks, I'll go with coffee.",
  explanation: 'にします expresses the choice the speaker settles on.',
  wrongChoiceExplanations: {
    'Please give me a coffee.': 'That would be コーヒーをください.',
    'May I drink coffee?': 'Permission needs 飲んでもいいですか.',
    'The drink was coffee.': 'A past description would be でした.'
  },
  relatedKnowledgeItemIds: ['g-2'],
  sourceReference: 'Genki I · Ch. 4, p.101',
  evidenceText: 'わたしは天ぷらにします。— I will have tempura.'
},
{
  id: 'gp-3',
  practiceType: 'fill-blank',
  prompt: 'Type the missing particle: この席＿座ってもいいですか。',
  targetPattern: '〜てもいいですか',
  correctAnswer: 'に',
  explanation: '座る takes に for the place you settle into.',
  relatedKnowledgeItemIds: ['g-3'],
  sourceReference: 'Minna no Nihongo · L15, p.122',
  evidenceText: 'ここに座ってもいいですか。— May I sit here?'
},
{
  id: 'gp-4',
  practiceType: 'reorder',
  prompt: 'Build the sentence: "Warm tea, please."',
  targetPattern: '〜をください',
  tokens: ['ください', 'お茶', '温かい', 'を'],
  correctAnswer: '温かい お茶 を ください',
  explanation: 'Adjective → noun → を → ください keeps the request natural.',
  relatedKnowledgeItemIds: ['g-1'],
  sourceReference: 'Minna no Nihongo · L2, p.29',
  evidenceText: '冷たい水をください。— Cold water, please.'
},
{
  id: 'gp-5',
  practiceType: 'usage-choice',
  prompt: 'Which sentence uses the grammar correctly?',
  targetPattern: '〜てもいいですか',
  choices: [
  '写真を撮ってもいいですか。',
  '写真を撮るもいいですか。',
  '写真を撮ってもいいですかを。',
  '写真は撮ってもいいますか。'],

  correctAnswer: '写真を撮ってもいいですか。',
  explanation: 'The verb must be in て-form: 撮る → 撮って.',
  wrongChoiceExplanations: {
    '写真を撮るもいいですか。': 'Dictionary form cannot attach to もいいですか.',
    '写真を撮ってもいいですかを。': 'A stray を at the end breaks the question.',
    '写真は撮ってもいいますか。': 'いいますか is not a form of いいですか.'
  },
  relatedKnowledgeItemIds: ['g-3'],
  sourceReference: 'Minna no Nihongo · L15, p.122',
  evidenceText: '写真を撮ってもいいですか。— May I take a photo?'
},
{
  id: 'gp-6',
  practiceType: 'transform',
  prompt: 'Rewrite using 〜にします: 「持ち帰りでお願いします。」(decide on takeaway)',
  targetPattern: '〜にします',
  correctAnswer: '持ち帰りにします',
  explanation: 'Swap でお願いします for にします to state your decision.',
  relatedKnowledgeItemIds: ['g-2'],
  sourceReference: 'Genki I · Ch. 4, p.102',
  evidenceText: 'コーヒーにします。— I will have coffee.'
}];