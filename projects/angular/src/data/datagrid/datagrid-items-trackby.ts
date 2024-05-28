/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, Optional, TrackByFunction } from '@angular/core';

import { columnToggleTrackByFn } from './datagrid-column-toggle-trackby';
import { Items } from './providers/items';

@Directive({
  selector: '[ngForTrackBy]',
})
export class ClrDatagridItemsTrackBy<T = any> {
  constructor(@Optional() private _items: Items<T>) {}

  @Input('ngForTrackBy')
  set trackBy(value: TrackByFunction<T>) {
    /**
     * This is a workaround to prevent the items `trackBy` function from
     * being replaced when the "manage columns" button is clicked. This is
     * not a complete solution. If there is another `ngForTrackBy` function
     * within the datagrid in application code, it could sill replace the
     * items `trackBy` function whether it is the row iterator or not.
     */
    if (value === columnToggleTrackByFn) {
      return;
    }

    if (this._items) {
      this._items.iteratorTrackBy = value;
    }
  }
}
