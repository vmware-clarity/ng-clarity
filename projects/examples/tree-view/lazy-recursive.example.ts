/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrIcon, ClrTreeViewModule } from '@clr/angular';
import { of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { File, files } from './data/files';

@Component({
  selector: 'clr-tree-view-lazy-recursive-example',
  templateUrl: './lazy-recursive.example.html',
  imports: [AsyncPipe, ClrIcon, ClrTreeViewModule],
})
export class TreeViewLazyRecursiveExample {
  root$ = of(files);

  folderService = {
    getFiles: (folder: File) => timer(1000).pipe(map(() => folder.files)),
  };

  getChildren = (folder: File) => (folder.isFolder ? this.folderService.getFiles(folder) : null);
}
