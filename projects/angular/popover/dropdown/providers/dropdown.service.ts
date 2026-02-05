/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class RootDropdownService {
  private _changes = new Subject<boolean>();

  get changes(): Observable<boolean> {
    return this._changes.asObservable();
  }

  closeMenus(): void {
    this._changes.next(false);
  }
}

export function clrRootDropdownFactory(existing: RootDropdownService) {
  return existing || new RootDropdownService();
}

export const ROOT_DROPDOWN_PROVIDER = {
  provide: RootDropdownService,
  useFactory: clrRootDropdownFactory,
  deps: [[new Optional(), new SkipSelf(), RootDropdownService]],
};
