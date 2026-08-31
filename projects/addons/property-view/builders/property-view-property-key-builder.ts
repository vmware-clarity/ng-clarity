/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewModelType, PropertyViewPropertyKeyModel } from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';

export class PropertyViewPropertyKeyBuilder {
  private parent: PropertyViewPropertyBuilder;
  #text: string | null;
  #icon: string | null;

  constructor(parent: PropertyViewPropertyBuilder) {
    this.parent = parent;
    this.#text = null;
    this.#icon = null;
  }

  text(value: string | null): PropertyViewPropertyKeyBuilder {
    this.#text = value;

    return this;
  }

  icon(value: string | null): PropertyViewPropertyKeyBuilder {
    this.#icon = value;

    return this;
  }

  build(): PropertyViewPropertyKeyModel {
    return {
      type: PropertyViewModelType.PropertyKey,
      text: this.#text,
      icon: this.#icon,
    };
  }

  clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyKeyBuilder {
    const result = new PropertyViewPropertyKeyBuilder(parentClone);
    result.#text = this.#text;
    result.#icon = this.#icon;

    return result;
  }

  exit(): PropertyViewPropertyBuilder {
    return this.parent;
  }
}
