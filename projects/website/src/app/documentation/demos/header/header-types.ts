/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrCommonFormsModule,
  ClrDropdownModule,
  ClrIcon,
  ClrIconModule,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="main-container">
  <header class="header-1">
    <div class="branding">
      <a href="..." class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-nav">
      <a href="..." class="active nav-link" aria-current="page">
        <span class="nav-text">Dashboard</span>
      </a>
      <a href="..." class="nav-link"><span class="nav-text">Interactive Analytics</span></a>
    </div>
    <div class="header-actions">
      <a href="..." class="nav-link nav-icon" aria-label="settings">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
  </header>

  <header class="header-1">
    <div class="branding">
      <a href="..." class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <form class="search">
      <label for="search_input">
        <input id="search_input" type="text" placeholder="Search for keywords..." />
      </label>
    </form>
    <div class="header-actions">
      <a href="..." class="nav-link nav-icon" aria-label="settings">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
  </header>

  <header class="header-1">
    <div class="branding">
      <a href="..." class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-actions">
      <clr-dropdown>
        <button class="nav-icon" clrDropdownTrigger aria-label="toggle settings menu">
          <clr-icon shape="cog"></clr-icon>
          <clr-icon shape="angle" direction="down"></clr-icon>
        </button>
        <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
          <a href="..." clrDropdownItem>About</a>
          <a href="..." clrDropdownItem>Preferences</a>
          <a href="..." clrDropdownItem>Log out</a>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  </header>

  <header class="header-1">
    <div class="branding">
      <a href="..." class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-actions">
      <a href="..." class="nav-link nav-text">Log Out</a>
    </div>
  </header>

  <header class="header-1">
    <div class="branding">
      <a href="..." class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-actions">
      <clr-dropdown>
        <button class="nav-text" clrDropdownTrigger aria-label="open user profile">
          john.doe&#64;example.com
          <clr-icon shape="angle" direction="down"></clr-icon>
        </button>
        <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
          <a href="..." clrDropdownItem>Preferences</a>
          <a href="..." clrDropdownItem>Log out</a>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  </header>

  <header class="header-1">
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Clarity Design</span>
      </a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link nav-icon-text">
        <clr-icon shape="user"></clr-icon>
        <span class="nav-text">username</span>
      </a>
    </div>
  </header>

  <div class="content-container">
    <div class="content-area"></div>
  </div>
</div>
`;

const EXAMPLE_CSS = `
header {
  margin-bottom: var(--cds-global-space-9);
}
`;

@Component({
  selector: 'clr-header-demo-types',
  templateUrl: './header-types.demo.html',
  styleUrl: './headers.demo.scss',
  imports: [
    ClrIcon,
    ClrIconModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
  ],
})
export class HeaderTypesDemo {
  example = EXAMPLE;
  exampleCss = EXAMPLE_CSS;
}
