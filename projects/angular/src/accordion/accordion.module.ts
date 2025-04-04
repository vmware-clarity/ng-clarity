/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { angleIcon, checkCircleIcon, ClarityIcons, exclamationCircleIcon } from '@cds/core/icon';

import { ClrIconModule } from '../icon/icon.module';
import { ClrAccordion } from './accordion';
import { ClrAccordionContent } from './accordion-content';
import { ClrAccordionDescription } from './accordion-description';
import { ClrAccordionPanel } from './accordion-panel';
import { ClrAccordionTitle } from './accordion-title';
import { AccordionOompaLoompa } from './chocolate/accordion-oompa-loompa';
import { AccordionWillyWonka } from './chocolate/accordion-willy-wonka';

const declarations = [
  ClrAccordion,
  ClrAccordionPanel,
  ClrAccordionTitle,
  ClrAccordionDescription,
  ClrAccordionContent,
  AccordionOompaLoompa,
  AccordionWillyWonka,
];

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [...declarations],
  exports: [...declarations],
})
export class ClrAccordionModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon, exclamationCircleIcon, checkCircleIcon);
  }
}
