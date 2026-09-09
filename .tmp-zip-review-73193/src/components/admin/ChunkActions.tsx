import React from 'react';
import { CheckCircleIcon, EyeIcon, LoaderCircleIcon, XCircleIcon } from 'lucide-react';
import type { DocumentChunk } from '../../types/chunk';

interface ChunkActionsProps {
  chunk: DocumentChunk;
  busy: boolean;
  onViewDetails: (chunk: DocumentChunk) => void;
  onApprove: (chunk: DocumentChunk) => void;
  onReject: (chunk: DocumentChunk) => void;
}

export function ChunkActions({
  chunk,
  busy,
  onViewDetails,
  onApprove,
  onReject
}: ChunkActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onViewDetails(chunk)}
        title="View details"
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-display text-xs font-bold text-ink-soft shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
        
        <EyeIcon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">View details</span>
      </button>

      <button
        type="button"
        onClick={() => onApprove(chunk)}
        disabled={busy}
        title="Approve"
        aria-label="Approve chunk"
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-bold text-white transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-200 ${
        busy ? 'cursor-not-allowed bg-mint-200' : 'bg-mint-400 hover:bg-[#5cbb91]'}`
        }>
        
        {busy ?
        <LoaderCircleIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> :

        <CheckCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
        }
        <span className="hidden sm:inline">Approve</span>
      </button>

      <button
        type="button"
        onClick={() => onReject(chunk)}
        disabled={busy}
        title="Reject"
        aria-label="Reject chunk"
        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
        busy ?
        'cursor-not-allowed bg-cream-100 text-ink-faint' :
        'bg-[#fbe3e3] text-[#b9524f] hover:bg-[#f8d6d6]'}`
        }>
        
        {busy ?
        <LoaderCircleIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> :

        <XCircleIcon className="h-3.5 w-3.5" aria-hidden="true" />
        }
        <span className="hidden sm:inline">Reject</span>
      </button>
    </div>);

}