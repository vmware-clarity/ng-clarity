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
    <div class="header-nav">
      <a href="javascript://" class="nav-link nav-icon">
        <cds-icon shape="cloud"></cds-icon>
      </a>
      <a href="javascript://" class="active nav-link nav-icon">
        <cds-icon shape="folder"></cds-icon>
      </a>
    </div>
  </header>
  <div class="content-container">
    <div class="content-area">
      <p>....</p>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-layout-only-header-demo',
  templateUrl: './layout-only-header.html',
  styleUrl: './layout.demo.scss',
  standalone: false,
})
export class LayoutOnlyHeaderDemo {
  @Input() showCode = true;

  example = EXAMPLE;
}
