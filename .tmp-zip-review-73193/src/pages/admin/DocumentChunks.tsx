import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  SparklesIcon,
  XIcon } from
'lucide-react';
import { ChunksList } from '../../components/admin/ChunksList';
import { ChunkDetailPanel } from '../../components/admin/ChunkDetailPanel';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { formatChunkDate } from '../../components/admin/chunkFormat';
import { useDocumentChunks } from '../../hooks/useDocumentChunks';
import { contentApi } from '../../utils/contentApi';
import type { BookDocument } from '../../types/document';
import type { DocumentChunk } from '../../types/chunk';

type PendingAction =
{kind: 'generate';} |
{kind: 'reject';chunk: DocumentChunk;} |
null;

export function AdminDocumentChunks() {
  const { bookId = '', documentId = '' } = useParams<{bookId: string;documentId: string;}>();
  const navigate = useNavigate();

  const {
    chunks,
    loading,
    error,
    generating,
    busyChunkId,
    notice,
    setNotice,
    reload,
    generate,
    review
  } = useDocumentChunks(documentId);

  const [document, setDocument] = useState<BookDocument | null>(null);
  const [selected, setSelected] = useState<DocumentChunk | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);

  useEffect(() => {
    let cancelled = false;
    contentApi.
    getDocuments(bookId).
    then((list) => {
      if (cancelled) return;
      setDocument(list.find((item) => item.id === documentId) ?? null);
    }).
    catch(() => {
      if (!cancelled) setDocument(null);
    });
    return () => {
      cancelled = true;
    };
  }, [bookId, documentId]);

  const documentsPath = `/admin/books/${bookId}/documents`;
  const countBy = (status: string) => chunks.filter((chunk) => chunk.status === status).length;
  const lastUpdated = chunks.
  map((chunk) => chunk.updatedAt).
  filter(Boolean).
  sort().
  pop();

  const summary: Array<[string, string]> = [
  ['Original file name', document?.originalFileName ?? '—'],
  ['Document type', document?.documentType ?? '—'],
  ['Document status', document?.status ?? '—'],
  ['Chunks', String(chunks.length)],
  ['Approved', String(countBy('APPROVED'))],
  ['Rejected', String(countBy('REJECTED'))],
  ['AI suggested', String(countBy('AI_SUGGESTED'))],
  ['Last updated', formatChunkDate(lastUpdated ?? document?.updatedAt)]];


  const confirmPending = () => {
    const action = pending;
    setPending(null);
    if (!action) return;
    if (action.kind === 'generate') void generate();
    if (action.kind === 'reject') void review(action.chunk.id, 'reject');
  };

  return (
    <main className="min-h-full w-full bg-cream-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(documentsPath)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-ink shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to documents
        </button>

        <nav aria-label="Breadcrumb" className="mt-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-ink-faint">
            <li>
              <button
                type="button"
                onClick={() => navigate('/admin/books')}
                className="rounded-full transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                Books
              </button>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <button
                type="button"
                onClick={() => navigate(documentsPath)}
                className="rounded-full transition-colors duration-150 ease-out hover:text-peach-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
                
                Documents
              </button>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              Chunks
            </li>
          </ol>
        </nav>

        <header className="mt-3">
          <h1 className="font-display text-[2rem] font-bold leading-tight text-ink">
            Document chunks
          </h1>
          <p className="mt-1.5 break-words text-[15px] text-ink-soft">
            {document?.originalFileName ?? 'Document'}
          </p>
          <p className="mt-1 break-all text-xs font-semibold text-ink-faint">ID · {documentId}</p>
        </header>

        {/* Summary */}
        <section
          aria-label="Document summary"
          className="mt-6 grid gap-x-6 gap-y-4 rounded-[2rem] border border-white/70 bg-white/85 px-5 py-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          
          {summary.map(([label, value]) =>
          <div key={label}>
              <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                {label}
              </p>
              <p className="mt-1 break-words font-display text-sm font-bold text-ink">{value}</p>
            </div>
          )}
        </section>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(documentsPath)}
            className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2.5 font-display text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to documents
          </button>

          <button
            type="button"
            onClick={() => setPending({ kind: 'generate' })}
            disabled={generating}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            generating ? 'cursor-not-allowed bg-peach-200' : 'bg-peach-500 hover:bg-peach-400'}`
            }>
            
            <SparklesIcon
              className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`}
              aria-hidden="true" />
            
            {generating ? 'Generating…' : 'Generate chunk plan'}
          </button>

          <button
            type="button"
            onClick={reload}
            disabled={generating}
            title="Refresh chunks"
            aria-label="Refresh chunks"
            className="inline-flex items-center justify-center rounded-full bg-white p-2.5 text-ink-soft shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 disabled:cursor-not-allowed disabled:text-ink-faint">
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="ml-auto rounded-full bg-white px-4 py-2 font-display text-xs font-bold text-ink-soft">
            {chunks.length} chunks
          </span>
        </div>

        {/* Notice */}
        {notice ?
        <p
          role="status"
          className={`mt-4 flex items-start gap-2 rounded-[1.5rem] px-5 py-4 text-sm font-bold ${
          notice.tone === 'success' ?
          'bg-mint-100 text-[#2f6a4f]' :
          'bg-[#fbe3e3] text-[#b9524f]'}`
          }>
          
            {notice.tone === 'success' ?
          <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> :

          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          }
            <span className="break-words">{notice.text}</span>
            <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss message"
            className="ml-auto rounded-full p-1 transition-colors duration-150 ease-out hover:bg-white/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400">
            
              <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </p> :
        null}

        <ChunksList
          chunks={chunks}
          loading={loading}
          error={error}
          busyChunkId={busyChunkId}
          generating={generating}
          selectedId={selected?.id ?? null}
          onRetry={reload}
          onGenerate={() => setPending({ kind: 'generate' })}
          onViewDetails={setSelected}
          onApprove={(chunk) => void review(chunk.id, 'approve')}
          onReject={(chunk) => setPending({ kind: 'reject', chunk })} />
        

        {selected ?
        <ChunkDetailPanel
          chunk={chunks.find((chunk) => chunk.id === selected.id) ?? selected}
          onClose={() => setSelected(null)} /> :

        null}
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.kind === 'reject' ? 'Reject this chunk?' : 'Generate a new chunk plan?'}
        description={
        pending?.kind === 'reject' ?
        'This chunk will be marked as REJECTED. You can approve it again later.' :
        'The existing chunks will be deleted and replaced with new AI suggestions.'
        }
        confirmLabel={pending?.kind === 'reject' ? 'Reject chunk' : 'Generate plan'}
        onConfirm={confirmPending}
        onCancel={() => setPending(null)} />
      
    </main>);

}