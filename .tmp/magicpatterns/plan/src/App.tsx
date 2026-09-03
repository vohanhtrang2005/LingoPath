import React from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';

export function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FFF8F2]">
      {/* Warm peach sky fading into soft mint-tinted cream — the LingoPath backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-x-0 top-0 h-[70vh]"
          style={{
            background:
            'linear-gradient(180deg, #FBB489 0%, #FDCBA9 42%, #FFE6D6 78%, #FFF8F2 100%)'
          }} />
        
        <svg
          className="absolute inset-x-0 top-0 h-[80vh] w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none">
          
          <path
            d="M0 300c260-64 470 44 720 44s480-104 720-44v70c-240 62-460-30-720-30S240 428 0 366z"
            fill="#FFFFFF"
            opacity="0.22" />
          
          <path
            d="M0 430c240 62 460-30 720-30s480 92 720 30v130c-240 60-460-26-720-26S240 616 0 556z"
            fill="#FDF3EA"
            opacity="0.85" />
          
          <path
            d="M0 560c240 60 460-26 720-26s480 86 720 26v340H0z"
            fill="#FFF8F2" />
          
          <path
            d="M0 620c200 44 380-18 560-30 40-3 80-2 120 4v306H0z"
            fill="#E3F1E6"
            opacity="0.55" />
          
          <path
            d="M1440 640c-180 40-330-14-470-24-48-4-96-1-142 8v276h612z"
            fill="#E7EDF6"
            opacity="0.5" />
          
        </svg>
      </div>

      <main className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-10 sm:px-6">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-display text-base font-bold text-peach-600 shadow-soft">
            学
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.2em] text-ink-700">
            LingoPath
          </span>
        </div>

        <OnboardingScreen />

        <p className="mt-7 text-center text-xs font-semibold text-ink-400">
          You can reshape this plan any time from your profile.
        </p>
      </main>
    </div>);

}