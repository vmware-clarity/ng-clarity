/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewMessageModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

export class PropertyViewMessageBuilder {
  private parent: PropertyViewSectionBuilder;
  #text: string | null;
  #icon: string | null;
  #renderAsHtml: boolean;

  constructor(parent: PropertyViewSectionBuilder) {
    this.parent = parent;
    this.#text = null;
    this.#icon = null;
    this.#renderAsHtml = false;
  }

  text(value: string | null): PropertyViewMessageBuilder {
    this.#text = value;

    return this;
  }

  icon(value: string | null): PropertyViewMessageBuilder {
    this.#icon = value;

    return this;
  }

  renderAsHtml(value: boolean): PropertyViewMessageBuilder {
    this.#renderAsHtml = value;

    return this;
  }

  build(): PropertyViewMessageModel {
    return {
      type: PropertyViewModelType.Message,
      text: this.#text,
      icon: this.#icon,
      renderAsHtml: this.#renderAsHtml,
    };
  }

  clone(parentClone: PropertyViewSectionBuilder): PropertyViewMessageBuilder {
    const result = new PropertyViewMessageBuilder(parentClone);
    result.#text = this.#text;
    result.#icon = this.#icon;
    result.#renderAsHtml = this.#renderAsHtml;

    return result;
  }

  exit(): PropertyViewSectionBuilder {
    return this.parent;
  }
}
