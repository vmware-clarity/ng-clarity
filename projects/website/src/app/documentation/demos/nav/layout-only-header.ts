/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="main-container">
  <header class="header header-1">
    <div class="branding">
      <a href="javascript:void(0)">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <div class="header-nav">
      <a href="javascript://" class="nav-link nav-icon">
        <clr-icon shape="cloud"></clr-icon>
      </a>
      <a href="javascript://" class="active nav-link nav-icon">
        <clr-icon shape="folder"></clr-icon>
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
  imports: [ClrIcon, ClrIconModule, StackblitzExampleComponent],
})
export class LayoutOnlyHeaderDemo {
  readonly showCode = input(true);

  example = EXAMPLE;
}
