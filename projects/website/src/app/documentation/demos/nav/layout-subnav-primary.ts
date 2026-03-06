/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClrCommonFormsModule, ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

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
    <form class="search">
      <label for="search-input-sidenav-ng">
        <input id="search-input-sidenav-ng" type="text" placeholder="Search for keywords..." />
      </label>
    </form>
    <div class="settings">
      <a href="javascript://" class="nav-link nav-icon">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
  </header>
  <nav class="subnav">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="javascript://">Subnav Link 1</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Subnav Link 2</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Subnav Link 3</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Subnav Link 4</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Subnav Link 5</a>
      </li>
    </ul>
  </nav>
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
  selector: 'clr-layout-only-subnav-primary',
  templateUrl: './layout-subnav-primary.html',
  styleUrl: './layout.demo.scss',
  imports: [ClrIcon, ClrIconModule, ClrCommonFormsModule, ClrVerticalNavModule, StackblitzExampleComponent],
})
export class LayoutSubnavPrimaryDemo {
  readonly showCode = input(true);

  example = EXAMPLE;
}
