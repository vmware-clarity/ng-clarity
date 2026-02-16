/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="dropdown bottom-left open">
  <button class="dropdown-toggle">
    <cds-icon shape="exclamation-circle" class="is-error" size="24"></cds-icon>
    <cds-icon shape="angle" direction="down"></cds-icon>
  </button>
  <div class="dropdown-menu" role="menu">
    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
    <div class="dropdown-item" role="menuitem">Lorem.</div>
    <div class="dropdown-item" role="menuitem">Lorem ipsum.</div>
    <div class="dropdown-item" role="menuitem">Lorem ipsum dolor.</div>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <div class="dropdown-item" role="menuitem">Action 1</div>
  </div>
</div>
`;

@Component({
  selector: 'clr-dropdown-static-icon-toggle-demo',
  styleUrl: './dropdown.demo.scss',
  templateUrl: './dropdown-static-icon-toggle.demo.html',
  standalone: false,
})
export class DropdownStaticIconToggleDemo {
  example = EXAMPLE;
}
