/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class ButtonHubService {
  buttonsReady = false;

  private _previousBtnClicked = new Subject<void>();
  private _nextBtnClicked = new Subject<void>();
  private _dangerBtnClicked = new Subject<void>();
  private _cancelBtnClicked = new Subject<void>();
  private _finishBtnClicked = new Subject<void>();
  private _customBtnClicked = new Subject<string>();

  get previousBtnClicked(): Observable<void> {
    return this._previousBtnClicked.asObservable();
  }

  get nextBtnClicked(): Observable<void> {
    return this._nextBtnClicked.asObservable();
  }

  get dangerBtnClicked(): Observable<void> {
    return this._dangerBtnClicked.asObservable();
  }

  get cancelBtnClicked(): Observable<void> {
    return this._cancelBtnClicked.asObservable();
  }

  get finishBtnClicked(): Observable<void> {
    return this._finishBtnClicked.asObservable();
  }

  get customBtnClicked(): Observable<string> {
    return this._customBtnClicked.asObservable();
  }

  buttonClicked(buttonType: string): void {
    if ('previous' === buttonType) {
      this._previousBtnClicked.next();
    } else if ('next' === buttonType) {
      this._nextBtnClicked.next();
    } else if ('finish' === buttonType) {
      this._finishBtnClicked.next();
    } else if ('danger' === buttonType) {
      this._dangerBtnClicked.next();
    } else if ('cancel' === buttonType) {
      this._cancelBtnClicked.next();
    } else {
      this._customBtnClicked.next(buttonType);
    }
  }
}
