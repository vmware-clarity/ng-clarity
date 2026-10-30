/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { uniqueIdFactory } from '@clr/angular/utils';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { ComparisonOperator, PropertyType, TimeSpan } from '../model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
  UserPropertyDefinition,
} from '../model/datagrid-filters.interfaces';

@Component({
  selector: 'appfx-manage-filter',
  standalone: false,
  templateUrl: 'manage-filter.component.html',
  styleUrls: ['manage-filter.component.scss', '../common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ClrPopoverHostDirective],
})
export class ManageFilterComponent implements OnInit, OnChanges {
  // The filter to be managed
  @Input() propertyFilter: PropertyFilter;
  @Input() filterProperty: FilterablePropertyDefinition;
  @Input() predefined = false;

  @Output() filterRemoved = new EventEmitter<void>();

  readonly popoverId = uniqueIdFactory();
  readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;
  managedProperty: FilterablePropertyDefinition;

  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  @Output() filterCriteriaChange: EventEmitter<PropertyFilter> = new EventEmitter<PropertyFilter>();

  readonly stringPropertyType: PropertyType = PropertyType.String;
  readonly enumPropertyType: PropertyType = PropertyType.Enum;
  readonly numericPropertyType: PropertyType = PropertyType.Numeric;
  readonly dateTimePropertyType: PropertyType = PropertyType.DateTime;
  readonly userPropertyType: PropertyType = PropertyType.User;

  managedPropertyType: PropertyType;
  stringProperty: StringPropertyDefinition;
  numericProperty: NumericPropertyDefinition;
  enumProperty: EnumPropertyDefinition;
  dateTimeProperty: DateTimePropertyDefinition;
  userProperty: UserPropertyDefinition;
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

  constructor(
    public filterStrings: DatagridFiltersStrings,
    private popoverService: ClrPopoverService
  ) {}

  get open(): boolean {
    return this.popoverService.open;
  }

  get active(): boolean {
    return !!this.propertyFilter?.criteria.length;
  }

  get additionalConditions(): number {
    return this.managedPropertyType === PropertyType.DateTime
      ? 0
      : Math.max(0, (this.propertyFilter?.criteria.length || 0) - 1);
  }

  get pillText(): string {
    if (!this.active) {
      return this.managedProperty.displayName;
    }
    return this.displayFilterValue(0, true);
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  ngOnInit() {
    this.managedProperty = this.propertyFilter?.criteria[0]?.filterableProperty || this.filterProperty;
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
    } else if (this.isUserProperty(this.managedProperty)) {
      this.managedPropertyType = PropertyType.User;
      this.userProperty = this.castUserProperty();
    }
    this.updateDisplayValues();
  }

  removeFilter(): void {
    this.close();
    this.filterRemoved.emit();
  }

  onFilterCriteriaChange(propertyFilter: PropertyFilter) {
    this.close();
    if (propertyFilter) {
      if (propertyFilter.criteria.length) {
        this.filterCriteriaChange.emit(propertyFilter);
      } else {
        this.filterRemoved.emit();
      }
    }
  }

  private close(): void {
    this.popoverService.open = false;
    this.popoverService.focusOrigin();
  }

  private updateDisplayValues(): void {
    if (!this.active) {
      this.primaryConditionDisplayText = '';
      this.secondaryConditionDisplayText = '';
      this.editFilterAriaLabel = this.filterStrings.editFilterText + ' ' + this.managedProperty.displayName;
      return;
    }
    this.primaryConditionDisplayText = this.displayFilterValue(0);
    this.editFilterAriaLabel =
      this.filterStrings.editFilterText +
      ' ' +
      this.managedProperty.displayName +
      ' ' +
      this.primaryConditionDisplayText;
    this.secondaryConditionDisplayText = '';
    if (this.propertyFilter.criteria.length > 1 && this.managedPropertyType !== PropertyType.DateTime) {
      this.secondaryConditionDisplayText = this.displayFilterValue(1);
      const conjoiner = ' ' + this.filterStrings.getConjoinerDisplayName(this.propertyFilter.operator) + ' ';
      this.editFilterAriaLabel +=
        conjoiner +
        this.propertyFilter.criteria
          .slice(1)
          .map((_, index) => this.displayFilterValue(index + 1))
          .join(conjoiner);
    }
  }

  private displayFilterValue(index: number, compact = false): string {
    if (this.isDateTimeProperty(this.managedProperty)) {
      return this.displayDateTimeFilter();
    }
    if (this.propertyFilter.criteria[index].operator === ComparisonOperator.IsEmpty) {
      return this.operatorDisplayName(this.propertyFilter.criteria[index].operator);
    }
    const property = this.propertyFilter.criteria[index].filterableProperty;
    let value = this.propertyFilter.criteria[index].value;
    if (this.isEnumProperty(property)) {
      const enumProperty: EnumPropertyDefinition = property as EnumPropertyDefinition;
      value = enumProperty.values.get(this.propertyFilter.criteria[index].value) ?? value;
    } else if (this.isNumericUnitFilterProperty(property)) {
      value = property.selectedValue[index] + ' ' + this.filterStrings.getUnitDisplayName(property.selectedUnit[index]);
    }
    return compact && this.propertyFilter.criteria[index].operator === ComparisonOperator.Equals
      ? String(value)
      : this.operatorDisplayName(this.propertyFilter.criteria[index].operator) + ': ' + value;
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

  private isUserProperty(property: FilterablePropertyDefinition): property is UserPropertyDefinition {
    return property instanceof UserPropertyDefinition;
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

  private castUserProperty(): UserPropertyDefinition {
    return this.managedProperty as UserPropertyDefinition;
  }

  private operatorDisplayName(operator: ComparisonOperator): string {
    return this.filterStrings.getOperatorDisplayName(operator);
  }
}
