/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node [(clrExpanded)]="expanded">
    {{ expanded ? 'I am expanded' : 'I am collapsed' }}
    <clr-tree-node>Child Tree Node</clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrTreeViewModule],
})
export class ExampleComponent {
  expanded: boolean = true;
}
`;

@Component({
  selector: 'clr-tree-node-label-change-expand-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './label-change-on-expand.html',
  imports: [ClrTreeViewModule, StackblitzExampleComponent],
})
export class TreeNodeLabelChangeOnExpandDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;

  expanded = true;
}
