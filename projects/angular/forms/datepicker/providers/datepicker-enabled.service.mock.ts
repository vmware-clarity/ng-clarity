/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';

import { DatepickerEnabledService } from './datepicker-enabled.service';

@Injectable()
export class MockDatepickerEnabledService extends DatepickerEnabledService {
  // The real service decides once, at creation. Specs switch it later, so the fake is a signal.
  private readonly enabled = signal(true);

  get fakeIsEnabled(): boolean {
    return this.enabled();
  }
  set fakeIsEnabled(value: boolean) {
    this.enabled.set(value);
  }

  override get isEnabled(): boolean {
    return this.enabled();
  }
}
