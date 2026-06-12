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
  resolveEmToPx,
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

// ─── resolveEmToPx ───────────────────────────────────────────────────────────

describe('resolveEmToPx', () => {
  // Simulates a CSS variable map modelled after the real stylesheet:
  //   --cds-alias-typography-display-font-size → var(--clr-base-typography-font-size-display)
  //   --clr-base-typography-font-size-display  → calc(40 * 1rem / var(--cds-global-base))
  const vars = {
    '--cds-alias-typography-display-font-size': 'var(--clr-base-typography-font-size-display)',
    '--clr-base-typography-font-size-display': 'calc(40 * 1rem / var(--cds-global-base))',
    // Three-hop chain via --cds-global-space-9
    '--cds-alias-typography-heading-font-size': 'var(--clr-base-typography-font-size-heading)',
    '--clr-base-typography-font-size-heading': 'var(--cds-global-space-9)',
    '--cds-global-space-9': 'calc(24 * var(--cds-internal-scale-2))',
    '--cds-internal-scale-2': 'calc((1rem / var(--cds-global-base)) * var(--cds-global-scale-space))',
    '--cds-global-scale-space': '1',
    // Simple px font-size (used for isolated tests)
    '--test-font-size': '16px',
  };
  const lookup = n => vars[n];

  it('multiplies the em value by the resolved font-size (one var hop)', () => {
    // -0.0125em × 40px = -0.5px
    const result = resolveEmToPx('-0.0125em', '--cds-alias-typography-display-letter-spacing', lookup);
    expect(result).toBeCloseTo(-0.5);
  });

  it('follows a three-hop var() chain (em × heading font-size → 24px)', () => {
    // -0.0125em × 24px = -0.3px
    const result = resolveEmToPx('-0.0125em', '--cds-alias-typography-heading-letter-spacing', lookup);
    expect(result).toBeCloseTo(-0.3);
  });

  it('resolves a bare-px font-size', () => {
    // '--test-letter-spacing' → replace '-letter-spacing' → '--test-font-size'
    const lkp = n => (n === '--test-font-size' ? '20px' : undefined);
    expect(resolveEmToPx('0.05em', '--test-letter-spacing', lkp)).toBeCloseTo(1);
  });

  it('handles positive em values', () => {
    const lkp = n => (n === '--my-token-font-size' ? '10px' : undefined);
    expect(resolveEmToPx('0.018182em', '--my-token-letter-spacing', lkp)).toBeCloseTo(0.18182, 4);
  });

  it('returns null when cssVarName has no -letter-spacing suffix', () => {
    // resolveEmToPx should not attempt conversion for non-letter-spacing tokens
    expect(resolveEmToPx('0.1em', '--cds-alias-typography-x-height', lookup)).toBeNull();
    expect(resolveEmToPx('0.1em', '--cds-alias-typography-top-gap-height', lookup)).toBeNull();
  });

  it('returns null when the peer font-size variable is absent', () => {
    expect(resolveEmToPx('-0.01em', '--missing-letter-spacing', lookup)).toBeNull();
  });

  it('returns null for non-em values', () => {
    expect(resolveEmToPx('16px', '--any-letter-spacing', lookup)).toBeNull();
    expect(resolveEmToPx('400', '--any-letter-spacing', lookup)).toBeNull();
    expect(resolveEmToPx('bold', '--any-letter-spacing', lookup)).toBeNull();
  });

  it('returns null when varLookup is absent', () => {
    expect(resolveEmToPx('-0.01em', '--cds-alias-typography-display-letter-spacing', null)).toBeNull();
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

    it('converts em letter-spacing to px via the peer font-size token', () => {
      const vars = {
        '--cds-alias-typography-display-font-size': 'var(--clr-base-typography-font-size-display)',
        '--clr-base-typography-font-size-display': 'calc(40 * 1rem / var(--cds-global-base))',
      };
      const result = resolveValue('-0.0125em', idMap, n => vars[n], '--cds-alias-typography-display-letter-spacing');
      expect(result.type).toBe('FLOAT');
      expect(result.figmaValue).toBeCloseTo(-0.5);
    });

    it('falls back to STRING for em values without a matching peer font-size', () => {
      // x-height has no -letter-spacing suffix → resolveEmToPx returns null
      const result = resolveValue('0.1475em', idMap, () => undefined, '--cds-alias-typography-x-height');
      expect(result.type).toBe('STRING');
    });

    // ── Negative px and bare numbers (BUG-2) ──────────────────────────────────
    // Before the fix both patterns used `[\d.]+`, which excluded the leading `-`.
    // Those values silently became STRING and caused a Figma type-mismatch on
    // every push.  The fix changes both to `-?[\d.]+`.

    describe('negative px values (BUG-2)', () => {
      it('resolves a negative integer px value as FLOAT', () => {
        expect(resolveValue('-4px', idMap)).toEqual({ type: 'FLOAT', figmaValue: -4 });
      });

      it('resolves a negative fractional px value as FLOAT', () => {
        expect(resolveValue('-0.5px', idMap)).toEqual({ type: 'FLOAT', figmaValue: -0.5 });
      });

      it('resolves a larger negative px offset as FLOAT', () => {
        expect(resolveValue('-16px', idMap)).toEqual({ type: 'FLOAT', figmaValue: -16 });
      });

      // resolveValue intentionally keeps unresolved top-level var() references as
      // STRING so the alias relationship is preserved.  The var()-chain path inside
      // resolveToPx is exercised through calc() expressions (see calcVarMultiply
      // tests).  A var() whose target is absent from idMap → STRING is the correct,
      // intentional outcome.
      it('keeps an unresolved var() reference as STRING even when its target is a negative px value', () => {
        const lookup = name => (name === '--my-offset' ? '-4px' : undefined);
        expect(resolveValue('var(--my-offset)', idMap, lookup)).toEqual({
          type: 'STRING',
          figmaValue: 'var(--my-offset)',
        });
      });

      it('resolves a calc() that multiplies a var() containing a negative px value as FLOAT', () => {
        // calc(1 * var(--my-offset)) with --my-offset = '-4px'
        // → calcVarMultiply → resolveToPx('-4px') → -4  → 1 * -4 = -4
        const lookup = name => (name === '--my-offset' ? '-4px' : undefined);
        expect(resolveValue('calc(1 * var(--my-offset))', idMap, lookup)).toEqual({ type: 'FLOAT', figmaValue: -4 });
      });
    });

    describe('negative bare numbers (BUG-2)', () => {
      it('resolves a negative integer bare number as FLOAT', () => {
        expect(resolveValue('-1', idMap)).toEqual({ type: 'FLOAT', figmaValue: -1 });
      });

      it('resolves a negative fractional bare number as FLOAT', () => {
        expect(resolveValue('-0.5', idMap)).toEqual({ type: 'FLOAT', figmaValue: -0.5 });
      });

      // Same reasoning as the var() test above: top-level var() → STRING by design.
      it('keeps an unresolved var() reference as STRING even when its target is a negative bare number', () => {
        const lookup = name => (name === '--my-multiplier' ? '-2' : undefined);
        expect(resolveValue('var(--my-multiplier)', idMap, lookup)).toEqual({
          type: 'STRING',
          figmaValue: 'var(--my-multiplier)',
        });
      });

      it('resolves a calc() that multiplies a var() containing a negative bare number as FLOAT', () => {
        // calc(3 * var(--my-multiplier)) with --my-multiplier = '-2'
        // → calcVarMultiply → resolveToPx('-2') → -2  → 3 * -2 = -6
        const lookup = name => (name === '--my-multiplier' ? '-2' : undefined);
        expect(resolveValue('calc(3 * var(--my-multiplier))', idMap, lookup)).toEqual({
          type: 'FLOAT',
          figmaValue: -6,
        });
      });
    });

    describe('positive px and bare numbers still resolve correctly after the fix', () => {
      it('resolves a positive px value as FLOAT', () => {
        expect(resolveValue('8px', idMap)).toEqual({ type: 'FLOAT', figmaValue: 8 });
      });

      it('resolves a positive fractional px value as FLOAT', () => {
        expect(resolveValue('1.5px', idMap)).toEqual({ type: 'FLOAT', figmaValue: 1.5 });
      });

      it('resolves a positive bare number as FLOAT', () => {
        expect(resolveValue('400', idMap)).toEqual({ type: 'FLOAT', figmaValue: 400 });
      });
    });
  });

  describe('STRING', () => {
    it('falls back to STRING for unresolvable values', () => {
      expect(resolveValue('bold', idMap)).toEqual({ type: 'STRING', figmaValue: 'bold' });
      expect(resolveValue('sans-serif', idMap)).toEqual({ type: 'STRING', figmaValue: 'sans-serif' });
      expect(resolveValue('Metropolis', idMap)).toEqual({ type: 'STRING', figmaValue: 'Metropolis' });
    });

    describe('font-family normalisation', () => {
      it('extracts the first font from a quoted fallback stack', () => {
        const result = resolveValue(
          "'Metropolis', 'Avenir Next', sans-serif",
          idMap,
          null,
          '--cds-alias-typography-font-family'
        );
        expect(result).toEqual({ type: 'STRING', figmaValue: 'Metropolis' });
      });

      it('extracts the first font from a double-quoted fallback stack', () => {
        const result = resolveValue('"Roboto", "Helvetica Neue", sans-serif', idMap, null, '--clr-font-family');
        expect(result).toEqual({ type: 'STRING', figmaValue: 'Roboto' });
      });

      it('leaves a single unquoted font name unchanged', () => {
        const result = resolveValue('Metropolis', idMap, null, '--cds-alias-typography-font-family');
        expect(result).toEqual({ type: 'STRING', figmaValue: 'Metropolis' });
      });

      it('does not normalise non-font-family tokens', () => {
        const result = resolveValue("'Metropolis', 'Avenir Next'", idMap, null, '--cds-alias-typography-color');
        expect(result).toEqual({ type: 'STRING', figmaValue: "'Metropolis', 'Avenir Next'" });
      });
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
