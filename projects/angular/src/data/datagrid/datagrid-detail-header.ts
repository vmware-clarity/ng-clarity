/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
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
    <div class="datagrid-detail-header-title" cdkFocusInitial tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button type="button" class="btn btn-link" (click)="close()" [attr.aria-label]="commonStrings.keys.close">
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
})
export class ClrDatagridDetailHeader {
  constructor(public detailService: DetailService, public commonStrings: ClrCommonStringsService) {}

  get titleId() {
    return `${this.detailService.id}-title`;
  }

  close(): void {
    this.detailService.close();
    // In the case of browser zoom greater than 250%, the detail pane toggle button is not visible on the page.
    // Wait for the detail pane to close, and return focus to the detail toggle button.
    setTimeout(() => this.detailService.returnFocus(), 0);
  }
}
