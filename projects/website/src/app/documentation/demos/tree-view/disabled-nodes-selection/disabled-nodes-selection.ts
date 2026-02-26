/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';
import { File, files } from '../utils/files';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node
    *clrRecursiveFor="let file of root; getChildren: getChildren"
    [clrSelected]="file.selected"
    [clrDisabled]="file.disabled"
    [clrExpanded]="file.expanded"
  >
    {{ file.name }}
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { File, files } from './files';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrTreeViewModule],
})
export class ExampleComponent {
  root = files;

  getChildren(folder: File) {
    return folder.files;
  }
}
`;

const additionalFiles = {
  'files.ts': '',
};

@Component({
  selector: 'app-disabled-nodes-selection-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'disabled-nodes-selection.html',
  imports: [ClrTreeViewModule, StackblitzExampleComponent, JsonPipe],
})
export class DisabledNodesSelectionDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  root = files;

  getChildren(folder: File) {
    return folder.files;
  }
}
