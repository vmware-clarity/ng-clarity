/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { angleIcon, ClarityIcons } from '@cds/core/icon';

const HTML_EXAMPLE = `
<div class="clr-row">
  <div class="clr-col-lg-6 clr-col-12">
    <div class="card">
      <div class="card-header">Header</div>
      <div class="card-block">
        <div class="card-title">Block</div>
        <div class="card-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias officiis temporibus quod
          inventore, minus commodi similique corrupti repellat saepe facere aliquam minima deserunt esse
          nemo, vel illum optio necessitatibus deleniti.
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-link">Action 1</button>
        <button class="btn btn-sm btn-link">Action 2</button>
        <div class="dropdown top-left open">
          <button class="dropdown-toggle btn btn-sm btn-link">
            Dropdown 1
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <div class="dropdown-menu" role="menu">
            <a href="javascript://" class="dropdown-item" role="menuitem">Item 1</a>
            <a href="javascript://" class="dropdown-item" role="menuitem">Item 2</a>
            <a href="javascript://" class="dropdown-item" role="menuitem">Item 3</a>
            <a href="javascript://" class="dropdown-item" role="menuitem">Item 4</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-card-dropdown-demo',
  styleUrl: './card.demo.scss',
  templateUrl: './card-dropdown.html',
  standalone: false,
})
export class CardDropdownDemo {
  htmlExample = HTML_EXAMPLE;

  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}
