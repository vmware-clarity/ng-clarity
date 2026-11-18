/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, SimpleChange, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';
import type { Mock } from 'vitest';

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

type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = Mock<T>;

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

describe('PropertyViewPropertyComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  const keyContainerSelector = 'td.pv-property-key-container';
  const keyContentSelector = `${keyContainerSelector} .pv-property-key-content`;
  const keyIconElementSelector = `${keyContainerSelector} .pv-property-key-icon`;
  const keyTextElementSelector = `${keyContainerSelector} .pv-property-key-text`;
  const valuesContainerSelector = 'td.pv-property-values-container';
  const valuesListSelector = `${valuesContainerSelector} .pv-property-values-content`;
  const valuesElementsSelector = `${valuesListSelector} .pv-property-value`;

  beforeEach(() => {
    testContext.setData = (overrides: Partial<PropertyViewPropertyModel>) => {
      const defaultData: PropertyViewPropertyModel = {
        type: PropertyViewModelType.Property,
        key: {
          type: PropertyViewModelType.PropertyKey,
          text: null,
          icon: null,
        },
        content: [],
      };

      testContext.fixture.componentRef.setInput('data', Object.assign({}, defaultData, overrides));
      testContext.component.ngOnChanges({
        data: new SimpleChange(undefined, testContext.component.data, false),
      });
    };

    testContext.createKeyData = (overrides: Partial<PropertyViewPropertyKeyModel>) => {
      const defaultData: PropertyViewPropertyKeyModel = {
        type: PropertyViewModelType.PropertyKey,
        text: null,
        icon: null,
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.createValueData = (overrides: Partial<PropertyViewPropertyValueModel>) => {
      const defaultData: PropertyViewPropertyValueModel = {
        type: PropertyViewModelType.PropertyValue,
        text: null,
        icon: null,
        link: null,
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.createValueComponentData = (overrides: Partial<PropertyViewPropertyValueComponentModel<MockModel>>) => {
      const defaultData: PropertyViewPropertyValueComponentModel<MockModel> = {
        type: PropertyViewModelType.PropertyValueComponent,
        componentType: MockComponent,
        componentModel: null,
      };
      return Object.assign({}, defaultData, overrides);
    };

    testContext.getKeyContainerElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(keyContainerSelector));
    };
    testContext.getKeyIconElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(keyIconElementSelector));
    };

    testContext.getKeyContentElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(keyContentSelector));
    };

    testContext.getKeyTextElement = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(keyTextElementSelector));
    };
    testContext.getValuesContainerElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(valuesContainerSelector));
    };
    testContext.getValuesListElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(valuesListSelector));
    };
    testContext.getValuesElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(valuesElementsSelector));
    };
    testContext.getValueIconElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        testContext.getValuesElements()[valueElementIndex].querySelectorAll('.pv-property-value-icon')
      );
    };
    testContext.getValueTextElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        testContext.getValuesElements()[valueElementIndex].querySelectorAll('span.pv-property-value-text')
      );
    };
    testContext.getValueLinkElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        testContext.getValuesElements()[valueElementIndex].querySelectorAll('a.pv-property-value-link')
      );
    };
    testContext.getValueComponentElements = (valueElementIndex: number) => {
      return Array.prototype.slice.call(
        testContext
          .getValuesElements()
          [valueElementIndex].querySelectorAll('appfx-property-view-property-value-component')
      );
    };

    TestBed.configureTestingModule({
      imports: [TestModule],
      declarations: [PropertyViewPropertyComponent, PropertyViewPropertyValueContainerMockComponent],
    });

    testContext.propertyViewConfigProvider = {
      getConfig: vi.fn().mockReturnValue(undefined),
    };
    // Override the provider in PropertyViewPropertyComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewConfigProvider, {
      useValue: testContext.propertyViewConfigProvider,
    });

    testContext.fixture = TestBed.createComponent(PropertyViewPropertyComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.element = testContext.fixture.nativeElement;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('key', () => {
    it('should be rendered when input data key is empty', () => {
      testContext.setData({
        key: testContext.createKeyData({
          text: null,
          icon: null,
        }),
      });
      renderFixture(testContext.fixture);
      expect(testContext.getKeyContainerElements().length).toEqual(1);
      expect(testContext.getKeyContainerElements()[0].textContent?.trim()).toEqual('');
    });

    it('should be rendered when input data key is not empty', () => {
      testContext.setData({
        key: testContext.createKeyData({
          text: 'key-text',
          icon: null,
        }),
      });
      renderFixture(testContext.fixture);
      expect(testContext.getKeyContainerElements().length).toEqual(1);
      expect(testContext.getKeyContainerElements()[0].textContent?.trim()).toEqual('key-text');
    });

    describe('icon', () => {
      it('should not be rendered when input data key icon is null', () => {
        testContext.setData({
          key: testContext.createKeyData({
            icon: null,
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(0);
      });

      it('should not be rendered when input data key icon is empty', () => {
        testContext.setData({
          key: testContext.createKeyData({
            icon: '',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(0);
      });

      it('should be rendered when input data key icon is defined', () => {
        testContext.setData({
          key: testContext.createKeyData({
            icon: 'key-icon',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(1);
        expect(testContext.getKeyIconElements()[0].classList.contains('key-icon')).toEqual(true);
      });

      it('should be updated when input data changes', () => {
        testContext.setData({
          key: testContext.createKeyData({
            icon: 'key-icon-1',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(1);
        expect(testContext.getKeyIconElements()[0].classList.contains('key-icon-1')).toEqual(true);

        testContext.setData({
          key: testContext.createKeyData({
            icon: null,
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(0);

        testContext.setData({
          key: testContext.createKeyData({
            icon: 'key-icon-2',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyIconElements().length).toEqual(1);
        expect(testContext.getKeyIconElements()[0].classList.contains('key-icon-2')).toEqual(true);
      });
    });

    describe('text', () => {
      it('should be rendered', () => {
        testContext.setData({
          key: testContext.createKeyData({
            text: 'key-text',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyTextElement().length).toEqual(1);
        expect(testContext.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text');
      });

      it('should be displayed after icon', () => {
        testContext.setData({
          key: testContext.createKeyData({
            text: 'key-text',
            icon: 'key-icon',
          }),
        });
        renderFixture(testContext.fixture);
        const iconElement = testContext.getKeyIconElements()[0];
        const textElement = testContext.getKeyTextElement()[0];
        expect(textElement.previousElementSibling).toBe(iconElement);
      });

      it('should be updated when input data changes', () => {
        testContext.setData({
          key: testContext.createKeyData({
            text: 'key-text-1',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyTextElement().length).toEqual(1);
        expect(testContext.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text-1');

        testContext.setData({
          key: testContext.createKeyData({
            text: 'key-text-2',
          }),
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyTextElement().length).toEqual(1);
        expect(testContext.getKeyTextElement()[0].textContent?.trim()).toEqual('key-text-2');
      });
    });

    describe('width', () => {
      beforeEach(() => {
        testContext.setData({
          key: testContext.createKeyData({
            text: 'key-text',
            icon: 'key-icon',
          }),
        });
        renderFixture(testContext.fixture);
      });

      it('should be the default one when PropertyViewConfigProvider.getConfig() returns undefined', () => {
        testContext.propertyViewConfigProvider.getConfig.mockReturnValue(undefined);
        renderFixture(testContext.fixture);
        expect(testContext.getKeyContentElements()[0].style.width).toEqual('');
      });

      it('should be the default one when PropertyViewConfigProvider.getConfig().propertyKeyWidthInRem is undefined', () => {
        testContext.propertyViewConfigProvider.getConfig.mockReturnValue({
          propertyKeyWidthInRem: undefined,
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyContentElements()[0].style.width).toEqual('');
      });

      it('should be the value of PropertyViewConfigProvider.getConfig().propertyKeyWidthInRem', () => {
        testContext.propertyViewConfigProvider.getConfig.mockReturnValue({
          propertyKeyWidthInRem: 10,
        });
        renderFixture(testContext.fixture);
        expect(testContext.getKeyContentElements()[0].style.width).toEqual('10rem');
      });
    });
  });

  describe('content', () => {
    it('should render values container when input data content is empty', () => {
      testContext.setData({
        content: [],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesContainerElements().length).toEqual(1);
    });

    it('should not render values list when input data content is empty', () => {
      testContext.setData({
        content: [],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesListElements().length).toEqual(0);
      expect(testContext.getValuesElements().length).toEqual(0);
    });

    const valueText1 = 'value-text-1';
    const valueText2 = 'value-text-2';
    it(
      'should render values list that contains an item' +
        ' for each item in input data content' +
        ' when input data content is not empty',
      () => {
        testContext.setData({
          content: [
            testContext.createValueData({
              text: valueText1,
            }),
            testContext.createValueData({
              text: valueText2,
            }),
            testContext.createValueComponentData({
              componentType: MockComponent,
              componentModel: {
                text: 'text',
              },
            }),
          ],
        });
        renderFixture(testContext.fixture);
        expect(testContext.getValuesListElements().length).toEqual(1);
        expect(testContext.getValuesElements().length).toEqual(3);
        expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText1);
        expect(testContext.getValuesElements()[1].textContent?.trim()).toEqual(valueText2);
        expect((testContext.getValuesElements()[2].children.item(0) as Element).tagName).toEqual(
          'APPFX-PROPERTY-VIEW-PROPERTY-VALUE-COMPONENT'
        );
        expect(testContext.component.data.content[2].type).toEqual(PropertyViewModelType.PropertyValueComponent);
      }
    );

    it('should be displayed after key', () => {
      testContext.setData({
        key: testContext.createKeyData({
          text: 'key-text',
        }),
        content: [testContext.createValueData({})],
      });
      renderFixture(testContext.fixture);
      const keyContainerElement = testContext.getKeyContainerElements()[0];
      const valuesContainerElement = testContext.getValuesContainerElements()[0];
      expect(valuesContainerElement.previousElementSibling).toBe(keyContainerElement);
    });

    it('should be updated when input data content changes', () => {
      testContext.setData({
        content: [
          testContext.createValueData({
            text: valueText1,
          }),
        ],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesListElements().length).toEqual(1);
      expect(testContext.getValuesElements().length).toEqual(1);
      expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText1);

      testContext.setData({
        content: [
          testContext.createValueData({
            text: valueText2,
          }),
          testContext.createValueData({
            text: valueText1,
          }),
        ],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesListElements().length).toEqual(1);
      expect(testContext.getValuesElements().length).toEqual(2);
      expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText2);
      expect(testContext.getValuesElements()[1].textContent?.trim()).toEqual(valueText1);

      testContext.setData({
        content: [],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesListElements().length).toEqual(0);
      expect(testContext.getValuesElements().length).toEqual(0);

      testContext.setData({
        content: [
          testContext.createValueData({
            text: 'value-text-3',
          }),
        ],
      });
      renderFixture(testContext.fixture);
      expect(testContext.getValuesListElements().length).toEqual(1);
      expect(testContext.getValuesElements().length).toEqual(1);
      expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual('value-text-3');
    });

    describe('item', () => {
      const valueIcon = 'value-icon';
      describe('icon', () => {
        it('should not be rendered when input data content item icon is null', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                icon: null,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(0);
        });

        it('should not be rendered when input data content item icon is empty', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                icon: '',
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(0);
        });

        it('should be rendered when input data content item icon is defined', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                icon: valueIcon,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(1);
          expect(testContext.getValueIconElements(0)[0].classList.contains(valueIcon)).toEqual(true);
        });

        it('should be updated when input data content item icon changes', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                icon: 'value-icon-1',
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(1);
          expect(testContext.getValueIconElements(0)[0].classList.contains('value-icon-1')).toEqual(true);

          testContext.setData({
            content: [
              testContext.createValueData({
                icon: null,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(0);

          testContext.setData({
            content: [
              testContext.createValueData({
                icon: 'value-icon-2',
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueIconElements(0).length).toEqual(1);
          expect(testContext.getValueIconElements(0)[0].classList.contains('value-icon-2')).toEqual(true);
        });
      });

      describe('text', () => {
        const valueText = 'value-text';
        it('should be rendered as plain text when input data content item link is null', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                text: valueText,
                link: null,
              }),
            ],
          });
          testContext.component.ngOnChanges({
            data: new SimpleChange(undefined, testContext.component.data, false),
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText);
          expect(testContext.getValueTextElements(0).length).toEqual(1);
          expect(testContext.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText);
          expect(testContext.getValueLinkElements(0).length).toEqual(0);
        });

        const valueLinkText = 'value-link-text';
        it('should be rendered as link when input data content item link is defined', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                text: valueLinkText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueLinkText);
          expect(testContext.getValueTextElements(0).length).toEqual(0);
          expect(testContext.getValueLinkElements(0).length).toEqual(1);
          expect(testContext.getValueLinkElements(0)[0].textContent?.trim()).toEqual(valueLinkText);
        });

        it("should invoke link's clickHandler() when link element is clicked", () => {
          const link1 = { clickHandler: (): any => null };
          const link1ClickHandlerSpy = vi.spyOn(link1, 'clickHandler').mockImplementation(() => undefined);
          const link2 = { clickHandler: (): any => null };
          const link2ClickHandlerSpy = vi.spyOn(link2, 'clickHandler').mockImplementation(() => undefined);

          testContext.setData({
            content: [
              testContext.createValueData({
                text: 'value-link-1-text',
                link: link1,
              }),
              testContext.createValueData({
                text: 'value-link-2-text',
                link: link2,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValueLinkElements(0).length).toEqual(1);
          testContext.getValueLinkElements(0)[0].click();
          expect(vi.mocked(link1ClickHandlerSpy).mock.calls.length).toEqual(1);
          expect(vi.mocked(link1ClickHandlerSpy).mock.lastCall).toEqual([]);
          expect(testContext.getValueLinkElements(1).length).toEqual(1);
          testContext.getValueLinkElements(1)[0].click();
          expect(vi.mocked(link2ClickHandlerSpy).mock.calls.length).toEqual(1);
          expect(vi.mocked(link2ClickHandlerSpy).mock.lastCall).toEqual([]);
        });

        it('should be displayed after icon', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                icon: valueIcon,
                text: valueText,
                link: null,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          const iconElement = testContext.getValueIconElements(0)[0];
          const textElement = testContext.getValueTextElements(0)[0];
          expect(textElement.previousElementSibling).toBe(iconElement);

          testContext.setData({
            content: [
              testContext.createValueData({
                icon: valueIcon,
                text: valueText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          renderFixture(testContext.fixture);
          const iconElement2 = testContext.getValueIconElements(0)[0];
          const linkElement = testContext.getValueLinkElements(0)[0];
          expect(linkElement.previousElementSibling).toBe(iconElement2);
        });

        it('should be updated when input data content item text changes', () => {
          testContext.setData({
            content: [
              testContext.createValueData({
                text: valueText,
                link: null,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText);
          expect(testContext.getValueTextElements(0).length).toEqual(1);
          expect(testContext.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText);
          expect(testContext.getValueLinkElements(0).length).toEqual(0);

          testContext.setData({
            content: [
              testContext.createValueData({
                text: valueLinkText,
                link: { clickHandler: () => null },
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueLinkText);
          expect(testContext.getValueTextElements(0).length).toEqual(0);
          expect(testContext.getValueLinkElements(0).length).toEqual(1);
          expect(testContext.getValueLinkElements(0)[0].textContent?.trim()).toEqual(valueLinkText);

          testContext.setData({
            content: [
              testContext.createValueData({
                text: valueText2,
                link: null,
              }),
            ],
          });
          renderFixture(testContext.fixture);
          expect(testContext.getValuesElements()[0].textContent?.trim()).toEqual(valueText2);
          expect(testContext.getValueTextElements(0).length).toEqual(1);
          expect(testContext.getValueTextElements(0)[0].textContent?.trim()).toEqual(valueText2);
          expect(testContext.getValueLinkElements(0).length).toEqual(0);
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
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `{{ model.text }}`,
})
class MockComponent implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}

@Component({
  selector: 'appfx-property-view-property-value-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
