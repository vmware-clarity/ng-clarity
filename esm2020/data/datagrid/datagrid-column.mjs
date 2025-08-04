/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
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
import * as i4 from "../../utils";
import * as i5 from "../../utils/popover/popover-host.directive";
import * as i6 from "@angular/common";
import * as i7 from "../../icon/icon";
import * as i8 from "./datagrid-column-separator";
import * as i9 from "./built-in/filters/datagrid-numeric-filter";
import * as i10 from "./built-in/filters/datagrid-string-filter";
export class ClrDatagridColumn extends DatagridFilterRegistrar {
    constructor(el, _sort, filters, vcr, detailService, changeDetectorRef, commonStrings) {
        super(filters);
        this.el = el;
        this._sort = _sort;
        this.vcr = vcr;
        this.detailService = detailService;
        this.changeDetectorRef = changeDetectorRef;
        this.commonStrings = commonStrings;
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
}
ClrDatagridColumn.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumn, deps: [{ token: i0.ElementRef }, { token: i1.Sort }, { token: i2.FiltersProvider }, { token: i0.ViewContainerRef }, { token: i3.DetailService }, { token: i0.ChangeDetectorRef }, { token: i4.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridColumn.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridColumn, selector: "clr-dg-column", inputs: { filterStringPlaceholder: ["clrFilterStringPlaceholder", "filterStringPlaceholder"], filterNumberMaxPlaceholder: ["clrFilterNumberMaxPlaceholder", "filterNumberMaxPlaceholder"], filterNumberMinPlaceholder: ["clrFilterNumberMinPlaceholder", "filterNumberMinPlaceholder"], colType: ["clrDgColType", "colType"], field: ["clrDgField", "field"], sortBy: ["clrDgSortBy", "sortBy"], sortOrder: ["clrDgSortOrder", "sortOrder"], updateFilterValue: ["clrFilterValue", "updateFilterValue"] }, outputs: { sortOrderChange: "clrDgSortOrderChange", filterValueChange: "clrFilterValueChange" }, host: { attributes: { "role": "columnheader" }, properties: { "class.datagrid-column": "true", "attr.aria-sort": "ariaSort" } }, queries: [{ propertyName: "projectedFilter", first: true, predicate: CustomFilter, descendants: true }], viewQueries: [{ propertyName: "titleContainer", first: true, predicate: ["titleContainer"], descendants: true, read: ElementRef }], usesInheritance: true, usesOnChanges: true, hostDirectives: [{ directive: i5.ClrPopoverHostDirective }], ngImport: i0, template: `
    <div class="datagrid-column-flex">
      <button class="datagrid-column-title" *ngIf="sortable" (click)="sort()" type="button" #titleContainer>
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

      <span class="datagrid-column-title" *ngIf="!sortable" #titleContainer>
        <ng-container *ngTemplateOutlet="columnTitle"></ng-container>
      </span>

      <clr-dg-column-separator *ngIf="showSeparator"></clr-dg-column-separator>
    </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i6.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i7.CdsIconCustomTag, selector: "cds-icon" }, { kind: "component", type: i8.ClrDatagridColumnSeparator, selector: "clr-dg-column-separator" }, { kind: "component", type: i9.DatagridNumericFilter, selector: "clr-dg-numeric-filter", inputs: ["clrFilterMinPlaceholder", "clrFilterMaxPlaceholder", "clrFilterFromLabel", "clrFilterToLabel", "clrFilterValue", "clrDgNumericFilter"], outputs: ["clrFilterValueChange"] }, { kind: "component", type: i10.DatagridStringFilter, selector: "clr-dg-string-filter", inputs: ["clrFilterPlaceholder", "clrFilterLabel", "clrDgStringFilter", "clrFilterValue"], outputs: ["clrFilterValueChange"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridColumn, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-column',
                    template: `
    <div class="datagrid-column-flex">
      <button class="datagrid-column-title" *ngIf="sortable" (click)="sort()" type="button" #titleContainer>
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

      <span class="datagrid-column-title" *ngIf="!sortable" #titleContainer>
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
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Sort }, { type: i2.FiltersProvider }, { type: i0.ViewContainerRef }, { type: i3.DetailService }, { type: i0.ChangeDetectorRef }, { type: i4.ClrCommonStringsService }]; }, propDecorators: { filterStringPlaceholder: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtY29sdW1uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC1jb2x1bW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFFWixLQUFLLEVBSUwsTUFBTSxFQUVOLFNBQVMsR0FFVixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDckUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDckYsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDakcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0saURBQWlELENBQUM7QUFDNUYsT0FBTyxFQUFFLDZCQUE2QixFQUFFLE1BQU0scURBQXFELENBQUM7QUFDcEcsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sb0RBQW9ELENBQUM7QUFDbEcsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7QUFDMUYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFHL0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSXpELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3pELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzVFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7Ozs7Ozs7Ozs7O0FBcURqRCxNQUFNLE9BQU8saUJBQ1gsU0FBUSx1QkFBeUQ7SUF3RGpFLFlBQ1UsRUFBMkIsRUFDM0IsS0FBYyxF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O2lCQUNoRDttUkFLc0MsdUJBQXVCO3NCQUEzRCxLQUFLO3VCQUFDLDRCQUE0QjtnQkFDSywwQkFBMEI7c0JBQWpFLEtBQUs7dUJBQUMsK0JBQStCO2dCQUNFLDBCQUEwQjtzQkFBakUsS0FBSzt1QkFBQywrQkFBK0I7Z0JBRU4sZUFBZTtzQkFBOUMsTUFBTTt1QkFBQyxzQkFBc0I7Z0JBQ0UsaUJBQWlCO3NCQUFoRCxNQUFNO3VCQUFDLHNCQUFzQjtnQkFFcUIsY0FBYztzQkFBaEUsU0FBUzt1QkFBQyxnQkFBZ0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBMEU3QyxPQUFPO3NCQURWLEtBQUs7dUJBQUMsY0FBYztnQkFTakIsS0FBSztzQkFEUixLQUFLO3VCQUFDLFlBQVk7Z0JBZWYsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLGFBQWE7Z0JBaUJoQixTQUFTO3NCQURaLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQThCbkIsaUJBQWlCO3NCQURwQixLQUFLO3VCQUFDLGdCQUFnQjtnQkF3Qm5CLGVBQWU7c0JBRGxCLFlBQVk7dUJBQUMsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IEhvc3RXcmFwcGVyIH0gZnJvbSAnLi4vLi4vdXRpbHMvaG9zdC13cmFwcGluZy9ob3N0LXdyYXBwZXInO1xuaW1wb3J0IHsgQ2xyUG9wb3Zlckhvc3REaXJlY3RpdmUgfSBmcm9tICcuLi8uLi91dGlscy9wb3BvdmVyL3BvcG92ZXItaG9zdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRGF0YWdyaWRQcm9wZXJ0eUNvbXBhcmF0b3IgfSBmcm9tICcuL2J1aWx0LWluL2NvbXBhcmF0b3JzL2RhdGFncmlkLXByb3BlcnR5LWNvbXBhcmF0b3InO1xuaW1wb3J0IHsgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbCB9IGZyb20gJy4vYnVpbHQtaW4vZmlsdGVycy9kYXRhZ3JpZC1udW1lcmljLWZpbHRlci1pbXBsJztcbmltcG9ydCB7IERhdGFncmlkUHJvcGVydHlOdW1lcmljRmlsdGVyIH0gZnJvbSAnLi9idWlsdC1pbi9maWx0ZXJzL2RhdGFncmlkLXByb3BlcnR5LW51bWVyaWMtZmlsdGVyJztcbmltcG9ydCB7IERhdGFncmlkUHJvcGVydHlTdHJpbmdGaWx0ZXIgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtcHJvcGVydHktc3RyaW5nLWZpbHRlcic7XG5pbXBvcnQgeyBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwgfSBmcm9tICcuL2J1aWx0LWluL2ZpbHRlcnMvZGF0YWdyaWQtc3RyaW5nLWZpbHRlci1pbXBsJztcbmltcG9ydCB7IENsckRhdGFncmlkU29ydE9yZGVyIH0gZnJvbSAnLi9lbnVtcy9zb3J0LW9yZGVyLmVudW0nO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2NvbXBhcmF0b3IuaW50ZXJmYWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkRmlsdGVySW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2ZpbHRlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ3VzdG9tRmlsdGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvY3VzdG9tLWZpbHRlcic7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgRmlsdGVyc1Byb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZmlsdGVycyc7XG5pbXBvcnQgeyBTb3J0IH0gZnJvbSAnLi9wcm92aWRlcnMvc29ydCc7XG5pbXBvcnQgeyBISURERU5fQ09MVU1OX0NMQVNTIH0gZnJvbSAnLi9yZW5kZXIvY29uc3RhbnRzJztcbmltcG9ydCB7IERhdGFncmlkRmlsdGVyUmVnaXN0cmFyIH0gZnJvbSAnLi91dGlscy9kYXRhZ3JpZC1maWx0ZXItcmVnaXN0cmFyJztcbmltcG9ydCB7IFdyYXBwZWRDb2x1bW4gfSBmcm9tICcuL3dyYXBwZWQtY29sdW1uJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLWNvbHVtbicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImRhdGFncmlkLWNvbHVtbi1mbGV4XCI+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXRpdGxlXCIgKm5nSWY9XCJzb3J0YWJsZVwiIChjbGljayk9XCJzb3J0KClcIiB0eXBlPVwiYnV0dG9uXCIgI3RpdGxlQ29udGFpbmVyPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29sdW1uVGl0bGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPGNkcy1pY29uXG4gICAgICAgICAgKm5nSWY9XCJzb3J0RGlyZWN0aW9uXCJcbiAgICAgICAgICBzaGFwZT1cImFycm93XCJcbiAgICAgICAgICBbYXR0ci5kaXJlY3Rpb25dPVwic29ydERpcmVjdGlvblwiXG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICBjbGFzcz1cInNvcnQtaWNvblwiXG4gICAgICAgID48L2Nkcy1pY29uPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8IS0tIEknbSByZWFsbHkgbm90IGhhcHB5IHdpdGggdGhhdCBzZWxlY3Qgc2luY2UgaXQncyBub3QgdmVyeSBzY2FsYWJsZSAtLT5cbiAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1maWx0ZXIsIGNsci1kZy1zdHJpbmctZmlsdGVyLCBjbHItZGctbnVtZXJpYy1maWx0ZXJcIj48L25nLWNvbnRlbnQ+XG5cbiAgICAgIDxjbHItZGctc3RyaW5nLWZpbHRlclxuICAgICAgICAqbmdJZj1cImZpZWxkICYmICFjdXN0b21GaWx0ZXIgJiYgY29sVHlwZSA9PSAnc3RyaW5nJ1wiXG4gICAgICAgIFtjbHJGaWx0ZXJQbGFjZWhvbGRlcl09XCJmaWx0ZXJTdHJpbmdQbGFjZWhvbGRlclwiXG4gICAgICAgIFtjbHJEZ1N0cmluZ0ZpbHRlcl09XCJyZWdpc3RlcmVkXCJcbiAgICAgICAgWyhjbHJGaWx0ZXJWYWx1ZSldPVwiZmlsdGVyVmFsdWVcIlxuICAgICAgPjwvY2xyLWRnLXN0cmluZy1maWx0ZXI+XG5cbiAgICAgIDxjbHItZGctbnVtZXJpYy1maWx0ZXJcbiAgICAgICAgKm5nSWY9XCJmaWVsZCAmJiAhY3VzdG9tRmlsdGVyICYmIGNvbFR5cGUgPT0gJ251bWJlcidcIlxuICAgICAgICBbY2xyRmlsdGVyTWF4UGxhY2Vob2xkZXJdPVwiZmlsdGVyTnVtYmVyTWF4UGxhY2Vob2xkZXJcIlxuICAgICAgICBbY2xyRmlsdGVyTWluUGxhY2Vob2xkZXJdPVwiZmlsdGVyTnVtYmVyTWluUGxhY2Vob2xkZXJcIlxuICAgICAgICBbY2xyRGdOdW1lcmljRmlsdGVyXT1cInJlZ2lzdGVyZWRcIlxuICAgICAgICBbKGNsckZpbHRlclZhbHVlKV09XCJmaWx0ZXJWYWx1ZVwiXG4gICAgICA+PC9jbHItZGctbnVtZXJpYy1maWx0ZXI+XG5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjY29sdW1uVGl0bGU+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgIDxzcGFuIGNsYXNzPVwiZGF0YWdyaWQtY29sdW1uLXRpdGxlXCIgKm5nSWY9XCIhc29ydGFibGVcIiAjdGl0bGVDb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb2x1bW5UaXRsZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9zcGFuPlxuXG4gICAgICA8Y2xyLWRnLWNvbHVtbi1zZXBhcmF0b3IgKm5nSWY9XCJzaG93U2VwYXJhdG9yXCI+PC9jbHItZGctY29sdW1uLXNlcGFyYXRvcj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdERpcmVjdGl2ZXM6IFtDbHJQb3BvdmVySG9zdERpcmVjdGl2ZV0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmRhdGFncmlkLWNvbHVtbl0nOiAndHJ1ZScsXG4gICAgJ1thdHRyLmFyaWEtc29ydF0nOiAnYXJpYVNvcnQnLFxuICAgIHJvbGU6ICdjb2x1bW5oZWFkZXInLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRDb2x1bW48VCA9IGFueT5cbiAgZXh0ZW5kcyBEYXRhZ3JpZEZpbHRlclJlZ2lzdHJhcjxULCBDbHJEYXRhZ3JpZEZpbHRlckludGVyZmFjZTxUPj5cbiAgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCwgT25DaGFuZ2VzXG57XG4gIEBJbnB1dCgnY2xyRmlsdGVyU3RyaW5nUGxhY2Vob2xkZXInKSBmaWx0ZXJTdHJpbmdQbGFjZWhvbGRlcjogc3RyaW5nO1xuICBASW5wdXQoJ2NsckZpbHRlck51bWJlck1heFBsYWNlaG9sZGVyJykgZmlsdGVyTnVtYmVyTWF4UGxhY2Vob2xkZXI6IHN0cmluZztcbiAgQElucHV0KCdjbHJGaWx0ZXJOdW1iZXJNaW5QbGFjZWhvbGRlcicpIGZpbHRlck51bWJlck1pblBsYWNlaG9sZGVyOiBzdHJpbmc7XG5cbiAgQE91dHB1dCgnY2xyRGdTb3J0T3JkZXJDaGFuZ2UnKSBzb3J0T3JkZXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENsckRhdGFncmlkU29ydE9yZGVyPigpO1xuICBAT3V0cHV0KCdjbHJGaWx0ZXJWYWx1ZUNoYW5nZScpIGZpbHRlclZhbHVlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoJ3RpdGxlQ29udGFpbmVyJywgeyByZWFkOiBFbGVtZW50UmVmIH0pIHRpdGxlQ29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAvKipcbiAgICogQSBjdXN0b20gZmlsdGVyIGZvciB0aGlzIGNvbHVtbiB0aGF0IGNhbiBiZSBwcm92aWRlZCBpbiB0aGUgcHJvamVjdGVkIGNvbnRlbnRcbiAgICovXG4gIGN1c3RvbUZpbHRlciA9IGZhbHNlO1xuXG4gIC8qXG4gICAqIFdoYXQgdHlwZSBpcyB0aGlzIGNvbHVtbj8gIFRoaXMgZGVmYXVsdHMgdG8gU1RSSU5HLCBidXQgY2FuIGFsc28gYmVcbiAgICogc2V0IHRvIE5VTUJFUi4gIFVuc3VwcG9ydGVkIHR5cGVzIGRlZmF1bHQgdG8gU1RSSU5HLiBVc2VycyBjYW4gc2V0IGl0XG4gICAqIHZpYSB0aGUgW2NsckRnQ29sVHlwZV0gaW5wdXQgYnkgc2V0dGluZyBpdCB0byAnc3RyaW5nJyBvciAnbnVtYmVyJy5cbiAgICovXG4gIHByaXZhdGUgX2NvbFR5cGU6ICdzdHJpbmcnIHwgJ251bWJlcicgPSAnc3RyaW5nJztcblxuICAvKlxuICAgKiBTaW1wbGUgb2JqZWN0IHByb3BlcnR5IHNob3J0Y3V0LCBhY3RpdmF0ZXMgYm90aCBzb3J0aW5nIGFuZCBmaWx0ZXJpbmdcbiAgICogYmFzZWQgb24gbmF0aXZlIGNvbXBhcmlzb24gb2YgdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSBvbiB0aGUgaXRlbXMuXG4gICAqL1xuICBwcml2YXRlIF9maWVsZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDbHJEYXRhZ3JpZENvbXBhcmF0b3JJbnRlcmZhY2UgdG8gdXNlIHdoZW4gc29ydGluZyB0aGUgY29sdW1uXG4gICAqL1xuICBwcml2YXRlIF9zb3J0Qnk6IENsckRhdGFncmlkQ29tcGFyYXRvckludGVyZmFjZTxUPjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIGhvdyB0aGUgY29sdW1uIGlzIGN1cnJlbnRseSBzb3J0ZWRcbiAgICovXG4gIHByaXZhdGUgX3NvcnRPcmRlcjogQ2xyRGF0YWdyaWRTb3J0T3JkZXIgPSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5VTlNPUlRFRDtcblxuICBwcml2YXRlIF9zb3J0RGlyZWN0aW9uOiAndXAnIHwgJ2Rvd24nIHwgbnVsbDtcblxuICAvLyBUaGlzIHByb3BlcnR5IGhvbGRzIGZpbHRlciB2YWx1ZSB0ZW1wb3JhcmlseSB3aGlsZSB0aGlzLmZpbHRlciBwcm9wZXJ0eSBpcyBub3QgeWV0IHJlZ2lzdGVyZWRcbiAgLy8gV2hlbiB0aGlzLmZpbHRlciBpcyByZWdpc3RlcmVkLCB0aGlzIHByb3BlcnR5IHZhbHVlIHdvdWxkIGJlIHVzZWQgdXBkYXRlIHRoaXMuZmlsdGVyLnZhbHVlXG4gIC8vXG4gIHByaXZhdGUgaW5pdEZpbHRlclZhbHVlOiBzdHJpbmcgfCBbbnVtYmVyLCBudW1iZXJdO1xuXG4gIHByaXZhdGUgd3JhcHBlZEluamVjdG9yOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogU3Vic2NyaXB0aW9uIHRvIHRoZSBzb3J0IHNlcnZpY2UgY2hhbmdlc1xuICAgKi9cbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIHByaXZhdGUgX3Nob3dTZXBhcmF0b3IgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX3NvcnQ6IFNvcnQ8VD4sXG4gICAgZmlsdGVyczogRmlsdGVyc1Byb3ZpZGVyPFQ+LFxuICAgIHByaXZhdGUgdmNyOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSxcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlXG4gICkge1xuICAgIHN1cGVyKGZpbHRlcnMpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRoaXMubGlzdGVuRm9yU29ydGluZ0NoYW5nZXMoKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2godGhpcy5saXN0ZW5Gb3JEZXRhaWxQYW5lQ2hhbmdlcygpKTtcbiAgfVxuXG4gIGdldCBpc0hpZGRlbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhISURERU5fQ09MVU1OX0NMQVNTKTtcbiAgfVxuXG4gIGdldCBzaG93U2VwYXJhdG9yKCkge1xuICAgIHJldHVybiB0aGlzLl9zaG93U2VwYXJhdG9yO1xuICB9XG4gIHNldCBzaG93U2VwYXJhdG9yKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc2hvd1NlcGFyYXRvciA9IHZhbHVlO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyBUT0RPOiBXZSBtaWdodCB3YW50IHRvIG1ha2UgdGhpcyBhbiBlbnVtIGluIHRoZSBmdXR1cmVcbiAgQElucHV0KCdjbHJEZ0NvbFR5cGUnKVxuICBnZXQgY29sVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29sVHlwZTtcbiAgfVxuICBzZXQgY29sVHlwZSh2YWx1ZTogJ3N0cmluZycgfCAnbnVtYmVyJykge1xuICAgIHRoaXMuX2NvbFR5cGUgPSB2YWx1ZTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyRGdGaWVsZCcpXG4gIGdldCBmaWVsZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmllbGQ7XG4gIH1cbiAgc2V0IGZpZWxkKGZpZWxkOiBzdHJpbmcpIHtcbiAgICBpZiAodHlwZW9mIGZpZWxkID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fZmllbGQgPSBmaWVsZDtcblxuICAgICAgaWYgKCF0aGlzLl9zb3J0QnkpIHtcbiAgICAgICAgdGhpcy5fc29ydEJ5ID0gbmV3IERhdGFncmlkUHJvcGVydHlDb21wYXJhdG9yKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsckRnU29ydEJ5JylcbiAgZ2V0IHNvcnRCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydEJ5O1xuICB9XG4gIHNldCBzb3J0QnkoY29tcGFyYXRvcjogQ2xyRGF0YWdyaWRDb21wYXJhdG9ySW50ZXJmYWNlPFQ+IHwgc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBjb21wYXJhdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fc29ydEJ5ID0gbmV3IERhdGFncmlkUHJvcGVydHlDb21wYXJhdG9yKGNvbXBhcmF0b3IpO1xuICAgIH0gZWxzZSBpZiAoY29tcGFyYXRvcikge1xuICAgICAgdGhpcy5fc29ydEJ5ID0gY29tcGFyYXRvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZmllbGQpIHtcbiAgICAgIHRoaXMuX3NvcnRCeSA9IG5ldyBEYXRhZ3JpZFByb3BlcnR5Q29tcGFyYXRvcih0aGlzLmZpZWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHRoaXMuX3NvcnRCeTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsckRnU29ydE9yZGVyJylcbiAgZ2V0IHNvcnRPcmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydE9yZGVyO1xuICB9XG4gIHNldCBzb3J0T3JkZXIodmFsdWU6IENsckRhdGFncmlkU29ydE9yZGVyKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBvbmx5IGlmIHRoZSBpbmNvbWluZyBvcmRlciBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBvbmVcbiAgICBpZiAodGhpcy5fc29ydE9yZGVyID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAodmFsdWUpIHtcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuQVNDOlxuICAgICAgICB0aGlzLnNvcnQoZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuREVTQzpcbiAgICAgICAgdGhpcy5zb3J0KHRydWUpO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHRoZSBVbnNvcnRlZCBjYXNlIGhhcHBlbnMgd2hlbiB0aGUgY3VycmVudCBzdGF0ZSBpcyBuZWl0aGVyIEFzYyBvciBEZXNjXG4gICAgICBjYXNlIENsckRhdGFncmlkU29ydE9yZGVyLlVOU09SVEVEOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fc29ydC5jbGVhcigpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ2NsckZpbHRlclZhbHVlJylcbiAgc2V0IHVwZGF0ZUZpbHRlclZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcgfCBbbnVtYmVyLCBudW1iZXJdKSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwpIHtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSB8fCB0eXBlb2YgbmV3VmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSAnJztcbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuZmlsdGVyLnZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5maWx0ZXIudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmZpbHRlciBpbnN0YW5jZW9mIERhdGFncmlkTnVtZXJpY0ZpbHRlckltcGwpIHtcbiAgICAgICAgaWYgKCFuZXdWYWx1ZSB8fCAhKG5ld1ZhbHVlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgbmV3VmFsdWUgPSBbbnVsbCwgbnVsbF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5ld1ZhbHVlLmxlbmd0aCA9PT0gMiAmJiAobmV3VmFsdWVbMF0gIT09IHRoaXMuZmlsdGVyLnZhbHVlWzBdIHx8IG5ld1ZhbHVlWzFdICE9PSB0aGlzLmZpbHRlci52YWx1ZVsxXSkpIHtcbiAgICAgICAgICB0aGlzLmZpbHRlci52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdEZpbHRlclZhbHVlID0gbmV3VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgQENvbnRlbnRDaGlsZChDdXN0b21GaWx0ZXIpXG4gIHNldCBwcm9qZWN0ZWRGaWx0ZXIoY3VzdG9tOiBhbnkpIHtcbiAgICBpZiAoY3VzdG9tKSB7XG4gICAgICB0aGlzLmRlbGV0ZUZpbHRlcigpO1xuICAgICAgdGhpcy5jdXN0b21GaWx0ZXIgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlIGNvbHVtbiBpcyBzb3J0YWJsZVxuICAgKi9cbiAgZ2V0IHNvcnRhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuX3NvcnRCeTtcbiAgfVxuXG4gIGdldCBhcmlhU29ydCgpIHtcbiAgICBzd2l0Y2ggKHRoaXMuX3NvcnRPcmRlcikge1xuICAgICAgY2FzZSBDbHJEYXRhZ3JpZFNvcnRPcmRlci5BU0M6XG4gICAgICAgIHJldHVybiAnYXNjZW5kaW5nJztcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuREVTQzpcbiAgICAgICAgcmV0dXJuICdkZXNjZW5kaW5nJztcbiAgICAgIGNhc2UgQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQ6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ25vbmUnO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzb3J0RGlyZWN0aW9uKCk6ICd1cCcgfCAnZG93bicgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fc29ydERpcmVjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBATk9URSB0eXBlIGBhbnlgIGhlcmUgaXMgdG8gbGV0IHVzIHBhc3MgdGVtcGxhdGVTdHJpY3RNb2RlLCBiZWNhdXNlIGluIG91ciBjb2RlIHdlIHRyeSB0byBoYW5kbGVcbiAgICogdHdvIHR5cGVzIG9mIGZpbHRlcnMgU3RyaW5nIGFuZCBOdW1iZXIgd2l0aCB0aGUgc2FtZSB2YXJpYWJsZSBidXQgYm90aCBvZiB0aGVtIHdvcmsgd2l0aCBkaWZmZXJlbnRcbiAgICogZm9ybWF0IHdlIGdvdCBhbiBlcnJvciBmb3IgY2FzdGluZy4gV2UgY291bGQgbm90IGNhc3QgYW55dGhpbmcgaW5zaWRlIHRoZSB0ZW1wbGF0ZSBzbyB0byBub3QgbWVzcyB0aGVcbiAgICogY2FzdGluZywgdGhlIGxhc3QgdHlwZSBpcyBzZXQgdG8gYGFueWBcbiAgICpcbiAgICogT3JpZ25pYWwgdHlwZXM6IHN0cmluZyB8IFtudW1iZXIsIG51bWJlcl1cbiAgICovXG4gIGdldCBmaWx0ZXJWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZFN0cmluZ0ZpbHRlckltcGwgfHwgdGhpcy5maWx0ZXIgaW5zdGFuY2VvZiBEYXRhZ3JpZE51bWVyaWNGaWx0ZXJJbXBsKSB7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXIudmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHNldCBmaWx0ZXJWYWx1ZShuZXdWYWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWRTdHJpbmdGaWx0ZXJJbXBsIHx8IHRoaXMuZmlsdGVyIGluc3RhbmNlb2YgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbCkge1xuICAgICAgdGhpcy51cGRhdGVGaWx0ZXJWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5maWx0ZXJWYWx1ZUNoYW5nZS5lbWl0KHRoaXMuZmlsdGVyLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBnZXQgX3ZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMud3JhcHBlZEluamVjdG9yLmdldChXcmFwcGVkQ29sdW1uLCB0aGlzLnZjcikuY29sdW1uVmlldztcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMud3JhcHBlZEluamVjdG9yID0gbmV3IEhvc3RXcmFwcGVyKFdyYXBwZWRDb2x1bW4sIHRoaXMudmNyKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLnNldEZpbHRlclRvZ2dsZUFyaWFMYWJlbCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXMuY29sVHlwZSAmJlxuICAgICAgY2hhbmdlcy5jb2xUeXBlLmN1cnJlbnRWYWx1ZSAmJlxuICAgICAgY2hhbmdlcy5jb2xUeXBlLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlcy5jb2xUeXBlLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21GaWx0ZXIgJiYgIXRoaXMuZmlsdGVyICYmIHRoaXMuY29sVHlwZSAmJiB0aGlzLmZpZWxkKSB7XG4gICAgICAgIHRoaXMuc2V0dXBEZWZhdWx0RmlsdGVyKHRoaXMuZmllbGQsIHRoaXMuY29sVHlwZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmZpZWxkICYmIGNoYW5nZXMuZmllbGQuY3VycmVudFZhbHVlICYmIGNoYW5nZXMuZmllbGQuY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzLmZpZWxkLnByZXZpb3VzVmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5jdXN0b21GaWx0ZXIgJiYgdGhpcy5jb2xUeXBlKSB7XG4gICAgICAgIHRoaXMuc2V0dXBEZWZhdWx0RmlsdGVyKHRoaXMuZmllbGQsIHRoaXMuY29sVHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzID0+IHMudW5zdWJzY3JpYmUoKSk7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIGRhdGFncmlkIGJhc2VkIG9uIHRoaXMgY29sdW1uXG4gICAqL1xuICBzb3J0KHJldmVyc2U/OiBib29sZWFuKSB7XG4gICAgaWYgKCF0aGlzLnNvcnRhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fc29ydC50b2dnbGUodGhpcy5fc29ydEJ5LCByZXZlcnNlKTtcblxuICAgIC8vIHNldHRpbmcgdGhlIHByaXZhdGUgdmFyaWFibGUgdG8gbm90IHJldHJpZ2dlciB0aGUgc2V0dGVyIGxvZ2ljXG4gICAgdGhpcy5fc29ydE9yZGVyID0gdGhpcy5fc29ydC5yZXZlcnNlID8gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuREVTQyA6IENsckRhdGFncmlkU29ydE9yZGVyLkFTQztcbiAgICAvLyBTZXRzIHRoZSBjb3JyZWN0IGljb24gZm9yIGN1cnJlbnQgc29ydCBvcmRlclxuICAgIHRoaXMuX3NvcnREaXJlY3Rpb24gPSB0aGlzLl9zb3J0T3JkZXIgPT09IENsckRhdGFncmlkU29ydE9yZGVyLkRFU0MgPyAnZG93bicgOiAndXAnO1xuICAgIHRoaXMuc29ydE9yZGVyQ2hhbmdlLmVtaXQodGhpcy5fc29ydE9yZGVyKTtcbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yRGV0YWlsUGFuZUNoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGV0YWlsU2VydmljZS5zdGF0ZUNoYW5nZS5zdWJzY3JpYmUoc3RhdGUgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvd1NlcGFyYXRvciAhPT0gIXN0YXRlKSB7XG4gICAgICAgIHRoaXMuc2hvd1NlcGFyYXRvciA9ICFzdGF0ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RmlsdGVyVG9nZ2xlQXJpYUxhYmVsKCkge1xuICAgIGNvbnN0IGZpbHRlclRvZ2dsZSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0YWdyaWQtZmlsdGVyLXRvZ2dsZScpO1xuICAgIGlmIChmaWx0ZXJUb2dnbGUpIHtcbiAgICAgIGZpbHRlclRvZ2dsZS5hcmlhTGFiZWwgPSB0aGlzLmNvbW1vblN0cmluZ3MucGFyc2UodGhpcy5jb21tb25TdHJpbmdzLmtleXMuZGF0YWdyaWRGaWx0ZXJBcmlhTGFiZWwsIHtcbiAgICAgICAgQ09MVU1OOiB0aGlzPy50aXRsZUNvbnRhaW5lcj8ubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudC50cmltKCkudG9Mb2NhbGVMb3dlckNhc2UoKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbGlzdGVuRm9yU29ydGluZ0NoYW5nZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NvcnQuY2hhbmdlLnN1YnNjcmliZShzb3J0ID0+IHtcbiAgICAgIC8vIE5lZWQgdG8gbWFudWFsbHkgbWFyayB0aGUgY29tcG9uZW50IHRvIGJlIGNoZWNrZWRcbiAgICAgIC8vIGZvciBib3RoIGFjdGl2YXRpbmcgYW5kIGRlYWN0aXZhdGluZyBzb3J0aW5nXG4gICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgLy8gV2UncmUgb25seSBsaXN0ZW5pbmcgdG8gbWFrZSBzdXJlIHdlIGVtaXQgYW4gZXZlbnQgd2hlbiB0aGUgY29sdW1uIGdvZXMgZnJvbSBzb3J0ZWQgdG8gdW5zb3J0ZWRcbiAgICAgIGlmICh0aGlzLnNvcnRPcmRlciAhPT0gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQgJiYgc29ydC5jb21wYXJhdG9yICE9PSB0aGlzLl9zb3J0QnkpIHtcbiAgICAgICAgdGhpcy5fc29ydE9yZGVyID0gQ2xyRGF0YWdyaWRTb3J0T3JkZXIuVU5TT1JURUQ7XG4gICAgICAgIHRoaXMuc29ydE9yZGVyQ2hhbmdlLmVtaXQodGhpcy5fc29ydE9yZGVyKTtcbiAgICAgICAgdGhpcy5fc29ydERpcmVjdGlvbiA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldHVwRGVmYXVsdEZpbHRlcihmaWVsZDogc3RyaW5nLCBjb2xUeXBlOiAnc3RyaW5nJyB8ICdudW1iZXInKSB7XG4gICAgaWYgKGNvbFR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnNldEZpbHRlcihuZXcgRGF0YWdyaWROdW1lcmljRmlsdGVySW1wbChuZXcgRGF0YWdyaWRQcm9wZXJ0eU51bWVyaWNGaWx0ZXIoZmllbGQpKSk7XG4gICAgfSBlbHNlIGlmIChjb2xUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zZXRGaWx0ZXIobmV3IERhdGFncmlkU3RyaW5nRmlsdGVySW1wbChuZXcgRGF0YWdyaWRQcm9wZXJ0eVN0cmluZ0ZpbHRlcihmaWVsZCkpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZmlsdGVyICYmIHRoaXMuaW5pdEZpbHRlclZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZpbHRlclZhbHVlID0gdGhpcy5pbml0RmlsdGVyVmFsdWU7XG4gICAgICAvLyBUaGlzIGluaXRGaWx0ZXJWYWx1ZSBzaG91bGQgYmUgdXNlZCBvbmx5IG9uY2UgYWZ0ZXIgdGhlIGZpbHRlciByZWdpc3RyYXRpb25cbiAgICAgIC8vIFNvIGRlbGV0aW5nIHRoaXMgcHJvcGVydHkgdmFsdWUgdG8gcHJldmVudCBpdCBmcm9tIGJlaW5nIHVzZWQgYWdhaW5cbiAgICAgIC8vIGlmIHRoaXMgZmllbGQgcHJvcGVydHkgaXMgc2V0IGFnYWluXG4gICAgICBkZWxldGUgdGhpcy5pbml0RmlsdGVyVmFsdWU7XG4gICAgfVxuICB9XG59XG4iXX0=