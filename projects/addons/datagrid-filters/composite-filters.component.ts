/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ClrCombobox } from '@clr/angular/forms';
import {
  ClrPopoverHostDirective,
  ClrPopoverPosition,
  ClrPopoverService,
  ClrPopoverType,
} from '@clr/angular/popover/common';
import { uniqueIdFactory } from '@clr/angular/utils';

import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { ComparisonOperator, LogicalOperator, PropertyType } from './model/datagrid-filters.enums';
import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  UserPropertyDefinition,
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
  hostDirectives: [ClrPopoverHostDirective],
})
export class CompositeFiltersComponent implements OnInit, OnChanges {
  // Array of filterable properties
  @Input() filterableProperties: FilterablePropertyDefinition[] = [];

  @Input() presetFilters: PropertyFilter[];

  /** Properties whose pills remain visible when their criteria are cleared. */
  @Input() predefinedFilters: FilterablePropertyDefinition[] = [];

  /**
   * Enum properties shown as a field label followed by toggleable option pills,
   * between the predefined and the user-added pills. Selected options are combined with OR
   * and applied immediately.
   */
  @Input() semiPredefinedFilters: EnumPropertyDefinition[] = [];

  /**
   * Ready-made filters shown as on/off pills in the predefined group. OFF means not applied;
   * ON applies the filter as configured. A preset filter for the same field starts the toggle ON.
   */
  @Input() toggleFilters: PropertyFilter[] = [];

  /** Toggle filters that are currently ON. */
  activeToggles = new Set<PropertyFilter>();

  /**
   * Other criteria (e.g. the quick search in combined mode) are active, so Clear all stays available
   * even without property filters.
   */
  @Input() externalCriteriaActive = false;

  /** Emitted when the user clicks Clear all, so the host can clear its other criteria too. */
  @Output() clearAll = new EventEmitter<void>();

  /**
   * Event emitter to tell hosting view that the filtering conditions have changed
   */
  @Output() propertyFiltersChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  readonly stringPropertyType: PropertyType = PropertyType.String;
  readonly enumPropertyType: PropertyType = PropertyType.Enum;
  readonly numericPropertyType: PropertyType = PropertyType.Numeric;
  readonly dateTimePropertyType: PropertyType = PropertyType.DateTime;
  readonly userPropertyType: PropertyType = PropertyType.User;

  readonly popoverId = uniqueIdFactory();
  readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;
  selectedFilterableProperty: FilterablePropertyDefinition;
  propertyType: PropertyType;
  stringProperty: StringPropertyDefinition;
  enumProperty: EnumPropertyDefinition;
  numericProperty: NumericPropertyDefinition;
  dateTimeProperty: DateTimePropertyDefinition;
  userProperty: UserPropertyDefinition;
  // List of active filters to be sent to the hosting view
  propertyFilters: PropertyFilter[] = [];
  collapsedFilters = false;
  showHideFiltersArrowDir = 'left';
  showHideFiltersLabel: string;
  showHideFiltersAriaLabel: string;

  @ViewChild(ClrCombobox) private fieldCombobox: ClrCombobox<FilterablePropertyDefinition>;
  @ViewChild('addButton', { static: true }) private addButton: ElementRef<HTMLButtonElement>;
  private readonly injector = inject(Injector);

  constructor(
    public filterStrings: DatagridFiltersStrings,
    private cdr: ChangeDetectorRef,
    private popoverService: ClrPopoverService
  ) {
    this.showHideFiltersLabel = filterStrings.hideButtonLabel;
    this.showHideFiltersAriaLabel = filterStrings.hideButtonAriaLabel;
  }

  get signPostOpened(): boolean {
    return this.popoverService.open;
  }

  set signPostOpened(open: boolean) {
    this.popoverService.open = open;
  }

  get visibleProperties(): FilterablePropertyDefinition[] {
    const properties = new Map<string, FilterablePropertyDefinition>();
    for (const property of [...(this.predefinedFilters || []), ...this.activeFilters()]) {
      if (!properties.has(property.property) && !this.isSemiPredefined(property)) {
        properties.set(property.property, property);
      }
    }
    return [...properties.values()];
  }

  get availableProperties(): FilterablePropertyDefinition[] {
    const visibleKeys = new Set(
      [...this.visibleProperties, ...(this.semiPredefinedFilters || []), ...this.toggleProperties()].map(
        property => property.property
      )
    );
    return (this.filterableProperties || []).filter(property => !visibleKeys.has(property.property));
  }

  get userAddedFiltersCount(): number {
    return this.activeFilters().filter(property => !this.isPredefined(property) && !this.isSemiPredefined(property))
      .length;
  }

  get predefinedProperties(): FilterablePropertyDefinition[] {
    return this.visibleProperties.filter(property => this.isPredefined(property));
  }

  get userAddedProperties(): FilterablePropertyDefinition[] {
    return this.visibleProperties.filter(property => !this.isPredefined(property));
  }

  /** True when the predefined group has content (toggles or predefined pills). */
  get hasPredefinedGroup(): boolean {
    return (this.toggleFilters || []).length > 0 || this.predefinedProperties.length > 0;
  }

  get hasActiveCriteria(): boolean {
    return this.propertyFilters.length > 0 || this.activeToggles.size > 0;
  }

  isToggleOn(toggle: PropertyFilter): boolean {
    return this.activeToggles.has(toggle);
  }

  toggleFilter(toggle: PropertyFilter): void {
    if (this.activeToggles.has(toggle)) {
      this.activeToggles.delete(toggle);
    } else {
      this.activeToggles.add(toggle);
    }
    this.emitFilters();
  }

  /** FIELD_NAME: VALUE for Equals, FIELD_NAME: CONDITION VALUE otherwise. Multiple values are comma separated. */
  toggleText(toggle: PropertyFilter): string {
    const property = toggle.criteria[0]?.filterableProperty;
    const values = toggle.criteria.map(predicate => {
      const value =
        property instanceof EnumPropertyDefinition
          ? (property.values.get(predicate.value) ?? predicate.value)
          : predicate.value;
      return predicate.operator === ComparisonOperator.Equals
        ? `${value}`
        : `${this.filterStrings.getOperatorDisplayName(predicate.operator)} ${value}`;
    });
    return `${property?.displayName}: ${values.join(', ')}`;
  }

  isSemiPredefined(property: FilterablePropertyDefinition): boolean {
    return (this.semiPredefinedFilters || []).some(semi => semi.property === property.property);
  }

  /** Option pills of a semi-predefined filter, in the order of the enum values map. */
  semiOptions(property: EnumPropertyDefinition): { key: string; label: string }[] {
    return Array.from(property.values, ([key, label]) => ({ key, label }));
  }

  isOptionSelected(property: EnumPropertyDefinition, key: string): boolean {
    return !!this.filterFor(property)?.criteria.some(
      predicate => predicate.operator === ComparisonOperator.Equals && predicate.value === key
    );
  }

  toggleOption(property: EnumPropertyDefinition, key: string): void {
    const selected = this.semiOptions(property)
      .map(option => option.key)
      .filter(optionKey => (optionKey === key) !== this.isOptionSelected(property, optionKey));
    const filter = new PropertyFilter();
    filter.operator = LogicalOperator.Or;
    filter.criteria = selected.map(value => {
      const predicate = new PropertyPredicate();
      predicate.filterableProperty = property;
      predicate.operator = ComparisonOperator.Equals;
      predicate.value = value;
      return predicate;
    });
    if (filter.criteria.length) {
      this.onFilterCriteriaChange(filter);
    } else {
      this.clearFilter(property);
    }
  }

  isPredefined(property: FilterablePropertyDefinition): boolean {
    return (this.predefinedFilters || []).some(predefined => predefined.property === property.property);
  }

  filterFor(property: FilterablePropertyDefinition): PropertyFilter | undefined {
    return this.propertyFilters.find(filter => filter.criteria[0]?.filterableProperty.property === property.property);
  }

  ngOnChanges(): void {
    this.preselectFirstProperty();
  }

  ngOnInit() {
    if (this.filterableProperties && this.filterableProperties.length > 0) {
      this.selectedFilterableProperty = this.filterableProperties[0];
      this.onPropertyChange();
    }
    if (this.presetFilters) {
      const presets = this.presetFilters.filter(filter => filter.criteria.length > 0);
      // A preset for a toggle field turns that toggle ON instead of creating a pill.
      for (const toggle of this.toggleFilters || []) {
        if (presets.some(filter => this.sameField(filter, toggle))) {
          this.activeToggles.add(toggle);
        }
      }
      this.propertyFilters = presets.filter(
        filter => !(this.toggleFilters || []).some(toggle => this.sameField(filter, toggle))
      );
    }
    this.preselectFirstProperty();
  }

  onPropertyChange() {
    this.propertyType = undefined;
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
    } else if (this.isUserProperty(this.selectedFilterableProperty)) {
      this.propertyType = PropertyType.User;
      this.userProperty = this.castUserProperty();
    }
    if (this.signPostOpened) {
      // Changing fields recreates the editor and its field picker. Keep keyboard focus in the new picker.
      afterNextRender(
        () => {
          if (this.signPostOpened) {
            this.fieldCombobox?.textbox.nativeElement.focus();
          }
        },
        { injector: this.injector }
      );
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
            this.propertyFilters[i].criteria[0]?.filterableProperty.property ===
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
      this.emitFilters();
    }
    if (this.signPostOpened) {
      this.signPostOpened = false;
      this.popoverService.focusOrigin();
    }
    this.preselectFirstProperty();
    this.updateShowHideLabel();
    // The filter sometimes fails to close, necessitating
    // a check to detect this state change.
    this.cdr.markForCheck();
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
    this.activeToggles.clear();
    this.emitFilters();
    this.preselectFirstProperty();
    this.collapsedFilters = false;
    this.updateShowHideLabel();
    this.showHideFiltersArrowDir = 'left';
    this.clearAll.emit();
  }

  clearFilter(property: FilterablePropertyDefinition): void {
    this.propertyFilters = this.propertyFilters.filter(
      filter => filter.criteria[0]?.filterableProperty.property !== property.property
    );
    this.emitFilters();
    this.preselectFirstProperty();
    this.updateShowHideLabel();
    if (!this.isPredefined(property) && !this.isSemiPredefined(property)) {
      // The removed pill held focus and no longer exists, so move focus to Add filter.
      afterNextRender(() => this.addButton?.nativeElement.focus(), { injector: this.injector });
    }
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
  private toggleProperties(): FilterablePropertyDefinition[] {
    return (this.toggleFilters || [])
      .map(toggle => toggle.criteria[0]?.filterableProperty)
      .filter((property): property is FilterablePropertyDefinition => !!property);
  }

  private sameField(filter: PropertyFilter, other: PropertyFilter): boolean {
    const property = filter.criteria[0]?.filterableProperty?.property;
    return !!property && property === other.criteria[0]?.filterableProperty?.property;
  }

  /** Emits the user filters plus the toggle filters that are ON. */
  private emitFilters(): void {
    this.propertyFiltersChange.emit([...this.propertyFilters, ...this.activeToggles]);
  }

  private preselectFirstProperty() {
    const remainingProperties = this.availableProperties;
    this.selectedFilterableProperty = remainingProperties[0];
    if (this.selectedFilterableProperty) {
      this.onPropertyChange();
    }
  }

  private updateShowHideLabel(): void {
    const count = this.userAddedFiltersCount;
    this.showHideFiltersLabel = this.collapsedFilters
      ? this.filterStrings.showButtonLabel + '(' + count + ')'
      : this.filterStrings.hideButtonLabel;
    this.showHideFiltersAriaLabel = this.collapsedFilters
      ? this.filterStrings.showButtonLabel +
        ' ' +
        count +
        ' ' +
        (count > 1 ? this.filterStrings.filtersText : this.filterStrings.filterText)
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

  private isUserProperty(property: FilterablePropertyDefinition): property is UserPropertyDefinition {
    return property instanceof UserPropertyDefinition;
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

  private castUserProperty(): UserPropertyDefinition {
    return this.selectedFilterableProperty as UserPropertyDefinition;
  }
}
