/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ClrIfOpen } from './if-open.directive';
import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverContent } from './popover-content';
import { ClrPopoverOpenCloseButton } from './popover-open-close-button';
import { ClrPopoverOrigin } from './popover-origin';

@NgModule({
  imports: [ClrPopoverContent, ClrIfOpen],
  declarations: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton],
  exports: [ClrPopoverOrigin, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent, ClrIfOpen],
})
export class ClrPopoverModuleNext {}
