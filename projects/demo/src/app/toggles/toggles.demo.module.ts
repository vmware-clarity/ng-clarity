/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { TogglesDemo } from './toggles.demo';
import { ROUTING } from './toggles.demo.routing';

@NgModule({
  imports: [CommonModule, ClarityModule, FormsModule, ROUTING],
  declarations: [TogglesDemo],
  exports: [TogglesDemo],
})
export class TogglesDemoModule {}
