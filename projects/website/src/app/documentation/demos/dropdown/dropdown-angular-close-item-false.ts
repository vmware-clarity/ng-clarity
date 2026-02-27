/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrCommonFormsModule,
  ClrDropdownModule,
  ClrIcon,
  ClrIconModule,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<clr-dropdown [clrCloseMenuOnItemClick]="false">
  <button clrDropdownTrigger aria-label="Dropdown demo button">
    <clr-icon shape="exclamation-circle" class="is-error" size="24"></clr-icon>
    <clr-icon shape="angle" direction="down"></clr-icon>
  </button>
  <clr-dropdown-menu *clrIfOpen>
    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
    <div aria-label="Dropdown header Action 1" clrDropdownItem>Action 1</div>
    <div aria-label="Dropdown header Action 2" clrDropdownItem>Action 2</div>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <div clrDropdownItem>Link 1</div>
    <div clrDropdownItem>Link 2</div>
  </clr-dropdown-menu>
</clr-dropdown>
`;

@Component({
  selector: 'clr-dropdown-angular-close-item-false-demo',
  templateUrl: './dropdown-angular-close-item-false.demo.html',
  styleUrl: './dropdown.demo.scss',
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIcon,
    ClrIconModule,
    ClrIfOpen,
    ClrPopoverContent,
    ClrCommonFormsModule,
    StackblitzExampleComponent,
  ],
})
export class DropdownAngularCloseItemFalseDemo {
  htmlExample = HTML_EXAMPLE;
}
