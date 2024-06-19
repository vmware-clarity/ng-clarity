/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ColumnState } from '../interfaces/column-state.interface';
import { HIDDEN_COLUMN_CLASS, STRICT_WIDTH_CLASS } from '../render/constants';

export class CellState {
  setWidth(state: ColumnState, cell: HTMLElement) {
    if (state.strictWidth) {
      cell.classList.add(STRICT_WIDTH_CLASS);
    } else {
      cell.classList.remove(STRICT_WIDTH_CLASS);
    }
    cell.style.width = state.width + 'px';
  }

  setHidden(state: ColumnState, cell: HTMLElement) {
    if (state.hidden) {
      cell.classList.add(HIDDEN_COLUMN_CLASS);
    } else {
      cell.classList.remove(HIDDEN_COLUMN_CLASS);
    }
  }
}
