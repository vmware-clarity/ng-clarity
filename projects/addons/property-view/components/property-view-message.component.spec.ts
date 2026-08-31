/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

describe('PropertyViewMessageComponent', function () {
  const iconElementSelector = '.pv-message-icon';
  const textElementSelector = '.pv-message-text';

  beforeEach(function (this: ThisTest) {
    this.createData = (overrides: Partial<PropertyViewMessageModel>) => {
      const defaultData: PropertyViewMessageModel = {
        type: PropertyViewModelType.Message,
        text: null,
        icon: null,
        renderAsHtml: false,
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.getMessageIconElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(iconElementSelector));
    };
    this.getMessageTextElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(textElementSelector));
    };

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PropertyViewMessageComponent],
      providers: [],
    });

    this.fixture = TestBed.createComponent(PropertyViewMessageComponent);
    this.component = this.fixture.componentInstance;
    this.element = this.fixture.nativeElement;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('should render a cell element that spans across 2 columns', function (this: ThisTest) {
    this.component.data = this.createData({});
    this.fixture.detectChanges();
    expect(this.element.children.length).toEqual(1);
    expect(this.element.children[0]).toEqual(jasmine.any(HTMLTableCellElement));
    expect(this.element.children[0].getAttribute('colspan')).toEqual('2');
  });

  const messageText = 'message-text';
  const messageIcon = 'message-icon';
  describe('icon', function () {
    it('should not be rendered when input data icon is null', function (this: ThisTest) {
      this.component.data = this.createData({
        text: messageText,
        icon: null,
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(0);
    });

    it('should not be rendered when input data icon is empty', function (this: ThisTest) {
      this.component.data = this.createData({
        text: messageText,
        icon: '',
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(0);
    });

    it('should be rendered when input data icon is defined', function (this: ThisTest) {
      this.component.data = this.createData({
        text: messageText,
        icon: messageIcon,
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(1);
      expect(this.getMessageIconElements()[0].classList.contains(messageIcon)).toEqual(true);
    });

    it('should be updated when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        text: messageText,
        icon: 'message-icon-1',
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(1);
      expect(this.getMessageIconElements()[0].classList.contains('message-icon-1')).toEqual(true);

      this.component.data = this.createData({
        text: messageText,
        icon: null,
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(0);

      this.component.data = this.createData({
        text: messageText,
        icon: 'message-icon-2',
      });
      this.fixture.detectChanges();
      expect(this.getMessageIconElements().length).toEqual(1);
      expect(this.getMessageIconElements()[0].classList.contains('message-icon-2')).toEqual(true);
    });
  });

  describe('text', function () {
    const htmlText = '<b>message-text</b>';
    it('should be rendered as plain text when input data renderAsHtml is false', function (this: ThisTest) {
      this.component.data = this.createData({
        text: htmlText,
        renderAsHtml: false,
      });
      this.fixture.detectChanges();
      expect(this.element.textContent?.trim()).toEqual(htmlText);
      expect(this.getMessageTextElements().length).toEqual(1);
      expect(this.getMessageTextElements()[0].textContent).toEqual(htmlText);
      expect(this.getMessageTextElements()[0].innerHTML).toEqual('&lt;b&gt;message-text&lt;/b&gt;');
    });

    it('should be rendered as HTML when input data renderAsHtml is true', function (this: ThisTest) {
      this.component.data = this.createData({
        text: htmlText,
        renderAsHtml: true,
      });
      this.fixture.detectChanges();
      expect(this.element.textContent?.trim()).toEqual(messageText);
      expect(this.getMessageTextElements().length).toEqual(1);
      expect(this.getMessageTextElements()[0].textContent).toEqual(messageText);
      expect(this.getMessageTextElements()[0].innerHTML).toEqual(htmlText);
    });

    it('should be displayed after icon', function (this: ThisTest) {
      this.component.data = this.createData({
        text: messageText,
        icon: messageIcon,
      });
      this.fixture.detectChanges();
      const iconElement = this.getMessageIconElements()[0];
      const textElement = this.getMessageTextElements()[0];
      expect(textElement.previousElementSibling).toBe(iconElement);
    });

    it('should be updated when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        text: '<b>message-text-1</b>',
        renderAsHtml: true,
      });
      this.fixture.detectChanges();
      expect(this.element.textContent?.trim()).toEqual('message-text-1');
      expect(this.getMessageTextElements().length).toEqual(1);
      expect(this.getMessageTextElements()[0].textContent).toEqual('message-text-1');
      expect(this.getMessageTextElements()[0].innerHTML).toEqual('<b>message-text-1</b>');

      const messageText2 = '<b>message-text-2</b>';
      this.component.data = this.createData({
        text: messageText2,
      });
      this.fixture.detectChanges();
      expect(this.element.textContent?.trim()).toEqual(messageText2);
      expect(this.getMessageTextElements().length).toEqual(1);
      expect(this.getMessageTextElements()[0].textContent).toEqual(messageText2);
      expect(this.getMessageTextElements()[0].innerHTML).toEqual('&lt;b&gt;message-text-2&lt;/b&gt;');
    });
  });
});
