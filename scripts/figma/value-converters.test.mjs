/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  hslToFigmaColor,
  rgbToFigmaColor,
  hexToFigmaColor,
  calcRemBase,
  calcScaleVar,
  calcVarMultiply,
  resolveCalcToPx,
  resolveValue,
  inferType,
} from './value-converters.mjs';
import { createIdMap } from './id-map.mjs';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Round all numeric properties of a color object to 4 decimal places. */
function roundColor(c) {
  if (!c) {
    return c;
  }

  return Object.fromEntries(
    Object.entries(c).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v])
  );
}

// ─── hslToFigmaColor ──────────────────────────────────────────────────────────

describe('hslToFigmaColor', () => {
  it('converts comma-separated hsl', () => {
    expect(roundColor(hslToFigmaColor('hsl(0, 100%, 50%)'))).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts space-separated hsl', () => {
    expect(roundColor(hslToFigmaColor('hsl(0 100% 50%)'))).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('accepts the deg unit on the hue', () => {
    expect(roundColor(hslToFigmaColor('hsl(120deg 100% 50%)'))).toEqual({ r: 0, g: 1, b: 0, a: 1 });
  });

  it('converts blue correctly', () => {
    expect(roundColor(hslToFigmaColor('hsl(240, 100%, 50%)'))).toEqual({ r: 0, g: 0, b: 1, a: 1 });
  });

  it('resolves achromatic (s=0) to grey', () => {
    const c = hslToFigmaColor('hsl(0, 0%, 50%)');
    expect(c.r).toBeCloseTo(0.5);
    expect(c.g).toBeCloseTo(0.5);
    expect(c.b).toBeCloseTo(0.5);
    expect(c.a).toBe(1);
  });

  it('resolves white', () => {
    expect(roundColor(hslToFigmaColor('hsl(0, 0%, 100%)'))).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('resolves black', () => {
    expect(roundColor(hslToFigmaColor('hsl(0, 0%, 0%)'))).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('parses a decimal alpha', () => {
    const c = hslToFigmaColor('hsl(0, 100%, 50%, 0.5)');
    expect(c.a).toBe(0.5);
  });

  it('parses a percentage alpha', () => {
    const c = hslToFigmaColor('hsl(0, 100%, 50%, 50%)');
    expect(c.a).toBe(0.5);
  });

  it('returns null for a non-hsl string', () => {
    expect(hslToFigmaColor('#ff0000')).toBeNull();
    expect(hslToFigmaColor('bold')).toBeNull();
    expect(hslToFigmaColor('')).toBeNull();
  });
});

// ─── rgbToFigmaColor ──────────────────────────────────────────────────────────

describe('rgbToFigmaColor', () => {
  it('converts comma-separated rgb', () => {
    expect(rgbToFigmaColor('rgb(255, 0, 0)')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts space-separated rgb', () => {
    expect(rgbToFigmaColor('rgb(255 0 0)')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts rgba with decimal alpha', () => {
    expect(rgbToFigmaColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 1, g: 0, b: 0, a: 0.5 });
  });

  it('converts rgba with percentage alpha', () => {
    const c = rgbToFigmaColor('rgba(255, 0, 0, 50%)');
    expect(c.a).toBe(0.5);
  });

  it('converts black', () => {
    expect(rgbToFigmaColor('rgb(0, 0, 0)')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('converts white', () => {
    expect(rgbToFigmaColor('rgb(255, 255, 255)')).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('returns null for a non-rgb string', () => {
    expect(rgbToFigmaColor('#ff0000')).toBeNull();
    expect(rgbToFigmaColor('hsl(0,100%,50%)')).toBeNull();
    expect(rgbToFigmaColor('bold')).toBeNull();
  });
});

// ─── hexToFigmaColor ──────────────────────────────────────────────────────────

describe('hexToFigmaColor', () => {
  it('converts a 6-digit hex', () => {
    expect(hexToFigmaColor('#ff0000')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts a 3-digit shorthand hex', () => {
    expect(hexToFigmaColor('#f00')).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts an 8-digit hex with alpha', () => {
    const c = hexToFigmaColor('#ff000080');
    expect(c.r).toBe(1);
    expect(c.g).toBe(0);
    expect(c.b).toBe(0);
    expect(c.a).toBeCloseTo(0.502, 2);
  });

  it('converts a 4-digit shorthand hex with alpha', () => {
    const c = hexToFigmaColor('#f00f');
    expect(c.r).toBe(1);
    expect(c.g).toBe(0);
    expect(c.b).toBe(0);
    expect(c.a).toBe(1);
  });

  it('is case-insensitive', () => {
    expect(hexToFigmaColor('#FF0000')).toEqual(hexToFigmaColor('#ff0000'));
  });

  it('returns null when there is no leading #', () => {
    expect(hexToFigmaColor('ff0000')).toBeNull();
    expect(hexToFigmaColor('Metropolis')).toBeNull();
    expect(hexToFigmaColor('1000px')).toBeNull();
    expect(hexToFigmaColor('400')).toBeNull();
  });

  it('returns null for invalid hex characters', () => {
    expect(hexToFigmaColor('#zzzzzz')).toBeNull();
    expect(hexToFigmaColor('#gg0000')).toBeNull();
  });

  it('returns null for wrong hex length', () => {
    // 2-digit, 5-digit, and 7-digit hex bodies are not valid shorthand or full forms
    expect(hexToFigmaColor('#ff')).toBeNull();
    expect(hexToFigmaColor('#ff000')).toBeNull();
    expect(hexToFigmaColor('#ff00000')).toBeNull();
  });

  it('treats 4-digit #rgba as a valid shorthand', () => {
    // #ff00 → expands to #ffff0000 → fully transparent yellow (r=1,g=1,b=0,a=0)
    const c = hexToFigmaColor('#ff00');
    expect(c).not.toBeNull();
    expect(c.r).toBe(1);
    expect(c.g).toBe(1);
    expect(c.b).toBe(0);
    expect(c.a).toBe(0);
  });
});

// ─── calcRemBase ──────────────────────────────────────────────────────────────

describe('calcRemBase', () => {
  it('resolves the standard form', () => {
    expect(calcRemBase('calc(3 * 1rem / var(--cds-global-base))')).toBe(3);
    expect(calcRemBase('calc(10 * 1rem / var(--cds-global-base))')).toBe(10);
  });

  it('resolves the parenthesised form', () => {
    expect(calcRemBase('calc(36 * (1rem / var(--cds-global-base)))')).toBe(36);
    expect(calcRemBase('calc(1 * (1rem / var(--cds-global-base)))')).toBe(1);
  });

  it('handles negative coefficients', () => {
    expect(calcRemBase('calc(-0.1 * 1rem / var(--cds-global-base))')).toBe(-0.1);
    expect(calcRemBase('calc(-0.5 * 1rem / var(--cds-global-base))')).toBe(-0.5);
    expect(calcRemBase('calc(-0.5 * (1rem / var(--cds-global-base)))')).toBe(-0.5);
  });

  it('handles decimal coefficients', () => {
    expect(calcRemBase('calc(0.5 * 1rem / var(--cds-global-base))')).toBe(0.5);
    expect(calcRemBase('calc(0.2 * 1rem / var(--cds-global-base))')).toBe(0.2);
  });

  it('returns null for non-matching strings', () => {
    expect(calcRemBase('calc(6 * var(--cds-internal-scale-2))')).toBeNull();
    expect(calcRemBase('16px')).toBeNull();
    expect(calcRemBase('calc(10 * 1px)')).toBeNull();
    expect(calcRemBase('')).toBeNull();
  });
});

// ─── calcScaleVar ─────────────────────────────────────────────────────────────

describe('calcScaleVar', () => {
  it('resolves when the scale variable is a bare number', () => {
    const lookup = name => (name === '--cds-global-scale-space' ? '1' : undefined);
    expect(calcScaleVar('calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))', lookup)).toBe(1);
  });

  it('resolves fractional scale values', () => {
    const lookup = () => '0.875';
    expect(calcScaleVar('calc((1rem / var(--cds-global-base)) * var(--any-scale))', lookup)).toBe(0.875);
  });

  it('returns null when the variable is not found', () => {
    const lookup = () => undefined;
    expect(calcScaleVar('calc((1rem / var(--cds-global-base)) * var(--missing))', lookup)).toBeNull();
  });

  it('returns null when the variable value is not numeric', () => {
    const lookup = () => 'auto';
    expect(calcScaleVar('calc((1rem / var(--cds-global-base)) * var(--bad))', lookup)).toBeNull();
  });

  it('returns null for non-matching calc forms', () => {
    const lookup = () => '1';
    expect(calcScaleVar('calc(6 * var(--x))', lookup)).toBeNull();
    expect(calcScaleVar('calc(3 * 1rem / var(--cds-global-base))', lookup)).toBeNull();
  });
});

// ─── calcVarMultiply ──────────────────────────────────────────────────────────

describe('calcVarMultiply', () => {
  it('resolves a simple single-level var reference', () => {
    // --my-token has a plain px value that resolveCalcToPx can handle
    const lookup = name => (name === '--my-token' ? 'calc(4 * 1rem / var(--cds-global-base))' : undefined);
    expect(calcVarMultiply('calc(3 * var(--my-token))', lookup)).toBe(12);
  });

  it('resolves the two-level chain: calc(N * var(--scale-2)) where scale-2 uses calcScaleVar', () => {
    const vars = {
      '--cds-internal-scale-2': 'calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))',
      '--cds-global-scale-space': '1',
    };
    const lookup = name => vars[name];
    expect(calcVarMultiply('calc(6 * var(--cds-internal-scale-2))', lookup)).toBe(6);
    expect(calcVarMultiply('calc(12 * var(--cds-internal-scale-2))', lookup)).toBe(12);
  });

  it('handles negative multipliers', () => {
    const lookup = name => (name === '--x' ? 'calc(1 * 1rem / var(--cds-global-base))' : undefined);
    expect(calcVarMultiply('calc(-2 * var(--x))', lookup)).toBe(-2);
  });

  it('returns null when the variable is not found', () => {
    expect(calcVarMultiply('calc(6 * var(--missing))', () => undefined)).toBeNull();
  });

  it('returns null when the variable value cannot be resolved to px', () => {
    const lookup = () => 'bold';
    expect(calcVarMultiply('calc(6 * var(--x))', lookup)).toBeNull();
  });

  it('returns null for non-matching calc forms', () => {
    const lookup = () => '1';
    expect(calcVarMultiply('calc(3 * 1rem / var(--cds-global-base))', lookup)).toBeNull();
    expect(calcVarMultiply('16px', lookup)).toBeNull();
  });
});

// ─── resolveCalcToPx ─────────────────────────────────────────────────────────

describe('resolveCalcToPx', () => {
  it('delegates to calcRemBase (standard form)', () => {
    expect(resolveCalcToPx('calc(3 * 1rem / var(--cds-global-base))')).toBe(3);
  });

  it('delegates to calcRemBase (parenthesised form)', () => {
    expect(resolveCalcToPx('calc(36 * (1rem / var(--cds-global-base)))')).toBe(36);
  });

  it('delegates to calcRemBase with negative coefficient', () => {
    expect(resolveCalcToPx('calc(-0.1 * 1rem / var(--cds-global-base))')).toBe(-0.1);
  });

  it('delegates to calcScaleVar when varLookup is provided', () => {
    const lookup = name => (name === '--cds-global-scale-space' ? '1' : undefined);
    expect(resolveCalcToPx('calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))', lookup)).toBe(1);
  });

  it('delegates to calcVarMultiply when varLookup is provided', () => {
    const vars = {
      '--cds-internal-scale-2': 'calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))',
      '--cds-global-scale-space': '1',
    };
    expect(resolveCalcToPx('calc(6 * var(--cds-internal-scale-2))', n => vars[n])).toBe(6);
  });

  it('skips varLookup patterns when no lookup is provided', () => {
    expect(resolveCalcToPx('calc(6 * var(--cds-internal-scale-2))')).toBeNull();
    expect(resolveCalcToPx('calc((1rem / var(--cds-global-base)) * var(--scale))')).toBeNull();
  });

  it('returns null for unrecognised calc forms', () => {
    expect(resolveCalcToPx('calc(100% - var(--x))')).toBeNull();
    expect(resolveCalcToPx('calc(var(--a) + var(--b))')).toBeNull();
    expect(resolveCalcToPx('16px')).toBeNull();
    expect(resolveCalcToPx('')).toBeNull();
  });
});

// ─── resolveValue ────────────────────────────────────────────────────────────

describe('resolveValue', () => {
  let idMap;

  beforeEach(() => {
    idMap = createIdMap();
  });

  describe('ALIAS', () => {
    it('returns ALIAS when var() references a known token', () => {
      idMap.set('--cds-alias-color-action-primary', 'fig-id-1');
      const result = resolveValue('var(--cds-alias-color-action-primary)', idMap);
      expect(result.type).toBe('ALIAS');
      expect(result.figmaValue).toEqual({ type: 'VARIABLE_ALIAS', id: 'fig-id-1' });
    });

    it('falls through to STRING when var() references an unknown token', () => {
      const result = resolveValue('var(--unknown-token)', idMap);
      expect(result.type).toBe('STRING');
      expect(result.figmaValue).toBe('var(--unknown-token)');
    });
  });

  describe('COLOR', () => {
    it('resolves hsl() as COLOR', () => {
      const result = resolveValue('hsl(0, 100%, 50%)', idMap);
      expect(result.type).toBe('COLOR');
      expect(result.figmaValue).toMatchObject({ r: 1, g: 0, b: 0 });
    });

    it('resolves rgb() as COLOR', () => {
      const result = resolveValue('rgb(255, 0, 0)', idMap);
      expect(result.type).toBe('COLOR');
      expect(result.figmaValue).toMatchObject({ r: 1, g: 0, b: 0 });
    });

    it('resolves hex as COLOR', () => {
      const result = resolveValue('#ff0000', idMap);
      expect(result.type).toBe('COLOR');
      expect(result.figmaValue).toMatchObject({ r: 1, g: 0, b: 0 });
    });
  });

  describe('FLOAT', () => {
    it('resolves Npx values', () => {
      expect(resolveValue('16px', idMap)).toEqual({ type: 'FLOAT', figmaValue: 16 });
    });

    it('resolves bare numbers (font weight, opacity)', () => {
      expect(resolveValue('400', idMap)).toEqual({ type: 'FLOAT', figmaValue: 400 });
      expect(resolveValue('1', idMap)).toEqual({ type: 'FLOAT', figmaValue: 1 });
    });

    it('resolves percentage values', () => {
      expect(resolveValue('50%', idMap)).toEqual({ type: 'FLOAT', figmaValue: 50 });
    });

    it('resolves calc rem-base expressions', () => {
      expect(resolveValue('calc(3 * 1rem / var(--cds-global-base))', idMap)).toEqual({ type: 'FLOAT', figmaValue: 3 });
    });

    it('resolves negative calc values', () => {
      expect(resolveValue('calc(-0.1 * 1rem / var(--cds-global-base))', idMap)).toEqual({
        type: 'FLOAT',
        figmaValue: -0.1,
      });
    });

    it('resolves calc var-multiply when varLookup is provided', () => {
      const vars = {
        '--cds-internal-scale-2': 'calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))',
        '--cds-global-scale-space': '1',
      };
      const result = resolveValue('calc(6 * var(--cds-internal-scale-2))', idMap, n => vars[n]);
      expect(result).toEqual({ type: 'FLOAT', figmaValue: 6 });
    });
  });

  describe('STRING', () => {
    it('falls back to STRING for unresolvable values', () => {
      expect(resolveValue('bold', idMap)).toEqual({ type: 'STRING', figmaValue: 'bold' });
      expect(resolveValue('sans-serif', idMap)).toEqual({ type: 'STRING', figmaValue: 'sans-serif' });
      expect(resolveValue('Metropolis', idMap)).toEqual({ type: 'STRING', figmaValue: 'Metropolis' });
    });

    it('falls back to STRING for complex calc', () => {
      const result = resolveValue('calc(100% - var(--clr-some-offset))', idMap);
      expect(result.type).toBe('STRING');
    });

    it('trims whitespace before processing', () => {
      expect(resolveValue('  400  ', idMap)).toEqual({ type: 'FLOAT', figmaValue: 400 });
    });
  });
});

// ─── inferType ───────────────────────────────────────────────────────────────

describe('inferType', () => {
  let idMap;

  beforeEach(() => {
    idMap = createIdMap();
  });

  it('returns the resolved payload for non-alias values (passthrough)', () => {
    expect(inferType('--x', '16px', idMap)).toEqual({ type: 'FLOAT', figmaValue: 16 });
    expect(inferType('--x', '#ff0000', idMap)).toMatchObject({ type: 'COLOR' });
    expect(inferType('--x', 'bold', idMap)).toEqual({ type: 'STRING', figmaValue: 'bold' });
  });

  it('returns VARIABLE_ALIAS figmaValue with the referenced type for a known alias', () => {
    idMap.set('--cds-alias-color-action-primary', 'fig-id-1', { type: 'COLOR' });
    const result = inferType('--x', 'var(--cds-alias-color-action-primary)', idMap);
    expect(result.type).toBe('COLOR');
    expect(result.figmaValue).toEqual({ type: 'VARIABLE_ALIAS', id: 'fig-id-1' });
  });

  it('falls back to STRING type when the referenced alias has no metadata', () => {
    idMap.set('--cds-alias-color-action-primary', 'fig-id-1');
    const result = inferType('--x', 'var(--cds-alias-color-action-primary)', idMap);
    expect(result.type).toBe('STRING');
    expect(result.figmaValue).toEqual({ type: 'VARIABLE_ALIAS', id: 'fig-id-1' });
  });

  it('falls back to STRING type for an unknown var reference', () => {
    const result = inferType('--x', 'var(--unknown)', idMap);
    expect(result.type).toBe('STRING');
    expect(result.figmaValue).toBe('var(--unknown)');
  });

  it('forwards varLookup when resolving calc expressions', () => {
    const vars = {
      '--cds-internal-scale-2': 'calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))',
      '--cds-global-scale-space': '1',
    };
    const result = inferType('--x', 'calc(6 * var(--cds-internal-scale-2))', idMap, n => vars[n]);
    expect(result).toEqual({ type: 'FLOAT', figmaValue: 6 });
  });
});
