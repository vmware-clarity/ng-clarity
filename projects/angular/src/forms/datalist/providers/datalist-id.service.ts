/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

let counter = 0;

@Injectable()
export class DatalistIdService {
  private _id = 'clr-datalist-' + ++counter;
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
