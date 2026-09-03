import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { TodayLessonCard } from '../components/dashboard/TodayLessonCard';
import { LessonPathItem } from '../components/dashboard/LessonPathItem';
import { ReviewRail } from '../components/dashboard/ReviewRail';
import { lessons } from '../data/lessons';
import type { Lesson, LessonType } from '../types/lesson';

type StudyPlanResponse = {
  id: string;
};

type DailyLessonResponse = {
  id: string;
  lessonDate: string;
  dayIndex: number;
  lessonType: string;
  status: string;
  sections: {
    type: string;
    items: unknown[];
  }[];
};

function toLessonType(lesson: DailyLessonResponse): LessonType {
  const sectionTypes = lesson.sections.map((section) => section.type.toUpperCase());
  if (sectionTypes.includes('GRAMMAR')) return 'Grammar';
  if (sectionTypes.includes('LISTENING')) return 'Listening';
  if (sectionTypes.includes('READING')) return 'Reading';
  if (sectionTypes.includes('KANJI')) return 'Kanji';
  return 'Vocabulary';
}

function toLessonStatus(lesson: DailyLessonResponse, index: number): Lesson['status'] {
  if (lesson.status === 'COMPLETED') return 'complete';
  if (index === 0 || lesson.status === 'IN_PROGRESS') return 'today';
  return 'upcoming';
}

function mapDailyLesson(lesson: DailyLessonResponse, index: number): Lesson {
  const items = lesson.sections.reduce((total, section) => total + section.items.length, 0);
  const status = toLessonStatus(lesson, index);

  return {
    id: lesson.id,
    day: lesson.dayIndex,
    title: lesson.lessonType === 'REVIEW_DAY' ? `Review Day ${lesson.dayIndex}` : `Lesson Day ${lesson.dayIndex}`,
    subtitle: lesson.sections.map((section) => section.type).join(' · '),
    type: toLessonType(lesson),
    minutes: Math.max(10, lesson.sections.length * 5),
    items,
    xp: status === 'complete' ? 40 : 30,
    status,
    score: status === 'complete' ? 100 : undefined,
    unlocksAt: status === 'upcoming' ? new Date(lesson.lessonDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) : undefined
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(path, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });

  if (!response.ok) {
    throw new Error('Could not load learning data.');
  }

  return await response.json() as T;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [apiLessons, setApiLessons] = useState<Lesson[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLessons() {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const currentPlan = await fetchJson<StudyPlanResponse>('/api/learning/plans/current');
        const dailyLessons = await fetchJson<DailyLessonResponse[]>(`/api/learning/plans/${currentPlan.id}/lessons`);
        if (!cancelled && dailyLessons.length > 0) {
          setApiLessons(dailyLessons.map(mapDailyLesson).slice(0, 7));
        }
      } catch {
        if (!cancelled) setApiLessons(null);
      }
    }

    void loadLessons();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayLessons = apiLessons ?? lessons;
  const today = useMemo(
    () => displayLessons.find((lesson) => lesson.status === 'today') ?? displayLessons[0],
    [displayLessons]
  );

  const logout = () => {
    void fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).finally(() => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
      navigate('/');
    });
  };

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-5xl">
        <DashboardHeader onLogout={logout} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="space-y-8">
            <TodayLessonCard
              lesson={today}
              chapterDone={displayLessons.filter((lesson) => lesson.status === 'complete').length}
              chapterTotal={displayLessons.length}
              onStart={() => navigate('/learn/today')} />

            <section aria-labelledby="path-title">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="path-title" className="font-display text-xl font-bold text-ink">
                  Your path this week
                </h2>
                <button
                  type="button"
                  className="rounded-full px-2 py-1 text-sm font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                  
                  See full journey
                </button>
              </div>

              <ol className="mt-5">
                {displayLessons.map((lesson, index) =>
                <LessonPathItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  isLast={index === displayLessons.length - 1} />

                )}
              </ol>
            </section>
          </div>

          <ReviewRail />
        </div>

        <p className="mt-12 text-center text-xs font-semibold text-ink-faint">
          Learn a little, often. — LingoPath
        </p>
      </div>
    </main>);

}
