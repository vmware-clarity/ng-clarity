/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControlStatus, NgControl, ValidationErrors } from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';

/**
 * A snapshot of one form control, for templates that render its state.
 */
export interface ControlState {
  readonly value: unknown;
  readonly errors: ValidationErrors | null;
  readonly status: FormControlStatus | null;
  readonly disabled: boolean;
  readonly invalid: boolean;
  readonly touched: boolean;
}

export const NO_CONTROL_STATE: ControlState = {
  value: null,
  errors: null,
  status: null,
  disabled: false,
  invalid: false,
  touched: false,
};

export function readControlState(ngControl: NgControl): ControlState {
  const control = ngControl.control;
  if (!control) {
    return NO_CONTROL_STATE;
  }

  return {
    value: control.value,
    errors: control.errors,
    status: control.status,
    disabled: control.disabled,
    invalid: control.invalid,
    touched: control.touched,
  };
}

function sameControlState(a: ControlState, b: ControlState) {
  return (
    a.value === b.value &&
    a.errors === b.errors &&
    a.status === b.status &&
    a.disabled === b.disabled &&
    a.invalid === b.invalid &&
    a.touched === b.touched
  );
}

/**
 * Emits the control's state now and after each of its events (value, status, touched, pristine, reset, submit).
 * Subscribe again when `ngControl.control` is replaced.
 */
export function controlStateChanges(ngControl: NgControl): Observable<ControlState> {
  const events: Observable<unknown> = ngControl.control?.events ?? EMPTY;

  return events.pipe(
    startWith(null),
    map(() => readControlState(ngControl)),
    distinctUntilChanged(sameControlState)
  );
}
