/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="main-container">
  <header class="header-1">
    <div class="branding">
      <a href="javascript://">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link nav-icon" aria-label="settings">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
  </header>
  <nav class="subnav">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="javascript://" aria-current="page">Dashboard</a>
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
    <div class="content-area"></div>
  </div>
</div>
`;

@Component({
  selector: 'clr-nav-demo-subnav',
  styleUrl: './sub-nav.demo.scss',
  templateUrl: './sub-nav.demo.html',
  imports: [ClrIcon, ClrIconModule, StackblitzExampleComponent],
})
export class SubNavDemo {
  example = EXAMPLE;
}
