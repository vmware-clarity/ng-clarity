/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ellipsisHorizontalIcon } from '@cds/core/icon';

const HTML_EXAMPLE_1 = `
<div class="btn-group btn-primary">
  <button class="btn">Add</button>
  <button class="btn">Edit</button>
  <button class="btn">Download</button>
  <button class="btn">Delete</button>
</div>
`;

const HTML_EXAMPLE_2 = `
<div class="btn-group btn-primary">
  <button class="btn">Add</button>
  <button class="btn">Edit</button>
  <div class="btn-group-overflow open">
    <button class="btn dropdown-toggle">
      <cds-icon shape="ellipsis-horizontal"></cds-icon>
    </button>
    <div class="dropdown-menu" role="menu">
      <button class="btn" role="menuitem">Download</button>
      <button class="btn" role="menuitem">Delete</button>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-button-group-basic-structure-demo',
  templateUrl: './basic-structure.html',
  standalone: false,
})
export class ButtonGroupBasicStructureDemo {
  htmlExample1 = HTML_EXAMPLE_1;
  htmlExample2 = HTML_EXAMPLE_2;

  constructor() {
    ClarityIcons.addIcons(ellipsisHorizontalIcon);
  }
}
