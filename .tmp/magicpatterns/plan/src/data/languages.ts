import type { LanguageOption, LevelOption } from '../types/onboarding';

export const languages: LanguageOption[] = [
{
  id: 'japanese',
  code: 'JP',
  name: 'Japanese',
  blurb: 'Kana, kanji and polite speech',
  nativeTag: '日本語'
},
{
  id: 'english',
  code: 'GB',
  name: 'English',
  blurb: 'Everyday fluency and exam prep',
  nativeTag: 'English'
},
{
  id: 'korean',
  code: 'KR',
  name: 'Korean',
  blurb: 'Hangul and conversation basics',
  nativeTag: '한국어'
},
{
  id: 'chinese',
  code: 'CN',
  name: 'Chinese',
  blurb: 'Tones, characters and pinyin',
  nativeTag: '中文'
}];


/**
 * Mock level catalogue — one entry per language id.
 * Adding a new language is a matter of adding a `languages` entry plus its
 * levels here; the Target Level step renders whatever it finds.
 */
export const levelsByLanguage: Record<string, LevelOption[]> = {
  japanese: [
  {
    id: 'jp-n5',
    scale: 'JLPT N5',
    title: 'Just sprouting',
    blurb: 'Starting from the alphabet',
    emoji: '🌱'
  },
  {
    id: 'jp-n4',
    scale: 'JLPT N4',
    title: 'Getting comfy',
    blurb: 'Simple sentences and greetings',
    emoji: '🌿'
  },
  {
    id: 'jp-n3',
    scale: 'JLPT N3',
    title: 'Finding my flow',
    blurb: 'Everyday chats, some reading',
    emoji: '🌳'
  },
  {
    id: 'jp-n2',
    scale: 'JLPT N2',
    title: 'Going deep',
    blurb: 'News, novels and nuance',
    emoji: '⛰️'
  },
  {
    id: 'jp-n1',
    scale: 'JLPT N1',
    title: 'Near native',
    blurb: 'Academic and business fluency',
    emoji: '🏔️'
  }],

  english: [
  {
    id: 'en-ielts-5',
    scale: 'IELTS 5.0',
    title: 'Finding my footing',
    blurb: 'Familiar topics, simple writing',
    emoji: '🌱'
  },
  {
    id: 'en-ielts-65',
    scale: 'IELTS 6.5',
    title: 'Study ready',
    blurb: 'Essays, lectures and debate',
    emoji: '🌳'
  },
  {
    id: 'en-toeic-600',
    scale: 'TOEIC 600',
    title: 'Office ready',
    blurb: 'Emails, calls and meetings',
    emoji: '💼'
  },
  {
    id: 'en-b1-conversational',
    scale: 'B1 Conversational',
    title: 'Just chatting',
    blurb: 'Talk freely, no exam needed',
    emoji: '💬'
  }],

  korean: [
  {
    id: 'kr-topik-1',
    scale: 'TOPIK I – Level 1',
    title: 'Just sprouting',
    blurb: 'Hangul and first phrases',
    emoji: '🌱'
  },
  {
    id: 'kr-topik-2',
    scale: 'TOPIK I – Level 2',
    title: 'Getting comfy',
    blurb: 'Daily errands and small talk',
    emoji: '🌿'
  },
  {
    id: 'kr-topik-4',
    scale: 'TOPIK II – Level 4',
    title: 'Finding my flow',
    blurb: 'Dramas without subtitles',
    emoji: '🌳'
  },
  {
    id: 'kr-topik-6',
    scale: 'TOPIK II – Level 6',
    title: 'Going deep',
    blurb: 'Work, news and nuance',
    emoji: '⛰️'
  }],

  chinese: [
  {
    id: 'cn-hsk-1',
    scale: 'HSK 1',
    title: 'Just sprouting',
    blurb: 'Pinyin and 150 words',
    emoji: '🌱'
  },
  {
    id: 'cn-hsk-3',
    scale: 'HSK 3',
    title: 'Getting comfy',
    blurb: 'Travel and everyday chats',
    emoji: '🌿'
  },
  {
    id: 'cn-hsk-4',
    scale: 'HSK 4',
    title: 'Finding my flow',
    blurb: 'Longer reading and opinions',
    emoji: '🌳'
  },
  {
    id: 'cn-hsk-5',
    scale: 'HSK 5',
    title: 'Going deep',
    blurb: 'News, films and essays',
    emoji: '⛰️'
  }]

};

export const struggleChips: string[] = [
'Kanji sticks for a day, then vanishes 🥲',
'Listening is too fast for me',
'Particles (は / が / を) confuse me',
'I freeze when speaking'];