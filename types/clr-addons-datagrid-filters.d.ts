import * as i0 from '@angular/core';
import { OnInit, EventEmitter, ChangeDetectorRef, OnDestroy, AfterViewInit, OnChanges, Renderer2, ElementRef, PipeTransform, SimpleChanges } from '@angular/core';
import * as i17 from '@angular/common';
import { DatePipe } from '@angular/common';
import * as i18 from '@angular/forms';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import * as i12 from '@angular/cdk/a11y';
import * as i13 from '@clr/angular/forms';
import * as i14 from '@clr/angular/icon';
import * as i15 from '@clr/angular/popover/signpost';
import * as i16 from '@clr/angular/progress/spinner';

declare enum ComparisonOperator {
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
declare enum LogicalOperator {
    And = 0,
    Or = 1
}
declare enum FilterMode {
    Quick = 0,
    Advanced = 1,
    AdvancedOnly = 2
}
declare enum PropertyType {
    String = 0,
    Enum = 1,
    Numeric = 2,
    DateTime = 3,
    User = 4
}
declare enum Unit {
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
declare enum TimeSpan {
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
declare class DatagridFiltersStrings {
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
     * Add second condition button label.
     */
    readonly addCondition: string;
    /**
     * Remove second condition button aria label.
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
    /**
     * Applied filters text.
     */
    readonly appliedText: string;
    readonly editFilterText: string;
    readonly removeFilterText: string;
    readonly hideButtonLabel: string;
    readonly hideButtonAriaLabel: string;
    readonly showButtonLabel: string;
    readonly filtersText: string;
    readonly filterText: string;
    readonly clearAllButtonLabel: string;
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
     * Date input placeholder.
     */
    readonly dateFormat: string;
    /**
     * Time input placeholder.
     */
    readonly timeFormat: string;
    /**
     * Date input validator error message
     */
    readonly dateValidatorMessage: string;
    /**
     * Time input validator error message
     */
    readonly timeValidatorMessage: string;
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
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridFiltersStrings>;
}

/**
 * Defines a property that can be used to filter data in a datagrid.
 * Filterable properties are usually a subset of the datagrid columns.
 */
declare abstract class FilterablePropertyDefinition {
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
declare class StringPropertyDefinition extends FilterablePropertyDefinition {
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
declare class EnumPropertyDefinition extends FilterablePropertyDefinition {
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
declare class NumericPropertyDefinition extends FilterablePropertyDefinition {
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
declare class UserPropertyDefinition extends FilterablePropertyDefinition {
    constructor(displayName: string, property: string);
}
declare class DateTimePropertyDefinition extends FilterablePropertyDefinition {
    /**
     * Flag indicating whether to include seconds in the time selector for the DateTime filter.
     */
    includeSeconds: boolean;
    private readonly defaultOperators;
    constructor(displayName: string, property: string, operators?: ComparisonOperator[], includeSeconds?: boolean);
    getOperators(): ComparisonOperator[];
}
declare class PropertyFilter {
    /**
     *  Filter criteria
     */
    criteria: PropertyPredicate[];
    /**
     *  Logical operator. Supported values are AND/OR
     */
    operator: LogicalOperator;
}
declare class PropertyPredicate {
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

/**
 * Composite filters component renders different filters based on the type of
 * the corresponding filterable property, e.g., string, enum, number, etc.
 */
declare class CompositeFiltersComponent implements OnInit {
    filterStrings: DatagridFiltersStrings;
    private cdr;
    filterableProperties: FilterablePropertyDefinition[];
    presetFilters: PropertyFilter[];
    /**
     * Event emitter to tell hosting view that the filtering conditions have changed
     */
    propertyFiltersChange: EventEmitter<PropertyFilter[]>;
    readonly stringPropertyType: PropertyType;
    readonly enumPropertyType: PropertyType;
    readonly numericPropertyType: PropertyType;
    readonly dateTimePropertyType: PropertyType;
    readonly userPropertyType: PropertyType;
    signPostOpened: boolean;
    selectedFilterableProperty: FilterablePropertyDefinition;
    propertyType: PropertyType;
    stringProperty: StringPropertyDefinition;
    enumProperty: EnumPropertyDefinition;
    numericProperty: NumericPropertyDefinition;
    dateTimeProperty: DateTimePropertyDefinition;
    userProperty: UserPropertyDefinition;
    propertyFilters: PropertyFilter[];
    collapsedFilters: boolean;
    showHideFiltersArrowDir: string;
    showHideFiltersLabel: string;
    showHideFiltersAriaLabel: string;
    constructor(filterStrings: DatagridFiltersStrings, cdr: ChangeDetectorRef);
    ngOnInit(): void;
    onPropertyChange(): void;
    onFilterCriteriaChange(propertyFilter: PropertyFilter): void;
    /**
     * Returns a list properties for which there is an active filter
     */
    activeFilters(): FilterablePropertyDefinition[];
    clearAllFilters(): void;
    showHideAllFilters(): void;
    /**
     * Active filters are not displayed in the new filters list.
     * We want to preselect the first displayed property
     */
    private preselectFirstProperty;
    private updateShowHideLabel;
    private isStringProperty;
    private isEnumProperty;
    private isNumericProperty;
    private isDateTimeProperty;
    private isUserProperty;
    private castStringProperty;
    private castEnumProperty;
    private castNumericProperty;
    private castDateTimeProperty;
    private castUserProperty;
    static ɵfac: i0.ɵɵFactoryDeclaration<CompositeFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CompositeFiltersComponent, "appfx-composite-filter", never, { "filterableProperties": { "alias": "filterableProperties"; "required": false; }; "presetFilters": { "alias": "presetFilters"; "required": false; }; }, { "propertyFiltersChange": "propertyFiltersChange"; }, never, never, false, never>;
}

/**
 * Component provides the ability to choose from quick filter (search)
 * and advanced filter (composite filters).
 */
declare class DataGridFiltersComponent implements OnDestroy, AfterViewInit {
    filterStrings: DatagridFiltersStrings;
    readonly quickMode: FilterMode;
    readonly advancedMode: FilterMode;
    readonly advancedOnlyMode: FilterMode;
    mode: FilterMode;
    selectedFilterMode: FilterMode;
    searchTerm: string;
    /**
     * Array of filterable properties
     */
    filterableProperties: FilterablePropertyDefinition[];
    /**
     * Array of pre-selected filters
     */
    presetFilters: PropertyFilter[];
    /**
     * Event emitter to tell hosting view that search term, used for filtering
     * has changed.
     */
    searchTermChange: EventEmitter<string>;
    propertyFiltersChange: EventEmitter<PropertyFilter[]>;
    private lastSearchTerm;
    private searchTermDebouncer;
    private unsubscribeSubject;
    private appliedFiltersCount;
    constructor(filterStrings: DatagridFiltersStrings);
    /**
     * Quick, Advanced or AdvancedOnly. Default Quick.
     */
    set filterMode(filterMode: FilterMode);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    onFilterModeChange(): void;
    onFilterCriteriaChange(propertyFilters: PropertyFilter[]): void;
    onSearchInputKeyPress(event: KeyboardEvent): void;
    onSearchTermChanged(searchTerm: string): void;
    private doSearch;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataGridFiltersComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DataGridFiltersComponent, "appfx-datagrid-filters", never, { "filterableProperties": { "alias": "filterableProperties"; "required": false; }; "presetFilters": { "alias": "presetFilters"; "required": false; }; "filterMode": { "alias": "filterMode"; "required": false; }; }, { "searchTermChange": "searchTermChange"; "propertyFiltersChange": "propertyFiltersChange"; }, never, never, false, never>;
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
declare class DatagridFiltersUserService {
    getDomains(): Observable<string[]>;
    searchUsers(searchTerm: string, domain: string): Observable<string[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DatagridFiltersUserService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DatagridFiltersUserService>;
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
    includeSeconds: boolean;
    /**
     * In case the component is used for filter editing
     */
    propertyFilter: PropertyFilter;
    /**
     * Event emitter to tell hosting view that filtering criteria have changed
     */
    filterCriteriaChange: EventEmitter<PropertyFilter>;
    private readonly relativeOperators;
    private readonly singlePredicateOperators;
    private selectedFilterCriteria;
    private primaryPredicate;
    private secondaryPredicate;
    constructor(formBuilder: FormBuilder, datePipe: DatePipe, filterStrings: DatagridFiltersStrings);
    get filterProperty(): DateTimePropertyDefinition;
    set filterProperty(filterProperty: DateTimePropertyDefinition);
    ngOnInit(): void;
    ngOnChanges(): void;
    onInputKeyPress(event: KeyboardEvent): void;
    enableTimePredicate(): void;
    disableTimePredicate(): void;
    noDateTimeInputNeeded(): boolean;
    onApplyButtonClick(): void;
    onCancelButtonClick(): void;
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
    private getCustomDate;
    private adjustTimeZone;
    private getUtcTimeZoneOffset;
    private storeSelectedValues;
    private getStoredDateTimeValue;
    private getStoredDateTimeValueTo;
    private parseDateValue;
    private parseTimeValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateTimeFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateTimeFilterComponent, "appfx-datetime-filter", never, { "propertyFilter": { "alias": "propertyFilter"; "required": false; }; "filterProperty": { "alias": "filterProperty"; "required": false; }; }, { "filterCriteriaChange": "filterCriteriaChange"; }, never, never, false, never>;
}

/**
 * Directive which renders a clickable "X" on the right side of a Clarity label badge.
 * A "close" event is emitted when the "X" is clicked.
 * The directive is needed in order to be able to remove filtering criteria,
 * which are displayed in Clarity label badges.
 */
declare class DismissableDirective implements AfterViewInit {
    private renderer;
    private elRef;
    dismissAriaLabel: string;
    dismiss: EventEmitter<any>;
    constructor(renderer: Renderer2, elRef: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DismissableDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DismissableDirective, "[dismissable]", never, { "dismissAriaLabel": { "alias": "dismissAriaLabel"; "required": false; }; }, { "dismiss": "dismiss"; }, never, never, false, never>;
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
    propertyFilter: PropertyFilter;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<EnumFilterComponent, "appfx-enum-filter", never, { "filterProperty": { "alias": "filterProperty"; "required": false; }; "propertyFilter": { "alias": "propertyFilter"; "required": false; }; }, { "filterCriteriaChange": "filterCriteriaChange"; }, never, never, false, never>;
}

/**
 * Reusable form component.
 *
 */
declare class FilterFormComponent {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<FilterFormComponent, "appfx-filter-form", never, { "valid": { "alias": "valid"; "required": false; }; }, { "cancel": "cancel"; "apply": "apply"; }, never, ["*"], false, never>;
}

declare class FilterPopoverRepositionDirective implements AfterViewInit {
    private elementRef;
    private readonly menuMinTranslateX;
    private readonly filterContainerSelector;
    constructor(elementRef: ElementRef);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilterPopoverRepositionDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FilterPopoverRepositionDirective, "[filterPopoverReposition]", never, {}, {}, never, never, false, never>;
}

/**
 * General filter component collects filtering criteria for string and numeric based properties
 *
 */
declare class GeneralFilterComponent implements OnInit, OnChanges {
    #private;
    private formBuilder;
    filterStrings: DatagridFiltersStrings;
    readonly logicalOperators: LogicalOperator[];
    readonly isEmptyOperator: ComparisonOperator;
    generalFilterForm: FormGroup;
    comparisonOperators: ComparisonOperator[];
    units: Unit[];
    isNumericUnitProperty: boolean;
    additionalPredicate: boolean;
    isEmptyPrimaryPredicate: boolean;
    isEmptySecondaryPredicate: boolean;
    /**
     * In case the component is used for filter editing
     */
    propertyFilter: PropertyFilter;
    /**
     * Event emitter to tell hosting view that filtering criteria have changed
     */
    filterCriteriaChange: EventEmitter<PropertyFilter>;
    protected LogicalOperator: typeof LogicalOperator;
    private selectedFilterCriteria;
    private primaryPredicate;
    private secondaryPredicate;
    constructor(formBuilder: FormBuilder, filterStrings: DatagridFiltersStrings);
    get filterProperty(): StringPropertyDefinition | NumericPropertyDefinition;
    set filterProperty(filterProperty: StringPropertyDefinition | NumericPropertyDefinition);
    ngOnInit(): void;
    ngOnChanges(): void;
    onInputKeyPress(event: KeyboardEvent): void;
    enableSecondaryPredicate(): void;
    disableSecondaryPredicate(): void;
    onApplyButtonClick(): void;
    onCancelButtonClick(): void;
    private addValidators;
    private removeValidators;
    private selectLogicalOperator;
    private initOperator;
    private initValidators;
    private isNumericUnitFilterProperty;
    private applicableUnits;
    private initUnit;
    private getSelectedUnit;
    private initValue;
    private convertValue;
    static ɵfac: i0.ɵɵFactoryDeclaration<GeneralFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GeneralFilterComponent, "appfx-general-filter", never, { "propertyFilter": { "alias": "propertyFilter"; "required": false; }; "filterProperty": { "alias": "filterProperty"; "required": false; }; }, { "filterCriteriaChange": "filterCriteriaChange"; }, never, never, false, never>;
}

declare class ManageFilterComponent implements OnInit {
    filterStrings: DatagridFiltersStrings;
    propertyFilter: PropertyFilter;
    managedProperty: FilterablePropertyDefinition;
    /**
     * Event emitter to tell hosting view that filtering criteria have changed
     */
    filterCriteriaChange: EventEmitter<PropertyFilter>;
    readonly stringPropertyType: PropertyType;
    readonly enumPropertyType: PropertyType;
    readonly numericPropertyType: PropertyType;
    readonly dateTimePropertyType: PropertyType;
    readonly userPropertyType: PropertyType;
    managedPropertyType: PropertyType;
    stringProperty: StringPropertyDefinition;
    numericProperty: NumericPropertyDefinition;
    enumProperty: EnumPropertyDefinition;
    dateTimeProperty: DateTimePropertyDefinition;
    userProperty: UserPropertyDefinition;
    openPrimaryConditionSignPost: boolean;
    openSecondaryConditionSignPost: boolean;
    primaryConditionDisplayText: string;
    secondaryConditionDisplayText: string;
    editFilterAriaLabel: string;
    private readonly noDisplayValueOperators;
    constructor(filterStrings: DatagridFiltersStrings);
    ngOnInit(): void;
    onEditFilterKeyPress(event: KeyboardEvent, index: number): void;
    removeFilter(index: number): void;
    onFilterCriteriaChange(propertyFilter: PropertyFilter): void;
    private updateDisplayValues;
    private displayFilterValue;
    private displayDateTimeFilter;
    private isNoDisplayValueOperator;
    private formatDateTimeValue;
    private isStringProperty;
    private isEnumProperty;
    private isNumericProperty;
    private isDateTimeProperty;
    private isUserProperty;
    private isNumericUnitFilterProperty;
    private castStringProperty;
    private castEnumProperty;
    private castNumericProperty;
    private castDateTimeProperty;
    private castUserProperty;
    private operatorDisplayName;
    static ɵfac: i0.ɵɵFactoryDeclaration<ManageFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ManageFilterComponent, "appfx-manage-filter", never, { "propertyFilter": { "alias": "propertyFilter"; "required": false; }; }, { "filterCriteriaChange": "filterCriteriaChange"; }, never, never, false, never>;
}

/**
 * Pipe used to limit available filter options in a select container.
 * This is needed in order to prevent applying the same filter more than once
 */
declare class SkipFiltersPipe implements PipeTransform {
    transform(items: FilterablePropertyDefinition[], propertyDefinitions?: FilterablePropertyDefinition[]): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<SkipFiltersPipe, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<SkipFiltersPipe, "skipFilter", false>;
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
    propertyFilter: PropertyFilter;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<UsersFilterComponent, "appfx-users-filter", never, { "filterProperty": { "alias": "filterProperty"; "required": false; }; "propertyFilter": { "alias": "propertyFilter"; "required": false; }; }, { "filterCriteriaChange": "filterCriteriaChange"; }, never, never, false, never>;
}

declare class AppfxDatagridFiltersModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<AppfxDatagridFiltersModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxDatagridFiltersModule, [typeof CompositeFiltersComponent, typeof DataGridFiltersComponent, typeof DateTimeFilterComponent, typeof DismissableDirective, typeof EnumFilterComponent, typeof FilterFormComponent, typeof FilterPopoverRepositionDirective, typeof GeneralFilterComponent, typeof ManageFilterComponent, typeof SkipFiltersPipe, typeof UsersFilterComponent], [typeof i12.A11yModule, typeof i13.ClrCheckboxModule, typeof i14.ClrIcon, typeof i13.ClrInputModule, typeof i13.ClrRadioModule, typeof i13.ClrSelectModule, typeof i15.ClrSignpostModule, typeof i16.ClrSpinnerModule, typeof i17.CommonModule, typeof i18.FormsModule, typeof i18.ReactiveFormsModule], [typeof CompositeFiltersComponent, typeof DataGridFiltersComponent, typeof FilterFormComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AppfxDatagridFiltersModule>;
}

export { AppfxDatagridFiltersModule, ComparisonOperator, CompositeFiltersComponent, DataGridFiltersComponent, AppfxDatagridFiltersModule as DatagridFiltersModule, DatagridFiltersStrings, DatagridFiltersUserService, DateTimePropertyDefinition, EnumPropertyDefinition, FilterFormComponent, FilterMode, FilterablePropertyDefinition, LogicalOperator, NumericPropertyDefinition, PropertyFilter, PropertyPredicate, PropertyType, StringPropertyDefinition, Unit, UserPropertyDefinition };
