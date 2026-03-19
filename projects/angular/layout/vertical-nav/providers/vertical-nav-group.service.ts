/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export enum ExpandAnimationState {
  EXPANDED = 'expanded',
  COLLAPSED = 'collapsed',
}

@Injectable()
export class VerticalNavGroupService {
  private _expandChange = new Subject<boolean>();
  private _expandAnimationState = new BehaviorSubject<ExpandAnimationState>(ExpandAnimationState.COLLAPSED);

  get expandChange(): Observable<boolean> {
    return this._expandChange.asObservable();
  }

  get expandAnimationState(): Observable<ExpandAnimationState> {
    return this._expandAnimationState.asObservable();
  }

  get expandAnimationStateValue(): ExpandAnimationState {
    return this._expandAnimationState.value;
  }

  set expandAnimationStateValue(value: ExpandAnimationState) {
    if (value !== this._expandAnimationState.value) {
      this._expandAnimationState.next(value);
    }
  }

  expand(): void {
    this._expandChange.next(true);
  }
}
