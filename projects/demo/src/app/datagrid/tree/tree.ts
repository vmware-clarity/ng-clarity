/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs';

import { Resource, ResourceBackend } from './resource-backend';

@Component({
  selector: 'clr-datagrid-tree-demo',
  templateUrl: 'tree.html',
  styleUrls: ['../datagrid.demo.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridTreeDemo implements OnDestroy {
  backend = new ResourceBackend();
  readonly roots = signal<Resource[]>([]);
  readonly total = signal(0);
  readonly loading = signal(true);
  selected: Resource[] = [];
  selectionType: 'multi' | 'single' = 'multi';
  cascadeSelection = true;
  pinName = true;
  log: string[] = [];
  private request: Subscription;

  get selectedNames() {
    return this.selected.map(resource => resource.id).join(', ');
  }

  identity = (resource: Resource) => resource.id;
  getChildren = (resource: Resource) => this.backend.children(resource);

  ngOnDestroy() {
    this.request?.unsubscribe();
  }

  refresh(state: ClrDatagridStateInterface) {
    this.loading.set(true);
    this.request?.unsubscribe();
    this.request = this.backend.page(state).subscribe(result => {
      this.roots.set(result.items);
      this.total.set(result.total);
      this.loading.set(false);
    });
  }

  act(action: string, resource: Resource) {
    this.log = [`${action}: ${resource.name} (${resource.id})`, ...this.log].slice(0, 5);
  }
}
