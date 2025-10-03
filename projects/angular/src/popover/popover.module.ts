/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { PopoverDirective } from './common/popover.directive';
import { ClrDropdownModule } from './dropdown';
import { ClrSignpostModule } from './signpost';
import { ClrTooltipModule } from './tooltip';

@NgModule({
  declarations: [PopoverDirective],
  exports: [PopoverDirective, ClrDropdownModule, ClrSignpostModule, ClrTooltipModule],
})
export class ClrPopoverModule {}
