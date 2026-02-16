/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="main-container">
  <header class="header-6">
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-nav">
      <a href="javascript://" class="active nav-link nav-text">Dashboard</a>
      <a href="javascript://" class="nav-link nav-text">Interactive Analytics</a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
        <cds-icon shape="cog"></cds-icon>
      </a>
    </div>
  </header>
  <div class="content-container">
    <div class="content-area"></div>
  </div>
</div>
`;

@Component({
  selector: 'clr-header-demo-links',
  templateUrl: './header-links.demo.html',
  styleUrl: './headers.demo.scss',
  standalone: false,
})
export class HeaderLinksDemo {
  example = EXAMPLE;
}
