import { useNavigate } from "react-router-dom";
import { BookFiltersPanel } from "../components/BookFilters";
import { BooksTable } from "../components/BooksTable";
import { CreateBookForm } from "../components/CreateBookForm";
import { useBooks } from "../hooks/useBooks";

export function AdminBooksPage() {
  const navigate = useNavigate();
  const { books, filters, setFilter, resetFilters, loading, error, refresh } = useBooks();

  return (
    <main className="min-h-full w-full bg-cream-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[0.9rem] bg-white shadow-[0_12px_24px_-14px_rgba(150,110,86,0.8)]">
              <span className="font-display text-base font-bold text-peach-600">G</span>
            </span>
            <span className="font-display text-xs font-bold tracking-[0.18em] text-[#8a5638]">
              GAKUDO ADMIN
            </span>
          </div>

          <h1 className="mt-5 font-display text-[2rem] font-bold leading-tight text-ink">Books</h1>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            Create and manage learning sources before uploading documents.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            <BookFiltersPanel
              filters={filters}
              onChange={setFilter}
              onReset={resetFilters}
              resultCount={books.length}
            />

            <BooksTable
              books={books}
              loading={loading}
              error={error}
              onRetry={refresh}
              onViewDocuments={(bookId) => navigate(`/admin/books/${bookId}/documents`)}
            />
          </div>

          <CreateBookForm onCreated={refresh} />
        </div>
      </div>
    </main>
  );
}
