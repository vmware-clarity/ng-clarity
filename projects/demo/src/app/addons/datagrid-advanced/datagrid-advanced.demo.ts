/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'clr-datagrid-advanced-demo',
  template: `
    <h1>Datagrid Advanced</h1>

    <ul class="datagrid-nav">
      <li><a [routerLink]="['./client-side']" routerLinkActive="active">Client-Side</a></li>
      <li><a [routerLink]="['./server-driven']" routerLinkActive="active">Server-Driven</a></li>
      <li><a [routerLink]="['./virtual-scroll']" routerLinkActive="active">Virtual Scroll</a></li>
      <li><a [routerLink]="['./drag-drop']" routerLinkActive="active">Drag &amp; Drop</a></li>
      <li><a [routerLink]="['./filters']" routerLinkActive="active">Custom Filters</a></li>
      <li><a [routerLink]="['./detail-pane']" routerLinkActive="active">Detail Pane</a></li>
      <li><a [routerLink]="['./custom-column-definitions']" routerLinkActive="active">Custom Column Definitions</a></li>
      <li><a [routerLink]="['./persistance']" routerLinkActive="active">Persistence</a></li>
    </ul>

    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [RouterModule],
})
export class DatagridAdvancedDemo {}
