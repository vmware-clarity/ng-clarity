/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { organization } from './organization';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node *ngFor="let directory of rootDirectory" [(clrExpanded)]="directory.expanded">
    <cds-icon [attr.shape]="directory.icon"></cds-icon>
    {{ directory.name }}
    <clr-tree-node *ngFor="let file of directory.files">
      <button
        (click)="openFile(directory.name, file.name)"
        class="clr-treenode-link"
        [class.active]="file.active"
      >
        <cds-icon [attr.shape]="file.icon"></cds-icon>
        {{ file.name }}
      </button>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule, ClrIconModule } from '@clr/angular';
import { organization } from './organization';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrTreeViewModule, ClrIconModule],
})
export class ExampleComponent {
  rootDirectory = organization;

  openFile(directoryName: string, fileName: string): void {
    for (const dir of this.rootDirectory) {
      if (directoryName === dir.name) {
        this.setFileActive(dir, fileName);
      } else {
        for (const file of dir.files) {
          file.active = false;
        }
      }
    }
  }

  setFileActive(dir: any, fileName: string) {
    for (const file of dir.files) {
      file.active = file.name === fileName;
    }
  }
}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'organization.ts': require('!raw-loader!./organization.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-tree-view-dynamic-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './tree-view-dynamic.html',
  standalone: false,
})
export class TreeViewDynamicDemo {
  @Input('clrDemoShowCode') showCode = false;
  @Input('clrDemoShowHalf') showHalf = false;

  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  rootDirectory = organization;

  openFile(directoryName: string, fileName: string): void {
    for (const dir of this.rootDirectory) {
      if (directoryName === dir.name) {
        this.setFileActive(dir, fileName);
      } else {
        for (const file of dir.files) {
          file.active = false;
        }
      }
    }
  }

  setFileActive(dir: any, fileName: string) {
    for (const file of dir.files) {
      file.active = file.name === fileName;
    }
  }
}
