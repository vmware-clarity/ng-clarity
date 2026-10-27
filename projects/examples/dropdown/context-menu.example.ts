/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrDropdown, ClrDropdownModule } from '@clr/angular';

@Component({
  selector: 'clr-dropdown-context-menu-example',
  templateUrl: './context-menu.example.html',
  styleUrl: './context-menu.example.scss',
  imports: [ClrDropdownModule],
})
export class DropdownContextMenuExample {
  @ViewChild('contextDropdown', { static: true }) dropdown: ClrDropdown;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
  }
}
