/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrDatagridStateInterface, ClrDatagridTreeChunk } from '@clr/angular';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Resource {
  id: string;
  name: string;
  kind: 'Datacenter' | 'Cluster' | 'Host' | 'VM';
  cpu: number;
  memory: number;
  status: 'Running' | 'Stopped' | 'Maintenance';
  childCount: number;
}

const CHILD_KIND = { Datacenter: 'Cluster', Cluster: 'Host', Host: 'VM', VM: null } as const;
const CHUNK = 3;

/**
 * A fake backend: every call answers after a delay, and children come back one chunk at a time.
 */
class ResourceBackend {
  roots: Resource[] = Array.from({ length: 23 }, (_, i) =>
    this.make(`dc${i + 1}`, `Datacenter ${i + 1}`, 'Datacenter', i)
  );

  page(state: ClrDatagridStateInterface): Observable<{ items: Resource[]; total: number }> {
    // `from` is -1 until the datagrid knows the total, so the page number is the reliable input.
    const size = state.page?.size || 10;
    const from = ((state.page?.current || 1) - 1) * size;
    return of({ items: this.roots.slice(from, from + size), total: this.roots.length }).pipe(delay(300));
  }

  children(parent: Resource, skip: number): Observable<ClrDatagridTreeChunk<Resource>> {
    const kind = CHILD_KIND[parent.kind];
    const items = Array.from({ length: Math.min(CHUNK, parent.childCount - skip) }, (_, i) => {
      const n = skip + i + 1;
      return this.make(`${parent.id}-${n}`, `${kind} ${n}`, kind, n);
    });
    return of({ items, total: parent.childCount }).pipe(delay(500));
  }

  private make(id: string, name: string, kind: Resource['kind'], seed: number): Resource {
    const childCount = kind === 'VM' ? 0 : kind === 'Host' ? 3 + (seed % 9) : 2 + (seed % 4);
    return {
      id,
      name,
      kind,
      cpu: (seed * 37) % 100,
      memory: 8 * (1 + (seed % 16)),
      status: (['Running', 'Stopped', 'Maintenance'] as const)[seed % 3],
      childCount,
    };
  }
}

@Component({
  selector: 'clr-datagrid-tree-demo',
  templateUrl: 'tree.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
})
export class DatagridTreeDemo {
  backend = new ResourceBackend();
  roots: Resource[] = [];
  total = 0;
  loading = true;
  selected: Resource[] = [];
  selectionType: 'multi' | 'single' = 'multi';
  pinName = true;
  log: string[] = [];
  private request: Subscription;

  get selectedNames() {
    return this.selected.map(resource => resource.id).join(', ');
  }

  identity = (resource: Resource) => resource.id;
  expandable = (resource: Resource) => resource.childCount > 0;
  getChildren = (resource: Resource, skip: number) => this.backend.children(resource, skip);

  refresh(state: ClrDatagridStateInterface) {
    this.loading = true;
    this.request?.unsubscribe();
    this.request = this.backend.page(state).subscribe(result => {
      this.roots = result.items;
      this.total = result.total;
      this.loading = false;
    });
  }

  act(action: string, resource: Resource) {
    this.log = [`${action}: ${resource.name} (${resource.id})`, ...this.log].slice(0, 5);
  }
}
