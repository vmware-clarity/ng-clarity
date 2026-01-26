/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { ClrAbstractContainer } from '../abstract-container';

export interface Helpers {
  show?: boolean;
  showInvalid?: boolean;
  showValid?: boolean;
  showHelper?: boolean;
}

@Injectable()
export class NgControlService {
  container: ClrAbstractContainer;
  private _controls: NgControl[] = [];

  // Observable to subscribe to the control, since its not available immediately for projected content
  private _controlsChanges = new Subject<NgControl[]>();
  private _defaultControlsChanges = new Subject<NgControl>();

  get defaultControl() {
    return this._controls[0];
  }

  get defaultControlChanges(): Observable<NgControl> {
    return this._defaultControlsChanges.asObservable();
  }

  get controls() {
    return this._controls;
  }

  get controlsChanges(): Observable<NgControl[]> {
    return this._controlsChanges.asObservable();
  }

  get hasMultipleControls() {
    return this._controls?.length > 1;
  }

  addControl(control: NgControl) {
    this._controls.push(control);

    if (!this.hasMultipleControls) {
      this.emitDefaultControlsChanges(control);
    }

    this.emitControlsChange(this._controls);
  }

  emitControlsChange(controls: NgControl[]) {
    this._controlsChanges.next(controls);
  }

  emitDefaultControlsChanges(control: NgControl) {
    this._defaultControlsChanges.next(control);
  }
}
