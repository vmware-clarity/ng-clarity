/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<table class="table">
  <thead>
    <tr>
      <th class="left">Name</th>
      <th>A/B</th>
      <th class="left">Comment</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Beetlejuice</td>
      <td>B</td>
      <td class="left">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
        non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </td>
    </tr>
    <tr>
      <td class="left">Mytzlplk</td>
      <td>A</td>
      <td class="left">Excepteur sint occaecat cupidatat non proident.</td>
    </tr>
    <tr>
      <td class="left">Q</td>
      <td>A</td>
      <td class="left">
        Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </td>
    </tr>
  </tbody>
</table>
`;

@Component({
  selector: 'clr-tables-multiline-demo',
  templateUrl: './tables-multiline.html',
  imports: [StackblitzExampleComponent],
})
export class TablesMultilineDemo {
  example = EXAMPLE;
}
