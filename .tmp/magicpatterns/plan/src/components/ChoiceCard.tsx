import React from 'react';

interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  /** Small element shown at the top of the card — a country code or an emoji */
  eyebrow: React.ReactNode;
  title: string;
  blurb: string;
  tag: string;
}

export function ChoiceCard({
  selected,
  onSelect,
  eyebrow,
  title,
  blurb,
  tag
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
      'group flex w-full flex-col items-start gap-1 rounded-4xl border-2 p-5 text-left',
      'transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out',
      'focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-300',
      'active:scale-[0.985]',
      selected ?
      'border-peach-500 bg-peach-100 shadow-soft' :
      'border-peach-100 bg-peach-50 hover:border-peach-300 hover:bg-peach-100/70'].
      join(' ')}>
      
      <span className="mb-1 text-xl font-semibold text-ink-700">{eyebrow}</span>
      <span className="font-display text-lg font-semibold leading-tight text-ink-900">
        {title}
      </span>
      <span className="text-sm text-ink-500">{blurb}</span>
      <span
        className={[
        'mt-3 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-200 ease-out',
        selected ?
        'bg-peach-500 text-white' :
        'bg-white text-ink-500 group-hover:text-ink-700'].
        join(' ')}>
        
        {tag}
      </span>
    </button>);

}