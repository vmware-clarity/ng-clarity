/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { angleIcon, ClarityIcons, filterGridIcon, plusIcon, searchIcon, windowCloseIcon } from '@clr/angular/icon';

import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { DatagridFiltersUserService } from './datagrid-filters-user-service';
import {
  AppfxDatagridFiltersModule,
  datagridFiltersStringsServiceFactory,
  datagridFiltersUserServiceFactory,
} from './datagrid-filters.module';

describe('DatagridFiltersModule', () => {
  it('registers clarity icons on initialization', () => {
    spyOn(ClarityIcons, 'addIcons').and.returnValue();
    new AppfxDatagridFiltersModule();
    expect(ClarityIcons.addIcons).toHaveBeenCalledOnceWith(
      angleIcon,
      filterGridIcon,
      plusIcon,
      searchIcon,
      windowCloseIcon
    );
  });

  it('provides filters strings service factory', () => {
    const datagridFiltersStrings = new DatagridFiltersStrings();
    const stringsServiceFactory = datagridFiltersStringsServiceFactory(datagridFiltersStrings);
    expect(stringsServiceFactory).toEqual(datagridFiltersStrings);
  });

  it('provides filters users service factory', () => {
    const datagridFiltersUsers = new DatagridFiltersUserService();
    const usersServiceFactory = datagridFiltersUserServiceFactory(datagridFiltersUsers);
    expect(usersServiceFactory).toEqual(datagridFiltersUsers);
  });
});
