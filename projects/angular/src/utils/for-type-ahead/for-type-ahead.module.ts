/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClrForTypeAhead } from './for-type-ahead';
@NgModule({
  imports: [CommonModule],
  declarations: [ClrForTypeAhead],
  exports: [ClrForTypeAhead],
})
export class ClrForTypeAheadModule {}
