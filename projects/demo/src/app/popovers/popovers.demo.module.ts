/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';

import { PopoversDemo } from './popovers.demo';
import { ROUTING } from './popovers.demo.routing';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    CdkTrapFocus,
    ÇlrClrPopoverModuleNext,
    ROUTING,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ClrPopoverService],
  declarations: [PopoversDemo],
  exports: [PopoversDemo],
})
export class PopoversDemoModule {}
