/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Component, inject } from '@angular/core';
import { ClrIcon, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

@Component({
  selector: 'clr-popover-context-menu-example',
  templateUrl: './context-menu.example.html',
  styleUrl: './context-menu.example.scss',
  providers: [ClrPopoverService],
  imports: [CdkTrapFocus, ClrIcon, ClrPopoverModuleNext],
})
export class PopoverContextMenuExample {
  open = false;
  clickX = 0;
  clickY = 0;

  private readonly popoverService = inject(ClrPopoverService);

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.clickX = event.clientX;
    this.clickY = event.clientY;
    this.popoverService.openAtPoint(
      { x: event.clientX, y: event.clientY },
      event.target as HTMLElement
    );
  }
}
