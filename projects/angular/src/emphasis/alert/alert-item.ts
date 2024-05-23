/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { AlertIconAndTypesService } from './providers/icon-and-types.service';

@Component({
  selector: 'clr-alert-item',
  template: `
    <div class="alert-icon-wrapper">
      <cds-icon
        class="alert-icon"
        role="img"
        [attr.shape]="iconService.alertIconShape"
        [attr.aria-label]="iconService.alertIconTitle"
      ></cds-icon>
    </div>
    <ng-content></ng-content>
  `,
  host: { class: 'alert-item' },
})
export class ClrAlertItem {
  constructor(public iconService: AlertIconAndTypesService) {}
}
