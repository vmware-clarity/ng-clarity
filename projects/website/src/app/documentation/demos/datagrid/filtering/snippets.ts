/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const filterInterface = `
interface ClrDatagridFilterInterface<T, S = any> {
  isActive(): boolean;
  accepts(item: T): boolean;
  changes: Observable<any>;
  readonly state?: S;
  equals?(other: ClrDatagridFilterInterface<T, any>): boolean;
}
`;

const filterSearchResults = `
<clr-datagrid>
  <!--
      This will search into user.creation (a Date object) and not the result
      of the pipe (the string 'Jan 6, 2018').
    -->
  <clr-dg-column [clrDgField]="'creation'">Creation Date</clr-dg-column>

  <!--
      This will search into user.name and will not include user.id --
      searching for user.id will not return any results.
    -->
  <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>

  @for (user of users; track user.id) {
    <clr-dg-row>
      <clr-dg-cell>{{ user.creation | date }}</clr-dg-cell>
      <clr-dg-cell>{{ user.id }} : {{ user.name }}</clr-dg-cell>
    </clr-dg-row>
  }
</clr-datagrid>
`;

export const SNIPPETS = {
  filterInterface,
  filterSearchResults,
};
