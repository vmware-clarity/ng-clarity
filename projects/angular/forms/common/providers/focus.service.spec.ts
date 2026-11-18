/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormsFocusService } from './focus.service';

describe('FormsFocusService', () => {
  it('starts unfocused', () => {
    expect(new FormsFocusService().isFocused()).toBe(false);
  });

  it('keeps the signal and the focusChange stream in sync', () => {
    const service = new FormsFocusService();
    const emitted: boolean[] = [];
    const subscription = service.focusChange.subscribe(state => emitted.push(state));

    service.focused = true;
    expect(service.isFocused()).toBe(true);
    service.focused = false;
    expect(service.isFocused()).toBe(false);

    expect(emitted).toEqual([false, true, false]);
    subscription.unsubscribe();
  });
});
