import { useCallback, useEffect, useState } from 'react';
import { contentApi } from '../utils/contentApi';
import { EMPTY_FILTERS, type Book, type BookFilters } from '../types/book';

export function useBooks() {
  const [filters, setFilters] = useState<BookFilters>(EMPTY_FILTERS);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (activeFilters: BookFilters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contentApi.getBooks(activeFilters);
      setBooks(Array.isArray(result) ? result : []);
    } catch {
      setError('Could not load books.');
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
      // Changing the level system invalidates a level code from the other scale.
      if (key === 'levelSystem') return { ...prev, levelSystem: value, levelCode: '' };
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const refresh = useCallback(() => load(filters), [load, filters]);

  return { books, filters, setFilter, resetFilters, loading, error, refresh };
}