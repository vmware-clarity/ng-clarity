/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="main-container">
  <header class="header-1">
    <div class="branding">
      <a href="javascript://">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link nav-icon">
        <clr-icon shape="cog"></clr-icon>
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
  selector: 'clr-layout-no-subnav-demo',
  templateUrl: './layout-no-subnav.html',
  styleUrl: './layout.demo.scss',
  imports: [ClrIcon, ClrIconModule, ClrVerticalNavModule, StackblitzExampleComponent],
})
export class LayoutNoSubnavDemo {
  readonly showCode = input(true);

  example = EXAMPLE;
}
