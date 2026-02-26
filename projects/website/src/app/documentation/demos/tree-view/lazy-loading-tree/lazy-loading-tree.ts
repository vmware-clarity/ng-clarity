/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ClrDatagridModule,
  ClrIcon,
  ClrIconModule,
  ClrIfExpanded,
  ClrLoadingModule,
  ClrTreeViewModule,
} from '@clr/angular';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree [clrLazy]="true">
  <clr-tree-node [clrLoading]="loading">
    <clr-icon shape="building"></clr-icon>
    Office Locations
    <ng-template clrIfExpanded (clrIfExpandedChange)="$event ? fetchLocations() : null">
      <clr-tree-node *ngFor="let location of locations$ | async">{{ location }}</clr-tree-node>
    </ng-template>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrConditionalModule, ClrIcon, ClrLoadingModule, ClrTreeViewModule],
})
export class ExampleComponent {
  locations$: Observable<string[]> | undefined;
  loading = false;

  locationService = {
    getLocations: () => timer(1000).pipe(map(() => ['London', 'New York', 'Bangalore'])),
  };

  fetchLocations() {
    this.loading = true;
    this.locations$ = this.locationService.getLocations().pipe(tap(() => (this.loading = false)));
  }
}
`;

@Component({
  selector: 'clr-lazy-loading-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './lazy-loading-tree.html',
  imports: [
    ClrTreeViewModule,
    ClrLoadingModule,
    ClrIcon,
    ClrIconModule,
    ClrDatagridModule,
    ClrIfExpanded,
    StackblitzExampleComponent,
    AsyncPipe,
  ],
})
export class LazyLoadingTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;

  locations$: Observable<string[]> | undefined;
  loading = false;

  locationService = {
    getLocations: () => timer(1000).pipe(map(() => ['London', 'New York', 'Bangalore'])),
  };

  fetchLocations() {
    this.loading = true;
    this.locations$ = this.locationService.getLocations().pipe(tap(() => (this.loading = false)));
  }
}
