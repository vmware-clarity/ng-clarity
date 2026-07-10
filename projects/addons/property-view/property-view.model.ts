/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Type } from '@angular/core';

export enum PropertyViewModelType {
  Message = 'Message',
  PropertyValue = 'PropertyValue',
  PropertyKey = 'PropertyKey',
  Property = 'Property',
  Section = 'Section',
  Category = 'Category',
  PropertyValueComponent = 'PropertyValueComponent',
}

export interface PropertyViewActionModel {
  title: string;
  isEnabled: boolean;
  clickHandler: () => void;
}

export interface PropertyViewLinkModel {
  clickHandler: () => void;
}

export interface PropertyViewMessageModel {
  type: PropertyViewModelType.Message;
  text: string | null;
  icon: string | null;
  renderAsHtml: boolean;
}

export interface PropertyViewPropertyKeyModel {
  type: PropertyViewModelType.PropertyKey;
  text: string | null;
  icon: string | null;
}

export interface PropertyViewPropertyValueModel {
  type: PropertyViewModelType.PropertyValue;
  text: string | null;
  icon: string | null;
  link: PropertyViewLinkModel | null;
}

export interface PropertyViewPropertyValueComponent<T> {
  model?: T | null;
}

export interface PropertyViewPropertyValueComponentModel<T> {
  type: PropertyViewModelType.PropertyValueComponent;
  componentType?: Type<PropertyViewPropertyValueComponent<T>> | null;
  componentModel?: T | null;
}

export interface PropertyViewPropertyModel {
  type: PropertyViewModelType.Property;
  key: PropertyViewPropertyKeyModel;
  content: Array<PropertyViewPropertyValueModel | PropertyViewPropertyValueComponentModel<any>>;
}

export interface PropertyViewSectionModel {
  type: PropertyViewModelType.Section;
  id: string;
  renderAsHtml: boolean;
  title: string | null;
  titleIcon: string | null;
  actions: Array<PropertyViewActionModel>;
  content: Array<PropertyViewPropertyModel | PropertyViewMessageModel>;
  collapseContent: boolean;
}

export interface PropertyViewCategoryModel {
  type: PropertyViewModelType.Category;
  id: string;
  title: string | null;
  content: Array<PropertyViewSectionModel>;
}

export interface PropertyViewModel {
  categories: Array<PropertyViewCategoryModel>;
}
