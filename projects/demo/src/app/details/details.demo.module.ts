/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DetailsDemo } from './details.demo';
import { ROUTING } from './details.demo.routing';

@NgModule({
  imports: [CommonModule, ROUTING],
  declarations: [DetailsDemo],
})
export class DetailsDemoModule {}
