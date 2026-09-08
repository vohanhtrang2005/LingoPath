import { RotateCcwIcon } from "lucide-react";
import { CEFR_LEVELS, JLPT_LEVELS, type BookFilters } from "../../../types/content";

interface BookFiltersPanelProps {
  filters: BookFilters;
  onChange: (key: keyof BookFilters, value: string) => void;
  onReset: () => void;
  resultCount: number;
}

const SELECT_CLASS =
  "gk-well w-full appearance-none rounded-4xl bg-cream-100/90 px-4 py-3 text-sm font-semibold text-ink outline-none focus:outline-none";

export function BookFiltersPanel({
  filters,
  onChange,
  onReset,
  resultCount
}: BookFiltersPanelProps) {
  const levelCodes =
    filters.levelSystem === "JLPT"
      ? JLPT_LEVELS
      : filters.levelSystem === "CEFR"
        ? CEFR_LEVELS
        : [...JLPT_LEVELS, ...CEFR_LEVELS];

  const hasFilters = Boolean(filters.language || filters.levelSystem || filters.levelCode);

  return (
    <section
      aria-labelledby="filters-title"
      className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_14px_28px_-24px_rgba(120,88,70,0.9)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="filters-title" className="font-display text-sm font-bold text-ink">
          Filters
        </h2>
        <p className="text-xs font-semibold text-ink-faint">
          {resultCount} {resultCount === 1 ? "book" : "books"}
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label
            htmlFor="filter-language"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Language
          </label>
          <select
            id="filter-language"
            value={filters.language}
            onChange={(event) => onChange("language", event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All</option>
            <option value="JAPANESE">JAPANESE</option>
            <option value="ENGLISH">ENGLISH</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-level-system"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Level system
          </label>
          <select
            id="filter-level-system"
            value={filters.levelSystem}
            onChange={(event) => onChange("levelSystem", event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All</option>
            <option value="JLPT">JLPT</option>
            <option value="CEFR">CEFR</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-level-code"
            className="mb-1.5 block font-display text-xs font-bold text-ink-soft"
          >
            Level code
          </label>
          <select
            id="filter-level-code"
            value={filters.levelCode}
            onChange={(event) => onChange("levelCode", event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">All</option>
            {levelCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={!hasFilters}
        className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-xs font-bold transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 ${
          hasFilters
            ? "bg-cream-100 text-ink hover:bg-cream-200"
            : "cursor-not-allowed bg-cream-100/60 text-ink-faint"
        }`}
      >
        <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Reset filters
      </button>
    </section>
  );
}
