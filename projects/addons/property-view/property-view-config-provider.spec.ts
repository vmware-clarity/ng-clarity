/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { PropertyViewConfig } from './property-view-config';
import { PropertyViewConfigProvider } from './property-view-config-provider';

interface ThisTest {
  propertyViewConfigProvider: PropertyViewConfigProvider;
}

describe('PropertyViewConfigProvider', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyViewConfigProvider],
    });

    testContext.propertyViewConfigProvider = TestBed.inject(PropertyViewConfigProvider);
  });

  it('getConfig() returns the last value set through setConfig()', () => {
    expect(testContext.propertyViewConfigProvider.getConfig()).toBeUndefined();
    testContext.propertyViewConfigProvider.setConfig({ propertyKeyWidthInRem: 20 });
    expect(testContext.propertyViewConfigProvider.getConfig()).toEqual({ propertyKeyWidthInRem: 20 });
  });

  it('config$() method emits the last value', () => {
    const emittedValues: Array<PropertyViewConfig | undefined> = [];
    testContext.propertyViewConfigProvider.config$().subscribe(value => {
      emittedValues.push(value);
    });
    expect(emittedValues).toEqual([undefined]);

    testContext.propertyViewConfigProvider.setConfig({ propertyKeyWidthInRem: 20 });
    expect(emittedValues).toEqual([undefined, { propertyKeyWidthInRem: 20 }]);

    testContext.propertyViewConfigProvider.config$().subscribe(value => {
      emittedValues.push(value);
    });
    expect(emittedValues).toEqual([undefined, { propertyKeyWidthInRem: 20 }, { propertyKeyWidthInRem: 20 }]);
  });
});
