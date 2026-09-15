/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Color } from './color';
import { generateCSS } from './css-generator';
import { CdsThemeStructure, HslColor } from './types';

function emptyStruct(): CdsThemeStructure {
  return {
    light: { primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 59%)')] },
    dark: { primary: [new Color('--cds-alias-primary', 'hsl(198deg 100% 40%)')] },
  };
}

describe('generateCSS', () => {
  it('reports no changes when every color is at its original value', () => {
    const css = generateCSS(emptyStruct()).join('\n');
    expect(css).toContain('/* NO changes */');
    expect(css).not.toContain('[cds-theme');
  });

  it('emits a per-theme override block for a changed color', () => {
    const struct = emptyStruct();
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct).join('\n');

    expect(css).toContain(`[cds-theme~='light'] {`);
    expect(css).toContain('/* primary */');
    expect(css).toContain('--cds-alias-primary: hsl(10deg, 20%, 30%);');
    expect(css).not.toContain(`[cds-theme~='dark'] {`);
  });

  it('adds the shared DEFAULT_OVERRIDES block when a mapped token changes', () => {
    const struct: CdsThemeStructure = {
      light: { primary: [new Color('--cds-alias-primary-tint', 'hsl(198deg 100% 94%)')] },
      dark: { primary: [] },
    };
    struct.light.primary[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct).join('\n');

    expect(css).toContain('[cds-theme] {');
    expect(css).toContain('--cds-alias-object-interaction-background-hover: var(--cds-alias-primary-tint);');
  });

  it('adds the warning text override only for a changed light-theme warning color', () => {
    const struct: CdsThemeStructure = {
      light: { warning: [new Color('--cds-alias-status-warning', 'hsl(50deg 100% 57%)')] },
      dark: { warning: [new Color('--cds-alias-status-warning', 'hsl(50deg 100% 57%)')] },
    };
    struct.light.warning[0].color = new HslColor(10, 20, 30);
    struct.dark.warning[0].color = new HslColor(10, 20, 30);

    const withOverride = generateCSS(struct, true).join('\n');
    expect(withOverride).toContain('--cds-alias-typography-color-black: var(--cds-alias-typography-color-100);');

    const withoutOverride = generateCSS(struct, false).join('\n');
    expect(withoutOverride).not.toContain('--cds-alias-typography-color-black');
  });

  it('does not add the warning text override for the dark theme even when enabled', () => {
    const struct: CdsThemeStructure = {
      light: { warning: [] },
      dark: { warning: [new Color('--cds-alias-status-warning', 'hsl(50deg 100% 57%)')] },
    };
    struct.dark.warning[0].color = new HslColor(10, 20, 30);

    const css = generateCSS(struct, true).join('\n');
    expect(css).not.toContain('--cds-alias-typography-color-black');
  });
});
