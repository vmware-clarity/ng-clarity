/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Resource, ResourceBackend, ResourceBackendOptions } from './resource-backend';

@Component({
  selector: 'clr-datagrid-tree-virtual-demo',
  templateUrl: 'tree-virtual.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridTreeVirtualDemo {
  options: ResourceBackendOptions = { roots: 1000, children: 20, latency: 300 };
  backend = new ResourceBackend(this.options);
  selected: Resource[] = [];
  selectionType: 'multi' | 'single' | 'none' = 'multi';
  cascadeSelection = false;
  pinName = true;
  height = 32;
  range: ListRange | undefined;
  grid = { generation: 0 };
  private _compact = false;

  // The virtual scroll takes its row height when it is created.
  get compact() {
    return this._compact;
  }
  set compact(value: boolean) {
    this._compact = value;
    this.renew();
  }

  identity = (resource: Resource) => resource.id;
  getChildren = (resource: Resource) => this.backend.children(resource);

  rebuild() {
    this.selected = [];
    this.backend = new ResourceBackend({ ...this.options });
    this.renew();
  }

  private renew() {
    this.range = undefined;
    this.grid = { generation: this.grid.generation + 1 };
  }
}
