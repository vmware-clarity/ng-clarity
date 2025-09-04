/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChild, Input } from '@angular/core';

import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DetailService } from './providers/detail.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';

@Component({
  selector: 'clr-dg-detail',
  host: {
    '[class.datagrid-detail-pane]': 'true',
  },
  // We put the *ngIf on the cdkTrapFocus so it doesn't always exist on the page
  // have to test for presence of header for aria-describedby because it was causing unit tests to crash
  template: `
    @if (detailService.isOpen) {
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="!header"
        class="datagrid-detail-pane-content"
        role="dialog"
        [id]="detailService.id"
        aria-modal="true"
        [attr.aria-labelledby]="labelledBy"
        [attr.aria-label]="label"
      >
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
        <ng-content></ng-content>
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
      </div>
    }
  `,
  standalone: false,
})
export class ClrDatagridDetail {
  @Input('clrDetailAriaLabelledBy') ariaLabelledBy: string;
  @Input('clrDetailAriaLabel') ariaLabel: string;

  @ContentChild(ClrDatagridDetailHeader) header: ClrDatagridDetailHeader;

  constructor(
    public detailService: DetailService,
    public commonStrings: ClrCommonStringsService
  ) {}

  get labelledBy(): string {
    if (this.ariaLabelledBy) {
      return this.header ? `${this.header.titleId} ${this.ariaLabelledBy}` : this.ariaLabelledBy;
    } else if (this.ariaLabel) {
      // If aria-label is set by the end user, do not set aria-labelledby
      return null;
    } else {
      return this.header?.titleId || '';
    }
  }

  get label(): string {
    if (!this.ariaLabelledBy) {
      return this.ariaLabel || null;
    } else {
      return null;
    }
  }

  close(): void {
    this.detailService.close();
  }
}
