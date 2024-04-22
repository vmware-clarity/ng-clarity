/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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
  private _controls: NgControl[] = [];
  private _controlChanges = new Subject<NgControl>();
  private _controlsChanges = new Subject<NgControl[]>();

  private _helpers = new Subject<Helpers>();

  get controlChanges(): Observable<NgControl> {
    return this._controlChanges.asObservable();
  }

  get helpersChange(): Observable<Helpers> {
    return this._helpers.asObservable();
  }

  get controlsChanges(): Observable<NgControl[]> {
    return this._controlsChanges.asObservable();
  }

  get hasAdditionalControls() {
    return this._controls.length > 0;
  }

  setControl(control: NgControl) {
    this._control = control;
    this._controlChanges.next(control);
  }

  setHelpers(state: Helpers) {
    this._helpers.next(state);
  }

  setAdditionalControls(control: NgControl) {
    this._controls.push(control);
    this._controlsChanges.next(this._controls);
  }

  getControl() {
    return this._control;
  }

  getControls() {
    return this._controls;
  }
}
