import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2Icon,
  FlameIcon,
  LoaderCircleIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  UserRoundIcon } from
'lucide-react';
import { WavyBackdrop } from './WavyBackdrop';
import { SoftField } from './SoftField';
import { ModeToggle } from './ModeToggle';
import { useAuthForm, type AuthMode } from '../hooks/useAuthForm';

const EASE = [0.23, 1, 0.32, 1] as const;

const COPY: Record<AuthMode, {greeting: string;title: string;subtitle: string;cta: string;}> = {
  login: {
    greeting: 'Good to see you again',
    title: 'Welcome back!',
    subtitle: 'Your 12-day streak is waiting — 8 cards are due today.',
    cta: "Let's Learn!"
  },
  signup: {
    greeting: 'Nice to meet you',
    title: 'Start your journey',
    subtitle: 'Five cozy minutes a day, in any language you choose — vocabulary, grammar, and script.',
    cta: "Let's Learn!"
  }
};

interface AuthScreenProps {
  initialMode: AuthMode;
  showGoogleSignIn: boolean;
  /** Called shortly after a successful log in / sign up. */
  onAuthenticated?: (mode: AuthMode) => void;
}

export function AuthScreen({ initialMode, showGoogleSignIn, onAuthenticated }: AuthScreenProps) {
  const { mode, switchMode, values, setField, errors, status, formError, submit, passwordStrength } =
  useAuthForm(initialMode);

  const copy = COPY[mode];
  const submitting = status === 'submitting';
  const succeeded = status === 'success';

  useEffect(() => {
    if (status !== 'success' || !onAuthenticated) return;
    const timer = window.setTimeout(() => onAuthenticated(mode), 650);
    return () => window.clearTimeout(timer);
  }, [status, mode, onAuthenticated]);

  return (
    <main className="relative min-h-full w-full overflow-hidden px-5 py-12 sm:px-8 sm:py-16">
      <WavyBackdrop />

      <div className="relative mx-auto flex w-full max-w-md flex-col items-center">
        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="flex flex-col items-center">
          
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white shadow-[0_16px_32px_-16px_rgba(150,110,86,0.7)]">
            <span className="font-display text-2xl font-bold text-peach-600">学</span>
          </div>
          <p className="mt-3 font-display text-lg font-bold tracking-[0.18em] text-[#8a5638]">
            LingoPath
          </p>
        </motion.div>

        {/* Auth card */}
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE, delay: 0.05 }}
          aria-label={mode === 'login' ? 'Log in to LingoPath' : 'Create your LingoPath account'}
          className="gk-card-shadow mt-7 w-full rounded-[2.5rem] border border-white/70 bg-white/75 p-7 backdrop-blur-xl sm:p-9">
          
          <ModeToggle mode={mode} onChange={switchMode} />

          <div className="mt-7">
            <p className="font-display text-sm font-semibold text-peach-500">{copy.greeting}</p>
            <h1 className="mt-1 font-display text-[2rem] font-bold leading-tight text-ink">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{copy.subtitle}</p>
          </div>

          <form
            className="mt-7 space-y-4"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}>
            
            <AnimatePresence initial={false}>
              {mode === 'signup' ?
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="overflow-hidden">
                
                  <SoftField
                  label="What should we call you?"
                  value={values.name}
                  onChange={(value) => setField('name', value)}
                  icon={UserRoundIcon}
                  placeholder="Yuki"
                  autoComplete="name"
                  error={errors.name} />
                
                </motion.div> :
              null}
            </AnimatePresence>

            <SoftField
              label="Email"
              type="email"
              value={values.email}
              onChange={(value) => setField('email', value)}
              icon={MailIcon}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email} />
            

            <div>
              <SoftField
                label="Password"
                type="password"
                value={values.password}
                onChange={(value) => setField('password', value)}
                icon={LockIcon}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                error={errors.password}
                hint={mode === 'login' ? undefined : '8+ characters'} />
              

              {mode === 'signup' && values.password.length > 0 ?
              <div className="mt-2.5 flex items-center gap-2 pl-2">
                  <div className="flex gap-1.5" aria-hidden="true">
                    {[1, 2, 3].map((step) =>
                  <span
                    key={step}
                    className={`h-1.5 w-8 rounded-full transition-colors duration-200 ease-out ${
                    passwordStrength >= step ? 'bg-mint-400' : 'bg-cream-200'}`
                    } />

                  )}
                  </div>
                  <span className="text-xs font-semibold text-ink-soft">
                    {['Too short', 'Getting there', 'Nice', 'Perfect!'][passwordStrength]}
                  </span>
                </div> :
              null}
            </div>

            {mode === 'login' ?
            <div className="flex justify-end">
                <button
                type="button"
                className="rounded-full px-2 py-1 text-xs font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                  Forgot password?
                </button>
              </div> :
            null}

            <AnimatePresence initial={false}>
              {formError ?
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: EASE }}
                className="rounded-3xl bg-[#fdecec] px-4 py-3 text-sm font-semibold text-[#b9524f]">
                
                  {formError}
                </motion.p> :
              null}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={submitting || succeeded}
              whileHover={submitting || succeeded ? undefined : { y: -2, scale: 1.015 }}
              whileTap={submitting || succeeded ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 620, damping: 18 }}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-display text-base font-bold text-white shadow-[0_18px_30px_-14px_rgba(233,110,63,0.85)] focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
              succeeded ? 'bg-mint-400' : 'bg-peach-500'} transition-colors duration-200 ease-out disabled:cursor-default`
              }>
              
              {submitting ?
              <>
                  <LoaderCircleIcon className="h-5 w-5 animate-spin" aria-hidden="true" />
                  One moment…
                </> :
              succeeded ?
              <>
                  <CheckCircle2Icon className="h-5 w-5" aria-hidden="true" />
                  {mode === 'login' ? 'Welcome back!' : 'Account ready!'}
                </> :

              <>
                  <SparklesIcon className="h-5 w-5" aria-hidden="true" />
                  {copy.cta}
                </>
              }
            </motion.button>

            <p aria-live="polite" className="sr-only">
              {submitting ? 'Submitting' : succeeded ? 'Success' : ''}
            </p>
          </form>

          {showGoogleSignIn ?
          <>
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-cream-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">or</span>
                <span className="h-px flex-1 bg-cream-200" />
              </div>

              <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 620, damping: 20 }}
              className="gk-well flex w-full items-center justify-center gap-3 rounded-full bg-cream-100/90 px-6 py-3.5 font-display text-sm font-bold text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
              
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.2h6.6c-.1 1.1-.8 2.8-2.4 3.9l-.1.1 3.6 2.8c2.1-1.9 3.8-4.8 3.8-8.8Z" />
                
                  <path
                  fill="#34A853"
                  d="M12 24c3.2 0 5.9-1.1 7.8-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.7 2.8C3.3 21.3 7.3 24 12 24Z" />
                
                  <path
                  fill="#FBBC05"
                  d="M5.2 14.4a7.3 7.3 0 0 1 0-4.8L1.3 6.7A12 12 0 0 0 0 12c0 1.9.5 3.7 1.3 5.3l3.9-3Z" />
                
                  <path
                  fill="#EA4335"
                  d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.7l3.9 3C6.1 6.8 8.8 4.7 12 4.7Z" />
                
                </svg>
                Continue with Google
              </motion.button>
            </> :
          null}

          <p className="mt-6 text-center text-sm text-ink-soft">
            {mode === 'login' ? 'New to LingoPath? ' : 'Already learning with us? '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="rounded-full font-bold text-peach-600 underline decoration-peach-200 decoration-2 underline-offset-4 transition-colors duration-150 ease-out hover:text-peach-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
              
              {mode === 'login' ? 'Make an account' : 'Log in instead'}
            </button>
          </p>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE, delay: 0.12 }}
          className="mt-6 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-ink-soft backdrop-blur">
          
          <FlameIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
          Learners kept 1.2M day-streaks alive this month
        </motion.div>
      </div>
    </main>);

}