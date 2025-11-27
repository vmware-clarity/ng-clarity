/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, PropertyType, TimeSpan } from '../model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

const enterKey = 'Enter';
const spaceKey = 'Space';

@Component({
  selector: 'appfx-manage-filter',
  standalone: false,
  templateUrl: 'manage-filter.component.html',
  styleUrls: ['manage-filter.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageFilterComponent implements OnInit {
  // The filter to be managed
  @Input() propertyFilter: PropertyFilter;
  managedProperty: FilterablePropertyDefinition;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  readonly stringPropertyType: PropertyType = PropertyType.String;
  readonly enumPropertyType: PropertyType = PropertyType.Enum;
  readonly numericPropertyType: PropertyType = PropertyType.Numeric;
  readonly dateTimePropertyType: PropertyType = PropertyType.DateTime;

  managedPropertyType: PropertyType;
  stringProperty: StringPropertyDefinition;
  numericProperty: NumericPropertyDefinition;
  enumProperty: EnumPropertyDefinition;
  dateTimeProperty: DateTimePropertyDefinition;
  openPrimaryConditionSignPost = false;
  openSecondaryConditionSignPost = false;
  primaryConditionDisplayText = '';
  secondaryConditionDisplayText = '';
  editFilterAriaLabel = '';

  private readonly noDisplayValueOperators: ComparisonOperator[] = [
    ComparisonOperator.IsEmpty,
    ComparisonOperator.LastDay,
    ComparisonOperator.LastWeek,
    ComparisonOperator.LastMonth,
    ComparisonOperator.LastYear,
  ];

  constructor(public filterStrings: DatagridFiltersStrings) {}

  ngOnInit() {
    this.managedProperty = this.propertyFilter.criteria[0].filterableProperty;
    if (this.isStringProperty(this.managedProperty)) {
      this.managedPropertyType = PropertyType.String;
      this.stringProperty = this.castStringProperty();
    } else if (this.isEnumProperty(this.managedProperty)) {
      this.managedPropertyType = PropertyType.Enum;
      this.enumProperty = this.castEnumProperty();
    } else if (this.isNumericProperty(this.managedProperty)) {
      this.managedPropertyType = PropertyType.Numeric;
      this.numericProperty = this.castNumericProperty();
    } else if (this.isDateTimeProperty(this.managedProperty)) {
      this.managedPropertyType = PropertyType.DateTime;
      this.dateTimeProperty = this.castDateTimeProperty();
    }
    this.updateDisplayValues();
  }

  onEditFilterKeyPress(event: KeyboardEvent, index: number) {
    if (event.target instanceof Element) {
      const targetElement: Element = event.target as Element;
      if (targetElement.classList.contains('edit-filter') && (event.key === enterKey || event.key === spaceKey)) {
        if (index === 0) {
          this.openPrimaryConditionSignPost = !this.openPrimaryConditionSignPost;
        } else if (index === 1) {
          this.openSecondaryConditionSignPost = !this.openSecondaryConditionSignPost;
        }
      }
    }
  }

  removeFilter(index: number): void {
    // 3 or more criteria are displayed as one group
    // For this reason, they are removed together
    if (this.propertyFilter.criteria.length > 2 || this.managedPropertyType === PropertyType.DateTime) {
      this.propertyFilter.criteria = [];
    } else {
      this.propertyFilter.criteria.splice(index, 1);
      if (this.propertyFilter.criteria.length > 0) {
        const property = this.propertyFilter.criteria[0].filterableProperty;
        if (this.isNumericUnitFilterProperty(property)) {
          property.selectedValue.splice(index, 1);
          property.selectedUnit.splice(index, 1);
        }
        this.updateDisplayValues();
      }
    }
    this.filterCriteriaChange.emit(this.propertyFilter);
  }

  onFilterCriteriaChange(propertyFilter: PropertyFilter) {
    if (propertyFilter) {
      this.filterCriteriaChange.emit(propertyFilter);
    }
    this.openPrimaryConditionSignPost = false;
    this.openSecondaryConditionSignPost = false;
  }

  private updateDisplayValues(): void {
    this.primaryConditionDisplayText = this.displayFilterValue(0);
    this.editFilterAriaLabel =
      this.filterStrings.editFilterText +
      ' ' +
      this.managedProperty.displayName +
      ' ' +
      this.primaryConditionDisplayText;
    if (this.propertyFilter.criteria.length === 2) {
      this.secondaryConditionDisplayText = this.displayFilterValue(1);
      this.editFilterAriaLabel +=
        ' ' +
        this.filterStrings.getConjoinerDisplayName(this.propertyFilter.operator) +
        ' ' +
        this.secondaryConditionDisplayText;
    }
  }

  private displayFilterValue(index: number): string {
    if (this.isDateTimeProperty(this.managedProperty)) {
      return this.displayDateTimeFilter();
    }
    const appliedConditions: number = this.propertyFilter.criteria.length;
    if (appliedConditions > 2) {
      return appliedConditions + ' ' + this.filterStrings.appliedText;
    }
    if (this.propertyFilter.criteria[index].operator === ComparisonOperator.IsEmpty) {
      return this.operatorDisplayName(this.propertyFilter.criteria[index].operator);
    }
    const property = this.propertyFilter.criteria[index].filterableProperty;
    let value = this.propertyFilter.criteria[index].value;
    if (this.isEnumProperty(property)) {
      const enumProperty: EnumPropertyDefinition = property as EnumPropertyDefinition;
      value = enumProperty.values.get(this.propertyFilter.criteria[index].value);
    } else if (this.isNumericUnitFilterProperty(property)) {
      value = property.selectedValue[index] + ' ' + this.filterStrings.getUnitDisplayName(property.selectedUnit[index]);
    }
    return this.operatorDisplayName(this.propertyFilter.criteria[index].operator) + ': ' + value;
  }

  private displayDateTimeFilter(): string {
    const operator: ComparisonOperator = this.propertyFilter.criteria[0].filterableProperty.selectedOperator;
    if (operator === ComparisonOperator.CustomRange) {
      const displayValue: string =
        this.filterStrings.fromLabel +
        ': ' +
        this.formatDateTimeValue(this.propertyFilter.criteria[0].filterableProperty.selectedValue) +
        ' ' +
        this.filterStrings.toLabel +
        ': ' +
        this.formatDateTimeValue(this.propertyFilter.criteria[0].filterableProperty.selectedValueTo);
      return displayValue;
    } else if (this.isNoDisplayValueOperator(operator)) {
      return this.operatorDisplayName(operator);
    } else if (operator === ComparisonOperator.TimeSpan) {
      const timeSpanValue: number = this.propertyFilter.criteria[0].filterableProperty.selectedTimeSpanValue;
      const timeSpan: TimeSpan = this.propertyFilter.criteria[0].filterableProperty.selectedTimeSpan;
      return (
        this.operatorDisplayName(operator) +
        ': ' +
        timeSpanValue +
        ' ' +
        this.filterStrings.getTimeSpanDisplayName(timeSpan)
      );
    } else {
      const filterValue: string = this.formatDateTimeValue(
        this.propertyFilter.criteria[0].filterableProperty.selectedValue
      );
      return this.operatorDisplayName(operator) + ': ' + filterValue;
    }
  }

  private isNoDisplayValueOperator(operator: ComparisonOperator): boolean {
    return this.noDisplayValueOperators.includes(operator);
  }

  private formatDateTimeValue(dateTime: string): string {
    if (!dateTime) {
      return dateTime;
    }
    return dateTime.replace('T', ' ');
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

  private isNumericUnitFilterProperty(property: FilterablePropertyDefinition): boolean {
    return this.isNumericProperty(property) && property.unit !== undefined;
  }

  private castStringProperty(): StringPropertyDefinition {
    return this.managedProperty as StringPropertyDefinition;
  }

  private castEnumProperty(): EnumPropertyDefinition {
    return this.managedProperty as EnumPropertyDefinition;
  }

  private castNumericProperty(): NumericPropertyDefinition {
    return this.managedProperty as NumericPropertyDefinition;
  }

  private castDateTimeProperty(): DateTimePropertyDefinition {
    return this.managedProperty as DateTimePropertyDefinition;
  }

  private operatorDisplayName(operator: ComparisonOperator): string {
    return this.filterStrings.getOperatorDisplayName(operator);
  }
}
