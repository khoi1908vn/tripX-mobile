import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { formatMoney, getMoneyColorVariant, Currency } from '../../lib/money-format';

export interface MoneyProps extends Omit<TextProps, 'children'> {
  /**
   * Amount in minor units (cents)
   */
  minor: number;

  /**
   * Currency code
   * @default 'USD'
   */
  currency?: Currency;

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

  /**
   * Whether to apply semantic color based on sign
   * Green for positive, red for negative, default text color for zero
   * @default true
   */
  colorBySign?: boolean;

  /**
   * Override the automatic color
   */
  color?: string;
}

/**
 * Money component
 *
 * Renders monetary values with correct formatting, semantic colors, and tabular numerals.
 * This is the ONLY component that should format money values in the app.
 *
 * Features:
 * - Formats Minor (cents) to display string
 * - Applies semantic colors: green (positive), red (negative), default (zero)
 * - Uses tabular-nums font variant for column alignment
 * - Selectable for copying
 *
 * @example
 * <Money minor={1234} /> // "$12.34" in default text color
 * <Money minor={1234} colorBySign /> // "$12.34" in green
 * <Money minor={-567} colorBySign /> // "-$5.67" in red
 * <Money minor={1234} showPositiveSign colorBySign /> // "+$12.34" in green
 */
export const Money: React.FC<MoneyProps> = ({
  minor,
  currency = 'USD',
  showPositiveSign = false,
  showCurrency = true,
  colorBySign = true,
  color,
  style,
  ...textProps
}) => {
  const formatted = formatMoney(minor, currency, { showPositiveSign, showCurrency });
  const variant = getMoneyColorVariant(minor);

  // Determine color
  let computedColor: string | undefined = color;

  if (!computedColor && colorBySign) {
    // Use semantic colors from design tokens
    if (variant === 'positive') {
      computedColor = '#34C759'; // systemGreen light mode approximation
    } else if (variant === 'negative') {
      computedColor = '#FF3B30'; // systemRed light mode approximation
    }
  }

  return (
    <Text
      {...textProps}
      style={[
        styles.money,
        computedColor && { color: computedColor },
        style,
      ]}
      selectable
    >
      {formatted}
    </Text>
  );
};

const styles = StyleSheet.create({
  money: {
    fontSize: 17,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
