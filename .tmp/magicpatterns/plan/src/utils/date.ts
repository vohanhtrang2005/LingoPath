import { addMonths, format, parseISO } from 'date-fns';

/** Today as an ISO date string (yyyy-MM-dd) for <input type="date"> */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatFriendly(iso: string): string {
  if (!iso) return '—';
  try {
    return format(parseISO(iso), 'd MMM yyyy');
  } catch {
    return iso;
  }
}

export function finishDate(startISO: string, months: number): string {
  try {
    return format(addMonths(parseISO(startISO), months), 'd MMM yyyy');
  } catch {
    return '—';
  }
}