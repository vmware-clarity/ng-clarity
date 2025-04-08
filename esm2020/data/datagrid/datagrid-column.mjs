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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxZQUFZLEVBRVosWUFBWSxFQUVaLEtBQUssRUFJTCxNQUFNLEdBR1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3JFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ2pHLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGlEQUFpRCxDQUFDO0FBQzVGLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLHFEQUFxRCxDQUFDO0FBQ3BHLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQ2xHLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLGdEQUFnRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRy9ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7Ozs7Ozs7Ozs7O0FBcURqRCxNQUFNLE9BQU8saUJBQ1gsU0FBUSx1QkFBeUQ7SUFzRGpFLFlBQ1UsRUFBMkIsRUFDM0IsS0FBYyxFQUN0QixPQUEyQixFQUNuQixHQUFx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KSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEhvc3RXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXInO1xuaW1wb3J0IHsgQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3BvcG92ZXItaG9zdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YWdyaWRQcm9wZXJ0eUNvbXBhcmF0b3IgfSBmcm9tICcuL2J1aWx0LWluL2NvbXBhcmF0b3JzL2RhdGFncmlkLXByb3BlcnR5LWNvbXBhcmF0b3InO1xuaW1wb3J0IHsgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbCB9IGZyb20gJy4vYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1udW1lcmljLWZpbHRlci1pbXBsJztcbmltcG9ydCB7IERhdGFncmlkUHJvcGVydHlOdW1lcmljRmlsdGVyIH0gZnJvbSAnLi9idWlsdC1pbi9maWx0ZXJzL2RhdGFncmlkLXByb3BlcnR5LW51bWVyaWMtZmlsdGVyJztcbmltcG9ydCB7IERhdGFncmlkUHJvcGVydHlTdHJpbmdGaWx0ZXIgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtcHJvcGVydHktc3RyaW5nLWZpbHRlcic7XG5pbXBvcnQgeyBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtc3RyaW5nLWZpbHRlci1pbXBsJztcbmltcG9ydCB7IENsckRhdGFncmlkU29ydE9yZGVyIH0gZnJvbSAnLi9lbnVtcy9zb3J0LW9yZGVyLmVudW0nO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2NvbXBhcmF0b3IuaW50ZXJmYWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2ZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ3VzdG9tRmlsdGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvY3VzdG9tLWZpbHRlcic7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsdGVyc1Byb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZmlsdGVycyc7XG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9wcm92aWRlcnMvc29ydCc7XG5pbXBvcnQgeyBISURERU5fQ09MVU1OX0NMQVNTIH0gZnJvbSAnLi9yZW5kZXIvY29uc3RhbnRzJztcbmltcG9ydCB7IERhdGFncmlkRmlsdGVyUmVnaXN0cmFyIH0gZnJvbSAnLi91dGlscy9kYXRhZ3JpZC1maWx0ZXItcmVnaXN0cmFyJztcbmltcG9ydCB7IFdyYXBwZWRDb2x1bW4gfSBmcm9tICcuL3dyYXBwZWQtY29sdW1uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLWNvbHVtbicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1mbGV4XCI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXRpdGxlXCIgKm5nSWY9XCJzb3J0YWJsZVwiIChjbGljayk9XCJzb3J0KClcIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb2x1bW5UaXRsZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8Y2RzLWljb25cbiAgICAgICAgICAqbmdJZj1cInNvcnREaXJlY3Rpb25cIlxuICAgICAgICAgIHNoYXBlPVwiYXJyb3dcIlxuICAgICAgICAgIFthdHRyLmRpcmVjdGlvbl09XCJzb3J0RGlyZWN0aW9uXCJcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgIGNsYXNzPVwic29ydC1pY29uXCJcbiAgICAgICAgPjwvY2RzLWljb24+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDwhLS0gSSdtIHJlYWxseSBub3QgaGFwcHkgd2l0aCB0aGF0IHNlbGVjdCBzaW5jZSBpdCdzIG5vdCB2ZXJ5IHNjYWxhYmxlIC0tPlxuICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2xyLWRnLWZpbHRlciwgY2xyLWRnLXN0cmluZy1maWx0ZXIsIGNsci1kZy1udW1lcmljLWZpbHRlclwiPjwvbmctY29udGVudD5cblxuICAgICAgPGNsci1kZy1zdHJpbmctZmlsdGVyXG4gICAgICAgICpuZ0lmPVwiZmllbGQgJiYgIWN1c3RvbUZpbHRlciAmJiBjb2xUeXBlID09ICdzdHJpbmcnXCJcbiAgICAgICAgW2NsckZpbHRlclBsYWNlaG9sZGVyXT1cImZpbHRlclN0cmluZ1BsYWNlaG9sZGVyXCJcbiAgICAgICAgW2NsckRnU3RyaW5nRmlsdGVyXT1cInJlZ2lzdGVyZWRcIlxuICAgICAgICBbKGNsckZpbHRlclZhbHVlKV09XCJmaWx0ZXJWYWx1ZVwiXG4gICAgICA+PC9jbHItZGctc3RyaW5nLWZpbHRlcj5cblxuICAgICAgPGNsci1kZy1udW1lcmljLWZpbHRlclxuICAgICAgICAqbmdJZj1cImZpZWxkICYmICFjdXN0b21GaWx0ZXIgJiYgY29sVHlwZSA9PSAnbnVtYmVyJ1wiXG4gICAgICAgIFtjbHJGaWx0ZXJNYXhQbGFjZWhvbGRlcl09XCJmaWx0ZXJOdW1iZXJNYXhQbGFjZWhvbGRlclwiXG4gICAgICAgIFtjbHJGaWx0ZXJNaW5QbGFjZWhvbGRlcl09XCJmaWx0ZXJOdW1iZXJNaW5QbGFjZWhvbGRlclwiXG4gICAgICAgIFtjbHJEZ051bWVyaWNGaWx0ZXJdPVwicmVnaXN0ZXJlZFwiXG4gICAgICAgIFsoY2xyRmlsdGVyVmFsdWUpXT1cImZpbHRlclZhbHVlXCJcbiAgICAgID48L2Nsci1kZy1udW1lcmljLWZpbHRlcj5cblxuICAgICAgPG5nLXRlbXBsYXRlICNjb2x1bW5UaXRsZT5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgPHNwYW4gY2xhc3M9XCJkYXRhZ3JpZC1jb2x1bW4tdGl0bGVcIiAqbmdJZj1cIiFzb3J0YWJsZVwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29sdW1uVGl0bGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvc3Bhbj5cblxuICAgICAgPGNsci1kZy1jb2x1bW4tc2VwYXJhdG9yICpuZ0lmPVwic2hvd1NlcGFyYXRvclwiPjwvY2xyLWRnLWNvbHVtbi1zZXBhcmF0b3I+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3REaXJlY3RpdmVzOiBbQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmVdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5kYXRhZ3JpZC1jb2x1bW5dJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLXNvcnRdJzogJ2FyaWFTb3J0JyxcbiAgICByb2xlOiAnY29sdW1uaGVhZGVyJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkQ29sdW1uPFQgPSBhbnk+XG4gIGV4dGVuZHMgRGF0YWdyaWRGaWx0ZXJSZWdpc3RyYXI8VCwgQ2xyRGF0YWdyaWRGaWx0ZXJJbnRlcmZhY2U8VD4+XG4gIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQsIE9uQ2hhbmdlc1xue1xuICBASW5wdXQoJ2NsckZpbHRlclN0cmluZ1BsYWNlaG9sZGVyJykgZmlsdGVyU3RyaW5nUGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdjbHJGaWx0ZXJOdW1iZXJNYXhQbGFjZWhvbGRlcicpIGZpbHRlck51bWJlck1heFBsYWNlaG9sZGVyOiBzdHJpbmc7XG4gIEBJbnB1dCgnY2xyRmlsdGVyTnVtYmVyTWluUGxhY2Vob2xkZXInKSBmaWx0ZXJOdW1iZXJNaW5QbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gIEBPdXRwdXQoJ2NsckRnU29ydE9yZGVyQ2hhbmdlJykgc29ydE9yZGVyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxDbHJEYXRhZ3JpZFNvcnRPcmRlcj4oKTtcbiAgQE91dHB1dCgnY2xyRmlsdGVyVmFsdWVDaGFuZ2UnKSBmaWx0ZXJWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQSBjdXN0b20gZmlsdGVyIGZvciB0aGlzIGNvbHVtbiB0aGF0IGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgcHJvamVjdGVkIGNvbnRlbnRcbiAgICovXG4gIGN1c3RvbUZpbHRlciA9IGZhbHNlO1xuXG4gIC8qXG4gICAqIFdoYXQgdHlwZSBpcyB0aGlzIGNvbHVtbj8gIFRoaXMgZGVmYXVsdHMgdG8gU1RSSU5HLCBidXQgY2FuIGFsc28gYmVcbiAgICogc2V0IHRvIE5VTUJFUi4gIFVuc3VwcG9ydGVkIHR5cGVzIGRlZmF1bHQgdG8gU1RSSU5HLiBVc2VycyBjYW4gc2V0IGl0XG4gICAqIHZpYSB0aGUgW2NsckRnQ29sVHlwZV0gaW5wdXQgYnkgc2V0dGluZyBpdCB0byAnc3RyaW5nJyBvciAnbnVtYmVyJy5cbiAgICovXG4gIHByaXZhdGUgX2NvbFR5cGU6ICdzdHJpbmcnIHwgJ251bWJlcicgPSAnc3RyaW5nJztcblxuICAvKlxuICAgKiBTaW1wbGUgb2JqZWN0IHByb3BlcnR5IHNob3J0Y3V0LCBhY3RpdmF0ZXMgYm90aCBzb3J0aW5nIGFuZCBmaWx0ZXJpbmdcbiAgICogYmFzZWQgb24gbmF0aXZlIGNvbXBhcmlzb24gb2YgdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBvbiB0aGUgaXRlbXMuXG4gICAqL1xuICBwcml2YXRlIF9maWVsZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDbHJEYXRhZ3JpZENvbXBhcmF0b3JJbnRlcmZhY2UgdG8gdXNlIHdoZW4gc29ydGluZyB0aGUgY29sdW1uXG4gICAqL1xuICBwcml2YXRlIF9zb3J0Qnk6IENsckRhdGFncmlkQ29tcGFyYXRvckludGVyZmFjZTxUPjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGhvdyB0aGUgY29sdW1uIGlzIGN1cnJlbnRseSBzb3J0ZWRcbiAgICovXG4gIHByaXZhdGUgX3NvcnRPcmRlcjogQ2xyRGF0YWdyaWRTb3J0T3JkZXIgPSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRDtcblxuICBwcml2YXRlIF9zb3J0RGlyZWN0aW9uOiAndXAnIHwgJ2Rvd24nIHwgbnVsbDtcblxuICAvLyBUaGlzIHByb3BlcnR5IGhvbGRzIGZpbHRlciB2YWx1ZSB0ZW1wb3JhcmlseSB3aGlsZSB0aGlzLmZpbHRlciBwcm9wZXJ0eSBpcyBub3QgeWV0IHJlZ2lzdGVyZWRcbiAgLy8gV2hlbiB0aGlzLmZpbHRlciBpcyByZWdpc3RlcmVkLCB0aGlzIHByb3BlcnR5IHZhbHVlIHdvdWxkIGJlIHVzZWQgdXBkYXRlIHRoaXMuZmlsdGVyLnZhbHVlXG4gIC8vXG4gIHByaXZhdGUgaW5pdEZpbHRlclZhbHVlOiBzdHJpbmcgfCBbbnVtYmVyLCBudW1iZXJdO1xuXG4gIHByaXZhdGUgd3JhcHBlZEluamVjdG9yOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9uIHRvIHRoZSBzb3J0IHNlcnZpY2UgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIHByaXZhdGUgX3Nob3dTZXBhcmF0b3IgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3NvcnQ6IFNvcnQ8VD4sXG4gICAgZmlsdGVyczogRmlsdGVyc1Byb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSxcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHtcbiAgICBzdXBlcihmaWx0ZXJzKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaCh0aGlzLmxpc3RlbkZvclNvcnRpbmdDaGFuZ2VzKCkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yRGV0YWlsUGFuZUNoYW5nZXMoKSk7XG4gIH1cblxuICBnZXQgaXNIaWRkZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoSElEREVOX0NPTFVNTl9DTEFTUyk7XG4gIH1cblxuICBnZXQgc2hvd1NlcGFyYXRvcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2hvd1NlcGFyYXRvcjtcbiAgfVxuICBzZXQgc2hvd1NlcGFyYXRvcih2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3Nob3dTZXBhcmF0b3IgPSB2YWx1ZTtcbiAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLy8gVE9ETzogV2UgbWlnaHQgd2FudCB0byBtYWtlIHRoaXMgYW4gZW51bSBpbiB0aGUgZnV0dXJlXG4gIEBJbnB1dCgnY2xyRGdDb2xUeXBlJylcbiAgZ2V0IGNvbFR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbFR5cGU7XG4gIH1cbiAgc2V0IGNvbFR5cGUodmFsdWU6ICdzdHJpbmcnIHwgJ251bWJlcicpIHtcbiAgICB0aGlzLl9jb2xUeXBlID0gdmFsdWU7XG4gIH1cblxuICBASW5wdXQoJ2NsckRnRmllbGQnKVxuICBnZXQgZmllbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkO1xuICB9XG4gIHNldCBmaWVsZChmaWVsZDogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBmaWVsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2ZpZWxkID0gZmllbGQ7XG5cbiAgICAgIGlmICghdGhpcy5fc29ydEJ5KSB7XG4gICAgICAgIHRoaXMuX3NvcnRCeSA9IG5ldyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvcihmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJEZ1NvcnRCeScpXG4gIGdldCBzb3J0QnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRCeTtcbiAgfVxuICBzZXQgc29ydEJ5KGNvbXBhcmF0b3I6IENsckRhdGFncmlkQ29tcGFyYXRvckludGVyZmFjZTxUPiB8IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgY29tcGFyYXRvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3NvcnRCeSA9IG5ldyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvcihjb21wYXJhdG9yKTtcbiAgICB9IGVsc2UgaWYgKGNvbXBhcmF0b3IpIHtcbiAgICAgIHRoaXMuX3NvcnRCeSA9IGNvbXBhcmF0b3I7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZpZWxkKSB7XG4gICAgICB0aGlzLl9zb3J0QnkgPSBuZXcgRGF0YWdyaWRQcm9wZXJ0eUNvbXBhcmF0b3IodGhpcy5maWVsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zb3J0Qnk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJEZ1NvcnRPcmRlcicpXG4gIGdldCBzb3J0T3JkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnRPcmRlcjtcbiAgfVxuICBzZXQgc29ydE9yZGVyKHZhbHVlOiBDbHJEYXRhZ3JpZFNvcnRPcmRlcikge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gb25seSBpZiB0aGUgaW5jb21pbmcgb3JkZXIgaXMgZGlmZmVyZW50IGZyb20gdGhlIGN1cnJlbnQgb25lXG4gICAgaWYgKHRoaXMuX3NvcnRPcmRlciA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHZhbHVlKSB7XG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLkFTQzpcbiAgICAgICAgdGhpcy5zb3J0KGZhbHNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLkRFU0M6XG4gICAgICAgIHRoaXMuc29ydCh0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyB0aGUgVW5zb3J0ZWQgY2FzZSBoYXBwZW5zIHdoZW4gdGhlIGN1cnJlbnQgc3RhdGUgaXMgbmVpdGhlciBBc2Mgb3IgRGVzY1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX3NvcnQuY2xlYXIoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCdjbHJGaWx0ZXJWYWx1ZScpXG4gIHNldCB1cGRhdGVGaWx0ZXJWYWx1ZShuZXdWYWx1ZTogc3RyaW5nIHwgW251bWJlciwgbnVtYmVyXSkge1xuICAgIGlmICh0aGlzLmZpbHRlcikge1xuICAgICAgaWYgKHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsKSB7XG4gICAgICAgIGlmICghbmV3VmFsdWUgfHwgdHlwZW9mIG5ld1ZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgIG5ld1ZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmZpbHRlci52YWx1ZSkge1xuICAgICAgICAgIHRoaXMuZmlsdGVyLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKSB7XG4gICAgICAgIGlmICghbmV3VmFsdWUgfHwgIShuZXdWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICAgIG5ld1ZhbHVlID0gW251bGwsIG51bGxdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuZXdWYWx1ZS5sZW5ndGggPT09IDIgJiYgKG5ld1ZhbHVlWzBdICE9PSB0aGlzLmZpbHRlci52YWx1ZVswXSB8fCBuZXdWYWx1ZVsxXSAhPT0gdGhpcy5maWx0ZXIudmFsdWVbMV0pKSB7XG4gICAgICAgICAgdGhpcy5maWx0ZXIudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRGaWx0ZXJWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoQ3VzdG9tRmlsdGVyKVxuICBzZXQgcHJvamVjdGVkRmlsdGVyKGN1c3RvbTogYW55KSB7XG4gICAgaWYgKGN1c3RvbSkge1xuICAgICAgdGhpcy5kZWxldGVGaWx0ZXIoKTtcbiAgICAgIHRoaXMuY3VzdG9tRmlsdGVyID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5kaWNhdGVzIGlmIHRoZSBjb2x1bW4gaXMgc29ydGFibGVcbiAgICovXG4gIGdldCBzb3J0YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLl9zb3J0Qnk7XG4gIH1cblxuICBnZXQgYXJpYVNvcnQoKSB7XG4gICAgc3dpdGNoICh0aGlzLl9zb3J0T3JkZXIpIHtcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuQVNDOlxuICAgICAgICByZXR1cm4gJ2FzY2VuZGluZyc7XG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLkRFU0M6XG4gICAgICAgIHJldHVybiAnZGVzY2VuZGluZyc7XG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLlVOU09SVEVEOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuICdub25lJztcbiAgICB9XG4gIH1cblxuICBnZXQgc29ydERpcmVjdGlvbigpOiAndXAnIHwgJ2Rvd24nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnREaXJlY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQE5PVEUgdHlwZSBgYW55YCBoZXJlIGlzIHRvIGxldCB1cyBwYXNzIHRlbXBsYXRlU3RyaWN0TW9kZSwgYmVjYXVzZSBpbiBvdXIgY29kZSB3ZSB0cnkgdG8gaGFuZGxlXG4gICAqIHR3byB0eXBlcyBvZiBmaWx0ZXJzIFN0cmluZyBhbmQgTnVtYmVyIHdpdGggdGhlIHNhbWUgdmFyaWFibGUgYnV0IGJvdGggb2YgdGhlbSB3b3JrIHdpdGggZGlmZmVyZW50XG4gICAqIGZvcm1hdCB3ZSBnb3QgYW4gZXJyb3IgZm9yIGNhc3RpbmcuIFdlIGNvdWxkIG5vdCBjYXN0IGFueXRoaW5nIGluc2lkZSB0aGUgdGVtcGxhdGUgc28gdG8gbm90IG1lc3MgdGhlXG4gICAqIGNhc3RpbmcsIHRoZSBsYXN0IHR5cGUgaXMgc2V0IHRvIGBhbnlgXG4gICAqXG4gICAqIE9yaWduaWFsIHR5cGVzOiBzdHJpbmcgfCBbbnVtYmVyLCBudW1iZXJdXG4gICAqL1xuICBnZXQgZmlsdGVyVmFsdWUoKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsIHx8IHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbCkge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBzZXQgZmlsdGVyVmFsdWUobmV3VmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkU3RyaW5nRmlsdGVySW1wbCB8fCB0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkTnVtZXJpY0ZpbHRlckltcGwpIHtcbiAgICAgIHRoaXMudXBkYXRlRmlsdGVyVmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuZmlsdGVyVmFsdWVDaGFuZ2UuZW1pdCh0aGlzLmZpbHRlci52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IF92aWV3KCkge1xuICAgIHJldHVybiB0aGlzLndyYXBwZWRJbmplY3Rvci5nZXQoV3JhcHBlZENvbHVtbiwgdGhpcy52Y3IpLmNvbHVtblZpZXc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLndyYXBwZWRJbmplY3RvciA9IG5ldyBIb3N0V3JhcHBlcihXcmFwcGVkQ29sdW1uLCB0aGlzLnZjcik7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKFxuICAgICAgY2hhbmdlcy5jb2xUeXBlICYmXG4gICAgICBjaGFuZ2VzLmNvbFR5cGUuY3VycmVudFZhbHVlICYmXG4gICAgICBjaGFuZ2VzLmNvbFR5cGUuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLmNvbFR5cGUucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgaWYgKCF0aGlzLmN1c3RvbUZpbHRlciAmJiAhdGhpcy5maWx0ZXIgJiYgdGhpcy5jb2xUeXBlICYmIHRoaXMuZmllbGQpIHtcbiAgICAgICAgdGhpcy5zZXR1cERlZmF1bHRGaWx0ZXIodGhpcy5maWVsZCwgdGhpcy5jb2xUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuZmllbGQgJiYgY2hhbmdlcy5maWVsZC5jdXJyZW50VmFsdWUgJiYgY2hhbmdlcy5maWVsZC5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXMuZmllbGQucHJldmlvdXNWYWx1ZSkge1xuICAgICAgaWYgKCF0aGlzLmN1c3RvbUZpbHRlciAmJiB0aGlzLmNvbFR5cGUpIHtcbiAgICAgICAgdGhpcy5zZXR1cERlZmF1bHRGaWx0ZXIodGhpcy5maWVsZCwgdGhpcy5jb2xUeXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBuZ09uRGVzdHJveSgpIHtcbiAgICBzdXBlci5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHMgPT4gcy51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTb3J0cyB0aGUgZGF0YWdyaWQgYmFzZWQgb24gdGhpcyBjb2x1bW5cbiAgICovXG4gIHNvcnQocmV2ZXJzZT86IGJvb2xlYW4pIHtcbiAgICBpZiAoIXRoaXMuc29ydGFibGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zb3J0LnRvZ2dsZSh0aGlzLl9zb3J0QnksIHJldmVyc2UpO1xuXG4gICAgLy8gc2V0dGluZyB0aGUgcHJpdmF0ZSB2YXJpYWJsZSB0byBub3QgcmV0cmlnZ2VyIHRoZSBzZXR0ZXIgbG9naWNcbiAgICB0aGlzLl9zb3J0T3JkZXIgPSB0aGlzLl9zb3J0LnJldmVyc2UgPyBDbHJEYXRhZ3JpZFNvcnRPcmRlci5ERVNDIDogQ2xyRGF0YWdyaWRTb3J0T3JkZXIuQVNDO1xuICAgIC8vIFNldHMgdGhlIGNvcnJlY3QgaWNvbiBmb3IgY3VycmVudCBzb3J0IG9yZGVyXG4gICAgdGhpcy5fc29ydERpcmVjdGlvbiA9IHRoaXMuX3NvcnRPcmRlciA9PT0gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuREVTQyA/ICdkb3duJyA6ICd1cCc7XG4gICAgdGhpcy5zb3J0T3JkZXJDaGFuZ2UuZW1pdCh0aGlzLl9zb3J0T3JkZXIpO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JEZXRhaWxQYW5lQ2hhbmdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5kZXRhaWxTZXJ2aWNlLnN0YXRlQ2hhbmdlLnN1YnNjcmliZShzdGF0ZSA9PiB7XG4gICAgICBpZiAodGhpcy5zaG93U2VwYXJhdG9yICE9PSAhc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zaG93U2VwYXJhdG9yID0gIXN0YXRlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JTb3J0aW5nQ2hhbmdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydC5jaGFuZ2Uuc3Vic2NyaWJlKHNvcnQgPT4ge1xuICAgICAgLy8gTmVlZCB0byBtYW51YWxseSBtYXJrIHRoZSBjb21wb25lbnQgdG8gYmUgY2hlY2tlZFxuICAgICAgLy8gZm9yIGJvdGggYWN0aXZhdGluZyBhbmQgZGVhY3RpdmF0aW5nIHNvcnRpbmdcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAvLyBXZSdyZSBvbmx5IGxpc3RlbmluZyB0byBtYWtlIHN1cmUgd2UgZW1pdCBhbiBldmVudCB3aGVuIHRoZSBjb2x1bW4gZ29lcyBmcm9tIHNvcnRlZCB0byB1bnNvcnRlZFxuICAgICAgaWYgKHRoaXMuc29ydE9yZGVyICE9PSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRCAmJiBzb3J0LmNvbXBhcmF0b3IgIT09IHRoaXMuX3NvcnRCeSkge1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRDtcbiAgICAgICAgdGhpcy5zb3J0T3JkZXJDaGFuZ2UuZW1pdCh0aGlzLl9zb3J0T3JkZXIpO1xuICAgICAgICB0aGlzLl9zb3J0RGlyZWN0aW9uID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0dXBEZWZhdWx0RmlsdGVyKGZpZWxkOiBzdHJpbmcsIGNvbFR5cGU6ICdzdHJpbmcnIHwgJ251bWJlcicpIHtcbiAgICBpZiAoY29sVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMuc2V0RmlsdGVyKG5ldyBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKG5ldyBEYXRhZ3JpZFByb3BlcnR5TnVtZXJpY0ZpbHRlcihmaWVsZCkpKTtcbiAgICB9IGVsc2UgaWYgKGNvbFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnNldEZpbHRlcihuZXcgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsKG5ldyBEYXRhZ3JpZFByb3BlcnR5U3RyaW5nRmlsdGVyKGZpZWxkKSkpO1xuICAgIH1cbiAgICBpZiAodGhpcy5maWx0ZXIgJiYgdGhpcy5pbml0RmlsdGVyVmFsdWUpIHtcbiAgICAgIHRoaXMudXBkYXRlRmlsdGVyVmFsdWUgPSB0aGlzLmluaXRGaWx0ZXJWYWx1ZTtcbiAgICAgIC8vIFRoaXMgaW5pdEZpbHRlclZhbHVlIHNob3VsZCBiZSB1c2VkIG9ubHkgb25jZSBhZnRlciB0aGUgZmlsdGVyIHJlZ2lzdHJhdGlvblxuICAgICAgLy8gU28gZGVsZXRpbmcgdGhpcyBwcm9wZXJ0eSB2YWx1ZSB0byBwcmV2ZW50IGl0IGZyb20gYmVpbmcgdXNlZCBhZ2FpblxuICAgICAgLy8gaWYgdGhpcyBmaWVsZCBwcm9wZXJ0eSBpcyBzZXQgYWdhaW5cbiAgICAgIGRlbGV0ZSB0aGlzLmluaXRGaWx0ZXJWYWx1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==