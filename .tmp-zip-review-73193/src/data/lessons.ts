import type { Lesson, StreakDay } from '../types/lesson';

export const learner = {
  name: 'Mai',
  course: '日本語 · N5',
  chapter: 'Chapter 3 — Everyday Japanese',
  chapterDone: 12,
  chapterTotal: 20,
  streak: 12,
  minutesToday: 6,
  minutesGoal: 15
};

export const todayLesson: Lesson = {
  id: 'day-24',
  day: 24,
  title: 'Ordering at a café',
  subtitle: 'Polite requests, counters for drinks, and a short listening scene.',
  type: 'Vocabulary',
  minutes: 12,
  items: 18,
  xp: 40,
  status: 'today'
};

export const lessons: Lesson[] = [
{
  id: 'day-22',
  day: 22,
  title: 'Telling the time',
  subtitle: '時 and 分 with everyday schedules.',
  type: 'Grammar',
  minutes: 10,
  items: 14,
  xp: 35,
  status: 'complete',
  score: 96
},
{
  id: 'day-23',
  day: 23,
  title: 'At the train station',
  subtitle: 'Announcements, platforms, and asking for help.',
  type: 'Listening',
  minutes: 9,
  items: 12,
  xp: 30,
  status: 'complete',
  score: 88
},
todayLesson,
{
  id: 'day-25',
  day: 25,
  title: 'Kanji: 食 · 飲 · 店',
  subtitle: 'Stroke order, readings, and words you just learned.',
  type: 'Kanji',
  minutes: 14,
  items: 9,
  xp: 45,
  status: 'upcoming',
  unlocksAt: 'Opens tomorrow'
},
{
  id: 'day-26',
  day: 26,
  title: 'Asking for the bill',
  subtitle: 'Wrapping up a café visit politely.',
  type: 'Grammar',
  minutes: 11,
  items: 15,
  xp: 40,
  status: 'upcoming',
  unlocksAt: 'Opens Thursday'
}];


export const weekStreak: StreakDay[] = [
{ label: 'M', done: true },
{ label: 'T', done: true },
{ label: 'W', done: true },
{ label: 'T', done: true },
{ label: 'F', done: false, today: true },
{ label: 'S', done: false },
{ label: 'S', done: false }];


export const reviewQueue = {
  due: 8,
  nextIn: '4h',
  mastered: 214
};