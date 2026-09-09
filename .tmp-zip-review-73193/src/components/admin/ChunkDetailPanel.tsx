import React, { useState } from 'react';
import { CheckIcon, CopyIcon, XIcon } from 'lucide-react';
import { StatusBadge, TypeBadge, formatChunkDate, pageRange, sectionTitleOf } from './chunkFormat';
import type { DocumentChunk } from '../../types/chunk';

interface ChunkDetailPanelProps {
  chunk: DocumentChunk;
  onClose: () => void;
}

function CopyButton({ value, label }: {value: string;label: string;}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-display text-[11px] font-bold text-ink-soft transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
      
      {copied ?
      <>
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
          Copied
        </> :

      <>
          <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Copy
        </>
      }
    </button>);

}

function MarkerBlock({ label, value }: {label: string;value: string | null;}) {
  const text = value?.trim() ? value : '';
  return (
    <div className="rounded-[1.2rem] bg-cream-100/85 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">{label}</p>
        {text ? <CopyButton value={text} label={label.toLowerCase()} /> : null}
      </div>
      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink">
        {text || '—'}
      </pre>
    </div>);

}

export function ChunkDetailPanel({ chunk, onClose }: ChunkDetailPanelProps) {
  return (
    <section
      aria-labelledby="chunk-detail-title"
      className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
      
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="chunk-detail-title" className="font-display text-sm font-bold text-ink">
            Chunk {chunk.chunkIndex} details
          </h2>
          <p className="mt-1 break-words text-sm font-semibold text-ink-soft">
            {sectionTitleOf(chunk)}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 font-display text-xs font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Close
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TypeBadge type={chunk.sectionType} />
        <StatusBadge status={chunk.status} />
        <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-bold text-ink-soft">
          {pageRange(chunk)}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[1.2rem] bg-cream-100/85 px-4 py-3">
          <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            Created at
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">
            {formatChunkDate(chunk.createdAt)}
          </dd>
        </div>
        <div className="rounded-[1.2rem] bg-cream-100/85 px-4 py-3">
          <dt className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            Updated at
          </dt>
          <dd className="mt-1 text-sm font-semibold text-ink">
            {formatChunkDate(chunk.updatedAt)}
          </dd>
        </div>
      </dl>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <MarkerBlock label="Start marker" value={chunk.startMarker} />
        <MarkerBlock label="End marker" value={chunk.endMarker} />
      </div>

      <div className="mt-3 rounded-[1.2rem] bg-cream-100/85 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Chunk text</p>
          {chunk.chunkText ? <CopyButton value={chunk.chunkText} label="chunk text" /> : null}
        </div>
        {chunk.chunkText ?
        <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink">
            {chunk.chunkText}
          </pre> :

        <p className="mt-2 text-sm text-ink-soft">Chunk text is not available yet.</p>
        }
      </div>
    </section>);

}