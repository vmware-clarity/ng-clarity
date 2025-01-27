/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { DatalistDemo } from './datalist.demo';
import { ROUTING } from './datalist.demo.routing';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClarityModule, ROUTING],
  declarations: [DatalistDemo],
})
export class DatalistDemoModule {}
