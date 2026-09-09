import { useCallback, useMemo, useState } from 'react';

export type AuthMode = 'login' | 'signup';
export type AuthStatus = 'idle' | 'submitting' | 'success' | 'error';

export type AuthField = 'name' | 'email' | 'password';
export type AuthValues = Record<AuthField, string>;
export type AuthErrors = Partial<Record<AuthField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: AuthValues, mode: AuthMode): AuthErrors {
  const errors: AuthErrors = {};

  if (mode === 'signup' && values.name.trim().length < 2) {
    errors.name = 'A name helps us cheer you on!';
  }
  if (!values.email.trim()) {
    errors.email = 'We need an email to save your streak.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'Hmm, that email looks a little off.';
  }
  if (!values.password) {
    errors.password = 'Please pick a password.';
  } else if (values.password.length < 8) {
    errors.password = 'Just a bit longer — 8 characters minimum.';
  }

  return errors;
}

export function useAuthForm(initialMode: AuthMode) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [values, setValues] = useState<AuthValues>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const setField = useCallback((field: AuthField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev[field] ? { ...prev, [field]: undefined } : prev);
    setFormError(null);
  }, []);

  const switchMode = useCallback((next: AuthMode) => {
    setMode(next);
    setErrors({});
    setFormError(null);
    setStatus('idle');
  }, []);

  const submit = useCallback(() => {
    const nextErrors = validate(values, mode);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      setFormError('Almost there — check the highlighted fields.');
      return;
    }

    setStatus('submitting');
    setFormError(null);
    window.setTimeout(() => setStatus('success'), 1100);
  }, [mode, values]);

  const passwordStrength = useMemo(() => {
    const { password } = values;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d|[^\w\s]/.test(password)) score += 1;
    return score as 0 | 1 | 2 | 3;
  }, [values]);

  return {
    mode,
    switchMode,
    values,
    setField,
    errors,
    status,
    formError,
    submit,
    passwordStrength
  };
}