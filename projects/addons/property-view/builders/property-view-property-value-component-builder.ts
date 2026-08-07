/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { Type } from '@angular/core';

import {
  PropertyViewModelType,
  PropertyViewPropertyValueComponent,
  PropertyViewPropertyValueComponentModel,
} from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';

export class PropertyViewPropertyValueComponentBuilder<T> {
  private parent: PropertyViewPropertyBuilder;
  private componentType: Type<PropertyViewPropertyValueComponent<T>> | null;
  private componentModel: T | null;

  constructor(parent: PropertyViewPropertyBuilder) {
    this.parent = parent;
    this.componentType = null;
    this.componentModel = null;
  }

  build(): PropertyViewPropertyValueComponentModel<T> {
    return {
      type: PropertyViewModelType.PropertyValueComponent,
      componentType: this.componentType,
      componentModel: this.componentModel,
    };
  }

  component<U extends T>(
    componentType: Type<PropertyViewPropertyValueComponent<U>>
  ): PropertyViewPropertyValueComponentBuilder<U> {
    this.componentType = componentType;

    return <PropertyViewPropertyValueComponentBuilder<U>>(<unknown>this);
  }

  model<U extends T>(componentModel: U): PropertyViewPropertyValueComponentBuilder<U> {
    this.componentModel = componentModel;

    return <PropertyViewPropertyValueComponentBuilder<U>>(<unknown>this);
  }

  clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyValueComponentBuilder<T> {
    const result = new PropertyViewPropertyValueComponentBuilder<T>(parentClone);
    result.componentType = this.componentType;
    result.componentModel = this.componentModel;

    return result;
  }

  exit(): PropertyViewPropertyBuilder {
    return this.parent;
  }
}
