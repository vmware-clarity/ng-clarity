/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { HslColor } from './types';

describe('Color', () => {
  describe('isHex', () => {
    it('accepts 6-digit hex strings', () => {
      expect(Color.isHex('#ff0000')).toBe(true);
      expect(Color.isHex('#AbC123')).toBe(true);
    });

    it('rejects non 6-digit hex strings', () => {
      expect(Color.isHex('#fff')).toBe(false);
      expect(Color.isHex('red')).toBe(false);
      expect(Color.isHex('ff0000')).toBe(false);
    });
  });

  describe('hexToHsl / hslToHex round trip', () => {
    it('converts pure red', () => {
      const hsl = Color.hexToHsl('#ff0000');
      expect(hsl).toEqual(new HslColor(0, 100, 50));
      expect(new Color('--x', '').hslToHex(hsl)).toBe('#ff0000');
    });

    it('converts pure white', () => {
      const hsl = Color.hexToHsl('#ffffff');
      expect(hsl).toEqual(new HslColor(0, 0, 100));
      expect(new Color('--x', '').hslToHex(hsl)).toBe('#ffffff');
    });

    it('expands 3-digit hex before converting', () => {
      expect(Color.hexToHsl('#f00')).toEqual(Color.hexToHsl('#ff0000'));
    });
  });

  describe('shiftL', () => {
    it('shifts lightness while preserving hue/saturation', () => {
      expect(Color.shiftL(new HslColor(200, 50, 50), 10)).toEqual(new HslColor(200, 50, 60));
    });

    it('clamps at 0 and 100', () => {
      expect(Color.shiftL(new HslColor(200, 50, 95), 10).l).toBe(100);
      expect(Color.shiftL(new HslColor(200, 50, 5), -10).l).toBe(0);
    });
  });

  describe('label', () => {
    it('derives the variant label from the token name suffix', () => {
      expect(new Color('--cds-alias-primary', '').label).toBe('Base');
      expect(new Color('--cds-alias-primary-tint', '').label).toBe('Tint');
      expect(new Color('--cds-alias-primary-tint-dark', '').label).toBe('Tint dark');
      expect(new Color('--cds-alias-primary-shade', '').label).toBe('Shade');
      expect(new Color('--cds-alias-primary-dark', '').label).toBe('Dark');
    });
  });

  describe('color / hsl / hex getters', () => {
    it('falls back to parsing originalColor when no color has been set', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      expect(color.color).toEqual(new HslColor(198, 100, 59));
      expect(color.hsl).toBe('hsl(198deg, 100%, 59%)');
    });

    it('reflects the explicitly set color once assigned', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      color.color = new HslColor(10, 20, 30);
      expect(color.hsl).toBe('hsl(10deg, 20%, 30%)');
      expect(color.hex).toBe(color.hslToHex(new HslColor(10, 20, 30)));
    });
  });

  describe('isOriginalColor / reset', () => {
    it('is true before any color is set', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      expect(color.isOriginalColor).toBe(true);
    });

    it('is true when set back to a value equal to the original', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      color.color = new HslColor(198, 100, 59);
      expect(color.isOriginalColor).toBe(true);
    });

    it('is false once the color diverges from the original', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      color.color = new HslColor(10, 20, 30);
      expect(color.isOriginalColor).toBe(false);
    });

    it('restores isOriginalColor after reset()', () => {
      const color = new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)');
      color.color = new HslColor(10, 20, 30);
      color.reset();
      expect(color.isOriginalColor).toBe(true);
      expect(color.color).toEqual(new HslColor(198, 100, 59));
    });
  });

  describe('oklch', () => {
    it('maps pure white to near-zero chroma and full lightness', () => {
      const color = new Color('--x', '');
      color.color = new HslColor(0, 0, 100);
      expect(color.oklch.l).toBeCloseTo(1, 2);
      expect(color.oklch.c).toBeCloseTo(0, 2);
    });

    it('maps pure black to zero lightness and chroma', () => {
      const color = new Color('--x', '');
      color.color = new HslColor(0, 0, 0);
      expect(color.oklch.l).toBeCloseTo(0, 2);
      expect(color.oklch.c).toBeCloseTo(0, 2);
    });
  });
});
