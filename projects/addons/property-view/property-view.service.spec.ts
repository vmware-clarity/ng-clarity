/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { PropertyViewBuilder } from './builders/property-view-builder';
import { PropertyViewService } from './property-view.service';

interface ThisTest {
  propertyViewService: PropertyViewService;
}

describe('PropertyViewService', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyViewService],
    });

    testContext.propertyViewService = TestBed.inject(PropertyViewService);
  });

  describe('createPropertyViewBuilder() method', () => {
    it('should return a PropertyViewBuilder', () => {
      const propertyViewBuilder = testContext.propertyViewService.createPropertyViewBuilder();

      expect(propertyViewBuilder).toEqual(jasmine.any(PropertyViewBuilder));
    });

    it('should return a new PropertyViewBuilder instance on each invocation', () => {
      const propertyViewBuilder1 = testContext.propertyViewService.createPropertyViewBuilder();
      const propertyViewBuilder2 = testContext.propertyViewService.createPropertyViewBuilder();

      expect(propertyViewBuilder1).not.toBe(propertyViewBuilder2);
    });
  });
});
