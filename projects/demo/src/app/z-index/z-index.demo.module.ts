/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { ZIndexCustomFilter } from './custom-filter.demo';
import { ZIndexVariousContent } from './various-content/various-content';
import { ZIndexDemo } from './z-index.demo';
import { ROUTING } from './z-index.routing';

@NgModule({
  imports: [CommonModule, FormsModule, ClarityModule, ROUTING, CdkScrollable],
  declarations: [ZIndexDemo, ZIndexVariousContent, ZIndexCustomFilter],
  exports: [ZIndexDemo],
})
export class ZIndexDemoModule {}
