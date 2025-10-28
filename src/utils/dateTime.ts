import { format, formatDistance, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(date: Date | string, pattern = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern);
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'PPP p');
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function formatDuration(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;
  return formatDistance(startDate, endDate);
}

export function isDateInPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.getTime() < Date.now();
}

export function isDateInFuture(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj.getTime() > Date.now();
}
