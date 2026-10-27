/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const stringFilterInterface = `
interface ClrDatagridStringFilterInterface<T> {
  accepts(item: T, search: string): boolean;
}
`;

const stringFilterInput = `
<!-- In the columns declaration -->
<clr-dg-column>
  My column
  <clr-dg-string-filter [clrDgStringFilter]="myFilter"></clr-dg-string-filter>
</clr-dg-column>
`;

const numericFilterInterface = `
interface ClrDatagridNumericFilterInterface<T> {
  accepts(item: T, low: number, high: number): boolean;
}
`;

const numericFilterInput = `
<clr-dg-column>
  Wins
  <clr-dg-numeric-filter [clrDgNumericFilter]="winsFilter"></clr-dg-numeric-filter>
</clr-dg-column>
`;

export const SNIPPETS = {
  stringFilterInterface,
  stringFilterInput,
  numericFilterInterface,
  numericFilterInput,
};
