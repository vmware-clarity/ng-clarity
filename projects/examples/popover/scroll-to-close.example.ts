/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ClrIcon, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

@Component({
  selector: 'clr-popover-scroll-to-close-example',
  templateUrl: './scroll-to-close.example.html',
  styleUrl: './scroll-to-close.example.scss',
  providers: [ClrPopoverService],
  imports: [CdkTrapFocus, ClrIcon, ClrPopoverModuleNext],
})
export class PopoverScrollToCloseExample {
  open = false;
}
