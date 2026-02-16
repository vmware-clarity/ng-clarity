/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="dropdown open">
  <button class="dropdown-toggle btn btn-primary" type="button">
    Dropdown
    <cds-icon shape="angle" direction="down"></cds-icon>
  </button>
  <div class="dropdown-menu" role="menu">
    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
    <div class="dropdown-item active" role="menuitem">Action</div>
    <div class="dropdown-item disabled" role="menuitem" aria-disabled="true">Disabled Link</div>
    <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
    <button class="dropdown-item" role="menuitem">Lorem.</button>
    <div class="dropdown open right-bottom">
      <button
        class="dropdown-item active expandable"
        role="menuitem"
        aria-expanded="true"
        aria-haspopup="menu"
      >
        Lorem ipsum.
      </button>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-item" role="menuitem">Foo.</div>
        <div class="dropdown open right-top">
          <button
            class="dropdown-item active expandable"
            role="menuitem"
            aria-expanded="true"
            aria-haspopup="menu"
          >
            Bar.
          </button>
          <div class="dropdown-menu" role="menu">
            <div class="dropdown-item" role="menuitem">Baz.</div>
          </div>
        </div>
        <div class="dropdown-item" role="menuitem">Foo 2.</div>
      </div>
    </div>
    <button class="dropdown-item" role="menuitem">Ipsum.</button>
  </div>
</div>
`;

@Component({
  selector: 'clr-dropdown-static-default-demo',
  styleUrl: './dropdown.demo.scss',
  templateUrl: './dropdown-static-default.demo.html',
  standalone: false,
})
export class DropdownStaticDefaultDemo {
  example = HTML_EXAMPLE;
}
