/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Host, Inject, OnDestroy, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { appfxDatagridUserPreferencesToken } from './appfx-datagrid-user-preferences.token';
import { DatagridUserPreferencesService } from './datagrid-user-preferences.interfaces';
import { DatagridComponent } from '../../datagrid.component';

@Directive({
  selector: 'appfx-datagrid',
  standalone: false,
})
export class DatagridContentNoWrapDirective implements OnDestroy {
  private subs = new Subscription();

  /**
   * Constructor, if DatagridUserPreferencesService is provided get wrap grid cell
   * user preference.
   *
   * @param grid
   * @param userPreferencesService - optional, because external projects which use appfx-datagrid may decide not
   *                                 to use this directive and allow their customers to select whether to wrap
   *                                 or not text in columns, in this case, they don't need to provide this service
   *                                 and the grid will have default behavior that will not wrap the text in list columns.
   */
  constructor(
    @Host() private grid: DatagridComponent<unknown>,
    @Optional()
    @Inject(appfxDatagridUserPreferencesToken)
    private userPreferencesService: DatagridUserPreferencesService
  ) {
    if (userPreferencesService) {
      this.subs.add(
        userPreferencesService.getWrapGridCellTextPreference$().subscribe((data: boolean) => {
          grid.wrapText = data;
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
