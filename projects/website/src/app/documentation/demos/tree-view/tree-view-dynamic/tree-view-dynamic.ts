/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { ClrIcon, ClrIconModule, ClrTreeViewModule } from '@clr/angular';

import { organization } from './organization';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node *ngFor="let directory of rootDirectory" [(clrExpanded)]="directory.expanded">
    <clr-icon [shape]="directory.icon"></clr-icon>
    {{ directory.name }}
    <clr-tree-node *ngFor="let file of directory.files">
      <button
        (click)="openFile(directory.name, file.name)"
        class="clr-treenode-link"
        [class.active]="file.active"
      >
        <clr-icon [shape]="file.icon"></clr-icon>
        {{ file.name }}
      </button>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { organization } from './organization';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrTreeViewModule, ClrIcon],
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

const additionalFiles = {
  'organization.ts': '',
};

@Component({
  selector: 'clr-tree-view-dynamic-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './tree-view-dynamic.html',
  imports: [ClrTreeViewModule, ClrIcon, ClrIconModule, StackblitzExampleComponent, JsonPipe],
})
export class TreeViewDynamicDemo {
  readonly showCode = input(false, { alias: 'clrDemoShowCode' });
  readonly showHalf = input(false, { alias: 'clrDemoShowHalf' });

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
