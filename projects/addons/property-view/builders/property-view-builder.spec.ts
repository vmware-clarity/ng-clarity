/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewBuilder } from './property-view-builder';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

describe('PropertyViewBuilder', function () {
  const nullPropertyViewBuilder: PropertyViewBuilder = <any>null;

  describe('constructor()', function () {
    it('should not throw an error', function () {
      expect(() => new PropertyViewBuilder()).not.toThrow();
    });
  });

  const category1 = 'category-1';
  const category2 = 'category-2';
  describe('getAllCategories() method', function () {
    it('should return a shallow copy of all child PropertyViewCategoryBuilder instances', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const categoryBuilder1 = propertyViewBuilder.category(category1);
      const categoryBuilder2 = propertyViewBuilder.category(category2);

      const categories = propertyViewBuilder.getAllCategories();
      expect(categories).not.toBe(propertyViewBuilder.getAllCategories());
      expect(categories.length).toEqual(2);
      expect(categories[0]).toBe(categoryBuilder1);
      expect(categories[1]).toBe(categoryBuilder2);
    });
  });

  describe('getCategory() method', function () {
    it('should return an existing PropertyViewCategoryBuilder instance when there is one with id matching the id argument in the PropertyViewBuilder instance', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const category = propertyViewBuilder.category('category');
      expect(propertyViewBuilder.getCategory('category')).toBe(category);
    });

    it('should return null when there is no category with id matching the id argument in the PropertyViewBuilder instance', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      propertyViewBuilder.category('Category');
      expect(propertyViewBuilder.getCategory('category')).toBeNull();
    });
  });

  describe('getSection() method', function () {
    it('should return an existing PropertyViewSectionBuilder instance when there is a category with a child section in the PropertyViewCategoryBuilder instance whose ids match the argument ones', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const section = propertyViewBuilder.category('category').section('section');
      expect(propertyViewBuilder.getSection('category', 'section')).toBe(section);
    });

    it('should return null when there is a category in the PropertyViewCategoryBuilder instance whose id matches the argument one but the category does not have a child section whose id matches the argument one', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      propertyViewBuilder.category('category').section('section-2');
      expect(propertyViewBuilder.getSection('category', 'section')).toBeNull();
    });

    it('should return null when there is no category in the PropertyViewCategoryBuilder instance whose id matches the argument one', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      propertyViewBuilder.category(category2).section('section');
      expect(propertyViewBuilder.getSection('category', 'section')).toBeNull();
    });
  });

  describe('category() method', function () {
    it('should fail if insertionIndex is not valid', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      expect(() => propertyViewBuilder.category(category1, Number.POSITIVE_INFINITY)).toThrowError(
        'Invalid insertion index Infinity. Insertion index must be an integer in the range [0, 0].'
      );

      expect(() => propertyViewBuilder.category(category1, Number.NEGATIVE_INFINITY)).toThrowError(
        'Invalid insertion index -Infinity. Insertion index must be an integer in the range [0, 0].'
      );

      expect(() => propertyViewBuilder.category(category1, 3.5)).toThrowError(
        'Invalid insertion index 3.5. Insertion index must be an integer in the range [0, 0].'
      );

      expect(() => propertyViewBuilder.category(category1, -1)).toThrowError(
        'Invalid insertion index -1. Insertion index must be an integer in the range [0, 0].'
      );

      expect(() => propertyViewBuilder.category(category1, 1)).toThrowError(
        'Invalid insertion index 1. Insertion index must be an integer in the range [0, 0].'
      );
    });

    const category3 = 'category-3';
    const category4 = 'category-4';
    it(
      'should insert the PropertyViewCategoryBuilder instance at the end' +
        ' when insertion index is not specified' +
        " when the PropertyViewCategoryBuilder didn't exist",
      function () {
        const propertyViewBuilder = new PropertyViewBuilder();

        const categoryBuilder1 = propertyViewBuilder.category(category1);
        const categoryBuilder2 = propertyViewBuilder.category(category2, undefined);
        const categoryBuilder3 = propertyViewBuilder.category(category3, undefined);
        const categoryBuilder4 = propertyViewBuilder.category(category4);

        expect(propertyViewBuilder.getAllCategories()).toEqual([
          categoryBuilder1,
          categoryBuilder2,
          categoryBuilder3,
          categoryBuilder4,
        ]);
      }
    );

    it(
      'should insert a PropertyViewCategoryBuilder instance' +
        ' at the specified index' +
        " when the PropertyViewCategoryBuilder didn't exist",
      function () {
        const propertyViewBuilder = new PropertyViewBuilder();

        const categoryBuilder2 = propertyViewBuilder.category(category2, 0);
        const categoryBuilder4 = propertyViewBuilder.category(category4, 1);
        const categoryBuilder1 = propertyViewBuilder.category(category1, 0);
        const categoryBuilder3 = propertyViewBuilder.category(category3, 2);

        expect(propertyViewBuilder.getAllCategories()).toEqual([
          categoryBuilder1,
          categoryBuilder2,
          categoryBuilder3,
          categoryBuilder4,
        ]);
      }
    );

    it('should not move an existing PropertyViewCategoryBuilder instance to the end when insertionIndex is not specified', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const categoryBuilder2 = propertyViewBuilder.category(category2);
      const categoryBuilder4 = propertyViewBuilder.category(category4);
      const categoryBuilder1 = propertyViewBuilder.category(category1);
      const categoryBuilder3 = propertyViewBuilder.category(category3);

      propertyViewBuilder.category(category1);
      propertyViewBuilder.category(category2);
      propertyViewBuilder.category(category3);
      propertyViewBuilder.category(category4);

      expect(propertyViewBuilder.getAllCategories()).toEqual([
        categoryBuilder2,
        categoryBuilder4,
        categoryBuilder1,
        categoryBuilder3,
      ]);
    });

    it('should move an existing PropertyViewCategoryBuilder instance to the specified index', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const categoryBuilder2 = propertyViewBuilder.category(category2);
      const categoryBuilder4 = propertyViewBuilder.category(category4);
      const categoryBuilder1 = propertyViewBuilder.category(category1);
      const categoryBuilder3 = propertyViewBuilder.category(category3);

      propertyViewBuilder.category(category1, 0);
      propertyViewBuilder.category(category3, 2);

      expect(propertyViewBuilder.getAllCategories()).toEqual([
        categoryBuilder1,
        categoryBuilder2,
        categoryBuilder3,
        categoryBuilder4,
      ]);
    });

    it('should return a PropertyViewCategoryBuilder instance with default values', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const categoryBuilder = propertyViewBuilder.category('category');

      expect(categoryBuilder).toEqual(new PropertyViewCategoryBuilder(propertyViewBuilder, 'category'));
    });

    it(
      'should return a new PropertyViewCategoryBuilder instance' +
        ' when there is no category with the same id' +
        ' in the PropertyViewBuilder instance',
      function () {
        const propertyViewBuilder = new PropertyViewBuilder();

        const categoryBuilder1 = propertyViewBuilder.category(category1);
        const categoryBuilder2 = propertyViewBuilder.category(category2);

        expect(categoryBuilder1).not.toEqual(categoryBuilder2);
        expect(propertyViewBuilder.getAllCategories()).toEqual([categoryBuilder1, categoryBuilder2]);
      }
    );

    it('should return an existing PropertyViewCategoryBuilder instance when there is one with id matching the id argument', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const categoryBuilder = propertyViewBuilder.category('category');
      const existingCategoryBuilder = propertyViewBuilder.category('category');

      expect(existingCategoryBuilder).toBe(categoryBuilder);
      expect(propertyViewBuilder.getAllCategories()).toEqual([categoryBuilder]);
    });
  });

  describe('generateAllCategory() method', function () {
    it('should fail if an "all" category already exists', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      propertyViewBuilder.category('all');

      expect(() => propertyViewBuilder.generateAllCategory('')).toThrowError(`Category 'all' already exists.`);
    });

    it('should create an "all" category' + ' with the supplied title', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const allCategoryBuilder = propertyViewBuilder.generateAllCategory('Custom Title');

      expect(allCategoryBuilder).toEqual(
        new PropertyViewCategoryBuilder(propertyViewBuilder, 'all').title('Custom Title')
      );

      expect(propertyViewBuilder.getAllCategories()).toEqual([allCategoryBuilder]);
    });

    it('should clone and add all existing sections' + ' to the "all" category', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const category1Builder = propertyViewBuilder.category('category1');
      const category2Builder = propertyViewBuilder.category('category2');

      const category1Section1Builder = category1Builder.section('category1-section1');
      const category1Section1BuilderCloneSpy = spyOn(category1Section1Builder, 'clone').and.callThrough();

      const category1Section2Builder = category1Builder.section('category1-section2');
      const category1Section2BuilderCloneSpy = spyOn(category1Section2Builder, 'clone').and.callThrough();

      const category2Section1Builder = category2Builder.section('category2-section1');
      const category2Section1BuilderCloneSpy = spyOn(category2Section1Builder, 'clone').and.callThrough();

      const category2Section2Builder = category2Builder.section('category2-section2');
      const category2Section2BuilderCloneSpy = spyOn(category2Section2Builder, 'clone').and.callThrough();

      const allCategoryBuilder = propertyViewBuilder.generateAllCategory('');

      expect(category1Section1BuilderCloneSpy.calls.mostRecent().args).toEqual([allCategoryBuilder]);
      expect(category1Section2BuilderCloneSpy.calls.mostRecent().args).toEqual([allCategoryBuilder]);
      expect(category2Section1BuilderCloneSpy.calls.mostRecent().args).toEqual([allCategoryBuilder]);
      expect(category2Section2BuilderCloneSpy.calls.mostRecent().args).toEqual([allCategoryBuilder]);

      const category1Section1BuilderClone: PropertyViewSectionBuilder =
        category1Section1BuilderCloneSpy.calls.mostRecent().returnValue;
      const category1Section2BuilderClone: PropertyViewSectionBuilder =
        category1Section2BuilderCloneSpy.calls.mostRecent().returnValue;
      const category2Section1BuilderClone: PropertyViewSectionBuilder =
        category2Section1BuilderCloneSpy.calls.mostRecent().returnValue;
      const category2Section2BuilderClone: PropertyViewSectionBuilder =
        category2Section2BuilderCloneSpy.calls.mostRecent().returnValue;

      expect(allCategoryBuilder.getAllSections()).toEqual([
        category1Section1BuilderClone,
        category1Section2BuilderClone,
        category2Section1BuilderClone,
        category2Section2BuilderClone,
      ]);

      expect(propertyViewBuilder.getAllCategories()).toEqual([allCategoryBuilder, category1Builder, category2Builder]);
    });
  });

  describe('build() method', function () {
    describe('result model content', function () {
      it('should be the result models of all category builders', function () {
        const propertyViewBuilder = new PropertyViewBuilder();

        const category1Builder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category1);
        const category2Builder = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category2);

        spyOn(propertyViewBuilder, 'getAllCategories').and.returnValue([category1Builder, category2Builder]);

        expect(propertyViewBuilder.build().categories).toEqual([category1Builder.build(), category2Builder.build()]);
      });
    });
  });

  describe('clone() method', function () {
    it('should copy simple properties', function () {
      const propertyViewBuilder = new PropertyViewBuilder();
      const propertyViewBuilderClone = propertyViewBuilder.clone();

      expect(propertyViewBuilderClone).toEqual(propertyViewBuilder);
      expect(propertyViewBuilderClone).not.toBe(propertyViewBuilder);
    });

    it('should deep copy categories', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      const categoryBuilder1 = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category1);
      const categoryBuilder1CloneSpy = spyOn(categoryBuilder1, 'clone').and.callThrough();

      const categoryBuilder2 = new PropertyViewCategoryBuilder(nullPropertyViewBuilder, category2);
      const categoryBuilder2CloneSpy = spyOn(categoryBuilder2, 'clone').and.callThrough();

      spyOn(propertyViewBuilder, 'getAllCategories').and.returnValue([categoryBuilder1, categoryBuilder2]);

      const propertyViewBuilderClone = propertyViewBuilder.clone();
      expect(categoryBuilder1CloneSpy.calls.mostRecent().args).toEqual([propertyViewBuilderClone]);
      expect(categoryBuilder2CloneSpy.calls.mostRecent().args).toEqual([propertyViewBuilderClone]);

      const propertyViewBuilderCloneCategories = propertyViewBuilderClone.getAllCategories();
      const categoryBuilder1Clone: PropertyViewCategoryBuilder =
        categoryBuilder1CloneSpy.calls.mostRecent().returnValue;
      const categoryBuilder2Clone: PropertyViewCategoryBuilder =
        categoryBuilder2CloneSpy.calls.mostRecent().returnValue;
      expect(propertyViewBuilderCloneCategories.length).toEqual(2);
      expect(propertyViewBuilderCloneCategories[0]).toBe(categoryBuilder1Clone);
      expect(propertyViewBuilderCloneCategories[1]).toBe(categoryBuilder2Clone);
    });
  });

  describe('exit() method', function () {
    it('should return null', function () {
      const propertyViewBuilder = new PropertyViewBuilder();

      expect(propertyViewBuilder.exit()).toBe(null);
    });
  });
});
