/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModelType } from '../property-view.model';
import { PropertyViewBuilder } from './property-view-builder';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewCategoryBuilder', function () {
  const nullPropertyViewBuilder: PropertyViewBuilder = <any>null;
  const nullCategoryBuilder: PropertyViewCategoryBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewCategoryBuilder(nullPropertyViewBuilder, '')).not.toThrow();
    });
  });

  const category1 = 'category-1';
  describe('getId() method', function () {
    it('should return the builder id', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category1);

      expect(categoryBuilder.getId()).toBe(category1);
    });
  });

  describe('title() method', function () {
    it('should return the builder', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

      expect(categoryBuilder.title('')).toBe(categoryBuilder);
    });
  });

  describe('getAllSections() method', function () {
    it('should return a shallow copy of all child PropertyViewSectionBuilder instances', function () {
      const propertyViewCategoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder1 = propertyViewCategoryBuilder.section('section-1');
      const sectionBuilder2 = propertyViewCategoryBuilder.section('section-2');

      const sections = propertyViewCategoryBuilder.getAllSections();
      expect(sections).not.toBe(propertyViewCategoryBuilder.getAllSections());
      expect(sections.length).toEqual(2);
      expect(sections[0]).toBe(sectionBuilder1);
      expect(sections[1]).toBe(sectionBuilder2);
    });
  });

  describe('getSection() method', function () {
    it('should return an existing PropertyViewSectionBuilder instance when there is one with id matching the id argument in the PropertyViewCategoryBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder = categoryBuilder.section('section');

      expect(categoryBuilder.getSection('section')).toBe(sectionBuilder);
    });

    it('should return null when there is no section with id matching the id argument in the PropertyViewCategoryBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      categoryBuilder.section('Section');

      expect(categoryBuilder.getSection('section')).toBeNull();
    });
  });

  describe('section() method', function () {
    it('should return a PropertyViewSectionBuilder instance with default values', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder = categoryBuilder.section('section');

      expect(sectionBuilder).toEqual(new PropertyViewSectionBuilder(categoryBuilder, 'section'));
      expect(categoryBuilder.getAllSections()).toEqual([sectionBuilder]);
    });

    it('should return a new PropertyViewSectionBuilder instance when there is no section with the same id in the PropertyViewCategoryBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder1 = categoryBuilder.section('section-1');
      const sectionBuilder2 = categoryBuilder.section('section-2');

      expect(sectionBuilder1).not.toEqual(sectionBuilder2);
      expect(categoryBuilder.getAllSections()).toEqual([sectionBuilder1, sectionBuilder2]);
    });

    it('should return an existing PropertyViewSectionBuilder instance when there is one with id matching the id argument', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder = categoryBuilder.section('section');

      expect(categoryBuilder.section('section')).toBe(sectionBuilder);
      expect(categoryBuilder.getAllSections()).toEqual([sectionBuilder]);
    });
  });

  describe('cloneAndAddBuilder() method', function () {
    it(
      'should fail when the builder argument has the same id' +
        ' as an existing PropertyViewSectionBuilder' +
        ' in the PropertyViewCategoryBuilder instance',
      function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        categoryBuilder.section('section');

        const duplicateIdSectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section');

        expect(() => categoryBuilder.cloneAndAddBuilder(duplicateIdSectionBuilder)).toThrowError(
          `Section 'section' already exists.`
        );
      }
    );

    it(
      'should fail when the builder argument is the same instance' +
        ' as an existing PropertyViewSectionBuilder' +
        ' in the PropertyViewCategoryBuilder instance',
      function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        const existingSection = categoryBuilder.section('section');

        expect(() => categoryBuilder.cloneAndAddBuilder(existingSection)).toThrowError(
          `Section 'section' already exists.`
        );
      }
    );

    it('should create a clone of the argument builder', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section');
      const expectedSectionBuilderClone = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section');

      spyOn(sectionBuilder, 'clone').and.returnValue(expectedSectionBuilderClone);

      categoryBuilder.cloneAndAddBuilder(sectionBuilder);

      expect(categoryBuilder.getSection('section')).toBe(expectedSectionBuilderClone);
      expect(categoryBuilder.getAllSections()).toEqual([expectedSectionBuilderClone]);
    });

    it('should return the PropertyViewCategoryBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const sectionBuilder = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section');

      expect(categoryBuilder.cloneAndAddBuilder(sectionBuilder)).toBe(categoryBuilder);
    });
  });

  describe('cloneAndAddBuilders() method', function () {
    it('should invoke cloneAndAddBuilder() method for each argument PropertyViewSectionBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');
      const cloneAndAddBuilderSpy = spyOn(categoryBuilder, 'cloneAndAddBuilder');

      categoryBuilder.cloneAndAddBuilders(<any>['section-1', 'section-2']);
      expect(cloneAndAddBuilderSpy.calls.count()).toEqual(2);
      expect(cloneAndAddBuilderSpy.calls.argsFor(0)).toEqual(<any>['section-1']);
      expect(cloneAndAddBuilderSpy.calls.argsFor(1)).toEqual(<any>['section-2']);
    });

    it('should return the PropertyViewCategoryBuilder instance', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

      expect(categoryBuilder.cloneAndAddBuilders([])).toBe(categoryBuilder);
    });
  });

  describe('build() method', function () {
    describe('result model type', function () {
      it('should be PropertyViewModelType.Category', function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        expect(categoryBuilder.build().type).toBe(PropertyViewModelType.Category);
      });
    });

    describe('result model id', function () {
      it('should be the builder id', function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category1);

        expect(categoryBuilder.build().id).toBe(category1);
      });
    });

    describe('result model title', function () {
      it('should be null when title was not set', function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        expect(categoryBuilder.build().title).toBe(null);
      });

      it('should be the last set title', function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        categoryBuilder.title('');
        expect(categoryBuilder.build().title).toBe('');

        categoryBuilder.title('title');
        expect(categoryBuilder.build().title).toBe('title');
      });
    });

    describe('result model content', function () {
      it('should be the result models of all section builders', function () {
        const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'id');

        const sectionBuilder1 = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-1');
        const sectionBuilder2 = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-2');

        spyOn(categoryBuilder, 'getAllSections').and.returnValue([sectionBuilder1, sectionBuilder2]);

        expect(categoryBuilder.build().content).toEqual([sectionBuilder1.build(), sectionBuilder2.build()]);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, 'category').title(
        'category-title'
      );
      const categoryBuilderClone = categoryBuilder.clone(nullPropertyViewBuilder);

      expect(categoryBuilderClone).toEqual(categoryBuilder);
      expect(categoryBuilderClone).not.toBe(categoryBuilder);
    });

    it('should deep clone sections', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, '');

      const sectionBuilder1 = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-1');
      const sectionBuilder1CloneSpy = spyOn(sectionBuilder1, 'clone').and.callThrough();

      const sectionBuilder2 = new PropertyViewSectionBuilder(nullCategoryBuilder, 'section-2');
      const sectionBuilder2CloneSpy = spyOn(sectionBuilder2, 'clone').and.callThrough();

      spyOn(categoryBuilder, 'getAllSections').and.returnValue([sectionBuilder1, sectionBuilder2]);

      const categoryBuilderClone = categoryBuilder.clone(nullPropertyViewBuilder);
      expect(sectionBuilder1CloneSpy.calls.mostRecent().args).toEqual([categoryBuilderClone]);
      expect(sectionBuilder2CloneSpy.calls.mostRecent().args).toEqual([categoryBuilderClone]);

      const categoryBuilderCloneSections = categoryBuilderClone.getAllSections();
      const sectionBuilder1Clone: PropertyViewSectionBuilder = sectionBuilder1CloneSpy.calls.mostRecent().returnValue;
      const sectionBuilder2Clone: PropertyViewSectionBuilder = sectionBuilder2CloneSpy.calls.mostRecent().returnValue;
      expect(categoryBuilderCloneSections.length).toEqual(2);
      expect(categoryBuilderCloneSections[0]).toBe(sectionBuilder1Clone);
      expect(categoryBuilderCloneSections[1]).toBe(sectionBuilder2Clone);
    });

    it('should not clone the parent', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const categoryBuilder = propertyViewBuilder.category('');
      expect(categoryBuilder.exit()).toBe(propertyViewBuilder);

      const categoryBuilderClone = categoryBuilder.clone(nullPropertyViewBuilder);
      expect(categoryBuilderClone.exit()).toBe(nullPropertyViewBuilder);
    });
  });

  describe('exit() method', function () {
    it('should return the parent builder', function () {
      const categoryBuilder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, '');
      expect(categoryBuilder.exit()).toBe(nullPropertyViewBuilder);

      const propertyViewBuilder = new PropertyViewBuilder();
      expect(propertyViewBuilder.category('').exit()).toBe(propertyViewBuilder);
    });
  });
});
