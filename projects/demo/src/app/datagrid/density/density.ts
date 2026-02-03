/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { User } from '../inventory/user';
import { DatagridKitchenSinkData } from '../kitchen-sink/kitchen-sink-data';

@Component({
  selector: 'clr-datagrid-density-demo',
  templateUrl: './density.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridDensityDemo {
  selected: User[];
  users: User[];
  detail = 'columns';
  replace = true;
  fixedHeight = true;
  overflowEllipsis = true;
  compact = true;
  showRowDetail = true;
  showAnchor = false;
  actions: true;

  constructor() {
    this.users = DatagridKitchenSinkData.users;
  }

  get selectable() {
    return !!this.selected;
  }
  set selectable(value: boolean) {
    if (value) {
      this.selected = [];
    } else {
      delete this.selected;
    }
  }
}
