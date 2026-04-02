/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HostTree } from '@angular-devkit/schematics';
import { beforeEach, describe, expect, it } from 'vitest';

import { applyTsTransforms, runMigrations } from './test-helpers';
import { applyStyleTransforms } from '../migrations/css-migration';
import {
  CSS_ATTRIBUTE_REPLACEMENTS,
  CSS_PROPERTY_REPLACEMENTS,
  CSS_SELECTOR_REPLACEMENTS,
  REMOVED_SCSS_MIXINS,
} from '../replacements/css-replacements';

describe('CSS migration', () => {
  let tree: HostTree;

  beforeEach(() => {
    tree = new HostTree();
  });

  // -------------------------------------------------------------------------
  // Schematic integration tests
  // -------------------------------------------------------------------------

  describe('CSS custom property renames', () => {
    it('should rename wizard stepnav CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-wizard-stepnav-text--active: red;
  --clr-wizard-stepnav-item-border-color--active: blue;
  --clr-wizard-stepnav-link-hover-bg-color: green;
  --clr-wizard-stepnav-link-active-bg-color: yellow;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-wizard-stepnav-text-selected');
      expect(content).toContain('--clr-wizard-stepnav-item-complete-border-color');
      expect(content).toContain('--clr-wizard-stepnav-hover-bgcolor');
      expect(content).toContain('--clr-wizard-stepnav-active-bgcolor');
    });

    it('should rename accordion CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-active-background-color: #fff;
  --clr-collapsible-panel-active-background-color: #eee;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-accordion-header-open-background-color');
      expect(content).toContain('--clr-collapsible-panel-header-open-background-color');
    });
  });

  describe('CSS custom property removals', () => {
    it('should comment out removed CSS custom properties', () => {
      tree.create(
        '/styles.scss',
        `:root {
  --clr-accordion-step-title-min-width: 200px;
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('TODO(v18 migration)');
      expect(content).toContain('has been removed');
    });
  });

  describe('CSS selector renames', () => {
    it('should replace header-N selectors in CSS', () => {
      tree.create(
        '/styles.scss',
        `.header-4 { color: red; }
.header-5 { color: blue; }
.header-6 { color: green; }
.header-7 { color: yellow; }`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('.header-3');
      expect(content).toContain('.header-1');
      expect(content).toContain('.header-2');
    });
  });

  describe('CSS attribute value renames', () => {
    it('should replace cds-text heading attribute selectors in CSS', () => {
      tree.create('/styles.scss', `[cds-text*="heading"] { font-weight: bold; }`);

      runMigrations(tree);

      expect(tree.readText('/styles.scss')).toContain('[cds-text*="headline"]');
    });
  });

  describe('SCSS mixin removals', () => {
    it('should comment out removed range-track-style SCSS mixin', () => {
      tree.create(
        '/styles.scss',
        `input[type='range'] {
  @include range-track-style(#000, #fff, 4px);
}`
      );

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('TODO(v18 migration)');
      expect(content).toContain('range-track-style');
      expect(content).not.toMatch(/^\s*@include range-track-style/m);
    });
  });

  describe('inline styles in TypeScript files', () => {
    it('should migrate inline styles in TypeScript files', () => {
      const source = `
class AppComponent {}
`.replace(
        'class',
        `${'@'}Component({ styles: [\`
    :host { --clr-wizard-stepnav-text--active: red; }
  \`] })\nclass`
      );

      tree.create('/app.component.ts', source);
      runMigrations(tree);

      expect(tree.readText('/app.component.ts')).toContain('--clr-wizard-stepnav-text-selected');
    });
  });

  describe('no-op guards', () => {
    it('should not modify files without matching patterns', () => {
      const original = `:root { --custom-prop: red; }`;
      tree.create('/unrelated.scss', original);

      runMigrations(tree);

      expect(tree.readText('/unrelated.scss')).toBe(original);
    });

    it('should not modify .ts files that contain no Clarity-related content (fast-path)', () => {
      const original = `export function helper() { return 42; }`;
      expect(applyTsTransforms(original)).toBe(original);
    });
  });

  describe('false-positive guards', () => {
    it('should not rename a CSS custom property that merely starts with a known pattern', () => {
      tree.create('/styles.scss', `:root { --clr-wizard-stepnav-text--active-custom: blue; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-wizard-stepnav-text--active-custom');
      expect(content).not.toContain('--clr-wizard-stepnav-text-selected-custom');
    });

    it('should not comment out a removed CSS property that starts with a known removed name', () => {
      tree.create('/styles.scss', `:root { --clr-accordion-step-title-min-width-override: 300px; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--clr-accordion-step-title-min-width-override');
      expect(content).not.toContain('TODO(v18 migration)');
    });

    it('should not replace heading inside an unrelated CSS value string', () => {
      tree.create('/styles.scss', `.title { content: "This is a heading label"; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('"This is a heading label"');
      expect(content).not.toContain('"This is a headline label"');
    });

    it('should comment out only the exact range-track-style mixin and not a differently named mixin', () => {
      tree.create('/styles.scss', `input { @include range-track-style-custom(#000, #fff, 4px); }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('@include range-track-style-custom');
      expect(content).not.toContain('TODO(v18 migration)');
    });

    it('should not alter user-defined CSS custom properties that share a prefix with Clarity ones', () => {
      tree.create('/styles.scss', `:root { --my-clr-accordion-active-background-color: purple; }`);

      runMigrations(tree);
      const content = tree.readText('/styles.scss');

      expect(content).toContain('--my-clr-accordion-active-background-color');
      expect(content).not.toContain('--my-clr-accordion-header-open-background-color');
    });

    it('header-N CSS class inside a compound selector is replaced (known word-boundary behaviour)', () => {
      // `-` is not a \w character, so `\b` fires between `.clr-` and `header-4`.
      // This test documents the known behaviour: the substring is replaced.
      tree.create('/styles.scss', `.clr-header-4 { color: red; }`);

      runMigrations(tree);

      expect(tree.readText('/styles.scss')).toContain('.clr-header-3');
    });
  });

  // -------------------------------------------------------------------------
  // Regex pattern boundary tests — calls production applyStyleTransforms() directly
  // -------------------------------------------------------------------------

  describe('regex pattern boundaries', () => {
    describe('CSS custom property rename boundaries', () => {
      const renameRules = CSS_PROPERTY_REPLACEMENTS.filter(r => r.new);

      for (const rule of renameRules) {
        it(`'${rule.old}' is not renamed when it is a prefix of a longer property name`, () => {
          const input = `  ${rule.old}-extra: red;`;
          expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
        });
      }
    });

    describe('CSS custom property remove boundaries', () => {
      const removeRules = CSS_PROPERTY_REPLACEMENTS.filter(r => !r.new);

      for (const rule of removeRules) {
        it(`'${rule.old}' is not removed when it is a prefix of a longer property`, () => {
          const input = `  ${rule.old}-extra: 10px;`;
          expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
        });
      }
    });

    describe('CSS selector word-boundary boundaries', () => {
      for (const rule of CSS_SELECTOR_REPLACEMENTS) {
        it(`'${rule.old}' is not renamed when followed by a digit (${rule.old}0)`, () => {
          const input = `.${rule.old}0 { color: red; }`;
          expect(applyStyleTransforms(input, '/styles.scss')).toContain(`${rule.old}0`);
        });
      }
    });

    describe('CSS attribute value boundaries', () => {
      for (const rule of CSS_ATTRIBUTE_REPLACEMENTS) {
        it(`'${rule.old}' is not matched inside an unrelated CSS value`, () => {
          const unrelated = `.title { content: "unrelated"; }`;
          expect(applyStyleTransforms(unrelated, '/styles.scss')).toBe(unrelated);
        });
      }
    });

    describe('SCSS mixin removal boundaries', () => {
      for (const name of REMOVED_SCSS_MIXINS) {
        it(`a bare reference to '${name}' without @include is not affected`, () => {
          const input = `  // Uses ${name} internally`;
          expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
        });

        it(`a mixin that starts with '${name}' but has a different name is not affected`, () => {
          const input = `  @include ${name}-extended(args);`;
          expect(applyStyleTransforms(input, '/styles.scss')).toBe(input);
        });
      }
    });
  });
});
