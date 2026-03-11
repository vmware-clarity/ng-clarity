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
import { map, Observable, tap, timer } from 'rxjs';

@Component({
  selector: 'app-tree-data-loading-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'tree-data-loading.html',
  imports: [ClrTreeViewModule, ClrIcon, ClrIconModule, ClrLoadingModule, ClrDatagridModule, ClrIfExpanded, AsyncPipe],
})
export class TreeDataLoadingDemo {
  apps$: Observable<string[]> | undefined;
  loading = false;

  appService = {
    getApps: () => timer(1000).pipe(map(() => ['App', 'App2', 'App5'])),
  };

  fetchApps() {
    this.loading = true;
    this.apps$ = this.appService.getApps().pipe(tap(() => (this.loading = false)));
  }
}
