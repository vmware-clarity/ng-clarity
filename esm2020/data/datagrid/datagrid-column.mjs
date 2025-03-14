/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, } from '@angular/core';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { DatagridPropertyComparator } from './built-in/comparators/datagrid-property-comparator';
import { DatagridNumericFilterImpl } from './built-in/filters/datagrid-numeric-filter-impl';
import { DatagridPropertyNumericFilter } from './built-in/filters/datagrid-property-numeric-filter';
import { DatagridPropertyStringFilter } from './built-in/filters/datagrid-property-string-filter';
import { DatagridStringFilterImpl } from './built-in/filters/datagrid-string-filter-impl';
import { ClrDatagridSortOrder } from './enums/sort-order.enum';
import { CustomFilter } from './providers/custom-filter';
import { HIDDEN_COLUMN_CLASS } from './render/constants';
import { DatagridFilterRegistrar } from './utils/datagrid-filter-registrar';
import { WrappedColumn } from './wrapped-column';
import * as i0 from "@angular/core";
import * as i1 from "./providers/sort";
import * as i2 from "./providers/filters";
import * as i3 from "./providers/detail.service";
import * as i4 from "../../utils/popover/popover-host.directive";
import * as i5 from "@angular/common";
import * as i6 from "../../icon/icon";
import * as i7 from "./datagrid-column-separator";
import * as i8 from "./built-in/filters/datagrid-numeric-filter";
import * as i9 from "./built-in/filters/datagrid-string-filter";
export class ClrDatagridColumn extends DatagridFilterRegistrar {
    constructor(el, _sort, filters, vcr, detailService, changeDetectorRef) {
        super(filters);
        this.el = el;
        this._sort = _sort;
        this.vcr = vcr;
        this.detailService = detailService;
        this.changeDetectorRef = changeDetectorRef;
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
        else {
            if (comparator) {
                this._sortBy = comparator;
            }
            else {
                if (this.field) {
                    this._sortBy = new DatagridPropertyComparator(this.field);
                }
                else {
                    delete this._sortBy;
                }
            }
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
            // the Unsorted case happens when the current state is neither Asc or Desc
            case ClrDatagridSortOrder.UNSORTED:
            default:
                this._sort.clear();
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
}
ClrDatagridColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumn, deps: [{ token: i0.ElementRef }, { token: i1.Sort }, { token: i2.FiltersProvider }, { token: i0.ViewContainerRef }, { token: i3.DetailService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridColumn.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridColumn, selector: "clr-dg-column", inputs: { filterStringPlaceholder: ["clrFilterStringPlaceholder", "filterStringPlaceholder"], filterNumberMaxPlaceholder: ["clrFilterNumberMaxPlaceholder", "filterNumberMaxPlaceholder"], filterNumberMinPlaceholder: ["clrFilterNumberMinPlaceholder", "filterNumberMinPlaceholder"], colType: ["clrDgColType", "colType"], field: ["clrDgField", "field"], sortBy: ["clrDgSortBy", "sortBy"], sortOrder: ["clrDgSortOrder", "sortOrder"], updateFilterValue: ["clrFilterValue", "updateFilterValue"] }, outputs: { sortOrderChange: "clrDgSortOrderChange", filterValueChange: "clrFilterValueChange" }, host: { attributes: { "role": "columnheader" }, properties: { "class.datagrid-column": "true", "attr.aria-sort": "ariaSort" } }, queries: [{ propertyName: "projectedFilter", first: true, predicate: CustomFilter, descendants: true }], usesInheritance: true, usesOnChanges: true, hostDirectives: [{ directive: i4.ClrPopoverHostDirective }], ngImport: i0, template: `
    <div class="datagrid-column-flex">
      <button class="datagrid-column-title" *ngIf="sortable" (click)="sort()" type="button">
        <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
        <cds-icon
          *ngIf="sortDirection"
          shape="arrow"
          [attr.direction]="sortDirection"
          aria-hidden="true"
          class="sort-icon"
        ></cds-icon>
      </button>
      <!-- I'm really not happy with that select since it's not very scalable -->
      <ng-content select="clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter"></ng-content>

      <clr-dg-string-filter
        *ngIf="field && !customFilter && colType == 'string'"
        [clrFilterPlaceholder]="filterStringPlaceholder"
        [clrDgStringFilter]="registered"
        [(clrFilterValue)]="filterValue"
      ></clr-dg-string-filter>

      <clr-dg-numeric-filter
        *ngIf="field && !customFilter && colType == 'number'"
        [clrFilterMaxPlaceholder]="filterNumberMaxPlaceholder"
        [clrFilterMinPlaceholder]="filterNumberMinPlaceholder"
        [clrDgNumericFilter]="registered"
        [(clrFilterValue)]="filterValue"
      ></clr-dg-numeric-filter>

      <ng-template #columnTitle>
        <ng-content></ng-content>
      </ng-template>

      <span class="datagrid-column-title" *ngIf="!sortable">
        <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
      </span>

      <clr-dg-column-separator *ngIf="showSeparator"></clr-dg-column-separator>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i7.ClrDatagridColumnSeparator, selector: "clr-dg-column-separator" }, { kind: "component", type: i8.DatagridNumericFilter, selector: "clr-dg-numeric-filter", inputs: ["clrFilterMinPlaceholder", "clrFilterMaxPlaceholder", "clrFilterFromLabel", "clrFilterToLabel", "clrFilterValue", "clrDgNumericFilter"], outputs: ["clrFilterValueChange"] }, { kind: "component", type: i9.DatagridStringFilter, selector: "clr-dg-string-filter", inputs: ["clrFilterPlaceholder", "clrFilterLabel", "clrDgStringFilter", "clrFilterValue"], outputs: ["clrFilterValueChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column',
                    template: `
    <div class="datagrid-column-flex">
      <button class="datagrid-column-title" *ngIf="sortable" (click)="sort()" type="button">
        <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
        <cds-icon
          *ngIf="sortDirection"
          shape="arrow"
          [attr.direction]="sortDirection"
          aria-hidden="true"
          class="sort-icon"
        ></cds-icon>
      </button>
      <!-- I'm really not happy with that select since it's not very scalable -->
      <ng-content select="clr-dg-filter, clr-dg-string-filter, clr-dg-numeric-filter"></ng-content>

      <clr-dg-string-filter
        *ngIf="field && !customFilter && colType == 'string'"
        [clrFilterPlaceholder]="filterStringPlaceholder"
        [clrDgStringFilter]="registered"
        [(clrFilterValue)]="filterValue"
      ></clr-dg-string-filter>

      <clr-dg-numeric-filter
        *ngIf="field && !customFilter && colType == 'number'"
        [clrFilterMaxPlaceholder]="filterNumberMaxPlaceholder"
        [clrFilterMinPlaceholder]="filterNumberMinPlaceholder"
        [clrDgNumericFilter]="registered"
        [(clrFilterValue)]="filterValue"
      ></clr-dg-numeric-filter>

      <ng-template #columnTitle>
        <ng-content></ng-content>
      </ng-template>

      <span class="datagrid-column-title" *ngIf="!sortable">
        <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
      </span>

      <clr-dg-column-separator *ngIf="showSeparator"></clr-dg-column-separator>
    </div>
  `,
                    hostDirectives: [ClrPopoverHostDirective],
                    host: {
                        '[class.datagrid-column]': 'true',
                        '[attr.aria-sort]': 'ariaSort',
                        role: 'columnheader',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Sort }, { type: i2.FiltersProvider }, { type: i0.ViewContainerRef }, { type: i3.DetailService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { filterStringPlaceholder: [{
                type: Input,
                args: ['clrFilterStringPlaceholder']
            }], filterNumberMaxPlaceholder: [{
                type: Input,
                args: ['clrFilterNumberMaxPlaceholder']
            }], filterNumberMinPlaceholder: [{
                type: Input,
                args: ['clrFilterNumberMinPlaceholder']
            }], sortOrderChange: [{
                type: Output,
                args: ['clrDgSortOrderChange']
            }], filterValueChange: [{
                type: Output,
                args: ['clrFilterValueChange']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxZQUFZLEVBRVosWUFBWSxFQUVaLEtBQUssRUFJTCxNQUFNLEdBR1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRy9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7Ozs7Ozs7Ozs7O0FBcURqRCxNQUFNLE9BQU8saUJBQ1gsU0FBUSx1QkFBeUQ7SUFzRGpFLFlBQ1UsRUFBMkIsRUFDM0IsS0FBYyxFQUN0QixPQUEyQixFQUNuQixHQUFx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ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgSG9zdFdyYXBwZXIgfSBmcm9tICcuLi8uLi91dGlscy9ob3N0LXdyYXBwaW5nL2hvc3Qtd3JhcHBlcic7XG5pbXBvcnQgeyBDbHJQb3BvdmVySG9zdERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL3V0aWxzL3BvcG92ZXIvcG9wb3Zlci1ob3N0LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvciB9IGZyb20gJy4vYnVpbHQtaW4vY29tcGFyYXRvcnMvZGF0YWdyaWQtcHJvcGVydHktY29tcGFyYXRvcic7XG5pbXBvcnQgeyBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsIH0gZnJvbSAnLi9idWlsdC1pbi9maWx0ZXJzL2RhdGFncmlkLW51bWVyaWMtZmlsdGVyLWltcGwnO1xuaW1wb3J0IHsgRGF0YWdyaWRQcm9wZXJ0eU51bWVyaWNGaWx0ZXIgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtcHJvcGVydHktbnVtZXJpYy1maWx0ZXInO1xuaW1wb3J0IHsgRGF0YWdyaWRQcm9wZXJ0eVN0cmluZ0ZpbHRlciB9IGZyb20gJy4vYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1wcm9wZXJ0eS1zdHJpbmctZmlsdGVyJztcbmltcG9ydCB7IERhdGFncmlkU3RyaW5nRmlsdGVySW1wbCB9IGZyb20gJy4vYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1zdHJpbmctZmlsdGVyLWltcGwnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRTb3J0T3JkZXIgfSBmcm9tICcuL2VudW1zL3NvcnQtb3JkZXIuZW51bSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZENvbXBhcmF0b3JJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvY29tcGFyYXRvci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvZmlsdGVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDdXN0b21GaWx0ZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9jdXN0b20tZmlsdGVyJztcbmltcG9ydCB7IERldGFpbFNlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9kZXRhaWwuc2VydmljZSc7XG5pbXBvcnQgeyBGaWx0ZXJzUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9maWx0ZXJzJztcbmltcG9ydCB7IFNvcnQgfSBmcm9tICcuL3Byb3ZpZGVycy9zb3J0JztcbmltcG9ydCB7IEhJRERFTl9DT0xVTU5fQ0xBU1MgfSBmcm9tICcuL3JlbmRlci9jb25zdGFudHMnO1xuaW1wb3J0IHsgRGF0YWdyaWRGaWx0ZXJSZWdpc3RyYXIgfSBmcm9tICcuL3V0aWxzL2RhdGFncmlkLWZpbHRlci1yZWdpc3RyYXInO1xuaW1wb3J0IHsgV3JhcHBlZENvbHVtbiB9IGZyb20gJy4vd3JhcHBlZC1jb2x1bW4nO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctY29sdW1uJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLWZsZXhcIj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tdGl0bGVcIiAqbmdJZj1cInNvcnRhYmxlXCIgKGNsaWNrKT1cInNvcnQoKVwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbHVtblRpdGxlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxjZHMtaWNvblxuICAgICAgICAgICpuZ0lmPVwic29ydERpcmVjdGlvblwiXG4gICAgICAgICAgc2hhcGU9XCJhcnJvd1wiXG4gICAgICAgICAgW2F0dHIuZGlyZWN0aW9uXT1cInNvcnREaXJlY3Rpb25cIlxuICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICAgICAgY2xhc3M9XCJzb3J0LWljb25cIlxuICAgICAgICA+PC9jZHMtaWNvbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPCEtLSBJJ20gcmVhbGx5IG5vdCBoYXBweSB3aXRoIHRoYXQgc2VsZWN0IHNpbmNlIGl0J3Mgbm90IHZlcnkgc2NhbGFibGUgLS0+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctZmlsdGVyLCBjbHItZGctc3RyaW5nLWZpbHRlciwgY2xyLWRnLW51bWVyaWMtZmlsdGVyXCI+PC9uZy1jb250ZW50PlxuXG4gICAgICA8Y2xyLWRnLXN0cmluZy1maWx0ZXJcbiAgICAgICAgKm5nSWY9XCJmaWVsZCAmJiAhY3VzdG9tRmlsdGVyICYmIGNvbFR5cGUgPT0gJ3N0cmluZydcIlxuICAgICAgICBbY2xyRmlsdGVyUGxhY2Vob2xkZXJdPVwiZmlsdGVyU3RyaW5nUGxhY2Vob2xkZXJcIlxuICAgICAgICBbY2xyRGdTdHJpbmdGaWx0ZXJdPVwicmVnaXN0ZXJlZFwiXG4gICAgICAgIFsoY2xyRmlsdGVyVmFsdWUpXT1cImZpbHRlclZhbHVlXCJcbiAgICAgID48L2Nsci1kZy1zdHJpbmctZmlsdGVyPlxuXG4gICAgICA8Y2xyLWRnLW51bWVyaWMtZmlsdGVyXG4gICAgICAgICpuZ0lmPVwiZmllbGQgJiYgIWN1c3RvbUZpbHRlciAmJiBjb2xUeXBlID09ICdudW1iZXInXCJcbiAgICAgICAgW2NsckZpbHRlck1heFBsYWNlaG9sZGVyXT1cImZpbHRlck51bWJlck1heFBsYWNlaG9sZGVyXCJcbiAgICAgICAgW2NsckZpbHRlck1pblBsYWNlaG9sZGVyXT1cImZpbHRlck51bWJlck1pblBsYWNlaG9sZGVyXCJcbiAgICAgICAgW2NsckRnTnVtZXJpY0ZpbHRlcl09XCJyZWdpc3RlcmVkXCJcbiAgICAgICAgWyhjbHJGaWx0ZXJWYWx1ZSldPVwiZmlsdGVyVmFsdWVcIlxuICAgICAgPjwvY2xyLWRnLW51bWVyaWMtZmlsdGVyPlxuXG4gICAgICA8bmctdGVtcGxhdGUgI2NvbHVtblRpdGxlPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICA8c3BhbiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi10aXRsZVwiICpuZ0lmPVwiIXNvcnRhYmxlXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb2x1bW5UaXRsZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9zcGFuPlxuXG4gICAgICA8Y2xyLWRnLWNvbHVtbi1zZXBhcmF0b3IgKm5nSWY9XCJzaG93U2VwYXJhdG9yXCI+PC9jbHItZGctY29sdW1uLXNlcGFyYXRvcj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJQb3BvdmVySG9zdERpcmVjdGl2ZV0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWNvbHVtbl0nOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnYXJpYVNvcnQnLFxuICAgIHJvbGU6ICdjb2x1bW5oZWFkZXInLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRDb2x1bW48VCA9IGFueT5cbiAgZXh0ZW5kcyBEYXRhZ3JpZEZpbHRlclJlZ2lzdHJhcjxULCBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPj5cbiAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCwgT25DaGFuZ2VzXG57XG4gIEBJbnB1dCgnY2xyRmlsdGVyU3RyaW5nUGxhY2Vob2xkZXInKSBmaWx0ZXJTdHJpbmdQbGFjZWhvbGRlcjogc3RyaW5nO1xuICBASW5wdXQoJ2NsckZpbHRlck51bWJlck1heFBsYWNlaG9sZGVyJykgZmlsdGVyTnVtYmVyTWF4UGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdjbHJGaWx0ZXJOdW1iZXJNaW5QbGFjZWhvbGRlcicpIGZpbHRlck51bWJlck1pblBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnY2xyRGdTb3J0T3JkZXJDaGFuZ2UnKSBzb3J0T3JkZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENsckRhdGFncmlkU29ydE9yZGVyPigpO1xuICBAT3V0cHV0KCdjbHJGaWx0ZXJWYWx1ZUNoYW5nZScpIGZpbHRlclZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBmaWx0ZXIgZm9yIHRoaXMgY29sdW1uIHRoYXQgY2FuIGJlIHByb3ZpZGVkIGluIHRoZSBwcm9qZWN0ZWQgY29udGVudFxuICAgKi9cbiAgY3VzdG9tRmlsdGVyID0gZmFsc2U7XG5cbiAgLypcbiAgICogV2hhdCB0eXBlIGlzIHRoaXMgY29sdW1uPyAgVGhpcyBkZWZhdWx0cyB0byBTVFJJTkcsIGJ1dCBjYW4gYWxzbyBiZVxuICAgKiBzZXQgdG8gTlVNQkVSLiAgVW5zdXBwb3J0ZWQgdHlwZXMgZGVmYXVsdCB0byBTVFJJTkcuIFVzZXJzIGNhbiBzZXQgaXRcbiAgICogdmlhIHRoZSBbY2xyRGdDb2xUeXBlXSBpbnB1dCBieSBzZXR0aW5nIGl0IHRvICdzdHJpbmcnIG9yICdudW1iZXInLlxuICAgKi9cbiAgcHJpdmF0ZSBfY29sVHlwZTogJ3N0cmluZycgfCAnbnVtYmVyJyA9ICdzdHJpbmcnO1xuXG4gIC8qXG4gICAqIFNpbXBsZSBvYmplY3QgcHJvcGVydHkgc2hvcnRjdXQsIGFjdGl2YXRlcyBib3RoIHNvcnRpbmcgYW5kIGZpbHRlcmluZ1xuICAgKiBiYXNlZCBvbiBuYXRpdmUgY29tcGFyaXNvbiBvZiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IG9uIHRoZSBpdGVtcy5cbiAgICovXG4gIHByaXZhdGUgX2ZpZWxkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENsckRhdGFncmlkQ29tcGFyYXRvckludGVyZmFjZSB0byB1c2Ugd2hlbiBzb3J0aW5nIHRoZSBjb2x1bW5cbiAgICovXG4gIHByaXZhdGUgX3NvcnRCeTogQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+O1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaG93IHRoZSBjb2x1bW4gaXMgY3VycmVudGx5IHNvcnRlZFxuICAgKi9cbiAgcHJpdmF0ZSBfc29ydE9yZGVyOiBDbHJEYXRhZ3JpZFNvcnRPcmRlciA9IENsckRhdGFncmlkU29ydE9yZGVyLlVOU09SVEVEO1xuXG4gIHByaXZhdGUgX3NvcnREaXJlY3Rpb246ICd1cCcgfCAnZG93bicgfCBudWxsO1xuXG4gIC8vIFRoaXMgcHJvcGVydHkgaG9sZHMgZmlsdGVyIHZhbHVlIHRlbXBvcmFyaWx5IHdoaWxlIHRoaXMuZmlsdGVyIHByb3BlcnR5IGlzIG5vdCB5ZXQgcmVnaXN0ZXJlZFxuICAvLyBXaGVuIHRoaXMuZmlsdGVyIGlzIHJlZ2lzdGVyZWQsIHRoaXMgcHJvcGVydHkgdmFsdWUgd291bGQgYmUgdXNlZCB1cGRhdGUgdGhpcy5maWx0ZXIudmFsdWVcbiAgLy9cbiAgcHJpdmF0ZSBpbml0RmlsdGVyVmFsdWU6IHN0cmluZyB8IFtudW1iZXIsIG51bWJlcl07XG5cbiAgcHJpdmF0ZSB3cmFwcGVkSW5qZWN0b3I6IEluamVjdG9yO1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb24gdG8gdGhlIHNvcnQgc2VydmljZSBjaGFuZ2VzXG4gICAqL1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgcHJpdmF0ZSBfc2hvd1NlcGFyYXRvciA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfc29ydDogU29ydDxUPixcbiAgICBmaWx0ZXJzOiBGaWx0ZXJzUHJvdmlkZXI8VD4sXG4gICAgcHJpdmF0ZSB2Y3I6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSBkZXRhaWxTZXJ2aWNlOiBEZXRhaWxTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmXG4gICkge1xuICAgIHN1cGVyKGZpbHRlcnMpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yU29ydGluZ0NoYW5nZXMoKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy5saXN0ZW5Gb3JEZXRhaWxQYW5lQ2hhbmdlcygpKTtcbiAgfVxuXG4gIGdldCBpc0hpZGRlbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhISURERU5fQ09MVU1OX0NMQVNTKTtcbiAgfVxuXG4gIGdldCBzaG93U2VwYXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9zaG93U2VwYXJhdG9yO1xuICB9XG4gIHNldCBzaG93U2VwYXJhdG9yKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1NlcGFyYXRvciA9IHZhbHVlO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyBUT0RPOiBXZSBtaWdodCB3YW50IHRvIG1ha2UgdGhpcyBhbiBlbnVtIGluIHRoZSBmdXR1cmVcbiAgQElucHV0KCdjbHJEZ0NvbFR5cGUnKVxuICBnZXQgY29sVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sVHlwZTtcbiAgfVxuICBzZXQgY29sVHlwZSh2YWx1ZTogJ3N0cmluZycgfCAnbnVtYmVyJykge1xuICAgIHRoaXMuX2NvbFR5cGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdGaWVsZCcpXG4gIGdldCBmaWVsZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmllbGQ7XG4gIH1cbiAgc2V0IGZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fZmllbGQgPSBmaWVsZDtcblxuICAgICAgaWYgKCF0aGlzLl9zb3J0QnkpIHtcbiAgICAgICAgdGhpcy5fc29ydEJ5ID0gbmV3IERhdGFncmlkUHJvcGVydHlDb21wYXJhdG9yKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsckRnU29ydEJ5JylcbiAgZ2V0IHNvcnRCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydEJ5O1xuICB9XG4gIHNldCBzb3J0QnkoY29tcGFyYXRvcjogQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+IHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBjb21wYXJhdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fc29ydEJ5ID0gbmV3IERhdGFncmlkUHJvcGVydHlDb21wYXJhdG9yKGNvbXBhcmF0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY29tcGFyYXRvcikge1xuICAgICAgICB0aGlzLl9zb3J0QnkgPSBjb21wYXJhdG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZmllbGQpIHtcbiAgICAgICAgICB0aGlzLl9zb3J0QnkgPSBuZXcgRGF0YWdyaWRQcm9wZXJ0eUNvbXBhcmF0b3IodGhpcy5maWVsZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3NvcnRCeTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdTb3J0T3JkZXInKVxuICBnZXQgc29ydE9yZGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9zb3J0T3JkZXI7XG4gIH1cbiAgc2V0IHNvcnRPcmRlcih2YWx1ZTogQ2xyRGF0YWdyaWRTb3J0T3JkZXIpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIG9ubHkgaWYgdGhlIGluY29taW5nIG9yZGVyIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBjdXJyZW50IG9uZVxuICAgIGlmICh0aGlzLl9zb3J0T3JkZXIgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc3dpdGNoICh2YWx1ZSkge1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5BU0M6XG4gICAgICAgIHRoaXMuc29ydChmYWxzZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5ERVNDOlxuICAgICAgICB0aGlzLnNvcnQodHJ1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gdGhlIFVuc29ydGVkIGNhc2UgaGFwcGVucyB3aGVuIHRoZSBjdXJyZW50IHN0YXRlIGlzIG5laXRoZXIgQXNjIG9yIERlc2NcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9zb3J0LmNsZWFyKCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIEBJbnB1dCgnY2xyRmlsdGVyVmFsdWUnKVxuICBzZXQgdXBkYXRlRmlsdGVyVmFsdWUobmV3VmFsdWU6IHN0cmluZyB8IFtudW1iZXIsIG51bWJlcl0pIHtcbiAgICBpZiAodGhpcy5maWx0ZXIpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkU3RyaW5nRmlsdGVySW1wbCkge1xuICAgICAgICBpZiAoIW5ld1ZhbHVlIHx8IHR5cGVvZiBuZXdWYWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5maWx0ZXIudmFsdWUpIHtcbiAgICAgICAgICB0aGlzLmZpbHRlci52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbCkge1xuICAgICAgICBpZiAoIW5ld1ZhbHVlIHx8ICEobmV3VmFsdWUgaW5zdGFuY2VvZiBBcnJheSkpIHtcbiAgICAgICAgICBuZXdWYWx1ZSA9IFtudWxsLCBudWxsXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3VmFsdWUubGVuZ3RoID09PSAyICYmIChuZXdWYWx1ZVswXSAhPT0gdGhpcy5maWx0ZXIudmFsdWVbMF0gfHwgbmV3VmFsdWVbMV0gIT09IHRoaXMuZmlsdGVyLnZhbHVlWzFdKSkge1xuICAgICAgICAgIHRoaXMuZmlsdGVyLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0RmlsdGVyVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICB9XG4gIH1cblxuICBAQ29udGVudENoaWxkKEN1c3RvbUZpbHRlcilcbiAgc2V0IHByb2plY3RlZEZpbHRlcihjdXN0b206IGFueSkge1xuICAgIGlmIChjdXN0b20pIHtcbiAgICAgIHRoaXMuZGVsZXRlRmlsdGVyKCk7XG4gICAgICB0aGlzLmN1c3RvbUZpbHRlciA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB0aGUgY29sdW1uIGlzIHNvcnRhYmxlXG4gICAqL1xuICBnZXQgc29ydGFibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fc29ydEJ5O1xuICB9XG5cbiAgZ2V0IGFyaWFTb3J0KCkge1xuICAgIHN3aXRjaCAodGhpcy5fc29ydE9yZGVyKSB7XG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLkFTQzpcbiAgICAgICAgcmV0dXJuICdhc2NlbmRpbmcnO1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5ERVNDOlxuICAgICAgICByZXR1cm4gJ2Rlc2NlbmRpbmcnO1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnbm9uZSc7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNvcnREaXJlY3Rpb24oKTogJ3VwJyB8ICdkb3duJyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9zb3J0RGlyZWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEBOT1RFIHR5cGUgYGFueWAgaGVyZSBpcyB0byBsZXQgdXMgcGFzcyB0ZW1wbGF0ZVN0cmljdE1vZGUsIGJlY2F1c2UgaW4gb3VyIGNvZGUgd2UgdHJ5IHRvIGhhbmRsZVxuICAgKiB0d28gdHlwZXMgb2YgZmlsdGVycyBTdHJpbmcgYW5kIE51bWJlciB3aXRoIHRoZSBzYW1lIHZhcmlhYmxlIGJ1dCBib3RoIG9mIHRoZW0gd29yayB3aXRoIGRpZmZlcmVudFxuICAgKiBmb3JtYXQgd2UgZ290IGFuIGVycm9yIGZvciBjYXN0aW5nLiBXZSBjb3VsZCBub3QgY2FzdCBhbnl0aGluZyBpbnNpZGUgdGhlIHRlbXBsYXRlIHNvIHRvIG5vdCBtZXNzIHRoZVxuICAgKiBjYXN0aW5nLCB0aGUgbGFzdCB0eXBlIGlzIHNldCB0byBgYW55YFxuICAgKlxuICAgKiBPcmlnbmlhbCB0eXBlczogc3RyaW5nIHwgW251bWJlciwgbnVtYmVyXVxuICAgKi9cbiAgZ2V0IGZpbHRlclZhbHVlKCkge1xuICAgIGlmICh0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkU3RyaW5nRmlsdGVySW1wbCB8fCB0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkTnVtZXJpY0ZpbHRlckltcGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlci52YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgc2V0IGZpbHRlclZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwgfHwgdGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZpbHRlclZhbHVlID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLmZpbHRlclZhbHVlQ2hhbmdlLmVtaXQodGhpcy5maWx0ZXIudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBfdmlldygpIHtcbiAgICByZXR1cm4gdGhpcy53cmFwcGVkSW5qZWN0b3IuZ2V0KFdyYXBwZWRDb2x1bW4sIHRoaXMudmNyKS5jb2x1bW5WaWV3O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy53cmFwcGVkSW5qZWN0b3IgPSBuZXcgSG9zdFdyYXBwZXIoV3JhcHBlZENvbHVtbiwgdGhpcy52Y3IpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXMuY29sVHlwZSAmJlxuICAgICAgY2hhbmdlcy5jb2xUeXBlLmN1cnJlbnRWYWx1ZSAmJlxuICAgICAgY2hhbmdlcy5jb2xUeXBlLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlcy5jb2xUeXBlLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21GaWx0ZXIgJiYgIXRoaXMuZmlsdGVyICYmIHRoaXMuY29sVHlwZSAmJiB0aGlzLmZpZWxkKSB7XG4gICAgICAgIHRoaXMuc2V0dXBEZWZhdWx0RmlsdGVyKHRoaXMuZmllbGQsIHRoaXMuY29sVHlwZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmZpZWxkICYmIGNoYW5nZXMuZmllbGQuY3VycmVudFZhbHVlICYmIGNoYW5nZXMuZmllbGQuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLmZpZWxkLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21GaWx0ZXIgJiYgdGhpcy5jb2xUeXBlKSB7XG4gICAgICAgIHRoaXMuc2V0dXBEZWZhdWx0RmlsdGVyKHRoaXMuZmllbGQsIHRoaXMuY29sVHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIGRhdGFncmlkIGJhc2VkIG9uIHRoaXMgY29sdW1uXG4gICAqL1xuICBzb3J0KHJldmVyc2U/OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLnNvcnRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydC50b2dnbGUodGhpcy5fc29ydEJ5LCByZXZlcnNlKTtcblxuICAgIC8vIHNldHRpbmcgdGhlIHByaXZhdGUgdmFyaWFibGUgdG8gbm90IHJldHJpZ2dlciB0aGUgc2V0dGVyIGxvZ2ljXG4gICAgdGhpcy5fc29ydE9yZGVyID0gdGhpcy5fc29ydC5yZXZlcnNlID8gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuREVTQyA6IENsckRhdGFncmlkU29ydE9yZGVyLkFTQztcbiAgICAvLyBTZXRzIHRoZSBjb3JyZWN0IGljb24gZm9yIGN1cnJlbnQgc29ydCBvcmRlclxuICAgIHRoaXMuX3NvcnREaXJlY3Rpb24gPSB0aGlzLl9zb3J0T3JkZXIgPT09IENsckRhdGFncmlkU29ydE9yZGVyLkRFU0MgPyAnZG93bicgOiAndXAnO1xuICAgIHRoaXMuc29ydE9yZGVyQ2hhbmdlLmVtaXQodGhpcy5fc29ydE9yZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yRGV0YWlsUGFuZUNoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZUNoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvd1NlcGFyYXRvciAhPT0gIXN0YXRlKSB7XG4gICAgICAgIHRoaXMuc2hvd1NlcGFyYXRvciA9ICFzdGF0ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yU29ydGluZ0NoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuY2hhbmdlLnN1YnNjcmliZShzb3J0ID0+IHtcbiAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgbWFyayB0aGUgY29tcG9uZW50IHRvIGJlIGNoZWNrZWRcbiAgICAgIC8vIGZvciBib3RoIGFjdGl2YXRpbmcgYW5kIGRlYWN0aXZhdGluZyBzb3J0aW5nXG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgLy8gV2UncmUgb25seSBsaXN0ZW5pbmcgdG8gbWFrZSBzdXJlIHdlIGVtaXQgYW4gZXZlbnQgd2hlbiB0aGUgY29sdW1uIGdvZXMgZnJvbSBzb3J0ZWQgdG8gdW5zb3J0ZWRcbiAgICAgIGlmICh0aGlzLnNvcnRPcmRlciAhPT0gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQgJiYgc29ydC5jb21wYXJhdG9yICE9PSB0aGlzLl9zb3J0QnkpIHtcbiAgICAgICAgdGhpcy5fc29ydE9yZGVyID0gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQ7XG4gICAgICAgIHRoaXMuc29ydE9yZGVyQ2hhbmdlLmVtaXQodGhpcy5fc29ydE9yZGVyKTtcbiAgICAgICAgdGhpcy5fc29ydERpcmVjdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldHVwRGVmYXVsdEZpbHRlcihmaWVsZDogc3RyaW5nLCBjb2xUeXBlOiAnc3RyaW5nJyB8ICdudW1iZXInKSB7XG4gICAgaWYgKGNvbFR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnNldEZpbHRlcihuZXcgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbChuZXcgRGF0YWdyaWRQcm9wZXJ0eU51bWVyaWNGaWx0ZXIoZmllbGQpKSk7XG4gICAgfSBlbHNlIGlmIChjb2xUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zZXRGaWx0ZXIobmV3IERhdGFncmlkU3RyaW5nRmlsdGVySW1wbChuZXcgRGF0YWdyaWRQcm9wZXJ0eVN0cmluZ0ZpbHRlcihmaWVsZCkpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVyICYmIHRoaXMuaW5pdEZpbHRlclZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZpbHRlclZhbHVlID0gdGhpcy5pbml0RmlsdGVyVmFsdWU7XG4gICAgICAvLyBUaGlzIGluaXRGaWx0ZXJWYWx1ZSBzaG91bGQgYmUgdXNlZCBvbmx5IG9uY2UgYWZ0ZXIgdGhlIGZpbHRlciByZWdpc3RyYXRpb25cbiAgICAgIC8vIFNvIGRlbGV0aW5nIHRoaXMgcHJvcGVydHkgdmFsdWUgdG8gcHJldmVudCBpdCBmcm9tIGJlaW5nIHVzZWQgYWdhaW5cbiAgICAgIC8vIGlmIHRoaXMgZmllbGQgcHJvcGVydHkgaXMgc2V0IGFnYWluXG4gICAgICBkZWxldGUgdGhpcy5pbml0RmlsdGVyVmFsdWU7XG4gICAgfVxuICB9XG59XG4iXX0=