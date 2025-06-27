/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class ColumnNameService {
  change: EventEmitter<string> = new EventEmitter<string>();
  private _name = '';

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (this._name !== value) {
      this._name = value;
      this.change.emit(this._name);
    }
  }
}
