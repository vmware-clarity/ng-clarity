/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType, PropertyViewPropertyValueComponent } from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';
import { PropertyViewPropertyValueComponentBuilder } from './property-view-property-value-component-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewPropertyValueComponentBuilder', function () {
  const nullPropertyBuilder: PropertyViewPropertyBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder)).not.toThrow();
    });
  });

  describe('model() method', function () {
    it('should return the builder', function () {
      const propertyValueBuilder: PropertyViewPropertyValueComponentBuilder<MockModel> =
        new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

      expect(propertyValueBuilder.model({ text: 'text' })).toBe(propertyValueBuilder);
    });
  });

  describe('component() method', function () {
    it('should return the builder', function () {
      const propertyValueBuilder: PropertyViewPropertyValueComponentBuilder<MockModel> =
        new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

      expect(propertyValueBuilder.component(MockComponent)).toBe(propertyValueBuilder);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelItemType.PropertyValueComponent', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().type).toBe(PropertyViewModelType.PropertyValueComponent);
      });
    });

    describe('result model componentModel', function () {
      it('should be null when componentModel was not set', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().componentModel).toBe(null);
      });

      it('should be the last set model', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        propertyValueBuilder.model({ text: '' });
        expect(propertyValueBuilder.build().componentModel).toEqual({ text: '' });

        propertyValueBuilder.model({ text: 'text' });
        expect(propertyValueBuilder.build().componentModel).toEqual({ text: 'text' });
      });
    });

    describe('result model component', function () {
      it('should be null when an component was not set', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        expect(propertyValueBuilder.build().componentType).toBe(null);
      });

      it('should be the last set componentType', function () {
        const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);

        propertyValueBuilder.component(MockComponent);
        expect(propertyValueBuilder.build().componentType).toBe(MockComponent);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder)
        .model({ text: 'text' })
        .component(MockComponent);
      const propertyValueBuilderClone = propertyValueBuilder.clone(nullPropertyBuilder);

      expect(propertyValueBuilderClone).toEqual(propertyValueBuilder);
      expect(propertyValueBuilderClone).not.toBe(propertyValueBuilder);
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
      const propertyValueBuilder = new PropertyViewPropertyValueComponentBuilder(nullPropertyBuilder);
      expect(propertyValueBuilder.exit()).toBe(nullPropertyBuilder);

      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      expect(propertyBuilder.valueBuilder().exit()).toBe(propertyBuilder);
    });
  });
});

interface MockModel {
  text: string;
}

class MockComponent implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}
