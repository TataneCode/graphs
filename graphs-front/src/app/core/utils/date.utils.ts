export class DateUtils {
  /**
   * Format date to ISO string without milliseconds
   */
  static formatISO(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Format date for display
   */
  static formatDisplay(date: Date | string, format: string = 'YYYY-MM-DD HH:mm'): string {
    const d = new Date(date);

    const pad = (num: number) => num.toString().padStart(2, '0');

    return format
      .replace('YYYY', d.getFullYear().toString())
      .replace('MM', pad(d.getMonth() + 1))
      .replace('DD', pad(d.getDate()))
      .replace('HH', pad(d.getHours()))
      .replace('mm', pad(d.getMinutes()))
      .replace('ss', pad(d.getSeconds()));
  }

  /**
   * Parse date from various formats
   */
  static parse(date: string | Date): Date {
    if (date instanceof Date) {
      return date;
    }

    if (!date) {
      return new Date();
    }

    // Try ISO format first
    try {
      return new Date(date);
    } catch {
      // Try other formats
      return new Date(date);
    }
  }

  /**
   * Get start of day
   */
  static startOfDay(date: Date | string = new Date()): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Get end of day
   */
  static endOfDay(date: Date | string = new Date()): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  /**
   * Get date difference in days
   */
  static diffDays(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  }

  /**
   * Add days to date
   */
  static addDays(date: Date | string, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  /**
   * Add months to date
   */
  static addMonths(date: Date | string, months: number): Date {
    const d = new Date(date);
    const currentMonth = d.getMonth();
    d.setMonth(currentMonth + months);
    return d;
  }

  /**
   * Check if date is valid
   */
  static isValid(date: Date | string): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }

    try {
      const d = new Date(date);
      return !isNaN(d.getTime());
    } catch {
      return false;
    }
  }

  /**
   * Get current timestamp
   */
  static now(): Date {
    return new Date();
  }

  /**
   * Get timestamp for one month ago
   */
  static oneMonthAgo(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  /**
   * Format date for input[type="datetime-local"]
   */
  static formatForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  /**
   * Parse date from input[type="datetime-local"]
   */
  static parseFromInput(value: string): Date {
    if (!value) return new Date();
    // Add :00 seconds if not present
    const withSeconds = value.length === 16 ? value + ':00' : value;
    return new Date(withSeconds);
  }
}
