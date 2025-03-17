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
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxRQUFRLEVBQ1IsV0FBVyxFQUNYLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUt2QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFZMUMsTUFBTSxzQ0FBc0MsR0FBb0M7SUFDOUUsUUFBUSxFQUFFLEVBQUU7SUFDWixXQUFXLEVBQUUsR0FBRztJQUNoQixXQUFXLEVBQUUsR0FBRztDQUNqQixDQUFDO0FBTUYsTUFBTSxPQUFPLGlDQUFpQztJQTJCNUMsWUFDbUIsaUJBQW9DLEVBQzdDLGVBQWdDLEVBQ3BCLEtBQWUsRUFD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aHRzIFJlc2VydmVkLlxuICogVGhlIHRlcm0gXCJCcm9hZGNvbVwiIHJlZmVycyB0byBCcm9hZGNvbSBJbmMuIGFuZC9vciBpdHMgc3Vic2lkaWFyaWVzLlxuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZS5cbiAqIFRoZSBmdWxsIGxpY2Vuc2UgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIGluIExJQ0VOU0UgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgcHJvamVjdC5cbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IGNvZXJjZU51bWJlclByb3BlcnR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3ksIF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCBMaXN0UmFuZ2UgfSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHtcbiAgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCxcbiAgQ2RrVmlydHVhbEZvck9mLFxuICBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0LFxuICBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGVFbGVtZW50LFxuICBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgU2Nyb2xsRGlzcGF0Y2hlcixcbiAgVmlld3BvcnRSdWxlcixcbiAgVklSVFVBTF9TQ1JPTExfU1RSQVRFR1ksXG4gIFZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBWRVJTSU9OIGFzIEFOR1VMQVJfVkVSU0lPTixcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFbnZpcm9ubWVudEluamVjdG9yLFxuICBFdmVudEVtaXR0ZXIsXG4gIGluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2tpcFNlbGYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0S2V5ID1cbiAgfCAnY2RrVmlydHVhbEZvck9mJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVHJhY2tCeSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSBQYXJ0aWFsPFBpY2s8Q2RrVmlydHVhbEZvck9mPFQ+LCBDZGtWaXJ0dWFsRm9ySW5wdXRLZXk+PjtcblxudHlwZSBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0gUGljazxDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCAnaXRlbVNpemUnIHwgJ21pbkJ1ZmZlclB4JyB8ICdtYXhCdWZmZXJQeCc+O1xuXG5jb25zdCBkZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0czogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IHtcbiAgaXRlbVNpemU6IDMyLFxuICBtaW5CdWZmZXJQeDogMjAwLFxuICBtYXhCdWZmZXJQeDogNDAwLFxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclZpcnR1YWxTY3JvbGxdLFtDbHJWaXJ0dWFsU2Nyb2xsXScsXG4gIHByb3ZpZGVyczogW0l0ZW1zXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlbmRlcmVkUmFuZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPExpc3RSYW5nZT4oKTtcblxuICBwcml2YXRlIF9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0geyAuLi5kZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIGdyaWRSb2xlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3I6IENka1ZpcnR1YWxGb3JPZjxUPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHRvcEluZGV4ID0gMDtcbiAgcHJpdmF0ZSBtdXRhdGlvbkNoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhpcyB0byBiZSBjYWxsZWQgdHdpY2UgYmVjYXVzZSB0aGUgb2xkIGNsYXNzIGlzIHJlbW92ZWQgYW5kIHRoZSBuZXcgYWRkZWRcbiAgICAgIGlmICgobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJiB0aGlzLml0ZW1TaXplID4gMjQpIHtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IDI0O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICBAU2tpcFNlbGYoKSBwcml2YXRlIGl0ZW1zOiBJdGVtczxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSByZWFkb25seSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gICAgcHJpdmF0ZSByZWFkb25seSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkYXRhZ3JpZDogQ2xyRGF0YWdyaWQsXG4gICAgcHJpdmF0ZSBjb2x1bW5zU2VydmljZTogQ29sdW1uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbmplY3RvcjogRW52aXJvbm1lbnRJbmplY3RvclxuICApIHtcbiAgICBpdGVtcy5zbWFydGVuVXAoKTtcbiAgICBkYXRhZ3JpZC5kZXRhaWxTZXJ2aWNlLnByZXZlbnRGb2N1c1Njcm9sbCA9IHRydWU7XG5cbiAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZiA9IGRhdGFncmlkLmVsO1xuXG4gICAgLy8gZGVmYXVsdFxuICAgIHRoaXMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gMjA7XG5cbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcy5vYnNlcnZlKHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcyddLFxuICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneSA9IG5ldyBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3koXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplLFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHhcbiAgICApO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c09mJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JPZigpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZjtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvck9mKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yT2YnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yT2YgPSB2YWx1ZTtcbiAgICB0aGlzLml0ZW1zLmFsbCA9IHZhbHVlIGFzIFRbXTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUcmFja0J5JylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUcmFja0J5KCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnk7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUcmFja0J5KHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVHJhY2tCeSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUcmFja0J5ID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVGVtcGxhdGUnKVxuICBnZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzPy5jZGtWaXJ0dWFsRm9ySW5wdXRzPy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVGVtcGxhdGVDYWNoZVNpemUnKVxuICBnZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NJdGVtU2l6ZScpXG4gIGdldCBpdGVtU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZTtcbiAgfVxuICBzZXQgaXRlbVNpemUodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ2l0ZW1TaXplJ10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c01pbkJ1ZmZlclB4JylcbiAgZ2V0IG1pbkJ1ZmZlclB4KCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4O1xuICB9XG4gIHNldCBtaW5CdWZmZXJQeCh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snbWluQnVmZmVyUHgnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWF4QnVmZmVyUHgnKVxuICBnZXQgbWF4QnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1heEJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtYXhCdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmluamVjdG9yLnJ1bkluQ29udGV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydCA9IHRoaXMuY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHRoaXMubmdab25lLFxuICAgICAgICB0aGlzLnJlbmRlcmVyMixcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgICB0aGlzLnZpZXdwb3J0UnVsZXIsXG4gICAgICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLFxuICAgICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICAgICAgKTtcblxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yID0gY3JlYXRlQ2RrVmlydHVhbEZvck9mRGlyZWN0aXZlKFxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHRoaXMudGVtcGxhdGVSZWYsXG4gICAgICAgIHRoaXMuaXRlcmFibGVEaWZmZXJzLFxuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlcixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gICAgICAgIHRoaXMubmdab25lXG4gICAgICApO1xuXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5uZ09uSW5pdCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQgPSB0aGlzLmRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbcm9sZT1cImdyaWRcIl0nKTtcblxuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLml0ZW1zLmNoYW5nZS5zdWJzY3JpYmUobmV3SXRlbXMgPT4ge1xuICAgICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuY2RrVmlydHVhbEZvck9mID0gbmV3SXRlbXM7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5kYXRhU3RyZWFtLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVBcmlhUm93Q291bnQoZGF0YS5sZW5ndGgpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5zY3JvbGxlZEluZGV4Q2hhbmdlLnN1YnNjcmliZShpbmRleCA9PiB7XG4gICAgICAgIHRoaXMudG9wSW5kZXggPSBpbmRleDtcbiAgICAgIH0pLFxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQucmVuZGVyZWRSYW5nZVN0cmVhbS5zdWJzY3JpYmUocmVuZGVyZWRSYW5nZSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZWRSYW5nZUNoYW5nZS5lbWl0KHJlbmRlcmVkUmFuZ2UpO1xuICAgICAgfSksXG4gICAgICB0aGlzLmRhdGFncmlkLnJlZnJlc2guc3Vic2NyaWJlKGRhdGFncmlkU3RhdGUgPT4ge1xuICAgICAgICBpZiAoZGF0YWdyaWRTdGF0ZS5maWx0ZXJzKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KDApO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1uc1N0YXRlQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudmlld1JlcGVhdGVyLmRldGFjaCgpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcj8ubmdEb0NoZWNrKCk7XG4gICAgdGhpcy51cGRhdGVBcmlhUm93SW5kZXhlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yPy5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMubXV0YXRpb25DaGFuZ2VzPy5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2Nyb2xsVXAob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4IC0gb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxEb3duKG9mZnNldDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy50b3BJbmRleCArIG9mZnNldCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8uc2Nyb2xsVG9JbmRleChpbmRleCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCkge1xuICAgIGlmICh0aGlzLmNka1ZpcnR1YWxGb3IpIHtcbiAgICAgIGZvciAoY29uc3QgY2RrVmlydHVhbEZvcklucHV0S2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY2RrVmlydHVhbEZvcklucHV0cykgYXMgQ2RrVmlydHVhbEZvcklucHV0S2V5W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcltjZGtWaXJ0dWFsRm9ySW5wdXRLZXldICE9PSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XSkge1xuICAgICAgICAgICh0aGlzLmNka1ZpcnR1YWxGb3IgYXMgYW55KVtjZGtWaXJ0dWFsRm9ySW5wdXRLZXldID0gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneS51cGRhdGVJdGVtQW5kQnVmZmVyU2l6ZShcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZSxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dDb3VudChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3djb3VudCcsIHJvd0NvdW50LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmlhUm93SW5kZXhlcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5nZXQoaSkgYXMgRW1iZWRkZWRWaWV3UmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+O1xuXG4gICAgICBjb25zdCByb290RWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSB2aWV3UmVmLnJvb3ROb2RlcztcbiAgICAgIGNvbnN0IGRhdGFncmlkUm93RWxlbWVudCA9IHJvb3RFbGVtZW50cy5maW5kKHJvd0VsZW1lbnQgPT4gcm93RWxlbWVudC50YWdOYW1lID09PSAnQ0xSLURHLVJPVycpO1xuICAgICAgY29uc3Qgcm93Um9sZUVsZW1lbnQgPSBkYXRhZ3JpZFJvd0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPVwicm93XCJdJyk7XG5cbiAgICAgIC8vIGFyaWEtcm93aW5kZXggc2hvdWxkIHN0YXJ0IHdpdGggb25lLCBub3QgemVybywgc28gd2UgaGF2ZSB0byBhZGQgb25lIHRvIHRoZSB6ZXJvLWJhc2VkIGluZGV4XG4gICAgICByb3dSb2xlRWxlbWVudD8uc2V0QXR0cmlidXRlKCdhcmlhLXJvd2luZGV4JywgKHZpZXdSZWYuY29udGV4dC5pbmRleCArIDEpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICApIHtcbiAgICBjb25zdCBkYXRhZ3JpZERpdkVsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkJyk7XG4gICAgY29uc3QgZGF0YWdyaWRUYWJsZUVsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkLXRhYmxlJyk7XG4gICAgY29uc3QgZGF0YWdyaWRSb3dzRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtcm93cycpO1xuICAgIGNvbnN0IGRhdGFncmlkRGl2RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4gPSB7IG5hdGl2ZUVsZW1lbnQ6IGRhdGFncmlkRGl2RWxlbWVudCB9O1xuXG4gICAgbGV0IHRvcE9mZnNldCA9IDA7XG4gICAgbGV0IHRvdGFsQ29udGVudFNpemUgPSAwO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCkge1xuICAgICAgZGF0YWdyaWRSb3dzRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke3RvcE9mZnNldH1weClgO1xuICAgICAgZGF0YWdyaWRSb3dzRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0b3RhbENvbnRlbnRTaXplIC0gdG9wT2Zmc2V0fXB4YDtcbiAgICB9XG5cbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSBjcmVhdGVDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gICAgICBkYXRhZ3JpZERpdkVsZW1lbnRSZWYsXG4gICAgICBjaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHJlbmRlcmVyMixcbiAgICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgICAgIGRpcmVjdGlvbmFsaXR5LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIHZpZXdwb3J0UnVsZXIsXG4gICAgICBudWxsIGFzIGFueSBhcyBDZGtWaXJ0dWFsU2Nyb2xsYWJsZUVsZW1lbnRcbiAgICApO1xuXG4gICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0Ll9jb250ZW50V3JhcHBlciA9IHtcbiAgICAgIG5hdGl2ZUVsZW1lbnQ6IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBzZXQgdHJhbnNmb3JtKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgICAgIHRvcE9mZnNldCA9IHZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogKy90cmFuc2xhdGVZXFwoKFswLTldKylweFxcKS8uZXhlYyh2YWx1ZSk/LlsxXTtcbiAgICAgICAgICAgIHVwZGF0ZURhdGFncmlkRWxlbWVudFN0eWxlcygpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0gYXMgRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQuc2V0VG90YWxDb250ZW50U2l6ZSA9ICh2YWx1ZTogbnVtYmVyKSA9PiB7XG4gICAgICB0b3RhbENvbnRlbnRTaXplID0gdmFsdWU7XG4gICAgICBkYXRhZ3JpZFRhYmxlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0b3RhbENvbnRlbnRTaXplfXB4YDtcbiAgICAgIHVwZGF0ZURhdGFncmlkRWxlbWVudFN0eWxlcygpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICBuZ1pvbmU6IE5nWm9uZSxcbiAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gIHZpcnR1YWxTY3JvbGxTdHJhdGVneTogVmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gIHNjcm9sbGFibGU6IENka1ZpcnR1YWxTY3JvbGxhYmxlXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgZGF0YWdyaWREaXZFbGVtZW50UmVmLFxuICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBkaXJlY3Rpb25hbGl0eSxcbiAgICAgIHNjcm9sbERpc3BhdGNoZXIsXG4gICAgICB2aWV3cG9ydFJ1bGVyLFxuICAgICAgc2Nyb2xsYWJsZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBpbmplY3QoRW52aXJvbm1lbnRJbmplY3RvciksXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBFbGVtZW50UmVmLCB1c2VWYWx1ZTogZGF0YWdyaWREaXZFbGVtZW50UmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2hhbmdlRGV0ZWN0b3JSZWYsIHVzZVZhbHVlOiBjaGFuZ2VEZXRlY3RvclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFJlbmRlcmVyMiwgdXNlVmFsdWU6IHJlbmRlcmVyMiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFN0cmF0ZWd5IH0sXG4gICAgICAgIHsgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksIHVzZVZhbHVlOiBkaXJlY3Rpb25hbGl0eSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFNjcm9sbERpc3BhdGNoZXIsIHVzZVZhbHVlOiBzY3JvbGxEaXNwYXRjaGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVmlld3BvcnRSdWxlciwgdXNlVmFsdWU6IHZpZXdwb3J0UnVsZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSwgdXNlVmFsdWU6IHNjcm9sbGFibGUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZUNsYXNzOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2RrVmlydHVhbEZvck9mRGlyZWN0aXZlPFQ+KFxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICB2aWV3UmVwZWF0ZXI6IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3k8VCwgVCwgQ2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBuZ1pvbmU6IE5nWm9uZVxuKSB7XG4gIGlmICgrQU5HVUxBUl9WRVJTSU9OLm1ham9yIDwgMTkpIHtcbiAgICByZXR1cm4gbmV3IENka1ZpcnR1YWxGb3JPZjxUPihcbiAgICAgIHZpZXdDb250YWluZXJSZWYsXG4gICAgICB0ZW1wbGF0ZVJlZixcbiAgICAgIGl0ZXJhYmxlRGlmZmVycyxcbiAgICAgIHZpZXdSZXBlYXRlcixcbiAgICAgIHZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgICAgIG5nWm9uZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBpbmplY3QoRW52aXJvbm1lbnRJbmplY3RvciksXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNka1ZpcnR1YWxGb3JJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogVmlld0NvbnRhaW5lclJlZiwgdXNlVmFsdWU6IHZpZXdDb250YWluZXJSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBUZW1wbGF0ZVJlZiwgdXNlVmFsdWU6IHRlbXBsYXRlUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogSXRlcmFibGVEaWZmZXJzLCB1c2VWYWx1ZTogaXRlcmFibGVEaWZmZXJzIH0sXG4gICAgICAgIHsgcHJvdmlkZTogX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIHVzZVZhbHVlOiB2aWV3UmVwZWF0ZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOZ1pvbmUsIHVzZVZhbHVlOiBuZ1pvbmUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsRm9yT2YsIHVzZUNsYXNzOiBDZGtWaXJ0dWFsRm9yT2YgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2RrVmlydHVhbEZvckluamVjdG9yLmdldChDZGtWaXJ0dWFsRm9yT2YpO1xuICB9XG59XG4iXX0=