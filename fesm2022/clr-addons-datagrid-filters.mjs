import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Output, Input, ChangeDetectionStrategy, Component, Directive, Pipe, Optional, SkipSelf, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/forms/common';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, filterGridIcon, plusIcon, windowCloseIcon, ClrIcon } from '@clr/angular/icon';
import * as i4 from '@clr/angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular/forms';
import * as i4$1 from '@clr/angular/popover/signpost';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import * as i5$1 from '@clr/angular/popover/common';
import * as i1 from '@angular/forms';
import { Validators, FormControl, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as i2$1 from '@angular/common';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ComparisonOperator;
(function (ComparisonOperator) {
    ComparisonOperator[ComparisonOperator["Contains"] = 0] = "Contains";
    ComparisonOperator[ComparisonOperator["DoesNotContain"] = 1] = "DoesNotContain";
    ComparisonOperator[ComparisonOperator["Equals"] = 2] = "Equals";
    ComparisonOperator[ComparisonOperator["DoesNotEqual"] = 3] = "DoesNotEqual";
    ComparisonOperator[ComparisonOperator["StartsWith"] = 4] = "StartsWith";
    ComparisonOperator[ComparisonOperator["EndsWith"] = 5] = "EndsWith";
    ComparisonOperator[ComparisonOperator["IsEmpty"] = 6] = "IsEmpty";
    ComparisonOperator[ComparisonOperator["LessThan"] = 7] = "LessThan";
    ComparisonOperator[ComparisonOperator["LessThanOrEqualTo"] = 8] = "LessThanOrEqualTo";
    ComparisonOperator[ComparisonOperator["GreaterThan"] = 9] = "GreaterThan";
    ComparisonOperator[ComparisonOperator["GreaterThanOrEqualTo"] = 10] = "GreaterThanOrEqualTo";
    ComparisonOperator[ComparisonOperator["Before"] = 11] = "Before";
    ComparisonOperator[ComparisonOperator["BeforeOrEqualTo"] = 12] = "BeforeOrEqualTo";
    ComparisonOperator[ComparisonOperator["After"] = 13] = "After";
    ComparisonOperator[ComparisonOperator["AfterOrEqualTo"] = 14] = "AfterOrEqualTo";
    ComparisonOperator[ComparisonOperator["CustomRange"] = 15] = "CustomRange";
    ComparisonOperator[ComparisonOperator["LastDay"] = 16] = "LastDay";
    ComparisonOperator[ComparisonOperator["LastWeek"] = 17] = "LastWeek";
    ComparisonOperator[ComparisonOperator["LastMonth"] = 18] = "LastMonth";
    ComparisonOperator[ComparisonOperator["LastYear"] = 19] = "LastYear";
    ComparisonOperator[ComparisonOperator["TimeSpan"] = 20] = "TimeSpan";
})(ComparisonOperator || (ComparisonOperator = {}));
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator[LogicalOperator["And"] = 0] = "And";
    LogicalOperator[LogicalOperator["Or"] = 1] = "Or";
})(LogicalOperator || (LogicalOperator = {}));
var FilterMode;
(function (FilterMode) {
    FilterMode[FilterMode["Quick"] = 0] = "Quick";
    FilterMode[FilterMode["Advanced"] = 1] = "Advanced";
    FilterMode[FilterMode["AdvancedOnly"] = 2] = "AdvancedOnly";
})(FilterMode || (FilterMode = {}));
var PropertyType;
(function (PropertyType) {
    PropertyType[PropertyType["String"] = 0] = "String";
    PropertyType[PropertyType["Enum"] = 1] = "Enum";
    PropertyType[PropertyType["Numeric"] = 2] = "Numeric";
    PropertyType[PropertyType["DateTime"] = 3] = "DateTime";
})(PropertyType || (PropertyType = {}));
var Unit;
(function (Unit) {
    Unit[Unit["Byte"] = 0] = "Byte";
    Unit[Unit["KB"] = 1] = "KB";
    Unit[Unit["MB"] = 2] = "MB";
    Unit[Unit["GB"] = 3] = "GB";
    Unit[Unit["TB"] = 4] = "TB";
    Unit[Unit["HZ"] = 5] = "HZ";
    Unit[Unit["KHZ"] = 6] = "KHZ";
    Unit[Unit["MHZ"] = 7] = "MHZ";
    Unit[Unit["GHZ"] = 8] = "GHZ";
    Unit[Unit["BytePS"] = 9] = "BytePS";
    Unit[Unit["KBytePS"] = 10] = "KBytePS";
    Unit[Unit["MBytePS"] = 11] = "MBytePS";
    Unit[Unit["GBytePS"] = 12] = "GBytePS";
    Unit[Unit["BitPS"] = 13] = "BitPS";
    Unit[Unit["KBitPS"] = 14] = "KBitPS";
    Unit[Unit["MBitPS"] = 15] = "MBitPS";
    Unit[Unit["GBitPS"] = 16] = "GBitPS";
})(Unit || (Unit = {}));
var TimeSpan;
(function (TimeSpan) {
    TimeSpan[TimeSpan["Minutes"] = 0] = "Minutes";
    TimeSpan[TimeSpan["Hours"] = 1] = "Hours";
    TimeSpan[TimeSpan["Days"] = 2] = "Days";
    TimeSpan[TimeSpan["Weeks"] = 3] = "Weeks";
    TimeSpan[TimeSpan["Months"] = 4] = "Months";
    TimeSpan[TimeSpan["Years"] = 5] = "Years";
})(TimeSpan || (TimeSpan = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
class DatagridFiltersStrings {
    constructor() {
        /**
         * Quick filter label.
         */
        this.quickFilter = 'Quick Filter';
        /**
         * Advanced filter label.
         */
        this.advancedFilter = 'Advanced Filter';
        /**
         * Input placeholder.
         */
        this.enterValue = 'Enter value';
        /**
         * Required validator error message
         */
        this.requiredValidatorMessage = 'This field is required';
        /**
         * Numeric input validator error message
         */
        this.integerValidatorMessage = 'Integer value required';
        /**
         * Add new filter button label.
         */
        this.addNew = 'Add new';
        /**
         * Add new filter button aria label.
         */
        this.addNewAriaLabel = 'Add new filter';
        /**
         * Select filter label.
         */
        this.filterLabel = 'Filter';
        /**
         * Select operator label.
         */
        this.operatorLabel = 'Operator';
        /**
         * Comparison operator display names.
         */
        this.operator = {
            after: 'After',
            afterOrEqualTo: 'After or equal to',
            before: 'Before',
            beforeOrEqualTo: 'Before or equal to',
            contains: 'Contains',
            customRange: 'Custom range',
            doesNotContain: 'Does not contain',
            doesNotEqual: 'Does not equal',
            endsWith: 'Ends with',
            equals: 'Equals',
            greaterThan: 'Greater than',
            greaterThanOrEqualTo: 'Greater than or equal to',
            isEmpty: 'Is empty',
            lastDay: 'Last day',
            lastWeek: 'Last week',
            lastMonth: 'Last month',
            lastYear: 'Last year',
            lessThan: 'Less than',
            lessThanOrEqualTo: 'Less than or equal to',
            startsWith: 'Starts with',
            timeSpan: 'Time span',
        };
        /**
         * Select unit aria label.
         */
        this.unitAriaLabel = 'Unit';
        /**
         * Add second condition button label.
         */
        this.addCondition = 'Add condition';
        /**
         * Remove second condition button aria label.
         */
        this.removeConditionAriaLabel = 'Remove second condition';
        /**
         * Conjoiners.
         */
        this.logicalOperator = {
            and: 'And',
            or: 'Or',
        };
        /**
         * Cancel button label.
         */
        this.cancel = 'Cancel';
        /**
         * Apply button label.
         */
        this.apply = 'Apply';
        /**
         * Select values label.
         */
        this.valueLabel = 'Value';
        /**
         * Select all option label.
         */
        this.selectAll = 'Select all';
        /**
         * Applied filters text.
         */
        this.appliedText = 'applied';
        this.editFilterText = 'Edit filter';
        this.removeFilterText = 'Remove filter';
        this.hideButtonLabel = 'Hide';
        this.hideButtonAriaLabel = 'Hide filters';
        this.showButtonLabel = 'Show';
        this.filtersText = 'filters';
        this.filterText = 'filter';
        this.clearAllButtonLabel = 'Clear all';
        this.clearAllButtonAriaLabel = 'Clear all filters';
        /**
         * Add time condition button label.
         */
        this.addTimeFilter = 'Filter by time';
        /**
         * Date input placeholder.
         */
        this.dateFormat = 'YYYY-MM-DD';
        /**
         * Time input placeholder.
         */
        this.timeFormat = 'HH:mm';
        /**
         * Date input validator error message
         */
        this.dateValidatorMessage = 'Invalid date format';
        /**
         * Time input validator error message
         */
        this.timeValidatorMessage = 'Invalid time format';
        this.fromLabel = 'From';
        this.toLabel = 'To';
        /**
         * Remove time filter button aria label.
         */
        this.removeTimeFilterAriaLabel = 'Remove time filter';
        this.timeSpan = {
            minutes: 'Minutes',
            hours: 'Hours',
            days: 'Days',
            weeks: 'Weeks',
            months: 'Months',
            years: 'Years',
        };
        /**
         * Time span aria label.
         */
        this.timeSpanAriaLabel = 'Time span';
        this.timeSpanInputLabel = 'In the last';
        this.unit = {
            byte: 'B',
            kb: 'KB',
            mb: 'MB',
            gb: 'GB',
            tb: 'TB',
            hz: 'Hz',
            khz: 'KHz',
            mhz: 'MHz',
            ghz: 'GHz',
            byteps: 'B/s',
            kbyteps: 'KB/s',
            mbyteps: 'MB/s',
            gbyteps: 'GB/s',
            bitps: 'Bit/s',
            kbitps: 'Kbit/s',
            mbitps: 'Mbit/s',
            gbitps: 'Gbit/s',
        };
    }
    getOperatorDisplayName(operator) {
        switch (operator) {
            case ComparisonOperator.After:
                return this.operator.after;
            case ComparisonOperator.AfterOrEqualTo:
                return this.operator.afterOrEqualTo;
            case ComparisonOperator.Before:
                return this.operator.before;
            case ComparisonOperator.BeforeOrEqualTo:
                return this.operator.beforeOrEqualTo;
            case ComparisonOperator.Contains:
                return this.operator.contains;
            case ComparisonOperator.CustomRange:
                return this.operator.customRange;
            case ComparisonOperator.DoesNotContain:
                return this.operator.doesNotContain;
            case ComparisonOperator.DoesNotEqual:
                return this.operator.doesNotEqual;
            case ComparisonOperator.Equals:
                return this.operator.equals;
            case ComparisonOperator.EndsWith:
                return this.operator.endsWith;
            case ComparisonOperator.GreaterThan:
                return this.operator.greaterThan;
            case ComparisonOperator.GreaterThanOrEqualTo:
                return this.operator.greaterThanOrEqualTo;
            case ComparisonOperator.IsEmpty:
                return this.operator.isEmpty;
            case ComparisonOperator.LastDay:
                return this.operator.lastDay;
            case ComparisonOperator.LastWeek:
                return this.operator.lastWeek;
            case ComparisonOperator.LastMonth:
                return this.operator.lastMonth;
            case ComparisonOperator.LastYear:
                return this.operator.lastYear;
            case ComparisonOperator.LessThan:
                return this.operator.lessThan;
            case ComparisonOperator.LessThanOrEqualTo:
                return this.operator.lessThanOrEqualTo;
            case ComparisonOperator.StartsWith:
                return this.operator.startsWith;
            case ComparisonOperator.TimeSpan:
                return this.operator.timeSpan;
            default:
                return 'Unknown operator!';
        }
    }
    getConjoinerDisplayName(conjoiner) {
        switch (conjoiner) {
            case LogicalOperator.And:
                return this.logicalOperator.and;
            case LogicalOperator.Or:
                return this.logicalOperator.or;
            default:
                return 'Unknown logical operator!';
        }
    }
    getTimeSpanDisplayName(timeSpan) {
        switch (timeSpan) {
            case TimeSpan.Minutes:
                return this.timeSpan.minutes;
            case TimeSpan.Hours:
                return this.timeSpan.hours;
            case TimeSpan.Days:
                return this.timeSpan.days;
            case TimeSpan.Weeks:
                return this.timeSpan.weeks;
            case TimeSpan.Months:
                return this.timeSpan.months;
            case TimeSpan.Years:
                return this.timeSpan.years;
            default:
                return 'Unknown time span!';
        }
    }
    getUnitDisplayName(unit) {
        switch (unit) {
            case Unit.Byte:
                return this.unit.byte;
            case Unit.KB:
                return this.unit.kb;
            case Unit.MB:
                return this.unit.mb;
            case Unit.GB:
                return this.unit.gb;
            case Unit.TB:
                return this.unit.tb;
            case Unit.HZ:
                return this.unit.hz;
            case Unit.KHZ:
                return this.unit.khz;
            case Unit.MHZ:
                return this.unit.mhz;
            case Unit.GHZ:
                return this.unit.ghz;
            case Unit.BytePS:
                return this.unit.byteps;
            case Unit.KBytePS:
                return this.unit.kbyteps;
            case Unit.MBytePS:
                return this.unit.mbyteps;
            case Unit.GBytePS:
                return this.unit.gbyteps;
            case Unit.BitPS:
                return this.unit.bitps;
            case Unit.KBitPS:
                return this.unit.kbitps;
            case Unit.MBitPS:
                return this.unit.mbitps;
            case Unit.GBitPS:
                return this.unit.gbitps;
            default:
                return 'Unknown unit!';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFiltersStrings, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFiltersStrings }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DatagridFiltersStrings, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/* eslint-disable @typescript-eslint/parameter-properties */
/**
 * Defines a property that can be used to filter data in a datagrid.
 * Filterable properties are usually a subset of the datagrid columns.
 */
class FilterablePropertyDefinition {
    constructor(displayName, property, operators) {
        this.displayName = displayName;
        this.property = property;
        if (operators) {
            this.supportedOperators = operators;
        }
    }
}
class StringPropertyDefinition extends FilterablePropertyDefinition {
    constructor(displayName, property, operators, singleCondition, logicalOperator) {
        super(displayName, property, operators);
        /**
         * Indicates that the property can be used with single condition only.
         */
        this.singleCondition = false;
        this.defaultOperators = [
            ComparisonOperator.Equals,
            ComparisonOperator.DoesNotEqual,
            ComparisonOperator.Contains,
            ComparisonOperator.DoesNotContain,
            ComparisonOperator.StartsWith,
            ComparisonOperator.EndsWith,
            ComparisonOperator.IsEmpty,
        ];
        if (singleCondition) {
            this.singleCondition = singleCondition;
        }
        this.logicalOperator = logicalOperator;
    }
    getOperators() {
        return this.supportedOperators || this.defaultOperators;
    }
}
class EnumPropertyDefinition extends FilterablePropertyDefinition {
    constructor(displayName, property, values, singleSelect) {
        super(displayName, property);
        /**
         * Indicates that the property should be used for single select filtering
         */
        this.singleSelect = false;
        this.values = values;
        if (singleSelect) {
            this.singleSelect = singleSelect;
        }
    }
}
class NumericPropertyDefinition extends FilterablePropertyDefinition {
    constructor(displayName, property, operators, unit, singleCondition, logicalOperator) {
        super(displayName, property, operators);
        /**
         * Indicates that the property can be used with single condition only.
         */
        this.singleCondition = false;
        this.defaultOperators = [
            ComparisonOperator.Equals,
            ComparisonOperator.DoesNotEqual,
            ComparisonOperator.LessThan,
            ComparisonOperator.LessThanOrEqualTo,
            ComparisonOperator.GreaterThan,
            ComparisonOperator.GreaterThanOrEqualTo,
            ComparisonOperator.IsEmpty,
        ];
        // Check for null and undefined
        if (unit !== null && unit !== undefined) {
            this.unit = unit;
        }
        if (singleCondition) {
            this.singleCondition = singleCondition;
        }
        this.logicalOperator = logicalOperator;
    }
    getOperators() {
        return this.supportedOperators || this.defaultOperators;
    }
}
class DateTimePropertyDefinition extends FilterablePropertyDefinition {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(displayName, property, operators) {
        super(displayName, property, operators);
        this.defaultOperators = [
            ComparisonOperator.Equals,
            ComparisonOperator.Before,
            ComparisonOperator.BeforeOrEqualTo,
            ComparisonOperator.After,
            ComparisonOperator.AfterOrEqualTo,
            ComparisonOperator.CustomRange,
            ComparisonOperator.IsEmpty,
            ComparisonOperator.LastDay,
            ComparisonOperator.LastWeek,
            ComparisonOperator.LastMonth,
            ComparisonOperator.LastYear,
            ComparisonOperator.TimeSpan,
        ];
    }
    getOperators() {
        return this.supportedOperators || this.defaultOperators;
    }
}
class PropertyFilter {
}
class PropertyPredicate {
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Reusable form component.
 *
 */
class FilterFormComponent {
    constructor(filterStrings) {
        this.filterStrings = filterStrings;
        /**
         * Event emitter to tell hosting view that cancel button was clicked
         */
        this.cancel = new EventEmitter();
        /**
         * Event emitter to tell hosting view that apply button was clicked
         */
        this.apply = new EventEmitter();
    }
    onApplyButtonClick() {
        this.apply.emit();
    }
    onCancelButtonClick() {
        this.cancel.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FilterFormComponent, deps: [{ token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: FilterFormComponent, isStandalone: false, selector: "appfx-filter-form", inputs: { valid: "valid" }, outputs: { cancel: "cancel", apply: "apply" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form clrForm class=\"form-compact\" clrLayout=\"vertical\">\n  <div class=\"form-max-height\">\n    <ng-content></ng-content>\n  </div>\n  <div>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      class=\"btn btn-sm btn-primary btn-right\"\n      [disabled]=\"!valid\"\n      (click)=\"onApplyButtonClick()\"\n    >\n      {{ filterStrings.apply }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"cancelBtn\"\n      class=\"btn btn-sm btn-outline btn-right\"\n      (click)=\"onCancelButtonClick()\"\n    >\n      {{ filterStrings.cancel }}\n    </button>\n  </div>\n</form>\n", styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrForm, selector: "[clrForm]", inputs: ["clrLabelSize"] }, { kind: "directive", type: i2.ClrLayout, selector: "[clrForm][clrLayout]", inputs: ["clrLayout"] }, { kind: "directive", type: i1.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.NgForm, selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FilterFormComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-filter-form', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form clrForm class=\"form-compact\" clrLayout=\"vertical\">\n  <div class=\"form-max-height\">\n    <ng-content></ng-content>\n  </div>\n  <div>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      class=\"btn btn-sm btn-primary btn-right\"\n      [disabled]=\"!valid\"\n      (click)=\"onApplyButtonClick()\"\n    >\n      {{ filterStrings.apply }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"cancelBtn\"\n      class=\"btn btn-sm btn-outline btn-right\"\n      (click)=\"onCancelButtonClick()\"\n    >\n      {{ filterStrings.cancel }}\n    </button>\n  </div>\n</form>\n", styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: DatagridFiltersStrings }], propDecorators: { valid: [{
                type: Input
            }], cancel: [{
                type: Output
            }], apply: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const enterKey$4 = 'Enter';
const dateTimeFormat = 'yyyy-MM-ddTHH:mm:ss';
const requiredValidators = [Validators.required];
// TODO: zpopov: Existing time utils to convert to/from milliseconds may make the code even easier to read
const oneSecondMs = 1 * 1000;
const oneMinuteMs = 60 * oneSecondMs;
const oneHourMs = 60 * oneMinuteMs;
const oneDayMs = 24 * oneHourMs;
const oneWeekMs = 7 * oneDayMs;
const oneMonthMs = 30 * oneDayMs;
// We ignore leap years when it comes to time-spans.
const oneYearMs = 365 * oneDayMs;
/**
 * Datetime filter component collects filtering criteria for datetime based properties
 *
 */
class DateTimeFilterComponent {
    /**
     * Property used for filtering
     */
    #filterProperty;
    constructor(formBuilder, datePipe, filterStrings) {
        this.formBuilder = formBuilder;
        this.datePipe = datePipe;
        this.filterStrings = filterStrings;
        this.isEmptyPredicate = false;
        this.isCustomRangePredicate = false;
        this.isRelativePredicate = false;
        this.isTimeSpanPredicate = false;
        this.timePredicate = false;
        /**
         * Event emitter to tell hosting view that filtering criteria have changed
         */
        this.filterCriteriaChange = new EventEmitter();
        this.relativeOperators = [
            ComparisonOperator.LastDay,
            ComparisonOperator.LastWeek,
            ComparisonOperator.LastMonth,
            ComparisonOperator.LastYear,
        ];
        this.singlePredicateOperators = [
            ComparisonOperator.After,
            ComparisonOperator.AfterOrEqualTo,
            ComparisonOperator.Before,
            ComparisonOperator.BeforeOrEqualTo,
        ];
        this.selectedFilterCriteria = new PropertyFilter();
        this.primaryPredicate = new PropertyPredicate();
        this.secondaryPredicate = new PropertyPredicate();
        this.timeSpans = [TimeSpan.Minutes, TimeSpan.Hours, TimeSpan.Days, TimeSpan.Weeks, TimeSpan.Months, TimeSpan.Years];
    }
    get filterProperty() {
        return this.#filterProperty;
    }
    set filterProperty(filterProperty) {
        this.#filterProperty = filterProperty;
    }
    ngOnInit() {
        this.comparisonOperators = this.filterProperty.getOperators();
        let dateValidators = requiredValidators;
        // To handle edit mode
        const storedOperator = this.propertyFilter?.criteria[0]?.filterableProperty.selectedOperator;
        if (storedOperator) {
            this.processSelectedOperator(storedOperator);
            if (this.noDateTimeInputNeeded()) {
                dateValidators = [];
            }
        }
        this.dateTimeFilterForm = this.formBuilder.group({
            operator: [storedOperator || ComparisonOperator.AfterOrEqualTo],
            dateValue: [this.parseDateValue(this.getStoredDateTimeValue()), dateValidators],
        });
        if (this.parseTimeValue(this.getStoredDateTimeValue()).length > 0) {
            this.enableTimePredicate();
        }
        if (ComparisonOperator.CustomRange === storedOperator) {
            this.isCustomRangePredicate = true;
            this.enableCustomRangePredicate();
        }
        if (this.isTimeSpanPredicate) {
            this.enableTimeSpanPredicate();
        }
        this.onOperatorChange();
    }
    ngOnChanges() {
        this.comparisonOperators = this.filterProperty.getOperators();
    }
    onInputKeyPress(event) {
        if (event.key === enterKey$4) {
            event.stopPropagation();
            event.preventDefault();
            if (this.dateTimeFilterForm.valid) {
                this.onApplyButtonClick();
            }
        }
    }
    enableTimePredicate() {
        this.timePredicate = true;
        this.dateTimeFilterForm.addControl('timeValue', new FormControl(this.parseTimeValue(this.getStoredDateTimeValue()), requiredValidators));
        if (this.isCustomRangePredicate) {
            this.dateTimeFilterForm.addControl('timeValueTo', new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators));
        }
    }
    disableTimePredicate() {
        this.timePredicate = false;
        this.dateTimeFilterForm.removeControl('timeValue');
        if (this.isCustomRangePredicate) {
            this.dateTimeFilterForm.removeControl('timeValueTo');
        }
    }
    noDateTimeInputNeeded() {
        return this.isEmptyPredicate || this.isTimeSpanPredicate || this.isRelativePredicate;
    }
    onApplyButtonClick() {
        const selectedOperator = this.dateTimeFilterForm.value.operator;
        if (this.isRelativeDateTimeOperator(selectedOperator)) {
            this.primaryPredicate = this.getRelativeDateTimePredicate(selectedOperator);
            this.secondaryPredicate = this.getcurrentTimePredicate();
        }
        else if (this.isTimeSpanPredicate) {
            this.primaryPredicate = this.getTimeSpanPredicate(this.dateTimeFilterForm.value.timeSpanValue, this.dateTimeFilterForm.value.timeSpan);
            this.secondaryPredicate = this.getcurrentTimePredicate();
        }
        else if (this.isCustomRangePredicate) {
            this.primaryPredicate = this.getFromDateTimePredicate();
            this.secondaryPredicate = this.getToDateTimePredicate();
        }
        else if (ComparisonOperator.Equals === selectedOperator) {
            this.buildEqualsDateTimePredicates();
        }
        else if (this.isSinglePredicateOperator(selectedOperator)) {
            this.primaryPredicate = this.getSinglePredicate(selectedOperator);
        }
        this.primaryPredicate.filterableProperty = this.filterProperty;
        if (!this.isEmptyPredicate) {
            this.primaryPredicate.value = this.adjustTimeZone(this.primaryPredicate.value);
            if (!this.isSinglePredicateOperator(selectedOperator)) {
                this.secondaryPredicate.filterableProperty = this.filterProperty;
                this.secondaryPredicate.value = this.adjustTimeZone(this.secondaryPredicate.value);
                this.selectedFilterCriteria.criteria = [this.primaryPredicate, this.secondaryPredicate];
                this.selectedFilterCriteria.operator = LogicalOperator.And;
            }
            else {
                this.selectedFilterCriteria.criteria = [this.primaryPredicate];
            }
        }
        else {
            this.primaryPredicate.operator = ComparisonOperator.IsEmpty;
            this.selectedFilterCriteria.criteria = [this.primaryPredicate];
        }
        // Selected data is stored, in order to be able to be rendered in edit mode
        this.storeSelectedValues();
        this.filterCriteriaChange.emit(this.selectedFilterCriteria);
    }
    onCancelButtonClick() {
        this.filterCriteriaChange.emit();
    }
    onOperatorChange() {
        this.dateTimeFilterForm.get('operator')?.valueChanges.subscribe((operator) => {
            this.processSelectedOperator(operator);
            if (this.noDateTimeInputNeeded()) {
                this.disableDateTimePredicates();
            }
            else {
                this.isCustomRangePredicate = ComparisonOperator.CustomRange === operator;
                this.enableDateTimePredicates();
                if (!this.isCustomRangePredicate) {
                    this.disableCustomRangePredicate();
                }
            }
            if (this.isTimeSpanPredicate) {
                this.enableTimeSpanPredicate();
            }
            else {
                this.disableTimeSpanPredicate();
            }
        });
    }
    addValidators(formControlName, validators) {
        this.dateTimeFilterForm.get(formControlName)?.addValidators(validators);
        this.dateTimeFilterForm.get(formControlName)?.updateValueAndValidity();
    }
    removeValidators(formControlName) {
        this.dateTimeFilterForm.get(formControlName)?.clearValidators();
        this.dateTimeFilterForm.get(formControlName)?.updateValueAndValidity();
    }
    isRelativeDateTimeOperator(operator) {
        return this.relativeOperators.includes(operator);
    }
    isSinglePredicateOperator(operator) {
        return this.singlePredicateOperators.includes(operator);
    }
    enableCustomRangePredicate() {
        this.dateTimeFilterForm.addControl('dateValueTo', new FormControl(this.parseDateValue(this.getStoredDateTimeValueTo()), requiredValidators));
        if (this.timePredicate) {
            this.dateTimeFilterForm.addControl('timeValueTo', new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators));
        }
    }
    disableCustomRangePredicate() {
        this.isCustomRangePredicate = false;
        this.dateTimeFilterForm.removeControl('dateValueTo');
        if (this.timePredicate) {
            this.dateTimeFilterForm.removeControl('timeValueTo');
        }
    }
    enableDateTimePredicates() {
        this.addValidators('dateValue', requiredValidators);
        if (this.timePredicate) {
            this.enableTimePredicate();
        }
        if (this.isCustomRangePredicate) {
            this.enableCustomRangePredicate();
        }
    }
    disableDateTimePredicates() {
        this.removeValidators('dateValue');
        if (this.timePredicate) {
            this.disableTimePredicate();
        }
        if (this.isCustomRangePredicate) {
            this.disableCustomRangePredicate();
        }
    }
    enableTimeSpanPredicate() {
        const timeSpanValue = this.propertyFilter?.criteria[0]?.filterableProperty?.selectedTimeSpanValue;
        this.dateTimeFilterForm.addControl('timeSpanValue', new FormControl(timeSpanValue || '', requiredValidators));
        const timeSpan = this.propertyFilter?.criteria[0]?.filterableProperty?.selectedTimeSpan;
        this.dateTimeFilterForm.addControl('timeSpan', new FormControl(timeSpan || TimeSpan.Minutes));
    }
    disableTimeSpanPredicate() {
        this.dateTimeFilterForm.removeControl('timeSpanValue');
        this.dateTimeFilterForm.removeControl('timeSpan');
    }
    processSelectedOperator(operator) {
        this.isEmptyPredicate = ComparisonOperator.IsEmpty === operator;
        this.isTimeSpanPredicate = ComparisonOperator.TimeSpan === operator;
        this.isRelativePredicate = this.isRelativeDateTimeOperator(operator);
    }
    getRelativeDateTimePredicate(operator) {
        const predicate = new PropertyPredicate();
        predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
        switch (operator) {
            case ComparisonOperator.LastDay:
                predicate.value = this.getPastDate(oneDayMs);
                return predicate;
            case ComparisonOperator.LastWeek:
                predicate.value = this.getPastDate(oneWeekMs);
                return predicate;
            case ComparisonOperator.LastMonth:
                predicate.value = this.getPastDate(oneMonthMs);
                return predicate;
            case ComparisonOperator.LastYear:
                predicate.value = this.getPastDate(oneYearMs);
                return predicate;
            default:
                return predicate;
        }
    }
    getTimeSpanPredicate(value, timeSpan) {
        const predicate = new PropertyPredicate();
        predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
        if (value < 0) {
            return predicate;
        }
        switch (timeSpan) {
            case TimeSpan.Minutes:
                predicate.value = this.getPastDate(value * oneMinuteMs);
                return predicate;
            case TimeSpan.Hours:
                predicate.value = this.getPastDate(value * oneHourMs);
                return predicate;
            case TimeSpan.Days:
                predicate.value = this.getPastDate(value * oneDayMs);
                return predicate;
            case TimeSpan.Weeks:
                predicate.value = this.getPastDate(value * oneWeekMs);
                return predicate;
            case TimeSpan.Months:
                predicate.value = this.getPastDate(value * oneMonthMs);
                return predicate;
            case TimeSpan.Years:
                predicate.value = this.getPastDate(value * oneYearMs);
                return predicate;
            default:
                return predicate;
        }
    }
    buildEqualsDateTimePredicates() {
        this.primaryPredicate = this.getFromDateTimePredicate();
        this.secondaryPredicate.operator = ComparisonOperator.LessThan;
        if (this.timePredicate) {
            this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, oneMinuteMs);
        }
        else {
            this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, oneDayMs);
        }
    }
    getSinglePredicate(operator) {
        let predicate = new PropertyPredicate();
        switch (operator) {
            case ComparisonOperator.BeforeOrEqualTo:
                predicate = this.getFromDateTimePredicate(true);
                predicate.operator = ComparisonOperator.LessThan;
                return predicate;
            case ComparisonOperator.Before:
                predicate = this.getFromDateTimePredicate();
                predicate.operator = ComparisonOperator.LessThan;
                return predicate;
            case ComparisonOperator.After:
                predicate = this.getFromDateTimePredicate(true);
                predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
                return predicate;
            case ComparisonOperator.AfterOrEqualTo:
                predicate = this.getFromDateTimePredicate();
                predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
                return predicate;
            default:
                return predicate;
        }
    }
    getFromDateTimePredicate(adjustTime = false) {
        const fromPredicate = new PropertyPredicate();
        fromPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
        let fromValue = this.dateTimeFilterForm.value.dateValue;
        if (this.timePredicate) {
            fromValue += 'T' + this.dateTimeFilterForm.value.timeValue + ':00';
            if (adjustTime) {
                fromValue = this.getCustomDate(fromValue, oneMinuteMs);
            }
        }
        else {
            fromValue += 'T00:00:00';
            if (adjustTime) {
                fromValue = this.getCustomDate(fromValue, oneDayMs);
            }
        }
        fromPredicate.value = fromValue;
        return fromPredicate;
    }
    getToDateTimePredicate() {
        const toPredicate = new PropertyPredicate();
        toPredicate.operator = ComparisonOperator.LessThan;
        let toValue = this.dateTimeFilterForm.value.dateValueTo;
        if (this.timePredicate) {
            toValue += 'T' + this.dateTimeFilterForm.value.timeValueTo + ':00';
            toValue = this.getCustomDate(toValue, oneMinuteMs);
        }
        else {
            toValue += 'T00:00:00';
            toValue = this.getCustomDate(toValue, oneDayMs);
        }
        toPredicate.value = toValue;
        return toPredicate;
    }
    getcurrentTimePredicate() {
        const predicate = new PropertyPredicate();
        predicate.value = this.datePipe.transform(new Date(), dateTimeFormat);
        predicate.operator = ComparisonOperator.LessThanOrEqualTo;
        return predicate;
    }
    getPastDate(timePeriod) {
        const now = new Date();
        const prevDate = new Date(new Date().setTime(now.getTime() - timePeriod));
        return this.datePipe.transform(prevDate, dateTimeFormat);
    }
    getCustomDate(baseDate, timePeriod) {
        const date = new Date(baseDate);
        const newDate = new Date(new Date().setTime(date.getTime() + timePeriod));
        return this.datePipe.transform(newDate, dateTimeFormat) || baseDate;
    }
    adjustTimeZone(utcDate) {
        if (!utcDate) {
            return utcDate;
        }
        return utcDate + this.getUtcTimeZoneOffset(utcDate);
    }
    getUtcTimeZoneOffset(utcDate) {
        // Difference in minutes between the time on the local computer and Universal Coordinated Time
        const timeZoneOffset = new Date(utcDate).getTimezoneOffset();
        const decimalOffset = Math.abs(timeZoneOffset / 60);
        const offsetHours = Math.trunc(decimalOffset);
        const offsetMinutes = Math.round((decimalOffset - offsetHours) * 60);
        // Adding a leading 0 if needed
        const offsetHoursString = offsetHours.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
        });
        const offsetMinutesString = offsetMinutes.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
        });
        let utcOffset = '';
        if (timeZoneOffset > 0) {
            utcOffset = '-' + offsetHoursString + ':' + offsetMinutesString;
        }
        else if (timeZoneOffset < 0) {
            utcOffset = '+' + offsetHoursString + ':' + offsetMinutesString;
        }
        return utcOffset;
    }
    storeSelectedValues() {
        this.primaryPredicate.filterableProperty.selectedOperator = this.dateTimeFilterForm.value.operator;
        this.primaryPredicate.filterableProperty.selectedValue = this.dateTimeFilterForm.value.dateValue;
        if (this.timePredicate) {
            this.primaryPredicate.filterableProperty.selectedValue += 'T' + this.dateTimeFilterForm.value.timeValue;
        }
        if (this.isCustomRangePredicate) {
            this.primaryPredicate.filterableProperty.selectedValueTo = this.dateTimeFilterForm.value.dateValueTo;
            if (this.timePredicate) {
                this.primaryPredicate.filterableProperty.selectedValueTo += 'T' + this.dateTimeFilterForm.value.timeValueTo;
            }
        }
        if (this.isTimeSpanPredicate) {
            this.primaryPredicate.filterableProperty.selectedTimeSpanValue = this.dateTimeFilterForm.value.timeSpanValue;
            this.primaryPredicate.filterableProperty.selectedTimeSpan = this.dateTimeFilterForm.value.timeSpan;
        }
    }
    getStoredDateTimeValue() {
        return this.propertyFilter?.criteria[0]?.filterableProperty?.selectedValue || '';
    }
    getStoredDateTimeValueTo() {
        return this.propertyFilter?.criteria[0]?.filterableProperty?.selectedValueTo || '';
    }
    parseDateValue(dateTime) {
        if (dateTime) {
            return dateTime.substring(0, 10);
        }
        return '';
    }
    parseTimeValue(dateTime) {
        if (!!dateTime && dateTime.indexOf('T') > 0) {
            return dateTime.substring(dateTime.indexOf('T') + 1);
        }
        return '';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateTimeFilterComponent, deps: [{ token: i1.FormBuilder }, { token: i2$1.DatePipe }, { token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DateTimeFilterComponent, isStandalone: false, selector: "appfx-datetime-filter", inputs: { propertyFilter: "propertyFilter", filterProperty: "filterProperty" }, outputs: { filterCriteriaChange: "filterCriteriaChange" }, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"dateTimeFilterForm\"\n  [valid]=\"dateTimeFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <clr-select-container class=\"mt-compact\">\n    <label class=\"clr-control-label\">\n      {{ filterStrings.operatorLabel }}\n    </label>\n    <select clrSelect formControlName=\"operator\">\n      @for (operator of comparisonOperators; track operator) {\n        <option [ngValue]=\"operator\">\n          {{ filterStrings.getOperatorDisplayName(operator) }}\n        </option>\n      }\n    </select>\n  </clr-select-container>\n  @if (!noDateTimeInputNeeded()) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        @if (isCustomRangePredicate) {\n          <label class=\"clr-control-label\">\n            {{ filterStrings.fromLabel }}\n          </label>\n        }\n        <input\n          type=\"date\"\n          pattern=\"^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$\"\n          formControlName=\"dateValue\"\n          placeholder=\"{{ filterStrings.dateFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.dateValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n    </div>\n  }\n  @if (timePredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <input\n          type=\"time\"\n          pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9])$\"\n          formControlName=\"timeValue\"\n          placeholder=\"{{ filterStrings.timeFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.timeValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <button\n        class=\"close ml-half\"\n        data-test-id=\"close-button\"\n        [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n        (click)=\"disableTimePredicate()\"\n      >\n        <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n  }\n  @if (isCustomRangePredicate) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        <label class=\"clr-control-label\">\n          {{ filterStrings.toLabel }}\n        </label>\n        <input\n          type=\"date\"\n          pattern=\"^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$\"\n          formControlName=\"dateValueTo\"\n          placeholder=\"{{ filterStrings.dateFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.dateValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n    </div>\n  }\n  @if (timePredicate && isCustomRangePredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <input\n          type=\"time\"\n          pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9])$\"\n          formControlName=\"timeValueTo\"\n          placeholder=\"{{ filterStrings.timeFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.timeValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <button\n        class=\"close ml-half\"\n        data-test-id=\"close-button\"\n        [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n        (click)=\"disableTimePredicate()\"\n      >\n        <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n  }\n  @if (!timePredicate && !noDateTimeInputNeeded()) {\n    <button\n      class=\"btn btn-sm btn-link mt-half\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addTimeFilter\"\n      (click)=\"enableTimePredicate()\"\n    >\n      <cds-icon shape=\"plus\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addTimeFilter }}\n    </button>\n  }\n  @if (isTimeSpanPredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <label class=\"clr-control-label\">\n          {{ filterStrings.timeSpanInputLabel }}\n        </label>\n        <input\n          type=\"text\"\n          pattern=\"^[0-9]+$\"\n          formControlName=\"timeSpanValue\"\n          placeholder=\"{{ filterStrings.enterValue }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.integerValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <clr-select-container class=\"ml-half\">\n        <select clrSelect formControlName=\"timeSpan\" [attr.aria-label]=\"filterStrings.timeSpanAriaLabel\">\n          @for (timeSpan of timeSpans; track timeSpan) {\n            <option [ngValue]=\"timeSpan\">\n              {{ filterStrings.getTimeSpanDisplayName(timeSpan) }}\n            </option>\n          }\n        </select>\n      </clr-select-container>\n    </div>\n  }\n</appfx-filter-form>\n", styles: ["clr-input-container{margin-top:.9rem}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i2.ClrControlError, selector: "clr-control-error" }, { kind: "directive", type: i2.ClrIfError, selector: "[clrIfError]", inputs: ["clrIfError"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i4.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i4.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i4.ClrSelect, selector: "[clrSelect]" }, { kind: "component", type: i4.ClrSelectContainer, selector: "clr-select-container" }, { kind: "directive", type: i1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: ["pattern"] }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: FilterFormComponent, selector: "appfx-filter-form", inputs: ["valid"], outputs: ["cancel", "apply"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DateTimeFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-datetime-filter', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"dateTimeFilterForm\"\n  [valid]=\"dateTimeFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <clr-select-container class=\"mt-compact\">\n    <label class=\"clr-control-label\">\n      {{ filterStrings.operatorLabel }}\n    </label>\n    <select clrSelect formControlName=\"operator\">\n      @for (operator of comparisonOperators; track operator) {\n        <option [ngValue]=\"operator\">\n          {{ filterStrings.getOperatorDisplayName(operator) }}\n        </option>\n      }\n    </select>\n  </clr-select-container>\n  @if (!noDateTimeInputNeeded()) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        @if (isCustomRangePredicate) {\n          <label class=\"clr-control-label\">\n            {{ filterStrings.fromLabel }}\n          </label>\n        }\n        <input\n          type=\"date\"\n          pattern=\"^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$\"\n          formControlName=\"dateValue\"\n          placeholder=\"{{ filterStrings.dateFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.dateValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n    </div>\n  }\n  @if (timePredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <input\n          type=\"time\"\n          pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9])$\"\n          formControlName=\"timeValue\"\n          placeholder=\"{{ filterStrings.timeFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.timeValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <button\n        class=\"close ml-half\"\n        data-test-id=\"close-button\"\n        [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n        (click)=\"disableTimePredicate()\"\n      >\n        <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n  }\n  @if (isCustomRangePredicate) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        <label class=\"clr-control-label\">\n          {{ filterStrings.toLabel }}\n        </label>\n        <input\n          type=\"date\"\n          pattern=\"^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$\"\n          formControlName=\"dateValueTo\"\n          placeholder=\"{{ filterStrings.dateFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.dateValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n    </div>\n  }\n  @if (timePredicate && isCustomRangePredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <input\n          type=\"time\"\n          pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9])$\"\n          formControlName=\"timeValueTo\"\n          placeholder=\"{{ filterStrings.timeFormat }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.timeValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <button\n        class=\"close ml-half\"\n        data-test-id=\"close-button\"\n        [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n        (click)=\"disableTimePredicate()\"\n      >\n        <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n      </button>\n    </div>\n  }\n  @if (!timePredicate && !noDateTimeInputNeeded()) {\n    <button\n      class=\"btn btn-sm btn-link mt-half\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addTimeFilter\"\n      (click)=\"enableTimePredicate()\"\n    >\n      <cds-icon shape=\"plus\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addTimeFilter }}\n    </button>\n  }\n  @if (isTimeSpanPredicate) {\n    <div class=\"flex-end-container\">\n      <clr-input-container>\n        <label class=\"clr-control-label\">\n          {{ filterStrings.timeSpanInputLabel }}\n        </label>\n        <input\n          type=\"text\"\n          pattern=\"^[0-9]+$\"\n          formControlName=\"timeSpanValue\"\n          placeholder=\"{{ filterStrings.enterValue }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.integerValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      <clr-select-container class=\"ml-half\">\n        <select clrSelect formControlName=\"timeSpan\" [attr.aria-label]=\"filterStrings.timeSpanAriaLabel\">\n          @for (timeSpan of timeSpans; track timeSpan) {\n            <option [ngValue]=\"timeSpan\">\n              {{ filterStrings.getTimeSpanDisplayName(timeSpan) }}\n            </option>\n          }\n        </select>\n      </clr-select-container>\n    </div>\n  }\n</appfx-filter-form>\n", styles: ["clr-input-container{margin-top:.9rem}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: i1.FormBuilder }, { type: i2$1.DatePipe }, { type: DatagridFiltersStrings }], propDecorators: { propertyFilter: [{
                type: Input
            }], filterCriteriaChange: [{
                type: Output
            }], filterProperty: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Enum filter component collects filtering criteria for enum based properties
 *
 */
class EnumFilterComponent {
    constructor(formBuilder, filterStrings) {
        this.formBuilder = formBuilder;
        this.filterStrings = filterStrings;
        /**
         * Event emitter to tell hosting view that filtering criteria have changed
         */
        this.filterCriteriaChange = new EventEmitter();
        this.optionsData = [];
        this.selectedFilterCriteria = new PropertyFilter();
    }
    get optionsFormArray() {
        return this.enumFilterForm.controls.options;
    }
    ngOnInit() {
        this.enumFilterForm = this.formBuilder.group({
            selectAll: false,
            options: new FormArray([], this.selectedOptionsValidator()),
            singleSelectOption: [this.propertyFilter?.criteria[0]?.value || this.filterProperty.values.keys().next().value],
        });
        this.updateForm();
        this.selectedFilterCriteria.operator = LogicalOperator.Or;
    }
    ngOnChanges() {
        this.updateData();
        this.updateForm();
    }
    onApplyButtonClick() {
        const propertyPredicates = [];
        if (this.filterProperty.singleSelect) {
            propertyPredicates.push(this.createEnumPropertyPredicate(this.enumFilterForm.value.singleSelectOption));
        }
        else {
            const selectedOptionsKeys = this.enumFilterForm.value.options
                .map((checked, i) => (checked ? this.optionsData[i].key : null))
                .filter((v) => v !== null);
            selectedOptionsKeys.forEach(value => {
                propertyPredicates.push(this.createEnumPropertyPredicate(value));
            });
        }
        this.selectedFilterCriteria.criteria = propertyPredicates;
        this.filterCriteriaChange.emit(this.selectedFilterCriteria);
    }
    onCancelButtonClick() {
        this.filterCriteriaChange.emit();
    }
    onSelectAllChange() {
        const selectAllValue = this.enumFilterForm.get('selectAll')?.value;
        this.optionsFormArray.controls.forEach(c => {
            c.setValue(selectAllValue);
        });
    }
    onOptionChange(event) {
        if (!event.target.checked) {
            this.selectAll(false);
        }
        else {
            const totalSelected = this.optionsFormArray.controls
                .map(c => c.value)
                .reduce((prev, next) => (next ? prev + next : prev), 0);
            if (totalSelected === this.optionsFormArray.length) {
                this.selectAll(true);
            }
        }
    }
    selectedOptionsValidator() {
        const validator = (control) => {
            const formArray = control;
            const totalSelected = formArray.controls
                .map((c) => c.value)
                .reduce((prev, next) => (next ? prev + next : prev), 0);
            return this.filterProperty.singleSelect || totalSelected > 0 ? null : { required: true };
        };
        return validator;
    }
    updateData() {
        this.optionsData = [];
        let enumValues;
        if (this.propertyFilter && this.propertyFilter.criteria.length) {
            // Edit mode
            enumValues = this.propertyFilter.criteria[0].filterableProperty.values;
        }
        else {
            enumValues = this.filterProperty.values;
        }
        enumValues.forEach((v, k) => {
            this.optionsData.push({ key: k, value: v });
        });
    }
    updateForm() {
        if (this.enumFilterForm) {
            this.optionsFormArray.clear();
            this.selectAll(false);
            const selectedOptions = [];
            if (this.propertyFilter) {
                this.propertyFilter.criteria.forEach(predicate => {
                    selectedOptions.push(predicate.value);
                });
            }
            this.optionsData.forEach(option => this.optionsFormArray.push(new FormControl(selectedOptions.includes(option.key))));
            if (selectedOptions.length === this.optionsData.length) {
                this.selectAll(true);
            }
        }
    }
    selectAll(value) {
        this.enumFilterForm.patchValue({
            selectAll: value,
        });
    }
    createEnumPropertyPredicate(value) {
        const predicate = new PropertyPredicate();
        predicate.filterableProperty = this.filterProperty;
        predicate.operator = ComparisonOperator.Equals;
        predicate.value = value;
        return predicate;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: EnumFilterComponent, deps: [{ token: i1.FormBuilder }, { token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: EnumFilterComponent, isStandalone: false, selector: "appfx-enum-filter", inputs: { filterProperty: "filterProperty", propertyFilter: "propertyFilter" }, outputs: { filterCriteriaChange: "filterCriteriaChange" }, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"enumFilterForm\"\n  [valid]=\"enumFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <label class=\"clr-control-label text-left mt-compact\">\n    {{ filterStrings.valueLabel }}\n  </label>\n  @if (!filterProperty.singleSelect) {\n    <clr-checkbox-container class=\"enum-options\">\n      <clr-checkbox-wrapper>\n        <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n        <label> {{ filterStrings.selectAll }} </label>\n      </clr-checkbox-wrapper>\n      @for (option of optionsFormArray.controls; track option; let i = $index) {\n        <clr-checkbox-wrapper formArrayName=\"options\">\n          <input type=\"checkbox\" clrCheckbox [formControlName]=\"i\" (change)=\"onOptionChange($event)\" />\n          <label> {{ optionsData[i].value }} </label>\n        </clr-checkbox-wrapper>\n      }\n    </clr-checkbox-container>\n  }\n  @if (filterProperty.singleSelect) {\n    <clr-radio-container class=\"enum-options\">\n      @for (option of optionsFormArray.controls; track option; let j = $index) {\n        <clr-radio-wrapper>\n          <input type=\"radio\" clrRadio formControlName=\"singleSelectOption\" [value]=\"optionsData[j].key\" />\n          <label> {{ optionsData[j].value }} </label>\n        </clr-radio-wrapper>\n      }\n    </clr-radio-container>\n  }\n</appfx-filter-form>\n", styles: [".enum-options{margin-top:.1rem;text-align:left}:host-context(.no-zoom) .enum-options{overflow-y:auto;max-height:8.8rem}:host ::ng-deep .clr-control-container{margin-left:.2rem}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i4.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i4.ClrCheckboxContainer, selector: "clr-checkbox-container,clr-toggle-container", inputs: ["clrInline"] }, { kind: "component", type: i4.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "directive", type: i4.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i4.ClrRadioContainer, selector: "clr-radio-container", inputs: ["clrInline"] }, { kind: "component", type: i4.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i1.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "directive", type: i1.FormArrayName, selector: "[formArrayName]", inputs: ["formArrayName"] }, { kind: "component", type: FilterFormComponent, selector: "appfx-filter-form", inputs: ["valid"], outputs: ["cancel", "apply"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: EnumFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-enum-filter', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"enumFilterForm\"\n  [valid]=\"enumFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <label class=\"clr-control-label text-left mt-compact\">\n    {{ filterStrings.valueLabel }}\n  </label>\n  @if (!filterProperty.singleSelect) {\n    <clr-checkbox-container class=\"enum-options\">\n      <clr-checkbox-wrapper>\n        <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n        <label> {{ filterStrings.selectAll }} </label>\n      </clr-checkbox-wrapper>\n      @for (option of optionsFormArray.controls; track option; let i = $index) {\n        <clr-checkbox-wrapper formArrayName=\"options\">\n          <input type=\"checkbox\" clrCheckbox [formControlName]=\"i\" (change)=\"onOptionChange($event)\" />\n          <label> {{ optionsData[i].value }} </label>\n        </clr-checkbox-wrapper>\n      }\n    </clr-checkbox-container>\n  }\n  @if (filterProperty.singleSelect) {\n    <clr-radio-container class=\"enum-options\">\n      @for (option of optionsFormArray.controls; track option; let j = $index) {\n        <clr-radio-wrapper>\n          <input type=\"radio\" clrRadio formControlName=\"singleSelectOption\" [value]=\"optionsData[j].key\" />\n          <label> {{ optionsData[j].value }} </label>\n        </clr-radio-wrapper>\n      }\n    </clr-radio-container>\n  }\n</appfx-filter-form>\n", styles: [".enum-options{margin-top:.1rem;text-align:left}:host-context(.no-zoom) .enum-options{overflow-y:auto;max-height:8.8rem}:host ::ng-deep .clr-control-container{margin-left:.2rem}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: i1.FormBuilder }, { type: DatagridFiltersStrings }], propDecorators: { filterProperty: [{
                type: Input
            }], propertyFilter: [{
                type: Input
            }], filterCriteriaChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A directive that fixes the position of the clarity popover/signpost, which is opened
 * when adding/editing filters. The popover is positioned bottom middle relative to
 * the corresponding trigger button. The width of the popover is based on the longest
 * property name. This means that some parts of the popover may not be visible, because
 * they will get out of the borders of the parent datagrid component.
 * To prevent this, the directive modifies the `translateX` property for the `transform` style,
 * in order to ensure that the popover is positioned within the boundaries of the datagrid.
 */
class FilterPopoverRepositionDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        // Minimal `translateX` property of transform style of the popover that
        // ensures the popover is aligned on the left boundaries of the datagrid.
        this.menuMinTranslateX = 1;
        // Selector of the datagrid filter container. It has the same width as the datagrid.
        this.filterContainerSelector = '.filter-container';
    }
    ngAfterViewInit() {
        const computedStyle = getComputedStyle(this.elementRef.nativeElement);
        const matrix = new DOMMatrix(computedStyle.transform);
        const originalTranslateX = matrix.m41;
        const translateY = matrix.m42;
        const parentElement = this.elementRef.nativeElement.closest(this.filterContainerSelector);
        const popoverOriginalEndX = originalTranslateX + this.elementRef.nativeElement.offsetWidth;
        // If the popover is within the datagrid boundaries, do nothing.
        if (originalTranslateX > this.menuMinTranslateX && popoverOriginalEndX < parentElement.offsetWidth) {
            return;
        }
        const newTranslateX = Math.max(this.menuMinTranslateX, Math.min(originalTranslateX, originalTranslateX - (popoverOriginalEndX - parentElement.offsetWidth)));
        // Override default `translateX` property
        this.elementRef.nativeElement.style.transform = `translateX(${newTranslateX}px) translateY(${translateY}px)`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FilterPopoverRepositionDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: FilterPopoverRepositionDirective, isStandalone: false, selector: "[filterPopoverReposition]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: FilterPopoverRepositionDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[filterPopoverReposition]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const enterKey$3 = 'Enter';
const unmericPatternRegex = '^-?[0-9]+$';
/**
 * General filter component collects filtering criteria for string and numeric based properties
 *
 */
class GeneralFilterComponent {
    #filterProperty;
    constructor(formBuilder, filterStrings) {
        this.formBuilder = formBuilder;
        this.filterStrings = filterStrings;
        this.isEmptyOperator = ComparisonOperator.IsEmpty;
        this.units = [];
        this.isNumericUnitProperty = false;
        this.additionalPredicate = false;
        this.isEmptyPrimaryPredicate = false;
        this.isEmptySecondaryPredicate = false;
        /**
         * Event emitter to tell hosting view that filtering criteria have changed
         */
        this.filterCriteriaChange = new EventEmitter();
        this.LogicalOperator = LogicalOperator;
        this.selectedFilterCriteria = new PropertyFilter();
        this.primaryPredicate = new PropertyPredicate();
        this.secondaryPredicate = new PropertyPredicate();
        this.logicalOperators = [LogicalOperator.And, LogicalOperator.Or];
    }
    get filterProperty() {
        return this.#filterProperty;
    }
    set filterProperty(filterProperty) {
        this.#filterProperty = filterProperty;
        this.primaryPredicate.filterableProperty = filterProperty;
        this.secondaryPredicate.filterableProperty = filterProperty;
    }
    ngOnInit() {
        this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
        this.comparisonOperators = this.filterProperty.getOperators();
        this.units = this.applicableUnits();
        // To handle edit mode with operator IsEmpty
        let validators = [];
        if (this.propertyFilter?.criteria[0]?.operator === this.isEmptyOperator) {
            this.isEmptyPrimaryPredicate = true;
        }
        else {
            validators = this.initValidators();
        }
        this.generalFilterForm = this.formBuilder.group({
            primaryOperator: [this.initOperator(0)],
            primaryValue: [this.initValue(0), validators],
            primaryUnit: [this.initUnit(0)],
            logicalOperator: [this.propertyFilter?.operator || LogicalOperator.And],
        });
        this.generalFilterForm.get('primaryOperator')?.valueChanges.subscribe((operator) => {
            if (operator === this.isEmptyOperator) {
                this.removeValidators('primaryValue');
                this.isEmptyPrimaryPredicate = true;
                this.selectLogicalOperator(LogicalOperator.Or);
            }
            else {
                this.addValidators('primaryValue', validators);
                this.isEmptyPrimaryPredicate = false;
            }
        });
        if (this.propertyFilter?.criteria?.length === 2) {
            this.enableSecondaryPredicate();
        }
    }
    ngOnChanges() {
        this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
        this.comparisonOperators = this.filterProperty.getOperators();
        // Update property units
        if (this.isNumericUnitProperty && this.generalFilterForm) {
            this.units = this.applicableUnits();
            this.generalFilterForm.patchValue({
                primaryUnit: this.initUnit(0),
            });
            if (this.additionalPredicate) {
                this.generalFilterForm.patchValue({
                    secondaryUnit: this.initUnit(1),
                });
            }
        }
    }
    onInputKeyPress(event) {
        if (event.key === enterKey$3) {
            event.stopPropagation();
            event.preventDefault();
            if (this.generalFilterForm.valid) {
                this.onApplyButtonClick();
            }
        }
    }
    enableSecondaryPredicate() {
        this.additionalPredicate = true;
        // To handle edit mode with operator IsEmpty
        let validators = [];
        if (this.propertyFilter?.criteria[1]?.operator === this.isEmptyOperator) {
            this.isEmptySecondaryPredicate = true;
        }
        else {
            validators = this.initValidators();
        }
        this.generalFilterForm.addControl('secondaryOperator', new FormControl(this.initOperator(1)));
        this.generalFilterForm.addControl('secondaryValue', new FormControl(this.initValue(1), validators));
        this.generalFilterForm.addControl('secondaryUnit', new FormControl(this.initUnit(1)));
        this.generalFilterForm.get('secondaryOperator')?.valueChanges.subscribe((operator) => {
            if (operator === this.isEmptyOperator) {
                this.removeValidators('secondaryValue');
                this.isEmptySecondaryPredicate = true;
                this.selectLogicalOperator(LogicalOperator.Or);
            }
            else {
                this.addValidators('secondaryValue', validators);
                this.isEmptySecondaryPredicate = false;
            }
        });
    }
    disableSecondaryPredicate() {
        this.additionalPredicate = false;
        this.generalFilterForm.removeControl('secondaryOperator');
        this.generalFilterForm.removeControl('secondaryValue');
    }
    onApplyButtonClick() {
        this.primaryPredicate.operator = this.generalFilterForm.value.primaryOperator;
        this.primaryPredicate.value = this.generalFilterForm.value.primaryValue;
        if (this.isNumericUnitProperty) {
            // Selected value and unit are stored, in order to be able to be rendered in edit mode.
            // They are stored in an array, because there are up to two conditions for a single property.
            this.primaryPredicate.filterableProperty.selectedValue = [this.generalFilterForm.value.primaryValue];
            this.primaryPredicate.filterableProperty.selectedUnit = [this.generalFilterForm.value.primaryUnit];
            this.primaryPredicate.value = this.convertValue(this.generalFilterForm.value.primaryValue, this.generalFilterForm.value.primaryUnit);
        }
        this.selectedFilterCriteria.criteria = [this.primaryPredicate];
        this.selectedFilterCriteria.operator =
            this.filterProperty.logicalOperator ?? this.generalFilterForm.value.logicalOperator;
        if (this.additionalPredicate) {
            this.secondaryPredicate.operator = this.generalFilterForm.value.secondaryOperator;
            this.secondaryPredicate.value = this.generalFilterForm.value.secondaryValue;
            if (this.isNumericUnitProperty) {
                this.secondaryPredicate.filterableProperty.selectedValue.push(this.generalFilterForm.value.secondaryValue);
                this.secondaryPredicate.filterableProperty.selectedUnit.push(this.generalFilterForm.value.secondaryUnit);
                this.secondaryPredicate.value = this.convertValue(this.generalFilterForm.value.secondaryValue, this.generalFilterForm.value.secondaryUnit);
            }
            this.selectedFilterCriteria.criteria.push(this.secondaryPredicate);
        }
        this.filterCriteriaChange.emit(this.selectedFilterCriteria);
    }
    onCancelButtonClick() {
        this.filterCriteriaChange.emit();
    }
    addValidators(formControlName, validators) {
        this.generalFilterForm.get(formControlName)?.addValidators(validators);
        this.generalFilterForm.get(formControlName)?.updateValueAndValidity();
    }
    removeValidators(formControlName) {
        this.generalFilterForm.get(formControlName)?.clearValidators();
        this.generalFilterForm.get(formControlName)?.updateValueAndValidity();
    }
    selectLogicalOperator(operator) {
        this.generalFilterForm.patchValue({
            logicalOperator: operator,
        });
    }
    initOperator(index) {
        const selectedOperator = this.propertyFilter?.criteria[index]?.operator;
        const defaultOperator = this.filterProperty instanceof StringPropertyDefinition ? ComparisonOperator.Contains : ComparisonOperator.Equals;
        return selectedOperator || defaultOperator;
    }
    initValidators() {
        const validators = [Validators.required];
        if (this.filterProperty instanceof NumericPropertyDefinition) {
            validators.push(Validators.pattern(unmericPatternRegex));
        }
        return validators;
    }
    isNumericUnitFilterProperty() {
        return this.filterProperty instanceof NumericPropertyDefinition && this.filterProperty.unit !== undefined;
    }
    applicableUnits() {
        if (this.isNumericUnitProperty) {
            const propertyUnit = this.filterProperty.unit;
            switch (propertyUnit) {
                case Unit.Byte:
                    return [Unit.Byte, Unit.KB, Unit.MB, Unit.GB, Unit.TB];
                case Unit.KB:
                    return [Unit.KB, Unit.MB, Unit.GB, Unit.TB];
                case Unit.MB:
                    return [Unit.MB, Unit.GB, Unit.TB];
                case Unit.GB:
                    return [Unit.GB, Unit.TB];
                case Unit.TB:
                    return [Unit.TB];
                case Unit.BytePS:
                    return [Unit.BytePS, Unit.KBytePS, Unit.MBytePS, Unit.GBytePS];
                case Unit.KBytePS:
                    return [Unit.KBytePS, Unit.MBytePS, Unit.GBytePS];
                case Unit.MBytePS:
                    return [Unit.MBytePS, Unit.GBytePS];
                case Unit.GBytePS:
                    return [Unit.GBytePS];
                case Unit.BitPS:
                    return [Unit.BitPS, Unit.KBitPS, Unit.MBitPS, Unit.GBitPS];
                case Unit.KBitPS:
                    return [Unit.KBitPS, Unit.MBitPS, Unit.GBitPS];
                case Unit.MBitPS:
                    return [Unit.MBitPS, Unit.GBitPS];
                case Unit.GBitPS:
                    return [Unit.GBitPS];
                case Unit.HZ:
                    return [Unit.HZ, Unit.KHZ, Unit.MHZ, Unit.GHZ];
                case Unit.KHZ:
                    return [Unit.KHZ, Unit.MHZ, Unit.GHZ];
                case Unit.MHZ:
                    return [Unit.MHZ, Unit.GHZ];
                case Unit.GHZ:
                    return [Unit.GHZ];
                default:
                    return [];
            }
        }
        return [];
    }
    initUnit(index) {
        if (this.isNumericUnitProperty) {
            if (this.propertyFilter?.criteria[index]) {
                return this.getSelectedUnit(index);
            }
            else {
                return this.units.length > 0 ? this.units[0] : Unit.MB;
            }
        }
        return Unit.MB;
    }
    getSelectedUnit(index) {
        const selectedUnit = this.propertyFilter.criteria[index].filterableProperty.selectedUnit[index];
        return selectedUnit;
    }
    initValue(index) {
        if (this.isNumericUnitProperty) {
            return this.propertyFilter?.criteria[index]?.filterableProperty.selectedValue[index] || '';
        }
        else {
            return this.propertyFilter?.criteria[index]?.value || '';
        }
    }
    convertValue(value, sourceUnit) {
        if (this.isNumericUnitProperty) {
            const targetUnit = this.filterProperty.unit;
            if (targetUnit === sourceUnit) {
                return value;
            }
            switch (targetUnit) {
                case Unit.Byte:
                    switch (sourceUnit) {
                        case Unit.KB:
                            return value * 1024;
                        case Unit.MB:
                            return value * 1024 * 1024;
                        case Unit.GB:
                            return value * 1024 * 1024 * 1024;
                        case Unit.TB:
                            return value * 1024 * 1024 * 1024 * 1024;
                        default:
                            return value;
                    }
                case Unit.KB:
                    switch (sourceUnit) {
                        case Unit.MB:
                            return value * 1024;
                        case Unit.GB:
                            return value * 1024 * 1024;
                        case Unit.TB:
                            return value * 1024 * 1024 * 1024;
                        default:
                            return value;
                    }
                case Unit.MB:
                    switch (sourceUnit) {
                        case Unit.GB:
                            return value * 1024;
                        case Unit.TB:
                            return value * 1024 * 1024;
                        default:
                            return value;
                    }
                case Unit.GB:
                    switch (sourceUnit) {
                        case Unit.TB:
                            return value * 1024;
                        default:
                            return value;
                    }
                case Unit.HZ:
                    switch (sourceUnit) {
                        case Unit.KHZ:
                            return value * 1000;
                        case Unit.MHZ:
                            return value * 1000 * 1000;
                        case Unit.GHZ:
                            return value * 1000 * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.KHZ:
                    switch (sourceUnit) {
                        case Unit.MHZ:
                            return value * 1000;
                        case Unit.GHZ:
                            return value * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.MHZ:
                    switch (sourceUnit) {
                        case Unit.GHZ:
                            return value * 1000;
                        default:
                            return value;
                    }
                case Unit.BytePS:
                    switch (sourceUnit) {
                        case Unit.KBytePS:
                            return value * 1000;
                        case Unit.MBytePS:
                            return value * 1000 * 1000;
                        case Unit.GBytePS:
                            return value * 1000 * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.KBytePS:
                    switch (sourceUnit) {
                        case Unit.MBytePS:
                            return value * 1000;
                        case Unit.GBytePS:
                            return value * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.MBytePS:
                    switch (sourceUnit) {
                        case Unit.GBytePS:
                            return value * 1000;
                        default:
                            return value;
                    }
                case Unit.BitPS:
                    switch (sourceUnit) {
                        case Unit.KBitPS:
                            return value * 1000;
                        case Unit.MBitPS:
                            return value * 1000 * 1000;
                        case Unit.GBitPS:
                            return value * 1000 * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.KBitPS:
                    switch (sourceUnit) {
                        case Unit.MBitPS:
                            return value * 1000;
                        case Unit.GBitPS:
                            return value * 1000 * 1000;
                        default:
                            return value;
                    }
                case Unit.MBitPS:
                    switch (sourceUnit) {
                        case Unit.GBitPS:
                            return value * 1000;
                        default:
                            return value;
                    }
                default:
                    return value;
            }
        }
        return value;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: GeneralFilterComponent, deps: [{ token: i1.FormBuilder }, { token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: GeneralFilterComponent, isStandalone: false, selector: "appfx-general-filter", inputs: { propertyFilter: "propertyFilter", filterProperty: "filterProperty" }, outputs: { filterCriteriaChange: "filterCriteriaChange" }, usesOnChanges: true, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"generalFilterForm\"\n  [valid]=\"generalFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <clr-select-container class=\"mt-compact\">\n    <label class=\"clr-control-label\">\n      {{ filterStrings.operatorLabel }}\n    </label>\n    <select clrSelect formControlName=\"primaryOperator\">\n      @for (operator of comparisonOperators; track operator) {\n        <option [ngValue]=\"operator\">\n          {{ filterStrings.getOperatorDisplayName(operator) }}\n        </option>\n      }\n    </select>\n  </clr-select-container>\n  @if (!isEmptyPrimaryPredicate) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        <input\n          type=\"text\"\n          formControlName=\"primaryValue\"\n          placeholder=\"{{ filterStrings.enterValue }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.integerValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      @if (isNumericUnitProperty) {\n        <clr-select-container class=\"ml-half\">\n          <select clrSelect formControlName=\"primaryUnit\" [attr.aria-label]=\"filterStrings.unitAriaLabel\">\n            @for (unit of units; track unit) {\n              <option [ngValue]=\"unit\">\n                {{ filterStrings.getUnitDisplayName(unit) }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n      }\n    </div>\n  }\n  @if (!additionalPredicate && !filterProperty.singleCondition) {\n    <button\n      class=\"btn btn-sm btn-link mt-half\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addCondition\"\n      (click)=\"enableSecondaryPredicate()\"\n    >\n      <cds-icon shape=\"plus\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addCondition }}\n    </button>\n  }\n  @if (additionalPredicate) {\n    <div>\n      @if (filterProperty.logicalOperator == undefined) {\n        <clr-radio-container clrInline class=\"mt-compact\">\n          <clr-radio-wrapper>\n            <input\n              type=\"radio\"\n              clrRadio\n              formControlName=\"logicalOperator\"\n              [value]=\"logicalOperators[0]\"\n              [attr.disabled]=\"isEmptyPrimaryPredicate || isEmptySecondaryPredicate ? 'disabled' : null\"\n            />\n            <label> {{ filterStrings.getConjoinerDisplayName(logicalOperators[0]) }} </label>\n          </clr-radio-wrapper>\n          <clr-radio-wrapper>\n            <input type=\"radio\" clrRadio formControlName=\"logicalOperator\" [value]=\"logicalOperators[1]\" />\n            <label> {{ filterStrings.getConjoinerDisplayName(logicalOperators[1]) }} </label>\n          </clr-radio-wrapper>\n        </clr-radio-container>\n      }\n      @if (filterProperty.logicalOperator != undefined) {\n        <div class=\"clr-control-container\" cds-layout=\"m-t:sm\">\n          <span data-test-id=\"logical-operator\" cds-text=\"body medium\">{{\n            filterStrings.getConjoinerDisplayName(filterProperty.logicalOperator)\n          }}</span>\n        </div>\n      }\n      <div class=\"flex-end-container\">\n        <clr-select-container class=\"form-control-compact\">\n          <label class=\"clr-control-label\">\n            {{ filterStrings.operatorLabel }}\n          </label>\n          <select clrSelect formControlName=\"secondaryOperator\">\n            @for (operator of comparisonOperators; track operator) {\n              <option [ngValue]=\"operator\">\n                {{ filterStrings.getOperatorDisplayName(operator) }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n        <button\n          class=\"close ml-half\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeConditionAriaLabel\"\n          (click)=\"disableSecondaryPredicate()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      @if (!isEmptySecondaryPredicate) {\n        <div class=\"flex-container\">\n          <clr-input-container>\n            <input\n              type=\"text\"\n              formControlName=\"secondaryValue\"\n              placeholder=\"{{ filterStrings.enterValue }}\"\n              clrInput\n              (keydown)=\"onInputKeyPress($event)\"\n            />\n            <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n              filterStrings.requiredValidatorMessage\n            }}</clr-control-error>\n            <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n              filterStrings.integerValidatorMessage\n            }}</clr-control-error>\n          </clr-input-container>\n          @if (isNumericUnitProperty) {\n            <clr-select-container class=\"ml-half\">\n              <select clrSelect formControlName=\"secondaryUnit\">\n                @for (unit of units; track unit) {\n                  <option [ngValue]=\"unit\">\n                    {{ filterStrings.getUnitDisplayName(unit) }}\n                  </option>\n                }\n              </select>\n            </clr-select-container>\n          }\n        </div>\n      }\n    </div>\n  }\n</appfx-filter-form>\n", styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i2.ClrControlError, selector: "clr-control-error" }, { kind: "directive", type: i2.ClrIfError, selector: "[clrIfError]", inputs: ["clrIfError"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i4.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i4.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i4.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i4.ClrRadioContainer, selector: "clr-radio-container", inputs: ["clrInline"] }, { kind: "component", type: i4.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i4.ClrSelect, selector: "[clrSelect]" }, { kind: "component", type: i4.ClrSelectContainer, selector: "clr-select-container" }, { kind: "directive", type: i1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i1.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i1.FormGroupDirective, selector: "[formGroup]", inputs: ["formGroup"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "directive", type: i1.FormControlName, selector: "[formControlName]", inputs: ["formControlName", "disabled", "ngModel"], outputs: ["ngModelChange"] }, { kind: "component", type: FilterFormComponent, selector: "appfx-filter-form", inputs: ["valid"], outputs: ["cancel", "apply"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: GeneralFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-general-filter', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"generalFilterForm\"\n  [valid]=\"generalFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <clr-select-container class=\"mt-compact\">\n    <label class=\"clr-control-label\">\n      {{ filterStrings.operatorLabel }}\n    </label>\n    <select clrSelect formControlName=\"primaryOperator\">\n      @for (operator of comparisonOperators; track operator) {\n        <option [ngValue]=\"operator\">\n          {{ filterStrings.getOperatorDisplayName(operator) }}\n        </option>\n      }\n    </select>\n  </clr-select-container>\n  @if (!isEmptyPrimaryPredicate) {\n    <div class=\"flex-container\">\n      <clr-input-container>\n        <input\n          type=\"text\"\n          formControlName=\"primaryValue\"\n          placeholder=\"{{ filterStrings.enterValue }}\"\n          clrInput\n          (keydown)=\"onInputKeyPress($event)\"\n        />\n        <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n          filterStrings.requiredValidatorMessage\n        }}</clr-control-error>\n        <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n          filterStrings.integerValidatorMessage\n        }}</clr-control-error>\n      </clr-input-container>\n      @if (isNumericUnitProperty) {\n        <clr-select-container class=\"ml-half\">\n          <select clrSelect formControlName=\"primaryUnit\" [attr.aria-label]=\"filterStrings.unitAriaLabel\">\n            @for (unit of units; track unit) {\n              <option [ngValue]=\"unit\">\n                {{ filterStrings.getUnitDisplayName(unit) }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n      }\n    </div>\n  }\n  @if (!additionalPredicate && !filterProperty.singleCondition) {\n    <button\n      class=\"btn btn-sm btn-link mt-half\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addCondition\"\n      (click)=\"enableSecondaryPredicate()\"\n    >\n      <cds-icon shape=\"plus\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addCondition }}\n    </button>\n  }\n  @if (additionalPredicate) {\n    <div>\n      @if (filterProperty.logicalOperator == undefined) {\n        <clr-radio-container clrInline class=\"mt-compact\">\n          <clr-radio-wrapper>\n            <input\n              type=\"radio\"\n              clrRadio\n              formControlName=\"logicalOperator\"\n              [value]=\"logicalOperators[0]\"\n              [attr.disabled]=\"isEmptyPrimaryPredicate || isEmptySecondaryPredicate ? 'disabled' : null\"\n            />\n            <label> {{ filterStrings.getConjoinerDisplayName(logicalOperators[0]) }} </label>\n          </clr-radio-wrapper>\n          <clr-radio-wrapper>\n            <input type=\"radio\" clrRadio formControlName=\"logicalOperator\" [value]=\"logicalOperators[1]\" />\n            <label> {{ filterStrings.getConjoinerDisplayName(logicalOperators[1]) }} </label>\n          </clr-radio-wrapper>\n        </clr-radio-container>\n      }\n      @if (filterProperty.logicalOperator != undefined) {\n        <div class=\"clr-control-container\" cds-layout=\"m-t:sm\">\n          <span data-test-id=\"logical-operator\" cds-text=\"body medium\">{{\n            filterStrings.getConjoinerDisplayName(filterProperty.logicalOperator)\n          }}</span>\n        </div>\n      }\n      <div class=\"flex-end-container\">\n        <clr-select-container class=\"form-control-compact\">\n          <label class=\"clr-control-label\">\n            {{ filterStrings.operatorLabel }}\n          </label>\n          <select clrSelect formControlName=\"secondaryOperator\">\n            @for (operator of comparisonOperators; track operator) {\n              <option [ngValue]=\"operator\">\n                {{ filterStrings.getOperatorDisplayName(operator) }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n        <button\n          class=\"close ml-half\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeConditionAriaLabel\"\n          (click)=\"disableSecondaryPredicate()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n      @if (!isEmptySecondaryPredicate) {\n        <div class=\"flex-container\">\n          <clr-input-container>\n            <input\n              type=\"text\"\n              formControlName=\"secondaryValue\"\n              placeholder=\"{{ filterStrings.enterValue }}\"\n              clrInput\n              (keydown)=\"onInputKeyPress($event)\"\n            />\n            <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n              filterStrings.requiredValidatorMessage\n            }}</clr-control-error>\n            <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n              filterStrings.integerValidatorMessage\n            }}</clr-control-error>\n          </clr-input-container>\n          @if (isNumericUnitProperty) {\n            <clr-select-container class=\"ml-half\">\n              <select clrSelect formControlName=\"secondaryUnit\">\n                @for (unit of units; track unit) {\n                  <option [ngValue]=\"unit\">\n                    {{ filterStrings.getUnitDisplayName(unit) }}\n                  </option>\n                }\n              </select>\n            </clr-select-container>\n          }\n        </div>\n      }\n    </div>\n  }\n</appfx-filter-form>\n", styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: i1.FormBuilder }, { type: DatagridFiltersStrings }], propDecorators: { propertyFilter: [{
                type: Input
            }], filterCriteriaChange: [{
                type: Output
            }], filterProperty: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const enterKey$2 = 'Enter';
const spaceKey$1 = 'Space';
/**
 * Directive which renders a clickable "X" on the right side of a Clarity label badge.
 * A "close" event is emitted when the "X" is clicked.
 * The directive is needed in order to be able to remove filtering criteria,
 * which are displayed in Clarity label badges.
 */
class DismissableDirective {
    constructor(renderer, elRef) {
        this.renderer = renderer;
        this.elRef = elRef;
        this.dismiss = new EventEmitter();
    }
    ngAfterViewInit() {
        const icon = this.renderer.createElement('cds-icon');
        icon.setAttribute('shape', 'window-close');
        icon.setAttribute('class', 'remove-filter');
        icon.setAttribute('role', 'button');
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('aria-label', this.dismissAriaLabel);
        icon.style.margin = '1rem';
        this.renderer.setStyle(icon, 'margin-left', '0.5rem');
        this.renderer.setStyle(icon, 'margin-right', '0rem');
        this.renderer.setStyle(icon, 'cursor', 'pointer');
        this.renderer.appendChild(this.elRef.nativeElement, icon);
        this.renderer.listen(icon, 'click', () => {
            this.dismiss.emit();
            return true;
        });
        this.renderer.listen(icon, 'keydown', (event) => {
            if (event.key === enterKey$2 || event.key === spaceKey$1) {
                this.dismiss.emit();
            }
            return true;
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DismissableDirective, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: DismissableDirective, isStandalone: false, selector: "[dismissable]", inputs: { dismissAriaLabel: "dismissAriaLabel" }, outputs: { dismiss: "dismiss" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DismissableDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[dismissable]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { dismissAriaLabel: [{
                type: Input
            }], dismiss: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const enterKey$1 = 'Enter';
const spaceKey = 'Space';
class ManageFilterComponent {
    constructor(filterStrings) {
        this.filterStrings = filterStrings;
        /**
         * Event emitter to tell hosting view that filtering criteria have changed
         */
        this.filterCriteriaChange = new EventEmitter();
        this.stringPropertyType = PropertyType.String;
        this.enumPropertyType = PropertyType.Enum;
        this.numericPropertyType = PropertyType.Numeric;
        this.dateTimePropertyType = PropertyType.DateTime;
        this.openPrimaryConditionSignPost = false;
        this.openSecondaryConditionSignPost = false;
        this.primaryConditionDisplayText = '';
        this.secondaryConditionDisplayText = '';
        this.editFilterAriaLabel = '';
        this.noDisplayValueOperators = [
            ComparisonOperator.IsEmpty,
            ComparisonOperator.LastDay,
            ComparisonOperator.LastWeek,
            ComparisonOperator.LastMonth,
            ComparisonOperator.LastYear,
        ];
    }
    ngOnInit() {
        this.managedProperty = this.propertyFilter.criteria[0].filterableProperty;
        if (this.isStringProperty(this.managedProperty)) {
            this.managedPropertyType = PropertyType.String;
            this.stringProperty = this.castStringProperty();
        }
        else if (this.isEnumProperty(this.managedProperty)) {
            this.managedPropertyType = PropertyType.Enum;
            this.enumProperty = this.castEnumProperty();
        }
        else if (this.isNumericProperty(this.managedProperty)) {
            this.managedPropertyType = PropertyType.Numeric;
            this.numericProperty = this.castNumericProperty();
        }
        else if (this.isDateTimeProperty(this.managedProperty)) {
            this.managedPropertyType = PropertyType.DateTime;
            this.dateTimeProperty = this.castDateTimeProperty();
        }
        this.updateDisplayValues();
    }
    onEditFilterKeyPress(event, index) {
        if (event.target instanceof Element) {
            const targetElement = event.target;
            if (targetElement.classList.contains('edit-filter') && (event.key === enterKey$1 || event.key === spaceKey)) {
                if (index === 0) {
                    this.openPrimaryConditionSignPost = !this.openPrimaryConditionSignPost;
                }
                else if (index === 1) {
                    this.openSecondaryConditionSignPost = !this.openSecondaryConditionSignPost;
                }
            }
        }
    }
    removeFilter(index) {
        // 3 or more criteria are displayed as one group
        // For this reason, they are removed together
        if (this.propertyFilter.criteria.length > 2 || this.managedPropertyType === PropertyType.DateTime) {
            this.propertyFilter.criteria = [];
        }
        else {
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
    onFilterCriteriaChange(propertyFilter) {
        if (propertyFilter) {
            this.filterCriteriaChange.emit(propertyFilter);
        }
        this.openPrimaryConditionSignPost = false;
        this.openSecondaryConditionSignPost = false;
    }
    updateDisplayValues() {
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
    displayFilterValue(index) {
        if (this.isDateTimeProperty(this.managedProperty)) {
            return this.displayDateTimeFilter();
        }
        const appliedConditions = this.propertyFilter.criteria.length;
        if (appliedConditions > 2) {
            return appliedConditions + ' ' + this.filterStrings.appliedText;
        }
        if (this.propertyFilter.criteria[index].operator === ComparisonOperator.IsEmpty) {
            return this.operatorDisplayName(this.propertyFilter.criteria[index].operator);
        }
        const property = this.propertyFilter.criteria[index].filterableProperty;
        let value = this.propertyFilter.criteria[index].value;
        if (this.isEnumProperty(property)) {
            const enumProperty = property;
            value = enumProperty.values.get(this.propertyFilter.criteria[index].value);
        }
        else if (this.isNumericUnitFilterProperty(property)) {
            value = property.selectedValue[index] + ' ' + this.filterStrings.getUnitDisplayName(property.selectedUnit[index]);
        }
        return this.operatorDisplayName(this.propertyFilter.criteria[index].operator) + ': ' + value;
    }
    displayDateTimeFilter() {
        const operator = this.propertyFilter.criteria[0].filterableProperty.selectedOperator;
        if (operator === ComparisonOperator.CustomRange) {
            const displayValue = this.filterStrings.fromLabel +
                ': ' +
                this.formatDateTimeValue(this.propertyFilter.criteria[0].filterableProperty.selectedValue) +
                ' ' +
                this.filterStrings.toLabel +
                ': ' +
                this.formatDateTimeValue(this.propertyFilter.criteria[0].filterableProperty.selectedValueTo);
            return displayValue;
        }
        else if (this.isNoDisplayValueOperator(operator)) {
            return this.operatorDisplayName(operator);
        }
        else if (operator === ComparisonOperator.TimeSpan) {
            const timeSpanValue = this.propertyFilter.criteria[0].filterableProperty.selectedTimeSpanValue;
            const timeSpan = this.propertyFilter.criteria[0].filterableProperty.selectedTimeSpan;
            return (this.operatorDisplayName(operator) +
                ': ' +
                timeSpanValue +
                ' ' +
                this.filterStrings.getTimeSpanDisplayName(timeSpan));
        }
        else {
            const filterValue = this.formatDateTimeValue(this.propertyFilter.criteria[0].filterableProperty.selectedValue);
            return this.operatorDisplayName(operator) + ': ' + filterValue;
        }
    }
    isNoDisplayValueOperator(operator) {
        return this.noDisplayValueOperators.includes(operator);
    }
    formatDateTimeValue(dateTime) {
        if (!dateTime) {
            return dateTime;
        }
        return dateTime.replace('T', ' ');
    }
    isStringProperty(property) {
        return property instanceof StringPropertyDefinition;
    }
    isEnumProperty(property) {
        return property instanceof EnumPropertyDefinition;
    }
    isNumericProperty(property) {
        return property instanceof NumericPropertyDefinition;
    }
    isDateTimeProperty(property) {
        return property instanceof DateTimePropertyDefinition;
    }
    isNumericUnitFilterProperty(property) {
        return this.isNumericProperty(property) && property.unit !== undefined;
    }
    castStringProperty() {
        return this.managedProperty;
    }
    castEnumProperty() {
        return this.managedProperty;
    }
    castNumericProperty() {
        return this.managedProperty;
    }
    castDateTimeProperty() {
        return this.managedProperty;
    }
    operatorDisplayName(operator) {
        return this.filterStrings.getOperatorDisplayName(operator);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ManageFilterComponent, deps: [{ token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ManageFilterComponent, isStandalone: false, selector: "appfx-manage-filter", inputs: { propertyFilter: "propertyFilter" }, outputs: { filterCriteriaChange: "filterCriteriaChange" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<span class=\"label label-blue\">\n  {{ managedProperty.displayName }}\n  <span\n    class=\"badge\"\n    dismissable\n    [dismissAriaLabel]=\"\n      filterStrings.removeFilterText + ' ' + managedProperty.displayName + ' ' + primaryConditionDisplayText\n    \"\n    (dismiss)=\"removeFilter(0)\"\n  >\n    <clr-signpost>\n      <span\n        clrSignpostTrigger\n        class=\"edit-filter\"\n        tabindex=\"0\"\n        role=\"button\"\n        [attr.aria-label]=\"editFilterAriaLabel\"\n        (keydown)=\"onEditFilterKeyPress($event, 0)\"\n      >\n        {{ primaryConditionDisplayText }}\n      </span>\n      <ng-template [(clrIfOpen)]=\"openPrimaryConditionSignPost\">\n        <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n          <clr-select-container class=\"mt-0\">\n            <label class=\"clr-control-label\">\n              {{ this.filterStrings.filterLabel }}\n            </label>\n            <select clrSelect [(ngModel)]=\"managedProperty\" disabled>\n              <option [ngValue]=\"managedProperty\">\n                {{ managedProperty.displayName }}\n              </option>\n            </select>\n          </clr-select-container>\n          @switch (managedPropertyType) {\n            @case (stringPropertyType) {\n              <appfx-general-filter\n                [filterProperty]=\"stringProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-general-filter>\n            }\n            @case (numericPropertyType) {\n              <appfx-general-filter\n                [filterProperty]=\"numericProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-general-filter>\n            }\n            @case (enumPropertyType) {\n              <appfx-enum-filter\n                [filterProperty]=\"enumProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-enum-filter>\n            }\n            @case (dateTimePropertyType) {\n              <appfx-datetime-filter\n                [filterProperty]=\"dateTimeProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-datetime-filter>\n            }\n          }\n        </clr-signpost-content>\n      </ng-template>\n    </clr-signpost>\n  </span>\n  @if (propertyFilter.criteria.length === 2 && managedPropertyType !== dateTimePropertyType) {\n    <span class=\"text-lower\">\n      {{ this.filterStrings.getConjoinerDisplayName(propertyFilter.operator) }}\n    </span>\n  }\n  @if (propertyFilter.criteria.length === 2 && managedPropertyType !== dateTimePropertyType) {\n    <span\n      class=\"badge\"\n      dismissable\n      [dismissAriaLabel]=\"\n        this.filterStrings.removeFilterText + managedProperty.displayName + ' ' + secondaryConditionDisplayText\n      \"\n      (dismiss)=\"removeFilter(1)\"\n    >\n      <clr-signpost>\n        <span\n          clrSignpostTrigger\n          class=\"edit-filter\"\n          tabindex=\"0\"\n          role=\"button\"\n          [attr.aria-label]=\"editFilterAriaLabel\"\n          (keydown)=\"onEditFilterKeyPress($event, 1)\"\n        >\n          {{ secondaryConditionDisplayText }}\n        </span>\n        <ng-template [(clrIfOpen)]=\"openSecondaryConditionSignPost\">\n          <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n            <clr-select-container class=\"mt-0\">\n              <label class=\"clr-control-label\">\n                {{ this.filterStrings.filterLabel }}\n              </label>\n              <select clrSelect [(ngModel)]=\"managedProperty\" disabled>\n                <option [ngValue]=\"managedProperty\">\n                  {{ managedProperty.displayName }}\n                </option>\n              </select>\n            </clr-select-container>\n            @switch (managedPropertyType) {\n              @case (stringPropertyType) {\n                <appfx-general-filter\n                  [filterProperty]=\"stringProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-general-filter>\n              }\n              @case (numericPropertyType) {\n                <appfx-general-filter\n                  [filterProperty]=\"numericProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-general-filter>\n              }\n              @case (enumPropertyType) {\n                <appfx-enum-filter\n                  [filterProperty]=\"enumProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-enum-filter>\n              }\n            }\n          </clr-signpost-content>\n        </ng-template>\n      </clr-signpost>\n    </span>\n  }\n</span>\n", styles: [".filter-remove-btn{background:transparent;border:none;cursor:pointer}.text-lower{text-transform:lowercase}:host-context(body[data-theme=light]) :host-context(.user-tabbing) .edit-filter:focus,:host-context(body[data-theme=light]) :host-context(.user-tabbing) .remove-filter:focus{outline:2px solid #000}:host-context(body[data-theme=light]) :host-context(.user-tabbing) .edit-filter:focus{outline-offset:1px}:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .edit-filter:focus,:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .remove-filter:focus{outline:2px solid #fafafa}:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .edit-filter:focus{outline-offset:1px}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i4.ClrSelect, selector: "[clrSelect]" }, { kind: "component", type: i4.ClrSelectContainer, selector: "clr-select-container" }, { kind: "component", type: i4$1.ClrSignpost, selector: "clr-signpost", inputs: ["clrSignpostTriggerAriaLabel"] }, { kind: "component", type: i4$1.ClrSignpostContent, selector: "clr-signpost-content", inputs: ["clrSignpostCloseAriaLabel", "clrPosition"] }, { kind: "directive", type: i4$1.ClrSignpostTrigger, selector: "[clrSignpostTrigger]" }, { kind: "directive", type: i5$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "directive", type: i1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: DateTimeFilterComponent, selector: "appfx-datetime-filter", inputs: ["propertyFilter", "filterProperty"], outputs: ["filterCriteriaChange"] }, { kind: "directive", type: DismissableDirective, selector: "[dismissable]", inputs: ["dismissAriaLabel"], outputs: ["dismiss"] }, { kind: "component", type: EnumFilterComponent, selector: "appfx-enum-filter", inputs: ["filterProperty", "propertyFilter"], outputs: ["filterCriteriaChange"] }, { kind: "directive", type: FilterPopoverRepositionDirective, selector: "[filterPopoverReposition]" }, { kind: "component", type: GeneralFilterComponent, selector: "appfx-general-filter", inputs: ["propertyFilter", "filterProperty"], outputs: ["filterCriteriaChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ManageFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-manage-filter', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<span class=\"label label-blue\">\n  {{ managedProperty.displayName }}\n  <span\n    class=\"badge\"\n    dismissable\n    [dismissAriaLabel]=\"\n      filterStrings.removeFilterText + ' ' + managedProperty.displayName + ' ' + primaryConditionDisplayText\n    \"\n    (dismiss)=\"removeFilter(0)\"\n  >\n    <clr-signpost>\n      <span\n        clrSignpostTrigger\n        class=\"edit-filter\"\n        tabindex=\"0\"\n        role=\"button\"\n        [attr.aria-label]=\"editFilterAriaLabel\"\n        (keydown)=\"onEditFilterKeyPress($event, 0)\"\n      >\n        {{ primaryConditionDisplayText }}\n      </span>\n      <ng-template [(clrIfOpen)]=\"openPrimaryConditionSignPost\">\n        <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n          <clr-select-container class=\"mt-0\">\n            <label class=\"clr-control-label\">\n              {{ this.filterStrings.filterLabel }}\n            </label>\n            <select clrSelect [(ngModel)]=\"managedProperty\" disabled>\n              <option [ngValue]=\"managedProperty\">\n                {{ managedProperty.displayName }}\n              </option>\n            </select>\n          </clr-select-container>\n          @switch (managedPropertyType) {\n            @case (stringPropertyType) {\n              <appfx-general-filter\n                [filterProperty]=\"stringProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-general-filter>\n            }\n            @case (numericPropertyType) {\n              <appfx-general-filter\n                [filterProperty]=\"numericProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-general-filter>\n            }\n            @case (enumPropertyType) {\n              <appfx-enum-filter\n                [filterProperty]=\"enumProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-enum-filter>\n            }\n            @case (dateTimePropertyType) {\n              <appfx-datetime-filter\n                [filterProperty]=\"dateTimeProperty\"\n                [propertyFilter]=\"propertyFilter\"\n                (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n              >\n              </appfx-datetime-filter>\n            }\n          }\n        </clr-signpost-content>\n      </ng-template>\n    </clr-signpost>\n  </span>\n  @if (propertyFilter.criteria.length === 2 && managedPropertyType !== dateTimePropertyType) {\n    <span class=\"text-lower\">\n      {{ this.filterStrings.getConjoinerDisplayName(propertyFilter.operator) }}\n    </span>\n  }\n  @if (propertyFilter.criteria.length === 2 && managedPropertyType !== dateTimePropertyType) {\n    <span\n      class=\"badge\"\n      dismissable\n      [dismissAriaLabel]=\"\n        this.filterStrings.removeFilterText + managedProperty.displayName + ' ' + secondaryConditionDisplayText\n      \"\n      (dismiss)=\"removeFilter(1)\"\n    >\n      <clr-signpost>\n        <span\n          clrSignpostTrigger\n          class=\"edit-filter\"\n          tabindex=\"0\"\n          role=\"button\"\n          [attr.aria-label]=\"editFilterAriaLabel\"\n          (keydown)=\"onEditFilterKeyPress($event, 1)\"\n        >\n          {{ secondaryConditionDisplayText }}\n        </span>\n        <ng-template [(clrIfOpen)]=\"openSecondaryConditionSignPost\">\n          <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n            <clr-select-container class=\"mt-0\">\n              <label class=\"clr-control-label\">\n                {{ this.filterStrings.filterLabel }}\n              </label>\n              <select clrSelect [(ngModel)]=\"managedProperty\" disabled>\n                <option [ngValue]=\"managedProperty\">\n                  {{ managedProperty.displayName }}\n                </option>\n              </select>\n            </clr-select-container>\n            @switch (managedPropertyType) {\n              @case (stringPropertyType) {\n                <appfx-general-filter\n                  [filterProperty]=\"stringProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-general-filter>\n              }\n              @case (numericPropertyType) {\n                <appfx-general-filter\n                  [filterProperty]=\"numericProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-general-filter>\n              }\n              @case (enumPropertyType) {\n                <appfx-enum-filter\n                  [filterProperty]=\"enumProperty\"\n                  [propertyFilter]=\"propertyFilter\"\n                  (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n                >\n                </appfx-enum-filter>\n              }\n            }\n          </clr-signpost-content>\n        </ng-template>\n      </clr-signpost>\n    </span>\n  }\n</span>\n", styles: [".filter-remove-btn{background:transparent;border:none;cursor:pointer}.text-lower{text-transform:lowercase}:host-context(body[data-theme=light]) :host-context(.user-tabbing) .edit-filter:focus,:host-context(body[data-theme=light]) :host-context(.user-tabbing) .remove-filter:focus{outline:2px solid #000}:host-context(body[data-theme=light]) :host-context(.user-tabbing) .edit-filter:focus{outline-offset:1px}:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .edit-filter:focus,:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .remove-filter:focus{outline:2px solid #fafafa}:host-context(body[data-theme=dark]) :host-context(.user-tabbing) .edit-filter:focus{outline-offset:1px}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: DatagridFiltersStrings }], propDecorators: { propertyFilter: [{
                type: Input
            }], filterCriteriaChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Pipe used to limit available filter options in a select container.
 * This is needed in order to prevent applying the same filter more than once
 */
class SkipFiltersPipe {
    transform(items, propertyDefinitions) {
        return propertyDefinitions
            ? items.filter((item) => !propertyDefinitions.includes(item))
            : items;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SkipFiltersPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: SkipFiltersPipe, isStandalone: false, name: "skipFilter" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: SkipFiltersPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'skipFilter',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Composite filters component renders different filters based on the type of
 * the corresponding filterable property, e.g., string, enum, number, etc.
 */
class CompositeFiltersComponent {
    constructor(filterStrings) {
        this.filterStrings = filterStrings;
        /**
         * Event emitter to tell hosting view that the filtering conditions have changed
         */
        this.propertyFiltersChange = new EventEmitter();
        this.stringPropertyType = PropertyType.String;
        this.enumPropertyType = PropertyType.Enum;
        this.numericPropertyType = PropertyType.Numeric;
        this.dateTimePropertyType = PropertyType.DateTime;
        this.signPostOpened = false;
        // List of active filters to be sent to the hosting view
        this.propertyFilters = [];
        this.collapsedFilters = false;
        this.showHideFiltersArrowDir = 'left';
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
        }
        else if (this.isEnumProperty(this.selectedFilterableProperty)) {
            this.propertyType = PropertyType.Enum;
            this.enumProperty = this.castEnumProperty();
        }
        else if (this.isNumericProperty(this.selectedFilterableProperty)) {
            this.propertyType = PropertyType.Numeric;
            this.numericProperty = this.castNumericProperty();
        }
        else if (this.isDateTimeProperty(this.selectedFilterableProperty)) {
            this.propertyType = PropertyType.DateTime;
            this.dateTimeProperty = this.castDateTimeProperty();
        }
    }
    onFilterCriteriaChange(propertyFilter) {
        if (propertyFilter) {
            if (propertyFilter.criteria.length > 0) {
                // The property filter contains several filtering criteria.
                // This is either a new filter, or some of the criteria are modified
                let i = this.propertyFilters.length;
                let modified = false;
                while (i--) {
                    // Check whether there is an existing filter for the same property.
                    // If found, replace it with the new filter
                    if (this.propertyFilters[i].criteria[0].filterableProperty.property ===
                        propertyFilter.criteria[0].filterableProperty.property) {
                        this.propertyFilters[i] = propertyFilter;
                        modified = true;
                    }
                }
                // If no existing filter was found, add the new one to the active filters list
                if (!modified) {
                    this.propertyFilters.push(propertyFilter);
                }
            }
            else {
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
    activeFilters() {
        const activeProperties = [];
        this.propertyFilters.forEach(value => {
            if (value.criteria.length > 0) {
                activeProperties.push(value.criteria[0].filterableProperty);
            }
        });
        return activeProperties;
    }
    clearAllFilters() {
        this.propertyFilters = [];
        this.propertyFiltersChange.emit(this.propertyFilters);
        this.preselectFirstProperty();
        this.collapsedFilters = false;
    }
    showHideAllFilters() {
        this.collapsedFilters = !this.collapsedFilters;
        this.updateShowHideLabel();
        this.showHideFiltersArrowDir = this.collapsedFilters ? 'right' : 'left';
    }
    /**
     * Active filters are not displayed in the new filters list.
     * We want to preselect the first displayed property
     */
    preselectFirstProperty() {
        const activeProperties = this.activeFilters();
        const remainingProperties = this.filterableProperties.filter(property => !activeProperties.includes(property));
        if (remainingProperties.length > 0) {
            this.selectedFilterableProperty = remainingProperties[0];
            this.onPropertyChange();
        }
    }
    updateShowHideLabel() {
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
    isStringProperty(property) {
        return property instanceof StringPropertyDefinition;
    }
    isEnumProperty(property) {
        return property instanceof EnumPropertyDefinition;
    }
    isNumericProperty(property) {
        return property instanceof NumericPropertyDefinition;
    }
    isDateTimeProperty(property) {
        return property instanceof DateTimePropertyDefinition;
    }
    castStringProperty() {
        return this.selectedFilterableProperty;
    }
    castEnumProperty() {
        return this.selectedFilterableProperty;
    }
    castNumericProperty() {
        return this.selectedFilterableProperty;
    }
    castDateTimeProperty() {
        return this.selectedFilterableProperty;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CompositeFiltersComponent, deps: [{ token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: CompositeFiltersComponent, isStandalone: false, selector: "appfx-composite-filter", inputs: { filterableProperties: "filterableProperties" }, outputs: { propertyFiltersChange: "propertyFiltersChange" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"composite-filter-container\">\n  <clr-signpost class=\"height-standard\">\n    <button\n      clrSignpostTrigger\n      class=\"btn btn-sm btn-link btn-compact\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      [disabled]=\"filterableProperties.length === propertyFilters.length\"\n    >\n      <cds-icon size=\"20\" shape=\"filter-grid\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addNew }}\n    </button>\n    <ng-template [(clrIfOpen)]=\"signPostOpened\">\n      <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n        <clr-select-container class=\"mt-0\">\n          <label class=\"clr-control-label\"> {{ filterStrings.filterLabel }} </label>\n          <select clrSelect [(ngModel)]=\"selectedFilterableProperty\" (ngModelChange)=\"onPropertyChange()\">\n            @for (property of filterableProperties | skipFilter: activeFilters(); track property) {\n              <option [ngValue]=\"property\">\n                {{ property.displayName }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n        @switch (propertyType) {\n          @case (stringPropertyType) {\n            <appfx-general-filter\n              [filterProperty]=\"stringProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-general-filter>\n          }\n          @case (numericPropertyType) {\n            <appfx-general-filter\n              [filterProperty]=\"numericProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-general-filter>\n          }\n          @case (enumPropertyType) {\n            <appfx-enum-filter [filterProperty]=\"enumProperty\" (filterCriteriaChange)=\"onFilterCriteriaChange($event)\">\n            </appfx-enum-filter>\n          }\n          @case (dateTimePropertyType) {\n            <appfx-datetime-filter\n              [filterProperty]=\"dateTimeProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-datetime-filter>\n          }\n        }\n      </clr-signpost-content>\n    </ng-template>\n  </clr-signpost>\n  @if (propertyFilters.length > 0) {\n    <div class=\"manage-filter-container\">\n      @for (propertyFilter of propertyFilters; track propertyFilter) {\n        <appfx-manage-filter\n          [hidden]=\"collapsedFilters\"\n          [propertyFilter]=\"propertyFilter\"\n          (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        >\n        </appfx-manage-filter>\n      }\n      <button\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"hide-filters\"\n        [attr.aria-label]=\"showHideFiltersAriaLabel\"\n        (click)=\"showHideAllFilters()\"\n      >\n        <cds-icon shape=\"angle\" class=\"is-solid\" [direction]=\"showHideFiltersArrowDir\"></cds-icon>\n        {{ showHideFiltersLabel }}\n      </button>\n      <button\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"clear-all-button\"\n        [attr.aria-label]=\"filterStrings.clearAllButtonAriaLabel\"\n        (click)=\"clearAllFilters()\"\n      >\n        {{ filterStrings.clearAllButtonLabel }}\n      </button>\n    </div>\n  }\n</div>\n", styles: [".composite-filter-container{display:flex}.height-standard{height:1.2rem}.manage-filter-container{display:flex;flex-wrap:wrap}:host-context(.zoom2x,.zoom4x) .composite-filter-container,:host-context(.zoom2x,.zoom4x) .manage-filter-container{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i4.ClrSelect, selector: "[clrSelect]" }, { kind: "component", type: i4.ClrSelectContainer, selector: "clr-select-container" }, { kind: "component", type: i4$1.ClrSignpost, selector: "clr-signpost", inputs: ["clrSignpostTriggerAriaLabel"] }, { kind: "component", type: i4$1.ClrSignpostContent, selector: "clr-signpost-content", inputs: ["clrSignpostCloseAriaLabel", "clrPosition"] }, { kind: "directive", type: i4$1.ClrSignpostTrigger, selector: "[clrSignpostTrigger]" }, { kind: "directive", type: i5$1.ClrIfOpen, selector: "[clrIfOpen]", inputs: ["clrIfOpen"], outputs: ["clrIfOpenChange"] }, { kind: "directive", type: i1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: DateTimeFilterComponent, selector: "appfx-datetime-filter", inputs: ["propertyFilter", "filterProperty"], outputs: ["filterCriteriaChange"] }, { kind: "component", type: EnumFilterComponent, selector: "appfx-enum-filter", inputs: ["filterProperty", "propertyFilter"], outputs: ["filterCriteriaChange"] }, { kind: "directive", type: FilterPopoverRepositionDirective, selector: "[filterPopoverReposition]" }, { kind: "component", type: GeneralFilterComponent, selector: "appfx-general-filter", inputs: ["propertyFilter", "filterProperty"], outputs: ["filterCriteriaChange"] }, { kind: "component", type: ManageFilterComponent, selector: "appfx-manage-filter", inputs: ["propertyFilter"], outputs: ["filterCriteriaChange"] }, { kind: "pipe", type: SkipFiltersPipe, name: "skipFilter" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: CompositeFiltersComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-composite-filter', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"composite-filter-container\">\n  <clr-signpost class=\"height-standard\">\n    <button\n      clrSignpostTrigger\n      class=\"btn btn-sm btn-link btn-compact\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      [disabled]=\"filterableProperties.length === propertyFilters.length\"\n    >\n      <cds-icon size=\"20\" shape=\"filter-grid\" class=\"is-solid\"></cds-icon>\n      {{ filterStrings.addNew }}\n    </button>\n    <ng-template [(clrIfOpen)]=\"signPostOpened\">\n      <clr-signpost-content [clrPosition]=\"'bottom-middle'\" filterPopoverReposition>\n        <clr-select-container class=\"mt-0\">\n          <label class=\"clr-control-label\"> {{ filterStrings.filterLabel }} </label>\n          <select clrSelect [(ngModel)]=\"selectedFilterableProperty\" (ngModelChange)=\"onPropertyChange()\">\n            @for (property of filterableProperties | skipFilter: activeFilters(); track property) {\n              <option [ngValue]=\"property\">\n                {{ property.displayName }}\n              </option>\n            }\n          </select>\n        </clr-select-container>\n        @switch (propertyType) {\n          @case (stringPropertyType) {\n            <appfx-general-filter\n              [filterProperty]=\"stringProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-general-filter>\n          }\n          @case (numericPropertyType) {\n            <appfx-general-filter\n              [filterProperty]=\"numericProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-general-filter>\n          }\n          @case (enumPropertyType) {\n            <appfx-enum-filter [filterProperty]=\"enumProperty\" (filterCriteriaChange)=\"onFilterCriteriaChange($event)\">\n            </appfx-enum-filter>\n          }\n          @case (dateTimePropertyType) {\n            <appfx-datetime-filter\n              [filterProperty]=\"dateTimeProperty\"\n              (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n            >\n            </appfx-datetime-filter>\n          }\n        }\n      </clr-signpost-content>\n    </ng-template>\n  </clr-signpost>\n  @if (propertyFilters.length > 0) {\n    <div class=\"manage-filter-container\">\n      @for (propertyFilter of propertyFilters; track propertyFilter) {\n        <appfx-manage-filter\n          [hidden]=\"collapsedFilters\"\n          [propertyFilter]=\"propertyFilter\"\n          (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        >\n        </appfx-manage-filter>\n      }\n      <button\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"hide-filters\"\n        [attr.aria-label]=\"showHideFiltersAriaLabel\"\n        (click)=\"showHideAllFilters()\"\n      >\n        <cds-icon shape=\"angle\" class=\"is-solid\" [direction]=\"showHideFiltersArrowDir\"></cds-icon>\n        {{ showHideFiltersLabel }}\n      </button>\n      <button\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"clear-all-button\"\n        [attr.aria-label]=\"filterStrings.clearAllButtonAriaLabel\"\n        (click)=\"clearAllFilters()\"\n      >\n        {{ filterStrings.clearAllButtonLabel }}\n      </button>\n    </div>\n  }\n</div>\n", styles: [".composite-filter-container{display:flex}.height-standard{height:1.2rem}.manage-filter-container{display:flex;flex-wrap:wrap}:host-context(.zoom2x,.zoom4x) .composite-filter-container,:host-context(.zoom2x,.zoom4x) .manage-filter-container{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: DatagridFiltersStrings }], propDecorators: { filterableProperties: [{
                type: Input
            }], propertyFiltersChange: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const enterKey = 'Enter';
const searchTermDebounceTimeMs = 2000;
/**
 * Component provides the ability to choose from quick filter (search)
 * and advanced filter (composite filters).
 */
class DataGridFiltersComponent {
    constructor(filterStrings) {
        this.filterStrings = filterStrings;
        this.quickMode = FilterMode.Quick;
        this.advancedMode = FilterMode.Advanced;
        this.advancedOnlyMode = FilterMode.AdvancedOnly;
        this.mode = FilterMode.Quick;
        this.selectedFilterMode = FilterMode.Quick;
        /**
         * Event emitter to tell hosting view that search term, used for filtering
         * has changed.
         */
        this.searchTermChange = new EventEmitter();
        this.propertyFiltersChange = new EventEmitter();
        this.lastSearchTerm = '';
        // When the user is typing in the search input (filter)
        // the search term change event will be fired
        // on every 2 sec.
        this.searchTermDebouncer = new Subject();
        this.unsubscribeSubject = new Subject();
        this.appliedFiltersCount = 0;
    }
    /**
     * Quick, Advanced or AdvancedOnly. Default Quick.
     */
    set filterMode(filterMode) {
        if (filterMode !== null && filterMode !== undefined) {
            this.mode = filterMode;
        }
    }
    ngAfterViewInit() {
        this.searchTermDebouncer
            .pipe(debounceTime(searchTermDebounceTimeMs), distinctUntilChanged(), takeUntil(this.unsubscribeSubject))
            .subscribe((search) => {
            this.doSearch(search);
        });
    }
    ngOnDestroy() {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    }
    onFilterModeChange() {
        // Reset quick search data when switching to advanced mode
        if (this.selectedFilterMode === FilterMode.Advanced && !!this.searchTerm) {
            this.searchTerm = '';
            this.doSearch(this.searchTerm);
            // Clear debouncer last value
            this.searchTermDebouncer.next(this.searchTerm);
        }
        // Clear applied filters when switching to quick mode
        if (this.selectedFilterMode === FilterMode.Quick && this.appliedFiltersCount > 0) {
            this.appliedFiltersCount = 0;
            this.propertyFiltersChange.emit([]);
        }
    }
    onFilterCriteriaChange(propertyFilters) {
        this.appliedFiltersCount = propertyFilters.length;
        this.propertyFiltersChange.emit(propertyFilters);
    }
    onSearchInputKeyPress(event) {
        if (event.key === enterKey) {
            this.doSearch(this.searchTerm);
        }
    }
    onSearchTermChanged(searchTerm) {
        this.searchTerm = searchTerm;
        this.searchTermDebouncer.next(this.searchTerm);
    }
    doSearch(search) {
        search = search.trim();
        if (this.lastSearchTerm !== search) {
            this.lastSearchTerm = search;
            this.searchTermChange.emit(search);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DataGridFiltersComponent, deps: [{ token: DatagridFiltersStrings }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: DataGridFiltersComponent, isStandalone: false, selector: "appfx-datagrid-filters", inputs: { filterableProperties: "filterableProperties", filterMode: "filterMode" }, outputs: { searchTermChange: "searchTermChange", propertyFiltersChange: "propertyFiltersChange" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div data-test-id=\"appfx-advanced-datagrid-filter\" class=\"filter-container\">\n  @switch (mode) {\n    @case (quickMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.quickFilter }}\n      </label>\n    }\n    @case (advancedOnlyMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.advancedFilter }}\n      </label>\n    }\n    @case (advancedMode) {\n      <clr-select-container class=\"form-control-compact\">\n        <select clrSelect [(ngModel)]=\"selectedFilterMode\" (ngModelChange)=\"onFilterModeChange()\">\n          <option [ngValue]=\"quickMode\">{{ filterStrings.quickFilter }}</option>\n          <option [ngValue]=\"advancedMode\">{{ filterStrings.advancedFilter }}</option>\n        </select>\n      </clr-select-container>\n    }\n  }\n  @if (selectedFilterMode === quickMode && mode !== advancedOnlyMode) {\n    <clr-input-container class=\"ml-half form-control-compact\">\n      <label class=\"clr-sr-only\"> {{ filterStrings.quickFilter }} </label>\n      <input\n        type=\"text\"\n        (keydown)=\"onSearchInputKeyPress($event)\"\n        [ngModel]=\"searchTerm\"\n        (ngModelChange)=\"onSearchTermChanged($event)\"\n        placeholder=\"{{ filterStrings.enterValue }}\"\n        clrInput\n      />\n    </clr-input-container>\n  }\n  @if (selectedFilterMode === advancedMode || mode === advancedOnlyMode) {\n    <appfx-composite-filter\n      class=\"filter-contents\"\n      [filterableProperties]=\"filterableProperties\"\n      (propertyFiltersChange)=\"onFilterCriteriaChange($event)\"\n    >\n    </appfx-composite-filter>\n  }\n</div>\n", styles: [".filter-container{display:flex;align-items:baseline;margin-left:.2rem}:host-context(.zoom2x,.zoom4x) .filter-container{flex-wrap:wrap}:host-context(.zoom2x,.zoom4x) .filter-contents{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"], dependencies: [{ kind: "directive", type: i2.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i4.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i4.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i4.ClrSelect, selector: "[clrSelect]" }, { kind: "component", type: i4.ClrSelectContainer, selector: "clr-select-container" }, { kind: "directive", type: i1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: CompositeFiltersComponent, selector: "appfx-composite-filter", inputs: ["filterableProperties"], outputs: ["propertyFiltersChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, preserveWhitespaces: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DataGridFiltersComponent, decorators: [{
            type: Component,
            args: [{ selector: 'appfx-datagrid-filters', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div data-test-id=\"appfx-advanced-datagrid-filter\" class=\"filter-container\">\n  @switch (mode) {\n    @case (quickMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.quickFilter }}\n      </label>\n    }\n    @case (advancedOnlyMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.advancedFilter }}\n      </label>\n    }\n    @case (advancedMode) {\n      <clr-select-container class=\"form-control-compact\">\n        <select clrSelect [(ngModel)]=\"selectedFilterMode\" (ngModelChange)=\"onFilterModeChange()\">\n          <option [ngValue]=\"quickMode\">{{ filterStrings.quickFilter }}</option>\n          <option [ngValue]=\"advancedMode\">{{ filterStrings.advancedFilter }}</option>\n        </select>\n      </clr-select-container>\n    }\n  }\n  @if (selectedFilterMode === quickMode && mode !== advancedOnlyMode) {\n    <clr-input-container class=\"ml-half form-control-compact\">\n      <label class=\"clr-sr-only\"> {{ filterStrings.quickFilter }} </label>\n      <input\n        type=\"text\"\n        (keydown)=\"onSearchInputKeyPress($event)\"\n        [ngModel]=\"searchTerm\"\n        (ngModelChange)=\"onSearchTermChanged($event)\"\n        placeholder=\"{{ filterStrings.enterValue }}\"\n        clrInput\n      />\n    </clr-input-container>\n  }\n  @if (selectedFilterMode === advancedMode || mode === advancedOnlyMode) {\n    <appfx-composite-filter\n      class=\"filter-contents\"\n      [filterableProperties]=\"filterableProperties\"\n      (propertyFiltersChange)=\"onFilterCriteriaChange($event)\"\n    >\n    </appfx-composite-filter>\n  }\n</div>\n", styles: [".filter-container{display:flex;align-items:baseline;margin-left:.2rem}:host-context(.zoom2x,.zoom4x) .filter-container{flex-wrap:wrap}:host-context(.zoom2x,.zoom4x) .filter-contents{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:.3rem}.btn-compact{min-width:1.2rem;padding:0;margin:0 .4rem}.btn-right{float:right;margin-right:0;margin-top:.9rem;margin-left:.3rem}.mt-half{margin-top:.6rem}.mt-compact{margin-top:.9rem}.mb-compact{margin-bottom:.9rem}.ml-half{margin-left:.6rem}.mt-0{margin-top:0}.mb-0{margin-bottom:0}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto}select{max-width:18rem;text-overflow:ellipsis}clr-signpost-content{max-width:20rem}.flex-end-container{display:flex;align-items:flex-end}.flex-container{display:flex}\n"] }]
        }], ctorParameters: () => [{ type: DatagridFiltersStrings }], propDecorators: { filterableProperties: [{
                type: Input
            }], searchTermChange: [{
                type: Output
            }], propertyFiltersChange: [{
                type: Output
            }], filterMode: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function datagridFiltersStringsServiceFactory(existing) {
    return existing || new DatagridFiltersStrings();
}
class AppfxDatagridFiltersModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon, filterGridIcon, plusIcon, windowCloseIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridFiltersModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridFiltersModule, declarations: [CompositeFiltersComponent,
            DataGridFiltersComponent,
            DateTimeFilterComponent,
            DismissableDirective,
            EnumFilterComponent,
            FilterFormComponent,
            FilterPopoverRepositionDirective,
            GeneralFilterComponent,
            ManageFilterComponent,
            SkipFiltersPipe], imports: [ClrCheckboxModule,
            ClrIcon,
            ClrInputModule,
            ClrRadioModule,
            ClrSelectModule,
            ClrSignpostModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule], exports: [CompositeFiltersComponent, DataGridFiltersComponent, FilterFormComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridFiltersModule, providers: [
            DatePipe,
            {
                // This pattern allows the importer of this module to specify its own DatagridFiltersStrings.
                provide: DatagridFiltersStrings,
                useFactory: datagridFiltersStringsServiceFactory,
                deps: [[new Optional(), new SkipSelf(), DatagridFiltersStrings]],
            },
        ], imports: [ClrCheckboxModule,
            ClrIcon,
            ClrInputModule,
            ClrRadioModule,
            ClrSelectModule,
            ClrSignpostModule,
            CommonModule,
            FormsModule,
            ReactiveFormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: AppfxDatagridFiltersModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        CompositeFiltersComponent,
                        DataGridFiltersComponent,
                        DateTimeFilterComponent,
                        DismissableDirective,
                        EnumFilterComponent,
                        FilterFormComponent,
                        FilterPopoverRepositionDirective,
                        GeneralFilterComponent,
                        ManageFilterComponent,
                        SkipFiltersPipe,
                    ],
                    imports: [
                        ClrCheckboxModule,
                        ClrIcon,
                        ClrInputModule,
                        ClrRadioModule,
                        ClrSelectModule,
                        ClrSignpostModule,
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                    ],
                    exports: [CompositeFiltersComponent, DataGridFiltersComponent, FilterFormComponent],
                    providers: [
                        DatePipe,
                        {
                            // This pattern allows the importer of this module to specify its own DatagridFiltersStrings.
                            provide: DatagridFiltersStrings,
                            useFactory: datagridFiltersStringsServiceFactory,
                            deps: [[new Optional(), new SkipSelf(), DatagridFiltersStrings]],
                        },
                    ],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppfxDatagridFiltersModule, ComparisonOperator, CompositeFiltersComponent, DataGridFiltersComponent, AppfxDatagridFiltersModule as DatagridFiltersModule, DatagridFiltersStrings, DateTimePropertyDefinition, EnumPropertyDefinition, FilterFormComponent, FilterMode, FilterablePropertyDefinition, LogicalOperator, NumericPropertyDefinition, PropertyFilter, PropertyPredicate, StringPropertyDefinition, Unit };
//# sourceMappingURL=clr-addons-datagrid-filters.mjs.map
