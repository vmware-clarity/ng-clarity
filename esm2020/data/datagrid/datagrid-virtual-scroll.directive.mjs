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
const defaultCdkFixedSizeVirtualScrollInputs = {
    itemSize: 32,
    minBufferPx: 200,
    maxBufferPx: 400,
};
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
        this._cdkFixedSizeVirtualScrollInputs = { ...defaultCdkFixedSizeVirtualScrollInputs };
        this.subscriptions = [];
        this.topIndex = 0;
        // @deprecated remove the mutation observer when `datagrid-compact` class is deleted
        this.mutationChanges = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // it is possible this to be called twice because the old class is removed and the new added
                if (mutation.target.classList.contains('datagrid-compact') && this.itemSize > 24) {
                    this.itemSize = 24;
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
        const rowHeightToken = window.getComputedStyle(document.body).getPropertyValue('--clr-table-row-height');
        const rowHeightValue = +/calc\(([0-9]+) \* calc\(\(1rem \/ 20\) \* 1\)\)/.exec(rowHeightToken)?.[1];
        if (rowHeightValue && this.itemSize > rowHeightValue) {
            this.itemSize = rowHeightValue;
        }
        this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
        this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(this._cdkFixedSizeVirtualScrollInputs.itemSize, this._cdkFixedSizeVirtualScrollInputs.minBufferPx, this._cdkFixedSizeVirtualScrollInputs.maxBufferPx);
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
        return this._cdkFixedSizeVirtualScrollInputs.itemSize;
    }
    set itemSize(value) {
        this._cdkFixedSizeVirtualScrollInputs.itemSize = coerceNumberProperty(value);
        this.updateFixedSizeVirtualScrollInputs();
    }
    get minBufferPx() {
        return this._cdkFixedSizeVirtualScrollInputs.minBufferPx;
    }
    set minBufferPx(value) {
        this._cdkFixedSizeVirtualScrollInputs.minBufferPx = coerceNumberProperty(value);
        this.updateFixedSizeVirtualScrollInputs();
    }
    get maxBufferPx() {
        return this._cdkFixedSizeVirtualScrollInputs.maxBufferPx;
    }
    set maxBufferPx(value) {
        this._cdkFixedSizeVirtualScrollInputs.maxBufferPx = coerceNumberProperty(value);
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
            this.virtualScrollStrategy.updateItemAndBufferSize(this._cdkFixedSizeVirtualScrollInputs.itemSize, this._cdkFixedSizeVirtualScrollInputs.minBufferPx, this._cdkFixedSizeVirtualScrollInputs.maxBufferPx);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsZUFBZSxFQUNmLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd6QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFZMUMsTUFBTSxzQ0FBc0MsR0FBb0M7SUFDOUUsUUFBUSxFQUFFLEVBQUU7SUFDWixXQUFXLEVBQUUsR0FBRztJQUNoQixXQUFXLEVBQUUsR0FBRztDQUNqQixDQUFDO0FBTUYsTUFBTSxPQUFPLGlD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ZSxFQUFFO2FBQ3hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDbkQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIENvcHlyaWdodCAoYykgMjAxNi0yMDI1IEJyb2FkY29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IGNvZXJjZU51bWJlclByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3ksIF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCBMaXN0UmFuZ2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCxcbiAgQ2RrVmlydHVhbEZvck9mLFxuICBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0LFxuICBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGVFbGVtZW50LFxuICBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgU2Nyb2xsRGlzcGF0Y2hlcixcbiAgVmlld3BvcnRSdWxlcixcbiAgVklSVFVBTF9TQ1JPTExfU1RSQVRFR1ksXG4gIFZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBWRVJTSU9OIGFzIEFOR1VMQVJfVkVSU0lPTixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFbnZpcm9ubWVudEluamVjdG9yLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdCxcbiAgaW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIEl0ZXJhYmxlRGlmZmVycyxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ2xyRGF0YWdyaWQgfSBmcm9tICcuL2RhdGFncmlkJztcbmltcG9ydCB7IENsckRhdGFncmlkVmlydHVhbFNjcm9sbFJhbmdlSW50ZXJmYWNlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL3ZpcnR1YWwtc2Nyb2xsLWRhdGEtcmFuZ2UuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvbHVtbnNTZXJ2aWNlIH0gZnJvbSAnLi9wcm92aWRlcnMvY29sdW1ucy5zZXJ2aWNlJztcbmltcG9ydCB7IEl0ZW1zIH0gZnJvbSAnLi9wcm92aWRlcnMvaXRlbXMnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dEtleSA9XG4gIHwgJ2Nka1ZpcnR1YWxGb3JPZidcbiAgfCAnY2RrVmlydHVhbEZvclRyYWNrQnknXG4gIHwgJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJztcblxudHlwZSBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+ID0gUGFydGlhbDxQaWNrPENka1ZpcnR1YWxGb3JPZjxUPiwgQ2RrVmlydHVhbEZvcklucHV0S2V5Pj47XG5cbnR5cGUgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IFBpY2s8Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCwgJ2l0ZW1TaXplJyB8ICdtaW5CdWZmZXJQeCcgfCAnbWF4QnVmZmVyUHgnPjtcblxuY29uc3QgZGVmYXVsdENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHM6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMgPSB7XG4gIGl0ZW1TaXplOiAzMixcbiAgbWluQnVmZmVyUHg6IDIwMCxcbiAgbWF4QnVmZmVyUHg6IDQwMCxcbn07XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tjbHJWaXJ0dWFsU2Nyb2xsXSxbQ2xyVmlydHVhbFNjcm9sbF0nLFxuICBwcm92aWRlcnM6IFtJdGVtc10sXG59KVxuZXhwb3J0IGNsYXNzIENsckRhdGFncmlkVmlydHVhbFNjcm9sbERpcmVjdGl2ZTxUPiBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIERvQ2hlY2ssIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoKSByZW5kZXJlZFJhbmdlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxMaXN0UmFuZ2U+KCk7XG4gIEBJbnB1dCgnY2xyVmlydHVhbFBlcnNpc3RJdGVtcycpIHBlcnNpc3RJdGVtcyA9IHRydWU7XG5cbiAgcHJpdmF0ZSBzaG91bGRVcGRhdGVBcmlhUm93SW5kZXhlcyA9IGZhbHNlO1xuICBwcml2YXRlIF9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0geyAuLi5kZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIGdyaWRSb2xlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3I6IENka1ZpcnR1YWxGb3JPZjxUPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHRvcEluZGV4ID0gMDtcblxuICAvLyBAZGVwcmVjYXRlZCByZW1vdmUgdGhlIG11dGF0aW9uIG9ic2VydmVyIHdoZW4gYGRhdGFncmlkLWNvbXBhY3RgIGNsYXNzIGlzIGRlbGV0ZWRcbiAgcHJpdmF0ZSBtdXRhdGlvbkNoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhpcyB0byBiZSBjYWxsZWQgdHdpY2UgYmVjYXVzZSB0aGUgb2xkIGNsYXNzIGlzIHJlbW92ZWQgYW5kIHRoZSBuZXcgYWRkZWRcbiAgICAgIGlmICgobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJiB0aGlzLml0ZW1TaXplID4gMjQpIHtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IDI0O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG4gIHByaXZhdGUgX3RvdGFsSXRlbXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gQ2xyRGF0YWdyaWQpKSBwcml2YXRlIHJlYWRvbmx5IGRhdGFncmlkOiBDbHJEYXRhZ3JpZCxcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuICAgIGRhdGFncmlkLmRldGFpbFNlcnZpY2UucHJldmVudEZvY3VzU2Nyb2xsID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmID0gZGF0YWdyaWQuZWw7XG5cbiAgICAvLyBkZWZhdWx0XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSAyMDtcblxuICAgIGNvbnN0IHJvd0hlaWdodFRva2VuID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1jbHItdGFibGUtcm93LWhlaWdodCcpO1xuICAgIGNvbnN0IHJvd0hlaWdodFZhbHVlID0gKy9jYWxjXFwoKFswLTldKykgXFwqIGNhbGNcXChcXCgxcmVtIFxcLyAyMFxcKSBcXCogMVxcKVxcKS8uZXhlYyhyb3dIZWlnaHRUb2tlbik/LlsxXTtcblxuICAgIGlmIChyb3dIZWlnaHRWYWx1ZSAmJiB0aGlzLml0ZW1TaXplID4gcm93SGVpZ2h0VmFsdWUpIHtcbiAgICAgIHRoaXMuaXRlbVNpemUgPSByb3dIZWlnaHRWYWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcy5vYnNlcnZlKHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcyddLFxuICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneSA9IG5ldyBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3koXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplLFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHhcbiAgICApO1xuICB9XG5cbiAgZ2V0IHRvdGFsQ29udGVudEhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/Ll90b3RhbENvbnRlbnRIZWlnaHQgfHwgJyc7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzT2YnKVxuICBnZXQgY2RrVmlydHVhbEZvck9mKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yT2YodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JPZiddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZiA9IHZhbHVlO1xuICAgIHRoaXMuaXRlbXMuYWxsID0gdmFsdWUgYXMgVFtdO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RyYWNrQnknKVxuICBnZXQgY2RrVmlydHVhbEZvclRyYWNrQnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRyYWNrQnkodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUcmFja0J5J10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXM/LmNka1ZpcnR1YWxGb3JJbnB1dHM/LmNka1ZpcnR1YWxGb3JUZW1wbGF0ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZUNhY2hlU2l6ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c0l0ZW1TaXplJylcbiAgZ2V0IGl0ZW1TaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplO1xuICB9XG4gIHNldCBpdGVtU2l6ZSh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snaXRlbVNpemUnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWluQnVmZmVyUHgnKVxuICBnZXQgbWluQnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1pbkJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtaW5CdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNYXhCdWZmZXJQeCcpXG4gIGdldCBtYXhCdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeDtcbiAgfVxuICBzZXQgbWF4QnVmZmVyUHgodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ21heEJ1ZmZlclB4J10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsRGF0YVJhbmdlJylcbiAgc2V0IGRhdGFSYW5nZShyYW5nZTogQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2U8VD4pIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuc21hcnRlbkRvd24oKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsSXRlbXMgPSByYW5nZS50b3RhbDtcblxuICAgIHRoaXMudXBkYXRlRGF0YVJhbmdlKHJhbmdlLnNraXAsIHJhbmdlLmRhdGEpO1xuICB9XG5cbiAgZ2V0IHRvdGFsSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSXRlbXM7XG4gIH1cblxuICBwcml2YXRlIHNldCB0b3RhbEl0ZW1zKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl90b3RhbEl0ZW1zID0gdmFsdWU7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbmplY3Rvci5ydW5JbkNvbnRleHQoKCkgPT4ge1xuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSB0aGlzLmNyZWF0ZVZpcnR1YWxTY3JvbGxWaWV3cG9ydEZvckRhdGFncmlkKFxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICB0aGlzLm5nWm9uZSxcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIsXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgICAgdGhpcy52aWV3cG9ydFJ1bGVyLFxuICAgICAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3lcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvciA9IGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZShcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgICB0aGlzLnRlbXBsYXRlUmVmLFxuICAgICAgICB0aGlzLml0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIsXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgICB0aGlzLm5nWm9uZVxuICAgICAgKTtcblxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQubmdPbkluaXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JpZFJvbGVFbGVtZW50ID0gdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW3JvbGU9XCJncmlkXCJdJyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5pdGVtcy5jaGFuZ2Uuc3Vic2NyaWJlKG5ld0l0ZW1zID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuY2RrVmlydHVhbEZvck9mID0gbmV3SXRlbXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG91bGRVcGRhdGVBcmlhUm93SW5kZXhlcyA9IHRydWU7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5kYXRhU3RyZWFtLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVBcmlhUm93Q291bnQoZGF0YS5sZW5ndGgpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5zY3JvbGxlZEluZGV4Q2hhbmdlLnN1YnNjcmliZShpbmRleCA9PiB7XG4gICAgICAgIHRoaXMudG9wSW5kZXggPSBpbmRleDtcbiAgICAgIH0pLFxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQucmVuZGVyZWRSYW5nZVN0cmVhbS5zdWJzY3JpYmUocmVuZGVyZWRSYW5nZSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZWRSYW5nZUNoYW5nZS5lbWl0KHJlbmRlcmVkUmFuZ2UpO1xuICAgICAgICB0aGlzLnNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzID0gdHJ1ZTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5kYXRhZ3JpZC5yZWZyZXNoLnN1YnNjcmliZShkYXRhZ3JpZFN0YXRlID0+IHtcbiAgICAgICAgaWYgKGRhdGFncmlkU3RhdGUuZmlsdGVycykge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9JbmRleCgwKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnNTdGF0ZUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlci5kZXRhY2goKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nRG9DaGVjaygpO1xuICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dJbmRleGVzKCk7XG5cbiAgICAgIHRoaXMuc2hvdWxkVXBkYXRlQXJpYVJvd0luZGV4ZXMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXM/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxVcChvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggLSBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbERvd24ob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4ICsgb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURhdGFSYW5nZShza2lwOiBudW1iZXIsIGRhdGE6IFRbXSkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY2RrVmlydHVhbEZvck9mIGFzIFRbXTtcblxuICAgIGlmICghdGhpcy5wZXJzaXN0SXRlbXMgfHwgIWl0ZW1zIHx8IGl0ZW1zPy5sZW5ndGggIT09IHRoaXMudG90YWxJdGVtcykge1xuICAgICAgaXRlbXMgPSBBcnJheSh0aGlzLnRvdGFsSXRlbXMpO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZShza2lwLCBkYXRhLmxlbmd0aCwgLi4uZGF0YSk7XG5cbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JPZiA9IEFycmF5LmZyb20oaXRlbXMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCkge1xuICAgIGlmICh0aGlzLmNka1ZpcnR1YWxGb3IpIHtcbiAgICAgIGZvciAoY29uc3QgY2RrVmlydHVhbEZvcklucHV0S2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY2RrVmlydHVhbEZvcklucHV0cykgYXMgQ2RrVmlydHVhbEZvcklucHV0S2V5W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcltjZGtWaXJ0dWFsRm9ySW5wdXRLZXldICE9PSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XSkge1xuICAgICAgICAgICh0aGlzLmNka1ZpcnR1YWxGb3IgYXMgYW55KVtjZGtWaXJ0dWFsRm9ySW5wdXRLZXldID0gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneS51cGRhdGVJdGVtQW5kQnVmZmVyU2l6ZShcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZSxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dDb3VudChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3djb3VudCcsIHJvd0NvdW50LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmlhUm93SW5kZXhlcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5nZXQoaSkgYXMgRW1iZWRkZWRWaWV3UmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+O1xuXG4gICAgICBjb25zdCByb290RWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSB2aWV3UmVmLnJvb3ROb2RlcztcbiAgICAgIGNvbnN0IGRhdGFncmlkUm93RWxlbWVudCA9IHJvb3RFbGVtZW50cy5maW5kKHJvd0VsZW1lbnQgPT4gcm93RWxlbWVudC50YWdOYW1lID09PSAnQ0xSLURHLVJPVycpO1xuICAgICAgY29uc3Qgcm93Um9sZUVsZW1lbnQgPSBkYXRhZ3JpZFJvd0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPVwicm93XCJdJyk7XG5cbiAgICAgIGNvbnN0IG5ld0FyaWFSb3dJbmRleCA9ICh2aWV3UmVmLmNvbnRleHQuaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgaWYgKHJvd1JvbGVFbGVtZW50Py5nZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnKSAhPT0gbmV3QXJpYVJvd0luZGV4KSB7XG4gICAgICAgIC8vIGFyaWEtcm93aW5kZXggc2hvdWxkIHN0YXJ0IHdpdGggb25lLCBub3QgemVybywgc28gd2UgaGF2ZSB0byBhZGQgb25lIHRvIHRoZSB6ZXJvLWJhc2VkIGluZGV4XG4gICAgICAgIHJvd1JvbGVFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnLCBuZXdBcmlhUm93SW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICApIHtcbiAgICBjb25zdCBkYXRhZ3JpZENvbnRlbnRFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC1jb250ZW50Jyk7XG4gICAgY29uc3QgZGF0YWdyaWRSb3dzRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtcm93cycpO1xuXG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0ID0gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgbmV3IEVsZW1lbnRSZWYoZGF0YWdyaWRDb250ZW50RWxlbWVudCksXG4gICAgICBuZXcgRWxlbWVudFJlZihkYXRhZ3JpZFJvd3NFbGVtZW50KSxcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgcmVuZGVyZXIyLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIG51bGwgYXMgYW55IGFzIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudFxuICAgICk7XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgY29udGVudFdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIG5nWm9uZTogTmdab25lLFxuICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgc2Nyb2xsYWJsZTogQ2RrVmlydHVhbFNjcm9sbGFibGVcbikge1xuICBsZXQgdmlld1BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHZpZXdQb3J0ID0gbmV3IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgICAgIGRhdGFncmlkRGl2RWxlbWVudFJlZixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIHNjcm9sbGFibGVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogRWxlbWVudFJlZiwgdXNlVmFsdWU6IGRhdGFncmlkRGl2RWxlbWVudFJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IENoYW5nZURldGVjdG9yUmVmLCB1c2VWYWx1ZTogY2hhbmdlRGV0ZWN0b3JSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOZ1pvbmUsIHVzZVZhbHVlOiBuZ1pvbmUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBSZW5kZXJlcjIsIHVzZVZhbHVlOiByZW5kZXJlcjIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBWSVJUVUFMX1NDUk9MTF9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxTdHJhdGVneSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LCB1c2VWYWx1ZTogZGlyZWN0aW9uYWxpdHkgfSxcbiAgICAgICAgeyBwcm92aWRlOiBTY3JvbGxEaXNwYXRjaGVyLCB1c2VWYWx1ZTogc2Nyb2xsRGlzcGF0Y2hlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZpZXdwb3J0UnVsZXIsIHVzZVZhbHVlOiB2aWV3cG9ydFJ1bGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbGFibGUsIHVzZVZhbHVlOiBzY3JvbGxhYmxlIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VDbGFzczogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0IH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdmlld1BvcnQgPSB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3Rvci5nZXQoQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KTtcbiAgfVxuICB2aWV3UG9ydC5fY29udGVudFdyYXBwZXIgPSBjb250ZW50V3JhcHBlcjtcbiAgcmV0dXJuIHZpZXdQb3J0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDZGtWaXJ0dWFsRm9yT2ZEaXJlY3RpdmU8VD4oXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gIHZpZXdSZXBlYXRlcjogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBULCBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIG5nWm9uZTogTmdab25lXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbEZvck9mPFQ+KFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHRlbXBsYXRlUmVmLFxuICAgICAgaXRlcmFibGVEaWZmZXJzLFxuICAgICAgdmlld1JlcGVhdGVyLFxuICAgICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgbmdab25lXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFZpZXdwb3J0IH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2RrVmlydHVhbEZvckluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBWaWV3Q29udGFpbmVyUmVmLCB1c2VWYWx1ZTogdmlld0NvbnRhaW5lclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFRlbXBsYXRlUmVmLCB1c2VWYWx1ZTogdGVtcGxhdGVSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJdGVyYWJsZURpZmZlcnMsIHVzZVZhbHVlOiBpdGVyYWJsZURpZmZlcnMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpZXdSZXBlYXRlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxGb3JPZiwgdXNlQ2xhc3M6IENka1ZpcnR1YWxGb3JPZiB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxGb3JPZik7XG4gIH1cbn1cbiJdfQ==