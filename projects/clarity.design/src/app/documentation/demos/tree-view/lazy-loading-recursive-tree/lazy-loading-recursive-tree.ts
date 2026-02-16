/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { File, files } from '../utils/files';

const EXAMPLE_HTML = `
<clr-tree *ngIf="root$ | async; let files" [clrLazy]="true">
  <clr-tree-node
    *clrRecursiveFor="let file of files; getChildren: getChildren"
    [clrExpandable]="file.isFolder"
  >
    <cds-icon [attr.shape]="file.isFolder ? 'folder' : 'file'"></cds-icon>
    {{ file.name }}
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrIconModule, ClrTreeViewModule } from '@clr/angular';
import { timer, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { File, files } from './files';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [CommonModule, ClrIconModule, ClrTreeViewModule],
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

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'files.ts': require('!raw-loader!../utils/files.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-lazy-loading-recursive-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './lazy-loading-recursive-tree.html',
  standalone: false,
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
