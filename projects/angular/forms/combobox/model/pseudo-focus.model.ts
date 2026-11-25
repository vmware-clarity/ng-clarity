/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SingleSelectComboboxModel } from './single-select-combobox.model';

export class PseudoFocusModel<T> extends SingleSelectComboboxModel<T> {
  override select(item: T): void {
    if (this.model !== item) {
      this.model = item;
    }
  }
}
