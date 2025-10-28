import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatTimeAgo,
  formatDuration,
  isDateInPast,
  isDateInFuture
} from '../dateTime';

describe('dateTime utility functions', () => {
  const now = new Date('2024-01-15T12:00:00Z');
  
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format Date object with default pattern', () => {
      const date = new Date('2024-01-10T00:00:00Z');
      const result = formatDate(date);
      expect(result).toContain('January');
    });

    it('should format ISO string with default pattern', () => {
      const result = formatDate('2024-01-10T00:00:00Z');
      expect(result).toContain('January');
    });

    it('should format with custom pattern', () => {
      const date = new Date('2024-01-10T00:00:00Z');
      const result = formatDate(date, 'yyyy-MM-dd');
      expect(result).toBe('2024-01-10');
    });
  });

  describe('formatDateTime', () => {
    it('should format Date object with time', () => {
      const date = new Date('2024-01-10T15:30:00Z');
      const result = formatDateTime(date);
      expect(result).toContain('January');
      expect(result).toContain('PM');
    });

    it('should format ISO string with time', () => {
      const result = formatDateTime('2024-01-10T15:30:00Z');
      expect(result).toContain('January');
    });
  });

  describe('formatTimeAgo', () => {
    it('should return relative time for recent date', () => {
      const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
      const result = formatTimeAgo(fiveMinutesAgo);
      expect(result).toContain('ago');
    });

    it('should work with ISO string', () => {
      const result = formatTimeAgo('2024-01-15T11:55:00Z');
      expect(result).toContain('ago');
    });
  });

  describe('formatDuration', () => {
    it('should calculate duration between two dates', () => {
      const start = new Date('2024-01-10T00:00:00Z');
      const end = new Date('2024-01-15T00:00:00Z');
      const result = formatDuration(start, end);
      expect(result).toContain('5 days');
    });

    it('should work with ISO strings', () => {
      const result = formatDuration('2024-01-10T00:00:00Z', '2024-01-15T00:00:00Z');
      expect(result).toContain('5 days');
    });
  });

  describe('isDateInPast', () => {
    it('should return true for past date', () => {
      const pastDate = new Date('2024-01-10T00:00:00Z');
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date('2024-01-20T00:00:00Z');
      expect(isDateInPast(futureDate)).toBe(false);
    });

    it('should work with ISO string', () => {
      expect(isDateInPast('2024-01-10T00:00:00Z')).toBe(true);
      expect(isDateInPast('2024-01-20T00:00:00Z')).toBe(false);
    });
  });

  describe('isDateInFuture', () => {
    it('should return true for future date', () => {
      const futureDate = new Date('2024-01-20T00:00:00Z');
      expect(isDateInFuture(futureDate)).toBe(true);
    });

    it('should return false for past date', () => {
      const pastDate = new Date('2024-01-10T00:00:00Z');
      expect(isDateInFuture(pastDate)).toBe(false);
    });

    it('should work with ISO string', () => {
      expect(isDateInFuture('2024-01-20T00:00:00Z')).toBe(true);
      expect(isDateInFuture('2024-01-10T00:00:00Z')).toBe(false);
    });
  });
});
