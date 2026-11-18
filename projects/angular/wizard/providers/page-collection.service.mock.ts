/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class PageCollectionMock {
  private readonly previousCompleted = signal(true);

  private _pagesReset = new Subject<boolean>();
  private _stepItemIdWasCalled = false;

  get _previousPageIsCompleted(): boolean {
    return this.previousCompleted();
  }
  set _previousPageIsCompleted(value: boolean) {
    this.previousCompleted.set(value);
  }

  get pagesReset(): Observable<boolean> {
    return this._pagesReset.asObservable();
  }

  get stepItemIdWasCalled(): boolean {
    return this._stepItemIdWasCalled;
  }

  getStepItemIdForPage(): string {
    this._stepItemIdWasCalled = true;
    return 'mock-id';
  }

  previousPageIsCompleted(_page: any = null): boolean {
    return this._previousPageIsCompleted;
  }
}
