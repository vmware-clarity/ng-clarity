/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/* eslint-disable @typescript-eslint/parameter-properties */
import { PropertyViewActionModel, PropertyViewModelType, PropertyViewSectionModel } from '../property-view.model';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewMessageBuilder } from './property-view-message-builder';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';

type PropertyValueTextItemType = string | number | boolean;

export class PropertyViewSectionBuilder {
  private parent: PropertyViewCategoryBuilder;
  private id: string;
  private contentBuilders: Array<PropertyViewPropertyBuilder | PropertyViewMessageBuilder>;

  static readonly #infoIconClass = 'vx-icon-info_normal';
  static readonly #warningIconClass = 'vx-icon-warn';
  static readonly #errorIconClass = 'vx-icon-error';

  #renderAsHtml: boolean;
  #collapseContent: boolean;
  #title: string | null;
  #titleIcon: string | null;
  #actions: Array<PropertyViewActionModel>;

  constructor(parent: PropertyViewCategoryBuilder, id: string) {
    this.parent = parent;
    this.id = id;
    this.#renderAsHtml = false;
    this.#collapseContent = false;
    this.#title = null;
    this.#titleIcon = null;
    this.#actions = [];
    this.contentBuilders = [];
  }

  getId(): string {
    return this.id;
  }

  renderAsHtml(value: boolean): PropertyViewSectionBuilder {
    this.#renderAsHtml = value;

    return this;
  }

  collapseContent(value: boolean): PropertyViewSectionBuilder {
    this.#collapseContent = value;

    return this;
  }

  title(value: string | null): PropertyViewSectionBuilder {
    this.#title = value;

    return this;
  }

  titleIcon(value: string | null): PropertyViewSectionBuilder {
    this.#titleIcon = value;

    return this;
  }

  action(value?: PropertyViewActionModel | null): PropertyViewSectionBuilder {
    if (value) {
      this.#actions.push(value);
    }

    return this;
  }

  getActions(): Array<PropertyViewActionModel> {
    return this.#actions.concat();
  }

  propertyBuilder(): PropertyViewPropertyBuilder {
    const result = new PropertyViewPropertyBuilder(this);
    this.contentBuilders.push(result);

    return result;
  }

  property(
    key: string,
    values?: Array<PropertyValueTextItemType> | PropertyValueTextItemType | null
  ): PropertyViewSectionBuilder {
    let valuesArray: Array<PropertyValueTextItemType>;

    if (values === null || values === undefined) {
      valuesArray = [];
    } else if (values instanceof Array) {
      valuesArray = values;
    } else {
      valuesArray = [values];
    }

    const propertyBuilder = this.propertyBuilder();
    propertyBuilder.keyBuilder().text(key);
    valuesArray.forEach(value => propertyBuilder.valueBuilder().text(value));

    return this;
  }

  messageBuilder(): PropertyViewMessageBuilder {
    const result = new PropertyViewMessageBuilder(this);
    this.contentBuilders.push(result);

    return result;
  }

  message(text: string, icon?: string | null): PropertyViewSectionBuilder {
    const messageBuilder = this.messageBuilder();
    messageBuilder.text(text);
    if (icon) {
      messageBuilder.icon(icon);
    }

    return this;
  }

  info(text: string): PropertyViewSectionBuilder {
    return this.message(text, PropertyViewSectionBuilder.#infoIconClass);
  }

  warning(text: string): PropertyViewSectionBuilder {
    return this.message(text, PropertyViewSectionBuilder.#warningIconClass);
  }

  error(text: string): PropertyViewSectionBuilder {
    return this.message(text, PropertyViewSectionBuilder.#errorIconClass);
  }

  getContentBuilders(): Array<PropertyViewPropertyBuilder | PropertyViewMessageBuilder> {
    return this.contentBuilders.concat();
  }

  build(): PropertyViewSectionModel {
    return {
      type: PropertyViewModelType.Section,
      id: this.id,
      renderAsHtml: this.#renderAsHtml,
      collapseContent: this.#collapseContent,
      title: this.#title,
      titleIcon: this.#titleIcon,
      actions: this.getActions().concat(),
      content: this.getContentBuilders().map(builder => builder.build()),
    };
  }

  clone(parentClone: PropertyViewCategoryBuilder): PropertyViewSectionBuilder {
    const result = new PropertyViewSectionBuilder(parentClone, this.id);
    result.#renderAsHtml = this.#renderAsHtml;
    result.#collapseContent = this.#collapseContent;
    result.#title = this.#title;
    result.#titleIcon = this.#titleIcon;
    // This field value is not cloned as it might contain external types.
    result.#actions = this.getActions().concat();
    result.contentBuilders = this.getContentBuilders().map(builder => builder.clone(result));

    return result;
  }

  exit(): PropertyViewCategoryBuilder {
    return this.parent;
  }
}
