/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export interface Helpers {
  show?: boolean;
  showInvalid?: boolean;
  showValid?: boolean;
  showHelper?: boolean;
}

@Injectable()
export class NgControlService {
  // Observable to subscribe to the control, since its not available immediately for projected content
  private _control: NgControl;
  private _secondaryControl: NgControl;
  private _controlChanges = new Subject<NgControl>();
  private _secondaryControlChanges = new Subject<NgControl>();

  private _helpers = new Subject<Helpers>();

  get controlChanges(): Observable<NgControl> {
    return this._controlChanges.asObservable();
  }

  get helpersChange(): Observable<Helpers> {
    return this._helpers.asObservable();
  }

  get secondaryControlChanges(): Observable<NgControl> {
    return this._secondaryControlChanges.asObservable();
  }

  get hasAdditionalControls() {
    return !!this._secondaryControl;
  }

  setControl(control: NgControl) {
    this._control = control;
    this._controlChanges.next(control);
  }

  setHelpers(state: Helpers) {
    this._helpers.next(state);
  }

  setSecondaryControl(control: NgControl) {
    this._secondaryControl = control;
    this._secondaryControlChanges.next(this._secondaryControl);
  }

  getControl() {
    return this._control;
  }

  getSecondaryControl() {
    return this._secondaryControl;
  }
}
