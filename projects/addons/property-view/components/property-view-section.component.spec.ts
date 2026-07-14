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
import {
  PropertyViewMessageModel,
  PropertyViewModelType,
  PropertyViewPropertyModel,
  PropertyViewSectionModel,
} from '../property-view.model';
import { PropertyViewStrings } from '../property-view-strings.service';
import { PropertyViewSectionComponent } from './property-view-section.component';

@Component({
  selector: '[appfx-property-view-message]',
  standalone: false,
  template: '',
})
class PropertyViewMessageMockComponent {
  @Input()
  data: PropertyViewMessageModel;
}

@Component({
  selector: '[appfx-property-view-property]',
  standalone: false,
  template: '',
})
class PropertyViewPropertyMockComponent {
  @Input()
  data: PropertyViewPropertyModel;
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

describe('PropertyViewSectionComponent', function () {
  const titleContainerClass = 'pv-section-title-container';
  const titleContainerSelector = `tr.${titleContainerClass}`;
  const titleExpandButtonSelector = `${titleContainerSelector} .pv-section-title-expand-button`;
  const titleExpandButtonIconSelector = `${titleExpandButtonSelector} cds-icon`;
  const titleIconElementSelector = `${titleContainerSelector} .pv-section-title-icon`;
  const titleTextElementSelector = `${titleContainerSelector} .pv-section-title-text`;
  const titleActionsDropdownTriggersSelector =
    `${titleContainerSelector}` + ' clr-dropdown.pv-section-actions-dropdown > button[clrDropdownTrigger]';
  beforeEach(function (this: ThisTest) {
    this.createData = (overrides: Partial<PropertyViewSectionModel>) => {
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
    this.getTitleContainerElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleContainerSelector));
    };
    this.getTitleExpandButtonElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleExpandButtonSelector));
    };
    this.getTitleExpandButtonIconElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleExpandButtonIconSelector));
    };
    this.getTitleIconElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleIconElementSelector));
    };
    this.getTitleTextElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleTextElementSelector));
    };
    this.getTitleActionsDropdownTriggers = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll(titleActionsDropdownTriggersSelector));
    };
    this.getTitleActionsDropdownMenusItems = () => {
      return Array.prototype.slice.call(document.querySelectorAll('clr-dropdown-menu .dropdown-item'));
    };
    this.getContentDebugElements = () => {
      return this.fixture.debugElement.queryAll(By.css(`tr:not(.${titleContainerClass})`));
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

    this.fixture = TestBed.createComponent(PropertyViewSectionComponent);
    this.component = this.fixture.componentInstance;
    this.element = this.fixture.nativeElement;
    this.propertyViewStrings = TestBed.inject(PropertyViewStrings);
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  const titleText = 'title-text';
  describe('title', function () {
    it('should not be rendered when input data title is null', function (this: ThisTest) {
      this.component.data = this.createData({
        title: null,
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(0);
    });

    it('should not be rendered when input data title is empty', function (this: ThisTest) {
      this.component.data = this.createData({
        title: '',
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(0);
    });

    it('should be rendered when input data title is not null or empty', function (this: ThisTest) {
      this.component.data = this.createData({
        title: titleText,
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(1);
    });

    const titleText2 = 'title-text-2';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should be updated when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        title: 'title-text-1',
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(1);

      this.component.data = this.createData({
        title: null,
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(0);

      this.component.data = this.createData({
        title: titleText2,
      });
      this.fixture.detectChanges();
      expect(this.getTitleContainerElements().length).toEqual(1);
    });

    describe('expand button', function () {
      it('should not have text', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonElements()[0].textContent?.trim()).toEqual('');
      });

      it('should contain a single caret icon', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonElements()[0].querySelectorAll('cds-icon').length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('shape')).toEqual('angle');
      });

      it('should have collapsed state when input expanded is false', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });
        this.component.expanded = false;
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonElements()[0].getAttribute('aria-label')).toEqual(
          this.propertyViewStrings.toggle.replace('{0}', this.component.data.title || '')
        );
        expect(this.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');
      });

      it('should have expanded state when input expanded is true', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });
        this.component.expanded = true;
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonElements()[0].getAttribute('aria-label')).toEqual(
          this.propertyViewStrings.toggle.replace('{0}', this.component.data.title || '')
        );
        expect(this.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');
      });

      it('should not change its expanded state and input expanded when clicked', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });

        this.component.expanded = true;
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');

        this.getTitleExpandButtonElements()[0].click();
        this.fixture.detectChanges();
        expect(this.component.expanded).toEqual(true);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('down');

        this.component.expanded = false;
        this.fixture.detectChanges();
        expect(this.getTitleExpandButtonElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements().length).toEqual(1);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');

        this.getTitleExpandButtonElements()[0].click();
        this.fixture.detectChanges();
        expect(this.component.expanded).toEqual(false);
        expect(this.getTitleExpandButtonIconElements()[0].getAttribute('direction')).toEqual('right');
      });

      it('should trigger "expandedChange" event' + ' when clicked', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
        });

        const emitSpy = spyOn(this.component.expandedChange, 'emit');

        this.component.expanded = true;
        this.fixture.detectChanges();
        this.getTitleExpandButtonElements()[0].click();
        expect(emitSpy.calls.count()).toEqual(1);
        expect(emitSpy.calls.argsFor(0)).toEqual([false]);
        this.getTitleExpandButtonElements()[0].click();
        expect(emitSpy.calls.count()).toEqual(2);
        expect(emitSpy.calls.argsFor(1)).toEqual([false]);

        this.component.expanded = false;
        this.fixture.detectChanges();
        this.getTitleExpandButtonElements()[0].click();
        expect(emitSpy.calls.count()).toEqual(3);
        expect(emitSpy.calls.argsFor(2)).toEqual([true]);
        this.getTitleExpandButtonElements()[0].click();
        expect(emitSpy.calls.count()).toEqual(4);
        expect(emitSpy.calls.argsFor(3)).toEqual([true]);
      });
    });

    const titleIcon = 'title-icon';
    describe('icon', function () {
      it('should not be rendered when input data title icon is null', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          titleIcon: null,
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(0);
      });

      it('should not be rendered when input data title icon is empty', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          titleIcon: '',
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(0);
      });

      it('should be rendered when input data title icon is defined', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          titleIcon: titleIcon,
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(1);
        expect(this.getTitleIconElements()[0].classList.contains(titleIcon)).toEqual(true);
      });

      it('should be updated when input data changes', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          titleIcon: 'title-icon-1',
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(1);
        expect(this.getTitleIconElements()[0].classList.contains('title-icon-1')).toEqual(true);

        this.component.data = this.createData({
          title: titleText,
          titleIcon: null,
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(0);

        this.component.data = this.createData({
          title: titleText,
          titleIcon: 'title-icon-2',
        });
        this.fixture.detectChanges();
        expect(this.getTitleIconElements().length).toEqual(1);
        expect(this.getTitleIconElements()[0].classList.contains('title-icon-2')).toEqual(true);
      });
    });

    describe('text', function () {
      const titleTextHtml = '<b>title-text</b>';
      it('should be rendered as plain text when input data renderAsHtml is false', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleTextHtml,
          renderAsHtml: false,
        });
        this.fixture.detectChanges();
        expect(this.element.textContent?.trim()).toEqual(titleTextHtml);
        expect(this.getTitleTextElements().length).toEqual(1);
        expect(this.getTitleTextElements()[0].textContent).toEqual(titleTextHtml);
        expect(this.getTitleTextElements()[0].innerHTML).toEqual('&lt;b&gt;title-text&lt;/b&gt;');
      });

      it('should be rendered as HTML when input data renderAsHtml is true', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleTextHtml,
          renderAsHtml: true,
        });
        this.fixture.detectChanges();
        expect(this.element.textContent?.trim()).toEqual(titleText);
        expect(this.getTitleTextElements().length).toEqual(1);
        expect(this.getTitleTextElements()[0].textContent).toEqual(titleText);
        expect(this.getTitleTextElements()[0].innerHTML).toEqual(titleTextHtml);
      });

      it('should be displayed after icon', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          titleIcon: titleIcon,
        });
        this.fixture.detectChanges();
        const iconElement = this.getTitleIconElements()[0];
        const textElement = this.getTitleTextElements()[0];
        expect(textElement.previousElementSibling).toBe(iconElement);
      });

      it('should be updated when input data changes', function (this: ThisTest) {
        const titleText1 = '<b>title-text-1</b>';
        this.component.data = this.createData({
          title: titleText1,
        });
        this.fixture.detectChanges();
        expect(this.element.textContent?.trim()).toEqual(titleText1);
        expect(this.getTitleTextElements().length).toEqual(1);
        expect(this.getTitleTextElements()[0].textContent).toEqual(titleText1);
        expect(this.getTitleTextElements()[0].innerHTML).toEqual('&lt;b&gt;title-text-1&lt;/b&gt;');

        this.component.data = this.createData({
          title: '<b>title-text-2</b>',
          renderAsHtml: true,
        });
        this.fixture.detectChanges();
        expect(this.element.textContent?.trim()).toEqual(titleText2);
        expect(this.getTitleTextElements().length).toEqual(1);
        expect(this.getTitleTextElements()[0].textContent).toEqual(titleText2);
        expect(this.getTitleTextElements()[0].innerHTML).toEqual('<b>title-text-2</b>');
      });
    });

    describe('actions dropdown', function () {
      it('should not be rendered when input data actions are empty', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          actions: [],
        });
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownTriggers().length).toEqual(0);
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(0);
      });

      it('should be rendered when input data actions are not empty', function (this: ThisTest) {
        this.component.data = this.createData({
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
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(0);

        this.getTitleActionsDropdownTriggers()[0].click();
        this.fixture.detectChanges();

        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(2);

        expect(this.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-1');
        expect(this.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(false);
        expect(this.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-2');
        expect(this.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(true);
      });

      it("should invoke action's clickHandler() when action element is clicked", fakeAsync(function (this: ThisTest) {
        const action1 = {
          title: 'action-1',
          isEnabled: true,
          clickHandler: (): void => {},
        };
        const action1ClickHandlerSpy = spyOn(action1, 'clickHandler');

        const action2 = {
          title: 'action-2',
          isEnabled: true,
          clickHandler: (): void => {},
        };
        const action2ClickHandlerSpy = spyOn(action2, 'clickHandler');

        this.component.data = this.createData({
          title: titleText,
          actions: [action1, action2],
        });
        this.fixture.detectChanges();

        this.getTitleActionsDropdownTriggers()[0].click();
        this.fixture.detectChanges();
        this.getTitleActionsDropdownMenusItems()[0].click();
        expect(action1ClickHandlerSpy.calls.count()).toEqual(1);
        expect(action1ClickHandlerSpy.calls.mostRecent().args).toEqual([]);
        this.fixture.detectChanges();
        tick();

        this.getTitleActionsDropdownTriggers()[0].click();
        this.fixture.detectChanges();
        this.getTitleActionsDropdownMenusItems()[1].click();
        expect(action2ClickHandlerSpy.calls.count()).toEqual(1);
        expect(action2ClickHandlerSpy.calls.mostRecent().args).toEqual([]);
        flush();
      }));

      it('should be displayed after text', function (this: ThisTest) {
        this.component.data = this.createData({
          title: titleText,
          actions: [
            {
              title: 'action-1',
              isEnabled: true,
              clickHandler: () => undefined,
            },
          ],
        });
        this.fixture.detectChanges();
        const textElement = this.getTitleTextElements()[0];
        const actionsContainerElement = <HTMLElement>this.getTitleActionsDropdownTriggers()[0].parentElement;
        expect(actionsContainerElement.previousElementSibling).toBe(textElement);
      });

      it('should be updated when input data changes', function (this: ThisTest) {
        this.component.data = this.createData({
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
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(0);
        this.getTitleActionsDropdownTriggers()[0].click();
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(2);
        expect(this.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-1');
        expect(this.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(false);
        expect(this.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-2');
        expect(this.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(true);

        this.component.data = this.createData({
          title: titleText,
          actions: [],
        });
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownTriggers().length).toEqual(0);
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(0);

        this.component.data = this.createData({
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
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownTriggers().length).toEqual(1);
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(0);
        this.getTitleActionsDropdownTriggers()[0].click();
        this.fixture.detectChanges();
        expect(this.getTitleActionsDropdownMenusItems().length).toEqual(2);
        expect(this.getTitleActionsDropdownMenusItems()[0].textContent).toEqual('action-3');
        expect(this.getTitleActionsDropdownMenusItems()[0].classList.contains('disabled')).toEqual(true);
        expect(this.getTitleActionsDropdownMenusItems()[1].textContent).toEqual('action-4');
        expect(this.getTitleActionsDropdownMenusItems()[1].classList.contains('disabled')).toEqual(false);
      });
    });
  });

  describe('content', function () {
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

    it('should not be rendered when input data content is empty', function (this: ThisTest) {
      this.component.data = this.createData({
        content: [],
      });
      this.fixture.detectChanges();
      expect(this.getContentDebugElements().length).toEqual(0);
    });

    it('should be rendered when input data content is not empty', function (this: ThisTest) {
      this.component.data = this.createData({
        content: [message1Data, property1Data, message2Data, property2Data],
      });
      this.fixture.detectChanges();
      expect(this.getContentDebugElements().length).toEqual(4);
      expect(this.getContentDebugElements()[0].componentInstance).toEqual(
        jasmine.any(PropertyViewMessageMockComponent)
      );
      expect(this.getContentDebugElements()[0].componentInstance.data).toBe(message1Data);
      expect(this.getContentDebugElements()[1].componentInstance).toEqual(
        jasmine.any(PropertyViewPropertyMockComponent)
      );
      expect(this.getContentDebugElements()[1].componentInstance.data).toBe(property1Data);
      expect(this.getContentDebugElements()[2].componentInstance).toEqual(
        jasmine.any(PropertyViewMessageMockComponent)
      );
      expect(this.getContentDebugElements()[2].componentInstance.data).toBe(message2Data);
      expect(this.getContentDebugElements()[3].componentInstance).toEqual(
        jasmine.any(PropertyViewPropertyMockComponent)
      );
      expect(this.getContentDebugElements()[3].componentInstance.data).toBe(property2Data);
    });

    it('should be rendered after title', function (this: ThisTest) {
      this.component.data = this.createData({
        title: titleText,
        content: [message1Data, message2Data],
      });
      this.fixture.detectChanges();
      const titleElement = this.getTitleContainerElements()[0];
      const firstContentItem: Element = this.getContentDebugElements()[0].nativeElement;
      expect(firstContentItem.previousElementSibling).toBe(titleElement);
    });

    it('should be updated when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        content: [property1Data, message1Data],
      });
      this.fixture.detectChanges();
      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].componentInstance).toEqual(
        jasmine.any(PropertyViewPropertyMockComponent)
      );
      expect(this.getContentDebugElements()[0].componentInstance.data).toBe(property1Data);
      expect(this.getContentDebugElements()[1].componentInstance).toEqual(
        jasmine.any(PropertyViewMessageMockComponent)
      );
      expect(this.getContentDebugElements()[1].componentInstance.data).toBe(message1Data);

      this.component.data = this.createData({
        content: [message1Data, message2Data, property2Data],
      });
      this.fixture.detectChanges();
      expect(this.getContentDebugElements().length).toEqual(3);
      expect(this.getContentDebugElements()[0].componentInstance).toEqual(
        jasmine.any(PropertyViewMessageMockComponent)
      );
      expect(this.getContentDebugElements()[0].componentInstance.data).toBe(message1Data);
      expect(this.getContentDebugElements()[1].componentInstance).toEqual(
        jasmine.any(PropertyViewMessageMockComponent)
      );
      expect(this.getContentDebugElements()[1].componentInstance.data).toBe(message2Data);
      expect(this.getContentDebugElements()[2].componentInstance).toEqual(
        jasmine.any(PropertyViewPropertyMockComponent)
      );
      expect(this.getContentDebugElements()[2].componentInstance.data).toBe(property2Data);
    });

    it('should not be indented when input data title is empty', function (this: ThisTest) {
      this.component.data = this.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['indented']).toBeFalsy();
      expect(this.getContentDebugElements()[1].classes['indented']).toBeFalsy();
    });

    it('should be indented when input data title is not empty', function (this: ThisTest) {
      this.component.data = this.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['indented']).toEqual(true);
      expect(this.getContentDebugElements()[1].classes['indented']).toEqual(true);
    });

    it('should be expanded when input data title is empty and input expanded is false', function (this: ThisTest) {
      this.component.data = this.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      this.component.expanded = false;
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(this.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });

    it('should be expanded when input data title is empty and input expanded is true', function (this: ThisTest) {
      this.component.data = this.createData({
        title: '',
        content: [property1Data, message2Data],
      });
      this.component.expanded = true;
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(this.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });

    it('should not be expanded when input data title is not empty and input expanded is false', function (this: ThisTest) {
      this.component.data = this.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      this.component.expanded = false;
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['collapsed']).toEqual(true);
      expect(this.getContentDebugElements()[1].classes['collapsed']).toEqual(true);
    });

    it('should be expanded when input data title is not empty and input expanded is true', function (this: ThisTest) {
      this.component.data = this.createData({
        title: 'title',
        content: [property1Data, message2Data],
      });
      this.component.expanded = true;
      this.fixture.detectChanges();

      expect(this.getContentDebugElements().length).toEqual(2);
      expect(this.getContentDebugElements()[0].classes['collapsed']).toBeFalsy();
      expect(this.getContentDebugElements()[1].classes['collapsed']).toBeFalsy();
    });
  });
});
