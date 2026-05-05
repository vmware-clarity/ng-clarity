/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrDropdown } from '@clr/angular';

@Component({
  selector: 'clr-dropdown-angular-context-menu-demo',
  templateUrl: './dropdown-angular-context-menu.demo.html',
  styleUrl: './dropdown.demo.scss',
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
  standalone: false,
})
export class DropdownAngularContextMenuDemo {
  @ViewChild('contextDropdown', { static: true }) dropdown: ClrDropdown;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();

    console.log(event);

    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
  }
}
