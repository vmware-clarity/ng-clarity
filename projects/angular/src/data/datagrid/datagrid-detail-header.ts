/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DetailService } from './providers/detail.service';

@Component({
  selector: 'clr-dg-detail-header',
  host: {
    '[class.datagrid-detail-header]': 'true',
  },
  template: `
    <div class="datagrid-detail-header-title" clrFocusOnViewInit [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon size="24" shape="times"></cds-icon>
      </button>
    </div>
  `,
})
export class ClrDatagridDetailHeader {
  get titleId() {
    return `${this.detailService.id}-title`;
  }

  constructor(public detailService: DetailService, public commonStrings: ClrCommonStringsService) {}
}
