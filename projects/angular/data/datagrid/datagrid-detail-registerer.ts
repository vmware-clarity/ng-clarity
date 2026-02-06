/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';

import { ExpandableRowsCount } from './providers/global-expandable-rows';

/*
 * I don't think this deserves to be in IfExpanded itself,
 * so I'm adding a second directive on the same selector for now just for the datagrid
 */
@Directive({
  selector: '[clrIfExpanded]',
  standalone: false,
})
export class DatagridDetailRegisterer {
  constructor(@Optional() private expandableRowsCount: ExpandableRowsCount) {
    if (expandableRowsCount) {
      expandableRowsCount.register();
    }
  }

  ngOnDestroy() {
    if (this.expandableRowsCount) {
      this.expandableRowsCount.unregister();
    }
  }
}
