/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';

import { PropertyViewSectionsExpandedStateManager } from './property-view-sections-expanded-state.manager';
import { PropertyViewCategoryModel, PropertyViewModelType, PropertyViewSectionModel } from './property-view.model';
import { errorLike } from '../../test-matchers';

interface ThisTest {
  createCategoryData: (overrides: Partial<PropertyViewCategoryModel>) => PropertyViewCategoryModel;
  createSectionData: (overrides: Partial<PropertyViewSectionModel>) => PropertyViewSectionModel;
  getSubsetData: () => Array<PropertyViewCategoryModel>;
  getMainData: () => Array<PropertyViewCategoryModel>;
  propertyViewSectionsExpandedStateManager: PropertyViewSectionsExpandedStateManager;
}

describe('PropertyViewSectionsExpandedStateManager', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    testContext.createCategoryData = (overrides: Partial<PropertyViewCategoryModel>) => {
      const defaultData: PropertyViewCategoryModel = {
        type: PropertyViewModelType.Category,
        id: '',
        title: null,
        content: [],
      };
      return Object.assign({}, defaultData, overrides);
    };
    testContext.createSectionData = (overrides: Partial<PropertyViewSectionModel>) => {
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
    testContext.getSubsetData = () => [
      testContext.createCategoryData({
        id: 'cat-2',
        content: [
          testContext.createSectionData({
            id: 'sec-2',
            collapseContent: true,
          }),
        ],
      }),
    ];
    testContext.getMainData = () => [
      testContext.createCategoryData({
        id: 'cat-1',
        content: [
          testContext.createSectionData({
            id: 'sec-1',
            collapseContent: true,
          }),
        ],
      }),
      testContext.createCategoryData({
        id: 'cat-2',
        content: [
          testContext.createSectionData({
            id: 'sec-1',
            collapseContent: false,
          }),
          testContext.createSectionData({
            id: 'sec-2',
            collapseContent: true,
          }),
        ],
      }),
    ];

    TestBed.configureTestingModule({
      providers: [PropertyViewSectionsExpandedStateManager],
    });

    testContext.propertyViewSectionsExpandedStateManager = TestBed.inject(PropertyViewSectionsExpandedStateManager);
  });

  describe('update() method', () => {
    it("should add states for all categories' sections on first call", () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());

      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        false
      );
    });

    it('should remove old states on subsequent calls', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());

      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')
      ).toThrowError(errorLike());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')
      ).toThrowError(errorLike());
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        false
      );
    });

    it('should add new states on subsequent calls', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());

      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        false
      );
    });

    it('should update states on subsequent calls', () => {
      const updatedStatesMainData = testContext.getMainData();
      updatedStatesMainData[1].content[1].collapseContent = false;

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      testContext.propertyViewSectionsExpandedStateManager.update(updatedStatesMainData);

      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        true
      );
    });

    it('should not override user-set states on subsequent calls', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-2', true);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        true
      );

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        true
      );

      const updatedStatesMainData = testContext.getMainData();
      updatedStatesMainData[1].content[1].collapseContent = false;
      testContext.propertyViewSectionsExpandedStateManager.update(updatedStatesMainData);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        true
      );

      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-2', false);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        false
      );
    });
  });

  describe('getSectionExpandedState() method', () => {
    it('should fail when category does not exist', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')
      ).toThrowError(errorLike('Unknown category ID: cat-1'));

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-3', 'sec-1')
      ).toThrowError(errorLike('Unknown category ID: cat-3'));
    });

    it('should fail when section does not exist', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-3')
      ).toThrowError(errorLike('Unknown section ID: sec-3'));

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-2')
      ).toThrowError(errorLike('Unknown section ID: sec-2'));
    });

    it('should return the data state when user state was not set', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());

      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-2')).toEqual(
        false
      );
    });

    it('should return the user-set state when the user state was set', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );

      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true);
      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', false);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        false
      );

      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', false);
      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', true);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
    });
  });

  describe('setSectionExpandedState() method', () => {
    it('should fail when category does not exist', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true)
      ).toThrowError(errorLike('Unknown category ID: cat-1'));

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-3', 'sec-1', true)
      ).toThrowError(errorLike('Unknown category ID: cat-3'));
    });

    it('should fail when section does not exist', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getSubsetData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-3', true)
      ).toThrowError(errorLike('Unknown section ID: sec-3'));

      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(() =>
        testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-2', true)
      ).toThrowError(errorLike('Unknown section ID: sec-2'));
    });

    it('should update the user-set state', () => {
      testContext.propertyViewSectionsExpandedStateManager.update(testContext.getMainData());
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );

      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', true);
      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', false);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        true
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        false
      );

      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-1', 'sec-1', false);
      testContext.propertyViewSectionsExpandedStateManager.setSectionExpandedUserState('cat-2', 'sec-1', true);
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-1', 'sec-1')).toEqual(
        false
      );
      expect(testContext.propertyViewSectionsExpandedStateManager.getSectionExpandedState('cat-2', 'sec-1')).toEqual(
        true
      );
    });
  });
});
