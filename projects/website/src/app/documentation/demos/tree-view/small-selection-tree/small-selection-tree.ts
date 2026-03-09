/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { permissions } from '../boolean-selection-tree/permissions';

@Component({
  selector: 'clr-small-selection-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'small-selection-tree.html',
  imports: [ClrTreeViewModule],
})
export class SmallSelectionTreeDemo {
  permissions = permissions;
}
