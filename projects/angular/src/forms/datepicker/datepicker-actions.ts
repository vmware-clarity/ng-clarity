/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit, Optional } from '@angular/core';

import { DateNavigationService } from './providers/date-navigation.service';

@Component({
  selector: 'clr-datepicker-actions',
  templateUrl: './datepicker-actions.html',
})
export class ClrDatepickerActions implements OnInit, OnDestroy {
  constructor(@Optional() private _dateNavigationService: DateNavigationService) {}

  ngOnInit(): void {
    this.toggleActionButtonFlag(true);
  }

  ngOnDestroy(): void {
    this.toggleActionButtonFlag(false);
  }

  toggleActionButtonFlag(flag: boolean) {
    if (this._dateNavigationService) {
      this._dateNavigationService.hasActionButtons = flag;
    }
  }
}
