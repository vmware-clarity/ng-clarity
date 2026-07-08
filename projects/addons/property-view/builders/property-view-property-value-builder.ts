/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewLinkModel, PropertyViewModelType, PropertyViewPropertyValueModel } from '../property-view.model';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';

export class PropertyViewPropertyValueBuilder {
  private parent: PropertyViewPropertyBuilder;
  #text: string | null;
  #icon: string | null;
  #link: PropertyViewLinkModel | null;

  constructor(parent: PropertyViewPropertyBuilder) {
    this.parent = parent;
    this.#text = null;
    this.#icon = null;
    this.#link = null;
  }

  text(value: string | boolean | number | null): PropertyViewPropertyValueBuilder {
    this.#text = value !== null ? value.toString() : null;

    return this;
  }

  icon(value: string | null): PropertyViewPropertyValueBuilder {
    this.#icon = value;

    return this;
  }

  link(value: PropertyViewLinkModel | null): PropertyViewPropertyValueBuilder {
    this.#link = value;

    return this;
  }

  getLink(): PropertyViewLinkModel | null {
    return this.#link;
  }

  build(): PropertyViewPropertyValueModel {
    return {
      type: PropertyViewModelType.PropertyValue,
      text: this.#text,
      icon: this.#icon,
      link: this.#link,
    };
  }

  clone(parentClone: PropertyViewPropertyBuilder): PropertyViewPropertyValueBuilder {
    const result = new PropertyViewPropertyValueBuilder(parentClone);
    result.#text = this.#text;
    result.#icon = this.#icon;
    // This field value is not cloned as it might contain external types.
    result.#link = this.#link;

    return result;
  }

  exit(): PropertyViewPropertyBuilder {
    return this.parent;
  }
}
