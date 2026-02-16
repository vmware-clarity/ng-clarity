/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrAccordionModule } from '@clr/angular/accordion';
import { ClrIcon } from '@clr/angular/icon';

import { StepperOompaLoompa } from './chocolate/stepper-oompa-loompa';
import { StepperWillyWonka } from './chocolate/stepper-willy-wonka';
import { ClrStepButton } from './step-button';
import { ClrStepContent } from './step-content';
import { ClrStepDescription } from './step-description';
import { ClrStepTitle } from './step-title';
import { ClrStepper } from './stepper';
import { ClrStepperPanel } from './stepper-panel';

const declarations = [
  ClrStepper,
  ClrStepButton,
  ClrStepTitle,
  ClrStepDescription,
  ClrStepContent,
  ClrStepperPanel,
  StepperOompaLoompa,
  StepperWillyWonka,
];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrAccordionModule],
  declarations: [...declarations],
  exports: [...declarations, ClrAccordionModule, ClrIcon],
})
export class ClrStepperModule {}
