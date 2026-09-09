import React from 'react';
import { format, parseISO } from 'date-fns';
import type { DocumentChunk } from '../../types/chunk';

export function formatChunkDate(value?: string): string {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

export function pageRange(chunk: DocumentChunk): string {
  const { pageFrom, pageTo } = chunk;
  if (pageFrom == null && pageTo == null) return '—';
  if (pageFrom != null && pageTo != null && pageFrom !== pageTo) {
    return `Pages ${pageFrom}–${pageTo}`;
  }
  return `Page ${pageFrom ?? pageTo}`;
}

export function sectionTitleOf(chunk: DocumentChunk): string {
  const title = chunk.sectionTitle?.trim();
  return title ? title : 'Untitled section';
}

const STATUS_STYLE: Record<string, string> = {
  AI_SUGGESTED: 'bg-peach-100 text-[#a1552c]',
  APPROVED: 'bg-mint-100 text-[#38795c]',
  REJECTED: 'bg-[#fbe3e3] text-[#b9524f]'
};

export function StatusBadge({ status }: {status: string;}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
      STATUS_STYLE[status] ?? 'bg-cream-200 text-ink-soft'}`
      }>
      
      {status}
    </span>);

}

const TYPE_STYLE: Record<string, string> = {
  READING: 'bg-sky-100 text-[#3b6a94]',
  VOCABULARY: 'bg-mint-100 text-[#38795c]',
  GRAMMAR: 'bg-peach-100 text-[#a1552c]',
  KANJI: 'bg-[#ece5fb] text-[#6b5aa6]',
  LISTENING: 'bg-[#fdeede] text-[#a1552c]'
};

export function TypeBadge({ type }: {type: string | null;}) {
  if (!type) return <span className="text-sm text-ink-faint">—</span>;
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
      TYPE_STYLE[type] ?? 'bg-cream-200 text-ink-soft'}`
      }>
      
      {type}
    </span>);

}