/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrContext } from './context.directive';

/** The directives {@link ClrContextModule} declares and exports. */
export const CLR_CONTEXT_DIRECTIVES: Type<any>[] = [ClrContext];

@NgModule({
  imports: [CommonModule],
  declarations: [CLR_CONTEXT_DIRECTIVES],
  exports: [CLR_CONTEXT_DIRECTIVES],
})
/** Declares the `clrContext` directive for applications that use NgModules. */
export class ClrContextModule {}
