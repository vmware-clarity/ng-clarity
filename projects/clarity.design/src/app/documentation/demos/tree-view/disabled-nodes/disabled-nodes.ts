/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    David Wallace (CFO)
    <clr-tree-node [clrExpanded]="true">
      Michael Scott (Regional Manager)

      <clr-tree-node>Dwight K. Schrute (Assistant to the Regional Manager)</clr-tree-node>

      <clr-tree-node>
        Jim Halpert (Head of Sales)
        <clr-tree-node>Andy Bernard</clr-tree-node>
        <clr-tree-node>Stanley Hudson</clr-tree-node>
        <clr-tree-node>Phyllis Vance</clr-tree-node>
        <clr-tree-node>Todd Packer</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node [clrDisabled]="true" [clrExpanded]="true">
        Angela Martin (Head of Accounting)
        <clr-tree-node>Kevin Malone</clr-tree-node>
        <clr-tree-node>Oscar Martinez</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node [clrDisabled]="true">
        Kelly Kapoor (Head of Customer Service)
        <clr-tree-node>Ryan Howard (Temp)</clr-tree-node>
      </clr-tree-node>

      <clr-tree-node>Creed Bratton (Quality Assurance)</clr-tree-node>

      <clr-tree-node [clrDisabled]="true">Meredith Palmer (Supplier Relations)</clr-tree-node>

      <clr-tree-node>Toby Flenderson (Human Resources)</clr-tree-node>

      <clr-tree-node>Pam Beesly (Reception)</clr-tree-node>

      <clr-tree-node>Darryl Philbin (Warehouse)</clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

@Component({
  selector: 'app-disabled-nodes-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: 'disabled-nodes.html',
  standalone: false,
})
export class DisabledNodesDemo {
  example = EXAMPLE;
}
