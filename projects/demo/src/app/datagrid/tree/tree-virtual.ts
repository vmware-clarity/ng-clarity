/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { Component } from '@angular/core';

import { Resource, ResourceBackend, ResourceBackendOptions } from './resource-backend';

@Component({
  selector: 'clr-datagrid-tree-virtual-demo',
  templateUrl: 'tree-virtual.html',
  standalone: false,
})
export class DatagridTreeVirtualDemo {
  options: ResourceBackendOptions = { roots: 1000, children: 20, latency: 300 };
  backend = new ResourceBackend(this.options);
  selected: Resource[] = [];
  selectionType: 'multi' | 'single' | 'none' = 'multi';
  selects: 'self' | 'descendants' = 'self';
  pinName = true;
  compact = false;
  height = 32;
  range: ListRange;

  identity = (resource: Resource) => resource.id;
  expandable = (resource: Resource) => resource.childCount > 0;
  getChildren = (resource: Resource) => this.backend.children(resource);

  rebuild() {
    this.selected = [];
    this.backend = new ResourceBackend({ ...this.options });
  }
}
