/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { effectiveValue } from './theme-derivation';
import { CssThemeTokens, DerivedSet, HslColor, ThemeColors } from './types';

/**
 * Generates a CSS block for the given theme mode.
 * When `tokens` is provided (e.g. for the Clarity Default preset), property values
 * are substituted with global color token references instead of computed hex values.
 */
export function buildCssBlock(
  colors: ThemeColors,
  d: DerivedSet,
  mode: 'light' | 'dark',
  tokens?: CssThemeTokens
): string {
  const sel = mode === 'light' ? `[cds-theme~='light']` : `[cds-theme~='dark']`;
  const lines: string[] = [`${sel} {`];
  const toHsl = ([h, s, l]: HslColor): string => `hsl(${h}, ${s}%, ${l}%)`;

  const emit = (prop: string, fallback: HslColor) => {
    lines.push(`  ${prop}: ${tokens?.[prop] ?? toHsl(fallback)};`);
  };

  lines.push('  /* Primary / Info */');
  emit('--cds-alias-status-info', colors.primary.color);
  emit('--cds-alias-status-info-tint', effectiveValue(d.primaryTint));
  emit('--cds-alias-status-info-shade', effectiveValue(d.primaryShade));
  emit('--cds-alias-object-interaction-background-highlight', colors.primary.color);
  emit('--cds-alias-object-interaction-background-selected', effectiveValue(d.primaryTint));
  emit('--cds-alias-object-interaction-info-hover', effectiveValue(d.primaryHover));
  emit('--cds-alias-object-interaction-info-click', effectiveValue(d.primaryActive));
  emit('--cds-alias-object-interaction-info-active', effectiveValue(d.primaryActive));
  emit('--cds-alias-object-interaction-info-selected', effectiveValue(d.primaryActive));
  emit('--cds-alias-object-interaction-info-secondary-hover', effectiveValue(d.primaryTint));
  emit('--cds-alias-typography-link-color', colors.primary.color);
  emit('--cds-alias-typography-link-color-hover', effectiveValue(d.primaryHover));
  emit('--cds-alias-typography-info-hover', effectiveValue(d.primaryHover));

  lines.push('');
  lines.push('  /* Success */');
  emit('--cds-alias-status-success', colors.success.color);
  emit('--cds-alias-status-success-tint', effectiveValue(d.successTint));
  emit('--cds-alias-status-success-shade', effectiveValue(d.successShade));
  emit('--cds-alias-object-interaction-success-hover', effectiveValue(d.successHover));
  emit('--cds-alias-object-interaction-success-click', effectiveValue(d.successActive));
  emit('--cds-alias-object-interaction-success-active', effectiveValue(d.successActive));
  emit('--cds-alias-object-interaction-success-secondary-hover', effectiveValue(d.successTint));
  emit('--cds-alias-typography-success-hover', effectiveValue(d.successHover));

  lines.push('');
  lines.push('  /* Warning */');
  emit('--cds-alias-status-warning', colors.warning.color);
  emit('--cds-alias-status-warning-tint', effectiveValue(d.warningTint));
  emit('--cds-alias-status-warning-shade', effectiveValue(d.warningShade));
  emit('--cds-alias-status-warning-dark', effectiveValue(d.warningActive));
  emit('--cds-alias-object-interaction-warning-hover', effectiveValue(d.warningHover));
  emit('--cds-alias-object-interaction-warning-click', effectiveValue(d.warningActive));
  emit('--cds-alias-object-interaction-warning-active', effectiveValue(d.warningActive));
  emit('--cds-alias-object-interaction-warning-secondary-hover', effectiveValue(d.warningTint));
  emit('--cds-alias-typography-warning-hover', effectiveValue(d.warningHover));

  lines.push('');
  lines.push('  /* Danger */');
  emit('--cds-alias-status-danger', colors.danger.color);
  emit('--cds-alias-status-danger-tint', effectiveValue(d.dangerTint));
  emit('--cds-alias-status-danger-shade', effectiveValue(d.dangerShade));
  emit('--cds-alias-status-danger-dark', effectiveValue(d.dangerActive));
  emit('--cds-alias-object-interaction-danger-hover', effectiveValue(d.dangerHover));
  emit('--cds-alias-object-interaction-danger-click', effectiveValue(d.dangerActive));
  emit('--cds-alias-object-interaction-danger-active', effectiveValue(d.dangerActive));
  emit('--cds-alias-object-interaction-danger-secondary-hover', effectiveValue(d.dangerTint));
  emit('--cds-alias-typography-danger-hover', effectiveValue(d.dangerHover));

  lines.push('');
  lines.push('  /* Backgrounds */');
  emit('--cds-alias-object-app-background', colors.appBg.color);
  emit('--cds-alias-object-container-background', colors.containerBg.color);
  emit('--cds-alias-object-overlay-background', colors.containerBg.color);

  lines.push('');
  lines.push('  /* Typography */');
  emit('--cds-alias-typography-color-500', colors.text.color);

  lines.push('}');
  return lines.join('\n');
}
