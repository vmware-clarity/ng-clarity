/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewLinkModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';
import { PropertyViewPropertyValueBuilder } from './property-view-property-value-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewPropertyValueBuilder', function () {
  const nullPropertyBuilder: PropertyViewPropertyBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewPropertyValueBuilder(nullPropertyBuilder)).not.toThrow();
    });
  });

  describe('text() method', function () {
    it('should return the builder with empty text', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

      expect(propertyValueBuilder.text('')).toBe(propertyValueBuilder);
    });
  });

  describe('icon() method', function () {
    it('should return the builder with no icon', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

      expect(propertyValueBuilder.icon('')).toBe(propertyValueBuilder);
    });
  });

  describe('link() method', function () {
    it('should return the builder', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

      expect(propertyValueBuilder.link({ clickHandler: () => null })).toBe(propertyValueBuilder);
    });
  });

  describe('getLink() method', function () {
    it('should return the last link set', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

      const link1 = { clickHandler: (): void => {} };
      propertyValueBuilder.link(link1);
      expect(propertyValueBuilder.getLink()).toBe(link1);

      const link2 = { clickHandler: (): void => {} };
      propertyValueBuilder.link(link2);
      expect(propertyValueBuilder.getLink()).toBe(link2);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelItemType.PropertyValue', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().type).toBe(PropertyViewModelType.PropertyValue);
      });
    });

    describe('result model text', function () {
      it('should be null when text was not set', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().text).toBe(null);
      });

      it('should be the last set text', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        propertyValueBuilder.text('');
        expect(propertyValueBuilder.build().text).toBe('');

        propertyValueBuilder.text('text');
        expect(propertyValueBuilder.build().text).toBe('text');
      });
    });

    describe('result model icon', function () {
      it('should be null when an icon was not set', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().icon).toBe(null);
      });

      it('should be the last set icon', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        propertyValueBuilder.icon('');
        expect(propertyValueBuilder.build().icon).toBe('');

        propertyValueBuilder.icon('icon');
        expect(propertyValueBuilder.build().icon).toBe('icon');
      });
    });

    describe('result model link', function () {
      it('should be null when link was not set', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().link).toBe(null);
      });

      it('should be the last set link', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);

        const link1: PropertyViewLinkModel = { clickHandler: () => null };
        propertyValueBuilder.link(link1);
        expect(propertyValueBuilder.build().link).toBe(link1);

        const link2: PropertyViewLinkModel = { clickHandler: () => null };
        propertyValueBuilder.link(link2);
        expect(propertyValueBuilder.build().link).toBe(link2);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder).text('text').icon('icon');
      const propertyValueBuilderClone = propertyValueBuilder.clone(nullPropertyBuilder);

      expect(propertyValueBuilderClone).toEqual(propertyValueBuilder);
      expect(propertyValueBuilderClone).not.toBe(propertyValueBuilder);
    });

    it('should copy link', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder).link({
        clickHandler: () => null,
      });
      const propertyValueBuilderClone = propertyValueBuilder.clone(nullPropertyBuilder);

      // This field value is not cloned as it might contain external types.
      expect(propertyValueBuilderClone.getLink()).toBe(propertyValueBuilder.getLink());
    });

    it('should not clone the parent', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      const propertyValueBuilder = propertyBuilder.valueBuilder();
      expect(propertyValueBuilder.exit()).toBe(propertyBuilder);

      const propertyValueBuilderClone = propertyValueBuilder.clone(nullPropertyBuilder);
      expect(propertyValueBuilderClone.exit()).toBe(nullPropertyBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);
      expect(propertyValueBuilder.exit()).toBe(nullPropertyBuilder);

      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      expect(propertyBuilder.valueBuilder().exit()).toBe(propertyBuilder);
    });
  });
});
