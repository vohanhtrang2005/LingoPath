import React from 'react';
import { motion } from 'framer-motion';
import type { AuthMode } from '../hooks/useAuthForm';

interface ModeToggleProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

const OPTIONS: {value: AuthMode;label: string;}[] = [
{ value: 'login', label: 'Log in' },
{ value: 'signup', label: 'Sign up' }];


export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Choose log in or sign up"
      className="gk-well flex gap-1 rounded-full bg-cream-100/90 p-1.5">
      
      {OPTIONS.map((option) => {
        const active = option.value === mode;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className="relative flex-1 rounded-full px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            {active ?
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 rounded-full bg-white shadow-[0_8px_18px_-8px_rgba(150,110,86,0.55)]"
              transition={{ type: 'spring', stiffness: 520, damping: 34 }} /> :

            null}
            <span
              className={`relative font-display text-sm font-bold transition-colors duration-150 ease-out ${
              active ? 'text-peach-600' : 'text-ink-soft'}`
              }>
              
              {option.label}
            </span>
          </button>);

      })}
    </div>);

}