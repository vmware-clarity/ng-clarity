/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { MockPropertyViewStrings } from '../../testing';
import { PropertyViewStrings } from '../property-view-strings.service';
import {
  PropertyViewMessageModel,
  PropertyViewModelType,
  PropertyViewPropertyModel,
  PropertyViewSectionModel,
} from '../property-view.model';
import { PropertyViewSectionComponent } from './property-view-section.component';

@Component({
  selector: '[appfx-property-view-message]',
  standalone: false,
  template: '',
})
class PropertyViewMessageMockComponent {
  @Input() data: PropertyViewMessageModel;
}

@Component({
  selector: '[appfx-property-view-property]',
  standalone: false,
  template: '',
})
class PropertyViewPropertyMockComponent {
  @Input() data: PropertyViewPropertyModel;
}

interface ThisTest {
  fixture: ComponentFixture<PropertyViewSectionComponent>;
  component: PropertyViewSectionComponent;
  element: Element;
  propertyViewStrings: PropertyViewStrings;
  createData: (overrides: Partial<PropertyViewSectionModel>) => PropertyViewSectionModel;
  getTitleContainerElements: () => Array<Element>;
  getTitleExpandButtonElements: () => Array<HTMLButtonElement>;
  getTitleExpandButtonIconElements: () => Array<Element>;
  getTitleIconElements: () => Array<Element>;
  getTitleTextElements: () => Array<Element>;
  getTitleActionsDropdownTriggers: () => Array<HTMLButtonElement>;
  getTitleActionsDropdownMenusItems: () => Array<HTMLElement>;
  getContentDebugElements: () => Array<DebugElement>;
}

describe('PropertyViewSectionComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  const titleContainerClass = 'pv-section-title-container';
  const titleContainerSelector = `tr.${titleContainerClass}`;
  const titleExpandButtonSelector = `${titleContainerSelector} .pv-section-title-expand-button`;
  const titleExpandButtonIconSelector = `${titleExpandButtonSelector} cds-icon`;
  const titleIconElementSelector = `${titleContainerSelector} .pv-section-title-icon`;
  const titleTextElementSelector = `${titleContainerSelector} .pv-section-title-text`;
  const titleActionsDropdownTriggersSelector =
    `${titleContainerSelector}` + ' clr-dropdown.pv-section-actions-dropdown > button[clrDropdownTrigger]';
  beforeEach(() => {
    testContext.createData = (overrides: Partial<PropertyViewSectionModel>) => {
      const defaultData: PropertyViewSectionModel = {
        type: PropertyViewModelType.Section,
        id: '',
        renderAsHtml: false,
        collapseContent: false,
        title: null,
        titleIcon: null,
        actions: [],
        content: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.getTitleContainerElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleContainerSelector));
    };
    testContext.getTitleExpandButtonElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleExpandButtonSelector));
    };
    testContext.getTitleExpandButtonIconElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleExpandButtonIconSelector));
    };
    testContext.getTitleIconElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleIconElementSelector));
    };
    testContext.getTitleTextElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleTextElementSelector));
    };
    testContext.getTitleActionsDropdownTriggers = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll(titleActionsDropdownTriggersSelector));
    };
    testContext.getTitleActionsDropdownMenusItems = () => {
      return Array.prototype.slice.call(document.querySelectorAll('clr-dropdown-menu .dropdown-item'));
    };
    testContext.getContentDebugElements = () => {
      return testContext.fixture.debugElement.queryAll(By.css(`tr:not(.${titleContainerClass})`));
    };

    TestBed.configureTestingModule({
      imports: [ClrDropdownModule, NoopAnimationsModule],
      declarations: [PropertyViewSectionComponent, PropertyViewMessageMockComponent, PropertyViewPropertyMockComponent],
      providers: [
        {
          provide: PropertyViewStrings,
          useClass: MockPropertyViewStrings,
        },
      ],
    });

    testContext.fixture = TestBed.createComponent(PropertyViewSectionComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.element = testContext.fixture.nativeElement;
    testContext.propertyViewStrings = TestBed.inject(PropertyViewStrings);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  const titleText = 'title-text';
  describe('title', () => {
    it('should not be rendered when input data title is null', () => {
      testContext.component.data = testContext.createData({
        title: null,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(0);
    });

    it('should not be rendered when input data title is empty', () => {
      testContext.component.data = testContext.createData({
        title: '',
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(0);
    });

    it('should be rendered when input data title is not null or empty', () => {
      testContext.component.data = testContext.createData({
        title: titleText,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(1);
    });

    const titleText2 = 'title-text-2';
    it('should be updated when input data changes', () => {
      testContext.component.data = testContext.createData({
        title: 'title-text-1',
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(1);

      testContext.component.data = testContext.createData({
        title: null,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(0);

      testContext.component.data = testContext.createData({
        title: titleText2,
      });
      testContext.fixture.detectChanges();
      expect(testContext.getTitleContainerElements().length).toEqual(1);
    });

    describe('expand button', () => {
      it('should not have text', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonElements()[0].textContent?.trim()).toEqual('');
      });

      it('should contain a single caret icon', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonElements()[0].querySelectorAll('cds-icon').length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('shape')).toEqual('angle');
      });

      it('should have collapsed state when input expanded is false', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });
        testContext.component.expanded = false;
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonElements()[0].getAttribute('aria-label')).toEqual(
          testContext.propertyViewStrings.toggle.replace('{0}', testContext.component.data.title || '')
        );
        expect(testContext.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');
      });

      it('should have expanded state when input expanded is true', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });
        testContext.component.expanded = true;
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonElements()[0].getAttribute('aria-label')).toEqual(
          testContext.propertyViewStrings.toggle.replace('{0}', testContext.component.data.title || '')
        );
        expect(testContext.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');
      });

      it('should not change its expanded state and input expanded when clicked', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });

        testContext.component.expanded = true;
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');

        testContext.getTitleExpandButtonElements()[0].click();
        testContext.fixture.detectChanges();
        expect(testContext.component.expanded).toEqual(true);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');

        testContext.component.expanded = false;
        testContext.fixture.detectChanges();
        expect(testContext.getTitleExpandButtonElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');

        testContext.getTitleExpandButtonElements()[0].click();
        testContext.fixture.detectChanges();
        expect(testContext.component.expanded).toEqual(false);
        expect(testContext.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');
      });

      it('should trigger "expandedChange" event' + ' when clicked', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
        });

        const emitSpy = vi.spyOn(testContext.component.expandedChange, 'emit').mockImplementation(() => undefined);

        testContext.component.expanded = true;
        testContext.fixture.detectChanges();
        testContext.getTitleExpandButtonElements()[0].click();
        expect(vi.mocked(emitSpy).mock.calls.length).toEqual(1);
        expect(vi.mocked(emitSpy).mock.calls[0]).toEqual([false]);
        testContext.getTitleExpandButtonElements()[0].click();
        expect(vi.mocked(emitSpy).mock.calls.length).toEqual(2);
        expect(vi.mocked(emitSpy).mock.calls[1]).toEqual([false]);

        testContext.component.expanded = false;
        testContext.fixture.detectChanges();
        testContext.getTitleExpandButtonElements()[0].click();
        expect(vi.mocked(emitSpy).mock.calls.length).toEqual(3);
        expect(vi.mocked(emitSpy).mock.calls[2]).toEqual([true]);
        testContext.getTitleExpandButtonElements()[0].click();
        expect(vi.mocked(emitSpy).mock.calls.length).toEqual(4);
        expect(vi.mocked(emitSpy).mock.calls[3]).toEqual([true]);
      });
    });

    const titleIcon = 'title-icon';
    describe('icon', () => {
      it('should not be rendered when input data title icon is null', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: null,
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(0);
      });

      it('should not be rendered when input data title icon is empty', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: '',
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(0);
      });

      it('should be rendered when input data title icon is defined', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: titleIcon,
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(1);
        expect(testContext.getTitleIconElements()[0].classList.contains(titleIcon)).toEqual(true);
      });

      it('should be updated when input data changes', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: 'title-icon-1',
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(1);
        expect(testContext.getTitleIconElements()[0].classList.contains('title-icon-1')).toEqual(true);

        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: null,
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(0);

        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: 'title-icon-2',
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleIconElements().length).toEqual(1);
        expect(testContext.getTitleIconElements()[0].classList.contains('title-icon-2')).toEqual(true);
      });
    });

    describe('text', () => {
      const titleTextHtml = '<b>title-text</b>';
      it('should be rendered as plain text when input data renderAsHtml is false', () => {
        testContext.component.data = testContext.createData({
          title: titleTextHtml,
          renderAsHtml: false,
        });
        testContext.fixture.detectChanges();
        expect(testContext.element.textContent?.trim()).toEqual(titleTextHtml);
        expect(testContext.getTitleTextElements().length).toEqual(1);
        expect(testContext.getTitleTextElements()[0].textContent).toEqual(titleTextHtml);
        expect(testContext.getTitleTextElements()[0].innerHTML).toEqual('&lt;b&gt;title-text&lt;/b&gt;');
      });

      it('should be rendered as HTML when input data renderAsHtml is true', () => {
        testContext.component.data = testContext.createData({
          title: titleTextHtml,
          renderAsHtml: true,
        });
        testContext.fixture.detectChanges();
        expect(testContext.element.textContent?.trim()).toEqual(titleText);
        expect(testContext.getTitleTextElements().length).toEqual(1);
        expect(testContext.getTitleTextElements()[0].textContent).toEqual(titleText);
        expect(testContext.getTitleTextElements()[0].innerHTML).toEqual(titleTextHtml);
      });

      it('should be displayed after icon', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          titleIcon: titleIcon,
        });
        testContext.fixture.detectChanges();
        const iconElement = testContext.getTitleIconElements()[0];
        const textElement = testContext.getTitleTextElements()[0];
        expect(textElement.previousElementSibling).toBe(iconElement);
      });

      it('should be updated when input data changes', () => {
        const titleText1 = '<b>title-text-1</b>';
        testContext.component.data = testContext.createData({
          title: titleText1,
        });
        testContext.fixture.detectChanges();
        expect(testContext.element.textContent?.trim()).toEqual(titleText1);
        expect(testContext.getTitleTextElements().length).toEqual(1);
        expect(testContext.getTitleTextElements()[0].textContent).toEqual(titleText1);
        expect(testContext.getTitleTextElements()[0].innerHTML).toEqual('&lt;b&gt;title-text-1&lt;/b&gt;');

        testContext.component.data = testContext.createData({
          title: '<b>title-text-2</b>',
          renderAsHtml: true,
        });
        testContext.fixture.detectChanges();
        expect(testContext.element.textContent?.trim()).toEqual(titleText2);
        expect(testContext.getTitleTextElements().length).toEqual(1);
        expect(testContext.getTitleTextElements()[0].textContent).toEqual(titleText2);
        expect(testContext.getTitleTextElements()[0].innerHTML).toEqual('<b>title-text-2</b>');
      });
    });

    describe('actions dropdown', () => {
      it('should not be rendered when input data actions are empty', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [],
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownTriggers().length).toEqual(0);
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(0);
      });

      it('should be rendered when input data actions are not empty', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [
            {
              title: 'action-1',
              isEnabled: true,
              clickHandler: () => undefined,
            },
            {
              title: 'action-2',
              isEnabled: false,
              clickHandler: () => undefined,
            },
          ],
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(0);

        testContext.getTitleActionsDropdownTriggers()[0].click();
        testContext.fixture.detectChanges();

        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(2);

        expect(testContext.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-1');
        expect(testContext.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(false);
        expect(testContext.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-2');
        expect(testContext.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(true);
      });

      it("should invoke action's clickHandler() when action element is clicked", fakeAsync(() => {
        const action1 = {
          title: 'action-1',
          isEnabled: true,
          clickHandler: (): void => {},
        };
        const action1ClickHandlerSpy = vi.spyOn(action1, 'clickHandler').mockImplementation(() => undefined);

        const action2 = {
          title: 'action-2',
          isEnabled: true,
          clickHandler: (): void => {},
        };
        const action2ClickHandlerSpy = vi.spyOn(action2, 'clickHandler').mockImplementation(() => undefined);

        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [action1, action2],
        });
        testContext.fixture.detectChanges();

        testContext.getTitleActionsDropdownTriggers()[0].click();
        testContext.fixture.detectChanges();
        testContext.getTitleActionsDropdownMenusItems()[0].click();
        expect(vi.mocked(action1ClickHandlerSpy).mock.calls.length).toEqual(1);
        expect(vi.mocked(action1ClickHandlerSpy).mock.lastCall).toEqual([]);
        testContext.fixture.detectChanges();
        tick();

        testContext.getTitleActionsDropdownTriggers()[0].click();
        testContext.fixture.detectChanges();
        testContext.getTitleActionsDropdownMenusItems()[1].click();
        expect(vi.mocked(action2ClickHandlerSpy).mock.calls.length).toEqual(1);
        expect(vi.mocked(action2ClickHandlerSpy).mock.lastCall).toEqual([]);
        flush();
      }));

      it('should be displayed after text', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [
            {
              title: 'action-1',
              isEnabled: true,
              clickHandler: () => undefined,
            },
          ],
        });
        testContext.fixture.detectChanges();
        const textElement = testContext.getTitleTextElements()[0];
        const actionsContainerElement = <HTMLElement>testContext.getTitleActionsDropdownTriggers()[0].parentElement;
        expect(actionsContainerElement.previousElementSibling).toBe(textElement);
      });

      it('should be updated when input data changes', () => {
        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [
            {
              title: 'action-1',
              isEnabled: true,
              clickHandler: () => undefined,
            },
            {
              title: 'action-2',
              isEnabled: false,
              clickHandler: () => undefined,
            },
          ],
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(0);
        testContext.getTitleActionsDropdownTriggers()[0].click();
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(2);
        expect(testContext.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-1');
        expect(testContext.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(false);
        expect(testContext.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-2');
        expect(testContext.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(true);

        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [],
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownTriggers().length).toEqual(0);
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(0);

        testContext.component.data = testContext.createData({
          title: titleText,
          actions: [
            {
              title: 'action-3',
              isEnabled: false,
              clickHandler: () => undefined,
            },
            {
              title: 'action-4',
              isEnabled: true,
              clickHandler: () => undefined,
            },
          ],
        });
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(0);
        testContext.getTitleActionsDropdownTriggers()[0].click();
        testContext.fixture.detectChanges();
        expect(testContext.getTitleActionsDropdownMenusItems().length).toEqual(2);
        expect(testContext.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-3');
        expect(testContext.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(true);
        expect(testContext.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-4');
        expect(testContext.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(false);
      });
    });
  });

  describe('content', () => {
    const message1Data: PropertyViewMessageModel = {
      type: PropertyViewModelType.Message,
      text: 'message-1-text',
      icon: null,
      renderAsHtml: false,
    };
    const message2Data: PropertyViewMessageModel = {
      type: PropertyViewModelType.Message,
      text: 'message-2-text',
      icon: null,
      renderAsHtml: false,
    };
    const property1Data: PropertyViewPropertyModel = {
      type: PropertyViewModelType.Property,
      key: {
        type: PropertyViewModelType.PropertyKey,
        text: 'property-1-key',
        icon: null,
      },
      content: [],
    };
    const property2Data: PropertyViewPropertyModel = {
      type: PropertyViewModelType.Property,
      key: {
        type: PropertyViewModelType.PropertyKey,
        text: 'property-2-key',
        icon: null,
      },
      content: [],
    };

    it('should not be rendered when input data content is empty', () => {
      testContext.component.data = testContext.createData({
        content: [],
      });
      testContext.fixture.detectChanges();
      expect(testContext.getContentDebugElements().length).toEqual(0);
    });

    it('should be rendered when input data content is not empty', () => {
      testContext.component.data = testContext.createData({
        content: [message1Data, property1Data, message2Data, property2Data],
      });
      testContext.fixture.detectChanges();
      expect(testContext.getContentDebugElements().length).toEqual(4);
      expect(testContext.getContentDebugElements()[0].componentInstance).toEqual(
        expect.any(PropertyViewMessageMockComponent)
      );
      expect(testContext.getContentDebugElements()[0].componentInstance.data).toBe(message1Data);
      expect(testContext.getContentDebugElements()[1].componentInstance).toEqual(
        expect.any(PropertyViewPropertyMockComponent)
      );
      expect(testContext.getContentDebugElements()[1].componentInstance.data).toBe(property1Data);
      expect(testContext.getContentDebugElements()[2].componentInstance).toEqual(
        expect.any(PropertyViewMessageMockComponent)
      );
      expect(testContext.getContentDebugElements()[2].componentInstance.data).toBe(message2Data);
      expect(testContext.getContentDebugElements()[3].componentInstance).toEqual(
        expect.any(PropertyViewPropertyMockComponent)
      );
      expect(testContext.getContentDebugElements()[3].componentInstance.data).toBe(property2Data);
    });

    it('should be rendered after title', () => {
      testContext.component.data = testContext.createData({
        title: titleText,
        content: [message1Data, message2Data],
      });
      testContext.fixture.detectChanges();
      const titleElement = testContext.getTitleContainerElements()[0];
      const firstContentItem: Element = testContext.getContentDebugElements()[0].nativeElement;
      expect(firstContentItem.previousElementSibling).toBe(titleElement);
    });

    it('should be updated when input data changes', () => {
      testContext.component.data = testContext.createData({
        content: [property1Data, message1Data],
      });
      testContext.fixture.detectChanges();
      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].componentInstance).toEqual(
        expect.any(PropertyViewPropertyMockComponent)
      );
      expect(testContext.getContentDebugElements()[0].componentInstance.data).toBe(property1Data);
      expect(testContext.getContentDebugElements()[1].componentInstance).toEqual(
        expect.any(PropertyViewMessageMockComponent)
      );
      expect(testContext.getContentDebugElements()[1].componentInstance.data).toBe(message1Data);

      testContext.component.data = testContext.createData({
        content: [message1Data, message2Data, property2Data],
      });
      testContext.fixture.detectChanges();
      expect(testContext.getContentDebugElements().length).toEqual(3);
      expect(testContext.getContentDebugElements()[0].componentInstance).toEqual(
        expect.any(PropertyViewMessageMockComponent)
      );
      expect(testContext.getContentDebugElements()[0].componentInstance.data).toBe(message1Data);
      expect(testContext.getContentDebugElements()[1].componentInstance).toEqual(
        expect.any(PropertyViewMessageMockComponent)
      );
      expect(testContext.getContentDebugElements()[1].componentInstance.data).toBe(message2Data);
      expect(testContext.getContentDebugElements()[2].componentInstance).toEqual(
        expect.any(PropertyViewPropertyMockComponent)
      );
      expect(testContext.getContentDebugElements()[2].componentInstance.data).toBe(property2Data);
    });

    it('should not be indented when input data title is empty', () => {
      testContext.component.data = testContext.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['indented']).toBeFalsy();
      expect(testContext.getContentDebugElements()[1].classes['indented']).toBeFalsy();
    });

    it('should be indented when input data title is not empty', () => {
      testContext.component.data = testContext.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['indented']).toEqual(true);
      expect(testContext.getContentDebugElements()[1].classes['indented']).toEqual(true);
    });

    it('should be expanded when input data title is empty and input expanded is false', () => {
      testContext.component.data = testContext.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      testContext.component.expanded = false;
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(testContext.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });

    it('should be expanded when input data title is empty and input expanded is true', () => {
      testContext.component.data = testContext.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      testContext.component.expanded = true;
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(testContext.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });

    it('should not be expanded when input data title is not empty and input expanded is false', () => {
      testContext.component.data = testContext.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      testContext.component.expanded = false;
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['collapsed']).toEqual(true);
      expect(testContext.getContentDebugElements()[1].classes['collapsed']).toEqual(true);
    });

    it('should be expanded when input data title is not empty and input expanded is true', () => {
      testContext.component.data = testContext.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      testContext.component.expanded = true;
      testContext.fixture.detectChanges();

      expect(testContext.getContentDebugElements().length).toEqual(2);
      expect(testContext.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(testContext.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });
  });
});
