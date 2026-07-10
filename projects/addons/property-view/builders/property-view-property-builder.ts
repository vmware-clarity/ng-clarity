/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewModelType, PropertyViewPropertyModel } from '../property-view.model';
import { PropertyViewPropertyKeyBuilder } from './property-view-property-key-builder';
import { PropertyViewPropertyValueBuilder } from './property-view-property-value-builder';
import { PropertyViewPropertyValueComponentBuilder } from './property-view-property-value-component-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

export class PropertyViewPropertyBuilder {
  private parent: PropertyViewSectionBuilder;
  #keyBuilder: PropertyViewPropertyKeyBuilder;
  #valueBuilders: Array<PropertyViewPropertyValueBuilder | PropertyViewPropertyValueComponentBuilder<any>>;

  constructor(parent: PropertyViewSectionBuilder) {
    this.parent = parent;
    this.#keyBuilder = new PropertyViewPropertyKeyBuilder(this);
    this.#valueBuilders = [];
  }

  keyBuilder(): PropertyViewPropertyKeyBuilder {
    return this.#keyBuilder;
  }

  getValueBuilders(): Array<PropertyViewPropertyValueBuilder | PropertyViewPropertyValueComponentBuilder<any>> {
    return this.#valueBuilders.concat();
  }

  valueBuilder(): PropertyViewPropertyValueBuilder {
    const result = new PropertyViewPropertyValueBuilder(this);
    this.#valueBuilders.push(result);

    return result;
  }

  valueComponentBuilder<T = any>(): PropertyViewPropertyValueComponentBuilder<T> {
    const result = new PropertyViewPropertyValueComponentBuilder<T>(this);
    this.#valueBuilders.push(result);
    return result;
  }

  build(): PropertyViewPropertyModel {
    return {
      type: PropertyViewModelType.Property,
      key: this.keyBuilder().build(),
      content: this.getValueBuilders().map(builder => builder.build()),
    };
  }

  clone(parentClone: PropertyViewSectionBuilder): PropertyViewPropertyBuilder {
    const result = new PropertyViewPropertyBuilder(parentClone);
    result.#keyBuilder = this.keyBuilder().clone(result);
    result.#valueBuilders = this.getValueBuilders().map(builder => builder.clone(result));

    return result;
  }

  exit(): PropertyViewSectionBuilder {
    return this.parent;
  }
}
