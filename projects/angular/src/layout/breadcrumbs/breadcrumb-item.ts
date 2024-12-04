/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { DELIMITER } from './breadcrumbs.constants';
@Component({
  selector: 'clr-breadcrumb-item',
  template: `
      <span class="clr-breadcrumb-link">
        <ng-content />
      </span>
      <span class="clr-breadcrumb-delimiter">{{delimiter}}</span>
  `,
  styleUrls: ['./_breadcrumb-item.clarity.scss'],
  host: {
    class: 'clr-breadcrumb-item',
    '[attr.role]': '"list-item"',
  },
})
export class ClrBreadcrumbItem {
  delimiter = DELIMITER;
}
