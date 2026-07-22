/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HslColor, LinearSrgbColor, OKLabColor, OklchColor, RgbColor } from './types';

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
  get rgb(): RgbColor {
    return this.hslToRgb(this.color);
  }

  /** HEX string — used by native color inputs. */
  get hex(): string {
    return this.hslToHex(this.color);
  }

  /** HSL string — used by native color inputs. */
  get hsl(): string {
    const { h, s, l } = this.color;
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  }

  /**
   * OKLCH components — unlike HSL's `L`, OKLCH's `L` tracks perceived lightness
   * uniformly across all hues, which is why it's used for palette/contrast math.
   */
  get oklch(): OklchColor {
    return this.hslToOklch(this.color);
  }

  /** OKLCH string, CSS Color 4 syntax. */
  get oklchString(): string {
    const { l, c, h } = this.oklch;
    return `oklch(${Math.round(l * 1000) / 10}% ${Math.round(c * 10000) / 10000} ${Math.round(h * 10) / 10}deg)`;
  }

  /** Human-readable variant label derived from the token name suffix, e.g. `Tint dark`. */
  get label(): string {
    if (this.name.endsWith('-tint-dark')) {
      return 'Tint dark';
    } else if (this.name.endsWith('-tint')) {
      return 'Tint';
    } else if (this.name.endsWith('-shade')) {
      return 'Shade';
    } else if (this.name.endsWith('-dark')) {
      return 'Dark';
    }

    return 'Base';
  }

  get isOriginalColor(): boolean {
    // no original color override
    if (!this._color) {
      return true;
    }

    const originalColorHsl = this.parseHsl(this.originalColor);

    return (
      this._color.h === originalColorHsl.h &&
      this._color.s === originalColorHsl.s &&
      this._color.l === originalColorHsl.l
    );
  }

  static isHex(hex: string): boolean {
    return /^#[0-9a-fA-F]{6}$/.test(hex);
  }

  static shiftL({ h, s, l }: HslColor, delta: number): HslColor {
    return new HslColor(h, s, l + delta);
  }

  static hexToHsl(hex: string): HslColor {
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
      return new HslColor(0, 0, Math.round(l * 100));
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

    return new HslColor(Math.round(hue * 360), Math.round(s * 100), Math.round(l * 100));
  }

  hslToHex({ h, s, l }: HslColor): string {
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

  /**
   * Converts HSL to OKLCH via linear sRGB and OKLab (CSS Color 4 / Björn Ottosson
   * formulas). Goes through OKLCH — not raw HSL — whenever perceptual uniformity
   * matters, since HSL's `L` looks lighter or darker depending on hue.
   */
  hslToOklch(hsl: HslColor): OklchColor {
    const linearSrgbColor = new LinearSrgbColor(this.hslToRgb(hsl));
    const oklabColor = this.linearSrgbToOklab(linearSrgbColor);

    const c = Math.sqrt(oklabColor.a * oklabColor.a + oklabColor.b * oklabColor.b);
    const hue = (Math.atan2(oklabColor.b, oklabColor.a) * 180) / Math.PI;

    return new OklchColor(oklabColor.l, c, hue);
  }

  reset(): void {
    this._color = undefined;
  }

  /** Converts HSL to RGB — use only for relative luminance calculations. */
  private hslToRgb({ h, s, l }: HslColor): RgbColor {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return 255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1));
    };
    return new RgbColor(f(0), f(8), f(4));
  }

  /** Converts linear sRGB (0–1 channels) to OKLab. */
  private linearSrgbToOklab({ r, g, b }: LinearSrgbColor): OKLabColor {
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

    return new OKLabColor(
      0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    );
  }

  /** Parses a CSS HSL string such as `hsl(198deg 100% 59%)`. */
  private parseHsl(input: string): HslColor {
    const [h = 0, s = 0, l = 0] = input.match(/[\d.]+/g)?.map(Number) ?? [];
    return new HslColor(h, s, l);
  }
}
