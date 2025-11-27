/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { PropertyType } from './model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
} from './model/datagrid-filters.interfaces';

/**
 * Composite filters component renders different filters based on the type of
 * the corresponding filterable property, e.g., string, enum, number, etc.
 */

@Component({
  selector: 'appfx-composite-filter',
  standalone: false,
  templateUrl: 'composite-filters.component.html',
  styleUrls: ['composite-filters.component.scss', 'common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompositeFiltersComponent implements OnInit {
  // Array of filterable properties
  @Input() filterableProperties: FilterablePropertyDefinition[];

  /**
   * Event emitter to tell hosting view that the filtering conditions have changed
   */
  @Output() propertyFiltersChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  readonly stringPropertyType: PropertyType = PropertyType.String;
  readonly enumPropertyType: PropertyType = PropertyType.Enum;
  readonly numericPropertyType: PropertyType = PropertyType.Numeric;
  readonly dateTimePropertyType: PropertyType = PropertyType.DateTime;

  signPostOpened = false;
  selectedFilterableProperty: FilterablePropertyDefinition;
  propertyType: PropertyType;
  stringProperty: StringPropertyDefinition;
  enumProperty: EnumPropertyDefinition;
  numericProperty: NumericPropertyDefinition;
  dateTimeProperty: DateTimePropertyDefinition;
  // List of active filters to be sent to the hosting view
  propertyFilters: PropertyFilter[] = [];
  collapsedFilters = false;
  showHideFiltersArrowDir = 'left';
  showHideFiltersLabel: string;
  showHideFiltersAriaLabel: string;

  constructor(public filterStrings: DatagridFiltersStrings) {
    this.showHideFiltersLabel = filterStrings.hideButtonLabel;
    this.showHideFiltersAriaLabel = filterStrings.hideButtonAriaLabel;
  }

  ngOnInit() {
    if (this.filterableProperties && this.filterableProperties.length > 0) {
      this.selectedFilterableProperty = this.filterableProperties[0];
      this.onPropertyChange();
    }
  }

  onPropertyChange() {
    if (this.isStringProperty(this.selectedFilterableProperty)) {
      this.propertyType = PropertyType.String;
      this.stringProperty = this.castStringProperty();
    } else if (this.isEnumProperty(this.selectedFilterableProperty)) {
      this.propertyType = PropertyType.Enum;
      this.enumProperty = this.castEnumProperty();
    } else if (this.isNumericProperty(this.selectedFilterableProperty)) {
      this.propertyType = PropertyType.Numeric;
      this.numericProperty = this.castNumericProperty();
    } else if (this.isDateTimeProperty(this.selectedFilterableProperty)) {
      this.propertyType = PropertyType.DateTime;
      this.dateTimeProperty = this.castDateTimeProperty();
    }
  }

  onFilterCriteriaChange(propertyFilter: PropertyFilter) {
    if (propertyFilter) {
      if (propertyFilter.criteria.length > 0) {
        // The property filter contains several filtering criteria.
        // This is either a new filter, or some of the criteria are modified
        let i = this.propertyFilters.length;
        let modified = false;
        while (i--) {
          // Check whether there is an existing filter for the same property.
          // If found, replace it with the new filter
          if (
            this.propertyFilters[i].criteria[0].filterableProperty.property ===
            propertyFilter.criteria[0].filterableProperty.property
          ) {
            this.propertyFilters[i] = propertyFilter;
            modified = true;
          }
        }
        // If no existing filter was found, add the new one to the active filters list
        if (!modified) {
          this.propertyFilters.push(propertyFilter);
        }
      } else {
        // The property filter does not contain any criteria.
        // It should be removed from the active filters list
        let j = this.propertyFilters.length;
        while (j--) {
          if (this.propertyFilters[j].criteria.length === 0) {
            this.propertyFilters.splice(j, 1);
          }
        }
      }
      this.propertyFiltersChange.emit(this.propertyFilters);
    }
    this.signPostOpened = false;
    this.preselectFirstProperty();
    this.updateShowHideLabel();
  }

  /**
   * Returns a list properties for which there is an active filter
   */
  activeFilters(): FilterablePropertyDefinition[] {
    const activeProperties: FilterablePropertyDefinition[] = [];
    this.propertyFilters.forEach(value => {
      if (value.criteria.length > 0) {
        activeProperties.push(value.criteria[0].filterableProperty);
      }
    });
    return activeProperties;
  }

  clearAllFilters(): void {
    this.propertyFilters = [];
    this.propertyFiltersChange.emit(this.propertyFilters);
    this.preselectFirstProperty();
    this.collapsedFilters = false;
  }

  showHideAllFilters(): void {
    this.collapsedFilters = !this.collapsedFilters;
    this.updateShowHideLabel();
    this.showHideFiltersArrowDir = this.collapsedFilters ? 'right' : 'left';
  }

  /**
   * Active filters are not displayed in the new filters list.
   * We want to preselect the first displayed property
   */
  private preselectFirstProperty() {
    const activeProperties: FilterablePropertyDefinition[] = this.activeFilters();
    const remainingProperties: FilterablePropertyDefinition[] = this.filterableProperties.filter(
      property => !activeProperties.includes(property)
    );
    if (remainingProperties.length > 0) {
      this.selectedFilterableProperty = remainingProperties[0];
      this.onPropertyChange();
    }
  }

  private updateShowHideLabel(): void {
    this.showHideFiltersLabel = this.collapsedFilters
      ? this.filterStrings.showButtonLabel + '(' + this.propertyFilters.length + ')'
      : this.filterStrings.hideButtonLabel;
    this.showHideFiltersAriaLabel = this.collapsedFilters
      ? this.filterStrings.showButtonLabel +
        ' ' +
        this.propertyFilters.length +
        ' ' +
        (this.propertyFilters.length > 1 ? this.filterStrings.filtersText : this.filterStrings.filterText)
      : this.filterStrings.hideButtonAriaLabel;
  }

  private isStringProperty(property: FilterablePropertyDefinition): property is StringPropertyDefinition {
    return property instanceof StringPropertyDefinition;
  }

  private isEnumProperty(property: FilterablePropertyDefinition): property is EnumPropertyDefinition {
    return property instanceof EnumPropertyDefinition;
  }

  private isNumericProperty(property: FilterablePropertyDefinition): property is NumericPropertyDefinition {
    return property instanceof NumericPropertyDefinition;
  }

  private isDateTimeProperty(property: FilterablePropertyDefinition): property is DateTimePropertyDefinition {
    return property instanceof DateTimePropertyDefinition;
  }

  private castStringProperty(): StringPropertyDefinition {
    return this.selectedFilterableProperty as StringPropertyDefinition;
  }

  private castEnumProperty(): EnumPropertyDefinition {
    return this.selectedFilterableProperty as EnumPropertyDefinition;
  }

  private castNumericProperty(): NumericPropertyDefinition {
    return this.selectedFilterableProperty as NumericPropertyDefinition;
  }

  private castDateTimeProperty(): DateTimePropertyDefinition {
    return this.selectedFilterableProperty as DateTimePropertyDefinition;
  }
}
