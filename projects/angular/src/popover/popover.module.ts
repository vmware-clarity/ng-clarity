/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from '@angular/core';

import { PopoverDirective } from './common/popover.directive';
import { ClrDropdownModule } from './dropdown/dropdown.module';
import { ClrOverlayPanelModule } from './overlay-panel/overlay-panel.module';
import { ClrSignpostModule } from './signpost/signpost.module';
import { ClrTooltipModule } from './tooltip/tooltip.module';

@NgModule({
  declarations: [PopoverDirective],
  exports: [PopoverDirective, ClrDropdownModule, ClrSignpostModule, ClrOverlayPanelModule, ClrTooltipModule],
})
export class ClrPopoverModule {}
