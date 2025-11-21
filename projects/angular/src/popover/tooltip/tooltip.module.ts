/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrTooltip } from './tooltip';
import { ClrTooltipContent } from './tooltip-content';
import { ClrTooltipTrigger } from './tooltip-trigger';
import { ClrIcon } from '../../icon';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';

export const CLR_TOOLTIP_DIRECTIVES: Type<any>[] = [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent];

@NgModule({
  imports: [CommonModule, ClrIcon],
  declarations: [CLR_TOOLTIP_DIRECTIVES],
  exports: [CLR_TOOLTIP_DIRECTIVES, ClrConditionalModule, ClrIcon],
})
export class ClrTooltipModule {}
