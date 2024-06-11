/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, ChangeDetectorRef, Component, ContentChild } from '@angular/core';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DetailService } from './providers/detail.service';

@Component({
  selector: 'clr-dg-detail',
  host: {
    '[class.datagrid-detail-pane]': 'true',
  },
  // We put the *ngIf on the cdkTrapFocus so it doesn't always exist on the page
  // have to test for presence of header for aria-describedby because it was causing unit tests to crash
  template: `
    <div
      cdkTrapFocus
      [cdkTrapFocusAutoCapture]="autoCapture"
      class="datagrid-detail-pane-content"
      *ngIf="detailService.isOpen"
      role="dialog"
      [id]="detailService.id"
      aria-modal="true"
      [attr.aria-describedby]="header ? header.titleId : ''"
    >
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
      <ng-content></ng-content>
      <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
    </div>
  `,
})
export class ClrDatagridDetail implements AfterViewInit {
  @ContentChild(ClrDatagridDetailHeader) header: ClrDatagridDetailHeader;
  autoCapture = false;

  constructor(
    public detailService: DetailService,
    public commonStrings: ClrCommonStringsService,
    public cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.header) {
      this.header.title.nativeElement.focus();
    } else {
      this.autoCapture = true;
      this.cdr.detectChanges();
    }
  }

  close(): void {
    this.detailService.close();
  }
}
