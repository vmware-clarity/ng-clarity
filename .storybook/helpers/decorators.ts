/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { Decorator } from '@storybook/angular';

/**
 * Injects raw, unencapsulated CSS ahead of the story template by prepending a literal
 * `<style>` tag to the story's template string.
 *
 * DO NOT "improve" this by moving the CSS onto an Angular component's `styles:` metadata, and
 * do not route it through the `styles` field of `StoryFnAngularReturnType` either. Both of
 * those apply Angular's default (emulated) view encapsulation, which rewrites every selector
 * with an `_ngcontent-*` attribute. That changes which elements the rules match -- notably
 * content projected into Clarity components, which carries the *host's* encapsulation
 * attribute, not the story component's -- so styles that apply today would silently stop
 * applying. The inline `<style>` blocks this helper replaces were unencapsulated, and the
 * visual-regression snapshots in `tests/snapshots/` were recorded that way. Keeping the
 * literal `<style>` tag is what keeps those snapshots stable.
 *
 * ```ts
 * decorators: [withStyles(HIGHLIGHT_STYLES)],
 * ```
 */
export function withStyles(css: string): Decorator {
  return (storyFn, _context) => {
    const story = storyFn();

    if (typeof story.template !== 'string') {
      throw new Error(
        'withStyles() can only be used on stories that render a `template`. This story returned no ' +
          'template, so there is nothing to prepend the <style> tag to. Give the story a `template`, ' +
          'or put the CSS on the `styles` of a *.storybook.component.ts instead.'
      );
    }

    return { ...story, template: `<style>${css}</style>${story.template}` };
  };
}
