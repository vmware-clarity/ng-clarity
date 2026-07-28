/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PropertyViewConfigProvider } from '../property-view-config-provider';
import { PropertyViewSectionsExpandedStateManager } from '../property-view-sections-expanded-state.manager';
import { PropertyViewCategoryModel, PropertyViewModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewCategoryComponent } from './property-view-category.component';
import { PropertyViewComponent } from './property-view.component';

import Spy = jasmine.Spy;

@Component({
  selector: 'appfx-property-view-category',
  standalone: false,
  template: '',
})
class PropertyViewCategoryMockComponent {
  @Input() componentId: string;

  @Input() data: PropertyViewCategoryModel;
}

class PropertyViewCategoriesSectionsExpandedStateManagerMock {
  update(): void {
    // no action
  }
}

interface PropertyViewConfigProviderMock {
  getConfig: Spy;
  setConfig: Spy;
}

interface ThisTest {
  fixture: ComponentFixture<PropertyViewComponent>;
  component: PropertyViewComponent;
  element: Element;
  propertyViewConfigProvider: PropertyViewConfigProviderMock;
  expandedStateManager: PropertyViewCategoriesSectionsExpandedStateManagerMock;
  createData: (overrides: Partial<PropertyViewModel>) => PropertyViewModel;
  getTabListElement: () => Element | null;
  getTabsElements: () => Array<HTMLButtonElement>;
  getActiveTabsElements: () => Array<HTMLButtonElement>;
  getTabsLabels: () => Array<string | null>;
  getActiveTabsLabels: () => Array<string | null>;
  getCategoryComponents: () => Array<PropertyViewCategoryComponent>;
}

describe('PropertyViewComponent', function () {
  const cat1Data: PropertyViewCategoryModel = {
    type: PropertyViewModelType.Category,
    id: 'cat-1',
    title: 'cat-1',
    content: [],
  };
  const cat2Data: PropertyViewCategoryModel = {
    type: PropertyViewModelType.Category,
    id: 'cat-2',
    title: 'cat-2',
    content: [],
  };
  const cat3Data: PropertyViewCategoryModel = {
    type: PropertyViewModelType.Category,
    id: 'cat-3',
    title: 'cat-3',
    content: [],
  };

  beforeEach(function (this: ThisTest) {
    this.createData = (overrides: Partial<PropertyViewModel>) => {
      const defaultData: PropertyViewModel = {
        categories: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.getTabListElement = () => {
      return this.element.querySelector('ul');
    };
    this.getTabsElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll('ul > li > button'));
    };
    this.getActiveTabsElements = () => {
      return Array.prototype.slice.call(this.element.querySelectorAll('ul > li > button.active'));
    };
    this.getTabsLabels = () => {
      return this.getTabsElements().map(element => element.textContent);
    };
    this.getActiveTabsLabels = () => {
      return this.getActiveTabsElements().map(element => element.textContent);
    };
    this.getCategoryComponents = () => {
      return this.fixture.debugElement
        .queryAll(By.directive(PropertyViewCategoryMockComponent))
        .map(debugElement => debugElement.componentInstance);
    };

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PropertyViewComponent, PropertyViewCategoryMockComponent],
    });

    this.expandedStateManager = new PropertyViewCategoriesSectionsExpandedStateManagerMock();
    // Override the provider in PropertyViewComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewSectionsExpandedStateManager, {
      useValue: this.expandedStateManager,
    });

    this.propertyViewConfigProvider = {
      getConfig: jasmine.createSpy('getConfig').and.returnValue(undefined),
      setConfig: jasmine.createSpy('setConfig'),
    };
    // Override the provider in PropertyViewPropertyComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewConfigProvider, {
      useValue: this.propertyViewConfigProvider,
    });

    this.fixture = TestBed.createComponent(PropertyViewComponent);
    this.component = this.fixture.componentInstance;
    this.element = this.fixture.nativeElement;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  describe('categories tab list', function () {
    it('should not be rendered when input data is undefined', function (this: ThisTest) {
      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data is null', function (this: ThisTest) {
      this.component.data = null;
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data categories are empty', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data contains a single category', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);
    });

    it('should be rendered and contain a tab for each category when there is more than one category', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).not.toEqual(null);
      expect(this.getTabsLabels()).toEqual(['cat-1', 'cat-2']);
    });

    it('should update when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).not.toEqual(null);
      expect(this.getTabsLabels()).toEqual(['cat-1', 'cat-2']);

      this.component.data = this.createData({
        categories: [cat2Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).not.toEqual(null);
      expect(this.getTabsLabels()).toEqual(['cat-2', 'cat-3']);

      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);

      this.component.data = this.createData({
        categories: [cat3Data, cat1Data],
      });
      this.fixture.detectChanges();
      expect(this.getTabListElement()).not.toEqual(null);
      expect(this.getTabsLabels()).toEqual(['cat-3', 'cat-1']);
    });
  });

  describe('category component', function () {
    it('should not be rendered when input data is undefined', function (this: ThisTest) {
      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(0);
    });

    it('should not be rendered when input data is null', function (this: ThisTest) {
      this.component.data = null;
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(0);
    });

    it('should not be rendered when input data categories are empty', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(0);
    });

    it('should be rendered when input data contains a single category', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(1);
    });

    it('should be rendered when input data contains multiple categories', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(1);
    });

    it('should update when input data changes', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(1);

      this.component.data = this.createData({
        categories: [cat2Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(1);

      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(0);

      this.component.data = this.createData({
        categories: [cat3Data, cat1Data],
      });
      this.fixture.detectChanges();
      expect(this.getCategoryComponents().length).toEqual(1);
    });
  });

  describe('selected category', function () {
    it('should be the first one by default', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(this.getCategoryComponents()[0].data).toBe(cat1Data);
    });

    it('should change when a category list tab is clicked', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data],
      });
      this.fixture.detectChanges();

      this.getTabsElements()[1].click();
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(this.getCategoryComponents()[0].data).toBe(cat2Data);
    });

    it('should be retained after categories are modified and the selected category still exists', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat2Data, cat3Data],
      });
      this.fixture.detectChanges();

      this.component.data = this.createData({
        categories: [cat1Data, cat2Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(this.getCategoryComponents()[0].data).toBe(cat2Data);

      this.getTabsElements()[2].click();
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(this.getCategoryComponents()[0].data).toBe(cat3Data);

      this.component.data = this.createData({
        categories: [cat1Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(this.getCategoryComponents()[0].data).toBe(cat3Data);
    });

    it('should be reset to the first one after categories are modified and the selected category does not exist', function (this: ThisTest) {
      this.component.data = this.createData({
        categories: [cat1Data, cat2Data, cat3Data],
      });
      this.fixture.detectChanges();

      this.getTabsElements()[1].click();
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(this.getCategoryComponents()[0].data).toBe(cat2Data);

      this.component.data = this.createData({
        categories: [cat1Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(this.getCategoryComponents()[0].data).toBe(cat1Data);

      this.getTabsElements()[1].click();
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(this.getCategoryComponents()[0].data).toBe(cat3Data);

      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(this.getTabListElement()).toEqual(null);
      expect(this.getTabsElements()).toEqual([]);
      expect(this.getCategoryComponents().length).toEqual(0);

      this.component.data = this.createData({
        categories: [cat1Data, cat2Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(this.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(this.getCategoryComponents()[0].data).toBe(cat1Data);
    });
  });

  describe('expanded state manager', function () {
    it('should be updated with empty categories when input data is undefined', function (this: ThisTest) {
      const updateSpy = spyOn(this.expandedStateManager, 'update');

      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(1);
      expect(updateSpy.calls.all()[0].args).toEqual(<any>[[]]);
    });

    it('should be updated with empty categories when input data is null', function (this: ThisTest) {
      const updateSpy = spyOn(this.expandedStateManager, 'update');

      this.component.data = null;
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(1);
      expect(updateSpy.calls.all()[0].args).toEqual(<any>[[]]);
    });

    it('should be updated with correct categories when input data is defined', function (this: ThisTest) {
      const updateSpy = spyOn(this.expandedStateManager, 'update');

      this.component.data = this.createData({
        categories: [cat1Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(1);
      expect(updateSpy.calls.all()[0].args).toEqual(<any>[[cat1Data, cat3Data]]);
    });

    it('should be updated with correct categories when input data changes', function (this: ThisTest) {
      const updateSpy = spyOn(this.expandedStateManager, 'update');

      this.component.data = undefined;
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(1);
      expect(updateSpy.calls.argsFor(0)).toEqual(<any>[[]]);

      this.component.data = this.createData({
        categories: [cat2Data, cat3Data],
      });
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(2);
      expect(updateSpy.calls.argsFor(1)).toEqual(<any>[[cat2Data, cat3Data]]);

      this.component.data = this.createData({
        categories: [cat3Data, cat1Data],
      });
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(3);
      expect(updateSpy.calls.argsFor(2)).toEqual(<any>[[cat3Data, cat1Data]]);

      this.component.data = null;
      this.fixture.detectChanges();
      expect(updateSpy.calls.count()).toEqual(4);
      expect(updateSpy.calls.argsFor(3)).toEqual(<any>[[]]);
    });
  });

  describe('property view config provider', function () {
    it('setConfig() should be called when PropertyViewComponent.config is set', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(this.propertyViewConfigProvider.setConfig.calls.count()).toEqual(0);

      this.component.config = {
        propertyKeyWidthInRem: 10,
      };
      expect(this.propertyViewConfigProvider.setConfig.calls.count()).toEqual(1);
      expect(this.propertyViewConfigProvider.setConfig.calls.mostRecent().args).toEqual([
        {
          propertyKeyWidthInRem: 10,
        },
      ]);
    });
  });

  describe('#onTabListKeydown', () => {
    it('should not update focusedCategoryId if data is undefined', function (this: ThisTest) {
      this.component.data = undefined;
      this.component.focusedCategoryId = '0';

      this.component.onTabListKeydown({ key: 'ArrowRight' } as KeyboardEvent);

      expect(this.component.focusedCategoryId).toBe('0');
    });

    it('should not update focusedCategoryId if data.categories is empty', function (this: ThisTest) {
      this.component.data = { categories: [] };
      this.component.focusedCategoryId = '0';

      this.component.onTabListKeydown({ key: 'ArrowRight' } as KeyboardEvent);

      expect(this.component.focusedCategoryId).toBe('0');
    });

    it('should handle ArrowRight key press', function (this: ThisTest) {
      const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const initialFocusedCategoryId = 'cat-2';

      this.component.data = this.createData({
        categories: [cat1Data, cat2Data, cat3Data],
      });
      this.fixture.detectChanges();

      this.component.focusedCategoryId = initialFocusedCategoryId;
      this.component.onTabListKeydown(mockEvent);

      expect(this.component.focusedCategoryId).toBe('cat-3');
    });

    it('should handle ArrowLeft key press', function (this: ThisTest) {
      const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const initialFocusedCategoryId = 'cat-2';

      this.component.data = this.createData({
        categories: [cat1Data, cat2Data, cat3Data],
      });
      this.fixture.detectChanges();

      this.component.focusedCategoryId = initialFocusedCategoryId;
      this.component.onTabListKeydown(mockEvent);

      expect(this.component.focusedCategoryId).toBe('cat-1');
    });
  });
});
