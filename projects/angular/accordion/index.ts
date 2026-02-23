/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * BREAKING CHANGE (v17):
 * The following symbols were removed from this entry point. They have been
 * replaced by their `CollapsiblePanel*` equivalents in `@clr/angular/collapsible-panel`:
 *
 *   AccordionService        -> CollapsiblePanelService
 *   AccordionStatus         -> StepperPanelStatus   (moved to `@clr/angular/stepper`)
 *   AccordionStrategy       -> CollapsiblePanelStrategy
 *   AccordionPanelModel     -> CollapsiblePanelModel
 *   AccordionModel          -> CollapsiblePanelGroupModel
 *   panelAnimation          -> collapsiblePanelExpandAnimation / collapsiblePanelAnimation
 */

export * from './accordion';
export * from './accordion-panel';
export * from './accordion-title';
export * from './accordion-content';
export * from './accordion-description';
export * from './accordion.module';

export { AccordionWillyWonka as ÇlrAccordionWillyWonka } from './chocolate/accordion-willy-wonka';
export { AccordionOompaLoompa as ÇlrAccordionOompaLoompa } from './chocolate/accordion-oompa-loompa';
