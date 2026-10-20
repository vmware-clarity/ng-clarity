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
  // dragged or moved from the same menu. The tree toggle stays with Name, or with the tree columns.
  // Sorting by field: the server sorts the roots, the datagrid the children.
  columns: ColumnDefinition<Resource>[] = [
    {
      displayName: 'Name',
      field: 'name',
      sortComparator: 'name',
      pinnable: true,
      pinned: true,
      treeColumn: true,
      width: '280px',
    },
    { displayName: 'Kind', field: 'kind', sortComparator: 'kind', pinnable: true, width: '160px' },
    { displayName: 'Status', field: 'status', sortComparator: 'status', pinnable: true, width: '160px' },
    { displayName: 'CPU %', field: 'cpu', sortComparator: 'cpu', pinnable: true, width: '300px' },
    { displayName: 'Memory (GB)', field: 'memory', sortComparator: 'memory', pinnable: true, width: '300px' },
    { displayName: 'Children', field: 'childCount', sortComparator: 'childCount', pinnable: true, width: '300px' },
  ];

  // The footer counts the roots, the datacenters, not the rows on display.
  labels = {
    singleItem: '1 datacenter',
    multipleItems: '{0} datacenters',
    pagedItems: '{1} - {2} of {0} datacenters',
    itemsPerPage: 'Datacenters per page',
  };

  /** The columns in their current order; the grid reports it on every move. */
  ordered = this.columns;

  private request: Subscription;

  // As on screen: pinned columns first.
  get order() {
    return [...this.ordered.filter(column => column.pinned), ...this.ordered.filter(column => !column.pinned)]
      .map(column => column.displayName + (column.pinned ? ' (pinned)' : ''))
      .join(', ');
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

  setTreeColumn(column: ColumnDefinition<Resource>, treeColumn: boolean) {
    column.treeColumn = treeColumn;
    // A new array, in the order the user left the columns, so the grid picks the change up.
    this.columns = [...this.ordered];
  }
}
