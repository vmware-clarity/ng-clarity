/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ContextualDemo } from './contextual.demo';
import { ROUTING } from './contextual.demo.routing';

@NgModule({
  imports: [ROUTING],
  declarations: [ContextualDemo],
  exports: [ContextualDemo],
})
export class ContextualDemoModule {}
