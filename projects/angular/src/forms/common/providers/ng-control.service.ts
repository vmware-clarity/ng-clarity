/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  private _control: NgControl;
  private _additionalControls: NgControl[] = [];

  // Observable to subscribe to the control, since its not available immediately for projected content
  private _controlChanges = new Subject<NgControl>();
  private _additionalControlsChanges = new Subject<NgControl[]>();

  private _helpers = new Subject<Helpers>();

  get control() {
    return this._control;
  }

  get controlChanges(): Observable<NgControl> {
    return this._controlChanges.asObservable();
  }

  get additionalControls() {
    return this._additionalControls;
  }

  get additionalControlsChanges(): Observable<NgControl[]> {
    return this._additionalControlsChanges.asObservable();
  }

  get hasAdditionalControls() {
    return !!this._additionalControls?.length;
  }

  get helpersChange(): Observable<Helpers> {
    return this._helpers.asObservable();
  }

  setControl(control: NgControl) {
    this._control = control;

    this.emitControlChange(control);
  }

  emitControlChange(control: NgControl) {
    this._controlChanges.next(control);
  }

  addAdditionalControl(control: NgControl) {
    this._additionalControls.push(control);
    this.emitAdditionalControlChange(this._additionalControls);
  }

  emitAdditionalControlChange(controls: NgControl[]) {
    this._additionalControlsChanges.next(controls);
  }

  setHelpers(state: Helpers) {
    this._helpers.next(state);
  }
}
