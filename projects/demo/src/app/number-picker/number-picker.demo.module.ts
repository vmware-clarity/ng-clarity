/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { NumberPickerDemoComponent } from './number-picker.demo.component';
import { ROUTING } from './number-picker.demo.routing';

@NgModule({
  declarations: [NumberPickerDemoComponent],
  imports: [CommonModule, ClarityModule, FormsModule, ReactiveFormsModule, ROUTING],
})
export class NumberPickerDemoModule {}
