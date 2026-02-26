/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<table class="table table-compact">
  <thead>
    <tr>
      <th class="left">Monster</th>
      <th>Home</th>
      <th>Likes Cookies</th>
      <th class="left">Fun to Play With</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="left">Wolfman</td>
      <td>Nondisclosed countryside</td>
      <td>Sometimes</td>
      <td class="left">Not really</td>
    </tr>
    <tr>
      <td class="left">Mothra</td>
      <td>Tropical island</td>
      <td>No</td>
      <td class="left">Only if you have a flashlight</td>
    </tr>
    <tr>
      <td class="left">Oscar the Grouch</td>
      <td>Sesame Street</td>
      <td>No</td>
      <td class="left">No</td>
    </tr>
    <tr>
      <td class="left">Cookie Monster</td>
      <td>Sesame Street</td>
      <td>Definitely yes</td>
      <td class="left">Only if you have no cookies</td>
    </tr>
  </tbody>
</table>
`;

@Component({
  selector: 'clr-tables-compact-demo',
  templateUrl: './tables-compact.html',
  imports: [StackblitzExampleComponent],
})
export class TablesCompactDemo {
  example = EXAMPLE;
}
