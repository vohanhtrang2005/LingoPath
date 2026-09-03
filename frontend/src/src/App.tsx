import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

/** Sends the prototype straight to the dashboard on first load, once. */
function BootRedirect({ onDone }: {onDone: () => void;}) {
  useEffect(onDone, [onDone]);
  return <Navigate to="/learn" replace />;
}

interface AppProps {
  /** Which screen the prototype opens on. */
  startScreen?: 'auth' | 'dashboard';
  /** Which panel the auth card opens on. */
  initialMode?: 'login' | 'signup';
  /** Show the Google sign-in option below the form. */
  showGoogleSignIn?: boolean;
}

export function App({
  startScreen = 'auth',
  initialMode = 'login',
  showGoogleSignIn = true
}: AppProps) {
  const [booted, setBooted] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
          startScreen === 'dashboard' && !booted ?
          <BootRedirect onDone={() => setBooted(true)} /> :

          <Login initialMode={initialMode} showGoogleSignIn={showGoogleSignIn} />

          } />
        
        <Route path="/learn" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>);

}