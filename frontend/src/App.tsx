import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Onboarding } from './pages/Onboarding';
import { TodaySessions } from './pages/TodaySessions';
import { VocabularyLesson } from './pages/VocabularyLesson';
import { VocabularyFlashcards } from './pages/VocabularyFlashcards';
import { VocabularyProgressProvider } from './contexts/VocabularyProgressContext';
import { GrammarLesson } from './pages/GrammarLesson';
import { VocabularyPracticePage } from './pages/VocabularyPractice';
import { GrammarPracticePage } from './pages/GrammarPractice';
import { ReadingPractice } from './pages/ReadingPractice';
import { ReadingResult } from './pages/ReadingResult';
import { ReadingSessionProvider } from './contexts/ReadingSessionContext';
import { GrammarProgressProvider } from './contexts/GrammarProgressContext';
import { AdminBooksPage } from './features/admin/pages/AdminBooksPage';
import { AdminBookDocumentsPage } from './features/admin/pages/AdminBookDocumentsPage';
import { AdminDocumentChunksPage } from './features/admin/pages/AdminDocumentChunksPage';

/** Sends the prototype straight to a chosen screen on first load, once. */
function BootRedirect({ to, onDone }: {to: string;onDone: () => void;}) {
  useEffect(onDone, [onDone]);
  return <Navigate to={to} replace />;
}

interface AppProps {
  /** Which screen the prototype opens on. */
  startScreen?: 'auth' | 'onboarding' | 'dashboard';
  /** Which panel the auth card opens on. */
  initialMode?: 'login' | 'signup';
  /** Show the Google sign-in option below the form. */
  showGoogleSignIn?: boolean;
  /** Mock course language — the Kanji section only exists for Japanese. */
  selectedLanguage?: 'Japanese' | 'English';
}

export function App({
  startScreen = 'auth',
  initialMode = 'login',
  showGoogleSignIn = true,
  selectedLanguage = 'Japanese'
}: AppProps) {
  const [booted, setBooted] = useState(false);

  return (
    <BrowserRouter>
      <VocabularyProgressProvider>
      <GrammarProgressProvider>
      <ReadingSessionProvider>
      <Routes>
        <Route
                path="/"
                element={
                startScreen !== 'auth' && !booted ?
                <BootRedirect
                  to={startScreen === 'onboarding' ? '/onboarding' : '/learn'}
                  onDone={() => setBooted(true)} /> :


                <Login initialMode={initialMode} showGoogleSignIn={showGoogleSignIn} />

                } />
              
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/learn" element={<Dashboard />} />
        <Route
                path="/learn/today"
                element={<TodaySessions selectedLanguage={selectedLanguage} />} />
              
        <Route path="/learn/today/vocabulary" element={<VocabularyLesson />} />
        <Route path="/learn/today/vocabulary/flashcards" element={<VocabularyFlashcards />} />
        <Route path="/learn/today/vocabulary/practice" element={<VocabularyPracticePage />} />
        <Route path="/learn/today/grammar" element={<GrammarLesson />} />
        <Route path="/learn/today/grammar/practice" element={<GrammarPracticePage />} />
        <Route path="/learn/today/reading" element={<ReadingPractice />} />
        <Route path="/learn/today/reading/result" element={<ReadingResult />} />
        <Route path="/admin/books" element={<AdminBooksPage />} />
        <Route path="/admin/books/:bookId/documents" element={<AdminBookDocumentsPage />} />
        <Route
          path="/admin/books/:bookId/documents/:documentId/chunks"
          element={<AdminDocumentChunksPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ReadingSessionProvider>
      </GrammarProgressProvider>
      </VocabularyProgressProvider>
    </BrowserRouter>);

}
