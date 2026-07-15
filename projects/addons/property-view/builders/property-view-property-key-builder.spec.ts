/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType } from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';
import { PropertyViewPropertyKeyBuilder } from './property-view-property-key-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewPropertyKeyBuilder', function () {
  const nullPropertyBuilder: PropertyViewPropertyBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewPropertyKeyBuilder(nullPropertyBuilder)).not.toThrow();
    });
  });

  describe('text() method', function () {
    it('should return the builder', function () {
      const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

      expect(propertyKeyBuilder.text('')).toBe(propertyKeyBuilder);
    });
  });

  describe('icon() method', function () {
    it('should return the builder', function () {
      const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

      expect(propertyKeyBuilder.icon('')).toBe(propertyKeyBuilder);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelItemType.PropertyKey', function () {
        const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

        expect(propertyKeyBuilder.build().type).toBe(PropertyViewModelType.PropertyKey);
      });
    });

    describe('result model text', function () {
      it('should be null when text was not set', function () {
        const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

        expect(propertyKeyBuilder.build().text).toBe(null);
      });

      it('should be the last set text', function () {
        const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

        propertyKeyBuilder.text('');
        expect(propertyKeyBuilder.build().text).toBe('');

        propertyKeyBuilder.text('icon');
        expect(propertyKeyBuilder.build().text).toBe('icon');
      });
    });

    describe('result model icon', function () {
      it('should be null when an icon was not set', function () {
        const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

        expect(propertyKeyBuilder.build().icon).toBe(null);
      });

      it('should be the last set icon', function () {
        const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);

        propertyKeyBuilder.icon('');
        expect(propertyKeyBuilder.build().icon).toBe('');

        propertyKeyBuilder.icon('icon');
        expect(propertyKeyBuilder.build().icon).toBe('icon');
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder).text('text').icon('icon');
      const propertyKeyBuilderClone = propertyKeyBuilder.clone(nullPropertyBuilder);

      expect(propertyKeyBuilderClone).toEqual(propertyKeyBuilder);
      expect(propertyKeyBuilderClone).not.toBe(propertyKeyBuilder);
    });

    it('should not clone the parent', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      const propertyKeyBuilder = propertyBuilder.keyBuilder();
      expect(propertyKeyBuilder.exit()).toBe(propertyBuilder);

      const propertyKeyBuilderClone = propertyKeyBuilder.clone(nullPropertyBuilder);
      expect(propertyKeyBuilderClone.exit()).toBe(nullPropertyBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const propertyKeyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);
      expect(propertyKeyBuilder.exit()).toBe(nullPropertyBuilder);

      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      expect(propertyBuilder.keyBuilder().exit()).toBe(propertyBuilder);
    });
  });
});
