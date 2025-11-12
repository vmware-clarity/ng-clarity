/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrAccordionModule } from '../accordion.module';
import { ClrStepButton } from '../stepper/step-button';
import { ClrStepper } from '../stepper/stepper';
import { StepperOompaLoompa } from './chocolate/stepper-oompa-loompa';
import { StepperWillyWonka } from './chocolate/stepper-willy-wonka';
import { ClrStepperPanel } from './stepper-panel';

const declarations = [ClrStepper, ClrStepButton, ClrStepperPanel, StepperOompaLoompa, StepperWillyWonka];

@NgModule({
  imports: [CommonModule, ClrIconModule, ClrAccordionModule],
  declarations: [...declarations],
  exports: [...declarations, ClrAccordionModule, ClrIconModule],
})
export class ClrStepperModule {}
