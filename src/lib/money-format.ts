/**
 * Money formatting utilities
 * All monetary values are stored as Minor units (cents) in the database
 * Formatting only happens at render time via the Money component
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface MoneyFormatOptions {
  /**
   * Whether to show the sign for positive values
   * @default false
   */
  showPositiveSign?: boolean;

  /**
   * Whether to show the currency symbol
   * @default true
   */
  showCurrency?: boolean;
}

/**
 * Format a Minor (cents) amount to a display string
 *
 * @param minor - Amount in minor units (cents)
 * @param currency - ISO currency code
 * @param options - Formatting options
 * @returns Formatted money string (e.g., "$12.34", "-$5.67")
 *
 * @example
 * formatMoney(1234, 'USD') // "$12.34"
 * formatMoney(-567, 'USD') // "-$5.67"
 * formatMoney(1234, 'USD', { showPositiveSign: true }) // "+$12.34"
 */
export function formatMoney(
  minor: number,
  currency: Currency = 'USD',
  options: MoneyFormatOptions = {}
): string {
  const { showPositiveSign = false, showCurrency = true } = options;

  // Convert minor to major units (cents to dollars)
  const major = minor / 100;

  // Determine sign
  const isNegative = major < 0;
  const isPositive = major > 0;
  const absValue = Math.abs(major);

  // Format the number with 2 decimal places
  const formatted = absValue.toFixed(2);

  // Currency symbol mapping
  const currencySymbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };

  const symbol = showCurrency ? currencySymbols[currency] : '';

  // Build the final string
  let result = '';

  if (isNegative) {
    result = `-${symbol}${formatted}`;
  } else if (isPositive && showPositiveSign) {
    result = `+${symbol}${formatted}`;
  } else {
    result = `${symbol}${formatted}`;
  }

  return result;
}

/**
 * Get the color variant for a money value based on its sign
 *
 * @param minor - Amount in minor units (cents)
 * @returns 'positive' | 'negative' | 'zero'
 */
export function getMoneyColorVariant(minor: number): 'positive' | 'negative' | 'zero' {
  if (minor > 0) return 'positive';
  if (minor < 0) return 'negative';
  return 'zero';
}

/**
 * Parse a display money string back to Minor units
 * Useful for form inputs
 *
 * @param value - Display string (e.g., "12.34", "$12.34")
 * @returns Amount in minor units (cents), or null if invalid
 *
 * @example
 * parseMoneyToMinor("12.34") // 1234
 * parseMoneyToMinor("$12.34") // 1234
 * parseMoneyToMinor("-$5.67") // -567
 */
export function parseMoneyToMinor(value: string): number | null {
  // Remove currency symbols and whitespace
  const cleaned = value.replace(/[$€£¥\s,]/g, '');

  // Parse as float
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) {
    return null;
  }

  // Convert to minor units (cents) and round to avoid floating point issues
  return Math.round(parsed * 100);
}
