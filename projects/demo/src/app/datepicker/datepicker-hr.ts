/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'clr-datepicker-hr-demo',
  styleUrls: ['./datepicker.demo.scss'],
  template: `
    <div clrForm>
      <input type="date" autocomplete="off" />
    </div>
  `,
  providers: [{ provide: LOCALE_ID, useValue: 'hr' }],
})
export class DatepickerHRDemo {}
