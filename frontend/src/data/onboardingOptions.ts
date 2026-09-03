import type { LanguageOption, LevelOption } from '../types/plan';

export const languageOptions: LanguageOption[] = [
{
  id: 'ja',
  name: 'Japanese',
  native: '日本語',
  emoji: '🇯🇵',
  blurb: 'Kana, kanji and polite speech'
},
{
  id: 'en',
  name: 'English',
  native: 'English',
  emoji: '🇬🇧',
  blurb: 'Everyday fluency and exam prep'
},
{
  id: 'ko',
  name: 'Korean',
  native: '한국어',
  emoji: '🇰🇷',
  blurb: 'Hangul and conversation basics'
},
{
  id: 'zh',
  name: 'Chinese',
  native: '中文',
  emoji: '🇨🇳',
  blurb: 'Tones, characters and pinyin'
}];


/**
 * Target levels per language. Adding a new language means adding one entry
 * here — the wizard renders whatever it finds.
 */
export const levelsByLanguage: Record<string, LevelOption[]> = {
  ja: [
  { id: 'n5', emoji: '🌱', label: 'JLPT N5', blurb: 'Everyday basics, kana confidence' },
  { id: 'n4', emoji: '🌿', label: 'JLPT N4', blurb: 'Simple conversations, ~300 kanji' },
  { id: 'n3', emoji: '🌳', label: 'JLPT N3', blurb: 'Daily life at natural speed' },
  { id: 'n2', emoji: '🍁', label: 'JLPT N2', blurb: 'News, work and nuance' },
  { id: 'n1', emoji: '🏔️', label: 'JLPT N1', blurb: 'Near-native reading and listening' }],

  en: [
  { id: 'ielts-5', emoji: '🌱', label: 'IELTS 5.0', blurb: 'Confident everyday English' },
  { id: 'ielts-65', emoji: '🌳', label: 'IELTS 6.5', blurb: 'University and visa ready' },
  { id: 'toeic-600', emoji: '💼', label: 'TOEIC 600', blurb: 'Workplace communication' },
  { id: 'b1', emoji: '💬', label: 'B1 Conversational', blurb: 'Chat freely, no exam needed' }],

  ko: [
  { id: 'topik-1', emoji: '🌱', label: 'TOPIK I (1–2)', blurb: 'Hangul and survival Korean' },
  { id: 'topik-34', emoji: '🌳', label: 'TOPIK II (3–4)', blurb: 'Daily life and study' },
  { id: 'topik-56', emoji: '🏔️', label: 'TOPIK II (5–6)', blurb: 'Academic and professional' }],

  zh: [
  { id: 'hsk-2', emoji: '🌱', label: 'HSK 1–2', blurb: 'Pinyin and first characters' },
  { id: 'hsk-4', emoji: '🌳', label: 'HSK 3–4', blurb: 'Everyday conversation' },
  { id: 'hsk-5', emoji: '🍁', label: 'HSK 5', blurb: 'Media and longer texts' },
  { id: 'hsk-6', emoji: '🏔️', label: 'HSK 6', blurb: 'Near-native fluency' }]

};

export const weaknessSuggestions = [
'Kanji sticks for a day, then vanishes 😅',
'Listening is too fast for me',
'Particles (は / が / を) confuse me',
'I freeze when speaking'];