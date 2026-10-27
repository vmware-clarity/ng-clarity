/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrIcon,
  ClrPopoverModuleNext,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrSelectModule,
} from '@clr/angular';

@Component({
  selector: 'clr-popover-positions-example',
  templateUrl: './positions.example.html',
  styleUrl: './positions.example.scss',
  providers: [ClrPopoverService],
  imports: [CdkTrapFocus, FormsModule, ClrIcon, ClrPopoverModuleNext, ClrSelectModule],
})
export class PopoverPositionsExample {
  open = false;
  selectedPosition = ClrPopoverPosition.BOTTOM_LEFT;
  positions = Object.values(ClrPopoverPosition);
}
