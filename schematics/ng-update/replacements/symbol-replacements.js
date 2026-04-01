"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYMBOL_REPLACEMENTS = void 0;
exports.SYMBOL_REPLACEMENTS = [
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
    // #2267 - Popover anchor → origin rename (beta.2)
    { old: 'ClrPopoverAnchor', new: 'ClrPopoverOrigin', context: 'popover-anchor-origin' },
    { old: 'POPOVER_HOST_ANCHOR', new: 'POPOVER_HOST_ORIGIN', context: 'popover-anchor-origin' },
    { old: 'focusAnchor', new: 'focusOrigin', context: 'popover-anchor-origin' },
    { old: 'getAnchorPosition', new: 'getOriginPosition', context: 'popover-anchor-origin' },
    // #2266 - Ç-prefix symbol renames (beta.3)
    // Note: Ç (U+00C7) is not a regex word-boundary character; matching uses lookahead/lookbehind.
    { old: 'ÇlrClrPopoverModuleNext', new: 'ClrPopoverModuleNext', context: 'c-prefix-rename' },
    { old: 'ÇlrClrPopoverCloseButton', new: 'ClrPopoverCloseButton', context: 'c-prefix-rename' },
    { old: 'ÇlrClrPopoverOpenCloseButton', new: 'ClrPopoverOpenCloseButton', context: 'c-prefix-rename' },
    { old: 'ÇlrAccordionWillyWonka', new: 'AccordionWillyWonka', context: 'c-prefix-rename' },
    { old: 'ÇlrAccordionOompaLoompa', new: 'AccordionOompaLoompa', context: 'c-prefix-rename' },
    { old: 'ÇlrStepperWillyWonka', new: 'StepperWillyWonka', context: 'c-prefix-rename' },
    { old: 'ÇlrStepperOompaLoompa', new: 'StepperOompaLoompa', context: 'c-prefix-rename' },
    { old: 'ÇlrTabsWillyWonka', new: 'TabsWillyWonka', context: 'c-prefix-rename' },
    { old: 'ÇlrActiveOompaLoompa', new: 'ActiveOompaLoompa', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridVirtualScrollDirective', new: 'ClrDatagridVirtualScrollDirective', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridSelectionCellDirective', new: 'ClrDatagridSelectionCellDirective', context: 'c-prefix-rename' },
    {
        old: 'ÇlrDatagridSingleSelectionValueAccessor',
        new: 'ClrDatagridSingleSelectionValueAccessor',
        context: 'c-prefix-rename',
    },
    { old: 'ÇlrDatagridWillyWonka', new: 'DatagridWillyWonka', context: 'c-prefix-rename' },
    { old: 'ÇlrActionableOompaLoompa', new: 'ActionableOompaLoompa', context: 'c-prefix-rename' },
    { old: 'ÇlrExpandableOompaLoompa', new: 'ExpandableOompaLoompa', context: 'c-prefix-rename' },
    { old: 'ÇlrWrappedCell', new: 'WrappedCell', context: 'c-prefix-rename' },
    { old: 'ÇlrWrappedColumn', new: 'WrappedColumn', context: 'c-prefix-rename' },
    { old: 'ÇlrWrappedRow', new: 'WrappedRow', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridCellRenderer', new: 'DatagridCellRenderer', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridHeaderRenderer', new: 'DatagridHeaderRenderer', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridMainRenderer', new: 'DatagridMainRenderer', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridRowRenderer', new: 'DatagridRowRenderer', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridRowDetailRenderer', new: 'DatagridRowDetailRenderer', context: 'c-prefix-rename' },
    { old: 'ÇlrDatagridDetailRegisterer', new: 'DatagridDetailRegisterer', context: 'c-prefix-rename' },
];
//# sourceMappingURL=symbol-replacements.js.map