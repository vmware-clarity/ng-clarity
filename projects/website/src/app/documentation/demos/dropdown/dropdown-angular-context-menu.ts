/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import {
  ClrDropdown,
  ClrDropdownModule,
  ClrIcon,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-dropdown #contextDropdown>
  <div class="context-menu-area" (contextmenu)="onContextMenu($event)">
    <span>Right-click here to open context menu</span>
  </div>
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
      </clr-dropdown-menu>
    </clr-dropdown>
    <div class="dropdown-divider" role="separator"></div>
    <button type="button" clrDropdownItem>Delete</button>
  </clr-dropdown-menu>
</clr-dropdown>
`;

const EXAMPLE_TS = `
import { Component, ViewChild } from '@angular/core';
import { ClrDropdown, ClrDropdownModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrDropdownModule],
})
export class ExampleComponent {
  @ViewChild('contextDropdown', { static: true }) dropdown: ClrDropdown;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
  }
}
`;

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
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIcon,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
  ],
})
export class DropdownAngularContextMenuDemo {
  @ViewChild('contextDropdown', { static: true }) dropdown: ClrDropdown;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.dropdown.openAtPoint({ x: event.clientX, y: event.clientY }, event.target as HTMLElement);
  }
}
