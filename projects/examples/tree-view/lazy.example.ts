/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrConditionalModule, ClrIcon, ClrLoadingModule, ClrTreeViewModule } from '@clr/angular';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'clr-tree-view-lazy-example',
  templateUrl: './lazy.example.html',
  imports: [AsyncPipe, ClrConditionalModule, ClrIcon, ClrLoadingModule, ClrTreeViewModule],
})
export class TreeViewLazyExample {
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
