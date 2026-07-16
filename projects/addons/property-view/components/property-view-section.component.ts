/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PropertyViewStrings } from '../property-view-strings.service';
import { PropertyViewActionModel, PropertyViewModelType, PropertyViewSectionModel } from '../property-view.model';

@Component({
  selector: '[appfx-property-view-section]',
  standalone: false,
  templateUrl: 'property-view-section.component.html',
  styleUrls: ['property-view-section.component.scss'],
})
export class PropertyViewSectionComponent {
  readonly PropertyViewModelType = PropertyViewModelType;

  @Input() data: PropertyViewSectionModel;

  @Input() expanded: boolean;

  @Input() componentId: string;

  @Output() expandedChange: EventEmitter<boolean>;

  constructor(public propertyViewStrings: PropertyViewStrings) {
    this.expandedChange = new EventEmitter<boolean>();
  }

  toggleExpandedState(): void {
    this.expandedChange.emit(!this.expanded);
  }

  handleActionClick(action: PropertyViewActionModel): void {
    if (!action.isEnabled) {
      return;
    }

    action.clickHandler();
  }

  getContentTrackingId(index: number) {
    return index;
  }

  getSectionTitleToggleButtonAriaLabel() {
    return this.getFormattedLabel(this.propertyViewStrings.toggle);
  }

  /**
   * Returns unique formatted label if title is not null,
   * otherwise sets static label without any placeholder
   */
  private getFormattedLabel(label: string) {
    return label.replace('{0} ', this.data.title ? this.data.title + ' ' : '');
  }
}
