import { DateUtils } from './date.utils';

describe('DateUtils', () => {
  describe('formatISO', () => {
    it('should format date to ISO string without milliseconds', () => {
      const date = new Date('2023-01-15T14:30:00.123Z');
      const result = DateUtils.formatISO(date);
      expect(result).toBe('2023-01-15 14:30:00');
    });

    it('should format string date', () => {
      const dateString = '2023-01-15T14:30:00Z';
      const result = DateUtils.formatISO(dateString);
      expect(result).toBe('2023-01-15 14:30:00');
    });
  });

  describe('formatDisplay', () => {
    it('should format date with default format', () => {
      const date = new Date('2023-01-15T14:30:00Z');
      const result = DateUtils.formatDisplay(date);
      // Note: formatDisplay uses local time, so adjust expectation based on timezone
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should format date with custom format', () => {
      const date = new Date('2023-01-15T14:30:00Z');
      const result = DateUtils.formatDisplay(date, 'YYYY-MM-DD');
      expect(result).toBe('2023-01-15');
    });
  });

  describe('formatForInput', () => {
    it('should format date for datetime-local input', () => {
      const date = new Date('2023-01-15T14:30:00Z');
      const result = DateUtils.formatForInput(date);
      expect(result).toBe('2023-01-15T14:30');
    });
  });

  describe('parseFromInput', () => {
    it('should parse date from datetime-local input', () => {
      const dateString = '2023-01-15T14:30';
      const result = DateUtils.parseFromInput(dateString);
      // Note: parseFromInput adds :00 seconds and uses local timezone
      expect(result.toISOString()).toContain('2023-01-15');
      expect(result.getHours()).toBeGreaterThanOrEqual(13); // Account for timezone
    });

    it('should handle empty string', () => {
      const result = DateUtils.parseFromInput('');
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2023-01-15');
      const result = DateUtils.addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle negative days', () => {
      const date = new Date('2023-01-15');
      const result = DateUtils.addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('diffDays', () => {
    it('should calculate difference in days', () => {
      const date1 = new Date('2023-01-15');
      const date2 = new Date('2023-01-20');
      const result = DateUtils.diffDays(date1, date2);
      expect(result).toBe(5);
    });
  });

  describe('isValid', () => {
    it('should validate date', () => {
      expect(DateUtils.isValid(new Date())).toBe(true);
      expect(DateUtils.isValid('2023-01-15')).toBe(true);
      expect(DateUtils.isValid('invalid')).toBe(false);
    });
  });
});
