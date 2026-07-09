/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { Color } from './color';

export interface WcagLevel {
  label: string;
  score: string;
  type: string;
}

export interface ContrastResult {
  minContrast: { wcag: WcagLevel; score: number };
  backgrounds: { name: string; score: number; wcag: WcagLevel }[];
}

/**
 * Per-theme lookup keyed by token group / background name. Defaults to grouped
 * color variants (`Color[]`, used by `colorStruct`); pass `Color` for single-value
 * structures like `backgrounds`.
 */
export type CdsThemeStructure<T = Color[]> = { light: Record<string, T>; dark: Record<string, T> };

/** HSL color tuple: [hue 0–360, saturation 0–100, lightness 0–100] */
export type HslColor = [number, number, number];

/** RGB color tuple: [Red 0–255, Green 0–255, Blue 0–255] */
export type RgbColor = [number, number, number];

/** OKLCH color tuple: [lightness 0–1, chroma ≥0, hue 0–360] */
export type OklchColor = [number, number, number];

/** OKLab color tuple */
export type OKLabColor = [number, number, number];

export interface ThemeColors {
  primary?: Color;
  info?: Color;
  success?: Color;
  warning?: Color;
  danger?: Color;
}

export interface ThemePreset {
  name: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeColor {
  key: string;
  base: Color;
  variants: Color[];
  contrast: ContrastResult;
}

export interface DataRow {
  name: string;
  role: string;
  status: string;
}
