import React from 'react';
import { AuthScreen } from './components/AuthScreen';

interface AppProps {
  /** Which panel the auth card opens on. */
  initialMode?: 'login' | 'signup';
  /** Show the Google sign-in option below the form. */
  showGoogleSignIn?: boolean;
}

export function App({ initialMode = 'login', showGoogleSignIn = true }: AppProps) {
  return <AuthScreen initialMode={initialMode} showGoogleSignIn={showGoogleSignIn} />;
}