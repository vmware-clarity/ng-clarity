/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';
import type { Mock } from 'vitest';

import { PropertyViewConfigProvider } from '../property-view-config-provider';
import { PropertyViewSectionsExpandedStateManager } from '../property-view-sections-expanded-state.manager';
import { PropertyViewCategoryModel, PropertyViewModel, PropertyViewModelType } from '../property-view.model';
import { PropertyViewCategoryComponent } from './property-view-category.component';
import { PropertyViewComponent } from './property-view.component';

type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = Mock<T>;

@Component({
  selector: 'appfx-property-view-category',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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

describe('PropertyViewComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

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

  beforeEach(() => {
    testContext.createData = (overrides: Partial<PropertyViewModel>) => {
      const defaultData: PropertyViewModel = {
        categories: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.getTabListElement = () => {
      return testContext.element.querySelector('ul');
    };
    testContext.getTabsElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll('ul > li > button'));
    };
    testContext.getActiveTabsElements = () => {
      return Array.prototype.slice.call(testContext.element.querySelectorAll('ul > li > button.active'));
    };
    testContext.getTabsLabels = () => {
      return testContext.getTabsElements().map(element => element.textContent);
    };
    testContext.getActiveTabsLabels = () => {
      return testContext.getActiveTabsElements().map(element => element.textContent);
    };
    testContext.getCategoryComponents = () => {
      return testContext.fixture.debugElement
        .queryAll(By.directive(PropertyViewCategoryMockComponent))
        .map(debugElement => debugElement.componentInstance);
    };

    TestBed.configureTestingModule({
      declarations: [PropertyViewComponent, PropertyViewCategoryMockComponent],
    });

    testContext.expandedStateManager = new PropertyViewCategoriesSectionsExpandedStateManagerMock();
    // Override the provider in PropertyViewComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewSectionsExpandedStateManager, {
      useValue: testContext.expandedStateManager,
    });

    testContext.propertyViewConfigProvider = {
      getConfig: vi.fn().mockReturnValue(undefined),
      setConfig: vi.fn(),
    };
    // Override the provider in PropertyViewPropertyComponent. Note that this is
    // different from changing the provider in TestBed.configureTestingModule
    TestBed.overrideProvider(PropertyViewConfigProvider, {
      useValue: testContext.propertyViewConfigProvider,
    });

    testContext.fixture = TestBed.createComponent(PropertyViewComponent);
    testContext.component = testContext.fixture.componentInstance;
    testContext.element = testContext.fixture.nativeElement;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('categories tab list', () => {
    it('should not be rendered when input data is undefined', () => {
      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data is null', () => {
      testContext.fixture.componentRef.setInput('data', null);
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data categories are empty', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);
    });

    it('should not be rendered when input data contains a single category', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);
    });

    it('should be rendered and contain a tab for each category when there is more than one category', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).not.toEqual(null);
      expect(testContext.getTabsLabels()).toEqual(['cat-1', 'cat-2']);
    });

    it('should update when input data changes', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).not.toEqual(null);
      expect(testContext.getTabsLabels()).toEqual(['cat-1', 'cat-2']);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).not.toEqual(null);
      expect(testContext.getTabsLabels()).toEqual(['cat-2', 'cat-3']);

      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat3Data, cat1Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).not.toEqual(null);
      expect(testContext.getTabsLabels()).toEqual(['cat-3', 'cat-1']);
    });
  });

  describe('category component', () => {
    it('should not be rendered when input data is undefined', () => {
      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(0);
    });

    it('should not be rendered when input data is null', () => {
      testContext.fixture.componentRef.setInput('data', null);
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(0);
    });

    it('should not be rendered when input data categories are empty', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(0);
    });

    it('should be rendered when input data contains a single category', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(1);
    });

    it('should be rendered when input data contains multiple categories', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(1);
    });

    it('should update when input data changes', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(1);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(1);

      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(0);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat3Data, cat1Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getCategoryComponents().length).toEqual(1);
    });
  });

  describe('selected category', () => {
    it('should be the first one by default', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat1Data);
    });

    it('should change when a category list tab is clicked', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data],
        })
      );
      renderFixture(testContext.fixture);

      testContext.getTabsElements()[1].click();
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat2Data);
    });

    it('should be retained after categories are modified and the selected category still exists', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat2Data);

      testContext.getTabsElements()[2].click();
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat3Data);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat3Data);
    });

    it('should be reset to the first one after categories are modified and the selected category does not exist', () => {
      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);

      testContext.getTabsElements()[1].click();
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-2']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat2Data);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat1Data);

      testContext.getTabsElements()[1].click();
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-3']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat3Data);

      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(testContext.getTabListElement()).toEqual(null);
      expect(testContext.getTabsElements()).toEqual([]);
      expect(testContext.getCategoryComponents().length).toEqual(0);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(testContext.getActiveTabsLabels()).toEqual(['cat-1']);
      expect(testContext.getCategoryComponents()[0].data).toBe(cat1Data);
    });
  });

  describe('expanded state manager', () => {
    it('should be updated with empty categories when input data is undefined', () => {
      const updateSpy = vi.spyOn(testContext.expandedStateManager, 'update').mockImplementation(() => undefined);

      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(1);
      expect(vi.mocked(updateSpy).mock.calls[0]).toEqual(<any>[[]]);
    });

    it('should be updated with empty categories when input data is null', () => {
      const updateSpy = vi.spyOn(testContext.expandedStateManager, 'update').mockImplementation(() => undefined);

      testContext.fixture.componentRef.setInput('data', null);
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(1);
      expect(vi.mocked(updateSpy).mock.calls[0]).toEqual(<any>[[]]);
    });

    it('should be updated with correct categories when input data is defined', () => {
      const updateSpy = vi.spyOn(testContext.expandedStateManager, 'update').mockImplementation(() => undefined);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(1);
      expect(vi.mocked(updateSpy).mock.calls[0]).toEqual(<any>[[cat1Data, cat3Data]]);
    });

    it('should be updated with correct categories when input data changes', () => {
      const updateSpy = vi.spyOn(testContext.expandedStateManager, 'update').mockImplementation(() => undefined);

      testContext.fixture.componentRef.setInput('data', undefined);
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(1);
      expect(vi.mocked(updateSpy).mock.calls[0]).toEqual(<any>[[]]);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(2);
      expect(vi.mocked(updateSpy).mock.calls[1]).toEqual(<any>[[cat2Data, cat3Data]]);

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat3Data, cat1Data],
        })
      );
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(3);
      expect(vi.mocked(updateSpy).mock.calls[2]).toEqual(<any>[[cat3Data, cat1Data]]);

      testContext.fixture.componentRef.setInput('data', null);
      renderFixture(testContext.fixture);
      expect(vi.mocked(updateSpy).mock.calls.length).toEqual(4);
      expect(vi.mocked(updateSpy).mock.calls[3]).toEqual(<any>[[]]);
    });
  });

  describe('property view config provider', () => {
    it('setConfig() should be called when PropertyViewComponent.config is set', () => {
      renderFixture(testContext.fixture);
      expect(vi.mocked(testContext.propertyViewConfigProvider.setConfig).mock.calls.length).toEqual(0);

      testContext.fixture.componentRef.setInput('config', {
        propertyKeyWidthInRem: 10,
      });
      expect(vi.mocked(testContext.propertyViewConfigProvider.setConfig).mock.calls.length).toEqual(1);
      expect(vi.mocked(testContext.propertyViewConfigProvider.setConfig).mock.lastCall).toEqual([
        {
          propertyKeyWidthInRem: 10,
        },
      ]);
    });
  });

  describe('#onTabListKeydown', () => {
    it('should not update focusedCategoryId if data is undefined', () => {
      testContext.fixture.componentRef.setInput('data', undefined);
      testContext.component.focusedCategoryId = '0';

      testContext.component.onTabListKeydown({ key: 'ArrowRight' } as KeyboardEvent);

      expect(testContext.component.focusedCategoryId).toBe('0');
    });

    it('should not update focusedCategoryId if data.categories is empty', () => {
      testContext.fixture.componentRef.setInput('data', { categories: [] });
      testContext.component.focusedCategoryId = '0';

      testContext.component.onTabListKeydown({ key: 'ArrowRight' } as KeyboardEvent);

      expect(testContext.component.focusedCategoryId).toBe('0');
    });

    it('should handle ArrowRight key press', () => {
      const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const initialFocusedCategoryId = 'cat-2';

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);

      testContext.component.focusedCategoryId = initialFocusedCategoryId;
      testContext.component.onTabListKeydown(mockEvent);

      expect(testContext.component.focusedCategoryId).toBe('cat-3');
    });

    it('should handle ArrowLeft key press', () => {
      const mockEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      const initialFocusedCategoryId = 'cat-2';

      testContext.fixture.componentRef.setInput(
        'data',
        testContext.createData({
          categories: [cat1Data, cat2Data, cat3Data],
        })
      );
      renderFixture(testContext.fixture);

      testContext.component.focusedCategoryId = initialFocusedCategoryId;
      testContext.component.onTabListKeydown(mockEvent);

      expect(testContext.component.focusedCategoryId).toBe('cat-1');
    });
  });
});
