/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * TypeScript symbol renames for v18 migration.
 *
 * These are applied across all .ts files after import path updates.
 */
export interface SymbolReplacement {
  readonly old: string;
  readonly new: string;
  readonly context?: string;
}

export const SYMBOL_REPLACEMENTS: readonly SymbolReplacement[] = [
  // #2023 - ClrLabel → ClrControlLabel (form directive)
  { old: 'ClrLabel', new: 'ClrControlLabel', context: 'form-label-directive' },

  // #2007 - clrDgItemsTrackBy → clrDgItemsIdentityFn
  { old: 'clrDgItemsTrackBy', new: 'clrDgItemsIdentityFn', context: 'datagrid' },

  // #2107 - FocusService → FormsFocusService
  { old: 'FocusService', new: 'FormsFocusService', context: 'forms' },

  // #2062 - Removed popover services/enums/interfaces
  { old: 'ClrPopoverEventsService', new: 'ClrPopoverService', context: 'popover-removed' },
  { old: 'ClrPopoverPositionService', new: 'ClrPopoverService', context: 'popover-removed' },
  { old: 'ClrPopoverToggleService', new: 'ClrPopoverService', context: 'popover-removed' },

  // #2101 - ClrIconModule → ClrIcon (standalone)
  { old: 'ClrIconModule', new: 'ClrIcon', context: 'icon-standalone' },

  // #2207 - Accordion/Stepper decoupling
  { old: 'AccordionPanelModel', new: 'CollapsiblePanelModel', context: 'accordion-stepper-decoupling' },
  { old: 'AccordionStatus', new: 'StepperPanelStatus', context: 'accordion-stepper-decoupling' },
  { old: 'panelAnimation', new: 'collapsiblePanelAnimation', context: 'accordion-stepper-decoupling' },
  { old: 'getAccordionContentId', new: 'getContentId', context: 'accordion-stepper-decoupling' },
  { old: 'getAccordionHeaderId', new: 'getHeaderId', context: 'accordion-stepper-decoupling' },

  // #2228 - IE11 removals
  { old: 'IEKeys', new: '', context: 'ie-removal' },
  { old: 'normalizeKey', new: '', context: 'ie-removal' },
];
