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

export type CdsThemeStructure = { light: {}; dark: {} };

/** HSL color tuple: [hue 0–360, saturation 0–100, lightness 0–100] */
export type HslColor = [number, number, number];

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

export interface DataRow {
  name: string;
  role: string;
  status: string;
}
