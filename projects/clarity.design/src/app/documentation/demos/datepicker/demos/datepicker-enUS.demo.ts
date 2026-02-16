/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-datepicker-en-us-demo',
  template: `
    <h4 cds-text="subsection" class="clr-mt-32px">Locale Identifier: en-US</h4>
    <form clrForm clrLayout="vertical">
      <clr-date-container>
        <label>US locale</label>
        <input type="date" autocomplete="off" clrDate />
      </clr-date-container>
    </form>
    <table class="table" cds-text="body">
      <thead>
        <tr>
          <th class="left">Key</th>
          <th class="left">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="left">Language</td>
          <td class="left">English</td>
        </tr>
        <tr>
          <td class="left">Territory</td>
          <td class="left">US</td>
        </tr>
        <tr>
          <td class="left">First Day of the Week (Retrieved from Angular)</td>
          <td class="left">Sunday (S)</td>
        </tr>
        <tr>
          <td class="left">Date Format (Retrieved from Angular)</td>
          <td class="left">M/d/yy</td>
        </tr>
        <tr>
          <td class="left">Placeholder Generated</td>
          <td class="left">MM/DD/YYYY</td>
        </tr>
      </tbody>
    </table>
  `,
  standalone: false,
})
export class DatepickerENUSDemo {}
