import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, EventEmitter, Injectable, Injector, Input, LOCALE_ID, NgModule, Optional, Output, SkipSelf, ViewChild, ViewChildren, afterNextRender, computed, inject, signal } from "@angular/core";
import * as i6$1 from "@clr/angular/forms";
import { ClrCheckboxModule, ClrCombobox, ClrComboboxModule, ClrDatepickerModule, ClrInputModule, ClrLocaleDateFormat, ClrRadioModule, ClrSelectModule } from "@clr/angular/forms";
import * as i2 from "@clr/angular/popover/common";
import { ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverPosition, ClrPopoverService, ClrPopoverType } from "@clr/angular/popover/common";
import { uniqueIdFactory } from "@clr/angular/utils";
import * as i3 from "@angular/cdk/a11y";
import { A11yModule } from "@angular/cdk/a11y";
import * as i5 from "@clr/angular/emphasis/label";
import { ClrLabel } from "@clr/angular/emphasis/label";
import * as i2$2 from "@clr/angular/forms/common";
import * as i5$1 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleIcon, checkIcon, plusIcon, searchIcon, windowCloseIcon } from "@clr/angular/icon";
import * as i7 from "@clr/angular/popover/tooltip";
import { ClrTooltipModule } from "@clr/angular/popover/tooltip";
import * as i2$1 from "@angular/common";
import { CommonModule, DatePipe, formatDate } from "@angular/common";
import * as i3$1 from "@angular/forms";
import { FormArray, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from "rxjs/operators";
import * as i6 from "@clr/angular/progress/spinner";
import { ClrSpinnerModule } from "@clr/angular/progress/spinner";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Subject, distinctUntilChanged as distinctUntilChanged$1, map, of } from "rxjs";
import * as i4 from "@clr/angular/emphasis/badge";
import { ClrBadge } from "@clr/angular/emphasis/badge";
var ComparisonOperator;
(function(ComparisonOperator) {
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
(function(LogicalOperator) {
	LogicalOperator[LogicalOperator["And"] = 0] = "And";
	LogicalOperator[LogicalOperator["Or"] = 1] = "Or";
})(LogicalOperator || (LogicalOperator = {}));
var FilterMode;
(function(FilterMode) {
	FilterMode[FilterMode["Quick"] = 0] = "Quick";
	FilterMode[FilterMode["Advanced"] = 1] = "Advanced";
	FilterMode[FilterMode["AdvancedOnly"] = 2] = "AdvancedOnly";
	FilterMode[FilterMode["Combined"] = 3] = "Combined";
})(FilterMode || (FilterMode = {}));
var PropertyType;
(function(PropertyType) {
	PropertyType[PropertyType["String"] = 0] = "String";
	PropertyType[PropertyType["Enum"] = 1] = "Enum";
	PropertyType[PropertyType["Numeric"] = 2] = "Numeric";
	PropertyType[PropertyType["DateTime"] = 3] = "DateTime";
	PropertyType[PropertyType["User"] = 4] = "User";
})(PropertyType || (PropertyType = {}));
var Unit;
(function(Unit) {
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
(function(TimeSpan) {
	TimeSpan[TimeSpan["Minutes"] = 0] = "Minutes";
	TimeSpan[TimeSpan["Hours"] = 1] = "Hours";
	TimeSpan[TimeSpan["Days"] = 2] = "Days";
	TimeSpan[TimeSpan["Weeks"] = 3] = "Weeks";
	TimeSpan[TimeSpan["Months"] = 4] = "Months";
	TimeSpan[TimeSpan["Years"] = 5] = "Years";
})(TimeSpan || (TimeSpan = {}));
var DatagridFiltersStrings = class DatagridFiltersStrings {
	constructor() {
		this.clearFilter = "Clear filter";
		this.filterType = "Filter Type";
		this.quickFilter = "Quick Filter";
		this.advancedFilter = "Advanced Filter";
		this.enterValue = "Enter value";
		this.requiredValidatorMessage = "This field is required";
		this.integerValidatorMessage = "Integer value required";
		this.addNew = "Add filter";
		this.addNewAriaLabel = "Add filter";
		this.filterLabel = "Filter";
		this.operatorLabel = "Operator";
		this.operator = {
			after: "After",
			afterOrEqualTo: "After or equal to",
			before: "Before",
			beforeOrEqualTo: "Before or equal to",
			contains: "Contains",
			customRange: "Custom range",
			doesNotContain: "Does not contain",
			doesNotEqual: "Does not equal",
			endsWith: "Ends with",
			equals: "Equals",
			greaterThan: "Greater than",
			greaterThanOrEqualTo: "Greater than or equal to",
			isEmpty: "Is empty",
			lastDay: "Last day",
			lastWeek: "Last week",
			lastMonth: "Last month",
			lastYear: "Last year",
			lessThan: "Less than",
			lessThanOrEqualTo: "Less than or equal to",
			startsWith: "Starts with",
			timeSpan: "Time span"
		};
		this.unitAriaLabel = "Unit";
		this.addCondition = "Add condition";
		this.removeConditionAriaLabel = "Remove condition";
		this.logicalOperator = {
			and: "And",
			or: "Or"
		};
		this.cancel = "Cancel";
		this.apply = "Apply";
		this.valueLabel = "Value";
		this.selectAll = "Select all";
		this.editFilterText = "Edit filter";
		this.removeFilterText = "Remove filter";
		this.hideButtonLabel = "Hide";
		this.hideButtonAriaLabel = "Hide filters";
		this.showButtonLabel = "Show";
		this.filtersText = "filters";
		this.filterText = "filter";
		this.clearAllButtonAriaLabel = "Clear all filters";
		this.searchOptions = "Search options";
		this.searchPlaceholder = "Search...";
		this.showingFormat = "Showing {} of {} results";
		this.noValuesFound = "No matching values found.";
		this.elementsSelectedFormat = "{} elements selected";
		this.loading = "Loading...";
		this.allSearchResults = "Select All Search Results";
		this.loadMore = "Load more ...";
		this.domain = "Domain";
		this.user = "User";
		this.errorSearchingUsers = "Error searching users.";
		this.errorLoadingDomains = "Error loading domains.";
		this.emptyUsersError = "Add at least one user.";
		this.addTimeFilter = "Filter by time";
		this.timeFormat = "HH:mm";
		this.dateLabel = "Date";
		this.timeLabel = "Time";
		this.fromTimeLabel = "From time";
		this.toTimeLabel = "To time";
		this.dateValidatorMessage = "Invalid date format";
		this.dateRangeValidatorMessage = "End date must not be before start date";
		this.timeValidatorMessage = "Invalid time format";
		this.dateRangeLabel = "Date range";
		this.dateRangeOptionsLabel = "Preset ranges";
		this.fromLabel = "From";
		this.toLabel = "To";
		this.removeTimeFilterAriaLabel = "Remove time filter";
		this.timeSpan = {
			minutes: "Minutes",
			hours: "Hours",
			days: "Days",
			weeks: "Weeks",
			months: "Months",
			years: "Years"
		};
		this.timeSpanAriaLabel = "Time span";
		this.timeSpanInputLabel = "In the last";
		this.unit = {
			byte: "B",
			kb: "KB",
			mb: "MB",
			gb: "GB",
			tb: "TB",
			hz: "Hz",
			khz: "KHz",
			mhz: "MHz",
			ghz: "GHz",
			byteps: "B/s",
			kbyteps: "KB/s",
			mbyteps: "MB/s",
			gbyteps: "GB/s",
			bitps: "Bit/s",
			kbitps: "Kbit/s",
			mbitps: "Mbit/s",
			gbitps: "Gbit/s"
		};
	}
	formatString(stringFormat, args) {
		let result = stringFormat;
		for (const arg of args) result = result.replace("{}", arg);
		return result;
	}
	getOperatorDisplayName(operator) {
		switch (operator) {
			case ComparisonOperator.After: return this.operator.after;
			case ComparisonOperator.AfterOrEqualTo: return this.operator.afterOrEqualTo;
			case ComparisonOperator.Before: return this.operator.before;
			case ComparisonOperator.BeforeOrEqualTo: return this.operator.beforeOrEqualTo;
			case ComparisonOperator.Contains: return this.operator.contains;
			case ComparisonOperator.CustomRange: return this.operator.customRange;
			case ComparisonOperator.DoesNotContain: return this.operator.doesNotContain;
			case ComparisonOperator.DoesNotEqual: return this.operator.doesNotEqual;
			case ComparisonOperator.Equals: return this.operator.equals;
			case ComparisonOperator.EndsWith: return this.operator.endsWith;
			case ComparisonOperator.GreaterThan: return this.operator.greaterThan;
			case ComparisonOperator.GreaterThanOrEqualTo: return this.operator.greaterThanOrEqualTo;
			case ComparisonOperator.IsEmpty: return this.operator.isEmpty;
			case ComparisonOperator.LastDay: return this.operator.lastDay;
			case ComparisonOperator.LastWeek: return this.operator.lastWeek;
			case ComparisonOperator.LastMonth: return this.operator.lastMonth;
			case ComparisonOperator.LastYear: return this.operator.lastYear;
			case ComparisonOperator.LessThan: return this.operator.lessThan;
			case ComparisonOperator.LessThanOrEqualTo: return this.operator.lessThanOrEqualTo;
			case ComparisonOperator.StartsWith: return this.operator.startsWith;
			case ComparisonOperator.TimeSpan: return this.operator.timeSpan;
			default: return "Unknown operator!";
		}
	}
	getConjoinerDisplayName(conjoiner) {
		switch (conjoiner) {
			case LogicalOperator.And: return this.logicalOperator.and;
			case LogicalOperator.Or: return this.logicalOperator.or;
			default: return "Unknown logical operator!";
		}
	}
	getTimeSpanDisplayName(timeSpan) {
		switch (timeSpan) {
			case TimeSpan.Minutes: return this.timeSpan.minutes;
			case TimeSpan.Hours: return this.timeSpan.hours;
			case TimeSpan.Days: return this.timeSpan.days;
			case TimeSpan.Weeks: return this.timeSpan.weeks;
			case TimeSpan.Months: return this.timeSpan.months;
			case TimeSpan.Years: return this.timeSpan.years;
			default: return "Unknown time span!";
		}
	}
	getUnitDisplayName(unit) {
		switch (unit) {
			case Unit.Byte: return this.unit.byte;
			case Unit.KB: return this.unit.kb;
			case Unit.MB: return this.unit.mb;
			case Unit.GB: return this.unit.gb;
			case Unit.TB: return this.unit.tb;
			case Unit.HZ: return this.unit.hz;
			case Unit.KHZ: return this.unit.khz;
			case Unit.MHZ: return this.unit.mhz;
			case Unit.GHZ: return this.unit.ghz;
			case Unit.BytePS: return this.unit.byteps;
			case Unit.KBytePS: return this.unit.kbyteps;
			case Unit.MBytePS: return this.unit.mbyteps;
			case Unit.GBytePS: return this.unit.gbyteps;
			case Unit.BitPS: return this.unit.bitps;
			case Unit.KBitPS: return this.unit.kbitps;
			case Unit.MBitPS: return this.unit.mbitps;
			case Unit.GBitPS: return this.unit.gbitps;
			default: return "Unknown unit!";
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFiltersStrings,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFiltersStrings
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFiltersStrings,
	decorators: [{ type: Injectable }]
});
var FilterablePropertyDefinition = class {
	constructor(displayName, property, operators) {
		this.displayName = displayName;
		this.property = property;
		if (operators) this.supportedOperators = operators;
	}
};
var StringPropertyDefinition = class extends FilterablePropertyDefinition {
	constructor(displayName, property, operators, singleCondition, logicalOperator) {
		super(displayName, property, operators);
		this.singleCondition = false;
		this.defaultOperators = [
			ComparisonOperator.Equals,
			ComparisonOperator.DoesNotEqual,
			ComparisonOperator.Contains,
			ComparisonOperator.DoesNotContain,
			ComparisonOperator.StartsWith,
			ComparisonOperator.EndsWith,
			ComparisonOperator.IsEmpty
		];
		if (singleCondition) this.singleCondition = singleCondition;
		this.logicalOperator = logicalOperator;
	}
	getOperators() {
		return this.supportedOperators || this.defaultOperators;
	}
};
var EnumPropertyDefinition = class extends FilterablePropertyDefinition {
	constructor(displayName, property, values, singleSelect = false, searchable = false, enableSelectAll = true, allowNotInOperator = false) {
		super(displayName, property, allowNotInOperator ? [ComparisonOperator.DoesNotEqual, ComparisonOperator.Equals] : void 0);
		this.singleSelect = false;
		this.searchable = false;
		this.enableSelectAll = true;
		this.values = values;
		this.singleSelect = singleSelect;
		this.searchable = searchable;
		this.enableSelectAll = enableSelectAll;
	}
};
var NumericPropertyDefinition = class extends FilterablePropertyDefinition {
	constructor(displayName, property, operators, unit, singleCondition, logicalOperator) {
		super(displayName, property, operators);
		this.singleCondition = false;
		this.defaultOperators = [
			ComparisonOperator.Equals,
			ComparisonOperator.DoesNotEqual,
			ComparisonOperator.LessThan,
			ComparisonOperator.LessThanOrEqualTo,
			ComparisonOperator.GreaterThan,
			ComparisonOperator.GreaterThanOrEqualTo,
			ComparisonOperator.IsEmpty
		];
		if (unit !== null && unit !== void 0) this.unit = unit;
		if (singleCondition) this.singleCondition = singleCondition;
		this.logicalOperator = logicalOperator;
	}
	getOperators() {
		return this.supportedOperators || this.defaultOperators;
	}
};
var UserPropertyDefinition = class extends FilterablePropertyDefinition {
	constructor(displayName, property) {
		super(displayName, property, [ComparisonOperator.Equals, ComparisonOperator.DoesNotEqual]);
	}
};
var DateTimePropertyDefinition = class extends FilterablePropertyDefinition {
	constructor(displayName, property, operators, includeSeconds, rangeOptions) {
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
			ComparisonOperator.TimeSpan
		];
		this.includeSeconds = includeSeconds ? includeSeconds : false;
		this.rangeOptions = rangeOptions ?? [];
	}
	getOperators() {
		return this.supportedOperators || this.defaultOperators;
	}
};
var PropertyFilter = class {};
var PropertyPredicate = class {};
const formatLocale = "en-US";
const dateFormat = "yyyy-MM-dd";
const timeFormat = "HH:mm";
const timeWithSecondsFormat = `${timeFormat}:ss`;
const dateTimeFormat = `${dateFormat}T${timeFormat}`;
const dateTimeWithSecondsFormat = `${dateFormat}T${timeWithSecondsFormat}`;
const oneSecondMs = 1e3;
const oneMinuteMs = 60 * oneSecondMs;
const oneHourMs = 60 * oneMinuteMs;
const oneDayMs = 24 * oneHourMs;
const oneWeekMs = 7 * oneDayMs;
const oneMonthMs = 30 * oneDayMs;
const oneYearMs = 365 * oneDayMs;
const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/;
function parseLocalDateTime(value) {
	const match = LOCAL_DATE_TIME.exec(value || "");
	if (!match) return null;
	const [, year, month, day, hours, minutes, seconds] = match;
	const date = new Date(+year, +month - 1, +day, +(hours ?? 0), +(minutes ?? 0), +(seconds ?? 0));
	return isNaN(date.getTime()) ? null : {
		date,
		hasTime: hours !== void 0
	};
}
function isMidnight(date) {
	return !date.getHours() && !date.getMinutes() && !date.getSeconds();
}
function midnightAfter(date, days) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
function toStateValue(date) {
	const format = isMidnight(date) ? dateFormat : date.getSeconds() ? dateTimeWithSecondsFormat : dateTimeFormat;
	return formatDate(date, format, formatLocale);
}
function normalize(value) {
	const parsed = parseLocalDateTime(value);
	return parsed ? toStateValue(parsed.date) : void 0;
}
const singleOperators = /* @__PURE__ */ new Map([
	[ComparisonOperator.Before, ComparisonOperator.Before],
	[ComparisonOperator.LessThan, ComparisonOperator.Before],
	[ComparisonOperator.BeforeOrEqualTo, ComparisonOperator.BeforeOrEqualTo],
	[ComparisonOperator.LessThanOrEqualTo, ComparisonOperator.BeforeOrEqualTo],
	[ComparisonOperator.After, ComparisonOperator.After],
	[ComparisonOperator.GreaterThan, ComparisonOperator.After],
	[ComparisonOperator.AfterOrEqualTo, ComparisonOperator.AfterOrEqualTo],
	[ComparisonOperator.GreaterThanOrEqualTo, ComparisonOperator.AfterOrEqualTo],
	[ComparisonOperator.Equals, ComparisonOperator.Equals]
]);
function dateTimeEditorState(filter) {
	if (filter?.editorState?.operator !== void 0) return filter.editorState;
	const criteria = filter?.criteria ?? [];
	if (criteria.length === 1) {
		const [predicate] = criteria;
		if (predicate.operator === ComparisonOperator.IsEmpty) return { operator: ComparisonOperator.IsEmpty };
		const operator = singleOperators.get(predicate.operator);
		const value = normalize(predicate.value);
		return operator !== void 0 && value ? {
			operator,
			value
		} : null;
	}
	if (criteria.length === 2 && filter?.operator === LogicalOperator.And) {
		const from = criteria.find((predicate) => predicate.operator === ComparisonOperator.GreaterThanOrEqualTo);
		const to = criteria.find((predicate) => predicate.operator === ComparisonOperator.LessThan);
		const start = parseLocalDateTime(from?.value);
		const end = parseLocalDateTime(to?.value);
		if (!from || !to || !start || !end) return null;
		const prop = criteria[0].filterableProperty;
		const stepMs = prop instanceof DateTimePropertyDefinition && prop.includeSeconds ? oneSecondMs : oneMinuteMs;
		const isWholeDay = isMidnight(start.date) && end.date.getTime() === midnightAfter(start.date, 1).getTime();
		const isOneStep = end.date.getTime() - start.date.getTime() === stepMs;
		if (isWholeDay || isOneStep) return {
			operator: ComparisonOperator.Equals,
			value: normalize(from.value)
		};
		const inclusiveEnd = isMidnight(end.date) ? midnightAfter(end.date, -1) : new Date(end.date.getTime() - stepMs);
		return {
			operator: ComparisonOperator.CustomRange,
			value: normalize(from.value),
			valueTo: toStateValue(inclusiveEnd)
		};
	}
	return null;
}
var FilterFormComponent = class FilterFormComponent {
	constructor(filterStrings) {
		this.filterStrings = filterStrings;
		this.cancel = new EventEmitter();
		this.apply = new EventEmitter();
	}
	onApplyButtonClick() {
		this.apply.emit();
	}
	onCancelButtonClick() {
		this.cancel.emit();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: FilterFormComponent,
			deps: [{ token: DatagridFiltersStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: FilterFormComponent,
			isStandalone: false,
			selector: "appfx-filter-form",
			inputs: { valid: "valid" },
			outputs: {
				cancel: "cancel",
				apply: "apply"
			},
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form clrForm class=\"form-compact\" clrLayout=\"vertical\">\n  <div class=\"form-max-height\">\n    <ng-content></ng-content>\n  </div>\n  <div class=\"filter-form-actions\">\n    <div class=\"filter-extra-actions\">\n      <ng-content select=\"[filterActions]\"></ng-content>\n    </div>\n    <button type=\"button\" data-test-id=\"cancelBtn\" class=\"btn btn-sm btn-outline\" (click)=\"onCancelButtonClick()\">\n      {{ filterStrings.cancel }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      class=\"btn btn-sm btn-primary\"\n      [disabled]=\"!valid\"\n      (click)=\"onApplyButtonClick()\"\n    >\n      {{ filterStrings.apply }}\n    </button>\n  </div>\n</form>\n",
			styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n", ":host{display:flex;flex-direction:column;min-width:0;min-height:0}form{display:flex;flex-direction:column;min-height:0}.form-max-height{display:flex;flex-direction:column;min-height:0;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host ::ng-deep .form-max-height>*{flex-shrink:0}:host ::ng-deep .form-max-height>.filter-scroll-region{flex-shrink:1}:host ::ng-deep .filter-field-row{display:flex;align-items:center;justify-content:space-between;gap:var(--clr-base-gap-s);padding-bottom:var(--clr-base-vertical-offset-l);border-bottom:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color)}:host ::ng-deep .filter-logic{flex:0 0 auto;margin:0}:host ::ng-deep .filter-logic .btn{min-width:var(--clr-base-layout-space-3xl)}:host ::ng-deep .filter-condition-row{display:flex;align-items:flex-start;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-l)}:host ::ng-deep .filter-condition-row .clr-form-control,:host ::ng-deep .filter-values .clr-form-control{margin-top:0;min-width:0}:host ::ng-deep .filter-operator{flex:0 1 40%}:host ::ng-deep .filter-value{flex:1 1 0;min-width:0}:host ::ng-deep .filter-unit{flex:0 1 4rem}:host ::ng-deep .filter-condition-remove{flex:0 0 auto;margin:0;padding:0 var(--clr-base-horizontal-offset-2xs)}:host ::ng-deep .filter-condition-row .clr-control-container,:host ::ng-deep .filter-values .clr-control-container{width:100%}:host ::ng-deep .filter-condition-row .clr-control-container .clr-select-wrapper,:host ::ng-deep .filter-condition-row .clr-control-container .clr-input-wrapper,:host ::ng-deep .filter-condition-row .clr-control-container .clr-input-group,:host ::ng-deep .filter-values .clr-control-container .clr-select-wrapper,:host ::ng-deep .filter-values .clr-control-container .clr-input-wrapper,:host ::ng-deep .filter-values .clr-control-container .clr-input-group{display:flex;width:100%}:host ::ng-deep .filter-condition-row .clr-control-container .clr-select-wrapper>select,:host ::ng-deep .filter-condition-row .clr-control-container input.clr-input,:host ::ng-deep .filter-values .clr-control-container .clr-select-wrapper>select,:host ::ng-deep .filter-values .clr-control-container input.clr-input{flex:1 1 auto;min-width:0;width:100%}:host ::ng-deep .filter-add-condition{align-self:flex-start;margin:var(--clr-base-vertical-offset-l) 0 0}:host ::ng-deep .filter-logic-divider{display:flex;align-items:center;gap:var(--clr-base-gap-s);margin:var(--clr-base-vertical-offset-l) 0 0}:host ::ng-deep .filter-logic-divider:after{content:\"\";flex:1;border-top:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color)}:host ::ng-deep .filter-logic-label{padding:0 var(--clr-base-horizontal-offset-s);text-transform:uppercase}:host ::ng-deep .filter-form-actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-xl)}:host ::ng-deep .filter-form-actions .btn{margin:0}:host ::ng-deep .filter-extra-actions{margin-right:auto}@media(width<=480px){:host ::ng-deep .filter-field-row,:host ::ng-deep .filter-condition-row{flex-wrap:wrap}:host ::ng-deep .filter-operator{flex-basis:100%}}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrForm,
					selector: "[clrForm]",
					inputs: ["clrLabelSize"]
				},
				{
					kind: "directive",
					type: i2$2.ClrLayout,
					selector: "[clrForm][clrLayout]",
					inputs: ["clrLayout"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgNoValidate,
					selector: "form:not([ngNoForm]):not([ngNativeValidate])"
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i3$1.NgForm,
					selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]",
					inputs: ["ngFormOptions"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: FilterFormComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-filter-form",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<form clrForm class=\"form-compact\" clrLayout=\"vertical\">\n  <div class=\"form-max-height\">\n    <ng-content></ng-content>\n  </div>\n  <div class=\"filter-form-actions\">\n    <div class=\"filter-extra-actions\">\n      <ng-content select=\"[filterActions]\"></ng-content>\n    </div>\n    <button type=\"button\" data-test-id=\"cancelBtn\" class=\"btn btn-sm btn-outline\" (click)=\"onCancelButtonClick()\">\n      {{ filterStrings.cancel }}\n    </button>\n    <button\n      type=\"button\"\n      data-test-id=\"submitBtn\"\n      class=\"btn btn-sm btn-primary\"\n      [disabled]=\"!valid\"\n      (click)=\"onApplyButtonClick()\"\n    >\n      {{ filterStrings.apply }}\n    </button>\n  </div>\n</form>\n",
			styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n", ":host{display:flex;flex-direction:column;min-width:0;min-height:0}form{display:flex;flex-direction:column;min-height:0}.form-max-height{display:flex;flex-direction:column;min-height:0;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host ::ng-deep .form-max-height>*{flex-shrink:0}:host ::ng-deep .form-max-height>.filter-scroll-region{flex-shrink:1}:host ::ng-deep .filter-field-row{display:flex;align-items:center;justify-content:space-between;gap:var(--clr-base-gap-s);padding-bottom:var(--clr-base-vertical-offset-l);border-bottom:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color)}:host ::ng-deep .filter-logic{flex:0 0 auto;margin:0}:host ::ng-deep .filter-logic .btn{min-width:var(--clr-base-layout-space-3xl)}:host ::ng-deep .filter-condition-row{display:flex;align-items:flex-start;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-l)}:host ::ng-deep .filter-condition-row .clr-form-control,:host ::ng-deep .filter-values .clr-form-control{margin-top:0;min-width:0}:host ::ng-deep .filter-operator{flex:0 1 40%}:host ::ng-deep .filter-value{flex:1 1 0;min-width:0}:host ::ng-deep .filter-unit{flex:0 1 4rem}:host ::ng-deep .filter-condition-remove{flex:0 0 auto;margin:0;padding:0 var(--clr-base-horizontal-offset-2xs)}:host ::ng-deep .filter-condition-row .clr-control-container,:host ::ng-deep .filter-values .clr-control-container{width:100%}:host ::ng-deep .filter-condition-row .clr-control-container .clr-select-wrapper,:host ::ng-deep .filter-condition-row .clr-control-container .clr-input-wrapper,:host ::ng-deep .filter-condition-row .clr-control-container .clr-input-group,:host ::ng-deep .filter-values .clr-control-container .clr-select-wrapper,:host ::ng-deep .filter-values .clr-control-container .clr-input-wrapper,:host ::ng-deep .filter-values .clr-control-container .clr-input-group{display:flex;width:100%}:host ::ng-deep .filter-condition-row .clr-control-container .clr-select-wrapper>select,:host ::ng-deep .filter-condition-row .clr-control-container input.clr-input,:host ::ng-deep .filter-values .clr-control-container .clr-select-wrapper>select,:host ::ng-deep .filter-values .clr-control-container input.clr-input{flex:1 1 auto;min-width:0;width:100%}:host ::ng-deep .filter-add-condition{align-self:flex-start;margin:var(--clr-base-vertical-offset-l) 0 0}:host ::ng-deep .filter-logic-divider{display:flex;align-items:center;gap:var(--clr-base-gap-s);margin:var(--clr-base-vertical-offset-l) 0 0}:host ::ng-deep .filter-logic-divider:after{content:\"\";flex:1;border-top:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color)}:host ::ng-deep .filter-logic-label{padding:0 var(--clr-base-horizontal-offset-s);text-transform:uppercase}:host ::ng-deep .filter-form-actions{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-xl)}:host ::ng-deep .filter-form-actions .btn{margin:0}:host ::ng-deep .filter-extra-actions{margin-right:auto}@media(width<=480px){:host ::ng-deep .filter-field-row,:host ::ng-deep .filter-condition-row{flex-wrap:wrap}:host ::ng-deep .filter-operator{flex-basis:100%}}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridFiltersStrings }],
	propDecorators: {
		valid: [{ type: Input }],
		cancel: [{ type: Output }],
		apply: [{ type: Output }]
	}
});
const enterKey$2 = "Enter";
const requiredValidators = [Validators.required];
var DateTimeFilterComponent = class DateTimeFilterComponent {
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
		this.rangeOptions = [];
		this.includeSeconds = false;
		this.filterCriteriaChange = new EventEmitter();
		this.dateFormat = new ClrLocaleDateFormat(inject(LOCALE_ID));
		this.injector = inject(Injector);
		this.dateValidators = [Validators.required, (control) => control.value && !this.dateFormat.parse(control.value) ? { pattern: true } : null];
		this.relativeOperators = [
			ComparisonOperator.LastDay,
			ComparisonOperator.LastWeek,
			ComparisonOperator.LastMonth,
			ComparisonOperator.LastYear
		];
		this.singlePredicateOperators = [
			ComparisonOperator.After,
			ComparisonOperator.AfterOrEqualTo,
			ComparisonOperator.Before,
			ComparisonOperator.BeforeOrEqualTo
		];
		this.selectedFilterCriteria = new PropertyFilter();
		this.primaryPredicate = new PropertyPredicate();
		this.secondaryPredicate = new PropertyPredicate();
		this.storedState = null;
		this.timeSpans = [
			TimeSpan.Minutes,
			TimeSpan.Hours,
			TimeSpan.Days,
			TimeSpan.Weeks,
			TimeSpan.Months,
			TimeSpan.Years
		];
	}
	get filterProperty() {
		return this.#filterProperty;
	}
	set filterProperty(filterProperty) {
		this.#filterProperty = filterProperty;
	}
	get timeStepMs() {
		return this.includeSeconds ? oneSecondMs : oneMinuteMs;
	}
	ngOnInit() {
		this.comparisonOperators = this.filterProperty.getOperators();
		this.rangeOptions = validRangeOptions(this.filterProperty.rangeOptions);
		let dateValidators = this.dateValidators;
		this.storedState = dateTimeEditorState(this.propertyFilter);
		const storedOperator = this.storedState?.operator;
		if (storedOperator !== void 0) {
			this.processSelectedOperator(storedOperator);
			if (this.noDateTimeInputNeeded()) dateValidators = [];
		}
		this.dateTimeFilterForm = this.formBuilder.group({
			operator: [storedOperator ?? ComparisonOperator.AfterOrEqualTo],
			dateValue: [this.parseDateValue(this.getStoredDateTimeValue()), dateValidators]
		});
		if (this.parseTimeValue(this.getStoredDateTimeValue()).length > 0) this.enableTimePredicate();
		if (ComparisonOperator.CustomRange === storedOperator) {
			this.isCustomRangePredicate = true;
			this.enableCustomRangePredicate();
		}
		if (this.isTimeSpanPredicate) this.enableTimeSpanPredicate();
		this.onOperatorChange();
	}
	ngOnChanges() {
		this.comparisonOperators = this.filterProperty.getOperators();
		this.includeSeconds = this.filterProperty.includeSeconds;
	}
	onInputKeyPress(event) {
		if (event.key === enterKey$2) {
			event.stopPropagation();
			event.preventDefault();
			if (this.dateTimeFilterForm.valid) this.onApplyButtonClick();
		}
	}
	applyRangeOption(option) {
		const [start, end] = option.value;
		this.dateTimeFilterForm.patchValue({
			dateValue: this.dateFormat.format(start),
			dateValueTo: this.dateFormat.format(end)
		});
		if (this.timePredicate) this.dateTimeFilterForm.patchValue({
			timeValue: this.timeInputValue(start, false),
			timeValueTo: this.timeInputValue(end, true)
		});
		this.dateTimeFilterForm.markAsDirty();
	}
	enableTimePredicate() {
		this.timePredicate = true;
		this.dateTimeFilterForm.addControl("timeValue", new FormControl(this.parseTimeValue(this.getStoredDateTimeValue()), requiredValidators));
		if (this.isCustomRangePredicate) this.dateTimeFilterForm.addControl("timeValueTo", new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators));
	}
	disableTimePredicate() {
		this.timePredicate = false;
		this.dateTimeFilterForm.removeControl("timeValue");
		if (this.isCustomRangePredicate) this.dateTimeFilterForm.removeControl("timeValueTo");
	}
	noDateTimeInputNeeded() {
		return this.isEmptyPredicate || this.isTimeSpanPredicate || this.isRelativePredicate;
	}
	onApplyButtonClick() {
		this.selectedFilterCriteria = new PropertyFilter();
		this.primaryPredicate = new PropertyPredicate();
		this.secondaryPredicate = new PropertyPredicate();
		const selectedOperator = this.dateTimeFilterForm.value.operator;
		if (this.isRelativeDateTimeOperator(selectedOperator)) {
			this.primaryPredicate = this.getRelativeDateTimePredicate(selectedOperator);
			this.secondaryPredicate = this.getcurrentTimePredicate();
		} else if (this.isTimeSpanPredicate) {
			this.primaryPredicate = this.getTimeSpanPredicate(this.dateTimeFilterForm.value.timeSpanValue, this.dateTimeFilterForm.value.timeSpan);
			this.secondaryPredicate = this.getcurrentTimePredicate();
		} else if (this.isCustomRangePredicate) {
			this.primaryPredicate = this.getFromDateTimePredicate();
			this.secondaryPredicate = this.getToDateTimePredicate();
		} else if (ComparisonOperator.Equals === selectedOperator) this.buildEqualsDateTimePredicates();
		else if (this.isSinglePredicateOperator(selectedOperator)) this.primaryPredicate = this.getSinglePredicate(selectedOperator);
		this.primaryPredicate.filterableProperty = this.filterProperty;
		if (!this.isEmptyPredicate) {
			this.primaryPredicate.value = this.adjustTimeZone(this.primaryPredicate.value);
			if (!this.isSinglePredicateOperator(selectedOperator)) {
				this.secondaryPredicate.filterableProperty = this.filterProperty;
				this.secondaryPredicate.value = this.adjustTimeZone(this.secondaryPredicate.value);
				this.selectedFilterCriteria.criteria = [this.primaryPredicate, this.secondaryPredicate];
				this.selectedFilterCriteria.operator = LogicalOperator.And;
			} else this.selectedFilterCriteria.criteria = [this.primaryPredicate];
		} else {
			this.primaryPredicate.operator = ComparisonOperator.IsEmpty;
			this.selectedFilterCriteria.criteria = [this.primaryPredicate];
		}
		this.storeSelectedValues();
		this.filterCriteriaChange.emit(this.selectedFilterCriteria);
	}
	onCancelButtonClick() {
		this.filterCriteriaChange.emit();
	}
	onAddTimeClick() {
		this.enableTimePredicate();
		afterNextRender(() => this.timeInput?.nativeElement.focus(), { injector: this.injector });
	}
	onRemoveTimeClick() {
		this.disableTimePredicate();
		afterNextRender(() => (this.startDateInput ?? this.dateInput)?.nativeElement.focus(), { injector: this.injector });
	}
	onOperatorChange() {
		this.dateTimeFilterForm.valueChanges.subscribe(() => {
			const dateValueTo = this.dateTimeFilterForm.get("dateValueTo");
			if (!dateValueTo) return;
			dateValueTo.updateValueAndValidity({ emitEvent: false });
			if (dateValueTo.hasError("range")) dateValueTo.markAsTouched();
			dateValueTo.setErrors(dateValueTo.errors);
		});
		this.dateTimeFilterForm.get("operator")?.valueChanges.subscribe((operator) => {
			this.processSelectedOperator(operator);
			if (this.noDateTimeInputNeeded()) this.disableDateTimePredicates();
			else {
				this.isCustomRangePredicate = ComparisonOperator.CustomRange === operator;
				this.enableDateTimePredicates();
				if (!this.isCustomRangePredicate) this.disableCustomRangePredicate();
			}
			if (this.isTimeSpanPredicate) this.enableTimeSpanPredicate();
			else this.disableTimeSpanPredicate();
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
		this.dateTimeFilterForm.addControl("dateValueTo", new FormControl(this.parseDateValue(this.getStoredDateTimeValueTo()), [...this.dateValidators, (control) => this.validateRangeOrder(control)]));
		if (this.timePredicate) this.dateTimeFilterForm.addControl("timeValueTo", new FormControl(this.parseTimeValue(this.getStoredDateTimeValueTo()), requiredValidators));
	}
	disableCustomRangePredicate() {
		this.isCustomRangePredicate = false;
		this.dateTimeFilterForm.removeControl("dateValueTo");
		if (this.timePredicate) this.dateTimeFilterForm.removeControl("timeValueTo");
	}
	enableDateTimePredicates() {
		this.addValidators("dateValue", this.dateValidators);
		if (this.timePredicate) this.enableTimePredicate();
		if (this.isCustomRangePredicate) this.enableCustomRangePredicate();
	}
	disableDateTimePredicates() {
		this.removeValidators("dateValue");
		if (this.timePredicate) this.disableTimePredicate();
		if (this.isCustomRangePredicate) this.disableCustomRangePredicate();
	}
	enableTimeSpanPredicate() {
		const timeSpanValue = this.storedState?.timeSpanValue;
		this.dateTimeFilterForm.addControl("timeSpanValue", new FormControl(timeSpanValue || "", requiredValidators));
		const timeSpan = this.storedState?.timeSpan;
		this.dateTimeFilterForm.addControl("timeSpan", new FormControl(timeSpan || TimeSpan.Minutes));
	}
	disableTimeSpanPredicate() {
		this.dateTimeFilterForm.removeControl("timeSpanValue");
		this.dateTimeFilterForm.removeControl("timeSpan");
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
			default: return predicate;
		}
	}
	getTimeSpanPredicate(value, timeSpan) {
		const predicate = new PropertyPredicate();
		predicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
		if (value < 0) return predicate;
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
			default: return predicate;
		}
	}
	buildEqualsDateTimePredicates() {
		this.primaryPredicate = this.getFromDateTimePredicate();
		this.secondaryPredicate.operator = ComparisonOperator.LessThan;
		if (this.timePredicate) this.secondaryPredicate.value = this.getCustomDate(this.primaryPredicate.value, this.timeStepMs);
		else this.secondaryPredicate.value = this.getNextDay(this.primaryPredicate.value);
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
			default: return predicate;
		}
	}
	getFromDateTimePredicate(adjustTime = false) {
		const fromPredicate = new PropertyPredicate();
		fromPredicate.operator = ComparisonOperator.GreaterThanOrEqualTo;
		let fromValue = this.isoDate("dateValue");
		if (this.timePredicate) {
			fromValue += "T" + this.dateTimeFilterForm.value.timeValue + (this.includeSeconds ? "" : ":00");
			if (adjustTime) fromValue = this.getCustomDate(fromValue, this.timeStepMs);
		} else {
			fromValue += "T00:00:00";
			if (adjustTime) fromValue = this.getNextDay(fromValue);
		}
		fromPredicate.value = fromValue;
		return fromPredicate;
	}
	getToDateTimePredicate() {
		const toPredicate = new PropertyPredicate();
		toPredicate.operator = ComparisonOperator.LessThan;
		let toValue = this.isoDate("dateValueTo");
		if (this.timePredicate) {
			toValue += "T" + this.dateTimeFilterForm.value.timeValueTo + (this.includeSeconds ? "" : ":00");
			toValue = this.getCustomDate(toValue, this.timeStepMs);
		} else {
			toValue += "T00:00:00";
			toValue = this.getNextDay(toValue);
		}
		toPredicate.value = toValue;
		return toPredicate;
	}
	getcurrentTimePredicate() {
		const predicate = new PropertyPredicate();
		predicate.value = this.datePipe.transform(/* @__PURE__ */ new Date(), dateTimeWithSecondsFormat);
		predicate.operator = ComparisonOperator.LessThanOrEqualTo;
		return predicate;
	}
	getPastDate(timePeriod) {
		const now = /* @__PURE__ */ new Date();
		const prevDate = new Date((/* @__PURE__ */ new Date()).setTime(now.getTime() - timePeriod));
		return this.datePipe.transform(prevDate, dateTimeWithSecondsFormat);
	}
	getNextDay(baseDate) {
		const parsed = parseLocalDateTime(baseDate);
		if (!parsed) return baseDate;
		const nextDay = new Date(parsed.date);
		nextDay.setDate(nextDay.getDate() + 1);
		return this.datePipe.transform(nextDay, "yyyy-MM-ddTHH:mm:ss") || baseDate;
	}
	getCustomDate(baseDate, timePeriod) {
		const date = new Date(baseDate);
		const newDate = new Date((/* @__PURE__ */ new Date()).setTime(date.getTime() + timePeriod));
		return this.datePipe.transform(newDate, "yyyy-MM-ddTHH:mm:ss") || baseDate;
	}
	adjustTimeZone(utcDate) {
		if (!utcDate) return utcDate;
		return utcDate + this.getUtcTimeZoneOffset(utcDate);
	}
	getUtcTimeZoneOffset(utcDate) {
		const timeZoneOffset = new Date(utcDate).getTimezoneOffset();
		const decimalOffset = Math.abs(timeZoneOffset / 60);
		const offsetHours = Math.trunc(decimalOffset);
		const offsetMinutes = Math.round((decimalOffset - offsetHours) * 60);
		const offsetHoursString = offsetHours.toLocaleString(void 0, { minimumIntegerDigits: 2 });
		const offsetMinutesString = offsetMinutes.toLocaleString(void 0, { minimumIntegerDigits: 2 });
		let utcOffset = "";
		if (timeZoneOffset > 0) utcOffset = "-" + offsetHoursString + ":" + offsetMinutesString;
		else if (timeZoneOffset < 0) utcOffset = "+" + offsetHoursString + ":" + offsetMinutesString;
		return utcOffset;
	}
	storeSelectedValues() {
		const value = this.dateTimeFilterForm.value;
		const state = { operator: value.operator };
		if (!this.noDateTimeInputNeeded()) state.value = this.isoDate("dateValue") + (this.timePredicate ? "T" + value.timeValue : "");
		if (this.isCustomRangePredicate) state.valueTo = this.isoDate("dateValueTo") + (this.timePredicate ? "T" + value.timeValueTo : "");
		if (this.isTimeSpanPredicate) {
			state.timeSpanValue = value.timeSpanValue;
			state.timeSpan = value.timeSpan;
		}
		this.selectedFilterCriteria.editorState = state;
	}
	getStoredDateTimeValue() {
		return this.storedState?.value || "";
	}
	getStoredDateTimeValueTo() {
		return this.storedState?.valueTo || "";
	}
	parseDateValue(dateTime) {
		const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateTime || "");
		return match ? this.dateFormat.format(new Date(+match[1], +match[2] - 1, +match[3])) : "";
	}
	isoDate(controlName) {
		const date = this.dateFormat.parse(this.dateTimeFilterForm.value[controlName]);
		return date ? formatDate(date, dateFormat, formatLocale) : "";
	}
	timeInputValue(date, isEnd) {
		if (isEnd && !date.getHours() && !date.getMinutes() && !date.getSeconds()) return this.includeSeconds ? "23:59:59" : "23:59";
		return formatDate(date, this.includeSeconds ? timeWithSecondsFormat : timeFormat, formatLocale);
	}
	validateRangeOrder(control) {
		if (!this.timePredicate || !this.isCustomRangePredicate || !control.parent) return null;
		const start = this.localDateTime(control.parent, "dateValue", "timeValue");
		const end = this.localDateTime(control.parent, "dateValueTo", "timeValueTo");
		return start && end && start.getTime() > end.getTime() ? { range: true } : null;
	}
	localDateTime(form, dateControl, timeControl) {
		const date = this.dateFormat.parse(form.get(dateControl)?.value);
		const time = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(form.get(timeControl)?.value || "");
		if (!date || !time) return null;
		const [, hours, minutes, seconds] = time;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), +hours, +minutes, +(seconds ?? 0));
	}
	parseTimeValue(dateTime) {
		if (!!dateTime && dateTime.indexOf("T") > 0) return dateTime.substring(dateTime.indexOf("T") + 1);
		return "";
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DateTimeFilterComponent,
			deps: [
				{ token: i3$1.FormBuilder },
				{ token: i2$1.DatePipe },
				{ token: DatagridFiltersStrings }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DateTimeFilterComponent,
			isStandalone: false,
			selector: "appfx-datetime-filter",
			inputs: {
				propertyFilter: "propertyFilter",
				filterProperty: "filterProperty"
			},
			outputs: { filterCriteriaChange: "filterCriteriaChange" },
			viewQueries: [
				{
					propertyName: "startDateInput",
					first: true,
					predicate: ["startDateInput"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "dateInput",
					first: true,
					predicate: ["dateInput"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "timeInput",
					first: true,
					predicate: ["timeInput"],
					descendants: true,
					read: ElementRef
				}
			],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"dateTimeFilterForm\"\n  [valid]=\"dateTimeFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"filter-condition-row\">\n    <div class=\"date-filter-operator\">\n      <clr-select-container>\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"operator\">\n          @for (operator of comparisonOperators; track operator) {\n            <option [ngValue]=\"operator\">\n              {{ filterStrings.getOperatorDisplayName(operator) }}\n            </option>\n          }\n        </select>\n      </clr-select-container>\n      @if (isCustomRangePredicate && timePredicate && rangeOptions.length) {\n        <!-- With times the range picker is not used, so its preset ranges are offered as buttons. -->\n        <div class=\"date-range-options\" role=\"group\" [attr.aria-label]=\"filterStrings.dateRangeOptionsLabel\">\n          @for (option of rangeOptions; track $index) {\n            <button\n              type=\"button\"\n              class=\"btn btn-sm btn-outline date-range-option\"\n              data-test-id=\"date-range-option\"\n              (click)=\"applyRangeOption(option)\"\n            >\n              {{ option.label }}\n            </button>\n          }\n        </div>\n      }\n    </div>\n  </div>\n  <div class=\"filter-values date-filter-values\">\n    @if (isCustomRangePredicate && !timePredicate) {\n      <!-- Dates only: one range picker for From and To. With times, separate pickers are shown below. -->\n      <div class=\"date-filter-value-row\">\n        <clr-date-range-container class=\"filter-value\" [rangeOptions]=\"rangeOptions\">\n          <label class=\"clr-sr-only\">{{ filterStrings.dateRangeLabel }}</label>\n          <input\n            #startDateInput\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValue\"\n            clrStartDate\n            [attr.aria-label]=\"filterStrings.fromLabel\"\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <input\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValueTo\"\n            clrEndDate\n            [attr.aria-label]=\"filterStrings.toLabel\"\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'range'\" role=\"alert\">{{\n            filterStrings.dateRangeValidatorMessage\n          }}</clr-control-error>\n        </clr-date-range-container>\n      </div>\n    } @else if (!noDateTimeInputNeeded()) {\n      <div class=\"date-filter-value-row\">\n        <clr-date-container class=\"filter-value\">\n          <label [class.clr-sr-only]=\"!isCustomRangePredicate\">\n            {{ isCustomRangePredicate ? filterStrings.fromLabel : filterStrings.dateLabel }}\n          </label>\n          <input\n            #dateInput\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValue\"\n            clrDate\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n        </clr-date-container>\n      </div>\n    }\n    @if (timePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label class=\"clr-sr-only\">{{\n            isCustomRangePredicate ? filterStrings.fromTimeLabel : filterStrings.timeLabel\n          }}</label>\n          <input\n            #timeInput\n            type=\"time\"\n            [step]=\"includeSeconds ? 1 : 60\"\n            pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9]):?([0-5][0-9])?$\"\n            formControlName=\"timeValue\"\n            placeholder=\"{{ filterStrings.timeFormat }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.timeValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n          (click)=\"onRemoveTimeClick()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n    }\n    @if (isCustomRangePredicate && timePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-date-container class=\"filter-value\">\n          <label class=\"clr-control-label\">\n            {{ filterStrings.toLabel }}\n          </label>\n          <input\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValueTo\"\n            clrDate\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'range'\" role=\"alert\">{{\n            filterStrings.dateRangeValidatorMessage\n          }}</clr-control-error>\n        </clr-date-container>\n      </div>\n    }\n    @if (timePredicate && isCustomRangePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label class=\"clr-sr-only\">{{ filterStrings.toTimeLabel }}</label>\n          <input\n            type=\"time\"\n            [step]=\"includeSeconds ? 1 : 60\"\n            pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9]):?([0-5][0-9])?$\"\n            formControlName=\"timeValueTo\"\n            placeholder=\"{{ filterStrings.timeFormat }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.timeValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n          (click)=\"onRemoveTimeClick()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n    }\n    @if (isTimeSpanPredicate) {\n      <!-- The value and its unit share one input group, like Clarity's input with a select prefix. -->\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label>{{ filterStrings.timeSpanInputLabel }}</label>\n          <input\n            type=\"text\"\n            pattern=\"^[0-9]+$\"\n            formControlName=\"timeSpanValue\"\n            placeholder=\"{{ filterStrings.enterValue }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <div clrInputSuffix>\n            <select formControlName=\"timeSpan\" [attr.aria-label]=\"filterStrings.timeSpanAriaLabel\">\n              @for (timeSpan of timeSpans; track timeSpan) {\n                <option [ngValue]=\"timeSpan\">\n                  {{ filterStrings.getTimeSpanDisplayName(timeSpan) }}\n                </option>\n              }\n            </select>\n          </div>\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.integerValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n      </div>\n    }\n  </div>\n  @if (!timePredicate && !noDateTimeInputNeeded()) {\n    <button\n      type=\"button\"\n      class=\"btn btn-sm btn-outline filter-add-condition\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addTimeFilter\"\n      (click)=\"onAddTimeClick()\"\n    >\n      {{ filterStrings.addTimeFilter }}\n    </button>\n  }\n</appfx-filter-form>\n",
			styles: [".date-filter-values{display:flex;flex-direction:column;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-l)}.date-filter-values:empty{display:none}.date-filter-value-row{display:flex;align-items:flex-start;gap:var(--clr-base-gap-s)}.date-filter-operator{display:flex;flex:1 1 auto;flex-direction:column;min-width:0}.date-range-options{display:flex;flex-direction:column;align-items:flex-start;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-gap-s)}.date-range-options .date-range-option{display:inline-block;max-width:100%;margin:0;text-align:start}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i2$2.ClrControlError,
					selector: "clr-control-error"
				},
				{
					kind: "directive",
					type: i2$2.ClrIfError,
					selector: "[clrIfError]",
					inputs: ["clrIfError"]
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i6$1.ClrDateInput,
					selector: "[clrDate]",
					inputs: [
						"clrDate",
						"min",
						"max"
					],
					outputs: ["clrDateChange"]
				},
				{
					kind: "component",
					type: i6$1.ClrDateContainer,
					selector: "clr-date-container, clr-date-range-container",
					inputs: [
						"clrFirstDayOfWeek",
						"showActionButtons",
						"clrPosition",
						"rangeOptions",
						"min",
						"max"
					]
				},
				{
					kind: "directive",
					type: i6$1.ClrDateInputValidator,
					selector: "[clrDate], [clrStartDate], [clrEndDate]"
				},
				{
					kind: "directive",
					type: i6$1.ClrStartDateInput,
					selector: "[clrStartDate]",
					inputs: ["inputWidth", "clrStartDate"],
					outputs: ["clrStartDateChange"]
				},
				{
					kind: "directive",
					type: i6$1.ClrEndDateInput,
					selector: "[clrEndDate]",
					inputs: ["inputWidth", "clrEndDate"],
					outputs: ["clrEndDateChange"]
				},
				{
					kind: "directive",
					type: i6$1.ClrStartDateInputValidator,
					selector: "[clrStartDate]"
				},
				{
					kind: "directive",
					type: i6$1.ClrEndDateInputValidator,
					selector: "[clrEndDate]"
				},
				{
					kind: "directive",
					type: i6$1.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i6$1.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.ClrSelect,
					selector: "[clrSelect]"
				},
				{
					kind: "component",
					type: i6$1.ClrSelectContainer,
					selector: "clr-select-container"
				},
				{
					kind: "directive",
					type: i3$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i3$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i3$1.PatternValidator,
					selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]",
					inputs: ["pattern"]
				},
				{
					kind: "directive",
					type: i3$1.FormGroupDirective,
					selector: "[formGroup]",
					inputs: ["formGroup"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormControlName,
					selector: "[formControlName]",
					inputs: [
						"formControlName",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"]
				},
				{
					kind: "component",
					type: FilterFormComponent,
					selector: "appfx-filter-form",
					inputs: ["valid"],
					outputs: ["cancel", "apply"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DateTimeFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datetime-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"dateTimeFilterForm\"\n  [valid]=\"dateTimeFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"filter-condition-row\">\n    <div class=\"date-filter-operator\">\n      <clr-select-container>\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"operator\">\n          @for (operator of comparisonOperators; track operator) {\n            <option [ngValue]=\"operator\">\n              {{ filterStrings.getOperatorDisplayName(operator) }}\n            </option>\n          }\n        </select>\n      </clr-select-container>\n      @if (isCustomRangePredicate && timePredicate && rangeOptions.length) {\n        <!-- With times the range picker is not used, so its preset ranges are offered as buttons. -->\n        <div class=\"date-range-options\" role=\"group\" [attr.aria-label]=\"filterStrings.dateRangeOptionsLabel\">\n          @for (option of rangeOptions; track $index) {\n            <button\n              type=\"button\"\n              class=\"btn btn-sm btn-outline date-range-option\"\n              data-test-id=\"date-range-option\"\n              (click)=\"applyRangeOption(option)\"\n            >\n              {{ option.label }}\n            </button>\n          }\n        </div>\n      }\n    </div>\n  </div>\n  <div class=\"filter-values date-filter-values\">\n    @if (isCustomRangePredicate && !timePredicate) {\n      <!-- Dates only: one range picker for From and To. With times, separate pickers are shown below. -->\n      <div class=\"date-filter-value-row\">\n        <clr-date-range-container class=\"filter-value\" [rangeOptions]=\"rangeOptions\">\n          <label class=\"clr-sr-only\">{{ filterStrings.dateRangeLabel }}</label>\n          <input\n            #startDateInput\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValue\"\n            clrStartDate\n            [attr.aria-label]=\"filterStrings.fromLabel\"\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <input\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValueTo\"\n            clrEndDate\n            [attr.aria-label]=\"filterStrings.toLabel\"\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'range'\" role=\"alert\">{{\n            filterStrings.dateRangeValidatorMessage\n          }}</clr-control-error>\n        </clr-date-range-container>\n      </div>\n    } @else if (!noDateTimeInputNeeded()) {\n      <div class=\"date-filter-value-row\">\n        <clr-date-container class=\"filter-value\">\n          <label [class.clr-sr-only]=\"!isCustomRangePredicate\">\n            {{ isCustomRangePredicate ? filterStrings.fromLabel : filterStrings.dateLabel }}\n          </label>\n          <input\n            #dateInput\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValue\"\n            clrDate\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n        </clr-date-container>\n      </div>\n    }\n    @if (timePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label class=\"clr-sr-only\">{{\n            isCustomRangePredicate ? filterStrings.fromTimeLabel : filterStrings.timeLabel\n          }}</label>\n          <input\n            #timeInput\n            type=\"time\"\n            [step]=\"includeSeconds ? 1 : 60\"\n            pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9]):?([0-5][0-9])?$\"\n            formControlName=\"timeValue\"\n            placeholder=\"{{ filterStrings.timeFormat }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.timeValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n          (click)=\"onRemoveTimeClick()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n    }\n    @if (isCustomRangePredicate && timePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-date-container class=\"filter-value\">\n          <label class=\"clr-control-label\">\n            {{ filterStrings.toLabel }}\n          </label>\n          <input\n            type=\"date\"\n            autocomplete=\"off\"\n            formControlName=\"dateValueTo\"\n            clrDate\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.dateValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'range'\" role=\"alert\">{{\n            filterStrings.dateRangeValidatorMessage\n          }}</clr-control-error>\n        </clr-date-container>\n      </div>\n    }\n    @if (timePredicate && isCustomRangePredicate) {\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label class=\"clr-sr-only\">{{ filterStrings.toTimeLabel }}</label>\n          <input\n            type=\"time\"\n            [step]=\"includeSeconds ? 1 : 60\"\n            pattern=\"^(0[0-9]|1[0-9]|2[0-4]):([0-5][0-9]):?([0-5][0-9])?$\"\n            formControlName=\"timeValueTo\"\n            placeholder=\"{{ filterStrings.timeFormat }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.timeValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n          data-test-id=\"close-button\"\n          [attr.aria-label]=\"filterStrings.removeTimeFilterAriaLabel\"\n          (click)=\"onRemoveTimeClick()\"\n        >\n          <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n        </button>\n      </div>\n    }\n    @if (isTimeSpanPredicate) {\n      <!-- The value and its unit share one input group, like Clarity's input with a select prefix. -->\n      <div class=\"date-filter-value-row\">\n        <clr-input-container class=\"filter-value\">\n          <label>{{ filterStrings.timeSpanInputLabel }}</label>\n          <input\n            type=\"text\"\n            pattern=\"^[0-9]+$\"\n            formControlName=\"timeSpanValue\"\n            placeholder=\"{{ filterStrings.enterValue }}\"\n            clrInput\n            (keydown)=\"onInputKeyPress($event)\"\n          />\n          <div clrInputSuffix>\n            <select formControlName=\"timeSpan\" [attr.aria-label]=\"filterStrings.timeSpanAriaLabel\">\n              @for (timeSpan of timeSpans; track timeSpan) {\n                <option [ngValue]=\"timeSpan\">\n                  {{ filterStrings.getTimeSpanDisplayName(timeSpan) }}\n                </option>\n              }\n            </select>\n          </div>\n          <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n            filterStrings.requiredValidatorMessage\n          }}</clr-control-error>\n          <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n            filterStrings.integerValidatorMessage\n          }}</clr-control-error>\n        </clr-input-container>\n      </div>\n    }\n  </div>\n  @if (!timePredicate && !noDateTimeInputNeeded()) {\n    <button\n      type=\"button\"\n      class=\"btn btn-sm btn-outline filter-add-condition\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addTimeFilter\"\n      (click)=\"onAddTimeClick()\"\n    >\n      {{ filterStrings.addTimeFilter }}\n    </button>\n  }\n</appfx-filter-form>\n",
			styles: [".date-filter-values{display:flex;flex-direction:column;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-vertical-offset-l)}.date-filter-values:empty{display:none}.date-filter-value-row{display:flex;align-items:flex-start;gap:var(--clr-base-gap-s)}.date-filter-operator{display:flex;flex:1 1 auto;flex-direction:column;min-width:0}.date-range-options{display:flex;flex-direction:column;align-items:flex-start;gap:var(--clr-base-gap-s);margin-top:var(--clr-base-gap-s)}.date-range-options .date-range-option{display:inline-block;max-width:100%;margin:0;text-align:start}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i3$1.FormBuilder },
		{ type: i2$1.DatePipe },
		{ type: DatagridFiltersStrings }
	],
	propDecorators: {
		propertyFilter: [{ type: Input }],
		filterCriteriaChange: [{ type: Output }],
		startDateInput: [{
			type: ViewChild,
			args: ["startDateInput", { read: ElementRef }]
		}],
		dateInput: [{
			type: ViewChild,
			args: ["dateInput", { read: ElementRef }]
		}],
		timeInput: [{
			type: ViewChild,
			args: ["timeInput", { read: ElementRef }]
		}],
		filterProperty: [{ type: Input }]
	}
});
function validRangeOptions(options) {
	const isDate = (value) => value instanceof Date && !isNaN(value.getTime());
	return (options ?? []).filter((option) => option?.value?.length === 2 && option.value.every(isDate));
}
var EnumFilterComponent = class EnumFilterComponent {
	#maxInitiallyShownItems;
	#loadingTimeoutDelayMs;
	#maxShownItems;
	#selectedFilterCriteria;
	constructor(formBuilder, filterStrings, cdr) {
		this.formBuilder = formBuilder;
		this.filterStrings = filterStrings;
		this.cdr = cdr;
		this.filterCriteriaChange = new EventEmitter();
		this.optionsData = [];
		this.filteredOptions = [];
		this.enumOperators = [ComparisonOperator.DoesNotEqual, ComparisonOperator.Equals];
		this.isProcessing = false;
		this.searchResultsLen = 0;
		this.selectedCount = 0;
		this.#maxInitiallyShownItems = 50;
		this.#loadingTimeoutDelayMs = 50;
		this.#maxShownItems = this.#maxInitiallyShownItems;
		this.#selectedFilterCriteria = new PropertyFilter();
	}
	get additionalOperators() {
		return this.filterProperty.supportedOperators?.length === 2;
	}
	get optionsFormArray() {
		return this.enumFilterForm?.controls.options;
	}
	trackByFilteredOption(_index, item) {
		return item.index;
	}
	trackByOperator(_index, operator) {
		return operator;
	}
	ngOnInit() {
		this.enumFilterForm = this.formBuilder.group({
			enumOperator: [this.additionalOperators ? ComparisonOperator.DoesNotEqual : ComparisonOperator.Equals],
			searchTerm: [""],
			selectAll: false,
			options: new FormArray([], this.selectedOptionsValidator()),
			singleSelectOption: []
		});
		this.enumFilterForm.get("enumOperator")?.valueChanges.subscribe((op) => {
			this.#selectedFilterCriteria.operator = op === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
		});
		this.enumFilterForm.get("searchTerm")?.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((term) => {
			this.runAsyncOperation(() => this.performSearch(term));
		});
		this.runAsyncOperation(() => this.initializeFilter());
	}
	ngOnChanges() {
		if (this.enumFilterForm) this.runAsyncOperation(() => {
			this.initializeFilter();
			this.enumFilterForm.get("searchTerm")?.setValue("", { emitEvent: false });
			this.performSearch("");
		});
	}
	loadMore() {
		this.runAsyncOperation(() => {
			this.#maxShownItems += 100;
			this.performSearch(this.enumFilterForm.get("searchTerm")?.value);
		});
	}
	onSelectAllChange() {
		this.runAsyncOperation(() => {
			const selectAllValue = this.enumFilterForm.get("selectAll")?.value;
			const visibleIndices = new Set(this.filteredOptions.map((opt) => opt.index));
			const searching = this.searchResultsLen === this.optionsData.length;
			this.optionsFormArray.controls.forEach((control, index) => {
				if ((searching || visibleIndices.has(index)) && control.value !== selectAllValue) control.setValue(selectAllValue, { emitEvent: false });
			});
			this.updateSelectedCount();
			this.enumFilterForm.controls.options.updateValueAndValidity();
		});
	}
	onOptionChange() {
		this.updateSelectedCount();
		const allSelected = this.selectedCount === this.optionsFormArray.length;
		const selectAllControl = this.enumFilterForm.get("selectAll");
		if (selectAllControl?.value !== allSelected) selectAllControl?.setValue(allSelected, { emitEvent: false });
		this.enumFilterForm.controls.options.updateValueAndValidity();
	}
	clearSearch() {
		this.enumFilterForm.get("searchTerm")?.setValue("");
	}
	onApplyButtonClick() {
		const propertyPredicates = [];
		if (this.filterProperty.singleSelect) propertyPredicates.push(this.createEnumPropertyPredicate(this.enumFilterForm.value.singleSelectOption));
		else this.enumFilterForm.value.options.map((checked, i) => checked ? this.optionsData[i].key : null).filter((v) => v !== null).forEach((value) => {
			propertyPredicates.push(this.createEnumPropertyPredicate(value));
		});
		this.#selectedFilterCriteria.criteria = propertyPredicates;
		this.filterCriteriaChange.emit(this.#selectedFilterCriteria);
	}
	onCancelButtonClick() {
		this.filterCriteriaChange.emit();
	}
	runAsyncOperation(action) {
		if (this.optionsData.length > this.#maxInitiallyShownItems) {
			this.isProcessing = true;
			this.cdr.markForCheck();
			setTimeout(() => {
				action();
				this.isProcessing = false;
				this.cdr.markForCheck();
			}, this.#loadingTimeoutDelayMs);
		} else action();
	}
	initializeFilter() {
		this.updateData();
		this.updateForm();
		this.performSearch("");
		let initialOp = ComparisonOperator.Equals;
		if (this.additionalOperators) initialOp = this.propertyFilter?.operator === LogicalOperator.Or ? ComparisonOperator.Equals : ComparisonOperator.DoesNotEqual;
		this.enumFilterForm.controls.enumOperator.setValue(initialOp, { emitEvent: false });
		this.updateSelectedCount();
		this.optionsFormArray.updateValueAndValidity({ emitEvent: false });
	}
	performSearch(term = "") {
		const normalizedTerm = term.toLowerCase();
		const allMatches = this.optionsData.map((data, index) => ({
			data,
			index
		})).filter((item) => !normalizedTerm || item.data.value.toLowerCase().includes(normalizedTerm) || item.data.key.toLowerCase().includes(normalizedTerm));
		this.searchResultsLen = allMatches.length;
		this.filteredOptions = allMatches.slice(0, this.#maxShownItems);
		this.cdr.markForCheck();
	}
	updateSelectedCount() {
		this.selectedCount = this.optionsFormArray.controls.reduce((acc, control) => acc + (control.value ? 1 : 0), 0);
	}
	selectedOptionsValidator() {
		const validator = () => this.filterProperty.singleSelect || this.selectedCount > 0 ? null : { required: true };
		return validator;
	}
	updateData() {
		this.optionsData = [];
		let enumValues;
		if (this.propertyFilter && this.propertyFilter.criteria.length) enumValues = this.propertyFilter.criteria[0].filterableProperty.values;
		else enumValues = this.filterProperty.values;
		enumValues.forEach((v, k) => {
			this.optionsData.push({
				key: k,
				value: v
			});
		});
		if (this.additionalOperators) this.enumFilterForm?.controls.enumOperator.setValue(this.propertyFilter?.operator === LogicalOperator.Or ? ComparisonOperator.Equals : ComparisonOperator.DoesNotEqual);
		else this.enumFilterForm?.controls.enumOperator.setValue(ComparisonOperator.Equals);
	}
	updateForm() {
		if (this.enumFilterForm) {
			this.optionsFormArray.clear();
			this.selectAll(false);
			const selectedOptions = [];
			if (this.propertyFilter) this.propertyFilter.criteria.forEach((predicate) => {
				selectedOptions.push(predicate.value);
			});
			this.optionsData.forEach((option) => this.optionsFormArray.push(new FormControl(selectedOptions.includes(option.key))));
			if (selectedOptions.length === this.optionsData.length) this.selectAll(true);
			if (this.filterProperty.singleSelect) {
				const singleSelectForm = this.enumFilterForm.get("singleSelectOption");
				if (this.propertyFilter) singleSelectForm?.setValue(this.propertyFilter.criteria[0].value);
				else singleSelectForm?.setValue(this.filterProperty.values.keys().next().value);
			}
		}
	}
	selectAll(value) {
		this.enumFilterForm.patchValue({ selectAll: value });
	}
	createEnumPropertyPredicate(value) {
		const predicate = new PropertyPredicate();
		predicate.filterableProperty = this.filterProperty;
		predicate.operator = this.enumFilterForm.controls.enumOperator.value;
		predicate.value = value;
		return predicate;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: EnumFilterComponent,
			deps: [
				{ token: i3$1.FormBuilder },
				{ token: DatagridFiltersStrings },
				{ token: i0.ChangeDetectorRef }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: EnumFilterComponent,
			isStandalone: false,
			selector: "appfx-enum-filter",
			inputs: {
				filterProperty: "filterProperty",
				propertyFilter: "propertyFilter"
			},
			outputs: { filterCriteriaChange: "filterCriteriaChange" },
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"enumFilterForm\"\n  [valid]=\"enumFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"enum-filter-wrapper filter-scroll-region\">\n    <div *ngIf=\"additionalOperators\" class=\"filter-condition-row\">\n      <clr-select-container class=\"enum-operator\">\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"enumOperator\">\n          <option *ngFor=\"let operator of enumOperators; trackBy: trackByOperator\" [ngValue]=\"operator\">\n            {{ filterStrings.getOperatorDisplayName(operator) }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <label class=\"clr-control-label text-left mt-compact\">\n      {{ filterStrings.valueLabel }}\n    </label>\n\n    <!-- The search narrows the options below; it is not part of the condition, so it sits under Value. -->\n    <div *ngIf=\"filterProperty.searchable\" class=\"filter-condition-row enum-search\" data-test-id=\"enum-search\">\n      <clr-input-container class=\"filter-value\">\n        <label class=\"clr-sr-only\">{{ filterStrings.searchOptions }}</label>\n        <input clrInput type=\"text\" [placeholder]=\"filterStrings.searchPlaceholder\" formControlName=\"searchTerm\" />\n        <cds-icon shape=\"search\" clrInputPrefix></cds-icon>\n        <cds-icon\n          *ngIf=\"enumFilterForm.get('searchTerm')?.value\"\n          shape=\"window-close\"\n          clrInputSuffix\n          (click)=\"clearSearch()\"\n        ></cds-icon>\n        <clr-control-helper *ngIf=\"filteredOptions.length\">\n          {{\n            filterStrings.formatString(filterStrings.showingFormat, [\n              filteredOptions.length.toString(),\n              searchResultsLen.toString(),\n            ])\n          }}\n        </clr-control-helper>\n        <clr-control-helper *ngIf=\"filteredOptions.length === 0 && enumFilterForm.get('searchTerm')?.value\">\n          {{ filterStrings.noValuesFound }}\n        </clr-control-helper>\n      </clr-input-container>\n    </div>\n\n    <div *ngIf=\"filteredOptions.length\" cds-layout=\"m-t:xs m-l:xxs\" class=\"selection-counter\">\n      <span *ngIf=\"!filterProperty.singleSelect\" class=\"clr-subtext\" cds-text=\"body medium\">\n        {{ filterStrings.formatString(filterStrings.elementsSelectedFormat, [selectedCount.toString()]) }}\n      </span>\n    </div>\n\n    <div *ngIf=\"isProcessing\" class=\"loading-overlay\">\n      <div class=\"loading-content\">\n        <clr-spinner clrMedium>{{ filterStrings.loading }}</clr-spinner>\n      </div>\n    </div>\n\n    <div class=\"filter-options\" cds-layout=\"m-t:xs\">\n      <clr-checkbox-container *ngIf=\"!filterProperty.singleSelect\" class=\"enum-options\">\n        <clr-checkbox-wrapper *ngIf=\"filterProperty.enableSelectAll\" cds-layout=\"m-b:xs\">\n          <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n          <label>\n            {{ enumFilterForm.get('searchTerm')?.value ? filterStrings.allSearchResults : filterStrings.selectAll }}\n          </label>\n        </clr-checkbox-wrapper>\n\n        <clr-checkbox-wrapper *ngFor=\"let item of filteredOptions; trackBy: trackByFilteredOption\">\n          <input\n            type=\"checkbox\"\n            clrCheckbox\n            [formControl]=\"$any(optionsFormArray.at(item.index))\"\n            (change)=\"onOptionChange()\"\n          />\n          <label>\n            {{ item.data.value }}\n          </label>\n        </clr-checkbox-wrapper>\n      </clr-checkbox-container>\n\n      <clr-radio-container *ngIf=\"filterProperty.singleSelect\" class=\"enum-options\">\n        <clr-radio-wrapper *ngFor=\"let option of filteredOptions; trackBy: trackByFilteredOption\">\n          <input type=\"radio\" clrRadio formControlName=\"singleSelectOption\" [value]=\"option.data.key\" />\n          <label>\n            {{ option.data.value }}\n          </label>\n        </clr-radio-wrapper>\n      </clr-radio-container>\n\n      <!-- At the end of the scrolling list, so it shows once the user reaches the last loaded option. -->\n      <button\n        *ngIf=\"filteredOptions.length < searchResultsLen\"\n        type=\"button\"\n        class=\"btn btn-link enum-load-more\"\n        data-test-id=\"load-more\"\n        (click)=\"loadMore()\"\n      >\n        {{ filterStrings.loadMore }}\n      </button>\n    </div>\n  </div>\n</appfx-filter-form>\n",
			styles: [".enum-options{margin-top:var(--clr-base-vertical-offset-2xs);text-align:left}.enum-filter-wrapper{display:flex;flex-direction:column;min-height:0}.enum-filter-wrapper>*{flex-shrink:0}.enum-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.enum-operator{flex:1 1 auto}.filter-condition-row.enum-search{margin-top:var(--clr-base-vertical-offset-xs)}.enum-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}.selection-counter .clr-subtext{color:var(--cds-alias-status-info)}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i2$2.ClrControlHelper,
					selector: "clr-control-helper"
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i6$1.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i6$1.ClrCheckboxContainer,
					selector: "clr-checkbox-container,clr-toggle-container",
					inputs: ["clrInline"]
				},
				{
					kind: "component",
					type: i6$1.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				},
				{
					kind: "directive",
					type: i6$1.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i6$1.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.ClrRadio,
					selector: "[clrRadio]"
				},
				{
					kind: "component",
					type: i6$1.ClrRadioContainer,
					selector: "clr-radio-container",
					inputs: ["clrInline"]
				},
				{
					kind: "component",
					type: i6$1.ClrRadioWrapper,
					selector: "clr-radio-wrapper"
				},
				{
					kind: "directive",
					type: i6$1.ClrSelect,
					selector: "[clrSelect]"
				},
				{
					kind: "component",
					type: i6$1.ClrSelectContainer,
					selector: "clr-select-container"
				},
				{
					kind: "component",
					type: i6.ClrSpinner,
					selector: "clr-spinner",
					inputs: [
						"clrInline",
						"clrInverse",
						"clrSmall",
						"clrMedium"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i3$1.CheckboxControlValueAccessor,
					selector: "input[type=checkbox]:not([ngNoCva])[formControlName],input[type=checkbox]:not([ngNoCva])[formControl],input[type=checkbox]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i3$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i3$1.RadioControlValueAccessor,
					selector: "input[type=radio]:not([ngNoCva])[formControlName],input[type=radio]:not([ngNoCva])[formControl],input[type=radio]:not([ngNoCva])[ngModel]",
					inputs: [
						"name",
						"formControlName",
						"value"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i3$1.FormControlDirective,
					selector: "[formControl]",
					inputs: [
						"formControl",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormGroupDirective,
					selector: "[formGroup]",
					inputs: ["formGroup"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormControlName,
					selector: "[formControlName]",
					inputs: [
						"formControlName",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"]
				},
				{
					kind: "component",
					type: FilterFormComponent,
					selector: "appfx-filter-form",
					inputs: ["valid"],
					outputs: ["cancel", "apply"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: EnumFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-enum-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"enumFilterForm\"\n  [valid]=\"enumFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"enum-filter-wrapper filter-scroll-region\">\n    <div *ngIf=\"additionalOperators\" class=\"filter-condition-row\">\n      <clr-select-container class=\"enum-operator\">\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"enumOperator\">\n          <option *ngFor=\"let operator of enumOperators; trackBy: trackByOperator\" [ngValue]=\"operator\">\n            {{ filterStrings.getOperatorDisplayName(operator) }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <label class=\"clr-control-label text-left mt-compact\">\n      {{ filterStrings.valueLabel }}\n    </label>\n\n    <!-- The search narrows the options below; it is not part of the condition, so it sits under Value. -->\n    <div *ngIf=\"filterProperty.searchable\" class=\"filter-condition-row enum-search\" data-test-id=\"enum-search\">\n      <clr-input-container class=\"filter-value\">\n        <label class=\"clr-sr-only\">{{ filterStrings.searchOptions }}</label>\n        <input clrInput type=\"text\" [placeholder]=\"filterStrings.searchPlaceholder\" formControlName=\"searchTerm\" />\n        <cds-icon shape=\"search\" clrInputPrefix></cds-icon>\n        <cds-icon\n          *ngIf=\"enumFilterForm.get('searchTerm')?.value\"\n          shape=\"window-close\"\n          clrInputSuffix\n          (click)=\"clearSearch()\"\n        ></cds-icon>\n        <clr-control-helper *ngIf=\"filteredOptions.length\">\n          {{\n            filterStrings.formatString(filterStrings.showingFormat, [\n              filteredOptions.length.toString(),\n              searchResultsLen.toString(),\n            ])\n          }}\n        </clr-control-helper>\n        <clr-control-helper *ngIf=\"filteredOptions.length === 0 && enumFilterForm.get('searchTerm')?.value\">\n          {{ filterStrings.noValuesFound }}\n        </clr-control-helper>\n      </clr-input-container>\n    </div>\n\n    <div *ngIf=\"filteredOptions.length\" cds-layout=\"m-t:xs m-l:xxs\" class=\"selection-counter\">\n      <span *ngIf=\"!filterProperty.singleSelect\" class=\"clr-subtext\" cds-text=\"body medium\">\n        {{ filterStrings.formatString(filterStrings.elementsSelectedFormat, [selectedCount.toString()]) }}\n      </span>\n    </div>\n\n    <div *ngIf=\"isProcessing\" class=\"loading-overlay\">\n      <div class=\"loading-content\">\n        <clr-spinner clrMedium>{{ filterStrings.loading }}</clr-spinner>\n      </div>\n    </div>\n\n    <div class=\"filter-options\" cds-layout=\"m-t:xs\">\n      <clr-checkbox-container *ngIf=\"!filterProperty.singleSelect\" class=\"enum-options\">\n        <clr-checkbox-wrapper *ngIf=\"filterProperty.enableSelectAll\" cds-layout=\"m-b:xs\">\n          <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n          <label>\n            {{ enumFilterForm.get('searchTerm')?.value ? filterStrings.allSearchResults : filterStrings.selectAll }}\n          </label>\n        </clr-checkbox-wrapper>\n\n        <clr-checkbox-wrapper *ngFor=\"let item of filteredOptions; trackBy: trackByFilteredOption\">\n          <input\n            type=\"checkbox\"\n            clrCheckbox\n            [formControl]=\"$any(optionsFormArray.at(item.index))\"\n            (change)=\"onOptionChange()\"\n          />\n          <label>\n            {{ item.data.value }}\n          </label>\n        </clr-checkbox-wrapper>\n      </clr-checkbox-container>\n\n      <clr-radio-container *ngIf=\"filterProperty.singleSelect\" class=\"enum-options\">\n        <clr-radio-wrapper *ngFor=\"let option of filteredOptions; trackBy: trackByFilteredOption\">\n          <input type=\"radio\" clrRadio formControlName=\"singleSelectOption\" [value]=\"option.data.key\" />\n          <label>\n            {{ option.data.value }}\n          </label>\n        </clr-radio-wrapper>\n      </clr-radio-container>\n\n      <!-- At the end of the scrolling list, so it shows once the user reaches the last loaded option. -->\n      <button\n        *ngIf=\"filteredOptions.length < searchResultsLen\"\n        type=\"button\"\n        class=\"btn btn-link enum-load-more\"\n        data-test-id=\"load-more\"\n        (click)=\"loadMore()\"\n      >\n        {{ filterStrings.loadMore }}\n      </button>\n    </div>\n  </div>\n</appfx-filter-form>\n",
			styles: [".enum-options{margin-top:var(--clr-base-vertical-offset-2xs);text-align:left}.enum-filter-wrapper{display:flex;flex-direction:column;min-height:0}.enum-filter-wrapper>*{flex-shrink:0}.enum-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.enum-operator{flex:1 1 auto}.filter-condition-row.enum-search{margin-top:var(--clr-base-vertical-offset-xs)}.enum-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}.selection-counter .clr-subtext{color:var(--cds-alias-status-info)}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [
		{ type: i3$1.FormBuilder },
		{ type: DatagridFiltersStrings },
		{ type: i0.ChangeDetectorRef }
	],
	propDecorators: {
		filterProperty: [{ type: Input }],
		propertyFilter: [{ type: Input }],
		filterCriteriaChange: [{ type: Output }]
	}
});
const enterKey$1 = "Enter";
const unmericPatternRegex = "^-?[0-9]+$";
var GeneralFilterComponent = class GeneralFilterComponent {
	constructor(formBuilder, filterStrings) {
		this.formBuilder = formBuilder;
		this.filterStrings = filterStrings;
		this.id = uniqueIdFactory();
		this.isEmptyOperator = ComparisonOperator.IsEmpty;
		this.units = [];
		this.isNumericUnitProperty = false;
		this.filterCriteriaChange = new EventEmitter();
		this.LogicalOperator = LogicalOperator;
		this.destroyRef = inject(DestroyRef);
		this.injector = inject(Injector);
		this.logicalOperators = [LogicalOperator.And, LogicalOperator.Or];
	}
	get conditions() {
		return this.generalFilterForm.controls.conditions;
	}
	get hasEmptyPredicate() {
		return this.conditions.controls.some((condition) => condition.controls.operator.value === this.isEmptyOperator);
	}
	ngOnInit() {
		this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
		this.comparisonOperators = this.filterProperty.getOperators();
		this.units = this.applicableUnits();
		const conditionCount = this.filterProperty.singleCondition ? 1 : Math.max(1, this.propertyFilter?.criteria.length ?? 0);
		this.generalFilterForm = this.formBuilder.nonNullable.group({
			conditions: this.formBuilder.nonNullable.array(Array.from({ length: conditionCount }, (_, index) => this.createCondition(index))),
			logicalOperator: [this.filterProperty.logicalOperator ?? this.propertyFilter?.operator ?? LogicalOperator.And]
		});
		this.conditions.valueChanges.pipe(map((rows) => rows.map((row) => row.operator).join()), distinctUntilChanged$1(), takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateConditionValidators());
		this.updateConditionValidators();
	}
	ngOnChanges() {
		this.isNumericUnitProperty = this.isNumericUnitFilterProperty();
		this.comparisonOperators = this.filterProperty.getOperators();
		if (this.isNumericUnitProperty && this.generalFilterForm) {
			this.units = this.applicableUnits();
			this.conditions.controls.forEach((condition, index) => condition.controls.unit.setValue(this.initUnit(index)));
		}
	}
	onInputKeyPress(event) {
		if (event.key === enterKey$1) {
			event.stopPropagation();
			event.preventDefault();
			if (this.generalFilterForm.valid) this.onApplyButtonClick();
		}
	}
	addCondition() {
		if (!this.filterProperty.singleCondition) {
			this.conditions.push(this.createCondition());
			this.focusCondition(this.conditions.length - 1);
		}
	}
	removeCondition(index) {
		if (this.conditions.length > 1 && index >= 0 && index < this.conditions.length) {
			this.conditions.removeAt(index);
			this.focusCondition(Math.min(index, this.conditions.length - 1));
		}
	}
	onApplyButtonClick() {
		if (!this.generalFilterForm.valid) return;
		const rows = this.conditions.getRawValue();
		const filter = new PropertyFilter();
		if (this.isNumericUnitProperty) filter.editorState = {
			values: rows.map((row) => row.value),
			units: rows.map((row) => row.unit)
		};
		filter.operator = this.filterProperty.logicalOperator ?? this.generalFilterForm.controls.logicalOperator.value;
		filter.criteria = rows.map((row) => {
			const predicate = new PropertyPredicate();
			predicate.filterableProperty = this.filterProperty;
			predicate.operator = row.operator;
			predicate.value = row.operator === this.isEmptyOperator ? void 0 : this.convertValue(row.value, row.unit);
			return predicate;
		});
		this.filterCriteriaChange.emit(filter);
	}
	onCancelButtonClick() {
		this.filterCriteriaChange.emit();
	}
	createCondition(index = -1) {
		return this.formBuilder.nonNullable.group({
			operator: [this.initOperator(index), Validators.required],
			value: [this.initValue(index)],
			unit: [this.initUnit(index)]
		});
	}
	updateConditionValidators() {
		this.conditions.controls.forEach((condition) => {
			const value = condition.controls.value;
			value.setValidators(condition.controls.operator.value === this.isEmptyOperator ? [] : this.initValidators());
			value.updateValueAndValidity({ emitEvent: false });
		});
		if (this.hasEmptyPredicate && this.filterProperty.logicalOperator === void 0) this.generalFilterForm.controls.logicalOperator.setValue(LogicalOperator.Or, { emitEvent: false });
	}
	focusCondition(index) {
		afterNextRender(() => this.operatorSelects.get(index)?.nativeElement.focus(), { injector: this.injector });
	}
	initOperator(index) {
		const selectedOperator = this.propertyFilter?.criteria[index]?.operator;
		const defaultOperator = this.filterProperty instanceof StringPropertyDefinition ? ComparisonOperator.Contains : ComparisonOperator.Equals;
		return selectedOperator ?? (this.comparisonOperators.includes(defaultOperator) ? defaultOperator : this.comparisonOperators[0]);
	}
	initValidators() {
		const validators = [Validators.required];
		if (this.filterProperty instanceof NumericPropertyDefinition) validators.push(Validators.pattern(unmericPatternRegex));
		return validators;
	}
	isNumericUnitFilterProperty() {
		return this.filterProperty instanceof NumericPropertyDefinition && this.filterProperty.unit !== void 0;
	}
	applicableUnits() {
		if (this.isNumericUnitProperty) switch (this.filterProperty.unit) {
			case Unit.Byte: return [
				Unit.Byte,
				Unit.KB,
				Unit.MB,
				Unit.GB,
				Unit.TB
			];
			case Unit.KB: return [
				Unit.KB,
				Unit.MB,
				Unit.GB,
				Unit.TB
			];
			case Unit.MB: return [
				Unit.MB,
				Unit.GB,
				Unit.TB
			];
			case Unit.GB: return [Unit.GB, Unit.TB];
			case Unit.TB: return [Unit.TB];
			case Unit.BytePS: return [
				Unit.BytePS,
				Unit.KBytePS,
				Unit.MBytePS,
				Unit.GBytePS
			];
			case Unit.KBytePS: return [
				Unit.KBytePS,
				Unit.MBytePS,
				Unit.GBytePS
			];
			case Unit.MBytePS: return [Unit.MBytePS, Unit.GBytePS];
			case Unit.GBytePS: return [Unit.GBytePS];
			case Unit.BitPS: return [
				Unit.BitPS,
				Unit.KBitPS,
				Unit.MBitPS,
				Unit.GBitPS
			];
			case Unit.KBitPS: return [
				Unit.KBitPS,
				Unit.MBitPS,
				Unit.GBitPS
			];
			case Unit.MBitPS: return [Unit.MBitPS, Unit.GBitPS];
			case Unit.GBitPS: return [Unit.GBitPS];
			case Unit.HZ: return [
				Unit.HZ,
				Unit.KHZ,
				Unit.MHZ,
				Unit.GHZ
			];
			case Unit.KHZ: return [
				Unit.KHZ,
				Unit.MHZ,
				Unit.GHZ
			];
			case Unit.MHZ: return [Unit.MHZ, Unit.GHZ];
			case Unit.GHZ: return [Unit.GHZ];
			default: return [];
		}
		return [];
	}
	initUnit(index) {
		if (this.isNumericUnitProperty) {
			if (this.propertyFilter?.criteria[index]) return this.getSelectedUnit(index);
			else return this.units.length > 0 ? this.units[0] : Unit.MB;
		}
		return Unit.MB;
	}
	getSelectedUnit(index) {
		return this.propertyFilter?.editorState?.units?.[index] ?? this.filterProperty.unit;
	}
	initValue(index) {
		if (this.isNumericUnitProperty) return this.propertyFilter?.editorState?.values?.[index] ?? this.propertyFilter?.criteria[index]?.value ?? "";
		else return this.propertyFilter?.criteria[index]?.value ?? "";
	}
	convertValue(value, sourceUnit) {
		if (this.isNumericUnitProperty) {
			const targetUnit = this.filterProperty.unit;
			if (targetUnit === sourceUnit) return value;
			const amount = Number(value);
			switch (targetUnit) {
				case Unit.Byte: switch (sourceUnit) {
					case Unit.KB: return amount * 1024;
					case Unit.MB: return amount * 1024 * 1024;
					case Unit.GB: return amount * 1024 * 1024 * 1024;
					case Unit.TB: return amount * 1024 * 1024 * 1024 * 1024;
					default: return value;
				}
				case Unit.KB: switch (sourceUnit) {
					case Unit.MB: return amount * 1024;
					case Unit.GB: return amount * 1024 * 1024;
					case Unit.TB: return amount * 1024 * 1024 * 1024;
					default: return value;
				}
				case Unit.MB: switch (sourceUnit) {
					case Unit.GB: return amount * 1024;
					case Unit.TB: return amount * 1024 * 1024;
					default: return value;
				}
				case Unit.GB: switch (sourceUnit) {
					case Unit.TB: return amount * 1024;
					default: return value;
				}
				case Unit.HZ: switch (sourceUnit) {
					case Unit.KHZ: return amount * 1e3;
					case Unit.MHZ: return amount * 1e3 * 1e3;
					case Unit.GHZ: return amount * 1e3 * 1e3 * 1e3;
					default: return value;
				}
				case Unit.KHZ: switch (sourceUnit) {
					case Unit.MHZ: return amount * 1e3;
					case Unit.GHZ: return amount * 1e3 * 1e3;
					default: return value;
				}
				case Unit.MHZ: switch (sourceUnit) {
					case Unit.GHZ: return amount * 1e3;
					default: return value;
				}
				case Unit.BytePS: switch (sourceUnit) {
					case Unit.KBytePS: return amount * 1e3;
					case Unit.MBytePS: return amount * 1e3 * 1e3;
					case Unit.GBytePS: return amount * 1e3 * 1e3 * 1e3;
					default: return value;
				}
				case Unit.KBytePS: switch (sourceUnit) {
					case Unit.MBytePS: return amount * 1e3;
					case Unit.GBytePS: return amount * 1e3 * 1e3;
					default: return value;
				}
				case Unit.MBytePS: switch (sourceUnit) {
					case Unit.GBytePS: return amount * 1e3;
					default: return value;
				}
				case Unit.BitPS: switch (sourceUnit) {
					case Unit.KBitPS: return amount * 1e3;
					case Unit.MBitPS: return amount * 1e3 * 1e3;
					case Unit.GBitPS: return amount * 1e3 * 1e3 * 1e3;
					default: return value;
				}
				case Unit.KBitPS: switch (sourceUnit) {
					case Unit.MBitPS: return amount * 1e3;
					case Unit.GBitPS: return amount * 1e3 * 1e3;
					default: return value;
				}
				case Unit.MBitPS: switch (sourceUnit) {
					case Unit.GBitPS: return amount * 1e3;
					default: return value;
				}
				default: return value;
			}
		}
		return value;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: GeneralFilterComponent,
			deps: [{ token: i3$1.FormBuilder }, { token: DatagridFiltersStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: GeneralFilterComponent,
			isStandalone: false,
			selector: "appfx-general-filter",
			inputs: {
				filterProperty: "filterProperty",
				propertyFilter: "propertyFilter"
			},
			outputs: { filterCriteriaChange: "filterCriteriaChange" },
			viewQueries: [{
				propertyName: "operatorSelects",
				predicate: ["operatorSelect"],
				descendants: true
			}],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"generalFilterForm\"\n  [valid]=\"generalFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n    @if (!filterProperty.singleCondition && filterProperty.logicalOperator == undefined) {\n      <div\n        class=\"btn-group btn-sm filter-logic\"\n        role=\"radiogroup\"\n        [attr.aria-label]=\"\n          filterStrings.getConjoinerDisplayName(LogicalOperator.And) +\n          ' / ' +\n          filterStrings.getConjoinerDisplayName(LogicalOperator.Or)\n        \"\n      >\n        @for (operator of logicalOperators; track operator) {\n          <!-- The input is hidden, so the button shows the disabled state (And is not allowed with Is empty). -->\n          <div class=\"radio btn\" [class.disabled]=\"operator === LogicalOperator.And && hasEmptyPredicate\">\n            <input\n              type=\"radio\"\n              [id]=\"id + '-logic-' + operator\"\n              [name]=\"id + '-logic'\"\n              [checked]=\"generalFilterForm.controls.logicalOperator.value === operator\"\n              [disabled]=\"operator === LogicalOperator.And && hasEmptyPredicate\"\n              (change)=\"generalFilterForm.controls.logicalOperator.setValue(operator)\"\n            />\n            <label [for]=\"id + '-logic-' + operator\">{{ filterStrings.getConjoinerDisplayName(operator) }}</label>\n          </div>\n        }\n      </div>\n    }\n  </div>\n  <div formArrayName=\"conditions\">\n    @for (condition of conditions.controls; track condition; let index = $index; let last = $last) {\n      <div class=\"filter-condition-row\" [formGroupName]=\"index\">\n        <clr-select-container class=\"filter-operator\">\n          <label class=\"clr-sr-only\">{{ filterStrings.operatorLabel }}</label>\n          <select #operatorSelect clrSelect formControlName=\"operator\">\n            @for (operator of comparisonOperators; track operator) {\n              <option [ngValue]=\"operator\">{{ filterStrings.getOperatorDisplayName(operator) }}</option>\n            }\n          </select>\n        </clr-select-container>\n        @if (condition.controls.operator.value !== isEmptyOperator) {\n          <clr-input-container class=\"filter-value\">\n            <label class=\"clr-sr-only\">{{ filterStrings.enterValue }}</label>\n            <input\n              type=\"text\"\n              formControlName=\"value\"\n              [placeholder]=\"filterStrings.enterValue\"\n              clrInput\n              (keydown)=\"onInputKeyPress($event)\"\n            />\n            <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n              filterStrings.requiredValidatorMessage\n            }}</clr-control-error>\n            <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n              filterStrings.integerValidatorMessage\n            }}</clr-control-error>\n          </clr-input-container>\n          @if (isNumericUnitProperty) {\n            <clr-select-container class=\"filter-unit\">\n              <label class=\"clr-sr-only\">{{ filterStrings.unitAriaLabel }}</label>\n              <select clrSelect formControlName=\"unit\">\n                @for (unit of units; track unit) {\n                  <option [ngValue]=\"unit\">{{ filterStrings.getUnitDisplayName(unit) }}</option>\n                }\n              </select>\n            </clr-select-container>\n          }\n        }\n        @if (!filterProperty.singleCondition) {\n          <button\n            type=\"button\"\n            class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n            data-test-id=\"close-button\"\n            [attr.aria-label]=\"filterStrings.removeConditionAriaLabel + ' ' + (index + 1)\"\n            [disabled]=\"conditions.length === 1\"\n            (click)=\"removeCondition(index)\"\n          >\n            <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n          </button>\n        }\n      </div>\n      @if (!last) {\n        <div\n          class=\"filter-logic-divider\"\n          data-test-id=\"logical-operator\"\n          [attr.aria-hidden]=\"\n            !filterProperty.singleCondition && filterProperty.logicalOperator == undefined ? 'true' : null\n          \"\n        >\n          <span class=\"filter-logic-label\">{{\n            filterStrings.getConjoinerDisplayName(\n              filterProperty.logicalOperator ?? generalFilterForm.controls.logicalOperator.value\n            )\n          }}</span>\n        </div>\n      }\n    }\n  </div>\n  @if (!filterProperty.singleCondition) {\n    <button\n      type=\"button\"\n      class=\"btn btn-sm btn-outline filter-add-condition\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addCondition\"\n      (click)=\"addCondition()\"\n    >\n      {{ filterStrings.addCondition }}\n    </button>\n  }\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n</appfx-filter-form>\n",
			styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i2$2.ClrControlError,
					selector: "clr-control-error"
				},
				{
					kind: "directive",
					type: i2$2.ClrIfError,
					selector: "[clrIfError]",
					inputs: ["clrIfError"]
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i6$1.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i6$1.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.ClrSelect,
					selector: "[clrSelect]"
				},
				{
					kind: "component",
					type: i6$1.ClrSelectContainer,
					selector: "clr-select-container"
				},
				{
					kind: "directive",
					type: i3$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i3$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i3$1.FormGroupDirective,
					selector: "[formGroup]",
					inputs: ["formGroup"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormControlName,
					selector: "[formControlName]",
					inputs: [
						"formControlName",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"]
				},
				{
					kind: "directive",
					type: i3$1.FormGroupName,
					selector: "[formGroupName]",
					inputs: ["formGroupName"]
				},
				{
					kind: "directive",
					type: i3$1.FormArrayName,
					selector: "[formArrayName]",
					inputs: ["formArrayName"]
				},
				{
					kind: "component",
					type: FilterFormComponent,
					selector: "appfx-filter-form",
					inputs: ["valid"],
					outputs: ["cancel", "apply"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: GeneralFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-general-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"generalFilterForm\"\n  [valid]=\"generalFilterForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n    @if (!filterProperty.singleCondition && filterProperty.logicalOperator == undefined) {\n      <div\n        class=\"btn-group btn-sm filter-logic\"\n        role=\"radiogroup\"\n        [attr.aria-label]=\"\n          filterStrings.getConjoinerDisplayName(LogicalOperator.And) +\n          ' / ' +\n          filterStrings.getConjoinerDisplayName(LogicalOperator.Or)\n        \"\n      >\n        @for (operator of logicalOperators; track operator) {\n          <!-- The input is hidden, so the button shows the disabled state (And is not allowed with Is empty). -->\n          <div class=\"radio btn\" [class.disabled]=\"operator === LogicalOperator.And && hasEmptyPredicate\">\n            <input\n              type=\"radio\"\n              [id]=\"id + '-logic-' + operator\"\n              [name]=\"id + '-logic'\"\n              [checked]=\"generalFilterForm.controls.logicalOperator.value === operator\"\n              [disabled]=\"operator === LogicalOperator.And && hasEmptyPredicate\"\n              (change)=\"generalFilterForm.controls.logicalOperator.setValue(operator)\"\n            />\n            <label [for]=\"id + '-logic-' + operator\">{{ filterStrings.getConjoinerDisplayName(operator) }}</label>\n          </div>\n        }\n      </div>\n    }\n  </div>\n  <div formArrayName=\"conditions\">\n    @for (condition of conditions.controls; track condition; let index = $index; let last = $last) {\n      <div class=\"filter-condition-row\" [formGroupName]=\"index\">\n        <clr-select-container class=\"filter-operator\">\n          <label class=\"clr-sr-only\">{{ filterStrings.operatorLabel }}</label>\n          <select #operatorSelect clrSelect formControlName=\"operator\">\n            @for (operator of comparisonOperators; track operator) {\n              <option [ngValue]=\"operator\">{{ filterStrings.getOperatorDisplayName(operator) }}</option>\n            }\n          </select>\n        </clr-select-container>\n        @if (condition.controls.operator.value !== isEmptyOperator) {\n          <clr-input-container class=\"filter-value\">\n            <label class=\"clr-sr-only\">{{ filterStrings.enterValue }}</label>\n            <input\n              type=\"text\"\n              formControlName=\"value\"\n              [placeholder]=\"filterStrings.enterValue\"\n              clrInput\n              (keydown)=\"onInputKeyPress($event)\"\n            />\n            <clr-control-error *clrIfError=\"'required'\" role=\"alert\">{{\n              filterStrings.requiredValidatorMessage\n            }}</clr-control-error>\n            <clr-control-error *clrIfError=\"'pattern'\" role=\"alert\">{{\n              filterStrings.integerValidatorMessage\n            }}</clr-control-error>\n          </clr-input-container>\n          @if (isNumericUnitProperty) {\n            <clr-select-container class=\"filter-unit\">\n              <label class=\"clr-sr-only\">{{ filterStrings.unitAriaLabel }}</label>\n              <select clrSelect formControlName=\"unit\">\n                @for (unit of units; track unit) {\n                  <option [ngValue]=\"unit\">{{ filterStrings.getUnitDisplayName(unit) }}</option>\n                }\n              </select>\n            </clr-select-container>\n          }\n        }\n        @if (!filterProperty.singleCondition) {\n          <button\n            type=\"button\"\n            class=\"btn btn-sm btn-link btn-icon filter-condition-remove\"\n            data-test-id=\"close-button\"\n            [attr.aria-label]=\"filterStrings.removeConditionAriaLabel + ' ' + (index + 1)\"\n            [disabled]=\"conditions.length === 1\"\n            (click)=\"removeCondition(index)\"\n          >\n            <cds-icon size=\"20\" shape=\"window-close\"></cds-icon>\n          </button>\n        }\n      </div>\n      @if (!last) {\n        <div\n          class=\"filter-logic-divider\"\n          data-test-id=\"logical-operator\"\n          [attr.aria-hidden]=\"\n            !filterProperty.singleCondition && filterProperty.logicalOperator == undefined ? 'true' : null\n          \"\n        >\n          <span class=\"filter-logic-label\">{{\n            filterStrings.getConjoinerDisplayName(\n              filterProperty.logicalOperator ?? generalFilterForm.controls.logicalOperator.value\n            )\n          }}</span>\n        </div>\n      }\n    }\n  </div>\n  @if (!filterProperty.singleCondition) {\n    <button\n      type=\"button\"\n      class=\"btn btn-sm btn-outline filter-add-condition\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addCondition\"\n      (click)=\"addCondition()\"\n    >\n      {{ filterStrings.addCondition }}\n    </button>\n  }\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n</appfx-filter-form>\n",
			styles: [".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [{ type: i3$1.FormBuilder }, { type: DatagridFiltersStrings }],
	propDecorators: {
		filterProperty: [{ type: Input }],
		propertyFilter: [{ type: Input }],
		filterCriteriaChange: [{ type: Output }],
		operatorSelects: [{
			type: ViewChildren,
			args: ["operatorSelect"]
		}]
	}
});
var DatagridFiltersUserService = class DatagridFiltersUserService {
	getDomains() {
		return of([]);
	}
	searchUsers(searchTerm, domain) {
		return of([]);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFiltersUserService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFiltersUserService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFiltersUserService,
	decorators: [{ type: Injectable }]
});
var ErrorType;
(function(ErrorType) {
	ErrorType[ErrorType["DOMAIN"] = 0] = "DOMAIN";
	ErrorType[ErrorType["USER_SEARCH"] = 1] = "USER_SEARCH";
})(ErrorType || (ErrorType = {}));
var UsersFilterComponent = class UsersFilterComponent {
	#pageSize;
	#currentMaxShown;
	#selectedFilterCriteria;
	#searchTermDebounceTime;
	#destroy$;
	constructor(fb, cdr, filterStrings, userService) {
		this.fb = fb;
		this.cdr = cdr;
		this.filterStrings = filterStrings;
		this.userService = userService;
		this.filterCriteriaChange = new EventEmitter();
		this.isLoading = false;
		this.domains = [""];
		this.allFetchedUsers = [];
		this.visibleUsers = [];
		this.selectedValues = /* @__PURE__ */ new Set();
		this.#pageSize = 50;
		this.#currentMaxShown = this.#pageSize;
		this.#selectedFilterCriteria = new PropertyFilter();
		this.#searchTermDebounceTime = 200;
		this.#destroy$ = new Subject();
		this.selectionValidator = () => {
			return this.selectedValues.size > 0 ? null : { required: true };
		};
	}
	get optionsFormArray() {
		return this.usersSelectionForm?.get("options");
	}
	get hasMoreItems() {
		return this.visibleUsers.length < this.allFetchedUsers.length;
	}
	trackByOperator(_index, operator) {
		return operator;
	}
	trackByDomain(_index, domain) {
		return domain;
	}
	ngOnInit() {
		this.createUsersSelectionForm();
		this.setupListeners();
		this.initializeSelectionInEditMode();
		this.loadDomains();
	}
	ngOnChanges(changes) {
		if (changes["propertyFilter"] && !changes["propertyFilter"].firstChange) {
			this.initializeSelectionInEditMode();
			this.rebuildCheckboxList();
		}
	}
	ngOnDestroy() {
		this.#destroy$.next();
		this.#destroy$.complete();
	}
	onDomainChange() {
		const term = this.usersSelectionForm.get("searchTerm")?.value || "";
		this.usersSelectionForm.get("searchTerm")?.setValue(term);
	}
	fetchUsers(searchTerm) {
		return this.userService.searchUsers(searchTerm, this.usersSelectionForm.get("domain")?.value);
	}
	loadMore(event) {
		event.preventDefault();
		event.stopPropagation();
		this.#currentMaxShown += this.#pageSize;
		this.rebuildCheckboxList();
	}
	onOptionChange(index) {
		const user = this.visibleUsers[index];
		if (this.optionsFormArray.at(index).value) this.selectedValues.add(user);
		else this.selectedValues.delete(user);
		this.updateSelectAllState();
		this.usersSelectionForm.updateValueAndValidity();
	}
	onSelectAllChange() {
		const selectAllValue = this.usersSelectionForm.get("selectAll")?.value;
		this.optionsFormArray.controls.forEach((ctrl) => {
			ctrl.setValue(selectAllValue, { emitEvent: false });
		});
		this.visibleUsers.forEach((user) => {
			if (selectAllValue) this.selectedValues.add(user);
			else this.selectedValues.delete(user);
		});
		this.usersSelectionForm.updateValueAndValidity();
	}
	clearSearch() {
		this.usersSelectionForm.get("searchTerm")?.setValue("");
	}
	handleError(error, errorType) {
		if (errorType === ErrorType.USER_SEARCH) {
			console.error("Error searching users: ", error);
			this.errorSearchingUsers = this.filterStrings.errorSearchingUsers;
		} else if (errorType === ErrorType.DOMAIN) {
			console.error("Error loading domains: ", error);
			this.errorRetrievingDomains = this.filterStrings.errorLoadingDomains;
		}
		this.isLoading = false;
		this.cdr.markForCheck();
		if (errorType === ErrorType.DOMAIN) return of([]);
		else {
			const searchValue = this.usersSelectionForm.get("searchTerm")?.value;
			return searchValue ? of([searchValue]) : of([]);
		}
	}
	showLoading() {
		this.isLoading = true;
		this.cdr.markForCheck();
	}
	hideLoading() {
		this.isLoading = false;
		this.cdr.markForCheck();
	}
	onCancelButtonClick() {
		this.filterCriteriaChange.emit();
	}
	onApplyButtonClick() {
		const comparisonOperator = this.usersSelectionForm.get("userOperator")?.value || ComparisonOperator.Equals;
		this.#selectedFilterCriteria.criteria = Array.from(this.selectedValues).map((userValue) => this.createUserPropertyPredicate(userValue, comparisonOperator));
		this.#selectedFilterCriteria.operator = comparisonOperator === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
		this.filterCriteriaChange.emit(this.#selectedFilterCriteria);
	}
	setupListeners() {
		this.usersSelectionForm.get("searchTerm")?.valueChanges.pipe(takeUntil(this.#destroy$), tap(() => {
			this.showLoading();
			this.errorSearchingUsers = void 0;
		}), debounceTime(this.#searchTermDebounceTime), switchMap((term) => this.fetchUsers(term).pipe(catchError((error) => this.handleError(error, ErrorType.USER_SEARCH)))), tap((results) => {
			this.allFetchedUsers = results;
			this.resetPagination();
			this.rebuildCheckboxList();
			this.hideLoading();
		})).subscribe();
		this.usersSelectionForm.get("userOperator")?.valueChanges.pipe(takeUntil(this.#destroy$)).subscribe((op) => {
			this.#selectedFilterCriteria.operator = op === ComparisonOperator.Equals ? LogicalOperator.Or : LogicalOperator.And;
		});
		this.usersSelectionForm.get("userOperator")?.setValue(ComparisonOperator.Equals);
		this.usersSelectionForm.get("domain")?.valueChanges.pipe(takeUntil(this.#destroy$)).subscribe(() => {
			this.usersSelectionForm.get("searchTerm")?.setValue("");
		});
	}
	loadDomains() {
		this.showLoading();
		this.userService.getDomains().pipe(takeUntil(this.#destroy$), catchError((error) => this.handleError(error, ErrorType.DOMAIN))).subscribe((domains) => {
			this.domains = domains;
			const currentDomain = this.usersSelectionForm.get("domain")?.value;
			if (domains.length > 0 && !currentDomain) this.usersSelectionForm.get("domain")?.setValue(domains[0]);
		});
	}
	resetPagination() {
		this.#currentMaxShown = this.#pageSize;
	}
	createUsersSelectionForm() {
		this.usersSelectionForm = this.fb.group({
			userOperator: [ComparisonOperator.Equals],
			domain: [null],
			searchTerm: [""],
			selectAll: [false],
			options: this.fb.array([])
		}, { validators: this.selectionValidator });
	}
	initializeSelectionInEditMode() {
		if (!this.propertyFilter) return;
		const initialOp = this.propertyFilter.operator === LogicalOperator.And ? ComparisonOperator.DoesNotEqual : ComparisonOperator.Equals;
		this.usersSelectionForm.get("userOperator")?.setValue(initialOp, { emitEvent: false });
		const users = this.propertyFilter.criteria?.map((c) => c.value) || [];
		this.selectedValues = new Set(users);
		this.usersSelectionForm.updateValueAndValidity();
	}
	rebuildCheckboxList() {
		const slicedUsers = this.allFetchedUsers.slice(0, this.#currentMaxShown);
		this.visibleUsers = [];
		const visibleUsersSet = /* @__PURE__ */ new Set();
		const searchTerm = this.usersSelectionForm.get("searchTerm")?.value;
		let searchTermMatchCustomUser = false;
		if (searchTerm) {
			this.selectedValues.forEach((user) => {
				if (user.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())) {
					this.visibleUsers.push(user);
					visibleUsersSet.add(user);
				}
				if (user === searchTerm) searchTermMatchCustomUser = true;
			});
			if (!searchTermMatchCustomUser) {
				this.visibleUsers.push(searchTerm);
				visibleUsersSet.add(searchTerm);
			}
		} else this.selectedValues.forEach((user) => {
			if (!visibleUsersSet.has(user)) {
				this.visibleUsers.push(user);
				visibleUsersSet.add(user);
			}
		});
		slicedUsers.filter((user) => !visibleUsersSet.has(user)).forEach((filteredUser) => this.visibleUsers.push(filteredUser));
		const optionsArr = this.optionsFormArray;
		optionsArr.clear();
		this.visibleUsers.forEach((user) => {
			const isSelected = this.selectedValues.has(user);
			optionsArr.push(new FormControl(isSelected));
		});
		this.updateSelectAllState();
		this.cdr.markForCheck();
	}
	updateSelectAllState() {
		if (this.visibleUsers.length === 0) {
			this.usersSelectionForm.get("selectAll")?.setValue(false, { emitEvent: false });
			return;
		}
		const allVisibleSelected = this.visibleUsers.every((u) => this.selectedValues.has(u));
		this.usersSelectionForm.get("selectAll")?.setValue(allVisibleSelected, { emitEvent: false });
	}
	createUserPropertyPredicate(value, comparisonOperator) {
		const res = new PropertyPredicate();
		res.filterableProperty = this.filterProperty;
		res.operator = comparisonOperator;
		res.value = value;
		return res;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: UsersFilterComponent,
			deps: [
				{ token: i3$1.FormBuilder },
				{ token: i0.ChangeDetectorRef },
				{ token: DatagridFiltersStrings },
				{ token: DatagridFiltersUserService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: UsersFilterComponent,
			isStandalone: false,
			selector: "appfx-users-filter",
			inputs: {
				filterProperty: "filterProperty",
				propertyFilter: "propertyFilter"
			},
			outputs: { filterCriteriaChange: "filterCriteriaChange" },
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"usersSelectionForm\"\n  [valid]=\"usersSelectionForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"user-filter-wrapper filter-scroll-region\">\n    <div *ngIf=\"isLoading\" class=\"loading-overlay\">\n      <div class=\"loading-content\">\n        <clr-spinner clrMedium>{{ filterStrings.loading }}</clr-spinner>\n      </div>\n    </div>\n    <div class=\"filter-condition-row\">\n      <clr-select-container class=\"user-filter-select\">\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"userOperator\">\n          <option\n            *ngFor=\"let operator of filterProperty.supportedOperators; trackBy: trackByOperator\"\n            [ngValue]=\"operator\"\n          >\n            {{ filterStrings.getOperatorDisplayName(operator) }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <!-- The domain narrows the user search; it is not part of the condition, so it has its own labelled row. -->\n    <div *ngIf=\"domains && domains.length > 0\" class=\"filter-condition-row\" data-test-id=\"user-domain\">\n      <clr-select-container class=\"user-filter-select\">\n        <label>{{ filterStrings.domain }}</label>\n        <select clrSelect name=\"domain\" formControlName=\"domain\">\n          <option *ngFor=\"let domain of domains; trackBy: trackByDomain\" [value]=\"domain\">\n            {{ domain }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <!-- User -->\n    <label class=\"clr-control-label text-left mt-compact\">\n      {{ filterStrings.user }}\n    </label>\n\n    <clr-input-container cds-layout=\"m-t:xs\">\n      <label class=\"clr-sr-only\">{{ filterStrings.searchPlaceholder }}</label>\n      <input clrInput type=\"text\" [placeholder]=\"filterStrings.searchPlaceholder\" formControlName=\"searchTerm\" />\n      <cds-icon shape=\"search\" clrInputPrefix></cds-icon>\n      <cds-icon\n        *ngIf=\"usersSelectionForm.get('searchTerm')?.value\"\n        shape=\"window-close\"\n        clrInputSuffix\n        (click)=\"clearSearch()\"\n      ></cds-icon>\n    </clr-input-container>\n\n    <div cds-layout=\"m-t:xs m-l:xxs\" class=\"selection-counter\">\n      <span *ngIf=\"selectedValues.size > 0\" class=\"clr-subtext\" cds-text=\"body medium\">\n        {{ filterStrings.formatString(filterStrings.elementsSelectedFormat, [selectedValues.size.toString()]) }}\n      </span>\n    </div>\n\n    <div cds-layout=\"m-t:xs\" class=\"filter-options\">\n      <clr-checkbox-container class=\"enum-options\">\n        <clr-checkbox-wrapper *ngIf=\"visibleUsers.length > 0\" cds-layout=\"m-b:xs\">\n          <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n          <label>\n            {{ usersSelectionForm.get('searchTerm')?.value ? filterStrings.allSearchResults : filterStrings.selectAll }}\n          </label>\n        </clr-checkbox-wrapper>\n\n        <clr-checkbox-wrapper *ngFor=\"let user of visibleUsers; let i = index\">\n          <input\n            type=\"checkbox\"\n            clrCheckbox\n            [formControl]=\"$any(optionsFormArray.at(i))\"\n            (change)=\"onOptionChange(i)\"\n          />\n          <label>\n            {{ user }}\n          </label>\n        </clr-checkbox-wrapper>\n      </clr-checkbox-container>\n\n      <!-- At the end of the scrolling list, so it shows once the user reaches the last loaded user. -->\n      <button\n        *ngIf=\"hasMoreItems\"\n        type=\"button\"\n        class=\"btn btn-link user-load-more\"\n        data-test-id=\"load-more\"\n        (click)=\"loadMore($event)\"\n      >\n        {{ filterStrings.loadMore }}\n      </button>\n\n      <div *ngIf=\"errorSearchingUsers\" class=\"clr-subtext clr-error error\">\n        {{ errorSearchingUsers }}\n      </div>\n\n      <div *ngIf=\"errorRetrievingDomains\" class=\"clr-subtext clr-error error\">\n        {{ errorRetrievingDomains }}\n      </div>\n    </div>\n  </div>\n</appfx-filter-form>\n",
			styles: [
				".user-filter-wrapper{display:flex;flex-direction:column;min-height:0}.user-filter-wrapper>*{flex-shrink:0}.user-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.user-filter-select{flex:1 1 auto}.user-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}\n",
				".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n",
				".enum-options{margin-top:var(--clr-base-vertical-offset-2xs);text-align:left}.enum-filter-wrapper{display:flex;flex-direction:column;min-height:0}.enum-filter-wrapper>*{flex-shrink:0}.enum-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.enum-operator{flex:1 1 auto}.filter-condition-row.enum-search{margin-top:var(--clr-base-vertical-offset-xs)}.enum-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}.selection-counter .clr-subtext{color:var(--cds-alias-status-info)}\n"
			],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i6$1.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i6$1.ClrCheckboxContainer,
					selector: "clr-checkbox-container,clr-toggle-container",
					inputs: ["clrInline"]
				},
				{
					kind: "component",
					type: i6$1.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				},
				{
					kind: "directive",
					type: i6$1.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i6$1.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.ClrSelect,
					selector: "[clrSelect]"
				},
				{
					kind: "component",
					type: i6$1.ClrSelectContainer,
					selector: "clr-select-container"
				},
				{
					kind: "component",
					type: i6.ClrSpinner,
					selector: "clr-spinner",
					inputs: [
						"clrInline",
						"clrInverse",
						"clrSmall",
						"clrMedium"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i3$1.CheckboxControlValueAccessor,
					selector: "input[type=checkbox]:not([ngNoCva])[formControlName],input[type=checkbox]:not([ngNoCva])[formControl],input[type=checkbox]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i3$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatusGroup,
					selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]"
				},
				{
					kind: "directive",
					type: i3$1.FormControlDirective,
					selector: "[formControl]",
					inputs: [
						"formControl",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormGroupDirective,
					selector: "[formGroup]",
					inputs: ["formGroup"],
					outputs: ["ngSubmit"],
					exportAs: ["ngForm"]
				},
				{
					kind: "directive",
					type: i3$1.FormControlName,
					selector: "[formControlName]",
					inputs: [
						"formControlName",
						"disabled",
						"ngModel"
					],
					outputs: ["ngModelChange"]
				},
				{
					kind: "component",
					type: FilterFormComponent,
					selector: "appfx-filter-form",
					inputs: ["valid"],
					outputs: ["cancel", "apply"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: UsersFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-users-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<appfx-filter-form\n  [formGroup]=\"usersSelectionForm\"\n  [valid]=\"usersSelectionForm.valid\"\n  (cancel)=\"onCancelButtonClick()\"\n  (apply)=\"onApplyButtonClick()\"\n>\n  <div class=\"filter-field-row\">\n    <ng-content select=\"[filterField]\"></ng-content>\n  </div>\n  <ng-content select=\"[filterActions]\" ngProjectAs=\"[filterActions]\"></ng-content>\n  <div class=\"user-filter-wrapper filter-scroll-region\">\n    <div *ngIf=\"isLoading\" class=\"loading-overlay\">\n      <div class=\"loading-content\">\n        <clr-spinner clrMedium>{{ filterStrings.loading }}</clr-spinner>\n      </div>\n    </div>\n    <div class=\"filter-condition-row\">\n      <clr-select-container class=\"user-filter-select\">\n        <label class=\"clr-sr-only\">\n          {{ filterStrings.operatorLabel }}\n        </label>\n        <select clrSelect formControlName=\"userOperator\">\n          <option\n            *ngFor=\"let operator of filterProperty.supportedOperators; trackBy: trackByOperator\"\n            [ngValue]=\"operator\"\n          >\n            {{ filterStrings.getOperatorDisplayName(operator) }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <!-- The domain narrows the user search; it is not part of the condition, so it has its own labelled row. -->\n    <div *ngIf=\"domains && domains.length > 0\" class=\"filter-condition-row\" data-test-id=\"user-domain\">\n      <clr-select-container class=\"user-filter-select\">\n        <label>{{ filterStrings.domain }}</label>\n        <select clrSelect name=\"domain\" formControlName=\"domain\">\n          <option *ngFor=\"let domain of domains; trackBy: trackByDomain\" [value]=\"domain\">\n            {{ domain }}\n          </option>\n        </select>\n      </clr-select-container>\n    </div>\n\n    <!-- User -->\n    <label class=\"clr-control-label text-left mt-compact\">\n      {{ filterStrings.user }}\n    </label>\n\n    <clr-input-container cds-layout=\"m-t:xs\">\n      <label class=\"clr-sr-only\">{{ filterStrings.searchPlaceholder }}</label>\n      <input clrInput type=\"text\" [placeholder]=\"filterStrings.searchPlaceholder\" formControlName=\"searchTerm\" />\n      <cds-icon shape=\"search\" clrInputPrefix></cds-icon>\n      <cds-icon\n        *ngIf=\"usersSelectionForm.get('searchTerm')?.value\"\n        shape=\"window-close\"\n        clrInputSuffix\n        (click)=\"clearSearch()\"\n      ></cds-icon>\n    </clr-input-container>\n\n    <div cds-layout=\"m-t:xs m-l:xxs\" class=\"selection-counter\">\n      <span *ngIf=\"selectedValues.size > 0\" class=\"clr-subtext\" cds-text=\"body medium\">\n        {{ filterStrings.formatString(filterStrings.elementsSelectedFormat, [selectedValues.size.toString()]) }}\n      </span>\n    </div>\n\n    <div cds-layout=\"m-t:xs\" class=\"filter-options\">\n      <clr-checkbox-container class=\"enum-options\">\n        <clr-checkbox-wrapper *ngIf=\"visibleUsers.length > 0\" cds-layout=\"m-b:xs\">\n          <input type=\"checkbox\" clrCheckbox formControlName=\"selectAll\" (change)=\"onSelectAllChange()\" />\n          <label>\n            {{ usersSelectionForm.get('searchTerm')?.value ? filterStrings.allSearchResults : filterStrings.selectAll }}\n          </label>\n        </clr-checkbox-wrapper>\n\n        <clr-checkbox-wrapper *ngFor=\"let user of visibleUsers; let i = index\">\n          <input\n            type=\"checkbox\"\n            clrCheckbox\n            [formControl]=\"$any(optionsFormArray.at(i))\"\n            (change)=\"onOptionChange(i)\"\n          />\n          <label>\n            {{ user }}\n          </label>\n        </clr-checkbox-wrapper>\n      </clr-checkbox-container>\n\n      <!-- At the end of the scrolling list, so it shows once the user reaches the last loaded user. -->\n      <button\n        *ngIf=\"hasMoreItems\"\n        type=\"button\"\n        class=\"btn btn-link user-load-more\"\n        data-test-id=\"load-more\"\n        (click)=\"loadMore($event)\"\n      >\n        {{ filterStrings.loadMore }}\n      </button>\n\n      <div *ngIf=\"errorSearchingUsers\" class=\"clr-subtext clr-error error\">\n        {{ errorSearchingUsers }}\n      </div>\n\n      <div *ngIf=\"errorRetrievingDomains\" class=\"clr-subtext clr-error error\">\n        {{ errorRetrievingDomains }}\n      </div>\n    </div>\n  </div>\n</appfx-filter-form>\n",
			styles: [
				".user-filter-wrapper{display:flex;flex-direction:column;min-height:0}.user-filter-wrapper>*{flex-shrink:0}.user-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.user-filter-select{flex:1 1 auto}.user-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}\n",
				".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n",
				".enum-options{margin-top:var(--clr-base-vertical-offset-2xs);text-align:left}.enum-filter-wrapper{display:flex;flex-direction:column;min-height:0}.enum-filter-wrapper>*{flex-shrink:0}.enum-filter-wrapper>.filter-options{flex-shrink:1;min-height:0;overflow-y:auto}.enum-operator{flex:1 1 auto}.filter-condition-row.enum-search{margin-top:var(--clr-base-vertical-offset-xs)}.enum-load-more{margin:var(--clr-base-vertical-offset-xs) 0 0}clr-checkbox-container:not(.clr-default-style){margin-top:0!important;margin-bottom:0!important;min-height:auto!important}.selection-counter .clr-subtext{color:var(--cds-alias-status-info)}\n"
			]
		}]
	}],
	ctorParameters: () => [
		{ type: i3$1.FormBuilder },
		{ type: i0.ChangeDetectorRef },
		{ type: DatagridFiltersStrings },
		{ type: DatagridFiltersUserService }
	],
	propDecorators: {
		filterProperty: [{ type: Input }],
		propertyFilter: [{ type: Input }],
		filterCriteriaChange: [{ type: Output }]
	}
});
var FilterEditorComponent = class FilterEditorComponent {
	constructor() {
		this.filterCriteriaChange = new EventEmitter();
	}
	get generalProperty() {
		return this.property instanceof StringPropertyDefinition || this.property instanceof NumericPropertyDefinition ? this.property : void 0;
	}
	get enumProperty() {
		return this.property instanceof EnumPropertyDefinition ? this.property : void 0;
	}
	get dateTimeProperty() {
		return this.property instanceof DateTimePropertyDefinition ? this.property : void 0;
	}
	get userProperty() {
		return this.property instanceof UserPropertyDefinition ? this.property : void 0;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: FilterEditorComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: FilterEditorComponent,
			isStandalone: false,
			selector: "appfx-filter-editor",
			inputs: {
				property: "property",
				propertyFilter: "propertyFilter",
				fieldTemplate: "fieldTemplate",
				actionsTemplate: "actionsTemplate"
			},
			outputs: { filterCriteriaChange: "filterCriteriaChange" },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- One editor per field type; the caller's field picker and actions are rendered in its slots. -->\n@if (generalProperty; as property) {\n  <appfx-general-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-general-filter>\n} @else if (enumProperty; as property) {\n  <appfx-enum-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-enum-filter>\n} @else if (dateTimeProperty; as property) {\n  <appfx-datetime-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-datetime-filter>\n} @else if (userProperty; as property) {\n  <appfx-users-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-users-filter>\n}\n",
			styles: [":host,:host>*{display:flex;flex-direction:column;min-height:0}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: DateTimeFilterComponent,
					selector: "appfx-datetime-filter",
					inputs: ["propertyFilter", "filterProperty"],
					outputs: ["filterCriteriaChange"]
				},
				{
					kind: "component",
					type: EnumFilterComponent,
					selector: "appfx-enum-filter",
					inputs: ["filterProperty", "propertyFilter"],
					outputs: ["filterCriteriaChange"]
				},
				{
					kind: "component",
					type: GeneralFilterComponent,
					selector: "appfx-general-filter",
					inputs: ["filterProperty", "propertyFilter"],
					outputs: ["filterCriteriaChange"]
				},
				{
					kind: "component",
					type: UsersFilterComponent,
					selector: "appfx-users-filter",
					inputs: ["filterProperty", "propertyFilter"],
					outputs: ["filterCriteriaChange"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: FilterEditorComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-filter-editor",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<!-- One editor per field type; the caller's field picker and actions are rendered in its slots. -->\n@if (generalProperty; as property) {\n  <appfx-general-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-general-filter>\n} @else if (enumProperty; as property) {\n  <appfx-enum-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-enum-filter>\n} @else if (dateTimeProperty; as property) {\n  <appfx-datetime-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-datetime-filter>\n} @else if (userProperty; as property) {\n  <appfx-users-filter\n    [filterProperty]=\"property\"\n    [propertyFilter]=\"propertyFilter\"\n    (filterCriteriaChange)=\"filterCriteriaChange.emit($event)\"\n  >\n    <ng-container filterField [ngTemplateOutlet]=\"fieldTemplate ?? null\"></ng-container>\n    <ng-container filterActions [ngTemplateOutlet]=\"actionsTemplate ?? null\"></ng-container>\n  </appfx-users-filter>\n}\n",
			styles: [":host,:host>*{display:flex;flex-direction:column;min-height:0}\n"]
		}]
	}],
	propDecorators: {
		property: [{ type: Input }],
		propertyFilter: [{ type: Input }],
		fieldTemplate: [{ type: Input }],
		actionsTemplate: [{ type: Input }],
		filterCriteriaChange: [{ type: Output }]
	}
});
var ManageFilterComponent = class ManageFilterComponent {
	constructor(filterStrings) {
		this.filterStrings = filterStrings;
		this.predefined = false;
		this.filterRemoved = new EventEmitter();
		this.popoverId = uniqueIdFactory();
		this.popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.filterCriteriaChange = new EventEmitter();
		this.primaryConditionDisplayText = "";
		this.secondaryConditionDisplayText = "";
		this.editFilterAriaLabel = "";
		this.tooltipText = "";
		this.locale = inject(LOCALE_ID);
		this.popoverService = inject(ClrPopoverService);
		this.noDisplayValueOperators = [
			ComparisonOperator.IsEmpty,
			ComparisonOperator.LastDay,
			ComparisonOperator.LastWeek,
			ComparisonOperator.LastMonth,
			ComparisonOperator.LastYear
		];
	}
	set pillButton(button) {
		this.pillButtonRef = button;
		if (button) this.popoverService.origin = button;
	}
	get open() {
		return this.popoverService.open;
	}
	get active() {
		return !!this.propertyFilter?.criteria.length;
	}
	get additionalConditions() {
		return this.isDateTimeProperty(this.managedProperty) ? 0 : Math.max(0, (this.propertyFilter?.criteria.length || 0) - 1);
	}
	get pillText() {
		if (!this.active) return this.managedProperty.displayName;
		return this.managedProperty.displayName + ": " + this.pillCondition;
	}
	get pillCondition() {
		return this.active ? this.displayFilterValue(0, true) : "";
	}
	ngOnChanges() {
		this.ngOnInit();
	}
	ngOnInit() {
		this.managedProperty = this.propertyFilter?.criteria[0]?.filterableProperty || this.filterProperty;
		this.updateDisplayValues();
	}
	togglePopover(event) {
		this.popoverService.toggleWithEvent(event);
	}
	removeFilter() {
		this.close();
		this.filterRemoved.emit();
	}
	focus() {
		this.pillButtonRef?.nativeElement.focus();
	}
	onFilterCriteriaChange(propertyFilter) {
		this.close();
		if (propertyFilter) {
			if (propertyFilter.criteria.length) this.filterCriteriaChange.emit(propertyFilter);
			else this.filterRemoved.emit();
		}
	}
	close() {
		this.popoverService.open = false;
		this.popoverService.focusOrigin();
	}
	updateDisplayValues() {
		const editHint = ", " + this.filterStrings.editFilterText;
		if (!this.active) {
			this.primaryConditionDisplayText = "";
			this.secondaryConditionDisplayText = "";
			this.tooltipText = this.managedProperty.displayName;
			this.editFilterAriaLabel = this.pillText + editHint;
			return;
		}
		this.primaryConditionDisplayText = this.displayFilterValue(0);
		this.secondaryConditionDisplayText = "";
		let otherConditions = "";
		if (this.propertyFilter.criteria.length > 1 && !this.isDateTimeProperty(this.managedProperty)) {
			this.secondaryConditionDisplayText = this.displayFilterValue(1);
			const conjoiner = " " + this.filterStrings.getConjoinerDisplayName(this.propertyFilter.operator) + " ";
			otherConditions = conjoiner + this.propertyFilter.criteria.slice(1).map((_, index) => this.displayFilterValue(index + 1)).join(conjoiner);
		}
		this.tooltipText = this.managedProperty.displayName + " " + this.primaryConditionDisplayText + otherConditions;
		this.editFilterAriaLabel = this.pillText + otherConditions + editHint;
	}
	displayFilterValue(index, compact = false) {
		if (this.isDateTimeProperty(this.managedProperty)) return this.displayDateTimeFilter(compact);
		if (this.propertyFilter.criteria[index].operator === ComparisonOperator.IsEmpty) return this.operatorDisplayName(this.propertyFilter.criteria[index].operator);
		const property = this.propertyFilter.criteria[index].filterableProperty;
		let value = this.propertyFilter.criteria[index].value;
		if (this.isEnumProperty(property)) value = property.values.get(this.propertyFilter.criteria[index].value) ?? value;
		else if (this.isNumericUnitFilterProperty(property)) {
			const state = this.propertyFilter.editorState;
			value = (state?.values?.[index] ?? value) + " " + this.filterStrings.getUnitDisplayName(state?.units?.[index] ?? property.unit);
		}
		return this.operatorDisplayName(this.propertyFilter.criteria[index].operator) + (compact ? " " : ": ") + value;
	}
	displayDateTimeFilter(compact = false) {
		const separator = compact ? " " : ": ";
		const state = dateTimeEditorState(this.propertyFilter);
		if (!state || state.operator === void 0) {
			const predicate = this.propertyFilter.criteria[0];
			return this.operatorDisplayName(predicate.operator) + separator + this.formatDateTimeValue(predicate.value);
		}
		const operator = state.operator;
		if (operator === ComparisonOperator.CustomRange) return this.filterStrings.fromLabel + separator + this.formatDateTimeValue(state.value) + " " + this.filterStrings.toLabel + separator + this.formatDateTimeValue(state.valueTo);
		else if (this.isNoDisplayValueOperator(operator)) return this.operatorDisplayName(operator);
		else if (operator === ComparisonOperator.TimeSpan) return this.operatorDisplayName(operator) + separator + state.timeSpanValue + " " + this.filterStrings.getTimeSpanDisplayName(state.timeSpan);
		return this.operatorDisplayName(operator) + separator + this.formatDateTimeValue(state.value);
	}
	isNoDisplayValueOperator(operator) {
		return this.noDisplayValueOperators.includes(operator);
	}
	formatDateTimeValue(dateTime) {
		const parsed = parseLocalDateTime(dateTime);
		if (!parsed) return dateTime ?? "";
		const includeSeconds = this.managedProperty.includeSeconds;
		const date = formatDate(parsed.date, "mediumDate", this.locale);
		return parsed.hasTime ? date + " " + formatDate(parsed.date, includeSeconds ? "mediumTime" : "shortTime", this.locale) : date;
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
		return this.isNumericProperty(property) && property.unit !== void 0;
	}
	operatorDisplayName(operator) {
		return this.filterStrings.getOperatorDisplayName(operator);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ManageFilterComponent,
			deps: [{ token: DatagridFiltersStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ManageFilterComponent,
			isStandalone: false,
			selector: "appfx-manage-filter",
			inputs: {
				propertyFilter: "propertyFilter",
				filterProperty: "filterProperty",
				predefined: "predefined"
			},
			outputs: {
				filterRemoved: "filterRemoved",
				filterCriteriaChange: "filterCriteriaChange"
			},
			viewQueries: [{
				propertyName: "pillButton",
				first: true,
				predicate: ["pillButton"],
				descendants: true,
				static: true
			}],
			usesOnChanges: true,
			hostDirectives: [{ directive: i2.ClrPopoverHostDirective }],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-label class=\"filter-pill-label\" [clrColor]=\"active ? 'info' : ''\">\n  <clr-tooltip>\n    <button\n      #pillButton\n      type=\"button\"\n      class=\"filter-pill\"\n      [class.filter-pill-active]=\"active\"\n      clrTooltipTrigger\n      [attr.aria-label]=\"editFilterAriaLabel\"\n      [attr.aria-expanded]=\"open\"\n      [attr.aria-controls]=\"popoverId\"\n      (click)=\"togglePopover($event)\"\n    >\n      <span class=\"filter-pill-text\">\n        @if (active) {\n          {{ managedProperty.displayName }}: <span class=\"filter-pill-condition\">{{ pillCondition }}</span>\n        } @else {\n          {{ managedProperty.displayName }}\n        }\n      </span>\n      @if (additionalConditions > 0) {\n        <clr-badge class=\"filter-pill-count\" clrColor=\"info\" clrType=\"solid\" aria-hidden=\"true\"\n          >+{{ additionalConditions }}</clr-badge\n        >\n      }\n      <cds-icon shape=\"angle\" direction=\"down\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n    </button>\n    @if (!open) {\n      <!-- Visual only: the pill's aria-label already holds the full filter. The empty id removes the trigger's\n           aria-describedby, which would be read even with aria-hidden. -->\n      <clr-tooltip-content [id]=\"''\" aria-hidden=\"true\" clrPosition=\"top-right\" clrSize=\"lg\">{{\n        tooltipText\n      }}</clr-tooltip-content>\n    }\n  </clr-tooltip>\n  @if (!predefined) {\n    <button\n      type=\"button\"\n      class=\"filter-pill-remove\"\n      data-test-id=\"remove-pill\"\n      [attr.aria-label]=\"filterStrings.removeFilterText + ' ' + managedProperty.displayName\"\n      (click)=\"filterRemoved.emit()\"\n    >\n      <cds-icon shape=\"window-close\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n    </button>\n  }\n</clr-label>\n<div\n  class=\"filter-popover\"\n  role=\"dialog\"\n  [id]=\"popoverId\"\n  [attr.aria-label]=\"filterStrings.editFilterText + ' ' + managedProperty.displayName\"\n  cdkTrapFocus\n  [cdkTrapFocusAutoCapture]=\"true\"\n  *clrPopoverContent=\"open; at: popoverPosition; type: popoverType; outsideClickToClose: true; scrollToClose: false\"\n>\n  <ng-template #fieldSelector>\n    <h5 cds-layout=\"m-t:none\" data-test-id=\"filter-field-name\">\n      {{ managedProperty.displayName }}\n    </h5>\n  </ng-template>\n  <ng-template #filterActions>\n    @if (active) {\n      <button type=\"button\" class=\"btn btn-sm btn-link\" data-test-id=\"clear-filter\" (click)=\"removeFilter()\">\n        {{ predefined ? filterStrings.clearFilter : filterStrings.removeFilterText }}\n      </button>\n    }\n  </ng-template>\n  <appfx-filter-editor\n    [property]=\"managedProperty\"\n    [propertyFilter]=\"propertyFilter\"\n    [fieldTemplate]=\"fieldSelector\"\n    [actionsTemplate]=\"filterActions\"\n    (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n  ></appfx-filter-editor>\n</div>\n",
			styles: [".filter-pill-label{max-width:min(280px,100%);padding:0;margin:0}.filter-pill-label .clr-tooltip-container{display:inline-flex;align-self:stretch;max-width:100%;min-width:0;flex:0 1 auto;border-radius:inherit}.filter-pill-label:has(.filter-pill-remove) .clr-tooltip-container{border-start-end-radius:0;border-end-end-radius:0}.filter-pill-remove{display:inline-flex;align-items:center;align-self:stretch;flex-shrink:0;padding:0 var(--clr-base-horizontal-offset-xs);border:0;border-start-end-radius:inherit;border-end-end-radius:inherit;background:none;color:inherit;cursor:pointer}.filter-pill-remove:hover{background:var(--clr-label-bg-hover-color)}.filter-pill-remove:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.filter-pill>*{pointer-events:none}.filter-pill{display:inline-flex;align-items:center;gap:var(--clr-base-gap-s);max-width:100%;min-width:0;padding:var(--clr-base-vertical-offset-2xs) calc(var(--clr-base-horizontal-offset-xs) * 2);border:0;border-radius:inherit;background:none;color:inherit;font:inherit;cursor:pointer}.filter-pill:hover{background:var(--clr-label-bg-hover-color)}.filter-pill:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.filter-pill cds-icon{flex-shrink:0}.filter-pill-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.filter-pill-condition{font-weight:var(--cds-alias-typography-font-weight-bold)}.filter-pill-count{flex-shrink:0}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i3.CdkTrapFocus,
					selector: "[cdkTrapFocus]",
					inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"],
					exportAs: ["cdkTrapFocus"]
				},
				{
					kind: "component",
					type: i4.ClrBadge,
					selector: "clr-badge",
					inputs: ["clrColor", "clrType"]
				},
				{
					kind: "component",
					type: i5.ClrLabel,
					selector: "clr-label",
					inputs: [
						"clrColor",
						"clrBadgeText",
						"clrText",
						"clrClickable",
						"clrDisabled",
						"clrType"
					]
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "directive",
					type: i2.ClrPopoverContent,
					selector: "[clrPopoverContent]",
					inputs: [
						"clrPopoverContent",
						"clrPopoverContentAt",
						"clrPopoverContentAvailablePositions",
						"clrPopoverContentType",
						"clrPopoverContentOutsideClickToClose",
						"clrPopoverContentScrollToClose",
						"clrPopoverContentOrigin"
					]
				},
				{
					kind: "component",
					type: i7.ClrTooltip,
					selector: "clr-tooltip"
				},
				{
					kind: "directive",
					type: i7.ClrTooltipTrigger,
					selector: "[clrTooltipTrigger]"
				},
				{
					kind: "component",
					type: i7.ClrTooltipContent,
					selector: "clr-tooltip-content",
					inputs: [
						"id",
						"clrPosition",
						"clrSize"
					]
				},
				{
					kind: "component",
					type: FilterEditorComponent,
					selector: "appfx-filter-editor",
					inputs: [
						"property",
						"propertyFilter",
						"fieldTemplate",
						"actionsTemplate"
					],
					outputs: ["filterCriteriaChange"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ManageFilterComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-manage-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			hostDirectives: [ClrPopoverHostDirective],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<clr-label class=\"filter-pill-label\" [clrColor]=\"active ? 'info' : ''\">\n  <clr-tooltip>\n    <button\n      #pillButton\n      type=\"button\"\n      class=\"filter-pill\"\n      [class.filter-pill-active]=\"active\"\n      clrTooltipTrigger\n      [attr.aria-label]=\"editFilterAriaLabel\"\n      [attr.aria-expanded]=\"open\"\n      [attr.aria-controls]=\"popoverId\"\n      (click)=\"togglePopover($event)\"\n    >\n      <span class=\"filter-pill-text\">\n        @if (active) {\n          {{ managedProperty.displayName }}: <span class=\"filter-pill-condition\">{{ pillCondition }}</span>\n        } @else {\n          {{ managedProperty.displayName }}\n        }\n      </span>\n      @if (additionalConditions > 0) {\n        <clr-badge class=\"filter-pill-count\" clrColor=\"info\" clrType=\"solid\" aria-hidden=\"true\"\n          >+{{ additionalConditions }}</clr-badge\n        >\n      }\n      <cds-icon shape=\"angle\" direction=\"down\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n    </button>\n    @if (!open) {\n      <!-- Visual only: the pill's aria-label already holds the full filter. The empty id removes the trigger's\n           aria-describedby, which would be read even with aria-hidden. -->\n      <clr-tooltip-content [id]=\"''\" aria-hidden=\"true\" clrPosition=\"top-right\" clrSize=\"lg\">{{\n        tooltipText\n      }}</clr-tooltip-content>\n    }\n  </clr-tooltip>\n  @if (!predefined) {\n    <button\n      type=\"button\"\n      class=\"filter-pill-remove\"\n      data-test-id=\"remove-pill\"\n      [attr.aria-label]=\"filterStrings.removeFilterText + ' ' + managedProperty.displayName\"\n      (click)=\"filterRemoved.emit()\"\n    >\n      <cds-icon shape=\"window-close\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n    </button>\n  }\n</clr-label>\n<div\n  class=\"filter-popover\"\n  role=\"dialog\"\n  [id]=\"popoverId\"\n  [attr.aria-label]=\"filterStrings.editFilterText + ' ' + managedProperty.displayName\"\n  cdkTrapFocus\n  [cdkTrapFocusAutoCapture]=\"true\"\n  *clrPopoverContent=\"open; at: popoverPosition; type: popoverType; outsideClickToClose: true; scrollToClose: false\"\n>\n  <ng-template #fieldSelector>\n    <h5 cds-layout=\"m-t:none\" data-test-id=\"filter-field-name\">\n      {{ managedProperty.displayName }}\n    </h5>\n  </ng-template>\n  <ng-template #filterActions>\n    @if (active) {\n      <button type=\"button\" class=\"btn btn-sm btn-link\" data-test-id=\"clear-filter\" (click)=\"removeFilter()\">\n        {{ predefined ? filterStrings.clearFilter : filterStrings.removeFilterText }}\n      </button>\n    }\n  </ng-template>\n  <appfx-filter-editor\n    [property]=\"managedProperty\"\n    [propertyFilter]=\"propertyFilter\"\n    [fieldTemplate]=\"fieldSelector\"\n    [actionsTemplate]=\"filterActions\"\n    (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n  ></appfx-filter-editor>\n</div>\n",
			styles: [".filter-pill-label{max-width:min(280px,100%);padding:0;margin:0}.filter-pill-label .clr-tooltip-container{display:inline-flex;align-self:stretch;max-width:100%;min-width:0;flex:0 1 auto;border-radius:inherit}.filter-pill-label:has(.filter-pill-remove) .clr-tooltip-container{border-start-end-radius:0;border-end-end-radius:0}.filter-pill-remove{display:inline-flex;align-items:center;align-self:stretch;flex-shrink:0;padding:0 var(--clr-base-horizontal-offset-xs);border:0;border-start-end-radius:inherit;border-end-end-radius:inherit;background:none;color:inherit;cursor:pointer}.filter-pill-remove:hover{background:var(--clr-label-bg-hover-color)}.filter-pill-remove:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.filter-pill>*{pointer-events:none}.filter-pill{display:inline-flex;align-items:center;gap:var(--clr-base-gap-s);max-width:100%;min-width:0;padding:var(--clr-base-vertical-offset-2xs) calc(var(--clr-base-horizontal-offset-xs) * 2);border:0;border-radius:inherit;background:none;color:inherit;font:inherit;cursor:pointer}.filter-pill:hover{background:var(--clr-label-bg-hover-color)}.filter-pill:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.filter-pill cds-icon{flex-shrink:0}.filter-pill-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.filter-pill-condition{font-weight:var(--cds-alias-typography-font-weight-bold)}.filter-pill-count{flex-shrink:0}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridFiltersStrings }],
	propDecorators: {
		propertyFilter: [{ type: Input }],
		filterProperty: [{ type: Input }],
		predefined: [{ type: Input }],
		filterRemoved: [{ type: Output }],
		filterCriteriaChange: [{ type: Output }],
		pillButton: [{
			type: ViewChild,
			args: ["pillButton", { static: true }]
		}]
	}
});
function toPropertyArray(value) {
	return value ?? [];
}
function toEnumPropertyArray(value) {
	return value ?? [];
}
function toFilterArray(value) {
	return value ?? [];
}
function toToggleArray(value) {
	return (value ?? []).filter((toggle) => !!toggle?.filter?.criteria?.length);
}
var CompositeFiltersComponent = class CompositeFiltersComponent {
	constructor(filterStrings, cdr) {
		this.filterStrings = filterStrings;
		this.cdr = cdr;
		this.externalCriteriaActive = false;
		this.clearAll = new EventEmitter();
		this.propertyFiltersChange = new EventEmitter();
		this.collapsedFilters = false;
		this.popoverId = uniqueIdFactory();
		this.popoverPosition = ClrPopoverPosition.BOTTOM_LEFT;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.injector = inject(Injector);
		this.destroyRef = inject(DestroyRef);
		this.popoverService = inject(ClrPopoverService);
		this.rawPredefinedFilters = [];
		this.rawSemiPredefinedFilters = [];
		this.rawToggleFilters = [];
		this.filterablePropertiesState = signal([], ...ngDevMode ? [{ debugName: "filterablePropertiesState" }] : /* istanbul ignore next */ []);
		this.propertyFiltersState = signal([], ...ngDevMode ? [{ debugName: "propertyFiltersState" }] : /* istanbul ignore next */ []);
		this.resolvedPredefinedFilters = signal([], ...ngDevMode ? [{ debugName: "resolvedPredefinedFilters" }] : /* istanbul ignore next */ []);
		this.resolvedSemiPredefinedFilters = signal([], ...ngDevMode ? [{ debugName: "resolvedSemiPredefinedFilters" }] : /* istanbul ignore next */ []);
		this.resolvedToggleFilters = signal([], ...ngDevMode ? [{ debugName: "resolvedToggleFilters" }] : /* istanbul ignore next */ []);
		this.fieldOwners = computed(() => {
			const owners = /* @__PURE__ */ new Map();
			this.resolvedPredefinedFilters().forEach((property) => owners.set(property.property, "predefined"));
			this.resolvedSemiPredefinedFilters().forEach((property) => owners.set(property.property, "semi"));
			return owners;
		}, ...ngDevMode ? [{ debugName: "fieldOwners" }] : /* istanbul ignore next */ []);
		this.visiblePropertiesCache = computed(() => {
			const properties = /* @__PURE__ */ new Map();
			for (const property of [...this.predefinedFilters, ...this.activeFilters()]) if (!properties.has(property.property) && !this.isSemiPredefined(property)) properties.set(property.property, property);
			return [...properties.values()];
		}, ...ngDevMode ? [{ debugName: "visiblePropertiesCache" }] : /* istanbul ignore next */ []);
		this.availablePropertiesCache = computed(() => {
			const visibleKeys = new Set([
				...this.visibleProperties,
				...this.semiPredefinedFilters,
				...this.toggleProperties()
			].map((property) => property.property));
			return this.filterableProperties.filter((property) => !visibleKeys.has(property.property));
		}, ...ngDevMode ? [{ debugName: "availablePropertiesCache" }] : /* istanbul ignore next */ []);
		this.userAddedFiltersCountCache = computed(() => this.activeFilters().filter((property) => !this.isPredefined(property) && !this.isSemiPredefined(property)).length, ...ngDevMode ? [{ debugName: "userAddedFiltersCountCache" }] : /* istanbul ignore next */ []);
		this.predefinedPropertiesCache = computed(() => this.visibleProperties.filter((property) => this.isPredefined(property)), ...ngDevMode ? [{ debugName: "predefinedPropertiesCache" }] : /* istanbul ignore next */ []);
		this.userAddedPropertiesCache = computed(() => this.visibleProperties.filter((property) => !this.isPredefined(property)), ...ngDevMode ? [{ debugName: "userAddedPropertiesCache" }] : /* istanbul ignore next */ []);
		this.ignoredFieldEntries = [];
		this.initialized = false;
		this.activeToggleKeys = /* @__PURE__ */ new Set();
	}
	get filterableProperties() {
		return this.filterablePropertiesState();
	}
	set filterableProperties(value) {
		this.filterablePropertiesState.set(value);
	}
	get propertyFilters() {
		return this.propertyFiltersState();
	}
	set propertyFilters(filters) {
		this.propertyFiltersState.set(filters);
	}
	get predefinedFilters() {
		return this.resolvedPredefinedFilters();
	}
	set predefinedFilters(value) {
		this.rawPredefinedFilters = value;
		this.resolveFieldOwners();
	}
	get semiPredefinedFilters() {
		return this.resolvedSemiPredefinedFilters();
	}
	set semiPredefinedFilters(value) {
		this.rawSemiPredefinedFilters = value;
		this.resolveFieldOwners();
	}
	get toggleFilters() {
		return this.resolvedToggleFilters();
	}
	set toggleFilters(value) {
		this.rawToggleFilters = value;
		this.resolveFieldOwners();
	}
	get showHideFiltersArrowDir() {
		return this.collapsedFilters ? "right" : "left";
	}
	get showHideFiltersLabel() {
		return this.collapsedFilters ? this.filterStrings.showButtonLabel + "(" + this.userAddedFiltersCount + ")" : this.filterStrings.hideButtonLabel;
	}
	get showHideFiltersAriaLabel() {
		const count = this.userAddedFiltersCount;
		const noun = count > 1 ? this.filterStrings.filtersText : this.filterStrings.filterText;
		return this.collapsedFilters ? `${this.filterStrings.showButtonLabel} ${count} ${noun}` : this.filterStrings.hideButtonAriaLabel;
	}
	get signPostOpened() {
		return this.popoverService.open;
	}
	set signPostOpened(open) {
		this.popoverService.open = open;
	}
	get visibleProperties() {
		return this.visiblePropertiesCache();
	}
	get availableProperties() {
		return this.availablePropertiesCache();
	}
	get userAddedFiltersCount() {
		return this.userAddedFiltersCountCache();
	}
	get predefinedProperties() {
		return this.predefinedPropertiesCache();
	}
	get userAddedProperties() {
		return this.userAddedPropertiesCache();
	}
	get hasPredefinedGroup() {
		return this.toggleFilters.length > 0 || this.predefinedProperties.length > 0;
	}
	get hasActiveCriteria() {
		return this.propertyFilters.length > 0 || this.activeToggleKeys.size > 0;
	}
	ngOnChanges(changes) {
		const fieldsChanged = [
			"predefinedFilters",
			"semiPredefinedFilters",
			"toggleFilters"
		].some((input) => input in changes);
		const filtersChanged = "propertyFilters" in changes;
		if (fieldsChanged) this.warnIgnoredFields();
		if (filtersChanged && this.initialized) this.applyFilters(changes["propertyFilters"].currentValue ?? []);
		if (fieldsChanged || filtersChanged) {
			const removedFilters = this.initialized && this.removeInvalidFilters();
			const removedToggle = this.removeUnresolvedToggleKeys();
			if (this.initialized && (removedFilters || removedToggle)) this.emitFiltersLater();
		}
		if (fieldsChanged || filtersChanged || "filterableProperties" in changes) this.keepOrPreselectProperty();
	}
	ngOnInit() {
		const presets = this.presetFilters ?? [];
		const presetFields = new Set(presets.map((filter) => filter.criteria?.[0]?.filterableProperty?.property));
		const bound = this.propertyFilters.filter((filter) => !presetFields.has(filter.criteria?.[0]?.filterableProperty?.property));
		const passedIn = this.propertyFilters;
		this.applyFilters([...presets, ...bound]);
		this.removeInvalidFilters();
		this.initialized = true;
		if (!this.sameFilters(this.currentFilters(), passedIn)) this.emitFiltersLater();
		this.preselectFirstProperty();
	}
	onPropertyChange() {
		if (this.signPostOpened) afterNextRender(() => {
			if (this.signPostOpened) this.fieldCombobox?.textbox.nativeElement.focus();
		}, { injector: this.injector });
	}
	onFilterCriteriaChange(propertyFilter) {
		if (propertyFilter) {
			if (propertyFilter.criteria.length > 0) {
				const field = propertyFilter.criteria[0].filterableProperty.property;
				const sameField = (filter) => filter.criteria[0]?.filterableProperty.property === field;
				this.propertyFilters = this.propertyFilters.some(sameField) ? this.propertyFilters.map((filter) => sameField(filter) ? propertyFilter : filter) : [...this.propertyFilters, propertyFilter];
			} else this.propertyFilters = this.propertyFilters.filter((filter) => filter.criteria.length > 0);
			this.emitFilters();
		}
		if (this.signPostOpened) {
			this.signPostOpened = false;
			this.popoverService.focusOrigin();
		}
		this.preselectFirstProperty();
		this.cdr.markForCheck();
	}
	activeFilters() {
		const activeProperties = [];
		this.propertyFilters.forEach((value) => {
			if (value.criteria.length > 0) activeProperties.push(value.criteria[0].filterableProperty);
		});
		return activeProperties;
	}
	clearAllFilters() {
		this.propertyFilters = [];
		this.activeToggleKeys.clear();
		this.emitFilters();
		this.preselectFirstProperty();
		this.collapsedFilters = false;
		this.clearAll.emit();
		this.moveFocusToActiveButton();
	}
	showHideAllFilters() {
		this.collapsedFilters = !this.collapsedFilters;
	}
	toggleKey(filter) {
		const criteria = filter.criteria.map((predicate) => [
			predicate.filterableProperty?.property,
			predicate.operator,
			predicate.value
		]);
		return JSON.stringify(criteria.length > 1 ? [filter.operator, criteria] : criteria);
	}
	isToggleOn(toggle) {
		return this.activeToggleKeys.has(this.toggleKey(toggle.filter));
	}
	toggleFilter(toggle) {
		const key = this.toggleKey(toggle.filter);
		if (this.activeToggleKeys.has(key)) this.activeToggleKeys.delete(key);
		else this.activeToggleKeys.add(key);
		this.emitFilters();
	}
	toggleText(toggle) {
		return toggle.label?.trim() ? toggle.label : this.toggleCriteriaText(toggle.filter);
	}
	toggleCriteriaText(toggle) {
		const property = toggle.criteria[0]?.filterableProperty;
		const conditions = toggle.criteria.map((predicate) => {
			if (predicate.operator === ComparisonOperator.IsEmpty) return this.filterStrings.getOperatorDisplayName(predicate.operator);
			const value = property instanceof EnumPropertyDefinition ? property.values.get(predicate.value) ?? predicate.value : predicate.value;
			return predicate.operator === ComparisonOperator.Equals ? `${value}` : `${this.filterStrings.getOperatorDisplayName(predicate.operator)} ${value}`;
		});
		const conjoiner = toggle.operator !== void 0 ? ` ${this.filterStrings.getConjoinerDisplayName(toggle.operator)} ` : ", ";
		return `${property?.displayName}: ${conditions.join(conjoiner)}`;
	}
	semiOptions(property) {
		return Array.from(property.values, ([key, label]) => ({
			key,
			label
		}));
	}
	isOptionSelected(property, key) {
		return !!this.filterFor(property)?.criteria.some((predicate) => predicate.operator === ComparisonOperator.Equals && predicate.value === key);
	}
	toggleOption(property, key) {
		const selected = this.semiOptions(property).map((option) => option.key).filter((optionKey) => optionKey === key !== this.isOptionSelected(property, optionKey));
		const filter = new PropertyFilter();
		filter.operator = LogicalOperator.Or;
		filter.criteria = selected.map((value) => {
			const predicate = new PropertyPredicate();
			predicate.filterableProperty = property;
			predicate.operator = ComparisonOperator.Equals;
			predicate.value = value;
			return predicate;
		});
		if (filter.criteria.length) this.onFilterCriteriaChange(filter);
		else this.clearFilter(property);
	}
	filterFor(property) {
		return this.propertyFilters.find((filter) => filter.criteria[0]?.filterableProperty.property === property.property);
	}
	clearFilter(property) {
		this.propertyFilters = this.propertyFilters.filter((filter) => filter.criteria[0]?.filterableProperty.property !== property.property);
		this.emitFilters();
		this.preselectFirstProperty();
		if (!this.isPredefined(property) && !this.isSemiPredefined(property)) this.moveFocusToActiveButton();
	}
	isSemiPredefined(property) {
		return this.fieldOwners().get(property.property) === "semi";
	}
	isPredefined(property) {
		return this.fieldOwners().get(property.property) === "predefined";
	}
	toggleProperties() {
		return this.toggleFilters.map((toggle) => toggle.filter.criteria[0]?.filterableProperty).filter((property) => !!property);
	}
	applyFilters(filters) {
		const toggleKeys = new Set(this.toggleFilters.map((toggle) => this.toggleKey(toggle.filter)));
		const knownProperties = this.knownProperties();
		this.activeToggleKeys.clear();
		this.propertyFilters = filters.filter((filter) => {
			if (!filter?.criteria?.length) return false;
			const key = this.toggleKey(filter);
			if (toggleKeys.has(key)) {
				this.activeToggleKeys.add(key);
				return false;
			}
			return true;
		}).map((filter) => this.withKnownProperties(filter, knownProperties));
	}
	knownProperties() {
		const properties = /* @__PURE__ */ new Map();
		for (const property of [
			...this.predefinedFilters,
			...this.semiPredefinedFilters,
			...this.toggleProperties(),
			...this.filterableProperties
		]) if (!properties.has(property.property)) properties.set(property.property, property);
		return properties;
	}
	withKnownProperties(filter, knownProperties) {
		const known = (predicate) => knownProperties.get(predicate?.filterableProperty?.property);
		if (filter.criteria.every((predicate) => !known(predicate) || known(predicate) === predicate.filterableProperty)) return filter;
		const criteria = filter.criteria.map((predicate) => {
			const property = known(predicate);
			return property && property !== predicate.filterableProperty ? Object.assign(new PropertyPredicate(), predicate, { filterableProperty: property }) : predicate;
		});
		return Object.assign(new PropertyFilter(), filter, { criteria });
	}
	emitFilters() {
		this.propertyFiltersChange.emit(this.currentFilters());
	}
	emitFiltersLater() {
		Promise.resolve().then(() => {
			if (!this.destroyRef.destroyed) this.emitFilters();
		});
	}
	removeUnresolvedToggleKeys() {
		const keys = new Set(this.toggleFilters.map((toggle) => this.toggleKey(toggle.filter)));
		let removed = false;
		this.activeToggleKeys.forEach((key) => {
			if (!keys.has(key)) {
				this.activeToggleKeys.delete(key);
				removed = true;
			}
		});
		return removed;
	}
	currentFilters() {
		return [...this.propertyFilters, ...this.toggleFilters.filter((toggle) => this.isToggleOn(toggle)).map((toggle) => toggle.filter)];
	}
	sameFilters(first, second) {
		const keys = (filters) => filters.filter((filter) => filter?.criteria?.length).map((filter) => this.toggleKey(filter)).sort();
		return JSON.stringify(keys(first)) === JSON.stringify(keys(second));
	}
	moveFocusToActiveButton() {
		afterNextRender(() => {
			const addButton = this.addButton?.nativeElement;
			if (addButton && !addButton.disabled) addButton.focus();
			else if (this.toggleButtons.length) this.toggleButtons.first.nativeElement.focus();
			else if (this.predefinedPills.length) this.predefinedPills.first.focus();
			else if (this.semiOptionButtons.length) this.semiOptionButtons.first.nativeElement.focus();
		}, { injector: this.injector });
	}
	keepOrPreselectProperty() {
		const selectedKey = this.selectedFilterableProperty?.property;
		const kept = this.availableProperties.find((property) => property.property === selectedKey);
		if (!kept) this.preselectFirstProperty();
		else if (kept !== this.selectedFilterableProperty) {
			this.selectedFilterableProperty = kept;
			this.onPropertyChange();
		}
	}
	preselectFirstProperty() {
		const remainingProperties = this.availableProperties;
		this.selectedFilterableProperty = remainingProperties[0];
		if (this.selectedFilterableProperty) this.onPropertyChange();
	}
	resolveFieldOwners() {
		const claimed = /* @__PURE__ */ new Set();
		const ignored = [];
		const claim = (fields, source) => {
			const taken = fields.filter((field) => claimed.has(field));
			if (taken.length) {
				ignored.push(`${source}: ${taken.join(", ")}`);
				return false;
			}
			fields.forEach((field) => claimed.add(field));
			return true;
		};
		this.resolvedPredefinedFilters.set(this.rawPredefinedFilters.filter((property) => claim([property.property], "predefinedFilters")));
		this.resolvedSemiPredefinedFilters.set(this.rawSemiPredefinedFilters.filter((property) => claim([property.property], "semiPredefinedFilters")));
		this.resolvedToggleFilters.set(this.rawToggleFilters.filter((toggle) => claim([...new Set(toggle.filter.criteria.map((predicate) => predicate.filterableProperty?.property).filter(Boolean))], "toggleFilters")));
		this.ignoredFieldEntries = ignored;
	}
	isOptionSelection(filter) {
		const property = this.semiPredefinedFilters.find((semi) => semi.property === filter.criteria[0].filterableProperty.property);
		if (!property) return false;
		return (filter.criteria.length === 1 || filter.operator === LogicalOperator.Or) && filter.criteria.every((predicate) => predicate.filterableProperty?.property === property.property && predicate.operator === ComparisonOperator.Equals && property.values.has(predicate.value));
	}
	removeInvalidSemiFilters() {
		return this.removeFilters((filter) => this.isSemiPredefined(filter.criteria[0].filterableProperty) && !this.isOptionSelection(filter), "filters on semiPredefinedFilters fields must select options (Equals on option keys, combined with OR).");
	}
	removeInvalidFilters() {
		const removedSemi = this.removeInvalidSemiFilters();
		const removedToggleField = this.removeToggleFieldFilters();
		return removedSemi || removedToggleField;
	}
	removeToggleFieldFilters() {
		const toggleFields = new Set(this.toggleProperties().map((property) => property.property));
		return this.removeFilters((filter) => filter.criteria.some((predicate) => toggleFields.has(predicate.filterableProperty?.property)), "a toggleFilters field accepts only the toggle filter itself.");
	}
	removeFilters(invalid, message) {
		const removed = this.propertyFilters.filter(invalid);
		if (!removed.length) return false;
		this.propertyFilters = this.propertyFilters.filter((filter) => !removed.includes(filter));
		console.warn(`appfx-composite-filter: ${message} Removed filters for: ` + removed.map((filter) => filter.criteria[0].filterableProperty.property).join(", "));
		return true;
	}
	warnIgnoredFields() {
		if (this.ignoredFieldEntries.length) console.warn("appfx-composite-filter: a field can be used only once across predefinedFilters, semiPredefinedFilters and toggleFilters (in that order of precedence). Ignored entries: " + this.ignoredFieldEntries.join("; "));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: CompositeFiltersComponent,
			deps: [{ token: DatagridFiltersStrings }, { token: i0.ChangeDetectorRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: CompositeFiltersComponent,
			isStandalone: false,
			selector: "appfx-composite-filter",
			inputs: {
				presetFilters: "presetFilters",
				externalCriteriaActive: "externalCriteriaActive",
				filterableProperties: [
					"filterableProperties",
					"filterableProperties",
					toPropertyArray
				],
				propertyFilters: [
					"propertyFilters",
					"propertyFilters",
					toFilterArray
				],
				predefinedFilters: [
					"predefinedFilters",
					"predefinedFilters",
					toPropertyArray
				],
				semiPredefinedFilters: [
					"semiPredefinedFilters",
					"semiPredefinedFilters",
					toEnumPropertyArray
				],
				toggleFilters: [
					"toggleFilters",
					"toggleFilters",
					toToggleArray
				]
			},
			outputs: {
				clearAll: "clearAll",
				propertyFiltersChange: "propertyFiltersChange"
			},
			viewQueries: [
				{
					propertyName: "fieldCombobox",
					first: true,
					predicate: ClrCombobox,
					descendants: true
				},
				{
					propertyName: "addButton",
					first: true,
					predicate: ["addButton"],
					descendants: true,
					static: true
				},
				{
					propertyName: "toggleButtons",
					predicate: ["toggleButton"],
					descendants: true
				},
				{
					propertyName: "predefinedPills",
					predicate: ["predefinedPill"],
					descendants: true
				},
				{
					propertyName: "semiOptionButtons",
					predicate: ["semiOptionButton"],
					descendants: true
				}
			],
			usesOnChanges: true,
			hostDirectives: [{ directive: i2.ClrPopoverHostDirective }],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"composite-filter-container\">\n  <!-- One wrapping flow: pills, then Hide, Add filter and Clear all, so the buttons wrap with the pills on narrow screens. -->\n  <div class=\"manage-filter-container\">\n    <ng-template #separator>\n      <span\n        class=\"filter-group-separator\"\n        role=\"separator\"\n        aria-orientation=\"vertical\"\n        data-test-id=\"filter-group-separator\"\n      ></span>\n    </ng-template>\n    @for (toggle of toggleFilters; track toggleKey(toggle.filter)) {\n      <clr-label class=\"semi-filter-option-label\" [clrColor]=\"isToggleOn(toggle) ? 'info' : ''\">\n        <clr-tooltip>\n          <button\n            #toggleButton\n            type=\"button\"\n            class=\"semi-filter-option\"\n            data-test-id=\"toggle-filter\"\n            clrTooltipTrigger\n            [attr.aria-pressed]=\"isToggleOn(toggle)\"\n            (click)=\"toggleFilter(toggle)\"\n          >\n            @if (isToggleOn(toggle)) {\n              <cds-icon shape=\"check\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n            }\n            <span class=\"semi-filter-option-text\">{{ toggleText(toggle) }}</span>\n          </button>\n          <!-- The exact condition, also for a toggle with its own label. -->\n          <clr-tooltip-content clrPosition=\"top-right\" clrSize=\"lg\">{{\n            toggleCriteriaText(toggle.filter)\n          }}</clr-tooltip-content>\n        </clr-tooltip>\n      </clr-label>\n    }\n    @for (property of predefinedProperties; track property.property) {\n      <appfx-manage-filter\n        #predefinedPill\n        [filterProperty]=\"property\"\n        [propertyFilter]=\"filterFor(property)\"\n        [predefined]=\"true\"\n        (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        (filterRemoved)=\"clearFilter(property)\"\n      >\n      </appfx-manage-filter>\n    }\n    @for (property of semiPredefinedFilters; track property.property; let first = $first) {\n      <!-- Separator before the group and between semi-predefined filters. -->\n      @if (!first || hasPredefinedGroup) {\n        <ng-container [ngTemplateOutlet]=\"separator\"></ng-container>\n      }\n      <div\n        class=\"semi-filter-group\"\n        role=\"group\"\n        data-test-id=\"semi-filter-group\"\n        [attr.aria-labelledby]=\"popoverId + '-semi-' + property.property\"\n      >\n        <span class=\"semi-filter-label\" [id]=\"popoverId + '-semi-' + property.property\"\n          >{{ property.displayName }}:</span\n        >\n        @for (option of semiOptions(property); track option.key) {\n          <clr-label class=\"semi-filter-option-label\" [clrColor]=\"isOptionSelected(property, option.key) ? 'info' : ''\">\n            <button\n              #semiOptionButton\n              type=\"button\"\n              class=\"semi-filter-option\"\n              data-test-id=\"semi-filter-option\"\n              [attr.aria-pressed]=\"isOptionSelected(property, option.key)\"\n              (click)=\"toggleOption(property, option.key)\"\n            >\n              @if (isOptionSelected(property, option.key)) {\n                <cds-icon shape=\"check\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n              }\n              <span class=\"semi-filter-option-text\">{{ option.label }}</span>\n            </button>\n          </clr-label>\n        }\n      </div>\n    }\n    @for (property of userAddedProperties; track property.property; let first = $first) {\n      @if (first && (hasPredefinedGroup || semiPredefinedFilters.length > 0)) {\n        <ng-container [ngTemplateOutlet]=\"separator\"></ng-container>\n      }\n      <appfx-manage-filter\n        [hidden]=\"collapsedFilters\"\n        [filterProperty]=\"property\"\n        [propertyFilter]=\"filterFor(property)\"\n        (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        (filterRemoved)=\"clearFilter(property)\"\n      >\n      </appfx-manage-filter>\n    }\n    @if (userAddedFiltersCount > 0) {\n      <button\n        type=\"button\"\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"hide-filters\"\n        [attr.aria-label]=\"showHideFiltersAriaLabel\"\n        (click)=\"showHideAllFilters()\"\n      >\n        <cds-icon shape=\"angle\" class=\"is-solid\" [direction]=\"showHideFiltersArrowDir\"></cds-icon>\n        {{ showHideFiltersLabel }}\n      </button>\n    }\n    <button\n      #addButton\n      type=\"button\"\n      clrPopoverOrigin\n      clrPopoverOpenCloseButton\n      class=\"btn btn-sm btn-link btn-compact\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      [attr.aria-expanded]=\"signPostOpened\"\n      [attr.aria-controls]=\"popoverId\"\n      [disabled]=\"availableProperties.length === 0\"\n    >\n      {{ filterStrings.addNew }}\n    </button>\n    <div\n      class=\"filter-popover\"\n      role=\"dialog\"\n      [id]=\"popoverId\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      cdkTrapFocus\n      [cdkTrapFocusAutoCapture]=\"true\"\n      *clrPopoverContent=\"\n        signPostOpened;\n        at: popoverPosition;\n        type: popoverType;\n        outsideClickToClose: true;\n        scrollToClose: false\n      \"\n    >\n      <ng-template #fieldSelector>\n        <clr-combobox-container class=\"filter-field\">\n          <label class=\"clr-sr-only\">{{ filterStrings.filterLabel }}</label>\n          <clr-combobox\n            name=\"field\"\n            required\n            [placeholder]=\"filterStrings.filterLabel\"\n            [ngModelOptions]=\"{ standalone: true }\"\n            [(ngModel)]=\"selectedFilterableProperty\"\n            (ngModelChange)=\"onPropertyChange()\"\n          >\n            <clr-options>\n              <clr-option\n                *clrOptionItems=\"let property of availableProperties; field: 'displayName'\"\n                [clrValue]=\"property\"\n              >\n                {{ property.displayName }}\n              </clr-option>\n            </clr-options>\n          </clr-combobox>\n        </clr-combobox-container>\n      </ng-template>\n      @if (!selectedFilterableProperty) {\n        <appfx-filter-form [valid]=\"false\" (cancel)=\"onFilterCriteriaChange(undefined)\">\n          <div class=\"filter-field-row\">\n            <ng-container [ngTemplateOutlet]=\"fieldSelector\"></ng-container>\n          </div>\n        </appfx-filter-form>\n      }\n      <!-- Tracked by field, so changing the field creates a new editor without the previous field's draft. -->\n      @for (property of selectedFilterableProperty ? [selectedFilterableProperty] : []; track property.property) {\n        <appfx-filter-editor\n          [property]=\"property\"\n          [fieldTemplate]=\"fieldSelector\"\n          (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        ></appfx-filter-editor>\n      }\n    </div>\n    @if (hasActiveCriteria || externalCriteriaActive) {\n      <clr-tooltip>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-icon btn-link-neutral btn-compact clear-all-button\"\n          data-test-id=\"clear-all-button\"\n          clrTooltipTrigger\n          [attr.aria-label]=\"filterStrings.clearAllButtonAriaLabel\"\n          (click)=\"clearAllFilters()\"\n        >\n          <cds-icon shape=\"window-close\" size=\"20\" aria-hidden=\"true\"></cds-icon>\n        </button>\n        <!-- Visual only: the button's aria-label is the same text. -->\n        <clr-tooltip-content [id]=\"''\" aria-hidden=\"true\" clrPosition=\"top-right\" clrSize=\"sm\">{{\n          filterStrings.clearAllButtonAriaLabel\n        }}</clr-tooltip-content>\n      </clr-tooltip>\n    }\n  </div>\n</div>\n",
			styles: [".composite-filter-container{display:flex;align-items:center;min-width:0}.manage-filter-container{display:flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-m);min-width:0}.manage-filter-container>.btn,.manage-filter-container>clr-tooltip{flex-shrink:0}.filter-group-separator{align-self:stretch;width:var(--cds-alias-object-border-width-100);margin-block:var(--clr-base-vertical-offset-2xs);background:var(--cds-alias-object-border-color)}.semi-filter-group{display:inline-flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-s)}.semi-filter-option-label{max-width:280px;padding:0;margin:0}.semi-filter-option-label .clr-tooltip-container{display:inline-flex;align-self:stretch;max-width:100%;min-width:0;border-radius:inherit}.semi-filter-option{display:inline-flex;min-width:0;max-width:100%;align-items:center;align-self:stretch;gap:var(--clr-base-gap-xs);padding:var(--clr-base-vertical-offset-2xs) calc(var(--clr-base-horizontal-offset-xs) * 2);border:0;border-radius:inherit;background:none;color:inherit;font:inherit;cursor:pointer}.semi-filter-option:hover{background:var(--clr-label-bg-hover-color)}.semi-filter-option:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.semi-filter-option-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}appfx-manage-filter{max-width:280px}appfx-manage-filter:not([hidden]){display:inline-flex}:host-context(.zoom2x,.zoom4x) .composite-filter-container,:host-context(.zoom2x,.zoom4x) .manage-filter-container{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i3.CdkTrapFocus,
					selector: "[cdkTrapFocus]",
					inputs: ["cdkTrapFocus", "cdkTrapFocusAutoCapture"],
					exportAs: ["cdkTrapFocus"]
				},
				{
					kind: "component",
					type: i5.ClrLabel,
					selector: "clr-label",
					inputs: [
						"clrColor",
						"clrBadgeText",
						"clrText",
						"clrClickable",
						"clrDisabled",
						"clrType"
					]
				},
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "component",
					type: i5$1.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i6$1.ClrCombobox,
					selector: "clr-combobox",
					inputs: [
						"placeholder",
						"showSelectAll",
						"clrEditable",
						"clrEditableResolverFn",
						"clrComboboxIdentityFn",
						"clrMulti"
					],
					outputs: [
						"clrInputChange",
						"clrOpenChange",
						"clrSelectionChange"
					]
				},
				{
					kind: "component",
					type: i6$1.ClrComboboxContainer,
					selector: "clr-combobox-container"
				},
				{
					kind: "component",
					type: i6$1.ClrOptions,
					selector: "clr-options",
					inputs: ["id"]
				},
				{
					kind: "component",
					type: i6$1.ClrOption,
					selector: "clr-option",
					inputs: ["id", "clrValue"]
				},
				{
					kind: "directive",
					type: i6$1.ClrOptionItems,
					selector: "[clrOptionItems][clrOptionItemsOf]",
					inputs: [
						"clrOptionItemsOf",
						"clrOptionItemsTrackBy",
						"clrOptionItemsField"
					]
				},
				{
					kind: "directive",
					type: i2.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i2.ClrPopoverOpenCloseButton,
					selector: "[clrPopoverOpenCloseButton]",
					outputs: ["clrPopoverOpenCloseChange"]
				},
				{
					kind: "directive",
					type: i2.ClrPopoverContent,
					selector: "[clrPopoverContent]",
					inputs: [
						"clrPopoverContent",
						"clrPopoverContentAt",
						"clrPopoverContentAvailablePositions",
						"clrPopoverContentType",
						"clrPopoverContentOutsideClickToClose",
						"clrPopoverContentScrollToClose",
						"clrPopoverContentOrigin"
					]
				},
				{
					kind: "component",
					type: i7.ClrTooltip,
					selector: "clr-tooltip"
				},
				{
					kind: "directive",
					type: i7.ClrTooltipTrigger,
					selector: "[clrTooltipTrigger]"
				},
				{
					kind: "component",
					type: i7.ClrTooltipContent,
					selector: "clr-tooltip-content",
					inputs: [
						"id",
						"clrPosition",
						"clrSize"
					]
				},
				{
					kind: "directive",
					type: i2$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.RequiredValidator,
					selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]",
					inputs: ["required"]
				},
				{
					kind: "directive",
					type: i3$1.NgModel,
					selector: "[ngModel]:not([formControlName]):not([formControl])",
					inputs: [
						"name",
						"disabled",
						"ngModel",
						"ngModelOptions"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngModel"]
				},
				{
					kind: "component",
					type: FilterEditorComponent,
					selector: "appfx-filter-editor",
					inputs: [
						"property",
						"propertyFilter",
						"fieldTemplate",
						"actionsTemplate"
					],
					outputs: ["filterCriteriaChange"]
				},
				{
					kind: "component",
					type: FilterFormComponent,
					selector: "appfx-filter-form",
					inputs: ["valid"],
					outputs: ["cancel", "apply"]
				},
				{
					kind: "component",
					type: ManageFilterComponent,
					selector: "appfx-manage-filter",
					inputs: [
						"propertyFilter",
						"filterProperty",
						"predefined"
					],
					outputs: ["filterRemoved", "filterCriteriaChange"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: CompositeFiltersComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-composite-filter",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			hostDirectives: [ClrPopoverHostDirective],
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"composite-filter-container\">\n  <!-- One wrapping flow: pills, then Hide, Add filter and Clear all, so the buttons wrap with the pills on narrow screens. -->\n  <div class=\"manage-filter-container\">\n    <ng-template #separator>\n      <span\n        class=\"filter-group-separator\"\n        role=\"separator\"\n        aria-orientation=\"vertical\"\n        data-test-id=\"filter-group-separator\"\n      ></span>\n    </ng-template>\n    @for (toggle of toggleFilters; track toggleKey(toggle.filter)) {\n      <clr-label class=\"semi-filter-option-label\" [clrColor]=\"isToggleOn(toggle) ? 'info' : ''\">\n        <clr-tooltip>\n          <button\n            #toggleButton\n            type=\"button\"\n            class=\"semi-filter-option\"\n            data-test-id=\"toggle-filter\"\n            clrTooltipTrigger\n            [attr.aria-pressed]=\"isToggleOn(toggle)\"\n            (click)=\"toggleFilter(toggle)\"\n          >\n            @if (isToggleOn(toggle)) {\n              <cds-icon shape=\"check\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n            }\n            <span class=\"semi-filter-option-text\">{{ toggleText(toggle) }}</span>\n          </button>\n          <!-- The exact condition, also for a toggle with its own label. -->\n          <clr-tooltip-content clrPosition=\"top-right\" clrSize=\"lg\">{{\n            toggleCriteriaText(toggle.filter)\n          }}</clr-tooltip-content>\n        </clr-tooltip>\n      </clr-label>\n    }\n    @for (property of predefinedProperties; track property.property) {\n      <appfx-manage-filter\n        #predefinedPill\n        [filterProperty]=\"property\"\n        [propertyFilter]=\"filterFor(property)\"\n        [predefined]=\"true\"\n        (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        (filterRemoved)=\"clearFilter(property)\"\n      >\n      </appfx-manage-filter>\n    }\n    @for (property of semiPredefinedFilters; track property.property; let first = $first) {\n      <!-- Separator before the group and between semi-predefined filters. -->\n      @if (!first || hasPredefinedGroup) {\n        <ng-container [ngTemplateOutlet]=\"separator\"></ng-container>\n      }\n      <div\n        class=\"semi-filter-group\"\n        role=\"group\"\n        data-test-id=\"semi-filter-group\"\n        [attr.aria-labelledby]=\"popoverId + '-semi-' + property.property\"\n      >\n        <span class=\"semi-filter-label\" [id]=\"popoverId + '-semi-' + property.property\"\n          >{{ property.displayName }}:</span\n        >\n        @for (option of semiOptions(property); track option.key) {\n          <clr-label class=\"semi-filter-option-label\" [clrColor]=\"isOptionSelected(property, option.key) ? 'info' : ''\">\n            <button\n              #semiOptionButton\n              type=\"button\"\n              class=\"semi-filter-option\"\n              data-test-id=\"semi-filter-option\"\n              [attr.aria-pressed]=\"isOptionSelected(property, option.key)\"\n              (click)=\"toggleOption(property, option.key)\"\n            >\n              @if (isOptionSelected(property, option.key)) {\n                <cds-icon shape=\"check\" size=\"16\" aria-hidden=\"true\"></cds-icon>\n              }\n              <span class=\"semi-filter-option-text\">{{ option.label }}</span>\n            </button>\n          </clr-label>\n        }\n      </div>\n    }\n    @for (property of userAddedProperties; track property.property; let first = $first) {\n      @if (first && (hasPredefinedGroup || semiPredefinedFilters.length > 0)) {\n        <ng-container [ngTemplateOutlet]=\"separator\"></ng-container>\n      }\n      <appfx-manage-filter\n        [hidden]=\"collapsedFilters\"\n        [filterProperty]=\"property\"\n        [propertyFilter]=\"filterFor(property)\"\n        (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        (filterRemoved)=\"clearFilter(property)\"\n      >\n      </appfx-manage-filter>\n    }\n    @if (userAddedFiltersCount > 0) {\n      <button\n        type=\"button\"\n        class=\"btn btn-sm btn-link btn-compact\"\n        data-test-id=\"hide-filters\"\n        [attr.aria-label]=\"showHideFiltersAriaLabel\"\n        (click)=\"showHideAllFilters()\"\n      >\n        <cds-icon shape=\"angle\" class=\"is-solid\" [direction]=\"showHideFiltersArrowDir\"></cds-icon>\n        {{ showHideFiltersLabel }}\n      </button>\n    }\n    <button\n      #addButton\n      type=\"button\"\n      clrPopoverOrigin\n      clrPopoverOpenCloseButton\n      class=\"btn btn-sm btn-link btn-compact\"\n      data-test-id=\"add-button\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      [attr.aria-expanded]=\"signPostOpened\"\n      [attr.aria-controls]=\"popoverId\"\n      [disabled]=\"availableProperties.length === 0\"\n    >\n      {{ filterStrings.addNew }}\n    </button>\n    <div\n      class=\"filter-popover\"\n      role=\"dialog\"\n      [id]=\"popoverId\"\n      [attr.aria-label]=\"filterStrings.addNewAriaLabel\"\n      cdkTrapFocus\n      [cdkTrapFocusAutoCapture]=\"true\"\n      *clrPopoverContent=\"\n        signPostOpened;\n        at: popoverPosition;\n        type: popoverType;\n        outsideClickToClose: true;\n        scrollToClose: false\n      \"\n    >\n      <ng-template #fieldSelector>\n        <clr-combobox-container class=\"filter-field\">\n          <label class=\"clr-sr-only\">{{ filterStrings.filterLabel }}</label>\n          <clr-combobox\n            name=\"field\"\n            required\n            [placeholder]=\"filterStrings.filterLabel\"\n            [ngModelOptions]=\"{ standalone: true }\"\n            [(ngModel)]=\"selectedFilterableProperty\"\n            (ngModelChange)=\"onPropertyChange()\"\n          >\n            <clr-options>\n              <clr-option\n                *clrOptionItems=\"let property of availableProperties; field: 'displayName'\"\n                [clrValue]=\"property\"\n              >\n                {{ property.displayName }}\n              </clr-option>\n            </clr-options>\n          </clr-combobox>\n        </clr-combobox-container>\n      </ng-template>\n      @if (!selectedFilterableProperty) {\n        <appfx-filter-form [valid]=\"false\" (cancel)=\"onFilterCriteriaChange(undefined)\">\n          <div class=\"filter-field-row\">\n            <ng-container [ngTemplateOutlet]=\"fieldSelector\"></ng-container>\n          </div>\n        </appfx-filter-form>\n      }\n      <!-- Tracked by field, so changing the field creates a new editor without the previous field's draft. -->\n      @for (property of selectedFilterableProperty ? [selectedFilterableProperty] : []; track property.property) {\n        <appfx-filter-editor\n          [property]=\"property\"\n          [fieldTemplate]=\"fieldSelector\"\n          (filterCriteriaChange)=\"onFilterCriteriaChange($event)\"\n        ></appfx-filter-editor>\n      }\n    </div>\n    @if (hasActiveCriteria || externalCriteriaActive) {\n      <clr-tooltip>\n        <button\n          type=\"button\"\n          class=\"btn btn-sm btn-icon btn-link-neutral btn-compact clear-all-button\"\n          data-test-id=\"clear-all-button\"\n          clrTooltipTrigger\n          [attr.aria-label]=\"filterStrings.clearAllButtonAriaLabel\"\n          (click)=\"clearAllFilters()\"\n        >\n          <cds-icon shape=\"window-close\" size=\"20\" aria-hidden=\"true\"></cds-icon>\n        </button>\n        <!-- Visual only: the button's aria-label is the same text. -->\n        <clr-tooltip-content [id]=\"''\" aria-hidden=\"true\" clrPosition=\"top-right\" clrSize=\"sm\">{{\n          filterStrings.clearAllButtonAriaLabel\n        }}</clr-tooltip-content>\n      </clr-tooltip>\n    }\n  </div>\n</div>\n",
			styles: [".composite-filter-container{display:flex;align-items:center;min-width:0}.manage-filter-container{display:flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-m);min-width:0}.manage-filter-container>.btn,.manage-filter-container>clr-tooltip{flex-shrink:0}.filter-group-separator{align-self:stretch;width:var(--cds-alias-object-border-width-100);margin-block:var(--clr-base-vertical-offset-2xs);background:var(--cds-alias-object-border-color)}.semi-filter-group{display:inline-flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-s)}.semi-filter-option-label{max-width:280px;padding:0;margin:0}.semi-filter-option-label .clr-tooltip-container{display:inline-flex;align-self:stretch;max-width:100%;min-width:0;border-radius:inherit}.semi-filter-option{display:inline-flex;min-width:0;max-width:100%;align-items:center;align-self:stretch;gap:var(--clr-base-gap-xs);padding:var(--clr-base-vertical-offset-2xs) calc(var(--clr-base-horizontal-offset-xs) * 2);border:0;border-radius:inherit;background:none;color:inherit;font:inherit;cursor:pointer}.semi-filter-option:hover{background:var(--clr-label-bg-hover-color)}.semi-filter-option:focus-visible{outline:var(--cds-alias-object-interaction-outline);outline-color:-webkit-focus-ring-color;outline-offset:var(--cds-alias-object-interaction-outline-offset)}.semi-filter-option-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}appfx-manage-filter{max-width:280px}appfx-manage-filter:not([hidden]){display:inline-flex}:host-context(.zoom2x,.zoom4x) .composite-filter-container,:host-context(.zoom2x,.zoom4x) .manage-filter-container{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridFiltersStrings }, { type: i0.ChangeDetectorRef }],
	propDecorators: {
		presetFilters: [{ type: Input }],
		externalCriteriaActive: [{ type: Input }],
		clearAll: [{ type: Output }],
		propertyFiltersChange: [{ type: Output }],
		fieldCombobox: [{
			type: ViewChild,
			args: [ClrCombobox]
		}],
		addButton: [{
			type: ViewChild,
			args: ["addButton", { static: true }]
		}],
		toggleButtons: [{
			type: ViewChildren,
			args: ["toggleButton"]
		}],
		predefinedPills: [{
			type: ViewChildren,
			args: ["predefinedPill"]
		}],
		semiOptionButtons: [{
			type: ViewChildren,
			args: ["semiOptionButton"]
		}],
		filterableProperties: [{
			type: Input,
			args: [{ transform: toPropertyArray }]
		}],
		propertyFilters: [{
			type: Input,
			args: [{ transform: toFilterArray }]
		}],
		predefinedFilters: [{
			type: Input,
			args: [{ transform: toPropertyArray }]
		}],
		semiPredefinedFilters: [{
			type: Input,
			args: [{ transform: toEnumPropertyArray }]
		}],
		toggleFilters: [{
			type: Input,
			args: [{ transform: toToggleArray }]
		}]
	}
});
const enterKey = "Enter";
const searchTermDebounceTimeMs = 2e3;
var DataGridFiltersComponent = class DataGridFiltersComponent {
	constructor(filterStrings) {
		this.filterStrings = filterStrings;
		this.quickMode = FilterMode.Quick;
		this.advancedMode = FilterMode.Advanced;
		this.advancedOnlyMode = FilterMode.AdvancedOnly;
		this.mode = FilterMode.Quick;
		this.selectedFilterMode = FilterMode.Quick;
		this.predefinedFilters = [];
		this.semiPredefinedFilters = [];
		this.toggleFilters = [];
		this.searchTermChange = new EventEmitter();
		this.propertyFiltersChange = new EventEmitter();
		this.combinedMode = FilterMode.Combined;
		this.lastSearchTerm = "";
		this.searchTermDebouncer = new Subject();
		this.unsubscribeSubject = new Subject();
		this._propertyFilters = [];
		this._searchTerm = "";
	}
	set filterMode(filterMode) {
		if (filterMode !== null && filterMode !== void 0) this.mode = filterMode;
	}
	get propertyFilters() {
		return this._propertyFilters;
	}
	set propertyFilters(filters) {
		this._propertyFilters = filters ?? [];
	}
	get searchTerm() {
		return this._searchTerm;
	}
	set searchTerm(searchTerm) {
		if (searchTerm === this.lastSearchTerm && searchTerm === this._searchTerm.trim()) return;
		this._searchTerm = searchTerm ?? "";
		this.lastSearchTerm = this._searchTerm.trim();
		this.searchTermDebouncer.next(this._searchTerm);
	}
	ngAfterViewInit() {
		this.searchTermDebouncer.pipe(debounceTime(searchTermDebounceTimeMs), distinctUntilChanged(), takeUntil(this.unsubscribeSubject)).subscribe((search) => {
			this.doSearch(search);
		});
	}
	ngOnDestroy() {
		this.unsubscribeSubject.next();
		this.unsubscribeSubject.complete();
	}
	onFilterModeChange() {
		if (this.selectedFilterMode === FilterMode.Advanced && !!this.searchTerm) {
			this._searchTerm = "";
			this.doSearch(this.searchTerm);
			this.searchTermDebouncer.next(this.searchTerm);
		}
		if (this.selectedFilterMode === FilterMode.Quick && this.propertyFilters.length > 0) {
			this.propertyFilters = [];
			this.propertyFiltersChange.emit([]);
		}
	}
	onFilterCriteriaChange(propertyFilters) {
		this.propertyFilters = propertyFilters;
		this.propertyFiltersChange.emit(propertyFilters);
	}
	onSearchInputKeyPress(event) {
		if (event.key === enterKey) this.doSearch(this.searchTerm);
	}
	onSearchTermChanged(searchTerm) {
		this._searchTerm = searchTerm;
		this.searchTermDebouncer.next(this.searchTerm);
	}
	onClearAll() {
		if (this.mode === FilterMode.Combined && this.searchTerm) {
			this._searchTerm = "";
			this.searchTermDebouncer.next(this.searchTerm);
			this.doSearch(this.searchTerm);
		}
	}
	doSearch(search) {
		search = search.trim();
		if (this.lastSearchTerm !== search) {
			this.lastSearchTerm = search;
			this.searchTermChange.emit(search);
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DataGridFiltersComponent,
			deps: [{ token: DatagridFiltersStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: DataGridFiltersComponent,
			isStandalone: false,
			selector: "appfx-datagrid-filters",
			inputs: {
				filterableProperties: "filterableProperties",
				presetFilters: "presetFilters",
				predefinedFilters: "predefinedFilters",
				semiPredefinedFilters: "semiPredefinedFilters",
				toggleFilters: "toggleFilters",
				filterMode: "filterMode",
				propertyFilters: "propertyFilters",
				searchTerm: "searchTerm"
			},
			outputs: {
				searchTermChange: "searchTermChange",
				propertyFiltersChange: "propertyFiltersChange"
			},
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div data-test-id=\"appfx-advanced-datagrid-filter\" class=\"filter-container\">\n  @switch (mode) {\n    @case (quickMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.quickFilter }}\n      </label>\n    }\n    @case (advancedOnlyMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.advancedFilter }}\n      </label>\n    }\n    @case (advancedMode) {\n      <clr-select-container class=\"form-control-compact\">\n        <select\n          [attr.aria-label]=\"filterStrings.filterType\"\n          clrSelect\n          [(ngModel)]=\"selectedFilterMode\"\n          (ngModelChange)=\"onFilterModeChange()\"\n        >\n          <option [ngValue]=\"quickMode\">{{ filterStrings.quickFilter }}</option>\n          <option [ngValue]=\"advancedMode\">{{ filterStrings.advancedFilter }}</option>\n        </select>\n      </clr-select-container>\n    }\n  }\n  @if ((selectedFilterMode === quickMode && mode !== advancedOnlyMode) || mode === combinedMode) {\n    <clr-input-container class=\"form-control-compact\">\n      <label class=\"clr-sr-only\"> {{ filterStrings.quickFilter }} </label>\n      <input\n        type=\"text\"\n        (keydown)=\"onSearchInputKeyPress($event)\"\n        [ngModel]=\"searchTerm\"\n        (ngModelChange)=\"onSearchTermChanged($event)\"\n        placeholder=\"{{ filterStrings.enterValue }}\"\n        clrInput\n      />\n    </clr-input-container>\n  }\n  @if (selectedFilterMode === advancedMode || mode === advancedOnlyMode || mode === combinedMode) {\n    <appfx-composite-filter\n      class=\"filter-contents\"\n      [filterableProperties]=\"filterableProperties\"\n      [presetFilters]=\"presetFilters\"\n      [propertyFilters]=\"propertyFilters\"\n      [predefinedFilters]=\"predefinedFilters\"\n      [semiPredefinedFilters]=\"semiPredefinedFilters\"\n      [toggleFilters]=\"toggleFilters\"\n      [externalCriteriaActive]=\"mode === combinedMode && !!searchTerm\"\n      (propertyFiltersChange)=\"onFilterCriteriaChange($event)\"\n      (clearAll)=\"onClearAll()\"\n    >\n    </appfx-composite-filter>\n  }\n</div>\n",
			styles: [".filter-container{display:flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-m);margin-left:var(--clr-base-horizontal-offset-xs)}.filter-container>.form-control-compact{margin-top:0}:host-context(.zoom2x,.zoom4x) .filter-contents{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"],
			dependencies: [
				{
					kind: "directive",
					type: i2$2.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i6$1.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i6$1.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.ClrSelect,
					selector: "[clrSelect]"
				},
				{
					kind: "component",
					type: i6$1.ClrSelectContainer,
					selector: "clr-select-container"
				},
				{
					kind: "directive",
					type: i3$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i3$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i3$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i3$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i3$1.NgModel,
					selector: "[ngModel]:not([formControlName]):not([formControl])",
					inputs: [
						"name",
						"disabled",
						"ngModel",
						"ngModelOptions"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngModel"]
				},
				{
					kind: "component",
					type: CompositeFiltersComponent,
					selector: "appfx-composite-filter",
					inputs: [
						"presetFilters",
						"externalCriteriaActive",
						"filterableProperties",
						"propertyFilters",
						"predefinedFilters",
						"semiPredefinedFilters",
						"toggleFilters"
					],
					outputs: ["clearAll", "propertyFiltersChange"]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.OnPush
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DataGridFiltersComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-datagrid-filters",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.OnPush,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div data-test-id=\"appfx-advanced-datagrid-filter\" class=\"filter-container\">\n  @switch (mode) {\n    @case (quickMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.quickFilter }}\n      </label>\n    }\n    @case (advancedOnlyMode) {\n      <label class=\"clr-control-label form-control-compact\">\n        {{ filterStrings.advancedFilter }}\n      </label>\n    }\n    @case (advancedMode) {\n      <clr-select-container class=\"form-control-compact\">\n        <select\n          [attr.aria-label]=\"filterStrings.filterType\"\n          clrSelect\n          [(ngModel)]=\"selectedFilterMode\"\n          (ngModelChange)=\"onFilterModeChange()\"\n        >\n          <option [ngValue]=\"quickMode\">{{ filterStrings.quickFilter }}</option>\n          <option [ngValue]=\"advancedMode\">{{ filterStrings.advancedFilter }}</option>\n        </select>\n      </clr-select-container>\n    }\n  }\n  @if ((selectedFilterMode === quickMode && mode !== advancedOnlyMode) || mode === combinedMode) {\n    <clr-input-container class=\"form-control-compact\">\n      <label class=\"clr-sr-only\"> {{ filterStrings.quickFilter }} </label>\n      <input\n        type=\"text\"\n        (keydown)=\"onSearchInputKeyPress($event)\"\n        [ngModel]=\"searchTerm\"\n        (ngModelChange)=\"onSearchTermChanged($event)\"\n        placeholder=\"{{ filterStrings.enterValue }}\"\n        clrInput\n      />\n    </clr-input-container>\n  }\n  @if (selectedFilterMode === advancedMode || mode === advancedOnlyMode || mode === combinedMode) {\n    <appfx-composite-filter\n      class=\"filter-contents\"\n      [filterableProperties]=\"filterableProperties\"\n      [presetFilters]=\"presetFilters\"\n      [propertyFilters]=\"propertyFilters\"\n      [predefinedFilters]=\"predefinedFilters\"\n      [semiPredefinedFilters]=\"semiPredefinedFilters\"\n      [toggleFilters]=\"toggleFilters\"\n      [externalCriteriaActive]=\"mode === combinedMode && !!searchTerm\"\n      (propertyFiltersChange)=\"onFilterCriteriaChange($event)\"\n      (clearAll)=\"onClearAll()\"\n    >\n    </appfx-composite-filter>\n  }\n</div>\n",
			styles: [".filter-container{display:flex;flex-wrap:wrap;align-items:center;gap:var(--clr-base-gap-m);margin-left:var(--clr-base-horizontal-offset-xs)}.filter-container>.form-control-compact{margin-top:0}:host-context(.zoom2x,.zoom4x) .filter-contents{display:contents}\n", ".form-compact{padding:0;text-align:left;font-weight:400}.form-control-compact{margin-top:var(--clr-base-vertical-offset-xs)}.btn-compact{min-width:var(--clr-base-row-height-s);padding:0 var(--clr-base-horizontal-offset-s);margin:0}.mt-compact{margin-top:var(--clr-base-vertical-offset-l)}.filter-options{padding:var(--cds-global-space-4);margin-inline:calc(-1 * var(--cds-global-space-4));margin-bottom:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .form-max-height{max-height:8rem;overflow-y:auto;padding:var(--cds-global-space-4);margin:calc(-1 * var(--cds-global-space-4));scroll-padding:var(--cds-global-space-4)}:host-context(.zoom2x,.zoom4x) .filter-options{overflow-y:visible}select{max-width:18rem;text-overflow:ellipsis}.filter-popover{width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));min-width:min(320px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-width:min(360px,100vw - 2 * var(--clr-base-horizontal-offset-l));max-height:400px;display:flex;flex-direction:column;overflow:hidden;padding:var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);background:var(--cds-alias-object-container-background);border:var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);border-radius:var(--clr-base-border-radius-s);box-shadow:var(--cds-alias-object-shadow-200)}.filter-popover>*{display:flex;flex-direction:column;min-height:0}.filter-field{flex:1 1 auto;min-width:0;width:100%;margin-top:0}:host ::ng-deep .filter-field .clr-control-container,:host ::ng-deep .filter-field clr-combobox,:host ::ng-deep .filter-field .clr-combobox-wrapper{width:100%;min-width:0}:host ::ng-deep .filter-field clr-combobox{display:block}:host ::ng-deep .filter-field .clr-combobox-wrapper{display:flex}.loading-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:var(--clr-datagrid-loading-background);display:flex;align-items:center;justify-content:center;z-index:10}.loading-content{display:flex;flex-direction:column;align-items:center;gap:var(--clr-base-gap-s)}\n"]
		}]
	}],
	ctorParameters: () => [{ type: DatagridFiltersStrings }],
	propDecorators: {
		filterableProperties: [{ type: Input }],
		presetFilters: [{ type: Input }],
		predefinedFilters: [{ type: Input }],
		semiPredefinedFilters: [{ type: Input }],
		toggleFilters: [{ type: Input }],
		searchTermChange: [{ type: Output }],
		propertyFiltersChange: [{ type: Output }],
		filterMode: [{ type: Input }],
		propertyFilters: [{ type: Input }],
		searchTerm: [{ type: Input }]
	}
});
function datagridFiltersStringsServiceFactory(existing) {
	return existing || new DatagridFiltersStrings();
}
function datagridFiltersUserServiceFactory(existing) {
	return existing || new DatagridFiltersUserService();
}
var AppfxDatagridFiltersModule = class AppfxDatagridFiltersModule {
	constructor() {
		ClarityIcons.addIcons(angleIcon, checkIcon, plusIcon, searchIcon, windowCloseIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridFiltersModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridFiltersModule,
			declarations: [
				CompositeFiltersComponent,
				DataGridFiltersComponent,
				DateTimeFilterComponent,
				EnumFilterComponent,
				FilterEditorComponent,
				FilterFormComponent,
				GeneralFilterComponent,
				ManageFilterComponent,
				UsersFilterComponent
			],
			imports: [
				A11yModule,
				ClrBadge,
				ClrLabel,
				ClrCheckboxModule,
				ClrComboboxModule,
				ClrDatepickerModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrSelectModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule,
				ClrTooltipModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [
				CompositeFiltersComponent,
				DataGridFiltersComponent,
				FilterFormComponent
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxDatagridFiltersModule,
			providers: [
				DatePipe,
				{
					provide: DatagridFiltersStrings,
					useFactory: datagridFiltersStringsServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridFiltersStrings
					]]
				},
				{
					provide: DatagridFiltersUserService,
					useFactory: datagridFiltersUserServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridFiltersUserService
					]]
				}
			],
			imports: [
				A11yModule,
				ClrBadge,
				ClrLabel,
				ClrCheckboxModule,
				ClrComboboxModule,
				ClrDatepickerModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrSelectModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule,
				ClrTooltipModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxDatagridFiltersModule,
	decorators: [{
		type: NgModule,
		args: [{
			declarations: [
				CompositeFiltersComponent,
				DataGridFiltersComponent,
				DateTimeFilterComponent,
				EnumFilterComponent,
				FilterEditorComponent,
				FilterFormComponent,
				GeneralFilterComponent,
				ManageFilterComponent,
				UsersFilterComponent
			],
			imports: [
				A11yModule,
				ClrBadge,
				ClrLabel,
				ClrCheckboxModule,
				ClrComboboxModule,
				ClrDatepickerModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrSelectModule,
				ClrPopoverModuleNext,
				ClrSpinnerModule,
				ClrTooltipModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [
				CompositeFiltersComponent,
				DataGridFiltersComponent,
				FilterFormComponent
			],
			providers: [
				DatePipe,
				{
					provide: DatagridFiltersStrings,
					useFactory: datagridFiltersStringsServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridFiltersStrings
					]]
				},
				{
					provide: DatagridFiltersUserService,
					useFactory: datagridFiltersUserServiceFactory,
					deps: [[
						new Optional(),
						new SkipSelf(),
						DatagridFiltersUserService
					]]
				}
			]
		}]
	}],
	ctorParameters: () => []
});
export { AppfxDatagridFiltersModule, AppfxDatagridFiltersModule as DatagridFiltersModule, ComparisonOperator, CompositeFiltersComponent, DataGridFiltersComponent, DatagridFiltersStrings, DatagridFiltersUserService, DateTimePropertyDefinition, EnumPropertyDefinition, FilterFormComponent, FilterMode, FilterablePropertyDefinition, LogicalOperator, NumericPropertyDefinition, PropertyFilter, PropertyPredicate, PropertyType, StringPropertyDefinition, TimeSpan, Unit, UserPropertyDefinition };

//# sourceMappingURL=clr-addons-datagrid-filters.mjs.map