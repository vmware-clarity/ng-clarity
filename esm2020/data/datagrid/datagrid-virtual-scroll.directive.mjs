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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBQ0wsZUFBZSxFQUNmLE1BQU0sRUFFTixNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUd6QyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7Ozs7QUFZMUMsTUFBTSxzQ0FBc0MsR0FBb0M7SUFDOUUsUUFBUSxFQUFFLEVBQUU7SUFDWixXQUFXLEVBQUUsR0FBRztJQUNoQixXQUFXLEVBQUUsR0FBRztDQUNqQixDQUFDO0FBTUYsTUFBTSxPQUFPLGlD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RUFBRTthQUN4RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8scUJBQXFCLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ25EO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5LCBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgTGlzdFJhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGwsXG4gIENka1ZpcnR1YWxGb3JPZixcbiAgQ2RrVmlydHVhbEZvck9mQ29udGV4dCxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGUsXG4gIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudCxcbiAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIFNjcm9sbERpc3BhdGNoZXIsXG4gIFZpZXdwb3J0UnVsZXIsXG4gIFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLFxuICBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgVkVSU0lPTiBhcyBBTkdVTEFSX1ZFUlNJT04sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRW52aXJvbm1lbnRJbmplY3RvcixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIGluamVjdCxcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckRhdGFncmlkIH0gZnJvbSAnLi9kYXRhZ3JpZCc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxSYW5nZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcy92aXJ0dWFsLXNjcm9sbC1kYXRhLXJhbmdlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vcHJvdmlkZXJzL2l0ZW1zJztcblxudHlwZSBDZGtWaXJ0dWFsRm9ySW5wdXRLZXkgPVxuICB8ICdjZGtWaXJ0dWFsRm9yT2YnXG4gIHwgJ2Nka1ZpcnR1YWxGb3JUcmFja0J5J1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGUnXG4gIHwgJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IFBhcnRpYWw8UGljazxDZGtWaXJ0dWFsRm9yT2Y8VD4sIENka1ZpcnR1YWxGb3JJbnB1dEtleT4+O1xuXG50eXBlIENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMgPSBQaWNrPENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGwsICdpdGVtU2l6ZScgfCAnbWluQnVmZmVyUHgnIHwgJ21heEJ1ZmZlclB4Jz47XG5cbmNvbnN0IGRlZmF1bHRDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0ge1xuICBpdGVtU2l6ZTogMzIsXG4gIG1pbkJ1ZmZlclB4OiAyMDAsXG4gIG1heEJ1ZmZlclB4OiA0MDAsXG59O1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbY2xyVmlydHVhbFNjcm9sbF0sW0NsclZpcnR1YWxTY3JvbGxdJyxcbiAgcHJvdmlkZXJzOiBbSXRlbXNdLFxufSlcbmV4cG9ydCBjbGFzcyBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxEaXJlY3RpdmU8VD4gaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBEb0NoZWNrLCBPbkRlc3Ryb3kge1xuICBAT3V0cHV0KCkgcmVuZGVyZWRSYW5nZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TGlzdFJhbmdlPigpO1xuICBASW5wdXQoJ2NsclZpcnR1YWxQZXJzaXN0SXRlbXMnKSBwZXJzaXN0SXRlbXMgPSB0cnVlO1xuXG4gIHByaXZhdGUgX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMgPSB7IC4uLmRlZmF1bHRDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkYXRhZ3JpZEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIHByaXZhdGUgZ3JpZFJvbGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcjogQ2RrVmlydHVhbEZvck9mPFQ+O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgdG9wSW5kZXggPSAwO1xuICBwcml2YXRlIG11dGF0aW9uQ2hhbmdlczogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10pID0+IHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKSA9PiB7XG4gICAgICAvLyBpdCBpcyBwb3NzaWJsZSB0aGlzIHRvIGJlIGNhbGxlZCB0d2ljZSBiZWNhdXNlIHRoZSBvbGQgY2xhc3MgaXMgcmVtb3ZlZCBhbmQgdGhlIG5ldyBhZGRlZFxuICAgICAgaWYgKChtdXRhdGlvbi50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5jb250YWlucygnZGF0YWdyaWQtY29tcGFjdCcpICYmIHRoaXMuaXRlbVNpemUgPiAyNCkge1xuICAgICAgICB0aGlzLml0ZW1TaXplID0gMjQ7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHByaXZhdGUgdmlld1JlcGVhdGVyID0gbmV3IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3k8VCwgVCwgQ2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4oKTtcbiAgcHJpdmF0ZSBjZGtWaXJ0dWFsRm9ySW5wdXRzOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+ID0ge1xuICAgIGNka1ZpcnR1YWxGb3JUcmFja0J5OiBpbmRleCA9PiBpbmRleCxcbiAgfTtcbiAgcHJpdmF0ZSBfdG90YWxJdGVtczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gICAgcHJpdmF0ZSBpdGVtczogSXRlbXM8VD4sXG4gICAgcHJpdmF0ZSByZWFkb25seSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSB2aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBDbHJEYXRhZ3JpZCkpIHByaXZhdGUgcmVhZG9ubHkgZGF0YWdyaWQ6IENsckRhdGFncmlkLFxuICAgIHByaXZhdGUgY29sdW1uc1NlcnZpY2U6IENvbHVtbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgaW5qZWN0b3I6IEVudmlyb25tZW50SW5qZWN0b3JcbiAgKSB7XG4gICAgaXRlbXMuc21hcnRlblVwKCk7XG4gICAgZGF0YWdyaWQuZGV0YWlsU2VydmljZS5wcmV2ZW50Rm9jdXNTY3JvbGwgPSB0cnVlO1xuXG4gICAgdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYgPSBkYXRhZ3JpZC5lbDtcblxuICAgIC8vIGRlZmF1bHRcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSA9IDIwO1xuXG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXMub2JzZXJ2ZSh0aGlzLmRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnY2xhc3MnXSxcbiAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kgPSBuZXcgRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5KFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZSxcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHgsXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4XG4gICAgKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NPZicpXG4gIGdldCBjZGtWaXJ0dWFsRm9yT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yT2Y7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JPZih2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvck9mJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mID0gdmFsdWU7XG4gICAgdGhpcy5pdGVtcy5hbGwgPSB2YWx1ZSBhcyBUW107XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzVHJhY2tCeScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVHJhY2tCeSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUcmFja0J5O1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVHJhY2tCeSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRyYWNrQnknXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RlbXBsYXRlJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcz8uY2RrVmlydHVhbEZvcklucHV0cz8uY2RrVmlydHVhbEZvclRlbXBsYXRlO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZSddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZSA9IHZhbHVlO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RlbXBsYXRlQ2FjaGVTaXplJylcbiAgZ2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzSXRlbVNpemUnKVxuICBnZXQgaXRlbVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemU7XG4gIH1cbiAgc2V0IGl0ZW1TaXplKHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydpdGVtU2l6ZSddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNaW5CdWZmZXJQeCcpXG4gIGdldCBtaW5CdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeDtcbiAgfVxuICBzZXQgbWluQnVmZmVyUHgodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ21pbkJ1ZmZlclB4J10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c01heEJ1ZmZlclB4JylcbiAgZ2V0IG1heEJ1ZmZlclB4KCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4O1xuICB9XG4gIHNldCBtYXhCdWZmZXJQeCh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snbWF4QnVmZmVyUHgnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWF4QnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxEYXRhUmFuZ2UnKVxuICBzZXQgZGF0YVJhbmdlKHJhbmdlOiBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxSYW5nZUludGVyZmFjZTxUPikge1xuICAgIGlmICghcmFuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgdGhpcy5pdGVtcy5zbWFydGVuRG93bigpO1xuICAgIH1cblxuICAgIHRoaXMudG90YWxJdGVtcyA9IHJhbmdlLnRvdGFsO1xuXG4gICAgdGhpcy51cGRhdGVEYXRhUmFuZ2UocmFuZ2Uuc2tpcCwgcmFuZ2UuZGF0YSk7XG4gIH1cblxuICBnZXQgdG90YWxJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fdG90YWxJdGVtcztcbiAgfVxuXG4gIHByaXZhdGUgc2V0IHRvdGFsSXRlbXModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3RvdGFsSXRlbXMgPSB2YWx1ZTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLmluamVjdG9yLnJ1bkluQ29udGV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydCA9IHRoaXMuY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICAgIHRoaXMubmdab25lLFxuICAgICAgICB0aGlzLnJlbmRlcmVyMixcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgdGhpcy5zY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgICB0aGlzLnZpZXdwb3J0UnVsZXIsXG4gICAgICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmLFxuICAgICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICAgICAgKTtcblxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yID0gY3JlYXRlQ2RrVmlydHVhbEZvck9mRGlyZWN0aXZlKFxuICAgICAgICB0aGlzLnZpZXdDb250YWluZXJSZWYsXG4gICAgICAgIHRoaXMudGVtcGxhdGVSZWYsXG4gICAgICAgIHRoaXMuaXRlcmFibGVEaWZmZXJzLFxuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlcixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gICAgICAgIHRoaXMubmdab25lXG4gICAgICApO1xuXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5uZ09uSW5pdCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQgPSB0aGlzLmRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCdbcm9sZT1cImdyaWRcIl0nKTtcblxuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLml0ZW1zLmNoYW5nZS5zdWJzY3JpYmUobmV3SXRlbXMgPT4ge1xuICAgICAgICBpZiAodGhpcy5pdGVtcy5zbWFydCkge1xuICAgICAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5jZGtWaXJ0dWFsRm9yT2YgPSBuZXdJdGVtcztcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuZGF0YVN0cmVhbS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlQXJpYVJvd0NvdW50KGRhdGEubGVuZ3RoKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQuc2Nyb2xsZWRJbmRleENoYW5nZS5zdWJzY3JpYmUoaW5kZXggPT4ge1xuICAgICAgICB0aGlzLnRvcEluZGV4ID0gaW5kZXg7XG4gICAgICB9KSxcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LnJlbmRlcmVkUmFuZ2VTdHJlYW0uc3Vic2NyaWJlKHJlbmRlcmVkUmFuZ2UgPT4ge1xuICAgICAgICB0aGlzLnJlbmRlcmVkUmFuZ2VDaGFuZ2UuZW1pdChyZW5kZXJlZFJhbmdlKTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5kYXRhZ3JpZC5yZWZyZXNoLnN1YnNjcmliZShkYXRhZ3JpZFN0YXRlID0+IHtcbiAgICAgICAgaWYgKGRhdGFncmlkU3RhdGUuZmlsdGVycykge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9JbmRleCgwKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnNTdGF0ZUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlci5kZXRhY2goKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nRG9DaGVjaygpO1xuICAgIHRoaXMudXBkYXRlQXJpYVJvd0luZGV4ZXMoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcj8ubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8ubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLm11dGF0aW9uQ2hhbmdlcz8uZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjcm9sbFVwKG9mZnNldDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICB0aGlzLnNjcm9sbFRvSW5kZXgodGhpcy50b3BJbmRleCAtIG9mZnNldCwgYmVoYXZpb3IpO1xuICB9XG5cbiAgc2Nyb2xsRG93bihvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggKyBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbFRvSW5kZXgoaW5kZXg6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/LnNjcm9sbFRvSW5kZXgoaW5kZXgsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGF0YVJhbmdlKHNraXA6IG51bWJlciwgZGF0YTogVFtdKSB7XG4gICAgbGV0IGl0ZW1zID0gdGhpcy5jZGtWaXJ0dWFsRm9yT2YgYXMgVFtdO1xuXG4gICAgaWYgKCF0aGlzLnBlcnNpc3RJdGVtcyB8fCAhaXRlbXMgfHwgaXRlbXM/Lmxlbmd0aCAhPT0gdGhpcy50b3RhbEl0ZW1zKSB7XG4gICAgICBpdGVtcyA9IEFycmF5KHRoaXMudG90YWxJdGVtcyk7XG4gICAgfVxuXG4gICAgaXRlbXMuc3BsaWNlKHNraXAsIGRhdGEubGVuZ3RoLCAuLi5kYXRhKTtcblxuICAgIHRoaXMuY2RrVmlydHVhbEZvck9mID0gQXJyYXkuZnJvbShpdGVtcyk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcikge1xuICAgICAgZm9yIChjb25zdCBjZGtWaXJ0dWFsRm9ySW5wdXRLZXkgb2YgT2JqZWN0LmtleXModGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzKSBhcyBDZGtWaXJ0dWFsRm9ySW5wdXRLZXlbXSkge1xuICAgICAgICBpZiAodGhpcy5jZGtWaXJ0dWFsRm9yW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gIT09IHRoaXMuY2RrVmlydHVhbEZvcklucHV0c1tjZGtWaXJ0dWFsRm9ySW5wdXRLZXldKSB7XG4gICAgICAgICAgKHRoaXMuY2RrVmlydHVhbEZvciBhcyBhbnkpW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV0gPSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpIHtcbiAgICBpZiAodGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5LnVwZGF0ZUl0ZW1BbmRCdWZmZXJTaXplKFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplLFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4LFxuICAgICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQXJpYVJvd0NvdW50KHJvd0NvdW50OiBudW1iZXIpIHtcbiAgICB0aGlzLmdyaWRSb2xlRWxlbWVudD8uc2V0QXR0cmlidXRlKCdhcmlhLXJvd2NvdW50Jywgcm93Q291bnQudG9TdHJpbmcoKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dJbmRleGVzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmdldChpKSBhcyBFbWJlZGRlZFZpZXdSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj47XG5cbiAgICAgIGNvbnN0IHJvb3RFbGVtZW50czogSFRNTEVsZW1lbnRbXSA9IHZpZXdSZWYucm9vdE5vZGVzO1xuICAgICAgY29uc3QgZGF0YWdyaWRSb3dFbGVtZW50ID0gcm9vdEVsZW1lbnRzLmZpbmQocm93RWxlbWVudCA9PiByb3dFbGVtZW50LnRhZ05hbWUgPT09ICdDTFItREctUk9XJyk7XG4gICAgICBjb25zdCByb3dSb2xlRWxlbWVudCA9IGRhdGFncmlkUm93RWxlbWVudD8ucXVlcnlTZWxlY3RvcignW3JvbGU9XCJyb3dcIl0nKTtcblxuICAgICAgLy8gYXJpYS1yb3dpbmRleCBzaG91bGQgc3RhcnQgd2l0aCBvbmUsIG5vdCB6ZXJvLCBzbyB3ZSBoYXZlIHRvIGFkZCBvbmUgdG8gdGhlIHplcm8tYmFzZWQgaW5kZXhcbiAgICAgIHJvd1JvbGVFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnLCAodmlld1JlZi5jb250ZXh0LmluZGV4ICsgMSkudG9TdHJpbmcoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVWaXJ0dWFsU2Nyb2xsVmlld3BvcnRGb3JEYXRhZ3JpZChcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgbmdab25lOiBOZ1pvbmUsXG4gICAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBkYXRhZ3JpZEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5XG4gICkge1xuICAgIGNvbnN0IGRhdGFncmlkRGl2RWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQnKTtcbiAgICBjb25zdCBkYXRhZ3JpZFRhYmxlRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtdGFibGUnKTtcbiAgICBjb25zdCBkYXRhZ3JpZFJvd3NFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC1yb3dzJyk7XG4gICAgY29uc3QgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiA9IHsgbmF0aXZlRWxlbWVudDogZGF0YWdyaWREaXZFbGVtZW50IH07XG5cbiAgICBsZXQgdG9wT2Zmc2V0ID0gMDtcbiAgICBsZXQgdG90YWxDb250ZW50U2l6ZSA9IDA7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVEYXRhZ3JpZEVsZW1lbnRTdHlsZXMoKSB7XG4gICAgICBkYXRhZ3JpZFJvd3NFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVZKCR7dG9wT2Zmc2V0fXB4KWA7XG4gICAgICBkYXRhZ3JpZFJvd3NFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RvdGFsQ29udGVudFNpemUgLSB0b3BPZmZzZXR9cHhgO1xuICAgIH1cblxuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCA9IGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgICAgIGRhdGFncmlkRGl2RWxlbWVudFJlZixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgcmVuZGVyZXIyLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIG51bGwgYXMgYW55IGFzIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudFxuICAgICk7XG5cbiAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQuX2NvbnRlbnRXcmFwcGVyID0ge1xuICAgICAgbmF0aXZlRWxlbWVudDoge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHNldCB0cmFuc2Zvcm0odmFsdWU6IGFueSkge1xuICAgICAgICAgICAgdG9wT2Zmc2V0ID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IDAgOiArL3RyYW5zbGF0ZVlcXCgoWzAtOV0rKXB4XFwpLy5leGVjKHZhbHVlKT8uWzFdO1xuICAgICAgICAgICAgdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSBhcyBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICAgIHZpcnR1YWxTY3JvbGxWaWV3cG9ydC5zZXRUb3RhbENvbnRlbnRTaXplID0gKHZhbHVlOiBudW1iZXIpID0+IHtcbiAgICAgIHRvdGFsQ29udGVudFNpemUgPSB2YWx1ZTtcbiAgICAgIGRhdGFncmlkVGFibGVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke3RvdGFsQ29udGVudFNpemV9cHhgO1xuICAgICAgdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCk7XG4gICAgfTtcblxuICAgIHJldHVybiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICBkYXRhZ3JpZERpdkVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIG5nWm9uZTogTmdab25lLFxuICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgc2Nyb2xsYWJsZTogQ2RrVmlydHVhbFNjcm9sbGFibGVcbikge1xuICBpZiAoK0FOR1VMQVJfVkVSU0lPTi5tYWpvciA8IDE5KSB7XG4gICAgcmV0dXJuIG5ldyBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gICAgICBkYXRhZ3JpZERpdkVsZW1lbnRSZWYsXG4gICAgICBjaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgICAgIGRpcmVjdGlvbmFsaXR5LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIHZpZXdwb3J0UnVsZXIsXG4gICAgICBzY3JvbGxhYmxlXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IEVsZW1lbnRSZWYsIHVzZVZhbHVlOiBkYXRhZ3JpZERpdkVsZW1lbnRSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDaGFuZ2VEZXRlY3RvclJlZiwgdXNlVmFsdWU6IGNoYW5nZURldGVjdG9yUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogTmdab25lLCB1c2VWYWx1ZTogbmdab25lIH0sXG4gICAgICAgIHsgcHJvdmlkZTogUmVuZGVyZXIyLCB1c2VWYWx1ZTogcmVuZGVyZXIyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVklSVFVBTF9TQ1JPTExfU1RSQVRFR1ksIHVzZVZhbHVlOiB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kgfSxcbiAgICAgICAgeyBwcm92aWRlOiBEaXJlY3Rpb25hbGl0eSwgdXNlVmFsdWU6IGRpcmVjdGlvbmFsaXR5IH0sXG4gICAgICAgIHsgcHJvdmlkZTogU2Nyb2xsRGlzcGF0Y2hlciwgdXNlVmFsdWU6IHNjcm9sbERpc3BhdGNoZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBWaWV3cG9ydFJ1bGVyLCB1c2VWYWx1ZTogdmlld3BvcnRSdWxlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxhYmxlLCB1c2VWYWx1ZTogc2Nyb2xsYWJsZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCwgdXNlQ2xhc3M6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3Rvci5nZXQoQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDZGtWaXJ0dWFsRm9yT2ZEaXJlY3RpdmU8VD4oXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gIHZpZXdSZXBlYXRlcjogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBULCBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIG5nWm9uZTogTmdab25lXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbEZvck9mPFQ+KFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHRlbXBsYXRlUmVmLFxuICAgICAgaXRlcmFibGVEaWZmZXJzLFxuICAgICAgdmlld1JlcGVhdGVyLFxuICAgICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgbmdab25lXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFZpZXdwb3J0IH1dLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2RrVmlydHVhbEZvckluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBWaWV3Q29udGFpbmVyUmVmLCB1c2VWYWx1ZTogdmlld0NvbnRhaW5lclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFRlbXBsYXRlUmVmLCB1c2VWYWx1ZTogdGVtcGxhdGVSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBJdGVyYWJsZURpZmZlcnMsIHVzZVZhbHVlOiBpdGVyYWJsZURpZmZlcnMgfSxcbiAgICAgICAgeyBwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpZXdSZXBlYXRlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxGb3JPZiwgdXNlQ2xhc3M6IENka1ZpcnR1YWxGb3JPZiB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHJldHVybiBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxGb3JPZik7XG4gIH1cbn1cbiJdfQ==