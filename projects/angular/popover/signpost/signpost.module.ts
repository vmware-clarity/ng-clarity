/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ClarityIcons, ClrIcon, infoCircleIcon, windowCloseIcon } from '@clr/angular/icon';
import { ClrIfOpen, ÇlrClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrFocusOnViewInitModule } from '@clr/angular/utils';

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
  imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, ÇlrClrPopoverModuleNext, ClrIfOpen],
  declarations: [CLR_SIGNPOST_DIRECTIVES],
  exports: [CLR_SIGNPOST_DIRECTIVES, ClrIfOpen],
})
export class ClrSignpostModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
  }
}
