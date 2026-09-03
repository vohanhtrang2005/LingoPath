import React, { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EyeIcon, EyeOffIcon, BoxIcon } from "lucide-react";
interface SoftFieldProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  icon: BoxIcon;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
}
export function SoftField({
  label,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  autoComplete,
  error,
  hint
}: SoftFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && revealed ? 'text' : type;
  const wellClass = error ? 'gk-well-error' : focused ? 'gk-well-focus' : 'gk-well';
  return <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-display text-sm font-semibold text-ink">
          {label}
        </label>
        {hint ? <span className="text-xs text-ink-faint">{hint}</span> : null}
      </div>

      <div className={`flex items-center gap-3 rounded-4xl bg-cream-100/90 px-4 py-3 transition-shadow duration-200 ease-out ${wellClass}`}>
        <Icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ease-out ${error ? 'text-[#d06a6a]' : focused ? 'text-peach-500' : 'text-ink-faint'}`} aria-hidden="true" />
        <input id={id} type={inputType} value={value} onChange={(event) => onChange(event.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-faint" />
        {isPassword ? <button type="button" onClick={() => setRevealed((prev) => !prev)} aria-label={revealed ? 'Hide password' : 'Show password'} className="shrink-0 rounded-full p-1.5 text-ink-faint transition-colors duration-150 ease-out hover:bg-white/80 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            {revealed ? <EyeOffIcon className="h-4 w-4" aria-hidden="true" /> : <EyeIcon className="h-4 w-4" aria-hidden="true" />}
          </button> : null}
      </div>

      <AnimatePresence initial={false}>
        {error ? <motion.p id={`${id}-error`} initial={{
        opacity: 0,
        y: -4
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -4
      }} transition={{
        duration: 0.16,
        ease: [0.23, 1, 0.32, 1]
      }} className="mt-1.5 pl-2 text-xs font-semibold text-[#c65f5f]">
            {error}
          </motion.p> : null}
      </AnimatePresence>
    </div>;
}