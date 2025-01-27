/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';

import { FocusableItem } from './focusable-item';

export class MockFocusableItem implements FocusableItem {
  disabled = false;

  up?: FocusableItem | Observable<FocusableItem>;
  down?: FocusableItem | Observable<FocusableItem>;
  left?: FocusableItem | Observable<FocusableItem>;
  right?: FocusableItem | Observable<FocusableItem>;

  constructor(public id: string) {}

  focus() {
    // Do nothing
  }
  blur() {
    // Do nothing
  }
  activate() {
    // Do nothing
  }
}
