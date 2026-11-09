/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, DatagridTreeConfig } from '@clr/addons/datagrid';
import { ClrDatagridStateInterface, ClrDatagridVirtualScrollRangeInterface, SelectionType } from '@clr/angular';
import { Subscription } from 'rxjs';

import { Resource, ResourceBackend } from '../../../datagrid/tree/resource-backend';

@Component({
  imports: [AppfxDatagridModule],
  standalone: true,
  templateUrl: 'tree-virtual-scroll-grid-demo.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TreeVirtualScrollGridDemoComponent implements OnDestroy {
  protected readonly SelectionType = SelectionType;
  protected readonly backend = new ResourceBackend({ roots: 5000, latency: 500 });

  // The roots not loaded yet are skeleton rows until the grid asks for them.
  protected dataRange: ClrDatagridVirtualScrollRangeInterface<Resource> = {
    total: this.backend.roots.length,
    skip: 0,
    data: [],
  };
  protected selected: Resource[] = [];
  protected requested: string[] = [];

  protected readonly columns: ColumnDefinition<Resource>[] = [
    { displayName: 'Name', field: 'name', width: '280px' },
    { displayName: 'Kind', field: 'kind', width: '160px' },
    { displayName: 'Status', field: 'status', width: '160px' },
    { displayName: 'CPU %', field: 'cpu', width: '120px' },
    { displayName: 'Memory (GB)', field: 'memory', width: '160px' },
    { displayName: 'Children', field: 'childCount', width: '120px' },
  ];

  protected readonly treeConfig: DatagridTreeConfig<Resource> = {
    getChildren: resource => this.backend.children(resource),
    hasChildren: resource => resource.childCount > 0,
    cascadeSelection: true,
  };

  private readonly requests = new Subscription();

  ngOnDestroy() {
    this.requests.unsubscribe();
  }

  // The page counts roots: the children of the rows expanded in between don't move it.
  protected loadRoots(state: ClrDatagridStateInterface) {
    const { from = 0, size = 0 } = state.page ?? {};
    this.requested = [...this.requested.slice(-4), `${from + 1} - ${from + size}`];
    this.requests.add(
      this.backend.range(from, size).subscribe(result => {
        this.dataRange = { total: result.total, skip: from, data: result.items };
      })
    );
  }
}
