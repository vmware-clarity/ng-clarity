/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

export class PageCollectionMock {
  private _pagesReset = new Subject<boolean>();
  get pagesReset(): Observable<boolean> {
    return this._pagesReset.asObservable();
  }

  private _stepItemIdWasCalled = false;
  getStepItemIdForPage(): string {
    this._stepItemIdWasCalled = true;
    return 'mock-id';
  }

  get stepItemIdWasCalled(): boolean {
    return this._stepItemIdWasCalled;
  }

  _previousPageIsCompleted = true;

  // eslint-disable-next-line
  public previousPageIsCompleted(_page: any = null): boolean {
    return this._previousPageIsCompleted;
  }
}
