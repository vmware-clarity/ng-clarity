/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

const EXAMPLE = `
<div class="main-container">
  <header class="header-6">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <div class="settings">
      <a href="javascript://" class="nav-link nav-icon">
        <cds-icon shape="cog"></cds-icon>
      </a>
    </div>
  </header>
  <nav class="subnav">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="javascript://">Dashboard</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Management</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Cloud</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Tenants</a>
      </li>
    </ul>
  </nav>
  <div class="content-container">
    <div class="content-area">
      <p>...</p>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-layout-no-vertical-nav-demo',
  templateUrl: './layout-no-vertical-nav.html',
  styleUrl: './layout.demo.scss',
  standalone: false,
})
export class LayoutNoVerticalNavDemo {
  @Input() showCode = true;

  example = EXAMPLE;
}
