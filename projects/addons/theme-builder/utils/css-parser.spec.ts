/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { generateCSS } from './css-generator';
import { parseGeneratedCSS } from './css-parser';
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
});
