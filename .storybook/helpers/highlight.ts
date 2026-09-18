/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ArgTypes } from '@storybook/angular';

/**
 * The `.highlight` rule that the datagrid stories use to outline whichever element the story is
 * actually about. Copied verbatim from the seven identical inline `<style>` blocks it replaces
 * (`datagrid-{action-overflow,column,detail,page-size,pagination,placeholder,row}.stories.ts`);
 * all seven were byte-identical apart from leading indentation.
 *
 * Do not restyle or reformat the declaration. The visual-regression snapshots in
 * `tests/snapshots/` were recorded against exactly this border, and any change to it re-bases
 * every datagrid snapshot.
 *
 * Pair it with `withStyles()` from `@storybook-helpers/decorators`, which keeps it
 * unencapsulated the way the inline `<style>` blocks were.
 */
export const HIGHLIGHT_STYLES = `
  .highlight {
    border: 1px solid var(--cds-alias-status-danger) !important;
  }
`;

/**
 * Default args for a story that supports the highlight.
 *
 * The default is `true` on purpose: `tests/visual-snapshots.spec.ts` appends `args: 'highlight:false'`
 * to the iframe URL of every story it screenshots, so the highlight is on for humans browsing
 * Storybook and off for the screenshots. Flipping this default to `false` would make the
 * highlight invisible everywhere, since nothing ever turns it back on.
 */
export const highlightArgs = { highlight: true };

/**
 * The argType for {@link highlightArgs}.
 *
 * `highlight` stays a visible, toggleable control rather than being hidden with `hideControls()`,
 * because being able to turn the outline off is the point of the arg for anyone reading the docs.
 *
 * Only `control` is declared here, never `type`. Storybook coerces URL args through
 * `argType.type`, which it infers as `boolean` from the `true` in {@link highlightArgs}; that
 * inference is what turns the `highlight:false` string in the VRT URL into an actual `false`.
 * Declaring an explicit `type` here would override that inference and change what the
 * screenshots render.
 */
export const highlightArgTypes: Partial<ArgTypes> = {
  highlight: {
    control: { type: 'boolean' },
    description: 'Outlines the element this story is about. The visual regression tests turn it off.',
  },
};
