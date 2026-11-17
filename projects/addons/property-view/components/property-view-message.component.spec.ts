/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyViewMessageModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewMessageComponent } from './property-view-message.component';

interface ThisTest {
  fixture: ComponentFixture<PropertyViewMessageComponent>;
  component: PropertyViewMessageComponent;
  element: Element;
  createData: (overrides: Partial<PropertyViewMessageModel>) => PropertyViewMessageModel;
  getMessageIconElements: () => Array<Element>;
  getMessageTextElements: () => Array<Element>;
}

describe('PropertyViewMessageComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  const iconElementSelector = '.pv-message-icon';
  const textElementSelector = '.pv-message-text';

  beforeEach(() => {
    testContext.createData = (overrides: Partial<PropertyViewMessageModel>) => {
      const defaultData: PropertyViewMessageModel = {
        type: PropertyViewModelType.Message,
        text: null,
        icon: null,
        renderAsHtml: false,
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.getMessageIconElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(iconElementSelector));
    };
    testContext.getMessageTextElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(textElementSelector));
    };

    TestBed.configureTestingModule({
      declarations: [PropertyViewMessageComponent],
      providers: [],
    });

    testContext.fixture = TestBed.createComponent(PropertyViewMessageComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.element = testContext.fixture.nativeElement;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('should render a cell element that spans across 2 columns', () => {
    testContext.component.data = testContext.createData({});
    testContext.fixture.detectChanges();
    expect(testContext.element.children.length).toEqual(1);
    expect(testContext.element.children[0]).toEqual(expect.any(HTMLTableCellElement));
    expect(testContext.element.children[0].getAttribute('colspan')).toEqual('2');
  });

  const messageText = 'message-text';
  const messageIcon = 'message-icon';
  describe('icon', () => {
    it('should not be rendered when input data icon is null', () => {
      testContext.component.data = testContext.createData({
        text: messageText,
        icon: null,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(0);
    });

    it('should not be rendered when input data icon is empty', () => {
      testContext.component.data = testContext.createData({
        text: messageText,
        icon: '',
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(0);
    });

    it('should be rendered when input data icon is defined', () => {
      testContext.component.data = testContext.createData({
        text: messageText,
        icon: messageIcon,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(1);
      expect(testContext.getMessageIconElements()[0].classList.contains(messageIcon)).toEqual(true);
    });

    it('should be updated when input data changes', () => {
      testContext.component.data = testContext.createData({
        text: messageText,
        icon: 'message-icon-1',
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(1);
      expect(testContext.getMessageIconElements()[0].classList.contains('message-icon-1')).toEqual(true);

      testContext.component.data = testContext.createData({
        text: messageText,
        icon: null,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(0);

      testContext.component.data = testContext.createData({
        text: messageText,
        icon: 'message-icon-2',
      });
      testContext.fixture.detectChanges();
      expect(testContext.getMessageIconElements().length).toEqual(1);
      expect(testContext.getMessageIconElements()[0].classList.contains('message-icon-2')).toEqual(true);
    });
  });

  describe('text', () => {
    const htmlText = '<b>message-text</b>';
    it('should be rendered as plain text when input data renderAsHtml is false', () => {
      testContext.component.data = testContext.createData({
        text: htmlText,
        renderAsHtml: false,
      });
      testContext.fixture.detectChanges();
      expect(testContext.element.textContent?.trim()).toEqual(htmlText);
      expect(testContext.getMessageTextElements().length).toEqual(1);
      expect(testContext.getMessageTextElements()[0].textContent).toEqual(htmlText);
      expect(testContext.getMessageTextElements()[0].innerHTML).toEqual('&lt;b&gt;message-text&lt;/b&gt;');
    });

    it('should be rendered as HTML when input data renderAsHtml is true', () => {
      testContext.component.data = testContext.createData({
        text: htmlText,
        renderAsHtml: true,
      });
      testContext.fixture.detectChanges();
      expect(testContext.element.textContent?.trim()).toEqual(messageText);
      expect(testContext.getMessageTextElements().length).toEqual(1);
      expect(testContext.getMessageTextElements()[0].textContent).toEqual(messageText);
      expect(testContext.getMessageTextElements()[0].innerHTML).toEqual(htmlText);
    });

    it('should be displayed after icon', () => {
      testContext.component.data = testContext.createData({
        text: messageText,
        icon: messageIcon,
      });
      testContext.fixture.detectChanges();
      const iconElement = testContext.getMessageIconElements()[0];
      const textElement = testContext.getMessageTextElements()[0];
      expect(textElement.previousElementSibling).toBe(iconElement);
    });

    it('should be updated when input data changes', () => {
      testContext.component.data = testContext.createData({
        text: '<b>message-text-1</b>',
        renderAsHtml: true,
      });
      testContext.fixture.detectChanges();
      expect(testContext.element.textContent?.trim()).toEqual('message-text-1');
      expect(testContext.getMessageTextElements().length).toEqual(1);
      expect(testContext.getMessageTextElements()[0].textContent).toEqual('message-text-1');
      expect(testContext.getMessageTextElements()[0].innerHTML).toEqual('<b>message-text-1</b>');

      const messageText2 = '<b>message-text-2</b>';
      testContext.component.data = testContext.createData({
        text: messageText2,
      });
      testContext.fixture.detectChanges();
      expect(testContext.element.textContent?.trim()).toEqual(messageText2);
      expect(testContext.getMessageTextElements().length).toEqual(1);
      expect(testContext.getMessageTextElements()[0].textContent).toEqual(messageText2);
      expect(testContext.getMessageTextElements()[0].innerHTML).toEqual('&lt;b&gt;message-text-2&lt;/b&gt;');
    });
  });
});
