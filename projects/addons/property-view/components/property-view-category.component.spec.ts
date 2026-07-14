/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockPropertyViewStrings } from '../../testing';
import { PropertyViewSectionsExpandedStateManager } from '../property-view-sections-expanded-state.manager';
import { PropertyViewStrings } from '../property-view-strings.service';
import { PropertyViewCategoryModel, PropertyViewModelType, PropertyViewSectionModel } from '../property-view.model';
import { PropertyViewCategoryComponent } from './property-view-category.component';

@Component({
  selector: '[appfx-property-view-section]',
  standalone: false,
  template: '',
})
class PropertyViewSectionMockComponent {
  @Input() componentId: string;

  @Input() data: PropertyViewSectionModel;

  @Input() expanded: boolean;
}

class PropertyViewCategoriesSectionsExpandedStateManagerMock {
  getSectionExpandedState(): boolean {
    return true;
  }

  setSectionExpandedUserState() {
    throw new Error('Not implemented');
  }
}

interface ThisTest {
  fixture: ComponentFixture<PropertyViewCategoryComponent>;
  component: PropertyViewCategoryComponent;
  element: Element;
  expandedStateManager: PropertyViewSectionsExpandedStateManager;
  createData: (overrides: Partial<PropertyViewCategoryModel>) => PropertyViewCategoryModel;
  getTableElement: () => Element | null;
  getSectionsDebugElements: () => Array<DebugElement>;
}

describe('PropertyViewCategoryComponent', function () {
  const sec1Data: PropertyViewSectionModel = {
    type: PropertyViewModelType.Section,
    id: 'sec-1',
    renderAsHtml: false,
    collapseContent: false,
    title: null,
    titleIcon: null,
    actions: [],
    content: [],
  };
  const sec2Data: PropertyViewSectionModel = {
    type: PropertyViewModelType.Section,
    id: 'sec-2',
    renderAsHtml: false,
    collapseContent: false,
    title: null,
    titleIcon: null,
    actions: [],
    content: [],
  };
  const sec3Data: PropertyViewSectionModel = {
    type: PropertyViewModelType.Section,
    id: 'sec-3',
    renderAsHtml: false,
    collapseContent: false,
    title: null,
    titleIcon: null,
    actions: [],
    content: [],
  };

  beforeEach(function (this: ThisTest) {
    this.createData = (overrides: Partial<PropertyViewCategoryModel>) => {
      const defaultData: PropertyViewCategoryModel = {
        id: 'cat',
        type: PropertyViewModelType.Category,
        title: null,
        content: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.getTableElement = () => {
      return this.element.querySelector('table');
    };
    this.getSectionsDebugElements = () => {
      return this.fixture.debugElement.queryAll(By.css('tbody[appfx-property-view-section]'));
    };

    this.expandedStateManager =
      new PropertyViewCategoriesSectionsExpandedStateManagerMock() as never as PropertyViewSectionsExpandedStateManager;

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PropertyViewCategoryComponent, PropertyViewSectionMockComponent],
      providers: [
        {
          provide: PropertyViewSectionsExpandedStateManager,
          useValue: this.expandedStateManager,
        },
        {
          provide: PropertyViewStrings,
          useClass: MockPropertyViewStrings,
        },
      ],
    });

    this.fixture = TestBed.createComponent(PropertyViewCategoryComponent);
    this.component = this.fixture.componentInstance;
    this.element = this.fixture.nativeElement;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('should not render content when input data content is empty', function (this: ThisTest) {
    this.component.data = this.createData({});
    this.fixture.detectChanges();
    expect(this.getTableElement()).toEqual(null);
    expect(this.getSectionsDebugElements()).toEqual([]);
  });

  it(
    'should render a table' +
      ' that contains a section component' +
      ' for each section in input data content' +
      ' when input data content is not empty',
    function (this: ThisTest) {
      this.component.data = this.createData({
        content: [sec1Data, sec2Data, sec3Data],
      });
      this.fixture.detectChanges();
      expect(this.getTableElement()).not.toEqual(null);
      expect(this.getSectionsDebugElements().length).toEqual(3);
      expect(this.getSectionsDebugElements()[0].componentInstance).toEqual(
        jasmine.any(PropertyViewSectionMockComponent)
      );
      expect(this.getSectionsDebugElements()[0].componentInstance.data).toBe(sec1Data);
      expect(this.getSectionsDebugElements()[1].componentInstance).toEqual(
        jasmine.any(PropertyViewSectionMockComponent)
      );
      expect(this.getSectionsDebugElements()[1].componentInstance.data).toBe(sec2Data);
      expect(this.getSectionsDebugElements()[2].componentInstance).toEqual(
        jasmine.any(PropertyViewSectionMockComponent)
      );
      expect(this.getSectionsDebugElements()[2].componentInstance.data).toBe(sec3Data);
    }
  );

  it('should update its content when input data changes', function (this: ThisTest) {
    this.component.data = this.createData({
      content: [sec1Data],
    });
    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(1);
    expect(this.getSectionsDebugElements()[0].componentInstance.data).toBe(sec1Data);

    this.component.data = this.createData({
      content: [sec1Data, sec2Data, sec3Data],
    });
    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(3);
    expect(this.getSectionsDebugElements()[0].componentInstance.data).toBe(sec1Data);
    expect(this.getSectionsDebugElements()[1].componentInstance.data).toBe(sec2Data);
    expect(this.getSectionsDebugElements()[2].componentInstance.data).toBe(sec3Data);

    this.component.data = this.createData({
      content: [sec1Data, sec3Data],
    });
    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(2);
    expect(this.getSectionsDebugElements()[0].componentInstance.data).toBe(sec1Data);
    expect(this.getSectionsDebugElements()[1].componentInstance.data).toBe(sec3Data);
  });

  it('should set sections expanded input from expanded state manager', function (this: ThisTest) {
    const sectionsExpandedState = {} as any;
    spyOn(this.expandedStateManager, 'getSectionExpandedState').and.callFake(<any>((
      categoryId: string,
      sectionId: string
    ) => {
      return sectionsExpandedState[categoryId][sectionId];
    }));
    this.component.data = this.createData({
      content: [sec1Data, sec2Data, sec3Data],
    });

    sectionsExpandedState['cat'] = {
      'sec-1': false,
      'sec-2': true,
      'sec-3': false,
    };
    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(3);
    expect(this.getSectionsDebugElements()[0].componentInstance.expanded).toBe(false);
    expect(this.getSectionsDebugElements()[1].componentInstance.expanded).toBe(true);
    expect(this.getSectionsDebugElements()[2].componentInstance.expanded).toBe(false);

    sectionsExpandedState['cat'] = {
      'sec-1': true,
      'sec-2': false,
      'sec-3': true,
    };
    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(3);
    expect(this.getSectionsDebugElements()[0].componentInstance.expanded).toBe(true);
    expect(this.getSectionsDebugElements()[1].componentInstance.expanded).toBe(false);
    expect(this.getSectionsDebugElements()[2].componentInstance.expanded).toBe(true);
  });

  it('should call expanded state manager setSectionExpandedUserState() method when section expandedChange output is triggered', function (this: ThisTest) {
    const setSectionExpandedUserStateSpy = spyOn(this.expandedStateManager, 'setSectionExpandedUserState');
    this.component.data = this.createData({
      content: [sec1Data, sec2Data, sec3Data],
    });

    this.fixture.detectChanges();
    expect(this.getTableElement()).not.toEqual(null);
    expect(this.getSectionsDebugElements().length).toEqual(3);

    this.getSectionsDebugElements()[0].triggerEventHandler('expandedChange', false);
    this.getSectionsDebugElements()[1].triggerEventHandler('expandedChange', true);
    this.getSectionsDebugElements()[2].triggerEventHandler('expandedChange', true);
    this.getSectionsDebugElements()[2].triggerEventHandler('expandedChange', false);
    expect(setSectionExpandedUserStateSpy.calls.count()).toEqual(4);
    expect(setSectionExpandedUserStateSpy.calls.argsFor(0)).toEqual(['cat', 'sec-1', false]);
    expect(setSectionExpandedUserStateSpy.calls.argsFor(1)).toEqual(['cat', 'sec-2', true]);
    expect(setSectionExpandedUserStateSpy.calls.argsFor(2)).toEqual(['cat', 'sec-3', true]);
    expect(setSectionExpandedUserStateSpy.calls.argsFor(3)).toEqual(['cat', 'sec-3', false]);
  });
});
