/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { IfExpandService } from '@clr/angular/utils';
import { BehaviorSubject, Observable } from 'rxjs';

let nbRow = 0;

@Injectable()
export class DatagridIfExpandService extends IfExpandService {
  expandableId = '';
  /** Whether the detail animates when it is shown: not when the row is first rendered expanded. */
  animateDetail = false;

  private _replace = new BehaviorSubject(false);

  constructor() {
    super();
    nbRow++;
    this.expandableId = 'clr-dg-expandable-row-' + nbRow;
  }

  get replace(): Observable<boolean> {
    return this._replace.asObservable();
  }

  setReplace(replaceValue: boolean) {
    this._replace.next(replaceValue);
  }
}
