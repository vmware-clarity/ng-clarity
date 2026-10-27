/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basicUsage = `
<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgCustomSelectAllEnabled]="true"
  (clrDgCustomSelectAll)="onCustomSelectAll($event)"
>
  <!-- columns and rows -->
</clr-datagrid>
`;

const virtualScrollExample = `
<clr-datagrid
  [(clrDgSelected)]="selected"
  [clrDgSelectionType]="'multi'"
  [clrDgItemsIdentityFn]="trackItemById"
  [clrDgCustomSelectAllEnabled]="true"
  (clrDgCustomSelectAll)="onCustomSelectAll($event)"
  style="height: 32rem"
>
  <clr-dg-column>User ID</clr-dg-column>
  <clr-dg-column>Name</clr-dg-column>

  <ng-template
    clrVirtualScroll
    let-user
    [clrVirtualRowsOf]="users"
    [clrVirtualRowsTrackBy]="rowByIndex"
  >
    <clr-dg-row [clrDgItem]="user">
      <clr-dg-cell>{{ user.id }}</clr-dg-cell>
      <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    </clr-dg-row>
  </ng-template>

  <clr-dg-footer>{{ users.length }} users</clr-dg-footer>
</clr-datagrid>
`;

export const SNIPPETS = {
  basicUsage,
  virtualScrollExample,
};
