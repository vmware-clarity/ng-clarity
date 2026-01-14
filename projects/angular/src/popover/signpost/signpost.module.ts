/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrSignpost } from './signpost';
import { ClrSignpostContent } from './signpost-content';
import { ClrSignpostTitle } from './signpost-title';
import { ClrSignpostTrigger } from './signpost-trigger';
import { ClarityIcons, ClrIcon, infoCircleIcon, windowCloseIcon } from '../../icon';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrFocusOnViewInitModule } from '../../utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrPopoverModuleNext } from '../common/popover.module';

export const CLR_SIGNPOST_DIRECTIVES: Type<any>[] = [
  ClrSignpost,
  ClrSignpostContent,
  ClrSignpostTrigger,
  ClrSignpostTitle,
];

@NgModule({
  imports: [CommonModule, ClrIcon, ClrFocusOnViewInitModule, ClrPopoverModuleNext],
  declarations: [CLR_SIGNPOST_DIRECTIVES],
  exports: [CLR_SIGNPOST_DIRECTIVES, ClrConditionalModule],
})
export class ClrSignpostModule {
  constructor() {
    ClarityIcons.addIcons(windowCloseIcon, infoCircleIcon);
  }
}
