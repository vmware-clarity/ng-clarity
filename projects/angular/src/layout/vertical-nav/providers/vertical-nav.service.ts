/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class VerticalNavService {
  private _animateOnCollapsed = new Subject<boolean>();
  private _collapsedChanged = new Subject<boolean>();
  private _collapsed = false;
  private _collapsible = false;

  get animateOnCollapsed(): Observable<boolean> {
    return this._animateOnCollapsed.asObservable();
  }

  get collapsedChanged(): Observable<boolean> {
    return this._collapsedChanged.asObservable();
  }

  get collapsed(): boolean {
    return this._collapsed;
  }
  set collapsed(value: boolean) {
    value = !!value;
    if (this.collapsible && this._collapsed !== value) {
      this.updateCollapseBehavior(value);
    }
  }

  get collapsible(): boolean {
    return this._collapsible;
  }
  set collapsible(value: boolean) {
    value = !!value;
    if (this._collapsible !== value) {
      if (!value && this.collapsed) {
        this.updateCollapseBehavior(false);
      }
      this._collapsible = value;
    }
  }

  private updateCollapseBehavior(value: boolean): void {
    this._animateOnCollapsed.next(value);
    this._collapsed = value;
    this._collapsedChanged.next(value);
  }
}
