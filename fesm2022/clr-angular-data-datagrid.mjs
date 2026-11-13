import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ContentChildren, DOCUMENT, Directive, ElementRef, EnvironmentInjector, EventEmitter, HostListener, Inject, Injectable, InjectionToken, Injector, Input, IterableDiffers, NgModule, NgZone, Optional, Output, PLATFORM_ID, Renderer2, RendererStyleFlags2, SkipSelf, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, afterNextRender, booleanAttribute, computed, createEnvironmentInjector, forwardRef, inject, runInInjectionContext, signal, viewChild } from "@angular/core";
import * as i1 from "@clr/angular/utils";
import { BASIC_FOCUSABLE_ITEM_PROVIDER, CdkDragModule, CdkTrapFocusModule, ClrCommonStringsService, ClrConditionalModule, ClrExpandableAnimationDirective, ClrExpandableAnimationModule, ClrIfExpanded, ClrKeyFocus, ClrKeyFocusModule, ClrLoadingModule, ClrLoadingState, ClrOutsideClickModule, DomAdapter, FOCUS_SERVICE_PROVIDER, FocusableItem, HostWrapper, IfExpandService, Keys, LoadingListener, uniqueIdFactory } from "@clr/angular/utils";
import * as i12 from "rxjs";
import { BehaviorSubject, ReplaySubject, Subject, animationFrameScheduler, asapScheduler, combineLatest, from, fromEvent, isObservable, merge, of } from "rxjs";
import { auditTime, buffer, catchError, debounceTime, defaultIfEmpty, delay, distinctUntilChanged, filter, map, mergeMap, share, switchMap, take, takeUntil } from "rxjs/operators";
import * as i3$1 from "@clr/angular/popover/common";
import { ClrPopoverContent, ClrPopoverHostDirective, ClrPopoverModuleNext, ClrPopoverPosition, ClrPopoverType, mapPopoverKeyToPosition } from "@clr/angular/popover/common";
import * as i7$1 from "@angular/common";
import { CommonModule, NgForOf, isPlatformBrowser } from "@angular/common";
import * as i1$1 from "@clr/angular/modal";
import * as i6$2 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleDoubleIcon, arrowIcon, ellipsisGridCircleIcon, ellipsisVerticalIcon, filterGridCircleIcon, filterGridIcon, pinIcon, stepForward2Icon, timesIcon, twoWayArrowsIcon, unpinIcon, viewColumnsIcon, windowCloseIcon } from "@clr/angular/icon";
import * as i4 from "@clr/angular/forms/common";
import { ClrControlLabel } from "@clr/angular/forms/common";
import * as i5$1 from "@clr/angular/forms/number-input";
import { ClrNumberInputModule } from "@clr/angular/forms/number-input";
import * as i6$1 from "@angular/forms";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as i5 from "@clr/angular/forms/input";
import { ClrInputModule } from "@clr/angular/forms/input";
import { ClrSignpost } from "@clr/angular/popover/signpost";
import * as i2$1 from "@clr/angular/progress/spinner";
import { ClrSpinnerModule } from "@clr/angular/progress/spinner";
import * as i13 from "@clr/angular/forms/radio";
import { ClrRadioModule } from "@clr/angular/forms/radio";
import * as i2 from "@angular/cdk/bidi";
import { Directionality } from "@angular/cdk/bidi";
import { coerceNumberProperty } from "@angular/cdk/coercion";
import * as i3 from "@angular/cdk/scrolling";
import { CDK_VIRTUAL_SCROLL_VIEWPORT, CdkVirtualForOf, CdkVirtualScrollViewport, CdkVirtualScrollable, FixedSizeVirtualScrollStrategy, ScrollDispatcher, VIRTUAL_SCROLL_STRATEGY, ViewportRuler } from "@angular/cdk/scrolling";
import * as i6 from "@clr/angular/popover/dropdown";
import { ClrDropdown, ClrDropdownItem, ClrDropdownMenu, ClrDropdownModule, DropdownFocusHandler, ROOT_DROPDOWN_PROVIDER } from "@clr/angular/popover/dropdown";
import * as i7 from "@clr/angular/forms/checkbox";
import { ClrCheckboxModule } from "@clr/angular/forms/checkbox";
import { ClrSelectModule } from "@clr/angular/forms/select";
var NestedProperty = class {
	constructor(prop) {
		this.prop = prop;
		if (prop.indexOf(".") >= 0) this.splitProp = prop.split(".");
	}
	getPropValue(item) {
		if (this.splitProp) {
			let value = item;
			for (const nestedProp of this.splitProp) {
				if (value === null || typeof value === "undefined" || typeof value[nestedProp] === "undefined") return;
				value = value[nestedProp];
			}
			return value;
		} else return item[this.prop];
	}
};
var DatagridPropertyComparator = class {
	constructor(prop) {
		this.prop = prop;
		this.nestedProp = new NestedProperty(prop);
	}
	compare(a, b) {
		let propA = this.nestedProp.getPropValue(a);
		let propB = this.nestedProp.getPropValue(b);
		if (typeof propA === "string") propA = propA.toLowerCase();
		if (typeof propB === "string") propB = propB.toLowerCase();
		if (typeof propA === "undefined" || propA === null) {
			if (typeof propB === "undefined" || propB === null) return 0;
			else return 1;
		} else if (typeof propB === "undefined" || propB === null) return -1;
		else if (propA < propB) return -1;
		else if (propA > propB) return 1;
		else return 0;
	}
};
var DatagridPropertyNumericFilter = class {
	constructor(prop, exact = false) {
		this.prop = prop;
		this.exact = exact;
		this.nestedProp = new NestedProperty(prop);
	}
	accepts(item, low, high) {
		const propValue = this.nestedProp.getPropValue(item);
		if (propValue === void 0) return false;
		if (low !== null && (typeof propValue !== "number" || propValue < low)) return false;
		if (high !== null && (typeof propValue !== "number" || propValue > high)) return false;
		return true;
	}
};
var DatagridNumericFilterImpl = class DatagridNumericFilterImpl {
	constructor(filterFn) {
		this.filterFn = filterFn;
		this._changes = new Subject();
		this._low = null;
		this._high = null;
	}
	get changes() {
		return this._changes.asObservable();
	}
	get value() {
		return [this._low, this._high];
	}
	set value(vals) {
		const low = vals[0];
		const high = vals[1];
		if (low !== this._low || high !== this._high) {
			this._low = low;
			this._high = high;
			this._changes.next([this._low, this._high]);
		}
	}
	get low() {
		return this._low;
	}
	set low(low) {
		if (low !== this._low) {
			this._low = low;
			this._changes.next([this._low, this._high]);
		}
	}
	get high() {
		return this._high;
	}
	set high(high) {
		if (high !== this._high) {
			this._high = high;
			this._changes.next([this._low, this._high]);
		}
	}
	get state() {
		if (this.filterFn instanceof DatagridPropertyNumericFilter) return {
			property: this.filterFn.prop,
			low: this._low,
			high: this._high
		};
		return this;
	}
	isActive() {
		return this._low !== null || this.high !== null;
	}
	accepts(item) {
		return this.filterFn.accepts(item, this._low, this._high);
	}
	equals(other) {
		if (other instanceof DatagridNumericFilterImpl) {
			if (other.filterFn instanceof DatagridPropertyNumericFilter) return this.filterFn instanceof DatagridPropertyNumericFilter && other.filterFn.prop === this.filterFn.prop && other.low === this._low && other.high === this._high;
			return other === this;
		}
		return false;
	}
};
var DatagridPropertyStringFilter = class {
	constructor(prop, exact = false) {
		this.prop = prop;
		this.exact = exact;
		this.nestedProp = new NestedProperty(prop);
	}
	accepts(item, search) {
		const propValue = this.nestedProp.getPropValue(item);
		if (typeof propValue === "undefined") return false;
		else if (this.exact) return ("" + propValue).toLowerCase() === search;
		else return ("" + propValue).toLowerCase().indexOf(search) >= 0;
	}
};
var DatagridStringFilterImpl = class DatagridStringFilterImpl {
	constructor(filterFn) {
		this.filterFn = filterFn;
		this._changes = new Subject();
		this._lowerCaseValue = "";
		this._rawValue = "";
	}
	get changes() {
		return this._changes.asObservable();
	}
	get lowerCaseValue() {
		return this._lowerCaseValue;
	}
	get state() {
		if (this.filterFn instanceof DatagridPropertyStringFilter) return {
			property: this.filterFn.prop,
			value: this.value
		};
		return this;
	}
	get value() {
		return this._rawValue;
	}
	set value(value) {
		if (!value) value = "";
		if (value !== this._rawValue) {
			this._rawValue = value;
			this._lowerCaseValue = value.toLowerCase().trim();
			this._changes.next(value);
		}
	}
	isActive() {
		return !!this.value;
	}
	accepts(item) {
		return this.filterFn.accepts(item, this.lowerCaseValue);
	}
	equals(other) {
		if (other instanceof DatagridStringFilterImpl) {
			if (other.filterFn instanceof DatagridPropertyStringFilter) return this.filterFn instanceof DatagridPropertyStringFilter && other.filterFn.prop === this.filterFn.prop && other.value === this.value;
			return other === this;
		}
		return false;
	}
};
var DatagridColumnChanges;
(function(DatagridColumnChanges) {
	DatagridColumnChanges[DatagridColumnChanges["WIDTH"] = 0] = "WIDTH";
	DatagridColumnChanges[DatagridColumnChanges["HIDDEN"] = 1] = "HIDDEN";
	DatagridColumnChanges[DatagridColumnChanges["INITIALIZE"] = 2] = "INITIALIZE";
	DatagridColumnChanges[DatagridColumnChanges["PINNED"] = 3] = "PINNED";
})(DatagridColumnChanges || (DatagridColumnChanges = {}));
const ALL_COLUMN_CHANGES = Object.keys(DatagridColumnChanges).map((key) => DatagridColumnChanges[key]).filter((key) => key === parseInt(key, 10) && key !== DatagridColumnChanges.INITIALIZE);
var ClrDatagridSortOrder;
(function(ClrDatagridSortOrder) {
	ClrDatagridSortOrder[ClrDatagridSortOrder["UNSORTED"] = 0] = "UNSORTED";
	ClrDatagridSortOrder[ClrDatagridSortOrder["ASC"] = 1] = "ASC";
	ClrDatagridSortOrder[ClrDatagridSortOrder["DESC"] = -1] = "DESC";
})(ClrDatagridSortOrder || (ClrDatagridSortOrder = {}));
var ClrDatagridAriaSortOrder;
(function(ClrDatagridAriaSortOrder) {
	ClrDatagridAriaSortOrder["UNSORTED"] = "none";
	ClrDatagridAriaSortOrder["ASC"] = "ascending";
	ClrDatagridAriaSortOrder["DESC"] = "descending";
})(ClrDatagridAriaSortOrder || (ClrDatagridAriaSortOrder = {}));
var ColumnActionsService = class ColumnActionsService {
	constructor() {
		this.title = signal("", ...ngDevMode ? [{ debugName: "title" }] : /* istanbul ignore next */ []);
		this.filterInHeader = signal(true, ...ngDevMode ? [{ debugName: "filterInHeader" }] : /* istanbul ignore next */ []);
		this.menuPresent = signal(false, ...ngDevMode ? [{ debugName: "menuPresent" }] : /* istanbul ignore next */ []);
		this.filter = signal(null, ...ngDevMode ? [{ debugName: "filter" }] : /* istanbul ignore next */ []);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnActionsService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnActionsService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnActionsService,
	decorators: [{ type: Injectable }]
});
const COLUMN_STATE = new InjectionToken("COLUMN_STATE");
function columnStateFactory() {
	return new BehaviorSubject({ changes: [] });
}
const COLUMN_STATE_PROVIDER = {
	provide: COLUMN_STATE,
	useFactory: columnStateFactory
};
var CustomFilter = class {};
var DatagridTreeNode = class {
	constructor(item, parent, level) {
		this.item = item;
		this.parent = parent;
		this.level = level;
		this.expanded = false;
		this.children = null;
		this.index = 0;
		this.mayHaveChildren = true;
		this.request = null;
		this.locked = false;
		this.unseen = false;
		this.selectedWithParent = false;
	}
	get loading() {
		return this.request !== null;
	}
	get expandable() {
		return this.mayHaveChildren && this.children?.length !== 0;
	}
	descendants() {
		return [this, ...(this.children || []).flatMap((child) => child.descendants())];
	}
};
var SelectionType;
(function(SelectionType) {
	SelectionType["None"] = "none";
	SelectionType["Single"] = "single";
	SelectionType["Multi"] = "multi";
})(SelectionType || (SelectionType = {}));
const SELECTION_TYPE_VALUES = new Set(Object.values(SelectionType));
function selectionTypeAttribute(value) {
	if (SELECTION_TYPE_VALUES.has(value)) return value;
	throw new Error(`Invalid SelectionType: "${value}". Expected one of: ${[...SELECTION_TYPE_VALUES].join(", ")}`);
}
var StateDebouncer = class StateDebouncer {
	constructor() {
		this.nbChanges = 0;
		this._change = new Subject();
	}
	get change() {
		return this._change.asObservable();
	}
	changeStart() {
		this.nbChanges++;
	}
	changeDone() {
		if (--this.nbChanges === 0) this._change.next();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StateDebouncer,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StateDebouncer
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: StateDebouncer,
	decorators: [{ type: Injectable }]
});
var Page = class Page {
	constructor(stateDebouncer) {
		this.stateDebouncer = stateDebouncer;
		this.activated = false;
		this._size = 0;
		this._current = 1;
		this._change = new Subject();
		this.preventEmit = false;
		this._sizeChange = new Subject();
	}
	get size() {
		return this._size;
	}
	set size(size) {
		const oldSize = this._size;
		if (size !== oldSize) {
			if (!this.preventEmit) this.stateDebouncer.changeStart();
			this._size = size;
			if (size === 0) this._current = 1;
			else this._current = Math.floor(oldSize / size * (this._current - 1)) + 1;
			if (!this.preventEmit) {
				this._change.next(this._current);
				this._sizeChange.next(this._size);
				this.stateDebouncer.changeDone();
			}
		}
		this.preventEmit = false;
	}
	get totalItems() {
		return this._totalItems || 0;
	}
	set totalItems(total) {
		this._totalItems = total;
		if (this.current > this.last) this.current = this.last;
	}
	get last() {
		if (this._last) return this._last;
		if (this.size > 0 && this.totalItems) return Math.ceil(this.totalItems / this.size);
		return 1;
	}
	set last(page) {
		this._last = page;
	}
	get change() {
		return this._change.asObservable();
	}
	get sizeChange() {
		return this._sizeChange.asObservable();
	}
	get current() {
		return this._current;
	}
	set current(page) {
		if (page !== this._current) {
			this.stateDebouncer.changeStart();
			this._current = page;
			this._change.next(page);
			this.stateDebouncer.changeDone();
		}
	}
	get firstItem() {
		if (this._totalItems === 0) return -1;
		if (this.size === 0) return 0;
		return (this.current - 1) * this.size;
	}
	get lastItem() {
		if (this._totalItems === 0) return -1;
		if (this.size === 0) return this.totalItems - 1;
		let lastInPage = this.current * this.size - 1;
		if (this.totalItems) lastInPage = Math.min(lastInPage, this.totalItems - 1);
		return lastInPage;
	}
	previous() {
		if (this.current > 1) this.current--;
	}
	next() {
		if (this.current < this.last) this.current++;
	}
	resetPageSize(preventEmit = false) {
		this.preventEmit = preventEmit;
		this.size = 0;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Page,
			deps: [{ token: StateDebouncer }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Page
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: Page,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: StateDebouncer }]
});
var FiltersProvider = class FiltersProvider {
	constructor(_page, stateDebouncer) {
		this._page = _page;
		this.stateDebouncer = stateDebouncer;
		this._change = new Subject();
		this._all = [];
	}
	get change() {
		return this._change.asObservable();
	}
	hasActiveFilters() {
		for (const { filter } of this._all) if (filter && filter.isActive()) return true;
		return false;
	}
	getActiveFilters() {
		const ret = [];
		for (const { filter } of this._all) if (filter && filter.isActive()) ret.push(filter);
		return ret;
	}
	add(filter) {
		const subscription = filter.changes.subscribe(() => this.resetPageAndEmitFilterChange([filter]));
		let hasUnregistered = false;
		const registered = new RegisteredFilter(filter, () => {
			if (hasUnregistered) return;
			subscription.unsubscribe();
			const matchIndex = this._all.findIndex((item) => item.filter === filter);
			if (matchIndex >= 0) this._all.splice(matchIndex, 1);
			if (filter.isActive()) this.resetPageAndEmitFilterChange([]);
			hasUnregistered = true;
		});
		this._all.push(registered);
		if (filter.isActive()) this.resetPageAndEmitFilterChange([filter]);
		return registered;
	}
	accepts(item) {
		for (const { filter } of this._all) if (filter && filter.isActive() && !filter.accepts(item)) return false;
		return true;
	}
	resetPageAndEmitFilterChange(filters) {
		this.stateDebouncer.changeStart();
		this._page.current = 1;
		this._change.next(filters);
		this.stateDebouncer.changeDone();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: FiltersProvider,
			deps: [{ token: Page }, { token: StateDebouncer }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: FiltersProvider
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: FiltersProvider,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: Page }, { type: StateDebouncer }]
});
var RegisteredFilter = class {
	constructor(filter, unregister) {
		this.filter = filter;
		this.unregister = unregister;
	}
};
var Sort = class Sort {
	constructor(stateDebouncer) {
		this.stateDebouncer = stateDebouncer;
		this._reverse = false;
		this._change = new Subject();
	}
	get comparator() {
		return this._comparator;
	}
	set comparator(value) {
		this.stateDebouncer.changeStart();
		this._comparator = value;
		this.emitChange();
		this.stateDebouncer.changeDone();
	}
	get reverse() {
		return this._reverse;
	}
	set reverse(value) {
		this.stateDebouncer.changeStart();
		this._reverse = value;
		this.emitChange();
		this.stateDebouncer.changeDone();
	}
	get change() {
		return this._change.asObservable();
	}
	toggle(sortBy, forceReverse) {
		this.stateDebouncer.changeStart();
		if (this.comparator === sortBy) this._reverse = typeof forceReverse !== "undefined" ? forceReverse || !this._reverse : !this._reverse;
		else {
			this._comparator = sortBy;
			this._reverse = typeof forceReverse !== "undefined" ? forceReverse : false;
		}
		this.emitChange();
		this.stateDebouncer.changeDone();
	}
	clear() {
		this.comparator = null;
	}
	compare(a, b) {
		return (this.reverse ? -1 : 1) * this.comparator.compare(a, b);
	}
	emitChange() {
		this._change.next(this);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Sort,
			deps: [{ token: StateDebouncer }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Sort
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: Sort,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: StateDebouncer }]
});
var Items = class Items {
	constructor(_filters, _sort, _page) {
		this._filters = _filters;
		this._sort = _sort;
		this._page = _page;
		this.loading = false;
		this._smart = false;
		this._displayed = [];
		this._change = new Subject();
		this._allChanges = new Subject();
		this.identifyBy = (item) => item;
	}
	get smart() {
		return this._smart;
	}
	get all() {
		return this._all;
	}
	set all(items) {
		this._all = items;
		this.emitAllChanges(items);
		if (this.smart) this._filterItems();
		else {
			this._displayed = items;
			this.emitChange();
		}
	}
	get displayed() {
		return this._displayed;
	}
	get change() {
		return this._change.asObservable();
	}
	get allChanges() {
		return this._allChanges.asObservable();
	}
	get uninitialized() {
		return !this._all;
	}
	destroy() {
		if (this._filtersSub) this._filtersSub.unsubscribe();
		if (this._sortSub) this._sortSub.unsubscribe();
		if (this._pageSub) this._pageSub.unsubscribe();
	}
	smartenDown() {
		this._smart = false;
		this.destroy();
	}
	smartenUp() {
		this._smart = true;
		this._filtersSub = this._filters.change.subscribe(() => this._filterItems());
		this._sortSub = this._sort.change.subscribe(() => {
			if (!this._sort.comparator) this._filterItems();
			else this._sortItems();
		});
		this._pageSub = this._page.change.subscribe(() => this._changePage());
	}
	refresh() {
		if (this.smart) this._filterItems();
	}
	emitChange() {
		this._change.next(this.displayed);
	}
	emitAllChanges(items) {
		this._allChanges.next(items);
	}
	_filterItems() {
		if (this.uninitialized) return;
		if (this._filters.hasActiveFilters()) this._filtered = this._all.filter((item) => this._filters.accepts(item));
		else this._filtered = this._all.slice();
		this._page.totalItems = this._filtered.length;
		this._sortItems();
	}
	_sortItems() {
		if (this.uninitialized) return;
		if (this._sort.comparator) this._filtered.sort((a, b) => this._sort.compare(a, b));
		this._changePage();
	}
	_changePage() {
		if (this.uninitialized || this._page.activated && this._page.size === 0) return;
		if (this._page.size > 0) this._displayed = this._filtered.slice(this._page.firstItem, this._page.lastItem + 1);
		else this._displayed = this._filtered;
		this.emitChange();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Items,
			deps: [
				{ token: FiltersProvider },
				{ token: Sort },
				{ token: Page }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Items
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: Items,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: FiltersProvider },
		{ type: Sort },
		{ type: Page }
	]
});
let nbSelection = 0;
var Selection = class Selection {
	constructor(_items, filters, differs) {
		this._items = _items;
		this.preserveSelection = false;
		this.shiftPressed = false;
		this.rowSelectionMode = false;
		this.lockedRefs = [];
		this._currentSelectionRefs = [];
		this.valueCollector = new Subject();
		this._selectionType = SelectionType.None;
		this._change = new Subject();
		this.subscriptions = [];
		this.id = "clr-dg-selection" + nbSelection++;
		this.identifyBy = _items.identifyBy;
		this._differ = differs.find(this._current || []).create(this.identifyBy);
		this.subscriptions.push(filters.change.subscribe(() => {
			if (!this.selectable || this.preserveSelection) return;
			this.clearSelection();
		}));
		this.subscriptions.push(_items.allChanges.pipe(delay(0)).subscribe((updatedItems) => {
			const updateLockedRef = [];
			switch (this.selectionType) {
				case SelectionType.None: break;
				case SelectionType.Single: {
					let newSingle;
					let selectionUpdated = false;
					updatedItems.forEach((item) => {
						if (item === null || item === void 0) return;
						const ref = _items.identifyBy(item);
						if (this.currentSelectionRefs[0] === ref) {
							newSingle = item;
							selectionUpdated = true;
						}
						if (this.lockedRefs.indexOf(ref) > -1) updateLockedRef.push(ref);
					});
					if (selectionUpdated) this.current = [newSingle];
					break;
				}
				case SelectionType.Multi: {
					let leftOver = this.current.slice();
					let selectionUpdated = false;
					updatedItems.forEach((item) => {
						if (item === null || item === void 0) return;
						const ref = _items.identifyBy(item);
						if (this.lockedRefs.indexOf(ref) > -1) updateLockedRef.push(ref);
					});
					if (leftOver.length > 0) {
						updatedItems.forEach((item) => {
							if (item === null || item === void 0) return;
							const ref = _items.identifyBy(item);
							const selectedIndex = this.currentSelectionRefs.indexOf(ref);
							if (selectedIndex > -1) {
								leftOver[selectedIndex] = item;
								selectionUpdated = true;
							}
						});
						if (_items.smart) {
							leftOver = leftOver.filter((selected) => updatedItems.indexOf(selected) > -1);
							if (this.current.length !== leftOver.length) selectionUpdated = true;
						}
						if (selectionUpdated) this.current = leftOver;
					}
					break;
				}
			}
			this.lockedRefs = updateLockedRef;
		}));
		this.subscriptions.push(this.valueCollector.pipe(debounceTime(0)).subscribe(() => this.emitChange()));
	}
	get selectionType() {
		return this._selectionType;
	}
	set selectionType(value) {
		if (value === this.selectionType) return;
		this._selectionType = value ?? SelectionType.None;
		if (!this._current && this._selectionType !== SelectionType.None) this._current = [];
	}
	get current() {
		return this._current;
	}
	set current(value) {
		this.updateCurrent(value, true);
		this.updateCurrentSelectionRefs();
	}
	get currentSingle() {
		return this._current?.length ? this._current[0] : void 0;
	}
	get change() {
		return this._change.asObservable();
	}
	get selectable() {
		return this._selectionType !== SelectionType.None;
	}
	get currentSelectionRefs() {
		return this._currentSelectionRefs;
	}
	checkForChanges() {
		const changes = this._differ.diff(this._current);
		if (this.identifyBy !== this._items.identifyBy) this.identifyBy = this._items.identifyBy;
		if (changes) this.updateCurrentSelectionRefs();
	}
	clearSelection() {
		this._current = [];
		this._currentSelectionRefs = [];
		this.emitChange();
	}
	destroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	updateCurrent(value, emit) {
		this._current = value;
		if (emit) this.valueCollector.next(value);
	}
	isSelected(item) {
		const refIndex = this.currentSelectionRefs.indexOf(this._items.identifyBy(item));
		if (this._selectionType === SelectionType.Single) return refIndex === 0;
		else if (this._selectionType === SelectionType.Multi) return refIndex >= 0;
		return false;
	}
	setSelected(item, selected) {
		const ref = this._items.identifyBy(item);
		const index = this.currentSelectionRefs ? this.currentSelectionRefs.indexOf(ref) : -1;
		switch (this._selectionType) {
			case SelectionType.None: break;
			case SelectionType.Single:
				if (selected) this.current = [item];
				break;
			case SelectionType.Multi: if (index >= 0 && !selected) this.deselectItem(index);
			else if (index < 0 && selected) this.selectItem(item);
		}
	}
	isAllSelected() {
		if (this._selectionType !== SelectionType.Multi || !this._items.displayed) return false;
		const displayedItems = this._items.displayed.filter((item) => {
			return this.isLocked(item) === false;
		});
		if (displayedItems.length < 1) return false;
		return displayedItems.filter((item) => {
			const ref = this._items.identifyBy(item);
			return this.currentSelectionRefs.indexOf(ref) > -1;
		}).length === displayedItems.length;
	}
	lockItem(item, lock) {
		if (this.canItBeLocked()) {
			const ref = this._items.identifyBy(item);
			if (lock === true) this.lockedRefs.push(ref);
			else this.lockedRefs = this.lockedRefs.filter((lockedItem) => ref !== lockedItem);
		}
	}
	isLocked(item) {
		if (this.canItBeLocked()) {
			const ref = this._items.identifyBy(item);
			return this.lockedRefs.indexOf(ref) > -1;
		}
		return false;
	}
	toggleAll() {
		if (this._selectionType === SelectionType.None || this._selectionType === SelectionType.Single) return;
		if (this.isAllSelected()) this._items.displayed.forEach((item) => {
			const ref = this._items.identifyBy(item);
			const currentIndex = this.currentSelectionRefs.indexOf(ref);
			if (currentIndex > -1 && this.isLocked(item) === false) this.deselectItem(currentIndex);
		});
		else this._items.displayed.forEach((item) => {
			if (!this.isSelected(item) && this.isLocked(item) === false) this.selectItem(item);
		});
	}
	selectItem(item) {
		this.current = this.current.concat(item);
	}
	deselectItem(indexOfItem) {
		this.current = this.current.slice(0, indexOfItem).concat(this.current.slice(indexOfItem + 1));
		if (indexOfItem < this.currentSelectionRefs.length) {
			const removedItems = this.currentSelectionRefs[indexOfItem];
			this.lockedRefs = this.lockedRefs.filter((locked) => locked !== removedItems[0]);
		}
	}
	canItBeLocked() {
		return this._selectionType !== SelectionType.None;
	}
	emitChange() {
		this._change.next(this.current);
	}
	updateCurrentSelectionRefs() {
		this._currentSelectionRefs = this._current?.map((item) => this._items.identifyBy(item)) || [];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Selection,
			deps: [
				{ token: Items },
				{ token: FiltersProvider },
				{ token: i0.IterableDiffers }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: Selection
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: Selection,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: Items },
		{ type: FiltersProvider },
		{ type: i0.IterableDiffers }
	]
});
function firstChildren(children) {
	return children.pipe(take(1), map((value) => value || []), defaultIfEmpty(null), catchError(() => of(null)));
}
var DatagridTreeService = class DatagridTreeService {
	constructor(items, sort, selection, page) {
		this.items = items;
		this.sort = sort;
		this.selection = selection;
		this.page = page;
		this.enabled = signal(false, ...ngDevMode ? [{ debugName: "enabled" }] : /* istanbul ignore next */ []);
		this.cascadeSelection = false;
		this.toggleColumns = /* @__PURE__ */ new Set();
		this.expandedChange = new Subject();
		this.roots = [];
		this.nodes = /* @__PURE__ */ new Map();
		this.allExpanded = false;
		this._change = new Subject();
		this.requests = new Subject();
		this.cancelled = new Subject();
		this.subscriptions = [];
		this.indeterminate = null;
		this.zone = inject(NgZone);
		this.inBrowser = isPlatformBrowser(inject(PLATFORM_ID));
		const results = this.requests.pipe(mergeMap((request) => firstChildren(request.children).pipe(map((children) => ({
			request,
			children
		})), takeUntil(this.cancelled.pipe(filter((cancelled) => cancelled === request))))), share());
		const frame = results.pipe(auditTime(0, this.inBrowser ? animationFrameScheduler : asapScheduler));
		this.subscriptions.push(sort.change.subscribe(() => this.update()), results.pipe(buffer(frame)).subscribe((batch) => this.zone.run(() => {
			batch.forEach(({ request, children }) => this.applyResult(request, children));
			this.update();
		})));
	}
	get change() {
		return this._change.asObservable();
	}
	get cascading() {
		return this.enabled() && this.cascadeSelection && this.selection.selectionType === SelectionType.Multi;
	}
	configure(roots, getChildren, cascadeSelection) {
		const cascaded = this.cascading;
		this.getChildren = getChildren;
		this.cascadeSelection = !!cascadeSelection;
		this.setRoots(roots);
		if (this.cascading && !cascaded && this.selection.current?.length) this.setSelected(this.selection.current || [], true);
	}
	setRoots(items) {
		const previous = this.loadedRoots();
		this.roots = Array.from(items || [], (item) => item === void 0 ? void 0 : this.toNode(item, null));
		this.loadOpen(this.loadedRoots());
		const kept = new Set(this.roots);
		previous.filter((root) => !kept.has(root)).forEach((root) => {
			root.descendants().forEach((node) => this.cancel(node));
			if (!root.expanded && !root.children) this.nodes.delete(this.identify(root.item));
		});
		this.update();
	}
	identify(item) {
		return this.items.identifyBy(item);
	}
	nodeFor(item) {
		return this.nodes.get(this.identify(item));
	}
	setExpanded(node, expanded, report = true) {
		if (!node.expandable || node.expanded === expanded) return;
		if (expanded) this.expand(node, report);
		else {
			this.allExpanded = false;
			this.collapse(node, report);
		}
		this.update();
	}
	rowDeclared(item, { expandable, locked, expanded }) {
		const node = this.nodeFor(item);
		if (!node) return;
		node.locked = locked;
		this.setExpandable(node, expandable);
		if (node.unseen) {
			node.unseen = false;
			this.reportLater(node);
		} else if (expanded !== void 0) this.setExpanded(node, expanded, false);
		this.unselectIfLocked(node);
		if (node.expanded && !node.children && !node.loading) {
			this.load(node);
			if (!node.loading) this.update();
		}
	}
	expandAll(rendered) {
		this.allExpanded = true;
		const shown = new Set(rendered.map((item) => this.identify(item)));
		this.treeNodes().filter((node) => node.expandable && !node.expanded).forEach((node) => {
			if (shown.has(this.identify(node.item))) this.expand(node);
			else this.setUnseen(node, true);
		});
		this.update();
	}
	collapseAll(rendered) {
		this.allExpanded = false;
		const shown = new Set(rendered.map((item) => this.identify(item)));
		this.nodes.forEach((node) => {
			if (shown.has(this.identify(node.item))) this.collapse(node);
			else if (node.expanded) this.setUnseen(node, false);
		});
		this.update();
	}
	reload(item) {
		if (item === void 0) {
			this.nodes.forEach((node) => this.forget(node));
			this.loadedRoots().filter((root) => root.expanded).forEach((root) => this.load(root));
		} else {
			const node = this.nodeFor(item);
			if (node) {
				this.forget(node);
				if (node.expanded && this.treeNodes().includes(node)) this.load(node);
			}
		}
		this.update();
	}
	setSelected(items, selected) {
		const selection = new Map((this.selection.current || []).map((item) => [this.identify(item), item]));
		const set = (node, value) => {
			if (node.locked) return;
			if (value) selection.set(this.identify(node.item), node.item);
			else selection.delete(this.identify(node.item));
		};
		items.map((item) => this.nodeFor(item)).filter(Boolean).forEach((node) => {
			node.descendants().forEach((descendant) => set(descendant, selected));
			for (let parent = node.parent; parent; parent = parent.parent) set(parent, parent.children.every((child) => child.locked || selection.has(this.identify(child.item))));
		});
		this.selection.current = Array.from(selection.values());
	}
	toggleAll() {
		this.setSelected(this.loadedRoots().map((root) => root.item), !this.selection.isAllSelected());
	}
	posInSet(node) {
		return node.parent ? node.index + 1 : Math.max(this.page.firstItem, 0) + node.index + 1;
	}
	setSize(node) {
		return node.parent ? node.parent.children.length : Math.max(this.page.totalItems, this.roots.length);
	}
	isIndeterminate(item) {
		if (this.indeterminate?.selection !== this.selection.current) {
			const selected = new Set((this.selection.current || []).map((selectedItem) => this.identify(selectedItem)));
			const nodes = /* @__PURE__ */ new Set();
			const walk = (node) => {
				const self = selected.has(this.identify(node.item));
				const below = (node.children || []).map(walk).some(Boolean);
				if (below && !self) nodes.add(node);
				return self || below;
			};
			this.loadedRoots().forEach(walk);
			this.indeterminate = {
				selection: this.selection.current,
				nodes
			};
		}
		return this.indeterminate.nodes.has(this.nodeFor(item));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this._change.complete();
		this.expandedChange.complete();
	}
	unselectIfLocked(node) {
		if (!node.selectedWithParent) return;
		node.selectedWithParent = false;
		if (node.locked) {
			const ref = this.identify(node.item);
			queueMicrotask(() => {
				this.selection.current = (this.selection.current || []).filter((selected) => this.identify(selected) !== ref);
			});
		}
	}
	setExpandable(node, expandable) {
		if (node.mayHaveChildren === expandable) return;
		node.mayHaveChildren = expandable;
		if (!node.expandable && node.expanded) {
			const report = !node.unseen;
			this.collapse(node, false);
			if (report) this.reportLater(node);
			if (node.children?.length) this.update();
		}
	}
	toNode(item, parent) {
		const level = parent ? parent.level + 1 : 1;
		const ref = this.identify(item);
		const node = this.nodes.get(ref) || new DatagridTreeNode(item, parent, level);
		node.item = item;
		node.parent = parent;
		node.level = level;
		this.nodes.set(ref, node);
		if (this.allExpanded && node.expandable && !node.expanded) this.setUnseen(node, true);
		return node;
	}
	loadedRoots() {
		return this.roots.filter(Boolean);
	}
	loadOpen(nodes) {
		nodes.filter((node) => node.expanded && !node.children && !node.unseen).forEach((node) => this.load(node));
	}
	setUnseen(node, expanded) {
		node.expanded = expanded;
		node.unseen = !node.unseen;
	}
	reportLater(node) {
		const expanded = node.expanded;
		queueMicrotask(() => {
			if (node.expanded === expanded) this.expandedChange.next({
				item: node.item,
				expanded
			});
		});
	}
	treeNodes() {
		return this.loadedRoots().flatMap((root) => root.descendants());
	}
	cancel(node) {
		if (node.request) {
			this.cancelled.next(node.request);
			node.request = null;
		}
	}
	forget(node) {
		node.descendants().forEach((descendant) => {
			this.cancel(descendant);
			descendant.children = null;
		});
	}
	load(node) {
		if (node.loading) return;
		let children;
		try {
			children = this.getChildren ? this.outsideAngular(() => this.getChildren(node.item)) : null;
		} catch {
			this.collapse(node);
			return;
		}
		if (isObservable(children) || typeof children?.then === "function") {
			const request = {
				node,
				children: from(children)
			};
			node.request = request;
			this.outsideAngular(() => this.requests.next(request));
		} else this.setChildren(node, children);
	}
	outsideAngular(fn) {
		return this.inBrowser ? this.zone.runOutsideAngular(fn) : fn();
	}
	applyResult(request, children) {
		const node = request.node;
		if (node.request !== request) return;
		node.request = null;
		if (children) this.setChildren(node, children);
		else this.collapse(node);
	}
	setChildren(node, children) {
		node.children = (children || []).map((child) => this.toNode(child, node));
		this.loadOpen(node.children);
		if (this.cascading && node.children.length && this.selection.isSelected(node.item)) {
			const unselected = node.descendants().filter((descendant) => !this.selection.isSelected(descendant.item));
			this.setSelected([node.item], true);
			unselected.forEach((descendant) => descendant.selectedWithParent = this.selection.isSelected(descendant.item));
		}
		if (!node.children.length) this.collapse(node);
	}
	expand(node, report = true) {
		node.expanded = true;
		node.unseen = false;
		if (report) this.expandedChange.next({
			item: node.item,
			expanded: true
		});
		if (!node.children) this.load(node);
	}
	collapse(node, report = !node.unseen) {
		if (!node.expanded) return;
		node.expanded = false;
		node.unseen = false;
		if (report) this.expandedChange.next({
			item: node.item,
			expanded: false
		});
	}
	update() {
		const visible = [];
		const walk = (siblings, sorted) => {
			const ordered = sorted && this.sort.comparator ? siblings.slice().sort((a, b) => this.sort.compare(a.item, b.item)) : siblings;
			for (const [index, node] of ordered.entries()) {
				visible.push(node?.item);
				if (node) {
					node.index = index;
					if (node.expanded && node.children) walk(node.children, true);
				}
			}
		};
		walk(this.roots, false);
		this.indeterminate = null;
		this._change.next(visible);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridTreeService,
			deps: [
				{ token: Items },
				{ token: Sort },
				{ token: Selection },
				{ token: Page }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridTreeService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridTreeService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: Items },
		{ type: Sort },
		{ type: Selection },
		{ type: Page }
	]
});
const STRICT_WIDTH_CLASS = "datagrid-fixed-width";
const HIDDEN_COLUMN_CLASS = "datagrid-hidden-column";
const PINNED_COLUMN_CLASS = "datagrid-pinned-column";
var DatagridFilterRegistrar = class DatagridFilterRegistrar {
	constructor(filters) {
		this.filters = filters;
	}
	get filter() {
		return this.registered && this.registered.filter;
	}
	ngOnDestroy() {
		this.deleteFilter();
	}
	setFilter(filter) {
		this.deleteFilter();
		if (filter instanceof RegisteredFilter) this.registered = filter;
		else if (filter) this.registered = this.filters.add(filter);
	}
	deleteFilter() {
		if (this.registered) {
			this.registered.unregister();
			delete this.registered;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridFilterRegistrar,
			deps: [{ token: FiltersProvider }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridFilterRegistrar,
			isStandalone: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridFilterRegistrar,
	decorators: [{ type: Directive }],
	ctorParameters: () => [{ type: FiltersProvider }]
});
var WrappedColumn = class WrappedColumn {
	ngAfterViewInit() {
		this.columnView = this.templateRef.createEmbeddedView(null);
	}
	ngOnDestroy() {
		this.columnView.destroy();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WrappedColumn,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: WrappedColumn,
			isStandalone: false,
			selector: "dg-wrapped-column",
			viewQueries: [{
				propertyName: "templateRef",
				first: true,
				predicate: ["columnPortal"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WrappedColumn,
	decorators: [{
		type: Component,
		args: [{
			selector: "dg-wrapped-column",
			template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: { templateRef: [{
		type: ViewChild,
		args: ["columnPortal"]
	}] }
});
var DetailService = class DetailService {
	constructor(modalStackService) {
		this.modalStackService = modalStackService;
		this.detailWidth = 66;
		this.registeredPanes = 0;
		this.preventScroll = false;
		this.toggleState = false;
		this._enabled = signal(false, ...ngDevMode ? [{ debugName: "_enabled" }] : /* istanbul ignore next */ []);
		this._state = new BehaviorSubject(this.toggleState);
	}
	get enabled() {
		return this._enabled();
	}
	set enabled(state) {
		this._enabled.set(state);
	}
	get preventFocusScroll() {
		return this.preventScroll;
	}
	set preventFocusScroll(preventScroll) {
		this.preventScroll = preventScroll;
	}
	get state() {
		return this.cache;
	}
	get stateChange() {
		return this._state.asObservable();
	}
	get isOpen() {
		return this.toggleState === true;
	}
	register() {
		this.registeredPanes++;
		this.enabled = true;
		let registered = true;
		return () => {
			if (!registered) return;
			registered = false;
			if (--this.registeredPanes === 0) {
				this.enabled = false;
				if (this.isOpen) this.close();
				this.cache = void 0;
				this.button = null;
			}
		};
	}
	open(item, button) {
		this.cache = item;
		this.button = button;
		this.toggleState = true;
		this._state.next(this.toggleState);
		this.modalStackService.trackModalOpen(this);
	}
	close() {
		this.toggleState = false;
		this.returnFocus();
		this._state.next(this.toggleState);
		this.modalStackService.trackModalClose(this);
	}
	returnFocus() {
		if (this.button) {
			this.button.focus({ preventScroll: this.preventFocusScroll });
			this.button = null;
		}
	}
	toggle(item, button) {
		if (this.isRowOpen(item) || !item) this.close();
		else this.open(item, button);
	}
	isRowOpen(item) {
		return !!(this.toggleState && this.cache === item);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DetailService,
			deps: [{ token: i1$1.ModalStackService }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DetailService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DetailService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: i1$1.ModalStackService }]
});
var ColumnsService = class ColumnsService {
	constructor() {
		this.columns = [];
		this.columnsStateChange = new BehaviorSubject(null);
		this._cache = [];
	}
	get columnStates() {
		return this.columns.map((column) => column.value);
	}
	get hasHideableColumns() {
		return this.columnStates.filter((state) => state.hideable).length > 0;
	}
	get visibleColumns() {
		return this.columnStates.filter((state) => !state.hidden);
	}
	get hasPinnedColumns() {
		return this.columnStates.some((state) => state.pinned);
	}
	isPinned(columnIndex) {
		return !!this.columns[columnIndex]?.value.pinned;
	}
	cache() {
		this._cache = this.columns.map((subject) => {
			const value = { ...subject.value };
			delete value.changes;
			return value;
		});
	}
	hasCache() {
		return !!this._cache.length;
	}
	resetToLastCache() {
		this._cache.forEach((state, index) => {
			const cachedState = {
				...state,
				changes: ALL_COLUMN_CHANGES
			};
			this.columns[index].next(cachedState);
			this.columnsStateChange.next(cachedState);
		});
		this._cache = [];
	}
	emitStateChangeAt(columnIndex, diff) {
		if (!this.columns[columnIndex]) return;
		this.emitStateChange(this.columns[columnIndex], diff);
	}
	emitStateChange(column, diff) {
		const changedState = {
			...column.value,
			...diff
		};
		column.next(changedState);
		this.columnsStateChange.next(changedState);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnsService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnsService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnsService,
	decorators: [{ type: Injectable }]
});
var DatagridRenderStep;
(function(DatagridRenderStep) {
	DatagridRenderStep[DatagridRenderStep["ALIGN_COLUMNS"] = 0] = "ALIGN_COLUMNS";
	DatagridRenderStep[DatagridRenderStep["CALCULATE_MODE_ON"] = 1] = "CALCULATE_MODE_ON";
	DatagridRenderStep[DatagridRenderStep["CALCULATE_MODE_OFF"] = 2] = "CALCULATE_MODE_OFF";
	DatagridRenderStep[DatagridRenderStep["CLEAR_WIDTHS"] = 3] = "CLEAR_WIDTHS";
	DatagridRenderStep[DatagridRenderStep["COMPUTE_COLUMN_WIDTHS"] = 4] = "COMPUTE_COLUMN_WIDTHS";
})(DatagridRenderStep || (DatagridRenderStep = {}));
var DatagridRenderOrganizer = class DatagridRenderOrganizer {
	constructor() {
		this._renderStep = new Subject();
		this.alreadySized = false;
	}
	get renderStep() {
		return this._renderStep.asObservable();
	}
	filterRenderSteps(step) {
		return this.renderStep.pipe(filter((testStep) => step === testStep));
	}
	resize() {
		this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_ON);
		if (this.alreadySized) this._renderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
		this._renderStep.next(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS);
		this._renderStep.next(DatagridRenderStep.ALIGN_COLUMNS);
		this.alreadySized = true;
		this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_OFF);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridRenderOrganizer,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridRenderOrganizer
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridRenderOrganizer,
	decorators: [{ type: Injectable }]
});
const MIN_COLUMN_WIDTH = 96;
var ColumnResizerService = class ColumnResizerService {
	constructor(el, domAdapter, organizer) {
		this.el = el;
		this.domAdapter = domAdapter;
		this.organizer = organizer;
		this._resizedBy = 0;
	}
	get resizedBy() {
		return this._resizedBy;
	}
	get minColumnWidth() {
		return this.domAdapter.minWidth(this.el.nativeElement) || MIN_COLUMN_WIDTH;
	}
	get maxResizeRange() {
		return this.widthBeforeResize - this.minColumnWidth;
	}
	get widthAfterResize() {
		return this.widthBeforeResize + this._resizedBy;
	}
	startResize() {
		this._resizedBy = 0;
		this.isWithinMaxResizeRange = true;
		this.widthBeforeResize = this.domAdapter.clientRect(this.el.nativeElement).width;
	}
	endResize() {
		this.organizer.resize();
	}
	calculateResize(resizedBy) {
		if (resizedBy < -this.maxResizeRange) {
			this._resizedBy = -this.maxResizeRange;
			this.isWithinMaxResizeRange = false;
		} else {
			this._resizedBy = resizedBy;
			this.isWithinMaxResizeRange = true;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnResizerService,
			deps: [
				{ token: i0.ElementRef },
				{ token: i1.DomAdapter },
				{ token: DatagridRenderOrganizer }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnResizerService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnResizerService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i1.DomAdapter },
		{ type: DatagridRenderOrganizer }
	]
});
var TableSizeService = class TableSizeService {
	constructor(platformId) {
		this.platformId = platformId;
	}
	get tableRef() {
		return this._tableRef;
	}
	set tableRef(element) {
		this._tableRef = element;
	}
	set table(table) {
		if (isPlatformBrowser(this.platformId) && table.nativeElement) this.tableRef = table.nativeElement.querySelector(".datagrid-table");
	}
	getColumnDragHeight() {
		if (!this.tableRef) return null;
		return `${this.tableRef.clientHeight}px`;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TableSizeService,
			deps: [{ token: PLATFORM_ID }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: TableSizeService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: TableSizeService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{
		type: void 0,
		decorators: [{
			type: Inject,
			args: [PLATFORM_ID]
		}]
	}]
});
const KEYBOARD_RESIZE_LENGTH = 12;
var ClrDatagridColumnSeparator = class ClrDatagridColumnSeparator {
	constructor(columnResizerService, renderer, ngZone, tableSizeService, commonString, document) {
		this.columnResizerService = columnResizerService;
		this.renderer = renderer;
		this.ngZone = ngZone;
		this.tableSizeService = tableSizeService;
		this.commonString = commonString;
		this.document = document;
		this.columnSeparatorId = uniqueIdFactory();
		this.resizeStartedOnKeyDown = false;
		this.unlisteners = [];
	}
	get descriptionId() {
		return `${this.columnSeparatorId}-aria-describedby`;
	}
	get resizeTrackerEl() {
		return this.resizeTrackerRef.nativeElement;
	}
	get columnHandleEl() {
		return this.columnHandleRef.nativeElement;
	}
	ngAfterViewInit() {
		this.ngZone.runOutsideAngular(() => {
			this.unlisteners.push(this.renderer.listen(this.columnHandleEl, "keydown", (event) => {
				this.showTrackerOnFirstKeyDown(event);
				this.moveTrackerOnKeyDown(event);
			}));
			this.unlisteners.push(this.renderer.listen(this.columnHandleEl, "keyup", (event) => {
				this.hideTrackerOnKeyUp(event);
			}));
		});
	}
	ngOnDestroy() {
		this.unlisteners.forEach((unlistener) => unlistener());
	}
	showTracker() {
		this.columnResizerService.startResize();
		const tableHeight = this.tableSizeService.getColumnDragHeight();
		this.renderer.setStyle(this.resizeTrackerEl, "height", tableHeight);
		this.renderer.setStyle(this.resizeTrackerEl, "display", "block");
	}
	moveTracker(movedBy) {
		this.columnResizerService.calculateResize(movedBy);
		this.renderer.setStyle(this.resizeTrackerEl, "transform", `translateX(${this.columnResizerService.resizedBy}px)`);
		this.renderer.setStyle(this.document.body, "cursor", "col-resize");
		this.redFlagTracker();
	}
	hideTracker() {
		this.columnResizerService.endResize();
		this.renderer.setStyle(this.resizeTrackerEl, "display", "none");
		this.renderer.setStyle(this.resizeTrackerEl, "transform", `translateX(0px)`);
		this.renderer.setStyle(this.columnHandleEl, "transform", `translateX(0px)`);
		this.renderer.setStyle(this.document.body, "cursor", "auto");
	}
	showTrackerOnFirstKeyDown(event) {
		if (!this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
			this.resizeStartedOnKeyDown = true;
			this.renderer.addClass(this.resizeTrackerEl, "on-arrow-key-resize");
			this.showTracker();
		}
	}
	moveTrackerOnKeyDown(event) {
		if (this.isArrowLeftKeyEvent(event)) {
			event.stopPropagation();
			this.moveTracker(this.columnResizerService.resizedBy - KEYBOARD_RESIZE_LENGTH);
		} else if (this.isArrowRightKeyEvent(event)) {
			event.stopPropagation();
			this.moveTracker(this.columnResizerService.resizedBy + KEYBOARD_RESIZE_LENGTH);
		}
	}
	hideTrackerOnKeyUp(event) {
		if (this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
			this.resizeStartedOnKeyDown = false;
			this.renderer.removeClass(this.resizeTrackerEl, "on-arrow-key-resize");
			this.hideTracker();
			this.columnHandleEl.focus();
		}
	}
	redFlagTracker() {
		if (this.isWithinMaxResizeRange !== this.columnResizerService.isWithinMaxResizeRange) {
			this.isWithinMaxResizeRange = this.columnResizerService.isWithinMaxResizeRange;
			if (!this.isWithinMaxResizeRange) this.renderer.addClass(this.resizeTrackerEl, "exceeded-max");
			else this.renderer.removeClass(this.resizeTrackerEl, "exceeded-max");
		}
	}
	isArrowLeftKeyEvent(event) {
		return event.key === Keys.ArrowLeft;
	}
	isArrowRightKeyEvent(event) {
		return event.key === Keys.ArrowRight;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumnSeparator,
			deps: [
				{ token: ColumnResizerService },
				{ token: i0.Renderer2 },
				{ token: i0.NgZone },
				{ token: TableSizeService },
				{ token: i1.ClrCommonStringsService },
				{ token: DOCUMENT }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridColumnSeparator,
			isStandalone: false,
			selector: "clr-dg-column-separator",
			host: { properties: { "class.datagrid-column-separator": "true" } },
			viewQueries: [{
				propertyName: "resizeTrackerRef",
				first: true,
				predicate: ["resizeTracker"],
				descendants: true
			}, {
				propertyName: "columnHandleRef",
				first: true,
				predicate: ["columnHandle"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    <button
      type="button"
      class="datagrid-column-handle"
      [attr.aria-label]="commonString.keys.columnSeparatorAriaLabel"
      [attr.aria-describedby]="descriptionId"
      cdkDrag
      cdkDragLockAxis="x"
      (cdkDragStarted)="showTracker()"
      (cdkDragMoved)="moveTracker($event.distance.x)"
      (cdkDragEnded)="hideTracker(); $event.source._dragRef.reset()"
      #columnHandle
    ></button>
    <span class="clr-sr-only" [attr.id]="descriptionId">
      {{ commonString.keys.columnSeparatorDescription }}
    </span>
    <div class="datagrid-column-resize-tracker" #resizeTracker></div>
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i1.CdkDragModule_CdkDrag,
				selector: "[cdkDrag]"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridColumnSeparator,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-column-separator",
			template: `
    <button
      type="button"
      class="datagrid-column-handle"
      [attr.aria-label]="commonString.keys.columnSeparatorAriaLabel"
      [attr.aria-describedby]="descriptionId"
      cdkDrag
      cdkDragLockAxis="x"
      (cdkDragStarted)="showTracker()"
      (cdkDragMoved)="moveTracker($event.distance.x)"
      (cdkDragEnded)="hideTracker(); $event.source._dragRef.reset()"
      #columnHandle
    ></button>
    <span class="clr-sr-only" [attr.id]="descriptionId">
      {{ commonString.keys.columnSeparatorDescription }}
    </span>
    <div class="datagrid-column-resize-tracker" #resizeTracker></div>
  `,
			host: { "[class.datagrid-column-separator]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: ColumnResizerService },
		{ type: i0.Renderer2 },
		{ type: i0.NgZone },
		{ type: TableSizeService },
		{ type: i1.ClrCommonStringsService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		}
	],
	propDecorators: {
		resizeTrackerRef: [{
			type: ViewChild,
			args: ["resizeTracker"]
		}],
		columnHandleRef: [{
			type: ViewChild,
			args: ["columnHandle"]
		}]
	}
});
var DefaultKeyNavigationStrategy = class {
	constructor(utils) {
		this.utils = utils;
	}
	keyUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (currentCellCoords.y === 0) return nextCellCoords;
		nextCellCoords.y = currentCellCoords.y - 1;
		const isActionCell = this.utils.isActionCell(currentCellCoords);
		if (this.utils.isSingleCellExpandedRow(nextCellCoords.y) && !isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = 0;
		else if (this.utils.isDetailsRow(nextCellCoords.y)) {
			if (isActionCell) nextCellCoords.y = nextCellCoords.y - 1;
			else nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		}
		return nextCellCoords;
	}
	keyDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		if (currentCellCoords.y >= numOfRows) return nextCellCoords;
		const isActionCell = this.utils.isActionCell(currentCellCoords);
		nextCellCoords.y = currentCellCoords.y + 1;
		if (!isActionCell && this.utils.isRowReplaced(nextCellCoords.y)) {
			nextCellCoords.y = nextCellCoords.y + 1;
			nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y) ? 0 : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		}
		return nextCellCoords;
	}
	keyLeft(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (currentCellCoords.x === 0) return nextCellCoords;
		nextCellCoords.x = currentCellCoords.x - 1;
		return nextCellCoords;
	}
	keyRight(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;
		nextCellCoords.x = currentCellCoords.x < numOfColumns ? nextCellCoords.x + 1 : nextCellCoords.x;
		return nextCellCoords;
	}
	keyEnd(currentCellCoords, ctrlKey) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		nextCellCoords.x = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;
		if (ctrlKey) {
			nextCellCoords.y = numOfRows;
			if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = this.utils.getCellsForRow(nextCellCoords.y).length - 1;
		}
		return nextCellCoords;
	}
	keyHome(currentCellCoords, ctrlKey) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		nextCellCoords.x = 0;
		if (ctrlKey) nextCellCoords.y = 0;
		return nextCellCoords;
	}
	keyPageUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y) ? 0 : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
			else if (this.utils.isRowReplaced(nextCellCoords.y)) {
				nextCellCoords.y = nextCellCoords.y + 1;
				nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y) ? 0 : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
			}
		} else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
	keyPageDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
		if (this.utils.isActionCell(currentCellCoords) && this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		else if (this.utils.isDetailsRow(nextCellCoords.y) && this.utils.isSingleCellExpandedRow(nextCellCoords.y)) nextCellCoords.x = 0;
		else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		else if (this.utils.isRowReplaced(nextCellCoords.y)) {
			nextCellCoords.y = nextCellCoords.y + 1;
			nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y) ? 0 : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		}
		return nextCellCoords;
	}
};
var ExpandedRowKeyNavigationStrategy = class extends DefaultKeyNavigationStrategy {
	keyUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (currentCellCoords.y === 0) return nextCellCoords;
		nextCellCoords.y = currentCellCoords.y - 1;
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(currentCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
			switch (true) {
				case this.utils.isDetailsRow(nextCellCoords.y):
					nextCellCoords.x = 0;
					break;
				case this.utils.isDetailsRow(currentCellCoords.y) === false:
					nextCellCoords.x = currentCellCoords.x;
					break;
				default: nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
			}
		} else if (this.utils.isDetailsRow(nextCellCoords.y) && nextCellCoords.y > 0) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
	keyDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		if (currentCellCoords.y >= numOfRows) return nextCellCoords;
		nextCellCoords.y = currentCellCoords.y + 1;
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y + 1;
			if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = 0;
			else nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
		} else nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y;
		return nextCellCoords;
	}
	keyLeft(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) return super.keyLeft(currentCellCoords);
		if (currentCellCoords.x !== 0) nextCellCoords.x = currentCellCoords.x - 1;
		else if (!this.utils.isActionCell(currentCellCoords)) {
			nextCellCoords.y = currentCellCoords.y - 1;
			nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y) - 1;
		}
		return nextCellCoords;
	}
	keyRight(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) return super.keyRight(currentCellCoords);
		const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;
		if (currentCellCoords.x >= numOfColumns) return nextCellCoords;
		if (this.utils.isActionCell(currentCellCoords) && currentCellCoords.x === this.utils.actionCellCount(currentCellCoords.x) - 1 && this.utils.isRowReplaced(currentCellCoords.y) && !this.utils.isDetailsRow(currentCellCoords.y)) {
			nextCellCoords.y = currentCellCoords.y + 1;
			nextCellCoords.x = 0;
		} else nextCellCoords.x = currentCellCoords.x + 1;
		return nextCellCoords;
	}
	keyEnd(currentCellCoords, ctrlKey) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y) || ctrlKey) return super.keyEnd(currentCellCoords, ctrlKey);
		nextCellCoords.x = this.utils.getCellsForRow(currentCellCoords.y).length - 1;
		return nextCellCoords;
	}
	keyHome(currentCellCoords, ctrlKey) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) return super.keyHome(currentCellCoords, ctrlKey);
		nextCellCoords.x = 0;
		nextCellCoords.y = currentCellCoords.y - 1;
		if (ctrlKey) nextCellCoords.y = 0;
		return nextCellCoords;
	}
	keyPageUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y)) {
				if (!this.utils.isDetailsRow(nextCellCoords.y)) {
					nextCellCoords.y = nextCellCoords.y + 1;
					nextCellCoords.x = 0;
				}
			} else if (!this.utils.isDetailsRow(currentCellCoords.y)) {
				if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = 0;
			} else if (this.utils.isDetailsRow(currentCellCoords.y)) {
				if (!this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
			}
		} else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
	keyPageDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y)) {
				if (nextCellCoords.y < numOfRows && !this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y + 1;
			} else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
			else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = 0;
		} else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
};
var ExpandedColumnsRowKeyNavigationStrategy = class extends ExpandedRowKeyNavigationStrategy {
	keyUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		if (currentCellCoords.y === 0) return nextCellCoords;
		nextCellCoords.y = currentCellCoords.y - 1;
		if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) return super.keyUp(currentCellCoords);
		const isActionCell = this.utils.isActionCell(currentCellCoords);
		if (isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		else if (this.utils.isRowReplaced(nextCellCoords.y)) {
			nextCellCoords.y = nextCellCoords.y - 1;
			if (!this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
		} else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
		else if (!isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		return nextCellCoords;
	}
	keyDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		const numOfColumns = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;
		if (currentCellCoords.y >= numOfRows) return nextCellCoords;
		nextCellCoords.y = currentCellCoords.y + 1;
		if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) return super.keyDown(currentCellCoords);
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
			else if (this.utils.getCellsForRow(currentCellCoords.y).length > numOfColumns) nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
			else nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
		} else nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
		return nextCellCoords;
	}
	keyLeft(currentCellCoords) {
		return super.keyLeft(currentCellCoords);
	}
	keyRight(currentCellCoords) {
		return super.keyRight(currentCellCoords);
	}
	keyEnd(currentCellCoords, ctrlKey) {
		return super.keyEnd(currentCellCoords, ctrlKey);
	}
	keyHome(currentCellCoords, ctrlKey) {
		return super.keyHome(currentCellCoords, ctrlKey);
	}
	keyPageUp(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
		if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) return super.keyPageUp(currentCellCoords);
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y)) {
				if (!this.utils.isDetailsRow(nextCellCoords.y)) {
					nextCellCoords.y = nextCellCoords.y + 1;
					nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
				}
			} else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
			else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		} else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
	keyPageDown(currentCellCoords) {
		const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
		const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
		const itemsPerPage = this.utils.itemsPerPage;
		nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
		if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) return super.keyPageDown(currentCellCoords);
		if (!this.utils.isActionCell(currentCellCoords)) {
			if (this.utils.isRowReplaced(nextCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
				if (nextCellCoords.y < numOfRows) {
					nextCellCoords.y = nextCellCoords.y + 1;
					nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
				}
			} else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
			else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
		} else if (this.utils.isDetailsRow(nextCellCoords.y)) nextCellCoords.y = nextCellCoords.y - 1;
		return nextCellCoords;
	}
};
var KeyNavigationUtils = class {
	constructor(host, config) {
		this.host = host;
		this.config = config;
	}
	get grid() {
		return this.host?.querySelector(this.config.keyGrid);
	}
	get rows() {
		return this.host?.querySelectorAll(this.config.keyGridRows);
	}
	get cells() {
		return this.host?.querySelectorAll(this.config.keyGridCells);
	}
	get currentCellCoordinates() {
		const currentCell = this.cells ? Array.from(this.cells).find((i) => i.getAttribute("tabindex") === "0") : null;
		const currentRow = currentCell ? currentCell.closest(this.config.keyGridRows) : null;
		return {
			x: currentRow && currentCell ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell) : 0,
			y: currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0
		};
	}
	get averageRowHeight() {
		const heightSum = Array.from(this.rows.values()).reduce((sum, row) => {
			return sum + row.clientHeight;
		}, 0);
		return Math.round(heightSum / this.rows.length);
	}
	get itemsPerPage() {
		return Math.floor(this.host?.querySelector(".datagrid").clientHeight / this.averageRowHeight) - 1 || 0;
	}
	setAriaRowIndexTo(cellCoords) {
		let ariaRowIndex = this.rows[cellCoords.y].getAttribute("aria-rowindex");
		if (!ariaRowIndex) ariaRowIndex = this.rows[cellCoords.y - 1].getAttribute("aria-rowindex");
		cellCoords.ariaRowIndex = ariaRowIndex;
	}
	getNextItemCoordinate(e) {
		const currentCellCoords = this.currentCellCoordinates;
		const strategy = this.getNavStrategy(currentCellCoords);
		const inlineStart = this.host.dir === "rtl" ? Keys.ArrowRight : Keys.ArrowLeft;
		const inlineEnd = this.host.dir === "rtl" ? Keys.ArrowLeft : Keys.ArrowRight;
		switch (e.key) {
			case Keys.ArrowUp: return strategy.keyUp(currentCellCoords);
			case Keys.ArrowDown: return strategy.keyDown(currentCellCoords);
			case inlineStart: return strategy.keyLeft(currentCellCoords);
			case inlineEnd: return strategy.keyRight(currentCellCoords);
			case Keys.Home: return strategy.keyHome(currentCellCoords, e.ctrlKey);
			case Keys.End: return strategy.keyEnd(currentCellCoords, e.ctrlKey);
			case Keys.PageUp: return strategy.keyPageUp(currentCellCoords);
			case Keys.PageDown: return strategy.keyPageDown(currentCellCoords);
			default: return currentCellCoords;
		}
	}
	getCellsForRow(index) {
		return this.rows[index].querySelectorAll(this.config.keyGridCells);
	}
	isExpandedRow(index) {
		const selectedElement = this.rows[index].querySelector(".datagrid-row-detail");
		return selectedElement ? selectedElement.style.display !== "none" : false;
	}
	isDetailsRow(index) {
		return this.rows[index].classList.contains("datagrid-row-detail");
	}
	isRowReplaced(index) {
		return !!this.rows[index].closest("clr-dg-row.datagrid-row-replaced");
	}
	isSingleCellExpandedRow(index) {
		return this.rows[index]?.querySelectorAll(this.config.keyGridCells).length === 1;
	}
	actionCellCount(index) {
		return this.actionCellsAsArray(index).length;
	}
	actionCellsAsArray(index) {
		return Array.from(this.rows[index].querySelectorAll(".datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column"));
	}
	isActionCell(cellCoords) {
		return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
	}
	createNextCellCoords(cellCoords) {
		return {
			x: cellCoords.x,
			y: cellCoords.y
		};
	}
	getNavStrategy(currentCellCoords) {
		switch (true) {
			case this.isSingleCellExpandedRow(currentCellCoords.y): return new ExpandedRowKeyNavigationStrategy(this);
			case this.isDetailsRow(currentCellCoords.y):
			case this.isExpandedRow(currentCellCoords.y): return new ExpandedColumnsRowKeyNavigationStrategy(this);
			default: return new DefaultKeyNavigationStrategy(this);
		}
	}
};
const actionableItemSelectors = [
	"a[href]",
	"area[href]",
	"input:not([disabled])",
	"button:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"iframe",
	"object",
	"embed",
	"[contenteditable=true]",
	"[role=button]:not([disabled])"
];
function getTabbableItems(el) {
	const tabbableSelector = [...actionableItemSelectors, "[tabindex=\"0\"]:not([disabled])"].join(",");
	return Array.from(el.querySelectorAll(tabbableSelector));
}
function isActionableItem(el) {
	const actionableSelector = actionableItemSelectors.join(",");
	return el.matches(actionableSelector);
}
var KeyNavigationGridController = class KeyNavigationGridController {
	constructor(zone) {
		this.zone = zone;
		this.nextCellCoordsEmitter = new EventEmitter(false);
		this.skipItemFocus = false;
		this.preventScrollOnFocus = false;
		this.config = {
			keyGridRows: "[role=row]:not(.datagrid-placeholder):not([style*=\"display: none\"])",
			keyGridCells: "[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret",
			keyGrid: "[role=grid], [role=treegrid]"
		};
		this.listenersAdded = false;
		this.destroy$ = new Subject();
	}
	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
	addListeners() {
		if (this.listenersAdded) return;
		this.zone.runOutsideAngular(() => {
			fromEvent(this.keyNavUtils.grid, "mousedown").pipe(takeUntil(this.destroy$)).subscribe((e) => {
				if (e.buttons === 1 && !e.ctrlKey) {
					const activeCell = this.keyNavUtils.cells ? Array.from(this.keyNavUtils.cells).find((c) => c === e.target || c === e.target.closest(this.config.keyGridCells)) : null;
					if (activeCell) {
						this.setActiveCell(activeCell);
						if (!isActionableItem(e.target)) this.focusElement(activeCell);
					}
				}
			});
			fromEvent(this.keyNavUtils.grid, "wheel").pipe(takeUntil(this.destroy$)).subscribe(() => {
				this.nextCellCoordsEmitter.emit(null);
			});
			fromEvent(this.keyNavUtils.grid, "keydown").pipe(takeUntil(this.destroy$)).subscribe((e) => {
				if (e.target.classList.contains("drag-handle") && (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight)) return;
				if (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown || e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight || e.key === Keys.End || e.key === Keys.Home || e.key === Keys.PageUp || e.key === Keys.PageDown) {
					const nextCellCoords = this.keyNavUtils.getNextItemCoordinate(e);
					if (nextCellCoords.y > 0 && (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown || e.key === Keys.PageUp || e.key === Keys.PageDown)) {
						this.keyNavUtils.setAriaRowIndexTo(nextCellCoords);
						this.nextCellCoordsEmitter.emit(nextCellCoords);
					}
					const activeItem = this.keyNavUtils.rows ? Array.from(this.keyNavUtils.getCellsForRow(nextCellCoords.y))[nextCellCoords.x] : null;
					if (activeItem) {
						this.setActiveCell(activeItem);
						this.focusElement(activeItem, { preventScroll: this.preventScrollOnFocus && !!nextCellCoords.ariaRowIndex });
					}
					e.preventDefault();
				}
			});
		});
		this.listenersAdded = true;
	}
	initializeKeyGrid(host) {
		this.keyNavUtils = new KeyNavigationUtils(host, this.config);
		this.addListeners();
		this.resetKeyGrid();
	}
	resetKeyGrid() {
		this.keyNavUtils.cells?.forEach((i) => i.setAttribute("tabindex", "-1"));
		(this.keyNavUtils.cells ? this.keyNavUtils.cells[0] : null)?.setAttribute("tabindex", "0");
	}
	setActiveCell(activeCell) {
		const prior = this.keyNavUtils.cells ? Array.from(this.keyNavUtils.cells).find((c) => c.getAttribute("tabindex") === "0") : null;
		if (prior) prior.setAttribute("tabindex", "-1");
		activeCell.setAttribute("tabindex", "0");
	}
	focusElement(activeCell, options = { preventScroll: false }) {
		if (this.skipItemFocus) return;
		let elementToFocus;
		if (activeCell.getAttribute("role") === "columnheader") elementToFocus = activeCell;
		else {
			const tabbableElements = getTabbableItems(activeCell);
			elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
		}
		elementToFocus.focus(options);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: KeyNavigationGridController,
			deps: [{ token: i0.NgZone }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: KeyNavigationGridController
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: KeyNavigationGridController,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: i0.NgZone }]
});
var ClrDatagridFilter = class ClrDatagridFilter extends DatagridFilterRegistrar {
	constructor(_filters, commonStrings, popoverService, keyNavigation, columnActions) {
		super(_filters);
		this.commonStrings = commonStrings;
		this.popoverService = popoverService;
		this.keyNavigation = keyNavigation;
		this.columnActions = columnActions;
		this.openChange = new EventEmitter(false);
		this.ariaExpanded = false;
		this.popoverId = uniqueIdFactory();
		this.popoverPosition = ClrPopoverPosition.BOTTOM_RIGHT;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.subs = [];
		this.subs.push(popoverService.openChange.subscribe((change) => {
			this.ariaExpanded = change;
			this.openChange.emit(change);
			if (keyNavigation) keyNavigation.skipItemFocus = change;
		}));
		columnActions?.filter.set(this);
	}
	get open() {
		return this.popoverService.open;
	}
	set open(open) {
		if (this.popoverService.open !== open) {
			this.popoverService.open = open;
			this.openChange.emit(open);
		}
	}
	set customFilter(filter) {
		this.setFilter(filter);
	}
	get active() {
		return !!this.filter && this.filter.isActive();
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.subs.forEach((sub) => sub.unsubscribe());
		if (this.columnActions?.filter() === this) this.columnActions.filter.set(null);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridFilter,
			deps: [
				{ token: FiltersProvider },
				{ token: i1.ClrCommonStringsService },
				{ token: i3$1.ClrPopoverService },
				{
					token: KeyNavigationGridController,
					optional: true
				},
				{
					token: ColumnActionsService,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridFilter,
			isStandalone: false,
			selector: "clr-dg-filter",
			inputs: {
				open: [
					"clrDgFilterOpen",
					"open",
					booleanAttribute
				],
				customFilter: ["clrDgFilter", "customFilter"]
			},
			outputs: { openChange: "clrDgFilterOpenChange" },
			providers: [{
				provide: CustomFilter,
				useExisting: ClrDatagridFilter
			}],
			viewQueries: [{
				propertyName: "anchor",
				first: true,
				predicate: ["anchor"],
				descendants: true,
				read: ElementRef
			}],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <!--
      The toggle stands down when the column has a clr-dg-column-actions menu, which then owns
      opening this filter. Nothing else here changes: the popover is still driven through the
      column's ClrPopoverService, the menu just points its origin at its own trigger instead.
    -->
    @if (columnActions?.filterInHeader() ?? true) {
      <button
        class="datagrid-filter-toggle"
        type="button"
        #anchor
        [attr.aria-expanded]="ariaExpanded"
        [attr.aria-controls]="popoverId"
        clrPopoverOrigin
        clrPopoverOpenCloseButton
        [class.datagrid-filter-open]="open"
        [class.datagrid-filtered]="active"
      >
        <cds-icon
          [status]="active ? 'info' : null"
          [shape]="active ? 'filter-grid-circle' : 'filter-grid'"
          solid
        ></cds-icon>
      </button>
    }

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="open; at: popoverPosition; type: popoverType; outsideClickToClose: true; scrollToClose: false"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridFilterDialogAriaLabel"
    >
      <div class="datagrid-filter-close-wrapper">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i1.CdkTrapFocusModule_CdkTrapFocus,
					selector: "[cdkTrapFocus]"
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: i3$1.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverCloseButton,
					selector: "[clrPopoverCloseButton]",
					outputs: ["clrPopoverOnCloseChange"]
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverOpenCloseButton,
					selector: "[clrPopoverOpenCloseButton]",
					outputs: ["clrPopoverOpenCloseChange"]
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverContent,
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
	type: ClrDatagridFilter,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-filter",
			providers: [{
				provide: CustomFilter,
				useExisting: ClrDatagridFilter
			}],
			template: `
    <!--
      The toggle stands down when the column has a clr-dg-column-actions menu, which then owns
      opening this filter. Nothing else here changes: the popover is still driven through the
      column's ClrPopoverService, the menu just points its origin at its own trigger instead.
    -->
    @if (columnActions?.filterInHeader() ?? true) {
      <button
        class="datagrid-filter-toggle"
        type="button"
        #anchor
        [attr.aria-expanded]="ariaExpanded"
        [attr.aria-controls]="popoverId"
        clrPopoverOrigin
        clrPopoverOpenCloseButton
        [class.datagrid-filter-open]="open"
        [class.datagrid-filtered]="active"
      >
        <cds-icon
          [status]="active ? 'info' : null"
          [shape]="active ? 'filter-grid-circle' : 'filter-grid'"
          solid
        ></cds-icon>
      </button>
    }

    <div
      class="datagrid-filter"
      [id]="popoverId"
      cdkTrapFocus
      *clrPopoverContent="open; at: popoverPosition; type: popoverType; outsideClickToClose: true; scrollToClose: false"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridFilterDialogAriaLabel"
    >
      <div class="datagrid-filter-close-wrapper">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: FiltersProvider },
		{ type: i1.ClrCommonStringsService },
		{ type: i3$1.ClrPopoverService },
		{
			type: KeyNavigationGridController,
			decorators: [{ type: Optional }]
		},
		{
			type: ColumnActionsService,
			decorators: [{ type: Optional }]
		}
	],
	propDecorators: {
		openChange: [{
			type: Output,
			args: ["clrDgFilterOpenChange"]
		}],
		anchor: [{
			type: ViewChild,
			args: ["anchor", { read: ElementRef }]
		}],
		open: [{
			type: Input,
			args: [{
				alias: "clrDgFilterOpen",
				transform: booleanAttribute
			}]
		}],
		customFilter: [{
			type: Input,
			args: ["clrDgFilter"]
		}]
	}
});
var DatagridNumericFilter = class DatagridNumericFilter extends DatagridFilterRegistrar {
	constructor(filters, domAdapter, commonStrings, popoverService, ngZone) {
		super(filters);
		this.domAdapter = domAdapter;
		this.commonStrings = commonStrings;
		this.popoverService = popoverService;
		this.ngZone = ngZone;
		this.filterValueChange = new EventEmitter();
		this.open = false;
		this.subscriptions = [];
	}
	get value() {
		return [this.filter.low, this.filter.high];
	}
	set value(values) {
		if (this.filter && Array.isArray(values)) {
			if (values && (values[0] !== this.filter.low || values[1] !== this.filter.high)) {
				if (typeof values[0] === "number") this.filter.low = values[0];
				else this.filter.low = null;
				if (typeof values[1] === "number") this.filter.high = values[1];
				else this.filter.high = null;
				this.filterValueChange.emit(values);
			}
		} else this.initFilterValues = values;
	}
	set customNumericFilter(value) {
		if (value instanceof RegisteredFilter) this.setFilter(value);
		else this.setFilter(new DatagridNumericFilterImpl(value));
		if (this.initFilterValues) {
			this.value = this.initFilterValues;
			delete this.initFilterValues;
		}
	}
	get maxPlaceholderValue() {
		return this.maxPlaceholder || this.commonStrings.keys.maxValue;
	}
	get minPlaceholderValue() {
		return this.minPlaceholder || this.commonStrings.keys.minValue;
	}
	get fromLabelValue() {
		return this.fromLabel || this.commonStrings.keys.fromLabel;
	}
	get toLabelValue() {
		return this.toLabel || this.commonStrings.keys.toLabel;
	}
	get low() {
		if (typeof this.filter.low === "number" && isFinite(this.filter.low)) return this.filter.low;
		else return null;
	}
	set low(low) {
		if (typeof low === "number" && low !== this.filter.low) {
			this.filter.low = low;
			this.filterValueChange.emit([this.filter.low, this.filter.high]);
		} else if (typeof low !== "number") {
			this.filter.low = null;
			this.filterValueChange.emit([this.filter.low, this.filter.high]);
		}
	}
	get high() {
		if (typeof this.filter.high === "number" && isFinite(this.filter.high)) return this.filter.high;
		else return null;
	}
	set high(high) {
		if (typeof high === "number" && high !== this.filter.high) {
			this.filter.high = high;
			this.filterValueChange.emit([this.filter.low, this.filter.high]);
		} else if (typeof high !== "number") {
			this.filter.high = null;
			this.filterValueChange.emit([this.filter.low, this.filter.high]);
		}
	}
	ngAfterViewInit() {
		this.subscriptions.push(this.popoverService.openChange.subscribe((openChange) => {
			this.open = openChange;
			this.ngZone.runOutsideAngular(() => {
				requestAnimationFrame(() => {
					this.domAdapter.focus(this.input.nativeElement);
				});
			});
		}));
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.subscriptions.forEach((sub) => {
			sub.unsubscribe();
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridNumericFilter,
			deps: [
				{ token: FiltersProvider },
				{ token: i1.DomAdapter },
				{ token: i1.ClrCommonStringsService },
				{ token: i3$1.ClrPopoverService },
				{ token: i0.NgZone }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridNumericFilter,
			isStandalone: false,
			selector: "clr-dg-numeric-filter",
			inputs: {
				minPlaceholder: ["clrFilterMinPlaceholder", "minPlaceholder"],
				maxPlaceholder: ["clrFilterMaxPlaceholder", "maxPlaceholder"],
				fromLabel: ["clrFilterFromLabel", "fromLabel"],
				toLabel: ["clrFilterToLabel", "toLabel"],
				value: ["clrFilterValue", "value"],
				customNumericFilter: ["clrDgNumericFilter", "customNumericFilter"]
			},
			outputs: { filterValueChange: "clrFilterValueChange" },
			providers: [{
				provide: CustomFilter,
				useExisting: DatagridNumericFilter
			}],
			viewQueries: [{
				propertyName: "input",
				first: true,
				predicate: ["input_low"],
				descendants: true
			}, {
				propertyName: "filterContainer",
				first: true,
				predicate: ClrDatagridFilter,
				descendants: true
			}],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <div class="datagrid-numeric-filter-form">
        <clr-number-input-container>
          <label class="clr-control-label">{{ fromLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_low
            type="number"
            autocomplete="off"
            name="low"
            [(ngModel)]="low"
            [placeholder]="minPlaceholderValue"
            [attr.aria-label]="minPlaceholderValue"
          />
        </clr-number-input-container>
        <clr-number-input-container>
          <label class="clr-control-label">{{ toLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_high
            type="number"
            autocomplete="off"
            name="high"
            [(ngModel)]="high"
            [placeholder]="maxPlaceholderValue"
            [attr.aria-label]="maxPlaceholderValue"
          />
        </clr-number-input-container>
      </div>
    </clr-dg-filter>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i5$1.ClrNumberInput,
					selector: "input[type=\"number\"][clrNumberInput]"
				},
				{
					kind: "component",
					type: i5$1.ClrNumberInputContainer,
					selector: "clr-number-input-container"
				},
				{
					kind: "directive",
					type: i6$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i6$1.NumberValueAccessor,
					selector: "input[type=number]:not([ngNoCva])[formControlName],input[type=number]:not([ngNoCva])[formControl],input[type=number]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
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
					type: ClrDatagridFilter,
					selector: "clr-dg-filter",
					inputs: ["clrDgFilterOpen", "clrDgFilter"],
					outputs: ["clrDgFilterOpenChange"]
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
	type: DatagridNumericFilter,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-numeric-filter",
			providers: [{
				provide: CustomFilter,
				useExisting: DatagridNumericFilter
			}],
			template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <div class="datagrid-numeric-filter-form">
        <clr-number-input-container>
          <label class="clr-control-label">{{ fromLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_low
            type="number"
            autocomplete="off"
            name="low"
            [(ngModel)]="low"
            [placeholder]="minPlaceholderValue"
            [attr.aria-label]="minPlaceholderValue"
          />
        </clr-number-input-container>
        <clr-number-input-container>
          <label class="clr-control-label">{{ toLabelValue }}</label>
          <input
            clrNumberInput
            class="datagrid-numeric-filter-input"
            #input_high
            type="number"
            autocomplete="off"
            name="high"
            [(ngModel)]="high"
            [placeholder]="maxPlaceholderValue"
            [attr.aria-label]="maxPlaceholderValue"
          />
        </clr-number-input-container>
      </div>
    </clr-dg-filter>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: FiltersProvider },
		{ type: i1.DomAdapter },
		{ type: i1.ClrCommonStringsService },
		{ type: i3$1.ClrPopoverService },
		{ type: i0.NgZone }
	],
	propDecorators: {
		minPlaceholder: [{
			type: Input,
			args: ["clrFilterMinPlaceholder"]
		}],
		maxPlaceholder: [{
			type: Input,
			args: ["clrFilterMaxPlaceholder"]
		}],
		fromLabel: [{
			type: Input,
			args: ["clrFilterFromLabel"]
		}],
		toLabel: [{
			type: Input,
			args: ["clrFilterToLabel"]
		}],
		filterValueChange: [{
			type: Output,
			args: ["clrFilterValueChange"]
		}],
		input: [{
			type: ViewChild,
			args: ["input_low"]
		}],
		filterContainer: [{
			type: ViewChild,
			args: [ClrDatagridFilter]
		}],
		value: [{
			type: Input,
			args: ["clrFilterValue"]
		}],
		customNumericFilter: [{
			type: Input,
			args: ["clrDgNumericFilter"]
		}]
	}
});
var DatagridStringFilter = class DatagridStringFilter extends DatagridFilterRegistrar {
	constructor(filters, domAdapter, commonStrings, popoverService, elementRef, cdr, ngZone) {
		super(filters);
		this.domAdapter = domAdapter;
		this.commonStrings = commonStrings;
		this.popoverService = popoverService;
		this.elementRef = elementRef;
		this.cdr = cdr;
		this.ngZone = ngZone;
		this.filterValueChange = new EventEmitter();
		this.open = false;
		this.labelValue = "";
		this.subs = [];
	}
	set customStringFilter(value) {
		if (value instanceof RegisteredFilter) this.setFilter(value);
		else this.setFilter(new DatagridStringFilterImpl(value));
		if (this.initFilterValue) {
			this.value = this.initFilterValue;
			delete this.initFilterValue;
		}
	}
	get value() {
		return this.filter.value;
	}
	set value(value) {
		if (this.filter && typeof value === "string") {
			if (!value) value = "";
			if (value !== this.filter.value) {
				this.filter.value = value;
				this.filterValueChange.emit(value);
			}
		} else this.initFilterValue = value;
	}
	get placeholderValue() {
		return this.placeholder || this.commonStrings.keys.filterItems;
	}
	ngAfterViewInit() {
		this.subs.push(this.popoverService.openChange.subscribe((openChange) => {
			this.open = openChange;
			this.ngZone.runOutsideAngular(() => {
				requestAnimationFrame(() => {
					this.domAdapter.focus(this.input.nativeElement);
				});
			});
		}));
	}
	ngOnChanges() {
		setTimeout(() => {
			this.setFilterLabel();
			this.cdr.markForCheck();
		});
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.subs.forEach((sub) => sub.unsubscribe());
	}
	setFilterLabel() {
		if (this.label) {
			this.labelValue = this.label;
			return;
		}
		const columnTitleElement = (this.elementRef.nativeElement?.closest("clr-dg-column"))?.querySelector(".datagrid-column-title");
		this.labelValue = this.commonStrings.parse(this.commonStrings.keys.datagridFilterLabel, { COLUMN: columnTitleElement?.textContent.trim() || "" });
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridStringFilter,
			deps: [
				{ token: FiltersProvider },
				{ token: i1.DomAdapter },
				{ token: i1.ClrCommonStringsService },
				{ token: i3$1.ClrPopoverService },
				{ token: i0.ElementRef },
				{ token: i0.ChangeDetectorRef },
				{ token: i0.NgZone }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridStringFilter,
			isStandalone: false,
			selector: "clr-dg-string-filter",
			inputs: {
				placeholder: ["clrFilterPlaceholder", "placeholder"],
				label: ["clrFilterLabel", "label"],
				customStringFilter: ["clrDgStringFilter", "customStringFilter"],
				value: ["clrFilterValue", "value"]
			},
			outputs: { filterValueChange: "clrFilterValueChange" },
			providers: [{
				provide: CustomFilter,
				useExisting: DatagridStringFilter
			}],
			viewQueries: [{
				propertyName: "input",
				first: true,
				predicate: ["input"],
				descendants: true
			}, {
				propertyName: "filterContainer",
				first: true,
				predicate: ClrDatagridFilter,
				descendants: true
			}],
			usesInheritance: true,
			usesOnChanges: true,
			ngImport: i0,
			template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-input-container>
        <label>{{ labelValue }}</label>
        <input
          #input
          type="text"
          autocomplete="off"
          name="search"
          [(ngModel)]="value"
          clrInput
          [attr.aria-label]="placeholderValue"
          [placeholder]="placeholderValue"
        />
      </clr-input-container>
    </clr-dg-filter>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i5.ClrInput,
					selector: "[clrInput]"
				},
				{
					kind: "component",
					type: i5.ClrInputContainer,
					selector: "clr-input-container"
				},
				{
					kind: "directive",
					type: i6$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
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
					type: ClrDatagridFilter,
					selector: "clr-dg-filter",
					inputs: ["clrDgFilterOpen", "clrDgFilter"],
					outputs: ["clrDgFilterOpenChange"]
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
	type: DatagridStringFilter,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-string-filter",
			providers: [{
				provide: CustomFilter,
				useExisting: DatagridStringFilter
			}],
			template: `
    <clr-dg-filter [clrDgFilter]="registered" [(clrDgFilterOpen)]="open">
      <clr-input-container>
        <label>{{ labelValue }}</label>
        <input
          #input
          type="text"
          autocomplete="off"
          name="search"
          [(ngModel)]="value"
          clrInput
          [attr.aria-label]="placeholderValue"
          [placeholder]="placeholderValue"
        />
      </clr-input-container>
    </clr-dg-filter>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: FiltersProvider },
		{ type: i1.DomAdapter },
		{ type: i1.ClrCommonStringsService },
		{ type: i3$1.ClrPopoverService },
		{ type: i0.ElementRef },
		{ type: i0.ChangeDetectorRef },
		{ type: i0.NgZone }
	],
	propDecorators: {
		placeholder: [{
			type: Input,
			args: ["clrFilterPlaceholder"]
		}],
		label: [{
			type: Input,
			args: ["clrFilterLabel"]
		}],
		filterValueChange: [{
			type: Output,
			args: ["clrFilterValueChange"]
		}],
		input: [{
			type: ViewChild,
			args: ["input"]
		}],
		filterContainer: [{
			type: ViewChild,
			args: [ClrDatagridFilter]
		}],
		customStringFilter: [{
			type: Input,
			args: ["clrDgStringFilter"]
		}],
		value: [{
			type: Input,
			args: ["clrFilterValue"]
		}]
	}
});
var ClrDatagridColumn = class ClrDatagridColumn extends DatagridFilterRegistrar {
	constructor(el, _sort, filters, vcr, detailService, changeDetectorRef, commonStrings, columnsService, columnState) {
		super(filters);
		this.el = el;
		this._sort = _sort;
		this.vcr = vcr;
		this.detailService = detailService;
		this.changeDetectorRef = changeDetectorRef;
		this.commonStrings = commonStrings;
		this.columnsService = columnsService;
		this.columnState = columnState;
		this.disableUnsort = false;
		this.pinnable = false;
		this.sortOrderChange = new EventEmitter();
		this.pinnedChange = new EventEmitter();
		this.filterValueChange = new EventEmitter();
		this.customFilter = false;
		this.columnActions = inject(ColumnActionsService);
		this._colType = "string";
		this._sortOrder = ClrDatagridSortOrder.UNSORTED;
		this.subscriptions = [];
		this._showSeparator = signal(true, ...ngDevMode ? [{ debugName: "_showSeparator" }] : /* istanbul ignore next */ []);
		this._pinned = signal(false, ...ngDevMode ? [{ debugName: "_pinned" }] : /* istanbul ignore next */ []);
		this.tree = inject(DatagridTreeService, { optional: true });
		this.subscriptions.push(this.listenForSortingChanges());
		this.subscriptions.push(this.listenForDetailPaneChanges());
	}
	get isHidden() {
		return this.el.nativeElement.classList.contains(HIDDEN_COLUMN_CLASS);
	}
	get isPinned() {
		return this.el.nativeElement.classList.contains(PINNED_COLUMN_CLASS);
	}
	get showSeparator() {
		return this._showSeparator();
	}
	set showSeparator(value) {
		this._showSeparator.set(value);
	}
	get pinned() {
		return this._pinned();
	}
	set pinned(value) {
		if (this._pinned() === value) return;
		this._pinned.set(value);
		if (this.columnState) this.columnsService.emitStateChange(this.columnState, {
			pinned: value,
			changes: [DatagridColumnChanges.PINNED]
		});
	}
	get treeToggle() {
		return !!this.columnState && !!this.tree?.toggleColumns.has(this.columnState);
	}
	set treeToggle(value) {
		if (this.tree && this.columnState) {
			if (value) this.tree.toggleColumns.add(this.columnState);
			else this.tree.toggleColumns.delete(this.columnState);
		}
	}
	get colType() {
		return this._colType;
	}
	set colType(value) {
		this._colType = value;
	}
	get field() {
		return this._field;
	}
	set field(field) {
		if (typeof field === "string") {
			this._field = field;
			if (!this._sortBy) this._sortBy = new DatagridPropertyComparator(field);
		}
	}
	get sortBy() {
		return this._sortBy;
	}
	set sortBy(comparator) {
		if (typeof comparator === "string") this._sortBy = new DatagridPropertyComparator(comparator);
		else if (comparator) this._sortBy = comparator;
		else if (this.field) this._sortBy = new DatagridPropertyComparator(this.field);
		else delete this._sortBy;
	}
	get sortOrder() {
		return this._sortOrder;
	}
	set sortOrder(value) {
		if (typeof value === "undefined") return;
		if (this._sortOrder === value) return;
		switch (value) {
			case ClrDatagridSortOrder.ASC:
				this.sort(false);
				break;
			case ClrDatagridSortOrder.DESC:
				this.sort(true);
				break;
			case ClrDatagridSortOrder.UNSORTED:
			default:
				this._sort.clear();
				this._sortDirection = null;
		}
	}
	set updateFilterValue(newValue) {
		if (this.filter) {
			if (this.filter instanceof DatagridStringFilterImpl) {
				if (!newValue || typeof newValue !== "string") newValue = "";
				if (newValue !== this.filter.value) this.filter.value = newValue;
			} else if (this.filter instanceof DatagridNumericFilterImpl) {
				if (!newValue || !(newValue instanceof Array)) newValue = [null, null];
				if (newValue.length === 2 && (newValue[0] !== this.filter.value[0] || newValue[1] !== this.filter.value[1])) this.filter.value = newValue;
			}
		} else this.initFilterValue = newValue;
	}
	set projectedFilter(custom) {
		if (custom) {
			this.deleteFilter();
			this.customFilter = true;
		}
	}
	get sortable() {
		return !!this._sortBy;
	}
	get ariaSort() {
		switch (this._sortOrder) {
			case ClrDatagridSortOrder.ASC: return ClrDatagridAriaSortOrder.ASC;
			case ClrDatagridSortOrder.DESC: return ClrDatagridAriaSortOrder.DESC;
			case ClrDatagridSortOrder.UNSORTED:
			default: return ClrDatagridAriaSortOrder.UNSORTED;
		}
	}
	get sortDirection() {
		return this._sortDirection;
	}
	get filterValue() {
		if (this.filter instanceof DatagridStringFilterImpl || this.filter instanceof DatagridNumericFilterImpl) return this.filter.value;
		return null;
	}
	set filterValue(newValue) {
		if (this.filter instanceof DatagridStringFilterImpl || this.filter instanceof DatagridNumericFilterImpl) {
			this.updateFilterValue = newValue;
			this.filterValueChange.emit(this.filter.value);
		}
	}
	get _view() {
		return this.wrappedInjector.get(WrappedColumn, this.vcr).columnView;
	}
	ngOnInit() {
		this.wrappedInjector = new HostWrapper(WrappedColumn, this.vcr);
	}
	ngAfterViewInit() {
		this.updateTitle();
	}
	ngAfterViewChecked() {
		this.updateTitle();
	}
	ngOnChanges(changes) {
		if (changes.colType && changes.colType.currentValue && changes.colType.currentValue !== changes.colType.previousValue) {
			if (!this.customFilter && !this.filter && this.colType && this.field) this.setupDefaultFilter(this.field, this.colType);
		}
		if (changes.field && changes.field.currentValue && changes.field.currentValue !== changes.field.previousValue) {
			if (!this.customFilter && this.colType) this.setupDefaultFilter(this.field, this.colType);
		}
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.treeToggle = false;
	}
	sort(reverse) {
		if (!this.sortable) return;
		if (!this.disableUnsort && reverse === void 0 && this.sortOrder === ClrDatagridSortOrder.DESC) {
			this.clearSort();
			return;
		}
		this._sort.toggle(this._sortBy, reverse);
		this._sortOrder = this._sort.reverse ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;
		this._sortDirection = this._sortOrder === ClrDatagridSortOrder.DESC ? "down" : "up";
		this.sortOrderChange.emit(this._sortOrder);
	}
	clearSort() {
		if (!this.sortable || this._sortOrder === ClrDatagridSortOrder.UNSORTED) return;
		this._sortOrder = ClrDatagridSortOrder.UNSORTED;
		this._sort.clear();
		this._sortDirection = null;
		this.sortOrderChange.emit(this._sortOrder);
	}
	togglePinned() {
		this.pinned = !this.pinned;
		this.pinnedChange.emit(this.pinned);
	}
	onPinToggleClick(event) {
		event.stopPropagation();
		this.togglePinned();
	}
	listenForDetailPaneChanges() {
		return this.detailService.stateChange.subscribe((state) => {
			if (this.showSeparator !== !state) this.showSeparator = !state;
		});
	}
	updateTitle() {
		this.columnActions.title.set(this.titleContainer?.nativeElement.textContent?.trim() ?? "");
		this.setFilterToggleAriaLabel();
	}
	setFilterToggleAriaLabel() {
		const filterToggle = this.el.nativeElement.querySelector(".datagrid-filter-toggle");
		if (filterToggle) filterToggle.ariaLabel = this.commonStrings.parse(this.commonStrings.keys.datagridFilterAriaLabel, { COLUMN: this.columnActions.title().toLocaleLowerCase() });
	}
	listenForSortingChanges() {
		return this._sort.change.subscribe((sort) => {
			this.changeDetectorRef.markForCheck();
			if (this.sortOrder !== ClrDatagridSortOrder.UNSORTED && sort.comparator !== this._sortBy) {
				this._sortOrder = ClrDatagridSortOrder.UNSORTED;
				this.sortOrderChange.emit(this._sortOrder);
				this._sortDirection = null;
			}
		});
	}
	setupDefaultFilter(field, colType) {
		if (colType === "number") this.setFilter(new DatagridNumericFilterImpl(new DatagridPropertyNumericFilter(field)));
		else if (colType === "string") this.setFilter(new DatagridStringFilterImpl(new DatagridPropertyStringFilter(field)));
		if (this.filter && this.initFilterValue) {
			this.updateFilterValue = this.initFilterValue;
			delete this.initFilterValue;
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumn,
			deps: [
				{ token: i0.ElementRef },
				{ token: Sort },
				{ token: FiltersProvider },
				{ token: i0.ViewContainerRef },
				{ token: DetailService },
				{ token: i0.ChangeDetectorRef },
				{ token: i1.ClrCommonStringsService },
				{ token: ColumnsService },
				{
					token: COLUMN_STATE,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridColumn,
			isStandalone: false,
			selector: "clr-dg-column",
			inputs: {
				filterStringPlaceholder: ["clrFilterStringPlaceholder", "filterStringPlaceholder"],
				filterNumberMaxPlaceholder: ["clrFilterNumberMaxPlaceholder", "filterNumberMaxPlaceholder"],
				filterNumberMinPlaceholder: ["clrFilterNumberMinPlaceholder", "filterNumberMinPlaceholder"],
				disableUnsort: ["clrDgDisableUnsort", "disableUnsort"],
				pinnable: [
					"clrDgPinnable",
					"pinnable",
					booleanAttribute
				],
				pinned: [
					"clrDgPinned",
					"pinned",
					booleanAttribute
				],
				treeToggle: [
					"clrDgTreeToggle",
					"treeToggle",
					booleanAttribute
				],
				colType: ["clrDgColType", "colType"],
				field: ["clrDgField", "field"],
				sortBy: ["clrDgSortBy", "sortBy"],
				sortOrder: ["clrDgSortOrder", "sortOrder"],
				updateFilterValue: ["clrFilterValue", "updateFilterValue"]
			},
			outputs: {
				sortOrderChange: "clrDgSortOrderChange",
				pinnedChange: "clrDgPinnedChange",
				filterValueChange: "clrFilterValueChange"
			},
			host: {
				attributes: { "role": "columnheader" },
				properties: {
					"class.datagrid-column": "true",
					"attr.aria-sort": "ariaSort"
				}
			},
			providers: [ColumnActionsService],
			queries: [{
				propertyName: "projectedFilter",
				first: true,
				predicate: CustomFilter,
				descendants: true
			}],
			viewQueries: [{
				propertyName: "titleContainer",
				first: true,
				predicate: ["titleContainer"],
				descendants: true,
				read: ElementRef
			}],
			usesInheritance: true,
			usesOnChanges: true,
			hostDirectives: [{ directive: i3$1.ClrPopoverHostDirective }],
			ngImport: i0,
			template: `
    <div class="datagrid-column-flex">
      @if (sortable) {
        <button class="datagrid-column-title" (click)="sort()" type="button" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
          <cds-icon
            [shape]="sortDirection ? 'arrow' : 'two-way-arrows'"
            [direction]="sortDirection ? sortDirection : 'left'"
            aria-hidden="true"
            class="sort-icon"
          ></cds-icon>
        </button>
      }
      <!-- I'm really not happy with that select since it's not very scalable -->
      <ng-content select="clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter"></ng-content>

      @if (field && !customFilter && colType == 'string') {
        <clr-dg-string-filter
          [clrFilterPlaceholder]="filterStringPlaceholder"
          [clrDgStringFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-string-filter>
      }
      @if (field && !customFilter && colType == 'number') {
        <clr-dg-numeric-filter
          [clrFilterMaxPlaceholder]="filterNumberMaxPlaceholder"
          [clrFilterMinPlaceholder]="filterNumberMinPlaceholder"
          [clrDgNumericFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-numeric-filter>
      }

      <ng-template #columnTitle>
        <ng-content></ng-content>
      </ng-template>

      @if (!sortable) {
        <span class="datagrid-column-title" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
        </span>
      }

      <!--
        The actions menu needs its own slot: the default ng-content lives inside the #columnTitle
        template, which is rendered inside the sort button, so an unselected clr-dg-column-actions
        would end up as a button within a button.
      -->
      <ng-content select="clr-dg-column-actions"></ng-content>

      @if (pinnable && !columnActions.menuPresent()) {
        <button
          class="datagrid-column-pin"
          type="button"
          [attr.aria-label]="pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn"
          (click)="onPinToggleClick($event)"
        >
          <cds-icon [size]="'12'" [shape]="pinned ? 'unpin' : 'pin'" solid aria-hidden="true"></cds-icon>
        </button>
      }

      @if (showSeparator) {
        <clr-dg-column-separator></clr-dg-column-separator>
      }
    </div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i7$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: ClrDatagridColumnSeparator,
					selector: "clr-dg-column-separator"
				},
				{
					kind: "component",
					type: DatagridNumericFilter,
					selector: "clr-dg-numeric-filter",
					inputs: [
						"clrFilterMinPlaceholder",
						"clrFilterMaxPlaceholder",
						"clrFilterFromLabel",
						"clrFilterToLabel",
						"clrFilterValue",
						"clrDgNumericFilter"
					],
					outputs: ["clrFilterValueChange"]
				},
				{
					kind: "component",
					type: DatagridStringFilter,
					selector: "clr-dg-string-filter",
					inputs: [
						"clrFilterPlaceholder",
						"clrFilterLabel",
						"clrDgStringFilter",
						"clrFilterValue"
					],
					outputs: ["clrFilterValueChange"]
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
	type: ClrDatagridColumn,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-column",
			template: `
    <div class="datagrid-column-flex">
      @if (sortable) {
        <button class="datagrid-column-title" (click)="sort()" type="button" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
          <cds-icon
            [shape]="sortDirection ? 'arrow' : 'two-way-arrows'"
            [direction]="sortDirection ? sortDirection : 'left'"
            aria-hidden="true"
            class="sort-icon"
          ></cds-icon>
        </button>
      }
      <!-- I'm really not happy with that select since it's not very scalable -->
      <ng-content select="clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter"></ng-content>

      @if (field && !customFilter && colType == 'string') {
        <clr-dg-string-filter
          [clrFilterPlaceholder]="filterStringPlaceholder"
          [clrDgStringFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-string-filter>
      }
      @if (field && !customFilter && colType == 'number') {
        <clr-dg-numeric-filter
          [clrFilterMaxPlaceholder]="filterNumberMaxPlaceholder"
          [clrFilterMinPlaceholder]="filterNumberMinPlaceholder"
          [clrDgNumericFilter]="registered"
          [(clrFilterValue)]="filterValue"
        ></clr-dg-numeric-filter>
      }

      <ng-template #columnTitle>
        <ng-content></ng-content>
      </ng-template>

      @if (!sortable) {
        <span class="datagrid-column-title" #titleContainer>
          <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
        </span>
      }

      <!--
        The actions menu needs its own slot: the default ng-content lives inside the #columnTitle
        template, which is rendered inside the sort button, so an unselected clr-dg-column-actions
        would end up as a button within a button.
      -->
      <ng-content select="clr-dg-column-actions"></ng-content>

      @if (pinnable && !columnActions.menuPresent()) {
        <button
          class="datagrid-column-pin"
          type="button"
          [attr.aria-label]="pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn"
          (click)="onPinToggleClick($event)"
        >
          <cds-icon [size]="'12'" [shape]="pinned ? 'unpin' : 'pin'" solid aria-hidden="true"></cds-icon>
        </button>
      }

      @if (showSeparator) {
        <clr-dg-column-separator></clr-dg-column-separator>
      }
    </div>
  `,
			hostDirectives: [ClrPopoverHostDirective],
			providers: [ColumnActionsService],
			host: {
				"[class.datagrid-column]": "true",
				"[attr.aria-sort]": "ariaSort",
				role: "columnheader"
			},
			changeDetection: ChangeDetectionStrategy.OnPush,
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: Sort },
		{ type: FiltersProvider },
		{ type: i0.ViewContainerRef },
		{ type: DetailService },
		{ type: i0.ChangeDetectorRef },
		{ type: i1.ClrCommonStringsService },
		{ type: ColumnsService },
		{
			type: i12.BehaviorSubject,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [COLUMN_STATE]
			}]
		}
	],
	propDecorators: {
		filterStringPlaceholder: [{
			type: Input,
			args: ["clrFilterStringPlaceholder"]
		}],
		filterNumberMaxPlaceholder: [{
			type: Input,
			args: ["clrFilterNumberMaxPlaceholder"]
		}],
		filterNumberMinPlaceholder: [{
			type: Input,
			args: ["clrFilterNumberMinPlaceholder"]
		}],
		disableUnsort: [{
			type: Input,
			args: ["clrDgDisableUnsort"]
		}],
		pinnable: [{
			type: Input,
			args: [{
				alias: "clrDgPinnable",
				transform: booleanAttribute
			}]
		}],
		sortOrderChange: [{
			type: Output,
			args: ["clrDgSortOrderChange"]
		}],
		pinnedChange: [{
			type: Output,
			args: ["clrDgPinnedChange"]
		}],
		filterValueChange: [{
			type: Output,
			args: ["clrFilterValueChange"]
		}],
		titleContainer: [{
			type: ViewChild,
			args: ["titleContainer", { read: ElementRef }]
		}],
		pinned: [{
			type: Input,
			args: [{
				alias: "clrDgPinned",
				transform: booleanAttribute
			}]
		}],
		treeToggle: [{
			type: Input,
			args: [{
				alias: "clrDgTreeToggle",
				transform: booleanAttribute
			}]
		}],
		colType: [{
			type: Input,
			args: ["clrDgColType"]
		}],
		field: [{
			type: Input,
			args: ["clrDgField"]
		}],
		sortBy: [{
			type: Input,
			args: ["clrDgSortBy"]
		}],
		sortOrder: [{
			type: Input,
			args: ["clrDgSortOrder"]
		}],
		updateFilterValue: [{
			type: Input,
			args: ["clrFilterValue"]
		}],
		projectedFilter: [{
			type: ContentChild,
			args: [CustomFilter]
		}]
	}
});
var ClrDatagridItems = class ClrDatagridItems {
	constructor(template, differs, items, vcr) {
		this.template = template;
		this.differs = differs;
		this.items = items;
		this.differ = null;
		this.subscriptions = [];
		items.smartenUp();
		this.iterableProxy = new NgForOf(vcr, template, differs);
		this.subscriptions.push(items.change.subscribe((newItems) => {
			this.iterableProxy.ngForOf = newItems;
			this.iterableProxy.ngDoCheck();
		}));
	}
	set rawItems(items) {
		this._rawItems = items ? items : [];
	}
	set trackBy(value) {
		this.iterableProxy.ngForTrackBy = value;
	}
	static ngTemplateContextGuard(_dir, _ctx) {
		return true;
	}
	ngDoCheck() {
		if (!this.differ) this.differ = this.differs.find(this._rawItems).create(this.iterableProxy.ngForTrackBy);
		if (this.differ) {
			if (this.differ.diff(this._rawItems)) this.items.all = this._rawItems;
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.items.smartenDown();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridItems,
			deps: [
				{ token: i0.TemplateRef },
				{ token: i0.IterableDiffers },
				{ token: Items },
				{ token: i0.ViewContainerRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridItems,
			isStandalone: false,
			selector: "[clrDgItems][clrDgItemsOf]",
			inputs: {
				rawItems: ["clrDgItemsOf", "rawItems"],
				trackBy: ["clrDgItemsTrackBy", "trackBy"]
			},
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridItems,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDgItems][clrDgItemsOf]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.TemplateRef },
		{ type: i0.IterableDiffers },
		{ type: Items },
		{ type: i0.ViewContainerRef }
	],
	propDecorators: {
		rawItems: [{
			type: Input,
			args: ["clrDgItemsOf"]
		}],
		trackBy: [{
			type: Input,
			args: ["clrDgItemsTrackBy"]
		}]
	}
});
var ClrDatagridPlaceholder = class ClrDatagridPlaceholder {
	constructor(items) {
		this.items = items;
	}
	get emptyDatagrid() {
		return !this.items.loading && (!this.items.displayed || this.items.displayed.length === 0);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridPlaceholder,
			deps: [{ token: Items }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridPlaceholder,
			isStandalone: false,
			selector: "clr-dg-placeholder",
			host: { properties: { "class.datagrid-placeholder-container": "true" } },
			ngImport: i0,
			template: `
    <div class="datagrid-placeholder" [class.datagrid-empty]="emptyDatagrid">
      @if (emptyDatagrid) {
        <div class="datagrid-placeholder-image"></div>
      }
      <span class="datagrid-placeholder-content">
        @if (emptyDatagrid) {
          <ng-content></ng-content>
        }
      </span>
    </div>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridPlaceholder,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-placeholder",
			template: `
    <div class="datagrid-placeholder" [class.datagrid-empty]="emptyDatagrid">
      @if (emptyDatagrid) {
        <div class="datagrid-placeholder-image"></div>
      }
      <span class="datagrid-placeholder-content">
        @if (emptyDatagrid) {
          <ng-content></ng-content>
        }
      </span>
    </div>
  `,
			host: { "[class.datagrid-placeholder-container]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: Items }]
});
var WrappedCell = class WrappedCell {
	ngAfterViewInit() {
		this.cellView = this.templateRef.createEmbeddedView(null);
	}
	ngOnDestroy() {
		this.cellView.destroy();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WrappedCell,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: WrappedCell,
			isStandalone: false,
			selector: "dg-wrapped-cell",
			viewQueries: [{
				propertyName: "templateRef",
				first: true,
				predicate: ["cellPortal"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WrappedCell,
	decorators: [{
		type: Component,
		args: [{
			selector: "dg-wrapped-cell",
			template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: { templateRef: [{
		type: ViewChild,
		args: ["cellPortal"]
	}] }
});
var ClrDatagridTreeToggleButton = class ClrDatagridTreeToggleButton {
	constructor() {
		this.commonStrings = inject(ClrCommonStringsService);
		this.actionId = uniqueIdFactory();
		this.cell = null;
		this.tree = inject(DatagridTreeService);
		this.el = inject(ElementRef);
	}
	ngOnDestroy() {
		const button = this.el.nativeElement;
		const active = button.ownerDocument.activeElement;
		const focusLost = !active || active === button || active === button.ownerDocument.body;
		if (this.cell && focusLost) {
			if (!this.cell.hasAttribute("tabindex")) this.cell.setAttribute("tabindex", "-1");
			this.cell.focus();
		}
	}
	onFocus() {
		this.cell ??= this.el.nativeElement.closest("[role=gridcell]");
	}
	toggle(event) {
		event.stopPropagation();
		this.tree.setExpanded(this.node, !this.node.expanded);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridTreeToggleButton,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridTreeToggleButton,
			isStandalone: false,
			selector: "button[clrDgTreeToggleButton]",
			inputs: {
				node: ["clrDgTreeToggleButton", "node"],
				labelIds: "labelIds"
			},
			host: {
				attributes: {
					"type": "button",
					"tabindex": "-1"
				},
				listeners: {
					"click": "toggle($event)",
					"focus": "onFocus()"
				},
				properties: {
					"attr.aria-labelledby": "actionId + \" \" + labelIds",
					"attr.aria-expanded": "node.expanded"
				},
				classAttribute: "datagrid-tree-toggle"
			},
			ngImport: i0,
			template: `
    <!-- Named "Expand <row>": this word, then the cells that name the row. -->
    <span hidden [id]="actionId">
      {{ node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand }}
    </span>
    <!-- The button stays while the children load, so it keeps the focus. -->
    @if (node.loading && node.expanded) {
      <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>
    } @else {
      <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
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
			}, {
				kind: "component",
				type: i2$1.ClrSpinner,
				selector: "clr-spinner",
				inputs: [
					"clrInline",
					"clrInverse",
					"clrSmall",
					"clrMedium"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridTreeToggleButton,
	decorators: [{
		type: Component,
		args: [{
			selector: "button[clrDgTreeToggleButton]",
			template: `
    <!-- Named "Expand <row>": this word, then the cells that name the row. -->
    <span hidden [id]="actionId">
      {{ node.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand }}
    </span>
    <!-- The button stays while the children load, so it keeps the focus. -->
    @if (node.loading && node.expanded) {
      <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>
    } @else {
      <cds-icon shape="angle" [direction]="node.expanded ? 'down' : 'right'"></cds-icon>
    }
  `,
			host: {
				type: "button",
				class: "datagrid-tree-toggle",
				tabindex: "-1",
				"[attr.aria-labelledby]": "actionId + \" \" + labelIds",
				"[attr.aria-expanded]": "node.expanded",
				"(click)": "toggle($event)",
				"(focus)": "onFocus()"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: {
		node: [{
			type: Input,
			args: [{
				alias: "clrDgTreeToggleButton",
				required: true
			}]
		}],
		labelIds: [{
			type: Input,
			args: [{ required: true }]
		}]
	}
});
var ClrDatagridCell = class ClrDatagridCell {
	constructor(vcr) {
		this.vcr = vcr;
		this._treeRow = null;
		this.el = inject(ElementRef);
	}
	get _treeId() {
		const cell = this.el.nativeElement;
		if (!cell.id) cell.id = uniqueIdFactory();
		return cell.id;
	}
	get _view() {
		return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
	}
	get treeNode() {
		const tree = this._treeRow?._tree;
		return tree?.toggleCells.has(this) ? tree.node : void 0;
	}
	get treeToggleLabelIds() {
		const leading = this._treeRow?._tree?.labelCell;
		return leading && leading !== this ? `${leading._treeId} ${this._treeId}` : this._treeId;
	}
	ngOnInit() {
		this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridCell,
			deps: [{ token: i0.ViewContainerRef }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridCell,
			isStandalone: false,
			selector: "clr-dg-cell",
			host: {
				attributes: { "role": "gridcell" },
				properties: {
					"class.datagrid-cell": "true",
					"class.datagrid-tree-cell": "!!treeNode",
					"style.--clr-datagrid-tree-level": "treeNode ? treeNode.level - 1 : null",
					"class.datagrid-signpost-trigger": "signpost.length > 0"
				}
			},
			queries: [{
				propertyName: "signpost",
				predicate: ClrSignpost
			}],
			ngImport: i0,
			template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (treeNode; as node) {
      <!-- The content is indented by the depth of the row, and the toggle sits in the indentation. -->
      <div class="datagrid-tree-cell-content">
        @if (node.expandable) {
          <button [clrDgTreeToggleButton]="node" [labelIds]="treeToggleLabelIds"></button>
        }
        <div class="datagrid-tree-cell-text"><ng-container [ngTemplateOutlet]="content"></ng-container></div>
      </div>
    } @else {
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i7$1.NgTemplateOutlet,
				selector: "[ngTemplateOutlet]",
				inputs: [
					"ngTemplateOutletContext",
					"ngTemplateOutlet",
					"ngTemplateOutletInjector"
				]
			}, {
				kind: "component",
				type: ClrDatagridTreeToggleButton,
				selector: "button[clrDgTreeToggleButton]",
				inputs: ["clrDgTreeToggleButton", "labelIds"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridCell,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-cell",
			template: `
    <ng-template #content><ng-content></ng-content></ng-template>
    @if (treeNode; as node) {
      <!-- The content is indented by the depth of the row, and the toggle sits in the indentation. -->
      <div class="datagrid-tree-cell-content">
        @if (node.expandable) {
          <button [clrDgTreeToggleButton]="node" [labelIds]="treeToggleLabelIds"></button>
        }
        <div class="datagrid-tree-cell-text"><ng-container [ngTemplateOutlet]="content"></ng-container></div>
      </div>
    } @else {
      <ng-container [ngTemplateOutlet]="content"></ng-container>
    }
  `,
			host: {
				"[class.datagrid-cell]": "true",
				"[class.datagrid-tree-cell]": "!!treeNode",
				"[style.--clr-datagrid-tree-level]": "treeNode ? treeNode.level - 1 : null",
				"[class.datagrid-signpost-trigger]": "signpost.length > 0",
				role: "gridcell"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: i0.ViewContainerRef }],
	propDecorators: { signpost: [{
		type: ContentChildren,
		args: [ClrSignpost]
	}] }
});
let nbRow$1 = 0;
var DatagridIfExpandService = class DatagridIfExpandService extends IfExpandService {
	constructor() {
		super();
		this.expandableId = "";
		this._replace = new BehaviorSubject(false);
		this._animate = new Subject();
		nbRow$1++;
		this.expandableId = "clr-dg-expandable-row-" + nbRow$1;
	}
	get expanded() {
		return this._expanded;
	}
	set expanded(value) {
		value = !!value;
		if (value !== this._expanded) {
			this._expanded = value;
			this._animate.next();
			this._expandChange.next(value);
		}
	}
	get replace() {
		return this._replace.asObservable();
	}
	get animate() {
		return this._animate.asObservable();
	}
	loadingStateChange(state) {
		super.loadingStateChange(state);
		if (state !== ClrLoadingState.LOADING) this._animate.next();
	}
	setReplace(replaceValue) {
		this._replace.next(replaceValue);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridIfExpandService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridIfExpandService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridIfExpandService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => []
});
var DatagridDisplayMode;
(function(DatagridDisplayMode) {
	DatagridDisplayMode[DatagridDisplayMode["DISPLAY"] = 0] = "DISPLAY";
	DatagridDisplayMode[DatagridDisplayMode["CALCULATE"] = 1] = "CALCULATE";
})(DatagridDisplayMode || (DatagridDisplayMode = {}));
var WrappedRow = class WrappedRow {
	ngAfterViewInit() {
		this.rowView = this.templateRef.createEmbeddedView(null);
	}
	ngOnDestroy() {
		this.rowView.destroy();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WrappedRow,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: WrappedRow,
			isStandalone: false,
			selector: "dg-wrapped-row",
			viewQueries: [{
				propertyName: "templateRef",
				first: true,
				predicate: ["rowPortal"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WrappedRow,
	decorators: [{
		type: Component,
		args: [{
			selector: "dg-wrapped-row",
			template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: { templateRef: [{
		type: ViewChild,
		args: ["rowPortal"]
	}] }
});
var RowActionService = class RowActionService {
	constructor() {
		this.actionableCount = signal(0, ...ngDevMode ? [{ debugName: "actionableCount" }] : /* istanbul ignore next */ []);
		this._hasActionableRow = computed(() => this.actionableCount() > 0, ...ngDevMode ? [{ debugName: "_hasActionableRow" }] : /* istanbul ignore next */ []);
	}
	get hasActionableRow() {
		return this._hasActionableRow();
	}
	register() {
		this.actionableCount.update((count) => count + 1);
	}
	unregister() {
		this.actionableCount.update((count) => count - 1);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RowActionService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RowActionService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RowActionService,
	decorators: [{ type: Injectable }]
});
var ExpandableRowsCount = class ExpandableRowsCount {
	constructor(detailService, tree) {
		this.detailService = detailService;
		this.tree = tree;
		this.expandableCount = signal(0, ...ngDevMode ? [{ debugName: "expandableCount" }] : /* istanbul ignore next */ []);
		this._hasExpandableRow = computed(() => !this.tree?.enabled() && !this.detailService.enabled && this.expandableCount() > 0, ...ngDevMode ? [{ debugName: "_hasExpandableRow" }] : /* istanbul ignore next */ []);
	}
	get hasExpandableRow() {
		return this._hasExpandableRow();
	}
	register() {
		this.expandableCount.update((count) => count + 1);
	}
	unregister() {
		this.expandableCount.update((count) => count - 1);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ExpandableRowsCount,
			deps: [{ token: DetailService }, {
				token: DatagridTreeService,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ExpandableRowsCount
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ExpandableRowsCount,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: DetailService }, {
		type: DatagridTreeService,
		decorators: [{ type: Optional }]
	}]
});
var DisplayModeService = class DisplayModeService {
	constructor(renderOrganizer) {
		this._view = new BehaviorSubject(DatagridDisplayMode.DISPLAY);
		this.subscriptions = [];
		this.subscriptions.push(renderOrganizer.filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_ON).subscribe(() => this._view.next(DatagridDisplayMode.CALCULATE)));
		this.subscriptions.push(renderOrganizer.filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_OFF).subscribe(() => this._view.next(DatagridDisplayMode.DISPLAY)));
	}
	get view() {
		return this._view.asObservable();
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DisplayModeService,
			deps: [{ token: DatagridRenderOrganizer }],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DisplayModeService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DisplayModeService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [{ type: DatagridRenderOrganizer }]
});
var ClrDatagridSingleSelectionValueAccessor = class ClrDatagridSingleSelectionValueAccessor {
	constructor(renderer, elementRef) {
		this.renderer = renderer;
		this.elementRef = elementRef;
		this.onChange = () => {};
		this.onTouched = () => {};
	}
	registerOnChange(fn) {
		this.onChange = fn;
	}
	registerOnTouched(fn) {
		this.onTouched = fn;
	}
	setDisabledState(isDisabled) {
		this.renderer.setProperty(this.elementRef.nativeElement, "disabled", isDisabled);
	}
	writeValue(value) {
		this.state = value;
		this.updateChecked();
	}
	keyOf(value) {
		if (value && this.clrDgIdentityFn) return this.clrDgIdentityFn(value);
		return value;
	}
	updateChecked() {
		if (this.state === null || this.state === void 0 || this.value === null || this.value === void 0) {
			this.renderer.setProperty(this.elementRef.nativeElement, "checked", false);
			return;
		}
		const state = this.keyOf(this.state);
		const value = this.keyOf(this.value);
		this.renderer.setProperty(this.elementRef.nativeElement, "checked", state === value);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridSingleSelectionValueAccessor,
			deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridSingleSelectionValueAccessor,
			isStandalone: true,
			selector: "input[type=radio][clrDgSingleSelectionRadio]",
			inputs: {
				value: "value",
				clrDgIdentityFn: "clrDgIdentityFn"
			},
			host: { listeners: {
				"change": "onChange(value)",
				"blur": "onTouched()"
			} },
			providers: [{
				provide: NG_VALUE_ACCESSOR,
				useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
				multi: true
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridSingleSelectionValueAccessor,
	decorators: [{
		type: Directive,
		args: [{
			selector: "input[type=radio][clrDgSingleSelectionRadio]",
			providers: [{
				provide: NG_VALUE_ACCESSOR,
				useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
				multi: true
			}],
			host: {
				"(change)": "onChange(value)",
				"(blur)": "onTouched()"
			}
		}]
	}],
	ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }],
	propDecorators: {
		value: [{ type: Input }],
		clrDgIdentityFn: [{ type: Input }]
	}
});
var ClrDatagridSelectionCellDirective = class ClrDatagridSelectionCellDirective {
	constructor(selection) {
		this.selection = selection;
	}
	onSelectionCellClick(event) {
		if (this.selection.rowSelectionMode) return;
		if (event.target.tagName !== "LABEL" && event.target.tagName !== "INPUT") event.target.querySelector("input")?.click();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridSelectionCellDirective,
			deps: [{ token: Selection }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridSelectionCellDirective,
			isStandalone: false,
			selector: ".datagrid-select",
			host: { listeners: { "click": "onSelectionCellClick($event)" } },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridSelectionCellDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: ".datagrid-select",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: Selection }],
	propDecorators: { onSelectionCellClick: [{
		type: HostListener,
		args: ["click", ["$event"]]
	}] }
});
let nbRow = 0;
var ClrDatagridRow = class ClrDatagridRow {
	constructor(selection, rowActionService, globalExpandable, expand, detailService, displayMode, vcr, renderer, el, commonStrings, items, columnsService, document) {
		this.selection = selection;
		this.rowActionService = rowActionService;
		this.globalExpandable = globalExpandable;
		this.expand = expand;
		this.detailService = detailService;
		this.displayMode = displayMode;
		this.vcr = vcr;
		this.el = el;
		this.commonStrings = commonStrings;
		this.items = items;
		this.columnsService = columnsService;
		this.document = document;
		this.selectedChanged = new EventEmitter(false);
		this.expandedChange = new EventEmitter(false);
		this.detailDisabled = false;
		this.detailHidden = false;
		this.skeletonLoading = false;
		this.treeExpandable = true;
		this.displayCells = false;
		this.expandAnimationTrigger = false;
		this.SELECTION_TYPE = SelectionType;
		this.itemChanges = new ReplaySubject(1);
		this.tree = inject(DatagridTreeService, { optional: true });
		this._selected = false;
		this._detailOpenLabel = "";
		this._detailCloseLabel = "";
		this._rowSelectionLabel = "";
		this.subscriptions = [];
		this.fixedCellViews = [];
		this._selectable = true;
		if (!selection || !rowActionService || !globalExpandable || !detailService || !displayMode || !items || !columnsService) throw new Error("clr-dg-row should only be used inside of clr-datagrid");
		nbRow++;
		this.id = "clr-dg-row" + nbRow;
		this.radioId = "clr-dg-row-rd" + nbRow;
		this.checkboxId = "clr-dg-row-cb" + nbRow;
		this.expandableId = expand.expandableId;
		this.subscriptions.push(combineLatest(expand.replace, expand.expandChange).subscribe(([expandReplaceValue, expandChangeValue]) => {
			if (expandReplaceValue && expandChangeValue) {
				this.replaced = true;
				renderer.addClass(el.nativeElement, "datagrid-row-replaced");
			} else {
				this.replaced = false;
				renderer.removeClass(el.nativeElement, "datagrid-row-replaced");
			}
		}));
		if (this.tree) this.subscriptions.push(this.tree.expandedChange.subscribe(({ item, expanded }) => {
			if (this.item !== void 0 && this.tree.identify(item) === this.tree.identify(this.item)) this.expandedChange.emit(expanded);
		}));
	}
	get item() {
		return this._item;
	}
	set item(item) {
		this._item = item;
		this.itemChanges.next(item);
		this.clrDgSelectable = this._selectable;
	}
	get clrDgSelectable() {
		return !this.selection.isLocked(this.item);
	}
	set clrDgSelectable(value) {
		if (this.item) this.selection.lockItem(this.item, value === "false" || value === false);
		this._selectable = value;
	}
	get selected() {
		if (this.selection.selectionType === SelectionType.None) return this._selected;
		else return this.selection.isSelected(this.item);
	}
	set selected(value) {
		if (this.selection.selectionType === SelectionType.None) this._selected = value;
		else {
			if (this.tree?.cascading && this.item !== void 0) {
				this.selection.rangeStart = null;
				this.tree.setSelected([this.item], !!value);
				return;
			}
			if (value && this.selection.selectionType === SelectionType.Multi) this.rangeSelect();
			else this.selection.rangeStart = null;
			this.selection.setSelected(this.item, value);
		}
	}
	get expanded() {
		const node = this._tree?.node;
		return node ? node.expanded : this.expand.expanded;
	}
	set expanded(value) {
		if (this.tree?.enabled()) this._treeExpanded = value;
		else this.expand.expanded = value;
	}
	get clrDgDetailOpenLabel() {
		return this._detailOpenLabel ? this._detailOpenLabel : this.commonStrings.keys.open;
	}
	set clrDgDetailOpenLabel(label) {
		this._detailOpenLabel = label;
	}
	get clrDgDetailCloseLabel() {
		return this._detailCloseLabel ? this._detailCloseLabel : this.commonStrings.keys.close;
	}
	set clrDgDetailCloseLabel(label) {
		this._detailCloseLabel = label;
	}
	get clrDgRowSelectionLabel() {
		return this._rowSelectionLabel ? this._rowSelectionLabel : this.commonStrings.keys.select;
	}
	set clrDgRowSelectionLabel(label) {
		this._rowSelectionLabel = label;
	}
	get _view() {
		return this.wrappedInjector.get(WrappedRow, this.vcr).rowView;
	}
	get identifyBy() {
		return this.items.identifyBy;
	}
	get _tree() {
		if (this.treeCells === void 0) this.treeCells = this.workOutTreeCells();
		return this.treeCells;
	}
	get treeIndeterminate() {
		return !!this.tree?.cascading && this.item !== void 0 && this.tree.isIndeterminate(this.item);
	}
	openDetails(event, detailButton) {
		event.stopPropagation();
		this.detailService.toggle(this.item, detailButton);
	}
	ngOnChanges(changes) {
		if (!(changes["item"] || changes["treeExpandable"] || changes["clrDgSelectable"] || changes["expanded"]) || !this.tree?.enabled() || this.item === void 0) return;
		this.tree.rowDeclared(this.item, {
			expandable: this.treeExpandable,
			locked: !this.clrDgSelectable,
			expanded: changes["item"] || changes["expanded"] ? this._treeExpanded : void 0
		});
	}
	ngOnInit() {
		this.wrappedInjector = new HostWrapper(WrappedRow, this.vcr);
		this.selection.lockItem(this.item, this.clrDgSelectable === false);
	}
	ngDoCheck() {
		this.treeCells = void 0;
	}
	ngAfterContentInit() {
		this.markTreeCell();
		this.dgCells.changes.subscribe(() => {
			this.markTreeCell();
			this.insertCellViews();
		});
	}
	ngAfterViewInit() {
		this.subscriptions.push(this.displayMode.view.subscribe((viewChange) => {
			for (let i = this._scrollableCells.length; i > 0; i--) this._scrollableCells.detach();
			for (let i = this._pinnedCells.length; i > 0; i--) this._pinnedCells.detach();
			this.destroyFixedCellViews();
			for (let i = this._calculatedCells.length; i > 0; i--) this._calculatedCells.detach();
			if (viewChange === DatagridDisplayMode.CALCULATE) {
				this.displayCells = false;
				[
					this.selection.selectionType !== this.SELECTION_TYPE.None,
					this.rowActionService.hasActionableRow,
					this.globalExpandable.hasExpandableRow,
					this.detailService.enabled
				].filter(Boolean).forEach(() => {
					const fixedCellView = this._fixedCellTemplate.createEmbeddedView(null);
					this.fixedCellViews.push(fixedCellView);
					this._calculatedCells.insert(fixedCellView);
				});
				this.dgCells.forEach((cell) => {
					if (!cell._view.destroyed) this._calculatedCells.insert(cell._view);
				});
			} else {
				this.displayCells = true;
				this.insertCellViews();
			}
		}), this.expand.animate.subscribe(() => {
			this.expandAnimationTrigger = !this.expandAnimationTrigger;
		}));
	}
	ngOnDestroy() {
		this.destroyFixedCellViews();
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	toggle(selected = !this.selected) {
		if (selected !== this.selected) {
			this.selected = selected;
			this.selectedChanged.emit(selected);
		}
	}
	toggleExpand(event) {
		event.stopPropagation();
		if (this.expand.expandable) {
			this.expandAnimation.updateStartHeight();
			this.expanded = !this.expanded;
			this.expandedChange.emit(this.expanded);
		}
	}
	clearRanges(event) {
		if (this.selection.rowSelectionMode && event.shiftKey) {
			this.document.getSelection().removeAllRanges();
			if (window.navigator.userAgent.indexOf("Firefox") !== -1) {
				event.preventDefault();
				this.toggle(true);
			}
		}
	}
	selectRow(selected = !this.selected, $event) {
		if (!this.selection.rowSelectionMode || $event.target.tagName === "LABEL" || !this._selectable) return;
		if (this.selection.selectionType === this.SELECTION_TYPE.Single) this.selection.current = [this.item];
		else this.toggle(selected);
	}
	destroyFixedCellViews() {
		this.fixedCellViews.forEach((view) => {
			if (!view.destroyed) view.destroy();
		});
		this.fixedCellViews = [];
	}
	insertCellViews() {
		this.dgCells.forEach((cell, index) => {
			if (cell._view.destroyed) return;
			(this.columnsService.isPinned(index) ? this._pinnedCells : this._scrollableCells).insert(cell._view);
		});
	}
	markTreeCell() {
		const treeRow = this.tree?.enabled() ? this : null;
		this.dgCells.forEach((cell) => cell._treeRow = treeRow);
	}
	workOutTreeCells() {
		const node = this.tree?.enabled() && this.item !== void 0 ? this.tree.nodeFor(this.item) : void 0;
		if (!node) return null;
		const columns = this.columnsService.columns;
		const marked = /* @__PURE__ */ new Set();
		let first;
		let pinned;
		this.dgCells?.forEach((cell, index) => {
			const column = columns[index];
			if (column?.value.hidden) return;
			first ??= cell;
			if (column?.value.pinned) pinned ??= cell;
			if (this.tree.toggleColumns.has(column)) marked.add(cell);
		});
		return {
			node,
			toggleCells: marked.size || !first ? marked : /* @__PURE__ */ new Set([first]),
			labelCell: pinned || first
		};
	}
	rangeSelect() {
		const items = this.items.displayed;
		if (!items) return;
		const startIx = items.indexOf(this.selection.rangeStart);
		if (this.selection.rangeStart && this.selection.current.includes(this.selection.rangeStart) && this.selection.shiftPressed && startIx !== -1) {
			const endIx = items.indexOf(this.item);
			const newSelection = new Set(this.selection.current.concat(items.slice(Math.min(startIx, endIx), Math.max(startIx, endIx) + 1)));
			this.selection.current = [...newSelection];
		} else this.selection.rangeStart = this.item;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridRow,
			deps: [
				{
					token: Selection,
					optional: true
				},
				{
					token: RowActionService,
					optional: true
				},
				{
					token: ExpandableRowsCount,
					optional: true
				},
				{ token: DatagridIfExpandService },
				{
					token: DetailService,
					optional: true
				},
				{
					token: DisplayModeService,
					optional: true
				},
				{ token: i0.ViewContainerRef },
				{ token: i0.Renderer2 },
				{ token: i0.ElementRef },
				{ token: i1.ClrCommonStringsService },
				{
					token: Items,
					optional: true
				},
				{
					token: ColumnsService,
					optional: true
				},
				{ token: DOCUMENT }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridRow,
			isStandalone: false,
			selector: "clr-dg-row",
			inputs: {
				detailDisabled: ["clrDgDetailDisabled", "detailDisabled"],
				detailHidden: ["clrDgDetailHidden", "detailHidden"],
				skeletonLoading: ["clrDgSkeletonLoading", "skeletonLoading"],
				treeExpandable: [
					"clrDgTreeExpandable",
					"treeExpandable",
					booleanAttribute
				],
				item: ["clrDgItem", "item"],
				clrDgSelectable: "clrDgSelectable",
				selected: ["clrDgSelected", "selected"],
				expanded: ["clrDgExpanded", "expanded"],
				clrDgDetailOpenLabel: "clrDgDetailOpenLabel",
				clrDgDetailCloseLabel: "clrDgDetailCloseLabel",
				clrDgRowSelectionLabel: "clrDgRowSelectionLabel"
			},
			outputs: {
				selectedChanged: "clrDgSelectedChange",
				expandedChange: "clrDgExpandedChange"
			},
			host: {
				attributes: { "role": "rowgroup" },
				properties: {
					"class.datagrid-row": "true",
					"class.datagrid-row-skeleton": "skeletonLoading",
					"class.datagrid-selected": "selected",
					"attr.aria-owns": "id"
				}
			},
			providers: [
				DatagridIfExpandService,
				{
					provide: IfExpandService,
					useExisting: DatagridIfExpandService
				},
				{
					provide: LoadingListener,
					useExisting: DatagridIfExpandService
				}
			],
			queries: [{
				propertyName: "dgCells",
				predicate: ClrDatagridCell
			}],
			viewQueries: [
				{
					propertyName: "expandAnimation",
					first: true,
					predicate: ClrExpandableAnimationDirective,
					descendants: true
				},
				{
					propertyName: "detailButton",
					first: true,
					predicate: ["detailButton"],
					descendants: true
				},
				{
					propertyName: "_stickyCells",
					first: true,
					predicate: ["stickyCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_pinnedCells",
					first: true,
					predicate: ["pinnedCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_scrollableCells",
					first: true,
					predicate: ["scrollableCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_calculatedCells",
					first: true,
					predicate: ["calculatedCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_fixedCellTemplate",
					first: true,
					predicate: ["fixedCellTemplate"],
					descendants: true
				}
			],
			usesOnChanges: true,
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@let treeNode = _tree?.node;\n<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n  [attr.aria-level]=\"treeNode?.level\"\n  [attr.aria-expanded]=\"treeNode?.expandable ? treeNode.expanded : null\"\n  [attr.aria-posinset]=\"treeNode ? tree.posInSet(treeNode) : null\"\n  [attr.aria-setsize]=\"treeNode ? tree.setSize(treeNode) : null\"\n  [attr.aria-busy]=\"(treeNode?.loading && treeNode.expanded) || null\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      @if (selection.selectionType === SELECTION_TYPE.Multi) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [indeterminate]=\"treeIndeterminate\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      } @if (selection.selectionType === SELECTION_TYPE.Single) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgIdentityFn]=\"identifyBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [ngModel]=\"selection.currentSingle\"\n            (ngModelChange)=\"selection.current = [$event]\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      } @if (rowActionService.hasActionableRow) {\n      <div class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      } @if (globalExpandable.hasExpandableRow) {\n      <div class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (expand.expandable) { @if (!expand.loading) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"toggleExpand($event)\"\n          type=\"button\"\n          class=\"datagrid-expandable-caret-button\"\n          [attr.aria-expanded]=\"expand.expanded\"\n          [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n        >\n          <cds-icon\n            shape=\"angle\"\n            class=\"datagrid-expandable-caret-icon\"\n            [direction]=\"expand.expanded ? 'down' : 'right'\"\n            [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n          ></cds-icon>\n        </button>\n        } @if (expand.loading) {\n        <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        } }\n      </div>\n      } @if (detailService.enabled) {\n      <div class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (!detailHidden) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"openDetails($event, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n        }\n      </div>\n      }\n    </ng-container>\n  </div>\n  <div\n    class=\"datagrid-row-scrollable\"\n    [ngClass]=\"{'is-replaced': replaced && expanded}\"\n    [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  >\n    <div class=\"datagrid-scrolling-cells\">\n      <div class=\"datagrid-pinned-cells\">\n        <ng-container #pinnedCells></ng-container>\n      </div>\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n\n    @if (!expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    }\n  </div>\n</div>\n<!--\nWe need the \"project into template\" hacks because we need this in 2 different places\ndepending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n",
			dependencies: [
				{
					kind: "directive",
					type: i7$1.NgClass,
					selector: "[ngClass]",
					inputs: ["class", "ngClass"]
				},
				{
					kind: "directive",
					type: i7$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i13.ClrRadio,
					selector: "[clrRadio]"
				},
				{
					kind: "component",
					type: i13.ClrRadioWrapper,
					selector: "clr-radio-wrapper"
				},
				{
					kind: "directive",
					type: i6$1.DefaultValueAccessor,
					selector: "input:not([type=checkbox]):not([ngNoCva])[formControlName],textarea:not([ngNoCva])[formControlName],input:not([type=checkbox]):not([ngNoCva])[formControl],textarea:not([ngNoCva])[formControl],input:not([type=checkbox]):not([ngNoCva])[ngModel],textarea:not([ngNoCva])[ngModel],[ngDefaultControl]"
				},
				{
					kind: "directive",
					type: i6$1.CheckboxControlValueAccessor,
					selector: "input[type=checkbox]:not([ngNoCva])[formControlName],input[type=checkbox]:not([ngNoCva])[formControl],input[type=checkbox]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i6$1.RadioControlValueAccessor,
					selector: "input[type=radio]:not([ngNoCva])[formControlName],input[type=radio]:not([ngNoCva])[formControl],input[type=radio]:not([ngNoCva])[ngModel]",
					inputs: [
						"name",
						"formControlName",
						"value"
					]
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
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
					kind: "directive",
					type: i1.ClrExpandableAnimationDirective,
					selector: "[clrExpandableAnimation]",
					inputs: ["clrExpandableAnimation"]
				},
				{
					kind: "component",
					type: i2$1.ClrSpinner,
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
					type: ClrDatagridSingleSelectionValueAccessor,
					selector: "input[type=radio][clrDgSingleSelectionRadio]",
					inputs: ["value", "clrDgIdentityFn"]
				},
				{
					kind: "directive",
					type: ClrDatagridSelectionCellDirective,
					selector: ".datagrid-select"
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
	type: ClrDatagridRow,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-row",
			host: {
				"[class.datagrid-row]": "true",
				"[class.datagrid-row-skeleton]": "skeletonLoading",
				"[class.datagrid-selected]": "selected",
				"[attr.aria-owns]": "id",
				role: "rowgroup"
			},
			providers: [
				DatagridIfExpandService,
				{
					provide: IfExpandService,
					useExisting: DatagridIfExpandService
				},
				{
					provide: LoadingListener,
					useExisting: DatagridIfExpandService
				}
			],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@let treeNode = _tree?.node;\n<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n  [attr.aria-level]=\"treeNode?.level\"\n  [attr.aria-expanded]=\"treeNode?.expandable ? treeNode.expanded : null\"\n  [attr.aria-posinset]=\"treeNode ? tree.posInSet(treeNode) : null\"\n  [attr.aria-setsize]=\"treeNode ? tree.setSize(treeNode) : null\"\n  [attr.aria-busy]=\"(treeNode?.loading && treeNode.expanded) || null\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      @if (selection.selectionType === SELECTION_TYPE.Multi) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [indeterminate]=\"treeIndeterminate\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      } @if (selection.selectionType === SELECTION_TYPE.Single) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgIdentityFn]=\"identifyBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [ngModel]=\"selection.currentSingle\"\n            (ngModelChange)=\"selection.current = [$event]\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      } @if (rowActionService.hasActionableRow) {\n      <div class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      } @if (globalExpandable.hasExpandableRow) {\n      <div class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (expand.expandable) { @if (!expand.loading) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"toggleExpand($event)\"\n          type=\"button\"\n          class=\"datagrid-expandable-caret-button\"\n          [attr.aria-expanded]=\"expand.expanded\"\n          [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n        >\n          <cds-icon\n            shape=\"angle\"\n            class=\"datagrid-expandable-caret-icon\"\n            [direction]=\"expand.expanded ? 'down' : 'right'\"\n            [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n          ></cds-icon>\n        </button>\n        } @if (expand.loading) {\n        <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        } }\n      </div>\n      } @if (detailService.enabled) {\n      <div class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (!detailHidden) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"openDetails($event, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n        }\n      </div>\n      }\n    </ng-container>\n  </div>\n  <div\n    class=\"datagrid-row-scrollable\"\n    [ngClass]=\"{'is-replaced': replaced && expanded}\"\n    [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  >\n    <div class=\"datagrid-scrolling-cells\">\n      <div class=\"datagrid-pinned-cells\">\n        <ng-container #pinnedCells></ng-container>\n      </div>\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n\n    @if (!expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    }\n  </div>\n</div>\n<!--\nWe need the \"project into template\" hacks because we need this in 2 different places\ndepending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n"
		}]
	}],
	ctorParameters: () => [
		{
			type: Selection,
			decorators: [{ type: Optional }]
		},
		{
			type: RowActionService,
			decorators: [{ type: Optional }]
		},
		{
			type: ExpandableRowsCount,
			decorators: [{ type: Optional }]
		},
		{ type: DatagridIfExpandService },
		{
			type: DetailService,
			decorators: [{ type: Optional }]
		},
		{
			type: DisplayModeService,
			decorators: [{ type: Optional }]
		},
		{ type: i0.ViewContainerRef },
		{ type: i0.Renderer2 },
		{ type: i0.ElementRef },
		{ type: i1.ClrCommonStringsService },
		{
			type: Items,
			decorators: [{ type: Optional }]
		},
		{
			type: ColumnsService,
			decorators: [{ type: Optional }]
		},
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		}
	],
	propDecorators: {
		selectedChanged: [{
			type: Output,
			args: ["clrDgSelectedChange"]
		}],
		expandedChange: [{
			type: Output,
			args: ["clrDgExpandedChange"]
		}],
		detailDisabled: [{
			type: Input,
			args: ["clrDgDetailDisabled"]
		}],
		detailHidden: [{
			type: Input,
			args: ["clrDgDetailHidden"]
		}],
		skeletonLoading: [{
			type: Input,
			args: ["clrDgSkeletonLoading"]
		}],
		treeExpandable: [{
			type: Input,
			args: [{
				alias: "clrDgTreeExpandable",
				transform: booleanAttribute
			}]
		}],
		dgCells: [{
			type: ContentChildren,
			args: [ClrDatagridCell]
		}],
		expandAnimation: [{
			type: ViewChild,
			args: [ClrExpandableAnimationDirective]
		}],
		detailButton: [{
			type: ViewChild,
			args: ["detailButton"]
		}],
		_stickyCells: [{
			type: ViewChild,
			args: ["stickyCells", { read: ViewContainerRef }]
		}],
		_pinnedCells: [{
			type: ViewChild,
			args: ["pinnedCells", { read: ViewContainerRef }]
		}],
		_scrollableCells: [{
			type: ViewChild,
			args: ["scrollableCells", { read: ViewContainerRef }]
		}],
		_calculatedCells: [{
			type: ViewChild,
			args: ["calculatedCells", { read: ViewContainerRef }]
		}],
		_fixedCellTemplate: [{
			type: ViewChild,
			args: ["fixedCellTemplate"]
		}],
		item: [{
			type: Input,
			args: ["clrDgItem"]
		}],
		clrDgSelectable: [{
			type: Input,
			args: ["clrDgSelectable"]
		}],
		selected: [{
			type: Input,
			args: ["clrDgSelected"]
		}],
		expanded: [{
			type: Input,
			args: ["clrDgExpanded"]
		}],
		clrDgDetailOpenLabel: [{ type: Input }],
		clrDgDetailCloseLabel: [{ type: Input }],
		clrDgRowSelectionLabel: [{ type: Input }]
	}
});
var ClrDatagridVirtualScrollDirective = class ClrDatagridVirtualScrollDirective {
	constructor(changeDetectorRef, iterableDiffers, items, ngZone, renderer2, templateRef, viewContainerRef, directionality, scrollDispatcher, viewportRuler, datagrid, injector) {
		this.changeDetectorRef = changeDetectorRef;
		this.iterableDiffers = iterableDiffers;
		this.items = items;
		this.ngZone = ngZone;
		this.renderer2 = renderer2;
		this.templateRef = templateRef;
		this.viewContainerRef = viewContainerRef;
		this.directionality = directionality;
		this.scrollDispatcher = scrollDispatcher;
		this.viewportRuler = viewportRuler;
		this.datagrid = datagrid;
		this.injector = injector;
		this.renderedRangeChange = new EventEmitter();
		this.persistItems = true;
		this._isUserProvidedItemSize = false;
		this._itemSize = 33;
		this._minBufferPx = 200;
		this._maxBufferPx = 400;
		this.shouldUpdateAriaRowIndexes = false;
		this.subscriptions = [];
		this.topIndex = 0;
		this.cdkInjectors = [];
		this.mutationChanges = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (!this._isUserProvidedItemSize && mutation.target.classList.contains("datagrid-compact") && this.itemSize > 25) this.updateItemSize(25);
			});
		});
		this.cdkVirtualForInputs = { cdkVirtualForTrackBy: (index) => index };
		items.smartenUp();
		datagrid.detailService.preventFocusScroll = true;
		this.datagridElementRef = datagrid.el;
		this.cdkVirtualForTemplateCacheSize = 20;
		const cellHeightToken = window.getComputedStyle(document.body).getPropertyValue("--clr-table-cell-height");
		const cellHeightValue = +/calc\(([0-9]+) \* calc\(\(1rem \/ 20\) \* 1\)\)/.exec(cellHeightToken)?.[1];
		const borderWidthToken = window.getComputedStyle(document.body).getPropertyValue("--clr-table-borderwidth");
		const rowHeightValue = cellHeightValue + +/calc\(([0-9]+) \* \(1rem \/ 20\)\)/.exec(borderWidthToken)?.[1];
		if (rowHeightValue && this.itemSize > rowHeightValue) this.updateItemSize(rowHeightValue);
		this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
			attributeFilter: ["class"],
			attributeOldValue: true
		});
		this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);
	}
	get totalContentHeight() {
		return this.virtualScrollViewport?._totalContentHeight() || "";
	}
	get cdkVirtualForOf() {
		return this.cdkVirtualForInputs.cdkVirtualForOf;
	}
	set cdkVirtualForOf(value) {
		this.cdkVirtualForInputs.cdkVirtualForOf = value;
		this.items.all = value;
		this.updateCdkVirtualForInputs();
	}
	get cdkVirtualForTrackBy() {
		return this.cdkVirtualForInputs.cdkVirtualForTrackBy;
	}
	set cdkVirtualForTrackBy(value) {
		this.cdkVirtualForInputs.cdkVirtualForTrackBy = value;
		this.updateCdkVirtualForInputs();
	}
	get cdkVirtualForTemplate() {
		return this?.cdkVirtualForInputs?.cdkVirtualForTemplate;
	}
	set cdkVirtualForTemplate(value) {
		this.cdkVirtualForInputs.cdkVirtualForTemplate = value;
		this.updateCdkVirtualForInputs();
	}
	get cdkVirtualForTemplateCacheSize() {
		return this.cdkVirtualForInputs.cdkVirtualForTemplateCacheSize;
	}
	set cdkVirtualForTemplateCacheSize(value) {
		this.cdkVirtualForInputs.cdkVirtualForTemplateCacheSize = coerceNumberProperty(value);
		this.updateCdkVirtualForInputs();
	}
	get itemSize() {
		return this._itemSize;
	}
	set itemSize(value) {
		this._isUserProvidedItemSize = true;
		this.updateItemSize(value);
	}
	get minBufferPx() {
		return this._minBufferPx;
	}
	set minBufferPx(value) {
		this._minBufferPx = coerceNumberProperty(value);
		this.updateFixedSizeVirtualScrollInputs();
	}
	get maxBufferPx() {
		return this._maxBufferPx;
	}
	set maxBufferPx(value) {
		this._maxBufferPx = coerceNumberProperty(value);
		this.updateFixedSizeVirtualScrollInputs();
	}
	set dataRange(range) {
		if (!range) return;
		if (this.items.smart) this.items.smartenDown();
		this.totalItems = range.total;
		this.updateDataRange(range.skip, range.data);
	}
	get totalItems() {
		return this._totalItems;
	}
	set totalItems(value) {
		this._totalItems = value;
	}
	ngAfterViewInit() {
		runInInjectionContext(this.injector, () => {
			this.virtualScrollViewport = this.createVirtualScrollViewportForDatagrid(this.changeDetectorRef, this.ngZone, this.renderer2, this.directionality, this.scrollDispatcher, this.viewportRuler, this.datagridElementRef, this.virtualScrollStrategy);
			this.cdkVirtualFor = this.createCdkVirtualForOfDirective(this.viewContainerRef, this.templateRef, this.iterableDiffers, this.virtualScrollViewport, this.ngZone);
			this.virtualScrollViewport.ngOnInit();
		});
		this.gridRoleElement = this.datagridElementRef.nativeElement.querySelector("[role=\"grid\"], [role=\"treegrid\"]");
		this.updateCdkVirtualForInputs();
		this.subscriptions.push(this.items.change.subscribe((newItems) => {
			if (this.items.smart) this.cdkVirtualFor.cdkVirtualForOf = newItems;
			this.shouldUpdateAriaRowIndexes = true;
		}), this.cdkVirtualFor.dataStream.subscribe((data) => {
			this.updateAriaRowCount(data.length);
		}), this.virtualScrollViewport.scrolledIndexChange.subscribe((index) => {
			this.topIndex = index;
		}), this.virtualScrollViewport.renderedRangeStream.subscribe((renderedRange) => {
			this.renderedRangeChange.emit(renderedRange);
			this.shouldUpdateAriaRowIndexes = true;
		}), this.datagrid.refresh.subscribe((datagridState) => {
			if (datagridState.filters) this.scrollToIndex(0);
		}));
	}
	ngDoCheck() {
		this.cdkVirtualFor?.ngDoCheck();
		if (this.shouldUpdateAriaRowIndexes) {
			this.updateAriaRowIndexes();
			this.shouldUpdateAriaRowIndexes = false;
		}
	}
	ngOnDestroy() {
		this.mutationChanges?.disconnect();
		this.subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});
		try {
			this.cdkInjectors.forEach((injector) => injector.destroy());
		} finally {
			this.cdkInjectors.length = 0;
		}
	}
	scrollUp(offset, behavior = "auto") {
		this.scrollToIndex(this.topIndex - offset, behavior);
	}
	scrollDown(offset, behavior = "auto") {
		this.scrollToIndex(this.topIndex + offset, behavior);
	}
	scrollToIndex(index, behavior = "auto") {
		this.virtualScrollViewport?.scrollToIndex(index, behavior);
	}
	updateDataRange(skip, data) {
		let items = this.cdkVirtualForOf;
		if (!this.persistItems || !items || items?.length !== this.totalItems) items = Array(this.totalItems);
		for (let i = 0; i < data.length; i++) items[skip + i] = data[i];
		this.cdkVirtualForOf = Array.from(items);
	}
	updateItemSize(value) {
		this._itemSize = coerceNumberProperty(value);
		this.updateFixedSizeVirtualScrollInputs();
	}
	updateCdkVirtualForInputs() {
		if (this.cdkVirtualFor) {
			for (const cdkVirtualForInputKey of Object.keys(this.cdkVirtualForInputs)) if (this.cdkVirtualFor[cdkVirtualForInputKey] !== this.cdkVirtualForInputs[cdkVirtualForInputKey]) this.cdkVirtualFor[cdkVirtualForInputKey] = this.cdkVirtualForInputs[cdkVirtualForInputKey];
		}
	}
	updateFixedSizeVirtualScrollInputs() {
		if (this.virtualScrollStrategy) this.virtualScrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
	}
	updateAriaRowCount(rowCount) {
		this.gridRoleElement?.setAttribute("aria-rowcount", rowCount.toString());
	}
	updateAriaRowIndexes() {
		for (let i = 0; i < this.viewContainerRef.length; i++) {
			const viewRef = this.viewContainerRef.get(i);
			const rowRoleElement = viewRef.rootNodes.find((rowElement) => rowElement.tagName === "CLR-DG-ROW")?.querySelector("[role=\"row\"]");
			const newAriaRowIndex = (viewRef.context.index + 1).toString();
			if (rowRoleElement?.getAttribute("aria-rowindex") !== newAriaRowIndex) rowRoleElement?.setAttribute("aria-rowindex", newAriaRowIndex);
		}
	}
	createVirtualScrollViewportForDatagrid(changeDetectorRef, ngZone, renderer2, directionality, scrollDispatcher, viewportRuler, datagridElementRef, virtualScrollStrategy) {
		const datagridContentElement = datagridElementRef.nativeElement.querySelector(".datagrid-content");
		const datagridRowsElement = datagridElementRef.nativeElement.querySelector(".datagrid-rows");
		return this.createCdkVirtualScrollViewport(new ElementRef(datagridContentElement), new ElementRef(datagridRowsElement), changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, null);
	}
	createCdkVirtualScrollViewport(datagridDivElementRef, contentWrapper, changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, scrollable) {
		const injector = createEnvironmentInjector([
			{
				provide: ElementRef,
				useValue: datagridDivElementRef
			},
			{
				provide: ChangeDetectorRef,
				useValue: changeDetectorRef
			},
			{
				provide: NgZone,
				useValue: ngZone
			},
			{
				provide: Renderer2,
				useValue: renderer2
			},
			{
				provide: VIRTUAL_SCROLL_STRATEGY,
				useValue: virtualScrollStrategy
			},
			{
				provide: CdkVirtualScrollable,
				useValue: scrollable
			},
			{
				provide: CdkVirtualScrollViewport,
				useClass: CdkVirtualScrollViewport
			}
		], this.createApplicationInjector(directionality, scrollDispatcher, viewportRuler));
		const virtualScrollViewport = injector.get(CdkVirtualScrollViewport);
		virtualScrollViewport._contentWrapper = contentWrapper;
		this.cdkInjectors.push(injector);
		return virtualScrollViewport;
	}
	createApplicationInjector(directionality, scrollDispatcher, viewportRuler) {
		return createEnvironmentInjector([
			{
				provide: Directionality,
				useValue: directionality
			},
			{
				provide: ScrollDispatcher,
				useValue: scrollDispatcher
			},
			{
				provide: ViewportRuler,
				useValue: viewportRuler
			}
		], inject(EnvironmentInjector));
	}
	createCdkVirtualForOfDirective(viewContainerRef, templateRef, iterableDiffers, virtualScrollViewport, ngZone) {
		const virtualScrollViewportInjector = createEnvironmentInjector([{
			provide: CDK_VIRTUAL_SCROLL_VIEWPORT,
			useValue: virtualScrollViewport
		}], inject(EnvironmentInjector));
		const cdkVirtualForInjector = createEnvironmentInjector([
			{
				provide: ViewContainerRef,
				useValue: viewContainerRef
			},
			{
				provide: TemplateRef,
				useValue: templateRef
			},
			{
				provide: IterableDiffers,
				useValue: iterableDiffers
			},
			{
				provide: NgZone,
				useValue: ngZone
			},
			{
				provide: CdkVirtualForOf,
				useClass: CdkVirtualForOf
			}
		], virtualScrollViewportInjector);
		this.cdkInjectors.unshift(cdkVirtualForInjector);
		return cdkVirtualForInjector.get(CdkVirtualForOf);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridVirtualScrollDirective,
			deps: [
				{ token: i0.ChangeDetectorRef },
				{ token: i0.IterableDiffers },
				{ token: Items },
				{ token: i0.NgZone },
				{ token: i0.Renderer2 },
				{ token: i0.TemplateRef },
				{ token: i0.ViewContainerRef },
				{ token: i2.Directionality },
				{ token: i3.ScrollDispatcher },
				{ token: i3.ViewportRuler },
				{ token: forwardRef(() => ClrDatagrid) },
				{ token: i0.EnvironmentInjector }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridVirtualScrollDirective,
			isStandalone: false,
			selector: "[clrVirtualScroll],[ClrVirtualScroll]",
			inputs: {
				persistItems: ["clrVirtualPersistItems", "persistItems"],
				cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"],
				cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"],
				cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"],
				cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"],
				itemSize: ["clrVirtualRowsItemSize", "itemSize"],
				minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"],
				maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"],
				dataRange: ["clrVirtualDataRange", "dataRange"]
			},
			outputs: { renderedRangeChange: "renderedRangeChange" },
			providers: [Items],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridVirtualScrollDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrVirtualScroll],[ClrVirtualScroll]",
			providers: [Items],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ChangeDetectorRef },
		{ type: i0.IterableDiffers },
		{ type: Items },
		{ type: i0.NgZone },
		{ type: i0.Renderer2 },
		{ type: i0.TemplateRef },
		{ type: i0.ViewContainerRef },
		{ type: i2.Directionality },
		{ type: i3.ScrollDispatcher },
		{ type: i3.ViewportRuler },
		{
			type: ClrDatagrid,
			decorators: [{
				type: Inject,
				args: [forwardRef(() => ClrDatagrid)]
			}]
		},
		{ type: i0.EnvironmentInjector }
	],
	propDecorators: {
		renderedRangeChange: [{ type: Output }],
		persistItems: [{
			type: Input,
			args: ["clrVirtualPersistItems"]
		}],
		cdkVirtualForOf: [{
			type: Input,
			args: ["clrVirtualRowsOf"]
		}],
		cdkVirtualForTrackBy: [{
			type: Input,
			args: ["clrVirtualRowsTrackBy"]
		}],
		cdkVirtualForTemplate: [{
			type: Input,
			args: ["clrVirtualRowsTemplate"]
		}],
		cdkVirtualForTemplateCacheSize: [{
			type: Input,
			args: ["clrVirtualRowsTemplateCacheSize"]
		}],
		itemSize: [{
			type: Input,
			args: ["clrVirtualRowsItemSize"]
		}],
		minBufferPx: [{
			type: Input,
			args: ["clrVirtualRowsMinBufferPx"]
		}],
		maxBufferPx: [{
			type: Input,
			args: ["clrVirtualRowsMaxBufferPx"]
		}],
		dataRange: [{
			type: Input,
			args: ["clrVirtualDataRange"]
		}]
	}
});
var StateProvider = class StateProvider {
	constructor(filters, sort, page, debouncer) {
		this.filters = filters;
		this.sort = sort;
		this.page = page;
		this.debouncer = debouncer;
		this.change = this.debouncer.change.pipe(map(() => this.state));
	}
	get state() {
		const state = {};
		if (this.page.size > 0) state.page = {
			from: this.page.firstItem,
			to: this.page.lastItem,
			size: this.page.size,
			current: this.page.current
		};
		if (this.sort.comparator) {
			if (this.sort.comparator instanceof DatagridPropertyComparator) state.sort = {
				by: this.sort.comparator.prop,
				reverse: this.sort.reverse
			};
			else state.sort = {
				by: this.sort.comparator,
				reverse: this.sort.reverse
			};
		}
		const activeFilters = this.filters.getActiveFilters();
		if (activeFilters.length > 0) {
			state.filters = [];
			for (const filter of activeFilters) if (filter.state) state.filters.push(filter.state);
			else state.filters.push(filter);
		}
		return state;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StateProvider,
			deps: [
				{ token: FiltersProvider },
				{ token: Sort },
				{ token: Page },
				{ token: StateDebouncer }
			],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StateProvider
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: StateProvider,
	decorators: [{ type: Injectable }],
	ctorParameters: () => [
		{ type: FiltersProvider },
		{ type: Sort },
		{ type: Page },
		{ type: StateDebouncer }
	]
});
var DatagridCellRenderer = class DatagridCellRenderer {
	constructor(el, renderer, organizer) {
		this.el = el;
		this.renderer = renderer;
		this.subscriptions = [];
		this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth()));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		if (this.stateSubscription) this.stateSubscription.unsubscribe();
	}
	resetState(state) {
		this.setWidth(state);
		this.setHidden(state);
		this.setPinned(state);
	}
	setWidth(state) {
		if (state.strictWidth) this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
		else this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
		this.renderer.setStyle(this.el.nativeElement, "width", state.width + "px");
	}
	setHidden(state) {
		if (state.hidden) this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
		else this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
	}
	setPinned(state) {
		if (state.pinned) this.renderer.addClass(this.el.nativeElement, PINNED_COLUMN_CLASS);
		else this.renderer.removeClass(this.el.nativeElement, PINNED_COLUMN_CLASS);
	}
	clearWidth() {
		this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
		this.renderer.setStyle(this.el.nativeElement, "width", null);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridCellRenderer,
			deps: [
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: DatagridRenderOrganizer }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridCellRenderer,
			isStandalone: false,
			selector: "clr-dg-cell",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridCellRenderer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-dg-cell",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: DatagridRenderOrganizer }
	]
});
var DatagridRowRenderer = class DatagridRowRenderer {
	constructor(columnsService, el) {
		this.columnsService = columnsService;
		this.el = el;
		this.expandableRows = [];
		this.subscriptions = [];
		afterNextRender(() => this.addDetachedRowsColumnStateChangesListener());
	}
	ngAfterContentInit() {
		this.setCellsState();
		this.subscriptions.push(this.cells.changes.subscribe(() => {
			this.setCellsState();
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	setCellsState() {
		if (this.cells.length === this.columnsService.columns.length) this.cells.forEach((cell, index) => {
			if (this.columnsService.columns[index]) cell.resetState(this.columnsService.columns[index].value);
		});
	}
	addDetachedRowsColumnStateChangesListener() {
		this.subscriptions.push(this.columnsService.columnsStateChange.subscribe(() => {
			if (!this.el.nativeElement.isConnected) this.setCellsState();
		}));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridRowRenderer,
			deps: [{ token: ColumnsService }, { token: i0.ElementRef }],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridRowRenderer,
			isStandalone: false,
			selector: "clr-dg-row",
			queries: [{
				propertyName: "cells",
				predicate: DatagridCellRenderer
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridRowRenderer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-dg-row",
			standalone: false
		}]
	}],
	ctorParameters: () => [{ type: ColumnsService }, { type: i0.ElementRef }],
	propDecorators: { cells: [{
		type: ContentChildren,
		args: [DatagridCellRenderer]
	}] }
});
var ClrDatagrid = class ClrDatagrid {
	constructor(organizer, items, expandableRows, selection, rowActionService, stateProvider, displayMode, renderer, detailService, document, el, page, commonStrings, keyNavigation, zone, columnsService) {
		this.organizer = organizer;
		this.items = items;
		this.expandableRows = expandableRows;
		this.selection = selection;
		this.rowActionService = rowActionService;
		this.stateProvider = stateProvider;
		this.displayMode = displayMode;
		this.renderer = renderer;
		this.detailService = detailService;
		this.document = document;
		this.el = el;
		this.page = page;
		this.commonStrings = commonStrings;
		this.keyNavigation = keyNavigation;
		this.zone = zone;
		this.columnsService = columnsService;
		this.clrDgSingleSelectionAriaLabel = this.commonStrings.keys.singleSelectionAriaLabel;
		this.clrDgSingleActionableAriaLabel = this.commonStrings.keys.singleActionableAriaLabel;
		this.clrDetailExpandableAriaLabel = this.commonStrings.keys.detailExpandableAriaLabel;
		this.clrDgDisablePageFocus = false;
		this.selectedChanged = new EventEmitter(false);
		this.refresh = new EventEmitter(false);
		this.customSelectAllEnabled = false;
		this.selectAllDisabled = false;
		this.customSelectAll = new EventEmitter();
		this.SELECTION_TYPE = SelectionType;
		this.tree = inject(DatagridTreeService);
		this._subscriptions = [];
		this.focusToRestore = null;
		this._virtualScrollSubscriptions = [];
		this.fixedColumnViews = [];
		this.cachedRowsHeight = 0;
		this.cachedContentHeight = 0;
		this.resizeObserver = new ResizeObserver((entries) => {
			requestAnimationFrame(() => {
				this.handleResizeChanges(entries);
			});
		});
		this.rowControlsObserver = new ResizeObserver(() => this.updateRowControlsWidth());
		const datagridId = uniqueIdFactory();
		this.selectAllId = "clr-dg-select-all-" + datagridId;
		detailService.id = datagridId;
	}
	get loading() {
		return this.items.loading;
	}
	set loading(value) {
		this.items.loading = value;
	}
	get selectionType() {
		return this.selection.selectionType;
	}
	set selectionType(value) {
		this.selection.selectionType = value;
	}
	set selected(value) {
		value = value || [];
		if (value === this.selection.current) return;
		this.selection.updateCurrent(value, false);
	}
	set clrDgPreserveSelection(state) {
		this.selection.preserveSelection = state;
	}
	set rowSelectionMode(value) {
		this.selection.rowSelectionMode = value;
	}
	set identityFn(value) {
		this.items.identifyBy = value;
	}
	get allSelected() {
		return this.selection.isAllSelected();
	}
	set allSelected(value) {
		if (this.customSelectAllEnabled) this.customSelectAll.emit(value);
		else if (this.tree.cascading) this.tree.toggleAll();
		else this.selection.toggleAll();
	}
	get virtualScroll() {
		return this._virtualScroll?.get(0);
	}
	get isDetailOverlay() {
		return this.detailService.detailWidth === 100;
	}
	ngAfterContentInit() {
		if (!this.items.smart) this.items.all = this.rows.map((row) => row.item);
		const rowItemsChanges = this.rows.changes.pipe(switchMap((rows) => merge(of(rows.map((row) => row.item)), combineLatest(rows.map((row) => row.itemChanges)).pipe(debounceTime(0)))));
		this._subscriptions.push(rowItemsChanges.subscribe((all) => {
			if (!this.items.smart) this.items.all = all;
		}), this._virtualScroll.changes.subscribe(() => {
			this.toggleVirtualScrollSubscriptions();
		}), this.rows.changes.subscribe(() => {
			for (let i = this._displayedRows.length - 1; i >= 0; i--) {
				const view = this._displayedRows.get(i);
				if (view.destroyed) this._displayedRows.remove(i);
				else if (!view.rootNodes[0]?.isConnected) this._displayedRows.detach(i);
			}
			const focused = this._focusedElement();
			this.rows.forEach((row, index) => {
				if (this._displayedRows.indexOf(row._view) !== index) this._displayedRows.insert(row._view, index);
			});
			if (focused?.isConnected && focused !== this._focusedElement()) focused.focus({ preventScroll: true });
			this.updateDetailState();
			if (this.virtualScroll && this.activeCellCoords) this.zone.runOutsideAngular(() => {
				const row = Array.from(this.rows).find((row) => {
					return row.el.nativeElement.children[0].ariaRowIndex === this.activeCellCoords.ariaRowIndex;
				});
				if (!row) return;
				const activeCell = row.el.nativeElement.querySelectorAll(this.keyNavigation.config.keyGridCells)[this.activeCellCoords.x];
				this.keyNavigation.setActiveCell(activeCell);
				this.keyNavigation.focusElement(activeCell, { preventScroll: true });
			});
		}));
	}
	ngAfterViewInit() {
		this.keyNavigation.initializeKeyGrid(this.el.nativeElement);
		this.updateDetailState();
		this.zone.runOutsideAngular(() => this.rowControlsObserver.observe(this.rowControls.nativeElement));
		if (Object.keys(this.stateProvider.state).length > 0) this.refresh.emit(this.stateProvider.state);
		this._subscriptions.push(this.stickyHeaders.changes.subscribe(() => this.resize()), this.stateProvider.change.subscribe((state) => this.refresh.emit(state)), this.selection.change.subscribe((selection) => {
			if (this.selection.selectable) this.selectedChanged.emit(selection);
		}), this.page.change.subscribe(() => {
			this.keyNavigation.resetKeyGrid();
			if (!this.clrDgDisablePageFocus) this.datagridTable.nativeElement.focus();
		}), this.displayMode.view.subscribe((viewChange) => {
			this.focusToRestore = this._focusedElement() || this.focusToRestore;
			for (let i = this._projectedDisplayColumns.length; i > 0; i--) this._projectedDisplayColumns.detach();
			for (let i = this._projectedStickyColumns.length; i > 0; i--) this._projectedStickyColumns.detach();
			this.destroyFixedColumnViews();
			for (let i = this._projectedCalculationColumns.length; i > 0; i--) this._projectedCalculationColumns.detach();
			for (let i = this._calculationRows.length; i > 0; i--) this._calculationRows.detach();
			for (let i = this._displayedRows.length; i > 0; i--) this._displayedRows.detach();
			if (viewChange === DatagridDisplayMode.DISPLAY) {
				this.renderer.removeClass(this.el.nativeElement, "datagrid-calculate-mode");
				this.columns.forEach((column, index) => {
					(this.columnsService.isPinned(index) ? this._projectedStickyColumns : this._projectedDisplayColumns).insert(column._view);
				});
				this.rows.forEach((row) => {
					this._displayedRows.insert(row._view);
				});
				this.restoreFocus();
				this.updateRowControlsWidth();
			} else {
				this.renderer.addClass(this.el.nativeElement, "datagrid-calculate-mode");
				[
					this.rowActionService.hasActionableRow,
					this.selection.selectionType !== this.SELECTION_TYPE.None,
					this.expandableRows.hasExpandableRow || this.detailService.enabled
				].filter(Boolean).forEach(() => {
					const fixedColumnView = this._fixedColumnTemplate.createEmbeddedView(null);
					this.fixedColumnViews.push(fixedColumnView);
					this._projectedCalculationColumns.insert(fixedColumnView);
				});
				this.columns.forEach((column) => {
					this._projectedCalculationColumns.insert(column._view);
				});
				this.rows.forEach((row) => {
					this._calculationRows.insert(row._view);
				});
			}
		}));
		if (this.virtualScroll) this.toggleVirtualScrollSubscriptions();
		this.zone.runOutsideAngular(() => {
			this._subscriptions.push(fromEvent(this.document.body, "keydown").subscribe((event) => {
				if (event.key === "Shift") this.selection.shiftPressed = true;
			}), fromEvent(this.document.body, "keyup").subscribe((event) => {
				if (event.key === "Shift") this.selection.shiftPressed = false;
			}));
		});
	}
	ngDoCheck() {
		this.selection.checkForChanges();
	}
	ngOnDestroy() {
		this.destroyFixedColumnViews();
		this._subscriptions.forEach((sub) => sub.unsubscribe());
		this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
		this.resizeObserver.disconnect();
		this.rowControlsObserver.disconnect();
		if (this.detailService.isOpen) this.detailService.close();
	}
	toggleAllSelected($event) {
		$event.preventDefault();
		this.selectAllCheckbox?.nativeElement.click();
	}
	resize() {
		this.organizer.resize();
	}
	updateDetailState() {
		if (this.detailService.state && this.detailService.isOpen) {
			const row = this.rows.find((row) => this.items.identifyBy(row.item) === this.items.identifyBy(this.detailService.state));
			if (row) this.detailService.open(row.item, row.detailButton.nativeElement);
			else if (!this.virtualScroll) setTimeout(() => {
				this.detailService.close();
			});
		}
	}
	dataChanged() {
		this.items.refresh();
	}
	reloadTreeChildren(item) {
		this.tree.reload(item);
	}
	expandAllTreeRows() {
		const rendered = this.rows.map((row) => row.item);
		this.tree.expandAll(rendered);
	}
	collapseAllTreeRows() {
		this.tree.collapseAll(this.rows.map((row) => row.item));
	}
	_focusedElement() {
		const active = this.el.nativeElement.ownerDocument.activeElement;
		return active && this.el.nativeElement.contains(active) ? active : null;
	}
	_focusLost() {
		const document = this.el.nativeElement.ownerDocument;
		return !document.activeElement || document.activeElement === document.body;
	}
	restoreFocus() {
		const element = this.focusToRestore;
		this.focusToRestore = null;
		if (element?.isConnected && this._focusLost()) element.focus({ preventScroll: true });
	}
	destroyFixedColumnViews() {
		this.fixedColumnViews.forEach((view) => {
			if (!view.destroyed) view.destroy();
		});
		this.fixedColumnViews = [];
	}
	toggleVirtualScrollSubscriptions() {
		const hasVirtualScroll = !!this.virtualScroll;
		this.keyNavigation.preventScrollOnFocus = hasVirtualScroll;
		if (hasVirtualScroll && this._virtualScrollSubscriptions.length === 0) {
			this.resizeObserver.observe(this.contentWrapper.nativeElement);
			this.resizeObserver.observe(this.rowsWrapper.nativeElement);
			this._virtualScrollSubscriptions.push(fromEvent(this.contentWrapper.nativeElement, "scroll").subscribe(() => {
				if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) this.datagridHeader.nativeElement.scrollLeft = this.contentWrapper.nativeElement.scrollLeft;
			}), fromEvent(this.datagridHeader.nativeElement, "scroll").subscribe(() => {
				if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) this.contentWrapper.nativeElement.scrollLeft = this.datagridHeader.nativeElement.scrollLeft;
			}), this.keyNavigation.nextCellCoordsEmitter.subscribe((cellCoords) => {
				if (!cellCoords?.ariaRowIndex) {
					this.activeCellCoords = null;
					return;
				}
				if (cellCoords.ariaRowIndex === this.activeCellCoords?.ariaRowIndex) {
					this.activeCellCoords = cellCoords;
					return;
				}
				this.activeCellCoords = cellCoords;
				const rowIndex = Number(cellCoords.ariaRowIndex) - 1;
				this.virtualScroll.scrollToIndex(rowIndex);
			}));
		} else if (!hasVirtualScroll) {
			this.resizeObserver.disconnect();
			this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
			this._virtualScrollSubscriptions = [];
		}
	}
	updateRowControlsWidth() {
		const headerControls = this.rowControls?.nativeElement;
		if (!headerControls || !this.datagridHeader || !this.columnsService.hasPinnedColumns) return;
		const rowControls = this.rowsWrapper.nativeElement.querySelector(".datagrid-row-master > .datagrid-row-sticky:not(.datagrid-row-sticky-scroll)");
		const headerWidth = headerControls.getBoundingClientRect().width;
		const rowWidth = (rowControls || headerControls).getBoundingClientRect().width;
		this.setRowControlsWidth(this.datagridHeader.nativeElement, headerWidth);
		this.setRowControlsWidth(this.rowsWrapper.nativeElement, rowWidth);
	}
	setRowControlsWidth(target, width) {
		this.renderer.setStyle(target, "--clr-datagrid-row-controls-width", `${width}px`, RendererStyleFlags2.DashCase);
	}
	handleResizeChanges(entries) {
		const rowsWrapper = this.rowsWrapper.nativeElement;
		for (const entry of entries) {
			if (entry.target === this.contentWrapper.nativeElement) this.cachedContentHeight = entry.contentRect.height;
			if (entry.target === rowsWrapper) this.cachedRowsHeight = entry.contentRect.height;
		}
		const scrollClass = "datagrid-scrollbar-visible";
		if (this.cachedRowsHeight > this.cachedContentHeight) this.renderer.addClass(rowsWrapper, scrollClass);
		else this.renderer.removeClass(rowsWrapper, scrollClass);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagrid,
			deps: [
				{ token: DatagridRenderOrganizer },
				{ token: Items },
				{ token: ExpandableRowsCount },
				{ token: Selection },
				{ token: RowActionService },
				{ token: StateProvider },
				{ token: DisplayModeService },
				{ token: i0.Renderer2 },
				{ token: DetailService },
				{ token: DOCUMENT },
				{ token: i0.ElementRef },
				{ token: Page },
				{ token: i1.ClrCommonStringsService },
				{ token: KeyNavigationGridController },
				{ token: i0.NgZone },
				{ token: ColumnsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagrid,
			isStandalone: false,
			selector: "clr-datagrid",
			inputs: {
				loadingMoreItems: ["clrLoadingMoreItems", "loadingMoreItems"],
				clrDgSingleSelectionAriaLabel: "clrDgSingleSelectionAriaLabel",
				clrDgSingleActionableAriaLabel: "clrDgSingleActionableAriaLabel",
				clrDetailExpandableAriaLabel: "clrDetailExpandableAriaLabel",
				clrDgDisablePageFocus: "clrDgDisablePageFocus",
				customSelectAllEnabled: ["clrDgCustomSelectAllEnabled", "customSelectAllEnabled"],
				selectAllDisabled: ["clrDgSelectAllDisabled", "selectAllDisabled"],
				loading: ["clrDgLoading", "loading"],
				selectionType: [
					"clrDgSelectionType",
					"selectionType",
					selectionTypeAttribute
				],
				selected: ["clrDgSelected", "selected"],
				clrDgPreserveSelection: "clrDgPreserveSelection",
				rowSelectionMode: ["clrDgRowSelection", "rowSelectionMode"],
				identityFn: ["clrDgItemsIdentityFn", "identityFn"]
			},
			outputs: {
				selectedChanged: "clrDgSelectedChange",
				refresh: "clrDgRefresh",
				customSelectAll: "clrDgCustomSelectAll"
			},
			host: { properties: {
				"class.datagrid-host": "true",
				"class.datagrid-detail-open": "detailService.isOpen",
				"class.datagrid-detail-overlay": "isDetailOverlay",
				"class.datagrid-virtual-scroll": "!!virtualScroll"
			} },
			providers: [
				Selection,
				Sort,
				FiltersProvider,
				Page,
				Items,
				DatagridRenderOrganizer,
				RowActionService,
				ExpandableRowsCount,
				StateDebouncer,
				DetailService,
				StateProvider,
				TableSizeService,
				ColumnsService,
				DisplayModeService,
				KeyNavigationGridController,
				DatagridTreeService
			],
			queries: [
				{
					propertyName: "iterator",
					first: true,
					predicate: ClrDatagridItems,
					descendants: true
				},
				{
					propertyName: "placeholder",
					first: true,
					predicate: ClrDatagridPlaceholder,
					descendants: true
				},
				{
					propertyName: "_virtualScroll",
					predicate: i0.forwardRef(() => ClrDatagridVirtualScrollDirective)
				},
				{
					propertyName: "columns",
					predicate: ClrDatagridColumn
				},
				{
					propertyName: "rows",
					predicate: ClrDatagridRow,
					emitDistinctChangesOnly: false
				}
			],
			viewQueries: [
				{
					propertyName: "datagrid",
					first: true,
					predicate: ["datagrid"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "datagridTable",
					first: true,
					predicate: ["datagridTable"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "datagridHeader",
					first: true,
					predicate: ["datagridHeader"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "contentWrapper",
					first: true,
					predicate: ["contentWrapper"],
					descendants: true,
					read: ElementRef,
					static: true
				},
				{
					propertyName: "rowsWrapper",
					first: true,
					predicate: ["rowsWrapper"],
					descendants: true,
					read: ElementRef,
					static: true
				},
				{
					propertyName: "scrollableColumns",
					first: true,
					predicate: ["scrollableColumns"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_projectedDisplayColumns",
					first: true,
					predicate: ["projectedDisplayColumns"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_projectedStickyColumns",
					first: true,
					predicate: ["projectedStickyColumns"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_projectedCalculationColumns",
					first: true,
					predicate: ["projectedCalculationColumns"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_displayedRows",
					first: true,
					predicate: ["displayedRows"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_calculationRows",
					first: true,
					predicate: ["calculationRows"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_fixedColumnTemplate",
					first: true,
					predicate: ["fixedColumnTemplate"],
					descendants: true
				},
				{
					propertyName: "selectAllCheckbox",
					first: true,
					predicate: ["selectAllCheckbox"],
					descendants: true
				},
				{
					propertyName: "rowControls",
					first: true,
					predicate: ["rowControls"],
					descendants: true,
					read: ElementRef
				},
				{
					propertyName: "stickyHeaders",
					predicate: ["stickyHeader"],
					descendants: true
				}
			],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div [attr.role]=\"tree.enabled() ? 'treegrid' : 'grid'\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\" #rowControls>\n                  <!--header for datagrid where you can select multiple rows -->\n                  @if (selection.selectionType === SELECTION_TYPE.Multi) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    @if (!virtualScroll || customSelectAllEnabled) {\n                    <div class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                          which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                        [attr.disabled]=\"selectAllDisabled ? true : null\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n                    }\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for datagrid where you can select one row only -->\n                  @if (selection.selectionType === SELECTION_TYPE.Single) {\n                  <div #stickyHeader role=\"columnheader\" class=\"datagrid-column datagrid-select datagrid-fixed-column\">\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  @if (rowActionService.hasActionableRow) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  @if (expandableRows.hasExpandableRow || detailService.enabled) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <div class=\"datagrid-pinned-cells\">\n                    <ng-container #projectedStickyColumns></ng-container>\n                  </div>\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                @if (virtualScroll) {\n                <div class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n                }\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            @if (virtualScroll) {\n            <div class=\"datagrid-content-virtual-spacer\" [style.height]=\"virtualScroll?.totalContentHeight\"></div>\n            }\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <ng-container #displayedRows></ng-container>\n\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              @if (!placeholder) {\n              <clr-dg-placeholder></clr-dg-placeholder>\n              }\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    @if (loading) {\n    <div class=\"datagrid-spinner\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n    }\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n",
			dependencies: [
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i6$1.CheckboxControlValueAccessor,
					selector: "input[type=checkbox]:not([ngNoCva])[formControlName],input[type=checkbox]:not([ngNoCva])[formControl],input[type=checkbox]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
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
					type: i2$1.ClrSpinner,
					selector: "clr-spinner",
					inputs: [
						"clrInline",
						"clrInverse",
						"clrSmall",
						"clrMedium"
					]
				},
				{
					kind: "component",
					type: ClrDatagridCell,
					selector: "clr-dg-cell"
				},
				{
					kind: "component",
					type: ClrDatagridPlaceholder,
					selector: "clr-dg-placeholder"
				},
				{
					kind: "component",
					type: ClrDatagridRow,
					selector: "clr-dg-row",
					inputs: [
						"clrDgDetailDisabled",
						"clrDgDetailHidden",
						"clrDgSkeletonLoading",
						"clrDgTreeExpandable",
						"clrDgItem",
						"clrDgSelectable",
						"clrDgSelected",
						"clrDgExpanded",
						"clrDgDetailOpenLabel",
						"clrDgDetailCloseLabel",
						"clrDgRowSelectionLabel"
					],
					outputs: ["clrDgSelectedChange", "clrDgExpandedChange"]
				},
				{
					kind: "directive",
					type: ClrDatagridSelectionCellDirective,
					selector: ".datagrid-select"
				},
				{
					kind: "directive",
					type: DatagridCellRenderer,
					selector: "clr-dg-cell"
				},
				{
					kind: "directive",
					type: DatagridRowRenderer,
					selector: "clr-dg-row"
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
	type: ClrDatagrid,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-datagrid",
			providers: [
				Selection,
				Sort,
				FiltersProvider,
				Page,
				Items,
				DatagridRenderOrganizer,
				RowActionService,
				ExpandableRowsCount,
				StateDebouncer,
				DetailService,
				StateProvider,
				TableSizeService,
				ColumnsService,
				DisplayModeService,
				KeyNavigationGridController,
				DatagridTreeService
			],
			host: {
				"[class.datagrid-host]": "true",
				"[class.datagrid-detail-open]": "detailService.isOpen",
				"[class.datagrid-detail-overlay]": "isDetailOverlay",
				"[class.datagrid-virtual-scroll]": "!!virtualScroll"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div [attr.role]=\"tree.enabled() ? 'treegrid' : 'grid'\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\" #rowControls>\n                  <!--header for datagrid where you can select multiple rows -->\n                  @if (selection.selectionType === SELECTION_TYPE.Multi) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    @if (!virtualScroll || customSelectAllEnabled) {\n                    <div class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                          which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                        [attr.disabled]=\"selectAllDisabled ? true : null\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n                    }\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for datagrid where you can select one row only -->\n                  @if (selection.selectionType === SELECTION_TYPE.Single) {\n                  <div #stickyHeader role=\"columnheader\" class=\"datagrid-column datagrid-select datagrid-fixed-column\">\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  @if (rowActionService.hasActionableRow) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  @if (expandableRows.hasExpandableRow || detailService.enabled) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <div class=\"datagrid-pinned-cells\">\n                    <ng-container #projectedStickyColumns></ng-container>\n                  </div>\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                @if (virtualScroll) {\n                <div class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n                }\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            @if (virtualScroll) {\n            <div class=\"datagrid-content-virtual-spacer\" [style.height]=\"virtualScroll?.totalContentHeight\"></div>\n            }\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <ng-container #displayedRows></ng-container>\n\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              @if (!placeholder) {\n              <clr-dg-placeholder></clr-dg-placeholder>\n              }\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    @if (loading) {\n    <div class=\"datagrid-spinner\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n    }\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n"
		}]
	}],
	ctorParameters: () => [
		{ type: DatagridRenderOrganizer },
		{ type: Items },
		{ type: ExpandableRowsCount },
		{ type: Selection },
		{ type: RowActionService },
		{ type: StateProvider },
		{ type: DisplayModeService },
		{ type: i0.Renderer2 },
		{ type: DetailService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [DOCUMENT]
			}]
		},
		{ type: i0.ElementRef },
		{ type: Page },
		{ type: i1.ClrCommonStringsService },
		{ type: KeyNavigationGridController },
		{ type: i0.NgZone },
		{ type: ColumnsService }
	],
	propDecorators: {
		loadingMoreItems: [{
			type: Input,
			args: ["clrLoadingMoreItems"]
		}],
		clrDgSingleSelectionAriaLabel: [{ type: Input }],
		clrDgSingleActionableAriaLabel: [{ type: Input }],
		clrDetailExpandableAriaLabel: [{ type: Input }],
		clrDgDisablePageFocus: [{ type: Input }],
		selectedChanged: [{
			type: Output,
			args: ["clrDgSelectedChange"]
		}],
		refresh: [{
			type: Output,
			args: ["clrDgRefresh"]
		}],
		customSelectAllEnabled: [{
			type: Input,
			args: ["clrDgCustomSelectAllEnabled"]
		}],
		selectAllDisabled: [{
			type: Input,
			args: ["clrDgSelectAllDisabled"]
		}],
		customSelectAll: [{
			type: Output,
			args: ["clrDgCustomSelectAll"]
		}],
		_virtualScroll: [{
			type: ContentChildren,
			args: [forwardRef(() => ClrDatagridVirtualScrollDirective)]
		}],
		iterator: [{
			type: ContentChild,
			args: [ClrDatagridItems]
		}],
		placeholder: [{
			type: ContentChild,
			args: [ClrDatagridPlaceholder]
		}],
		columns: [{
			type: ContentChildren,
			args: [ClrDatagridColumn]
		}],
		rows: [{
			type: ContentChildren,
			args: [ClrDatagridRow, { emitDistinctChangesOnly: false }]
		}],
		datagrid: [{
			type: ViewChild,
			args: ["datagrid", { read: ElementRef }]
		}],
		datagridTable: [{
			type: ViewChild,
			args: ["datagridTable", { read: ElementRef }]
		}],
		datagridHeader: [{
			type: ViewChild,
			args: ["datagridHeader", { read: ElementRef }]
		}],
		contentWrapper: [{
			type: ViewChild,
			args: ["contentWrapper", {
				read: ElementRef,
				static: true
			}]
		}],
		rowsWrapper: [{
			type: ViewChild,
			args: ["rowsWrapper", {
				read: ElementRef,
				static: true
			}]
		}],
		scrollableColumns: [{
			type: ViewChild,
			args: ["scrollableColumns", { read: ViewContainerRef }]
		}],
		_projectedDisplayColumns: [{
			type: ViewChild,
			args: ["projectedDisplayColumns", { read: ViewContainerRef }]
		}],
		_projectedStickyColumns: [{
			type: ViewChild,
			args: ["projectedStickyColumns", { read: ViewContainerRef }]
		}],
		_projectedCalculationColumns: [{
			type: ViewChild,
			args: ["projectedCalculationColumns", { read: ViewContainerRef }]
		}],
		_displayedRows: [{
			type: ViewChild,
			args: ["displayedRows", { read: ViewContainerRef }]
		}],
		_calculationRows: [{
			type: ViewChild,
			args: ["calculationRows", { read: ViewContainerRef }]
		}],
		_fixedColumnTemplate: [{
			type: ViewChild,
			args: ["fixedColumnTemplate"]
		}],
		stickyHeaders: [{
			type: ViewChildren,
			args: ["stickyHeader", { emitDistinctChangesOnly: true }]
		}],
		selectAllCheckbox: [{
			type: ViewChild,
			args: ["selectAllCheckbox"]
		}],
		rowControls: [{
			type: ViewChild,
			args: ["rowControls", { read: ElementRef }]
		}],
		loading: [{
			type: Input,
			args: ["clrDgLoading"]
		}],
		selectionType: [{
			type: Input,
			args: [{
				alias: "clrDgSelectionType",
				transform: selectionTypeAttribute
			}]
		}],
		selected: [{
			type: Input,
			args: ["clrDgSelected"]
		}],
		clrDgPreserveSelection: [{ type: Input }],
		rowSelectionMode: [{
			type: Input,
			args: ["clrDgRowSelection"]
		}],
		identityFn: [{
			type: Input,
			args: ["clrDgItemsIdentityFn"]
		}]
	}
});
var ClrDatagridActionBar = class ClrDatagridActionBar {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridActionBar,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridActionBar,
			isStandalone: false,
			selector: "clr-dg-action-bar",
			host: { properties: { "class.datagrid-action-bar": "true" } },
			ngImport: i0,
			template: `<ng-content></ng-content>`,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridActionBar,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-action-bar",
			template: `<ng-content></ng-content>`,
			host: { "[class.datagrid-action-bar]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}]
});
let clrDgActionId = 0;
var ClrDatagridActionOverflow = class ClrDatagridActionOverflow {
	constructor(rowActionService, commonStrings, platformId, popoverService) {
		this.rowActionService = rowActionService;
		this.commonStrings = commonStrings;
		this.platformId = platformId;
		this.popoverService = popoverService;
		this.openChange = new EventEmitter(false);
		this.popoverId = uniqueIdFactory();
		this.smartPosition = ClrPopoverPosition.RIGHT_MIDDLE;
		this.positions = [mapPopoverKeyToPosition(ClrPopoverPosition.RIGHT_BOTTOM, ClrPopoverType.DROPDOWN), mapPopoverKeyToPosition(ClrPopoverPosition.RIGHT_TOP, ClrPopoverType.DROPDOWN)];
		this.keyFocus = viewChild(ClrKeyFocus, ...ngDevMode ? [{ debugName: "keyFocus" }] : /* istanbul ignore next */ []);
		this._open = false;
		this.subscriptions = [];
		rowActionService.register();
		this.subscriptions.push(popoverService.openChange.subscribe((openState) => {
			this.open = openState;
		}), popoverService.popoverVisible.subscribe((visible) => {
			if (visible) this.initializeFocus();
		}));
		this.popoverId = "clr-action-menu" + clrDgActionId++;
	}
	get open() {
		return this._open;
	}
	set open(open) {
		const openState = !!open;
		if (!!openState !== this.open) {
			this.popoverService.open = openState;
			this.openChange.emit(openState);
			this._open = openState;
		}
	}
	ngOnDestroy() {
		this.rowActionService.unregister();
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	closeOverflowContent(event) {
		this.popoverService.toggleWithEvent(event);
	}
	initializeFocus() {
		if (isPlatformBrowser(this.platformId)) {
			const buttons = Array.from(document.querySelectorAll("button.action-item"));
			if (buttons.length) {
				const keyFocus = this.keyFocus();
				keyFocus.current = 0;
				keyFocus.focusableItems = buttons;
				keyFocus.focusCurrent();
			}
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridActionOverflow,
			deps: [
				{ token: RowActionService },
				{ token: i1.ClrCommonStringsService },
				{ token: PLATFORM_ID },
				{ token: i3$1.ClrPopoverService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.2.0",
			version: "22.2.4",
			type: ClrDatagridActionOverflow,
			isStandalone: false,
			selector: "clr-dg-action-overflow",
			inputs: {
				buttonLabel: ["clrDgActionOverflowButtonLabel", "buttonLabel"],
				open: ["clrDgActionOverflowOpen", "open"]
			},
			outputs: { openChange: "clrDgActionOverflowOpenChange" },
			viewQueries: [{
				propertyName: "keyFocus",
				first: true,
				predicate: ClrKeyFocus,
				descendants: true,
				isSignal: true
			}],
			hostDirectives: [{ directive: i3$1.ClrPopoverHostDirective }],
			ngImport: i0,
			template: `
    <button
      tabindex="-1"
      class="datagrid-action-toggle"
      type="button"
      role="button"
      aria-haspopup="true"
      #anchor
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="open"
      [attr.aria-label]="buttonLabel || commonStrings.keys.rowActions"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      (click)="$event.stopPropagation()"
    >
      <cds-icon shape="ellipsis-vertical" [attr.title]="buttonLabel || commonStrings.keys.rowActions"></cds-icon>
    </button>

    <div
      class="datagrid-action-overflow"
      [id]="popoverId"
      [attr.aria-hidden]="!open"
      [attr.id]="popoverId"
      clrKeyFocus
      cdkTrapFocus
      (click)="closeOverflowContent($event)"
      *clrPopoverContent="
        open;
        at: smartPosition;
        availablePositions: positions;
        outsideClickToClose: true;
        scrollToClose: true
      "
    >
      <ng-content></ng-content>
    </div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i1.CdkTrapFocusModule_CdkTrapFocus,
					selector: "[cdkTrapFocus]"
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: i3$1.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverOpenCloseButton,
					selector: "[clrPopoverOpenCloseButton]",
					outputs: ["clrPopoverOpenCloseChange"]
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverContent,
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
					type: i1.ClrKeyFocus,
					selector: "[clrKeyFocus]",
					inputs: [
						"clrDirection",
						"clrFocusOnLoad",
						"clrKeyFocus"
					],
					outputs: ["clrFocusChange"]
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
	type: ClrDatagridActionOverflow,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-action-overflow",
			hostDirectives: [ClrPopoverHostDirective],
			template: `
    <button
      tabindex="-1"
      class="datagrid-action-toggle"
      type="button"
      role="button"
      aria-haspopup="true"
      #anchor
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="open"
      [attr.aria-label]="buttonLabel || commonStrings.keys.rowActions"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      (click)="$event.stopPropagation()"
    >
      <cds-icon shape="ellipsis-vertical" [attr.title]="buttonLabel || commonStrings.keys.rowActions"></cds-icon>
    </button>

    <div
      class="datagrid-action-overflow"
      [id]="popoverId"
      [attr.aria-hidden]="!open"
      [attr.id]="popoverId"
      clrKeyFocus
      cdkTrapFocus
      (click)="closeOverflowContent($event)"
      *clrPopoverContent="
        open;
        at: smartPosition;
        availablePositions: positions;
        outsideClickToClose: true;
        scrollToClose: true
      "
    >
      <ng-content></ng-content>
    </div>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: RowActionService },
		{ type: i1.ClrCommonStringsService },
		{
			type: void 0,
			decorators: [{
				type: Inject,
				args: [PLATFORM_ID]
			}]
		},
		{ type: i3$1.ClrPopoverService }
	],
	propDecorators: {
		buttonLabel: [{
			type: Input,
			args: ["clrDgActionOverflowButtonLabel"]
		}],
		openChange: [{
			type: Output,
			args: ["clrDgActionOverflowOpenChange"]
		}],
		keyFocus: [{
			type: i0.ViewChild,
			args: [i0.forwardRef(() => ClrKeyFocus), { isSignal: true }]
		}],
		open: [{
			type: Input,
			args: ["clrDgActionOverflowOpen"]
		}]
	}
});
var ColumnActionsFocusHandler = class ColumnActionsFocusHandler extends DropdownFocusHandler {
	constructor() {
		super(...arguments);
		this.ownItems = [];
		this.projectedItems = [];
	}
	addChildren(children) {
		this.ownItems = children;
		super.addChildren([...children, ...this.projectedItems]);
	}
	resetChildren() {
		this.ownItems = [];
		super.resetChildren();
	}
	setProjectedItems(items) {
		this.projectedItems = items;
		this.addChildren(this.ownItems);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnActionsFocusHandler,
			deps: null,
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ColumnActionsFocusHandler
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ColumnActionsFocusHandler,
	decorators: [{ type: Injectable }]
});
var ClrDatagridColumnActions = class ClrDatagridColumnActions extends ClrDropdown {
	constructor(column, commonStrings, columnActions, columnPopover, changeDetectorRef, injector, filters, parent, popoverService, focusHandler, dropdownService) {
		super(parent, popoverService, focusHandler, changeDetectorRef, dropdownService);
		this.column = column;
		this.commonStrings = commonStrings;
		this.columnActions = columnActions;
		this.columnPopover = columnPopover;
		this.changeDetectorRef = changeDetectorRef;
		this.injector = injector;
		this.filters = filters;
		this.ClrDatagridSortOrder = ClrDatagridSortOrder;
		this._keepFilterInHeader = false;
		this.subs = [];
		this.columnActionsFocusHandler = inject(ColumnActionsFocusHandler);
		this.isMenuClosable = false;
		columnActions.filterInHeader.set(this._keepFilterInHeader);
		columnActions.menuPresent.set(true);
	}
	get keepFilterInHeader() {
		return this._keepFilterInHeader;
	}
	set keepFilterInHeader(value) {
		this._keepFilterInHeader = value;
		this.columnActions.filterInHeader.set(value);
	}
	get triggerLabel() {
		const title = this.columnActions.title();
		return title ? this.commonStrings.parse(this.commonStrings.keys.datagridColumnActionsAriaLabel, { COLUMN: title }) : this.commonStrings.keys.columnActions;
	}
	get sortOrder() {
		return this.column.sortOrder;
	}
	get canClearSort() {
		return this.sortOrder !== ClrDatagridSortOrder.UNSORTED && !this.column.disableUnsort;
	}
	get hasFilter() {
		return !!this.columnActions.filter();
	}
	get filterActive() {
		return !!this.columnActions.filter()?.active && !this.keepFilterInHeader;
	}
	get filterOpen() {
		return this.columnPopover.open;
	}
	get filterPopoverId() {
		return this.columnActions.filter()?.popoverId ?? null;
	}
	set projectedItems(items) {
		this.projectedItemsSubscription?.unsubscribe();
		this.projectedItemsSubscription = items.changes.subscribe(() => this.columnActionsFocusHandler.setProjectedItems(items.toArray()));
		this.columnActionsFocusHandler.setProjectedItems(items.toArray());
	}
	set menuPopoverContent(popoverContent) {
		this._menuPopoverContent = popoverContent;
		if (popoverContent) popoverContent.scrollToClose = false;
	}
	ngAfterViewInit() {
		if (this.filters) this.subs.push(this.filters.change.subscribe(() => this.changeDetectorRef.markForCheck()));
		this.subs.push(this.columnPopover.openChange.subscribe((open) => {
			this.changeDetectorRef.markForCheck();
			if (!open) this.columnPopover.parent = null;
		}));
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.subs.forEach((sub) => sub.unsubscribe());
		this.projectedItemsSubscription?.unsubscribe();
		this.columnActions.filterInHeader.set(true);
		this.columnActions.menuPresent.set(false);
		this.columnPopover.parent = null;
	}
	closeMenu() {
		this.focusHandler.focus();
		this.popoverService.open = false;
	}
	repositionMenu() {
		afterNextRender(() => this.popoverService.updatePosition(), { injector: this.injector });
	}
	focusAction(item) {
		this.focusHandler.moveTo(item);
	}
	sort(descending) {
		const requested = descending ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;
		if (this.sortOrder !== requested) this.column.sort(descending);
	}
	togglePinned() {
		this.column.togglePinned();
		this.repositionMenu();
	}
	openFilter(event) {
		this.columnPopover.origin = this.trigger;
		this.columnPopover.parent = this._menuPopoverContent;
		this.columnPopover.openEvent = event;
		this.columnPopover.open = true;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumnActions,
			deps: [
				{ token: ClrDatagridColumn },
				{ token: i1.ClrCommonStringsService },
				{ token: ColumnActionsService },
				{
					token: i3$1.ClrPopoverService,
					skipSelf: true
				},
				{ token: i0.ChangeDetectorRef },
				{ token: i0.Injector },
				{
					token: FiltersProvider,
					optional: true
				},
				{
					token: i6.ClrDropdown,
					optional: true,
					skipSelf: true
				},
				{ token: i3$1.ClrPopoverService },
				{ token: i6.DropdownFocusHandler },
				{ token: i6.RootDropdownService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridColumnActions,
			isStandalone: false,
			selector: "clr-dg-column-actions",
			inputs: { keepFilterInHeader: [
				"clrDgKeepFilterInHeader",
				"keepFilterInHeader",
				booleanAttribute
			] },
			host: { properties: { "class.datagrid-column-actions": "true" } },
			providers: [
				ROOT_DROPDOWN_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				ColumnActionsFocusHandler,
				{
					provide: DropdownFocusHandler,
					useExisting: ColumnActionsFocusHandler
				},
				{
					provide: FocusableItem,
					useExisting: ColumnActionsFocusHandler
				},
				{
					provide: ClrDropdown,
					useExisting: ClrDatagridColumnActions
				}
			],
			queries: [{
				propertyName: "projectedItems",
				predicate: FocusableItem
			}],
			viewQueries: [{
				propertyName: "trigger",
				first: true,
				predicate: ["trigger"],
				descendants: true,
				read: ElementRef
			}, {
				propertyName: "menuPopoverContent",
				first: true,
				predicate: ClrDropdownMenu,
				descendants: true,
				read: ClrPopoverContent
			}],
			usesInheritance: true,
			ngImport: i0,
			template: `
    <button
      class="datagrid-column-actions-toggle"
      type="button"
      clrDropdownTrigger
      [class.datagrid-column-actions-filtered]="filterActive"
      [attr.aria-label]="triggerLabel"
    >
      <cds-icon
        [size]="filterActive ? '16' : '12'"
        [shape]="filterActive ? 'ellipsis-grid-circle' : 'ellipsis-vertical'"
        [status]="filterActive ? 'info' : null"
        aria-hidden="true"
      />
    </button>

    <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
      @if (column.sortable) {
        <!--
          The two directions are one exclusive setting rather than two commands, so they are radio
          items: the applied one is then announced as such. The active class alone would leave it
          visible only to a sighted user - the column header's aria-sort is not read from in here.
        -->
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.ASC"
          [class.active]="sortOrder === ClrDatagridSortOrder.ASC"
          (click)="sort(false)"
        >
          <cds-icon shape="arrow" direction="up" aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.sortColumnAscending }}
        </button>
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.DESC"
          [class.active]="sortOrder === ClrDatagridSortOrder.DESC"
          (click)="sort(true)"
        >
          <cds-icon shape="arrow" direction="down" aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.sortColumnDescending }}
        </button>
        @if (canClearSort) {
          <button type="button" clrDropdownItem (click)="column.clearSort()">
            <cds-icon shape="times" aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.clearColumnSort }}
          </button>
        }
      }

      @if (column.pinnable) {
        @if (column.sortable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <button type="button" clrDropdownItem (click)="togglePinned()">
          <cds-icon
            [shape]="column.pinned ? 'unpin' : 'pin'"
            solid
            size="12"
            class="datagrid-column-actions-pin-icon"
            aria-hidden="true"
          ></cds-icon>
          {{ column.pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn }}
        </button>
      }

      @if (hasFilter && !keepFilterInHeader) {
        @if (column.sortable || column.pinnable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <!--
          This item stands in for the filter's own toggle, so it takes over the state that toggle
          announced: that it opens a dialog, and whether that dialog is open right now.
        -->
        <button
          type="button"
          #trigger
          clrDropdownItem
          aria-haspopup="dialog"
          [attr.aria-expanded]="filterOpen"
          [attr.aria-controls]="filterPopoverId"
          (click)="openFilter($event)"
        >
          <cds-icon [shape]="filterActive ? 'filter-grid-circle' : 'filter-grid'" solid aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.filterColumn }}
        </button>
      }

      <ng-content></ng-content>
    </clr-dropdown-menu>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: i3$1.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "component",
					type: i6.ClrDropdownMenu,
					selector: "clr-dropdown-menu",
					inputs: ["clrPosition"]
				},
				{
					kind: "directive",
					type: i6.ClrDropdownTrigger,
					selector: "[clrDropdownTrigger],[clrDropdownToggle]"
				},
				{
					kind: "directive",
					type: i6.ClrDropdownItem,
					selector: "[clrDropdownItem]",
					inputs: [
						"role",
						"clrDisabled",
						"id"
					]
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
	type: ClrDatagridColumnActions,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-column-actions",
			template: `
    <button
      class="datagrid-column-actions-toggle"
      type="button"
      clrDropdownTrigger
      [class.datagrid-column-actions-filtered]="filterActive"
      [attr.aria-label]="triggerLabel"
    >
      <cds-icon
        [size]="filterActive ? '16' : '12'"
        [shape]="filterActive ? 'ellipsis-grid-circle' : 'ellipsis-vertical'"
        [status]="filterActive ? 'info' : null"
        aria-hidden="true"
      />
    </button>

    <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
      @if (column.sortable) {
        <!--
          The two directions are one exclusive setting rather than two commands, so they are radio
          items: the applied one is then announced as such. The active class alone would leave it
          visible only to a sighted user - the column header's aria-sort is not read from in here.
        -->
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.ASC"
          [class.active]="sortOrder === ClrDatagridSortOrder.ASC"
          (click)="sort(false)"
        >
          <cds-icon shape="arrow" direction="up" aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.sortColumnAscending }}
        </button>
        <button
          type="button"
          clrDropdownItem
          role="menuitemradio"
          [attr.aria-checked]="sortOrder === ClrDatagridSortOrder.DESC"
          [class.active]="sortOrder === ClrDatagridSortOrder.DESC"
          (click)="sort(true)"
        >
          <cds-icon shape="arrow" direction="down" aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.sortColumnDescending }}
        </button>
        @if (canClearSort) {
          <button type="button" clrDropdownItem (click)="column.clearSort()">
            <cds-icon shape="times" aria-hidden="true"></cds-icon>
            {{ commonStrings.keys.clearColumnSort }}
          </button>
        }
      }

      @if (column.pinnable) {
        @if (column.sortable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <button type="button" clrDropdownItem (click)="togglePinned()">
          <cds-icon
            [shape]="column.pinned ? 'unpin' : 'pin'"
            solid
            size="12"
            class="datagrid-column-actions-pin-icon"
            aria-hidden="true"
          ></cds-icon>
          {{ column.pinned ? commonStrings.keys.unpinColumn : commonStrings.keys.pinColumn }}
        </button>
      }

      @if (hasFilter && !keepFilterInHeader) {
        @if (column.sortable || column.pinnable) {
          <div class="dropdown-divider" role="separator"></div>
        }
        <!--
          This item stands in for the filter's own toggle, so it takes over the state that toggle
          announced: that it opens a dialog, and whether that dialog is open right now.
        -->
        <button
          type="button"
          #trigger
          clrDropdownItem
          aria-haspopup="dialog"
          [attr.aria-expanded]="filterOpen"
          [attr.aria-controls]="filterPopoverId"
          (click)="openFilter($event)"
        >
          <cds-icon [shape]="filterActive ? 'filter-grid-circle' : 'filter-grid'" solid aria-hidden="true"></cds-icon>
          {{ commonStrings.keys.filterColumn }}
        </button>
      }

      <ng-content></ng-content>
    </clr-dropdown-menu>
  `,
			host: { "[class.datagrid-column-actions]": "true" },
			providers: [
				ROOT_DROPDOWN_PROVIDER,
				FOCUS_SERVICE_PROVIDER,
				ColumnActionsFocusHandler,
				{
					provide: DropdownFocusHandler,
					useExisting: ColumnActionsFocusHandler
				},
				{
					provide: FocusableItem,
					useExisting: ColumnActionsFocusHandler
				},
				{
					provide: ClrDropdown,
					useExisting: ClrDatagridColumnActions
				}
			],
			changeDetection: ChangeDetectionStrategy.OnPush,
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: ClrDatagridColumn },
		{ type: i1.ClrCommonStringsService },
		{ type: ColumnActionsService },
		{
			type: i3$1.ClrPopoverService,
			decorators: [{ type: SkipSelf }]
		},
		{ type: i0.ChangeDetectorRef },
		{ type: i0.Injector },
		{
			type: FiltersProvider,
			decorators: [{ type: Optional }]
		},
		{
			type: i6.ClrDropdown,
			decorators: [{ type: SkipSelf }, { type: Optional }]
		},
		{ type: i3$1.ClrPopoverService },
		{ type: i6.DropdownFocusHandler },
		{ type: i6.RootDropdownService }
	],
	propDecorators: {
		trigger: [{
			type: ViewChild,
			args: ["trigger", { read: ElementRef }]
		}],
		keepFilterInHeader: [{
			type: Input,
			args: [{
				alias: "clrDgKeepFilterInHeader",
				transform: booleanAttribute
			}]
		}],
		projectedItems: [{
			type: ContentChildren,
			args: [FocusableItem]
		}],
		menuPopoverContent: [{
			type: ViewChild,
			args: [ClrDropdownMenu, { read: ClrPopoverContent }]
		}]
	}
});
var ClrDatagridColumnAction = class ClrDatagridColumnAction extends ClrDropdownItem {
	constructor(columnActions, item, dropdownService, el, renderer) {
		super(columnActions, dropdownService, item, el, renderer);
		this.columnActions = columnActions;
		this.canClosePopover = true;
	}
	onColumnActionClick() {
		if (this.disabled) return;
		if (this.canClosePopover) this.columnActions.closeMenu();
		else this.columnActions.repositionMenu();
	}
	onFocus() {
		this.columnActions.focusAction(this.focusableItem);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumnAction,
			deps: [
				{ token: ClrDatagridColumnActions },
				{ token: i1.FocusableItem },
				{ token: i6.RootDropdownService },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "16.1.0",
			version: "22.2.4",
			type: ClrDatagridColumnAction,
			isStandalone: false,
			selector: "[clrDgColumnAction]",
			inputs: { canClosePopover: [
				"clrCanClosePopover",
				"canClosePopover",
				booleanAttribute
			] },
			host: { listeners: {
				"click": "onColumnActionClick()",
				"focus": "onFocus()"
			} },
			providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridColumnAction,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDgColumnAction]",
			providers: [BASIC_FOCUSABLE_ITEM_PROVIDER],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: ClrDatagridColumnActions },
		{ type: i1.FocusableItem },
		{ type: i6.RootDropdownService },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 }
	],
	propDecorators: {
		canClosePopover: [{
			type: Input,
			args: [{
				alias: "clrCanClosePopover",
				transform: booleanAttribute
			}]
		}],
		onColumnActionClick: [{
			type: HostListener,
			args: ["click"]
		}],
		onFocus: [{
			type: HostListener,
			args: ["focus"]
		}]
	}
});
const columnToggleTrackByFn = (index) => index;
var ClrDatagridColumnToggleButton = class ClrDatagridColumnToggleButton {
	constructor(commonStrings, columnsService) {
		this.commonStrings = commonStrings;
		this.columnsService = columnsService;
		this.allSelected = new EventEmitter();
	}
	get clrAllSelected() {
		return this.allSelected.asObservable();
	}
	get allHideablesVisible() {
		return this.hideableColumns().filter((column) => column.value.hidden).length === 0;
	}
	selectAll() {
		this.hideableColumns().forEach((hideableColumn) => this.columnsService.emitStateChange(hideableColumn, {
			hidden: false,
			changes: [DatagridColumnChanges.HIDDEN]
		}));
		this.allSelected.next(true);
	}
	hideableColumns() {
		return this.columnsService.columns.filter((column) => column.value.hideable);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumnToggleButton,
			deps: [{ token: i1.ClrCommonStringsService }, { token: ColumnsService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridColumnToggleButton,
			isStandalone: false,
			selector: "clr-dg-column-toggle-button",
			outputs: { clrAllSelected: "clrAllSelected" },
			ngImport: i0,
			template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridColumnToggleButton,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-column-toggle-button",
			template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: i1.ClrCommonStringsService }, { type: ColumnsService }],
	propDecorators: { clrAllSelected: [{
		type: Output,
		args: ["clrAllSelected"]
	}] }
});
var ClrDatagridColumnToggle = class ClrDatagridColumnToggle {
	constructor(commonStrings, columnsService, popoverService) {
		this.commonStrings = commonStrings;
		this.columnsService = columnsService;
		this.popoverId = uniqueIdFactory();
		this.openState = false;
		this.popoverPosition = ClrPopoverPosition.TOP_LEFT;
		this.popoverType = ClrPopoverType.DROPDOWN;
		this.trackByFn = columnToggleTrackByFn;
		this.subscription = popoverService.openChange.subscribe((change) => this.openState = change);
	}
	get allColumnsVisible() {
		return this._allColumnsVisible;
	}
	set allColumnsVisible(value) {
		this._allColumnsVisible = value;
	}
	get hideableColumnStates() {
		return this.columnsService.columns.filter((column) => column.value.hideable).map((column) => column.value);
	}
	get hasOnlyOneVisibleColumn() {
		return this.columnsService.columns.length - this.hideableColumnStates.length === 0 && this.hideableColumnStates.filter((columnState) => !columnState.hidden).length === 1;
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	toggleColumnState(columnState, event) {
		const columnToToggle = this.columnsService.columns.filter((column) => column.value === columnState)[0];
		this.columnsService.emitStateChange(columnToToggle, {
			hidden: event,
			changes: [DatagridColumnChanges.HIDDEN]
		});
	}
	toggleSwitchPanel() {
		this.openState = !this.openState;
	}
	allColumnsSelected() {
		this.allSelectedElement.nativeElement.focus();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridColumnToggle,
			deps: [
				{ token: i1.ClrCommonStringsService },
				{ token: ColumnsService },
				{ token: i3$1.ClrPopoverService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridColumnToggle,
			isStandalone: false,
			selector: "clr-dg-column-toggle",
			host: { properties: {
				"class.column-switch-wrapper": "true",
				"class.active": "openState"
			} },
			viewQueries: [{
				propertyName: "allSelectedElement",
				first: true,
				predicate: ["allSelected"],
				descendants: true,
				read: ElementRef
			}],
			hostDirectives: [{ directive: i3$1.ClrPopoverHostDirective }],
			ngImport: i0,
			template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle-action"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="openState"
      [attr.aria-haspopup]="'menu'"
    >
      {{ commonStrings.keys.pickColumns }}
    </button>
    <div
      class="column-switch"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.showColumnsMenuDescription"
      [id]="popoverId"
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      *clrPopoverContent="
        openState;
        at: popoverPosition;
        type: popoverType;
        outsideClickToClose: true;
        scrollToClose: true
      "
    >
      <div class="switch-header">
        <div class="clr-sr-only" tabindex="-1" #allSelected>{{ commonStrings.keys.allColumnsSelected }}</div>
        <h2>{{ commonStrings.keys.showColumns }}</h2>
        <button
          class="btn btn-sm btn-link-neutral toggle-switch-close-button"
          clrPopoverCloseButton
          type="button"
          [attr.aria-label]="commonStrings.keys.close"
        >
          <cds-icon shape="window-close" aria-hidden="true" [attr.title]="commonStrings.keys.close"></cds-icon>
          <span class="clr-sr-only">{{ commonStrings.keys.close }}</span>
        </button>
      </div>
      <ul class="switch-content list-unstyled">
        @for (columnState of hideableColumnStates; track trackByFn($index, columnState)) {
          <li>
            <clr-checkbox-wrapper>
              <input
                clrCheckbox
                type="checkbox"
                [disabled]="hasOnlyOneVisibleColumn && !columnState.hidden"
                [ngModel]="!columnState.hidden"
                (ngModelChange)="toggleColumnState(columnState, !$event)"
              />
              <label>
                <ng-template [ngTemplateOutlet]="columnState.titleTemplateRef"></ng-template>
              </label>
            </clr-checkbox-wrapper>
          </li>
        }
      </ul>
      <div class="switch-footer">
        <clr-dg-column-toggle-button (clrAllSelected)="allColumnsSelected()"></clr-dg-column-toggle-button>
      </div>
    </div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i7$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "directive",
					type: i1.CdkTrapFocusModule_CdkTrapFocus,
					selector: "[cdkTrapFocus]"
				},
				{
					kind: "component",
					type: i6$2.ClrIcon,
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
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i7.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i7.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				},
				{
					kind: "directive",
					type: i6$1.CheckboxControlValueAccessor,
					selector: "input[type=checkbox]:not([ngNoCva])[formControlName],input[type=checkbox]:not([ngNoCva])[formControl],input[type=checkbox]:not([ngNoCva])[ngModel]"
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
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
					kind: "directive",
					type: i3$1.ClrPopoverOrigin,
					selector: "[clrPopoverOrigin]"
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverCloseButton,
					selector: "[clrPopoverCloseButton]",
					outputs: ["clrPopoverOnCloseChange"]
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverOpenCloseButton,
					selector: "[clrPopoverOpenCloseButton]",
					outputs: ["clrPopoverOpenCloseChange"]
				},
				{
					kind: "directive",
					type: i3$1.ClrPopoverContent,
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
					type: ClrDatagridColumnToggleButton,
					selector: "clr-dg-column-toggle-button",
					outputs: ["clrAllSelected"]
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
	type: ClrDatagridColumnToggle,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-column-toggle",
			template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle-action"
      clrPopoverOrigin
      clrPopoverOpenCloseButton
      [attr.aria-controls]="popoverId"
      [attr.aria-expanded]="openState"
      [attr.aria-haspopup]="'menu'"
    >
      {{ commonStrings.keys.pickColumns }}
    </button>
    <div
      class="column-switch"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.showColumnsMenuDescription"
      [id]="popoverId"
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      *clrPopoverContent="
        openState;
        at: popoverPosition;
        type: popoverType;
        outsideClickToClose: true;
        scrollToClose: true
      "
    >
      <div class="switch-header">
        <div class="clr-sr-only" tabindex="-1" #allSelected>{{ commonStrings.keys.allColumnsSelected }}</div>
        <h2>{{ commonStrings.keys.showColumns }}</h2>
        <button
          class="btn btn-sm btn-link-neutral toggle-switch-close-button"
          clrPopoverCloseButton
          type="button"
          [attr.aria-label]="commonStrings.keys.close"
        >
          <cds-icon shape="window-close" aria-hidden="true" [attr.title]="commonStrings.keys.close"></cds-icon>
          <span class="clr-sr-only">{{ commonStrings.keys.close }}</span>
        </button>
      </div>
      <ul class="switch-content list-unstyled">
        @for (columnState of hideableColumnStates; track trackByFn($index, columnState)) {
          <li>
            <clr-checkbox-wrapper>
              <input
                clrCheckbox
                type="checkbox"
                [disabled]="hasOnlyOneVisibleColumn && !columnState.hidden"
                [ngModel]="!columnState.hidden"
                (ngModelChange)="toggleColumnState(columnState, !$event)"
              />
              <label>
                <ng-template [ngTemplateOutlet]="columnState.titleTemplateRef"></ng-template>
              </label>
            </clr-checkbox-wrapper>
          </li>
        }
      </ul>
      <div class="switch-footer">
        <clr-dg-column-toggle-button (clrAllSelected)="allColumnsSelected()"></clr-dg-column-toggle-button>
      </div>
    </div>
  `,
			host: {
				"[class.column-switch-wrapper]": "true",
				"[class.active]": "openState"
			},
			hostDirectives: [ClrPopoverHostDirective],
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: i1.ClrCommonStringsService },
		{ type: ColumnsService },
		{ type: i3$1.ClrPopoverService }
	],
	propDecorators: { allSelectedElement: [{
		type: ViewChild,
		args: ["allSelected", { read: ElementRef }]
	}] }
});
var ClrDatagridDetailHeader = class ClrDatagridDetailHeader {
	constructor(detailService, commonStrings) {
		this.detailService = detailService;
		this.commonStrings = commonStrings;
	}
	get titleId() {
		return `${this.detailService.id}-title`;
	}
	ngAfterViewInit() {
		this.title.nativeElement.focus();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridDetailHeader,
			deps: [{ token: DetailService }, { token: i1.ClrCommonStringsService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridDetailHeader,
			isStandalone: false,
			selector: "clr-dg-detail-header",
			host: { properties: { "class.datagrid-detail-header": "true" } },
			viewQueries: [{
				propertyName: "title",
				first: true,
				predicate: ["title"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    <div #title class="datagrid-detail-header-title" tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-icon btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
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
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridDetailHeader,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-detail-header",
			host: { "[class.datagrid-detail-header]": "true" },
			template: `
    <div #title class="datagrid-detail-header-title" tabindex="-1" [id]="titleId">
      <ng-content></ng-content>
    </div>
    <div class="datagrid-detail-pane-close">
      <button
        type="button"
        class="btn btn-icon btn-link"
        (click)="detailService.close()"
        [attr.aria-label]="commonStrings.keys.close"
      >
        <cds-icon shape="times"></cds-icon>
      </button>
    </div>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: DetailService }, { type: i1.ClrCommonStringsService }],
	propDecorators: { title: [{
		type: ViewChild,
		args: ["title"]
	}] }
});
var ClrDatagridDetail = class ClrDatagridDetail {
	constructor(detailService, commonStrings) {
		this.detailService = detailService;
		this.commonStrings = commonStrings;
	}
	get detailWidth() {
		return this.detailService.detailWidth;
	}
	set detailWidth(value) {
		if (value === null || value === void 0) {
			this.detailService.detailWidth = 66;
			return;
		}
		if (value < 0) {
			this.detailService.detailWidth = 0;
			return;
		}
		if (value > 100) {
			this.detailService.detailWidth = 100;
			return;
		}
		this.detailService.detailWidth = value;
	}
	get isCustomWidth() {
		return this.detailWidth !== 66;
	}
	get width() {
		return this.detailWidth !== 100 ? this.detailWidth : null;
	}
	get labelledBy() {
		if (this.ariaLabelledBy) return this.header ? `${this.header.titleId} ${this.ariaLabelledBy}` : this.ariaLabelledBy;
		else if (this.ariaLabel) return null;
		else return this.header?.titleId || "";
	}
	get label() {
		if (!this.ariaLabelledBy) return this.ariaLabel || null;
		else return null;
	}
	close() {
		this.detailService.close();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridDetail,
			deps: [{ token: DetailService }, { token: i1.ClrCommonStringsService }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridDetail,
			isStandalone: false,
			selector: "clr-dg-detail",
			inputs: {
				ariaLabelledBy: ["clrDetailAriaLabelledBy", "ariaLabelledBy"],
				ariaLabel: ["clrDetailAriaLabel", "ariaLabel"],
				detailWidth: ["clrDetailWidth", "detailWidth"]
			},
			host: { properties: {
				"class.datagrid-detail-pane": "true",
				"class.datagrid-detail-custom-width": "isCustomWidth",
				"style.width.%": "width"
			} },
			queries: [{
				propertyName: "header",
				first: true,
				predicate: ClrDatagridDetailHeader,
				descendants: true
			}],
			ngImport: i0,
			template: `
    @if (detailService.isOpen) {
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="!header"
        class="datagrid-detail-pane-content"
        role="dialog"
        [id]="detailService.id"
        aria-modal="true"
        [attr.aria-labelledby]="labelledBy"
        [attr.aria-label]="label"
      >
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
        <ng-content></ng-content>
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
      </div>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "directive",
				type: i1.CdkTrapFocusModule_CdkTrapFocus,
				selector: "[cdkTrapFocus]"
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridDetail,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-detail",
			host: {
				"[class.datagrid-detail-pane]": "true",
				"[class.datagrid-detail-custom-width]": "isCustomWidth",
				"[style.width.%]": "width"
			},
			template: `
    @if (detailService.isOpen) {
      <div
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="!header"
        class="datagrid-detail-pane-content"
        role="dialog"
        [id]="detailService.id"
        aria-modal="true"
        [attr.aria-labelledby]="labelledBy"
        [attr.aria-label]="label"
      >
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneStart }}</div>
        <ng-content></ng-content>
        <div class="clr-sr-only">{{ commonStrings.keys.detailPaneEnd }}</div>
      </div>
    }
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: DetailService }, { type: i1.ClrCommonStringsService }],
	propDecorators: {
		ariaLabelledBy: [{
			type: Input,
			args: ["clrDetailAriaLabelledBy"]
		}],
		ariaLabel: [{
			type: Input,
			args: ["clrDetailAriaLabel"]
		}],
		header: [{
			type: ContentChild,
			args: [ClrDatagridDetailHeader]
		}],
		detailWidth: [{
			type: Input,
			args: ["clrDetailWidth"]
		}]
	}
});
var ClrDatagridDetailBody = class ClrDatagridDetailBody {
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridDetailBody,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridDetailBody,
			isStandalone: false,
			selector: "clr-dg-detail-body",
			host: { properties: { "class.datagrid-detail-body": "true" } },
			ngImport: i0,
			template: `
    <div class="clr-dg-detail-body-wrapper">
      <ng-content></ng-content>
    </div>
  `,
			isInline: true,
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridDetailBody,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-detail-body",
			template: `
    <div class="clr-dg-detail-body-wrapper">
      <ng-content></ng-content>
    </div>
  `,
			host: { "[class.datagrid-detail-body]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}]
});
var ClrDatagridHideableColumn = class ClrDatagridHideableColumn {
	constructor(titleTemplateRef, viewContainerRef, columnsService, columnState) {
		this.titleTemplateRef = titleTemplateRef;
		this.columnsService = columnsService;
		this.columnState = columnState;
		this.hiddenChange = new EventEmitter();
		this.subscriptions = [];
		viewContainerRef.createEmbeddedView(titleTemplateRef);
		if (!columnState) throw new Error("The *clrDgHideableColumn directive can only be used inside of a clr-dg-column component.");
	}
	set clrDgHideableColumn(value) {
		if (typeof value === "string") {
			this.clrDgHidden = false;
			return;
		}
		this.clrDgHidden = value && value.hidden ? value.hidden : false;
	}
	set clrDgHidden(hidden) {
		this._hidden = hidden ? hidden : false;
		this.columnsService.emitStateChange(this.columnState, {
			hidden: this._hidden,
			changes: [DatagridColumnChanges.HIDDEN]
		});
	}
	ngOnInit() {
		this.columnsService.emitStateChange(this.columnState, {
			hideable: true,
			titleTemplateRef: this.titleTemplateRef,
			hidden: this._hidden,
			changes: [DatagridColumnChanges.HIDDEN]
		});
		this.subscriptions.push(this.columnState.subscribe((state) => {
			if (state.changes && state.changes.indexOf(DatagridColumnChanges.HIDDEN) > -1) this.hiddenChange.emit(state.hidden);
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridHideableColumn,
			deps: [
				{ token: i0.TemplateRef },
				{ token: i0.ViewContainerRef },
				{ token: ColumnsService },
				{
					token: COLUMN_STATE,
					optional: true
				}
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrDatagridHideableColumn,
			isStandalone: false,
			selector: "[clrDgHideableColumn]",
			inputs: {
				clrDgHideableColumn: "clrDgHideableColumn",
				clrDgHidden: "clrDgHidden"
			},
			outputs: { hiddenChange: "clrDgHiddenChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridHideableColumn,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDgHideableColumn]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.TemplateRef },
		{ type: i0.ViewContainerRef },
		{ type: ColumnsService },
		{
			type: i12.BehaviorSubject,
			decorators: [{ type: Optional }, {
				type: Inject,
				args: [COLUMN_STATE]
			}]
		}
	],
	propDecorators: {
		hiddenChange: [{
			type: Output,
			args: ["clrDgHiddenChange"]
		}],
		clrDgHideableColumn: [{
			type: Input,
			args: ["clrDgHideableColumn"]
		}],
		clrDgHidden: [{
			type: Input,
			args: ["clrDgHidden"]
		}]
	}
});
var ClrIfDetail = class ClrIfDetail {
	constructor(templateRef, viewContainer, detailService) {
		this.templateRef = templateRef;
		this.viewContainer = viewContainer;
		this.detailService = detailService;
		this.stateChange = new EventEmitter(null);
		this.subscriptions = [];
		this.skip = false;
		this.unregister = detailService.register();
	}
	set state(model) {
		if (!this.skip) this.detailService.toggle(model);
		this.skip = false;
	}
	get viewContext() {
		return { $implicit: this.detailService.state };
	}
	ngOnInit() {
		this.subscriptions.push(this.detailService.stateChange.subscribe((state) => {
			if (state === true) this.togglePanel(true);
			else this.togglePanel(false);
		}));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.unregister();
	}
	togglePanel(showPanel) {
		let stateChangeParams = null;
		if (showPanel === true) {
			if (!this.embeddedViewRef) {
				const viewContext = this._createContextForwardProxy();
				this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, viewContext);
			}
			this.skip = true;
			stateChangeParams = this.detailService.state;
		} else {
			this.viewContainer.clear();
			this.embeddedViewRef = null;
		}
		this.stateChange.emit(stateChangeParams);
	}
	_createContextForwardProxy() {
		return new Proxy({}, {
			set: (_target, prop, newValue) => {
				if (!this.viewContext) return false;
				return Reflect.set(this.viewContext, prop, newValue);
			},
			get: (_target, prop, receiver) => {
				if (!this.viewContext) return;
				return Reflect.get(this.viewContext, prop, receiver);
			}
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrIfDetail,
			deps: [
				{ token: i0.TemplateRef },
				{ token: i0.ViewContainerRef },
				{ token: DetailService }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ClrIfDetail,
			isStandalone: false,
			selector: "[clrIfDetail]",
			inputs: { state: ["clrIfDetail", "state"] },
			outputs: { stateChange: "clrIfDetailChange" },
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrIfDetail,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrIfDetail]",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.TemplateRef },
		{ type: i0.ViewContainerRef },
		{ type: DetailService }
	],
	propDecorators: {
		stateChange: [{
			type: Output,
			args: ["clrIfDetailChange"]
		}],
		state: [{
			type: Input,
			args: ["clrIfDetail"]
		}]
	}
});
var DatagridTreeRenderer = class DatagridTreeRenderer {
	constructor() {
		this.tree = inject(DatagridTreeService);
		this.datagrid = inject(ClrDatagrid);
		this.changeDetectorRef = inject(ChangeDetectorRef);
		this.differs = inject(IterableDiffers);
		this.tree.enabled.set(true);
		this.subscription = this.tree.change.subscribe((items) => {
			const focus = this.focusedCell();
			this.render(items, focus, focus ? void 0 : this.tabStopItem());
			this.changeDetectorRef.markForCheck();
		});
	}
	ngOnChanges() {
		this.tree.configure(this.roots, this.getChildren, this.cascadeSelection);
		this.rootsDiffer = this.differs.find([]).create();
		this.rootsDiffer.diff(this.roots || []);
	}
	ngDoCheck() {
		if (this.rootsDiffer?.diff(this.roots || [])) this.tree.setRoots(this.roots);
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.tree.enabled.set(false);
	}
	nearestShown(item, items) {
		const shown = new Set(items.filter((shownItem) => shownItem !== void 0).map((shownItem) => this.tree.identify(shownItem)));
		for (let node = this.tree.nodeFor(item); node; node = node.parent) if (shown.has(this.tree.identify(node.item))) return node.item;
	}
	focus(item, cell, inner = -1) {
		const target = this.cellOf(item, cell);
		if (target) {
			this.datagrid.keyNavigation.setActiveCell(target);
			this.datagrid.keyNavigation.focusElement(target, { preventScroll: true });
			getTabbableItems(target)[inner]?.focus({ preventScroll: true });
		}
	}
	moveTabStop(item, items) {
		const target = this.nearestShown(item, items);
		if (target === item) return;
		const cell = target === void 0 ? void 0 : this.cellOf(target);
		if (cell) this.datagrid.keyNavigation.setActiveCell(cell);
		else this.datagrid.keyNavigation.resetKeyGrid();
	}
	focusInGrid() {
		return this.datagrid._focusLost() || !!this.datagrid._focusedElement();
	}
	rowOf(item) {
		const ref = this.tree.identify(item);
		return this.datagrid.rows.find((row) => this.tree.identify(row.item) === ref);
	}
	indexOf(items, item) {
		const ref = this.tree.identify(item);
		return items.findIndex((candidate) => candidate !== void 0 && this.tree.identify(candidate) === ref);
	}
	tabStopItem() {
		const tabStop = this.datagrid.el.nativeElement.querySelector("[role=row][aria-level] [tabindex=\"0\"]");
		return tabStop ? this.datagrid.rows?.find((row) => row.el.nativeElement.contains(tabStop))?.item : void 0;
	}
	focusedCell() {
		const active = this.datagrid._focusedElement();
		const row = active && this.datagrid.rows?.find((candidate) => candidate.el.nativeElement.contains(active));
		if (row?.item === void 0) return null;
		const cells = this.cells(row.el.nativeElement);
		const cell = cells.findIndex((candidate) => candidate.contains(active));
		return {
			item: row.item,
			cell,
			inner: cell < 0 ? -1 : getTabbableItems(cells[cell]).indexOf(active)
		};
	}
	cellOf(item, cell) {
		const element = this.rowOf(item)?.el.nativeElement;
		return cell === void 0 ? element?.querySelector(".datagrid-tree-toggle")?.closest("[role=gridcell]") : this.cells(element)[cell];
	}
	cells(row) {
		return row ? Array.from(row.querySelectorAll(this.datagrid.keyNavigation.config.keyGridCells)) : [];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridTreeRenderer,
			deps: [],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridTreeRenderer,
			isStandalone: true,
			usesOnChanges: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridTreeRenderer,
	decorators: [{ type: Directive }],
	ctorParameters: () => []
});
var ClrDatagridTreeItems = class ClrDatagridTreeItems extends DatagridTreeRenderer {
	constructor() {
		super();
		this.cascadeSelection = false;
		this.iterableProxy = new NgForOf(inject(ViewContainerRef), inject(TemplateRef), inject(IterableDiffers));
		this.iterableProxy.ngForTrackBy = (_index, item) => this.tree.identify(item);
	}
	static ngTemplateContextGuard(_dir, _ctx) {
		return true;
	}
	render(items, focus, tabStop) {
		this.iterableProxy.ngForOf = items;
		this.iterableProxy.ngDoCheck();
		if (focus) {
			const target = this.nearestShown(focus.item, items);
			if (target !== void 0 && target !== focus.item) this.focus(target);
		} else if (tabStop !== void 0) this.moveTabStop(tabStop, items);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridTreeItems,
			deps: [],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "16.1.0",
			version: "22.2.4",
			type: ClrDatagridTreeItems,
			isStandalone: false,
			selector: "[clrDgTreeItems][clrDgTreeItemsOf]",
			inputs: {
				roots: ["clrDgTreeItemsOf", "roots"],
				getChildren: ["clrDgTreeItemsGetChildren", "getChildren"],
				cascadeSelection: [
					"clrDgTreeItemsCascadeSelection",
					"cascadeSelection",
					booleanAttribute
				]
			},
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridTreeItems,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrDgTreeItems][clrDgTreeItemsOf]",
			standalone: false
		}]
	}],
	ctorParameters: () => [],
	propDecorators: {
		roots: [{
			type: Input,
			args: ["clrDgTreeItemsOf"]
		}],
		getChildren: [{
			type: Input,
			args: ["clrDgTreeItemsGetChildren"]
		}],
		cascadeSelection: [{
			type: Input,
			args: [{
				alias: "clrDgTreeItemsCascadeSelection",
				transform: booleanAttribute
			}]
		}]
	}
});
const FRAMES_TO_RENDER = 3;
var ClrDatagridVirtualTree = class ClrDatagridVirtualTree extends DatagridTreeRenderer {
	constructor() {
		super(...arguments);
		this.cascadeSelection = false;
		this.renderedRootsChange = new EventEmitter();
		this.virtualScroll = inject(ClrDatagridVirtualScrollDirective);
		this.injector = inject(Injector);
		this.ngZone = inject(NgZone);
		this.shownItems = [];
		this.renderedRoots = combineLatest([this.virtualScroll.renderedRangeChange, this.tree.change]).pipe(filter(() => this.renderedRootsChange.observed), auditTime(0), map(([range]) => this.rootsOf(range)), filter(Boolean), distinctUntilChanged((previous, next) => previous.start === next.start && previous.end === next.end)).subscribe((range) => this.ngZone.run(() => this.renderedRootsChange.emit(range)));
	}
	set dataRange(range) {
		if (!range) return;
		const roots = this.roots?.length === range.total ? this.roots : new Array(range.total);
		const moved = new Set(range.data.map((item) => this.tree.identify(item)));
		roots.forEach((root, index) => {
			if (moved.has(this.tree.identify(root))) delete roots[index];
		});
		range.data.forEach((item, index) => roots[range.skip + index] = item);
		this.roots = roots;
	}
	ngOnDestroy() {
		super.ngOnDestroy();
		this.renderedRoots.unsubscribe();
		if (this.frame !== void 0) cancelAnimationFrame(this.frame);
	}
	render(items, focus, tabStop) {
		const viewport = this.datagrid.el.nativeElement.querySelector(".datagrid-content");
		const itemSize = this.virtualScroll.itemSize;
		const scrollTop = viewport?.scrollTop || 0;
		const first = Math.floor(scrollTop / itemSize);
		const last = Math.floor((scrollTop + (viewport?.clientHeight || 0)) / itemSize) - 1;
		const focused = focus ? this.indexOf(this.shownItems, focus.item) : -1;
		const onScreen = focused >= first && focused <= last;
		const anchor = onScreen ? focus.item : this.shownItems[first];
		this.shownItems = items;
		this.virtualScroll.dataRange = {
			total: items.length,
			skip: 0,
			data: items
		};
		this.virtualScroll.ngDoCheck();
		const target = focus ? this.nearestShown(focus.item, items) : void 0;
		const kept = onScreen ? target : anchor;
		const anchorAfter = kept === void 0 ? -1 : this.indexOf(items, kept);
		const shift = anchorAfter < 0 ? 0 : anchorAfter - (onScreen ? focused : first);
		if (target !== void 0 && this.datagrid.activeCellCoords) {
			const index = this.indexOf(items, target);
			this.datagrid.activeCellCoords = {
				...this.datagrid.activeCellCoords,
				ariaRowIndex: String(index + 1)
			};
		}
		afterNextRender(() => {
			if (shift && viewport) viewport.scrollTop += shift * itemSize;
			if (target !== void 0) {
				const same = target === focus.item;
				this.focusWhenRendered(target, same ? focus.cell : void 0, same ? focus.inner : -1);
			} else if (tabStop !== void 0) this.moveTabStop(tabStop, items);
		}, { injector: this.injector });
	}
	rootsOf(range) {
		const end = Math.min(range.end, this.shownItems.length);
		return range.start < end ? {
			start: this.rootAt(range.start),
			end: this.rootAt(end - 1) + 1
		} : null;
	}
	rootAt(index) {
		for (let row = index; row >= 0; row--) {
			const item = this.shownItems[row];
			if (item !== void 0) {
				let node = this.tree.nodeFor(item);
				while (node.parent) node = node.parent;
				return node.index + index - row;
			}
		}
		return index;
	}
	focusWhenRendered(item, cell, inner, attempts = FRAMES_TO_RENDER) {
		if (!this.focusInGrid()) return;
		if (this.rowOf(item) || !attempts) this.focus(item, cell, inner);
		else this.frame = requestAnimationFrame(() => this.focusWhenRendered(item, cell, inner, attempts - 1));
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridVirtualTree,
			deps: null,
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "16.1.0",
			version: "22.2.4",
			type: ClrDatagridVirtualTree,
			isStandalone: false,
			selector: "[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf],[ClrVirtualScroll][clrVirtualTreeDataRange],[clrVirtualScroll][clrVirtualTreeDataRange]",
			inputs: {
				roots: ["clrVirtualTreeOf", "roots"],
				getChildren: ["clrVirtualTreeGetChildren", "getChildren"],
				cascadeSelection: [
					"clrVirtualTreeCascadeSelection",
					"cascadeSelection",
					booleanAttribute
				],
				dataRange: ["clrVirtualTreeDataRange", "dataRange"]
			},
			outputs: { renderedRootsChange: "clrVirtualTreeRenderedRootsChange" },
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridVirtualTree,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[ClrVirtualScroll][clrVirtualTreeOf],[clrVirtualScroll][clrVirtualTreeOf],[ClrVirtualScroll][clrVirtualTreeDataRange],[clrVirtualScroll][clrVirtualTreeDataRange]",
			standalone: false
		}]
	}],
	propDecorators: {
		roots: [{
			type: Input,
			args: ["clrVirtualTreeOf"]
		}],
		getChildren: [{
			type: Input,
			args: ["clrVirtualTreeGetChildren"]
		}],
		cascadeSelection: [{
			type: Input,
			args: [{
				alias: "clrVirtualTreeCascadeSelection",
				transform: booleanAttribute
			}]
		}],
		renderedRootsChange: [{
			type: Output,
			args: ["clrVirtualTreeRenderedRootsChange"]
		}],
		dataRange: [{
			type: Input,
			args: ["clrVirtualTreeDataRange"]
		}]
	}
});
var ClrDatagridRowDetail = class ClrDatagridRowDetail {
	constructor(selection, rowActionService, expand, expandableRows, commonStrings, columnsService, displayMode) {
		this.selection = selection;
		this.rowActionService = rowActionService;
		this.expand = expand;
		this.expandableRows = expandableRows;
		this.commonStrings = commonStrings;
		this.columnsService = columnsService;
		this.displayMode = displayMode;
		this.replacedRow = false;
		this.columnAligned = false;
		this.SELECTION_TYPE = SelectionType;
		this.subscriptions = [];
		this.cellsMoved = false;
	}
	set replace(value) {
		this.expand.setReplace(!!value);
	}
	get beginningOfExpandableContentAriaText() {
		return this._beginningOfExpandableContentAriaText || `${this.commonStrings.keys.datagridExpandableBeginningOf} ${this.commonStrings.keys.datagridExpandableRowContent}`;
	}
	get endOfExpandableContentAriaText() {
		return this._endOfExpandableContentAriaText || `${this.commonStrings.keys.datagridExpandableEndOf} ${this.commonStrings.keys.datagridExpandableRowContent}`;
	}
	ngAfterContentInit() {
		this.subscriptions.push(this.expand.replace.subscribe((replaceChange) => {
			this.replacedRow = replaceChange;
		}), this.cells.changes.subscribe(() => this.syncColumnAlignment(true)));
	}
	ngAfterViewInit() {
		this.subscriptions.push(this.displayMode.view.subscribe(() => this.syncColumnAlignment()));
		this.syncColumnAlignment(true);
		this.hadCells = this.cells?.length > 0;
	}
	ngAfterViewChecked() {
		const hasCells = this.cells?.length > 0;
		if (hasCells !== this.hadCells) {
			this.hadCells = hasCells;
			this.syncColumnAlignment(true);
		}
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	syncColumnAlignment(force = false) {
		if (!this._pinnedCells || !this._scrollableCells) return;
		const columns = this.columnsService.columnStates;
		const cells = this.cells ? this.cells.toArray() : [];
		const columnAligned = cells.length > 0 && cells.length === columns.length && columns.some((column) => column.pinned);
		const layout = columnAligned ? columns.map((column) => column.pinned ? "1" : "0").join("") : "";
		if (!force && layout === this.lastLayout) return;
		this.lastLayout = layout;
		this.columnAligned = columnAligned;
		if (!columnAligned) {
			if (this.cellsMoved) {
				cells.forEach((cell) => this.moveCell(this._plainCells, cell));
				this.cellsMoved = false;
			}
			return;
		}
		cells.forEach((cell, index) => this.moveCell(this.columnsService.isPinned(index) ? this._pinnedCells : this._scrollableCells, cell));
		this.cellsMoved = true;
	}
	moveCell(container, cell) {
		if (container && !cell._view.destroyed) container.insert(cell._view);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridRowDetail,
			deps: [
				{ token: Selection },
				{ token: RowActionService },
				{ token: DatagridIfExpandService },
				{ token: ExpandableRowsCount },
				{ token: i1.ClrCommonStringsService },
				{ token: ColumnsService },
				{ token: DisplayModeService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridRowDetail,
			isStandalone: false,
			selector: "clr-dg-row-detail",
			inputs: {
				_beginningOfExpandableContentAriaText: ["clrRowDetailBeginningAriaText", "_beginningOfExpandableContentAriaText"],
				_endOfExpandableContentAriaText: ["clrRowDetailEndAriaText", "_endOfExpandableContentAriaText"],
				replace: ["clrDgReplace", "replace"]
			},
			host: {
				attributes: { "role": "row" },
				properties: {
					"class.datagrid-row-flex": "true",
					"class.datagrid-row-detail": "true",
					"attr.id": "expand.expandableId"
				}
			},
			queries: [{
				propertyName: "cells",
				predicate: ClrDatagridCell
			}],
			viewQueries: [
				{
					propertyName: "_pinnedCells",
					first: true,
					predicate: ["pinnedCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_scrollableCells",
					first: true,
					predicate: ["scrollableCells"],
					descendants: true,
					read: ViewContainerRef
				},
				{
					propertyName: "_plainCells",
					first: true,
					predicate: ["plainCells"],
					descendants: true,
					read: ViewContainerRef
				}
			],
			ngImport: i0,
			template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <!--
      These two containers mirror the ones in the row above and are only used while the detail is
      column aligned - see columnAligned. They are always rendered so the cells always have
      somewhere to be moved into, and the pinned one takes itself out of the layout while empty.
    -->
    <div class="datagrid-pinned-cells">
      <ng-container #pinnedCells></ng-container>
    </div>
    <ng-container #scrollableCells></ng-container>
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      <!--
        Where the cells go back to when the detail stops being column aligned, because a column was
        unpinned. A view that has been moved into a container cannot be handed back to the content
        projection it came from, so it needs a container of its own in the same place.
      -->
      <ng-container #plainCells></ng-container>
    }
    @if (this.cells?.length === 0) {
      <clr-dg-cell class="datagrid-container">
        <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      </clr-dg-cell>
    }

    <ng-template #noCells>
      <ng-content></ng-content>
    </ng-template>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i7$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				},
				{
					kind: "component",
					type: ClrDatagridCell,
					selector: "clr-dg-cell"
				},
				{
					kind: "directive",
					type: DatagridCellRenderer,
					selector: "clr-dg-cell"
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
	type: ClrDatagridRowDetail,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-row-detail",
			template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    <!--
      These two containers mirror the ones in the row above and are only used while the detail is
      column aligned - see columnAligned. They are always rendered so the cells always have
      somewhere to be moved into, and the pinned one takes itself out of the layout while empty.
    -->
    <div class="datagrid-pinned-cells">
      <ng-container #pinnedCells></ng-container>
    </div>
    <ng-container #scrollableCells></ng-container>
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      <!--
        Where the cells go back to when the detail stops being column aligned, because a column was
        unpinned. A view that has been moved into a container cannot be handed back to the content
        projection it came from, so it needs a container of its own in the same place.
      -->
      <ng-container #plainCells></ng-container>
    }
    @if (this.cells?.length === 0) {
      <clr-dg-cell class="datagrid-container">
        <ng-container [ngTemplateOutlet]="noCells"></ng-container>
      </clr-dg-cell>
    }

    <ng-template #noCells>
      <ng-content></ng-content>
    </ng-template>
    <div class="clr-sr-only">{{ endOfExpandableContentAriaText }}</div>
  `,
			host: {
				"[class.datagrid-row-flex]": "true",
				"[class.datagrid-row-detail]": "true",
				"[attr.id]": "expand.expandableId",
				role: "row"
			},
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: Selection },
		{ type: RowActionService },
		{ type: DatagridIfExpandService },
		{ type: ExpandableRowsCount },
		{ type: i1.ClrCommonStringsService },
		{ type: ColumnsService },
		{ type: DisplayModeService }
	],
	propDecorators: {
		_beginningOfExpandableContentAriaText: [{
			type: Input,
			args: ["clrRowDetailBeginningAriaText"]
		}],
		_endOfExpandableContentAriaText: [{
			type: Input,
			args: ["clrRowDetailEndAriaText"]
		}],
		cells: [{
			type: ContentChildren,
			args: [ClrDatagridCell]
		}],
		_pinnedCells: [{
			type: ViewChild,
			args: ["pinnedCells", { read: ViewContainerRef }]
		}],
		_scrollableCells: [{
			type: ViewChild,
			args: ["scrollableCells", { read: ViewContainerRef }]
		}],
		_plainCells: [{
			type: ViewChild,
			args: ["plainCells", { read: ViewContainerRef }]
		}],
		replace: [{
			type: Input,
			args: ["clrDgReplace"]
		}]
	}
});
var ClrDatagridFooter = class ClrDatagridFooter {
	constructor(selection, detailService, columnsService, commonStrings) {
		this.selection = selection;
		this.detailService = detailService;
		this.columnsService = columnsService;
		this.commonStrings = commonStrings;
		this.SELECTION_TYPE = SelectionType;
	}
	get hasHideableColumns() {
		return this.columnsService.hasHideableColumns;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridFooter,
			deps: [
				{ token: Selection },
				{ token: DetailService },
				{ token: ColumnsService },
				{ token: i1.ClrCommonStringsService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridFooter,
			isStandalone: false,
			selector: "clr-dg-footer",
			host: { properties: { "class.datagrid-footer": "true" } },
			ngImport: i0,
			template: `
    @if (selection.selectionType === SELECTION_TYPE.Multi && selection.current?.length > 0) {
      <div class="clr-form-control-disabled">
        <clr-checkbox-wrapper class="datagrid-footer-select">
          <input clrCheckbox type="checkbox" checked="checked" disabled />
          <label>{{ selection.current.length }}</label>
          <span class="clr-sr-only">{{ commonStrings.keys.selectedRows }}</span>
        </clr-checkbox-wrapper>
      </div>
    }
    @if (!detailService.isOpen) {
      @if (hasHideableColumns) {
        <clr-dg-column-toggle></clr-dg-column-toggle>
      }
      <div class="datagrid-footer-description">
        <ng-content></ng-content>
      </div>
    }
    <ng-content select="clr-dg-pagination"></ng-content>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i7.ClrCheckbox,
					selector: "[clrCheckbox],[clrToggle]"
				},
				{
					kind: "component",
					type: i7.ClrCheckboxWrapper,
					selector: "clr-checkbox-wrapper,clr-toggle-wrapper"
				},
				{
					kind: "component",
					type: ClrDatagridColumnToggle,
					selector: "clr-dg-column-toggle"
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
	type: ClrDatagridFooter,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-footer",
			template: `
    @if (selection.selectionType === SELECTION_TYPE.Multi && selection.current?.length > 0) {
      <div class="clr-form-control-disabled">
        <clr-checkbox-wrapper class="datagrid-footer-select">
          <input clrCheckbox type="checkbox" checked="checked" disabled />
          <label>{{ selection.current.length }}</label>
          <span class="clr-sr-only">{{ commonStrings.keys.selectedRows }}</span>
        </clr-checkbox-wrapper>
      </div>
    }
    @if (!detailService.isOpen) {
      @if (hasHideableColumns) {
        <clr-dg-column-toggle></clr-dg-column-toggle>
      }
      <div class="datagrid-footer-description">
        <ng-content></ng-content>
      </div>
    }
    <ng-content select="clr-dg-pagination"></ng-content>
  `,
			host: { "[class.datagrid-footer]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: Selection },
		{ type: DetailService },
		{ type: ColumnsService },
		{ type: i1.ClrCommonStringsService }
	]
});
var ClrDatagridPageSize = class ClrDatagridPageSize {
	constructor(page) {
		this.page = page;
		this.pageSizeOptionsId = uniqueIdFactory();
	}
	set label(label) {
		if (label) label.disableGrid();
	}
	ngOnInit() {
		if (!this.pageSizeOptions || this.pageSizeOptions.length === 0) this.pageSizeOptions = [this.page.size];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridPageSize,
			deps: [{ token: Page }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridPageSize,
			isStandalone: false,
			selector: "clr-dg-page-size",
			inputs: {
				pageSizeOptions: ["clrPageSizeOptions", "pageSizeOptions"],
				pageSizeOptionsId: ["clrPageSizeOptionsId", "pageSizeOptionsId"]
			},
			viewQueries: [{
				propertyName: "label",
				first: true,
				predicate: ClrControlLabel,
				descendants: true,
				static: true
			}],
			ngImport: i0,
			template: `
    <label [for]="pageSizeOptionsId"><ng-content></ng-content></label>
    <div class="clr-select-wrapper">
      <select [id]="pageSizeOptionsId" [class.clr-page-size-select]="true" [(ngModel)]="page.size">
        @for (option of pageSizeOptions; track option) {
          <option [ngValue]="option">{{ option }}</option>
        }
      </select>
    </div>
  `,
			isInline: true,
			dependencies: [
				{
					kind: "directive",
					type: i4.ClrControlLabel,
					selector: "label",
					inputs: ["id", "for"]
				},
				{
					kind: "directive",
					type: i6$1.NgSelectOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i6$1.ɵNgSelectMultipleOption,
					selector: "option",
					inputs: ["ngValue", "value"]
				},
				{
					kind: "directive",
					type: i6$1.SelectControlValueAccessor,
					selector: "select:not([multiple]):not([ngNoCva])[formControlName],select:not([multiple]):not([ngNoCva])[formControl],select:not([multiple]):not([ngNoCva])[ngModel]",
					inputs: ["compareWith"]
				},
				{
					kind: "directive",
					type: i6$1.NgControlStatus,
					selector: "[formControlName],[ngModel],[formControl]"
				},
				{
					kind: "directive",
					type: i6$1.NgModel,
					selector: "[ngModel]:not([formControlName]):not([formControl])",
					inputs: [
						"name",
						"disabled",
						"ngModel",
						"ngModelOptions"
					],
					outputs: ["ngModelChange"],
					exportAs: ["ngModel"]
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
	type: ClrDatagridPageSize,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-page-size",
			template: `
    <label [for]="pageSizeOptionsId"><ng-content></ng-content></label>
    <div class="clr-select-wrapper">
      <select [id]="pageSizeOptionsId" [class.clr-page-size-select]="true" [(ngModel)]="page.size">
        @for (option of pageSizeOptions; track option) {
          <option [ngValue]="option">{{ option }}</option>
        }
      </select>
    </div>
  `,
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [{ type: Page }],
	propDecorators: {
		pageSizeOptions: [{
			type: Input,
			args: ["clrPageSizeOptions"]
		}],
		pageSizeOptionsId: [{
			type: Input,
			args: ["clrPageSizeOptionsId"]
		}],
		label: [{
			type: ViewChild,
			args: [ClrControlLabel, { static: true }]
		}]
	}
});
var ClrDatagridPagination = class ClrDatagridPagination {
	constructor(page, commonStrings, detailService) {
		this.page = page;
		this.commonStrings = commonStrings;
		this.detailService = detailService;
		this.currentChanged = new EventEmitter(false);
		page.activated = true;
	}
	get pageSize() {
		return this.page.size;
	}
	set pageSize(size) {
		if (typeof size === "number") this.page.size = size;
	}
	get totalItems() {
		return this.page.totalItems;
	}
	set totalItems(total) {
		if (typeof total === "number") this.page.totalItems = total;
	}
	get lastPage() {
		return this.page.last;
	}
	set lastPage(last) {
		if (typeof last === "number") this.page.last = last;
	}
	get currentPage() {
		return this.page.current;
	}
	set currentPage(page) {
		if (typeof page === "number") this.page.current = page;
	}
	get firstItem() {
		return this.page.firstItem;
	}
	get lastItem() {
		return this.page.lastItem;
	}
	get middlePages() {
		const middlePages = [];
		if (this.page.current > 1) middlePages.push(this.page.current - 1);
		middlePages.push(this.page.current);
		if (this.page.current < this.page.last) middlePages.push(this.page.current + 1);
		return middlePages;
	}
	ngOnInit() {
		if (!this.page.size) this.page.size = 10;
		this._pageSubscription = this.page.change.subscribe((current) => this.currentChanged.emit(current));
	}
	ngOnDestroy() {
		this.page.resetPageSize(true);
		if (this._pageSubscription) this._pageSubscription.unsubscribe();
	}
	previous() {
		this.page.previous();
	}
	next() {
		this.page.next();
	}
	verifyCurrentPage(event) {
		if (parseInt(event.target.value, 10) !== this.page.current) event.target.value = this.page.current;
	}
	updateCurrentPage(event) {
		const parsed = parseInt(event.target.value, 10);
		if (!isNaN(parsed)) {
			if (parsed < 1) this.page.current = 1;
			else if (parsed > this.page.last) this.page.current = this.page.last;
			else this.page.current = parsed;
		}
		this.currentPageInputRef.nativeElement.value = this.page.current.toString();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridPagination,
			deps: [
				{ token: Page },
				{ token: i1.ClrCommonStringsService },
				{ token: DetailService }
			],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "17.0.0",
			version: "22.2.4",
			type: ClrDatagridPagination,
			isStandalone: false,
			selector: "clr-dg-pagination",
			inputs: {
				disableCurrentPageInput: ["clrDgPageInputDisabled", "disableCurrentPageInput"],
				pageSize: ["clrDgPageSize", "pageSize"],
				totalItems: ["clrDgTotalItems", "totalItems"],
				lastPage: ["clrDgLastPage", "lastPage"],
				currentPage: ["clrDgPage", "currentPage"]
			},
			outputs: { currentChanged: "clrDgPageChange" },
			host: { properties: { "class.pagination": "true" } },
			queries: [{
				propertyName: "_pageSizeComponent",
				first: true,
				predicate: ClrDatagridPageSize,
				descendants: true
			}],
			viewQueries: [{
				propertyName: "currentPageInputRef",
				first: true,
				predicate: ["currentPageInput"],
				descendants: true
			}],
			ngImport: i0,
			template: `
    @if (!detailService.isOpen) {
      @if (_pageSizeComponent) {
        <div class="pagination-size">
          <ng-content select="clr-dg-page-size"></ng-content>
        </div>
      }
      <div class="pagination-description">
        <ng-content></ng-content>
      </div>
      @if (page.last > 1) {
        <div class="pagination-list">
          <button
            type="button"
            class="pagination-first"
            [disabled]="page.current <= 1"
            (click)="page.current = 1"
            [attr.aria-label]="commonStrings.keys.firstPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.firstPage }}</span>
            <cds-icon shape="step-forward-2" direction="down"></cds-icon>
          </button>
          <button
            type="button"
            class="pagination-previous"
            [disabled]="page.current <= 1"
            (click)="page.current = page.current - 1"
            [attr.aria-label]="commonStrings.keys.previousPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.previousPage }}</span>
            <cds-icon shape="angle" direction="left"></cds-icon>
          </button>
          <div class="pagination-pages">
            @if (!disableCurrentPageInput) {
              <input
                #currentPageInput
                type="text"
                class="pagination-current clr-input"
                [size]="page.last.toString().length"
                [value]="page.current"
                (keydown.enter)="updateCurrentPage($event)"
                (blur)="verifyCurrentPage($event)"
                [attr.aria-label]="commonStrings.keys.currentPage"
              />
            } @else {
              <span>{{ page.current }}</span>
            }
            &nbsp;/&nbsp;<span [attr.aria-label]="commonStrings.keys.totalPages">{{ page.last }}</span>
          </div>
          <button
            type="button"
            class="pagination-next"
            [disabled]="page.current >= page.last"
            (click)="page.current = page.current + 1"
            [attr.aria-label]="commonStrings.keys.nextPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.nextPage }}</span>
            <cds-icon shape="angle" direction="right"></cds-icon>
          </button>
          <button
            type="button"
            class="pagination-last"
            [disabled]="page.current >= page.last"
            (click)="page.current = page.last"
            [attr.aria-label]="commonStrings.keys.lastPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.lastPage }}</span>
            <cds-icon shape="step-forward-2" direction="up"></cds-icon>
          </button>
        </div>
      }
    }
    @if (detailService.isOpen) {
      <div class="pagination-description-compact">
        {{ page.firstItem + 1 }}-{{ page.lastItem + 1 }} / {{ page.totalItems }}
      </div>
      <div class="pagination-list">
        <button
          type="button"
          class="pagination-previous"
          [disabled]="page.current <= 1"
          (click)="page.current = page.current - 1"
          [attr.aria-label]="commonStrings.keys.previousPage"
        >
          <span class="clr-sr-only">{{ commonStrings.keys.previousPage }}</span>
          <cds-icon shape="angle" direction="left"></cds-icon>
        </button>
        <span>{{ page.current }}</span>
        <button
          type="button"
          class="pagination-next"
          [disabled]="page.current >= page.last"
          (click)="page.current = page.current + 1"
          [attr.aria-label]="commonStrings.keys.nextPage"
        >
          <span class="clr-sr-only">{{ commonStrings.keys.nextPage }}</span>
          <cds-icon shape="angle" direction="right"></cds-icon>
        </button>
      </div>
    }
  `,
			isInline: true,
			dependencies: [{
				kind: "component",
				type: i6$2.ClrIcon,
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
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridPagination,
	decorators: [{
		type: Component,
		args: [{
			selector: "clr-dg-pagination",
			template: `
    @if (!detailService.isOpen) {
      @if (_pageSizeComponent) {
        <div class="pagination-size">
          <ng-content select="clr-dg-page-size"></ng-content>
        </div>
      }
      <div class="pagination-description">
        <ng-content></ng-content>
      </div>
      @if (page.last > 1) {
        <div class="pagination-list">
          <button
            type="button"
            class="pagination-first"
            [disabled]="page.current <= 1"
            (click)="page.current = 1"
            [attr.aria-label]="commonStrings.keys.firstPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.firstPage }}</span>
            <cds-icon shape="step-forward-2" direction="down"></cds-icon>
          </button>
          <button
            type="button"
            class="pagination-previous"
            [disabled]="page.current <= 1"
            (click)="page.current = page.current - 1"
            [attr.aria-label]="commonStrings.keys.previousPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.previousPage }}</span>
            <cds-icon shape="angle" direction="left"></cds-icon>
          </button>
          <div class="pagination-pages">
            @if (!disableCurrentPageInput) {
              <input
                #currentPageInput
                type="text"
                class="pagination-current clr-input"
                [size]="page.last.toString().length"
                [value]="page.current"
                (keydown.enter)="updateCurrentPage($event)"
                (blur)="verifyCurrentPage($event)"
                [attr.aria-label]="commonStrings.keys.currentPage"
              />
            } @else {
              <span>{{ page.current }}</span>
            }
            &nbsp;/&nbsp;<span [attr.aria-label]="commonStrings.keys.totalPages">{{ page.last }}</span>
          </div>
          <button
            type="button"
            class="pagination-next"
            [disabled]="page.current >= page.last"
            (click)="page.current = page.current + 1"
            [attr.aria-label]="commonStrings.keys.nextPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.nextPage }}</span>
            <cds-icon shape="angle" direction="right"></cds-icon>
          </button>
          <button
            type="button"
            class="pagination-last"
            [disabled]="page.current >= page.last"
            (click)="page.current = page.last"
            [attr.aria-label]="commonStrings.keys.lastPage"
          >
            <span class="clr-sr-only">{{ commonStrings.keys.lastPage }}</span>
            <cds-icon shape="step-forward-2" direction="up"></cds-icon>
          </button>
        </div>
      }
    }
    @if (detailService.isOpen) {
      <div class="pagination-description-compact">
        {{ page.firstItem + 1 }}-{{ page.lastItem + 1 }} / {{ page.totalItems }}
      </div>
      <div class="pagination-list">
        <button
          type="button"
          class="pagination-previous"
          [disabled]="page.current <= 1"
          (click)="page.current = page.current - 1"
          [attr.aria-label]="commonStrings.keys.previousPage"
        >
          <span class="clr-sr-only">{{ commonStrings.keys.previousPage }}</span>
          <cds-icon shape="angle" direction="left"></cds-icon>
        </button>
        <span>{{ page.current }}</span>
        <button
          type="button"
          class="pagination-next"
          [disabled]="page.current >= page.last"
          (click)="page.current = page.current + 1"
          [attr.aria-label]="commonStrings.keys.nextPage"
        >
          <span class="clr-sr-only">{{ commonStrings.keys.nextPage }}</span>
          <cds-icon shape="angle" direction="right"></cds-icon>
        </button>
      </div>
    }
  `,
			host: { "[class.pagination]": "true" },
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	ctorParameters: () => [
		{ type: Page },
		{ type: i1.ClrCommonStringsService },
		{ type: DetailService }
	],
	propDecorators: {
		disableCurrentPageInput: [{
			type: Input,
			args: ["clrDgPageInputDisabled"]
		}],
		currentChanged: [{
			type: Output,
			args: ["clrDgPageChange"]
		}],
		_pageSizeComponent: [{
			type: ContentChild,
			args: [ClrDatagridPageSize]
		}],
		currentPageInputRef: [{
			type: ViewChild,
			args: ["currentPageInput"]
		}],
		pageSize: [{
			type: Input,
			args: ["clrDgPageSize"]
		}],
		totalItems: [{
			type: Input,
			args: ["clrDgTotalItems"]
		}],
		lastPage: [{
			type: Input,
			args: ["clrDgLastPage"]
		}],
		currentPage: [{
			type: Input,
			args: ["clrDgPage"]
		}]
	}
});
var DatagridDetailRegisterer = class DatagridDetailRegisterer {
	constructor(expandableRowsCount) {
		this.expandableRowsCount = expandableRowsCount;
		if (expandableRowsCount) expandableRowsCount.register();
	}
	ngOnDestroy() {
		if (this.expandableRowsCount) this.expandableRowsCount.unregister();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridDetailRegisterer,
			deps: [{
				token: ExpandableRowsCount,
				optional: true
			}],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridDetailRegisterer,
			isStandalone: false,
			selector: "[clrIfExpanded]",
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridDetailRegisterer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[clrIfExpanded]",
			standalone: false
		}]
	}],
	ctorParameters: () => [{
		type: ExpandableRowsCount,
		decorators: [{ type: Optional }]
	}]
});
var DatagridHeaderRenderer = class DatagridHeaderRenderer {
	constructor(el, renderer, organizer, domAdapter, columnResizerService, columnsService, columnState) {
		this.el = el;
		this.renderer = renderer;
		this.domAdapter = domAdapter;
		this.columnResizerService = columnResizerService;
		this.columnsService = columnsService;
		this.columnState = columnState;
		this.resizeEmitter = new EventEmitter();
		this.widthSet = false;
		this.autoSet = false;
		this.subscriptions = [];
		this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth()));
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
	}
	getColumnWidthState() {
		const strictWidth = this.detectStrictWidth();
		return {
			width: this.computeWidth(strictWidth),
			strictWidth
		};
	}
	setColumnState(index) {
		this.columnsService.columns[index] = this.columnState;
	}
	setWidth(state) {
		if (state.strictWidth) {
			if (this.columnResizerService.resizedBy) {
				this.resizeEmitter.emit(state.width);
				this.renderer.setStyle(this.el.nativeElement, "width", state.width + "px");
				this.widthSet = false;
			}
			this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
			this.autoSet = false;
		} else {
			this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
			this.renderer.setStyle(this.el.nativeElement, "width", state.width + "px");
			this.widthSet = true;
			this.autoSet = true;
		}
	}
	setHidden(state) {
		if (state.hidden) this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
		else this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
	}
	setPinned(state) {
		if (state.pinned) this.renderer.addClass(this.el.nativeElement, PINNED_COLUMN_CLASS);
		else this.renderer.removeClass(this.el.nativeElement, PINNED_COLUMN_CLASS);
	}
	clearWidth() {
		if (this.widthSet && !this.columnResizerService.resizedBy) this.renderer.setStyle(this.el.nativeElement, "width", null);
		if (this.autoSet) this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
	}
	detectStrictWidth() {
		if (this.columnResizerService.resizedBy) return this.columnResizerService.widthAfterResize;
		else if (this.autoSet) return 0;
		else return this.domAdapter.userDefinedWidth(this.el.nativeElement);
	}
	computeWidth(strictWidth) {
		let width = strictWidth;
		if (!width) width = this.domAdapter.scrollWidth(this.el.nativeElement);
		return width;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridHeaderRenderer,
			deps: [
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: DatagridRenderOrganizer },
				{ token: i1.DomAdapter },
				{ token: ColumnResizerService },
				{ token: ColumnsService },
				{ token: COLUMN_STATE }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridHeaderRenderer,
			isStandalone: false,
			selector: "clr-dg-column",
			outputs: { resizeEmitter: "clrDgColumnResize" },
			providers: [ColumnResizerService, COLUMN_STATE_PROVIDER],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridHeaderRenderer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-dg-column",
			providers: [ColumnResizerService, COLUMN_STATE_PROVIDER],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: DatagridRenderOrganizer },
		{ type: i1.DomAdapter },
		{ type: ColumnResizerService },
		{ type: ColumnsService },
		{
			type: i12.BehaviorSubject,
			decorators: [{
				type: Inject,
				args: [COLUMN_STATE]
			}]
		}
	],
	propDecorators: { resizeEmitter: [{
		type: Output,
		args: ["clrDgColumnResize"]
	}] }
});
var NoopDomAdapter = class NoopDomAdapter {
	userDefinedWidth(_element) {
		return 0;
	}
	scrollBarWidth(_element) {
		return 0;
	}
	scrollWidth(_element) {
		return 0;
	}
	computedHeight(_element) {
		return 0;
	}
	clientRect(_element) {
		return {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0
		};
	}
	minWidth(_element) {
		return 0;
	}
	focus(_element) {}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: NoopDomAdapter,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: NoopDomAdapter
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: NoopDomAdapter,
	decorators: [{ type: Injectable }]
});
const domAdapterFactory = (platformId) => {
	if (isPlatformBrowser(platformId)) return new DomAdapter();
	else return new NoopDomAdapter();
};
var DatagridMainRenderer = class DatagridMainRenderer {
	constructor(datagrid, organizer, items, page, el, renderer, detailService, tableSizeService, columnsService, ngZone, keyNavigation, changeDetectorRef) {
		this.datagrid = datagrid;
		this.organizer = organizer;
		this.items = items;
		this.page = page;
		this.el = el;
		this.renderer = renderer;
		this.tableSizeService = tableSizeService;
		this.columnsService = columnsService;
		this.ngZone = ngZone;
		this.keyNavigation = keyNavigation;
		this.changeDetectorRef = changeDetectorRef;
		this._heightSet = false;
		this.shouldStabilizeColumns = true;
		this.subscriptions = [];
		this.intersectionObserver = null;
		this.columnsSizesStable = false;
		this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS).subscribe(() => this.computeHeadersWidth()));
		this.subscriptions.push(page.sizeChange.subscribe(() => {
			if (this._heightSet) this.resetDatagridHeight();
		}));
		this.subscriptions.push(detailService.stateChange.subscribe((state) => this.toggleDetailPane(state)));
		this.subscriptions.push(items.change.subscribe(() => this.shouldStabilizeColumns = true));
	}
	ngOnInit() {
		this.columnsService.columnsStateChange.subscribe((change) => this.columnStateChanged(change));
		if (this.el.nativeElement.offsetParent === null) {
			this.intersectionObserver = new IntersectionObserver(([entry]) => {
				if ((this.el.nativeElement.offsetParent || entry.isIntersecting) && this.columnsSizesStable) {
					this.columnsSizesStable = false;
					this.changeDetectorRef.markForCheck();
					this.intersectionObserver.disconnect();
				}
			});
			this.intersectionObserver.observe(this.el.nativeElement);
		}
	}
	ngAfterContentInit() {
		this.setupColumns();
		this.subscriptions.push(this.headers.changes.subscribe(() => {
			this.setupColumns();
			this.columnsSizesStable = false;
			this.stabilizeColumns();
		}));
	}
	ngAfterViewInit() {
		this.tableSizeService.table = this.el;
	}
	ngAfterViewChecked() {
		if (this.shouldStabilizeColumns) this.stabilizeColumns();
		if (this.shouldComputeHeight()) this.ngZone.runOutsideAngular(() => {
			setTimeout(() => {
				this.computeDatagridHeight();
			});
		});
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.intersectionObserver?.disconnect();
	}
	toggleDetailPane(state) {
		if (this.headers) {
			if (state && !this.columnsService.hasCache()) {
				this.columnsService.cache();
				const keptColumn = this.columnsService.visibleColumns.find((column) => column.pinned) || this.columnsService.visibleColumns[0];
				this.columnsService.visibleColumns.forEach((header) => {
					if (header !== keptColumn) this.columnsService.emitStateChangeAt(header.columnIndex, {
						changes: [DatagridColumnChanges.HIDDEN],
						hidden: state
					});
					if (header.pinned) this.columnsService.emitStateChangeAt(header.columnIndex, {
						changes: [DatagridColumnChanges.PINNED],
						pinned: false
					});
				});
			} else if (!state) this.columnsService.resetToLastCache();
		}
	}
	setupColumns() {
		this.headers.forEach((header, index) => header.setColumnState(index));
		this.columnsService.columns.splice(this.headers.length);
		this.columnsService.columns.forEach((column, index) => {
			this.columnsService.emitStateChange(column, {
				changes: [DatagridColumnChanges.INITIALIZE],
				columnIndex: index
			});
		});
	}
	shouldComputeHeight() {
		if (!this._heightSet && this.page.size > 0) {
			if (this.items.displayed.length === this.page.size) return true;
		}
		return false;
	}
	computeDatagridHeight() {
		const height = window.getComputedStyle(this.el.nativeElement).height;
		this.renderer.setStyle(this.el.nativeElement, "height", height);
		this._heightSet = true;
	}
	resetDatagridHeight() {
		this.renderer.setStyle(this.el.nativeElement, "height", "");
		this._heightSet = false;
	}
	computeHeadersWidth() {
		const nbColumns = this.headers.length;
		const headerWidths = this.headers.map((header) => {
			return header.getColumnWidthState();
		});
		let allStrict = true;
		this.headers.forEach((header, index) => {
			const state = {
				changes: [DatagridColumnChanges.WIDTH],
				...headerWidths[index]
			};
			if (!state.strictWidth) allStrict = false;
			if (nbColumns === index + 1 && allStrict) state.strictWidth = 0;
			this.columnsService.emitStateChangeAt(index, state);
		});
	}
	columnStateChanged(state) {
		if (!this.headers || state.columnIndex == null) return;
		const columnIndex = state.columnIndex;
		if (state.changes && state.changes.length) state.changes.forEach((change) => {
			switch (change) {
				case DatagridColumnChanges.WIDTH:
					this.headers.get(columnIndex).setWidth(state);
					this.rows.forEach((row) => {
						if (row?.cells.length === this.columnsService.columns.length) {
							row.cells.get(columnIndex).setWidth(state);
							row.expandableRows.forEach((expandableRow) => {
								expandableRow.cells.get(columnIndex)?.setWidth(state);
							});
						}
					});
					break;
				case DatagridColumnChanges.HIDDEN:
					this.headers.get(columnIndex).setHidden(state);
					this.rows.forEach((row) => {
						if (row.cells && row.cells.length) {
							row.cells.get(columnIndex).setHidden(state);
							row.expandableRows.forEach((expandableRow) => {
								expandableRow.cells.get(columnIndex)?.setHidden(state);
							});
						}
					});
					this.updateColumnSeparatorsVisibility();
					this.keyNavigation.resetKeyGrid();
					break;
				case DatagridColumnChanges.PINNED: {
					const wasPinned = this.datagrid.columns.get(columnIndex)?.isPinned;
					this.headers.get(columnIndex).setPinned(state);
					this.rows.forEach((row) => {
						if (row.cells && row.cells.length) {
							row.cells.get(columnIndex)?.setPinned(state);
							row.expandableRows.forEach((expandableRow) => {
								expandableRow.cells.get(columnIndex)?.setPinned(state);
							});
						}
					});
					if (wasPinned !== !!state.pinned) {
						this.updateColumnSeparatorsVisibility();
						this.keyNavigation.resetKeyGrid();
						this.columnsSizesStable = false;
						this.shouldStabilizeColumns = true;
						this.changeDetectorRef.markForCheck();
					}
					break;
				}
				case DatagridColumnChanges.INITIALIZE:
					if (state.pinned) this.headers.get(columnIndex).setPinned(state);
					if (state.hideable && state.hidden) this.headers.get(columnIndex).setHidden(state);
					if (state.pinned || state.hideable && state.hidden) {
						this.rows.forEach((row) => {
							row.setCellsState();
							row.expandableRows.forEach((expandableRow) => {
								expandableRow.setCellsState();
							});
						});
						this.updateColumnSeparatorsVisibility();
					}
			}
		});
	}
	stabilizeColumns() {
		if (this.columnsSizesStable) return;
		if (this.items.displayed.length > 0) {
			this.organizer.resize();
			this.columnsSizesStable = true;
		}
	}
	updateColumnSeparatorsVisibility() {
		const visibleColumns = this.datagrid.columns.filter((column) => !column.isHidden);
		const scrollableColumns = visibleColumns.filter((column) => !column.isPinned);
		const lastScrollableColumn = scrollableColumns[scrollableColumns.length - 1];
		visibleColumns.forEach((column) => {
			const showSeparator = column !== lastScrollableColumn;
			if (column.showSeparator !== showSeparator) column.showSeparator = showSeparator;
		});
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridMainRenderer,
			deps: [
				{ token: ClrDatagrid },
				{ token: DatagridRenderOrganizer },
				{ token: Items },
				{ token: Page },
				{ token: i0.ElementRef },
				{ token: i0.Renderer2 },
				{ token: DetailService },
				{ token: TableSizeService },
				{ token: ColumnsService },
				{ token: i0.NgZone },
				{ token: KeyNavigationGridController },
				{ token: i0.ChangeDetectorRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridMainRenderer,
			isStandalone: false,
			selector: "clr-datagrid",
			providers: [{
				provide: DomAdapter,
				useFactory: domAdapterFactory,
				deps: [PLATFORM_ID]
			}],
			queries: [{
				propertyName: "headers",
				predicate: DatagridHeaderRenderer
			}, {
				propertyName: "rows",
				predicate: DatagridRowRenderer
			}],
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridMainRenderer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-datagrid",
			providers: [{
				provide: DomAdapter,
				useFactory: domAdapterFactory,
				deps: [PLATFORM_ID]
			}],
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: ClrDatagrid },
		{ type: DatagridRenderOrganizer },
		{ type: Items },
		{ type: Page },
		{ type: i0.ElementRef },
		{ type: i0.Renderer2 },
		{ type: DetailService },
		{ type: TableSizeService },
		{ type: ColumnsService },
		{ type: i0.NgZone },
		{ type: KeyNavigationGridController },
		{ type: i0.ChangeDetectorRef }
	],
	propDecorators: {
		headers: [{
			type: ContentChildren,
			args: [DatagridHeaderRenderer]
		}],
		rows: [{
			type: ContentChildren,
			args: [DatagridRowRenderer]
		}]
	}
});
var DatagridRowDetailRenderer = class DatagridRowDetailRenderer extends DatagridRowRenderer {
	constructor(parentRow, columnsService, el) {
		super(columnsService, el);
		this.parentRow = parentRow;
		parentRow.expandableRows.push(this);
	}
	ngOnDestroy() {
		this.parentRow.expandableRows = [];
		super.ngOnDestroy();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: DatagridRowDetailRenderer,
			deps: [
				{ token: DatagridRowRenderer },
				{ token: ColumnsService },
				{ token: i0.ElementRef }
			],
			target: i0.ɵɵFactoryTarget.Directive
		});
	}
	static {
		this.ɵdir = i0.ɵɵngDeclareDirective({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: DatagridRowDetailRenderer,
			isStandalone: false,
			selector: "clr-dg-row-detail",
			usesInheritance: true,
			ngImport: i0
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: DatagridRowDetailRenderer,
	decorators: [{
		type: Directive,
		args: [{
			selector: "clr-dg-row-detail",
			standalone: false
		}]
	}],
	ctorParameters: () => [
		{ type: DatagridRowRenderer },
		{ type: ColumnsService },
		{ type: i0.ElementRef }
	]
});
const CLR_DATAGRID_DIRECTIVES = [
	ClrDatagrid,
	ClrDatagridActionBar,
	ClrDatagridActionOverflow,
	ClrDatagridCell,
	ClrDatagridColumn,
	ClrDatagridColumnAction,
	ClrDatagridColumnActions,
	ClrDatagridColumnSeparator,
	ClrDatagridDetail,
	ClrDatagridDetailBody,
	ClrDatagridDetailHeader,
	ClrDatagridFilter,
	ClrDatagridFooter,
	ClrDatagridHideableColumn,
	ClrDatagridItems,
	ClrDatagridTreeItems,
	ClrDatagridVirtualTree,
	ClrDatagridPageSize,
	ClrDatagridPagination,
	ClrDatagridPlaceholder,
	ClrDatagridRow,
	ClrDatagridRowDetail,
	ClrDatagridSelectionCellDirective,
	ClrDatagridVirtualScrollDirective,
	ClrIfDetail,
	DatagridDetailRegisterer,
	WrappedCell,
	WrappedColumn,
	WrappedRow,
	DatagridCellRenderer,
	DatagridHeaderRenderer,
	DatagridMainRenderer,
	DatagridRowDetailRenderer,
	DatagridRowRenderer,
	DatagridNumericFilter,
	DatagridStringFilter
];
const CLR_DATAGRID_INTERNAL_DIRECTIVES = [
	ClrDatagridColumnToggle,
	ClrDatagridColumnToggleButton,
	ClrDatagridTreeToggleButton
];
const CLR_DATAGRID_STANDALONE_DIRECTIVES = [ClrDatagridSingleSelectionValueAccessor];
const CLR_DATAGRID_SHARED_DIRECTIVES = [ClrIfExpanded];
var ClrDatagridModule = class ClrDatagridModule {
	constructor() {
		ClarityIcons.addIcons(ellipsisVerticalIcon, ellipsisGridCircleIcon, viewColumnsIcon, windowCloseIcon, arrowIcon, timesIcon, twoWayArrowsIcon, stepForward2Icon, angleDoubleIcon, filterGridCircleIcon, filterGridIcon, pinIcon, unpinIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridModule,
			declarations: [
				ClrDatagrid,
				ClrDatagridActionBar,
				ClrDatagridActionOverflow,
				ClrDatagridCell,
				ClrDatagridColumn,
				ClrDatagridColumnAction,
				ClrDatagridColumnActions,
				ClrDatagridColumnSeparator,
				ClrDatagridDetail,
				ClrDatagridDetailBody,
				ClrDatagridDetailHeader,
				ClrDatagridFilter,
				ClrDatagridFooter,
				ClrDatagridHideableColumn,
				ClrDatagridItems,
				ClrDatagridTreeItems,
				ClrDatagridVirtualTree,
				ClrDatagridPageSize,
				ClrDatagridPagination,
				ClrDatagridPlaceholder,
				ClrDatagridRow,
				ClrDatagridRowDetail,
				ClrDatagridSelectionCellDirective,
				ClrDatagridVirtualScrollDirective,
				ClrIfDetail,
				DatagridDetailRegisterer,
				WrappedCell,
				WrappedColumn,
				WrappedRow,
				DatagridCellRenderer,
				DatagridHeaderRenderer,
				DatagridMainRenderer,
				DatagridRowDetailRenderer,
				DatagridRowRenderer,
				DatagridNumericFilter,
				DatagridStringFilter,
				ClrDatagridColumnToggle,
				ClrDatagridColumnToggleButton,
				ClrDatagridTreeToggleButton
			],
			imports: [
				CommonModule,
				CdkDragModule,
				CdkTrapFocusModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrCheckboxModule,
				ClrNumberInputModule,
				ClrSelectModule,
				FormsModule,
				ClrLoadingModule,
				ClrConditionalModule,
				ClrOutsideClickModule,
				ClrExpandableAnimationModule,
				ClrSpinnerModule,
				ClrPopoverModuleNext,
				ClrDropdownModule,
				ClrKeyFocusModule,
				ClrDatagridSingleSelectionValueAccessor,
				ClrIfExpanded
			],
			exports: [
				ClrDatagrid,
				ClrDatagridActionBar,
				ClrDatagridActionOverflow,
				ClrDatagridCell,
				ClrDatagridColumn,
				ClrDatagridColumnAction,
				ClrDatagridColumnActions,
				ClrDatagridColumnSeparator,
				ClrDatagridDetail,
				ClrDatagridDetailBody,
				ClrDatagridDetailHeader,
				ClrDatagridFilter,
				ClrDatagridFooter,
				ClrDatagridHideableColumn,
				ClrDatagridItems,
				ClrDatagridTreeItems,
				ClrDatagridVirtualTree,
				ClrDatagridPageSize,
				ClrDatagridPagination,
				ClrDatagridPlaceholder,
				ClrDatagridRow,
				ClrDatagridRowDetail,
				ClrDatagridSelectionCellDirective,
				ClrDatagridVirtualScrollDirective,
				ClrIfDetail,
				DatagridDetailRegisterer,
				WrappedCell,
				WrappedColumn,
				WrappedRow,
				DatagridCellRenderer,
				DatagridHeaderRenderer,
				DatagridMainRenderer,
				DatagridRowDetailRenderer,
				DatagridRowRenderer,
				DatagridNumericFilter,
				DatagridStringFilter,
				ClrDatagridSingleSelectionValueAccessor,
				ClrIfExpanded
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ClrDatagridModule,
			imports: [
				CommonModule,
				CdkDragModule,
				CdkTrapFocusModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrCheckboxModule,
				ClrNumberInputModule,
				ClrSelectModule,
				FormsModule,
				ClrLoadingModule,
				ClrConditionalModule,
				ClrOutsideClickModule,
				ClrExpandableAnimationModule,
				ClrSpinnerModule,
				ClrPopoverModuleNext,
				ClrDropdownModule,
				ClrKeyFocusModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ClrDatagridModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				CommonModule,
				CdkDragModule,
				CdkTrapFocusModule,
				ClrIcon,
				ClrInputModule,
				ClrRadioModule,
				ClrCheckboxModule,
				ClrNumberInputModule,
				ClrSelectModule,
				FormsModule,
				ClrLoadingModule,
				ClrConditionalModule,
				ClrOutsideClickModule,
				ClrExpandableAnimationModule,
				ClrSpinnerModule,
				ClrPopoverModuleNext,
				ClrDropdownModule,
				ClrKeyFocusModule,
				CLR_DATAGRID_STANDALONE_DIRECTIVES,
				CLR_DATAGRID_SHARED_DIRECTIVES
			],
			declarations: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_INTERNAL_DIRECTIVES],
			exports: [
				CLR_DATAGRID_DIRECTIVES,
				CLR_DATAGRID_STANDALONE_DIRECTIVES,
				CLR_DATAGRID_SHARED_DIRECTIVES
			]
		}]
	}],
	ctorParameters: () => []
});
export { CLR_DATAGRID_DIRECTIVES, ClrDatagrid, ClrDatagridActionBar, ClrDatagridActionOverflow, ClrDatagridAriaSortOrder, ClrDatagridCell, ClrDatagridColumn, ClrDatagridColumnAction, ClrDatagridColumnActions, ClrDatagridColumnSeparator, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton, ClrDatagridDetail, ClrDatagridDetailBody, ClrDatagridDetailHeader, ClrDatagridFilter, ClrDatagridFooter, ClrDatagridHideableColumn, ClrDatagridItems, ClrDatagridModule, ClrDatagridPageSize, ClrDatagridPagination, ClrDatagridPlaceholder, ClrDatagridRow, ClrDatagridRowDetail, ClrDatagridSelectionCellDirective, ClrDatagridSingleSelectionValueAccessor, ClrDatagridSortOrder, ClrDatagridTreeItems, ClrDatagridTreeToggleButton, ClrDatagridVirtualScrollDirective, ClrDatagridVirtualTree, ClrIfDetail, DatagridCellRenderer, DatagridDetailRegisterer, DatagridHeaderRenderer, DatagridMainRenderer, DatagridNumericFilter, DatagridPropertyComparator, DatagridPropertyNumericFilter, DatagridPropertyStringFilter, DatagridRowDetailRenderer, DatagridRowRenderer, DatagridStringFilter, Selection, SelectionType, WrappedCell, WrappedColumn, WrappedRow, selectionTypeAttribute };

//# sourceMappingURL=clr-angular-data-datagrid.mjs.map