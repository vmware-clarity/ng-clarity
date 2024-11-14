/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ColumnState } from '../interfaces/column-state.interface';

export const COLUMN_STATE = new InjectionToken<ColumnState>('COLUMN_STATE');

export function columnStateFactory() {
  return new BehaviorSubject<ColumnState>({
    changes: [],
  });
}

export const COLUMN_STATE_PROVIDER = {
  provide: COLUMN_STATE,
  useFactory: columnStateFactory,
};
