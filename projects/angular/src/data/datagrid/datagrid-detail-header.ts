/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, ViewChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DetailService } from './providers/detail.service';

@Component({
  selector: 'clr-dg-detail-header',
  host: {
    '[class.datagrid-detail-header]': 'true',
  },
  template: `
    <div class="datagrid-detail-header-title" cdkFocusInitial tabindex="-1" [id]="titleId" #title>
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
})
export class ClrDatagridDetailHeader {
  @ViewChild('title', { read: ElementRef }) title: ElementRef;

  constructor(public detailService: DetailService, public commonStrings: ClrCommonStringsService) {}

  get titleId() {
    return `${this.detailService.id}-title`;
  }
}
