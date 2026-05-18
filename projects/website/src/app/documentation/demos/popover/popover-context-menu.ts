/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { ClrIcon, ClrPopoverContent, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML = `
<div class="context-menu-area" (contextmenu)="onContextMenu($event)">
  <span>Right-click here to open context menu</span>
</div>
<div role="dialog" cdkTrapFocus *clrPopoverContent="open; at: 'bottom-left'; outsideClickToClose: true">
  <h4 style="margin-top: 0">Context Menu</h4>
  <p>Opened at point ({{ clickX }}, {{ clickY }}).</p>
  <button class="btn btn-sm btn-outline" clrPopoverCloseButton>Close</button>
</div>
`;

const CODE = `
import { Component } from '@angular/core';
import { ClrPopoverService, ClrPopoverModuleNext } from '@clr/angular';

@Component({
  selector: 'app-popover-context-menu',
  templateUrl: './popover-context-menu.component.html',
  providers: [ClrPopoverService],
  imports: [ClrPopoverModuleNext],
})
export class PopoverContextMenuComponent {
  open = false;
  clickX = 0;
  clickY = 0;

  constructor(private popoverService: ClrPopoverService) {}

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
`;

@Component({
  selector: 'clr-popover-context-menu-demo',
  templateUrl: './popover-context-menu.demo.html',
  styleUrl: './popover.demo.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ClrPopoverService],
  styles: [
    `
      .context-menu-area {
        border: 2px dashed var(--cds-alias-object-border-color);
        padding: var(--cds-global-space-9);
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: context-menu;
      }
    `,
  ],
  imports: [ClrPopoverContent, ClrIcon, ClrPopoverModuleNext, StackblitzExampleComponent],
})
export class PopoverContextMenuDemo {
  open = false;
  clickX = 0;
  clickY = 0;

  html = HTML;
  code = CODE;

  constructor(private popoverService: ClrPopoverService) {}

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.clickX = event.clientX;
    this.clickY = event.clientY;
    this.popoverService.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
  }
}
