/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ForTypeAheadProvider {
  private _textContentChange: Subject<string> = new Subject<string>();

  get textContentChange(): Observable<string> {
    return this._textContentChange.asObservable();
  }

  private _textContent: string;

  get textContent() {
    return this._textContent;
  }

  set textContent(value: string) {
    this._textContent = value;
    this._textContentChange.next(value);
  }
}
