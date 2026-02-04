import * as i0 from '@angular/core';
import { Injectable, Directive, ViewChild, Component, PLATFORM_ID, Inject, DOCUMENT, EventEmitter, ElementRef, Input, Output, Optional, ContentChild, ChangeDetectionStrategy, ContentChildren, forwardRef, HostListener, ViewContainerRef, runInInjectionContext, Injector, ChangeDetectorRef, NgZone, Renderer2, inject, EnvironmentInjector, TemplateRef, IterableDiffers, ViewChildren, InjectionToken, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/utils';
import { uniqueIdFactory, normalizeKey, Keys, HostWrapper, IfExpandService, ClrLoadingState, ClrExpandableAnimationDirective, LoadingListener, WillyWonka, OompaLoompa, ClrKeyFocus, DomAdapter, CdkDragModule, CdkTrapFocusModule, ClrLoadingModule, ClrConditionalModule, ClrOutsideClickModule, ClrExpandableAnimationModule, ClrKeyFocusModule } from '@clr/angular/utils';
import * as i2$2 from 'rxjs';
import { Subject, BehaviorSubject, fromEvent, ReplaySubject, combineLatest, merge, of } from 'rxjs';
import { filter, takeUntil, delay, debounceTime, map, switchMap } from 'rxjs/operators';
import * as i3 from '@clr/angular/popover/common';
import { ClrPopoverPosition, ClrPopoverType, ClrPopoverHostDirective, mapPopoverKeyToPosition, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext } from '@clr/angular/popover/common';
import * as i1 from '@clr/angular/modal';
import * as i9 from '@angular/common';
import { isPlatformBrowser, NgForOf, CommonModule } from '@angular/common';
import * as i5 from '@clr/angular/icon';
import { ClarityIcons, ellipsisVerticalIcon, viewColumnsIcon, windowCloseIcon, arrowIcon, timesIcon, stepForward2Icon, angleDoubleIcon, filterGridCircleIcon, filterGridIcon, ClrIcon } from '@clr/angular/icon';
import * as i4 from '@clr/angular/forms/common';
import { ClrControlLabel } from '@clr/angular/forms/common';
import * as i5$1 from '@clr/angular/forms/number-input';
import { ClrNumberInputModule } from '@clr/angular/forms/number-input';
import * as i13 from '@angular/forms';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import * as i5$2 from '@clr/angular/forms/input';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrSignpost } from '@clr/angular/popover/signpost';
import * as i12 from '@clr/angular/forms/radio';
import { ClrRadioModule } from '@clr/angular/forms/radio';
import * as i14 from '@clr/angular/progress/spinner';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import * as i2$1 from '@angular/cdk/bidi';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import * as i3$1 from '@angular/cdk/scrolling';
import { FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY, ScrollDispatcher, ViewportRuler, CdkVirtualScrollable, CdkVirtualScrollViewport, CdkVirtualForOf } from '@angular/cdk/scrolling';
import * as i7 from '@clr/angular/forms/checkbox';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrSelectModule } from '@clr/angular/forms/select';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Generic accessor for deep object properties
 * that can be specified as simple dot-separated strings.
 */
class NestedProperty {
    constructor(prop) {
        this.prop = prop;
        if (prop.indexOf('.') >= 0) {
            this.splitProp = prop.split('.');
        }
    }
    // Safe getter for a deep object property, will not throw an error but return
    // undefined if one of the intermediate properties is null or undefined.
    getPropValue(item) {
        if (this.splitProp) {
            let value = item;
            for (const nestedProp of this.splitProp) {
                if (value === null ||
                    typeof value === 'undefined' ||
                    typeof value[nestedProp] === 'undefined') {
                    return undefined;
                }
                value = value[nestedProp];
            }
            return value;
        }
        else {
            return item[this.prop];
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridPropertyComparator {
    constructor(prop) {
        this.prop = prop;
        this.nestedProp = new NestedProperty(prop);
    }
    compare(a, b) {
        let propA = this.nestedProp.getPropValue(a);
        let propB = this.nestedProp.getPropValue(b);
        if (typeof propA === 'string') {
            propA = propA.toLowerCase();
        }
        if (typeof propB === 'string') {
            propB = propB.toLowerCase();
        }
        if (typeof propA === 'undefined' || propA === null) {
            if (typeof propB === 'undefined' || propB === null) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            if (typeof propB === 'undefined' || propB === null) {
                return -1;
            }
            else if (propA < propB) {
                return -1;
            }
            else if (propA > propB) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridPropertyNumericFilter {
    constructor(prop, exact = false) {
        this.prop = prop;
        this.exact = exact;
        this.nestedProp = new NestedProperty(prop);
    }
    accepts(item, low, high) {
        const propValue = this.nestedProp.getPropValue(item);
        if (propValue === undefined) {
            return false;
        }
        if (low !== null && (typeof propValue !== 'number' || propValue < low)) {
            return false;
        }
        if (high !== null && (typeof propValue !== 'number' || propValue > high)) {
            return false;
        }
        return true;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridNumericFilterImpl {
    constructor(filterFn) {
        this.filterFn = filterFn;
        /**
         * The Observable required as part of the Filter interface
         */
        this._changes = new Subject();
        /**
         * Internal values and accessor
         */
        this._low = null;
        this._high = null;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
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
        if (this.filterFn instanceof DatagridPropertyNumericFilter) {
            return {
                property: this.filterFn.prop,
                low: this._low,
                high: this._high,
            };
        }
        return this;
    }
    /**
     * Indicates if the filter is currently active, (at least one input is set)
     */
    isActive() {
        return this._low !== null || this.high !== null;
    }
    /**
     * Tests if an item matches a search text
     */
    accepts(item) {
        // We have a filter function in case someone wants to implement a numeric
        // filter that always passes nulls or similar
        return this.filterFn.accepts(item, this._low, this._high);
    }
    equals(other) {
        if (other instanceof DatagridNumericFilterImpl) {
            if (other.filterFn instanceof DatagridPropertyNumericFilter) {
                return (this.filterFn instanceof DatagridPropertyNumericFilter &&
                    other.filterFn.prop === this.filterFn.prop &&
                    other.low === this._low &&
                    other.high === this._high);
            }
            return other === this;
        }
        return false;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridPropertyStringFilter {
    constructor(prop, exact = false) {
        this.prop = prop;
        this.exact = exact;
        this.nestedProp = new NestedProperty(prop);
    }
    accepts(item, search) {
        const propValue = this.nestedProp.getPropValue(item);
        if (typeof propValue === 'undefined') {
            return false;
        }
        else if (this.exact) {
            return ('' + propValue).toLowerCase() === search;
        }
        else {
            return ('' + propValue).toLowerCase().indexOf(search) >= 0;
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridStringFilterImpl {
    constructor(filterFn) {
        this.filterFn = filterFn;
        /**
         * The Observable required as part of the Filter interface
         */
        this._changes = new Subject();
        /**
         * Input value converted to lowercase
         */
        this._lowerCaseValue = '';
        /**
         * Raw input value
         */
        this._rawValue = '';
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get changes() {
        return this._changes.asObservable();
    }
    get lowerCaseValue() {
        return this._lowerCaseValue;
    }
    get state() {
        if (this.filterFn instanceof DatagridPropertyStringFilter) {
            return {
                property: this.filterFn.prop,
                value: this.value,
            };
        }
        return this;
    }
    get value() {
        return this._rawValue;
    }
    /**
     * Common setter for the input value
     */
    set value(value) {
        if (!value) {
            value = '';
        }
        if (value !== this._rawValue) {
            this._rawValue = value;
            this._lowerCaseValue = value.toLowerCase().trim();
            this._changes.next(value);
        }
    }
    /**
     * Indicates if the filter is currently active, meaning the input is not empty
     */
    isActive() {
        return !!this.value;
    }
    /**
     * Tests if an item matches a search text
     */
    accepts(item) {
        // We always test with the lowercase value of the input, to stay case insensitive
        return this.filterFn.accepts(item, this.lowerCaseValue);
    }
    equals(other) {
        if (other instanceof DatagridStringFilterImpl) {
            if (other.filterFn instanceof DatagridPropertyStringFilter) {
                return (this.filterFn instanceof DatagridPropertyStringFilter &&
                    other.filterFn.prop === this.filterFn.prop &&
                    other.value === this.value);
            }
            return other === this;
        }
        return false;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Enumeration representing the sorting order of a datagrid column. It is a constant Enum,
 * i.e. each value needs to be treated as a `number`, starting at index 0.
 *
 * @export
 * @enum {number}
 */
var ClrDatagridSortOrder;
(function (ClrDatagridSortOrder) {
    ClrDatagridSortOrder[ClrDatagridSortOrder["UNSORTED"] = 0] = "UNSORTED";
    ClrDatagridSortOrder[ClrDatagridSortOrder["ASC"] = 1] = "ASC";
    ClrDatagridSortOrder[ClrDatagridSortOrder["DESC"] = -1] = "DESC";
})(ClrDatagridSortOrder || (ClrDatagridSortOrder = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class CustomFilter {
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// @TODO The top two are not used now, which is probably a performance drag that was broken along the way.
// There was a previous pattern to hide everything to do computation then display, for Firefox, needs revisiting.
const NO_LAYOUT_CLASS = 'datagrid-no-layout';
const COMPUTE_WIDTH_CLASS = 'datagrid-computing-columns-width';
const STRICT_WIDTH_CLASS = 'datagrid-fixed-width';
const HIDDEN_COLUMN_CLASS = 'datagrid-hidden-column';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * This provider implements some form of synchronous debouncing through a lock pattern
 * to avoid emitting multiple state changes for a single user action.
 */
class StateDebouncer {
    constructor() {
        /*
         * This is the lock, to only emit once all the changes have finished processing
         */
        this.nbChanges = 0;
        /**
         * The Observable that lets other classes subscribe to global state changes
         */
        this._change = new Subject();
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    changeStart() {
        this.nbChanges++;
    }
    changeDone() {
        if (--this.nbChanges === 0) {
            this._change.next();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateDebouncer, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateDebouncer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateDebouncer, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class Page {
    constructor(stateDebouncer) {
        this.stateDebouncer = stateDebouncer;
        this.activated = false;
        /**
         * Page size, a value of 0 means no pagination
         */
        this._size = 0;
        /**
         * Current page
         */
        this._current = 1;
        /**
         * The Observable that lets other classes subscribe to page changes
         */
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
            if (!this.preventEmit) {
                this.stateDebouncer.changeStart();
            }
            this._size = size;
            if (size === 0) {
                this._current = 1;
            }
            else {
                // Yeap. That's the formula to keep the first item from the old page still
                // displayed in the new one.
                this._current = Math.floor((oldSize / size) * (this._current - 1)) + 1;
            }
            // We always emit an event even if the current page index didn't change, because
            // the size changing means the items inside the page are different
            if (!this.preventEmit) {
                this._change.next(this._current);
                this._sizeChange.next(this._size);
                this.stateDebouncer.changeDone();
            }
        }
        this.preventEmit = false;
    }
    get totalItems() {
        return this._totalItems || 0; // remains 0 if not set to avoid breaking change
    }
    set totalItems(total) {
        this._totalItems = total;
        // If we have less items than before, we might need to change the current page
        if (this.current > this.last) {
            this.current = this.last;
        }
    }
    get last() {
        if (this._last) {
            return this._last;
        }
        // If the last page isn't known, we compute it from the last item's index
        if (this.size > 0 && this.totalItems) {
            return Math.ceil(this.totalItems / this.size);
        }
        return 1;
    }
    set last(page) {
        this._last = page;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
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
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem() {
        if (this._totalItems === 0) {
            return -1;
        }
        if (this.size === 0) {
            return 0;
        }
        return (this.current - 1) * this.size;
    }
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem() {
        if (this._totalItems === 0) {
            return -1;
        }
        if (this.size === 0) {
            return this.totalItems - 1;
        }
        let lastInPage = this.current * this.size - 1;
        if (this.totalItems) {
            lastInPage = Math.min(lastInPage, this.totalItems - 1);
        }
        return lastInPage;
    }
    /**
     * Moves to the previous page if it exists
     */
    previous() {
        if (this.current > 1) {
            this.current--;
        }
    }
    /**
     * Moves to the next page if it exists
     */
    next() {
        if (this.current < this.last) {
            this.current++;
        }
    }
    /**
     * Resets the page size to 0
     */
    resetPageSize(preventEmit = false) {
        this.preventEmit = preventEmit;
        this.size = 0;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Page, deps: [{ token: StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Page }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Page, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: StateDebouncer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class FiltersProvider {
    constructor(_page, stateDebouncer) {
        this._page = _page;
        this.stateDebouncer = stateDebouncer;
        /**
         * This subject is the list of filters that changed last, not the whole list.
         * We emit a list rather than just one filter to allow batch changes to several at once.
         */
        this._change = new Subject();
        /**
         * List of all filters, whether they're active or not
         */
        this._all = [];
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    /**
     * Tests if at least one filter is currently active
     */
    hasActiveFilters() {
        // We do not use getActiveFilters() because this function will be called much more often
        // and stopping the loop early might be relevant.
        for (const { filter } of this._all) {
            if (filter && filter.isActive()) {
                return true;
            }
        }
        return false;
    }
    /**
     * Returns a list of all currently active filters
     */
    getActiveFilters() {
        const ret = [];
        for (const { filter } of this._all) {
            if (filter && filter.isActive()) {
                ret.push(filter);
            }
        }
        return ret;
    }
    /**
     * Registers a filter, and returns a deregistration function
     */
    add(filter) {
        const subscription = filter.changes.subscribe(() => this.resetPageAndEmitFilterChange([filter]));
        let hasUnregistered = false;
        const registered = new RegisteredFilter(filter, () => {
            if (hasUnregistered) {
                return;
            }
            subscription.unsubscribe();
            const matchIndex = this._all.findIndex(item => item.filter === filter);
            if (matchIndex >= 0) {
                this._all.splice(matchIndex, 1);
            }
            if (filter.isActive()) {
                this.resetPageAndEmitFilterChange([]);
            }
            hasUnregistered = true;
        });
        this._all.push(registered);
        if (filter.isActive()) {
            this.resetPageAndEmitFilterChange([filter]);
        }
        return registered;
    }
    /**
     * Accepts an item if it is accepted by all currently active filters
     */
    accepts(item) {
        for (const { filter } of this._all) {
            if (filter && filter.isActive() && !filter.accepts(item)) {
                return false;
            }
        }
        return true;
    }
    resetPageAndEmitFilterChange(filters) {
        this.stateDebouncer.changeStart();
        // filtering may change the page number such that current page number doesn't exist in the filtered dataset.
        // So here we always set the current page to 1 so that it'll fetch first page's data with the given filter.
        this._page.current = 1;
        this._change.next(filters);
        this.stateDebouncer.changeDone();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FiltersProvider, deps: [{ token: Page }, { token: StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FiltersProvider }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: FiltersProvider, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Page }, { type: StateDebouncer }] });
class RegisteredFilter {
    constructor(filter, unregister) {
        this.filter = filter;
        this.unregister = unregister;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridFilterRegistrar {
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
        // If we previously had another filter, we unregister it
        this.deleteFilter();
        if (filter instanceof RegisteredFilter) {
            this.registered = filter;
        }
        else if (filter) {
            this.registered = this.filters.add(filter);
        }
    }
    deleteFilter() {
        if (this.registered) {
            this.registered.unregister();
            delete this.registered;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridFilterRegistrar, deps: [{ token: FiltersProvider }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridFilterRegistrar, isStandalone: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridFilterRegistrar, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: FiltersProvider }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class WrappedColumn {
    ngAfterViewInit() {
        // Create the cells view in memory, not the DOM.
        this.columnView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.columnView.destroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedColumn, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: WrappedColumn, isStandalone: false, selector: "dg-wrapped-column", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["columnPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-column',
                    template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['columnPortal']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class Sort {
    constructor(stateDebouncer) {
        this.stateDebouncer = stateDebouncer;
        /**
         * Ascending order if false, descending if true
         */
        this._reverse = false;
        /**
         * The Observable that lets other classes subscribe to sort changes
         */
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
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    /**
     * Sets a comparator as the current one, or toggles reverse if the comparator is already used. The
     * optional forceReverse input parameter allows to override that toggling behavior by sorting in
     * reverse order if `true`.
     *
     * @memberof Sort
     */
    toggle(sortBy, forceReverse) {
        this.stateDebouncer.changeStart();
        // We modify private properties directly, to batch the change event
        if (this.comparator === sortBy) {
            this._reverse = typeof forceReverse !== 'undefined' ? forceReverse || !this._reverse : !this._reverse;
        }
        else {
            this._comparator = sortBy;
            this._reverse = typeof forceReverse !== 'undefined' ? forceReverse : false;
        }
        this.emitChange();
        this.stateDebouncer.changeDone();
    }
    /**
     * Clears the current sorting order
     */
    clear() {
        this.comparator = null;
    }
    /**
     * Compares two objects according to the current comparator
     */
    compare(a, b) {
        return (this.reverse ? -1 : 1) * this.comparator.compare(a, b);
    }
    emitChange() {
        this._change.next(this);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Sort, deps: [{ token: StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Sort }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Sort, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: StateDebouncer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DetailService {
    constructor(modalStackService) {
        this.modalStackService = modalStackService;
        this.preventScroll = false;
        this.toggleState = false;
        this._enabled = false;
        this._state = new BehaviorSubject(this.toggleState);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(state) {
        this._enabled = state;
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
        if (this.isRowOpen(item) || !item) {
            this.close();
        }
        else {
            this.open(item, button);
        }
    }
    isRowOpen(item) {
        return !!(this.toggleState && this.cache === item);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DetailService, deps: [{ token: i1.ModalStackService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DetailService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DetailService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ModalStackService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var DatagridRenderStep;
(function (DatagridRenderStep) {
    DatagridRenderStep[DatagridRenderStep["ALIGN_COLUMNS"] = 0] = "ALIGN_COLUMNS";
    DatagridRenderStep[DatagridRenderStep["CALCULATE_MODE_ON"] = 1] = "CALCULATE_MODE_ON";
    DatagridRenderStep[DatagridRenderStep["CALCULATE_MODE_OFF"] = 2] = "CALCULATE_MODE_OFF";
    DatagridRenderStep[DatagridRenderStep["CLEAR_WIDTHS"] = 3] = "CLEAR_WIDTHS";
    DatagridRenderStep[DatagridRenderStep["COMPUTE_COLUMN_WIDTHS"] = 4] = "COMPUTE_COLUMN_WIDTHS";
})(DatagridRenderStep || (DatagridRenderStep = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridRenderOrganizer {
    constructor() {
        this._renderStep = new Subject();
        this.alreadySized = false;
    }
    get renderStep() {
        return this._renderStep.asObservable();
    }
    filterRenderSteps(step) {
        return this.renderStep.pipe(filter(testStep => step === testStep));
    }
    resize() {
        this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_ON);
        if (this.alreadySized) {
            this._renderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
        }
        this._renderStep.next(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS);
        this._renderStep.next(DatagridRenderStep.ALIGN_COLUMNS); // NOT USED
        this.alreadySized = true;
        this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_OFF);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRenderOrganizer, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRenderOrganizer }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRenderOrganizer, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const MIN_COLUMN_WIDTH = 96;
// This service allows DatagridHeaderRenderer and ClrDatagridColumnSeparator
// to share column resize data with each other.
class ColumnResizerService {
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
        // calculates the resize amount within the allowed range
        if (resizedBy < -this.maxResizeRange) {
            this._resizedBy = -this.maxResizeRange;
            this.isWithinMaxResizeRange = false;
        }
        else {
            this._resizedBy = resizedBy;
            this.isWithinMaxResizeRange = true;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnResizerService, deps: [{ token: i0.ElementRef }, { token: i2.DomAdapter }, { token: DatagridRenderOrganizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnResizerService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnResizerService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i2.DomAdapter }, { type: DatagridRenderOrganizer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * @description
 * Internal datagrid service that holds a reference to the clr-dg-table element and exposes a method to get height.
 */
class TableSizeService {
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
        if (isPlatformBrowser(this.platformId) && table.nativeElement) {
            this.tableRef = table.nativeElement.querySelector('.datagrid-table');
        }
    }
    // Used when resizing columns to show the column border being dragged.
    getColumnDragHeight() {
        if (!this.tableRef) {
            return null;
        }
        return `${this.tableRef.clientHeight}px`;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TableSizeService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TableSizeService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TableSizeService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Default resize length on each keyboard move event
const KEYBOARD_RESIZE_LENGTH = 12;
class ClrDatagridColumnSeparator {
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
            this.unlisteners.push(this.renderer.listen(this.columnHandleEl, 'keydown', event => {
                this.showTrackerOnFirstKeyDown(event);
                this.moveTrackerOnKeyDown(event);
            }));
            this.unlisteners.push(this.renderer.listen(this.columnHandleEl, 'keyup', event => {
                this.hideTrackerOnKeyUp(event);
            }));
        });
    }
    ngOnDestroy() {
        this.unlisteners.forEach(unlistener => unlistener());
    }
    showTracker() {
        this.columnResizerService.startResize();
        const tableHeight = this.tableSizeService.getColumnDragHeight();
        this.renderer.setStyle(this.resizeTrackerEl, 'height', tableHeight);
        this.renderer.setStyle(this.resizeTrackerEl, 'display', 'block');
    }
    moveTracker(movedBy) {
        this.columnResizerService.calculateResize(movedBy);
        this.renderer.setStyle(this.resizeTrackerEl, 'transform', `translateX(${this.columnResizerService.resizedBy}px)`);
        this.renderer.setStyle(this.document.body, 'cursor', 'col-resize');
        this.redFlagTracker();
    }
    hideTracker() {
        this.columnResizerService.endResize();
        this.renderer.setStyle(this.resizeTrackerEl, 'display', 'none');
        this.renderer.setStyle(this.resizeTrackerEl, 'transform', `translateX(0px)`);
        this.renderer.setStyle(this.columnHandleEl, 'transform', `translateX(0px)`);
        this.renderer.setStyle(this.document.body, 'cursor', 'auto');
    }
    showTrackerOnFirstKeyDown(event) {
        if (!this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
            this.resizeStartedOnKeyDown = true;
            this.renderer.addClass(this.resizeTrackerEl, 'on-arrow-key-resize');
            this.showTracker();
        }
    }
    moveTrackerOnKeyDown(event) {
        if (this.isArrowLeftKeyEvent(event)) {
            event.stopPropagation();
            this.moveTracker(this.columnResizerService.resizedBy - KEYBOARD_RESIZE_LENGTH);
        }
        else if (this.isArrowRightKeyEvent(event)) {
            event.stopPropagation();
            this.moveTracker(this.columnResizerService.resizedBy + KEYBOARD_RESIZE_LENGTH);
        }
    }
    hideTrackerOnKeyUp(event) {
        if (this.resizeStartedOnKeyDown && (this.isArrowLeftKeyEvent(event) || this.isArrowRightKeyEvent(event))) {
            this.resizeStartedOnKeyDown = false;
            this.renderer.removeClass(this.resizeTrackerEl, 'on-arrow-key-resize');
            this.hideTracker();
            this.columnHandleEl.focus();
        }
    }
    redFlagTracker() {
        if (this.isWithinMaxResizeRange !== this.columnResizerService.isWithinMaxResizeRange) {
            this.isWithinMaxResizeRange = this.columnResizerService.isWithinMaxResizeRange;
            if (!this.isWithinMaxResizeRange) {
                this.renderer.addClass(this.resizeTrackerEl, 'exceeded-max');
            }
            else {
                this.renderer.removeClass(this.resizeTrackerEl, 'exceeded-max');
            }
        }
    }
    isArrowLeftKeyEvent(event) {
        return normalizeKey(event.key) === Keys.ArrowLeft;
    }
    isArrowRightKeyEvent(event) {
        return normalizeKey(event.key) === Keys.ArrowRight;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnSeparator, deps: [{ token: ColumnResizerService }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: TableSizeService }, { token: i2.ClrCommonStringsService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridColumnSeparator, isStandalone: false, selector: "clr-dg-column-separator", host: { properties: { "class.datagrid-column-separator": "true" } }, viewQueries: [{ propertyName: "resizeTrackerRef", first: true, predicate: ["resizeTracker"], descendants: true }, { propertyName: "columnHandleRef", first: true, predicate: ["columnHandle"], descendants: true }], ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.CdkDragModule_CdkDrag, selector: "[cdkDrag]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnSeparator, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-separator',
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
                    host: {
                        '[class.datagrid-column-separator]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ColumnResizerService }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: TableSizeService }, { type: i2.ClrCommonStringsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { resizeTrackerRef: [{
                type: ViewChild,
                args: ['resizeTracker']
            }], columnHandleRef: [{
                type: ViewChild,
                args: ['columnHandle']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DefaultKeyNavigationStrategy {
    constructor(utils) {
        this.utils = utils;
    }
    keyUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (currentCellCoords.y === 0) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y - 1;
        const isActionCell = this.utils.isActionCell(currentCellCoords);
        if (this.utils.isSingleCellExpandedRow(nextCellCoords.y) &&
            !isActionCell &&
            this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.x = 0;
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            if (isActionCell) {
                nextCellCoords.y = nextCellCoords.y - 1;
            }
            else {
                nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
        }
        return nextCellCoords;
    }
    keyDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        if (currentCellCoords.y >= numOfRows) {
            return nextCellCoords;
        }
        const isActionCell = this.utils.isActionCell(currentCellCoords);
        nextCellCoords.y = currentCellCoords.y + 1;
        if (!isActionCell && this.utils.isRowReplaced(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y + 1;
            nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
                ? 0
                : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
        }
        return nextCellCoords;
    }
    keyLeft(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (currentCellCoords.x === 0) {
            return nextCellCoords;
        }
        nextCellCoords.x = currentCellCoords.x - 1;
        return nextCellCoords;
    }
    keyRight(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        // calculate numOfColumns based on header cells.
        const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;
        nextCellCoords.x = currentCellCoords.x < numOfColumns ? nextCellCoords.x + 1 : nextCellCoords.x;
        return nextCellCoords;
    }
    keyEnd(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        // calculate X based on header cells.
        nextCellCoords.x = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;
        if (ctrlKey) {
            nextCellCoords.y = numOfRows;
            if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = this.utils.getCellsForRow(nextCellCoords.y).length - 1;
            }
        }
        return nextCellCoords;
    }
    keyHome(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        nextCellCoords.x = 0;
        if (ctrlKey) {
            nextCellCoords.y = 0;
        }
        return nextCellCoords;
    }
    keyPageUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y - itemsPerPage > 0 ? currentCellCoords.y - itemsPerPage + 1 : 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
                    ? 0
                    : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
            else if (this.utils.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y + 1;
                nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
                    ? 0
                    : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
        }
        else {
            if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y - 1;
            }
        }
        return nextCellCoords;
    }
    keyPageDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
        if (this.utils.isActionCell(currentCellCoords) && this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y) && this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
            nextCellCoords.x = 0;
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.x = nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
        }
        else if (this.utils.isRowReplaced(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y + 1;
            nextCellCoords.x = this.utils.isSingleCellExpandedRow(nextCellCoords.y)
                ? 0
                : nextCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
        }
        return nextCellCoords;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExpandedRowKeyNavigationStrategy extends DefaultKeyNavigationStrategy {
    keyUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (currentCellCoords.y === 0) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y - 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(currentCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y - 1;
            }
            switch (true) {
                case this.utils.isDetailsRow(nextCellCoords.y):
                    nextCellCoords.x = 0;
                    break;
                case this.utils.isDetailsRow(currentCellCoords.y) === false:
                    nextCellCoords.x = currentCellCoords.x;
                    break;
                default:
                    nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y) && nextCellCoords.y > 0) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
    keyDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        if (currentCellCoords.y >= numOfRows) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y + 1;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y + 1;
            }
            if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = 0;
            }
            else {
                nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else {
            nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y;
        }
        return nextCellCoords;
    }
    keyLeft(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyLeft(currentCellCoords);
        }
        if (currentCellCoords.x !== 0) {
            nextCellCoords.x = currentCellCoords.x - 1;
        }
        else if (!this.utils.isActionCell(currentCellCoords)) {
            nextCellCoords.y = currentCellCoords.y - 1;
            nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y) - 1;
        }
        return nextCellCoords;
    }
    keyRight(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyRight(currentCellCoords);
        }
        // calculate numOfColumns based on header cells.
        const numOfColumns = this.utils.rows?.length - 1 ? this.utils.getCellsForRow(0).length - 1 : 0;
        if (currentCellCoords.x >= numOfColumns) {
            return nextCellCoords;
        }
        if (this.utils.isActionCell(currentCellCoords) &&
            currentCellCoords.x === this.utils.actionCellCount(currentCellCoords.x) - 1 &&
            this.utils.isRowReplaced(currentCellCoords.y) &&
            !this.utils.isDetailsRow(currentCellCoords.y)) {
            nextCellCoords.y = currentCellCoords.y + 1;
            nextCellCoords.x = 0;
        }
        else {
            nextCellCoords.x = currentCellCoords.x + 1;
        }
        return nextCellCoords;
    }
    keyEnd(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if ((!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) || ctrlKey) {
            return super.keyEnd(currentCellCoords, ctrlKey);
        }
        nextCellCoords.x = this.utils.getCellsForRow(currentCellCoords.y).length - 1;
        return nextCellCoords;
    }
    keyHome(currentCellCoords, ctrlKey) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (!this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isRowReplaced(currentCellCoords.y)) {
            return super.keyHome(currentCellCoords, ctrlKey);
        }
        nextCellCoords.x = 0;
        nextCellCoords.y = currentCellCoords.y - 1;
        if (ctrlKey) {
            nextCellCoords.y = 0;
        }
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
            }
            else if (!this.utils.isDetailsRow(currentCellCoords.y)) {
                if (this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = 0;
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y)) {
                if (!this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.x = this.utils.actionCellCount(nextCellCoords.y);
                }
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
    keyPageDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                if (nextCellCoords.y < numOfRows && !this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
            else if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = 0;
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExpandedColumnsRowKeyNavigationStrategy extends ExpandedRowKeyNavigationStrategy {
    keyUp(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        if (currentCellCoords.y === 0) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y - 1;
        if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
            return super.keyUp(currentCellCoords);
        }
        const isActionCell = this.utils.isActionCell(currentCellCoords);
        if (isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        else if (this.utils.isRowReplaced(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
            if (!this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
        }
        else if (!isActionCell && this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
        }
        return nextCellCoords;
    }
    keyDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const numOfColumns = numOfRows ? this.utils.getCellsForRow(0).length - 1 : 0;
        if (currentCellCoords.y >= numOfRows) {
            return nextCellCoords;
        }
        nextCellCoords.y = currentCellCoords.y + 1;
        if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
            return super.keyDown(currentCellCoords);
        }
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
            }
            else if (this.utils.getCellsForRow(currentCellCoords.y).length > numOfColumns) {
                nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
            else {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
        }
        else {
            nextCellCoords.y = nextCellCoords.y < numOfRows ? nextCellCoords.y + 1 : nextCellCoords.y - 1;
        }
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
        if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
            return super.keyPageUp(currentCellCoords);
        }
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y)) {
                if (!this.utils.isDetailsRow(nextCellCoords.y)) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                    nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
            else if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
    keyPageDown(currentCellCoords) {
        const nextCellCoords = this.utils.createNextCellCoords(currentCellCoords);
        const numOfRows = this.utils.rows ? this.utils.rows.length - 1 : 0;
        const itemsPerPage = this.utils.itemsPerPage;
        nextCellCoords.y = currentCellCoords.y + itemsPerPage >= numOfRows ? numOfRows : currentCellCoords.y + itemsPerPage;
        if (this.utils.isSingleCellExpandedRow(nextCellCoords.y)) {
            return super.keyPageDown(currentCellCoords);
        }
        if (!this.utils.isActionCell(currentCellCoords)) {
            if (this.utils.isRowReplaced(nextCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
                if (nextCellCoords.y < numOfRows) {
                    nextCellCoords.y = nextCellCoords.y + 1;
                    nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
                }
            }
            else if (this.utils.isDetailsRow(currentCellCoords.y) && !this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x + this.utils.actionCellCount(nextCellCoords.y);
            }
            else if (this.utils.isDetailsRow(nextCellCoords.y)) {
                nextCellCoords.x = currentCellCoords.x - this.utils.actionCellCount(currentCellCoords.y);
            }
        }
        else if (this.utils.isDetailsRow(nextCellCoords.y)) {
            nextCellCoords.y = nextCellCoords.y - 1;
        }
        return nextCellCoords;
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class KeyNavigationUtils {
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
        const currentCell = this.cells ? Array.from(this.cells).find(i => i.getAttribute('tabindex') === '0') : null;
        const currentRow = currentCell ? currentCell.closest(this.config.keyGridRows) : null;
        const coordinates = {
            x: currentRow && currentCell
                ? Array.from(currentRow.querySelectorAll(this.config.keyGridCells)).indexOf(currentCell)
                : 0,
            y: currentRow && currentCell && this.rows ? Array.from(this.rows).indexOf(currentRow) : 0,
        };
        return coordinates;
    }
    get averageRowHeight() {
        const heightSum = Array.from(this.rows.values()).reduce((sum, row) => {
            return sum + row.clientHeight;
        }, 0);
        return Math.round(heightSum / this.rows.length);
    }
    get itemsPerPage() {
        return Math.floor(this.host?.querySelector('.datagrid').clientHeight / this.averageRowHeight) - 1 || 0;
    }
    setAriaRowIndexTo(cellCoords) {
        let ariaRowIndex = this.rows[cellCoords.y].getAttribute('aria-rowindex');
        if (!ariaRowIndex) {
            ariaRowIndex = this.rows[cellCoords.y - 1].getAttribute('aria-rowindex');
        }
        cellCoords.ariaRowIndex = ariaRowIndex;
    }
    getNextItemCoordinate(e) {
        const currentCellCoords = this.currentCellCoordinates;
        const strategy = this.getNavStrategy(currentCellCoords);
        const inlineStart = this.host.dir === 'rtl' ? Keys.ArrowRight : Keys.ArrowLeft;
        const inlineEnd = this.host.dir === 'rtl' ? Keys.ArrowLeft : Keys.ArrowRight;
        switch (e.key) {
            case Keys.ArrowUp:
                return strategy.keyUp(currentCellCoords);
            case Keys.ArrowDown:
                return strategy.keyDown(currentCellCoords);
            case inlineStart:
                return strategy.keyLeft(currentCellCoords);
            case inlineEnd:
                return strategy.keyRight(currentCellCoords);
            case Keys.Home:
                return strategy.keyHome(currentCellCoords, e.ctrlKey);
            case Keys.End:
                return strategy.keyEnd(currentCellCoords, e.ctrlKey);
            case Keys.PageUp:
                return strategy.keyPageUp(currentCellCoords);
            case Keys.PageDown:
                return strategy.keyPageDown(currentCellCoords);
            default:
                return currentCellCoords;
        }
    }
    getCellsForRow(index) {
        return this.rows[index].querySelectorAll(this.config.keyGridCells);
    }
    isExpandedRow(index) {
        const selectedElement = this.rows[index].querySelector('.datagrid-row-detail');
        return selectedElement ? selectedElement.style.display !== 'none' : false;
    }
    isDetailsRow(index) {
        return this.rows[index].classList.contains('datagrid-row-detail');
    }
    isRowReplaced(index) {
        return !!this.rows[index].closest('clr-dg-row.datagrid-row-replaced');
    }
    isSingleCellExpandedRow(index) {
        return this.rows[index]?.querySelectorAll(this.config.keyGridCells).length === 1;
    }
    actionCellCount(index) {
        return this.actionCellsAsArray(index).length;
    }
    actionCellsAsArray(index) {
        return Array.from(this.rows[index].querySelectorAll('.datagrid-row-sticky .datagrid-cell, .datagrid-row-sticky .datagrid-column'));
    }
    isActionCell(cellCoords) {
        return !!this.actionCellsAsArray(cellCoords.y)[cellCoords.x];
    }
    createNextCellCoords(cellCoords) {
        return {
            x: cellCoords.x,
            y: cellCoords.y,
        };
    }
    getNavStrategy(currentCellCoords) {
        switch (true) {
            case this.isSingleCellExpandedRow(currentCellCoords.y):
                return new ExpandedRowKeyNavigationStrategy(this);
            case this.isDetailsRow(currentCellCoords.y):
            case this.isExpandedRow(currentCellCoords.y):
                return new ExpandedColumnsRowKeyNavigationStrategy(this);
            default:
                return new DefaultKeyNavigationStrategy(this);
        }
    }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const actionableItemSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'button:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[contenteditable=true]',
    '[role=button]:not([disabled])',
];
function getTabbableItems(el) {
    const tabbableItemSelectors = [...actionableItemSelectors, '[tabindex="0"]:not([disabled])'];
    const tabbableSelector = tabbableItemSelectors.join(',');
    return Array.from(el.querySelectorAll(tabbableSelector));
}
function isActionableItem(el) {
    const actionableSelector = actionableItemSelectors.join(',');
    return el.matches(actionableSelector);
}
class KeyNavigationGridController {
    constructor(zone) {
        this.zone = zone;
        this.nextCellCoordsEmitter = new EventEmitter(false);
        this.skipItemFocus = false;
        this.preventScrollOnFocus = false;
        this.config = {
            keyGridRows: '[role=row]:not(.datagrid-placeholder):not([style*="display: none"])',
            keyGridCells: '[role=gridcell]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), [role=columnheader]:not(.datagrid-hidden-column):not(.datagrid-placeholder-content), .datagrid-detail-caret',
            keyGrid: '[role=grid]',
        };
        this.listenersAdded = false;
        this.destroy$ = new Subject();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    addListeners() {
        if (this.listenersAdded) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            fromEvent(this.keyNavUtils.grid, 'mousedown')
                .pipe(takeUntil(this.destroy$))
                .subscribe((e) => {
                // preserve right click for context menus & keyboard mouse control https://apple.stackexchange.com/questions/32715/how-do-i-open-the-context-menu-from-a-mac-keyboard
                if (e.buttons === 1 && !e.ctrlKey) {
                    const activeCell = this.keyNavUtils.cells
                        ? Array.from(this.keyNavUtils.cells).find(c => c === e.target || c === e.target.closest(this.config.keyGridCells))
                        : null;
                    if (activeCell) {
                        this.setActiveCell(activeCell);
                        if (!isActionableItem(e.target)) {
                            this.focusElement(activeCell);
                        }
                    }
                }
            });
            fromEvent(this.keyNavUtils.grid, 'wheel')
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.nextCellCoordsEmitter.emit(null);
            });
            fromEvent(this.keyNavUtils.grid, 'keydown')
                .pipe(takeUntil(this.destroy$))
                .subscribe((e) => {
                // Skip column resize events
                if (e.target.classList.contains('drag-handle') &&
                    (e.key === Keys.ArrowLeft || e.key === Keys.ArrowRight)) {
                    return;
                }
                if (e.key === Keys.ArrowUp ||
                    e.key === Keys.ArrowDown ||
                    e.key === Keys.ArrowLeft ||
                    e.key === Keys.ArrowRight ||
                    e.key === Keys.End ||
                    e.key === Keys.Home ||
                    e.key === Keys.PageUp ||
                    e.key === Keys.PageDown) {
                    const nextCellCoords = this.keyNavUtils.getNextItemCoordinate(e);
                    if (nextCellCoords.y > 0 &&
                        (e.key === Keys.ArrowUp || e.key === Keys.ArrowDown || e.key === Keys.PageUp || e.key === Keys.PageDown)) {
                        this.keyNavUtils.setAriaRowIndexTo(nextCellCoords);
                        this.nextCellCoordsEmitter.emit(nextCellCoords);
                    }
                    const activeItem = this.keyNavUtils.rows
                        ? Array.from(this.keyNavUtils.getCellsForRow(nextCellCoords.y))[nextCellCoords.x]
                        : null;
                    if (activeItem) {
                        this.setActiveCell(activeItem);
                        this.focusElement(activeItem, {
                            preventScroll: this.preventScrollOnFocus && !!nextCellCoords.ariaRowIndex,
                        });
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
        this.keyNavUtils.cells?.forEach((i) => i.setAttribute('tabindex', '-1'));
        const firstCell = this.keyNavUtils.cells ? this.keyNavUtils.cells[0] : null;
        firstCell?.setAttribute('tabindex', '0');
    }
    setActiveCell(activeCell) {
        const prior = this.keyNavUtils.cells
            ? Array.from(this.keyNavUtils.cells).find(c => c.getAttribute('tabindex') === '0')
            : null;
        if (prior) {
            prior.setAttribute('tabindex', '-1');
        }
        activeCell.setAttribute('tabindex', '0');
    }
    focusElement(activeCell, options = { preventScroll: false }) {
        if (this.skipItemFocus) {
            return;
        }
        let elementToFocus;
        if (activeCell.getAttribute('role') === 'columnheader') {
            elementToFocus = activeCell;
        }
        else {
            const tabbableElements = getTabbableItems(activeCell);
            elementToFocus = tabbableElements.length ? tabbableElements[0] : activeCell;
        }
        elementToFocus.focus(options);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: KeyNavigationGridController, deps: [{ token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: KeyNavigationGridController }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: KeyNavigationGridController, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i0.NgZone }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
class ClrDatagridFilter extends DatagridFilterRegistrar {
    constructor(_filters, commonStrings, popoverService, keyNavigation) {
        super(_filters);
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.keyNavigation = keyNavigation;
        this.openChange = new EventEmitter(false);
        this.ariaExpanded = false;
        this.popoverId = uniqueIdFactory();
        // Smart Popover
        this.popoverPosition = ClrPopoverPosition.BOTTOM_RIGHT;
        this.popoverType = ClrPopoverType.DROPDOWN;
        this.subs = [];
        this.subs.push(popoverService.openChange.subscribe(change => {
            this.ariaExpanded = change;
            this.openChange.emit(change);
        }));
    }
    get open() {
        return this.popoverService.open;
    }
    set open(open) {
        open = !!open;
        if (this.popoverService.open !== open) {
            this.popoverService.open = open;
            this.openChange.emit(open);
            if (this.keyNavigation) {
                this.keyNavigation.skipItemFocus = open;
            }
        }
    }
    set customFilter(filter) {
        this.setFilter(filter);
    }
    /**
     * Indicates if the filter is currently active
     */
    get active() {
        return !!this.filter && this.filter.isActive();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subs.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridFilter, deps: [{ token: FiltersProvider }, { token: i2.ClrCommonStringsService }, { token: i3.ClrPopoverService }, { token: KeyNavigationGridController, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridFilter, isStandalone: false, selector: "clr-dg-filter", inputs: { open: ["clrDgFilterOpen", "open"], customFilter: ["clrDgFilter", "customFilter"] }, outputs: { openChange: "clrDgFilterOpenChange" }, providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }], viewQueries: [{ propertyName: "anchor", first: true, predicate: ["anchor"], descendants: true, read: ElementRef }], usesInheritance: true, ngImport: i0, template: `
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i3.ÇlrClrPopoverCloseButton, selector: "[clrPopoverCloseButton]", outputs: ["clrPopoverOnCloseChange"] }, { kind: "directive", type: i3.ÇlrClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i3.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-filter',
                    // We register this component as a CustomFilter, for the parent column to detect it.
                    providers: [{ provide: CustomFilter, useExisting: ClrDatagridFilter }],
                    template: `
    <button
      class="datagrid-filter-toggle"
      type="button"
      #anchor
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
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
                }]
        }], ctorParameters: () => [{ type: FiltersProvider }, { type: i2.ClrCommonStringsService }, { type: i3.ClrPopoverService }, { type: KeyNavigationGridController, decorators: [{
                    type: Optional
                }] }], propDecorators: { openChange: [{
                type: Output,
                args: ['clrDgFilterOpenChange']
            }], anchor: [{
                type: ViewChild,
                args: ['anchor', { read: ElementRef }]
            }], open: [{
                type: Input,
                args: ['clrDgFilterOpen']
            }], customFilter: [{
                type: Input,
                args: ['clrDgFilter']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridNumericFilter extends DatagridFilterRegistrar {
    constructor(filters, domAdapter, commonStrings, popoverService, ngZone) {
        super(filters);
        this.domAdapter = domAdapter;
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.ngZone = ngZone;
        this.filterValueChange = new EventEmitter();
        /**
         * Indicates if the filter dropdown is open
         */
        this.open = false;
        this.subscriptions = [];
    }
    /**
     * Common setter for the input values
     */
    get value() {
        return [this.filter.low, this.filter.high];
    }
    set value(values) {
        if (this.filter && Array.isArray(values)) {
            if (values && (values[0] !== this.filter.low || values[1] !== this.filter.high)) {
                if (typeof values[0] === 'number') {
                    this.filter.low = values[0];
                }
                else {
                    this.filter.low = null;
                }
                if (typeof values[1] === 'number') {
                    this.filter.high = values[1];
                }
                else {
                    this.filter.high = null;
                }
                this.filterValueChange.emit(values);
            }
        }
        else {
            this.initFilterValues = values;
        }
    }
    /**
     * Customizable filter logic based on high and low values
     */
    set customNumericFilter(value) {
        if (value instanceof RegisteredFilter) {
            this.setFilter(value);
        }
        else {
            this.setFilter(new DatagridNumericFilterImpl(value));
        }
        if (this.initFilterValues) {
            this.value = this.initFilterValues;
            // This initFilterValues should be used only once after the filter registration
            // So deleting this property value to prevent it from being used again
            // if this customStringFilter property is set again
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
        if (typeof this.filter.low === 'number' && isFinite(this.filter.low)) {
            return this.filter.low;
        }
        else {
            // There's not a low limit
            return null;
        }
    }
    set low(low) {
        if (typeof low === 'number' && low !== this.filter.low) {
            this.filter.low = low;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
        else if (typeof low !== 'number') {
            this.filter.low = null;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
    }
    get high() {
        if (typeof this.filter.high === 'number' && isFinite(this.filter.high)) {
            return this.filter.high;
        }
        else {
            // There's not a high limit
            return null;
        }
    }
    set high(high) {
        if (typeof high === 'number' && high !== this.filter.high) {
            this.filter.high = high;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
        else if (typeof high !== 'number') {
            this.filter.high = null;
            this.filterValueChange.emit([this.filter.low, this.filter.high]);
        }
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.popoverService.openChange.subscribe(openChange => {
            this.open = openChange;
            // Note: this is being run outside of the Angular zone because `element.focus()` doesn't require
            // running change detection.
            this.ngZone.runOutsideAngular(() => {
                // The animation frame in used because when this executes, the input isn't displayed.
                // Note: `element.focus()` causes re-layout and this may lead to frame drop on slower devices.
                // `setTimeout` is a macrotask and macrotasks are executed within the current rendering frame.
                // Animation tasks are executed within the next rendering frame.
                requestAnimationFrame(() => {
                    this.domAdapter.focus(this.input.nativeElement);
                });
            });
        }));
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridNumericFilter, deps: [{ token: FiltersProvider }, { token: i2.DomAdapter }, { token: i2.ClrCommonStringsService }, { token: i3.ClrPopoverService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: DatagridNumericFilter, isStandalone: false, selector: "clr-dg-numeric-filter", inputs: { minPlaceholder: ["clrFilterMinPlaceholder", "minPlaceholder"], maxPlaceholder: ["clrFilterMaxPlaceholder", "maxPlaceholder"], fromLabel: ["clrFilterFromLabel", "fromLabel"], toLabel: ["clrFilterToLabel", "toLabel"], value: ["clrFilterValue", "value"], customNumericFilter: ["clrDgNumericFilter", "customNumericFilter"] }, outputs: { filterValueChange: "clrFilterValueChange" }, providers: [{ provide: CustomFilter, useExisting: DatagridNumericFilter }], viewQueries: [{ propertyName: "input", first: true, predicate: ["input_low"], descendants: true }, { propertyName: "filterContainer", first: true, predicate: ClrDatagridFilter, descendants: true }], usesInheritance: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i5$1.ClrNumberInput, selector: "input[type=\"number\"][clrNumberInput]" }, { kind: "component", type: i5$1.ClrNumberInputContainer, selector: "clr-number-input-container" }, { kind: "directive", type: i13.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i13.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: ClrDatagridFilter, selector: "clr-dg-filter", inputs: ["clrDgFilterOpen", "clrDgFilter"], outputs: ["clrDgFilterOpenChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridNumericFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-numeric-filter',
                    providers: [{ provide: CustomFilter, useExisting: DatagridNumericFilter }],
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
                }]
        }], ctorParameters: () => [{ type: FiltersProvider }, { type: i2.DomAdapter }, { type: i2.ClrCommonStringsService }, { type: i3.ClrPopoverService }, { type: i0.NgZone }], propDecorators: { minPlaceholder: [{
                type: Input,
                args: ['clrFilterMinPlaceholder']
            }], maxPlaceholder: [{
                type: Input,
                args: ['clrFilterMaxPlaceholder']
            }], fromLabel: [{
                type: Input,
                args: ['clrFilterFromLabel']
            }], toLabel: [{
                type: Input,
                args: ['clrFilterToLabel']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
            }], input: [{
                type: ViewChild,
                args: ['input_low']
            }], filterContainer: [{
                type: ViewChild,
                args: [ClrDatagridFilter]
            }], value: [{
                type: Input,
                args: ['clrFilterValue']
            }], customNumericFilter: [{
                type: Input,
                args: ['clrDgNumericFilter']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridStringFilter extends DatagridFilterRegistrar {
    constructor(filters, domAdapter, commonStrings, popoverService, elementRef, cdr, ngZone) {
        super(filters);
        this.domAdapter = domAdapter;
        this.commonStrings = commonStrings;
        this.popoverService = popoverService;
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.ngZone = ngZone;
        this.filterValueChange = new EventEmitter();
        /**
         * Indicates if the filter dropdown is open
         */
        this.open = false;
        this.labelValue = '';
        this.subs = [];
    }
    /**
     * Customizable filter logic based on a search text
     */
    set customStringFilter(value) {
        if (value instanceof RegisteredFilter) {
            this.setFilter(value);
        }
        else {
            this.setFilter(new DatagridStringFilterImpl(value));
        }
        if (this.initFilterValue) {
            this.value = this.initFilterValue;
            // This initFilterValue should be used only once after the filter registration
            // So deleting this property value to prevent it from being used again
            // if this customStringFilter property is set again
            delete this.initFilterValue;
        }
    }
    /**
     * Common setter for the input value
     */
    get value() {
        return this.filter.value;
    }
    set value(value) {
        if (this.filter && typeof value === 'string') {
            if (!value) {
                value = '';
            }
            if (value !== this.filter.value) {
                this.filter.value = value;
                this.filterValueChange.emit(value);
            }
        }
        else {
            this.initFilterValue = value;
        }
    }
    get placeholderValue() {
        return this.placeholder || this.commonStrings.keys.filterItems;
    }
    ngAfterViewInit() {
        this.subs.push(this.popoverService.openChange.subscribe(openChange => {
            this.open = openChange;
            // Note: this is being run outside of the Angular zone because `element.focus()` doesn't require
            // running change detection.
            this.ngZone.runOutsideAngular(() => {
                // The animation frame in used because when this executes, the input isn't displayed.
                // Note: `element.focus()` causes re-layout and this may lead to frame drop on slower devices.
                // `setTimeout` is a macrotask and macrotasks are executed within the current rendering frame.
                // Animation tasks are executed within the next rendering frame.
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
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * This is not in a getter to prevent "expression has changed after it was checked" errors.
     */
    setFilterLabel() {
        if (this.label) {
            this.labelValue = this.label;
            return;
        }
        const columnElement = this.elementRef.nativeElement?.closest('clr-dg-column');
        const columnTitleElement = columnElement?.querySelector('.datagrid-column-title');
        this.labelValue = this.commonStrings.parse(this.commonStrings.keys.datagridFilterLabel, {
            COLUMN: columnTitleElement?.textContent.trim() || '',
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridStringFilter, deps: [{ token: FiltersProvider }, { token: i2.DomAdapter }, { token: i2.ClrCommonStringsService }, { token: i3.ClrPopoverService }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: DatagridStringFilter, isStandalone: false, selector: "clr-dg-string-filter", inputs: { placeholder: ["clrFilterPlaceholder", "placeholder"], label: ["clrFilterLabel", "label"], customStringFilter: ["clrDgStringFilter", "customStringFilter"], value: ["clrFilterValue", "value"] }, outputs: { filterValueChange: "clrFilterValueChange" }, providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }], viewQueries: [{ propertyName: "input", first: true, predicate: ["input"], descendants: true }, { propertyName: "filterContainer", first: true, predicate: ClrDatagridFilter, descendants: true }], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i5$2.ClrInput, selector: "[clrInput]" }, { kind: "component", type: i5$2.ClrInputContainer, selector: "clr-input-container" }, { kind: "directive", type: i13.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: ClrDatagridFilter, selector: "clr-dg-filter", inputs: ["clrDgFilterOpen", "clrDgFilter"], outputs: ["clrDgFilterOpenChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridStringFilter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-string-filter',
                    providers: [{ provide: CustomFilter, useExisting: DatagridStringFilter }],
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
                }]
        }], ctorParameters: () => [{ type: FiltersProvider }, { type: i2.DomAdapter }, { type: i2.ClrCommonStringsService }, { type: i3.ClrPopoverService }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { placeholder: [{
                type: Input,
                args: ['clrFilterPlaceholder']
            }], label: [{
                type: Input,
                args: ['clrFilterLabel']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
            }], input: [{
                type: ViewChild,
                args: ['input']
            }], filterContainer: [{
                type: ViewChild,
                args: [ClrDatagridFilter]
            }], customStringFilter: [{
                type: Input,
                args: ['clrDgStringFilter']
            }], value: [{
                type: Input,
                args: ['clrFilterValue']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridColumn extends DatagridFilterRegistrar {
    constructor(el, _sort, filters, vcr, detailService, changeDetectorRef, commonStrings) {
        super(filters);
        this.el = el;
        this._sort = _sort;
        this.vcr = vcr;
        this.detailService = detailService;
        this.changeDetectorRef = changeDetectorRef;
        this.commonStrings = commonStrings;
        this.disableUnsort = false;
        this.sortOrderChange = new EventEmitter();
        this.filterValueChange = new EventEmitter();
        /**
         * A custom filter for this column that can be provided in the projected content
         */
        this.customFilter = false;
        /*
         * What type is this column?  This defaults to STRING, but can also be
         * set to NUMBER.  Unsupported types default to STRING. Users can set it
         * via the [clrDgColType] input by setting it to 'string' or 'number'.
         */
        this._colType = 'string';
        /**
         * Indicates how the column is currently sorted
         */
        this._sortOrder = ClrDatagridSortOrder.UNSORTED;
        /**
         * Subscription to the sort service changes
         */
        this.subscriptions = [];
        this._showSeparator = true;
        this.subscriptions.push(this.listenForSortingChanges());
        this.subscriptions.push(this.listenForDetailPaneChanges());
    }
    get isHidden() {
        return this.el.nativeElement.classList.contains(HIDDEN_COLUMN_CLASS);
    }
    get showSeparator() {
        return this._showSeparator;
    }
    set showSeparator(value) {
        this._showSeparator = value;
        this.changeDetectorRef.markForCheck();
    }
    // TODO: We might want to make this an enum in the future
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
        if (typeof field === 'string') {
            this._field = field;
            if (!this._sortBy) {
                this._sortBy = new DatagridPropertyComparator(field);
            }
        }
    }
    get sortBy() {
        return this._sortBy;
    }
    set sortBy(comparator) {
        if (typeof comparator === 'string') {
            this._sortBy = new DatagridPropertyComparator(comparator);
        }
        else if (comparator) {
            this._sortBy = comparator;
        }
        else if (this.field) {
            this._sortBy = new DatagridPropertyComparator(this.field);
        }
        else {
            delete this._sortBy;
        }
    }
    get sortOrder() {
        return this._sortOrder;
    }
    set sortOrder(value) {
        if (typeof value === 'undefined') {
            return;
        }
        // only if the incoming order is different from the current one
        if (this._sortOrder === value) {
            return;
        }
        switch (value) {
            case ClrDatagridSortOrder.ASC:
                this.sort(false);
                break;
            case ClrDatagridSortOrder.DESC:
                this.sort(true);
                break;
            // the Unsorted case happens when the current state is neither Asc nor Desc
            case ClrDatagridSortOrder.UNSORTED:
            default:
                this._sort.clear();
                this._sortDirection = null;
                break;
        }
    }
    set updateFilterValue(newValue) {
        if (this.filter) {
            if (this.filter instanceof DatagridStringFilterImpl) {
                if (!newValue || typeof newValue !== 'string') {
                    newValue = '';
                }
                if (newValue !== this.filter.value) {
                    this.filter.value = newValue;
                }
            }
            else if (this.filter instanceof DatagridNumericFilterImpl) {
                if (!newValue || !(newValue instanceof Array)) {
                    newValue = [null, null];
                }
                if (newValue.length === 2 && (newValue[0] !== this.filter.value[0] || newValue[1] !== this.filter.value[1])) {
                    this.filter.value = newValue;
                }
            }
        }
        else {
            this.initFilterValue = newValue;
        }
    }
    set projectedFilter(custom) {
        if (custom) {
            this.deleteFilter();
            this.customFilter = true;
        }
    }
    /**
     * Indicates if the column is sortable
     */
    get sortable() {
        return !!this._sortBy;
    }
    get ariaSort() {
        switch (this._sortOrder) {
            case ClrDatagridSortOrder.ASC:
                return 'ascending';
            case ClrDatagridSortOrder.DESC:
                return 'descending';
            case ClrDatagridSortOrder.UNSORTED:
            default:
                return 'none';
        }
    }
    get sortDirection() {
        return this._sortDirection;
    }
    /**
     * @NOTE type `any` here is to let us pass templateStrictMode, because in our code we try to handle
     * two types of filters String and Number with the same variable but both of them work with different
     * format we got an error for casting. We could not cast anything inside the template so to not mess the
     * casting, the last type is set to `any`
     *
     * Orignial types: string | [number, number]
     */
    get filterValue() {
        if (this.filter instanceof DatagridStringFilterImpl || this.filter instanceof DatagridNumericFilterImpl) {
            return this.filter.value;
        }
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
        this.setFilterToggleAriaLabel();
    }
    ngOnChanges(changes) {
        if (changes.colType &&
            changes.colType.currentValue &&
            changes.colType.currentValue !== changes.colType.previousValue) {
            if (!this.customFilter && !this.filter && this.colType && this.field) {
                this.setupDefaultFilter(this.field, this.colType);
            }
        }
        if (changes.field && changes.field.currentValue && changes.field.currentValue !== changes.field.previousValue) {
            if (!this.customFilter && this.colType) {
                this.setupDefaultFilter(this.field, this.colType);
            }
        }
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    /**
     * Sorts the datagrid based on this column
     */
    sort(reverse) {
        if (!this.sortable) {
            return;
        }
        if (!this.disableUnsort && reverse === undefined && this.sortOrder === ClrDatagridSortOrder.DESC) {
            this._sortOrder = ClrDatagridSortOrder.UNSORTED;
            this._sort.clear();
            this._sortDirection = null;
            this.sortOrderChange.emit(this._sortOrder);
            return;
        }
        this._sort.toggle(this._sortBy, reverse);
        // setting the private variable to not retrigger the setter logic
        this._sortOrder = this._sort.reverse ? ClrDatagridSortOrder.DESC : ClrDatagridSortOrder.ASC;
        // Sets the correct icon for current sort order
        this._sortDirection = this._sortOrder === ClrDatagridSortOrder.DESC ? 'down' : 'up';
        this.sortOrderChange.emit(this._sortOrder);
    }
    listenForDetailPaneChanges() {
        return this.detailService.stateChange.subscribe(state => {
            if (this.showSeparator !== !state) {
                this.showSeparator = !state;
            }
        });
    }
    setFilterToggleAriaLabel() {
        const filterToggle = this.el.nativeElement.querySelector('.datagrid-filter-toggle');
        if (filterToggle) {
            filterToggle.ariaLabel = this.commonStrings.parse(this.commonStrings.keys.datagridFilterAriaLabel, {
                COLUMN: this?.titleContainer?.nativeElement.textContent.trim().toLocaleLowerCase(),
            });
        }
    }
    listenForSortingChanges() {
        return this._sort.change.subscribe(sort => {
            // Need to manually mark the component to be checked
            // for both activating and deactivating sorting
            this.changeDetectorRef.markForCheck();
            // We're only listening to make sure we emit an event when the column goes from sorted to unsorted
            if (this.sortOrder !== ClrDatagridSortOrder.UNSORTED && sort.comparator !== this._sortBy) {
                this._sortOrder = ClrDatagridSortOrder.UNSORTED;
                this.sortOrderChange.emit(this._sortOrder);
                this._sortDirection = null;
            }
        });
    }
    setupDefaultFilter(field, colType) {
        if (colType === 'number') {
            this.setFilter(new DatagridNumericFilterImpl(new DatagridPropertyNumericFilter(field)));
        }
        else if (colType === 'string') {
            this.setFilter(new DatagridStringFilterImpl(new DatagridPropertyStringFilter(field)));
        }
        if (this.filter && this.initFilterValue) {
            this.updateFilterValue = this.initFilterValue;
            // This initFilterValue should be used only once after the filter registration
            // So deleting this property value to prevent it from being used again
            // if this field property is set again
            delete this.initFilterValue;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumn, deps: [{ token: i0.ElementRef }, { token: Sort }, { token: FiltersProvider }, { token: i0.ViewContainerRef }, { token: DetailService }, { token: i0.ChangeDetectorRef }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridColumn, isStandalone: false, selector: "clr-dg-column", inputs: { filterStringPlaceholder: ["clrFilterStringPlaceholder", "filterStringPlaceholder"], filterNumberMaxPlaceholder: ["clrFilterNumberMaxPlaceholder", "filterNumberMaxPlaceholder"], filterNumberMinPlaceholder: ["clrFilterNumberMinPlaceholder", "filterNumberMinPlaceholder"], disableUnsort: ["clrDgDisableUnsort", "disableUnsort"], colType: ["clrDgColType", "colType"], field: ["clrDgField", "field"], sortBy: ["clrDgSortBy", "sortBy"], sortOrder: ["clrDgSortOrder", "sortOrder"], updateFilterValue: ["clrFilterValue", "updateFilterValue"] }, outputs: { sortOrderChange: "clrDgSortOrderChange", filterValueChange: "clrFilterValueChange" }, host: { attributes: { "role": "columnheader" }, properties: { "class.datagrid-column": "true", "attr.aria-sort": "ariaSort" } }, queries: [{ propertyName: "projectedFilter", first: true, predicate: CustomFilter, descendants: true }], viewQueries: [{ propertyName: "titleContainer", first: true, predicate: ["titleContainer"], descendants: true, read: ElementRef }], usesInheritance: true, usesOnChanges: true, hostDirectives: [{ directive: i3.ClrPopoverHostDirective }], ngImport: i0, template: `
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
      @if (showSeparator) {
        <clr-dg-column-separator></clr-dg-column-separator>
      }
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: ClrDatagridColumnSeparator, selector: "clr-dg-column-separator" }, { kind: "component", type: DatagridNumericFilter, selector: "clr-dg-numeric-filter", inputs: ["clrFilterMinPlaceholder", "clrFilterMaxPlaceholder", "clrFilterFromLabel", "clrFilterToLabel", "clrFilterValue", "clrDgNumericFilter"], outputs: ["clrFilterValueChange"] }, { kind: "component", type: DatagridStringFilter, selector: "clr-dg-string-filter", inputs: ["clrFilterPlaceholder", "clrFilterLabel", "clrDgStringFilter", "clrFilterValue"], outputs: ["clrFilterValueChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column',
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
      @if (showSeparator) {
        <clr-dg-column-separator></clr-dg-column-separator>
      }
    </div>
  `,
                    hostDirectives: [ClrPopoverHostDirective],
                    host: {
                        '[class.datagrid-column]': 'true',
                        '[attr.aria-sort]': 'ariaSort',
                        role: 'columnheader',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: Sort }, { type: FiltersProvider }, { type: i0.ViewContainerRef }, { type: DetailService }, { type: i0.ChangeDetectorRef }, { type: i2.ClrCommonStringsService }], propDecorators: { filterStringPlaceholder: [{
                type: Input,
                args: ['clrFilterStringPlaceholder']
            }], filterNumberMaxPlaceholder: [{
                type: Input,
                args: ['clrFilterNumberMaxPlaceholder']
            }], filterNumberMinPlaceholder: [{
                type: Input,
                args: ['clrFilterNumberMinPlaceholder']
            }], disableUnsort: [{
                type: Input,
                args: ['clrDgDisableUnsort']
            }], sortOrderChange: [{
                type: Output,
                args: ['clrDgSortOrderChange']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
            }], titleContainer: [{
                type: ViewChild,
                args: ['titleContainer', { read: ElementRef }]
            }], colType: [{
                type: Input,
                args: ['clrDgColType']
            }], field: [{
                type: Input,
                args: ['clrDgField']
            }], sortBy: [{
                type: Input,
                args: ['clrDgSortBy']
            }], sortOrder: [{
                type: Input,
                args: ['clrDgSortOrder']
            }], updateFilterValue: [{
                type: Input,
                args: ['clrFilterValue']
            }], projectedFilter: [{
                type: ContentChild,
                args: [CustomFilter]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class Items {
    constructor(_filters, _sort, _page) {
        this._filters = _filters;
        this._sort = _sort;
        this._page = _page;
        /**
         * Indicates if the data is currently loading
         */
        this.loading = false;
        /**
         * Whether we should use smart items for this datagrid or let the user handle
         * everything.
         */
        this._smart = false;
        /**
         * List of items currently displayed
         */
        this._displayed = [];
        /**
         * The Observable that lets other classes subscribe to items changes
         */
        this._change = new Subject();
        this._allChanges = new Subject();
        /**
         * Tracking function to identify objects.
         */
        this.identifyBy = item => item;
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
        if (this.smart) {
            this._filterItems();
        }
        else {
            this._displayed = items;
            this.emitChange();
        }
    }
    get displayed() {
        // Ideally we could return an immutable array, but we don't have it in Clarity yet.
        return this._displayed;
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    get allChanges() {
        return this._allChanges.asObservable();
    }
    /**
     * Checks if we don't have data to process yet, to abort early operations
     */
    get uninitialized() {
        return !this._all;
    }
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy() {
        if (this._filtersSub) {
            this._filtersSub.unsubscribe();
        }
        if (this._sortSub) {
            this._sortSub.unsubscribe();
        }
        if (this._pageSub) {
            this._pageSub.unsubscribe();
        }
    }
    smartenDown() {
        this._smart = false;
        this.destroy();
    }
    smartenUp() {
        this._smart = true;
        /*
         * These observers trigger a chain of function: filter -> sort -> paginate
         * An observer up the chain re-triggers all the operations that follow it.
         */
        this._filtersSub = this._filters.change.subscribe(() => this._filterItems());
        this._sortSub = this._sort.change.subscribe(() => {
            // Special case, if the datagrid went from sorted to unsorted, we have to re-filter
            // to get the original order back
            if (!this._sort.comparator) {
                this._filterItems();
            }
            else {
                this._sortItems();
            }
        });
        this._pageSub = this._page.change.subscribe(() => this._changePage());
    }
    /**
     * Manually recompute the list of displayed items
     */
    refresh() {
        if (this.smart) {
            this._filterItems();
        }
    }
    emitChange() {
        this._change.next(this.displayed);
    }
    emitAllChanges(items) {
        this._allChanges.next(items);
    }
    /**
     * FiltersProvider items from the raw list
     */
    _filterItems() {
        if (this.uninitialized) {
            return;
        }
        if (this._filters.hasActiveFilters()) {
            this._filtered = this._all.filter(item => this._filters.accepts(item));
        }
        else {
            // Work on a shallow copy of the array, to not modify the user's model
            this._filtered = this._all.slice();
        }
        this._page.totalItems = this._filtered.length;
        this._sortItems();
    }
    /**
     * Sorts items in the filtered list
     */
    _sortItems() {
        if (this.uninitialized) {
            return;
        }
        if (this._sort.comparator) {
            this._filtered.sort((a, b) => this._sort.compare(a, b));
        }
        this._changePage();
    }
    /**
     * Extracts the current page from the sorted list
     */
    _changePage() {
        // If we know we have pagination but the page size hasn't been set yet, we wait for it.
        if (this.uninitialized || (this._page.activated && this._page.size === 0)) {
            return;
        }
        if (this._page.size > 0) {
            this._displayed = this._filtered.slice(this._page.firstItem, this._page.lastItem + 1);
        }
        else {
            this._displayed = this._filtered;
        }
        this.emitChange();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Items, deps: [{ token: FiltersProvider }, { token: Sort }, { token: Page }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Items }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Items, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: FiltersProvider }, { type: Sort }, { type: Page }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridItems {
    constructor(template, differs, items, vcr) {
        this.template = template;
        this.differs = differs;
        this.items = items;
        this.differ = null;
        this.subscriptions = [];
        items.smartenUp();
        this.iterableProxy = new NgForOf(vcr, template, differs);
        this.subscriptions.push(items.change.subscribe(newItems => {
            this.iterableProxy.ngForOf = newItems;
            this.iterableProxy.ngDoCheck();
        }));
    }
    set rawItems(items) {
        this._rawItems = items ? items : []; // local copy for ngOnChange diffing
    }
    set trackBy(value) {
        this.iterableProxy.ngForTrackBy = value;
    }
    /**
     * Asserts the correct type of the template context that the directive will render.
     * See https://angular.io/guide/structural-directives#typing-the-directives-context
     *
     * The presence of this method is a signal to the Ivy template type-check compiler that the
     * structural directive renders its template with a specific context type.
     */
    static ngTemplateContextGuard(_dir, _ctx) {
        return true;
    }
    ngDoCheck() {
        if (!this.differ) {
            this.differ = this.differs.find(this._rawItems).create(this.iterableProxy.ngForTrackBy);
        }
        if (this.differ) {
            const changes = this.differ.diff(this._rawItems);
            if (changes) {
                // TODO: not very efficient right now,
                // but premature optimization is the root of all evil.
                this.items.all = this._rawItems;
            }
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridItems, deps: [{ token: i0.TemplateRef }, { token: i0.IterableDiffers }, { token: Items }, { token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridItems, isStandalone: false, selector: "[clrDgItems][clrDgItemsOf]", inputs: { rawItems: ["clrDgItemsOf", "rawItems"], trackBy: ["clrDgItemsTrackBy", "trackBy"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridItems, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDgItems][clrDgItemsOf]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.IterableDiffers }, { type: Items }, { type: i0.ViewContainerRef }], propDecorators: { rawItems: [{
                type: Input,
                args: ['clrDgItemsOf']
            }], trackBy: [{
                type: Input,
                args: ['clrDgItemsTrackBy']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridPlaceholder {
    constructor(items) {
        this.items = items;
    }
    /**
     * Tests if the datagrid is empty, meaning it doesn't contain any items
     */
    get emptyDatagrid() {
        return !this.items.loading && (!this.items.displayed || this.items.displayed.length === 0);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPlaceholder, deps: [{ token: Items }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridPlaceholder, isStandalone: false, selector: "clr-dg-placeholder", host: { properties: { "class.datagrid-placeholder-container": "true" } }, ngImport: i0, template: `
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
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPlaceholder, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-placeholder',
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
                    host: { '[class.datagrid-placeholder-container]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: Items }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class WrappedCell {
    ngAfterViewInit() {
        this.cellView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.cellView.destroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedCell, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: WrappedCell, isStandalone: false, selector: "dg-wrapped-cell", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["cellPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedCell, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-cell',
                    template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['cellPortal']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridCell {
    constructor(vcr) {
        this.vcr = vcr;
    }
    get _view() {
        return this.wrappedInjector.get(WrappedCell, this.vcr).cellView;
    }
    ngOnInit() {
        this.wrappedInjector = new HostWrapper(WrappedCell, this.vcr);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridCell, deps: [{ token: i0.ViewContainerRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridCell, isStandalone: false, selector: "clr-dg-cell", host: { attributes: { "role": "gridcell" }, properties: { "class.datagrid-cell": "true", "class.datagrid-signpost-trigger": "signpost.length > 0" } }, queries: [{ propertyName: "signpost", predicate: ClrSignpost }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridCell, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-cell',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.datagrid-cell]': 'true',
                        '[class.datagrid-signpost-trigger]': 'signpost.length > 0',
                        role: 'gridcell',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ViewContainerRef }], propDecorators: { signpost: [{
                type: ContentChildren,
                args: [ClrSignpost]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbRow$1 = 0;
class DatagridIfExpandService extends IfExpandService {
    constructor() {
        super();
        this.expandableId = '';
        this._replace = new BehaviorSubject(false);
        this._animate = new Subject();
        nbRow$1++;
        this.expandableId = 'clr-dg-expandable-row-' + nbRow$1;
    }
    // due to the es5 spec if the set is overridden on base class the getter must also be overridden
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
        if (state !== ClrLoadingState.LOADING) {
            this._animate.next();
        }
    }
    setReplace(replaceValue) {
        this._replace.next(replaceValue);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridIfExpandService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridIfExpandService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridIfExpandService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var DatagridDisplayMode;
(function (DatagridDisplayMode) {
    DatagridDisplayMode[DatagridDisplayMode["DISPLAY"] = 0] = "DISPLAY";
    DatagridDisplayMode[DatagridDisplayMode["CALCULATE"] = 1] = "CALCULATE";
})(DatagridDisplayMode || (DatagridDisplayMode = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var SelectionType;
(function (SelectionType) {
    SelectionType[SelectionType["None"] = 0] = "None";
    SelectionType[SelectionType["Single"] = 1] = "Single";
    SelectionType[SelectionType["Multi"] = 2] = "Multi";
})(SelectionType || (SelectionType = {}));

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class WrappedRow {
    ngAfterViewInit() {
        // Create the cells view in memory, not the DOM.
        this.rowView = this.templateRef.createEmbeddedView(null);
    }
    ngOnDestroy() {
        this.rowView.destroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedRow, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: WrappedRow, isStandalone: false, selector: "dg-wrapped-row", viewQueries: [{ propertyName: "templateRef", first: true, predicate: ["rowPortal"], descendants: true }], ngImport: i0, template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: WrappedRow, decorators: [{
            type: Component,
            args: [{
                    selector: 'dg-wrapped-row',
                    template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
                    standalone: false,
                }]
        }], propDecorators: { templateRef: [{
                type: ViewChild,
                args: ['rowPortal']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbSelection = 0;
class Selection {
    constructor(_items, filters, differs) {
        this._items = _items;
        this.preserveSelection = false;
        /**
         * Shift key state, for use in range selection.
         */
        this.shiftPressed = false;
        /** @deprecated since 2.0, remove in 3.0 */
        this.rowSelectionMode = false;
        this.lockedRefs = []; // Ref of locked items
        this._currentSelectionRefs = [];
        this.valueCollector = new Subject();
        this._selectionType = SelectionType.None;
        /**
         * The Observable that lets other classes subscribe to selection changes
         */
        this._change = new Subject();
        /**
         * Subscriptions to the other providers changes.
         */
        this.subscriptions = [];
        this.id = 'clr-dg-selection' + nbSelection++;
        this.identifyBy = _items.identifyBy;
        this._differ = differs.find(this._current || []).create(this.identifyBy);
        this.subscriptions.push(filters.change.subscribe(() => {
            if (!this._selectable || this.preserveSelection) {
                return;
            }
            this.clearSelection();
        }));
        this.subscriptions.push(_items.allChanges.pipe(delay(0)).subscribe(updatedItems => {
            // Reset the lockedRefs;
            const updateLockedRef = [];
            switch (this.selectionType) {
                case SelectionType.None: {
                    break;
                }
                case SelectionType.Single: {
                    let newSingle;
                    let selectionUpdated = false;
                    updatedItems.forEach(item => {
                        const ref = _items.identifyBy(item);
                        // If one of the updated items is the previously selectedSingle, set it as the new one
                        if (this.currentSingleSelectionRef === ref) {
                            newSingle = item;
                            selectionUpdated = true;
                        }
                        if (this.lockedRefs.indexOf(ref) > -1) {
                            updateLockedRef.push(ref);
                        }
                    });
                    // If we're using smart datagrids, we expect all items to be present in the updatedItems array.
                    // Therefore, we should delete the currentSingle if it used to be defined but doesn't exist anymore.
                    // No explicit "delete" is required, since newSingle would be undefined at this point.
                    // Marking it as selectionUpdated here will set currentSingle to undefined below in the setTimeout.
                    if (_items.smart && !newSingle) {
                        selectionUpdated = true;
                    }
                    if (selectionUpdated) {
                        this.currentSingle = newSingle;
                    }
                    break;
                }
                case SelectionType.Multi: {
                    let leftOver = this.current.slice();
                    let selectionUpdated = false;
                    // Duplicate loop, when the issue is issue#2342 is revisited keep in mind that
                    // we need to go over every updated item and check to see if there are valid to be
                    // locked or not and update it. When only add items that are found in the lockedRefs back.
                    //
                    // The both loops below that goes over updatedItems could be combined into one.
                    updatedItems.forEach(item => {
                        const ref = _items.identifyBy(item);
                        if (this.lockedRefs.indexOf(ref) > -1) {
                            updateLockedRef.push(ref);
                        }
                    });
                    // TODO: revisit this when we work on https://github.com/vmware/clarity/issues/2342
                    // currently, the selection is cleared when filter is applied, so the logic inside
                    // the if statement below results in broken behavior.
                    if (leftOver.length > 0) {
                        updatedItems.forEach(item => {
                            const ref = _items.identifyBy(item);
                            // Look in current selected refs array if item is selected, and update actual value
                            const selectedIndex = this.currentSelectionRefs.indexOf(ref);
                            if (selectedIndex > -1) {
                                leftOver[selectedIndex] = item;
                                selectionUpdated = true;
                            }
                        });
                        // Filter out any unmatched items if we're using smart datagrids where we expect all items to be
                        // present
                        if (_items.smart) {
                            leftOver = leftOver.filter(selected => updatedItems.indexOf(selected) > -1);
                            if (this.current.length !== leftOver.length) {
                                selectionUpdated = true;
                            }
                        }
                        if (selectionUpdated) {
                            this.current = leftOver;
                        }
                    }
                    break;
                }
                default: {
                    break;
                }
            }
            // Sync locked items
            this.lockedRefs = updateLockedRef;
        }));
        this.subscriptions.push(this.valueCollector.pipe(debounceTime(0)).subscribe(() => this.emitChange()));
    }
    get selectionType() {
        return this._selectionType;
    }
    set selectionType(value) {
        if (value === this.selectionType) {
            return;
        }
        this._selectionType = value;
        if ([SelectionType.None, SelectionType.Single].includes(value)) {
            delete this.current;
        }
        else {
            this.updateCurrent([], false);
        }
    }
    get current() {
        return this._current;
    }
    set current(value) {
        this.updateCurrent(value, true);
        this.updateCurrentSelectionRefs();
    }
    get currentSingle() {
        return this._currentSingle;
    }
    set currentSingle(value) {
        if (value === this._currentSingle) {
            return;
        }
        this._currentSingle = value;
        this.emitChange();
    }
    // We do not want to expose the Subject itself, but the Observable which is read-only
    get change() {
        return this._change.asObservable();
    }
    get _selectable() {
        return this._selectionType === SelectionType.Multi || this._selectionType === SelectionType.Single;
    }
    // Refs of currently selected items
    get currentSelectionRefs() {
        return this._currentSelectionRefs;
    }
    // Ref of currently selected item
    get currentSingleSelectionRef() {
        return this._currentSingle && this._items.identifyBy(this._currentSingle);
    }
    checkForChanges() {
        const changes = this._differ.diff(this._current);
        // @TODO move the identifyBy from items to selection as it's used only here and is not needed in items
        if (this.identifyBy !== this._items.identifyBy) {
            this.identifyBy = this._items.identifyBy;
        }
        if (changes) {
            this.updateCurrentSelectionRefs();
        }
    }
    clearSelection() {
        this._current = [];
        this._currentSelectionRefs = [];
        this._currentSingle = null;
        this.emitChange();
    }
    /**
     * Cleans up our subscriptions to other providers
     */
    destroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    updateCurrent(value, emit) {
        this._current = value;
        if (emit) {
            this.valueCollector.next(value);
        }
    }
    /**
     * Checks if an item is currently selected
     */
    isSelected(item) {
        const ref = this._items.identifyBy(item);
        if (this._selectionType === SelectionType.Single) {
            return this.currentSingleSelectionRef === ref;
        }
        else if (this._selectionType === SelectionType.Multi) {
            return this.currentSelectionRefs.indexOf(ref) >= 0;
        }
        return false;
    }
    /**
     * Selects or deselects an item
     */
    setSelected(item, selected) {
        const ref = this._items.identifyBy(item);
        const index = this.currentSelectionRefs ? this.currentSelectionRefs.indexOf(ref) : -1;
        switch (this._selectionType) {
            case SelectionType.None:
                break;
            case SelectionType.Single:
                if (selected) {
                    this.currentSingle = item;
                }
                // in single selection, set currentSingle method should be used
                break;
            case SelectionType.Multi:
                if (index >= 0 && !selected) {
                    this.deselectItem(index);
                }
                else if (index < 0 && selected) {
                    this.selectItem(item);
                }
                break;
            default:
                break;
        }
    }
    /**
     * Checks if all currently displayed items are selected
     */
    isAllSelected() {
        if (this._selectionType !== SelectionType.Multi || !this._items.displayed) {
            return false;
        }
        // make sure to exclude the locked items from the list when counting
        const displayedItems = this._items.displayed.filter(item => {
            return this.isLocked(item) === false;
        });
        const nbDisplayed = displayedItems.length;
        if (nbDisplayed < 1) {
            return false;
        }
        const temp = displayedItems.filter(item => {
            const ref = this._items.identifyBy(item);
            return this.currentSelectionRefs.indexOf(ref) > -1;
        });
        return temp.length === displayedItems.length;
    }
    /**
     * Lock and unlock item
     */
    lockItem(item, lock) {
        if (this.canItBeLocked()) {
            const ref = this._items.identifyBy(item);
            if (lock === true) {
                // Add to lockedRef
                this.lockedRefs.push(ref);
            }
            else {
                // Remove from lockedRef
                this.lockedRefs = this.lockedRefs.filter(lockedItem => ref !== lockedItem);
            }
        }
    }
    /**
     * Check is item locked or not by searching into lockedRefs for entry
     */
    isLocked(item) {
        /**
         * The check for selectionType will boost the performance by NOT searching
         * into the array when there is no need for that.
         */
        if (this.canItBeLocked()) {
            const ref = this._items.identifyBy(item);
            return this.lockedRefs.indexOf(ref) > -1;
        }
        return false;
    }
    /**
     * Selects or deselects all currently displayed items
     */
    toggleAll() {
        if (this._selectionType === SelectionType.None || this._selectionType === SelectionType.Single) {
            return;
        }
        /**
         * If every currently displayed item is already selected, we clear them.
         * If at least one item isn't selected, we select every currently displayed item.
         */
        if (this.isAllSelected()) {
            this._items.displayed.forEach(item => {
                const ref = this._items.identifyBy(item);
                const currentIndex = this.currentSelectionRefs.indexOf(ref);
                if (currentIndex > -1 && this.isLocked(item) === false) {
                    this.deselectItem(currentIndex);
                }
            });
        }
        else {
            this._items.displayed.forEach(item => {
                if (!this.isSelected(item) && this.isLocked(item) === false) {
                    this.selectItem(item);
                }
            });
        }
    }
    /**
     * Selects an item
     */
    selectItem(item) {
        this.current = this.current.concat(item);
    }
    /**
     * Deselects an item
     */
    deselectItem(indexOfItem) {
        this.current = this.current.slice(0, indexOfItem).concat(this.current.slice(indexOfItem + 1));
        if (indexOfItem < this.currentSelectionRefs.length) {
            // Keep selected refs array in sync
            const removedItems = this.currentSelectionRefs[indexOfItem];
            // locked reference is no longer needed (if any)
            this.lockedRefs = this.lockedRefs.filter(locked => locked !== removedItems[0]);
        }
    }
    /**
     * Make sure that it could be locked
     */
    canItBeLocked() {
        return this._selectionType !== SelectionType.None;
    }
    emitChange() {
        if (this._selectionType === SelectionType.Single) {
            this._change.next(this.currentSingle);
        }
        else if (this._selectionType === SelectionType.Multi) {
            this._change.next(this.current);
        }
    }
    updateCurrentSelectionRefs() {
        this._currentSelectionRefs = this._current?.map(item => this._items.identifyBy(item)) || [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Selection, deps: [{ token: Items }, { token: FiltersProvider }, { token: i0.IterableDiffers }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Selection }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: Selection, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: Items }, { type: FiltersProvider }, { type: i0.IterableDiffers }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class RowActionService {
    constructor() {
        this.actionableCount = 0;
    }
    /**
     * false means no rows with action
     */
    get hasActionableRow() {
        return this.actionableCount > 0;
    }
    register() {
        this.actionableCount++;
    }
    unregister() {
        this.actionableCount--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: RowActionService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: RowActionService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: RowActionService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExpandableRowsCount {
    constructor(detailService) {
        this.detailService = detailService;
        this.expandableCount = 0;
    }
    /**
     * false means no rows with action
     * check if details are on, and disable rows entirely
     */
    get hasExpandableRow() {
        return !this.detailService.enabled && this.expandableCount > 0;
    }
    register() {
        this.expandableCount++;
    }
    unregister() {
        this.expandableCount--;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ExpandableRowsCount, deps: [{ token: DetailService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ExpandableRowsCount }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ExpandableRowsCount, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: DetailService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DisplayModeService {
    constructor(renderOrganizer) {
        this._view = new BehaviorSubject(DatagridDisplayMode.DISPLAY);
        this.subscriptions = [];
        this.subscriptions.push(renderOrganizer
            .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_ON)
            .subscribe(() => this._view.next(DatagridDisplayMode.CALCULATE)));
        this.subscriptions.push(renderOrganizer
            .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_OFF)
            .subscribe(() => this._view.next(DatagridDisplayMode.DISPLAY)));
    }
    get view() {
        return this._view.asObservable();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DisplayModeService, deps: [{ token: DatagridRenderOrganizer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DisplayModeService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DisplayModeService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: DatagridRenderOrganizer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridSingleSelectionValueAccessor {
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }
    writeValue(value) {
        this.state = value;
        this.updateChecked();
    }
    keyOf(value) {
        if (value && this.clrDgIdentityFn) {
            return this.clrDgIdentityFn(value);
        }
        return value;
    }
    updateChecked() {
        const state = this.keyOf(this.state);
        const value = this.keyOf(this.value);
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', state === value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridSingleSelectionValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridSingleSelectionValueAccessor, isStandalone: true, selector: "input[type=radio][clrDgSingleSelectionRadio]", inputs: { value: "value", clrDgIdentityFn: "clrDgIdentityFn" }, host: { listeners: { "change": "onChange(value)", "blur": "onTouched()" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
                multi: true,
            },
        ], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridSingleSelectionValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=radio][clrDgSingleSelectionRadio]',
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => ClrDatagridSingleSelectionValueAccessor),
                            multi: true,
                        },
                    ],
                    host: {
                        '(change)': 'onChange(value)',
                        '(blur)': 'onTouched()',
                    },
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }], propDecorators: { value: [{
                type: Input
            }], clrDgIdentityFn: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridSelectionCellDirective {
    constructor(selection) {
        this.selection = selection;
    }
    onSelectionCellClick(event) {
        // We want to effectively expand the selection click target to the entire selection cell.
        // If row selection is enabled, do nothing because the entire selection cell is already clickable.
        if (this.selection.rowSelectionMode) {
            return;
        }
        // If click was outside the label/input, forward the click to the input.
        if (event.target.tagName !== 'LABEL' && event.target.tagName !== 'INPUT') {
            event.target.querySelector('input')?.click();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridSelectionCellDirective, deps: [{ token: Selection }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridSelectionCellDirective, isStandalone: false, selector: ".datagrid-select", host: { listeners: { "click": "onSelectionCellClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridSelectionCellDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '.datagrid-select',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: Selection }], propDecorators: { onSelectionCellClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let nbRow = 0;
class ClrDatagridRow {
    constructor(selection, rowActionService, globalExpandable, expand, detailService, displayMode, vcr, renderer, el, commonStrings, items, document) {
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
        this.document = document;
        this.selectedChanged = new EventEmitter(false);
        this.expandedChange = new EventEmitter(false);
        this.detailDisabled = false;
        this.detailHidden = false;
        this.skeletonLoading = false;
        this.displayCells = false;
        this.expandAnimationTrigger = false;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
        /**
         * @internal
         */
        this.itemChanges = new ReplaySubject(1);
        this._selected = false;
        this._detailOpenLabel = '';
        this._detailCloseLabel = '';
        this._rowSelectionLabel = '';
        this.subscriptions = [];
        // By default, every item is selectable; it becomes not selectable only if it's explicitly set to false
        this._selectable = true;
        nbRow++;
        this.id = 'clr-dg-row' + nbRow;
        this.radioId = 'clr-dg-row-rd' + nbRow;
        this.checkboxId = 'clr-dg-row-cb' + nbRow;
        this.expandableId = expand.expandableId;
        this.subscriptions.push(combineLatest(expand.replace, expand.expandChange).subscribe(([expandReplaceValue, expandChangeValue]) => {
            if (expandReplaceValue && expandChangeValue) {
                // replaced and expanding
                this.replaced = true;
                renderer.addClass(el.nativeElement, 'datagrid-row-replaced');
            }
            else {
                this.replaced = false;
                // Handles these cases: not replaced and collapsing & replaced and
                // collapsing and not replaced and expanding.
                renderer.removeClass(el.nativeElement, 'datagrid-row-replaced');
            }
        }));
    }
    /**
     * Model of the row, to use for selection
     */
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
        if (this.item) {
            this.selection.lockItem(this.item, value === 'false' || value === false);
        }
        // Store this value locally, to be initialized when item is initialized
        this._selectable = value;
    }
    /**
     * Indicates if the row is selected
     */
    get selected() {
        if (this.selection.selectionType === SelectionType.None) {
            return this._selected;
        }
        else {
            return this.selection.isSelected(this.item);
        }
    }
    set selected(value) {
        if (this.selection.selectionType === SelectionType.None) {
            this._selected = value;
        }
        else {
            if (value && this.selection.selectionType === SelectionType.Multi) {
                this.rangeSelect();
            }
            else {
                this.selection.rangeStart = null;
            }
            this.selection.setSelected(this.item, value);
        }
    }
    get expanded() {
        return this.expand.expanded;
    }
    set expanded(value) {
        this.expand.expanded = value;
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
    // CDE-151: Rename this field to clrDgRowSelectionLabel in v16
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
    ngOnInit() {
        this.wrappedInjector = new HostWrapper(WrappedRow, this.vcr);
        this.selection.lockItem(this.item, this.clrDgSelectable === false);
    }
    ngAfterContentInit() {
        this.dgCells.changes.subscribe(() => {
            this.dgCells.forEach(cell => {
                if (!cell._view.destroyed) {
                    this._scrollableCells.insert(cell._view);
                }
            });
        });
    }
    ngAfterViewInit() {
        this.subscriptions.push(this.displayMode.view.subscribe(viewChange => {
            // Listen for view changes and move cells around depending on the current displayType
            // remove cell views from display view
            for (let i = this._scrollableCells.length; i > 0; i--) {
                this._scrollableCells.detach();
            }
            // remove cell views from calculated view
            for (let i = this._calculatedCells.length; i > 0; i--) {
                this._calculatedCells.detach();
            }
            if (viewChange === DatagridDisplayMode.CALCULATE) {
                this.displayCells = false;
                // Inserts a fixed cell if any of these conditions are true.
                const fixedCellConditions = [
                    this.selection.selectionType !== this.SELECTION_TYPE.None,
                    this.rowActionService.hasActionableRow,
                    this.globalExpandable.hasExpandableRow,
                    this.detailService.enabled,
                ];
                fixedCellConditions
                    .filter(Boolean)
                    .forEach(() => this._calculatedCells.insert(this._fixedCellTemplate.createEmbeddedView(null)));
                this.dgCells.forEach(cell => {
                    if (!cell._view.destroyed) {
                        this._calculatedCells.insert(cell._view);
                    }
                });
            }
            else {
                this.displayCells = true;
                this.dgCells.forEach(cell => {
                    if (!cell._view.destroyed) {
                        this._scrollableCells.insert(cell._view);
                    }
                });
            }
        }), this.expand.animate.subscribe(() => {
            this.expandAnimationTrigger = !this.expandAnimationTrigger;
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
    toggle(selected = !this.selected) {
        if (selected !== this.selected) {
            this.selected = selected;
            this.selectedChanged.emit(selected);
        }
    }
    toggleExpand() {
        if (this.expand.expandable) {
            this.expandAnimation.updateStartHeight();
            this.expanded = !this.expanded;
            this.expandedChange.emit(this.expanded);
        }
    }
    /**
     * The default behavior in Chrome and Firefox for shift-clicking on a label is to perform text-selection.
     * This prevents our intended range-selection, because this text-selection overrides our shift-click event.
     * We need to clear the stored selection range when shift-clicking. This will override the mostly unused shift-click
     * selection browser functionality, which is inconsistently implemented in browsers anyway.
     */
    clearRanges(event) {
        if (this.selection.rowSelectionMode && event.shiftKey) {
            this.document.getSelection().removeAllRanges();
            // Firefox is too persistent about its text-selection behaviour. So we need to add a preventDefault();
            // We should not try to enforce this on the other browsers, though, because their toggle cycle does not get canceled by
            // the preventDefault() and they toggle the checkbox second time, effectively retrurning it to not-selected.
            if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
                event.preventDefault();
                this.toggle(true);
            }
        }
    }
    /**
     * @deprecated related to clrDgRowSelection, which is deprecated
     */
    selectRow(selected = !this.selected, $event) {
        // The label also captures clicks that bubble up to the row event listener, causing
        // this handler to run twice. This exits early to prevent toggling the checkbox twice.
        if (!this.selection.rowSelectionMode || $event.target.tagName === 'LABEL' || !this._selectable) {
            return;
        }
        if (this.selection.selectionType === this.SELECTION_TYPE.Single) {
            this.selection.currentSingle = this.item;
        }
        else {
            this.toggle(selected);
        }
    }
    rangeSelect() {
        const items = this.items.displayed;
        if (!items) {
            return;
        }
        const startIx = items.indexOf(this.selection.rangeStart);
        if (this.selection.rangeStart &&
            this.selection.current.includes(this.selection.rangeStart) &&
            this.selection.shiftPressed &&
            startIx !== -1) {
            const endIx = items.indexOf(this.item);
            // Using Set to remove duplicates
            const newSelection = new Set(this.selection.current.concat(items.slice(Math.min(startIx, endIx), Math.max(startIx, endIx) + 1)));
            this.selection.current = [...newSelection];
        }
        else {
            // page number has changed or
            // no Shift was pressed or
            // rangeStart not yet set
            this.selection.rangeStart = this.item;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridRow, deps: [{ token: Selection }, { token: RowActionService }, { token: ExpandableRowsCount }, { token: DatagridIfExpandService }, { token: DetailService }, { token: DisplayModeService }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i2.ClrCommonStringsService }, { token: Items }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridRow, isStandalone: false, selector: "clr-dg-row", inputs: { detailDisabled: ["clrDgDetailDisabled", "detailDisabled"], detailHidden: ["clrDgDetailHidden", "detailHidden"], skeletonLoading: ["clrDgSkeletonLoading", "skeletonLoading"], item: ["clrDgItem", "item"], clrDgSelectable: "clrDgSelectable", selected: ["clrDgSelected", "selected"], expanded: ["clrDgExpanded", "expanded"], clrDgDetailOpenLabel: "clrDgDetailOpenLabel", clrDgDetailCloseLabel: "clrDgDetailCloseLabel", clrDgRowSelectionLabel: "clrDgRowSelectionLabel" }, outputs: { selectedChanged: "clrDgSelectedChange", expandedChange: "clrDgExpandedChange" }, host: { attributes: { "role": "rowgroup" }, properties: { "class.datagrid-row": "true", "class.datagrid-row-skeleton": "skeletonLoading", "class.datagrid-selected": "selected", "attr.aria-owns": "id" } }, providers: [
            DatagridIfExpandService,
            { provide: IfExpandService, useExisting: DatagridIfExpandService },
            { provide: LoadingListener, useExisting: DatagridIfExpandService },
        ], queries: [{ propertyName: "dgCells", predicate: ClrDatagridCell }], viewQueries: [{ propertyName: "expandAnimation", first: true, predicate: ClrExpandableAnimationDirective, descendants: true }, { propertyName: "detailButton", first: true, predicate: ["detailButton"], descendants: true }, { propertyName: "_stickyCells", first: true, predicate: ["stickyCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_scrollableCells", first: true, predicate: ["scrollableCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculatedCells", first: true, predicate: ["calculatedCells"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedCellTemplate", first: true, predicate: ["fixedCellTemplate"], descendants: true }], ngImport: i0, template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      @if (selection.selectionType === SELECTION_TYPE.Multi) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      } @if (selection.selectionType === SELECTION_TYPE.Single) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgIdentityFn]=\"identifyBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      } @if (rowActionService.hasActionableRow) {\n      <div class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      } @if (globalExpandable.hasExpandableRow) {\n      <div class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (expand.expandable) { @if (!expand.loading) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"toggleExpand()\"\n          type=\"button\"\n          class=\"datagrid-expandable-caret-button\"\n          [attr.aria-expanded]=\"expand.expanded\"\n          [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n        >\n          <cds-icon\n            shape=\"angle\"\n            class=\"datagrid-expandable-caret-icon\"\n            [direction]=\"expand.expanded ? 'down' : 'right'\"\n            [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n          ></cds-icon>\n        </button>\n        } @if (expand.loading) {\n        <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        } }\n      </div>\n      } @if (detailService.enabled) {\n      <div class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (!detailHidden) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n        }\n      </div>\n      }\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    @if (replaced && !expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    } @if (!replaced && !expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    }\n  </div>\n</div>\n<!--\nWe need the \"project into template\" hacks because we need this in 2 different places\ndepending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i9.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i12.ClrRadio, selector: "[clrRadio]" }, { kind: "component", type: i12.ClrRadioWrapper, selector: "clr-radio-wrapper" }, { kind: "directive", type: i13.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i13.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i13.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i2.ClrExpandableAnimationDirective, selector: "[clrExpandableAnimation]", inputs: ["clrExpandableAnimation"] }, { kind: "component", type: i14.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "directive", type: ClrDatagridSingleSelectionValueAccessor, selector: "input[type=radio][clrDgSingleSelectionRadio]", inputs: ["value", "clrDgIdentityFn"] }, { kind: "directive", type: ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridRow, decorators: [{
            type: Component,
            args: [{ selector: 'clr-dg-row', host: {
                        '[class.datagrid-row]': 'true',
                        '[class.datagrid-row-skeleton]': 'skeletonLoading',
                        '[class.datagrid-selected]': 'selected',
                        '[attr.aria-owns]': 'id',
                        role: 'rowgroup',
                    }, providers: [
                        DatagridIfExpandService,
                        { provide: IfExpandService, useExisting: DatagridIfExpandService },
                        { provide: LoadingListener, useExisting: DatagridIfExpandService },
                    ], standalone: false, template: "<div\n  role=\"row\"\n  [id]=\"id\"\n  class=\"datagrid-row-master datagrid-row-flex\"\n  [clrExpandableAnimation]=\"expandAnimationTrigger\"\n  (mousedown)=\"clearRanges($event)\"\n  (click)=\"selectRow(!selected, $event)\"\n  [class.datagrid-row-clickable]=\"selection.rowSelectionMode\"\n  [class.datagrid-row-detail-open]=\"detailService.isRowOpen(item)\"\n>\n  <div class=\"datagrid-row-sticky\">\n    <!-- Sticky elements here -->\n    <ng-container #stickyCells>\n      @if (selection.selectionType === SELECTION_TYPE.Multi) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <div class=\"clr-checkbox-wrapper\">\n          <input\n            tabindex=\"-1\"\n            type=\"checkbox\"\n            [ngModel]=\"selected\"\n            (ngModelChange)=\"toggle($event)\"\n            [id]=\"checkboxId\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n          <label [for]=\"checkboxId\" class=\"clr-control-label clr-col-null\" (click)=\"clearRanges($event)\">\n            <span class=\"clr-sr-only\">{{clrDgRowSelectionLabel || commonStrings.keys.select}}</span>\n          </label>\n        </div>\n      </div>\n      } @if (selection.selectionType === SELECTION_TYPE.Single) {\n      <div\n        class=\"datagrid-select datagrid-fixed-column datagrid-cell\"\n        [ngClass]=\"{ 'clr-form-control-disabled': !clrDgSelectable }\"\n        role=\"gridcell\"\n      >\n        <clr-radio-wrapper>\n          <input\n            tabindex=\"-1\"\n            type=\"radio\"\n            clrRadio\n            clrDgSingleSelectionRadio\n            [clrDgIdentityFn]=\"identifyBy\"\n            [id]=\"radioId\"\n            [name]=\"selection.id + '-radio'\"\n            [value]=\"item\"\n            [(ngModel)]=\"selection.currentSingle\"\n            [disabled]=\"clrDgSelectable ? null : true\"\n            [attr.aria-disabled]=\"clrDgSelectable ? null : true\"\n          />\n          <label class=\"clr-control-label clr-col-null\" [for]=\"radioId\">\n            <span class=\"clr-sr-only\">{{ clrDgRowSelectionLabel || commonStrings.keys.select }}</span>\n          </label>\n        </clr-radio-wrapper>\n      </div>\n      } @if (rowActionService.hasActionableRow) {\n      <div class=\"datagrid-row-actions datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        <ng-content select=\"clr-dg-action-overflow\"></ng-content>\n      </div>\n      } @if (globalExpandable.hasExpandableRow) {\n      <div class=\"datagrid-expandable-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (expand.expandable) { @if (!expand.loading) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"toggleExpand()\"\n          type=\"button\"\n          class=\"datagrid-expandable-caret-button\"\n          [attr.aria-expanded]=\"expand.expanded\"\n          [attr.aria-label]=\"expand.expanded ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-controls]=\"expand.hasExpandTemplate && !expand.expanded ? null : expandableId\"\n        >\n          <cds-icon\n            shape=\"angle\"\n            class=\"datagrid-expandable-caret-icon\"\n            [direction]=\"expand.expanded ? 'down' : 'right'\"\n            [attr.title]=\"expand.expanded ? commonStrings.keys.collapse : commonStrings.keys.expand\"\n          ></cds-icon>\n        </button>\n        } @if (expand.loading) {\n        <clr-spinner clrSmall>{{ commonStrings.keys.loading }}</clr-spinner>\n        } }\n      </div>\n      } @if (detailService.enabled) {\n      <div class=\"datagrid-detail-caret datagrid-fixed-column datagrid-cell\" role=\"gridcell\">\n        @if (!detailHidden) {\n        <button\n          tabindex=\"-1\"\n          (click)=\"detailService.toggle(item, detailButton)\"\n          type=\"button\"\n          #detailButton\n          class=\"datagrid-detail-caret-button\"\n          [disabled]=\"detailDisabled\"\n          [class.is-open]=\"detailService.isRowOpen(item)\"\n          [attr.aria-label]=\"detailService.isRowOpen(item) ? clrDgDetailCloseLabel : clrDgDetailOpenLabel\"\n          [attr.aria-expanded]=\"detailService.isRowOpen(item)\"\n          [attr.aria-controls]=\"detailService.id\"\n          aria-haspopup=\"dialog\"\n        >\n          <cds-icon\n            shape=\"angle-double\"\n            [direction]=\"detailService.isRowOpen(item) ? 'left' : 'right'\"\n            class=\"datagrid-detail-caret-icon\"\n            [attr.title]=\"detailService.isRowOpen(item) ? commonStrings.keys.close: commonStrings.keys.open\"\n          ></cds-icon>\n        </button>\n        }\n      </div>\n      }\n    </ng-container>\n    <!-- placeholder for projecting other sticky cells as pinned-->\n  </div>\n  <div class=\"datagrid-row-scrollable\" [ngClass]=\"{'is-replaced': replaced && expanded}\">\n    <div class=\"datagrid-scrolling-cells\">\n      <ng-content select=\"clr-dg-cell\"></ng-content>\n      <ng-container #scrollableCells></ng-container>\n    </div>\n    <!-- details here when replace, re-visit when sticky container is used for pinned cells -->\n    @if (replaced && !expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    } @if (!replaced && !expand.loading) {\n    <ng-template [ngTemplateOutlet]=\"detail\"></ng-template>\n    }\n  </div>\n</div>\n<!--\nWe need the \"project into template\" hacks because we need this in 2 different places\ndepending on whether the details replace the row or not.\n-->\n<ng-template #detail>\n  <ng-content select=\"clr-dg-row-detail\"></ng-content>\n</ng-template>\n\n<ng-container #calculatedCells></ng-container>\n\n<ng-template #fixedCellTemplate>\n  <div class=\"datagrid-fixed-column datagrid-cell\" role=\"gridcell\"></div>\n</ng-template>\n" }]
        }], ctorParameters: () => [{ type: Selection }, { type: RowActionService }, { type: ExpandableRowsCount }, { type: DatagridIfExpandService }, { type: DetailService }, { type: DisplayModeService }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i2.ClrCommonStringsService }, { type: Items }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { selectedChanged: [{
                type: Output,
                args: ['clrDgSelectedChange']
            }], expandedChange: [{
                type: Output,
                args: ['clrDgExpandedChange']
            }], detailDisabled: [{
                type: Input,
                args: ['clrDgDetailDisabled']
            }], detailHidden: [{
                type: Input,
                args: ['clrDgDetailHidden']
            }], skeletonLoading: [{
                type: Input,
                args: ['clrDgSkeletonLoading']
            }], dgCells: [{
                type: ContentChildren,
                args: [ClrDatagridCell]
            }], expandAnimation: [{
                type: ViewChild,
                args: [ClrExpandableAnimationDirective]
            }], detailButton: [{
                type: ViewChild,
                args: ['detailButton']
            }], _stickyCells: [{
                type: ViewChild,
                args: ['stickyCells', { read: ViewContainerRef }]
            }], _scrollableCells: [{
                type: ViewChild,
                args: ['scrollableCells', { read: ViewContainerRef }]
            }], _calculatedCells: [{
                type: ViewChild,
                args: ['calculatedCells', { read: ViewContainerRef }]
            }], _fixedCellTemplate: [{
                type: ViewChild,
                args: ['fixedCellTemplate']
            }], item: [{
                type: Input,
                args: ['clrDgItem']
            }], clrDgSelectable: [{
                type: Input,
                args: ['clrDgSelectable']
            }], selected: [{
                type: Input,
                args: ['clrDgSelected']
            }], expanded: [{
                type: Input,
                args: ['clrDgExpanded']
            }], clrDgDetailOpenLabel: [{
                type: Input
            }], clrDgDetailCloseLabel: [{
                type: Input
            }], clrDgRowSelectionLabel: [{
                type: Input
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var DatagridColumnChanges;
(function (DatagridColumnChanges) {
    DatagridColumnChanges[DatagridColumnChanges["WIDTH"] = 0] = "WIDTH";
    DatagridColumnChanges[DatagridColumnChanges["HIDDEN"] = 1] = "HIDDEN";
    DatagridColumnChanges[DatagridColumnChanges["INITIALIZE"] = 2] = "INITIALIZE";
})(DatagridColumnChanges || (DatagridColumnChanges = {}));
const ALL_COLUMN_CHANGES = Object.keys(DatagridColumnChanges)
    .map(key => DatagridColumnChanges[key])
    .filter(key => key === parseInt(key, 10) && key !== DatagridColumnChanges.INITIALIZE); // extracts only integer keys

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ColumnsService {
    constructor() {
        this.columns = [];
        this.columnsStateChange = new BehaviorSubject(null);
        this._cache = [];
    }
    get columnStates() {
        return this.columns.map(column => column.value);
    }
    get hasHideableColumns() {
        return this.columnStates.filter(state => state.hideable).length > 0;
    }
    get visibleColumns() {
        return this.columnStates.filter(state => !state.hidden);
    }
    cache() {
        this._cache = this.columns.map(subject => {
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
            // Just emit the exact value from the cache
            const cachedState = { ...state, changes: ALL_COLUMN_CHANGES };
            this.columns[index].next(cachedState);
            this.columnsStateChange.next(cachedState);
        });
        this._cache = [];
    }
    // Helper method to emit a change to a column only when there is an actual diff to process for that column
    emitStateChangeAt(columnIndex, diff) {
        if (!this.columns[columnIndex]) {
            return;
        }
        this.emitStateChange(this.columns[columnIndex], diff);
    }
    emitStateChange(column, diff) {
        const changedState = { ...column.value, ...diff };
        column.next(changedState);
        this.columnsStateChange.next(changedState);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ColumnsService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridVirtualScrollDirective {
    constructor(changeDetectorRef, iterableDiffers, items, ngZone, renderer2, templateRef, viewContainerRef, directionality, scrollDispatcher, viewportRuler, datagrid, columnsService, injector) {
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
        this.columnsService = columnsService;
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
        // @deprecated remove the mutation observer when `datagrid-compact` class is deleted
        this.mutationChanges = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // it is possible this to be called twice because the old class is removed and the new added
                if (!this._isUserProvidedItemSize &&
                    mutation.target.classList.contains('datagrid-compact') &&
                    this.itemSize > 25) {
                    this.updateItemSize(25);
                }
            });
        });
        this.viewRepeater = new _RecycleViewRepeaterStrategy();
        this.cdkVirtualForInputs = {
            cdkVirtualForTrackBy: index => index,
        };
        items.smartenUp();
        datagrid.detailService.preventFocusScroll = true;
        this.datagridElementRef = datagrid.el;
        // default
        this.cdkVirtualForTemplateCacheSize = 20;
        const cellHeightToken = window.getComputedStyle(document.body).getPropertyValue('--clr-table-cell-height');
        const cellHeightValue = +/calc\(([0-9]+) \* calc\(\(1rem \/ 20\) \* 1\)\)/.exec(cellHeightToken)?.[1];
        const borderWidthToken = window.getComputedStyle(document.body).getPropertyValue('--clr-table-borderwidth');
        const borderWidthValue = +/calc\(([0-9]+) \* \(1rem \/ 20\)\)/.exec(borderWidthToken)?.[1];
        // initially rowHeightValue is calculated based on `--clr-table-row-height` that had a discreet value.
        // currently `--clr-table-row-height` is calculated based on `--clr-table-cell-height` + `--clr-table-borderwidth`
        const rowHeightValue = cellHeightValue + borderWidthValue;
        if (rowHeightValue && this.itemSize > rowHeightValue) {
            this.updateItemSize(rowHeightValue);
        }
        this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
        this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(this.itemSize, this.minBufferPx, this.maxBufferPx);
    }
    get totalContentHeight() {
        return this.virtualScrollViewport?._totalContentHeight() || '';
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
        if (!range) {
            return;
        }
        if (this.items.smart) {
            this.items.smartenDown();
        }
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
            this.cdkVirtualFor = createCdkVirtualForOfDirective(this.viewContainerRef, this.templateRef, this.iterableDiffers, this.viewRepeater, this.virtualScrollViewport, this.ngZone);
            this.virtualScrollViewport.ngOnInit();
        });
        this.gridRoleElement = this.datagridElementRef.nativeElement.querySelector('[role="grid"]');
        this.updateCdkVirtualForInputs();
        this.subscriptions.push(this.items.change.subscribe(newItems => {
            if (this.items.smart) {
                this.cdkVirtualFor.cdkVirtualForOf = newItems;
            }
            this.shouldUpdateAriaRowIndexes = true;
        }), this.cdkVirtualFor.dataStream.subscribe(data => {
            this.updateAriaRowCount(data.length);
        }), this.virtualScrollViewport.scrolledIndexChange.subscribe(index => {
            this.topIndex = index;
        }), this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
            this.renderedRangeChange.emit(renderedRange);
            this.shouldUpdateAriaRowIndexes = true;
        }), this.datagrid.refresh.subscribe(datagridState => {
            if (datagridState.filters) {
                this.scrollToIndex(0);
            }
        }), this.columnsService.columnsStateChange.subscribe(() => {
            this.viewRepeater.detach();
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
        this.cdkVirtualFor?.ngOnDestroy();
        this.virtualScrollViewport?.ngOnDestroy();
        this.mutationChanges?.disconnect();
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
    scrollUp(offset, behavior = 'auto') {
        this.scrollToIndex(this.topIndex - offset, behavior);
    }
    scrollDown(offset, behavior = 'auto') {
        this.scrollToIndex(this.topIndex + offset, behavior);
    }
    scrollToIndex(index, behavior = 'auto') {
        this.virtualScrollViewport?.scrollToIndex(index, behavior);
    }
    updateDataRange(skip, data) {
        let items = this.cdkVirtualForOf;
        if (!this.persistItems || !items || items?.length !== this.totalItems) {
            items = Array(this.totalItems);
        }
        items.splice(skip, data.length, ...data);
        this.cdkVirtualForOf = Array.from(items);
    }
    updateItemSize(value) {
        this._itemSize = coerceNumberProperty(value);
        this.updateFixedSizeVirtualScrollInputs();
    }
    updateCdkVirtualForInputs() {
        if (this.cdkVirtualFor) {
            for (const cdkVirtualForInputKey of Object.keys(this.cdkVirtualForInputs)) {
                if (this.cdkVirtualFor[cdkVirtualForInputKey] !== this.cdkVirtualForInputs[cdkVirtualForInputKey]) {
                    this.cdkVirtualFor[cdkVirtualForInputKey] = this.cdkVirtualForInputs[cdkVirtualForInputKey];
                }
            }
        }
    }
    updateFixedSizeVirtualScrollInputs() {
        if (this.virtualScrollStrategy) {
            this.virtualScrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
        }
    }
    updateAriaRowCount(rowCount) {
        this.gridRoleElement?.setAttribute('aria-rowcount', rowCount.toString());
    }
    updateAriaRowIndexes() {
        for (let i = 0; i < this.viewContainerRef.length; i++) {
            const viewRef = this.viewContainerRef.get(i);
            const rootElements = viewRef.rootNodes;
            const datagridRowElement = rootElements.find(rowElement => rowElement.tagName === 'CLR-DG-ROW');
            const rowRoleElement = datagridRowElement?.querySelector('[role="row"]');
            const newAriaRowIndex = (viewRef.context.index + 1).toString();
            if (rowRoleElement?.getAttribute('aria-rowindex') !== newAriaRowIndex) {
                // aria-rowindex should start with one, not zero, so we have to add one to the zero-based index
                rowRoleElement?.setAttribute('aria-rowindex', newAriaRowIndex);
            }
        }
    }
    createVirtualScrollViewportForDatagrid(changeDetectorRef, ngZone, renderer2, directionality, scrollDispatcher, viewportRuler, datagridElementRef, virtualScrollStrategy) {
        const datagridContentElement = datagridElementRef.nativeElement.querySelector('.datagrid-content');
        const datagridRowsElement = datagridElementRef.nativeElement.querySelector('.datagrid-rows');
        const virtualScrollViewport = createCdkVirtualScrollViewport(new ElementRef(datagridContentElement), new ElementRef(datagridRowsElement), changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, null);
        return virtualScrollViewport;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: Items }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2$1.Directionality }, { token: i3$1.ScrollDispatcher }, { token: i3$1.ViewportRuler }, { token: forwardRef(() => ClrDatagrid) }, { token: ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridVirtualScrollDirective, isStandalone: false, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVirtualScroll],[ClrVirtualScroll]',
                    providers: [Items],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: Items }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i2$1.Directionality }, { type: i3$1.ScrollDispatcher }, { type: i3$1.ViewportRuler }, { type: ClrDatagrid, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => ClrDatagrid)]
                }] }, { type: ColumnsService }, { type: i0.EnvironmentInjector }], propDecorators: { renderedRangeChange: [{
                type: Output
            }], persistItems: [{
                type: Input,
                args: ['clrVirtualPersistItems']
            }], cdkVirtualForOf: [{
                type: Input,
                args: ['clrVirtualRowsOf']
            }], cdkVirtualForTrackBy: [{
                type: Input,
                args: ['clrVirtualRowsTrackBy']
            }], cdkVirtualForTemplate: [{
                type: Input,
                args: ['clrVirtualRowsTemplate']
            }], cdkVirtualForTemplateCacheSize: [{
                type: Input,
                args: ['clrVirtualRowsTemplateCacheSize']
            }], itemSize: [{
                type: Input,
                args: ['clrVirtualRowsItemSize']
            }], minBufferPx: [{
                type: Input,
                args: ['clrVirtualRowsMinBufferPx']
            }], maxBufferPx: [{
                type: Input,
                args: ['clrVirtualRowsMaxBufferPx']
            }], dataRange: [{
                type: Input,
                args: ['clrVirtualDataRange']
            }] } });
function createCdkVirtualScrollViewport(datagridDivElementRef, contentWrapper, changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, scrollable) {
    const virtualScrollViewportInjector = Injector.create({
        parent: inject(EnvironmentInjector),
        providers: [
            { provide: ElementRef, useValue: datagridDivElementRef },
            { provide: ChangeDetectorRef, useValue: changeDetectorRef },
            { provide: NgZone, useValue: ngZone },
            { provide: Renderer2, useValue: renderer2 },
            { provide: VIRTUAL_SCROLL_STRATEGY, useValue: virtualScrollStrategy },
            { provide: Directionality, useValue: directionality },
            { provide: ScrollDispatcher, useValue: scrollDispatcher },
            { provide: ViewportRuler, useValue: viewportRuler },
            { provide: CdkVirtualScrollable, useValue: scrollable },
            { provide: CdkVirtualScrollViewport, useClass: CdkVirtualScrollViewport },
        ],
    });
    const viewPort = virtualScrollViewportInjector.get(CdkVirtualScrollViewport);
    viewPort._contentWrapper = contentWrapper;
    return viewPort;
}
function createCdkVirtualForOfDirective(viewContainerRef, templateRef, iterableDiffers, viewRepeater, virtualScrollViewport, ngZone) {
    const virtualScrollViewportInjector = Injector.create({
        parent: inject(EnvironmentInjector),
        providers: [{ provide: CdkVirtualScrollViewport, useValue: virtualScrollViewport }],
    });
    const cdkVirtualForInjector = Injector.create({
        parent: virtualScrollViewportInjector,
        providers: [
            { provide: ViewContainerRef, useValue: viewContainerRef },
            { provide: TemplateRef, useValue: templateRef },
            { provide: IterableDiffers, useValue: iterableDiffers },
            { provide: _VIEW_REPEATER_STRATEGY, useValue: viewRepeater },
            { provide: NgZone, useValue: ngZone },
            { provide: CdkVirtualForOf, useClass: CdkVirtualForOf },
        ],
    });
    return cdkVirtualForInjector.get(CdkVirtualForOf);
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * This provider aggregates state changes from the various providers of the Datagrid
 */
class StateProvider {
    constructor(filters, sort, page, debouncer) {
        this.filters = filters;
        this.sort = sort;
        this.page = page;
        this.debouncer = debouncer;
        /**
         * The Observable that lets other classes subscribe to global state changes
         */
        this.change = this.debouncer.change.pipe(map(() => this.state));
    }
    /*
     * By making this a getter, we open the possibility for a setter in the future.
     * It's been requested a couple times.
     */
    get state() {
        const state = {};
        if (this.page.size > 0) {
            state.page = {
                from: this.page.firstItem,
                to: this.page.lastItem,
                size: this.page.size,
                current: this.page.current,
            };
        }
        if (this.sort.comparator) {
            if (this.sort.comparator instanceof DatagridPropertyComparator) {
                /*
                 * Special case for the default object property comparator,
                 * we give the property name instead of the actual comparator.
                 */
                state.sort = { by: this.sort.comparator.prop, reverse: this.sort.reverse };
            }
            else {
                state.sort = { by: this.sort.comparator, reverse: this.sort.reverse };
            }
        }
        const activeFilters = this.filters.getActiveFilters();
        if (activeFilters.length > 0) {
            state.filters = [];
            for (const filter of activeFilters) {
                if (filter.state) {
                    state.filters.push(filter.state);
                }
                else {
                    state.filters.push(filter);
                }
            }
        }
        return state;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateProvider, deps: [{ token: FiltersProvider }, { token: Sort }, { token: Page }, { token: StateDebouncer }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateProvider }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: StateProvider, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: FiltersProvider }, { type: Sort }, { type: Page }, { type: StateDebouncer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridCellRenderer {
    constructor(el, renderer, organizer) {
        this.el = el;
        this.renderer = renderer;
        this.subscriptions = [];
        this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth()));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }
    resetState(state) {
        this.setWidth(state);
        this.setHidden(state);
    }
    setWidth(state) {
        if (state.strictWidth) {
            this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        }
        this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
    }
    setHidden(state) {
        if (state.hidden) {
            this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
    }
    clearWidth() {
        this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        this.renderer.setStyle(this.el.nativeElement, 'width', null);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridCellRenderer, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: DatagridRenderOrganizer }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridCellRenderer, isStandalone: false, selector: "clr-dg-cell", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridCellRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-cell',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: DatagridRenderOrganizer }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridRowRenderer {
    constructor(columnsService) {
        this.columnsService = columnsService;
        this.expandableRows = [];
        this.subscriptions = [];
    }
    ngAfterContentInit() {
        this.setCellsState(); // case #3 and #4
        this.subscriptions.push(this.cells.changes.subscribe(() => {
            this.setCellsState(); // case #2
            // Note on case #2: In the case of dynamic columns, when one column (header/cell together) gets deleted,
            // this.cells.changes emits before this.columnsService.columns gets updated in MainRenderer
            // when this.headers.changes emits as well. So that means there will be n+1 column state providers
            // when this.cells.changes emits. Hence, we should quit earlier there. But this method will be called
            // right after again when this.headers.changes emits. By then, there will be the same number of column state
            // providers as column headers.
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setCellsState() {
        // This method runs in four cases:
        // 1. When the initial rows appear on the first page.
        //    In this case, the method will be called in DatagridMainRenderer.
        // 2. When columns (corresponding header/cells) get added and deleted.
        //    In this case, the method will be called in DatagridMainRenderer. (Read the note on this case above).
        // 3. When rows load asynchronously.
        //    In this case, the method will be called in this class.
        // 4. When rows load after switching pages.
        //    In this case, the method will be called in this class (Basically, same as the case 3).
        if (this.cells.length === this.columnsService.columns.length) {
            this.cells.forEach((cell, index) => {
                if (this.columnsService.columns[index]) {
                    cell.resetState(this.columnsService.columns[index].value);
                }
            });
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRowRenderer, deps: [{ token: ColumnsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridRowRenderer, isStandalone: false, selector: "clr-dg-row", queries: [{ propertyName: "cells", predicate: DatagridCellRenderer }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRowRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-row',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ColumnsService }], propDecorators: { cells: [{
                type: ContentChildren,
                args: [DatagridCellRenderer]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridWillyWonka extends WillyWonka {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridWillyWonka, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridWillyWonka, isStandalone: false, selector: "clr-datagrid", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridWillyWonka, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid',
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ActionableOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, rowActions) {
        if (!willyWonka) {
            throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
        }
        super(cdr, willyWonka);
        this.rowActions = rowActions;
    }
    get flavor() {
        return this.rowActions.hasActionableRow;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActionableOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: DatagridWillyWonka, optional: true }, { token: RowActionService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ActionableOompaLoompa, isStandalone: false, selector: "clr-datagrid, clr-dg-row", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ActionableOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid, clr-dg-row',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: DatagridWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: RowActionService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ExpandableOompaLoompa extends OompaLoompa {
    constructor(cdr, willyWonka, expandableCount) {
        if (!willyWonka) {
            throw new Error('clr-dg-row should only be used inside of a clr-datagrid');
        }
        super(cdr, willyWonka);
        this.expandableCount = expandableCount;
    }
    get flavor() {
        return this.expandableCount.hasExpandableRow;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ExpandableOompaLoompa, deps: [{ token: i0.ChangeDetectorRef }, { token: DatagridWillyWonka, optional: true }, { token: ExpandableRowsCount }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ExpandableOompaLoompa, isStandalone: false, selector: "clr-datagrid, clr-dg-row", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ExpandableOompaLoompa, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid, clr-dg-row',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: DatagridWillyWonka, decorators: [{
                    type: Optional
                }] }, { type: ExpandableRowsCount }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagrid {
    constructor(organizer, items, expandableRows, selection, rowActionService, stateProvider, displayMode, renderer, detailService, document, el, page, commonStrings, keyNavigation, zone) {
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
        this.clrDgSingleSelectionAriaLabel = this.commonStrings.keys.singleSelectionAriaLabel;
        this.clrDgSingleActionableAriaLabel = this.commonStrings.keys.singleActionableAriaLabel;
        this.clrDetailExpandableAriaLabel = this.commonStrings.keys.detailExpandableAriaLabel;
        // Allows disabling of the auto focus on page/state changes (excludes focus management inside of popups)
        this.clrDgDisablePageFocus = false;
        this.selectedChanged = new EventEmitter(false);
        this.singleSelectedChanged = new EventEmitter(false);
        /**
         * Output emitted whenever the data needs to be refreshed, based on user action or external ones
         */
        this.refresh = new EventEmitter(false);
        /**
         * The application can provide custom select all logic.
         */
        this.customSelectAllEnabled = false;
        this.customSelectAll = new EventEmitter();
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
        /**
         * Subscriptions to all the services and queries changes
         */
        this._subscriptions = [];
        this._virtualScrollSubscriptions = [];
        this.cachedRowsHeight = 0;
        this.cachedContentHeight = 0;
        this.resizeObserver = new ResizeObserver(entries => {
            requestAnimationFrame(() => {
                this.handleResizeChanges(entries);
            });
        });
        const datagridId = uniqueIdFactory();
        this.selectAllId = 'clr-dg-select-all-' + datagridId;
        detailService.id = datagridId;
    }
    /**
     * Freezes the datagrid while data is loading
     */
    get loading() {
        return this.items.loading;
    }
    set loading(value) {
        this.items.loading = value;
    }
    /**
     * Array of all selected items
     */
    set selected(value) {
        if (value) {
            this.selection.selectionType = SelectionType.Multi;
        }
        else {
            this.selection.selectionType = SelectionType.None;
        }
        this.selection.updateCurrent(value, false);
    }
    /**
     * Selected item in single-select mode
     */
    set singleSelected(value) {
        this.selection.selectionType = SelectionType.Single;
        // the clrDgSingleSelected is updated in one of two cases:
        // 1. an explicit value is passed
        // 2. is being set to null or undefined, where previously it had a value
        if (value) {
            this.selection.currentSingle = value;
        }
        else if (this.selection.currentSingle) {
            this.selection.currentSingle = null;
        }
    }
    set clrDgPreserveSelection(state) {
        this.selection.preserveSelection = state;
    }
    /**
     * @deprecated since 2.0, remove in 3.0
     *
     * Selection/Deselection on row click mode
     */
    set rowSelectionMode(value) {
        this.selection.rowSelectionMode = value;
    }
    set identityFn(value) {
        this.items.identifyBy = value;
    }
    /**
     * Indicates if all currently displayed items are selected
     */
    get allSelected() {
        return this.selection.isAllSelected();
    }
    set allSelected(value) {
        if (this.customSelectAllEnabled) {
            this.customSelectAll.emit(value);
        }
        else {
            /**
             * This is a setter but we ignore the value.
             * It's strange, but it lets us have an indeterminate state where only
             * some of the items are selected.
             */
            this.selection.toggleAll();
        }
    }
    get virtualScroll() {
        return this._virtualScroll?.get(0);
    }
    ngAfterContentInit() {
        if (!this.items.smart) {
            this.items.all = this.rows.map((row) => row.item);
        }
        const rowItemsChanges = this.rows.changes.pipe(switchMap((rows) => merge(
        // immediate update
        of(rows.map(row => row.item)), 
        // subsequent updates once per tick
        combineLatest(rows.map(row => row.itemChanges)).pipe(debounceTime(0)))));
        this._subscriptions.push(rowItemsChanges.subscribe(all => {
            if (!this.items.smart) {
                this.items.all = all;
            }
        }), this._virtualScroll.changes.subscribe(() => {
            this.toggleVirtualScrollSubscriptions();
        }), this.rows.changes.subscribe(() => {
            // Remove any projected rows from the displayedRows container
            // Necessary with Ivy off. See https://github.com/vmware/clarity/issues/4692
            for (let i = this._displayedRows.length - 1; i >= 0; i--) {
                if (this._displayedRows.get(i).destroyed) {
                    this._displayedRows.remove(i);
                }
            }
            this.rows.forEach(row => {
                this._displayedRows.insert(row._view);
            });
            this.updateDetailState();
            // retain active cell when navigating with Up/Down Arrows, PageUp and PageDown buttons in virtual scroller
            if (this.virtualScroll && this.activeCellCoords) {
                this.zone.runOutsideAngular(() => {
                    const row = Array.from(this.rows).find(row => {
                        return row.el.nativeElement.children[0].ariaRowIndex === this.activeCellCoords.ariaRowIndex;
                    });
                    if (!row) {
                        return;
                    }
                    const activeCell = row.el.nativeElement.querySelectorAll(this.keyNavigation.config.keyGridCells)[this.activeCellCoords.x];
                    this.keyNavigation.setActiveCell(activeCell);
                    this.keyNavigation.focusElement(activeCell, { preventScroll: true });
                });
            }
        }));
    }
    /**
     * Our setup happens in the view of some of our components, so we wait for it to be done before starting
     */
    ngAfterViewInit() {
        this.keyNavigation.initializeKeyGrid(this.el.nativeElement);
        this.updateDetailState();
        // TODO: determine if we can get rid of provider wiring in view init so that subscriptions can be done earlier
        this.refresh.emit(this.stateProvider.state);
        this._subscriptions.push(this.stickyHeaders.changes.subscribe(() => this.resize()), this.stateProvider.change.subscribe(state => this.refresh.emit(state)), this.selection.change.subscribe(s => {
            if (this.selection.selectionType === SelectionType.Single) {
                this.singleSelectedChanged.emit(s);
            }
            else if (this.selection.selectionType === SelectionType.Multi) {
                this.selectedChanged.emit(s);
            }
        }), 
        // Reinitialize arrow key navigation on page changes
        this.page.change.subscribe(() => {
            this.keyNavigation.resetKeyGrid();
            if (!this.clrDgDisablePageFocus) {
                this.datagridTable.nativeElement.focus();
            }
        }), 
        // A subscription that listens for displayMode changes on the datagrid
        this.displayMode.view.subscribe(viewChange => {
            // Remove any projected columns from the projectedDisplayColumns container
            for (let i = this._projectedDisplayColumns.length; i > 0; i--) {
                this._projectedDisplayColumns.detach();
            }
            // Remove any projected columns from the projectedCalculationColumns container
            for (let i = this._projectedCalculationColumns.length; i > 0; i--) {
                this._projectedCalculationColumns.detach();
            }
            // Remove any projected rows from the calculationRows container
            for (let i = this._calculationRows.length; i > 0; i--) {
                this._calculationRows.detach();
            }
            // Remove any projected rows from the displayedRows container
            for (let i = this._displayedRows.length; i > 0; i--) {
                this._displayedRows.detach();
            }
            if (viewChange === DatagridDisplayMode.DISPLAY) {
                // Set state, style for the datagrid to DISPLAY and insert row & columns into containers
                this.renderer.removeClass(this.el.nativeElement, 'datagrid-calculate-mode');
                this.columns.forEach(column => {
                    this._projectedDisplayColumns.insert(column._view);
                });
                this.rows.forEach(row => {
                    this._displayedRows.insert(row._view);
                });
            }
            else {
                // Set state, style for the datagrid to CALCULATE and insert row & columns into containers
                this.renderer.addClass(this.el.nativeElement, 'datagrid-calculate-mode');
                // Inserts a fixed column if any of these conditions are true.
                const fixedColumnConditions = [
                    this.rowActionService.hasActionableRow,
                    this.selection.selectionType !== this.SELECTION_TYPE.None,
                    this.expandableRows.hasExpandableRow || this.detailService.enabled,
                ];
                fixedColumnConditions
                    .filter(Boolean)
                    .forEach(() => this._projectedCalculationColumns.insert(this._fixedColumnTemplate.createEmbeddedView(null)));
                this.columns.forEach(column => {
                    this._projectedCalculationColumns.insert(column._view);
                });
                this.rows.forEach(row => {
                    this._calculationRows.insert(row._view);
                });
            }
        }));
        if (this.virtualScroll) {
            this.toggleVirtualScrollSubscriptions();
        }
        // We need to preserve shift state, so it can be used on selection change, regardless of the input event
        // that triggered the change. This helps us to easily resolve the k/b only case together with the mouse selection case.
        this.zone.runOutsideAngular(() => {
            this._subscriptions.push(fromEvent(this.document.body, 'keydown').subscribe((event) => {
                if (event.key === 'Shift') {
                    this.selection.shiftPressed = true;
                }
            }), fromEvent(this.document.body, 'keyup').subscribe((event) => {
                if (event.key === 'Shift') {
                    this.selection.shiftPressed = false;
                }
            }));
        });
    }
    ngDoCheck() {
        // we track for changes on selection.current because it can happen with pushing items
        // instead of overriding the variable
        this.selection.checkForChanges();
    }
    ngOnDestroy() {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
        this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
        this.resizeObserver.disconnect();
    }
    toggleAllSelected($event) {
        $event.preventDefault();
        this.selectAllCheckbox?.nativeElement.click();
    }
    resize() {
        this.organizer.resize();
    }
    /**
     * Checks the state of detail panel and if it's opened then
     * find the matching row and trigger the detail panel
     */
    updateDetailState() {
        // Try to update only when there is something cached and its open.
        if (this.detailService.state && this.detailService.isOpen) {
            const row = this.rows.find(row => this.items.identifyBy(row.item) === this.items.identifyBy(this.detailService.state));
            /**
             * Reopen updated row or close it
             */
            if (row) {
                this.detailService.open(row.item, row.detailButton.nativeElement);
                // always keep open when virtual scroll is available otherwise close it
            }
            else if (!this.virtualScroll) {
                // Using setTimeout to make sure the inner cycles in rows are done
                setTimeout(() => {
                    this.detailService.close();
                });
            }
        }
    }
    /**
     * Public method to re-trigger the computation of displayed items manually
     */
    dataChanged() {
        this.items.refresh();
    }
    toggleVirtualScrollSubscriptions() {
        const hasVirtualScroll = !!this.virtualScroll;
        // the virtual scroll will handle the scrolling
        this.keyNavigation.preventScrollOnFocus = hasVirtualScroll;
        if (hasVirtualScroll && this._virtualScrollSubscriptions.length === 0) {
            // TODO: use `resizeObserver` for all datagrid variants
            this.resizeObserver.observe(this.contentWrapper.nativeElement);
            this.resizeObserver.observe(this.rowsWrapper.nativeElement);
            this._virtualScrollSubscriptions.push(fromEvent(this.contentWrapper.nativeElement, 'scroll').subscribe(() => {
                if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
                    this.datagridHeader.nativeElement.scrollLeft = this.contentWrapper.nativeElement.scrollLeft;
                }
            }), fromEvent(this.datagridHeader.nativeElement, 'scroll').subscribe(() => {
                if (this.datagridHeader.nativeElement.scrollLeft !== this.contentWrapper.nativeElement.scrollLeft) {
                    this.contentWrapper.nativeElement.scrollLeft = this.datagridHeader.nativeElement.scrollLeft;
                }
            }), this.keyNavigation.nextCellCoordsEmitter.subscribe(cellCoords => {
                if (!cellCoords?.ariaRowIndex) {
                    this.activeCellCoords = null;
                    return;
                }
                if (cellCoords.ariaRowIndex === this.activeCellCoords?.ariaRowIndex) {
                    this.activeCellCoords = cellCoords;
                    return;
                }
                this.activeCellCoords = cellCoords;
                // aria-rowindex is always + 1. Check virtual scroller updateAriaRowIndexes method.
                const rowIndex = Number(cellCoords.ariaRowIndex) - 1;
                this.virtualScroll.scrollToIndex(rowIndex);
            }));
        }
        else if (!hasVirtualScroll) {
            this.resizeObserver.disconnect();
            this._virtualScrollSubscriptions.forEach((sub) => sub.unsubscribe());
            this._virtualScrollSubscriptions = [];
        }
    }
    handleResizeChanges(entries) {
        const rowsWrapper = this.rowsWrapper.nativeElement;
        for (const entry of entries) {
            if (entry.target === this.contentWrapper.nativeElement) {
                this.cachedContentHeight = entry.contentRect.height;
            }
            if (entry.target === rowsWrapper) {
                this.cachedRowsHeight = entry.contentRect.height;
            }
        }
        const scrollClass = 'datagrid-scrollbar-visible';
        if (this.cachedRowsHeight > this.cachedContentHeight) {
            this.renderer.addClass(rowsWrapper, scrollClass);
        }
        else {
            this.renderer.removeClass(rowsWrapper, scrollClass);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagrid, deps: [{ token: DatagridRenderOrganizer }, { token: Items }, { token: ExpandableRowsCount }, { token: Selection }, { token: RowActionService }, { token: StateProvider }, { token: DisplayModeService }, { token: i0.Renderer2 }, { token: DetailService }, { token: DOCUMENT }, { token: i0.ElementRef }, { token: Page }, { token: i2.ClrCommonStringsService }, { token: KeyNavigationGridController }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagrid, isStandalone: false, selector: "clr-datagrid", inputs: { loadingMoreItems: ["clrLoadingMoreItems", "loadingMoreItems"], clrDgSingleSelectionAriaLabel: "clrDgSingleSelectionAriaLabel", clrDgSingleActionableAriaLabel: "clrDgSingleActionableAriaLabel", clrDetailExpandableAriaLabel: "clrDetailExpandableAriaLabel", clrDgDisablePageFocus: "clrDgDisablePageFocus", customSelectAllEnabled: ["clrDgCustomSelectAllEnabled", "customSelectAllEnabled"], loading: ["clrDgLoading", "loading"], selected: ["clrDgSelected", "selected"], singleSelected: ["clrDgSingleSelected", "singleSelected"], clrDgPreserveSelection: "clrDgPreserveSelection", rowSelectionMode: ["clrDgRowSelection", "rowSelectionMode"], identityFn: ["clrDgItemsIdentityFn", "identityFn"] }, outputs: { selectedChanged: "clrDgSelectedChange", singleSelectedChanged: "clrDgSingleSelectedChange", refresh: "clrDgRefresh", customSelectAll: "clrDgCustomSelectAll" }, host: { properties: { "class.datagrid-host": "true", "class.datagrid-detail-open": "detailService.isOpen", "class.datagrid-virtual-scroll": "!!virtualScroll" } }, providers: [
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
        ], queries: [{ propertyName: "iterator", first: true, predicate: ClrDatagridItems, descendants: true }, { propertyName: "placeholder", first: true, predicate: ClrDatagridPlaceholder, descendants: true }, { propertyName: "_virtualScroll", predicate: i0.forwardRef(() => ClrDatagridVirtualScrollDirective) }, { propertyName: "columns", predicate: ClrDatagridColumn }, { propertyName: "rows", predicate: ClrDatagridRow, emitDistinctChangesOnly: false }], viewQueries: [{ propertyName: "datagrid", first: true, predicate: ["datagrid"], descendants: true, read: ElementRef }, { propertyName: "datagridTable", first: true, predicate: ["datagridTable"], descendants: true, read: ElementRef }, { propertyName: "datagridHeader", first: true, predicate: ["datagridHeader"], descendants: true, read: ElementRef }, { propertyName: "contentWrapper", first: true, predicate: ["contentWrapper"], descendants: true, read: ElementRef, static: true }, { propertyName: "rowsWrapper", first: true, predicate: ["rowsWrapper"], descendants: true, read: ElementRef, static: true }, { propertyName: "scrollableColumns", first: true, predicate: ["scrollableColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedDisplayColumns", first: true, predicate: ["projectedDisplayColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_projectedCalculationColumns", first: true, predicate: ["projectedCalculationColumns"], descendants: true, read: ViewContainerRef }, { propertyName: "_displayedRows", first: true, predicate: ["displayedRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_calculationRows", first: true, predicate: ["calculationRows"], descendants: true, read: ViewContainerRef }, { propertyName: "_fixedColumnTemplate", first: true, predicate: ["fixedColumnTemplate"], descendants: true }, { propertyName: "selectAllCheckbox", first: true, predicate: ["selectAllCheckbox"], descendants: true }, { propertyName: "stickyHeaders", predicate: ["stickyHeader"], descendants: true }], ngImport: i0, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  @if (selection.selectionType === SELECTION_TYPE.Multi) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    @if (!virtualScroll || customSelectAllEnabled) {\n                    <div class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                          which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n                    }\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for datagrid where you can select one row only -->\n                  @if (selection.selectionType === SELECTION_TYPE.Single) {\n                  <div #stickyHeader role=\"columnheader\" class=\"datagrid-column datagrid-select datagrid-fixed-column\">\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  @if (rowActionService.hasActionableRow) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  @if (expandableRows.hasExpandableRow || detailService.enabled) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                @if (virtualScroll) {\n                <div class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n                }\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            @if (virtualScroll) {\n            <div class=\"datagrid-content-virtual-spacer\" [style.height]=\"virtualScroll?.totalContentHeight\"></div>\n            }\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <ng-container #displayedRows></ng-container>\n\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              @if (!placeholder) {\n              <clr-dg-placeholder></clr-dg-placeholder>\n              }\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    @if (loading) {\n    <div class=\"datagrid-spinner\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n    }\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n", dependencies: [{ kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i13.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i14.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }, { kind: "component", type: ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "component", type: ClrDatagridPlaceholder, selector: "clr-dg-placeholder" }, { kind: "component", type: ClrDatagridRow, selector: "clr-dg-row", inputs: ["clrDgDetailDisabled", "clrDgDetailHidden", "clrDgSkeletonLoading", "clrDgItem", "clrDgSelectable", "clrDgSelected", "clrDgExpanded", "clrDgDetailOpenLabel", "clrDgDetailCloseLabel", "clrDgRowSelectionLabel"], outputs: ["clrDgSelectedChange", "clrDgExpandedChange"] }, { kind: "directive", type: ClrDatagridSelectionCellDirective, selector: ".datagrid-select" }, { kind: "directive", type: DatagridCellRenderer, selector: "clr-dg-cell" }, { kind: "directive", type: DatagridRowRenderer, selector: "clr-dg-row" }, { kind: "directive", type: ActionableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }, { kind: "directive", type: ExpandableOompaLoompa, selector: "clr-datagrid, clr-dg-row" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagrid, decorators: [{
            type: Component,
            args: [{ selector: 'clr-datagrid', providers: [
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
                    ], host: {
                        '[class.datagrid-host]': 'true',
                        '[class.datagrid-detail-open]': 'detailService.isOpen',
                        '[class.datagrid-virtual-scroll]': '!!virtualScroll',
                    }, standalone: false, template: "<!--\n~ Copyright (c) 2016-2025 Broadcom. All Rights Reserved.\n~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n~ This software is released under MIT license.\n~ The full license information can be found in LICENSE in the root directory of this project.\n-->\n\n<ng-content select=\"clr-dg-action-bar\"></ng-content>\n<div class=\"datagrid-outer-wrapper\">\n  <div class=\"datagrid-inner-wrapper\">\n    <div class=\"datagrid\" #datagrid [attr.aria-hidden]=\"detailService.isOpen ? true : null\">\n      <div class=\"datagrid-table-wrapper\">\n        <div role=\"grid\" class=\"datagrid-table\" tabindex=\"-1\" #datagridTable>\n          <div role=\"rowgroup\" class=\"datagrid-header\" #datagridHeader>\n            <div role=\"row\" class=\"datagrid-row\">\n              <div class=\"datagrid-row-master datagrid-row-flex\">\n                <div class=\"datagrid-row-sticky\">\n                  <!--header for datagrid where you can select multiple rows -->\n                  @if (selection.selectionType === SELECTION_TYPE.Multi) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-select datagrid-fixed-column\"\n                    (keydown.space)=\"toggleAllSelected($event)\"\n                  >\n                    @if (!virtualScroll || customSelectAllEnabled) {\n                    <div class=\"clr-checkbox-wrapper\">\n                      <!-- We need to move focus and space-key handling to the parent because of keyboard arrow key navigation,\n                          which is not able to transfer focus directly on the input when focused with the tab key -->\n                      <input\n                        #selectAllCheckbox\n                        type=\"checkbox\"\n                        [id]=\"selectAllId\"\n                        [(ngModel)]=\"allSelected\"\n                        [attr.aria-label]=\"commonStrings.keys.selectAll\"\n                        tabindex=\"-1\"\n                      />\n                      <!-- Usage of class clr-col-null here prevents clr-col-* classes from being added when a datagrid is wrapped inside clrForm -->\n                      <label [for]=\"selectAllId\" class=\"clr-control-label clr-col-null\">\n                        <span class=\"clr-sr-only\">{{commonStrings.keys.selectAll}}</span>\n                      </label>\n                    </div>\n                    }\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for datagrid where you can select one row only -->\n                  @if (selection.selectionType === SELECTION_TYPE.Single) {\n                  <div #stickyHeader role=\"columnheader\" class=\"datagrid-column datagrid-select datagrid-fixed-column\">\n                    <div class=\"clr-sr-only\">{{clrDgSingleSelectionAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for single row action; only displayType if we have at least one actionable row in datagrid -->\n                  @if (rowActionService.hasActionableRow) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-row-actions datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDgSingleActionableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                  <!-- header for carets; only displayType if we have at least one expandable row in datagrid -->\n                  @if (expandableRows.hasExpandableRow || detailService.enabled) {\n                  <div\n                    #stickyHeader\n                    role=\"columnheader\"\n                    class=\"datagrid-column datagrid-expandable-caret datagrid-fixed-column\"\n                  >\n                    <div class=\"clr-sr-only\">{{clrDetailExpandableAriaLabel}}</div>\n                    <div class=\"datagrid-column-separator\"></div>\n                  </div>\n                  }\n                </div>\n                <div class=\"datagrid-row-scrollable\">\n                  <ng-container #projectedDisplayColumns></ng-container>\n                </div>\n                @if (virtualScroll) {\n                <div class=\"datagrid-row-sticky datagrid-row-sticky-scroll\">\n                  <div class=\"datagrid-column\"></div>\n                </div>\n                }\n              </div>\n            </div>\n          </div>\n\n          <div class=\"datagrid-content\" [class.datagrid-content-virtual]=\"virtualScroll\" #contentWrapper>\n            @if (virtualScroll) {\n            <div class=\"datagrid-content-virtual-spacer\" [style.height]=\"virtualScroll?.totalContentHeight\"></div>\n            }\n            <div role=\"presentation\" #rowsWrapper class=\"datagrid-rows\">\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <ng-container #displayedRows></ng-container>\n\n              @if (loadingMoreItems) {\n              <clr-dg-row class=\"datagrid-row-loading\">\n                <clr-dg-cell>\n                  <clr-spinner clrMedium></clr-spinner>\n                  <span>{{ commonStrings.keys.loading }}</span>\n                </clr-dg-cell>\n              </clr-dg-row>\n              }\n\n              <!-- Custom placeholder overrides the default empty one -->\n              <ng-content select=\"clr-dg-placeholder\"></ng-content>\n              @if (!placeholder) {\n              <clr-dg-placeholder></clr-dg-placeholder>\n              }\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <ng-content select=\"clr-dg-footer\"></ng-content>\n    @if (loading) {\n    <div class=\"datagrid-spinner\">\n      <clr-spinner clrMedium>Loading</clr-spinner>\n    </div>\n    }\n  </div>\n  <ng-content select=\"[clrIfDetail],clr-dg-detail\"></ng-content>\n</div>\n\n<div class=\"datagrid-calculation-table\">\n  <div class=\"datagrid-calculation-header\">\n    <ng-container #projectedCalculationColumns></ng-container>\n  </div>\n  <ng-container #calculationRows></ng-container>\n</div>\n\n<ng-template #fixedColumnTemplate>\n  <div class=\"datagrid-column datagrid-fixed-column\"></div>\n</ng-template>\n" }]
        }], ctorParameters: () => [{ type: DatagridRenderOrganizer }, { type: Items }, { type: ExpandableRowsCount }, { type: Selection }, { type: RowActionService }, { type: StateProvider }, { type: DisplayModeService }, { type: i0.Renderer2 }, { type: DetailService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: Page }, { type: i2.ClrCommonStringsService }, { type: KeyNavigationGridController }, { type: i0.NgZone }], propDecorators: { loadingMoreItems: [{
                type: Input,
                args: ['clrLoadingMoreItems']
            }], clrDgSingleSelectionAriaLabel: [{
                type: Input
            }], clrDgSingleActionableAriaLabel: [{
                type: Input
            }], clrDetailExpandableAriaLabel: [{
                type: Input
            }], clrDgDisablePageFocus: [{
                type: Input
            }], selectedChanged: [{
                type: Output,
                args: ['clrDgSelectedChange']
            }], singleSelectedChanged: [{
                type: Output,
                args: ['clrDgSingleSelectedChange']
            }], refresh: [{
                type: Output,
                args: ['clrDgRefresh']
            }], customSelectAllEnabled: [{
                type: Input,
                args: ['clrDgCustomSelectAllEnabled']
            }], customSelectAll: [{
                type: Output,
                args: ['clrDgCustomSelectAll']
            }], _virtualScroll: [{
                type: ContentChildren,
                args: [forwardRef(() => ClrDatagridVirtualScrollDirective)]
            }], iterator: [{
                type: ContentChild,
                args: [ClrDatagridItems]
            }], placeholder: [{
                type: ContentChild,
                args: [ClrDatagridPlaceholder]
            }], columns: [{
                type: ContentChildren,
                args: [ClrDatagridColumn]
            }], rows: [{
                type: ContentChildren,
                args: [ClrDatagridRow, { emitDistinctChangesOnly: false }]
            }], datagrid: [{
                type: ViewChild,
                args: ['datagrid', { read: ElementRef }]
            }], datagridTable: [{
                type: ViewChild,
                args: ['datagridTable', { read: ElementRef }]
            }], datagridHeader: [{
                type: ViewChild,
                args: ['datagridHeader', { read: ElementRef }]
            }], contentWrapper: [{
                type: ViewChild,
                args: ['contentWrapper', { read: ElementRef, static: true }]
            }], rowsWrapper: [{
                type: ViewChild,
                args: ['rowsWrapper', { read: ElementRef, static: true }]
            }], scrollableColumns: [{
                type: ViewChild,
                args: ['scrollableColumns', { read: ViewContainerRef }]
            }], _projectedDisplayColumns: [{
                type: ViewChild,
                args: ['projectedDisplayColumns', { read: ViewContainerRef }]
            }], _projectedCalculationColumns: [{
                type: ViewChild,
                args: ['projectedCalculationColumns', { read: ViewContainerRef }]
            }], _displayedRows: [{
                type: ViewChild,
                args: ['displayedRows', { read: ViewContainerRef }]
            }], _calculationRows: [{
                type: ViewChild,
                args: ['calculationRows', { read: ViewContainerRef }]
            }], _fixedColumnTemplate: [{
                type: ViewChild,
                args: ['fixedColumnTemplate']
            }], stickyHeaders: [{
                type: ViewChildren,
                args: ['stickyHeader', { emitDistinctChangesOnly: true }]
            }], selectAllCheckbox: [{
                type: ViewChild,
                args: ['selectAllCheckbox']
            }], loading: [{
                type: Input,
                args: ['clrDgLoading']
            }], selected: [{
                type: Input,
                args: ['clrDgSelected']
            }], singleSelected: [{
                type: Input,
                args: ['clrDgSingleSelected']
            }], clrDgPreserveSelection: [{
                type: Input
            }], rowSelectionMode: [{
                type: Input,
                args: ['clrDgRowSelection']
            }], identityFn: [{
                type: Input,
                args: ['clrDgItemsIdentityFn']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridActionBar {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridActionBar, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridActionBar, isStandalone: false, selector: "clr-dg-action-bar", host: { properties: { "class.datagrid-action-bar": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridActionBar, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-action-bar',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.datagrid-action-bar]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let clrDgActionId = 0;
class ClrDatagridActionOverflow {
    constructor(rowActionService, commonStrings, platformId, popoverService) {
        this.rowActionService = rowActionService;
        this.commonStrings = commonStrings;
        this.platformId = platformId;
        this.popoverService = popoverService;
        this.openChange = new EventEmitter(false);
        this.popoverId = uniqueIdFactory();
        this.smartPosition = ClrPopoverPosition.RIGHT_MIDDLE;
        this.positions = [
            mapPopoverKeyToPosition(ClrPopoverPosition.RIGHT_BOTTOM, ClrPopoverType.DROPDOWN),
            mapPopoverKeyToPosition(ClrPopoverPosition.RIGHT_TOP, ClrPopoverType.DROPDOWN),
        ];
        this._open = false;
        this.subscriptions = [];
        rowActionService.register();
        this.subscriptions.push(popoverService.openChange.subscribe(openState => {
            this.open = openState;
        }), popoverService.popoverVisible.subscribe(visible => {
            if (visible) {
                this.initializeFocus();
            }
        }));
        this.popoverId = 'clr-action-menu' + clrDgActionId++;
    }
    get open() {
        return this._open;
    }
    set open(open) {
        const openState = !!open;
        if (!!openState !== this.open) {
            // prevents chocolate mess
            this.popoverService.open = openState;
            this.openChange.emit(openState);
            this._open = openState;
        }
    }
    ngOnDestroy() {
        this.rowActionService.unregister();
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    closeOverflowContent(event) {
        this.popoverService.toggleWithEvent(event);
    }
    initializeFocus() {
        if (isPlatformBrowser(this.platformId)) {
            const buttons = Array.from(document.querySelectorAll('button.action-item'));
            if (buttons.length) {
                this.keyFocus.current = 0;
                this.keyFocus.focusableItems = buttons;
                this.keyFocus.focusCurrent();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridActionOverflow, deps: [{ token: RowActionService }, { token: i2.ClrCommonStringsService }, { token: PLATFORM_ID }, { token: i3.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridActionOverflow, isStandalone: false, selector: "clr-dg-action-overflow", inputs: { buttonLabel: ["clrDgActionOverflowButtonLabel", "buttonLabel"], open: ["clrDgActionOverflowOpen", "open"] }, outputs: { openChange: "clrDgActionOverflowOpenChange" }, viewQueries: [{ propertyName: "keyFocus", first: true, predicate: ClrKeyFocus, descendants: true }], hostDirectives: [{ directive: i3.ClrPopoverHostDirective }], ngImport: i0, template: `
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
      clrPopoverAnchor
      clrPopoverOpenCloseButton
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i3.ÇlrClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i3.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "component", type: i2.ClrKeyFocus, selector: "[clrKeyFocus]", inputs: ["clrDirection", "clrFocusOnLoad", "clrKeyFocus"], outputs: ["clrFocusChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridActionOverflow, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-action-overflow',
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
      clrPopoverAnchor
      clrPopoverOpenCloseButton
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
                }]
        }], ctorParameters: () => [{ type: RowActionService }, { type: i2.ClrCommonStringsService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i3.ClrPopoverService }], propDecorators: { buttonLabel: [{
                type: Input,
                args: ['clrDgActionOverflowButtonLabel']
            }], openChange: [{
                type: Output,
                args: ['clrDgActionOverflowOpenChange']
            }], keyFocus: [{
                type: ViewChild,
                args: [ClrKeyFocus]
            }], open: [{
                type: Input,
                args: ['clrDgActionOverflowOpen']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const columnToggleTrackByFn = index => index;

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridColumnToggleButton {
    constructor(commonStrings, columnsService) {
        this.commonStrings = commonStrings;
        this.columnsService = columnsService;
        this.allSelected = new EventEmitter();
    }
    get clrAllSelected() {
        return this.allSelected.asObservable();
    }
    get allHideablesVisible() {
        return this.hideableColumns().filter(column => column.value.hidden).length === 0;
    }
    selectAll() {
        this.hideableColumns().forEach(hideableColumn => this.columnsService.emitStateChange(hideableColumn, {
            hidden: false,
            changes: [DatagridColumnChanges.HIDDEN],
        }));
        this.allSelected.next(true);
    }
    hideableColumns() {
        return this.columnsService.columns.filter(column => column.value.hideable);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnToggleButton, deps: [{ token: i2.ClrCommonStringsService }, { token: ColumnsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridColumnToggleButton, isStandalone: false, selector: "clr-dg-column-toggle-button", outputs: { clrAllSelected: "clrAllSelected" }, ngImport: i0, template: `
    <button
      class="btn btn-sm btn-link switch-button"
      (click)="selectAll()"
      [disabled]="allHideablesVisible"
      type="button"
    >
      {{ commonStrings.keys.selectAll }}
    </button>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnToggleButton, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-toggle-button',
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
                }]
        }], ctorParameters: () => [{ type: i2.ClrCommonStringsService }, { type: ColumnsService }], propDecorators: { clrAllSelected: [{
                type: Output,
                args: ['clrAllSelected']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridColumnToggle {
    constructor(commonStrings, columnsService, popoverService) {
        this.commonStrings = commonStrings;
        this.columnsService = columnsService;
        this.popoverId = uniqueIdFactory();
        this.openState = false;
        // Smart Popover
        this.popoverPosition = ClrPopoverPosition.TOP_LEFT;
        this.popoverType = ClrPopoverType.DROPDOWN;
        // Without tracking the checkboxes get rerendered on model update, which leads
        // to loss of focus after checkbox toggle.
        this.trackByFn = columnToggleTrackByFn;
        this.subscription = popoverService.openChange.subscribe(change => (this.openState = change));
    }
    get allColumnsVisible() {
        return this._allColumnsVisible;
    }
    set allColumnsVisible(value) {
        this._allColumnsVisible = value;
    }
    get hideableColumnStates() {
        const hideables = this.columnsService.columns.filter(column => column.value.hideable);
        return hideables.map(column => column.value);
    }
    get hasOnlyOneVisibleColumn() {
        const nbNonHideableColumns = this.columnsService.columns.length - this.hideableColumnStates.length;
        // this should only return true when there is no non-hideable columns.
        return (nbNonHideableColumns === 0 && this.hideableColumnStates.filter(columnState => !columnState.hidden).length === 1);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    toggleColumnState(columnState, event) {
        const columnToToggle = this.columnsService.columns.filter(column => column.value === columnState)[0];
        this.columnsService.emitStateChange(columnToToggle, {
            hidden: event,
            changes: [DatagridColumnChanges.HIDDEN],
        });
    }
    toggleSwitchPanel() {
        this.openState = !this.openState;
    }
    allColumnsSelected() {
        this.allSelectedElement.nativeElement.focus();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnToggle, deps: [{ token: i2.ClrCommonStringsService }, { token: ColumnsService }, { token: i3.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridColumnToggle, isStandalone: false, selector: "clr-dg-column-toggle", host: { properties: { "class.column-switch-wrapper": "true", "class.active": "openState" } }, viewQueries: [{ propertyName: "allSelectedElement", first: true, predicate: ["allSelected"], descendants: true, read: ElementRef }], hostDirectives: [{ directive: i3.ClrPopoverHostDirective }], ngImport: i0, template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle-action"
      clrPopoverAnchor
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }, { kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i7.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i7.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "directive", type: i13.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.ClrPopoverAnchor, selector: "[clrPopoverAnchor]" }, { kind: "directive", type: i3.ÇlrClrPopoverCloseButton, selector: "[clrPopoverCloseButton]", outputs: ["clrPopoverOnCloseChange"] }, { kind: "directive", type: i3.ÇlrClrPopoverOpenCloseButton, selector: "[clrPopoverOpenCloseButton]", outputs: ["clrPopoverOpenCloseChange"] }, { kind: "directive", type: i3.ClrPopoverContent, selector: "[clrPopoverContent]", inputs: ["clrPopoverContent", "clrPopoverContentAt", "clrPopoverContentAvailablePositions", "clrPopoverContentType", "clrPopoverContentOutsideClickToClose", "clrPopoverContentScrollToClose"] }, { kind: "component", type: ClrDatagridColumnToggleButton, selector: "clr-dg-column-toggle-button", outputs: ["clrAllSelected"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridColumnToggle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column-toggle',
                    template: `
    <button
      role="button"
      type="button"
      class="btn btn-sm column-toggle-action"
      clrPopoverAnchor
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
                    host: { '[class.column-switch-wrapper]': 'true', '[class.active]': 'openState' },
                    hostDirectives: [ClrPopoverHostDirective],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i2.ClrCommonStringsService }, { type: ColumnsService }, { type: i3.ClrPopoverService }], propDecorators: { allSelectedElement: [{
                type: ViewChild,
                args: ['allSelected', { read: ElementRef }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridDetailHeader {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetailHeader, deps: [{ token: DetailService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridDetailHeader, isStandalone: false, selector: "clr-dg-detail-header", host: { properties: { "class.datagrid-detail-header": "true" } }, viewQueries: [{ propertyName: "title", first: true, predicate: ["title"], descendants: true }], ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetailHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-detail-header',
                    host: {
                        '[class.datagrid-detail-header]': 'true',
                    },
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
                }]
        }], ctorParameters: () => [{ type: DetailService }, { type: i2.ClrCommonStringsService }], propDecorators: { title: [{
                type: ViewChild,
                args: ['title']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridDetail {
    constructor(detailService, commonStrings) {
        this.detailService = detailService;
        this.commonStrings = commonStrings;
    }
    get labelledBy() {
        if (this.ariaLabelledBy) {
            return this.header ? `${this.header.titleId} ${this.ariaLabelledBy}` : this.ariaLabelledBy;
        }
        else if (this.ariaLabel) {
            // If aria-label is set by the end user, do not set aria-labelledby
            return null;
        }
        else {
            return this.header?.titleId || '';
        }
    }
    get label() {
        if (!this.ariaLabelledBy) {
            return this.ariaLabel || null;
        }
        else {
            return null;
        }
    }
    close() {
        this.detailService.close();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetail, deps: [{ token: DetailService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridDetail, isStandalone: false, selector: "clr-dg-detail", inputs: { ariaLabelledBy: ["clrDetailAriaLabelledBy", "ariaLabelledBy"], ariaLabel: ["clrDetailAriaLabel", "ariaLabel"] }, host: { properties: { "class.datagrid-detail-pane": "true" } }, queries: [{ propertyName: "header", first: true, predicate: ClrDatagridDetailHeader, descendants: true }], ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.CdkTrapFocusModule_CdkTrapFocus, selector: "[cdkTrapFocus]" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetail, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-detail',
                    host: {
                        '[class.datagrid-detail-pane]': 'true',
                    },
                    // We put the *ngIf on the cdkTrapFocus so it doesn't always exist on the page
                    // have to test for presence of header for aria-describedby because it was causing unit tests to crash
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
                }]
        }], ctorParameters: () => [{ type: DetailService }, { type: i2.ClrCommonStringsService }], propDecorators: { ariaLabelledBy: [{
                type: Input,
                args: ['clrDetailAriaLabelledBy']
            }], ariaLabel: [{
                type: Input,
                args: ['clrDetailAriaLabel']
            }], header: [{
                type: ContentChild,
                args: [ClrDatagridDetailHeader]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridDetailBody {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetailBody, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridDetailBody, isStandalone: false, selector: "clr-dg-detail-body", host: { properties: { "class.datagrid-detail-body": "true" } }, ngImport: i0, template: `
    <div class="clr-dg-detail-body-wrapper">
      <ng-content></ng-content>
    </div>
  `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridDetailBody, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-detail-body',
                    template: `
    <div class="clr-dg-detail-body-wrapper">
      <ng-content></ng-content>
    </div>
  `,
                    host: {
                        '[class.datagrid-detail-body]': 'true',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const COLUMN_STATE = new InjectionToken('COLUMN_STATE');
function columnStateFactory() {
    return new BehaviorSubject({
        changes: [],
    });
}
const COLUMN_STATE_PROVIDER = {
    provide: COLUMN_STATE,
    useFactory: columnStateFactory,
};

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 *
 * @description
 * A structural directive meant to be used inside a clr-dg-column component.
 *
 * <clr-dg-column>
 *       <ng-container *clrDgHideableColumn="{ hidden: true }">
 *           User ID
 *       </ng-container>
 *   </clr-dg-column>
 *
 * It sets up state and properties so that columns can be manges for hide/show by a service and an internal
 * datagrid toggle component.
 *
 */
class ClrDatagridHideableColumn {
    constructor(titleTemplateRef, viewContainerRef, columnsService, columnState) {
        this.titleTemplateRef = titleTemplateRef;
        this.columnsService = columnsService;
        this.columnState = columnState;
        this.hiddenChange = new EventEmitter();
        this.subscriptions = [];
        viewContainerRef.createEmbeddedView(titleTemplateRef);
        if (!columnState) {
            throw new Error('The *clrDgHideableColumn directive can only be used inside of a clr-dg-column component.');
        }
    }
    /**
     *
     * @description
     * Setter fn for the @Input with the same name as this structural directive.
     * It allows the user to pre-configure the column's hide/show state. { hidden: true }
     * It's more verbose but has more Clarity.
     *
     * @example
     * *clrDgHideableColumn
     * *clrDgHideableColumn={hidden: false}
     * *clrDgHideableColumn={hidden: true}
     *
     */
    set clrDgHideableColumn(value) {
        if (typeof value === 'string') {
            this.clrDgHidden = false;
            return;
        }
        this.clrDgHidden = value && value.hidden ? value.hidden : false;
    }
    set clrDgHidden(hidden) {
        this._hidden = hidden ? hidden : false;
        this.columnsService.emitStateChange(this.columnState, {
            hidden: this._hidden,
            changes: [DatagridColumnChanges.HIDDEN],
        });
    }
    ngOnInit() {
        this.columnsService.emitStateChange(this.columnState, {
            hideable: true,
            titleTemplateRef: this.titleTemplateRef,
            hidden: this._hidden,
            changes: [DatagridColumnChanges.HIDDEN],
        });
        this.subscriptions.push(this.columnState.subscribe((state) => {
            if (state.changes && state.changes.indexOf(DatagridColumnChanges.HIDDEN) > -1) {
                this.hiddenChange.emit(state.hidden); // Can emit through @Output when desugared syntax is used
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridHideableColumn, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: ColumnsService }, { token: COLUMN_STATE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrDatagridHideableColumn, isStandalone: false, selector: "[clrDgHideableColumn]", inputs: { clrDgHideableColumn: "clrDgHideableColumn", clrDgHidden: "clrDgHidden" }, outputs: { hiddenChange: "clrDgHiddenChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridHideableColumn, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrDgHideableColumn]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: ColumnsService }, { type: i2$2.BehaviorSubject, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [COLUMN_STATE]
                }] }], propDecorators: { hiddenChange: [{
                type: Output,
                args: ['clrDgHiddenChange']
            }], clrDgHideableColumn: [{
                type: Input,
                args: ['clrDgHideableColumn']
            }], clrDgHidden: [{
                type: Input,
                args: ['clrDgHidden']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrIfDetail {
    constructor(templateRef, viewContainer, detailService) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
        this.detailService = detailService;
        this.stateChange = new EventEmitter(null);
        this.subscriptions = [];
        this.skip = false; // This keeps us from resetting the input and calling the toggle twice
        detailService.enabled = true;
    }
    set state(model) {
        if (!this.skip) {
            this.detailService.toggle(model);
        }
        this.skip = false;
    }
    get viewContext() {
        return { $implicit: this.detailService.state };
    }
    ngOnInit() {
        this.subscriptions.push(this.detailService.stateChange.subscribe(state => {
            if (state === true) {
                this.togglePanel(true);
            }
            else {
                this.togglePanel(false);
            }
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    togglePanel(showPanel) {
        let stateChangeParams = null;
        if (showPanel === true) {
            if (!this.embeddedViewRef) {
                // Create a context forward `Proxy` that will always bind to the user-specified context,
                // without having to re-assign it whenever changes.
                const viewContext = this._createContextForwardProxy();
                this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, viewContext);
            }
            this.skip = true;
            stateChangeParams = this.detailService.state;
        }
        else {
            this.viewContainer.clear();
            this.embeddedViewRef = null;
        }
        this.stateChange.emit(stateChangeParams);
    }
    /**
     * For a given outlet instance, we create a proxy object that delegates
     * to the user-specified context. This allows changing, or swapping out
     * the context object completely without having to destroy/re-create the view.
     */
    _createContextForwardProxy() {
        return new Proxy({}, {
            set: (_target, prop, newValue) => {
                if (!this.viewContext) {
                    return false;
                }
                return Reflect.set(this.viewContext, prop, newValue);
            },
            get: (_target, prop, receiver) => {
                if (!this.viewContext) {
                    return undefined;
                }
                return Reflect.get(this.viewContext, prop, receiver);
            },
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfDetail, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: DetailService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrIfDetail, isStandalone: false, selector: "[clrIfDetail]", inputs: { state: ["clrIfDetail", "state"] }, outputs: { stateChange: "clrIfDetailChange" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrIfDetail, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfDetail]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: DetailService }], propDecorators: { stateChange: [{
                type: Output,
                args: ['clrIfDetailChange']
            }], state: [{
                type: Input,
                args: ['clrIfDetail']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Generic bland container serving various purposes for Datagrid.
 * For instance, it can help span a text over multiple rows in detail view.
 */
class ClrDatagridRowDetail {
    constructor(selection, rowActionService, expand, expandableRows, commonStrings) {
        this.selection = selection;
        this.rowActionService = rowActionService;
        this.expand = expand;
        this.expandableRows = expandableRows;
        this.commonStrings = commonStrings;
        this.replacedRow = false;
        /* reference to the enum so that template can access it */
        this.SELECTION_TYPE = SelectionType;
        this.subscriptions = [];
    }
    set replace(value) {
        this.expand.setReplace(!!value);
    }
    get beginningOfExpandableContentAriaText() {
        return (this._beginningOfExpandableContentAriaText ||
            `${this.commonStrings.keys.datagridExpandableBeginningOf} ${this.commonStrings.keys.datagridExpandableRowContent}`);
    }
    get endOfExpandableContentAriaText() {
        return (this._endOfExpandableContentAriaText ||
            `${this.commonStrings.keys.datagridExpandableEndOf} ${this.commonStrings.keys.datagridExpandableRowContent}`);
    }
    ngAfterContentInit() {
        this.subscriptions.push(this.expand.replace.subscribe(replaceChange => {
            this.replacedRow = replaceChange;
        }));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridRowDetail, deps: [{ token: Selection }, { token: RowActionService }, { token: DatagridIfExpandService }, { token: ExpandableRowsCount }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridRowDetail, isStandalone: false, selector: "clr-dg-row-detail", inputs: { _beginningOfExpandableContentAriaText: ["clrRowDetailBeginningAriaText", "_beginningOfExpandableContentAriaText"], _endOfExpandableContentAriaText: ["clrRowDetailEndAriaText", "_endOfExpandableContentAriaText"], replace: ["clrDgReplace", "replace"] }, host: { attributes: { "role": "row" }, properties: { "class.datagrid-row-flex": "true", "class.datagrid-row-detail": "true", "attr.id": "expand.expandableId" } }, queries: [{ propertyName: "cells", predicate: ClrDatagridCell }], ngImport: i0, template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i9.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: ClrDatagridCell, selector: "clr-dg-cell" }, { kind: "directive", type: DatagridCellRenderer, selector: "clr-dg-cell" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridRowDetail, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-row-detail',
                    template: `
    <div class="clr-sr-only">
      {{ beginningOfExpandableContentAriaText }}
      {{ commonStrings.keys.datagridExpandableRowsHelperText }}
    </div>
    @if (this.cells?.length > 0) {
      <ng-container [ngTemplateOutlet]="noCells"></ng-container>
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
                        '[class.datagrid-row-flex]': 'true',
                        '[class.datagrid-row-detail]': 'true',
                        '[attr.id]': 'expand.expandableId',
                        role: 'row',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: Selection }, { type: RowActionService }, { type: DatagridIfExpandService }, { type: ExpandableRowsCount }, { type: i2.ClrCommonStringsService }], propDecorators: { _beginningOfExpandableContentAriaText: [{
                type: Input,
                args: ['clrRowDetailBeginningAriaText']
            }], _endOfExpandableContentAriaText: [{
                type: Input,
                args: ['clrRowDetailEndAriaText']
            }], cells: [{
                type: ContentChildren,
                args: [ClrDatagridCell]
            }], replace: [{
                type: Input,
                args: ['clrDgReplace']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridFooter {
    constructor(selection, detailService, columnsService, commonStrings) {
        this.selection = selection;
        this.detailService = detailService;
        this.columnsService = columnsService;
        this.commonStrings = commonStrings;
        /* reference to the enum so that template can access */
        this.SELECTION_TYPE = SelectionType;
    }
    get hasHideableColumns() {
        return this.columnsService.hasHideableColumns;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridFooter, deps: [{ token: Selection }, { token: DetailService }, { token: ColumnsService }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridFooter, isStandalone: false, selector: "clr-dg-footer", host: { properties: { "class.datagrid-footer": "true" } }, ngImport: i0, template: `
    @if (selection.selectionType === SELECTION_TYPE.Multi && selection.current.length > 0) {
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i7.ClrCheckbox, selector: "[clrCheckbox],[clrToggle]" }, { kind: "component", type: i7.ClrCheckboxWrapper, selector: "clr-checkbox-wrapper,clr-toggle-wrapper" }, { kind: "component", type: ClrDatagridColumnToggle, selector: "clr-dg-column-toggle" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridFooter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-footer',
                    template: `
    @if (selection.selectionType === SELECTION_TYPE.Multi && selection.current.length > 0) {
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
                    host: {
                        '[class.datagrid-footer]': 'true',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: Selection }, { type: DetailService }, { type: ColumnsService }, { type: i2.ClrCommonStringsService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridPageSize {
    constructor(page) {
        this.page = page;
        this.pageSizeOptionsId = uniqueIdFactory();
    }
    set label(label) {
        if (label) {
            label.disableGrid();
        }
    }
    ngOnInit() {
        if (!this.pageSizeOptions || this.pageSizeOptions.length === 0) {
            this.pageSizeOptions = [this.page.size];
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPageSize, deps: [{ token: Page }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridPageSize, isStandalone: false, selector: "clr-dg-page-size", inputs: { pageSizeOptions: ["clrPageSizeOptions", "pageSizeOptions"], pageSizeOptionsId: ["clrPageSizeOptionsId", "pageSizeOptionsId"] }, viewQueries: [{ propertyName: "label", first: true, predicate: ClrControlLabel, descendants: true, static: true }], ngImport: i0, template: `
    <label [for]="pageSizeOptionsId"><ng-content></ng-content></label>
    <div class="clr-select-wrapper">
      <select [id]="pageSizeOptionsId" [class.clr-page-size-select]="true" [(ngModel)]="page.size">
        @for (option of pageSizeOptions; track option) {
          <option [ngValue]="option">{{ option }}</option>
        }
      </select>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.ClrControlLabel, selector: "label", inputs: ["id", "for"] }, { kind: "directive", type: i13.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i13.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i13.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i13.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i13.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPageSize, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-page-size',
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
                }]
        }], ctorParameters: () => [{ type: Page }], propDecorators: { pageSizeOptions: [{
                type: Input,
                args: ['clrPageSizeOptions']
            }], pageSizeOptionsId: [{
                type: Input,
                args: ['clrPageSizeOptionsId']
            }], label: [{
                type: ViewChild,
                args: [ClrControlLabel, { static: true }]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrDatagridPagination {
    constructor(page, commonStrings, detailService) {
        this.page = page;
        this.commonStrings = commonStrings;
        this.detailService = detailService;
        this.currentChanged = new EventEmitter(false);
        page.activated = true;
    }
    /**
     * Page size
     */
    get pageSize() {
        return this.page.size;
    }
    set pageSize(size) {
        // todo(v16): Remove this check. The property type used to be `string | number`. I kept this check to maintain the no-op if you pass a string.
        if (typeof size === 'number') {
            this.page.size = size;
        }
    }
    /**
     * Total items (needed to guess the last page)
     */
    get totalItems() {
        return this.page.totalItems;
    }
    set totalItems(total) {
        // todo(v16): Remove this check. The property type used to be `string | number`. I kept this check to maintain the no-op if you pass a string.
        if (typeof total === 'number') {
            this.page.totalItems = total;
        }
    }
    /**
     * Last page
     */
    get lastPage() {
        return this.page.last;
    }
    set lastPage(last) {
        // todo(v16): Remove this check. The property type used to be `string | number`. I kept this check to maintain the no-op if you pass a string.
        if (typeof last === 'number') {
            this.page.last = last;
        }
    }
    /**
     * Current page
     */
    get currentPage() {
        return this.page.current;
    }
    set currentPage(page) {
        // todo(v16): Remove this check. The property type used to be `string | number`. I kept this check to maintain the no-op if you pass a string.
        if (typeof page === 'number') {
            this.page.current = page;
        }
    }
    /**
     * Index of the first item displayed on the current page, starting at 0, -1 if none displayed
     */
    get firstItem() {
        return this.page.firstItem;
    }
    /**
     * Index of the last item displayed on the current page, starting at 0, -1 if none displayed
     */
    get lastItem() {
        return this.page.lastItem;
    }
    /**
     * Conditionally adds page numbers before and after the current page
     */
    get middlePages() {
        const middlePages = [];
        if (this.page.current > 1) {
            middlePages.push(this.page.current - 1);
        }
        middlePages.push(this.page.current);
        if (this.page.current < this.page.last) {
            middlePages.push(this.page.current + 1);
        }
        return middlePages;
    }
    /**********
     * Subscription to the Page service for page changes.
     * Note: this only emits after the datagrid is initialized/stabalized and the page changes.
     */
    ngOnInit() {
        /*
         * Default page size is 10.
         * The reason we set it here and not in the provider itself is because
         * we don't want pagination if this component isn't present in the datagrid.
         */
        if (!this.page.size) {
            this.page.size = 10;
        }
        this._pageSubscription = this.page.change.subscribe(current => this.currentChanged.emit(current));
    }
    ngOnDestroy() {
        this.page.resetPageSize(true);
        if (this._pageSubscription) {
            this._pageSubscription.unsubscribe();
        }
    }
    /**
     * Moves to the previous page if it exists
     */
    previous() {
        this.page.previous();
    }
    /**
     * Moves to the next page if it exists
     */
    next() {
        this.page.next();
    }
    verifyCurrentPage(event) {
        const parsed = parseInt(event.target.value, 10);
        if (parsed !== this.page.current) {
            event.target.value = this.page.current;
        }
    }
    /**
     * We only update the pagination's current page on enter.
     */
    updateCurrentPage(event) {
        const parsed = parseInt(event.target.value, 10);
        // if the input value, is not a number, we don't update the page
        if (!isNaN(parsed)) {
            if (parsed < 1) {
                this.page.current = 1;
            }
            else if (parsed > this.page.last) {
                this.page.current = this.page.last;
            }
            else {
                this.page.current = parsed;
            }
        }
        /**
         * Set the input's value to the new current page. This is needed because the code
         * above may have changed the value from what the user entered in.
         */
        this.currentPageInputRef.nativeElement.value = this.page.current.toString();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPagination, deps: [{ token: Page }, { token: i2.ClrCommonStringsService }, { token: DetailService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrDatagridPagination, isStandalone: false, selector: "clr-dg-pagination", inputs: { disableCurrentPageInput: ["clrDgPageInputDisabled", "disableCurrentPageInput"], pageSize: ["clrDgPageSize", "pageSize"], totalItems: ["clrDgTotalItems", "totalItems"], lastPage: ["clrDgLastPage", "lastPage"], currentPage: ["clrDgPage", "currentPage"] }, outputs: { currentChanged: "clrDgPageChange" }, host: { properties: { "class.pagination": "true" } }, queries: [{ propertyName: "_pageSizeComponent", first: true, predicate: ClrDatagridPageSize, descendants: true }], viewQueries: [{ propertyName: "currentPageInputRef", first: true, predicate: ["currentPageInput"], descendants: true }], ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "component", type: i5.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridPagination, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-pagination',
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
                    host: { '[class.pagination]': 'true' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: Page }, { type: i2.ClrCommonStringsService }, { type: DetailService }], propDecorators: { disableCurrentPageInput: [{
                type: Input,
                args: ['clrDgPageInputDisabled']
            }], currentChanged: [{
                type: Output,
                args: ['clrDgPageChange']
            }], _pageSizeComponent: [{
                type: ContentChild,
                args: [ClrDatagridPageSize]
            }], currentPageInputRef: [{
                type: ViewChild,
                args: ['currentPageInput']
            }], pageSize: [{
                type: Input,
                args: ['clrDgPageSize']
            }], totalItems: [{
                type: Input,
                args: ['clrDgTotalItems']
            }], lastPage: [{
                type: Input,
                args: ['clrDgLastPage']
            }], currentPage: [{
                type: Input,
                args: ['clrDgPage']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * I don't think this deserves to be in IfExpanded itself,
 * so I'm adding a second directive on the same selector for now just for the datagrid
 */
class DatagridDetailRegisterer {
    constructor(expandableRowsCount) {
        this.expandableRowsCount = expandableRowsCount;
        if (expandableRowsCount) {
            expandableRowsCount.register();
        }
    }
    ngOnDestroy() {
        if (this.expandableRowsCount) {
            this.expandableRowsCount.unregister();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridDetailRegisterer, deps: [{ token: ExpandableRowsCount, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridDetailRegisterer, isStandalone: false, selector: "[clrIfExpanded]", ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridDetailRegisterer, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrIfExpanded]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ExpandableRowsCount, decorators: [{
                    type: Optional
                }] }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridHeaderRenderer {
    constructor(el, renderer, organizer, domAdapter, columnResizerService, columnsService, columnState) {
        this.el = el;
        this.renderer = renderer;
        this.domAdapter = domAdapter;
        this.columnResizerService = columnResizerService;
        this.columnsService = columnsService;
        this.columnState = columnState;
        this.resizeEmitter = new EventEmitter();
        /**
         * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
         */
        this.widthSet = false;
        this.autoSet = false;
        this.subscriptions = [];
        this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth()));
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    getColumnWidthState() {
        const strictWidth = this.detectStrictWidth();
        return {
            width: this.computeWidth(strictWidth),
            strictWidth: strictWidth,
        };
    }
    setColumnState(index) {
        this.columnsService.columns[index] = this.columnState;
    }
    setWidth(state) {
        if (state.strictWidth) {
            if (this.columnResizerService.resizedBy) {
                this.resizeEmitter.emit(state.width);
                this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
                this.widthSet = false;
            }
            // Don't set width if there is a user-defined one. Just add the strict width class.
            this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
            this.autoSet = false;
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
            this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
            this.widthSet = true;
            this.autoSet = true;
        }
    }
    setHidden(state) {
        if (state.hidden) {
            this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
        else {
            this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
        }
    }
    clearWidth() {
        // remove the width only if we set it, and it is not changed by dragging.
        if (this.widthSet && !this.columnResizerService.resizedBy) {
            this.renderer.setStyle(this.el.nativeElement, 'width', null);
        }
        if (this.autoSet) {
            this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
        }
    }
    detectStrictWidth() {
        if (this.columnResizerService.resizedBy) {
            return this.columnResizerService.widthAfterResize;
        }
        else if (this.autoSet) {
            return 0;
        }
        else {
            return this.domAdapter.userDefinedWidth(this.el.nativeElement);
        }
    }
    computeWidth(strictWidth) {
        let width = strictWidth;
        if (!width) {
            width = this.domAdapter.scrollWidth(this.el.nativeElement);
        }
        return width;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridHeaderRenderer, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: DatagridRenderOrganizer }, { token: i2.DomAdapter }, { token: ColumnResizerService }, { token: ColumnsService }, { token: COLUMN_STATE }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridHeaderRenderer, isStandalone: false, selector: "clr-dg-column", outputs: { resizeEmitter: "clrDgColumnResize" }, providers: [ColumnResizerService, COLUMN_STATE_PROVIDER], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridHeaderRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-column',
                    providers: [ColumnResizerService, COLUMN_STATE_PROVIDER],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: DatagridRenderOrganizer }, { type: i2.DomAdapter }, { type: ColumnResizerService }, { type: ColumnsService }, { type: i2$2.BehaviorSubject, decorators: [{
                    type: Inject,
                    args: [COLUMN_STATE]
                }] }], propDecorators: { resizeEmitter: [{
                type: Output,
                args: ['clrDgColumnResize']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/*
 * This version of the DomAdapter is for use on non-browser platforms, where there are no
 * nativeElements to use for calculations.
 */
class NoopDomAdapter {
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
            height: 0,
        };
    }
    minWidth(_element) {
        return 0;
    }
    focus(_element) {
        // Do nothing
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NoopDomAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NoopDomAdapter }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: NoopDomAdapter, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
const domAdapterFactory = (platformId) => {
    if (isPlatformBrowser(platformId)) {
        return new DomAdapter();
    }
    else {
        return new NoopDomAdapter();
    }
};
// Fixes build error
// @dynamic (https://github.com/angular/angular/issues/19698#issuecomment-338340211)
class DatagridMainRenderer {
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
        /**
         * Indicates if we want to re-compute columns width. This should only happen:
         * 1) When headers change, with columns being added or removed
         * 2) When rows are lazily loaded for the first time
         */
        this.columnsSizesStable = false;
        this.subscriptions.push(organizer.filterRenderSteps(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS).subscribe(() => this.computeHeadersWidth()));
        this.subscriptions.push(page.sizeChange.subscribe(() => {
            if (this._heightSet) {
                this.resetDatagridHeight();
            }
        }));
        this.subscriptions.push(detailService.stateChange.subscribe(state => this.toggleDetailPane(state)));
        this.subscriptions.push(items.change.subscribe(() => (this.shouldStabilizeColumns = true)));
    }
    ngOnInit() {
        this.columnsService.columnsStateChange.subscribe(change => this.columnStateChanged(change));
        // Datagrid used in other components like Accordion, Tabs or wrapped in onPush component which have their content
        // hidden by default gets initialised without being visible and breakes rendering cycle.
        // Should run only the first time if the datagrid is not visible on first initialization.
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
            // TODO: only re-stabilize if a column was added or removed. Reordering is fine.
            // Need to setup columns before stabalizing them
            this.setupColumns();
            this.columnsSizesStable = false;
            this.stabilizeColumns();
        }));
    }
    // Initialize and set Table width for horizontal scrolling here.
    ngAfterViewInit() {
        this.tableSizeService.table = this.el;
    }
    ngAfterViewChecked() {
        if (this.shouldStabilizeColumns) {
            this.stabilizeColumns();
        }
        if (this.shouldComputeHeight()) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.computeDatagridHeight();
                });
            });
        }
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.intersectionObserver?.disconnect();
    }
    toggleDetailPane(state) {
        if (this.headers) {
            if (state && !this.columnsService.hasCache()) {
                this.columnsService.cache();
                this.columnsService.visibleColumns.forEach((header, index) => {
                    if (index > 0) {
                        this.columnsService.emitStateChangeAt(header.columnIndex, {
                            changes: [DatagridColumnChanges.HIDDEN],
                            hidden: state,
                        });
                    }
                });
            }
            else if (!state) {
                this.columnsService.resetToLastCache();
            }
        }
    }
    setupColumns() {
        this.headers.forEach((header, index) => header.setColumnState(index));
        this.columnsService.columns.splice(this.headers.length); // Trim any old columns
        // Sets columnIndex for each column
        this.columnsService.columns.forEach((column, index) => {
            this.columnsService.emitStateChange(column, { changes: [DatagridColumnChanges.INITIALIZE], columnIndex: index });
        });
    }
    shouldComputeHeight() {
        if (!this._heightSet && this.page.size > 0) {
            if (this.items.displayed.length === this.page.size) {
                return true;
            }
        }
        return false;
    }
    /**
     * Computes the height of the datagrid.
     *
     * NOTE: We had to choose to set the height instead of the min-height because
     * IE 11 requires the height on the parent for the children flex grow/shrink properties to work.
     * When we used min-height, 1 1 auto doesn't used to work in IE11 :-(
     * But this doesn't affect the fix. It works in both fixed & variable height datagrids.
     *
     * Refer: http://stackoverflow.com/questions/24396205/flex-grow-not-working-in-internet-explorer-11-0
     */
    computeDatagridHeight() {
        const height = window.getComputedStyle(this.el.nativeElement).height;
        this.renderer.setStyle(this.el.nativeElement, 'height', height);
        this._heightSet = true;
    }
    resetDatagridHeight() {
        this.renderer.setStyle(this.el.nativeElement, 'height', '');
        this._heightSet = false;
    }
    /**
     * Makes each header compute its width.
     */
    computeHeadersWidth() {
        const nbColumns = this.headers.length;
        const headerWidths = this.headers.map(header => {
            return header.getColumnWidthState();
        });
        let allStrict = true;
        this.headers.forEach((header, index) => {
            // On the last header column check whether all columns have strict widths.
            // If all columns have strict widths, remove the strict width from the last column and make it the column's
            // minimum width so that when all previous columns shrink, it will get a flexible width and cover the empty
            // gap in the Datagrid.
            const state = {
                changes: [DatagridColumnChanges.WIDTH],
                ...headerWidths[index],
            };
            if (!state.strictWidth) {
                allStrict = false;
            }
            if (nbColumns === index + 1 && allStrict) {
                state.strictWidth = 0;
            }
            this.columnsService.emitStateChangeAt(index, state);
        });
    }
    columnStateChanged(state) {
        // eslint-disable-next-line eqeqeq
        if (!this.headers || state.columnIndex == null) {
            return;
        }
        const columnIndex = state.columnIndex;
        if (state.changes && state.changes.length) {
            state.changes.forEach(change => {
                switch (change) {
                    case DatagridColumnChanges.WIDTH:
                        this.headers.get(columnIndex).setWidth(state);
                        this.rows.forEach(row => {
                            if (row?.cells.length === this.columnsService.columns.length) {
                                row.cells.get(columnIndex).setWidth(state);
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.cells.get(columnIndex)?.setWidth(state);
                                });
                            }
                        });
                        break;
                    case DatagridColumnChanges.HIDDEN:
                        this.headers.get(columnIndex).setHidden(state);
                        this.rows.forEach(row => {
                            if (row.cells && row.cells.length) {
                                row.cells.get(columnIndex).setHidden(state);
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.cells.get(columnIndex)?.setHidden(state);
                                });
                            }
                        });
                        this.updateColumnSeparatorsVisibility();
                        this.keyNavigation.resetKeyGrid();
                        break;
                    case DatagridColumnChanges.INITIALIZE:
                        if (state.hideable && state.hidden) {
                            this.headers.get(columnIndex).setHidden(state);
                            this.rows.forEach(row => {
                                row.setCellsState();
                                row.expandableRows.forEach(expandableRow => {
                                    expandableRow.setCellsState();
                                });
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    }
    /**
     * Triggers a whole re-rendring cycle to set column sizes, if needed.
     */
    stabilizeColumns() {
        if (this.columnsSizesStable) {
            // Nothing to do.
            return;
        }
        // Resize when the rows are loaded.
        if (this.items.displayed.length > 0) {
            this.organizer.resize();
            this.columnsSizesStable = true;
        }
    }
    updateColumnSeparatorsVisibility() {
        const visibleColumns = this.datagrid.columns.filter(column => !column.isHidden);
        visibleColumns.forEach((column, index) => {
            if (index === visibleColumns.length - 1) {
                column.showSeparator = false;
            }
            else if (!column.showSeparator) {
                column.showSeparator = true;
            }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridMainRenderer, deps: [{ token: ClrDatagrid }, { token: DatagridRenderOrganizer }, { token: Items }, { token: Page }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: DetailService }, { token: TableSizeService }, { token: ColumnsService }, { token: i0.NgZone }, { token: KeyNavigationGridController }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridMainRenderer, isStandalone: false, selector: "clr-datagrid", providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }], queries: [{ propertyName: "headers", predicate: DatagridHeaderRenderer }, { propertyName: "rows", predicate: DatagridRowRenderer }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridMainRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-datagrid',
                    providers: [{ provide: DomAdapter, useFactory: domAdapterFactory, deps: [PLATFORM_ID] }],
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrDatagrid }, { type: DatagridRenderOrganizer }, { type: Items }, { type: Page }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: DetailService }, { type: TableSizeService }, { type: ColumnsService }, { type: i0.NgZone }, { type: KeyNavigationGridController }, { type: i0.ChangeDetectorRef }], propDecorators: { headers: [{
                type: ContentChildren,
                args: [DatagridHeaderRenderer]
            }], rows: [{
                type: ContentChildren,
                args: [DatagridRowRenderer]
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class DatagridRowDetailRenderer extends DatagridRowRenderer {
    constructor(parentRow, columnsService) {
        super(columnsService);
        this.parentRow = parentRow;
        parentRow.expandableRows.push(this);
    }
    ngOnDestroy() {
        this.parentRow.expandableRows = [];
        super.ngOnDestroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRowDetailRenderer, deps: [{ token: DatagridRowRenderer }, { token: ColumnsService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: DatagridRowDetailRenderer, isStandalone: false, selector: "clr-dg-row-detail", usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: DatagridRowDetailRenderer, decorators: [{
            type: Directive,
            args: [{
                    selector: 'clr-dg-row-detail',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: DatagridRowRenderer }, { type: ColumnsService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_DATAGRID_DIRECTIVES = [
    // Core
    ClrDatagrid,
    ClrDatagridActionBar,
    ClrDatagridActionOverflow,
    ClrDatagridCell,
    ClrDatagridColumn,
    ClrDatagridColumnSeparator,
    ClrDatagridDetail,
    ClrDatagridDetailBody,
    ClrDatagridDetailHeader,
    ClrDatagridFilter,
    ClrDatagridFooter,
    ClrDatagridHideableColumn,
    ClrDatagridItems,
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
    // Renderers
    DatagridCellRenderer,
    DatagridHeaderRenderer,
    DatagridMainRenderer,
    DatagridRowDetailRenderer,
    DatagridRowRenderer,
    // Chocolate
    ActionableOompaLoompa,
    DatagridWillyWonka,
    ExpandableOompaLoompa,
    // Built-in shortcuts
    DatagridNumericFilter,
    DatagridStringFilter,
];
const CLR_DATAGRID_INTERNAL_DIRECTIVES = [ClrDatagridColumnToggle, ClrDatagridColumnToggleButton];
const CLR_DATAGRID_STANDALONE_DIRECTIVES = [ClrDatagridSingleSelectionValueAccessor];
class ClrDatagridModule {
    constructor() {
        ClarityIcons.addIcons(ellipsisVerticalIcon, viewColumnsIcon, windowCloseIcon, arrowIcon, timesIcon, stepForward2Icon, angleDoubleIcon, filterGridCircleIcon, filterGridIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridModule, declarations: [
            // Core
            ClrDatagrid,
            ClrDatagridActionBar,
            ClrDatagridActionOverflow,
            ClrDatagridCell,
            ClrDatagridColumn,
            ClrDatagridColumnSeparator,
            ClrDatagridDetail,
            ClrDatagridDetailBody,
            ClrDatagridDetailHeader,
            ClrDatagridFilter,
            ClrDatagridFooter,
            ClrDatagridHideableColumn,
            ClrDatagridItems,
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
            // Renderers
            DatagridCellRenderer,
            DatagridHeaderRenderer,
            DatagridMainRenderer,
            DatagridRowDetailRenderer,
            DatagridRowRenderer,
            // Chocolate
            ActionableOompaLoompa,
            DatagridWillyWonka,
            ExpandableOompaLoompa,
            // Built-in shortcuts
            DatagridNumericFilter,
            DatagridStringFilter, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton], imports: [CommonModule,
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
            _lrClrPopoverModuleNext,
            ClrKeyFocusModule, ClrDatagridSingleSelectionValueAccessor], exports: [
            // Core
            ClrDatagrid,
            ClrDatagridActionBar,
            ClrDatagridActionOverflow,
            ClrDatagridCell,
            ClrDatagridColumn,
            ClrDatagridColumnSeparator,
            ClrDatagridDetail,
            ClrDatagridDetailBody,
            ClrDatagridDetailHeader,
            ClrDatagridFilter,
            ClrDatagridFooter,
            ClrDatagridHideableColumn,
            ClrDatagridItems,
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
            // Renderers
            DatagridCellRenderer,
            DatagridHeaderRenderer,
            DatagridMainRenderer,
            DatagridRowDetailRenderer,
            DatagridRowRenderer,
            // Chocolate
            ActionableOompaLoompa,
            DatagridWillyWonka,
            ExpandableOompaLoompa,
            // Built-in shortcuts
            DatagridNumericFilter,
            DatagridStringFilter, ClrDatagridSingleSelectionValueAccessor] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridModule, imports: [CommonModule,
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
            _lrClrPopoverModuleNext,
            ClrKeyFocusModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrDatagridModule, decorators: [{
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
                        _lrClrPopoverModuleNext,
                        ClrKeyFocusModule,
                        CLR_DATAGRID_STANDALONE_DIRECTIVES,
                    ],
                    declarations: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_INTERNAL_DIRECTIVES],
                    exports: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_STANDALONE_DIRECTIVES],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_DATAGRID_DIRECTIVES, ClrDatagrid, ClrDatagridActionBar, ClrDatagridActionOverflow, ClrDatagridCell, ClrDatagridColumn, ClrDatagridColumnSeparator, ClrDatagridColumnToggle, ClrDatagridColumnToggleButton, ClrDatagridDetail, ClrDatagridDetailBody, ClrDatagridDetailHeader, ClrDatagridFilter, ClrDatagridFooter, ClrDatagridHideableColumn, ClrDatagridItems, ClrDatagridModule, ClrDatagridPageSize, ClrDatagridPagination, ClrDatagridPlaceholder, ClrDatagridRow, ClrDatagridRowDetail, ClrDatagridSortOrder, ClrIfDetail, DatagridNumericFilter, DatagridPropertyComparator, DatagridPropertyNumericFilter, DatagridPropertyStringFilter, DatagridStringFilter, Selection, ActionableOompaLoompa as ÇlrActionableOompaLoompa, DatagridCellRenderer as ÇlrDatagridCellRenderer, DatagridDetailRegisterer as ÇlrDatagridDetailRegisterer, DatagridHeaderRenderer as ÇlrDatagridHeaderRenderer, DatagridMainRenderer as ÇlrDatagridMainRenderer, DatagridRowDetailRenderer as ÇlrDatagridRowDetailRenderer, DatagridRowRenderer as ÇlrDatagridRowRenderer, ClrDatagridSelectionCellDirective as ÇlrDatagridSelectionCellDirective, ClrDatagridSingleSelectionValueAccessor as ÇlrDatagridSingleSelectionValueAccessor, ClrDatagridVirtualScrollDirective as ÇlrDatagridVirtualScrollDirective, DatagridWillyWonka as ÇlrDatagridWillyWonka, ExpandableOompaLoompa as ÇlrExpandableOompaLoompa, WrappedCell as ÇlrWrappedCell, WrappedColumn as ÇlrWrappedColumn, WrappedRow as ÇlrWrappedRow };
//# sourceMappingURL=clr-angular-data-datagrid.mjs.map
