/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { ClrLoadingState } from '../../utils/loading/loading';

let nbRow = 0;

@Injectable()
export class DatagridIfExpandService extends IfExpandService {
  expandableId = '';

  private _replace = new BehaviorSubject(false);
  private _animate = new Subject<boolean>();

  constructor() {
    super();
    nbRow++;
    this.expandableId = 'clr-dg-expandable-row-' + nbRow;
  }
  // due to the es5 spec if the set is overridden on base class the getter must also be overridden
  override get expanded(): boolean {
    return this._expanded;
  }
  override set expanded(value: boolean) {
    value = !!value;
    if (value !== this._expanded) {
      this._expanded = value;
      this._animate.next();
      this._expandChange.next(value);
    }
  }

  get replace(): Observable<boolean> {
    return this._replace.asObservable();
  }

  get animate(): Observable<boolean> {
    return this._animate.asObservable();
  }

  override loadingStateChange(state: ClrLoadingState) {
    super.loadingStateChange(state);
    if (state !== ClrLoadingState.LOADING) {
      this._animate.next();
    }
  }

  setReplace(replaceValue: boolean) {
    this._replace.next(replaceValue);
  }
}
