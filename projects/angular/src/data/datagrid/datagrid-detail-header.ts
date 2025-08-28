/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { DetailService } from './providers/detail.service';

@Component({
  selector: 'clr-dg-detail-header',
  host: {
    '[class.datagrid-detail-header]': 'true',
  },
  template: `
    <div #title class="datagrid-detail-header-title" tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-icon btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
  standalone: false,
})
export class ClrDatagridDetailHeader implements AfterViewInit {
  @ViewChild('title') title: ElementRef<HTMLElement>;

  constructor(public detailService: DetailService, public commonStrings: ClrCommonStringsService) {}

  get titleId() {
    return `${this.detailService.id}-title`;
  }

  ngAfterViewInit(): void {
    this.title.nativeElement.focus();
  }
}
