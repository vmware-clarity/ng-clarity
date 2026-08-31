/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { verifyPropertyViewMessage, verifyPropertyViewProperty } from './property-view-test-helper';
import { PropertyViewPropertyBuilder } from '../../property-view/builders/property-view-property-builder';
import { PropertyViewMessageModel, PropertyViewModelType } from '../../property-view/property-view.model';

describe('property-view-test-helper', () => {
  describe('#verifyPropertyViewProperty()', () => {
    it('passes when both key and values match exactly the ', () => {
      const model = new PropertyViewPropertyBuilder(undefined as any)
        .keyBuilder()
        .text('prop-key')
        .exit()
        .valueBuilder()
        .text('value1')
        .exit()
        .valueBuilder()
        .text('value2')
        .exit()
        .build();
      verifyPropertyViewProperty('prop-key', ['value1', 'value2'], model);
    });
  });

  describe('#verifyPropertyViewMessage()', () => {
    it('passes when text and icon value match ', () => {
      const textValue = 'Your Text Value';
      const icon = 'Your Icon Value';

      const messageModel: PropertyViewMessageModel = {
        type: PropertyViewModelType.Message,
        text: textValue,
        icon: icon,
        renderAsHtml: false,
      };

      verifyPropertyViewMessage(textValue, icon, messageModel);
    });
  });
});
