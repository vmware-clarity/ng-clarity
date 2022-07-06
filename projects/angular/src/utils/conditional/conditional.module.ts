/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIfActive } from './if-active.directive';
import { ClrIfExpanded } from './if-expanded.directive';
import { ClrIfOpen } from './if-open.directive';

export const CONDITIONAL_DIRECTIVES: Type<any>[] = [ClrIfActive, ClrIfOpen, ClrIfExpanded];

@NgModule({
  imports: [CommonModule],
  declarations: [CONDITIONAL_DIRECTIVES],
  exports: [CONDITIONAL_DIRECTIVES],
})
export class ClrConditionalModule {}
