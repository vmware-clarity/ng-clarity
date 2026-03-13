/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrDropdown } from '@clr/angular';

@Component({
  selector: 'clr-dropdown-context-menu-demo',
  standalone: true,
  imports: [ClarityModule],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Dropdown Context Menu (Point-based Positioning)</h4>
    <p>Right-click anywhere in the box below to open a dropdown menu at the cursor position.</p>
    <div class="context-menu-area" (contextmenu)="onContextMenu($event)">
      <span>Right-click here</span>
    </div>
    <clr-dropdown #contextDropdown>
      <clr-dropdown-menu>
        <button type="button" clrDropdownItem>Cut</button>
        <button type="button" clrDropdownItem>Copy</button>
        <button type="button" clrDropdownItem>Paste</button>
        <div class="dropdown-divider" role="separator"></div>
        <clr-dropdown>
          <button type="button" clrDropdownTrigger>Share</button>
          <clr-dropdown-menu>
            <button type="button" clrDropdownItem>Email</button>
            <button type="button" clrDropdownItem>Slack</button>
            <clr-dropdown>
              <button type="button" clrDropdownTrigger>Social</button>
              <clr-dropdown-menu>
                <button type="button" clrDropdownItem>Twitter</button>
                <button type="button" clrDropdownItem>LinkedIn</button>
              </clr-dropdown-menu>
            </clr-dropdown>
          </clr-dropdown-menu>
        </clr-dropdown>
        <div class="dropdown-divider" role="separator"></div>
        <button type="button" clrDropdownItem>Delete</button>
        <button type="button" clrDropdownItem [clrDisabled]="true">Locked Action</button>
        <div class="dropdown-divider" role="separator"></div>
        <button type="button" clrDropdownItem>Properties</button>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
})
export class DropdownContextMenuDemo {
  @ViewChild('contextDropdown', { static: true }) dropdown: ClrDropdown;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY });
  }
}
