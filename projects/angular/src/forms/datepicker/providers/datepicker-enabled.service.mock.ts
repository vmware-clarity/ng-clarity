/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { DatepickerEnabledService } from './datepicker-enabled.service';

@Injectable()
export class MockDatepickerEnabledService extends DatepickerEnabledService {
  fakeIsEnabled = true;

  get isEnabled(): boolean {
    return this.fakeIsEnabled;
  }
}
