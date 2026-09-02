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
<div class="btn-group btn-sm">
  <button type="button" class="btn" (click)="tree.expandAll()">Expand all</button>
  <button type="button" class="btn" (click)="tree.collapseAll()">Collapse all</button>
</div>
<p>All expanded: {{ allExpanded }}</p>

<clr-tree #tree [(clrExpandAll)]="allExpanded">
  <clr-tree-node>
    Office Locations
    <clr-tree-node>
      USA
      <clr-tree-node>Palo Alto, CA (Headquarters)</clr-tree-node>
      <clr-tree-node>Seattle, WA</clr-tree-node>
    </clr-tree-node>
    <clr-tree-node [(clrExpandAll)]="europeAllExpanded">
      Europe
      <clr-tree-node>
        UK
        <clr-tree-node>London</clr-tree-node>
      </clr-tree-node>
      <clr-tree-node>
        Bulgaria
        <clr-tree-node>Sofia</clr-tree-node>
      </clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrTreeViewModule],
})
export class ExampleComponent {
  allExpanded = false;
  europeAllExpanded = true;
}
`;

@Component({
  selector: 'clr-tree-expand-all-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './expand-all-tree.html',
  imports: [ClrTreeViewModule, StackblitzExampleComponent],
})
export class ExpandAllTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;

  allExpanded = false;
  europeAllExpanded = true;
}
