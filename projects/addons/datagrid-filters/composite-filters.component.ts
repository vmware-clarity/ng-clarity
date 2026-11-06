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
  SimpleChanges,
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

// The array inputs below accept null/undefined (e.g. `[toggleFilters]="config?.toggles"` before the config loads).
function toPropertyArray(value: FilterablePropertyDefinition[] | null | undefined): FilterablePropertyDefinition[] {
  return value ?? [];
}

function toEnumPropertyArray(value: EnumPropertyDefinition[] | null | undefined): EnumPropertyDefinition[] {
  return value ?? [];
}

function toFilterArray(value: PropertyFilter[] | null | undefined): PropertyFilter[] {
  return value ?? [];
}

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
  /** Keys (see toggleKey) of the toggle filters that are ON. */
  private rawPredefinedFilters: FilterablePropertyDefinition[] = [];
  private rawSemiPredefinedFilters: EnumPropertyDefinition[] = [];
  private rawToggleFilters: PropertyFilter[] = [];
  private resolvedPredefinedFilters: FilterablePropertyDefinition[] = [];
  private resolvedSemiPredefinedFilters: EnumPropertyDefinition[] = [];
  private resolvedToggleFilters: PropertyFilter[] = [];
  /** Fields ignored by the last resolution, reported with console.warn. */
  private ignoredFieldEntries: string[] = [];
  private initialized = false;
  private readonly activeToggleKeys = new Set<string>();

  constructor(
    public filterStrings: DatagridFiltersStrings,
    private cdr: ChangeDetectorRef,
    private popoverService: ClrPopoverService
  ) {
    this.showHideFiltersLabel = filterStrings.hideButtonLabel;
    this.showHideFiltersAriaLabel = filterStrings.hideButtonAriaLabel;
  }

  /**
   * Properties whose pills remain visible when their criteria are cleared.
   *
   * A field can be used only once per filter bar. Fields are claimed in this order:
   * `predefinedFilters`, then `semiPredefinedFilters`, then `toggleFilters`. A later entry
   * for a field that is already claimed is ignored, with a console warning.
   */
  @Input({ transform: toPropertyArray })
  get predefinedFilters(): FilterablePropertyDefinition[] {
    return this.resolvedPredefinedFilters;
  }
  set predefinedFilters(value: FilterablePropertyDefinition[]) {
    this.rawPredefinedFilters = value;
    this.resolveFieldOwners();
  }

  /**
   * Enum properties shown as a field label followed by toggleable option pills,
   * between the predefined and the user-added pills. Selected options are combined with OR
   * and applied immediately. Fields already in `predefinedFilters` are ignored.
   */
  @Input({ transform: toEnumPropertyArray })
  get semiPredefinedFilters(): EnumPropertyDefinition[] {
    return this.resolvedSemiPredefinedFilters;
  }
  set semiPredefinedFilters(value: EnumPropertyDefinition[]) {
    this.rawSemiPredefinedFilters = value;
    this.resolveFieldOwners();
  }

  /**
   * Ready-made filters shown as on/off pills in the predefined group. OFF means not applied;
   * ON applies the filter as configured. A preset filter with the same criteria starts the toggle ON.
   * Toggles are identified by their criteria, so the host may pass new but equal objects.
   * Toggles on a field already in `predefinedFilters`, `semiPredefinedFilters` or an earlier toggle are ignored.
   */
  @Input({ transform: toFilterArray })
  get toggleFilters(): PropertyFilter[] {
    return this.resolvedToggleFilters;
  }
  set toggleFilters(value: PropertyFilter[]) {
    this.rawToggleFilters = value;
    this.resolveFieldOwners();
  }

  get signPostOpened(): boolean {
    return this.popoverService.open;
  }

  set signPostOpened(open: boolean) {
    this.popoverService.open = open;
  }

  get visibleProperties(): FilterablePropertyDefinition[] {
    const properties = new Map<string, FilterablePropertyDefinition>();
    for (const property of [...this.predefinedFilters, ...this.activeFilters()]) {
      if (!properties.has(property.property) && !this.isSemiPredefined(property)) {
        properties.set(property.property, property);
      }
    }
    return [...properties.values()];
  }

  get availableProperties(): FilterablePropertyDefinition[] {
    const visibleKeys = new Set(
      [...this.visibleProperties, ...this.semiPredefinedFilters, ...this.toggleProperties()].map(
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
    return this.toggleFilters.length > 0 || this.predefinedProperties.length > 0;
  }

  get hasActiveCriteria(): boolean {
    return this.propertyFilters.length > 0 || this.activeToggleKeys.size > 0;
  }

  /**
   * Stable identity of a toggle: field, operator and value of each criterion, plus the logical
   * operator when there is more than one criterion.
   */
  toggleKey(filter: PropertyFilter): string {
    const criteria = filter.criteria.map(predicate => [
      predicate.filterableProperty?.property,
      predicate.operator,
      predicate.value,
    ]);
    return JSON.stringify(criteria.length > 1 ? [filter.operator, criteria] : criteria);
  }

  isToggleOn(toggle: PropertyFilter): boolean {
    return this.activeToggleKeys.has(this.toggleKey(toggle));
  }

  toggleFilter(toggle: PropertyFilter): void {
    const key = this.toggleKey(toggle);
    if (this.activeToggleKeys.has(key)) {
      this.activeToggleKeys.delete(key);
    } else {
      this.activeToggleKeys.add(key);
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
    return this.semiPredefinedFilters.some(semi => semi.property === property.property);
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
    return this.predefinedFilters.some(predefined => predefined.property === property.property);
  }

  filterFor(property: FilterablePropertyDefinition): PropertyFilter | undefined {
    return this.propertyFilters.find(filter => filter.criteria[0]?.filterableProperty.property === property.property);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['predefinedFilters'] || changes['semiPredefinedFilters'] || changes['toggleFilters']) {
      this.warnIgnoredFields();
      // Precedence can hand a field to semiPredefinedFilters after init; its current filter may no longer be valid.
      if (this.initialized && this.removeInvalidSemiFilters()) {
        this.emitFilters();
      }
    }
    if (changes['toggleFilters']) {
      // Drop ON states of toggles that are no longer configured.
      const keys = new Set(this.toggleFilters.map(toggle => this.toggleKey(toggle)));
      this.activeToggleKeys.forEach(key => {
        if (!keys.has(key)) {
          this.activeToggleKeys.delete(key);
        }
      });
    }
    this.preselectFirstProperty();
  }

  ngOnInit() {
    if (this.filterableProperties && this.filterableProperties.length > 0) {
      this.selectedFilterableProperty = this.filterableProperties[0];
      this.onPropertyChange();
    }
    if (this.presetFilters) {
      const presets = this.presetFilters.filter(filter => filter.criteria.length > 0);
      // A preset with exactly a toggle's criteria turns that toggle ON. Any other preset stays a normal pill.
      const toggleKeys = new Set(this.toggleFilters.map(toggle => this.toggleKey(toggle)));
      this.propertyFilters = presets.filter(filter => {
        const key = this.toggleKey(filter);
        if (toggleKeys.has(key)) {
          this.activeToggleKeys.add(key);
          return false;
        }
        return true;
      });
      this.removeInvalidSemiFilters();
    }
    this.initialized = true;
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
    this.activeToggleKeys.clear();
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
    return this.toggleFilters
      .map(toggle => toggle.criteria[0]?.filterableProperty)
      .filter((property): property is FilterablePropertyDefinition => !!property);
  }

  /** Emits the user filters plus the toggle filters that are ON. */
  private emitFilters(): void {
    this.propertyFiltersChange.emit([
      ...this.propertyFilters,
      ...this.toggleFilters.filter(toggle => this.isToggleOn(toggle)),
    ]);
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

  /**
   * Each field may appear only once across predefined, semi-predefined and toggle filters.
   * Fields are claimed left to right: predefined, then semi-predefined, then toggles.
   */
  private resolveFieldOwners(): void {
    const claimed = new Set<string>();
    const ignored: string[] = [];
    const claim = (fields: string[], source: string): boolean => {
      const taken = fields.filter(field => claimed.has(field));
      if (taken.length) {
        ignored.push(`${source}: ${taken.join(', ')}`);
        return false;
      }
      fields.forEach(field => claimed.add(field));
      return true;
    };
    this.resolvedPredefinedFilters = this.rawPredefinedFilters.filter(property =>
      claim([property.property], 'predefinedFilters')
    );
    this.resolvedSemiPredefinedFilters = this.rawSemiPredefinedFilters.filter(property =>
      claim([property.property], 'semiPredefinedFilters')
    );
    this.resolvedToggleFilters = this.rawToggleFilters.filter(toggle =>
      claim(
        [...new Set(toggle.criteria.map(predicate => predicate.filterableProperty?.property).filter(Boolean))],
        'toggleFilters'
      )
    );
    this.ignoredFieldEntries = ignored;
  }

  /** Semi-predefined fields only support picking options: Equals on option keys of that field, joined with OR. */
  private isOptionSelection(filter: PropertyFilter): boolean {
    const property = this.semiPredefinedFilters.find(
      semi => semi.property === filter.criteria[0].filterableProperty.property
    );
    return (
      (filter.criteria.length === 1 || filter.operator === LogicalOperator.Or) &&
      filter.criteria.every(
        predicate =>
          predicate.filterableProperty?.property === property.property &&
          predicate.operator === ComparisonOperator.Equals &&
          property.values.has(predicate.value)
      )
    );
  }

  /**
   * Semi-predefined fields only support picking options. Removes any other filter on such a field
   * and writes a console warning. Returns true when something was removed.
   */
  private removeInvalidSemiFilters(): boolean {
    const invalid = this.propertyFilters.filter(
      filter => this.isSemiPredefined(filter.criteria[0].filterableProperty) && !this.isOptionSelection(filter)
    );
    if (!invalid.length) {
      return false;
    }
    this.propertyFilters = this.propertyFilters.filter(filter => !invalid.includes(filter));
    console.warn(
      'appfx-composite-filter: filters on semiPredefinedFilters fields must select options ' +
        '(Equals on option keys, combined with OR). Removed filters for: ' +
        invalid.map(filter => filter.criteria[0].filterableProperty.property).join(', ')
    );
    return true;
  }

  private warnIgnoredFields(): void {
    if (this.ignoredFieldEntries.length) {
      console.warn(
        'appfx-composite-filter: a field can be used only once across predefinedFilters, ' +
          'semiPredefinedFilters and toggleFilters (in that order of precedence). Ignored entries: ' +
          this.ignoredFieldEntries.join('; ')
      );
    }
  }
}
