/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType } from '../property-view.model';
import { PropertyViewBuilder } from './property-view-builder';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewMessageBuilder } from './property-view-message-builder';
import { PropertyViewPropertyBuilder } from './property-view-property-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewSectionBuilder', function () {
  const nullPropertyViewBuilder: PropertyViewBuilder = <any>null;
  const nullCategoryBuilder: PropertyViewCategoryBuilder = <any>null;
  const nullSectionBuilder: PropertyViewSectionBuilder = <any>null;

  const infoIconClass = 'vx-icon-info_normal';
  const warningIconClass = 'vx-icon-warn';
  const errorIconClass = 'vx-icon-error';

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewSectionBuilder(nullCategoryBuilder, '')).not.toThrow();
    });
  });

  describe('getId() method', function () {
    it('should return the builder id', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-1');

      expect(sectionBuilder.getId()).toBe('section-1');
    });
  });

  describe('renderAsHtml() method', function () {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      expect(sectionBuilder.renderAsHtml(true)).toBe(sectionBuilder);
    });
  });

  describe('collapseContent() method', function () {
    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      expect(sectionBuilder.collapseContent(true)).toBe(sectionBuilder);
    });
  });

  describe('title() method', function () {
    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      expect(sectionBuilder.title('')).toBe(sectionBuilder);
    });
  });

  describe('titleIcon() method', function () {
    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      expect(sectionBuilder.titleIcon('')).toBe(sectionBuilder);
    });
  });

  describe('action() method', function () {
    it('should not add undefined action', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.action();

      expect(sectionBuilder.getActions().length).toEqual(0);
    });

    it('should not add null action', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.action(null);

      expect(sectionBuilder.getActions().length).toEqual(0);
    });

    it('should add action', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const action1 = {
        title: 'action-1',
        isEnabled: true,
        clickHandler: (): void => undefined,
      };
      sectionBuilder.action(action1);

      const sectionBuilderActions = sectionBuilder.getActions();
      expect(sectionBuilderActions.length).toEqual(1);
      expect(sectionBuilderActions[0]).toBe(action1);
    });

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

      expect(sectionBuilder.action()).toBe(sectionBuilder);
    });
  });

  describe('getActions() method', function () {
    it('should return a shallow copy of all actions', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const action1 = {
        title: 'action-1',
        isEnabled: true,
        clickHandler: (): void => undefined,
      };
      const action2 = {
        title: 'action-2',
        isEnabled: false,
        clickHandler: (): void => undefined,
      };
      sectionBuilder.action(action1);
      sectionBuilder.action(action2);

      const sectionBuilderActions = sectionBuilder.getActions();
      expect(sectionBuilderActions).not.toBe(sectionBuilder.getActions());
      expect(sectionBuilderActions.length).toEqual(2);
      expect(sectionBuilderActions[0]).toBe(action1);
      expect(sectionBuilderActions[1]).toBe(action2);
    });
  });

  describe('propertyBuilder() method', function () {
    it('should return a PropertyViewPropertyBuilder instance with default values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      const propertyBuilder = sectionBuilder.propertyBuilder();

      expect(propertyBuilder).toEqual(new PropertyViewPropertyBuilder(sectionBuilder));
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it('should return a new PropertyViewPropertyBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      const propertyBuilder1 = sectionBuilder.propertyBuilder();
      const propertyBuilder2 = sectionBuilder.propertyBuilder();

      expect(propertyBuilder1).not.toBe(propertyBuilder2);
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder1, propertyBuilder2]);
    });
  });

  describe('property() method', function () {
    it('should create a PropertyViewPropertyBuilder instance with the correct values when values argument is undefined', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.property('key');

      const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder).keyBuilder().text('key').exit();
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it('should create a PropertyViewPropertyBuilder instance with the correct values when values argument is null', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.property('key');

      const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder).keyBuilder().text('key').exit();
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it('should create a PropertyViewPropertyBuilder instance with the correct values when values argument is a string', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.property('key', 'value');

      const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder)
        .keyBuilder()
        .text('key')
        .exit()
        .valueBuilder()
        .text('value')
        .exit();
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it('should create a PropertyViewPropertyBuilder instance with the correct values when values argument is a number', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.property('key', 1);

      const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder)
        .keyBuilder()
        .text('key')
        .exit()
        .valueBuilder()
        .text(1)
        .exit();
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it('should create a PropertyViewPropertyBuilder instance with the correct values when values argument is a boolean', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.property('key', true);

      const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder)
        .keyBuilder()
        .text('key')
        .exit()
        .valueBuilder()
        .text(true)
        .exit();
      expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
    });

    it(
      'should create' +
        ' a PropertyViewPropertyBuilder instance' +
        ' with the correct values' +
        ' when values argument is an array containing' +
        ' strings, numbers and booleans',
      function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
        sectionBuilder.property('key', ['value-1', 'value-2', 1, true]);

        const propertyBuilder = new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key')
          .exit()
          .valueBuilder()
          .text('value-1')
          .exit()
          .valueBuilder()
          .text('value-2')
          .exit()
          .valueBuilder()
          .text(1)
          .exit()
          .valueBuilder()
          .text(true)
          .exit();
        expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder]);
      }
    );

    it(
      'should create' +
        ' multiple PropertyViewPropertyBuilder instances' +
        ' with the correct values' +
        ' when invoked multiple times',
      function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
        sectionBuilder.property('key-1', ['value-1', 1]);
        sectionBuilder.property('key-2', false);
        sectionBuilder.property('key-3', ['value-2', 'value-3', 2, true]);

        const propertyBuilder1 = new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key-1')
          .exit()
          .valueBuilder()
          .text('value-1')
          .exit()
          .valueBuilder()
          .text(1)
          .exit();
        const propertyBuilder2 = new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key-2')
          .exit()
          .valueBuilder()
          .text(false)
          .exit();
        const propertyBuilder3 = new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key-3')
          .exit()
          .valueBuilder()
          .text('value-2')
          .exit()
          .valueBuilder()
          .text('value-3')
          .exit()
          .valueBuilder()
          .text(2)
          .exit()
          .valueBuilder()
          .text(true)
          .exit();
        expect(sectionBuilder.getContentBuilders()).toEqual([propertyBuilder1, propertyBuilder2, propertyBuilder3]);
      }
    );

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      expect(sectionBuilder.property('')).toBe(sectionBuilder);
    });
  });

  describe('messageBuilder() method', function () {
    it('should return a PropertyViewMessageBuilder instance with default values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      const messageBuilder = sectionBuilder.messageBuilder();

      expect(messageBuilder).toEqual(new PropertyViewMessageBuilder(sectionBuilder));
      expect(sectionBuilder.getContentBuilders()).toEqual([messageBuilder]);
    });

    it('should return a new PropertyViewMessageBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      const messageBuilder1 = sectionBuilder.messageBuilder();
      const messageBuilder2 = sectionBuilder.messageBuilder();

      expect(messageBuilder1).not.toBe(messageBuilder2);
      expect(sectionBuilder.getContentBuilders()).toEqual([messageBuilder1, messageBuilder2]);
    });
  });

  describe('message() method', function () {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should create a PropertyViewMessageBuilder instance with the correct values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.message('message-1');
      sectionBuilder.message('message-2', null);
      sectionBuilder.message('message-3', 'icon-3');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(3);
      expect(sectionContentBuilders[0]).toEqual(new PropertyViewMessageBuilder(sectionBuilder).text('message-1'));
      expect(sectionContentBuilders[1]).toEqual(new PropertyViewMessageBuilder(sectionBuilder).text('message-2'));
      expect(sectionContentBuilders[2]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('message-3').icon('icon-3')
      );
    });

    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should create a new PropertyViewMessageBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.message('message-1');
      sectionBuilder.message('message-1');
      sectionBuilder.message('message-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(3);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[1]);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[2]);
      expect(sectionContentBuilders[1]).not.toBe(sectionContentBuilders[2]);
    });

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

      expect(sectionBuilder.message('')).toBe(sectionBuilder);
    });
  });

  describe('info() method', function () {
    it('should create a PropertyViewMessageBuilder instance with the correct values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.info('info-1');
      sectionBuilder.info('info-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(2);
      expect(sectionContentBuilders[0]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('info-1').icon(infoIconClass)
      );
      expect(sectionContentBuilders[1]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('info-2').icon(infoIconClass)
      );
    });

    it('should create a new PropertyViewMessageBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.info('info-1');
      sectionBuilder.info('info-1');
      sectionBuilder.info('info-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(3);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[1]);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[2]);
      expect(sectionContentBuilders[1]).not.toBe(sectionContentBuilders[2]);
    });

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

      expect(sectionBuilder.info('')).toBe(sectionBuilder);
    });
  });

  describe('warning() method', function () {
    it('should create a PropertyViewMessageBuilder instance with the correct values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.warning('warning-1');
      sectionBuilder.warning('warning-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(2);
      expect(sectionContentBuilders[0]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('warning-1').icon(warningIconClass)
      );
      expect(sectionContentBuilders[1]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('warning-2').icon(warningIconClass)
      );
    });

    it('should create a new PropertyViewMessageBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.warning('warning-1');
      sectionBuilder.warning('warning-1');
      sectionBuilder.warning('warning-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(3);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[1]);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[2]);
      expect(sectionContentBuilders[1]).not.toBe(sectionContentBuilders[2]);
    });

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

      expect(sectionBuilder.warning('')).toBe(sectionBuilder);
    });
  });

  describe('error() method', function () {
    it('should create a PropertyViewMessageBuilder instance with the correct values', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      sectionBuilder.error('error-1');
      sectionBuilder.error('error-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(2);
      expect(sectionContentBuilders[0]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('error-1').icon(errorIconClass)
      );
      expect(sectionContentBuilders[1]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('error-2').icon(errorIconClass)
      );
    });

    it('should create a new PropertyViewMessageBuilder instance on each invocation', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      sectionBuilder.error('error-1');
      sectionBuilder.error('error-1');
      sectionBuilder.error('error-2');

      const sectionContentBuilders = sectionBuilder.getContentBuilders();
      expect(sectionContentBuilders.length).toEqual(3);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[1]);
      expect(sectionContentBuilders[0]).not.toBe(sectionContentBuilders[2]);
      expect(sectionContentBuilders[1]).not.toBe(sectionContentBuilders[2]);
    });

    it('should return the builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

      expect(sectionBuilder.error('')).toBe(sectionBuilder);
    });
  });

  describe('getContentBuilders() method', function () {
    it('should return a shallow copy of all child content builder instances', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      const propertyBuilder1 = sectionBuilder.propertyBuilder();
      const propertyBuilder2 = sectionBuilder.propertyBuilder();

      const messageBuilder1 = sectionBuilder.messageBuilder();
      const messageBuilder2 = sectionBuilder.messageBuilder();
      sectionBuilder.message('message-1');
      sectionBuilder.message('message-2', 'icon-2');
      sectionBuilder.info('info-1');
      sectionBuilder.info('info-2');
      sectionBuilder.warning('warning-1');
      sectionBuilder.warning('warning-2');
      sectionBuilder.error('error-1');
      sectionBuilder.error('error-2');

      sectionBuilder.property('key-1', 'value-1');
      sectionBuilder.property('key-2', ['value-2', 'value-3', true, 1]);

      const contentBuilders = sectionBuilder.getContentBuilders();
      expect(contentBuilders.length).toEqual(14);
      expect(contentBuilders[0]).toBe(propertyBuilder1);
      expect(contentBuilders[1]).toBe(propertyBuilder2);
      expect(contentBuilders[2]).toBe(messageBuilder1);
      expect(contentBuilders[3]).toBe(messageBuilder2);
      expect(contentBuilders[4]).toEqual(new PropertyViewMessageBuilder(sectionBuilder).text('message-1'));
      expect(contentBuilders[5]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('message-2').icon('icon-2')
      );
      expect(contentBuilders[6]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('info-1').icon(infoIconClass)
      );
      expect(contentBuilders[7]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('info-2').icon(infoIconClass)
      );
      expect(contentBuilders[8]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('warning-1').icon(warningIconClass)
      );
      expect(contentBuilders[9]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('warning-2').icon(warningIconClass)
      );
      expect(contentBuilders[10]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('error-1').icon(errorIconClass)
      );
      expect(contentBuilders[11]).toEqual(
        new PropertyViewMessageBuilder(sectionBuilder).text('error-2').icon(errorIconClass)
      );
      expect(contentBuilders[12]).toEqual(
        new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key-1')
          .exit()
          .valueBuilder()
          .text('value-1')
          .exit()
      );
      expect(contentBuilders[13]).toEqual(
        new PropertyViewPropertyBuilder(sectionBuilder)
          .keyBuilder()
          .text('key-2')
          .exit()
          .valueBuilder()
          .text('value-2')
          .exit()
          .valueBuilder()
          .text('value-3')
          .exit()
          .valueBuilder()
          .text(true)
          .exit()
          .valueBuilder()
          .text(1)
          .exit()
      );
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be ModelItemType.Section', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        expect(sectionBuilder.build().type).toBe(PropertyViewModelType.Section);
      });
    });

    describe('result model id', function () {
      it('should be the builder id', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-1');

        expect(sectionBuilder.build().id).toBe('section-1');
      });
    });

    describe('result model title', function () {
      it('should be null when title was not set', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        expect(sectionBuilder.build().title).toBe(null);
      });

      it('should be the last set title', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        sectionBuilder.title('');
        expect(sectionBuilder.build().title).toBe('');

        sectionBuilder.title('title');
        expect(sectionBuilder.build().title).toBe('title');
      });
    });

    describe('result model renderAsHtml', function () {
      it('should be false when renderAsHtml was not set', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        expect(sectionBuilder.build().renderAsHtml).toBe(false);
      });

      it('should be the last set renderAsHtml value', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        sectionBuilder.renderAsHtml(true);
        expect(sectionBuilder.build().renderAsHtml).toBe(true);

        sectionBuilder.renderAsHtml(false);
        expect(sectionBuilder.build().renderAsHtml).toBe(false);
      });
    });

    describe('result model collapseContent', function () {
      it('should be false when collapseContent was not set', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        expect(sectionBuilder.build().collapseContent).toBe(false);
      });

      it('should be the last set collapseContent value', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        sectionBuilder.collapseContent(true);
        expect(sectionBuilder.build().collapseContent).toBe(true);

        sectionBuilder.collapseContent(false);
        expect(sectionBuilder.build().collapseContent).toBe(false);
      });
    });

    describe('result model title icon', function () {
      it('should be null when title icon is not set', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        expect(sectionBuilder.build().titleIcon).toBe(null);
      });

      it('should be the last set title icon', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        sectionBuilder.titleIcon('');
        expect(sectionBuilder.build().titleIcon).toBe('');

        sectionBuilder.titleIcon('titleIcon');
        expect(sectionBuilder.build().titleIcon).toBe('titleIcon');
      });
    });

    describe('result model actions', function () {
      it('should be a shallow copy of actions', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'id');

        const action1 = {
          title: 'action1',
          isEnabled: true,
          clickHandler: (): void => undefined,
        };
        const action2 = {
          title: 'action2',
          isEnabled: false,
          clickHandler: (): void => undefined,
        };

        spyOn(sectionBuilder, 'getActions').and.returnValue([action1, action2]);

        const modelActions = sectionBuilder.build().actions;
        expect(modelActions.length).toEqual(2);
        expect(modelActions[0]).toBe(action1);
        expect(modelActions[1]).toBe(action2);
      });
    });

    describe('result model content', function () {
      it('should be the result models of all content builders', function () {
        const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

        const propertyBuilder1 = new PropertyViewPropertyBuilder(nullSectionBuilder);
        const messageBuilder1 = new PropertyViewMessageBuilder(nullSectionBuilder);
        const propertyBuilder2 = new PropertyViewPropertyBuilder(nullSectionBuilder);
        const messageBuilder2 = new PropertyViewMessageBuilder(nullSectionBuilder);

        spyOn(sectionBuilder, 'getContentBuilders').and.returnValue([
          propertyBuilder1,
          messageBuilder1,
          propertyBuilder2,
          messageBuilder2,
        ]);

        expect(sectionBuilder.build().content).toEqual([
          propertyBuilder1.build(),
          messageBuilder1.build(),
          propertyBuilder2.build(),
          messageBuilder2.build(),
        ]);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section')
        .title('title')
        .titleIcon('title-icon')
        .renderAsHtml(true)
        .collapseContent(true);
      const sectionBuilderClone = sectionBuilder.clone(nullCategoryBuilder);

      expect(sectionBuilderClone).toEqual(sectionBuilder);
      expect(sectionBuilderClone).not.toBe(sectionBuilder);
    });

    it('should shallow copy actions', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const actions = [
        {
          title: 'action1',
          isEnabled: true,
          clickHandler: (): void => undefined,
        },
        {
          title: 'action2',
          isEnabled: false,
          clickHandler: (): void => undefined,
        },
      ];

      spyOn(sectionBuilder, 'getActions').and.returnValue(actions);

      const sectionBuilderClone1 = sectionBuilder.clone(nullCategoryBuilder);
      const sectionBuilderClone2 = sectionBuilder.clone(nullCategoryBuilder);
      expect(sectionBuilderClone1).toEqual(sectionBuilderClone2);

      expect(sectionBuilderClone1.getActions().length).toEqual(2);
      expect(sectionBuilderClone1.getActions()[0]).toBe(actions[0]);
      expect(sectionBuilderClone1.getActions()[1]).toBe(actions[1]);

      sectionBuilderClone1.action({
        title: 'new-action',
        isEnabled: false,
        clickHandler: () => undefined,
      });
      expect(sectionBuilderClone1.getActions().length).toEqual(3);
      expect(sectionBuilderClone2.getActions().length).toEqual(2);
    });

    it('should deep clone content builders', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');

      const propertyBuilder = new PropertyViewPropertyBuilder(nullSectionBuilder);
      const propertyBuilderCloneSpy = spyOn(propertyBuilder, 'clone').and.callThrough();

      const messageBuilder = new PropertyViewMessageBuilder(nullSectionBuilder);
      const messageBuilderCloneSpy = spyOn(messageBuilder, 'clone').and.callThrough();

      spyOn(sectionBuilder, 'getContentBuilders').and.returnValue([propertyBuilder, messageBuilder]);

      const sectionBuilderClone = sectionBuilder.clone(nullCategoryBuilder);
      expect(propertyBuilderCloneSpy.calls.mostRecent().args).toEqual([sectionBuilderClone]);
      expect(messageBuilderCloneSpy.calls.mostRecent().args).toEqual([sectionBuilderClone]);

      const sectionBuilderCloneContentBuilders = sectionBuilderClone.getContentBuilders();
      const propertyBuilderClone: PropertyViewPropertyBuilder = propertyBuilderCloneSpy.calls.mostRecent().returnValue;
      const messageBuilderClone: PropertyViewMessageBuilder = messageBuilderCloneSpy.calls.mostRecent().returnValue;
      expect(sectionBuilderCloneContentBuilders.length).toEqual(2);
      expect(sectionBuilderCloneContentBuilders[0]).toBe(propertyBuilderClone);
      expect(sectionBuilderCloneContentBuilders[1]).toBe(messageBuilderClone);
    });

    it('should not clone the parent', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, '');

      const sectionBuilder = categoryBuilder.section('');
      expect(sectionBuilder.exit()).toBe(categoryBuilder);

      const sectionBuilderClone = sectionBuilder.clone(nullCategoryBuilder);
      expect(sectionBuilderClone.exit()).toBe(nullCategoryBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, '');
      expect(sectionBuilder.exit()).toBe(nullCategoryBuilder);

      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, '');
      expect(categoryBuilder.section('').exit()).toBe(categoryBuilder);
    });
  });
});
