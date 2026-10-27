/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { permissions } from './data/permissions';

@Component({
  selector: 'clr-tree-view-boolean-selection-example',
  templateUrl: './boolean-selection.example.html',
  styleUrl: './boolean-selection.example.scss',
  imports: [JsonPipe, ClrTreeViewModule],
})
export class TreeViewBooleanSelectionExample {
  permissions = permissions;
}
