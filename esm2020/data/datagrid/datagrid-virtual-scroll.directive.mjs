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
import { VERSION as ANGULAR_VERSION, ChangeDetectorRef, Directive, ElementRef, EnvironmentInjector, EventEmitter, inject, Injector, Input, IterableDiffers, NgZone, Output, Renderer2, TemplateRef, ViewContainerRef, } from '@angular/core';
import { Items } from './providers/items';
import * as i0 from "@angular/core";
import * as i1 from "./providers/items";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/scrolling";
import * as i4 from "./providers/columns.service";
const defaultCdkFixedSizeVirtualScrollInputs = {
    itemSize: 32,
    minBufferPx: 200,
    maxBufferPx: 400,
};
export class ClrDatagridVirtualScrollDirective {
    constructor(changeDetectorRef, iterableDiffers, items, ngZone, renderer2, templateRef, viewContainerRef, directionality, scrollDispatcher, viewportRuler, columnsService, injector) {
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
        // default
        this.cdkVirtualForTemplateCacheSize = 20;
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
    prepareDatagrid(datagrid) {
        datagrid.detailService.preventFocusScroll = true;
        this.datagridElementRef = datagrid.el;
        this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
            attributeFilter: ['class'],
            attributeOldValue: true,
        });
        this.subscriptions.push(datagrid.refresh.subscribe(datagridState => {
            if (datagridState.filters) {
                this.scrollToIndex(0);
            }
        }));
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
        }), this.cdkVirtualFor.dataStream.subscribe(data => {
            this.updateAriaRowCount(data.length);
        }), this.virtualScrollViewport.scrolledIndexChange.subscribe(index => {
            this.topIndex = index;
        }), this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
            this.renderedRangeChange.emit(renderedRange);
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
ClrDatagridVirtualScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.Items }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality }, { token: i3.ScrollDispatcher }, { token: i3.ViewportRuler }, { token: i4.ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVirtualScroll],[ClrVirtualScroll]',
                    providers: [Items],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.Items }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i2.Directionality }, { type: i3.ScrollDispatcher }, { type: i3.ViewportRuler }, { type: i4.ColumnsService }, { type: i0.EnvironmentInjector }]; }, propDecorators: { renderedRangeChange: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7O0FBWTFDLE1BQU0sc0NBQXNDLEdBQW9DO0lBQzlFLFFBQVEsRUFBRSxFQUFFO0lBQ1osV0FBVyxFQUFFLEdBQUc7SUFDaEIsV0FBVyxFQUFFLEdBQUc7Q0FDakIsQ0FBQztBQU1GLE1BQU0sT0FBTyxpQ0FBaUM7SUE2QjVDLFlBQ21CLGlCQUFvQyxFQUM3QyxlQUFnQyxFQUNoQyxLQUFlLEVBQ04sTUFBYyxFQUNk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MjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5LCBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgTGlzdFJhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGwsXG4gIENka1ZpcnR1YWxGb3JPZixcbiAgQ2RrVmlydHVhbEZvck9mQ29udGV4dCxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGUsXG4gIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudCxcbiAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIFNjcm9sbERpc3BhdGNoZXIsXG4gIFZpZXdwb3J0UnVsZXIsXG4gIFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLFxuICBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgVkVSU0lPTiBhcyBBTkdVTEFSX1ZFUlNJT04sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRW52aXJvbm1lbnRJbmplY3RvcixcbiAgRXZlbnRFbWl0dGVyLFxuICBpbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvdmlydHVhbC1zY3JvbGwtZGF0YS1yYW5nZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0S2V5ID1cbiAgfCAnY2RrVmlydHVhbEZvck9mJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVHJhY2tCeSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSBQYXJ0aWFsPFBpY2s8Q2RrVmlydHVhbEZvck9mPFQ+LCBDZGtWaXJ0dWFsRm9ySW5wdXRLZXk+PjtcblxudHlwZSBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0gUGljazxDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCAnaXRlbVNpemUnIHwgJ21pbkJ1ZmZlclB4JyB8ICdtYXhCdWZmZXJQeCc+O1xuXG5jb25zdCBkZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0czogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IHtcbiAgaXRlbVNpemU6IDMyLFxuICBtaW5CdWZmZXJQeDogMjAwLFxuICBtYXhCdWZmZXJQeDogNDAwLFxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclZpcnR1YWxTY3JvbGxdLFtDbHJWaXJ0dWFsU2Nyb2xsXScsXG4gIHByb3ZpZGVyczogW0l0ZW1zXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlbmRlcmVkUmFuZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPExpc3RSYW5nZT4oKTtcbiAgQElucHV0KCdjbHJWaXJ0dWFsUGVyc2lzdEl0ZW1zJykgcGVyc2lzdEl0ZW1zID0gdHJ1ZTtcblxuICBwcml2YXRlIF9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0geyAuLi5kZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyB9O1xuXG4gIHByaXZhdGUgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIGdyaWRSb2xlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3I6IENka1ZpcnR1YWxGb3JPZjxUPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHRvcEluZGV4ID0gMDtcbiAgcHJpdmF0ZSBtdXRhdGlvbkNoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhpcyB0byBiZSBjYWxsZWQgdHdpY2UgYmVjYXVzZSB0aGUgb2xkIGNsYXNzIGlzIHJlbW92ZWQgYW5kIHRoZSBuZXcgYWRkZWRcbiAgICAgIGlmICgobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJiB0aGlzLml0ZW1TaXplID4gMjQpIHtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IDI0O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG4gIHByaXZhdGUgX3RvdGFsSXRlbXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuXG4gICAgLy8gZGVmYXVsdFxuICAgIHRoaXMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gMjA7XG5cbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneSA9IG5ldyBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3koXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplLFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHhcbiAgICApO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c09mJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JPZigpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZjtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvck9mKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yT2YnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yT2YgPSB2YWx1ZTtcbiAgICB0aGlzLml0ZW1zLmFsbCA9IHZhbHVlIGFzIFRbXTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUcmFja0J5JylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUcmFja0J5KCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnk7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUcmFja0J5KHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVHJhY2tCeSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUcmFja0J5ID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVGVtcGxhdGUnKVxuICBnZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKCkge1xuICAgIHJldHVybiB0aGlzPy5jZGtWaXJ0dWFsRm9ySW5wdXRzPy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlID0gdmFsdWU7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVGVtcGxhdGVDYWNoZVNpemUnKVxuICBnZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NJdGVtU2l6ZScpXG4gIGdldCBpdGVtU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZTtcbiAgfVxuICBzZXQgaXRlbVNpemUodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ2l0ZW1TaXplJ10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c01pbkJ1ZmZlclB4JylcbiAgZ2V0IG1pbkJ1ZmZlclB4KCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4O1xuICB9XG4gIHNldCBtaW5CdWZmZXJQeCh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snbWluQnVmZmVyUHgnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWF4QnVmZmVyUHgnKVxuICBnZXQgbWF4QnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1heEJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtYXhCdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbERhdGFSYW5nZScpXG4gIHNldCBkYXRhUmFuZ2UocmFuZ2U6IENsckRhdGFncmlkVmlydHVhbFNjcm9sbFJhbmdlSW50ZXJmYWNlPFQ+KSB7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLml0ZW1zLnNtYXJ0KSB7XG4gICAgICB0aGlzLml0ZW1zLnNtYXJ0ZW5Eb3duKCk7XG4gICAgfVxuXG4gICAgdGhpcy50b3RhbEl0ZW1zID0gcmFuZ2UudG90YWw7XG5cbiAgICB0aGlzLnVwZGF0ZURhdGFSYW5nZShyYW5nZS5za2lwLCByYW5nZS5kYXRhKTtcbiAgfVxuXG4gIGdldCB0b3RhbEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl90b3RhbEl0ZW1zO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQgdG90YWxJdGVtcyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fdG90YWxJdGVtcyA9IHZhbHVlO1xuICB9XG5cbiAgcHJlcGFyZURhdGFncmlkKGRhdGFncmlkOiBDbHJEYXRhZ3JpZDxUPikge1xuICAgIGRhdGFncmlkLmRldGFpbFNlcnZpY2UucHJldmVudEZvY3VzU2Nyb2xsID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmID0gZGF0YWdyaWQuZWw7XG5cbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcy5vYnNlcnZlKHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcyddLFxuICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgIGRhdGFncmlkLnJlZnJlc2guc3Vic2NyaWJlKGRhdGFncmlkU3RhdGUgPT4ge1xuICAgICAgICBpZiAoZGF0YWdyaWRTdGF0ZS5maWx0ZXJzKSB7XG4gICAgICAgICAgdGhpcy5zY3JvbGxUb0luZGV4KDApO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbmplY3Rvci5ydW5JbkNvbnRleHQoKCkgPT4ge1xuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSB0aGlzLmNyZWF0ZVZpcnR1YWxTY3JvbGxWaWV3cG9ydEZvckRhdGFncmlkKFxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICB0aGlzLm5nWm9uZSxcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIsXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgICAgdGhpcy52aWV3cG9ydFJ1bGVyLFxuICAgICAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3lcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvciA9IGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZShcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgICB0aGlzLnRlbXBsYXRlUmVmLFxuICAgICAgICB0aGlzLml0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIsXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgICB0aGlzLm5nWm9uZVxuICAgICAgKTtcblxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQubmdPbkluaXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JpZFJvbGVFbGVtZW50ID0gdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW3JvbGU9XCJncmlkXCJdJyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5pdGVtcy5jaGFuZ2Uuc3Vic2NyaWJlKG5ld0l0ZW1zID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuY2RrVmlydHVhbEZvck9mID0gbmV3SXRlbXM7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yLmRhdGFTdHJlYW0uc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dDb3VudChkYXRhLmxlbmd0aCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LnNjcm9sbGVkSW5kZXhDaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgICAgdGhpcy50b3BJbmRleCA9IGluZGV4O1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5yZW5kZXJlZFJhbmdlU3RyZWFtLnN1YnNjcmliZShyZW5kZXJlZFJhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZFJhbmdlQ2hhbmdlLmVtaXQocmVuZGVyZWRSYW5nZSk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY29sdW1uc1NlcnZpY2UuY29sdW1uc1N0YXRlQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudmlld1JlcGVhdGVyLmRldGFjaCgpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcj8ubmdEb0NoZWNrKCk7XG4gICAgdGhpcy51cGRhdGVBcmlhUm93SW5kZXhlcygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yPy5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5uZ09uRGVzdHJveSgpO1xuICAgIHRoaXMubXV0YXRpb25DaGFuZ2VzPy5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmZvckVhY2goc3Vic2NyaXB0aW9uID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2Nyb2xsVXAob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4IC0gb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxEb3duKG9mZnNldDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy50b3BJbmRleCArIG9mZnNldCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8uc2Nyb2xsVG9JbmRleChpbmRleCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVEYXRhUmFuZ2Uoc2tpcDogbnVtYmVyLCBkYXRhOiBUW10pIHtcbiAgICBsZXQgaXRlbXMgPSB0aGlzLmNka1ZpcnR1YWxGb3JPZiBhcyBUW107XG5cbiAgICBpZiAoIXRoaXMucGVyc2lzdEl0ZW1zIHx8ICFpdGVtcyB8fCBpdGVtcz8ubGVuZ3RoICE9PSB0aGlzLnRvdGFsSXRlbXMpIHtcbiAgICAgIGl0ZW1zID0gQXJyYXkodGhpcy50b3RhbEl0ZW1zKTtcbiAgICB9XG5cbiAgICBpdGVtcy5zcGxpY2Uoc2tpcCwgZGF0YS5sZW5ndGgsIC4uLmRhdGEpO1xuXG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yT2YgPSBBcnJheS5mcm9tKGl0ZW1zKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpIHtcbiAgICBpZiAodGhpcy5jZGtWaXJ0dWFsRm9yKSB7XG4gICAgICBmb3IgKGNvbnN0IGNka1ZpcnR1YWxGb3JJbnB1dEtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMpIGFzIENka1ZpcnR1YWxGb3JJbnB1dEtleVtdKSB7XG4gICAgICAgIGlmICh0aGlzLmNka1ZpcnR1YWxGb3JbY2RrVmlydHVhbEZvcklucHV0S2V5XSAhPT0gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0pIHtcbiAgICAgICAgICAodGhpcy5jZGtWaXJ0dWFsRm9yIGFzIGFueSlbY2RrVmlydHVhbEZvcklucHV0S2V5XSA9IHRoaXMuY2RrVmlydHVhbEZvcklucHV0c1tjZGtWaXJ0dWFsRm9ySW5wdXRLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCkge1xuICAgIGlmICh0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneSkge1xuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kudXBkYXRlSXRlbUFuZEJ1ZmZlclNpemUoXG4gICAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUsXG4gICAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHgsXG4gICAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHhcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmlhUm93Q291bnQocm93Q291bnQ6IG51bWJlcikge1xuICAgIHRoaXMuZ3JpZFJvbGVFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm93Y291bnQnLCByb3dDb3VudC50b1N0cmluZygpKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQXJpYVJvd0luZGV4ZXMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZpZXdDb250YWluZXJSZWYubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHZpZXdSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuZ2V0KGkpIGFzIEVtYmVkZGVkVmlld1JlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PjtcblxuICAgICAgY29uc3Qgcm9vdEVsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gdmlld1JlZi5yb290Tm9kZXM7XG4gICAgICBjb25zdCBkYXRhZ3JpZFJvd0VsZW1lbnQgPSByb290RWxlbWVudHMuZmluZChyb3dFbGVtZW50ID0+IHJvd0VsZW1lbnQudGFnTmFtZSA9PT0gJ0NMUi1ERy1ST1cnKTtcbiAgICAgIGNvbnN0IHJvd1JvbGVFbGVtZW50ID0gZGF0YWdyaWRSb3dFbGVtZW50Py5xdWVyeVNlbGVjdG9yKCdbcm9sZT1cInJvd1wiXScpO1xuXG4gICAgICAvLyBhcmlhLXJvd2luZGV4IHNob3VsZCBzdGFydCB3aXRoIG9uZSwgbm90IHplcm8sIHNvIHdlIGhhdmUgdG8gYWRkIG9uZSB0byB0aGUgemVyby1iYXNlZCBpbmRleFxuICAgICAgcm93Um9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3dpbmRleCcsICh2aWV3UmVmLmNvbnRleHQuaW5kZXggKyAxKS50b1N0cmluZygpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVZpcnR1YWxTY3JvbGxWaWV3cG9ydEZvckRhdGFncmlkKFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIGRhdGFncmlkRWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3lcbiAgKSB7XG4gICAgY29uc3QgZGF0YWdyaWREaXZFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZCcpO1xuICAgIGNvbnN0IGRhdGFncmlkVGFibGVFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC10YWJsZScpO1xuICAgIGNvbnN0IGRhdGFncmlkUm93c0VsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkLXJvd3MnKTtcbiAgICBjb25zdCBkYXRhZ3JpZERpdkVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+ID0geyBuYXRpdmVFbGVtZW50OiBkYXRhZ3JpZERpdkVsZW1lbnQgfTtcblxuICAgIGxldCB0b3BPZmZzZXQgPSAwO1xuICAgIGxldCB0b3RhbENvbnRlbnRTaXplID0gMDtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZURhdGFncmlkRWxlbWVudFN0eWxlcygpIHtcbiAgICAgIGRhdGFncmlkUm93c0VsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVkoJHt0b3BPZmZzZXR9cHgpYDtcbiAgICAgIGRhdGFncmlkUm93c0VsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dG90YWxDb250ZW50U2l6ZSAtIHRvcE9mZnNldH1weGA7XG4gICAgfVxuXG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0ID0gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgZGF0YWdyaWREaXZFbGVtZW50UmVmLFxuICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICByZW5kZXJlcjIsXG4gICAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBkaXJlY3Rpb25hbGl0eSxcbiAgICAgIHNjcm9sbERpc3BhdGNoZXIsXG4gICAgICB2aWV3cG9ydFJ1bGVyLFxuICAgICAgbnVsbCBhcyBhbnkgYXMgQ2RrVmlydHVhbFNjcm9sbGFibGVFbGVtZW50XG4gICAgKTtcblxuICAgIHZpcnR1YWxTY3JvbGxWaWV3cG9ydC5fY29udGVudFdyYXBwZXIgPSB7XG4gICAgICBuYXRpdmVFbGVtZW50OiB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgc2V0IHRyYW5zZm9ybSh2YWx1ZTogYW55KSB7XG4gICAgICAgICAgICB0b3BPZmZzZXQgPSB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6ICsvdHJhbnNsYXRlWVxcKChbMC05XSspcHhcXCkvLmV4ZWModmFsdWUpPy5bMV07XG4gICAgICAgICAgICB1cGRhdGVEYXRhZ3JpZEVsZW1lbnRTdHlsZXMoKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9IGFzIEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0LnNldFRvdGFsQ29udGVudFNpemUgPSAodmFsdWU6IG51bWJlcikgPT4ge1xuICAgICAgdG90YWxDb250ZW50U2l6ZSA9IHZhbHVlO1xuICAgICAgZGF0YWdyaWRUYWJsZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7dG90YWxDb250ZW50U2l6ZX1weGA7XG4gICAgICB1cGRhdGVEYXRhZ3JpZEVsZW1lbnRTdHlsZXMoKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gIGRhdGFncmlkRGl2RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgbmdab25lOiBOZ1pvbmUsXG4gIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IFZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICBzY3JvbGxhYmxlOiBDZGtWaXJ0dWFsU2Nyb2xsYWJsZVxuKSB7XG4gIGlmICgrQU5HVUxBUl9WRVJTSU9OLm1ham9yIDwgMTkpIHtcbiAgICByZXR1cm4gbmV3IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgICAgIGRhdGFncmlkRGl2RWxlbWVudFJlZixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIHNjcm9sbGFibGVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogRWxlbWVudFJlZiwgdXNlVmFsdWU6IGRhdGFncmlkRGl2RWxlbWVudFJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IENoYW5nZURldGVjdG9yUmVmLCB1c2VWYWx1ZTogY2hhbmdlRGV0ZWN0b3JSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOZ1pvbmUsIHVzZVZhbHVlOiBuZ1pvbmUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBSZW5kZXJlcjIsIHVzZVZhbHVlOiByZW5kZXJlcjIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBWSVJUVUFMX1NDUk9MTF9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxTdHJhdGVneSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LCB1c2VWYWx1ZTogZGlyZWN0aW9uYWxpdHkgfSxcbiAgICAgICAgeyBwcm92aWRlOiBTY3JvbGxEaXNwYXRjaGVyLCB1c2VWYWx1ZTogc2Nyb2xsRGlzcGF0Y2hlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZpZXdwb3J0UnVsZXIsIHVzZVZhbHVlOiB2aWV3cG9ydFJ1bGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbGFibGUsIHVzZVZhbHVlOiBzY3JvbGxhYmxlIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VDbGFzczogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0IH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yLmdldChDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZTxUPihcbiAgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+LFxuICBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgdmlld1JlcGVhdGVyOiBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+LFxuICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgbmdab25lOiBOZ1pvbmVcbikge1xuICBpZiAoK0FOR1VMQVJfVkVSU0lPTi5tYWpvciA8IDE5KSB7XG4gICAgcmV0dXJuIG5ldyBDZGtWaXJ0dWFsRm9yT2Y8VD4oXG4gICAgICB2aWV3Q29udGFpbmVyUmVmLFxuICAgICAgdGVtcGxhdGVSZWYsXG4gICAgICBpdGVyYWJsZURpZmZlcnMsXG4gICAgICB2aWV3UmVwZWF0ZXIsXG4gICAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gICAgICBuZ1pvbmVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpLFxuICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZVZhbHVlOiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgfV0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvcixcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IFZpZXdDb250YWluZXJSZWYsIHVzZVZhbHVlOiB2aWV3Q29udGFpbmVyUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVGVtcGxhdGVSZWYsIHVzZVZhbHVlOiB0ZW1wbGF0ZVJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IEl0ZXJhYmxlRGlmZmVycywgdXNlVmFsdWU6IGl0ZXJhYmxlRGlmZmVycyB9LFxuICAgICAgICB7IHByb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VWYWx1ZTogdmlld1JlcGVhdGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTmdab25lLCB1c2VWYWx1ZTogbmdab25lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbEZvck9mLCB1c2VDbGFzczogQ2RrVmlydHVhbEZvck9mIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNka1ZpcnR1YWxGb3JJbmplY3Rvci5nZXQoQ2RrVmlydHVhbEZvck9mKTtcbiAgfVxufVxuIl19