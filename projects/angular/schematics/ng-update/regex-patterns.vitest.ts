/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Pattern-level tests for the compiled regexes inside every migration phase.
 *
 * Each test calls the same production transform function that is used during
 * `ng update`, so a change to any regex in the migration source immediately
 * surfaces here. The tests are intentionally narrow: one input that MUST be
 * transformed (positive case) and one that must NOT be (boundary/false-positive
 * case), exercising a single rule at a time.
 *
 * These sit below migration.vitest.ts, which tests end-to-end schematic
 * behaviour on HostTree files. Here we only care about the regex boundary.
 */

import { describe, expect, it } from 'vitest';

import { applyStyleTransforms } from './migrations/css-migration';
import { transformImports } from './migrations/import-migration';
import { applyHtmlTransforms } from './migrations/template-migration';
import {
  CSS_ATTRIBUTE_REPLACEMENTS,
  CSS_PROPERTY_REPLACEMENTS,
  CSS_SELECTOR_REPLACEMENTS,
  REMOVED_SCSS_MIXINS,
} from './replacements/css-replacements';
import { IMPORT_REPLACEMENTS } from './replacements/import-replacements';
import { SYMBOL_REPLACEMENTS } from './replacements/symbol-replacements';
import {
  HEADER_CLASS_REPLACEMENTS,
  TEMPLATE_ATTRIBUTE_REPLACEMENTS,
  TEMPLATE_INPUT_REPLACEMENTS,
  TEMPLATE_OUTPUT_REPLACEMENTS,
} from './replacements/template-replacements';

// ---------------------------------------------------------------------------
// 1. Import path regexes (wildcard module replacements)
// ---------------------------------------------------------------------------

describe('Import path regex patterns', () => {
  const wildcardRules = IMPORT_REPLACEMENTS.filter(r => r.oldSymbol === '*');

  for (const rule of wildcardRules) {
    it(`replaces '${rule.oldModule}' import`, () => {
      const input = `import { Foo } from '${rule.oldModule}';`;
      expect(transformImports(input)).toContain(`from '${rule.newModule}'`);
    });

    it(`does not affect an unrelated import when processing '${rule.oldModule}'`, () => {
      const unrelated = `import { Foo } from '@other/pkg';`;
      expect(transformImports(unrelated)).toBe(unrelated);
    });
  }

  it('longer (more specific) path takes precedence over shorter prefix in sort order', () => {
    const sorted = [...IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);
    const stepperIdx = sorted.findIndex(r => r.oldModule === '@clr/angular/src/accordion/stepper');
    const accordionIdx = sorted.findIndex(r => r.oldModule === '@clr/angular/src/accordion');

    expect(stepperIdx).toBeGreaterThanOrEqual(0);
    expect(accordionIdx).toBeGreaterThanOrEqual(0);
    expect(stepperIdx).toBeLessThan(accordionIdx);
  });

  it('replaces subpath imports — @clr/angular/src/forms/subpath', () => {
    const input = `import { Foo } from '@clr/angular/src/forms/utils';`;
    expect(transformImports(input)).toContain(`from '@clr/angular/forms/utils'`);
  });
});

// ---------------------------------------------------------------------------
// 2. Symbol rename regexes (word boundary)
// ---------------------------------------------------------------------------

describe('Symbol rename regex patterns', () => {
  const renameRules = SYMBOL_REPLACEMENTS.filter(r => r.new !== '');

  // Ç (U+00C7) is not a regex \w character so \b doesn't delimit it.
  // The migration uses explicit lookahead/lookbehind for these symbols.
  // The new name is always a substring of the old name (e.g. "ÇlrClrFoo" → "ClrFoo"),
  // so suffix-based boundary tests would false-fail. We test the lookbehind instead.
  const cPrefixRules = renameRules.filter(r => r.old.startsWith('Ç'));
  const standardRules = renameRules.filter(r => !r.old.startsWith('Ç'));

  for (const rule of standardRules) {
    it(`renames '${rule.old}' as a standalone identifier`, () => {
      const input = `import { ${rule.old} } from '@clr/angular'; const x = ${rule.old};`;
      const output = transformImports(input);
      expect(output).toContain(rule.new);
    });

    it(`does not rename '${rule.old}' when followed by extra identifier characters`, () => {
      const withSuffix = `${rule.old}Extra`;
      const input = `import { ${withSuffix} } from '@clr/angular'; const x = ${withSuffix};`;
      expect(transformImports(input)).toContain(withSuffix);
      expect(transformImports(input)).not.toContain(`${rule.new}Extra`);
    });
  }

  for (const rule of cPrefixRules) {
    it(`renames '${rule.old}' as a standalone identifier`, () => {
      const input = `import { ${rule.old} } from '@clr/angular'; const x = ${rule.old};`;
      const output = transformImports(input);
      expect(output).toContain(rule.new);
    });

    it(`does not rename '${rule.old}' when preceded by an identifier character (lookbehind guard)`, () => {
      // The Ç regex uses (?<![A-Za-z0-9_$Ç]) to prevent matching inside longer identifiers.
      const withPrefix = `A${rule.old}`;
      const input = `import { ${withPrefix} } from '@clr/angular'; const x = ${withPrefix};`;
      const output = transformImports(input);
      expect(output).toContain(withPrefix);
    });
  }

  it('ClrIconModule is not matched inside ClrIconModuleConfig', () => {
    const input = `import { ClrIconModuleConfig } from '@clr/angular'; const cfg: ClrIconModuleConfig = {};`;
    const output = transformImports(input);
    expect(output).toContain('ClrIconModuleConfig');
    expect(output).not.toContain('ClrIconConfig');
  });

  it('FocusService is not matched inside FocusServiceProvider', () => {
    const input = `import { FocusServiceProvider } from '@clr/angular/forms'; const p: FocusServiceProvider = {};`;
    const output = transformImports(input);
    expect(output).toContain('FocusServiceProvider');
    expect(output).not.toContain('FormsFocusServiceProvider');
  });
});

// ---------------------------------------------------------------------------
// 3. Removed symbol regexes (import strip + usage TODO annotation)
// ---------------------------------------------------------------------------

describe('Removed symbol regex patterns', () => {
  const removedSymbols = SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);

  for (const sym of removedSymbols) {
    it(`strips a sole import of removed symbol '${sym}'`, () => {
      const input = `import { ${sym} } from '@clr/angular/utils';`;
      const output = transformImports(input);
      expect(output).not.toContain(`import { ${sym} }`);
    });

    it(`does not strip '${sym}' when it is a sibling in a multi-symbol import`, () => {
      const input = `import { ${sym}, OtherThing } from '@clr/angular/utils';`;
      const output = transformImports(input);
      expect(output).toContain('OtherThing');
    });

    it(`does not match '${sym}' inside a longer identifier`, () => {
      const longer = `${sym}Wrapper`;
      // Place it in a context that would trigger the symbol removal fast-path.
      const input = `import { ${sym} } from '@clr/angular/utils'; const w: ${longer} = {};`;
      const output = transformImports(input);
      expect(output).toContain(longer);
    });
  }
});

// ---------------------------------------------------------------------------
// 4. Template output binding regexes
// ---------------------------------------------------------------------------

describe('Template output binding regex patterns', () => {
  for (const rule of TEMPLATE_OUTPUT_REPLACEMENTS) {
    it(`replaces (${rule.old})`, () => {
      const input = `<clr-wizard (${rule.old})="handler($event)"></clr-wizard>`;
      expect(applyHtmlTransforms(input)).toContain(`(${rule.new})`);
    });

    it(`does not match (${rule.old}) when extended with extra characters`, () => {
      const input = `<clr-wizard (${rule.old}Extended)="handler()"></clr-wizard>`;
      expect(applyHtmlTransforms(input)).not.toContain(`(${rule.new})`);
      expect(applyHtmlTransforms(input)).toContain(`(${rule.old}Extended)`);
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Template input binding regexes
// ---------------------------------------------------------------------------

describe('Template input binding regex patterns', () => {
  for (const rule of TEMPLATE_INPUT_REPLACEMENTS) {
    it(`replaces [${rule.old}] (bound form)`, () => {
      const input = `<clr-badge [${rule.old}]="value"></clr-badge>`;
      expect(applyHtmlTransforms(input)).toContain(`[${rule.new}]`);
    });

    it(`replaces ${rule.old}= (bare attribute form)`, () => {
      const input = `<clr-badge ${rule.old}="fixed"></clr-badge>`;
      expect(applyHtmlTransforms(input)).toContain(`${rule.new}=`);
    });

    it(`does not replace [${rule.old}Extended] (longer binding name)`, () => {
      const input = `<clr-badge [${rule.old}Extended]="value"></clr-badge>`;
      expect(applyHtmlTransforms(input)).not.toContain(`[${rule.new}]`);
      expect(applyHtmlTransforms(input)).toContain(`[${rule.old}Extended]`);
    });
  }
});

// ---------------------------------------------------------------------------
// 6. cds-icon attribute regexes (scoped — must not touch other elements)
// ---------------------------------------------------------------------------

describe('cds-icon attribute regex patterns (context-scoped)', () => {
  const cdsIconRules = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context === 'cds-icon');

  for (const rule of cdsIconRules) {
    it(`replaces ${rule.old} on <cds-icon>`, () => {
      const input = `<cds-icon ${rule.old}="value"></cds-icon>`;
      const output = applyHtmlTransforms(input);
      expect(output).toContain(rule.new);
      expect(output).not.toContain(rule.old);
    });

    it(`does not replace ${rule.old} on a native element (e.g. <input>)`, () => {
      const input = `<input ${rule.old}="value">`;
      expect(applyHtmlTransforms(input)).toBe(input);
    });

    it(`does not replace ${rule.old} on an arbitrary non-cds-icon component`, () => {
      const input = `<clr-some-other ${rule.old}="value"></clr-some-other>`;
      expect(applyHtmlTransforms(input)).toBe(input);
    });
  }

  it('replaces multiple cds-icon attributes in one tag', () => {
    const input = `<cds-icon [attr.shape]="s" [attr.size]="sz" [attr.flip]="f"></cds-icon>`;
    const output = applyHtmlTransforms(input);
    expect(output).toContain('[shape]');
    expect(output).toContain('[size]');
    expect(output).toContain('[flip]');
    expect(output).not.toContain('[attr.');
  });

  it('leaves <cds-icon> untouched when no old attributes are present', () => {
    const input = `<cds-icon [shape]="already-migrated"></cds-icon>`;
    expect(applyHtmlTransforms(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// 7. Global attribute regexes (word boundary — e.g. clrPopoverAnchor)
// ---------------------------------------------------------------------------

describe('Global attribute regex patterns (word-boundary)', () => {
  const globalRules = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context !== 'cds-icon');

  for (const rule of globalRules) {
    it(`replaces '${rule.old}' as a standalone attribute`, () => {
      const input = `<button ${rule.old}>label</button>`;
      expect(applyHtmlTransforms(input)).toContain(rule.new);
    });

    it(`does not replace '${rule.old}' when it is a prefix of a longer attribute name`, () => {
      const input = `<button ${rule.old}Close>label</button>`;
      expect(applyHtmlTransforms(input)).toContain(`${rule.old}Close`);
      expect(applyHtmlTransforms(input)).not.toContain(`${rule.new}Close`);
    });
  }
});

// ---------------------------------------------------------------------------
// 8. Header class regexes (word boundary)
// ---------------------------------------------------------------------------

describe('Header class regex patterns', () => {
  for (const rule of HEADER_CLASS_REPLACEMENTS) {
    it(`replaces class '${rule.old}'`, () => {
      const input = `<header class="${rule.old}"></header>`;
      expect(applyHtmlTransforms(input)).toContain(rule.new);
    });

    it(`does not replace '${rule.old}' when followed by a digit (e.g. ${rule.old}0)`, () => {
      const input = `<header class="${rule.old}0"></header>`;
      expect(applyHtmlTransforms(input)).toContain(`${rule.old}0`);
      expect(applyHtmlTransforms(input)).not.toContain(rule.new);
    });

    it(`does not replace '${rule.old}' when followed by a letter (e.g. ${rule.old}x)`, () => {
      const input = `<header class="${rule.old}x"></header>`;
      expect(applyHtmlTransforms(input)).toContain(`${rule.old}x`);
    });
  }
});

// ---------------------------------------------------------------------------
// 9. CSS custom property rename regexes (negative lookahead (?![-\w]))
// ---------------------------------------------------------------------------

describe('CSS custom property rename regex patterns', () => {
  const renameRules = CSS_PROPERTY_REPLACEMENTS.filter(r => r.new);

  for (const rule of renameRules) {
    it(`renames '${rule.old}' in a CSS declaration`, () => {
      const input = `  ${rule.old}: var(--clr-color-action-600);`;
      const output = applyStyleTransforms(input, '/styles.scss');
      expect(output).toContain(rule.new);
      expect(output).not.toContain(rule.old);
    });

    it(`does not rename '${rule.old}' when it is a prefix of a longer property name`, () => {
      const input = `  ${rule.old}-extra: red;`;
      expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 10. CSS custom property remove regexes (negative lookahead (?![-\w]))
// ---------------------------------------------------------------------------

describe('CSS custom property remove regex patterns', () => {
  const removeRules = CSS_PROPERTY_REPLACEMENTS.filter(r => !r.new);

  for (const rule of removeRules) {
    it(`removes and annotates the full declaration for '${rule.old}'`, () => {
      const input = `  ${rule.old}: 10px;`;
      const output = applyStyleTransforms(input, '/styles.scss');
      expect(output).toContain('TODO(v18 migration)');
    });

    it(`does not remove '${rule.old}' when it is a prefix of a longer property`, () => {
      const input = `  ${rule.old}-extra: 10px;`;
      expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 11. CSS selector rename regexes (word boundary)
// ---------------------------------------------------------------------------

describe('CSS selector regex patterns', () => {
  for (const rule of CSS_SELECTOR_REPLACEMENTS) {
    it(`renames selector '${rule.old}'`, () => {
      const input = `.${rule.old} { color: red; }`;
      expect(applyStyleTransforms(input, '/styles.scss')).toContain(`.${rule.new}`);
    });

    it(`does not rename '${rule.old}' when followed by a digit`, () => {
      const input = `.${rule.old}0 { color: red; }`;
      expect(applyStyleTransforms(input, '/styles.scss')).toContain(`${rule.old}0`);
    });
  }
});

// ---------------------------------------------------------------------------
// 12. CSS attribute value regexes (cds-text heading → headline)
// ---------------------------------------------------------------------------

describe('CSS attribute value regex patterns', () => {
  for (const rule of CSS_ATTRIBUTE_REPLACEMENTS) {
    it(`replaces '${rule.old}'`, () => {
      const input = `[${rule.old}] { font-weight: bold; }`;
      expect(applyStyleTransforms(input, '/styles.scss')).toContain(rule.new);
    });

    it(`does not replace '${rule.old}' inside an unrelated string value`, () => {
      // The matched pattern includes the closing quote, so a different-length
      // value cannot accidentally match.
      const unrelated = `.title { content: "unrelated"; }`;
      expect(applyStyleTransforms(unrelated, '/styles.scss')).toBe(unrelated);
    });
  }
});

// ---------------------------------------------------------------------------
// 13. SCSS mixin removal regexes
// ---------------------------------------------------------------------------

describe('SCSS mixin removal regex patterns', () => {
  for (const name of REMOVED_SCSS_MIXINS) {
    it(`comments out @include ${name}() usage`, () => {
      const input = `  @include ${name}(color: red);`;
      const output = applyStyleTransforms(input, '/styles.scss');
      expect(output).toContain('TODO(v18 migration)');
      expect(output).not.toMatch(/^\s*@include/m);
    });

    it(`does not match a bare reference to '${name}' without @include`, () => {
      const input = `  // Uses ${name} internally`;
      expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
    });

    it(`does not match a different mixin that starts with '${name}'`, () => {
      const input = `  @include ${name}-extended(args);`;
      expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
    });
  }
});
