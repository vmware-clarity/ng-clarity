/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, ClrIcon, infoCircleIcon, windowCloseIcon } from '@clr/angular/src/icon';
import { ClrConditionalModule, ClrFocusOnViewInitModule } from '@clr/angular/src/utils';

import { ClrSignpost } from './signpost';
import { ClrSignpostContent } from './signpost-content';
import { ClrSignpostTitle } from './signpost-title';
import { ClrSignpostTrigger } from './signpost-trigger';

export const CLR_SIGNPOST_DIRECTIVES: Type<any>[] = [
  ClrSignpost,
  ClrSignpostContent,
  ClrSignpostTrigger,
  ClrSignpostTitle,
];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule],
  declarations: [CLR_SIGNPOST_DIRECTIVES],
  exports: [CLR_SIGNPOST_DIRECTIVES, ClrConditionalModule],
})
export class ClrSignpostModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
  }
}
