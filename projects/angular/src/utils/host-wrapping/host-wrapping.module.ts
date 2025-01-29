/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { EmptyAnchor } from './empty-anchor';

/**
 * Internal module, please do not export!
 */
@NgModule({
  declarations: [EmptyAnchor],
  exports: [EmptyAnchor],
})
export class ClrHostWrappingModule {}
