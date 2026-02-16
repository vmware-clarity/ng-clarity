/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { permissions } from './permissions';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    Permissions
    <clr-tree-node *ngFor="let permission of permissions" [clrExpanded]="true">
      {{ permission.type }}
      <clr-tree-node
        *ngFor="let right of permission.rights"
        [clrSelected]="right.enable"
        (clrSelectedChange)="right.enable = !!$event"
      >
        {{ right.name }}
      </clr-tree-node>
    </clr-tree-node>
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { permissions } from './permissions';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrTreeViewModule],
})
export class ExampleComponent {
  permissions = permissions;
}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'permissions.ts': require('!raw-loader!./permissions.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-boolean-selection-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './boolean-selection-tree.html',
  standalone: false,
})
export class BooleanSelectionTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  permissions = permissions;
}
