/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrCommonFormsModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="dropdown bottom-right open">
  <button class="dropdown-toggle btn btn-primary">
    Dropdown
    <clr-icon shape="angle" direction="down"></clr-icon>
  </button>
  <div class="dropdown-menu" role="menu">
    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
    <div class="dropdown-item active" role="menuitem">First Action</div>
    <div class="dropdown-item disabled" role="menuitem" aria-disabled="true">Disabled Action</div>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <div class="dropdown-item">Link 1</div>
    <div class="dropdown-item">Link 2</div>
  </div>
</div>
`;

@Component({
  selector: 'clr-dropdown-static-positioning-demo',
  styleUrl: './dropdown.demo.scss',
  templateUrl: './dropdown-static-positioning.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrCommonFormsModule, StackblitzExampleComponent],
})
export class DropdownStaticPositioningDemo {
  example = EXAMPLE;
}
