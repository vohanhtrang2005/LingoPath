import { format, parseISO } from "date-fns";
import {
  AlertCircleIcon,
  FileStackIcon,
  FileTextIcon,
  InfoIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  ScanTextIcon
} from "lucide-react";
import { formatBytes } from "./UploadPanel";
import type { BookDocument, DocumentStatus } from "../../../types/content";

interface DocumentsTableProps {
  documents: BookDocument[];
  loading: boolean;
  error: string | null;
  extractingId: string | null;
  selectedId: string | null;
  onRetry: () => void;
  onExtract: (documentId: string) => void;
  onViewText: (document: BookDocument) => void;
  onDetails: (document: BookDocument) => void;
}

const STATUS_STYLE: Record<DocumentStatus, string> = {
  UPLOADED: "bg-cream-200 text-ink-soft",
  EXTRACTING: "bg-peach-100 text-[#a1552c]",
  EXTRACTED: "bg-mint-100 text-[#38795c]",
  FAILED: "bg-[#fbe3e3] text-[#b9524f]"
};

function formatDate(value?: string): string {
  if (!value) return "-";
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
}

export function DocumentsTable({
  documents,
  loading,
  error,
  extractingId,
  selectedId,
  onRetry,
  onExtract,
  onViewText,
  onDetails
}: DocumentsTableProps) {
  return (
    <section
      aria-labelledby="documents-title"
      className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
    >
      <h2 id="documents-title" className="font-display text-sm font-bold text-ink">
        Documents
      </h2>

      {loading ? (
        <p className="flex items-center justify-center gap-2 py-10 text-sm font-semibold text-ink-soft">
          <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading documents...
        </p>
      ) : error ? (
        <div role="alert" className="mt-5 rounded-[1.5rem] bg-peach-100/80 px-5 py-6 text-center">
          <p className="flex items-center justify-center gap-2 font-display text-sm font-bold text-[#a1552c]">
            <AlertCircleIcon className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-full bg-peach-500 px-5 py-2.5 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-peach-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200"
          >
            Retry
          </button>
        </div>
      ) : documents.length === 0 ? (
        <div className="mt-5 rounded-[1.5rem] bg-cream-100/80 px-5 py-10 text-center">
          <FileStackIcon className="mx-auto h-6 w-6 text-ink-faint" aria-hidden="true" />
          <p className="mt-3 font-display text-sm font-bold text-ink">
            No documents uploaded yet.
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Upload a PDF or text file to start extraction.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[64rem] border-collapse text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                <th scope="col" className="px-3 py-2.5">
                  File name
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Type
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Content type
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Size
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Status
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Error
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Created
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Updated
                </th>
                <th scope="col" className="px-3 py-2.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((document) => {
                const busy = extractingId === document.id || document.status === "EXTRACTING";
                const canExtract = document.status === "UPLOADED" || document.status === "FAILED";
                const extracted = document.status === "EXTRACTED";

                return (
                  <tr
                    key={document.id}
                    className={`align-middle transition-colors duration-150 ease-out ${
                      selectedId === document.id ? "bg-cream-100/80" : "hover:bg-cream-100/60"
                    }`}
                  >
                    <td className="max-w-[16rem] px-3 py-4 font-display text-sm font-bold text-ink">
                      <span className="block truncate">{document.originalFileName}</span>
                      <span className="mt-0.5 block truncate text-[11px] font-semibold text-ink-faint">
                        {document.storedFileName}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-bold text-[#3b6a94]">
                        {document.documentType}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-ink-soft">
                      {document.contentType || "unknown"}
                    </td>
                    <td className="px-3 py-4 text-sm text-ink-soft">
                      {formatBytes(document.fileSize)}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                          STATUS_STYLE[document.status] ?? "bg-cream-200 text-ink-soft"
                        }`}
                      >
                        {busy ? (
                          <LoaderCircleIcon className="h-3 w-3 animate-spin" aria-hidden="true" />
                        ) : null}
                        {busy && document.status !== "EXTRACTING" ? "EXTRACTING" : document.status}
                      </span>
                    </td>
                    <td className="max-w-[14rem] px-3 py-4 text-sm text-[#b9524f]">
                      {document.errorMessage ? (
                        <span className="block" title={document.errorMessage}>
                          {document.errorMessage}
                        </span>
                      ) : (
                        <span className="text-ink-faint">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-ink-soft">
                      {formatDate(document.createdAt)}
                    </td>
                    <td className="px-3 py-4 text-sm text-ink-soft">
                      {formatDate(document.updatedAt)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {canExtract ? (
                          <button
                            type="button"
                            onClick={() => onExtract(document.id)}
                            disabled={busy}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-display text-xs font-bold text-white transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
                              busy
                                ? "cursor-not-allowed bg-peach-200"
                                : "bg-peach-500 hover:bg-peach-400"
                            }`}
                          >
                            <ScanTextIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            Extract
                          </button>
                        ) : null}

                        {extracted ? (
                          <>
                            <button
                              type="button"
                              onClick={() => onViewText(document)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-mint-300 px-3.5 py-2 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-[#8ad0af] focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-200"
                            >
                              <FileTextIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              View text
                            </button>
                            <button
                              type="button"
                              onClick={() => onExtract(document.id)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 font-display text-xs font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 disabled:cursor-not-allowed disabled:text-ink-faint"
                            >
                              <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Re-extract
                            </button>
                          </>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => onDetails(document)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-display text-xs font-bold text-ink-soft shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400"
                        >
                          <InfoIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
