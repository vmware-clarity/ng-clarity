/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrProgressBar } from './progress-bar';

export const CLR_PROGRESS_BAR_DIRECTIVES: Type<any>[] = [ClrProgressBar];

@NgModule({
  imports: [CommonModule],
  declarations: [CLR_PROGRESS_BAR_DIRECTIVES],
  exports: [CLR_PROGRESS_BAR_DIRECTIVES],
})
export class ClrProgressBarModule {}
