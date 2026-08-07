/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { PropertyViewModel } from '../property-view.model';
import { PropertyViewCategoryBuilder } from './property-view-category-builder';
import { PropertyViewSectionBuilder } from './property-view-section-builder';

export class PropertyViewBuilder {
  static readonly #allCategoryId = 'all';

  #categoryBuilders: Array<PropertyViewCategoryBuilder>;

  constructor() {
    this.#categoryBuilders = [];
  }

  getAllCategories(): Array<PropertyViewCategoryBuilder> {
    return this.#categoryBuilders.concat();
  }

  getCategory(id: string): PropertyViewCategoryBuilder | null {
    const matchingBuilder = this.getAllCategories().filter(s => s.getId() === id);
    if (matchingBuilder.length === 1) {
      return matchingBuilder[0];
    }

    return null;
  }

  getSection(categoryId: string, sectionId: string): PropertyViewSectionBuilder | null {
    const category = this.getCategory(categoryId);
    if (category === null) {
      return null;
    }

    return category.getSection(sectionId);
  }

  category(id: string, insertionIndex?: number): PropertyViewCategoryBuilder {
    let categoryBuilder = this.getCategory(id);
    if (categoryBuilder === null) {
      categoryBuilder = new PropertyViewCategoryBuilder(this, id);
      this.#categoryBuilders.push(categoryBuilder);
    }

    const removalIndex = this.#categoryBuilders.findIndex(b => b.getId() === id);
    this.#categoryBuilders.splice(removalIndex, 1);

    if (insertionIndex === undefined) {
      insertionIndex = removalIndex;
    } else if (
      isNaN(insertionIndex) ||
      !isFinite(insertionIndex) ||
      insertionIndex !== parseInt(insertionIndex.toString(), 10) ||
      insertionIndex < 0 ||
      this.#categoryBuilders.length < insertionIndex
    ) {
      throw new Error(
        `Invalid insertion index ${insertionIndex}.` +
          ` Insertion index must be an integer in the range` +
          ` [0, ${this.#categoryBuilders.length}].`
      );
    } else {
      // no action
    }

    this.#categoryBuilders.splice(insertionIndex, 0, categoryBuilder);

    return categoryBuilder;
  }

  generateAllCategory(categoryTitle: string): PropertyViewCategoryBuilder {
    if (this.getCategory(PropertyViewBuilder.#allCategoryId)) {
      throw new Error(`Category '${PropertyViewBuilder.#allCategoryId}' already exists.`);
    }

    return this.category(PropertyViewBuilder.#allCategoryId, 0)
      .title(categoryTitle)
      .cloneAndAddBuilders(
        this.getAllCategories()
          .map(category => category.getAllSections())
          // Array.flat()
          .reduce((previous, current) => previous.concat(current))
      );
  }

  build(): PropertyViewModel {
    return {
      categories: this.getAllCategories().map(builder => builder.build()),
    };
  }

  clone(): PropertyViewBuilder {
    const result = new PropertyViewBuilder();
    result.#categoryBuilders = this.getAllCategories().map(builder => builder.clone(result));

    return result;
  }

  exit(): null {
    return null;
  }
}
