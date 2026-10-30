/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, of } from 'rxjs';
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

export interface ResourceBackendOptions {
  roots: number;
  /** Children of every datacenter, cluster and host; varies from row to row when not set. */
  children?: number;
  /** How long every call takes to respond, in milliseconds. */
  latency: number;
}

const CHILD_KIND = { Datacenter: 'Cluster', Cluster: 'Host', Host: 'VM', VM: null } as const;

/**
 * A fake backend for the tree demos: datacenters, then clusters, hosts and VMs.
 */
export class ResourceBackend {
  readonly roots: Resource[];

  constructor(private options: ResourceBackendOptions = { roots: 23, latency: 300 }) {
    this.roots = Array.from({ length: options.roots }, (_, i) =>
      this.make(`dc${i + 1}`, `Datacenter ${i + 1}`, 'Datacenter', i)
    );
  }

  page(state: ClrDatagridStateInterface): Observable<{ items: Resource[]; total: number }> {
    // `from` is -1 until the datagrid knows the total, so the page number is the reliable input.
    const size = state.page?.size || 10;
    const from = ((state.page?.current || 1) - 1) * size;
    const roots = this.sorted(state.sort);
    return this.respond({ items: roots.slice(from, from + size), total: roots.length });
  }

  children(parent: Resource): Observable<Resource[]> {
    const kind = CHILD_KIND[parent.kind];
    const items = Array.from({ length: parent.childCount }, (_, i) =>
      this.make(`${parent.id}-${i + 1}`, `${kind} ${i + 1}`, kind, i + 1)
    );
    return this.respond(items);
  }

  // The datagrid sorts the children it has itself; the roots are sorted here, across pages.
  private sorted(sort: ClrDatagridStateInterface['sort']): Resource[] {
    const field = sort?.by as keyof Resource;
    if (typeof field !== 'string') {
      return this.roots;
    }
    const direction = sort.reverse ? -1 : 1;
    return [...this.roots].sort(
      (a, b) => direction * String(a[field]).localeCompare(String(b[field]), undefined, { numeric: true })
    );
  }

  private respond<R>(value: R): Observable<R> {
    return this.options.latency ? of(value).pipe(delay(this.options.latency)) : of(value);
  }

  private make(id: string, name: string, kind: Resource['kind'], seed: number): Resource {
    const varying = kind === 'Host' ? 3 + (seed % 9) : 2 + (seed % 4);
    return {
      id,
      name,
      kind,
      cpu: (seed * 37) % 100,
      memory: 8 * (1 + (seed % 16)),
      status: (['Running', 'Stopped', 'Maintenance'] as const)[seed % 3],
      childCount: kind === 'VM' ? 0 : (this.options.children ?? varying),
    };
  }
}
