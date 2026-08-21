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

describe('PropertyViewService', function () {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      providers: [PropertyViewService],
    });

    this.propertyViewService = TestBed.inject(PropertyViewService);
  });

  describe('createPropertyViewBuilder() method', () => {
    it('should return a PropertyViewBuilder', function (this: ThisTest) {
      const propertyViewBuilder = this.propertyViewService.createPropertyViewBuilder();

      expect(propertyViewBuilder).toEqual(jasmine.any(PropertyViewBuilder));
    });

    it('should return a new PropertyViewBuilder instance on each invocation', function (this: ThisTest) {
      const propertyViewBuilder1 = this.propertyViewService.createPropertyViewBuilder();
      const propertyViewBuilder2 = this.propertyViewService.createPropertyViewBuilder();

      expect(propertyViewBuilder1).not.toBe(propertyViewBuilder2);
    });
  });
});
