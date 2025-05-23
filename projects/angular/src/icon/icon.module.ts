/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { CdsIconCustomTag, ClrIconCustomTag } from './icon';

export const CLR_ICON_DIRECTIVES: Type<any>[] = [ClrIconCustomTag, CdsIconCustomTag];

@NgModule({
  imports: [CommonModule],
  declarations: [CLR_ICON_DIRECTIVES],
  exports: [CLR_ICON_DIRECTIVES],
})
export class ClrIconModule {}
