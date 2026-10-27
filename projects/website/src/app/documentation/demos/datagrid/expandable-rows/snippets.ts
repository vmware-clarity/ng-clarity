/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const basic = `
@for (user of users; track user.id) {
  <clr-dg-row>
    <!-- Cells declarations -->
    <clr-dg-cell>...</clr-dg-cell>

    <clr-dg-row-detail *clrIfExpanded>Lorem ipsum...</clr-dg-row-detail>
  </clr-dg-row>
}
`;

const replace = `<clr-dg-row-detail *clrIfExpanded [clrDgReplace]="true">Lorem ipsum...</clr-dg-row-detail>`;

export const SNIPPETS = {
  basic,
  replace,
};
