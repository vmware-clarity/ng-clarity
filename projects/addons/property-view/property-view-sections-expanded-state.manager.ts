/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { PropertyViewCategoryModel, PropertyViewSectionModel } from './property-view.model';

interface SectionExpandedState {
  user: boolean | undefined;
  data: boolean;
}

interface SectionsExpandedState {
  [sectionId: string]: SectionExpandedState;
}

interface CategoriesSectionsExpandedState {
  [categoryId: string]: SectionsExpandedState;
}

@Injectable()
export class PropertyViewSectionsExpandedStateManager {
  private readonly categoriesSectionsExpandedStateData: CategoriesSectionsExpandedState;

  constructor() {
    this.categoriesSectionsExpandedStateData = {};
  }

  getSectionExpandedState(categoryId: string, sectionId: string): boolean {
    if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
      throw new Error(`Unknown category ID: ${categoryId}`);
    }

    if (!(sectionId in this.categoriesSectionsExpandedStateData[categoryId])) {
      throw new Error(`Unknown section ID: ${sectionId}`);
    }

    const sectionExpandedState = this.categoriesSectionsExpandedStateData[categoryId][sectionId];
    if (typeof sectionExpandedState.user === 'boolean') {
      return sectionExpandedState.user;
    }
    return sectionExpandedState.data;
  }

  setSectionExpandedUserState(categoryId: string, sectionId: string, expandedUserState: boolean) {
    if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
      throw new Error(`Unknown category ID: ${categoryId}`);
    }

    if (!(sectionId in this.categoriesSectionsExpandedStateData[categoryId])) {
      throw new Error(`Unknown section ID: ${sectionId}`);
    }

    this.categoriesSectionsExpandedStateData[categoryId][sectionId].user = expandedUserState;
  }

  update(categories: Array<PropertyViewCategoryModel>) {
    const categoriesById: { [id: string]: PropertyViewCategoryModel } = {};
    for (const category of categories) {
      categoriesById[category.id] = category;
    }

    this.removeOldCategories(categoriesById);
    this.createNewCategories(categoriesById);

    // Update categories' sections
    for (const categoryId of Object.keys(categoriesById)) {
      this.updateCategorySections(categoryId, categoriesById);
    }
  }

  private removeOldCategories(categoriesById: { [id: string]: PropertyViewCategoryModel }) {
    for (const categoryId of Object.keys(this.categoriesSectionsExpandedStateData)) {
      if (!(categoryId in categoriesById)) {
        delete this.categoriesSectionsExpandedStateData[categoryId];
      }
    }
  }

  private createNewCategories(categoriesById: { [id: string]: PropertyViewCategoryModel }) {
    for (const categoryId of Object.keys(categoriesById)) {
      if (!(categoryId in this.categoriesSectionsExpandedStateData)) {
        this.categoriesSectionsExpandedStateData[categoryId] = {};
      }
    }
  }

  private updateCategorySections(categoryId: string, categoriesById: { [id: string]: PropertyViewCategoryModel }) {
    const sectionsById: { [id: string]: PropertyViewSectionModel } = {};
    for (const section of categoriesById[categoryId].content) {
      sectionsById[section.id] = section;
    }

    const sectionsExpandedState = this.categoriesSectionsExpandedStateData[categoryId];

    // Remove sections
    for (const sectionId of Object.keys(sectionsExpandedState)) {
      if (!(sectionId in sectionsById)) {
        delete sectionsExpandedState[sectionId];
      }
    }

    // Update sections
    for (const sectionId of Object.keys(sectionsExpandedState)) {
      sectionsExpandedState[sectionId].data = !sectionsById[sectionId].collapseContent;
    }

    // Create sections
    for (const sectionId of Object.keys(sectionsById)) {
      if (!(sectionId in sectionsExpandedState)) {
        sectionsExpandedState[sectionId] = {
          user: undefined,
          data: !sectionsById[sectionId].collapseContent,
        };
      }
    }
  }
}
