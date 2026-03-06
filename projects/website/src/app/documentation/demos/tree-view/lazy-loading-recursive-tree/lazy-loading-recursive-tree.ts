/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrTreeViewModule } from '@clr/angular';
import { of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { File, files } from '../utils/files';

const EXAMPLE_HTML = `
@if (root$ | async; as files) {
  <clr-tree [clrLazy]="true">
    <clr-tree-node
      *clrRecursiveFor="let file of files; getChildren: getChildren"
      [clrExpandable]="file.isFolder"
    >
      <clr-icon [shape]="file.isFolder ? 'folder' : 'file'"></clr-icon>
      {{ file.name }}
    </clr-tree-node>
  </clr-tree>
}
`;

const EXAMPLE_TS = `
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { timer, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { File, files } from './files';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [AsyncPipe, ClrIcon, ClrTreeViewModule],
})
export class ExampleComponent {
  root$ = of(files);

  folderService = {
    getFiles: (folder: File) => {
      return timer(1000).pipe(map(() => folder.files));
    },
  };

  getChildren = (folder: File) => {
    return folder.isFolder ? this.folderService.getFiles(folder) : null;
  };
}
`;

const additionalFiles = {
  'files.ts': require('!raw-loader!../utils/files.ts').default,
};

@Component({
  selector: 'clr-lazy-loading-recursive-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './lazy-loading-recursive-tree.html',
  imports: [ClrTreeViewModule, ClrIcon, ClrIconModule, StackblitzExampleComponent, AsyncPipe],
})
export class LazyLoadingRecursiveTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  root$ = of(files);

  folderService = {
    getFiles: (folder: File) => {
      return timer(1000).pipe(map(() => folder.files));
    },
  };

  getChildren = (folder: File) => {
    return folder.isFolder ? this.folderService.getFiles(folder) : null;
  };
}
