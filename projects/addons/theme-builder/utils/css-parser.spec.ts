/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { generateCSS } from './css-generator';
import { parseGeneratedCSS, validateGeneratedCSS } from './css-parser';
import { CdsThemeStructure, HslColor } from './types';

function emptyStruct(): CdsThemeStructure {
  return {
    light: { primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)')] },
    dark: { primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 40%)')] },
  };
}

function colorsByName(colors: Color[] | undefined) {
  return Object.fromEntries((colors ?? []).map(c => [c.name, c.color]));
}

describe('parseGeneratedCSS', () => {
  it('returns empty theme maps when the CSS has no override blocks', () => {
    const css = generateCSS(emptyStruct()).join('\n');
    expect(parseGeneratedCSS(css)).toEqual({ light: {}, dark: {} });
  });

  it('groups a changed token under its TOKEN_KEYS group, matching colorStruct shape', () => {
    const struct = emptyStruct();
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct).join('\n');
    const parsed = parseGeneratedCSS(css);

    expect(colorsByName(parsed.light.primary)).toEqual({ '--cds-alias-primary': new HslColor(10, 20, 30) });
    expect(parsed.dark.primary).toBeUndefined();
  });

  it('round-trips a struct with changes in both themes and multiple groups', () => {
    const struct: CdsThemeStructure = {
      light: {
        primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)')],
        info: [new Color('--cds-alias-status-info', 'hsl(200deg 80% 50%)')],
      },
      dark: {
        primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 40%)')],
        info: [new Color('--cds-alias-status-info', 'hsl(200deg 80% 30%)')],
      },
    };
    struct.light.primary[0].color = new HslColor(10, 20, 30);
    struct.light.info[0].color = new HslColor(220, 60, 45);
    struct.dark.primary[0].color = new HslColor(11, 22, 33);

    const css = generateCSS(struct).join('\n');
    const parsed = parseGeneratedCSS(css);

    expect(colorsByName(parsed.light.primary)).toEqual({ '--cds-alias-primary': new HslColor(10, 20, 30) });
    expect(colorsByName(parsed.light.info)).toEqual({ '--cds-alias-status-info': new HslColor(220, 60, 45) });
    expect(colorsByName(parsed.dark.primary)).toEqual({ '--cds-alias-primary': new HslColor(11, 22, 33) });
    expect(parsed.dark.info).toBeUndefined();
  });

  it('groups a changed variant token under the same group as its base', () => {
    const struct: CdsThemeStructure = {
      light: { primary: [new Color('--cds-alias-primary-tint', 'hsl(198deg 100% 94%)')] },
      dark: { primary: [] },
    };
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct).join('\n');
    const parsed = parseGeneratedCSS(css);

    expect(colorsByName(parsed.light.primary)).toEqual({ '--cds-alias-primary-tint': new HslColor(10, 20, 30) });
  });

  it('ignores the shared DEFAULT_OVERRIDES block and the warning-text override line', () => {
    const struct: CdsThemeStructure = {
      light: { primary: [new Color('--cds-alias-primary-tint', 'hsl(198deg 100% 94%)')] },
      dark: { primary: [] },
    };
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct).join('\n');
    const parsed = parseGeneratedCSS(css);

    const names = (parsed.light.primary ?? []).map(c => c.name);
    expect(names).not.toContain('--cds-alias-object-interaction-background-hover');
    expect(names).toContain('--cds-alias-primary-tint');
  });

  it('skips a malformed declaration instead of importing it', () => {
    const css = `[cds-theme~='light'] {
  --cds-alias-primary: hsl(1.2.3deg 50% 50%);
  --cds-alias-status-info: hsl(220deg, 60%, 45%);
}`;

    const parsed = parseGeneratedCSS(css);

    expect(parsed.light.primary).toBeUndefined();
    expect(colorsByName(parsed.light.info)).toEqual({ '--cds-alias-status-info': new HslColor(220, 60, 45) });
  });
});

describe('validateGeneratedCSS', () => {
  function changedStruct(): CdsThemeStructure {
    const struct = emptyStruct();
    struct.light.primary[0].color = new HslColor(10.5, 20.25, 30);
    struct.dark.primary[0].color = new HslColor(11, 22, 33);
    return struct;
  }

  it('accepts CSS produced by generateCSS', () => {
    const css = generateCSS(changedStruct()).join('\n');
    expect(validateGeneratedCSS(css)).toEqual({ valid: true, malformedDeclarations: [] });
  });

  it("rejects generateCSS's output for an unchanged theme", () => {
    const css = generateCSS(emptyStruct()).join('\n');
    expect(validateGeneratedCSS(css)).toEqual({ valid: false, malformedDeclarations: [] });
  });

  it('lists theme colors whose value is not in the generated hsl() shape', () => {
    const css = `[cds-theme~='light'] {
  --cds-alias-primary: hsl(1.2.3deg abc% 150%);
  --cds-alias-status-info: #ff0000;
  --cds-alias-status-success: hsl(120deg 50% 50%);
  --cds-alias-status-warning: hsl(40deg, 50%, 150%);
  --cds-alias-status-danger: hsl(0deg, 50%, 50%);
}`;

    expect(validateGeneratedCSS(css)).toEqual({
      valid: false,
      malformedDeclarations: [
        '--cds-alias-primary: hsl(1.2.3deg abc% 150%)',
        '--cds-alias-status-info: #ff0000',
        '--cds-alias-status-success: hsl(120deg 50% 50%)',
        '--cds-alias-status-warning: hsl(40deg, 50%, 150%)',
      ],
    });
  });

  it('lists a malformed hsl() value on an unknown token and anything that is not a custom property', () => {
    const css = `[cds-theme~='dark'] {
  --cds-alias-primary: hsl(10deg, 20%, 30%);
  --not-a-theme-token: hsl(none none none);
  color: red;
}`;

    expect(validateGeneratedCSS(css).malformedDeclarations).toEqual([
      '--not-a-theme-token: hsl(none none none)',
      'color: red',
    ]);
  });

  it('ignores the var() overrides generateCSS emits alongside the theme colors', () => {
    const struct = emptyStruct();
    struct.light.primary = [new Color('--cds-alias-status-warning', 'hsl(48deg 94% 57%)')];
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct, true).join('\n');

    expect(css).toContain('--cds-alias-typography-color-black');
    expect(validateGeneratedCSS(css).valid).toBe(true);
  });

  it('rejects CSS with no recognized theme colors', () => {
    for (const css of ['body { color: red; }', "[cds-theme~='light'] { --cds-alias-primary: hsl(10deg, 20%, 30%);"]) {
      expect(validateGeneratedCSS(css)).toEqual({ valid: false, malformedDeclarations: [] });
    }
  });
});
