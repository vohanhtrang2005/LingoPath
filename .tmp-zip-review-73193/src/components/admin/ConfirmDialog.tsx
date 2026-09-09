import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangleIcon } from 'lucide-react';

const EASE = [0.23, 1, 0.32, 1] as const;

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open ?
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: EASE }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-5 backdrop-blur-sm"
        onClick={onCancel}>
        
          <motion.div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-description"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-sm rounded-[1.75rem] bg-white p-6 shadow-[0_24px_48px_-24px_rgba(120,88,70,0.9)]">
          
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-peach-100">
              <AlertTriangleIcon className="h-5 w-5 text-peach-600" aria-hidden="true" />
            </span>

            <h2 id="confirm-title" className="mt-4 font-display text-base font-bold text-ink">
              {title}
            </h2>
            <p id="confirm-description" className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
              type="button"
              onClick={onConfirm}
              className="flex-1 rounded-full bg-peach-500 px-5 py-3 font-display text-sm font-bold text-white transition-colors duration-200 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
              
                {confirmLabel}
              </button>
              <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-full bg-cream-100 px-5 py-3 font-display text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
              
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div> :
      null}
    </AnimatePresence>);

}