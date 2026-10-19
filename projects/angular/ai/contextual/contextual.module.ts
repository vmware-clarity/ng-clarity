/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule, Type } from '@angular/core';

import { ClrContext } from './context';

/** The standalone directives {@link ClrContextModule} imports and exports. */
export const CLR_CONTEXT_DIRECTIVES: Type<any>[] = [ClrContext];

/** Makes the standalone `clrContext` directive available to NgModule applications. */
@NgModule({
  imports: [CLR_CONTEXT_DIRECTIVES],
  exports: [CLR_CONTEXT_DIRECTIVES],
})
export class ClrContextModule {}
