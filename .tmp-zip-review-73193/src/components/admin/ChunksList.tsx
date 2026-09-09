import React from 'react';
import { AlertCircleIcon, LayersIcon, SparklesIcon } from 'lucide-react';
import { ChunkActions } from './ChunkActions';
import { StatusBadge, TypeBadge, formatChunkDate, pageRange, sectionTitleOf } from './chunkFormat';
import type { DocumentChunk } from '../../types/chunk';

interface ChunksListProps {
  chunks: DocumentChunk[];
  loading: boolean;
  error: string | null;
  busyChunkId: string | null;
  generating: boolean;
  selectedId: string | null;
  onRetry: () => void;
  onGenerate: () => void;
  onViewDetails: (chunk: DocumentChunk) => void;
  onApprove: (chunk: DocumentChunk) => void;
  onReject: (chunk: DocumentChunk) => void;
}

function Skeleton() {
  return (
    <ul className="mt-4 space-y-3" aria-hidden="true">
      {[0, 1, 2, 3].map((row) =>
      <li key={row} className="h-16 animate-pulse rounded-[1.25rem] bg-cream-100/80" />
      )}
    </ul>);

}

export function ChunksList({
  chunks,
  loading,
  error,
  busyChunkId,
  generating,
  selectedId,
  onRetry,
  onGenerate,
  onViewDetails,
  onApprove,
  onReject
}: ChunksListProps) {
  return (
    <section
      aria-labelledby="chunks-title"
      aria-busy={loading}
      className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6">
      
      <h2 id="chunks-title" className="font-display text-sm font-bold text-ink">
        Chunks
      </h2>

      {loading ?
      <>
          <p className="sr-only">Loading chunks…</p>
          <Skeleton />
        </> :
      error ?
      <div role="alert" className="mt-5 rounded-[1.5rem] bg-peach-100/80 px-5 py-6 text-center">
          <p className="mx-auto flex max-w-md items-start justify-center gap-2 break-words font-display text-sm font-bold text-[#a1552c]">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
          <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-peach-500 px-5 py-2.5 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200">
          
            Retry
          </button>
        </div> :
      chunks.length === 0 ?
      <div className="mt-5 rounded-[1.5rem] bg-cream-100/80 px-5 py-10 text-center">
          <LayersIcon className="mx-auto h-6 w-6 text-ink-faint" aria-hidden="true" />
          <p className="mt-3 font-display text-sm font-bold text-ink">No chunks generated yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            Generate a chunk plan from this document to review its sections.
          </p>
          <button
          type="button"
          onClick={onGenerate}
          disabled={generating}
          className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
          generating ? 'cursor-not-allowed bg-peach-200' : 'bg-peach-500 hover:bg-peach-400'}`
          }>
          
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            Generate chunk plan
          </button>
        </div> :

      <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                  <th scope="col" className="px-3 py-2.5">
                    Index
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    Section title
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    Pages
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-2.5">
                    Created at
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {chunks.map((chunk) =>
              <tr
                key={chunk.id}
                className={`align-middle transition-colors duration-150 ease-out ${
                selectedId === chunk.id ? 'bg-cream-100/80' : 'hover:bg-cream-100/60'}`
                }>
                
                    <td className="whitespace-nowrap px-3 py-4 font-display text-sm font-bold text-ink">
                      Chunk {chunk.chunkIndex}
                    </td>
                    <td className="max-w-[18rem] break-words px-3 py-4 text-sm font-semibold text-ink">
                      {sectionTitleOf(chunk)}
                    </td>
                    <td className="px-3 py-4">
                      <TypeBadge type={chunk.sectionType} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">
                      {pageRange(chunk)}
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={chunk.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">
                      {formatChunkDate(chunk.createdAt)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end">
                        <ChunkActions
                      chunk={chunk}
                      busy={busyChunkId === chunk.id}
                      onViewDetails={onViewDetails}
                      onApprove={onApprove}
                      onReject={onReject} />
                    
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-4 space-y-3 lg:hidden">
            {chunks.map((chunk) =>
          <li
            key={chunk.id}
            className={`rounded-[1.5rem] p-4 ${
            selectedId === chunk.id ? 'bg-cream-100' : 'bg-cream-100/70'}`
            }>
            
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 font-display text-[11px] font-bold text-ink">
                    Chunk {chunk.chunkIndex}
                  </span>
                  <TypeBadge type={chunk.sectionType} />
                  <StatusBadge status={chunk.status} />
                </div>

                <p className="mt-3 break-words font-display text-sm font-bold text-ink">
                  {sectionTitleOf(chunk)}
                </p>
                <p className="mt-1 text-xs font-semibold text-ink-soft">
                  {pageRange(chunk)} · {formatChunkDate(chunk.createdAt)}
                </p>

                <div className="mt-3">
                  <ChunkActions
                chunk={chunk}
                busy={busyChunkId === chunk.id}
                onViewDetails={onViewDetails}
                onApprove={onApprove}
                onReject={onReject} />
              
                </div>
              </li>
          )}
          </ul>
        </>
      }
    </section>);

}