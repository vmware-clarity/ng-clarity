/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { File, files } from './data/files';

@Component({
  selector: 'clr-tree-view-disabled-selection-example',
  templateUrl: './disabled-selection.example.html',
  styleUrl: './disabled-selection.example.scss',
  imports: [JsonPipe, ClrTreeViewModule],
})
export class TreeViewDisabledSelectionExample {
  root = files;

  getChildren(folder: File) {
    return folder.files;
  }
}
