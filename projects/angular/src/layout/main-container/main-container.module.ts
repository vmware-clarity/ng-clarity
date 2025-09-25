/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrMainContainer } from './main-container';
import { ClrIconModule } from '../../icon/icon.module';

export const CLR_LAYOUT_DIRECTIVES: Type<any>[] = [ClrMainContainer];

@NgModule({
  imports: [CommonModule, ClrIconModule],
  declarations: [CLR_LAYOUT_DIRECTIVES],
  exports: [CLR_LAYOUT_DIRECTIVES],
})
export class ClrMainContainerModule {}
