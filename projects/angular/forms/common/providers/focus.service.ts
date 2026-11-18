/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Signal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FormsFocusService {
  private readonly _isFocused = signal(false);
  private readonly _focused = new BehaviorSubject(false);

  /** Whether the wrapped control has focus. Reading it in a template refreshes OnPush views. */
  get isFocused(): Signal<boolean> {
    return this._isFocused.asReadonly();
  }

  get focusChange(): Observable<boolean> {
    return this._focused.asObservable();
  }
  set focused(state: boolean) {
    this._isFocused.set(state);
    this._focused.next(state);
  }
}
