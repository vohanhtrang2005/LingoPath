import { format, parseISO } from "date-fns";
import { AlertCircleIcon, FileTextIcon, LibraryIcon, LoaderCircleIcon } from "lucide-react";
import type { Book } from "../../../types/content";

interface BooksTableProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onViewDocuments: (bookId: string) => void;
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "ACTIVE"
      ? "bg-mint-100 text-[#38795c]"
      : status === "ARCHIVED"
        ? "bg-cream-200 text-ink-faint"
        : "bg-sky-100 text-[#3b6a94]";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${style}`}>
      {status || "UNKNOWN"}
    </span>
  );
}

function formatCreatedAt(value?: string): string {
  if (!value) return "-";
  try {
    return format(parseISO(value), "d MMM yyyy");
  } catch {
    return value;
  }
}

export function BooksTable({
  books,
  loading,
  error,
  onRetry,
  onViewDocuments
}: BooksTableProps) {
  return (
    <section
      aria-labelledby="books-title"
      className="mt-6 rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
    >
      <h2 id="books-title" className="font-display text-sm font-bold text-ink">
        All books
      </h2>

      {loading ? (
        <p className="mt-6 flex items-center justify-center gap-2 py-10 text-sm font-semibold text-ink-soft">
          <LoaderCircleIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading books...
        </p>
      ) : error ? (
        <div
          role="alert"
          className="mt-5 rounded-[1.5rem] bg-peach-100/80 px-5 py-6 text-center"
        >
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
      ) : books.length === 0 ? (
        <div className="mt-5 rounded-[1.5rem] bg-cream-100/80 px-5 py-10 text-center">
          <LibraryIcon className="mx-auto h-6 w-6 text-ink-faint" aria-hidden="true" />
          <p className="mt-3 font-display text-sm font-bold text-ink">No books found</p>
          <p className="mt-1 text-sm text-ink-soft">
            Create a book with the form, or clear the filters to see everything.
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                <th scope="col" className="px-3 py-2.5">
                  Name
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Author
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Language
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Level system
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Level code
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Status
                </th>
                <th scope="col" className="px-3 py-2.5">
                  Created
                </th>
                <th scope="col" className="px-3 py-2.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="rounded-[1.25rem] align-middle transition-colors duration-150 ease-out hover:bg-cream-100/70"
                >
                  <td className="px-3 py-4 font-display text-sm font-bold text-ink">
                    {book.name}
                  </td>
                  <td className="px-3 py-4 text-sm text-ink-soft">{book.author || "Unknown"}</td>
                  <td className="px-3 py-4">
                    <span className="inline-flex rounded-full bg-peach-100 px-3 py-1 text-[11px] font-bold text-[#a1552c]">
                      {book.language}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-ink-soft">
                    {book.levelSystem}
                  </td>
                  <td className="px-3 py-4 text-sm font-semibold text-ink-soft">
                    {book.levelCode}
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={book.status} />
                  </td>
                  <td className="px-3 py-4 text-sm text-ink-soft">
                    {formatCreatedAt(book.createdAt)}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDocuments(book.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-4 py-2 font-display text-xs font-bold text-ink transition-colors duration-150 ease-out hover:bg-cream-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400"
                    >
                      <FileTextIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      View documents
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
