/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType } from '../property-view.model';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewMessageBuilder } from './property-view-message-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewMessageBuilder', function () {
  const nullCategoryBuilder: PropertyViewCategoryBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewMessageBuilder(nullSectionBuilder)).not.toThrow();
    });
  });

  describe('text() method', function () {
    it('should return the builder with empty text', function () {
      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

      expect(messageBuilder.text('')).toBe(messageBuilder);
    });
  });

  describe('icon() method', function () {
    it('should return the builder with no icon', function () {
      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

      expect(messageBuilder.icon('')).toBe(messageBuilder);
    });
  });

  describe('renderAsHtml() method', function () {
    it('should return the builder', function () {
      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

      expect(messageBuilder.renderAsHtml(true)).toBe(messageBuilder);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelItemType.Message', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        expect(messageBuilder.build().type).toBe(PropertyViewModelType.Message);
      });
    });

    describe('result model icon', function () {
      it('should be null when an icon was not set', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        expect(messageBuilder.build().icon).toBe(null);
      });

      it('should be the last set icon', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        messageBuilder.icon('');
        expect(messageBuilder.build().icon).toBe('');

        messageBuilder.icon('icon');
        expect(messageBuilder.build().icon).toBe('icon');
      });
    });

    describe('result model text', function () {
      it('should be null when text was not set', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        expect(messageBuilder.build().text).toBe(null);
      });

      it('should be the last set text', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        messageBuilder.text('');
        expect(messageBuilder.build().text).toBe('');

        messageBuilder.text('text');
        expect(messageBuilder.build().text).toBe('text');
      });
    });

    describe('result model renderAsHtml', function () {
      it('should be false when renderAsHtml was not set', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        expect(messageBuilder.build().renderAsHtml).toBe(false);
      });

      it('should be the last set renderAsHtml', function () {
        const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);

        messageBuilder.renderAsHtml(true);
        expect(messageBuilder.build().renderAsHtml).toBe(true);

        messageBuilder.renderAsHtml(false);
        expect(messageBuilder.build().renderAsHtml).toBe(false);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder)
        .text('text')
        .icon('icon')
        .renderAsHtml(true);
      const messageBuilderClone = messageBuilder.clone(nullSectionBuilder);

      expect(messageBuilderClone).toEqual(messageBuilder);
      expect(messageBuilderClone).not.toBe(messageBuilder);
    });

    it('should not clone the parent', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const messageBuilder = sectionBuilder.messageBuilder();
      expect(messageBuilder.exit()).toBe(sectionBuilder);

      const messageBuilderClone = messageBuilder.clone(nullSectionBuilder);
      expect(messageBuilderClone.exit()).toBe(nullSectionBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);
      expect(messageBuilder.exit()).toBe(nullSectionBuilder);

      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      expect(sectionBuilder.messageBuilder().exit()).toBe(sectionBuilder);
    });
  });
});
