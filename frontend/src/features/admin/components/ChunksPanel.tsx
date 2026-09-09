import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  EyeIcon,
  LayersIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  SparklesIcon,
  XCircleIcon,
  XIcon
} from "lucide-react";
import type { ChunkGenerationJob, SourceChunk } from "../../../types/content";

interface ChunksPanelProps {
  chunks: SourceChunk[];
  loading: boolean;
  error: string | null;
  job: ChunkGenerationJob | null;
  generating: boolean;
  reviewing: boolean;
  notice: { tone: "success" | "error"; text: string } | null;
  onDismissNotice: () => void;
  onReload: () => void;
  onGenerate: () => void;
  onApprovePlan: () => void;
  onRejectAndRegenerate: (reason: string) => void;
}

function formatDate(value?: string): string {
  if (!value) return "-";
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
}

function statusClass(status?: string): string {
  if (status === "APPROVED") return "bg-mint-100 text-[#38795c]";
  if (status === "REJECTED") return "bg-[#fbe3e3] text-[#b9524f]";
  return "bg-peach-100 text-[#a1552c]";
}

function jobMessage(job: ChunkGenerationJob | null): string | null {
  if (!job || job.status === "SUCCEEDED") return null;
  if (job.status === "FAILED") return job.errorMessage || "Chunk generation failed.";
  return `Generating: ${job.completedBatches}/${job.totalBatches} batches completed.`;
}

export function ChunksPanel({
  chunks,
  loading,
  error,
  job,
  generating,
  reviewing,
  notice,
  onDismissNotice,
  onReload,
  onGenerate,
  onApprovePlan,
  onRejectAndRegenerate
}: ChunksPanelProps) {
  const [selectedChunk, setSelectedChunk] = useState<SourceChunk | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const busy = generating || reviewing;
  const progressMessage = jobMessage(job);

  const submitReject = () => {
    const normalizedReason = reason.trim();
    if (normalizedReason.length < 10) {
      setReasonError("Please describe the problem in at least 10 characters.");
      return;
    }
    setRejectDialogOpen(false);
    setReasonError(null);
    onRejectAndRegenerate(normalizedReason);
  };

  return (
    <>
      <section
        aria-labelledby="chunks-title"
        className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="chunks-title" className="flex items-center gap-2 font-display text-sm font-bold text-ink">
              <LayersIcon className="h-4 w-4 text-peach-500" aria-hidden="true" />
              Chunks
            </h2>
            <p className="mt-1 text-xs text-ink-soft">
              Review the complete plan so adjacent sections keep their order and context.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onReload} disabled={loading || busy} title="Refresh chunks" aria-label="Refresh chunks" className="inline-flex items-center justify-center rounded-full bg-cream-100 p-2.5 text-ink-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:text-ink-faint">
              <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            {chunks.length > 0 ? (
              <>
                <button type="button" onClick={onApprovePlan} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-mint-400 px-4 py-2.5 font-display text-xs font-bold text-white transition-colors hover:bg-[#5cbb91] disabled:cursor-not-allowed disabled:bg-mint-200">
                  <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                  Approve plan
                </button>
                <button type="button" onClick={() => setRejectDialogOpen(true)} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-[#fbe3e3] px-4 py-2.5 font-display text-xs font-bold text-[#b9524f] transition-colors hover:bg-[#f8d6d6] disabled:cursor-not-allowed disabled:text-[#d9a5a5]">
                  <XCircleIcon className="h-4 w-4" aria-hidden="true" />
                  Reject & regenerate
                </button>
              </>
            ) : null}
            <button type="button" onClick={onGenerate} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-peach-500 px-4 py-2.5 font-display text-xs font-bold text-white transition-colors hover:bg-peach-400 disabled:cursor-not-allowed disabled:bg-peach-200">
              {busy ? <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" /> : <SparklesIcon className="h-4 w-4" aria-hidden="true" />}
              {generating ? "Generating..." : job?.status === "FAILED" ? "Retry failed batches" : "Generate chunks"}
            </button>
          </div>
        </div>

        {progressMessage ? <div className="mt-4 rounded-[1.25rem] bg-sky-100 px-4 py-3 text-sm font-semibold text-[#3b6a94]">{progressMessage} Polling every 5 seconds.</div> : null}

        {notice ? (
          <div role={notice.tone === "error" ? "alert" : "status"} className={`mt-4 flex items-start gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-bold ${notice.tone === "success" ? "bg-mint-100 text-[#2f6a4f]" : "bg-[#fbe3e3] text-[#b9524f]"}`}>
            {notice.tone === "success" ? <CheckCircle2Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
            <span className="break-words">{notice.text}</span>
            <button type="button" onClick={onDismissNotice} className="ml-auto rounded-full p-1 hover:bg-white/70" aria-label="Dismiss message"><XIcon className="h-3.5 w-3.5" aria-hidden="true" /></button>
          </div>
        ) : null}

        {loading ? (
          <p className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-ink-soft"><LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />Loading chunks...</p>
        ) : error ? (
          <div role="alert" className="mt-5 rounded-[1.5rem] bg-peach-100/80 px-5 py-6 text-center"><p className="flex items-center justify-center gap-2 font-display text-sm font-bold text-[#a1552c]"><AlertCircleIcon className="h-4 w-4" aria-hidden="true" />{error}</p><button type="button" onClick={onReload} className="mt-4 rounded-full bg-peach-500 px-5 py-2.5 font-display text-xs font-bold text-white">Retry</button></div>
        ) : chunks.length === 0 ? (
          <div className="mt-5 rounded-[1.5rem] bg-cream-100/80 px-5 py-10 text-center"><LayersIcon className="mx-auto h-6 w-6 text-ink-faint" aria-hidden="true" /><p className="mt-3 font-display text-sm font-bold text-ink">No chunks generated yet.</p><p className="mt-1 text-sm text-ink-soft">Generate a chunk plan from the extracted document.</p></div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[54rem] border-collapse text-left">
              <thead><tr className="text-[11px] font-bold uppercase tracking-wide text-ink-faint"><th className="px-3 py-2.5">Chunk</th><th className="px-3 py-2.5">Section</th><th className="px-3 py-2.5">Pages</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Updated</th><th className="px-3 py-2.5 text-right">Details</th></tr></thead>
              <tbody>
                {chunks.map((chunk) => <tr key={chunk.id} className="align-middle transition-colors hover:bg-cream-100/60"><td className="px-3 py-4 font-display text-sm font-bold text-ink">#{chunk.chunkIndex}</td><td className="max-w-[18rem] px-3 py-4 text-sm font-semibold text-ink"><span className="block truncate">{chunk.sectionTitle || "Untitled section"}</span><span className="mt-0.5 block text-xs font-normal text-ink-soft">{chunk.sectionType || "OTHER"}</span></td><td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{chunk.pageFrom ?? "-"} - {chunk.pageTo ?? "-"}</td><td className="px-3 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${statusClass(chunk.status)}`}>{chunk.status}</span></td><td className="whitespace-nowrap px-3 py-4 text-sm text-ink-soft">{formatDate(chunk.updatedAt)}</td><td className="px-3 py-4 text-right"><button type="button" onClick={() => setSelectedChunk(chunk)} title="View chunk details" aria-label={`View details for chunk ${chunk.chunkIndex}`} className="inline-flex items-center justify-center rounded-full bg-white p-2.5 text-ink-soft shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] hover:text-ink"><EyeIcon className="h-4 w-4" aria-hidden="true" /></button></td></tr>)}
              </tbody>
            </table>
          </div>
        )}

        {selectedChunk ? (
          <section aria-labelledby="chunk-detail-title" className="mt-5 rounded-[1.5rem] bg-cream-100/85 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id="chunk-detail-title" className="font-display text-sm font-bold text-ink">Chunk #{selectedChunk.chunkIndex} details</h3><p className="mt-1 text-sm font-semibold text-ink-soft">{selectedChunk.sectionTitle || "Untitled section"}</p></div><button type="button" onClick={() => setSelectedChunk(null)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-display text-xs font-bold text-ink hover:bg-cream-200"><XIcon className="h-3.5 w-3.5" aria-hidden="true" />Close</button></div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3"><div className="rounded-[1.1rem] bg-white/80 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Type</p><p className="mt-1 text-sm font-semibold text-ink">{selectedChunk.sectionType || "OTHER"}</p></div><div className="rounded-[1.1rem] bg-white/80 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Pages</p><p className="mt-1 text-sm font-semibold text-ink">{selectedChunk.pageFrom ?? "-"} - {selectedChunk.pageTo ?? "-"}</p></div><div className="rounded-[1.1rem] bg-white/80 px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Status</p><p className="mt-1 text-sm font-semibold text-ink">{selectedChunk.status}</p></div></div>
            {selectedChunk.reviewReason ? <p className="mt-3 rounded-[1.1rem] bg-[#fbe3e3] px-4 py-3 text-sm text-[#b9524f]"><strong>Review reason:</strong> {selectedChunk.reviewReason}</p> : null}
            <div className="mt-3 grid gap-2 sm:grid-cols-2"><pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-[1.1rem] bg-white/80 px-4 py-3 text-xs leading-relaxed text-ink"><strong>Start marker</strong>{`\n${selectedChunk.startMarker || "-"}`}</pre><pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-[1.1rem] bg-white/80 px-4 py-3 text-xs leading-relaxed text-ink"><strong>End marker</strong>{`\n${selectedChunk.endMarker || "-"}`}</pre></div>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-[1.1rem] bg-white/80 px-4 py-3 text-sm leading-relaxed text-ink">{selectedChunk.chunkText || "Chunk text is not available yet."}</pre>
          </section>
        ) : null}
      </section>

      {rejectDialogOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-5 py-6" role="presentation"><section role="dialog" aria-modal="true" aria-labelledby="reject-plan-title" className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 id="reject-plan-title" className="font-display text-lg font-bold text-ink">Reject and regenerate plan</h2><p className="mt-1.5 text-sm leading-relaxed text-ink-soft">All current chunks will be marked rejected, then the complete plan will be regenerated using this feedback.</p></div><button type="button" onClick={() => setRejectDialogOpen(false)} aria-label="Close dialog" className="rounded-full p-2 text-ink-soft hover:bg-cream-100"><XIcon className="h-4 w-4" aria-hidden="true" /></button></div><label htmlFor="reject-reason" className="mt-5 block text-xs font-bold uppercase tracking-wide text-ink-faint">Reason</label><textarea id="reject-reason" value={reason} onChange={(event) => { setReason(event.target.value); setReasonError(null); }} rows={5} autoFocus placeholder="Example: Chunk 2 starts in the middle of a section; keep the heading with the following exercise." className="mt-2 w-full resize-y rounded-[1.25rem] bg-cream-100/90 px-4 py-3 text-sm leading-relaxed text-ink outline-none focus:ring-2 focus:ring-peach-300" />{reasonError ? <p role="alert" className="mt-2 text-sm font-semibold text-[#b9524f]">{reasonError}</p> : null}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setRejectDialogOpen(false)} className="rounded-full bg-cream-100 px-4 py-2.5 font-display text-xs font-bold text-ink hover:bg-cream-200">Cancel</button><button type="button" onClick={submitReject} className="inline-flex items-center gap-2 rounded-full bg-[#b9524f] px-4 py-2.5 font-display text-xs font-bold text-white hover:bg-[#a64542]"><XCircleIcon className="h-4 w-4" aria-hidden="true" />Reject & regenerate</button></div></section></div> : null}
    </>
  );
}
