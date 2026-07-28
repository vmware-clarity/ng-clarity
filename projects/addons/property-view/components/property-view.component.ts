/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DoCheck, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';

import { PropertyViewConfig } from '../property-view-config';
import { PropertyViewConfigProvider } from '../property-view-config-provider';
import { PropertyViewSectionsExpandedStateManager } from '../property-view-sections-expanded-state.manager';
import { PropertyViewCategoryModel, PropertyViewModel } from '../property-view.model';

@Component({
  selector: 'appfx-property-view',
  standalone: false,
  templateUrl: 'property-view.component.html',
  styleUrls: ['property-view.component.scss'],
  providers: [PropertyViewConfigProvider, PropertyViewSectionsExpandedStateManager],
})
export class PropertyViewComponent implements DoCheck {
  private static idCounter = 0;
  readonly basedId: string;
  selectedCategoryId: string | undefined;
  focusedCategoryId: string | undefined;

  @Input() data: PropertyViewModel | null | undefined;

  @ViewChildren('categoryTabButton') categoryTabButtonsList: QueryList<ElementRef>;

  constructor(
    private expandedStateManager: PropertyViewSectionsExpandedStateManager,
    private propertyViewConfigProvider: PropertyViewConfigProvider
  ) {
    this.basedId = 'appfx-property-view-' + PropertyViewComponent.idCounter++;
  }

  @Input()
  set config(value: PropertyViewConfig | undefined) {
    this.propertyViewConfigProvider.setConfig(value);
  }

  ngDoCheck(): void {
    this.expandedStateManager.update(this.data ? this.data.categories : []);
    this.validateAndUpdateSelectedCategory();
    this.validateAndUpdateFocusedCategory();
  }

  selectCategory(category: PropertyViewCategoryModel) {
    this.selectedCategoryId = category.id;
    this.focusedCategoryId = this.selectedCategoryId;
  }

  isCategorySelected(category: PropertyViewCategoryModel) {
    return category.id === this.selectedCategoryId;
  }

  isCategoryFocused(category: PropertyViewCategoryModel) {
    return category.id === this.focusedCategoryId;
  }

  getCategoryTabId(category: PropertyViewCategoryModel) {
    return `${this.basedId}-category-${category.id}-tab`;
  }

  getCategoryPanelId(category: PropertyViewCategoryModel) {
    return `${this.basedId}-category-${category.id}-panel`;
  }

  getCategoryComponentId(category: PropertyViewCategoryModel) {
    return `${this.basedId}-category-${category.id}-component`;
  }

  getCategoryTrackingId(index: number, data: PropertyViewCategoryModel) {
    return data.id;
  }

  onTabListKeydown(event: KeyboardEvent) {
    if (!this.data || this.data.categories.length === 0 || this.focusedCategoryId === undefined) {
      return;
    }

    const focusedCategoryIndex = this.data.categories.findIndex(category => category.id === this.focusedCategoryId);
    if (focusedCategoryIndex === -1) {
      return;
    }

    let newFocusedCategoryIndex = focusedCategoryIndex;
    if (event.key === 'ArrowLeft' || event.key === 'Left') {
      if (newFocusedCategoryIndex === 0) {
        newFocusedCategoryIndex = this.data.categories.length - 1;
      } else {
        newFocusedCategoryIndex--;
      }
    } else if (event.key === 'ArrowRight' || event.key === 'Right') {
      if (newFocusedCategoryIndex === this.data.categories.length - 1) {
        newFocusedCategoryIndex = 0;
      } else {
        newFocusedCategoryIndex++;
      }
    } else {
      // no action
    }
    this.focusedCategoryId = this.data.categories[newFocusedCategoryIndex].id;
    if (newFocusedCategoryIndex !== focusedCategoryIndex) {
      const categoryTabButtons = this.categoryTabButtonsList.toArray();
      const focusedCategoryTabButton: HTMLElement = categoryTabButtons[newFocusedCategoryIndex].nativeElement;
      focusedCategoryTabButton.focus();
    }
  }

  private validateAndUpdateSelectedCategory() {
    if (!this.data || this.data.categories.length === 0) {
      this.selectedCategoryId = undefined;
      return;
    }

    const isSelectedCategoryValid = this.data.categories.some(category => category.id === this.selectedCategoryId);
    if (!isSelectedCategoryValid) {
      this.selectedCategoryId = this.data.categories[0].id;
    }
  }

  private validateAndUpdateFocusedCategory() {
    if (!this.data || this.data.categories.length === 0) {
      this.focusedCategoryId = undefined;
      return;
    }

    const isFocusedCategoryValid = this.data.categories.some(category => category.id === this.focusedCategoryId);
    if (!isFocusedCategoryValid) {
      this.focusedCategoryId = this.selectedCategoryId;
    }
  }
}
