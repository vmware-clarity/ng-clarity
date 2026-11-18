/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
 * A BehaviorSubject whose current value is also held in a signal, so that a template reading `value` is refreshed
 * whenever the subject emits, even in an OnPush view that nothing else marks dirty.
 */
export class SignalBehaviorSubject<T> extends BehaviorSubject<T> {
  private readonly current: WritableSignal<T>;

  constructor(value: T) {
    super(value);
    this.current = signal(value);
  }

  override getValue(): T {
    // Read for the dependency only: the subject stays the source of the value, and of its errors.
    this.current();
    return super.getValue();
  }

  override next(value: T): void {
    this.current.set(value);
    super.next(value);
  }
}
