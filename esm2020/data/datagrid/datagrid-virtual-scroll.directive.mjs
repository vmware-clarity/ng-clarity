/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY } from '@angular/cdk/collections';
import { CdkVirtualForOf, CdkVirtualScrollable, CdkVirtualScrollViewport, FixedSizeVirtualScrollStrategy, ScrollDispatcher, ViewportRuler, VIRTUAL_SCROLL_STRATEGY, } from '@angular/cdk/scrolling';
import { VERSION as ANGULAR_VERSION, ChangeDetectorRef, Directive, ElementRef, EnvironmentInjector, EventEmitter, forwardRef, Inject, inject, Injector, Input, IterableDiffers, NgZone, Output, Renderer2, TemplateRef, ViewContainerRef, } from '@angular/core';
import { ClrDatagrid } from './datagrid';
import { Items } from './providers/items';
import * as i0 from "@angular/core";
import * as i1 from "./providers/items";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/scrolling";
import * as i4 from "./providers/columns.service";
import * as i5 from "./datagrid";
export class ClrDatagridVirtualScrollDirective {
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
        this.shouldUpdateAriaRowIndexes = false;
        this._isUserProvidedItemSize = false;
        this._itemSize = 33;
        this._minBufferPx = 200;
        this._maxBufferPx = 400;
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
        return this.virtualScrollViewport?._totalContentHeight || '';
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
        this.injector.runInContext(() => {
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
    updateItemSize(value) {
        this._itemSize = coerceNumberProperty(value);
        this.updateFixedSizeVirtualScrollInputs();
    }
    updateDataRange(skip, data) {
        let items = this.cdkVirtualForOf;
        if (!this.persistItems || !items || items?.length !== this.totalItems) {
            items = Array(this.totalItems);
        }
        items.splice(skip, data.length, ...data);
        this.cdkVirtualForOf = Array.from(items);
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
}
ClrDatagridVirtualScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.Items }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality }, { token: i3.ScrollDispatcher }, { token: i3.ViewportRuler }, { token: forwardRef(() => ClrDatagrid) }, { token: i4.ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVirtualScroll],[ClrVirtualScroll]',
                    providers: [Items],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.Items }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i2.Directionality }, { type: i3.ScrollDispatcher }, { type: i3.ViewportRuler }, { type: i5.ClrDatagrid, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => ClrDatagrid)]
                }] }, { type: i4.ColumnsService }, { type: i0.EnvironmentInjector }]; }, propDecorators: { renderedRangeChange: [{
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
    let viewPort;
    if (+ANGULAR_VERSION.major < 19) {
        viewPort = new CdkVirtualScrollViewport(datagridDivElementRef, changeDetectorRef, ngZone, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, scrollable);
    }
    else {
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
        viewPort = virtualScrollViewportInjector.get(CdkVirtualScrollViewport);
    }
    viewPort._contentWrapper = contentWrapper;
    return viewPort;
}
function createCdkVirtualForOfDirective(viewContainerRef, templateRef, iterableDiffers, viewRepeater, virtualScrollViewport, ngZone) {
    if (+ANGULAR_VERSION.major < 19) {
        return new CdkVirtualForOf(viewContainerRef, templateRef, iterableDiffers, viewRepeater, virtualScrollViewport, ngZone);
    }
    else {
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsZUFBZSxFQUNmLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd6QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFnQjFDLE1BQU0sT0FBTyxpQ0FBaUM7SUF3QzVDLFlBQ21CLGlCQUFvQyxFQUM3QyxlQUFnQyxFQUNoQyxLQUFlLEVBQ04sTUFBYyxFQUNkLFNBQW9CLEVBQ3BCLFdBQW1ELEVBQ25ELGdCQUFrQyxF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LFFBQVEsRUFBRSxXQUFXLEVBQUU7Z0JBQy9DLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFO2dCQUN2RCxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFO2dCQUM1RCxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDckMsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUU7YUFDeEQ7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztLQUNuRDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgY29lcmNlTnVtYmVyUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneSwgX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIExpc3RSYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5pbXBvcnQge1xuICBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLFxuICBDZGtWaXJ0dWFsRm9yT2YsXG4gIENka1ZpcnR1YWxGb3JPZkNvbnRleHQsXG4gIENka1ZpcnR1YWxTY3JvbGxhYmxlLFxuICBDZGtWaXJ0dWFsU2Nyb2xsYWJsZUVsZW1lbnQsXG4gIENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICBTY3JvbGxEaXNwYXRjaGVyLFxuICBWaWV3cG9ydFJ1bGVyLFxuICBWSVJUVUFMX1NDUk9MTF9TVFJBVEVHWSxcbiAgVmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIFZFUlNJT04gYXMgQU5HVUxBUl9WRVJTSU9OLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEVudmlyb25tZW50SW5qZWN0b3IsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBpbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvdmlydHVhbC1zY3JvbGwtZGF0YS1yYW5nZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0S2V5ID1cbiAgfCAnY2RrVmlydHVhbEZvck9mJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVHJhY2tCeSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSBQYXJ0aWFsPFBpY2s8Q2RrVmlydHVhbEZvck9mPFQ+LCBDZGtWaXJ0dWFsRm9ySW5wdXRLZXk+PjtcblxudHlwZSBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0gUGljazxDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCAnaXRlbVNpemUnIHwgJ21pbkJ1ZmZlclB4JyB8ICdtYXhCdWZmZXJQeCc+O1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyVmlydHVhbFNjcm9sbF0sW0NsclZpcnR1YWxTY3JvbGxdJyxcbiAgcHJvdmlkZXJzOiBbSXRlbXNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmU8VD4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCkgcmVuZGVyZWRSYW5nZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TGlzdFJhbmdlPigpO1xuICBASW5wdXQoJ2NsclZpcnR1YWxQZXJzaXN0SXRlbXMnKSBwZXJzaXN0SXRlbXMgPSB0cnVlO1xuXG4gIHByaXZhdGUgc2hvdWxkVXBkYXRlQXJpYVJvd0luZGV4ZXMgPSBmYWxzZTtcblxuICBwcml2YXRlIF9pc1VzZXJQcm92aWRlZEl0ZW1TaXplID0gZmFsc2U7XG4gIHByaXZhdGUgX2l0ZW1TaXplID0gMzM7XG4gIHByaXZhdGUgX21pbkJ1ZmZlclB4ID0gMjAwO1xuICBwcml2YXRlIF9tYXhCdWZmZXJQeCA9IDQwMDtcblxuICBwcml2YXRlIHJlYWRvbmx5IGRhdGFncmlkRWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgcHJpdmF0ZSBncmlkUm9sZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSByZWFkb25seSB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneTtcbiAgcHJpdmF0ZSB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcbiAgcHJpdmF0ZSBjZGtWaXJ0dWFsRm9yOiBDZGtWaXJ0dWFsRm9yT2Y8VD47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgcHJpdmF0ZSB0b3BJbmRleCA9IDA7XG5cbiAgLy8gQGRlcHJlY2F0ZWQgcmVtb3ZlIHRoZSBtdXRhdGlvbiBvYnNlcnZlciB3aGVuIGBkYXRhZ3JpZC1jb21wYWN0YCBjbGFzcyBpcyBkZWxldGVkXG4gIHByaXZhdGUgbXV0YXRpb25DaGFuZ2VzOiBNdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbjogTXV0YXRpb25SZWNvcmQpID0+IHtcbiAgICAgIC8vIGl0IGlzIHBvc3NpYmxlIHRoaXMgdG8gYmUgY2FsbGVkIHR3aWNlIGJlY2F1c2UgdGhlIG9sZCBjbGFzcyBpcyByZW1vdmVkIGFuZCB0aGUgbmV3IGFkZGVkXG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLl9pc1VzZXJQcm92aWRlZEl0ZW1TaXplICYmXG4gICAgICAgIChtdXRhdGlvbi50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygnZGF0YWdyaWQtY29tcGFjdCcpICYmXG4gICAgICAgIHRoaXMuaXRlbVNpemUgPiAyNVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMudXBkYXRlSXRlbVNpemUoMjUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG4gIHByaXZhdGUgX3RvdGFsSXRlbXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gQ2xyRGF0YWdyaWQpKSBwcml2YXRlIHJlYWRvbmx5IGRhdGFncmlkOiBDbHJEYXRhZ3JpZCxcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuICAgIGRhdGFncmlkLmRldGFpbFNlcnZpY2UucHJldmVudEZvY3VzU2Nyb2xsID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmID0gZGF0YWdyaWQuZWw7XG5cbiAgICAvLyBkZWZhdWx0XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSAyMDtcblxuICAgIGNvbnN0IGNlbGxIZWlnaHRUb2tlbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmdldFByb3BlcnR5VmFsdWUoJy0tY2xyLXRhYmxlLWNlbGwtaGVpZ2h0Jyk7XG4gICAgY29uc3QgY2VsbEhlaWdodFZhbHVlID0gKy9jYWxjXFwoKFswLTldKykgXFwqIGNhbGNcXChcXCgxcmVtIFxcLyAyMFxcKSBcXCogMVxcKVxcKS8uZXhlYyhjZWxsSGVpZ2h0VG9rZW4pPy5bMV07XG5cbiAgICBjb25zdCBib3JkZXJXaWR0aFRva2VuID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1jbHItdGFibGUtYm9yZGVyd2lkdGgnKTtcbiAgICBjb25zdCBib3JkZXJXaWR0aFZhbHVlID0gKy9jYWxjXFwoKFswLTldKykgXFwqIFxcKDFyZW0gXFwvIDIwXFwpXFwpLy5leGVjKGJvcmRlcldpZHRoVG9rZW4pPy5bMV07XG5cbiAgICAvLyBpbml0aWFsbHkgcm93SGVpZ2h0VmFsdWUgaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiBgLS1jbHItdGFibGUtcm93LWhlaWdodGAgdGhhdCBoYWQgYSBkaXNjcmVldCB2YWx1ZS5cbiAgICAvLyBjdXJyZW50bHkgYC0tY2xyLXRhYmxlLXJvdy1oZWlnaHRgIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gYC0tY2xyLXRhYmxlLWNlbGwtaGVpZ2h0YCArIGAtLWNsci10YWJsZS1ib3JkZXJ3aWR0aGBcbiAgICBjb25zdCByb3dIZWlnaHRWYWx1ZSA9IGNlbGxIZWlnaHRWYWx1ZSArIGJvcmRlcldpZHRoVmFsdWU7XG5cbiAgICBpZiAocm93SGVpZ2h0VmFsdWUgJiYgdGhpcy5pdGVtU2l6ZSA+IHJvd0hlaWdodFZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUl0ZW1TaXplKHJvd0hlaWdodFZhbHVlKTtcbiAgICB9XG5cbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcy5vYnNlcnZlKHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcyddLFxuICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneSA9IG5ldyBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3kodGhpcy5pdGVtU2l6ZSwgdGhpcy5taW5CdWZmZXJQeCwgdGhpcy5tYXhCdWZmZXJQeCk7XG4gIH1cblxuICBnZXQgdG90YWxDb250ZW50SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8uX3RvdGFsQ29udGVudEhlaWdodCB8fCAnJztcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NPZicpXG4gIGdldCBjZGtWaXJ0dWFsRm9yT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yT2Y7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JPZih2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvck9mJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mID0gdmFsdWU7XG4gICAgdGhpcy5pdGVtcy5hbGwgPSB2YWx1ZSBhcyBUW107XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVHJhY2tCeScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVHJhY2tCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUcmFja0J5O1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVHJhY2tCeSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRyYWNrQnknXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RlbXBsYXRlJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcz8uY2RrVmlydHVhbEZvcklucHV0cz8uY2RrVmlydHVhbEZvclRlbXBsYXRlO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RlbXBsYXRlQ2FjaGVTaXplJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzSXRlbVNpemUnKVxuICBnZXQgaXRlbVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZW1TaXplO1xuICB9XG4gIHNldCBpdGVtU2l6ZSh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snaXRlbVNpemUnXSkge1xuICAgIHRoaXMuX2lzVXNlclByb3ZpZGVkSXRlbVNpemUgPSB0cnVlO1xuICAgIHRoaXMudXBkYXRlSXRlbVNpemUodmFsdWUpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c01pbkJ1ZmZlclB4JylcbiAgZ2V0IG1pbkJ1ZmZlclB4KCkge1xuICAgIHJldHVybiB0aGlzLl9taW5CdWZmZXJQeDtcbiAgfVxuICBzZXQgbWluQnVmZmVyUHgodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ21pbkJ1ZmZlclB4J10pIHtcbiAgICB0aGlzLl9taW5CdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNYXhCdWZmZXJQeCcpXG4gIGdldCBtYXhCdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF4QnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1heEJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtYXhCdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fbWF4QnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxEYXRhUmFuZ2UnKVxuICBzZXQgZGF0YVJhbmdlKHJhbmdlOiBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxSYW5nZUludGVyZmFjZTxUPikge1xuICAgIGlmICghcmFuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgdGhpcy5pdGVtcy5zbWFydGVuRG93bigpO1xuICAgIH1cblxuICAgIHRoaXMudG90YWxJdGVtcyA9IHJhbmdlLnRvdGFsO1xuXG4gICAgdGhpcy51cGRhdGVEYXRhUmFuZ2UocmFuZ2Uuc2tpcCwgcmFuZ2UuZGF0YSk7XG4gIH1cblxuICBnZXQgdG90YWxJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJdGVtcztcbiAgfVxuXG4gIHByaXZhdGUgc2V0IHRvdGFsSXRlbXModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3RvdGFsSXRlbXMgPSB2YWx1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmluamVjdG9yLnJ1bkluQ29udGV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydCA9IHRoaXMuY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHRoaXMubmdab25lLFxuICAgICAgICB0aGlzLnJlbmRlcmVyMixcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgICB0aGlzLnZpZXdwb3J0UnVsZXIsXG4gICAgICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLFxuICAgICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICAgICAgKTtcblxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yID0gY3JlYXRlQ2RrVmlydHVhbEZvck9mRGlyZWN0aXZlKFxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHRoaXMudGVtcGxhdGVSZWYsXG4gICAgICAgIHRoaXMuaXRlcmFibGVEaWZmZXJzLFxuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlcixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gICAgICAgIHRoaXMubmdab25lXG4gICAgICApO1xuXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5uZ09uSW5pdCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQgPSB0aGlzLmRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbcm9sZT1cImdyaWRcIl0nKTtcblxuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLml0ZW1zLmNoYW5nZS5zdWJzY3JpYmUobmV3SXRlbXMgPT4ge1xuICAgICAgICBpZiAodGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5jZGtWaXJ0dWFsRm9yT2YgPSBuZXdJdGVtcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzID0gdHJ1ZTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yLmRhdGFTdHJlYW0uc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dDb3VudChkYXRhLmxlbmd0aCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LnNjcm9sbGVkSW5kZXhDaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgICAgdGhpcy50b3BJbmRleCA9IGluZGV4O1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5yZW5kZXJlZFJhbmdlU3RyZWFtLnN1YnNjcmliZShyZW5kZXJlZFJhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZFJhbmdlQ2hhbmdlLmVtaXQocmVuZGVyZWRSYW5nZSk7XG4gICAgICAgIHRoaXMuc2hvdWxkVXBkYXRlQXJpYVJvd0luZGV4ZXMgPSB0cnVlO1xuICAgICAgfSksXG4gICAgICB0aGlzLmRhdGFncmlkLnJlZnJlc2guc3Vic2NyaWJlKGRhdGFncmlkU3RhdGUgPT4ge1xuICAgICAgICBpZiAoZGF0YWdyaWRTdGF0ZS5maWx0ZXJzKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KDApO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1uc1N0YXRlQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudmlld1JlcGVhdGVyLmRldGFjaCgpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcj8ubmdEb0NoZWNrKCk7XG4gICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlQXJpYVJvd0luZGV4ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlQXJpYVJvd0luZGV4ZXMoKTtcblxuICAgICAgdGhpcy5zaG91bGRVcGRhdGVBcmlhUm93SW5kZXhlcyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcj8ubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8ubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcz8uZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjcm9sbFVwKG9mZnNldDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy50b3BJbmRleCAtIG9mZnNldCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgc2Nyb2xsRG93bihvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggKyBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbFRvSW5kZXgoaW5kZXg6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/LnNjcm9sbFRvSW5kZXgoaW5kZXgsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlSXRlbVNpemUodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ2l0ZW1TaXplJ10pIHtcbiAgICB0aGlzLl9pdGVtU2l6ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGF0YVJhbmdlKHNraXA6IG51bWJlciwgZGF0YTogVFtdKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5jZGtWaXJ0dWFsRm9yT2YgYXMgVFtdO1xuXG4gICAgaWYgKCF0aGlzLnBlcnNpc3RJdGVtcyB8fCAhaXRlbXMgfHwgaXRlbXM/Lmxlbmd0aCAhPT0gdGhpcy50b3RhbEl0ZW1zKSB7XG4gICAgICBpdGVtcyA9IEFycmF5KHRoaXMudG90YWxJdGVtcyk7XG4gICAgfVxuXG4gICAgaXRlbXMuc3BsaWNlKHNraXAsIGRhdGEubGVuZ3RoLCAuLi5kYXRhKTtcblxuICAgIHRoaXMuY2RrVmlydHVhbEZvck9mID0gQXJyYXkuZnJvbShpdGVtcyk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcikge1xuICAgICAgZm9yIChjb25zdCBjZGtWaXJ0dWFsRm9ySW5wdXRLZXkgb2YgT2JqZWN0LmtleXModGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzKSBhcyBDZGtWaXJ0dWFsRm9ySW5wdXRLZXlbXSkge1xuICAgICAgICBpZiAodGhpcy5jZGtWaXJ0dWFsRm9yW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gIT09IHRoaXMuY2RrVmlydHVhbEZvcklucHV0c1tjZGtWaXJ0dWFsRm9ySW5wdXRLZXldKSB7XG4gICAgICAgICAgKHRoaXMuY2RrVmlydHVhbEZvciBhcyBhbnkpW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gPSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpIHtcbiAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5LnVwZGF0ZUl0ZW1BbmRCdWZmZXJTaXplKHRoaXMuaXRlbVNpemUsIHRoaXMubWluQnVmZmVyUHgsIHRoaXMubWF4QnVmZmVyUHgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQXJpYVJvd0NvdW50KHJvd0NvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLmdyaWRSb2xlRWxlbWVudD8uc2V0QXR0cmlidXRlKCdhcmlhLXJvd2NvdW50Jywgcm93Q291bnQudG9TdHJpbmcoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dJbmRleGVzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj47XG5cbiAgICAgIGNvbnN0IHJvb3RFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IHZpZXdSZWYucm9vdE5vZGVzO1xuICAgICAgY29uc3QgZGF0YWdyaWRSb3dFbGVtZW50ID0gcm9vdEVsZW1lbnRzLmZpbmQocm93RWxlbWVudCA9PiByb3dFbGVtZW50LnRhZ05hbWUgPT09ICdDTFItREctUk9XJyk7XG4gICAgICBjb25zdCByb3dSb2xlRWxlbWVudCA9IGRhdGFncmlkUm93RWxlbWVudD8ucXVlcnlTZWxlY3RvcignW3JvbGU9XCJyb3dcIl0nKTtcblxuICAgICAgY29uc3QgbmV3QXJpYVJvd0luZGV4ID0gKHZpZXdSZWYuY29udGV4dC5pbmRleCArIDEpLnRvU3RyaW5nKCk7XG4gICAgICBpZiAocm93Um9sZUVsZW1lbnQ/LmdldEF0dHJpYnV0ZSgnYXJpYS1yb3dpbmRleCcpICE9PSBuZXdBcmlhUm93SW5kZXgpIHtcbiAgICAgICAgLy8gYXJpYS1yb3dpbmRleCBzaG91bGQgc3RhcnQgd2l0aCBvbmUsIG5vdCB6ZXJvLCBzbyB3ZSBoYXZlIHRvIGFkZCBvbmUgdG8gdGhlIHplcm8tYmFzZWQgaW5kZXhcbiAgICAgICAgcm93Um9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3dpbmRleCcsIG5ld0FyaWFSb3dJbmRleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVWaXJ0dWFsU2Nyb2xsVmlld3BvcnRGb3JEYXRhZ3JpZChcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBkYXRhZ3JpZEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5XG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkQ29udGVudEVsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkLWNvbnRlbnQnKTtcbiAgICBjb25zdCBkYXRhZ3JpZFJvd3NFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC1yb3dzJyk7XG5cbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSBjcmVhdGVDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gICAgICBuZXcgRWxlbWVudFJlZihkYXRhZ3JpZENvbnRlbnRFbGVtZW50KSxcbiAgICAgIG5ldyBFbGVtZW50UmVmKGRhdGFncmlkUm93c0VsZW1lbnQpLFxuICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICByZW5kZXJlcjIsXG4gICAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBkaXJlY3Rpb25hbGl0eSxcbiAgICAgIHNjcm9sbERpc3BhdGNoZXIsXG4gICAgICB2aWV3cG9ydFJ1bGVyLFxuICAgICAgbnVsbCBhcyBhbnkgYXMgQ2RrVmlydHVhbFNjcm9sbGFibGVFbGVtZW50XG4gICAgKTtcblxuICAgIHJldHVybiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICBkYXRhZ3JpZERpdkVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBjb250ZW50V3JhcHBlcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgbmdab25lOiBOZ1pvbmUsXG4gIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IFZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICBzY3JvbGxhYmxlOiBDZGtWaXJ0dWFsU2Nyb2xsYWJsZVxuKSB7XG4gIGxldCB2aWV3UG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBpZiAoK0FOR1VMQVJfVkVSU0lPTi5tYWpvciA8IDE5KSB7XG4gICAgdmlld1BvcnQgPSBuZXcgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgZGF0YWdyaWREaXZFbGVtZW50UmVmLFxuICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBkaXJlY3Rpb25hbGl0eSxcbiAgICAgIHNjcm9sbERpc3BhdGNoZXIsXG4gICAgICB2aWV3cG9ydFJ1bGVyLFxuICAgICAgc2Nyb2xsYWJsZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBpbmplY3QoRW52aXJvbm1lbnRJbmplY3RvciksXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBFbGVtZW50UmVmLCB1c2VWYWx1ZTogZGF0YWdyaWREaXZFbGVtZW50UmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2hhbmdlRGV0ZWN0b3JSZWYsIHVzZVZhbHVlOiBjaGFuZ2VEZXRlY3RvclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFJlbmRlcmVyMiwgdXNlVmFsdWU6IHJlbmRlcmVyMiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFN0cmF0ZWd5IH0sXG4gICAgICAgIHsgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksIHVzZVZhbHVlOiBkaXJlY3Rpb25hbGl0eSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFNjcm9sbERpc3BhdGNoZXIsIHVzZVZhbHVlOiBzY3JvbGxEaXNwYXRjaGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVmlld3BvcnRSdWxlciwgdXNlVmFsdWU6IHZpZXdwb3J0UnVsZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSwgdXNlVmFsdWU6IHNjcm9sbGFibGUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZUNsYXNzOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB2aWV3UG9ydCA9IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yLmdldChDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQpO1xuICB9XG4gIHZpZXdQb3J0Ll9jb250ZW50V3JhcHBlciA9IGNvbnRlbnRXcmFwcGVyO1xuICByZXR1cm4gdmlld1BvcnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZTxUPihcbiAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+LFxuICBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgdmlld1JlcGVhdGVyOiBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+LFxuICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgbmdab25lOiBOZ1pvbmVcbikge1xuICBpZiAoK0FOR1VMQVJfVkVSU0lPTi5tYWpvciA8IDE5KSB7XG4gICAgcmV0dXJuIG5ldyBDZGtWaXJ0dWFsRm9yT2Y8VD4oXG4gICAgICB2aWV3Q29udGFpbmVyUmVmLFxuICAgICAgdGVtcGxhdGVSZWYsXG4gICAgICBpdGVyYWJsZURpZmZlcnMsXG4gICAgICB2aWV3UmVwZWF0ZXIsXG4gICAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gICAgICBuZ1pvbmVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpLFxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZVZhbHVlOiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgfV0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFZpZXdDb250YWluZXJSZWYsIHVzZVZhbHVlOiB2aWV3Q29udGFpbmVyUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVGVtcGxhdGVSZWYsIHVzZVZhbHVlOiB0ZW1wbGF0ZVJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IEl0ZXJhYmxlRGlmZmVycywgdXNlVmFsdWU6IGl0ZXJhYmxlRGlmZmVycyB9LFxuICAgICAgICB7IHByb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VWYWx1ZTogdmlld1JlcGVhdGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTmdab25lLCB1c2VWYWx1ZTogbmdab25lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbEZvck9mLCB1c2VDbGFzczogQ2RrVmlydHVhbEZvck9mIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNka1ZpcnR1YWxGb3JJbmplY3Rvci5nZXQoQ2RrVmlydHVhbEZvck9mKTtcbiAgfVxufVxuIl19