/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, SimpleChange, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PropertyViewConfigProvider } from '../property-view-config-provider';
import {
  PropertyViewModelType,
  PropertyViewPropertyKeyModel,
  PropertyViewPropertyModel,
  PropertyViewPropertyValueComponent,
  PropertyViewPropertyValueComponentModel,
  PropertyViewPropertyValueModel,
} from '../property-view.model';
import { PropertyViewPropertyComponent } from './property-view-property.component';

import Spy = jasmine.Spy;

interface ThisTest {
  fixture: ComponentFixture<PropertyViewPropertyComponent>;
  component: PropertyViewPropertyComponent;
  propertyViewConfigProvider: PropertyViewConfigProviderMock;
  element: Element;
  setData: (data: Partial<PropertyViewPropertyModel>) => void;
  createKeyData: (overrides: Partial<PropertyViewPropertyKeyModel>) => PropertyViewPropertyKeyModel;
  createValueData: (overrides: Partial<PropertyViewPropertyValueModel>) => PropertyViewPropertyValueModel;
  createValueComponentData: (
    overrides: Partial<PropertyViewPropertyValueComponentModel<MockModel>>
  ) => PropertyViewPropertyValueComponentModel<MockModel>;
  getKeyContainerElements: () => Array<Element>;
  getKeyContentElements: () => Array<HTMLElement>;
  getKeyIconElements: () => Array<Element>;
  getKeyTextElement: () => Array<Element>;
  getValuesContainerElements: () => Array<Element>;
  getValuesListElements: () => Array<Element>;
  getValuesElements: () => Array<Element>;
  getValueIconElements: (valueElementIndex: number) => Array<Element>;
  getValueLinkElements: (valueElementIndex: number) => Array<HTMLAnchorElement>;
  getValueTextElements: (valueElementIndex: number) => Array<Element>;
  getValueComponentElements: (valueElementIndex: number) => Array<Element>;
}

interface PropertyViewConfigProviderMock {
  getConfig: Spy;
}

describe('PropertyViewPropertyComponent', function () {
  const keyContainerSelector = 'td.pv-property-key-container';
  const keyContentSelector = `${keyContainerSelector} .pv-property-key-content`;
  const keyIconElementSelector = `${keyContainerSelector} .pv-property-key-icon`;
  const keyTextElementSelector = `${keyContainerSelector} .pv-property-key-text`;
  const valuesContainerSelector = 'td.pv-property-values-container';
  const valuesListSelector = `${valuesContainerSelector} .pv-property-values-content`;
  const valuesElementsSelector = `${valuesListSelector} .pv-property-value`;

  beforeEach(function (this: ThisTest) {
    this.setData = (overrides: Partial<PropertyViewPropertyModel>) => {
      const defaultData: PropertyViewPropertyModel = {
        type: PropertyViewModelType.Property,
        key: {
          type: PropertyViewModelType.PropertyKey,
          text: null,
          icon: null,
        },
        content: [],
      };

      this.component.data = Object.assign({}, defaultData, overrides);
      this.component.ngOnChanges({
        data: new SimpleChange(undefined, this.component.data, false),
      });
    };

    this.createKeyData = (overrides: Partial<PropertyViewPropertyKeyModel>) => {
      const defaultData: PropertyViewPropertyKeyModel = {
        type: PropertyViewModelType.PropertyKey,
        text: null,
        icon: null,
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.createValueData = (overrides: Partial<PropertyViewPropertyValueModel>) => {
      const defaultData: PropertyViewPropertyValueModel = {
        type: PropertyViewModelType.PropertyValue,
        text: null,
        icon: null,
        link: null,
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.createValueComponentData = (overrides: Partial<PropertyViewPropertyValueComponentModel<MockModel>>) => {
      const defaultData: PropertyViewPropertyValueComponentModel<MockModel> = {
        type: PropertyViewModelType.PropertyValueComponent,
        componentType: MockComponent,
        componentModel: null,
      };
      return Object.assign({}, defaultData, overrides);
    };

    this.getKeyContainerElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(keyContainerSelector));
    };
    this.getKeyIconElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(keyIconElementSelector));
    };

    this.getKeyContentElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(keyContentSelector));
    };

    this.getKeyTextElement = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(keyTextElementSelector));
    };
    this.getValuesContainerElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(valuesContainerSelector));
    };
    this.getValuesListElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(valuesListSelector));
    };
    this.getValuesElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(valuesElementsSelector));
    };
    this.getValueIconElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        this.getValuesElements()[valueElementIndex].querySelectorAll('.pv-property-value-icon')
      );
    };
    this.getValueTextElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        this.getValuesElements()[valueElementIndex].querySelectorAll('span.pv-property-value-text')
      );
    };
    this.getValueLinkElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        this.getValuesElements()[valueElementIndex].querySelectorAll('a.pv-property-value-link')
      );
    };
    this.getValueComponentElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        this.getValuesElements()[valueElementIndex].querySelectorAll('appfx-property-view-property-value-component')
      );
    };

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestModule],
      declarations: [PropertyViewPropertyComponent, PropertyViewPropertyValueContainerMockComponent],
    });

    this.propertyViewConfigProvider = {
      getConfig: jasmine.createSpy('getConfig').and.returnValue(undefined),
    };
    // Override the provider in PropertyViewPropertyComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewConfigProvider, {
      useValue: this.propertyViewConfigProvider,
    });

    this.fixture = TestBed.createComponent(PropertyViewPropertyComponent);
    this.component = this.fixture.componentInstance;
    this.element = this.fixture.nativeElement;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  describe('key', function () {
    it('should be rendered when input data key is empty', function (this: ThisTest) {
      this.setData({
        key: this.createKeyData({
          text: null,
          icon: null,
        }),
      });
      this.fixture.detectChanges();
      expect(this.getKeyContainerElements().length).toEqual(1);
      expect(this.getKeyContainerElements()[0].textContent?.trim()).toEqual('');
    });

    it('should be rendered when input data key is not empty', function (this: ThisTest) {
      this.setData({
        key: this.createKeyData({
          text: 'key-text',
          icon: null,
        }),
      });
      this.fixture.detectChanges();
      expect(this.getKeyContainerElements().length).toEqual(1);
      expect(this.getKeyContainerElements()[0].textContent?.trim()).toEqual('key-text');
    });

    describe('icon', function () {
      it('should not be rendered when input data key icon is null', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            icon: null,
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(0);
      });

      it('should not be rendered when input data key icon is empty', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            icon: '',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(0);
      });

      it('should be rendered when input data key icon is defined', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            icon: 'key-icon',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(1);
        expect(this.getKeyIconElements()[0].classList.contains('key-icon')).toEqual(true);
      });

      it('should be updated when input data changes', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            icon: 'key-icon-1',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(1);
        expect(this.getKeyIconElements()[0].classList.contains('key-icon-1')).toEqual(true);

        this.setData({
          key: this.createKeyData({
            icon: null,
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(0);

        this.setData({
          key: this.createKeyData({
            icon: 'key-icon-2',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyIconElements().length).toEqual(1);
        expect(this.getKeyIconElements()[0].classList.contains('key-icon-2')).toEqual(true);
      });
    });

    describe('text', function () {
      it('should be rendered', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            text: 'key-text',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyTextElement().length).toEqual(1);
        expect(this.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text');
      });

      it('should be displayed after icon', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            text: 'key-text',
            icon: 'key-icon',
          }),
        });
        this.fixture.detectChanges();
        const iconElement = this.getKeyIconElements()[0];
        const textElement = this.getKeyTextElement()[0];
        expect(textElement.previousElementSibling).toBe(iconElement);
      });

      it('should be updated when input data changes', function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            text: 'key-text-1',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyTextElement().length).toEqual(1);
        expect(this.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text-1');

        this.setData({
          key: this.createKeyData({
            text: 'key-text-2',
          }),
        });
        this.fixture.detectChanges();
        expect(this.getKeyTextElement().length).toEqual(1);
        expect(this.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text-2');
      });
    });

    describe('width', function (this: ThisTest) {
      beforeEach(function (this: ThisTest) {
        this.setData({
          key: this.createKeyData({
            text: 'key-text',
            icon: 'key-icon',
          }),
        });
        this.fixture.detectChanges();
      });

      it('should be the default one when PropertyViewConfigProvider.getConfig() returns undefined', function (this: ThisTest) {
        this.propertyViewConfigProvider.getConfig.and.returnValue(undefined);
        this.fixture.detectChanges();
        expect(this.getKeyContentElements()[0].style.width).toEqual('');
      });

      it('should be the default one when PropertyViewConfigProvider.getConfig().propertyKeyWidthInRem is undefined', function (this: ThisTest) {
        this.propertyViewConfigProvider.getConfig.and.returnValue({
          propertyKeyWidthInRem: undefined,
        });
        this.fixture.detectChanges();
        expect(this.getKeyContentElements()[0].style.width).toEqual('');
      });

      it('should be the value of PropertyViewConfigProvider.getConfig().propertyKeyWidthInRem', function (this: ThisTest) {
        this.propertyViewConfigProvider.getConfig.and.returnValue({
          propertyKeyWidthInRem: 10,
        });
        this.fixture.detectChanges();
        expect(this.getKeyContentElements()[0].style.width).toEqual('10rem');
      });
    });
  });

  describe('content', function () {
    it('should render values container when input data content is empty', function (this: ThisTest) {
      this.setData({
        content: [],
      });
      this.fixture.detectChanges();
      expect(this.getValuesContainerElements().length).toEqual(1);
    });

    it('should not render values list when input data content is empty', function (this: ThisTest) {
      this.setData({
        content: [],
      });
      this.fixture.detectChanges();
      expect(this.getValuesListElements().length).toEqual(0);
      expect(this.getValuesElements().length).toEqual(0);
    });

    const valueText1 = 'value-text-1';
    const valueText2 = 'value-text-2';
    it(
      'should render values list that contains an item' +
        ' for each item in input data content' +
        ' when input data content is not empty',
      function (this: ThisTest) {
        this.setData({
          content: [
            this.createValueData({
              text: valueText1,
            }),
            this.createValueData({
              text: valueText2,
            }),
            this.createValueComponentData({
              componentType: MockComponent,
              componentModel: {
                text: 'text',
              },
            }),
          ],
        });
        this.fixture.detectChanges();
        expect(this.getValuesListElements().length).toEqual(1);
        expect(this.getValuesElements().length).toEqual(3);
        expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText1);
        expect(this.getValuesElements()[1].textContent?.trim()).toEqual(valueText2);
        expect((this.getValuesElements()[2].children.item(0) as Element).tagName).toEqual(
          'APPFX-PROPERTY-VIEW-PROPERTY-VALUE-COMPONENT'
        );
        expect(this.component.data.content[2].type).toEqual(PropertyViewModelType.PropertyValueComponent);
      }
    );

    it('should be displayed after key', function (this: ThisTest) {
      this.setData({
        key: this.createKeyData({
          text: 'key-text',
        }),
        content: [this.createValueData({})],
      });
      this.fixture.detectChanges();
      const keyContainerElement = this.getKeyContainerElements()[0];
      const valuesContainerElement = this.getValuesContainerElements()[0];
      expect(valuesContainerElement.previousElementSibling).toBe(keyContainerElement);
    });

    it('should be updated when input data content changes', function (this: ThisTest) {
      this.setData({
        content: [
          this.createValueData({
            text: valueText1,
          }),
        ],
      });
      this.fixture.detectChanges();
      expect(this.getValuesListElements().length).toEqual(1);
      expect(this.getValuesElements().length).toEqual(1);
      expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText1);

      this.setData({
        content: [
          this.createValueData({
            text: valueText2,
          }),
          this.createValueData({
            text: valueText1,
          }),
        ],
      });
      this.fixture.detectChanges();
      expect(this.getValuesListElements().length).toEqual(1);
      expect(this.getValuesElements().length).toEqual(2);
      expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText2);
      expect(this.getValuesElements()[1].textContent?.trim()).toEqual(valueText1);

      this.setData({
        content: [],
      });
      this.fixture.detectChanges();
      expect(this.getValuesListElements().length).toEqual(0);
      expect(this.getValuesElements().length).toEqual(0);

      this.setData({
        content: [
          this.createValueData({
            text: 'value-text-3',
          }),
        ],
      });
      this.fixture.detectChanges();
      expect(this.getValuesListElements().length).toEqual(1);
      expect(this.getValuesElements().length).toEqual(1);
      expect(this.getValuesElements()[0].textContent?.trim()).toEqual('value-text-3');
    });

    describe('item', function () {
      const valueIcon = 'value-icon';
      describe('icon', function () {
        it('should not be rendered when input data content item icon is null', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                icon: null,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(0);
        });

        it('should not be rendered when input data content item icon is empty', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                icon: '',
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(0);
        });

        it('should be rendered when input data content item icon is defined', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                icon: valueIcon,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(1);
          expect(this.getValueIconElements(0)[0].classList.contains(valueIcon)).toEqual(true);
        });

        it('should be updated when input data content item icon changes', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                icon: 'value-icon-1',
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(1);
          expect(this.getValueIconElements(0)[0].classList.contains('value-icon-1')).toEqual(true);

          this.setData({
            content: [
              this.createValueData({
                icon: null,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(0);

          this.setData({
            content: [
              this.createValueData({
                icon: 'value-icon-2',
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueIconElements(0).length).toEqual(1);
          expect(this.getValueIconElements(0)[0].classList.contains('value-icon-2')).toEqual(true);
        });
      });

      describe('text', function () {
        const valueText = 'value-text';
        it('should be rendered as plain text when input data content item link is null', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                text: valueText,
                link: null,
              }),
            ],
          });
          this.component.ngOnChanges({
            data: new SimpleChange(undefined, this.component.data, false),
          });
          this.fixture.detectChanges();
          expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText);
          expect(this.getValueTextElements(0).length).toEqual(1);
          expect(this.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText);
          expect(this.getValueLinkElements(0).length).toEqual(0);
        });

        const valueLinkText = 'value-link-text';
        it('should be rendered as link when input data content item link is defined', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                text: valueLinkText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueLinkText);
          expect(this.getValueTextElements(0).length).toEqual(0);
          expect(this.getValueLinkElements(0).length).toEqual(1);
          expect(this.getValueLinkElements(0)[0].textContent?.trim()).toEqual(valueLinkText);
        });

        it("should invoke link's clickHandler() when link element is clicked", function (this: ThisTest) {
          const link1 = { clickHandler: (): any => null };
          const link1ClickHandlerSpy = spyOn(link1, 'clickHandler');
          const link2 = { clickHandler: (): any => null };
          const link2ClickHandlerSpy = spyOn(link2, 'clickHandler');

          this.setData({
            content: [
              this.createValueData({
                text: 'value-link-1-text',
                link: link1,
              }),
              this.createValueData({
                text: 'value-link-2-text',
                link: link2,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValueLinkElements(0).length).toEqual(1);
          this.getValueLinkElements(0)[0].click();
          expect(link1ClickHandlerSpy.calls.count()).toEqual(1);
          expect(link1ClickHandlerSpy.calls.mostRecent().args).toEqual([]);
          expect(this.getValueLinkElements(1).length).toEqual(1);
          this.getValueLinkElements(1)[0].click();
          expect(link2ClickHandlerSpy.calls.count()).toEqual(1);
          expect(link2ClickHandlerSpy.calls.mostRecent().args).toEqual([]);
        });

        it('should be displayed after icon', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                icon: valueIcon,
                text: valueText,
                link: null,
              }),
            ],
          });
          this.fixture.detectChanges();
          const iconElement = this.getValueIconElements(0)[0];
          const textElement = this.getValueTextElements(0)[0];
          expect(textElement.previousElementSibling).toBe(iconElement);

          this.setData({
            content: [
              this.createValueData({
                icon: valueIcon,
                text: valueText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          this.fixture.detectChanges();
          const iconElement2 = this.getValueIconElements(0)[0];
          const linkElement = this.getValueLinkElements(0)[0];
          expect(linkElement.previousElementSibling).toBe(iconElement2);
        });

        it('should be updated when input data content item text changes', function (this: ThisTest) {
          this.setData({
            content: [
              this.createValueData({
                text: valueText,
                link: null,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText);
          expect(this.getValueTextElements(0).length).toEqual(1);
          expect(this.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText);
          expect(this.getValueLinkElements(0).length).toEqual(0);

          this.setData({
            content: [
              this.createValueData({
                text: valueLinkText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueLinkText);
          expect(this.getValueTextElements(0).length).toEqual(0);
          expect(this.getValueLinkElements(0).length).toEqual(1);
          expect(this.getValueLinkElements(0)[0].textContent?.trim()).toEqual(valueLinkText);

          this.setData({
            content: [
              this.createValueData({
                text: valueText2,
                link: null,
              }),
            ],
          });
          this.fixture.detectChanges();
          expect(this.getValuesElements()[0].textContent?.trim()).toEqual(valueText2);
          expect(this.getValueTextElements(0).length).toEqual(1);
          expect(this.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText2);
          expect(this.getValueLinkElements(0).length).toEqual(0);
        });
      });
    });
  });
});

interface MockModel {
  text: string;
}

@Component({
  selector: 'mock-component',
  standalone: false,
  template: `{{ model.text }}`,
})
class MockComponent implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}

@Component({
  selector: 'appfx-property-view-property-value-component',
  standalone: false,
  template: '',
})
class PropertyViewPropertyValueContainerMockComponent<T> {
  @Input() componentType?: Type<PropertyViewPropertyValueComponent<T>> | null;

  @Input() componentModel?: T | null;
}

@NgModule({
  imports: [CommonModule],
  declarations: [MockComponent],
  exports: [MockComponent],
})
class TestModule {}
