/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'clr-date-range-picker-fr-demo',
  template: `
    <h4 cds-text="subsection" class="clr-mt-32px">Locale Idenitifer: fr</h4>
    <form clrForm clrLayout="vertical">
      <clr-date-range-container>
        <label>FR locale</label>
        <input type="date" autocomplete="off" clrStartDate />
        <input type="date" autocomplete="off" clrEndDate />
      </clr-date-range-container>
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
          <td class="left">French</td>
        </tr>
        <tr>
          <td class="left">Territory</td>
          <td class="left">-</td>
        </tr>
        <tr>
          <td class="left">First Day of the Week (Retrieved from Angular)</td>
          <td class="left">Monday (L)</td>
        </tr>
        <tr>
          <td class="left">Date Format (Retrieved from Angular)</td>
          <td class="left">dd/MM/y</td>
        </tr>
        <tr>
          <td class="left">Placeholder Generated</td>
          <td class="left">DD/MM/YYYY</td>
        </tr>
      </tbody>
    </table>
  `,
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  standalone: false,
})
export class DateRangePickerFRDemo {}
