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

  const handleAuthenticated = (mode: AuthMode) => {
    if (mode === 'signup') {
      navigate('/onboarding');
      return;
    }

    try {
      const rawUser = localStorage.getItem('currentUser');
      const user = rawUser ? JSON.parse(rawUser) as { role?: string } : null;
      navigate(user?.role === 'ADMIN' ? '/admin/books' : '/learn');
    } catch {
      navigate('/learn');
    }
  };

  return (
    <AuthScreen
      initialMode={initialMode}
      showGoogleSignIn={showGoogleSignIn}
      onAuthenticated={handleAuthenticated} />);


}
