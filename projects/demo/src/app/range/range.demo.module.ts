/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { RangeDemo } from './range.demo';
import { ROUTING } from './range.demo.routing';

@NgModule({
  imports: [ClarityModule, FormsModule, ReactiveFormsModule, ROUTING],
  declarations: [RangeDemo],
  exports: [RangeDemo],
})
export class RangeDemoModule {}
