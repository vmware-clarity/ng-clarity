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
import { VERSION as ANGULAR_VERSION, ChangeDetectorRef, Directive, ElementRef, EnvironmentInjector, EventEmitter, inject, Injector, Input, IterableDiffers, NgZone, Output, Renderer2, SkipSelf, TemplateRef, ViewContainerRef, } from '@angular/core';
import { Items } from './providers/items';
import * as i0 from "@angular/core";
import * as i1 from "./providers/items";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/scrolling";
import * as i4 from "./datagrid";
import * as i5 from "./providers/columns.service";
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
        this._cdkFixedSizeVirtualScrollInputs = { ...defaultCdkFixedSizeVirtualScrollInputs };
        this.subscriptions = [];
        this.topIndex = 0;
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
        this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
        this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(this._cdkFixedSizeVirtualScrollInputs.itemSize, this._cdkFixedSizeVirtualScrollInputs.minBufferPx, this._cdkFixedSizeVirtualScrollInputs.maxBufferPx);
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
            this.cdkVirtualFor.cdkVirtualForOf = newItems;
        }), this.cdkVirtualFor.dataStream.subscribe(data => {
            this.updateAriaRowCount(data.length);
        }), this.virtualScrollViewport.scrolledIndexChange.subscribe(index => {
            this.topIndex = index;
        }), this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
            this.renderedRangeChange.emit(renderedRange);
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
        this.updateAriaRowIndexes();
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
        if (!this.persistItems || items?.length !== this.totalItems) {
            items = Array(this.totalItems);
        }
        console.log('before items', JSON.parse(JSON.stringify(items)));
        items.splice(skip, data.length, ...data);
        console.log('after items', JSON.parse(JSON.stringify(items)));
        this.cdkVirtualForOf = items;
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
            // aria-rowindex should start with one, not zero, so we have to add one to the zero-based index
            rowRoleElement?.setAttribute('aria-rowindex', (viewRef.context.index + 1).toString());
        }
    }
    createVirtualScrollViewportForDatagrid(changeDetectorRef, ngZone, renderer2, directionality, scrollDispatcher, viewportRuler, datagridElementRef, virtualScrollStrategy) {
        const datagridDivElement = datagridElementRef.nativeElement.querySelector('.datagrid');
        const datagridTableElement = datagridElementRef.nativeElement.querySelector('.datagrid-table');
        const datagridRowsElement = datagridElementRef.nativeElement.querySelector('.datagrid-rows');
        const datagridDivElementRef = { nativeElement: datagridDivElement };
        let topOffset = 0;
        let totalContentSize = 0;
        function updateDatagridElementStyles() {
            datagridRowsElement.style.transform = `translateY(${topOffset}px)`;
            datagridRowsElement.style.height = `${totalContentSize - topOffset}px`;
        }
        const virtualScrollViewport = createCdkVirtualScrollViewport(datagridDivElementRef, changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, null);
        virtualScrollViewport._contentWrapper = {
            nativeElement: {
                style: {
                    set transform(value) {
                        topOffset = value === undefined ? 0 : +/translateY\(([0-9]+)px\)/.exec(value)?.[1];
                        updateDatagridElementStyles();
                    },
                },
            },
        };
        virtualScrollViewport.setTotalContentSize = (value) => {
            totalContentSize = value;
            datagridTableElement.style.height = `${totalContentSize}px`;
            updateDatagridElementStyles();
        };
        return virtualScrollViewport;
    }
}
ClrDatagridVirtualScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.Items, skipSelf: true }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality }, { token: i3.ScrollDispatcher }, { token: i3.ViewportRuler }, { token: i4.ClrDatagrid }, { token: i5.ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVirtualScroll],[ClrVirtualScroll]',
                    providers: [Items],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.Items, decorators: [{
                    type: SkipSelf
                }] }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i2.Directionality }, { type: i3.ScrollDispatcher }, { type: i3.ViewportRuler }, { type: i4.ClrDatagrid }, { type: i5.ColumnsService }, { type: i0.EnvironmentInjector }]; }, propDecorators: { renderedRangeChange: [{
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
function createCdkVirtualScrollViewport(datagridDivElementRef, changeDetectorRef, ngZone, renderer2, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, scrollable) {
    if (+ANGULAR_VERSION.major < 19) {
        return new CdkVirtualScrollViewport(datagridDivElementRef, changeDetectorRef, ngZone, virtualScrollStrategy, directionality, scrollDispatcher, viewportRuler, scrollable);
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
        return virtualScrollViewportInjector.get(CdkVirtualScrollViewport);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUt2QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFZMUMsTUFBTSxzQ0FBc0MsR0FBb0M7SUFDOUUsUUFBUSxFQUFFLEVBQUU7SUFDWixXQUFXLEVBQUUsR0FBRztJQUNoQixXQUFXLEVBQUUsR0FBRztDQUNqQixDQUFDO0FBTUYsTUFBTSxPQUFPLGlDQUFpQztJQTZCNUMsWUFDbUIsaUJBQW9DLEVBQzdDLGVBQWdDLEVBQ3BCLEtBQWUsRUFD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Y29tLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IGNvZXJjZU51bWJlclByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3ksIF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCBMaXN0UmFuZ2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCxcbiAgQ2RrVmlydHVhbEZvck9mLFxuICBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0LFxuICBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGVFbGVtZW50LFxuICBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgU2Nyb2xsRGlzcGF0Y2hlcixcbiAgVmlld3BvcnRSdWxlcixcbiAgVklSVFVBTF9TQ1JPTExfU1RSQVRFR1ksXG4gIFZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBWRVJTSU9OIGFzIEFOR1VMQVJfVkVSU0lPTixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFbnZpcm9ubWVudEluamVjdG9yLFxuICBFdmVudEVtaXR0ZXIsXG4gIGluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0S2V5ID1cbiAgfCAnY2RrVmlydHVhbEZvck9mJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVHJhY2tCeSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSBQYXJ0aWFsPFBpY2s8Q2RrVmlydHVhbEZvck9mPFQ+LCBDZGtWaXJ0dWFsRm9ySW5wdXRLZXk+PjtcblxudHlwZSBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0gUGljazxDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCAnaXRlbVNpemUnIHwgJ21pbkJ1ZmZlclB4JyB8ICdtYXhCdWZmZXJQeCc+O1xuXG5jb25zdCBkZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0czogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IHtcbiAgaXRlbVNpemU6IDMyLFxuICBtaW5CdWZmZXJQeDogMjAwLFxuICBtYXhCdWZmZXJQeDogNDAwLFxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclZpcnR1YWxTY3JvbGxdLFtDbHJWaXJ0dWFsU2Nyb2xsXScsXG4gIHByb3ZpZGVyczogW0l0ZW1zXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlbmRlcmVkUmFuZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPExpc3RSYW5nZT4oKTtcbiAgQElucHV0KCdjbHJWaXJ0dWFsUGVyc2lzdEl0ZW1zJykgcGVyc2lzdEl0ZW1zID0gdHJ1ZTtcblxuICBwcml2YXRlIF9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0geyAuLi5kZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIGdyaWRSb2xlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3I6IENka1ZpcnR1YWxGb3JPZjxUPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHRvcEluZGV4ID0gMDtcbiAgcHJpdmF0ZSBtdXRhdGlvbkNoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhpcyB0byBiZSBjYWxsZWQgdHdpY2UgYmVjYXVzZSB0aGUgb2xkIGNsYXNzIGlzIHJlbW92ZWQgYW5kIHRoZSBuZXcgYWRkZWRcbiAgICAgIGlmICgobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJiB0aGlzLml0ZW1TaXplID4gMjQpIHtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IDI0O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG4gIHByaXZhdGUgX3RvdGFsSXRlbXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIEBTa2lwU2VsZigpIHByaXZhdGUgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGFncmlkOiBDbHJEYXRhZ3JpZCxcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuICAgIGRhdGFncmlkLmRldGFpbFNlcnZpY2UucHJldmVudEZvY3VzU2Nyb2xsID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmID0gZGF0YWdyaWQuZWw7XG5cbiAgICAvLyBkZWZhdWx0XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSAyMDtcblxuICAgIHRoaXMubXV0YXRpb25DaGFuZ2VzLm9ic2VydmUodGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ10sXG4gICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5ID0gbmV3IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneShcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUsXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4LFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeFxuICAgICk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzT2YnKVxuICBnZXQgY2RrVmlydHVhbEZvck9mKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yT2YodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JPZiddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZiA9IHZhbHVlO1xuICAgIHRoaXMuaXRlbXMuYWxsID0gdmFsdWUgYXMgVFtdO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RyYWNrQnknKVxuICBnZXQgY2RrVmlydHVhbEZvclRyYWNrQnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRyYWNrQnkodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUcmFja0J5J10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXM/LmNka1ZpcnR1YWxGb3JJbnB1dHM/LmNka1ZpcnR1YWxGb3JUZW1wbGF0ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZUNhY2hlU2l6ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c0l0ZW1TaXplJylcbiAgZ2V0IGl0ZW1TaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplO1xuICB9XG4gIHNldCBpdGVtU2l6ZSh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snaXRlbVNpemUnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWluQnVmZmVyUHgnKVxuICBnZXQgbWluQnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1pbkJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtaW5CdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNYXhCdWZmZXJQeCcpXG4gIGdldCBtYXhCdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeDtcbiAgfVxuICBzZXQgbWF4QnVmZmVyUHgodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ21heEJ1ZmZlclB4J10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsRGF0YVJhbmdlJylcbiAgc2V0IGRhdGFSYW5nZShyYW5nZTogeyB0b3RhbDogbnVtYmVyOyBza2lwOiBudW1iZXI7IGRhdGE6IFRbXSB9KSB7XG4gICAgdGhpcy50b3RhbEl0ZW1zID0gcmFuZ2UudG90YWw7XG5cbiAgICB0aGlzLnVwZGF0ZURhdGFSYW5nZShyYW5nZS5za2lwLCByYW5nZS5kYXRhKTtcbiAgfVxuXG4gIGdldCB0b3RhbEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl90b3RhbEl0ZW1zO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQgdG90YWxJdGVtcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fdG90YWxJdGVtcyA9IHZhbHVlO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuaW5qZWN0b3IucnVuSW5Db250ZXh0KCgpID0+IHtcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0ID0gdGhpcy5jcmVhdGVWaXJ0dWFsU2Nyb2xsVmlld3BvcnRGb3JEYXRhZ3JpZChcbiAgICAgICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgdGhpcy5uZ1pvbmUsXG4gICAgICAgIHRoaXMucmVuZGVyZXIyLFxuICAgICAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LFxuICAgICAgICB0aGlzLnNjcm9sbERpc3BhdGNoZXIsXG4gICAgICAgIHRoaXMudmlld3BvcnRSdWxlcixcbiAgICAgICAgdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYsXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5XG4gICAgICApO1xuXG4gICAgICB0aGlzLmNka1ZpcnR1YWxGb3IgPSBjcmVhdGVDZGtWaXJ0dWFsRm9yT2ZEaXJlY3RpdmUoXG4gICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgdGhpcy50ZW1wbGF0ZVJlZixcbiAgICAgICAgdGhpcy5pdGVyYWJsZURpZmZlcnMsXG4gICAgICAgIHRoaXMudmlld1JlcGVhdGVyLFxuICAgICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgICAgICAgdGhpcy5uZ1pvbmVcbiAgICAgICk7XG5cbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Lm5nT25Jbml0KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmdyaWRSb2xlRWxlbWVudCA9IHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJ1tyb2xlPVwiZ3JpZFwiXScpO1xuXG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIHRoaXMuaXRlbXMuY2hhbmdlLnN1YnNjcmliZShuZXdJdGVtcyA9PiB7XG4gICAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5jZGtWaXJ0dWFsRm9yT2YgPSBuZXdJdGVtcztcbiAgICAgIH0pLFxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yLmRhdGFTdHJlYW0uc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dDb3VudChkYXRhLmxlbmd0aCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LnNjcm9sbGVkSW5kZXhDaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgICAgdGhpcy50b3BJbmRleCA9IGluZGV4O1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5yZW5kZXJlZFJhbmdlU3RyZWFtLnN1YnNjcmliZShyZW5kZXJlZFJhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZFJhbmdlQ2hhbmdlLmVtaXQocmVuZGVyZWRSYW5nZSk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZGF0YWdyaWQucmVmcmVzaC5zdWJzY3JpYmUoZGF0YWdyaWRTdGF0ZSA9PiB7XG4gICAgICAgIGlmIChkYXRhZ3JpZFN0YXRlLmZpbHRlcnMpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFRvSW5kZXgoMCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zU3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIuZGV0YWNoKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yPy5uZ0RvQ2hlY2soKTtcbiAgICB0aGlzLnVwZGF0ZUFyaWFSb3dJbmRleGVzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXM/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxVcChvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggLSBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbERvd24ob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4ICsgb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURhdGFSYW5nZShza2lwOiBudW1iZXIsIGRhdGE6IFRbXSkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY2RrVmlydHVhbEZvck9mIGFzIFRbXTtcbiAgICBpZiAoIXRoaXMucGVyc2lzdEl0ZW1zIHx8IGl0ZW1zPy5sZW5ndGggIT09IHRoaXMudG90YWxJdGVtcykge1xuICAgICAgaXRlbXMgPSBBcnJheSh0aGlzLnRvdGFsSXRlbXMpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygnYmVmb3JlIGl0ZW1zJywgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpdGVtcykpKTtcblxuICAgIGl0ZW1zLnNwbGljZShza2lwLCBkYXRhLmxlbmd0aCwgLi4uZGF0YSk7XG4gICAgY29uc29sZS5sb2coJ2FmdGVyIGl0ZW1zJywgSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpdGVtcykpKTtcblxuICAgIHRoaXMuY2RrVmlydHVhbEZvck9mID0gaXRlbXM7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcikge1xuICAgICAgZm9yIChjb25zdCBjZGtWaXJ0dWFsRm9ySW5wdXRLZXkgb2YgT2JqZWN0LmtleXModGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzKSBhcyBDZGtWaXJ0dWFsRm9ySW5wdXRLZXlbXSkge1xuICAgICAgICBpZiAodGhpcy5jZGtWaXJ0dWFsRm9yW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gIT09IHRoaXMuY2RrVmlydHVhbEZvcklucHV0c1tjZGtWaXJ0dWFsRm9ySW5wdXRLZXldKSB7XG4gICAgICAgICAgKHRoaXMuY2RrVmlydHVhbEZvciBhcyBhbnkpW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gPSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpIHtcbiAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5LnVwZGF0ZUl0ZW1BbmRCdWZmZXJTaXplKFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplLFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4LFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQXJpYVJvd0NvdW50KHJvd0NvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLmdyaWRSb2xlRWxlbWVudD8uc2V0QXR0cmlidXRlKCdhcmlhLXJvd2NvdW50Jywgcm93Q291bnQudG9TdHJpbmcoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dJbmRleGVzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj47XG5cbiAgICAgIGNvbnN0IHJvb3RFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IHZpZXdSZWYucm9vdE5vZGVzO1xuICAgICAgY29uc3QgZGF0YWdyaWRSb3dFbGVtZW50ID0gcm9vdEVsZW1lbnRzLmZpbmQocm93RWxlbWVudCA9PiByb3dFbGVtZW50LnRhZ05hbWUgPT09ICdDTFItREctUk9XJyk7XG4gICAgICBjb25zdCByb3dSb2xlRWxlbWVudCA9IGRhdGFncmlkUm93RWxlbWVudD8ucXVlcnlTZWxlY3RvcignW3JvbGU9XCJyb3dcIl0nKTtcblxuICAgICAgLy8gYXJpYS1yb3dpbmRleCBzaG91bGQgc3RhcnQgd2l0aCBvbmUsIG5vdCB6ZXJvLCBzbyB3ZSBoYXZlIHRvIGFkZCBvbmUgdG8gdGhlIHplcm8tYmFzZWQgaW5kZXhcbiAgICAgIHJvd1JvbGVFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnLCAodmlld1JlZi5jb250ZXh0LmluZGV4ICsgMSkudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVWaXJ0dWFsU2Nyb2xsVmlld3BvcnRGb3JEYXRhZ3JpZChcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBkYXRhZ3JpZEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5XG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkRGl2RWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQnKTtcbiAgICBjb25zdCBkYXRhZ3JpZFRhYmxlRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtdGFibGUnKTtcbiAgICBjb25zdCBkYXRhZ3JpZFJvd3NFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC1yb3dzJyk7XG4gICAgY29uc3QgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiA9IHsgbmF0aXZlRWxlbWVudDogZGF0YWdyaWREaXZFbGVtZW50IH07XG5cbiAgICBsZXQgdG9wT2Zmc2V0ID0gMDtcbiAgICBsZXQgdG90YWxDb250ZW50U2l6ZSA9IDA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRhZ3JpZEVsZW1lbnRTdHlsZXMoKSB7XG4gICAgICBkYXRhZ3JpZFJvd3NFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7dG9wT2Zmc2V0fXB4KWA7XG4gICAgICBkYXRhZ3JpZFJvd3NFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RvdGFsQ29udGVudFNpemUgLSB0b3BPZmZzZXR9cHhgO1xuICAgIH1cblxuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCA9IGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgICAgIGRhdGFncmlkRGl2RWxlbWVudFJlZixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgcmVuZGVyZXIyLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIG51bGwgYXMgYW55IGFzIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudFxuICAgICk7XG5cbiAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQuX2NvbnRlbnRXcmFwcGVyID0ge1xuICAgICAgbmF0aXZlRWxlbWVudDoge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHNldCB0cmFuc2Zvcm0odmFsdWU6IGFueSkge1xuICAgICAgICAgICAgdG9wT2Zmc2V0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IDAgOiArL3RyYW5zbGF0ZVlcXCgoWzAtOV0rKXB4XFwpLy5leGVjKHZhbHVlKT8uWzFdO1xuICAgICAgICAgICAgdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSBhcyBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAgIHZpcnR1YWxTY3JvbGxWaWV3cG9ydC5zZXRUb3RhbENvbnRlbnRTaXplID0gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgIHRvdGFsQ29udGVudFNpemUgPSB2YWx1ZTtcbiAgICAgIGRhdGFncmlkVGFibGVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RvdGFsQ29udGVudFNpemV9cHhgO1xuICAgICAgdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCk7XG4gICAgfTtcblxuICAgIHJldHVybiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICBkYXRhZ3JpZERpdkVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIG5nWm9uZTogTmdab25lLFxuICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgc2Nyb2xsYWJsZTogQ2RrVmlydHVhbFNjcm9sbGFibGVcbikge1xuICBpZiAoK0FOR1VMQVJfVkVSU0lPTi5tYWpvciA8IDE5KSB7XG4gICAgcmV0dXJuIG5ldyBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gICAgICBkYXRhZ3JpZERpdkVsZW1lbnRSZWYsXG4gICAgICBjaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgICAgIGRpcmVjdGlvbmFsaXR5LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIHZpZXdwb3J0UnVsZXIsXG4gICAgICBzY3JvbGxhYmxlXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IEVsZW1lbnRSZWYsIHVzZVZhbHVlOiBkYXRhZ3JpZERpdkVsZW1lbnRSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDaGFuZ2VEZXRlY3RvclJlZiwgdXNlVmFsdWU6IGNoYW5nZURldGVjdG9yUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTmdab25lLCB1c2VWYWx1ZTogbmdab25lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogUmVuZGVyZXIyLCB1c2VWYWx1ZTogcmVuZGVyZXIyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVklSVFVBTF9TQ1JPTExfU1RSQVRFR1ksIHVzZVZhbHVlOiB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kgfSxcbiAgICAgICAgeyBwcm92aWRlOiBEaXJlY3Rpb25hbGl0eSwgdXNlVmFsdWU6IGRpcmVjdGlvbmFsaXR5IH0sXG4gICAgICAgIHsgcHJvdmlkZTogU2Nyb2xsRGlzcGF0Y2hlciwgdXNlVmFsdWU6IHNjcm9sbERpc3BhdGNoZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBWaWV3cG9ydFJ1bGVyLCB1c2VWYWx1ZTogdmlld3BvcnRSdWxlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxhYmxlLCB1c2VWYWx1ZTogc2Nyb2xsYWJsZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCwgdXNlQ2xhc3M6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3Rvci5nZXQoQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDZGtWaXJ0dWFsRm9yT2ZEaXJlY3RpdmU8VD4oXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gIHZpZXdSZXBlYXRlcjogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBULCBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIG5nWm9uZTogTmdab25lXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbEZvck9mPFQ+KFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHRlbXBsYXRlUmVmLFxuICAgICAgaXRlcmFibGVEaWZmZXJzLFxuICAgICAgdmlld1JlcGVhdGVyLFxuICAgICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgbmdab25lXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFZpZXdwb3J0IH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2RrVmlydHVhbEZvckluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBWaWV3Q29udGFpbmVyUmVmLCB1c2VWYWx1ZTogdmlld0NvbnRhaW5lclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFRlbXBsYXRlUmVmLCB1c2VWYWx1ZTogdGVtcGxhdGVSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJdGVyYWJsZURpZmZlcnMsIHVzZVZhbHVlOiBpdGVyYWJsZURpZmZlcnMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpZXdSZXBlYXRlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxGb3JPZiwgdXNlQ2xhc3M6IENka1ZpcnR1YWxGb3JPZiB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxGb3JPZik7XG4gIH1cbn1cbiJdfQ==