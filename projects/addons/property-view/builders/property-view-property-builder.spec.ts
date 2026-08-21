/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType } from '../property-view.model';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';
import { PropertyViewPropertyKeyBuilder } from './property-view-property-key-builder';
import { PropertyViewPropertyValueBuilder } from './property-view-property-value-builder';
import { PropertyViewPropertyValueComponentBuilder } from './property-view-property-value-component-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewPropertyBuilder', function () {
  const nullCategoryBuilder: PropertyViewCategoryBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;
  const nullPropertyBuilder: PropertyViewPropertyBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewPropertyBuilder(nullSectionBuilder)).not.toThrow();
    });
  });

  describe('keyBuilder() method', function () {
    it('should return a PropertyViewPropertyKeyBuilder instance with default values', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      expect(propertyBuilder.keyBuilder()).toEqual(new PropertyViewPropertyKeyBuilder(propertyBuilder));
    });

    it('should return the same PropertyViewPropertyKeyBuilder instance on each invocation', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      expect(propertyBuilder.keyBuilder()).toBe(propertyBuilder.keyBuilder());
    });
  });

  describe('getValueBuilders() method', function () {
    it('should return a shallow copy of all child PropertyViewPropertyValueBuilder instances', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const valueBuilder1 = propertyBuilder.valueBuilder();
      const valueBuilder2 = propertyBuilder.valueBuilder();

      const valueBuilders = propertyBuilder.getValueBuilders();
      expect(valueBuilders).not.toBe(propertyBuilder.getValueBuilders());
      expect(valueBuilders.length).toEqual(2);
      expect(valueBuilders[0]).toBe(valueBuilder1);
      expect(valueBuilders[1]).toBe(valueBuilder2);
    });
  });

  describe('valueBuilder() method', function () {
    it('should return a PropertyViewPropertyValueBuilder instance with default values', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const valueBuilder = propertyBuilder.valueBuilder();

      expect(valueBuilder).toEqual(new PropertyViewPropertyValueBuilder(propertyBuilder));
      expect(propertyBuilder.getValueBuilders()).toEqual([valueBuilder]);
    });

    it('should return a new PropertyViewPropertyValueBuilder instance on each invocation', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const valueBuilder1 = propertyBuilder.valueBuilder();
      const valueBuilder2 = propertyBuilder.valueBuilder();

      expect(valueBuilder1).not.toBe(valueBuilder2);
      expect(propertyBuilder.getValueBuilders()).toEqual([valueBuilder1, valueBuilder2]);
    });
  });
  describe('valueComponentBuilder() method', function () {
    it('should return a PropertyViewPropertyValueBuilder instance with default values', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const valueBuilder = propertyBuilder.valueComponentBuilder();

      expect(valueBuilder).toEqual(new PropertyViewPropertyValueComponentBuilder(propertyBuilder));
      expect(propertyBuilder.getValueBuilders()).toEqual([valueBuilder]);
    });

    it('should return a new PropertyViewPropertyValueComponentBuilder instance on each invocation', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const valueBuilder1 = propertyBuilder.valueComponentBuilder();
      const valueBuilder2 = propertyBuilder.valueComponentBuilder();

      expect(valueBuilder1).not.toBe(valueBuilder2);
      expect(propertyBuilder.getValueBuilders()).toEqual([valueBuilder1, valueBuilder2]);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelItemType.Property', function () {
        const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

        expect(propertyBuilder.build().type).toBe(PropertyViewModelType.Property);
      });
    });

    describe('result model key', function () {
      it('should be the result model of the key builder', function () {
        const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

        const keyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder).text('key');

        spyOn(propertyBuilder, 'keyBuilder').and.returnValue(keyBuilder);

        expect(propertyBuilder.build().key).toEqual(keyBuilder.build());
      });
    });

    describe('result model content', function () {
      it('should be the result models of all value builders', function () {
        const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

        const valueBuilder1 = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);
        const valueBuilder2 = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);
        const valueBuilder3 = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        spyOn(propertyBuilder, 'getValueBuilders').and.returnValue([valueBuilder1, valueBuilder3, valueBuilder2]);

        expect(propertyBuilder.build().content).toEqual([
          valueBuilder1.build(),
          valueBuilder3.build(),
          valueBuilder2.build(),
        ]);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const propertyBuilderClone = propertyBuilder.clone(nullSectionBuilder);

      expect(propertyBuilderClone).toEqual(propertyBuilder);
      expect(propertyBuilderClone).not.toBe(propertyBuilder);
    });

    it('should deep clone key builder', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      const keyBuilder = new PropertyViewPropertyKeyBuilder(nullPropertyBuilder);
      const keyBuilderCloneSpy = spyOn(keyBuilder, 'clone').and.callThrough();

      spyOn(propertyBuilder, 'keyBuilder').and.returnValue(keyBuilder);

      const propertyBuilderClone = propertyBuilder.clone(nullSectionBuilder);
      expect(keyBuilderCloneSpy.calls.mostRecent().args).toEqual([propertyBuilderClone]);

      const keyBuilderClone: PropertyViewPropertyKeyBuilder = keyBuilderCloneSpy.calls.mostRecent().returnValue;
      expect(propertyBuilderClone.keyBuilder()).toBe(keyBuilderClone);
    });

    it('should deep clone value builders', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);

      const valueBuilder1 = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);
      const valueBuilder1CloneSpy = spyOn(valueBuilder1, 'clone').and.callThrough();

      const valueBuilder2 = new PropertyViewPropertyValueBuilder(nullPropertyBuilder);
      const valueBuilder2CloneSpy = spyOn(valueBuilder2, 'clone').and.callThrough();

      spyOn(propertyBuilder, 'getValueBuilders').and.returnValue([valueBuilder1, valueBuilder2]);

      const propertyBuilderClone = propertyBuilder.clone(nullSectionBuilder);
      expect(valueBuilder1CloneSpy.calls.mostRecent().args).toEqual([propertyBuilderClone]);
      expect(valueBuilder2CloneSpy.calls.mostRecent().args).toEqual([propertyBuilderClone]);

      const propertyBuilderCloneValueBuilders = propertyBuilderClone.getValueBuilders();
      const valueBuilder1Clone: PropertyViewPropertyValueBuilder = valueBuilder1CloneSpy.calls.mostRecent().returnValue;
      const valueBuilder2Clone: PropertyViewPropertyValueBuilder = valueBuilder2CloneSpy.calls.mostRecent().returnValue;
      expect(propertyBuilderCloneValueBuilders.length).toEqual(2);
      expect(propertyBuilderCloneValueBuilders[0]).toBe(valueBuilder1Clone);
      expect(propertyBuilderCloneValueBuilders[1]).toBe(valueBuilder2Clone);
    });

    it('should not clone the parent', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const propertyBuilder = sectionBuilder.propertyBuilder();
      expect(propertyBuilder.exit()).toBe(sectionBuilder);

      const propertyBuilderClone = propertyBuilder.clone(nullSectionBuilder);
      expect(propertyBuilderClone.exit()).toBe(nullSectionBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      expect(propertyBuilder.exit()).toBe(nullSectionBuilder);

      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      expect(sectionBuilder.propertyBuilder().exit()).toBe(sectionBuilder);
    });
  });
});
