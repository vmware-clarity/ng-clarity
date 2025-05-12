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
ClrDatagridVirtualScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.Items }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality }, { token: i3.ScrollDispatcher }, { token: i3.ViewportRuler }, { token: i4.ClrDatagrid }, { token: i5.ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.2", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrVirtualScroll],[ClrVirtualScroll]',
                    providers: [Items],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.IterableDiffers }, { type: i1.Items }, { type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i2.Directionality }, { type: i3.ScrollDispatcher }, { type: i3.ViewportRuler }, { type: i4.ClrDatagrid }, { type: i5.ColumnsService }, { type: i0.EnvironmentInjector }]; }, propDecorators: { renderedRangeChange: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxFQUFFLDRCQUE0QixFQUFFLHVCQUF1QixFQUFhLE1BQU0sMEJBQTBCLENBQUM7QUFDNUcsT0FBTyxFQUVMLGVBQWUsRUFFZixvQkFBb0IsRUFFcEIsd0JBQXdCLEVBQ3hCLDhCQUE4QixFQUM5QixnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLHVCQUF1QixHQUV4QixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFFTCxPQUFPLElBQUksZUFBZSxFQUMxQixpQkFBaUIsRUFDakIsU0FBUyxFQUVULFVBQVUsRUFFVixtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLE1BQU0sRUFDTixRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7Ozs7OztBQVkxQyxNQUFNLHNDQUFzQyxHQUFvQztJQUM5RSxRQUFRLEVBQUUsRUFBRTtJQUNaLFdBQVcsRUFBRSxHQUFHO0lBQ2hCLFdBQVcsRUFBRSxHQUFHO0NBQ2pCLENBQUM7QUFNRixNQUFNLE9BQU8saUNBQWlDO0lBNkI1QyxZQUNtQixpQkFBb0MsRUFDN0MsZUFBZ0MsRUFDaEMsS0FBZSxFQUNOLE1BQWMsRUFDZCxTQUFvQixFQUNwQixXQUFtRCxFQUNuRCxnQkFBa0MsRUFDbEMsY0FBOEIsRUFDOUIsZ0JBQWtDLEVBQ2xDLGFBQTRCLEVBQzVCLFFBQXFCLEVBQzlCLGNBQThCLEVBQ3JCLFFBQTZCO1FBWjdCLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDN0Msb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBQ2hDLFVBQUssR0FBTCxLQUFLLENBQVU7UUFDTixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNwQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0M7UUFDbkQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDOUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixhQUFRLEdBQVIsUUFBUSxDQUFhO1FBQzlCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUNyQixhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQXpDdEMsd0JBQW1CLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQUM3QixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUU3QyxxQ0FBZ0MsR0FBRyxFQUFFLEdBQUcsc0NBQXNDLEVBQUUsQ0FBQztRQVFqRixrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUNiLG9CQUFlLEdBQXFCLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxTQUEyQixFQUFFLEVBQUU7WUFDL0YsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQXdCLEVBQUUsRUFBRTtnQkFDN0MsNEZBQTRGO2dCQUM1RixJQUFLLFFBQVEsQ0FBQyxNQUFzQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsRUFBRTtvQkFDakcsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7aUJBQ3BCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVLLGlCQUFZLEdBQUcsSUFBSSw0QkFBNEIsRUFBbUMsQ0FBQztRQUNuRix3QkFBbUIsR0FBMkI7WUFDcEQsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLO1NBQ3JDLENBQUM7UUFrQkEsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2xCLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDO1FBRWpELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBRXRDLFVBQVU7UUFDVixJQUFJLENBQUMsOEJBQThCLEdBQUcsRUFBRSxDQUFDO1FBRXpDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUU7WUFDbEUsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQzFCLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksOEJBQThCLENBQzdELElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxRQUFRLEVBQzlDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxXQUFXLEVBQ2pELElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxXQUFXLENBQ2xELENBQUM7SUFDSixDQUFDO0lBRUQsSUFDSSxlQUFlO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsSUFBSSxlQUFlLENBQUMsS0FBZ0Q7UUFDbEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBWSxDQUFDO1FBQzlCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUNJLG9CQUFvQjtRQUN0QixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsQ0FBQztJQUN2RCxDQUFDO0lBQ0QsSUFBSSxvQkFBb0IsQ0FBQyxLQUFxRDtRQUM1RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CLEdBQUcsS0FBSyxDQUFDO1FBQ3RELElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUNJLHFCQUFxQjtRQUN2QixPQUFPLElBQUksRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsQ0FBQztJQUMxRCxDQUFDO0lBQ0QsSUFBSSxxQkFBcUIsQ0FBQyxLQUFzRDtRQUM5RSxJQUFJLENBQUMsbUJBQW1CLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO1FBQ3ZELElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUNJLDhCQUE4QjtRQUNoQyxPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyw4QkFBOEIsQ0FBQztJQUNqRSxDQUFDO0lBQ0QsSUFBSSw4QkFBOEIsQ0FBQyxLQUErRDtRQUNoRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsOEJBQThCLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEYsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQztJQUN4RCxDQUFDO0lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBa0Q7UUFDN0QsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3RSxJQUFJLENBQUMsa0NBQWtDLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxDQUFDO0lBQzNELENBQUM7SUFDRCxJQUFJLFdBQVcsQ0FBQyxLQUFxRDtRQUNuRSxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxHQUFHLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUFFRCxJQUNJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxXQUFXLENBQUM7SUFDM0QsQ0FBQztJQUNELElBQUksV0FBVyxDQUFDLEtBQXFEO1FBQ25FLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxXQUFXLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLENBQUM7SUFDNUMsQ0FBQztJQUVELElBQ0ksU0FBUyxDQUFDLEtBQWdEO1FBQzVELElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFFOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsSUFBSSxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFZLFVBQVUsQ0FBQyxLQUFhO1FBQ2xDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFO1lBQzlCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsc0NBQXNDLENBQ3RFLElBQUksQ0FBQyxpQkFBaUIsRUFDdEIsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLGtCQUFrQixFQUN2QixJQUFJLENBQUMscUJBQXFCLENBQzNCLENBQUM7WUFFRixJQUFJLENBQUMsYUFBYSxHQUFHLDhCQUE4QixDQUNqRCxJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQ2pCLElBQUksQ0FBQyxxQkFBcUIsRUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FDWixDQUFDO1lBRUYsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBYyxlQUFlLENBQUMsQ0FBQztRQUV6RyxJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztRQUVqQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3JDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQzthQUMvQztRQUNILENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDL0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDeEIsQ0FBQyxDQUFDLEVBQ0YsSUFBSSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUN2RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxFQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRTtZQUM5QyxJQUFJLGFBQWEsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkI7UUFDSCxDQUFDLENBQUMsRUFDRixJQUFJLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN4QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLE1BQWMsRUFBRSxXQUEyQixNQUFNO1FBQ3hELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFjLEVBQUUsV0FBMkIsTUFBTTtRQUMxRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxhQUFhLENBQUMsS0FBYSxFQUFFLFdBQTJCLE1BQU07UUFDNUQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLGVBQWUsQ0FBQyxJQUFZLEVBQUUsSUFBUztRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBc0IsQ0FBQztRQUV4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEVBQUUsTUFBTSxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDckUsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDaEM7UUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTyx5QkFBeUI7UUFDL0IsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEtBQUssTUFBTSxxQkFBcUIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBNEIsRUFBRTtnQkFDcEcsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLEtBQUssSUFBSSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLEVBQUU7b0JBQ2hHLElBQUksQ0FBQyxhQUFxQixDQUFDLHFCQUFxQixDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLHFCQUFxQixDQUFDLENBQUM7aUJBQ3RHO2FBQ0Y7U0FDRjtJQUNILENBQUM7SUFFTyxrQ0FBa0M7UUFDeEMsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDOUIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixDQUNoRCxJQUFJLENBQUMsZ0NBQWdDLENBQUMsUUFBUSxFQUM5QyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxFQUNqRCxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxDQUNsRCxDQUFDO1NBQ0g7SUFDSCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsUUFBZ0I7UUFDekMsSUFBSSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFTyxvQkFBb0I7UUFDMUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQStDLENBQUM7WUFFM0YsTUFBTSxZQUFZLEdBQWtCLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDdEQsTUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxZQUFZLENBQUMsQ0FBQztZQUNoRyxNQUFNLGNBQWMsR0FBRyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFekUsK0ZBQStGO1lBQy9GLGNBQWMsRUFBRSxZQUFZLENBQUMsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUN2RjtJQUNILENBQUM7SUFFTyxzQ0FBc0MsQ0FDNUMsaUJBQW9DLEVBQ3BDLE1BQWMsRUFDZCxTQUFvQixFQUNwQixjQUE4QixFQUM5QixnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsa0JBQTJDLEVBQzNDLHFCQUFxRDtRQUVyRCxNQUFNLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQWMsV0FBVyxDQUFDLENBQUM7UUFDcEcsTUFBTSxvQkFBb0IsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFjLGlCQUFpQixDQUFDLENBQUM7UUFDNUcsTUFBTSxtQkFBbUIsR0FBRyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFjLGdCQUFnQixDQUFDLENBQUM7UUFDMUcsTUFBTSxxQkFBcUIsR0FBNEIsRUFBRSxhQUFhLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQztRQUU3RixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7UUFDbEIsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7UUFFekIsU0FBUywyQkFBMkI7WUFDbEMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxjQUFjLFNBQVMsS0FBSyxDQUFDO1lBQ25FLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsR0FBRyxTQUFTLElBQUksQ0FBQztRQUN6RSxDQUFDO1FBRUQsTUFBTSxxQkFBcUIsR0FBRyw4QkFBOEIsQ0FDMUQscUJBQXFCLEVBQ3JCLGlCQUFpQixFQUNqQixNQUFNLEVBQ04sU0FBUyxFQUNULHFCQUFxQixFQUNyQixjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYixJQUEwQyxDQUMzQyxDQUFDO1FBRUYscUJBQXFCLENBQUMsZUFBZSxHQUFHO1lBQ3RDLGFBQWEsRUFBRTtnQkFDYixLQUFLLEVBQUU7b0JBQ0wsSUFBSSxTQUFTLENBQUMsS0FBVTt3QkFDdEIsU0FBUyxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkYsMkJBQTJCLEVBQUUsQ0FBQztvQkFDaEMsQ0FBQztpQkFDRjthQUNGO1NBQ3lCLENBQUM7UUFFN0IscUJBQXFCLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUM1RCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDekIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixJQUFJLENBQUM7WUFDNUQsMkJBQTJCLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUM7UUFFRixPQUFPLHFCQUFxQixDQUFDO0lBQy9CLENBQUM7OzhIQTlVVSxpQ0FBaUM7a0hBQWpDLGlDQUFpQyw4c0JBRmpDLENBQUMsS0FBSyxDQUFDOzJGQUVQLGlDQUFpQztrQkFKN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUNBQXVDO29CQUNqRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7aUJBQ25CO2liQUVXLG1CQUFtQjtzQkFBNUIsTUFBTTtnQkFDMEIsWUFBWTtzQkFBNUMsS0FBSzt1QkFBQyx3QkFBd0I7Z0JBK0QzQixlQUFlO3NCQURsQixLQUFLO3VCQUFDLGtCQUFrQjtnQkFXckIsb0JBQW9CO3NCQUR2QixLQUFLO3VCQUFDLHVCQUF1QjtnQkFVMUIscUJBQXFCO3NCQUR4QixLQUFLO3VCQUFDLHdCQUF3QjtnQkFVM0IsOEJBQThCO3NCQURqQyxLQUFLO3VCQUFDLGlDQUFpQztnQkFVcEMsUUFBUTtzQkFEWCxLQUFLO3VCQUFDLHdCQUF3QjtnQkFVM0IsV0FBVztzQkFEZCxLQUFLO3VCQUFDLDJCQUEyQjtnQkFVOUIsV0FBVztzQkFEZCxLQUFLO3VCQUFDLDJCQUEyQjtnQkFVOUIsU0FBUztzQkFEWixLQUFLO3VCQUFDLHFCQUFxQjs7QUFpTjlCLFNBQVMsOEJBQThCLENBQ3JDLHFCQUE4QyxFQUM5QyxpQkFBb0MsRUFDcEMsTUFBYyxFQUNkLFNBQW9CLEVBQ3BCLHFCQUE0QyxFQUM1QyxjQUE4QixFQUM5QixnQkFBa0MsRUFDbEMsYUFBNEIsRUFDNUIsVUFBZ0M7SUFFaEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxFQUFFO1FBQy9CLE9BQU8sSUFBSSx3QkFBd0IsQ0FDakMscUJBQXFCLEVBQ3JCLGlCQUFpQixFQUNqQixNQUFNLEVBQ04scUJBQXFCLEVBQ3JCLGNBQWMsRUFDZCxnQkFBZ0IsRUFDaEIsYUFBYSxFQUNiLFVBQVUsQ0FDWCxDQUFDO0tBQ0g7U0FBTTtRQUNMLE1BQU0sNkJBQTZCLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNwRCxNQUFNLEVBQUUsTUFBTSxDQUFDLG1CQUFtQixDQUFDO1lBQ25DLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFFO2dCQUN4RCxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQzNELEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUNyQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRTtnQkFDM0MsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLHFCQUFxQixFQUFFO2dCQUNyRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTtnQkFDckQsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFO2dCQUN6RCxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRTtnQkFDbkQsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTtnQkFDdkQsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixFQUFFO2FBQzFFO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQztLQUNwRTtBQUNILENBQUM7QUFFRCxTQUFTLDhCQUE4QixDQUNyQyxnQkFBa0MsRUFDbEMsV0FBbUQsRUFDbkQsZUFBZ0MsRUFDaEMsWUFBMkUsRUFDM0UscUJBQStDLEVBQy9DLE1BQWM7SUFFZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxFQUFFLEVBQUU7UUFDL0IsT0FBTyxJQUFJLGVBQWUsQ0FDeEIsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxlQUFlLEVBQ2YsWUFBWSxFQUNaLHFCQUFxQixFQUNyQixNQUFNLENBQ1AsQ0FBQztLQUNIO1NBQU07UUFDTCxNQUFNLDZCQUE2QixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDcEQsTUFBTSxFQUFFLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztZQUNuQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUUsQ0FBQztTQUNwRixDQUFDLENBQUM7UUFFSCxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDNUMsTUFBTSxFQUFFLDZCQUE2QjtZQUNyQyxTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFO2dCQUN6RCxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRTtnQkFDL0MsRUFBRSxPQUFPLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUU7Z0JBQ3ZELEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUU7Z0JBQzVELEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUNyQyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRTthQUN4RDtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8scUJBQXFCLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ25EO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgeyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5LCBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgTGlzdFJhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCB7XG4gIENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGwsXG4gIENka1ZpcnR1YWxGb3JPZixcbiAgQ2RrVmlydHVhbEZvck9mQ29udGV4dCxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGUsXG4gIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudCxcbiAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIFNjcm9sbERpc3BhdGNoZXIsXG4gIFZpZXdwb3J0UnVsZXIsXG4gIFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLFxuICBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgVkVSU0lPTiBhcyBBTkdVTEFSX1ZFUlNJT04sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRW52aXJvbm1lbnRJbmplY3RvcixcbiAgRXZlbnRFbWl0dGVyLFxuICBpbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDbHJEYXRhZ3JpZCB9IGZyb20gJy4vZGF0YWdyaWQnO1xuaW1wb3J0IHsgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2UgfSBmcm9tICcuL2ludGVyZmFjZXMvdmlydHVhbC1zY3JvbGwtZGF0YS1yYW5nZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ29sdW1uc1NlcnZpY2UgfSBmcm9tICcuL3Byb3ZpZGVycy9jb2x1bW5zLnNlcnZpY2UnO1xuaW1wb3J0IHsgSXRlbXMgfSBmcm9tICcuL3Byb3ZpZGVycy9pdGVtcyc7XG5cbnR5cGUgQ2RrVmlydHVhbEZvcklucHV0S2V5ID1cbiAgfCAnY2RrVmlydHVhbEZvck9mJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVHJhY2tCeSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlJ1xuICB8ICdjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUnO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSBQYXJ0aWFsPFBpY2s8Q2RrVmlydHVhbEZvck9mPFQ+LCBDZGtWaXJ0dWFsRm9ySW5wdXRLZXk+PjtcblxudHlwZSBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0gUGljazxDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsLCAnaXRlbVNpemUnIHwgJ21pbkJ1ZmZlclB4JyB8ICdtYXhCdWZmZXJQeCc+O1xuXG5jb25zdCBkZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0czogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IHtcbiAgaXRlbVNpemU6IDMyLFxuICBtaW5CdWZmZXJQeDogMjAwLFxuICBtYXhCdWZmZXJQeDogNDAwLFxufTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclZpcnR1YWxTY3JvbGxdLFtDbHJWaXJ0dWFsU2Nyb2xsXScsXG4gIHByb3ZpZGVyczogW0l0ZW1zXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlbmRlcmVkUmFuZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPExpc3RSYW5nZT4oKTtcbiAgQElucHV0KCdjbHJWaXJ0dWFsUGVyc2lzdEl0ZW1zJykgcGVyc2lzdEl0ZW1zID0gdHJ1ZTtcblxuICBwcml2YXRlIF9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzID0geyAuLi5kZWZhdWx0Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyB9O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBwcml2YXRlIGdyaWRSb2xlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxTdHJhdGVneTogRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5O1xuICBwcml2YXRlIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3I6IENka1ZpcnR1YWxGb3JPZjxUPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBwcml2YXRlIHRvcEluZGV4ID0gMDtcbiAgcHJpdmF0ZSBtdXRhdGlvbkNoYW5nZXM6IE11dGF0aW9uT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uOiBNdXRhdGlvblJlY29yZCkgPT4ge1xuICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhpcyB0byBiZSBjYWxsZWQgdHdpY2UgYmVjYXVzZSB0aGUgb2xkIGNsYXNzIGlzIHJlbW92ZWQgYW5kIHRoZSBuZXcgYWRkZWRcbiAgICAgIGlmICgobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJiB0aGlzLml0ZW1TaXplID4gMjQpIHtcbiAgICAgICAgdGhpcy5pdGVtU2l6ZSA9IDI0O1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBwcml2YXRlIHZpZXdSZXBlYXRlciA9IG5ldyBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5PFQsIFQsIENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+KCk7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcklucHV0czogQ2RrVmlydHVhbEZvcklucHV0czxUPiA9IHtcbiAgICBjZGtWaXJ0dWFsRm9yVHJhY2tCeTogaW5kZXggPT4gaW5kZXgsXG4gIH07XG4gIHByaXZhdGUgX3RvdGFsSXRlbXM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICAgIHByaXZhdGUgaXRlbXM6IEl0ZW1zPFQ+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZWFkb25seSByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSByZWFkb25seSBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGRhdGFncmlkOiBDbHJEYXRhZ3JpZCxcbiAgICBwcml2YXRlIGNvbHVtbnNTZXJ2aWNlOiBDb2x1bW5zU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge1xuICAgIGl0ZW1zLnNtYXJ0ZW5VcCgpO1xuICAgIGRhdGFncmlkLmRldGFpbFNlcnZpY2UucHJldmVudEZvY3VzU2Nyb2xsID0gdHJ1ZTtcblxuICAgIHRoaXMuZGF0YWdyaWRFbGVtZW50UmVmID0gZGF0YWdyaWQuZWw7XG5cbiAgICAvLyBkZWZhdWx0XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUgPSAyMDtcblxuICAgIHRoaXMubXV0YXRpb25DaGFuZ2VzLm9ic2VydmUodGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ2NsYXNzJ10sXG4gICAgICBhdHRyaWJ1dGVPbGRWYWx1ZTogdHJ1ZSxcbiAgICB9KTtcblxuICAgIHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5ID0gbmV3IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneShcbiAgICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUsXG4gICAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1pbkJ1ZmZlclB4LFxuICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeFxuICAgICk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzT2YnKVxuICBnZXQgY2RrVmlydHVhbEZvck9mKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yT2YodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JPZiddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZiA9IHZhbHVlO1xuICAgIHRoaXMuaXRlbXMuYWxsID0gdmFsdWUgYXMgVFtdO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RyYWNrQnknKVxuICBnZXQgY2RrVmlydHVhbEZvclRyYWNrQnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRyYWNrQnkodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUcmFja0J5J10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXM/LmNka1ZpcnR1YWxGb3JJbnB1dHM/LmNka1ZpcnR1YWxGb3JUZW1wbGF0ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZUNhY2hlU2l6ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c0l0ZW1TaXplJylcbiAgZ2V0IGl0ZW1TaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLml0ZW1TaXplO1xuICB9XG4gIHNldCBpdGVtU2l6ZSh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snaXRlbVNpemUnXSkge1xuICAgIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMuaXRlbVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWluQnVmZmVyUHgnKVxuICBnZXQgbWluQnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMubWluQnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1pbkJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtaW5CdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLnVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNYXhCdWZmZXJQeCcpXG4gIGdldCBtYXhCdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeDtcbiAgfVxuICBzZXQgbWF4QnVmZmVyUHgodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ21heEJ1ZmZlclB4J10pIHtcbiAgICB0aGlzLl9jZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzLm1heEJ1ZmZlclB4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsRGF0YVJhbmdlJylcbiAgc2V0IGRhdGFSYW5nZShyYW5nZTogQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2U8VD4pIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuc21hcnRlbkRvd24oKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsSXRlbXMgPSByYW5nZS50b3RhbDtcblxuICAgIHRoaXMudXBkYXRlRGF0YVJhbmdlKHJhbmdlLnNraXAsIHJhbmdlLmRhdGEpO1xuICB9XG5cbiAgZ2V0IHRvdGFsSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSXRlbXM7XG4gIH1cblxuICBwcml2YXRlIHNldCB0b3RhbEl0ZW1zKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl90b3RhbEl0ZW1zID0gdmFsdWU7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbmplY3Rvci5ydW5JbkNvbnRleHQoKCkgPT4ge1xuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSB0aGlzLmNyZWF0ZVZpcnR1YWxTY3JvbGxWaWV3cG9ydEZvckRhdGFncmlkKFxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICB0aGlzLm5nWm9uZSxcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIsXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgICAgdGhpcy52aWV3cG9ydFJ1bGVyLFxuICAgICAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3lcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvciA9IGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZShcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgICB0aGlzLnRlbXBsYXRlUmVmLFxuICAgICAgICB0aGlzLml0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIsXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgICB0aGlzLm5nWm9uZVxuICAgICAgKTtcblxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQubmdPbkluaXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JpZFJvbGVFbGVtZW50ID0gdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW3JvbGU9XCJncmlkXCJdJyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5pdGVtcy5jaGFuZ2Uuc3Vic2NyaWJlKG5ld0l0ZW1zID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuY2RrVmlydHVhbEZvck9mID0gbmV3SXRlbXM7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5jZGtWaXJ0dWFsRm9yLmRhdGFTdHJlYW0uc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dDb3VudChkYXRhLmxlbmd0aCk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LnNjcm9sbGVkSW5kZXhDaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgICAgdGhpcy50b3BJbmRleCA9IGluZGV4O1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5yZW5kZXJlZFJhbmdlU3RyZWFtLnN1YnNjcmliZShyZW5kZXJlZFJhbmdlID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlZFJhbmdlQ2hhbmdlLmVtaXQocmVuZGVyZWRSYW5nZSk7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuZGF0YWdyaWQucmVmcmVzaC5zdWJzY3JpYmUoZGF0YWdyaWRTdGF0ZSA9PiB7XG4gICAgICAgIGlmIChkYXRhZ3JpZFN0YXRlLmZpbHRlcnMpIHtcbiAgICAgICAgICB0aGlzLnNjcm9sbFRvSW5kZXgoMCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgdGhpcy5jb2x1bW5zU2VydmljZS5jb2x1bW5zU3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIuZGV0YWNoKCk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9yPy5uZ0RvQ2hlY2soKTtcbiAgICB0aGlzLnVwZGF0ZUFyaWFSb3dJbmRleGVzKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXM/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxVcChvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggLSBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbERvd24ob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4ICsgb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURhdGFSYW5nZShza2lwOiBudW1iZXIsIGRhdGE6IFRbXSkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY2RrVmlydHVhbEZvck9mIGFzIFRbXTtcblxuICAgIGlmICghdGhpcy5wZXJzaXN0SXRlbXMgfHwgIWl0ZW1zIHx8IGl0ZW1zPy5sZW5ndGggIT09IHRoaXMudG90YWxJdGVtcykge1xuICAgICAgaXRlbXMgPSBBcnJheSh0aGlzLnRvdGFsSXRlbXMpO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZShza2lwLCBkYXRhLmxlbmd0aCwgLi4uZGF0YSk7XG5cbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JPZiA9IEFycmF5LmZyb20oaXRlbXMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCkge1xuICAgIGlmICh0aGlzLmNka1ZpcnR1YWxGb3IpIHtcbiAgICAgIGZvciAoY29uc3QgY2RrVmlydHVhbEZvcklucHV0S2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY2RrVmlydHVhbEZvcklucHV0cykgYXMgQ2RrVmlydHVhbEZvcklucHV0S2V5W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcltjZGtWaXJ0dWFsRm9ySW5wdXRLZXldICE9PSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XSkge1xuICAgICAgICAgICh0aGlzLmNka1ZpcnR1YWxGb3IgYXMgYW55KVtjZGtWaXJ0dWFsRm9ySW5wdXRLZXldID0gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneS51cGRhdGVJdGVtQW5kQnVmZmVyU2l6ZShcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5pdGVtU2l6ZSxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5taW5CdWZmZXJQeCxcbiAgICAgICAgdGhpcy5fY2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cy5tYXhCdWZmZXJQeFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dDb3VudChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3djb3VudCcsIHJvd0NvdW50LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmlhUm93SW5kZXhlcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5nZXQoaSkgYXMgRW1iZWRkZWRWaWV3UmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+O1xuXG4gICAgICBjb25zdCByb290RWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSB2aWV3UmVmLnJvb3ROb2RlcztcbiAgICAgIGNvbnN0IGRhdGFncmlkUm93RWxlbWVudCA9IHJvb3RFbGVtZW50cy5maW5kKHJvd0VsZW1lbnQgPT4gcm93RWxlbWVudC50YWdOYW1lID09PSAnQ0xSLURHLVJPVycpO1xuICAgICAgY29uc3Qgcm93Um9sZUVsZW1lbnQgPSBkYXRhZ3JpZFJvd0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPVwicm93XCJdJyk7XG5cbiAgICAgIC8vIGFyaWEtcm93aW5kZXggc2hvdWxkIHN0YXJ0IHdpdGggb25lLCBub3QgemVybywgc28gd2UgaGF2ZSB0byBhZGQgb25lIHRvIHRoZSB6ZXJvLWJhc2VkIGluZGV4XG4gICAgICByb3dSb2xlRWxlbWVudD8uc2V0QXR0cmlidXRlKCdhcmlhLXJvd2luZGV4JywgKHZpZXdSZWYuY29udGV4dC5pbmRleCArIDEpLnRvU3RyaW5nKCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICApIHtcbiAgICBjb25zdCBkYXRhZ3JpZERpdkVsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkJyk7XG4gICAgY29uc3QgZGF0YWdyaWRUYWJsZUVsZW1lbnQgPSBkYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignLmRhdGFncmlkLXRhYmxlJyk7XG4gICAgY29uc3QgZGF0YWdyaWRSb3dzRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtcm93cycpO1xuICAgIGNvbnN0IGRhdGFncmlkRGl2RWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4gPSB7IG5hdGl2ZUVsZW1lbnQ6IGRhdGFncmlkRGl2RWxlbWVudCB9O1xuXG4gICAgbGV0IHRvcE9mZnNldCA9IDA7XG4gICAgbGV0IHRvdGFsQ29udGVudFNpemUgPSAwO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlRGF0YWdyaWRFbGVtZW50U3R5bGVzKCkge1xuICAgICAgZGF0YWdyaWRSb3dzRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWSgke3RvcE9mZnNldH1weClgO1xuICAgICAgZGF0YWdyaWRSb3dzRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0b3RhbENvbnRlbnRTaXplIC0gdG9wT2Zmc2V0fXB4YDtcbiAgICB9XG5cbiAgICBjb25zdCB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSBjcmVhdGVDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQoXG4gICAgICBkYXRhZ3JpZERpdkVsZW1lbnRSZWYsXG4gICAgICBjaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIG5nWm9uZSxcbiAgICAgIHJlbmRlcmVyMixcbiAgICAgIHZpcnR1YWxTY3JvbGxTdHJhdGVneSxcbiAgICAgIGRpcmVjdGlvbmFsaXR5LFxuICAgICAgc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgIHZpZXdwb3J0UnVsZXIsXG4gICAgICBudWxsIGFzIGFueSBhcyBDZGtWaXJ0dWFsU2Nyb2xsYWJsZUVsZW1lbnRcbiAgICApO1xuXG4gICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0Ll9jb250ZW50V3JhcHBlciA9IHtcbiAgICAgIG5hdGl2ZUVsZW1lbnQ6IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBzZXQgdHJhbnNmb3JtKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgICAgIHRvcE9mZnNldCA9IHZhbHVlID09PSB1bmRlZmluZWQgPyAwIDogKy90cmFuc2xhdGVZXFwoKFswLTldKylweFxcKS8uZXhlYyh2YWx1ZSk/LlsxXTtcbiAgICAgICAgICAgIHVwZGF0ZURhdGFncmlkRWxlbWVudFN0eWxlcygpO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0gYXMgRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgICB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQuc2V0VG90YWxDb250ZW50U2l6ZSA9ICh2YWx1ZTogbnVtYmVyKSA9PiB7XG4gICAgICB0b3RhbENvbnRlbnRTaXplID0gdmFsdWU7XG4gICAgICBkYXRhZ3JpZFRhYmxlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHt0b3RhbENvbnRlbnRTaXplfXB4YDtcbiAgICAgIHVwZGF0ZURhdGFncmlkRWxlbWVudFN0eWxlcygpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICBuZ1pvbmU6IE5nWm9uZSxcbiAgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gIHZpcnR1YWxTY3JvbGxTdHJhdGVneTogVmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gIHNjcm9sbERpc3BhdGNoZXI6IFNjcm9sbERpc3BhdGNoZXIsXG4gIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gIHNjcm9sbGFibGU6IENka1ZpcnR1YWxTY3JvbGxhYmxlXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgZGF0YWdyaWREaXZFbGVtZW50UmVmLFxuICAgICAgY2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgICBuZ1pvbmUsXG4gICAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gICAgICBkaXJlY3Rpb25hbGl0eSxcbiAgICAgIHNjcm9sbERpc3BhdGNoZXIsXG4gICAgICB2aWV3cG9ydFJ1bGVyLFxuICAgICAgc2Nyb2xsYWJsZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBpbmplY3QoRW52aXJvbm1lbnRJbmplY3RvciksXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgeyBwcm92aWRlOiBFbGVtZW50UmVmLCB1c2VWYWx1ZTogZGF0YWdyaWREaXZFbGVtZW50UmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2hhbmdlRGV0ZWN0b3JSZWYsIHVzZVZhbHVlOiBjaGFuZ2VEZXRlY3RvclJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IE5nWm9uZSwgdXNlVmFsdWU6IG5nWm9uZSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFJlbmRlcmVyMiwgdXNlVmFsdWU6IHJlbmRlcmVyMiB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLCB1c2VWYWx1ZTogdmlydHVhbFNjcm9sbFN0cmF0ZWd5IH0sXG4gICAgICAgIHsgcHJvdmlkZTogRGlyZWN0aW9uYWxpdHksIHVzZVZhbHVlOiBkaXJlY3Rpb25hbGl0eSB9LFxuICAgICAgICB7IHByb3ZpZGU6IFNjcm9sbERpc3BhdGNoZXIsIHVzZVZhbHVlOiBzY3JvbGxEaXNwYXRjaGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogVmlld3BvcnRSdWxlciwgdXNlVmFsdWU6IHZpZXdwb3J0UnVsZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsYWJsZSwgdXNlVmFsdWU6IHNjcm9sbGFibGUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZUNsYXNzOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2RrVmlydHVhbEZvck9mRGlyZWN0aXZlPFQ+KFxuICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gIGl0ZXJhYmxlRGlmZmVyczogSXRlcmFibGVEaWZmZXJzLFxuICB2aWV3UmVwZWF0ZXI6IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3k8VCwgVCwgQ2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gIHZpcnR1YWxTY3JvbGxWaWV3cG9ydDogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBuZ1pvbmU6IE5nWm9uZVxuKSB7XG4gIGlmICgrQU5HVUxBUl9WRVJTSU9OLm1ham9yIDwgMTkpIHtcbiAgICByZXR1cm4gbmV3IENka1ZpcnR1YWxGb3JPZjxUPihcbiAgICAgIHZpZXdDb250YWluZXJSZWYsXG4gICAgICB0ZW1wbGF0ZVJlZixcbiAgICAgIGl0ZXJhYmxlRGlmZmVycyxcbiAgICAgIHZpZXdSZXBlYXRlcixcbiAgICAgIHZpcnR1YWxTY3JvbGxWaWV3cG9ydCxcbiAgICAgIG5nWm9uZVxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgICAgcGFyZW50OiBpbmplY3QoRW52aXJvbm1lbnRJbmplY3RvciksXG4gICAgICBwcm92aWRlcnM6IFt7IHByb3ZpZGU6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9XSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNka1ZpcnR1YWxGb3JJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICBwYXJlbnQ6IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogVmlld0NvbnRhaW5lclJlZiwgdXNlVmFsdWU6IHZpZXdDb250YWluZXJSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBUZW1wbGF0ZVJlZiwgdXNlVmFsdWU6IHRlbXBsYXRlUmVmIH0sXG4gICAgICAgIHsgcHJvdmlkZTogSXRlcmFibGVEaWZmZXJzLCB1c2VWYWx1ZTogaXRlcmFibGVEaWZmZXJzIH0sXG4gICAgICAgIHsgcHJvdmlkZTogX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIHVzZVZhbHVlOiB2aWV3UmVwZWF0ZXIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOZ1pvbmUsIHVzZVZhbHVlOiBuZ1pvbmUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsRm9yT2YsIHVzZUNsYXNzOiBDZGtWaXJ0dWFsRm9yT2YgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gY2RrVmlydHVhbEZvckluamVjdG9yLmdldChDZGtWaXJ0dWFsRm9yT2YpO1xuICB9XG59XG4iXX0=