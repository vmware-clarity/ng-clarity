/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SelectionType } from '@clr/angular';
import type { ArgTypes } from '@storybook/angular';

/**
 * Lays out the electronegativity cell (the value plus its bar) that the datagrid stories built on
 * `elements.data` render. Copied verbatim from the fifteen identical copies it replaces.
 *
 * `datagrid-expandable-row.stories.ts` keeps its own, different rule and does not use this one.
 *
 * Do not restyle or reformat it: the visual-regression snapshots were recorded against exactly
 * these declarations. Pair it with `withStyles()` from `@storybook-helpers/decorators`.
 */
export const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

/**
 * Spaces the custom footer navigation buttons of the virtual-scroll datagrid stories. Copied
 * verbatim from the two identical copies it replaces; the same snapshot caveat applies.
 */
export const FOOTER_NAV_STYLES = `
  .footer-nav-buttons {
    display: inline-block;
    margin-left: var(--cds-global-space-5);
  }
  .footer-button {
    min-width: var(--cds-global-space-9);
    margin: 0 0 0 var(--cds-global-space-5);
    padding: 0;
  }
`;

/**
 * The select control for a datagrid's `clrDgSelectionType` arg.
 *
 * ```ts
 * argTypes: {
 *   clrDgSelectionType: selectionTypeArgType,
 * }
 * ```
 */
export const selectionTypeArgType: ArgTypes[string] = {
  control: { type: 'select' },
  // Legacy label -> value object; `InputType` types `options` as an array, hence the cast.
  options: {
    None: SelectionType.None,
    Single: SelectionType.Single,
    Multi: SelectionType.Multi,
  } as unknown as SelectionType[],
};
