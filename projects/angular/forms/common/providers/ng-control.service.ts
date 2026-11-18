/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { combineLatest, Observable, of, Subject, switchMap } from 'rxjs';

import { ClrAbstractContainer } from '../abstract-container';
import { ControlState, controlStateChanges } from '../control-state';

export interface Helpers {
  show?: boolean;
  showInvalid?: boolean;
  showValid?: boolean;
  showHelper?: boolean;
}

@Injectable()
export class NgControlService implements OnDestroy {
  container: ClrAbstractContainer;
  private _controls: NgControl[] = [];

  // Observable to subscribe to the control, since its not available immediately for projected content
  private _controlsChanges = new Subject<NgControl[]>();

  private readonly _states = signal<readonly ControlState[]>([]);

  private readonly statesSubscription = this._controlsChanges
    .pipe(switchMap(controls => (controls.length ? combineLatest(controls.map(controlStateChanges)) : of([]))))
    .subscribe(states => this._states.set(states));

  get controls() {
    return this._controls;
  }

  get controlsChanges(): Observable<NgControl[]> {
    return this._controlsChanges.asObservable();
  }

  /**
   * The state of each control, in the order of `controls`. Updates on every control event.
   */
  get states(): Signal<readonly ControlState[]> {
    return this._states.asReadonly();
  }

  get hasMultipleControls() {
    return this._controls?.length > 1;
  }

  addControl(control: NgControl) {
    this._controls.push(control);

    this.emitControlsChange(this._controls);
  }

  emitControlsChange(controls: NgControl[]) {
    this._controlsChanges.next(controls);
  }

  ngOnDestroy() {
    this.statesSubscription.unsubscribe();
  }
}
