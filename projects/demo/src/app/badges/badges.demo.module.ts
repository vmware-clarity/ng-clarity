/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { BadgeColorsDemo } from './badge-colors';
import { BadgeStatusesDemo } from './badge-statuses';
import { BadgesDemo } from './badges.demo';
import { ROUTING } from './badges.demo.routing';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [BadgesDemo, BadgeColorsDemo, BadgeStatusesDemo],
  exports: [BadgesDemo, BadgeColorsDemo, BadgeStatusesDemo],
})
export class BadgesDemoModule {}
