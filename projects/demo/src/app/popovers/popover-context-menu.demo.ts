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
  styles: [
    `
      .context-menu-area {
        border: 2px dashed var(--cds-alias-object-border-color);
        padding: var(--cds-global-space-9);
        margin: var(--cds-global-space-5) 0;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: context-menu;
      }

      .popover-content {
        background-color: var(--cds-alias-object-container-background);
        border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
        border-radius: var(--cds-alias-object-border-radius-100);
        padding: var(--cds-global-space-5);
        box-shadow: var(--cds-alias-object-shadow-300);
      }
    `,
  ],
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
