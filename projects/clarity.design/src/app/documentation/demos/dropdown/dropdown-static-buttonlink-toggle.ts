/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="dropdown open">
  <button class="dropdown-toggle btn btn-link">
    Dropdown Toggle
    <cds-icon shape="angle" direction="down"></cds-icon>
  </button>
  <div class="dropdown-menu" role="menu">
    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
    <div aria-label="Dropdown header Lorem" class="dropdown-item" role="menuitem">Lorem.</div>
    <div aria-label="Dropdown header Lorem ipsum" class="dropdown-item" role="menuitem">
      Lorem ipsum.
    </div>
    <div aria-label="Dropdown header Lorem ipsum dolor" class="dropdown-item" role="menuitem">
      Lorem ipsum dolor.
    </div>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <div class="dropdown-item" role="menuitem">Link</div>
  </div>
</div>
`;

@Component({
  selector: 'clr-dropdown-static-buttonlink-toggle-demo',
  styleUrl: './dropdown.demo.scss',
  templateUrl: './dropdown-static-buttonlink-toggle.demo.html',
  standalone: false,
})
export class DropdownStaticButtonLinkToggleDemo {
  example = EXAMPLE;
}
