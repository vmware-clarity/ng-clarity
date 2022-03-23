/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrAlert } from './alert';
import { MultiAlertService } from './providers/multi-alert.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'clr-alerts-pager',
  templateUrl: './alerts-pager.html',
  host: { '[class.alerts-pager]': 'true' },
  providers: [ClrDestroyService],
})
export class ClrAlertsPager implements OnInit {
  /**
   * Input/Output to support two way binding on current alert instance
   */
  @Input('clrCurrentAlert')
  set currentAlert(alert: ClrAlert) {
    if (alert) {
      this.multiAlertService.currentAlert = alert;
    }
  }
  get currentAlert() {
    return this.multiAlertService.currentAlert;
  }

  @Output('clrCurrentAlertChange') currentAlertChange = new EventEmitter<ClrAlert>(false);

  /**
   * Input/Output to support two way binding on current alert index
   */
  @Input('clrCurrentAlertIndex')
  set currentAlertIndex(index: number) {
    this.multiAlertService.current = index;
  }
  get currentAlertIndex() {
    return this.multiAlertService.current;
  }

  @Output('clrCurrentAlertIndexChange') currentAlertIndexChange = new EventEmitter<number>();

  constructor(
    public multiAlertService: MultiAlertService,
    public commonStrings: ClrCommonStringsService,
    private destroy$: ClrDestroyService
  ) {}

  ngOnInit() {
    this.multiAlertService.changes.pipe(takeUntil(this.destroy$)).subscribe(index => {
      this.currentAlertIndexChange.emit(index);
      this.currentAlertChange.emit(this.multiAlertService.activeAlerts[index]);
    });
  }

  pageUp() {
    this.multiAlertService.next();
  }

  pageDown() {
    this.multiAlertService.previous();
  }
}
