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

describe('PropertyViewConfigProvider', function () {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      providers: [PropertyViewConfigProvider],
    });

    this.propertyViewConfigProvider = TestBed.inject(PropertyViewConfigProvider);
  });

  it('getConfig() returns the last value set through setConfig()', function (this: ThisTest) {
    expect(this.propertyViewConfigProvider.getConfig()).toBeUndefined();
    this.propertyViewConfigProvider.setConfig({ propertyKeyWidthInRem: 20 });
    expect(this.propertyViewConfigProvider.getConfig()).toEqual({ propertyKeyWidthInRem: 20 });
  });

  it('config$() method emits the last value', function (this: ThisTest) {
    const emittedValues: Array<PropertyViewConfig | undefined> = [];
    this.propertyViewConfigProvider.config$().subscribe(value => {
      emittedValues.push(value);
    });
    expect(emittedValues).toEqual([undefined]);

    this.propertyViewConfigProvider.setConfig({ propertyKeyWidthInRem: 20 });
    expect(emittedValues).toEqual([undefined, { propertyKeyWidthInRem: 20 }]);

    this.propertyViewConfigProvider.config$().subscribe(value => {
      emittedValues.push(value);
    });
    expect(emittedValues).toEqual([undefined, { propertyKeyWidthInRem: 20 }, { propertyKeyWidthInRem: 20 }]);
  });
});
