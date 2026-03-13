/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * HTML template replacements for v18 migration.
 *
 * Covers Angular output renames, attribute binding changes, and selector updates.
 */
export interface TemplateReplacement {
  readonly old: string;
  readonly new: string;
  readonly context?: string;
}

export const TEMPLATE_OUTPUT_REPLACEMENTS: readonly TemplateReplacement[] = [
  // #2249 - Wizard currentPageChanged → currentPageChange
  {
    old: 'clrWizardCurrentPageChanged',
    new: 'clrWizardCurrentPageChange',
    context: 'wizard',
  },
];

export const TEMPLATE_ATTRIBUTE_REPLACEMENTS: readonly TemplateReplacement[] = [
  // #2101 - cds-icon: [attr.shape] → [shape], [attr.size] → [size], etc.
  { old: '[attr.shape]', new: '[shape]', context: 'cds-icon' },
  { old: '[attr.size]', new: '[size]', context: 'cds-icon' },
  { old: '[attr.dir]', new: '[dir]', context: 'cds-icon' },
  { old: '[attr.flip]', new: '[flip]', context: 'cds-icon' },
  { old: '[attr.status]', new: '[status]', context: 'cds-icon' },
  { old: '[attr.inverse]', new: '[inverse]', context: 'cds-icon' },
  { old: '[attr.badge]', new: '[badge]', context: 'cds-icon' },
  { old: '[attr.solid]', new: '[solid]', context: 'cds-icon' },
];

export const TEMPLATE_INPUT_REPLACEMENTS: readonly TemplateReplacement[] = [
  // #2022 - Badge color input rename
  {
    old: 'clrBadgeColor',
    new: 'clrColor',
    context: 'badge',
  },

  // #2007 - Datagrid identity function rename (input, not output)
  {
    old: 'clrDgItemsTrackBy',
    new: 'clrDgItemsIdentityFn',
    context: 'datagrid',
  },
];

export const HEADER_CLASS_REPLACEMENTS: readonly TemplateReplacement[] = [
  // #2180 - Header variant removals
  { old: 'header-4', new: 'header-3' },
  { old: 'header-5', new: 'header-3' },
  { old: 'header-6', new: 'header-1' },
  { old: 'header-7', new: 'header-2' },
];
