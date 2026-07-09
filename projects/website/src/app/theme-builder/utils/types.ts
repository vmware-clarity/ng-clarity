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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Normalizes a hue to `[0, 360)` — hue is cyclic, so out-of-range values wrap instead of clamping. */
function wrapDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** HSL color: hue wraps to 0–360, saturation/lightness clamp to 0–100. */
export class HslColor {
  readonly h: number;
  readonly s: number;
  readonly l: number;

  constructor(h: number, s: number, l: number) {
    this.h = wrapDegrees(h);
    this.s = clamp(s, 0, 100);
    this.l = clamp(l, 0, 100);
  }
}

/** RGB color: red/green/blue clamp to 0–255 and round to whole channel values. */
export class RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor(r: number, g: number, b: number) {
    this.r = Math.round(clamp(r, 0, 255));
    this.g = Math.round(clamp(g, 0, 255));
    this.b = Math.round(clamp(b, 0, 255));
  }
}

/** LinearSRGB color: red/green/blue clamp to 0–1 — continuous linear light, not rounded. */
export class LinearSrgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;

  constructor({ r, g, b }: RgbColor) {
    this.r = clamp(this.toLinear(r), 0, 1);
    this.g = clamp(this.toLinear(g), 0, 1);
    this.b = clamp(this.toLinear(b), 0, 1);
  }

  /** Un-gammas an sRGB channel (0–1) to linear light, per IEC 61966-2-1. */
  private toLinear(c: number): number {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  }
}

/** OKLCH color: lightness clamps to 0–1, chroma clamps to ≥0, hue wraps to 0–360. */
export class OklchColor {
  readonly l: number;
  readonly c: number;
  readonly h: number;

  constructor(l: number, c: number, h: number) {
    this.l = clamp(l, 0, 1);
    this.c = Math.max(0, c);
    this.h = wrapDegrees(h);
  }
}

/** OKLab color: lightness clamps to 0–1; `a`/`b` are unbounded perceptual axes. */
export class OKLabColor {
  readonly l: number;
  readonly a: number;
  readonly b: number;

  constructor(l: number, a: number, b: number) {
    this.l = clamp(l, 0, 1);
    this.a = a;
    this.b = b;
  }
}

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
