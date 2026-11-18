/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormControl, FormControlDirective, NgControl, Validators } from '@angular/forms';

import { ControlState, controlStateChanges, NO_CONTROL_STATE, readControlState } from './control-state';

function ngControlFor(control: FormControl | undefined): NgControl {
  const directive = new FormControlDirective([], [], [], null, null);
  directive.form = control;
  return directive;
}

describe('Forms control state', () => {
  it('reads the state of the control behind an NgControl', () => {
    const control = new FormControl('', Validators.required);

    expect(readControlState(ngControlFor(control))).toEqual({
      value: '',
      errors: { required: true },
      status: 'INVALID',
      disabled: false,
      invalid: true,
      touched: false,
    });
  });

  it('has no state while the NgControl has no control yet', () => {
    expect(readControlState(ngControlFor(undefined))).toBe(NO_CONTROL_STATE);
  });

  it('emits the current state and one state per change', () => {
    const control = new FormControl('', Validators.required);
    const states: ControlState[] = [];
    const subscription = controlStateChanges(ngControlFor(control)).subscribe(state => states.push(state));

    control.setValue('value');
    control.markAsTouched();
    control.setErrors({ custom: true });
    control.disable();

    expect(states.map(({ value, status, touched, disabled }) => ({ value, status, touched, disabled }))).toEqual([
      { value: '', status: 'INVALID', touched: false, disabled: false },
      { value: 'value', status: 'VALID', touched: false, disabled: false },
      { value: 'value', status: 'VALID', touched: true, disabled: false },
      { value: 'value', status: 'INVALID', touched: true, disabled: false },
      { value: 'value', status: 'DISABLED', touched: true, disabled: true },
    ]);
    subscription.unsubscribe();
  });

  it('skips events that do not change the state', () => {
    const control = new FormControl('value');
    const states: ControlState[] = [];
    const subscription = controlStateChanges(ngControlFor(control)).subscribe(state => states.push(state));

    control.markAsDirty();
    control.updateValueAndValidity();

    expect(states.length).toBe(1);
    subscription.unsubscribe();
  });
});
