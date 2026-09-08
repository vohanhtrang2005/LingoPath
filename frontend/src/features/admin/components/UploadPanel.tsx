import { useRef, useState } from "react";
import {
  CheckCircle2Icon,
  LoaderCircleIcon,
  UploadCloudIcon,
  XCircleIcon,
  XIcon
} from "lucide-react";
import { contentApi } from "../../../api/contentApi";
import { ACCEPTED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "../../../types/content";

interface UploadPanelProps {
  bookId: string;
  onUploaded: () => void;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPanel({ bookId, onUploaded }: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const pickFile = (nextFile: File | null) => {
    setMessage(null);
    if (!nextFile) {
      setFile(null);
      setValidationError(null);
      return;
    }
    if (nextFile.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      setValidationError("File is larger than the 100MB limit.");
      return;
    }
    setValidationError(null);
    setFile(nextFile);
  };

  const clear = () => {
    setFile(null);
    setValidationError(null);
    setMessage(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const resetPickedFile = () => {
    setFile(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      await contentApi.uploadDocument(bookId, file);
      resetPickedFile();
      setMessage({ tone: "success", text: "Document uploaded." });
      onUploaded();
    } catch {
      setMessage({ tone: "error", text: "Could not upload document." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <section
      aria-labelledby="upload-title"
      className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
    >
      <h2 id="upload-title" className="font-display text-sm font-bold text-ink">
        Upload a document
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-ink-soft">
        PDF, TXT, MD, CSV, PNG or JPG - up to 100MB. Extraction runs after upload.
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          pickFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`mt-4 rounded-[1.5rem] px-5 py-7 text-center transition-colors duration-200 ease-out ${
          dragging ? "bg-peach-100/80 ring-2 ring-peach-300" : "gk-well bg-cream-100/85"
        }`}
      >
        <UploadCloudIcon className="mx-auto h-6 w-6 text-peach-500" aria-hidden="true" />
        <p className="mt-2 text-sm font-semibold text-ink">Drag a file here</p>

        <label
          htmlFor="document-file"
          className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 font-display text-xs font-bold text-ink shadow-[0_10px_20px_-16px_rgba(120,88,70,0.9)] transition-colors duration-150 ease-out hover:bg-cream-100 focus-within:ring-2 focus-within:ring-peach-400"
        >
          Choose a file
        </label>
        <input
          ref={inputRef}
          id="document-file"
          type="file"
          accept={ACCEPTED_UPLOAD_TYPES}
          onChange={(event) => pickFile(event.target.files?.[0] ?? null)}
          className="sr-only"
        />
      </div>

      {validationError ? (
        <p role="alert" className="mt-3 text-xs font-bold text-[#c65f5f]">
          {validationError}
        </p>
      ) : null}

      {file ? (
        <dl className="mt-4 space-y-1.5 rounded-[1.25rem] bg-cream-100/85 px-4 py-3.5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Name</dt>
            <dd className="truncate font-semibold text-ink">{file.name}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">Size</dt>
            <dd className="font-semibold text-ink">{formatBytes(file.size)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs font-bold uppercase tracking-wide text-ink-faint">
              Content type
            </dt>
            <dd className="font-semibold text-ink">{file.type || "unknown"}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={upload}
          disabled={!file || uploading}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-peach-200 ${
            !file || uploading ? "cursor-not-allowed bg-peach-200" : "bg-peach-500 hover:bg-peach-400"
          }`}
        >
          {uploading ? (
            <>
              <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
              Uploading...
            </>
          ) : (
            <>
              <UploadCloudIcon className="h-4 w-4" aria-hidden="true" />
              Upload
            </>
          )}
        </button>

        <button
          type="button"
          onClick={clear}
          disabled={uploading || (!file && !message && !validationError)}
          className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-5 py-3 font-display text-sm font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 disabled:cursor-not-allowed disabled:text-ink-faint"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
          Clear
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-[1.25rem] px-4 py-3 text-sm font-bold ${
            message.tone === "success" ? "bg-mint-100 text-[#2f6a4f]" : "bg-peach-100 text-[#b9524f]"
          }`}
        >
          {message.tone === "success" ? (
            <CheckCircle2Icon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <XCircleIcon className="h-4 w-4" aria-hidden="true" />
          )}
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
