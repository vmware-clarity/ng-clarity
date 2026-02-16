/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<header class="header header-1">...</header>

<header class="header header-2">...</header>

<header class="header header-3">...</header>

<header class="header header-4">...</header>

<header class="header header-5">...</header>

<header class="header header-6">...</header>

<header class="header header-7">...</header>
`;

const FULL_EXAMPLE = `
<div class="main-container">
  <header class="header header-1">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-2">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-3">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-4">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-5">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-6">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <header class="header header-7">
    <div class="branding">
      <a href="javascript://">
        <cds-icon shape="vm-bug"></cds-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
  </header>

  <div class="content-container">
    <div class="content-area"></div>
  </div>
</div>
`;

const FULL_EXAMPLE_CSS = `
header {
  margin-bottom: var(--cds-global-space-9);
}
`;

@Component({
  selector: 'clr-header-demo-colors',
  templateUrl: './header-colors.demo.html',
  styleUrl: './headers.demo.scss',
  standalone: false,
})
export class HeaderColorsDemo {
  example = EXAMPLE;
  fullExample = FULL_EXAMPLE;
  fullExampleCss = FULL_EXAMPLE_CSS;
}
