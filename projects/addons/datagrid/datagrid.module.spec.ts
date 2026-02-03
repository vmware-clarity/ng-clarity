/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppfxDatagridModule, datagridStringsServiceFactory } from './datagrid.module';
import { DatagridStrings } from './i18n/datagrid-strings.service';
import { ErrorNotifiable } from './interfaces/tokens';

describe('AppfxDatagridModule', () => {
  let module: AppfxDatagridModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppfxDatagridModule],
    });
    module = TestBed.inject(AppfxDatagridModule);
  });

  it('should create an instance of the module', () => {
    const mockErrorService = {} as Type<ErrorNotifiable>;
    const forRootResult = AppfxDatagridModule.forRoot(mockErrorService);
    expect(forRootResult).toBeDefined();
    expect(module).toBeTruthy();
  });

  it('provides filters strings service factory', () => {
    const datagridStrings = new DatagridStrings();
    const stringsServiceFactory = datagridStringsServiceFactory(datagridStrings);
    expect(stringsServiceFactory).toEqual(datagridStrings);
  });
});
