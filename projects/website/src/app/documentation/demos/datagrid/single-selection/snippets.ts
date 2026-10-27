/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const selectionChangeEvent = `
<clr-datagrid
  [clrDgSelected]="selected"
  [clrDgSelectionType]="'single'"
  (clrDgSelectedChange)="selectionChanged($event)"
>
  <!-- ... -->
</clr-datagrid>
`;

const unselectableRow = `
<clr-dg-row [clrDgSelectable]="!user.locked" *clrDgItems="let user of users" [clrDgItem]="user">
  <clr-dg-cell>{{ user.id }}</clr-dg-cell>
  <!-- ... -->
</clr-dg-row>
`;

export const SNIPPETS = {
  selectionChangeEvent,
  unselectableRow,
};
