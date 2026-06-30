/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { HslColor } from './types';

export function hexToHsl(hex: string): HslColor {
  const h = hex.replace(/^#/, '');
  const full = h.length === 3 ? h[0] + h[0] + h[1] + h[1] + h[2] + h[2] : h;
  const n = parseInt(full, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return [0, 0, Math.round(l * 100)];
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let hue = 0;
  if (max === r) {
    hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    hue = ((b - r) / d + 2) / 6;
  } else {
    hue = ((r - g) / d + 4) / 6;
  }
  return [Math.round(hue * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function shiftL([h, s, l]: HslColor, delta: number): HslColor {
  return [h, s, Math.max(0, Math.min(100, l + delta))];
}

/**
 * A single theme token: its CSS custom property name, the original Clarity-provided
 * HSL value, and the current (possibly user-edited) color. Colors are stored in HSL;
 * RGB and HEX are derived on demand.
 */
export class Color {
  private _color?: HslColor;

  /**
   * @param name CSS custom property name, e.g. `--cds-alias-status-info`
   * @param originalColor Clarity-provided HSL, e.g. `hsl(198deg 100% 59%)`
   */
  constructor(
    public name: string,
    public originalColor: string
  ) {}

  /** HSL components. Falls back to parsing `originalColor` when not explicitly set. */
  get color(): HslColor {
    return this._color ?? this.parseHsl(this.originalColor);
  }

  set color(value: HslColor) {
    this._color = value;
  }

  /** RGB components — HSL is converted to RGB only for relative luminance checks. */
  get rgb(): [number, number, number] {
    return this.hslToRgb(...this.color);
  }

  /** HEX string — used by native color inputs. */
  get hex(): string {
    return hslToHex(...this.color);
  }

  /** Returns an independent copy so editing a working theme never mutates a preset. */
  clone(): Color {
    const copy = new Color(this.name, this.originalColor);
    if (this._color) {
      copy.color = [...this._color];
    }
    return copy;
  }

  /** Converts HSL to RGB — use only for relative luminance calculations. */
  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
    };
    return [f(0), f(8), f(4)];
  }

  /** Parses a CSS HSL string such as `hsl(198deg 100% 59%)` into `[h, s, l]`. */
  private parseHsl(input: string): HslColor {
    const [h = 0, s = 0, l = 0] = input.match(/[\d.]+/g)?.map(Number) ?? [];
    return [h, s, l];
  }
}
