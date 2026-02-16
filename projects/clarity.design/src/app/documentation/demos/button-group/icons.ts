/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, cloudIcon, cogIcon, ellipsisHorizontalIcon, homeIcon, userIcon } from '@cds/core/icon';

const HTML_EXAMPLE = `
<div class="btn-group btn-primary btn-icon">
  <button class="btn">
    <cds-icon shape="home"></cds-icon>
    <span class="clr-icon-title">Home</span>
  </button>
  <button class="btn">
    <cds-icon shape="cog"></cds-icon>
    <span class="clr-icon-title">Settings</span>
  </button>
  <div class="btn-group-overflow open">
    <button class="btn dropdown-toggle">
      <cds-icon shape="ellipsis-horizontal"></cds-icon>
    </button>
    <div class="dropdown-menu" role="menu">
      <button class="btn" role="menuitem">
        <cds-icon shape="user"></cds-icon>
        <span class="clr-icon-title">User</span>
      </button>
      <button class="btn" role="menuitem">
        <cds-icon shape="cloud"></cds-icon>
        <span class="clr-icon-title">Cloud</span>
      </button>
    </div>
  </div>
</div>
`;

const HTML_EXAMPLE_2 = `
<div class="btn-group btn-primary">
  <button class="btn">
    <cds-icon shape="home"></cds-icon>
    Home
  </button>
  <button class="btn">
    <cds-icon shape="cog"></cds-icon>
    Settings
  </button>
  <div class="btn-group-overflow open">
    <button class="btn dropdown-toggle">
      <cds-icon shape="ellipsis-horizontal"></cds-icon>
    </button>
    <div class="dropdown-menu" role="menu">
      <button class="btn" role="menuitem">
        <cds-icon shape="user"></cds-icon>
        User
      </button>
      <button class="btn" role="menuitem">
        <cds-icon shape="cloud"></cds-icon>
        Cloud
      </button>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-button-group-icons-demo',
  templateUrl: './icons.html',
  standalone: false,
})
export class ButtonGroupIconsDemo {
  htmlExample = HTML_EXAMPLE;
  htmlExample2 = HTML_EXAMPLE_2;

  constructor() {
    ClarityIcons.addIcons(homeIcon, cogIcon, ellipsisHorizontalIcon, userIcon, cloudIcon);
  }
}
