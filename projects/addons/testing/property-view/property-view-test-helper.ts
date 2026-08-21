/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  PropertyViewMessageModel,
  PropertyViewModelType,
  PropertyViewPropertyModel,
  PropertyViewPropertyValueModel,
} from '@clr/addons/property-view';

export function verifyPropertyViewProperty(key: string, value: string[], propertyModel: PropertyViewPropertyModel) {
  expect(propertyModel.type).toEqual(PropertyViewModelType.Property);
  expect(propertyModel.key.text).toEqual(key);
  for (let i = 0; i < value.length; i++) {
    expect((<PropertyViewPropertyValueModel>propertyModel.content[i]).text).toEqual(value[i]);
  }
}

export function verifyPropertyViewMessage(textValue: string, icon: string, messageModel: PropertyViewMessageModel) {
  expect(messageModel.type).toEqual(PropertyViewModelType.Message);
  expect(messageModel.text).toEqual(textValue);
  expect(messageModel.icon).toEqual(icon);
}
