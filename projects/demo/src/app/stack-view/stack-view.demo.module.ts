/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { StackViewAngularBasicDemo } from './stack-view-angular-basic';
import { StackViewDemo } from './stack-view.demo';
import { ROUTING } from './stack-view.demo.routing';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [StackViewDemo, StackViewAngularBasicDemo],
  exports: [StackViewDemo, StackViewAngularBasicDemo],
})
export class StackViewDemoModule {}
