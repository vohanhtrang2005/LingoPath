import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react";
import { contentApi } from "../../../api/contentApi";
import type { BookDocument } from "../../../types/content";
import { ChunksPanel } from "../components/ChunksPanel";
import { useDocumentChunks } from "../hooks/useDocumentChunks";

export function AdminDocumentChunksPage() {
  const { bookId = "", documentId = "" } = useParams<{
    bookId: string;
    documentId: string;
  }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<BookDocument | null>(null);

  const chunkState = useDocumentChunks(documentId);

  useEffect(() => {
    let cancelled = false;
    void contentApi
      .getDocuments(bookId)
      .then((response) => {
        if (!cancelled) setDocument(response.data.find((item) => item.id === documentId) ?? null);
      })
      .catch(() => {
        if (!cancelled) setDocument(null);
      });
    return () => {
      cancelled = true;
    };
  }, [bookId, documentId]);

  return (
    <main className="min-h-full w-full bg-cream-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(`/admin/books/${bookId}/documents`)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-ink shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] hover:bg-cream-100"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to documents
        </button>

        <header className="mt-6">
          <p className="font-display text-xs font-bold tracking-[0.18em] text-[#8a5638]">GAKUDO ADMIN - CHUNKS</p>
          <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight text-ink">Document chunks</h1>
          <p className="mt-1.5 break-words text-[15px] text-ink-soft">
            {document?.originalFileName || "Loading document..."}
          </p>
          <p className="mt-1 break-all text-xs font-semibold text-ink-faint">ID: {documentId}</p>
        </header>

        <section className="mt-6 grid gap-4 rounded-[2rem] border border-white/70 bg-white/85 px-5 py-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Document status</p>
            <p className="mt-1 font-display text-sm font-bold text-ink">{document?.status || <LoaderCircleIcon className="inline h-4 w-4 animate-spin" />}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">Chunks</p>
            <p className="mt-1 font-display text-sm font-bold text-ink">{chunkState.chunks.length}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">AI job</p>
            <p className="mt-1 font-display text-sm font-bold text-ink">{chunkState.job?.status || "Not started"}</p>
          </div>
        </section>

        <ChunksPanel
          chunks={chunkState.chunks}
          loading={chunkState.loading}
          error={chunkState.error}
          job={chunkState.job}
          generating={chunkState.generating}
          reviewing={chunkState.reviewing}
          notice={chunkState.notice}
          onDismissNotice={() => chunkState.setNotice(null)}
          onReload={chunkState.reload}
          onGenerate={() => { void chunkState.generate(); }}
          onApprovePlan={chunkState.approvePlan}
          onRejectAndRegenerate={chunkState.rejectAndRegenerate}
        />
      </div>
    </main>
  );
}
