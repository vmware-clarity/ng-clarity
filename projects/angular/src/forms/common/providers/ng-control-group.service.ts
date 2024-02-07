/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Helpers {
  show?: boolean;
  showInvalid?: boolean;
  showValid?: boolean;
  showHelper?: boolean;
}

// TODO: Better naming would be GroupContainerNgControlsAndMessagesService
@Injectable()
export class NgControlGroupService {
  // Observable to subscribe to the control, since its not available immediately for projected content
  private _controlChanges = new BehaviorSubject<NgControl[]>([]);
  // private _controlChangesBehavior = new BehaviorSubject<NgControl>();

  private _helpers = new Subject<Helpers>();

  get controlChanges(): Observable<NgControl[]> {
    return this._controlChanges.asObservable();
  }

  get helpersChange(): Observable<Helpers> {
    return this._helpers.asObservable();
  }

  setControl(control: NgControl) {
    console.log('in set control', this._controlChanges.value, [...this._controlChanges.value, control]);
    this._controlChanges.next([...this._controlChanges.value, control]);
  }

  setHelpers(state: Helpers) {
    this._helpers.next(state);
  }
}
