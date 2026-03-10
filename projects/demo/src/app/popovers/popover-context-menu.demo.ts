/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';

@Component({
  selector: 'clr-popover-context-menu-demo',
  standalone: true,
  imports: [ÇlrClrPopoverModuleNext],
  providers: [ClrPopoverService],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Popover Context Menu (Point-based Positioning)</h4>
    <p>Right-click anywhere in the box below to open a popover at the cursor position.</p>
    <div class="context-menu-area" (contextmenu)="onContextMenu($event)">
      <span>Right-click here</span>
      <div
        class="popover-content"
        role="menu"
        *clrPopoverContent="
          contextMenuOpen;
          at: 'bottom-left';
          outsideClickToClose: true;
          scrollToClose: true;
          origin: contextMenuPoint
        "
      >
        <button type="button" class="btn btn-sm btn-link" clrPopoverCloseButton>Action 1</button>
        <button type="button" class="btn btn-sm btn-link" clrPopoverCloseButton>Action 2</button>
        <button type="button" class="btn btn-sm btn-link" clrPopoverCloseButton>Action 3</button>
      </div>
    </div>
  `,
})
export class PopoverContextMenuDemo {
  contextMenuOpen = false;
  contextMenuPoint: { x: number; y: number } | null = null;

  constructor(private popoverService: ClrPopoverService) {}

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPoint = { x: event.clientX, y: event.clientY };
    this.popoverService.openAtPoint(this.contextMenuPoint, event);
  }
}
