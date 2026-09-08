/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrContext } from './context.directive';

export const CLR_CONTEXTUAL_DIRECTIVES: any[] = [ClrContext];

@NgModule({
  imports: [CommonModule],
  declarations: [CLR_CONTEXTUAL_DIRECTIVES],
  exports: [CLR_CONTEXTUAL_DIRECTIVES],
})
export class ClrContextualModule {}
