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
  private _controlChanges = new Subject<NgControl>();
  private _additionalControls: NgControl[] = [];
  private _additionalControlChanges = new Subject<NgControl[]>();

  private _helpers = new Subject<Helpers>();

  get controlChanges(): Observable<NgControl> {
    return this._controlChanges.asObservable();
  }

  get helpersChange(): Observable<Helpers> {
    return this._helpers.asObservable();
  }

  get additionalControlChanges(): Observable<NgControl[]> {
    return this._additionalControlChanges.asObservable();
  }

  get hasAdditionalControls() {
    return !!this._additionalControls?.length;
  }

  setControl(control: NgControl) {
    this._control = control;
    this._controlChanges.next(control);
  }

  setHelpers(state: Helpers) {
    this._helpers.next(state);
  }

  addAdditionalControl(control: NgControl) {
    this._additionalControls.push(control);
    this._additionalControlChanges.next(this._additionalControls);
  }

  getControl() {
    return this._control;
  }

  getAdditionalControls() {
    return this._additionalControls;
  }
}
