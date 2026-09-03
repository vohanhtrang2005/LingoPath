import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthScreen } from '../components/AuthScreen';
import type { AuthMode } from '../hooks/useAuthForm';

interface LoginProps {
  initialMode: AuthMode;
  showGoogleSignIn: boolean;
}

export function Login({ initialMode, showGoogleSignIn }: LoginProps) {
  const navigate = useNavigate();

  return (
    <AuthScreen
      initialMode={initialMode}
      showGoogleSignIn={showGoogleSignIn}
      onAuthenticated={(mode) => navigate(mode === 'signup' ? '/onboarding' : '/learn')} />);


}