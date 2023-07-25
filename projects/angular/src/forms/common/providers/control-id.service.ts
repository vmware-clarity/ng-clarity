/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

let counter = 0;

@Injectable()
export class ControlIdService {
  private _id = 'clr-form-control-' + ++counter;
  private _idChange = new BehaviorSubject(this._id);

  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    this._idChange.next(value);
  }

  get idChange(): Observable<string> {
    return this._idChange.asObservable();
  }
}
