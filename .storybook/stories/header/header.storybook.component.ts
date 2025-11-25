/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrIcon, ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';

@Component({
  selector: 'storybook-header',
  standalone: true,
  imports: [CommonModule, ClrMainContainerModule, ClrNavigationModule, ClrIcon],
  template: `
    <clr-main-container>
      <clr-header [role]="role">
        <div class="branding">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="vm-bug"></cds-icon>
            <span class="title">Project Clarity</span>
          </a>
        </div>
        <div class="header-nav" [clr-nav-level]="1">
          <a href="javascript://" class="nav-link nav-text">Home</a>
          <a href="javascript://" class="nav-link nav-text">About</a>
          <a href="javascript://" class="nav-link nav-text">Services</a>
        </div>
        <div class="header-actions">
          <a href="javascript://" class="nav-link">
            <cds-icon shape="cog"></cds-icon>
          </a>
        </div>
      </clr-header>
      <nav class="subnav" [clr-nav-level]="2">
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
    </clr-main-container>
  `,
})
export class HeaderStorybookComponent {
  /** ARIA role for the header element (e.g. 'banner'). */
  @Input() role?: string;
}
