/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { ClrPopoverAnchor } from './popover-anchor';
import { ClrPopoverCloseButton } from './popover-close-button';
import { ClrPopoverOpenCloseButton } from './popover-open-close-button';
import { ClrPopoverContent } from '../common/popover-content';

@NgModule({
  imports: [ClrPopoverContent],
  declarations: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton],
  exports: [ClrPopoverAnchor, ClrPopoverCloseButton, ClrPopoverOpenCloseButton, ClrPopoverContent],
})
export class ClrPopoverModuleNext {}
