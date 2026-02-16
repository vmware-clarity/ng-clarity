/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

const EXAMPLE = `
<div class="main-container">
  <header class="header header-6">
    <div class="branding">
      <a href="javascript:void(0)">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <form class="search">
      <label for="search-input-sidenav-ng">
        <input id="search-input-sidenav-ng" type="text" placeholder="Search for keywords..." />
      </label>
    </form>
    <div class="settings">
      <a href="javascript://" class="nav-link nav-icon">
        <cds-icon shape="cog"></cds-icon>
      </a>
    </div>
  </header>
  <div class="content-container">
    <div class="content-area">
      <p>...</p>
    </div>
    <clr-vertical-nav>
      <a clrVerticalNavLink>Link 1</a>
      <a clrVerticalNavLink>Link 2</a>
      <a clrVerticalNavLink class="active">Link 3</a>
      <a clrVerticalNavLink>Link 4</a>
      <a clrVerticalNavLink>Link 5</a>
      <a clrVerticalNavLink>Link 6</a>
    </clr-vertical-nav>
  </div>
</div>
`;

@Component({
  selector: 'clr-layout-only-vertical-nav-primary',
  templateUrl: './layout-vertical-nav-primary.html',
  styleUrl: './layout.demo.scss',
  standalone: false,
})
export class LayoutVerticalNavPrimaryDemo {
  @Input() showCode = true;

  example = EXAMPLE;
}
