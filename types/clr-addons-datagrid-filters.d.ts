import * as i0 from "@angular/core";
import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from "@angular/core";
import * as i1 from "@clr/angular/popover/common";
import { ClrPopoverPosition, ClrPopoverType } from "@clr/angular/popover/common";
import * as i19 from "@angular/forms";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import * as i13 from "@clr/angular/forms";
import { DateRangeOption } from "@clr/angular/forms";
import { Observable } from "rxjs";
import * as i18 from "@angular/common";
import { DatePipe } from "@angular/common";
import * as i10 from "@angular/cdk/a11y";
import * as i11 from "@clr/angular/emphasis/badge";
import * as i12 from "@clr/angular/emphasis/label";
import * as i14 from "@clr/angular/icon";
import * as i16 from "@clr/angular/progress/spinner";
import * as i17 from "@clr/angular/popover/tooltip";
export declare enum ComparisonOperator {
  Contains = 0,
  DoesNotContain = 1,
  Equals = 2,
  DoesNotEqual = 3,
  StartsWith = 4,
  EndsWith = 5,
  IsEmpty = 6,
  LessThan = 7,
  LessThanOrEqualTo = 8,
  GreaterThan = 9,
  GreaterThanOrEqualTo = 10,
  Before = 11,
  BeforeOrEqualTo = 12,
  After = 13,
  AfterOrEqualTo = 14,
  CustomRange = 15,
  LastDay = 16,
  LastWeek = 17,
  LastMonth = 18,
  LastYear = 19,
  TimeSpan = 20
}
export declare enum LogicalOperator {
  And = 0,
  Or = 1
}
export declare enum FilterMode {
  Quick = 0,
  Advanced = 1,
  AdvancedOnly = 2,
  /**
   * Quick search and advanced filter pills are shown and applied together.
   * The host combines `searchTermChange` and `propertyFiltersChange` with AND.
   */
  Combined = 3
}
export declare enum PropertyType {
  String = 0,
  Enum = 1,
  Numeric = 2,
  DateTime = 3,
  User = 4
}
export declare enum Unit {
  Byte = 0,
  KB = 1,
  MB = 2,
  GB = 3,
  TB = 4,
  HZ = 5,
  KHZ = 6,
  MHZ = 7,
  GHZ = 8,
  BytePS = 9,
  KBytePS = 10,
  MBytePS = 11,
  GBytePS = 12,
  BitPS = 13,
  KBitPS = 14,
  MBitPS = 15,
  GBitPS = 16
}
export declare enum TimeSpan {
  Minutes = 0,
  Hours = 1,
  Days = 2,
  Weeks = 3,
  Months = 4,
  Years = 5
}
/**
 * User-visible strings used in the 'appfx-datagrid-filters' library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * filters in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module, where you use AppFx
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridFiltersStrings, useClass: LocalizedDatagridFiltersStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
export declare class DatagridFiltersStrings {
  /** Clears the current filter's values while retaining a predefined pill. */
  readonly clearFilter: string;
  /**
   * Filter type label.
   */
  readonly filterType: string;
  /**
   * Quick filter label.
   */
  readonly quickFilter: string;
  /**
   * Advanced filter label.
   */
  readonly advancedFilter: string;
  /**
   * Input placeholder.
   */
  readonly enterValue: string;
  /**
   * Required validator error message
   */
  readonly requiredValidatorMessage: string;
  /**
   * Numeric input validator error message
   */
  readonly integerValidatorMessage: string;
  /**
   * Add new filter button label.
   */
  readonly addNew: string;
  /**
   * Add new filter button aria label.
   */
  readonly addNewAriaLabel: string;
  /**
   * Select filter label.
   */
  readonly filterLabel: string;
  /**
   * Select operator label.
   */
  readonly operatorLabel: string;
  /**
   * Comparison operator display names.
   */
  readonly operator: {
    after: string;
    afterOrEqualTo: string;
    before: string;
    beforeOrEqualTo: string;
    contains: string;
    customRange: string;
    doesNotContain: string;
    doesNotEqual: string;
    endsWith: string;
    equals: string;
    greaterThan: string;
    greaterThanOrEqualTo: string;
    isEmpty: string;
    lastDay: string;
    lastWeek: string;
    lastMonth: string;
    lastYear: string;
    lessThan: string;
    lessThanOrEqualTo: string;
    startsWith: string;
    timeSpan: string;
  };
  /**
   * Select unit aria label.
   */
  readonly unitAriaLabel: string;
  /**
   * Add condition button label.
   */
  readonly addCondition: string;
  /**
   * Remove condition button aria label, followed by the condition number.
   */
  readonly removeConditionAriaLabel: string;
  /**
   * Conjoiners.
   */
  readonly logicalOperator: {
    and: string;
    or: string;
  };
  /**
   * Cancel button label.
   */
  readonly cancel: string;
  /**
   * Apply button label.
   */
  readonly apply: string;
  /**
   * Select values label.
   */
  readonly valueLabel: string;
  /**
   * Select all option label.
   */
  readonly selectAll: string;
  readonly editFilterText: string;
  readonly removeFilterText: string;
  readonly hideButtonLabel: string;
  readonly hideButtonAriaLabel: string;
  readonly showButtonLabel: string;
  readonly filtersText: string;
  readonly filterText: string;
  readonly clearAllButtonAriaLabel: string;
  readonly searchOptions: string;
  readonly searchPlaceholder: string;
  readonly showingFormat: string;
  readonly noValuesFound: string;
  readonly elementsSelectedFormat: string;
  readonly loading: string;
  readonly allSearchResults: string;
  readonly loadMore: string;
  readonly domain: string;
  readonly user: string;
  readonly errorSearchingUsers: string;
  readonly errorLoadingDomains: string;
  readonly emptyUsersError: string;
  /**
   * Add time condition button label.
   */
  readonly addTimeFilter: string;
  /**
   * Time input placeholder.
   */
  readonly timeFormat: string;
  /**
   * Screen reader label of the date input of single-date operators (e.g. Equals, Before).
   */
  readonly dateLabel: string;
  /**
   * Screen reader label of the time input of single-date operators.
   */
  readonly timeLabel: string;
  /**
   * Screen reader label of the start time input of a custom range.
   */
  readonly fromTimeLabel: string;
  /**
   * Screen reader label of the end time input of a custom range.
   */
  readonly toTimeLabel: string;
  /**
   * Date input validator error message
   */
  readonly dateValidatorMessage: string;
  /**
   * Validation message when the end of a custom date range is before its start.
   */
  readonly dateRangeValidatorMessage: string;
  /**
   * Time input validator error message
   */
  readonly timeValidatorMessage: string;
  /**
   * Screen reader label of the date range picker used by the custom range operator without times.
   */
  readonly dateRangeLabel: string;
  /**
   * Screen reader label of the preset range buttons shown by the custom range operator with times.
   */
  readonly dateRangeOptionsLabel: string;
  readonly fromLabel: string;
  readonly toLabel: string;
  /**
   * Remove time filter button aria label.
   */
  readonly removeTimeFilterAriaLabel: string;
  readonly timeSpan: {
    minutes: string;
    hours: string;
    days: string;
    weeks: string;
    months: string;
    years: string;
  };
  /**
   * Time span aria label.
   */
  readonly timeSpanAriaLabel: string;
  readonly timeSpanInputLabel: string;
  readonly unit: {
    byte: string;
    kb: string;
    mb: string;
    gb: string;
    tb: string;
    hz: string;
    khz: string;
    mhz: string;
    ghz: string;
    byteps: string;
    kbyteps: string;
    mbyteps: string;
    gbyteps: string;
    bitps: string;
    kbitps: string;
    mbitps: string;
    gbitps: string;
  };
  formatString(stringFormat: string, args: string[]): string;
  getOperatorDisplayName(operator: ComparisonOperator): string;
  getConjoinerDisplayName(conjoiner: LogicalOperator): string;
  getTimeSpanDisplayName(timeSpan: TimeSpan): string;
  getUnitDisplayName(unit: Unit): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFiltersStrings, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
/**
 * Defines a property that can be used to filter data in a datagrid.
 * Filterable properties are usually a subset of the datagrid columns.
 */
export declare abstract class FilterablePropertyDefinition {
  /**
   * Used internally to store dynamically the selected numeric value, unit and/or other properties.
   */
  [key: string]: any;
  /**
   * Name as shown to users
   */
  displayName: string;
  /**
   *  Actual name of the property that is used for filtering
   */
  property: string;
  /**
   *  List of comparison operators. Optional.
   *  Use it to override the default operators for the property.
   *  Useful in case the data provider does not support all operators.
   */
  supportedOperators?: ComparisonOperator[];
  protected constructor(displayName: string, property: string, operators?: ComparisonOperator[]);
}
export declare class StringPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Indicates that the property can be used with single condition only.
   */
  singleCondition: boolean;
  /**
   * Indicates that this property only supports a single logical operator (AND or OR).
   */
  logicalOperator: LogicalOperator | undefined;
  private readonly defaultOperators;
  constructor(displayName: string, property: string, operators?: ComparisonOperator[], singleCondition?: boolean, logicalOperator?: LogicalOperator);
  getOperators(): ComparisonOperator[];
}
export declare class EnumPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Enumeration key/value data to be used in the filter selection
   */
  values: Map<string, string>;
  /**
   * Indicates that the property should be used for single select filtering
   */
  singleSelect: boolean;
  /**
   * Indicates that the enumeration should be searchable in the filter UI.
   */
  searchable: boolean;
  /**
   * Flag indicating whether to show the select all checkbox.
   */
  enableSelectAll: boolean;
  /**
   * Creates an instance of EnumPropertyDefinition.
   * @param displayName - The human-readable name of the property shown in the UI.
   * @param property - The technical property name used for filtering logic.
   * @param values - A Map containing the enum keys and their corresponding display values.
   * @param singleSelect - Whether the filter restricts selection to a single item. Defaults to false.
   * @param searchable - Whether to enable a search input for the enum options. Defaults to false.
   * @param enableSelectAll - Whether to display the select all checkbox. Defaults to true.
   * @param allowNotInOperator - Flag indicating whether to allow the use of the "NOT IN" operator
   *        for the selected values, enabling users to exclude specific enum items.
   */
  constructor(displayName: string, property: string, values: Map<string, string>, singleSelect?: boolean, searchable?: boolean, enableSelectAll?: boolean, allowNotInOperator?: boolean);
}
export declare class NumericPropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Default unit of the metric
   */
  unit: Unit;
  /**
   * Indicates that the property can be used with single condition only.
   */
  singleCondition: boolean;
  /**
   * Indicates that this property only supports a single logical operator (AND or OR).
   */
  logicalOperator: LogicalOperator | undefined;
  private readonly defaultOperators;
  constructor(displayName: string, property: string, operators?: ComparisonOperator[], unit?: Unit, singleCondition?: boolean, logicalOperator?: LogicalOperator);
  getOperators(): ComparisonOperator[];
}
export declare class UserPropertyDefinition extends FilterablePropertyDefinition {
  constructor(displayName: string, property: string);
}
export declare class DateTimePropertyDefinition extends FilterablePropertyDefinition {
  /**
   * Flag indicating whether to include seconds in the time selector for the DateTime filter.
   */
  includeSeconds: boolean;
  /**
   * Preset ranges offered by the custom range operator. Without times they are listed in the date range picker; with
   * times they are buttons under the operator. Each `value` is `[start, end]`, both inclusive, used as given. A `Date`
   * at exactly 00:00 means the whole day. Options whose `value` is not two valid dates are ignored.
   */
  rangeOptions: DateRangeOption[];
  private readonly defaultOperators;
  constructor(displayName: string, property: string, operators?: ComparisonOperator[], includeSeconds?: boolean, rangeOptions?: DateRangeOption[]);
  getOperators(): ComparisonOperator[];
}
/**
 * Editor choices that the criteria alone cannot express, kept on each filter so that field definitions
 * can be shared between filter bars. Date-time filters store the operator as chosen (e.g. Last week or
 * Time span) and the entered dates; numeric filters with units store the typed values and units.
 */
export interface FilterEditorState {
  /** Date-time operator as chosen in the editor. */
  operator?: ComparisonOperator;
  /** Date-time value as `yyyy-MM-dd` or `yyyy-MM-ddTHH:mm[:ss]`. The start of a custom range. */
  value?: string;
  /** End of a custom range, in the same format as `value`. Inclusive. */
  valueTo?: string;
  timeSpanValue?: number;
  timeSpan?: TimeSpan;
  /** Numeric with unit: the value typed for each condition, before unit conversion. */
  values?: any[];
  /** Numeric with unit: the unit chosen for each condition. */
  units?: Unit[];
}
/**
 * An on/off pill for `toggleFilters`: ON applies `filter`, OFF applies nothing.
 */
export interface ToggleFilter {
  /**
   * Text of the pill, shown as given (any free text, translated by the host). Without a label, or with an empty
   * one, the text is generated from the filter's criteria, e.g. "Status: Warning". The tooltip always shows the
   * criteria.
   */
  label?: string;
  /** The filter applied while the toggle is ON. Toggles are identified by its criteria, not by the label. */
  filter: PropertyFilter;
}
export declare class PropertyFilter {
  /**
   *  Filter criteria
   */
  criteria: PropertyPredicate[];
  /**
   *  Logical operator. Supported values are AND/OR
   */
  operator: LogicalOperator;
  /**
   * Set by the built-in editors. Optional for host-built filters such as presets; without it the
   * editor and pill derive what they can from the criteria.
   */
  editorState?: FilterEditorState;
}
export declare class PropertyPredicate {
  /**
   *  Property that is used for filtering
   */
  filterableProperty: FilterablePropertyDefinition;
  /**
   *  Filtering operator
   */
  operator: ComparisonOperator;
  /**
   *  Filter value
   */
  value: any;
}
interface EnumPropertyData {
  key: string;
  value: string;
}
/** The controls of one condition row of the string and numeric editor. Internal, not exported from the package. */
interface ConditionControls {
  operator: FormControl<ComparisonOperator>;
  /** The input's text, or the stored value when a filter is edited. */
  value: FormControl<string | number>;
  unit: FormControl<Unit>;
}
/** The controls of the string and numeric editor's form. Internal, not exported from the package. */
interface GeneralFilterControls {
  conditions: FormArray<FormGroup<ConditionControls>>;
  logicalOperator: FormControl<LogicalOperator>;
}
/**
 * Composite filters component renders different filters based on the type of
 * the corresponding filterable property, e.g., string, enum, number, etc.
 */
export declare class CompositeFiltersComponent implements OnInit, OnChanges {
  filterStrings: DatagridFiltersStrings;
  private cdr;
  /**
   * Filters applied when the filter bar starts, e.g. a fixed default view. Read once, in `ngOnInit`:
   * later changes are ignored. For filters the host keeps in sync, use `propertyFilters`.
   */
  presetFilters?: PropertyFilter[];
  /**
   * Other criteria (e.g. the quick search in combined mode) are active, so Clear all stays available
   * even without property filters.
   */
  externalCriteriaActive: boolean;
  /** Emitted when the user clicks Clear all, so the host can clear its other criteria too. */
  clearAll: EventEmitter<void>;
  /**
   * Event emitter to tell hosting view that the filtering conditions have changed
   */
  propertyFiltersChange: EventEmitter<PropertyFilter[]>;
  selectedFilterableProperty: FilterablePropertyDefinition;
  collapsedFilters: boolean;
  protected readonly popoverId: string;
  protected readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  protected readonly popoverType = ClrPopoverType.DROPDOWN;
  private fieldCombobox;
  private addButton;
  private toggleButtons;
  private predefinedPills;
  private semiOptionButtons;
  private readonly injector;
  private readonly destroyRef;
  private readonly popoverService;
  private rawPredefinedFilters;
  private rawSemiPredefinedFilters;
  private rawToggleFilters;
  private readonly filterablePropertiesState;
  private readonly propertyFiltersState;
  private readonly resolvedPredefinedFilters;
  private readonly resolvedSemiPredefinedFilters;
  private readonly resolvedToggleFilters;
  /** The input that owns each predefined and semi-predefined field. The lists are without duplicates. */
  private readonly fieldOwners;
  private readonly visiblePropertiesCache;
  private readonly availablePropertiesCache;
  private readonly userAddedFiltersCountCache;
  private readonly predefinedPropertiesCache;
  private readonly userAddedPropertiesCache;
  /** Fields ignored by the last resolution, reported with console.warn. */
  private ignoredFieldEntries;
  private initialized;
  /** Keys (see toggleKey) of the toggle filters that are ON. */
  private readonly activeToggleKeys;
  constructor(filterStrings: DatagridFiltersStrings, cdr: ChangeDetectorRef);
  get filterableProperties(): FilterablePropertyDefinition[];
  set filterableProperties(value: FilterablePropertyDefinition[]);
  /**
   * The active filters, including toggle filters that are ON. Supports two-way binding:
   * `[(propertyFilters)]="filters"`. A new value replaces the active filters without emitting
   * `propertyFiltersChange`, unless invalid filters on semi-predefined fields had to be removed.
   * At start-up, a `presetFilters` filter wins over one here for the same field.
   */
  get propertyFilters(): PropertyFilter[];
  set propertyFilters(filters: PropertyFilter[]);
  /**
   * Properties whose pills remain visible when their criteria are cleared.
   *
   * A field can be used only once per filter bar. Fields are claimed in this order:
   * `predefinedFilters`, then `semiPredefinedFilters`, then `toggleFilters`. A later entry
   * for a field that is already claimed is ignored, with a console warning.
   */
  get predefinedFilters(): FilterablePropertyDefinition[];
  set predefinedFilters(value: FilterablePropertyDefinition[]);
  /**
   * Enum properties shown as a field label followed by toggleable option pills,
   * between the predefined and the user-added pills. Selected options are combined with OR
   * and applied immediately. Fields already in `predefinedFilters` are ignored.
   */
  get semiPredefinedFilters(): EnumPropertyDefinition[];
  set semiPredefinedFilters(value: EnumPropertyDefinition[]);
  /**
   * Ready-made filters shown as on/off pills in the predefined group. OFF means not applied;
   * ON applies the toggle's `filter`. A preset filter with the same criteria starts the toggle ON.
   * Toggles are identified by their criteria, so the host may pass new but equal objects.
   * Toggles on a field already in `predefinedFilters`, `semiPredefinedFilters` or an earlier toggle are ignored.
   * The toggle owns its field: any other filter on it (a preset or a `propertyFilters` entry) is removed, with a
   * console warning.
   */
  get toggleFilters(): ToggleFilter[];
  set toggleFilters(value: ToggleFilter[]);
  get showHideFiltersArrowDir(): string;
  get showHideFiltersLabel(): string;
  get showHideFiltersAriaLabel(): string;
  get signPostOpened(): boolean;
  set signPostOpened(open: boolean);
  protected get visibleProperties(): FilterablePropertyDefinition[];
  protected get availableProperties(): FilterablePropertyDefinition[];
  protected get userAddedFiltersCount(): number;
  protected get predefinedProperties(): FilterablePropertyDefinition[];
  protected get userAddedProperties(): FilterablePropertyDefinition[];
  /** True when the predefined group has content (toggles or predefined pills). */
  protected get hasPredefinedGroup(): boolean;
  protected get hasActiveCriteria(): boolean;
  ngOnChanges(changes: SimpleChanges): void;
  ngOnInit(): void;
  /** The field in Add filter changed. The editor for it is chosen by `appfx-filter-editor`. */
  onPropertyChange(): void;
  onFilterCriteriaChange(propertyFilter: PropertyFilter): void;
  /**
   * Returns a list properties for which there is an active filter
   */
  activeFilters(): FilterablePropertyDefinition[];
  clearAllFilters(): void;
  showHideAllFilters(): void;
  /**
   * Stable identity of a toggle: field, operator and value of each criterion, plus the logical
   * operator when there is more than one criterion.
   */
  protected toggleKey(filter: PropertyFilter): string;
  protected isToggleOn(toggle: ToggleFilter): boolean;
  protected toggleFilter(toggle: ToggleFilter): void;
  /** The host's label as given, or the text generated from the criteria when there is no (or an empty) label. */
  protected toggleText(toggle: ToggleFilter): string;
  /**
   * FIELD_NAME: VALUE for Equals, FIELD_NAME: CONDITION for Is empty, FIELD_NAME: CONDITION VALUE otherwise.
   * Multiple criteria are joined with the filter's logical operator, e.g. "Status: Running Or Stopped".
   */
  protected toggleCriteriaText(toggle: PropertyFilter): string;
  /** Option pills of a semi-predefined filter, in the order of the enum values map. */
  protected semiOptions(property: EnumPropertyDefinition): {
    key: string;
    label: string;
  }[];
  protected isOptionSelected(property: EnumPropertyDefinition, key: string): boolean;
  protected toggleOption(property: EnumPropertyDefinition, key: string): void;
  protected filterFor(property: FilterablePropertyDefinition): PropertyFilter | undefined;
  protected clearFilter(property: FilterablePropertyDefinition): void;
  private isSemiPredefined;
  private isPredefined;
  /** The fields used by the toggle filters. */
  private toggleProperties;
  /**
   * Sets the active filters from a full list, as emitted by `propertyFiltersChange`: a filter with exactly a toggle's
   * criteria turns that toggle ON, any other non-empty filter becomes a pill. Copies the list, so the host's array
   * is never changed.
   */
  private applyFilters;
  /** The field definitions of this filter bar, by `property` key. The first input that has a field wins. */
  private knownProperties;
  /**
   * Uses this filter bar's field definitions in the filter's criteria, matched by `property` key. Filters restored from
   * JSON (saved views, URLs) have plain objects there, which the editors don't recognize. Returns a copy when a
   * definition was replaced, so the host's filter is never changed; filters with unknown fields are kept as they are.
   */
  private withKnownProperties;
  /** Emits the user filters plus the toggle filters that are ON. */
  private emitFilters;
  /**
   * Emits after the current change detection. Lifecycle hooks run while the parent is being checked, so emitting
   * there would change a `[(propertyFilters)]` value Angular has already checked (NG0100).
   */
  private emitFiltersLater;
  /** Drops ON states of toggles that are no longer configured or lost their field. True if any was ON. */
  private removeUnresolvedToggleKeys;
  /** The user filters plus the toggle filters that are ON, as emitted. */
  private currentFilters;
  /** Same filters by criteria (field, operator, value and logical operator), in any order. */
  private sameFilters;
  /**
   * Moves focus after the element that had it was removed (Clear all, or removing a user-added pill). Runs after the
   * next render, once the removed element is gone and Add filter is enabled or disabled for the remaining fields.
   *
   * Focus goes to:
   * 1. Add filter, when it is enabled.
   * 2. Otherwise the first enabled filter button, in page order:
   *    2.1. The first toggle filter
   *    2.2. Then the first predefined pill
   *    2.3. then the first semi-predefined option.
   *    Add filter is disabled when every field is taken by these fixed filters, and it cannot take focus.
   * 3. Nowhere, when neither exists; focus then stays where the browser puts it.
   */
  private moveFocusToActiveButton;
  /**
   * Keeps the field chosen in Add filter (and the editor's typed values) across input changes, as long as the field
   * is still available. Matched by key, so a new `filterableProperties` array with equal fields keeps it too.
   */
  private keepOrPreselectProperty;
  private preselectFirstProperty;
  /**
   * Each field may appear only once across predefined, semi-predefined and toggle filters.
   * Fields are claimed left to right: predefined, then semi-predefined, then toggles.
   */
  private resolveFieldOwners;
  /** Semi-predefined fields only support picking options: Equals on option keys of that field, joined with OR. */
  private isOptionSelection;
  /**
   * Semi-predefined fields only support picking options. Removes any other filter on such a field
   * and writes a console warning. Returns true when something was removed.
   */
  private removeInvalidSemiFilters;
  /** Removes filters that their field's owner does not allow. Returns true when something was removed. */
  private removeInvalidFilters;
  /**
   * A toggle owns its field. A filter with exactly a toggle's criteria turns the toggle ON (see applyFilters), so a
   * filter still on a toggle's field has other criteria. Removes it and writes a console warning. Returns true when
   * something was removed.
   */
  private removeToggleFieldFilters;
  /** Removes the filters `invalid` matches and writes a console warning. Returns true when something was removed. */
  private removeFilters;
  private warnIgnoredFields;
  static ɵfac: i0.ɵɵFactoryDeclaration<CompositeFiltersComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<CompositeFiltersComponent, "appfx-composite-filter", never, {
    "presetFilters": {
      "alias": "presetFilters";
      "required": false;
    };
    "externalCriteriaActive": {
      "alias": "externalCriteriaActive";
      "required": false;
    };
    "filterableProperties": {
      "alias": "filterableProperties";
      "required": false;
    };
    "propertyFilters": {
      "alias": "propertyFilters";
      "required": false;
    };
    "predefinedFilters": {
      "alias": "predefinedFilters";
      "required": false;
    };
    "semiPredefinedFilters": {
      "alias": "semiPredefinedFilters";
      "required": false;
    };
    "toggleFilters": {
      "alias": "toggleFilters";
      "required": false;
    };
  }, {
    "clearAll": "clearAll";
    "propertyFiltersChange": "propertyFiltersChange";
  }, never, never, false, [{
    directive: typeof i1.ClrPopoverHostDirective;
    inputs: {};
    outputs: {};
  }]>;
  static ngAcceptInputType_filterableProperties: FilterablePropertyDefinition[] | null | undefined;
  static ngAcceptInputType_propertyFilters: PropertyFilter[] | null | undefined;
  static ngAcceptInputType_predefinedFilters: FilterablePropertyDefinition[] | null | undefined;
  static ngAcceptInputType_semiPredefinedFilters: EnumPropertyDefinition[] | null | undefined;
  static ngAcceptInputType_toggleFilters: ToggleFilter[] | null | undefined;
}
/**
 * Component provides the ability to choose from quick filter (search)
 * and advanced filter (composite filters).
 */
export declare class DataGridFiltersComponent implements OnDestroy, AfterViewInit {
  filterStrings: DatagridFiltersStrings;
  readonly quickMode: FilterMode;
  readonly advancedMode: FilterMode;
  readonly advancedOnlyMode: FilterMode;
  mode: FilterMode;
  selectedFilterMode: FilterMode;
  /**
   * Array of filterable properties
   */
  filterableProperties: FilterablePropertyDefinition[];
  /**
   * Filters applied when the filter bar starts, e.g. a fixed default view. Read once at start-up:
   * later changes are ignored. For filters the host keeps in sync, use `propertyFilters`.
   * `presetFilters` have precedence over `propertyFilters` on initial load.
   */
  presetFilters?: PropertyFilter[];
  /**
   * Properties whose filter pills stay visible even without active criteria.
   * Use presetFilters to supply their initial values.
   */
  predefinedFilters: FilterablePropertyDefinition[];
  /**
   * Enum properties shown as a field label with toggleable option pills, between the
   * predefined and the user-added pills. Selected options are combined with OR.
   */
  semiPredefinedFilters: EnumPropertyDefinition[];
  /**
   * Ready-made filters shown as on/off pills in the predefined group. OFF means not applied;
   * ON applies the filter as configured.
   */
  toggleFilters: ToggleFilter[];
  /**
   * Event emitter to tell hosting view that search term, used for filtering
   * has changed.
   */
  searchTermChange: EventEmitter<string>;
  propertyFiltersChange: EventEmitter<PropertyFilter[]>;
  protected readonly combinedMode: FilterMode;
  private lastSearchTerm;
  private searchTermDebouncer;
  private unsubscribeSubject;
  private _propertyFilters;
  private _searchTerm;
  constructor(filterStrings: DatagridFiltersStrings);
  /**
   * Quick, Advanced, AdvancedOnly or Combined. Default Quick.
   */
  set filterMode(filterMode: FilterMode);
  /**
   * The active filters, including toggle filters that are ON. Supports two-way binding:
   * `[(propertyFilters)]="filters"`. A new value replaces the active filters without emitting
   * `propertyFiltersChange`.
   */
  get propertyFilters(): PropertyFilter[];
  set propertyFilters(filters: PropertyFilter[] | null | undefined);
  /**
   * The quick search text. Supports two-way binding: `[(searchTerm)]="search"`, e.g. to restore a saved view.
   * A new value replaces the search text without emitting `searchTermChange`.
   */
  get searchTerm(): string;
  set searchTerm(searchTerm: string | null | undefined);
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  onFilterModeChange(): void;
  onFilterCriteriaChange(propertyFilters: PropertyFilter[]): void;
  onSearchInputKeyPress(event: KeyboardEvent): void;
  onSearchTermChanged(searchTerm: string): void;
  /** Combined mode: Clear all also clears the quick search text. */
  protected onClearAll(): void;
  private doSearch;
  static ɵfac: i0.ɵɵFactoryDeclaration<DataGridFiltersComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<DataGridFiltersComponent, "appfx-datagrid-filters", never, {
    "filterableProperties": {
      "alias": "filterableProperties";
      "required": false;
    };
    "presetFilters": {
      "alias": "presetFilters";
      "required": false;
    };
    "predefinedFilters": {
      "alias": "predefinedFilters";
      "required": false;
    };
    "semiPredefinedFilters": {
      "alias": "semiPredefinedFilters";
      "required": false;
    };
    "toggleFilters": {
      "alias": "toggleFilters";
      "required": false;
    };
    "filterMode": {
      "alias": "filterMode";
      "required": false;
    };
    "propertyFilters": {
      "alias": "propertyFilters";
      "required": false;
    };
    "searchTerm": {
      "alias": "searchTerm";
      "required": false;
    };
  }, {
    "searchTermChange": "searchTermChange";
    "propertyFiltersChange": "propertyFiltersChange";
  }, never, never, false, never>;
}
/**
 * User service that provides users for the datagrid users filter.
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: DatagridFiltersUserService, useClass: CustomUserService },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
export declare class DatagridFiltersUserService {
  getDomains(): Observable<string[]>;
  searchUsers(searchTerm: string, domain: string): Observable<string[]>;
  static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFiltersUserService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
/**
 * Datetime filter component collects filtering criteria for datetime based properties
 *
 */
declare class DateTimeFilterComponent implements OnInit, OnChanges {
  #private;
  private formBuilder;
  private datePipe;
  filterStrings: DatagridFiltersStrings;
  readonly timeSpans: TimeSpan[];
  dateTimeFilterForm: FormGroup;
  comparisonOperators: ComparisonOperator[];
  isEmptyPredicate: boolean;
  isCustomRangePredicate: boolean;
  isRelativePredicate: boolean;
  isTimeSpanPredicate: boolean;
  timePredicate: boolean;
  /** Preset ranges of the field with valid dates, for the range picker and the time-mode buttons. */
  rangeOptions: DateRangeOption[];
  includeSeconds: boolean;
  /**
   * In case the component is used for filter editing
   */
  propertyFilter?: PropertyFilter;
  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  private readonly dateFormat;
  private readonly injector;
  private startDateInput?;
  private dateInput?;
  private timeInput?;
  /** Flags a typed date that cannot be read in the current locale with the `pattern` error. */
  private readonly dateValidators;
  private readonly relativeOperators;
  private readonly singlePredicateOperators;
  private selectedFilterCriteria;
  private primaryPredicate;
  private secondaryPredicate;
  /** The edited filter's own state, or one derived from its criteria (e.g. a preset). Never the shared definition. */
  private storedState;
  constructor(formBuilder: FormBuilder, datePipe: DatePipe, filterStrings: DatagridFiltersStrings);
  get filterProperty(): DateTimePropertyDefinition;
  set filterProperty(filterProperty: DateTimePropertyDefinition);
  /**
   * The smallest time the inputs can express: a second with `includeSeconds`, otherwise a minute. An inclusive time
   * becomes exclusive by adding it, so "Before or equal to 10:30:15" ends before 10:30:16, not 10:31:15.
   */
  private get timeStepMs();
  ngOnInit(): void;
  ngOnChanges(): void;
  onInputKeyPress(event: KeyboardEvent): void;
  /** Fills From and To (dates and, with times, times) from a preset range. The user can still change them. */
  applyRangeOption(option: DateRangeOption): void;
  enableTimePredicate(): void;
  disableTimePredicate(): void;
  noDateTimeInputNeeded(): boolean;
  onApplyButtonClick(): void;
  onCancelButtonClick(): void;
  /** Filter by time: the clicked button is removed, so focus moves to the first time input. */
  protected onAddTimeClick(): void;
  /** Removing the time also removes the clicked button, so focus moves back to the date input. */
  protected onRemoveTimeClick(): void;
  private onOperatorChange;
  private addValidators;
  private removeValidators;
  private isRelativeDateTimeOperator;
  private isSinglePredicateOperator;
  private enableCustomRangePredicate;
  private disableCustomRangePredicate;
  private enableDateTimePredicates;
  private disableDateTimePredicates;
  private enableTimeSpanPredicate;
  private disableTimeSpanPredicate;
  private processSelectedOperator;
  private getRelativeDateTimePredicate;
  private getTimeSpanPredicate;
  private buildEqualsDateTimePredicates;
  private getSinglePredicate;
  private getFromDateTimePredicate;
  private getToDateTimePredicate;
  private getcurrentTimePredicate;
  private getPastDate;
  /**
   * The next calendar day at the same clock time, e.g. "2026-03-29T00:00:00" to "2026-03-30T00:00:00".
   * Not 24 hours later: on the days daylight saving starts or ends that would miss midnight by an hour.
   */
  private getNextDay;
  private getCustomDate;
  private adjustTimeZone;
  private getUtcTimeZoneOffset;
  /** Keeps the editor choices on the emitted filter, so the pill and a later edit read them from there. */
  private storeSelectedValues;
  private getStoredDateTimeValue;
  private getStoredDateTimeValueTo;
  private parseDateValue;
  /** The date picker's locale date string as yyyy-MM-dd. */
  private isoDate;
  /**
   * A time input value (`HH:mm`, or `HH:mm:ss` with seconds) for a preset range date. Exactly 00:00 means the whole
   * day: the start of the day for From, its last minute (or second) for To, since To is inclusive.
   */
  private timeInputValue;
  /**
   * With times the range picker is not used, so its start-before-end rule is applied here: From must not be later than
   * To (both inclusive, so equal is fine). Reported as the picker's `range` error on the To date.
   */
  private validateRangeOrder;
  /** A From or To field pair as a local date-time; null while the date or time is missing or invalid. */
  private localDateTime;
  private parseTimeValue;
  static ɵfac: i0.ɵɵFactoryDeclaration<DateTimeFilterComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<DateTimeFilterComponent, "appfx-datetime-filter", never, {
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
    "filterProperty": {
      "alias": "filterProperty";
      "required": false;
    };
  }, {
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, ["[filterField]", "[filterActions]"], false, never>;
}
/**
 * Enum filter component collects filtering criteria for enum based properties
 *
 */
declare class EnumFilterComponent implements OnInit, OnChanges {
  #private;
  private formBuilder;
  filterStrings: DatagridFiltersStrings;
  private cdr;
  /**
   * Property used for filtering
   */
  filterProperty: EnumPropertyDefinition;
  /**
   * In case the component is used for filter editing
   */
  propertyFilter?: PropertyFilter;
  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  enumFilterForm: FormGroup;
  optionsData: EnumPropertyData[];
  filteredOptions: {
    data: EnumPropertyData;
    index: number;
  }[];
  enumOperators: ComparisonOperator[];
  isProcessing: boolean;
  searchResultsLen: number;
  selectedCount: number;
  constructor(formBuilder: FormBuilder, filterStrings: DatagridFiltersStrings, cdr: ChangeDetectorRef);
  get additionalOperators(): boolean;
  get optionsFormArray(): FormArray;
  trackByFilteredOption(_index: number, item: {
    data: EnumPropertyData;
    index: number;
  }): number;
  trackByOperator(_index: number, operator: ComparisonOperator): ComparisonOperator;
  ngOnInit(): void;
  ngOnChanges(): void;
  loadMore(): void;
  onSelectAllChange(): void;
  onOptionChange(): void;
  clearSearch(): void;
  onApplyButtonClick(): void;
  onCancelButtonClick(): void;
  private runAsyncOperation;
  private initializeFilter;
  private performSearch;
  private updateSelectedCount;
  private selectedOptionsValidator;
  private updateData;
  private updateForm;
  private selectAll;
  private createEnumPropertyPredicate;
  static ɵfac: i0.ɵɵFactoryDeclaration<EnumFilterComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<EnumFilterComponent, "appfx-enum-filter", never, {
    "filterProperty": {
      "alias": "filterProperty";
      "required": false;
    };
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
  }, {
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, ["[filterField]", "[filterActions]"], false, never>;
}
/**
 * Shows the editor for a field's type: general (string and numeric), enum, date-time or users. Used by Add filter and
 * by the pills, so the choice of editor is in one place. Internal, not exported from the package.
 */
declare class FilterEditorComponent {
  /** The field to edit. */
  property: FilterablePropertyDefinition;
  /** The filter to edit; none for a new filter. */
  propertyFilter?: PropertyFilter;
  /** Rendered in the editor's field row, e.g. the field picker. */
  fieldTemplate?: TemplateRef<unknown>;
  /** Rendered next to the editor's Cancel and Apply, e.g. Remove filter. */
  actionsTemplate?: TemplateRef<unknown>;
  /** The applied filter, or nothing when the editor was cancelled. */
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  protected get generalProperty(): StringPropertyDefinition | NumericPropertyDefinition | undefined;
  protected get enumProperty(): EnumPropertyDefinition | undefined;
  protected get dateTimeProperty(): DateTimePropertyDefinition | undefined;
  protected get userProperty(): UserPropertyDefinition | undefined;
  static ɵfac: i0.ɵɵFactoryDeclaration<FilterEditorComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<FilterEditorComponent, "appfx-filter-editor", never, {
    "property": {
      "alias": "property";
      "required": false;
    };
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
    "fieldTemplate": {
      "alias": "fieldTemplate";
      "required": false;
    };
    "actionsTemplate": {
      "alias": "actionsTemplate";
      "required": false;
    };
  }, {
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, never, false, never>;
}
/**
 * Reusable form component.
 *
 */
export declare class FilterFormComponent {
  filterStrings: DatagridFiltersStrings;
  /**
   * Hosting view form status
   */
  valid: boolean;
  /**
   * Event emitter to tell hosting view that cancel button was clicked
   */
  cancel: EventEmitter<void>;
  /**
   * Event emitter to tell hosting view that apply button was clicked
   */
  apply: EventEmitter<void>;
  constructor(filterStrings: DatagridFiltersStrings);
  onApplyButtonClick(): void;
  onCancelButtonClick(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<FilterFormComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<FilterFormComponent, "appfx-filter-form", never, {
    "valid": {
      "alias": "valid";
      "required": false;
    };
  }, {
    "cancel": "cancel";
    "apply": "apply";
  }, never, ["*", "[filterActions]"], false, never>;
}
/**
 * General filter component collects filtering criteria for string and numeric based properties
 *
 */
declare class GeneralFilterComponent implements OnInit, OnChanges {
  private formBuilder;
  filterStrings: DatagridFiltersStrings;
  readonly id: string;
  readonly logicalOperators: LogicalOperator[];
  readonly isEmptyOperator: ComparisonOperator;
  generalFilterForm: FormGroup<GeneralFilterControls>;
  comparisonOperators: ComparisonOperator[];
  units: Unit[];
  isNumericUnitProperty: boolean;
  filterProperty: StringPropertyDefinition | NumericPropertyDefinition;
  /**
   * In case the component is used for filter editing
   */
  propertyFilter?: PropertyFilter;
  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  protected LogicalOperator: typeof LogicalOperator;
  private readonly destroyRef;
  private readonly injector;
  private operatorSelects;
  constructor(formBuilder: FormBuilder, filterStrings: DatagridFiltersStrings);
  get conditions(): FormArray<FormGroup<ConditionControls>>;
  get hasEmptyPredicate(): boolean;
  ngOnInit(): void;
  ngOnChanges(): void;
  onInputKeyPress(event: KeyboardEvent): void;
  addCondition(): void;
  removeCondition(index: number): void;
  onApplyButtonClick(): void;
  onCancelButtonClick(): void;
  private createCondition;
  private updateConditionValidators;
  private focusCondition;
  private initOperator;
  private initValidators;
  private isNumericUnitFilterProperty;
  private applicableUnits;
  private initUnit;
  private getSelectedUnit;
  private initValue;
  /**
   * The value in the field's unit. The value is the input's text (or a stored value); it is returned as it is when no
   * conversion is needed, and as a number when it is converted.
   */
  private convertValue;
  static ɵfac: i0.ɵɵFactoryDeclaration<GeneralFilterComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<GeneralFilterComponent, "appfx-general-filter", never, {
    "filterProperty": {
      "alias": "filterProperty";
      "required": false;
    };
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
  }, {
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, ["[filterField]", "[filterActions]"], false, never>;
}
declare class ManageFilterComponent implements OnInit, OnChanges {
  filterStrings: DatagridFiltersStrings;
  propertyFilter: PropertyFilter;
  filterProperty: FilterablePropertyDefinition;
  predefined: boolean;
  filterRemoved: EventEmitter<void>;
  readonly popoverId: string;
  readonly popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
  readonly popoverType = ClrPopoverType.DROPDOWN;
  managedProperty: FilterablePropertyDefinition;
  /**
   * Event emitter to tell hosting view that filtering criteria have changed
   */
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  primaryConditionDisplayText: string;
  secondaryConditionDisplayText: string;
  /**
   * The pill's accessible name: the visible pill text first (WCAG 2.5.3), then the other conditions in place of the
   * +N badge, then the edit hint, e.g. "VM Name: Contains web And Equals: db, Edit filter".
   */
  editFilterAriaLabel: string;
  /** The full filter shown in the pill's tooltip, e.g. "VM Name Contains: web And Equals: db". Visual only. */
  tooltipText: string;
  private readonly locale;
  private readonly popoverService;
  private pillButtonRef?;
  private readonly noDisplayValueOperators;
  constructor(filterStrings: DatagridFiltersStrings);
  /**
   * The pill button sits inside clr-tooltip, which provides its own popover service.
   * Register it as the filter popover origin here instead of using clrPopoverOrigin.
   */
  set pillButton(button: ElementRef<HTMLButtonElement>);
  get open(): boolean;
  get active(): boolean;
  get additionalConditions(): number;
  get pillText(): string;
  /** The CONDITION VALUE part of an active pill, e.g. "Contains linux". Empty for an inactive pill. */
  get pillCondition(): string;
  ngOnChanges(): void;
  ngOnInit(): void;
  togglePopover(event: MouseEvent): void;
  removeFilter(): void;
  /** Focuses the pill button, e.g. when the filter bar moves focus to the first pill. */
  focus(): void;
  onFilterCriteriaChange(propertyFilter: PropertyFilter): void;
  private close;
  private updateDisplayValues;
  /**
   * @param compact Pill format without the colon after the operator: "Contains linux" instead of "Contains: linux".
   */
  private displayFilterValue;
  /**
   * Date-time pill text, built from this filter only (its editor state, or what its criteria express),
   * never from the shared field definition. Dates use the locale's medium date format.
   */
  private displayDateTimeFilter;
  private isNoDisplayValueOperator;
  private formatDateTimeValue;
  private isEnumProperty;
  private isNumericProperty;
  private isDateTimeProperty;
  private isNumericUnitFilterProperty;
  private operatorDisplayName;
  static ɵfac: i0.ɵɵFactoryDeclaration<ManageFilterComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ManageFilterComponent, "appfx-manage-filter", never, {
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
    "filterProperty": {
      "alias": "filterProperty";
      "required": false;
    };
    "predefined": {
      "alias": "predefined";
      "required": false;
    };
  }, {
    "filterRemoved": "filterRemoved";
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, never, false, [{
    directive: typeof i1.ClrPopoverHostDirective;
    inputs: {};
    outputs: {};
  }]>;
}
declare enum ErrorType {
  DOMAIN = 0,
  USER_SEARCH = 1
}
declare class UsersFilterComponent implements OnInit, OnDestroy, OnChanges {
  #private;
  private fb;
  private cdr;
  filterStrings: DatagridFiltersStrings;
  private userService;
  filterProperty: UserPropertyDefinition;
  propertyFilter?: PropertyFilter;
  filterCriteriaChange: EventEmitter<PropertyFilter>;
  usersSelectionForm: FormGroup;
  isLoading: boolean;
  domains: string[];
  errorRetrievingDomains?: string;
  errorSearchingUsers?: string;
  allFetchedUsers: string[];
  visibleUsers: string[];
  selectedValues: Set<string>;
  constructor(fb: FormBuilder, cdr: ChangeDetectorRef, filterStrings: DatagridFiltersStrings, userService: DatagridFiltersUserService);
  get optionsFormArray(): FormArray;
  get hasMoreItems(): boolean;
  trackByOperator(_index: number, operator: ComparisonOperator): ComparisonOperator;
  trackByDomain(_index: number, domain: string): string;
  ngOnInit(): void;
  ngOnChanges(changes: SimpleChanges): void;
  ngOnDestroy(): void;
  onDomainChange(): void;
  fetchUsers(searchTerm: string): Observable<string[]>;
  loadMore(event: Event): void;
  onOptionChange(index: number): void;
  onSelectAllChange(): void;
  clearSearch(): void;
  handleError(error: any, errorType: ErrorType): Observable<string[]>;
  showLoading(): void;
  hideLoading(): void;
  onCancelButtonClick(): void;
  onApplyButtonClick(): void;
  private setupListeners;
  private loadDomains;
  private resetPagination;
  private createUsersSelectionForm;
  private initializeSelectionInEditMode;
  private rebuildCheckboxList;
  private updateSelectAllState;
  private selectionValidator;
  private createUserPropertyPredicate;
  static ɵfac: i0.ɵɵFactoryDeclaration<UsersFilterComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<UsersFilterComponent, "appfx-users-filter", never, {
    "filterProperty": {
      "alias": "filterProperty";
      "required": false;
    };
    "propertyFilter": {
      "alias": "propertyFilter";
      "required": false;
    };
  }, {
    "filterCriteriaChange": "filterCriteriaChange";
  }, never, ["[filterField]", "[filterActions]"], false, never>;
}
export declare class AppfxDatagridFiltersModule {
  constructor();
  static ɵfac: i0.ɵɵFactoryDeclaration<AppfxDatagridFiltersModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxDatagridFiltersModule, [typeof CompositeFiltersComponent, typeof DataGridFiltersComponent, typeof DateTimeFilterComponent, typeof EnumFilterComponent, typeof FilterEditorComponent, typeof FilterFormComponent, typeof GeneralFilterComponent, typeof ManageFilterComponent, typeof UsersFilterComponent], [typeof i10.A11yModule, typeof i11.ClrBadge, typeof i12.ClrLabel, typeof i13.ClrCheckboxModule, typeof i13.ClrComboboxModule, typeof i13.ClrDatepickerModule, typeof i14.ClrIcon, typeof i13.ClrInputModule, typeof i13.ClrRadioModule, typeof i13.ClrSelectModule, typeof i1.ClrPopoverModuleNext, typeof i16.ClrSpinnerModule, typeof i17.ClrTooltipModule, typeof i18.CommonModule, typeof i19.FormsModule, typeof i19.ReactiveFormsModule], [typeof CompositeFiltersComponent, typeof DataGridFiltersComponent, typeof FilterFormComponent]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<AppfxDatagridFiltersModule>;
}
export { AppfxDatagridFiltersModule as DatagridFiltersModule };