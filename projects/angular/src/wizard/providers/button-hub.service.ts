/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class ButtonHubService {
  buttonsReady = false;

  private _previousBtnClicked = new Subject<any>();
  get previousBtnClicked(): Observable<any> {
    return this._previousBtnClicked.asObservable();
  }

  private _nextBtnClicked = new Subject<any>();
  get nextBtnClicked(): Observable<any> {
    return this._nextBtnClicked.asObservable();
  }

  private _dangerBtnClicked = new Subject<any>();
  get dangerBtnClicked(): Observable<any> {
    return this._dangerBtnClicked.asObservable();
  }

  private _cancelBtnClicked = new Subject<any>();
  get cancelBtnClicked(): Observable<any> {
    return this._cancelBtnClicked.asObservable();
  }

  private _finishBtnClicked = new Subject<any>();
  get finishBtnClicked(): Observable<any> {
    return this._finishBtnClicked.asObservable();
  }

  private _customBtnClicked = new Subject<any>();
  get customBtnClicked(): Observable<any> {
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
