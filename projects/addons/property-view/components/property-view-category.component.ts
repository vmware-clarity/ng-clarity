/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { PropertyViewSectionsExpandedStateManager } from '../property-view-sections-expanded-state.manager';
import { PropertyViewStrings } from '../property-view-strings.service';
import { PropertyViewCategoryModel, PropertyViewModelType, PropertyViewSectionModel } from '../property-view.model';

@Component({
  selector: 'appfx-property-view-category',
  standalone: false,
  templateUrl: 'property-view-category.component.html',
  styleUrls: ['property-view-category.component.scss'],
})
export class PropertyViewCategoryComponent {
  readonly PropertyViewModelType = PropertyViewModelType;

  @Input() data: PropertyViewCategoryModel;

  @Input() componentId: string;

  constructor(
    private expandedStateManager: PropertyViewSectionsExpandedStateManager,
    private propertyViewStrings: PropertyViewStrings
  ) {}

  getSectionExpandedState(sectionId: string): boolean {
    return this.expandedStateManager.getSectionExpandedState(this.data.id, sectionId);
  }

  onSectionExpandedStateChange(sectionId: string, expandedUserState: boolean) {
    this.expandedStateManager.setSectionExpandedUserState(this.data.id, sectionId, expandedUserState);
  }

  getSectionTrackingId(index: number, data: PropertyViewSectionModel) {
    return data.id;
  }

  getSectionComponentId(section: PropertyViewSectionModel) {
    return `${this.componentId}-section-${section.id}-component`;
  }

  getSectionComponentAriaLabelId(section: PropertyViewSectionModel) {
    if (section.title) {
      return `${this.getSectionComponentId(section)}-aria-label`;
    }

    return undefined;
  }

  getCategoryListItemsAreaLabel(): string | null {
    let propertiesCount = 0;
    this.data.content.forEach((section: PropertyViewSectionModel) => {
      propertiesCount += section.content.length;
    });
    return this.data.content.length > 1
      ? this.propertyViewStrings.categoryListItemsAreaLabel
          .replace('{0}', propertiesCount.toString())
          .replace('{1}', this.data.content.length.toString())
      : this.propertyViewStrings.categoryListItemAreaLabel.replace('{0}', propertiesCount.toString());
  }
}
