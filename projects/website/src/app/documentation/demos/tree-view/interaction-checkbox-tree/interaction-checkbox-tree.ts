/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSelectedState, ClrTreeViewModule } from '@clr/angular';

@Component({
  selector: 'app-interaction-checkbox-tree-demo',
  styleUrl: '../tree-view.demo.scss',
  templateUrl: './interaction-checkbox-tree.html',
  imports: [ClrTreeViewModule],
})
export class InteractionCheckboxTreeDemo {
  userPriveleges = [
    {
      name: 'Audit User Privileges',
      selected: ClrSelectedState.INDETERMINATE,
      items: [
        {
          name: 'System Privileges',
          selected: ClrSelectedState.INDETERMINATE,
          items: [],
        },
        {
          name: 'Viewing Privileges',
          selected: ClrSelectedState.UNSELECTED,
        },
        {
          name: 'Edit Privileges',
          selected: ClrSelectedState.INDETERMINATE,
          items: [
            {
              name: 'Edit Settings',
              selected: ClrSelectedState.UNSELECTED,
            },
            {
              name: 'Add Comments',
              selected: ClrSelectedState.SELECTED,
            },
          ],
        },
      ],
    },
    {
      name: 'View only User Privileges',
      selected: ClrSelectedState.INDETERMINATE,
      items: [
        {
          name: 'Edit Privilege',
          selected: ClrSelectedState.UNSELECTED,
        },
        {
          name: 'View Privilege',
          selected: ClrSelectedState.SELECTED,
        },
      ],
    },
  ];
}
