/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ClrTreeViewModule } from '@clr/angular';

import { permissions } from './permissions';
import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE_HTML = `
<clr-tree>
  <clr-tree-node [clrExpanded]="true">
    Permissions
    @for (permission of permissions; track permission.type) {
      <clr-tree-node [clrExpanded]="true">
        {{ permission.type }}
        @for (right of permission.rights; track right.name) {
          <clr-tree-node [clrSelected]="right.enable" (clrSelectedChange)="right.enable = !!$event">
            {{ right.name }}
          </clr-tree-node>
        }
      </clr-tree-node>
    }
  </clr-tree-node>
</clr-tree>
`;

const EXAMPLE_TS = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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

const additionalFiles = {
  'permissions.ts': require('!raw-loader!./permissions.ts').default,
};

@Component({
  selector: 'clr-boolean-selection-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './boolean-selection-tree.html',
  imports: [ClrTreeViewModule, StackblitzExampleComponent, JsonPipe],
})
export class BooleanSelectionTreeDemo {
  exampleHtml = EXAMPLE_HTML;
  exampleTs = EXAMPLE_TS;
  additionalFiles = additionalFiles;

  permissions = permissions;
}
