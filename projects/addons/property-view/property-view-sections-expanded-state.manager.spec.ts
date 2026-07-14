/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { PropertyViewCategoryModel, PropertyViewModelType, PropertyViewSectionModel } from './property-view.model';
import { PropertyViewSectionsExpandedStateManager } from './property-view-sections-expanded-state.manager';

interface ThisTest {
  createCategoryData: (overrides: Partial<PropertyViewCategoryModel>) => PropertyViewCategoryModel;
  createSectionData: (overrides: Partial<PropertyViewSectionModel>) => PropertyViewSectionModel;
  getSubsetData: () => Array<PropertyViewCategoryModel>;
  getMainData: () => Array<PropertyViewCategoryModel>;
  propertyViewSectionsExpandedStateManager: PropertyViewSectionsExpandedStateManager;
}

describe('PropertyViewSectionsExpandedStateManager', function () {
  beforeEach(function (this: ThisTest) {
    this.createCategoryData = (overrides: Partial<PropertyViewCategoryModel>) => {
      const defaultData: PropertyViewCategoryModel = {
        type: PropertyViewModelType.Category,
        id: '',
        title: null,
        content: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.createSectionData = (overrides: Partial<PropertyViewSectionModel>) => {
      const defaultData: PropertyViewSectionModel = {
        type: PropertyViewModelType.Section,
        id: '',
        renderAsHtml: false,
        title: null,
        titleIcon: null,
        actions: [],
        content: [],
        collapseContent: false,
      };
      return Object.assign({}, defaultData, overrides);
    };
    this.getSubsetData = () => [
      this.createCategoryData({
        id: 'cat-2',
        content: [
          this.createSectionData({
            id: 'sec-2',
            collapseContent: true,
          }),
        ],
      }),
    ];
    this.getMainData = () => [
      this.createCategoryData({
        id: 'cat-1',
        content: [
          this.createSectionData({
            id: 'sec-1',
            collapseContent: true,
          }),
        ],
      }),
      this.createCategoryData({
        id: 'cat-2',
        content: [
          this.createSectionData({
            id: 'sec-1',
            collapseContent: false,
          }),
          this.createSectionData({
            id: 'sec-2',
            collapseContent: true,
          }),
        ],
      }),
    ];

    TestBed.configureTestingModule({
      providers: [PropertyViewSectionsExpandedStateManager],
    });

    this.propertyViewSectionsExpandedStateManager = TestBed.inject(PropertyViewSectionsExpandedStateManager);
  });

  describe('update() method', function () {
    it("should add states for all categories' sections on first call", function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());

      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(false);
    });

    it('should remove old states on subsequent calls', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());

      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')
      ).toThrowError();
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')
      ).toThrowError();
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(false);
    });

    it('should add new states on subsequent calls', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());

      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(false);
    });

    it('should update states on subsequent calls', function (this: ThisTest) {
      const updatedStatesMainData = this.getMainData();
      updatedStatesMainData[1].content[1].collapseContent = false;

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      this.propertyViewSectionsExpandedStateManager.update(updatedStatesMainData);

      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(true);
    });

    it('should not override user-set states on subsequent calls', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-2', true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(true);

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(true);

      const updatedStatesMainData = this.getMainData();
      updatedStatesMainData[1].content[1].collapseContent = false;
      this.propertyViewSectionsExpandedStateManager.update(updatedStatesMainData);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(true);

      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-2', false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(false);
    });
  });

  describe('getSectionExpandedState() method', function () {
    it('should fail when category does not exist', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')
      ).toThrowError('Unknown category ID: cat-1');

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-3', 'sec-1')
      ).toThrowError('Unknown category ID: cat-3');
    });

    it('should fail when section does not exist', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-3')
      ).toThrowError('Unknown section ID: sec-3');

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-2')
      ).toThrowError('Unknown section ID: sec-2');
    });

    it('should return the data state when user state was not set', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());

      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(false);
    });

    it('should return the user-set state when the user state was set', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);

      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true);
      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(false);

      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', false);
      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
    });
  });

  describe('setSectionExpandedState() method', function () {
    it('should fail when category does not exist', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true)
      ).toThrowError('Unknown category ID: cat-1');

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-3', 'sec-1', true)
      ).toThrowError('Unknown category ID: cat-3');
    });

    it('should fail when section does not exist', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getSubsetData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-3', true)
      ).toThrowError('Unknown section ID: sec-3');

      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(() =>
        this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-2', true)
      ).toThrowError('Unknown section ID: sec-2');
    });

    it('should update the user-set state', function (this: ThisTest) {
      this.propertyViewSectionsExpandedStateManager.update(this.getMainData());
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);

      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true);
      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(false);

      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', false);
      this.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', true);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(false);
      expect(this.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(true);
    });
  });
});
