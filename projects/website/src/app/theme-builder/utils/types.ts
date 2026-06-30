/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { Color } from './color';

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** HSL color tuple: [hue 0–360, saturation 0–100, lightness 0–100] */
export type HslColor = [number, number, number];

export interface ThemeColors {
  primary: Color;
  success: Color;
  warning: Color;
  danger: Color;
  appBg: Color;
  containerBg: Color;
  text: Color;
}

export interface DerivableField {
  auto: HslColor;
  override: HslColor;
  useManual: boolean;
}

export interface DerivedSet {
  primaryTint: DerivableField;
  primaryShade: DerivableField;
  primaryHover: DerivableField;
  primaryActive: DerivableField;
  successTint: DerivableField;
  successShade: DerivableField;
  successHover: DerivableField;
  successActive: DerivableField;
  warningTint: DerivableField;
  warningShade: DerivableField;
  warningHover: DerivableField;
  warningActive: DerivableField;
  dangerTint: DerivableField;
  dangerShade: DerivableField;
  dangerHover: DerivableField;
  dangerActive: DerivableField;
}

/**
 * Maps CSS custom property names to token expressions (e.g. `var(--cds-global-color-blue-700)`).
 * When provided to buildCssBlock, these override the computed hex values in the CSS output.
 * Used by the Clarity Default preset so the output references Clarity's own global tokens.
 */
export type CssThemeTokens = Partial<Record<string, string>>;

export interface ThemePreset {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
  /** When set, CSS output for the light block uses these token expressions instead of hex values. */
  lightCssTokens?: CssThemeTokens;
  /** When set, CSS output for the dark block uses these token expressions instead of hex values. */
  darkCssTokens?: CssThemeTokens;
}

export interface DataRow {
  name: string;
  role: string;
  status: string;
}
