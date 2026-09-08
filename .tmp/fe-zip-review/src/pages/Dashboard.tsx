import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WavyBackdrop } from '../components/WavyBackdrop';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { TodayLessonCard } from '../components/dashboard/TodayLessonCard';
import { LessonPathItem } from '../components/dashboard/LessonPathItem';
import { ReviewRail } from '../components/dashboard/ReviewRail';
import { lessons } from '../data/lessons';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-8 sm:px-8 sm:py-10">
      <WavyBackdrop />

      <div className="relative mx-auto w-full max-w-5xl">
        <DashboardHeader onLogout={() => navigate('/')} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="space-y-8">
            <TodayLessonCard onStart={() => navigate('/learn/today')} />

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
                {lessons.map((lesson, index) =>
                <LessonPathItem
                  key={lesson.id}
                  lesson={lesson}
                  index={index}
                  isLast={index === lessons.length - 1} />

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