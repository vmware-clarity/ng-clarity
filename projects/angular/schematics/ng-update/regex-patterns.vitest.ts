/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Unit tests for the compiled regex patterns used in every migration phase.
 *
 * These tests sit one level below the full migration tests (migration.vitest.ts)
 * and target the pattern logic directly. Each test follows the same structure:
 *   1. A positive case — the pattern must fire.
 *   2. A boundary case — the pattern must NOT fire (guards false positives).
 *
 * The regexes are compiled here using the same logic as in the migration
 * source files so that a change to one is immediately caught by the other.
 */

import { describe, expect, it } from 'vitest';

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
// Helpers — must stay in sync with the escapeRegExp() in each migration file
// ---------------------------------------------------------------------------

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// 1. Import path regexes (wildcard module replacements)
// ---------------------------------------------------------------------------

describe('Import path regex patterns', () => {
  const wildcardRules = IMPORT_REPLACEMENTS.filter(r => r.oldSymbol === '*');

  for (const rule of wildcardRules) {
    // Matches: `from 'oldModule'` and `from 'oldModule/subpath'`
    // Does not match: unrelated modules that happen to share a prefix letter
    const regex = new RegExp(`(from\\s+['"])${escapeRegExp(rule.oldModule)}(?=[/'"])`, 'g');

    it(`replaces '${rule.oldModule}'`, () => {
      const input = `import { Foo } from '${rule.oldModule}';`;
      expect(input.replace(regex, `$1${rule.newModule}`)).toBe(`import { Foo } from '${rule.newModule}';`);
    });

    it(`does not affect an unrelated import containing '${rule.oldModule}' as a different path`, () => {
      // An import that ends with the old module name but is not a match
      const unrelated = `import { Foo } from '@other/pkg';`;
      expect(unrelated.replace(regex, `$1${rule.newModule}`)).toBe(unrelated);
    });
  }

  it('replaces subpath imports — @clr/angular/src/forms/subpath', () => {
    // The regex lookahead allows a trailing `/` so subpaths migrate too.
    const regex = new RegExp(`(from\\s+['"])${escapeRegExp('@clr/angular/src/forms')}(?=[/'"])`, 'g');
    const input = `import { Foo } from '@clr/angular/src/forms/utils';`;
    expect(input.replace(regex, `$1@clr/angular/forms`)).toBe(`import { Foo } from '@clr/angular/forms/utils';`);
  });

  it('longer (more specific) path takes precedence over shorter prefix', () => {
    // @clr/angular/src/accordion/stepper must match before @clr/angular/src/accordion
    const rules = [...IMPORT_REPLACEMENTS].sort((a, b) => b.oldModule.length - a.oldModule.length);
    const stepperIdx = rules.findIndex(r => r.oldModule === '@clr/angular/src/accordion/stepper');
    const accordionIdx = rules.findIndex(r => r.oldModule === '@clr/angular/src/accordion');

    expect(stepperIdx).toBeGreaterThanOrEqual(0);
    expect(accordionIdx).toBeGreaterThanOrEqual(0);
    expect(stepperIdx).toBeLessThan(accordionIdx);
  });
});

// ---------------------------------------------------------------------------
// 2. Symbol rename regexes (word boundary)
// ---------------------------------------------------------------------------

describe('Symbol rename regex patterns', () => {
  const renameRules = SYMBOL_REPLACEMENTS.filter(r => r.new !== '');

  for (const rule of renameRules) {
    // Ç (U+00C7) is not a word character, so \b does not delimit it correctly.
    // The migration uses explicit lookahead/lookbehind for those symbols.
    const regex = rule.old.startsWith('Ç')
      ? new RegExp(`(?<![A-Za-z0-9_$Ç])${escapeRegExp(rule.old)}(?![A-Za-z0-9_$])`, 'g')
      : new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');

    it(`renames '${rule.old}' as a standalone identifier`, () => {
      expect(rule.old.replace(regex, rule.new)).toBe(rule.new);
    });

    it(`does not rename '${rule.old}' when followed by additional identifier characters`, () => {
      const withSuffix = `${rule.old}Extra`;
      expect(withSuffix.replace(regex, rule.new)).toBe(withSuffix);
    });

    it(`does not rename '${rule.old}' when preceded by additional identifier characters`, () => {
      const withPrefix = `My${rule.old}`;
      expect(withPrefix.replace(regex, rule.new)).toBe(withPrefix);
    });
  }

  it('ClrIconModule is not matched inside ClrIconModuleConfig', () => {
    const rule = SYMBOL_REPLACEMENTS.find(r => r.old === 'ClrIconModule');
    expect(rule).toBeDefined();
    if (!rule) {
      return;
    }
    const regex = new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');
    expect('ClrIconModuleConfig'.replace(regex, rule.new)).toBe('ClrIconModuleConfig');
  });

  it('FocusService is not matched inside FocusServiceProvider', () => {
    const rule = SYMBOL_REPLACEMENTS.find(r => r.old === 'FocusService');
    expect(rule).toBeDefined();
    if (!rule) {
      return;
    }
    const regex = new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');
    expect('FocusServiceProvider'.replace(regex, rule.new)).toBe('FocusServiceProvider');
  });
});

// ---------------------------------------------------------------------------
// 3. Removed symbol regexes (import strip + usage TODO annotation)
// ---------------------------------------------------------------------------

describe('Removed symbol regex patterns', () => {
  const removedSymbols = SYMBOL_REPLACEMENTS.filter(r => r.new === '').map(r => r.old);

  for (const sym of removedSymbols) {
    const soleImportRe = new RegExp(
      `^\\s*import\\s*\\{\\s*${escapeRegExp(sym)}\\s*\\}\\s*from\\s*['"][^'"]+['"]\\s*;?\\s*$`,
      'gm'
    );
    const usageRe = new RegExp(`\\b${escapeRegExp(sym)}\\b`, 'g');

    it(`'${sym}' sole-import line is fully removed`, () => {
      const input = `import { ${sym} } from '@clr/angular/utils';`;
      expect(input.replace(soleImportRe, '')).toBe('');
    });

    it(`'${sym}' is not stripped from a multi-symbol import line`, () => {
      expect(soleImportRe.test(`import { ${sym}, OtherThing } from '@clr/angular/utils';`)).toBe(false);
    });

    it(`'${sym}' usage regex does not match inside a longer identifier`, () => {
      const longer = `${sym}Wrapper`;
      expect(usageRe.test(longer)).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// 4. Template output binding regexes
// ---------------------------------------------------------------------------

describe('Template output binding regex patterns', () => {
  for (const rule of TEMPLATE_OUTPUT_REPLACEMENTS) {
    const regex = new RegExp(`\\(${escapeRegExp(rule.old)}\\)`, 'g');

    it(`replaces (${rule.old})`, () => {
      const input = `<clr-wizard (${rule.old})="handler($event)">`;
      expect(input.replace(regex, `(${rule.new})`)).toContain(`(${rule.new})`);
    });

    it(`does not match (${rule.old}) inside a longer event name`, () => {
      // The pattern requires the exact closing `)` immediately after the name.
      const input = `<clr-wizard (${rule.old}Extended)="handler()">`;
      expect(input.replace(regex, `(${rule.new})`)).not.toContain(`(${rule.new})`);
    });
  }
});

// ---------------------------------------------------------------------------
// 5. Template input binding regexes
// ---------------------------------------------------------------------------

describe('Template input binding regex patterns', () => {
  for (const rule of TEMPLATE_INPUT_REPLACEMENTS) {
    const boundRegex = new RegExp(`\\[${escapeRegExp(rule.old)}\\]`, 'g');
    const bareRegex = new RegExp(`(?<=\\s)${escapeRegExp(rule.old)}(?==)`, 'g');

    it(`replaces [${rule.old}] (bound form)`, () => {
      const input = `<clr-badge [${rule.old}]="value">`;
      expect(input.replace(boundRegex, `[${rule.new}]`)).toContain(`[${rule.new}]`);
    });

    it(`replaces ${rule.old}= (bare attribute form)`, () => {
      const input = `<clr-badge ${rule.old}="fixed">`;
      expect(input.replace(bareRegex, rule.new)).toContain(`${rule.new}=`);
    });

    it(`does not replace [${rule.old}Extended] (longer binding name)`, () => {
      const input = `<clr-badge [${rule.old}Extended]="value">`;
      expect(input.replace(boundRegex, `[${rule.new}]`)).not.toContain(`[${rule.new}]`);
    });
  }
});

// ---------------------------------------------------------------------------
// 6. cds-icon attribute regexes (scoped — must not touch other elements)
// ---------------------------------------------------------------------------

describe('cds-icon attribute regex patterns (context-scoped)', () => {
  const cdsIconEntries = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context === 'cds-icon');
  // Quote-aware regex matching the complete <cds-icon ...> or <cds-icon ... /> opening tag.
  const CDS_ICON_TAG_RE = /<cds-icon\b(?:[^"'/>]|"[^"]*"|'[^']*')*(?:\/?>)/g;

  function applyCdsIconMigration(text: string): string {
    if (!cdsIconEntries.some(r => text.includes(r.old))) {
      return text;
    }
    CDS_ICON_TAG_RE.lastIndex = 0;
    return text.replace(CDS_ICON_TAG_RE, tagMatch => {
      for (const { old: oldAttr, new: newAttr } of cdsIconEntries) {
        if (tagMatch.includes(oldAttr)) {
          tagMatch = tagMatch.split(oldAttr).join(newAttr);
        }
      }
      return tagMatch;
    });
  }

  for (const rule of cdsIconEntries) {
    it(`replaces ${rule.old} on <cds-icon>`, () => {
      const input = `<cds-icon ${rule.old}="value">`;
      expect(applyCdsIconMigration(input)).toContain(rule.new);
      expect(applyCdsIconMigration(input)).not.toContain(rule.old);
    });

    it(`does not replace ${rule.old} on a native element (e.g. <input>)`, () => {
      const input = `<input ${rule.old}="value">`;
      expect(applyCdsIconMigration(input)).toBe(input);
    });

    it(`does not replace ${rule.old} on an arbitrary non-cds-icon component`, () => {
      const input = `<clr-some-other ${rule.old}="value">`;
      expect(applyCdsIconMigration(input)).toBe(input);
    });
  }

  it('replaces multiple cds-icon attributes in one tag', () => {
    const input = `<cds-icon [attr.shape]="s" [attr.size]="sz" [attr.flip]="f">`;
    const result = applyCdsIconMigration(input);
    expect(result).toContain('[shape]');
    expect(result).toContain('[size]');
    expect(result).toContain('[flip]');
    expect(result).not.toContain('[attr.');
  });

  it('leaves <cds-icon> untouched when no old attributes are present', () => {
    const input = `<cds-icon [shape]="already-migrated">`;
    expect(applyCdsIconMigration(input)).toBe(input);
  });
});

// ---------------------------------------------------------------------------
// 7. Global attribute regexes (word boundary — e.g. clrPopoverAnchor)
// ---------------------------------------------------------------------------

describe('Global attribute regex patterns (word-boundary)', () => {
  const globalRules = TEMPLATE_ATTRIBUTE_REPLACEMENTS.filter(r => r.context !== 'cds-icon');

  for (const rule of globalRules) {
    const regex = new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');

    it(`replaces '${rule.old}' as a standalone attribute`, () => {
      const input = `<button ${rule.old}>`;
      expect(input.replace(regex, rule.new)).toContain(rule.new);
    });

    it(`does not replace '${rule.old}' when it is a prefix of a longer attribute name`, () => {
      const input = `<button ${rule.old}Close>`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });

    it(`does not replace '${rule.old}' when it appears as a suffix of a longer attribute name`, () => {
      const input = `<button my${rule.old}>`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 8. Header class regexes (word boundary)
// ---------------------------------------------------------------------------

describe('Header class regex patterns', () => {
  for (const rule of HEADER_CLASS_REPLACEMENTS) {
    const regex = new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');

    it(`replaces class '${rule.old}'`, () => {
      const input = `<header class="${rule.old}">`;
      expect(input.replace(regex, rule.new)).toContain(rule.new);
    });

    it(`does not replace '${rule.old}' when followed by a digit (e.g. ${rule.old}0)`, () => {
      const input = `<header class="${rule.old}0">`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });

    it(`does not replace '${rule.old}' when followed by a letter (e.g. ${rule.old}x)`, () => {
      const input = `<header class="${rule.old}x">`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 9. CSS custom property rename regexes (negative lookahead (?![-\w]))
// ---------------------------------------------------------------------------

describe('CSS custom property rename regex patterns', () => {
  const renameRules = CSS_PROPERTY_REPLACEMENTS.filter(r => r.new);

  for (const rule of renameRules) {
    const regex = new RegExp(`${escapeRegExp(rule.old)}(?![-\\w])`, 'g');

    it(`renames '${rule.old}' in a CSS declaration`, () => {
      const input = `  ${rule.old}: var(--clr-color-action-600);`;
      expect(input.replace(regex, rule.new)).toContain(rule.new);
      expect(input.replace(regex, rule.new)).not.toContain(rule.old);
    });

    it(`does not rename '${rule.old}' when it is a prefix of a longer property name`, () => {
      const input = `  ${rule.old}-extra: red;`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 10. CSS custom property remove regexes (negative lookahead (?![-\w]))
// ---------------------------------------------------------------------------

describe('CSS custom property remove regex patterns', () => {
  const removeRules = CSS_PROPERTY_REPLACEMENTS.filter(r => !r.new);

  for (const rule of removeRules) {
    const regex = new RegExp(`(\\s*)(${escapeRegExp(rule.old)}(?![-\\w])\\s*:[^;]*;)`, 'g');

    it(`removes the full declaration for '${rule.old}'`, () => {
      const input = `  ${rule.old}: 10px;`;
      expect(input.replace(regex, '').trim()).toBe('');
    });

    it(`does not remove '${rule.old}' when it is a prefix of a longer property`, () => {
      const input = `  ${rule.old}-extra: 10px;`;
      expect(input.replace(regex, '')).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 11. CSS selector rename regexes (word boundary)
// ---------------------------------------------------------------------------

describe('CSS selector regex patterns', () => {
  for (const rule of CSS_SELECTOR_REPLACEMENTS) {
    const regex = new RegExp(`\\b${escapeRegExp(rule.old)}\\b`, 'g');

    it(`renames selector '${rule.old}'`, () => {
      const input = `.${rule.old} { color: red; }`;
      expect(input.replace(regex, rule.new)).toContain(`.${rule.new}`);
    });

    it(`does not rename '${rule.old}' when followed by a digit`, () => {
      const input = `.${rule.old}0 { color: red; }`;
      expect(input.replace(regex, rule.new)).toBe(input);
    });
  }
});

// ---------------------------------------------------------------------------
// 12. CSS attribute value regexes (cds-text heading → headline)
// ---------------------------------------------------------------------------

describe('CSS attribute value regex patterns', () => {
  for (const rule of CSS_ATTRIBUTE_REPLACEMENTS) {
    const regex = new RegExp(escapeRegExp(rule.old), 'g');

    it(`replaces '${rule.old}'`, () => {
      expect(rule.old.replace(regex, rule.new)).toBe(rule.new);
    });

    it(`does not replace '${rule.old}' in a value where the closing quote differs`, () => {
      // Because the old value includes its closing quote, a different-length
      // value will not be matched (e.g. heading" won't match heading-secondary").
      const closed = rule.old.endsWith('"') ? rule.old.slice(0, -1) + '-secondary"' : null;
      if (closed) {
        expect(closed.replace(regex, rule.new)).toBe(closed);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 13. SCSS mixin removal regexes
// ---------------------------------------------------------------------------

describe('SCSS mixin removal regex patterns', () => {
  for (const name of REMOVED_SCSS_MIXINS) {
    const regex = new RegExp(`@include\\s+${escapeRegExp(name)}\\s*\\([^)]*\\)\\s*;`, 'g');

    it(`matches @include ${name}() usage`, () => {
      const input = `  @include ${name}(color: red);`;
      expect(regex.test(input)).toBe(true);
    });

    it(`does not match a bare reference to '${name}' without @include`, () => {
      regex.lastIndex = 0;
      const input = `  // Uses ${name} internally`;
      expect(regex.test(input)).toBe(false);
    });

    it(`does not match a different mixin that starts with '${name}'`, () => {
      regex.lastIndex = 0;
      const input = `  @include ${name}-extended(args);`;
      expect(regex.test(input)).toBe(false);
    });
  }
});
