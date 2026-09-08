import { useCallback, useEffect, useState } from "react";
import { contentApi } from "../../../api/contentApi";
import { EMPTY_FILTERS, type Book, type BookFilters } from "../../../types/content";

export function useBooks() {
  const [filters, setFilters] = useState<BookFilters>(EMPTY_FILTERS);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (activeFilters: BookFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contentApi.getBooks(activeFilters);
      setBooks(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Could not load books.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const setFilter = useCallback((key: keyof BookFilters, value: string) => {
    setFilters((prev) => {
      if (key === "levelSystem") return { ...prev, levelSystem: value, levelCode: "" };
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const refresh = useCallback(() => load(filters), [filters, load]);

  return { books, filters, setFilter, resetFilters, loading, error, refresh };
}
