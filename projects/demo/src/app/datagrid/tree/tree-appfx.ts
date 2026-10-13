/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy } from '@angular/core';
import { ColumnDefinition, ColumnOrderChanged } from '@clr/addons/datagrid';
import { ClrDatagridStateInterface, SelectionType } from '@clr/angular';
import { Subscription } from 'rxjs';

import { Resource, ResourceBackend } from './resource-backend';

@Component({
  selector: 'clr-datagrid-tree-appfx-demo',
  templateUrl: 'tree-appfx.html',
  standalone: false,
})
export class DatagridTreeAppfxDemo implements OnDestroy {
  backend = new ResourceBackend();
  roots: Resource[] = [];
  total = 0;
  loading = true;
  selected: Resource[] = [];
  selects: 'self' | 'descendants' = 'descendants';
  SelectionType = SelectionType;

  // Every column can be pinned from its actions menu; Name starts pinned. Unpinned columns can be
  // dragged or moved from the same menu. The tree toggle follows the leftmost column.
  columns: ColumnDefinition<Resource>[] = [
    { displayName: 'Name', field: 'name', pinnable: true, pinned: true, width: '280px' },
    { displayName: 'Kind', field: 'kind', pinnable: true, width: '160px' },
    { displayName: 'Status', field: 'status', pinnable: true, width: '160px' },
    { displayName: 'CPU %', field: 'cpu', pinnable: true, width: '300px' },
    { displayName: 'Memory (GB)', field: 'memory', pinnable: true, width: '300px' },
    { displayName: 'Children', field: 'childCount', pinnable: true, width: '300px' },
  ];

  /** The columns in their current order; the grid reports it on every move. */
  ordered = this.columns;

  private request: Subscription;

  get order() {
    return this.ordered.map(column => column.displayName + (column.pinned ? ' (pinned)' : '')).join(', ');
  }

  expandable = (resource: Resource) => resource.childCount > 0;
  getChildren = (resource: Resource) => this.backend.children(resource);

  ngOnDestroy() {
    this.request?.unsubscribe();
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.request?.unsubscribe();
    this.request = this.backend.page(state).subscribe(result => {
      this.roots = result.items;
      this.total = result.total;
      this.loading = false;
    });
  }

  onColumnOrderChange(event: ColumnOrderChanged) {
    this.ordered = event.columns;
  }
}
