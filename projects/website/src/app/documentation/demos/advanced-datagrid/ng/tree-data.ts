/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AppfxDatagridModule, ColumnDefinition, DatagridTreeConfig, TreeExpandedState } from '@clr/addons/datagrid';
import { ClrDatagridStateInterface } from '@clr/angular';
import { SelectionType } from '@clr/angular/data/datagrid';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

interface Resource {
  id: string;
  name: string;
  type: 'Datacenter' | 'Cluster' | 'Host' | 'VM';
  cpus: number;
  childCount: number;
}

const CHILD_TYPE: Record<Resource['type'], Resource['type']> = {
  Datacenter: 'Cluster',
  Cluster: 'Host',
  Host: 'VM',
  VM: 'VM',
};

function resource(id: string, type: Resource['type'], index: number): Resource {
  return {
    id,
    name: `${type} ${index}`,
    type,
    cpus: 4 * (1 + (index % 8)),
    childCount: type === 'VM' ? 0 : 2 + (index % 3),
  };
}

const DATACENTERS = Array.from({ length: 12 }, (_, i) => resource(`dc${i + 1}`, 'Datacenter', i + 1));

/** Answers after a short delay, like a server. */
function fromServer<T>(value: T): Observable<T> {
  return of(value).pipe(delay(500));
}

@Component({
  selector: 'app-tree-data-advanced-grid-demo',
  imports: [AppfxDatagridModule],
  standalone: true,
  templateUrl: './tree-data.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TreeDataGridDemoComponent implements OnDestroy {
  roots: Resource[] = [];
  total = 0;
  loading = true;
  selected: Resource[] = [];
  lastExpanded = '';
  SelectionType = SelectionType;

  columns: ColumnDefinition<Resource>[] = [
    { displayName: 'Name', field: 'name' },
    { displayName: 'Type', field: 'type' },
    { displayName: 'CPUs', field: 'cpus' },
    { displayName: 'Children', field: 'childCount' },
  ];

  // The children of a row are loaded the first time it is expanded.
  treeConfig: DatagridTreeConfig<Resource> = {
    getChildren: parent =>
      fromServer(
        Array.from({ length: parent.childCount }, (_, i) =>
          resource(`${parent.id}-${i + 1}`, CHILD_TYPE[parent.type], i + 1)
        )
      ),
    hasChildren: item => item.childCount > 0,
    cascadeSelection: true,
  };

  private request: Subscription | undefined;

  // The server sends the datacenters of the page.
  refresh(state: ClrDatagridStateInterface<Resource>) {
    const size = state.page?.size || 5;
    const from = ((state.page?.current || 1) - 1) * size;

    this.loading = true;
    this.request?.unsubscribe();
    this.request = fromServer(DATACENTERS.slice(from, from + size)).subscribe(roots => {
      this.roots = roots;
      this.total = DATACENTERS.length;
      this.loading = false;
    });
  }

  onTreeExpandedChange(event: TreeExpandedState<Resource>) {
    this.lastExpanded = `${event.item.name} ${event.expanded ? 'expanded' : 'collapsed'}`;
  }

  ngOnDestroy() {
    this.request?.unsubscribe();
  }
}
