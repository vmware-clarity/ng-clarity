/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { ClrDatagridPageSize } from './datagrid-page-size';
import * as i0 from "@angular/core";
import * as i1 from "./providers/page";
import * as i2 from "../../utils/i18n/common-strings.service";
import * as i3 from "./providers/detail.service";
import * as i4 from "@angular/common";
import * as i5 from "../../icon/icon";
export class ClrDatagridPagination {
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
}
ClrDatagridPagination.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPagination, deps: [{ token: i1.Page }, { token: i2.ClrCommonStringsService }, { token: i3.DetailService }], target: i0.ɵɵFactoryTarget.Component });
ClrDatagridPagination.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridPagination, selector: "clr-dg-pagination", inputs: { disableCurrentPageInput: ["clrDgPageInputDisabled", "disableCurrentPageInput"], pageSize: ["clrDgPageSize", "pageSize"], totalItems: ["clrDgTotalItems", "totalItems"], lastPage: ["clrDgLastPage", "lastPage"], currentPage: ["clrDgPage", "currentPage"] }, outputs: { currentChanged: "clrDgPageChange" }, host: { properties: { "class.pagination": "true" } }, queries: [{ propertyName: "_pageSizeComponent", first: true, predicate: ClrDatagridPageSize, descendants: true }], viewQueries: [{ propertyName: "currentPageInputRef", first: true, predicate: ["currentPageInput"], descendants: true }], ngImport: i0, template: `
    <ng-container *ngIf="!detailService.isOpen">
      <div class="pagination-size" *ngIf="_pageSizeComponent">
        <ng-content select="clr-dg-page-size"></ng-content>
      </div>
      <div class="pagination-description">
        <ng-content></ng-content>
      </div>
      <div class="pagination-list" *ngIf="page.last > 1">
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
          <input
            *ngIf="!disableCurrentPageInput; else readOnly"
            #currentPageInput
            type="text"
            class="pagination-current clr-input"
            [size]="page.last.toString().length"
            [value]="page.current"
            (keydown.enter)="updateCurrentPage($event)"
            (blur)="verifyCurrentPage($event)"
            [attr.aria-label]="commonStrings.keys.currentPage"
          />
          <ng-template #readOnly>
            <span>{{ page.current }}</span>
          </ng-template>

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
    </ng-container>
    <ng-container *ngIf="detailService.isOpen">
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
    </ng-container>
  `, isInline: true, dependencies: [{ kind: "directive", type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i5.CdsIconCustomTag, selector: "cds-icon" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridPagination, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-dg-pagination',
                    template: `
    <ng-container *ngIf="!detailService.isOpen">
      <div class="pagination-size" *ngIf="_pageSizeComponent">
        <ng-content select="clr-dg-page-size"></ng-content>
      </div>
      <div class="pagination-description">
        <ng-content></ng-content>
      </div>
      <div class="pagination-list" *ngIf="page.last > 1">
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
          <input
            *ngIf="!disableCurrentPageInput; else readOnly"
            #currentPageInput
            type="text"
            class="pagination-current clr-input"
            [size]="page.last.toString().length"
            [value]="page.current"
            (keydown.enter)="updateCurrentPage($event)"
            (blur)="verifyCurrentPage($event)"
            [attr.aria-label]="commonStrings.keys.currentPage"
          />
          <ng-template #readOnly>
            <span>{{ page.current }}</span>
          </ng-template>

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
    </ng-container>
    <ng-container *ngIf="detailService.isOpen">
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
    </ng-container>
  `,
                    host: { '[class.pagination]': 'true' },
                }]
        }], ctorParameters: function () { return [{ type: i1.Page }, { type: i2.ClrCommonStringsService }, { type: i3.DetailService }]; }, propDecorators: { disableCurrentPageInput: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcGFnaW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtcGFnaW5hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7OztBQTBHM0QsTUFBTSxPQUFPLHFCQUFxQjtJQWNoQyxZQUFtQixJQUFVLEVBQVMsYUFBc0MsRUFBUyxhQUE0QjtRQUE5RixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFYdEYsbUJBQWMsR0FBRyxJQUFJLFlBQVksQ0FBUyxLQUFLLENBQUMsQ0FBQztRQVkxRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFZO1FBQ3ZCLDhJQUE4STtRQUM5SSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFhO1FBQzFCLDhJQUE4STtRQUM5SSxJQUFJ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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUdUO29CQUNELElBQUksRUFBRSxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRTtpQkFDdkM7NkpBRWtDLHVCQUF1QjtzQkFBdkQsS0FBSzt1QkFBQyx3QkFBd0I7Z0JBRUosY0FBYztzQkFBeEMsTUFBTTt1QkFBQyxpQkFBaUI7Z0JBRVUsa0JBQWtCO3NCQUFwRCxZQUFZO3VCQUFDLG1CQUFtQjtnQkFFRixtQkFBbUI7c0JBQWpELFNBQVM7dUJBQUMsa0JBQWtCO2dCQWV6QixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFlbEIsVUFBVTtzQkFEYixLQUFLO3VCQUFDLGlCQUFpQjtnQkFlcEIsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLGVBQWU7Z0JBZWxCLFdBQVc7c0JBRGQsS0FBSzt1QkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJDb21tb25TdHJpbmdzU2VydmljZSB9IGZyb20gJy4uLy4uL3V0aWxzL2kxOG4vY29tbW9uLXN0cmluZ3Muc2VydmljZSc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFBhZ2VTaXplIH0gZnJvbSAnLi9kYXRhZ3JpZC1wYWdlLXNpemUnO1xuaW1wb3J0IHsgRGV0YWlsU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2RldGFpbC5zZXJ2aWNlJztcbmltcG9ydCB7IFBhZ2UgfSBmcm9tICcuL3Byb3ZpZGVycy9wYWdlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY2xyLWRnLXBhZ2luYXRpb24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhZGV0YWlsU2VydmljZS5pc09wZW5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLXNpemVcIiAqbmdJZj1cIl9wYWdlU2l6ZUNvbXBvbmVudFwiPlxuICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjbHItZGctcGFnZS1zaXplXCI+PC9uZy1jb250ZW50PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbi1kZXNjcmlwdGlvblwiPlxuICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLWxpc3RcIiAqbmdJZj1cInBhZ2UubGFzdCA+IDFcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwicGFnaW5hdGlvbi1maXJzdFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInBhZ2UuY3VycmVudCA8PSAxXCJcbiAgICAgICAgICAoY2xpY2spPVwicGFnZS5jdXJyZW50ID0gMVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMuZmlyc3RQYWdlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMuZmlyc3RQYWdlIH19PC9zcGFuPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cInN0ZXAtZm9yd2FyZC0yXCIgZGlyZWN0aW9uPVwiZG93blwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uLXByZXZpb3VzXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwicGFnZS5jdXJyZW50IDw9IDFcIlxuICAgICAgICAgIChjbGljayk9XCJwYWdlLmN1cnJlbnQgPSBwYWdlLmN1cnJlbnQgLSAxXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5wcmV2aW91c1BhZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5wcmV2aW91c1BhZ2UgfX08L3NwYW4+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwiYW5nbGVcIiBkaXJlY3Rpb249XCJsZWZ0XCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLXBhZ2VzXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAqbmdJZj1cIiFkaXNhYmxlQ3VycmVudFBhZ2VJbnB1dDsgZWxzZSByZWFkT25seVwiXG4gICAgICAgICAgICAjY3VycmVudFBhZ2VJbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uLWN1cnJlbnQgY2xyLWlucHV0XCJcbiAgICAgICAgICAgIFtzaXplXT1cInBhZ2UubGFzdC50b1N0cmluZygpLmxlbmd0aFwiXG4gICAgICAgICAgICBbdmFsdWVdPVwicGFnZS5jdXJyZW50XCJcbiAgICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cInVwZGF0ZUN1cnJlbnRQYWdlKCRldmVudClcIlxuICAgICAgICAgICAgKGJsdXIpPVwidmVyaWZ5Q3VycmVudFBhZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5jdXJyZW50UGFnZVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgI3JlYWRPbmx5PlxuICAgICAgICAgICAgPHNwYW4+e3sgcGFnZS5jdXJyZW50IH19PC9zcGFuPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgICAmbmJzcDsvJm5ic3A7PHNwYW4gW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMudG90YWxQYWdlc1wiPnt7IHBhZ2UubGFzdCB9fTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb24tbmV4dFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInBhZ2UuY3VycmVudCA+PSBwYWdlLmxhc3RcIlxuICAgICAgICAgIChjbGljayk9XCJwYWdlLmN1cnJlbnQgPSBwYWdlLmN1cnJlbnQgKyAxXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5uZXh0UGFnZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLm5leHRQYWdlIH19PC9zcGFuPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwicGFnaW5hdGlvbi1sYXN0XCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwicGFnZS5jdXJyZW50ID49IHBhZ2UubGFzdFwiXG4gICAgICAgICAgKGNsaWNrKT1cInBhZ2UuY3VycmVudCA9IHBhZ2UubGFzdFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMubGFzdFBhZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5sYXN0UGFnZSB9fTwvc3Bhbj5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJzdGVwLWZvcndhcmQtMlwiIGRpcmVjdGlvbj1cInVwXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiZGV0YWlsU2VydmljZS5pc09wZW5cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLWRlc2NyaXB0aW9uLWNvbXBhY3RcIj5cbiAgICAgICAge3sgcGFnZS5maXJzdEl0ZW0gKyAxIH19LXt7IHBhZ2UubGFzdEl0ZW0gKyAxIH19IC8ge3sgcGFnZS50b3RhbEl0ZW1zIH19XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLWxpc3RcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgIGNsYXNzPVwicGFnaW5hdGlvbi1wcmV2aW91c1wiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInBhZ2UuY3VycmVudCA8PSAxXCJcbiAgICAgICAgICAoY2xpY2spPVwicGFnZS5jdXJyZW50ID0gcGFnZS5jdXJyZW50IC0gMVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMucHJldmlvdXNQYWdlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMucHJldmlvdXNQYWdlIH19PC9zcGFuPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwibGVmdFwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8c3Bhbj57eyBwYWdlLmN1cnJlbnQgfX08L3NwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb24tbmV4dFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInBhZ2UuY3VycmVudCA+PSBwYWdlLmxhc3RcIlxuICAgICAgICAgIChjbGljayk9XCJwYWdlLmN1cnJlbnQgPSBwYWdlLmN1cnJlbnQgKyAxXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5uZXh0UGFnZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLm5leHRQYWdlIH19PC9zcGFuPlxuICAgICAgICAgIDxjZHMtaWNvbiBzaGFwZT1cImFuZ2xlXCIgZGlyZWN0aW9uPVwicmlnaHRcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICBgLFxuICBob3N0OiB7ICdbY2xhc3MucGFnaW5hdGlvbl0nOiAndHJ1ZScgfSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRQYWdpbmF0aW9uIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuICBASW5wdXQoJ2NsckRnUGFnZUlucHV0RGlzYWJsZWQnKSBkaXNhYmxlQ3VycmVudFBhZ2VJbnB1dDogYm9vbGVhbjtcblxuICBAT3V0cHV0KCdjbHJEZ1BhZ2VDaGFuZ2UnKSBjdXJyZW50Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPihmYWxzZSk7XG5cbiAgQENvbnRlbnRDaGlsZChDbHJEYXRhZ3JpZFBhZ2VTaXplKSBfcGFnZVNpemVDb21wb25lbnQ6IENsckRhdGFncmlkUGFnZVNpemU7XG5cbiAgQFZpZXdDaGlsZCgnY3VycmVudFBhZ2VJbnB1dCcpIGN1cnJlbnRQYWdlSW5wdXRSZWY6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG5cbiAgLyoqXG4gICAqIFN1YnNjcmlwdGlvbiB0byB0aGUgcGFnZSBzZXJ2aWNlIGNoYW5nZXNcbiAgICovXG4gIHByaXZhdGUgX3BhZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFnZTogUGFnZSwgcHVibGljIGNvbW1vblN0cmluZ3M6IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlLCBwdWJsaWMgZGV0YWlsU2VydmljZTogRGV0YWlsU2VydmljZSkge1xuICAgIHBhZ2UuYWN0aXZhdGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYWdlIHNpemVcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdQYWdlU2l6ZScpXG4gIGdldCBwYWdlU2l6ZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2Uuc2l6ZTtcbiAgfVxuICBzZXQgcGFnZVNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgLy8gdG9kbyh2MTYpOiBSZW1vdmUgdGhpcyBjaGVjay4gVGhlIHByb3BlcnR5IHR5cGUgdXNlZCB0byBiZSBgc3RyaW5nIHwgbnVtYmVyYC4gSSBrZXB0IHRoaXMgY2hlY2sgdG8gbWFpbnRhaW4gdGhlIG5vLW9wIGlmIHlvdSBwYXNzIGEgc3RyaW5nLlxuICAgIGlmICh0eXBlb2Ygc2l6ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMucGFnZS5zaXplID0gc2l6ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG90YWwgaXRlbXMgKG5lZWRlZCB0byBndWVzcyB0aGUgbGFzdCBwYWdlKVxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1RvdGFsSXRlbXMnKVxuICBnZXQgdG90YWxJdGVtcygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2UudG90YWxJdGVtcztcbiAgfVxuICBzZXQgdG90YWxJdGVtcyh0b3RhbDogbnVtYmVyKSB7XG4gICAgLy8gdG9kbyh2MTYpOiBSZW1vdmUgdGhpcyBjaGVjay4gVGhlIHByb3BlcnR5IHR5cGUgdXNlZCB0byBiZSBgc3RyaW5nIHwgbnVtYmVyYC4gSSBrZXB0IHRoaXMgY2hlY2sgdG8gbWFpbnRhaW4gdGhlIG5vLW9wIGlmIHlvdSBwYXNzIGEgc3RyaW5nLlxuICAgIGlmICh0eXBlb2YgdG90YWwgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnBhZ2UudG90YWxJdGVtcyA9IHRvdGFsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMYXN0IHBhZ2VcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdMYXN0UGFnZScpXG4gIGdldCBsYXN0UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2UubGFzdDtcbiAgfVxuICBzZXQgbGFzdFBhZ2UobGFzdDogbnVtYmVyKSB7XG4gICAgLy8gdG9kbyh2MTYpOiBSZW1vdmUgdGhpcyBjaGVjay4gVGhlIHByb3BlcnR5IHR5cGUgdXNlZCB0byBiZSBgc3RyaW5nIHwgbnVtYmVyYC4gSSBrZXB0IHRoaXMgY2hlY2sgdG8gbWFpbnRhaW4gdGhlIG5vLW9wIGlmIHlvdSBwYXNzIGEgc3RyaW5nLlxuICAgIGlmICh0eXBlb2YgbGFzdCA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMucGFnZS5sYXN0ID0gbGFzdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudCBwYWdlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnUGFnZScpXG4gIGdldCBjdXJyZW50UGFnZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2UuY3VycmVudDtcbiAgfVxuICBzZXQgY3VycmVudFBhZ2UocGFnZTogbnVtYmVyKSB7XG4gICAgLy8gdG9kbyh2MTYpOiBSZW1vdmUgdGhpcyBjaGVjay4gVGhlIHByb3BlcnR5IHR5cGUgdXNlZCB0byBiZSBgc3RyaW5nIHwgbnVtYmVyYC4gSSBrZXB0IHRoaXMgY2hlY2sgdG8gbWFpbnRhaW4gdGhlIG5vLW9wIGlmIHlvdSBwYXNzIGEgc3RyaW5nLlxuICAgIGlmICh0eXBlb2YgcGFnZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXMucGFnZS5jdXJyZW50ID0gcGFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIGZpcnN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBjdXJyZW50IHBhZ2UsIHN0YXJ0aW5nIGF0IDAsIC0xIGlmIG5vbmUgZGlzcGxheWVkXG4gICAqL1xuICBnZXQgZmlyc3RJdGVtKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFnZS5maXJzdEl0ZW07XG4gIH1cblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIGxhc3QgaXRlbSBkaXNwbGF5ZWQgb24gdGhlIGN1cnJlbnQgcGFnZSwgc3RhcnRpbmcgYXQgMCwgLTEgaWYgbm9uZSBkaXNwbGF5ZWRcbiAgICovXG4gIGdldCBsYXN0SXRlbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2UubGFzdEl0ZW07XG4gIH1cblxuICAvKipcbiAgICogQ29uZGl0aW9uYWxseSBhZGRzIHBhZ2UgbnVtYmVycyBiZWZvcmUgYW5kIGFmdGVyIHRoZSBjdXJyZW50IHBhZ2VcbiAgICovXG4gIGdldCBtaWRkbGVQYWdlcygpOiBudW1iZXJbXSB7XG4gICAgY29uc3QgbWlkZGxlUGFnZXM6IG51bWJlcltdID0gW107XG4gICAgaWYgKHRoaXMucGFnZS5jdXJyZW50ID4gMSkge1xuICAgICAgbWlkZGxlUGFnZXMucHVzaCh0aGlzLnBhZ2UuY3VycmVudCAtIDEpO1xuICAgIH1cbiAgICBtaWRkbGVQYWdlcy5wdXNoKHRoaXMucGFnZS5jdXJyZW50KTtcbiAgICBpZiAodGhpcy5wYWdlLmN1cnJlbnQgPCB0aGlzLnBhZ2UubGFzdCkge1xuICAgICAgbWlkZGxlUGFnZXMucHVzaCh0aGlzLnBhZ2UuY3VycmVudCArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gbWlkZGxlUGFnZXM7XG4gIH1cblxuICAvKioqKioqKioqKlxuICAgKiBTdWJzY3JpcHRpb24gdG8gdGhlIFBhZ2Ugc2VydmljZSBmb3IgcGFnZSBjaGFuZ2VzLlxuICAgKiBOb3RlOiB0aGlzIG9ubHkgZW1pdHMgYWZ0ZXIgdGhlIGRhdGFncmlkIGlzIGluaXRpYWxpemVkL3N0YWJhbGl6ZWQgYW5kIHRoZSBwYWdlIGNoYW5nZXMuXG4gICAqL1xuICBuZ09uSW5pdCgpIHtcbiAgICAvKlxuICAgICAqIERlZmF1bHQgcGFnZSBzaXplIGlzIDEwLlxuICAgICAqIFRoZSByZWFzb24gd2Ugc2V0IGl0IGhlcmUgYW5kIG5vdCBpbiB0aGUgcHJvdmlkZXIgaXRzZWxmIGlzIGJlY2F1c2VcbiAgICAgKiB3ZSBkb24ndCB3YW50IHBhZ2luYXRpb24gaWYgdGhpcyBjb21wb25lbnQgaXNuJ3QgcHJlc2VudCBpbiB0aGUgZGF0YWdyaWQuXG4gICAgICovXG4gICAgaWYgKCF0aGlzLnBhZ2Uuc2l6ZSkge1xuICAgICAgdGhpcy5wYWdlLnNpemUgPSAxMDtcbiAgICB9XG4gICAgdGhpcy5fcGFnZVN1YnNjcmlwdGlvbiA9IHRoaXMucGFnZS5jaGFuZ2Uuc3Vic2NyaWJlKGN1cnJlbnQgPT4gdGhpcy5jdXJyZW50Q2hhbmdlZC5lbWl0KGN1cnJlbnQpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucGFnZS5yZXNldFBhZ2VTaXplKHRydWUpO1xuICAgIGlmICh0aGlzLl9wYWdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9wYWdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRvIHRoZSBwcmV2aW91cyBwYWdlIGlmIGl0IGV4aXN0c1xuICAgKi9cbiAgcHJldmlvdXMoKSB7XG4gICAgdGhpcy5wYWdlLnByZXZpb3VzKCk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdG8gdGhlIG5leHQgcGFnZSBpZiBpdCBleGlzdHNcbiAgICovXG4gIG5leHQoKSB7XG4gICAgdGhpcy5wYWdlLm5leHQoKTtcbiAgfVxuXG4gIHZlcmlmeUN1cnJlbnRQYWdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChldmVudC50YXJnZXQudmFsdWUsIDEwKTtcbiAgICBpZiAocGFyc2VkICE9PSB0aGlzLnBhZ2UuY3VycmVudCkge1xuICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gdGhpcy5wYWdlLmN1cnJlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdlIG9ubHkgdXBkYXRlIHRoZSBwYWdpbmF0aW9uJ3MgY3VycmVudCBwYWdlIG9uIGVudGVyLlxuICAgKi9cbiAgdXBkYXRlQ3VycmVudFBhZ2UoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuXG4gICAgLy8gaWYgdGhlIGlucHV0IHZhbHVlLCBpcyBub3QgYSBudW1iZXIsIHdlIGRvbid0IHVwZGF0ZSB0aGUgcGFnZVxuICAgIGlmICghaXNOYU4ocGFyc2VkKSkge1xuICAgICAgaWYgKHBhcnNlZCA8IDEpIHtcbiAgICAgICAgdGhpcy5wYWdlLmN1cnJlbnQgPSAxO1xuICAgICAgfSBlbHNlIGlmIChwYXJzZWQgPiB0aGlzLnBhZ2UubGFzdCkge1xuICAgICAgICB0aGlzLnBhZ2UuY3VycmVudCA9IHRoaXMucGFnZS5sYXN0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wYWdlLmN1cnJlbnQgPSBwYXJzZWQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBpbnB1dCdzIHZhbHVlIHRvIHRoZSBuZXcgY3VycmVudCBwYWdlLiBUaGlzIGlzIG5lZWRlZCBiZWNhdXNlIHRoZSBjb2RlXG4gICAgICogYWJvdmUgbWF5IGhhdmUgY2hhbmdlZCB0aGUgdmFsdWUgZnJvbSB3aGF0IHRoZSB1c2VyIGVudGVyZWQgaW4uXG4gICAgICovXG4gICAgdGhpcy5jdXJyZW50UGFnZUlucHV0UmVmLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLnBhZ2UuY3VycmVudC50b1N0cmluZygpO1xuICB9XG59XG4iXX0=