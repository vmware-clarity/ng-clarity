/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-main-container>
  <clr-header>
    <div class="header-nav" [clr-nav-level]="1">
      <a href="javascript://" class="nav-link nav-text">Home</a>
      <a href="javascript://" class="nav-link nav-text">About</a>
    </div>
  </clr-header>
  <nav class="subnav" [clr-nav-level]="1">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="javascript://" aria-current="page">Dashboard</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Management</a>
      </li>
    </ul>
  </nav>
  <div class="content-container">
    <main class="content-area">...</main>
    <clr-vertical-nav [clr-nav-level]="2">
      <a clrVerticalNavLink>Cloud</a>
    </clr-vertical-nav>
  </div>
</clr-main-container>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClrNavigationModule, ClrVerticalNavModule, ClrMainContainerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [
    CommonModule,
    RouterModule,
    ClrNavigationModule,
    ClrVerticalNavModule,
    ClrMainContainerModule,
  ],
})
export class ExampleComponent {}
`;

@Component({
  selector: 'clr-responsive-nav-subnav-vertical-nav-demo',
  template: `<app-stackblitz-example
    name="responsive-nav"
    [componentTemplate]="example"
    [showComponentClass]="false"
    [componentClass]="tsExample"
  ></app-stackblitz-example>`,
  styleUrl: './headers.demo.scss',
  imports: [StackblitzExampleComponent],
})
export class ResponsiveNav2Demo {
  example = EXAMPLE;
  tsExample = EXAMPLE_TS;
}
