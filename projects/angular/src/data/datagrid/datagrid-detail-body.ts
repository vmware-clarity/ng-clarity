/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-dg-detail-body',
  standalone: false,
  template: `
    <div class="clr-dg-detail-body-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class.datagrid-detail-body]': 'true',
  },
})
export class ClrDatagridDetailBody {}
