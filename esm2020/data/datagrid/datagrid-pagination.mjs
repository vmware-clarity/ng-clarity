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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtcGFnaW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIvc3JjL2RhdGEvZGF0YWdyaWQvZGF0YWdyaWQtcGFnaW5hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7R0FLRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUVaLFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUl2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7Ozs7OztBQXdHM0QsTUFBTSxPQUFPLHFCQUFxQjtJQWNoQyxZQUFtQixJQUFVLEVBQVMsYUFBc0MsRUFBUyxhQUE0QjtRQUE5RixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQXlCO1FBQVMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFYdEYsbUJBQWMsR0FBRyxJQUFJLFlBQVksQ0FBUyxLQUFLLENBQUMsQ0FBQztRQVkxRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxJQUFZO1FBQ3ZCLDhJQUE4STtRQUM5SSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUNJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzlCLENBQUM7SUFDRCxJQUFJLFVBQVUsQ0FBQyxLQUFhO1FBQzFCLDhJQUE4STtRQUM5SSxJQUFJ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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErRlQ7b0JBQ0QsSUFBSSxFQUFFLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFO2lCQUN2Qzs2SkFFa0MsdUJBQXVCO3NCQUF2RCxLQUFLO3VCQUFDLHdCQUF3QjtnQkFFSixjQUFjO3NCQUF4QyxNQUFNO3VCQUFDLGlCQUFpQjtnQkFFVSxrQkFBa0I7c0JBQXBELFlBQVk7dUJBQUMsbUJBQW1CO2dCQUVGLG1CQUFtQjtzQkFBakQsU0FBUzt1QkFBQyxrQkFBa0I7Z0JBZXpCLFFBQVE7c0JBRFgsS0FBSzt1QkFBQyxlQUFlO2dCQWVsQixVQUFVO3NCQURiLEtBQUs7dUJBQUMsaUJBQWlCO2dCQWVwQixRQUFRO3NCQURYLEtBQUs7dUJBQUMsZUFBZTtnQkFlbEIsV0FBVztzQkFEZCxLQUFLO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckNvbW1vblN0cmluZ3NTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vdXRpbHMvaTE4bi9jb21tb24tc3RyaW5ncy5zZXJ2aWNlJztcbmltcG9ydCB7IENsckRhdGFncmlkUGFnZVNpemUgfSBmcm9tICcuL2RhdGFncmlkLXBhZ2Utc2l6ZSc7XG5pbXBvcnQgeyBEZXRhaWxTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvZGV0YWlsLnNlcnZpY2UnO1xuaW1wb3J0IHsgUGFnZSB9IGZyb20gJy4vcHJvdmlkZXJzL3BhZ2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjbHItZGctcGFnaW5hdGlvbicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFkZXRhaWxTZXJ2aWNlLmlzT3BlblwiPlxuICAgICAgPGRpdiBjbGFzcz1cInBhZ2luYXRpb24tc2l6ZVwiICpuZ0lmPVwiX3BhZ2VTaXplQ29tcG9uZW50XCI+XG4gICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNsci1kZy1wYWdlLXNpemVcIj48L25nLWNvbnRlbnQ+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdpbmF0aW9uLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInBhZ2luYXRpb24tbGlzdFwiICpuZ0lmPVwicGFnZS5sYXN0ID4gMVwiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uLWZpcnN0XCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwicGFnZS5jdXJyZW50IDw9IDFcIlxuICAgICAgICAgIChjbGljayk9XCJwYWdlLmN1cnJlbnQgPSAxXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5maXJzdFBhZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5maXJzdFBhZ2UgfX08L3NwYW4+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwic3RlcC1mb3J3YXJkLTJcIiBkaXJlY3Rpb249XCJkb3duXCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb24tcHJldmlvdXNcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJwYWdlLmN1cnJlbnQgPD0gMVwiXG4gICAgICAgICAgKGNsaWNrKT1cInBhZ2UuY3VycmVudCA9IHBhZ2UuY3VycmVudCAtIDFcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLnByZXZpb3VzUGFnZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLnByZXZpb3VzUGFnZSB9fTwvc3Bhbj5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cImxlZnRcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgKm5nSWY9XCIhZGlzYWJsZUN1cnJlbnRQYWdlSW5wdXQ7IGVsc2UgcmVhZE9ubHlcIlxuICAgICAgICAgICNjdXJyZW50UGFnZUlucHV0XG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIGNsYXNzPVwicGFnaW5hdGlvbi1jdXJyZW50IGNsci1pbnB1dFwiXG4gICAgICAgICAgW3NpemVdPVwicGFnZS5sYXN0LnRvU3RyaW5nKCkubGVuZ3RoXCJcbiAgICAgICAgICBbdmFsdWVdPVwicGFnZS5jdXJyZW50XCJcbiAgICAgICAgICAoa2V5ZG93bi5lbnRlcik9XCJ1cGRhdGVDdXJyZW50UGFnZSgkZXZlbnQpXCJcbiAgICAgICAgICAoYmx1cik9XCJ2ZXJpZnlDdXJyZW50UGFnZSgkZXZlbnQpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy5jdXJyZW50UGFnZVwiXG4gICAgICAgIC8+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcmVhZE9ubHk+XG4gICAgICAgICAgPHNwYW4+e3sgcGFnZS5jdXJyZW50IH19PC9zcGFuPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgICZuYnNwOy8mbmJzcDs8c3BhbiBbYXR0ci5hcmlhLWxhYmVsXT1cImNvbW1vblN0cmluZ3Mua2V5cy50b3RhbFBhZ2VzXCI+e3sgcGFnZS5sYXN0IH19PC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uLW5leHRcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJwYWdlLmN1cnJlbnQgPj0gcGFnZS5sYXN0XCJcbiAgICAgICAgICAoY2xpY2spPVwicGFnZS5jdXJyZW50ID0gcGFnZS5jdXJyZW50ICsgMVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMubmV4dFBhZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5uZXh0UGFnZSB9fTwvc3Bhbj5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cInJpZ2h0XCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb24tbGFzdFwiXG4gICAgICAgICAgW2Rpc2FibGVkXT1cInBhZ2UuY3VycmVudCA+PSBwYWdlLmxhc3RcIlxuICAgICAgICAgIChjbGljayk9XCJwYWdlLmN1cnJlbnQgPSBwYWdlLmxhc3RcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLmxhc3RQYWdlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2xyLXNyLW9ubHlcIj57eyBjb21tb25TdHJpbmdzLmtleXMubGFzdFBhZ2UgfX08L3NwYW4+XG4gICAgICAgICAgPGNkcy1pY29uIHNoYXBlPVwic3RlcC1mb3J3YXJkLTJcIiBkaXJlY3Rpb249XCJ1cFwiPjwvY2RzLWljb24+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImRldGFpbFNlcnZpY2UuaXNPcGVuXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbi1kZXNjcmlwdGlvbi1jb21wYWN0XCI+XG4gICAgICAgIHt7IHBhZ2UuZmlyc3RJdGVtICsgMSB9fS17eyBwYWdlLmxhc3RJdGVtICsgMSB9fSAvIHt7IHBhZ2UudG90YWxJdGVtcyB9fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwicGFnaW5hdGlvbi1saXN0XCI+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICBjbGFzcz1cInBhZ2luYXRpb24tcHJldmlvdXNcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJwYWdlLmN1cnJlbnQgPD0gMVwiXG4gICAgICAgICAgKGNsaWNrKT1cInBhZ2UuY3VycmVudCA9IHBhZ2UuY3VycmVudCAtIDFcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiY29tbW9uU3RyaW5ncy5rZXlzLnByZXZpb3VzUGFnZVwiXG4gICAgICAgID5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNsci1zci1vbmx5XCI+e3sgY29tbW9uU3RyaW5ncy5rZXlzLnByZXZpb3VzUGFnZSB9fTwvc3Bhbj5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cImxlZnRcIj48L2Nkcy1pY29uPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHNwYW4+e3sgcGFnZS5jdXJyZW50IH19PC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgY2xhc3M9XCJwYWdpbmF0aW9uLW5leHRcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJwYWdlLmN1cnJlbnQgPj0gcGFnZS5sYXN0XCJcbiAgICAgICAgICAoY2xpY2spPVwicGFnZS5jdXJyZW50ID0gcGFnZS5jdXJyZW50ICsgMVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJjb21tb25TdHJpbmdzLmtleXMubmV4dFBhZ2VcIlxuICAgICAgICA+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbHItc3Itb25seVwiPnt7IGNvbW1vblN0cmluZ3Mua2V5cy5uZXh0UGFnZSB9fTwvc3Bhbj5cbiAgICAgICAgICA8Y2RzLWljb24gc2hhcGU9XCJhbmdsZVwiIGRpcmVjdGlvbj1cInJpZ2h0XCI+PC9jZHMtaWNvbj5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgYCxcbiAgaG9zdDogeyAnW2NsYXNzLnBhZ2luYXRpb25dJzogJ3RydWUnIH0sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkUGFnaW5hdGlvbiBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgQElucHV0KCdjbHJEZ1BhZ2VJbnB1dERpc2FibGVkJykgZGlzYWJsZUN1cnJlbnRQYWdlSW5wdXQ6IGJvb2xlYW47XG5cbiAgQE91dHB1dCgnY2xyRGdQYWdlQ2hhbmdlJykgY3VycmVudENoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oZmFsc2UpO1xuXG4gIEBDb250ZW50Q2hpbGQoQ2xyRGF0YWdyaWRQYWdlU2l6ZSkgX3BhZ2VTaXplQ29tcG9uZW50OiBDbHJEYXRhZ3JpZFBhZ2VTaXplO1xuXG4gIEBWaWV3Q2hpbGQoJ2N1cnJlbnRQYWdlSW5wdXQnKSBjdXJyZW50UGFnZUlucHV0UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+O1xuXG4gIC8qKlxuICAgKiBTdWJzY3JpcHRpb24gdG8gdGhlIHBhZ2Ugc2VydmljZSBjaGFuZ2VzXG4gICAqL1xuICBwcml2YXRlIF9wYWdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHVibGljIHBhZ2U6IFBhZ2UsIHB1YmxpYyBjb21tb25TdHJpbmdzOiBDbHJDb21tb25TdHJpbmdzU2VydmljZSwgcHVibGljIGRldGFpbFNlcnZpY2U6IERldGFpbFNlcnZpY2UpIHtcbiAgICBwYWdlLmFjdGl2YXRlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUGFnZSBzaXplXG4gICAqL1xuICBASW5wdXQoJ2NsckRnUGFnZVNpemUnKVxuICBnZXQgcGFnZVNpemUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlLnNpemU7XG4gIH1cbiAgc2V0IHBhZ2VTaXplKHNpemU6IG51bWJlcikge1xuICAgIC8vIHRvZG8odjE2KTogUmVtb3ZlIHRoaXMgY2hlY2suIFRoZSBwcm9wZXJ0eSB0eXBlIHVzZWQgdG8gYmUgYHN0cmluZyB8IG51bWJlcmAuIEkga2VwdCB0aGlzIGNoZWNrIHRvIG1haW50YWluIHRoZSBuby1vcCBpZiB5b3UgcGFzcyBhIHN0cmluZy5cbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnBhZ2Uuc2l6ZSA9IHNpemU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvdGFsIGl0ZW1zIChuZWVkZWQgdG8gZ3Vlc3MgdGhlIGxhc3QgcGFnZSlcbiAgICovXG4gIEBJbnB1dCgnY2xyRGdUb3RhbEl0ZW1zJylcbiAgZ2V0IHRvdGFsSXRlbXMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlLnRvdGFsSXRlbXM7XG4gIH1cbiAgc2V0IHRvdGFsSXRlbXModG90YWw6IG51bWJlcikge1xuICAgIC8vIHRvZG8odjE2KTogUmVtb3ZlIHRoaXMgY2hlY2suIFRoZSBwcm9wZXJ0eSB0eXBlIHVzZWQgdG8gYmUgYHN0cmluZyB8IG51bWJlcmAuIEkga2VwdCB0aGlzIGNoZWNrIHRvIG1haW50YWluIHRoZSBuby1vcCBpZiB5b3UgcGFzcyBhIHN0cmluZy5cbiAgICBpZiAodHlwZW9mIHRvdGFsID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy5wYWdlLnRvdGFsSXRlbXMgPSB0b3RhbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGFzdCBwYWdlXG4gICAqL1xuICBASW5wdXQoJ2NsckRnTGFzdFBhZ2UnKVxuICBnZXQgbGFzdFBhZ2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmxhc3Q7XG4gIH1cbiAgc2V0IGxhc3RQYWdlKGxhc3Q6IG51bWJlcikge1xuICAgIC8vIHRvZG8odjE2KTogUmVtb3ZlIHRoaXMgY2hlY2suIFRoZSBwcm9wZXJ0eSB0eXBlIHVzZWQgdG8gYmUgYHN0cmluZyB8IG51bWJlcmAuIEkga2VwdCB0aGlzIGNoZWNrIHRvIG1haW50YWluIHRoZSBuby1vcCBpZiB5b3UgcGFzcyBhIHN0cmluZy5cbiAgICBpZiAodHlwZW9mIGxhc3QgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnBhZ2UubGFzdCA9IGxhc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgcGFnZVxuICAgKi9cbiAgQElucHV0KCdjbHJEZ1BhZ2UnKVxuICBnZXQgY3VycmVudFBhZ2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmN1cnJlbnQ7XG4gIH1cbiAgc2V0IGN1cnJlbnRQYWdlKHBhZ2U6IG51bWJlcikge1xuICAgIC8vIHRvZG8odjE2KTogUmVtb3ZlIHRoaXMgY2hlY2suIFRoZSBwcm9wZXJ0eSB0eXBlIHVzZWQgdG8gYmUgYHN0cmluZyB8IG51bWJlcmAuIEkga2VwdCB0aGlzIGNoZWNrIHRvIG1haW50YWluIHRoZSBuby1vcCBpZiB5b3UgcGFzcyBhIHN0cmluZy5cbiAgICBpZiAodHlwZW9mIHBhZ2UgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzLnBhZ2UuY3VycmVudCA9IHBhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBmaXJzdCBpdGVtIGRpc3BsYXllZCBvbiB0aGUgY3VycmVudCBwYWdlLCBzdGFydGluZyBhdCAwLCAtMSBpZiBub25lIGRpc3BsYXllZFxuICAgKi9cbiAgZ2V0IGZpcnN0SXRlbSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhZ2UuZmlyc3RJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBsYXN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBjdXJyZW50IHBhZ2UsIHN0YXJ0aW5nIGF0IDAsIC0xIGlmIG5vbmUgZGlzcGxheWVkXG4gICAqL1xuICBnZXQgbGFzdEl0ZW0oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlLmxhc3RJdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmRpdGlvbmFsbHkgYWRkcyBwYWdlIG51bWJlcnMgYmVmb3JlIGFuZCBhZnRlciB0aGUgY3VycmVudCBwYWdlXG4gICAqL1xuICBnZXQgbWlkZGxlUGFnZXMoKTogbnVtYmVyW10ge1xuICAgIGNvbnN0IG1pZGRsZVBhZ2VzOiBudW1iZXJbXSA9IFtdO1xuICAgIGlmICh0aGlzLnBhZ2UuY3VycmVudCA+IDEpIHtcbiAgICAgIG1pZGRsZVBhZ2VzLnB1c2godGhpcy5wYWdlLmN1cnJlbnQgLSAxKTtcbiAgICB9XG4gICAgbWlkZGxlUGFnZXMucHVzaCh0aGlzLnBhZ2UuY3VycmVudCk7XG4gICAgaWYgKHRoaXMucGFnZS5jdXJyZW50IDwgdGhpcy5wYWdlLmxhc3QpIHtcbiAgICAgIG1pZGRsZVBhZ2VzLnB1c2godGhpcy5wYWdlLmN1cnJlbnQgKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIG1pZGRsZVBhZ2VzO1xuICB9XG5cbiAgLyoqKioqKioqKipcbiAgICogU3Vic2NyaXB0aW9uIHRvIHRoZSBQYWdlIHNlcnZpY2UgZm9yIHBhZ2UgY2hhbmdlcy5cbiAgICogTm90ZTogdGhpcyBvbmx5IGVtaXRzIGFmdGVyIHRoZSBkYXRhZ3JpZCBpcyBpbml0aWFsaXplZC9zdGFiYWxpemVkIGFuZCB0aGUgcGFnZSBjaGFuZ2VzLlxuICAgKi9cbiAgbmdPbkluaXQoKSB7XG4gICAgLypcbiAgICAgKiBEZWZhdWx0IHBhZ2Ugc2l6ZSBpcyAxMC5cbiAgICAgKiBUaGUgcmVhc29uIHdlIHNldCBpdCBoZXJlIGFuZCBub3QgaW4gdGhlIHByb3ZpZGVyIGl0c2VsZiBpcyBiZWNhdXNlXG4gICAgICogd2UgZG9uJ3Qgd2FudCBwYWdpbmF0aW9uIGlmIHRoaXMgY29tcG9uZW50IGlzbid0IHByZXNlbnQgaW4gdGhlIGRhdGFncmlkLlxuICAgICAqL1xuICAgIGlmICghdGhpcy5wYWdlLnNpemUpIHtcbiAgICAgIHRoaXMucGFnZS5zaXplID0gMTA7XG4gICAgfVxuICAgIHRoaXMuX3BhZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnBhZ2UuY2hhbmdlLnN1YnNjcmliZShjdXJyZW50ID0+IHRoaXMuY3VycmVudENoYW5nZWQuZW1pdChjdXJyZW50KSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnBhZ2UucmVzZXRQYWdlU2l6ZSh0cnVlKTtcbiAgICBpZiAodGhpcy5fcGFnZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fcGFnZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0byB0aGUgcHJldmlvdXMgcGFnZSBpZiBpdCBleGlzdHNcbiAgICovXG4gIHByZXZpb3VzKCkge1xuICAgIHRoaXMucGFnZS5wcmV2aW91cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRvIHRoZSBuZXh0IHBhZ2UgaWYgaXQgZXhpc3RzXG4gICAqL1xuICBuZXh0KCkge1xuICAgIHRoaXMucGFnZS5uZXh0KCk7XG4gIH1cblxuICB2ZXJpZnlDdXJyZW50UGFnZShldmVudDogYW55KTogdm9pZCB7XG4gICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQoZXZlbnQudGFyZ2V0LnZhbHVlLCAxMCk7XG4gICAgaWYgKHBhcnNlZCAhPT0gdGhpcy5wYWdlLmN1cnJlbnQpIHtcbiAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSA9IHRoaXMucGFnZS5jdXJyZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBvbmx5IHVwZGF0ZSB0aGUgcGFnaW5hdGlvbidzIGN1cnJlbnQgcGFnZSBvbiBlbnRlci5cbiAgICovXG4gIHVwZGF0ZUN1cnJlbnRQYWdlKGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChldmVudC50YXJnZXQudmFsdWUsIDEwKTtcblxuICAgIC8vIGlmIHRoZSBpbnB1dCB2YWx1ZSwgaXMgbm90IGEgbnVtYmVyLCB3ZSBkb24ndCB1cGRhdGUgdGhlIHBhZ2VcbiAgICBpZiAoIWlzTmFOKHBhcnNlZCkpIHtcbiAgICAgIGlmIChwYXJzZWQgPCAxKSB7XG4gICAgICAgIHRoaXMucGFnZS5jdXJyZW50ID0gMTtcbiAgICAgIH0gZWxzZSBpZiAocGFyc2VkID4gdGhpcy5wYWdlLmxhc3QpIHtcbiAgICAgICAgdGhpcy5wYWdlLmN1cnJlbnQgPSB0aGlzLnBhZ2UubGFzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFnZS5jdXJyZW50ID0gcGFyc2VkO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgaW5wdXQncyB2YWx1ZSB0byB0aGUgbmV3IGN1cnJlbnQgcGFnZS4gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgY29kZVxuICAgICAqIGFib3ZlIG1heSBoYXZlIGNoYW5nZWQgdGhlIHZhbHVlIGZyb20gd2hhdCB0aGUgdXNlciBlbnRlcmVkIGluLlxuICAgICAqL1xuICAgIHRoaXMuY3VycmVudFBhZ2VJbnB1dFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlID0gdGhpcy5wYWdlLmN1cnJlbnQudG9TdHJpbmcoKTtcbiAgfVxufVxuIl19