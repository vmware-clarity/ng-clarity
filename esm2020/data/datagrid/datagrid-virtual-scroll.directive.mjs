/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import * as cdkCollections from '@angular/cdk/collections';
import { _RecycleViewRepeaterStrategy } from '@angular/cdk/collections';
import * as cdkScrolling from '@angular/cdk/scrolling';
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
// Resolve internal CDK symbols at runtime. Webpack/esbuild emit a static "export not
// found" error when a literal-string property is read directly off a namespace import,
// which would fail the v16 build for `CDK_VIRTUAL_SCROLL_VIEWPORT` and the v21 build for
// `_VIEW_REPEATER_STRATEGY`. Going through an intermediate `Record<string, any>` const
// (same pattern as `projects/addons/test.ts` uses for `provideZoneChangeDetection`)
// disconnects the access from the namespace identifier so the static analyzer leaves it
// alone, while remaining correct at runtime because ES-module namespace objects are
// enumerable.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _cdkCollections = cdkCollections;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _cdkScrolling = cdkScrolling;
const _VIEW_REPEATER_STRATEGY = _cdkCollections['_VIEW_REPEATER_STRATEGY'];
const _CDK_VIRTUAL_SCROLL_VIEWPORT = _cdkScrolling['CDK_VIRTUAL_SCROLL_VIEWPORT'];
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
        // CDK 15-19: `_totalContentHeight` is a `string`.
        // CDK 20+:   `_totalContentHeight` is a `Signal<string>`. Calling it returns the value.
        const h = this.virtualScrollViewport?._totalContentHeight;
        if (typeof h === 'function') {
            return h() || '';
        }
        return h || '';
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
ClrDatagridVirtualScrollDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrDatagridVirtualScrollDirective, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.IterableDiffers }, { token: i1.Items }, { token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i2.Directionality }, { token: i3.ScrollDispatcher }, { token: i3.ViewportRuler }, { token: forwardRef(() => ClrDatagrid) }, { token: i4.ColumnsService }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Directive });
ClrDatagridVirtualScrollDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.2.10", type: ClrDatagridVirtualScrollDirective, selector: "[clrVirtualScroll],[ClrVirtualScroll]", inputs: { persistItems: ["clrVirtualPersistItems", "persistItems"], cdkVirtualForOf: ["clrVirtualRowsOf", "cdkVirtualForOf"], cdkVirtualForTrackBy: ["clrVirtualRowsTrackBy", "cdkVirtualForTrackBy"], cdkVirtualForTemplate: ["clrVirtualRowsTemplate", "cdkVirtualForTemplate"], cdkVirtualForTemplateCacheSize: ["clrVirtualRowsTemplateCacheSize", "cdkVirtualForTemplateCacheSize"], itemSize: ["clrVirtualRowsItemSize", "itemSize"], minBufferPx: ["clrVirtualRowsMinBufferPx", "minBufferPx"], maxBufferPx: ["clrVirtualRowsMaxBufferPx", "maxBufferPx"], dataRange: ["clrVirtualDataRange", "dataRange"] }, outputs: { renderedRangeChange: "renderedRangeChange" }, providers: [Items], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: ClrDatagridVirtualScrollDirective, decorators: [{
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
    // Provide the viewport under BOTH the class token (used by CdkVirtualForOf in CDK 15-20)
    // and the dedicated InjectionToken (used by CdkVirtualForOf in CDK 21+). The token is
    // resolved at module load via indexed access, so absent on CDK 15 builds we simply skip it.
    // This avoids tying the dispatch to ANGULAR_VERSION (which may diverge from CDK version
    // in mixed installs permitted by our peerDependencies range).
    const viewportProviders = [
        { provide: CdkVirtualScrollViewport, useValue: virtualScrollViewport },
    ];
    if (_CDK_VIRTUAL_SCROLL_VIEWPORT) {
        viewportProviders.push({ provide: _CDK_VIRTUAL_SCROLL_VIEWPORT, useValue: virtualScrollViewport });
    }
    const virtualScrollViewportInjector = Injector.create({
        parent: inject(EnvironmentInjector),
        providers: viewportProviders,
    });
    const cdkVirtualForInjector = Injector.create({
        parent: virtualScrollViewportInjector,
        providers: [
            { provide: ViewContainerRef, useValue: viewContainerRef },
            { provide: TemplateRef, useValue: templateRef },
            { provide: IterableDiffers, useValue: iterableDiffers },
            // _VIEW_REPEATER_STRATEGY is injected by CdkVirtualForOf in CDK 19-20;
            // CDK 21+ removed the token and creates its own strategy internally.
            ...(_VIEW_REPEATER_STRATEGY ? [{ provide: _VIEW_REPEATER_STRATEGY, useValue: viewRepeater }] : []),
            { provide: NgZone, useValue: ngZone },
            { provide: CdkVirtualForOf, useClass: CdkVirtualForOf },
        ],
    });
    return cdkVirtualForInjector.get(CdkVirtualForOf);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YWdyaWQtdmlydHVhbC1zY3JvbGwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZGF0YS9kYXRhZ3JpZC9kYXRhZ3JpZC12aXJ0dWFsLXNjcm9sbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0dBS0c7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDN0QsT0FBTyxLQUFLLGNBQWMsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsNEJBQTRCLEVBQWEsTUFBTSwwQkFBMEIsQ0FBQztBQUNuRixPQUFPLEtBQUssWUFBWSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFFTCxlQUFlLEVBRWYsb0JBQW9CLEVBRXBCLHdCQUF3QixFQUN4Qiw4QkFBOEIsRUFDOUIsZ0JBQWdCLEVBQ2hCLGFBQWEsRUFDYix1QkFBdUIsR0FFeEIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBRUwsT0FBTyxJQUFJLGVBQWUsRUFDMUIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCxVQUFVLEVBRVYsbUJBQW1CLEVBQ25CLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFFTixRQUFRLEVBQ1IsS0FBSyxFQUNMLGVBQWUsRUFDZixNQUFNLEVBRU4sTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsZ0JBQWdCLEdBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHekMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7O0FBRTFDLHFGQUFxRjtBQUNyRix1RkFBdUY7QUFDdkYseUZBQXlGO0FBQ3pGLHVGQUF1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QUFDLENBQUMsRUFBRSxDQUFDO1lBQ2xHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO1lBQ3JDLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFO1NBQ3hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDcEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTYtMjAyNSBCcm9hZGNvbS4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFRoZSB0ZXJtIFwiQnJvYWRjb21cIiByZWZlcnMgdG8gQnJvYWRjb20gSW5jLiBhbmQvb3IgaXRzIHN1YnNpZGlhcmllcy5cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UuXG4gKiBUaGUgZnVsbCBsaWNlbnNlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBpbiBMSUNFTlNFIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHByb2plY3QuXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBjb2VyY2VOdW1iZXJQcm9wZXJ0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQgKiBhcyBjZGtDb2xsZWN0aW9ucyBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuaW1wb3J0IHsgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneSwgTGlzdFJhbmdlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcbmltcG9ydCAqIGFzIGNka1Njcm9sbGluZyBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGwsXG4gIENka1ZpcnR1YWxGb3JPZixcbiAgQ2RrVmlydHVhbEZvck9mQ29udGV4dCxcbiAgQ2RrVmlydHVhbFNjcm9sbGFibGUsXG4gIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudCxcbiAgQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIFNjcm9sbERpc3BhdGNoZXIsXG4gIFZpZXdwb3J0UnVsZXIsXG4gIFZJUlRVQUxfU0NST0xMX1NUUkFURUdZLFxuICBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgVkVSU0lPTiBhcyBBTkdVTEFSX1ZFUlNJT04sXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIERvQ2hlY2ssXG4gIEVsZW1lbnRSZWYsXG4gIEVtYmVkZGVkVmlld1JlZixcbiAgRW52aXJvbm1lbnRJbmplY3RvcixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIGluamVjdCxcbiAgdHlwZSBJbmplY3Rpb25Ub2tlbixcbiAgSW5qZWN0b3IsXG4gIElucHV0LFxuICBJdGVyYWJsZURpZmZlcnMsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENsckRhdGFncmlkIH0gZnJvbSAnLi9kYXRhZ3JpZCc7XG5pbXBvcnQgeyBDbHJEYXRhZ3JpZFZpcnR1YWxTY3JvbGxSYW5nZUludGVyZmFjZSB9IGZyb20gJy4vaW50ZXJmYWNlcy92aXJ0dWFsLXNjcm9sbC1kYXRhLXJhbmdlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb2x1bW5zU2VydmljZSB9IGZyb20gJy4vcHJvdmlkZXJzL2NvbHVtbnMuc2VydmljZSc7XG5pbXBvcnQgeyBJdGVtcyB9IGZyb20gJy4vcHJvdmlkZXJzL2l0ZW1zJztcblxuLy8gUmVzb2x2ZSBpbnRlcm5hbCBDREsgc3ltYm9scyBhdCBydW50aW1lLiBXZWJwYWNrL2VzYnVpbGQgZW1pdCBhIHN0YXRpYyBcImV4cG9ydCBub3Rcbi8vIGZvdW5kXCIgZXJyb3Igd2hlbiBhIGxpdGVyYWwtc3RyaW5nIHByb3BlcnR5IGlzIHJlYWQgZGlyZWN0bHkgb2ZmIGEgbmFtZXNwYWNlIGltcG9ydCxcbi8vIHdoaWNoIHdvdWxkIGZhaWwgdGhlIHYxNiBidWlsZCBmb3IgYENES19WSVJUVUFMX1NDUk9MTF9WSUVXUE9SVGAgYW5kIHRoZSB2MjEgYnVpbGQgZm9yXG4vLyBgX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1lgLiBHb2luZyB0aHJvdWdoIGFuIGludGVybWVkaWF0ZSBgUmVjb3JkPHN0cmluZywgYW55PmAgY29uc3Rcbi8vIChzYW1lIHBhdHRlcm4gYXMgYHByb2plY3RzL2FkZG9ucy90ZXN0LnRzYCB1c2VzIGZvciBgcHJvdmlkZVpvbmVDaGFuZ2VEZXRlY3Rpb25gKVxuLy8gZGlzY29ubmVjdHMgdGhlIGFjY2VzcyBmcm9tIHRoZSBuYW1lc3BhY2UgaWRlbnRpZmllciBzbyB0aGUgc3RhdGljIGFuYWx5emVyIGxlYXZlcyBpdFxuLy8gYWxvbmUsIHdoaWxlIHJlbWFpbmluZyBjb3JyZWN0IGF0IHJ1bnRpbWUgYmVjYXVzZSBFUy1tb2R1bGUgbmFtZXNwYWNlIG9iamVjdHMgYXJlXG4vLyBlbnVtZXJhYmxlLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmNvbnN0IF9jZGtDb2xsZWN0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiA9IGNka0NvbGxlY3Rpb25zO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmNvbnN0IF9jZGtTY3JvbGxpbmc6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBjZGtTY3JvbGxpbmc7XG5jb25zdCBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSA9IF9jZGtDb2xsZWN0aW9uc1snX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1knXSBhcyBJbmplY3Rpb25Ub2tlbjx1bmtub3duPiB8IHVuZGVmaW5lZDtcbmNvbnN0IF9DREtfVklSVFVBTF9TQ1JPTExfVklFV1BPUlQgPSBfY2RrU2Nyb2xsaW5nWydDREtfVklSVFVBTF9TQ1JPTExfVklFV1BPUlQnXSBhc1xuICB8IEluamVjdGlvblRva2VuPHVua25vd24+XG4gIHwgdW5kZWZpbmVkO1xuXG50eXBlIENka1ZpcnR1YWxGb3JJbnB1dEtleSA9XG4gIHwgJ2Nka1ZpcnR1YWxGb3JPZidcbiAgfCAnY2RrVmlydHVhbEZvclRyYWNrQnknXG4gIHwgJ2Nka1ZpcnR1YWxGb3JUZW1wbGF0ZSdcbiAgfCAnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJztcblxudHlwZSBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+ID0gUGFydGlhbDxQaWNrPENka1ZpcnR1YWxGb3JPZjxUPiwgQ2RrVmlydHVhbEZvcklucHV0S2V5Pj47XG5cbnR5cGUgQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cyA9IFBpY2s8Q2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbCwgJ2l0ZW1TaXplJyB8ICdtaW5CdWZmZXJQeCcgfCAnbWF4QnVmZmVyUHgnPjtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2NsclZpcnR1YWxTY3JvbGxdLFtDbHJWaXJ0dWFsU2Nyb2xsXScsXG4gIHByb3ZpZGVyczogW0l0ZW1zXSxcbn0pXG5leHBvcnQgY2xhc3MgQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsRGlyZWN0aXZlPFQ+IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgRG9DaGVjaywgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpIHJlbmRlcmVkUmFuZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPExpc3RSYW5nZT4oKTtcbiAgQElucHV0KCdjbHJWaXJ0dWFsUGVyc2lzdEl0ZW1zJykgcGVyc2lzdEl0ZW1zID0gdHJ1ZTtcblxuICBwcml2YXRlIHNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfaXNVc2VyUHJvdmlkZWRJdGVtU2l6ZSA9IGZhbHNlO1xuICBwcml2YXRlIF9pdGVtU2l6ZSA9IDMzO1xuICBwcml2YXRlIF9taW5CdWZmZXJQeCA9IDIwMDtcbiAgcHJpdmF0ZSBfbWF4QnVmZmVyUHggPSA0MDA7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBkYXRhZ3JpZEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIHByaXZhdGUgZ3JpZFJvbGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3k7XG4gIHByaXZhdGUgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQ7XG4gIHByaXZhdGUgY2RrVmlydHVhbEZvcjogQ2RrVmlydHVhbEZvck9mPFQ+O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gIHByaXZhdGUgdG9wSW5kZXggPSAwO1xuXG4gIC8vIEBkZXByZWNhdGVkIHJlbW92ZSB0aGUgbXV0YXRpb24gb2JzZXJ2ZXIgd2hlbiBgZGF0YWdyaWQtY29tcGFjdGAgY2xhc3MgaXMgZGVsZXRlZFxuICBwcml2YXRlIG11dGF0aW9uQ2hhbmdlczogTXV0YXRpb25PYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnM6IE11dGF0aW9uUmVjb3JkW10pID0+IHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb246IE11dGF0aW9uUmVjb3JkKSA9PiB7XG4gICAgICAvLyBpdCBpcyBwb3NzaWJsZSB0aGlzIHRvIGJlIGNhbGxlZCB0d2ljZSBiZWNhdXNlIHRoZSBvbGQgY2xhc3MgaXMgcmVtb3ZlZCBhbmQgdGhlIG5ldyBhZGRlZFxuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5faXNVc2VyUHJvdmlkZWRJdGVtU2l6ZSAmJlxuICAgICAgICAobXV0YXRpb24udGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGFncmlkLWNvbXBhY3QnKSAmJlxuICAgICAgICB0aGlzLml0ZW1TaXplID4gMjVcbiAgICAgICkge1xuICAgICAgICB0aGlzLnVwZGF0ZUl0ZW1TaXplKDI1KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcHJpdmF0ZSB2aWV3UmVwZWF0ZXIgPSBuZXcgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBULCBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PigpO1xuICBwcml2YXRlIGNka1ZpcnR1YWxGb3JJbnB1dHM6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD4gPSB7XG4gICAgY2RrVmlydHVhbEZvclRyYWNrQnk6IGluZGV4ID0+IGluZGV4LFxuICB9O1xuICBwcml2YXRlIF90b3RhbEl0ZW1zOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBpdGVyYWJsZURpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycyxcbiAgICBwcml2YXRlIGl0ZW1zOiBJdGVtczxUPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVuZGVyZXIyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSByZWFkb25seSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8Q2RrVmlydHVhbEZvck9mQ29udGV4dDxUPj4sXG4gICAgcHJpdmF0ZSByZWFkb25seSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgICBwcml2YXRlIHJlYWRvbmx5IHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgQEluamVjdChmb3J3YXJkUmVmKCgpID0+IENsckRhdGFncmlkKSkgcHJpdmF0ZSByZWFkb25seSBkYXRhZ3JpZDogQ2xyRGF0YWdyaWQsXG4gICAgcHJpdmF0ZSBjb2x1bW5zU2VydmljZTogQ29sdW1uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbmplY3RvcjogRW52aXJvbm1lbnRJbmplY3RvclxuICApIHtcbiAgICBpdGVtcy5zbWFydGVuVXAoKTtcbiAgICBkYXRhZ3JpZC5kZXRhaWxTZXJ2aWNlLnByZXZlbnRGb2N1c1Njcm9sbCA9IHRydWU7XG5cbiAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZiA9IGRhdGFncmlkLmVsO1xuXG4gICAgLy8gZGVmYXVsdFxuICAgIHRoaXMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gMjA7XG5cbiAgICBjb25zdCBjZWxsSGVpZ2h0VG9rZW4gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWNsci10YWJsZS1jZWxsLWhlaWdodCcpO1xuICAgIGNvbnN0IGNlbGxIZWlnaHRWYWx1ZSA9ICsvY2FsY1xcKChbMC05XSspIFxcKiBjYWxjXFwoXFwoMXJlbSBcXC8gMjBcXCkgXFwqIDFcXClcXCkvLmV4ZWMoY2VsbEhlaWdodFRva2VuKT8uWzFdO1xuXG4gICAgY29uc3QgYm9yZGVyV2lkdGhUb2tlbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpLmdldFByb3BlcnR5VmFsdWUoJy0tY2xyLXRhYmxlLWJvcmRlcndpZHRoJyk7XG4gICAgY29uc3QgYm9yZGVyV2lkdGhWYWx1ZSA9ICsvY2FsY1xcKChbMC05XSspIFxcKiBcXCgxcmVtIFxcLyAyMFxcKVxcKS8uZXhlYyhib3JkZXJXaWR0aFRva2VuKT8uWzFdO1xuXG4gICAgLy8gaW5pdGlhbGx5IHJvd0hlaWdodFZhbHVlIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gYC0tY2xyLXRhYmxlLXJvdy1oZWlnaHRgIHRoYXQgaGFkIGEgZGlzY3JlZXQgdmFsdWUuXG4gICAgLy8gY3VycmVudGx5IGAtLWNsci10YWJsZS1yb3ctaGVpZ2h0YCBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIGAtLWNsci10YWJsZS1jZWxsLWhlaWdodGAgKyBgLS1jbHItdGFibGUtYm9yZGVyd2lkdGhgXG4gICAgY29uc3Qgcm93SGVpZ2h0VmFsdWUgPSBjZWxsSGVpZ2h0VmFsdWUgKyBib3JkZXJXaWR0aFZhbHVlO1xuXG4gICAgaWYgKHJvd0hlaWdodFZhbHVlICYmIHRoaXMuaXRlbVNpemUgPiByb3dIZWlnaHRWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVJdGVtU2l6ZShyb3dIZWlnaHRWYWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXMub2JzZXJ2ZSh0aGlzLmRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnY2xhc3MnXSxcbiAgICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3kgPSBuZXcgRml4ZWRTaXplVmlydHVhbFNjcm9sbFN0cmF0ZWd5KHRoaXMuaXRlbVNpemUsIHRoaXMubWluQnVmZmVyUHgsIHRoaXMubWF4QnVmZmVyUHgpO1xuICB9XG5cbiAgZ2V0IHRvdGFsQ29udGVudEhlaWdodCgpOiBzdHJpbmcge1xuICAgIC8vIENESyAxNS0xOTogYF90b3RhbENvbnRlbnRIZWlnaHRgIGlzIGEgYHN0cmluZ2AuXG4gICAgLy8gQ0RLIDIwKzogICBgX3RvdGFsQ29udGVudEhlaWdodGAgaXMgYSBgU2lnbmFsPHN0cmluZz5gLiBDYWxsaW5nIGl0IHJldHVybnMgdGhlIHZhbHVlLlxuICAgIGNvbnN0IGggPSB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydD8uX3RvdGFsQ29udGVudEhlaWdodCBhcyB1bmtub3duO1xuICAgIGlmICh0eXBlb2YgaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIChoIGFzICgpID0+IHN0cmluZykoKSB8fCAnJztcbiAgICB9XG4gICAgcmV0dXJuIChoIGFzIHN0cmluZykgfHwgJyc7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzT2YnKVxuICBnZXQgY2RrVmlydHVhbEZvck9mKCkge1xuICAgIHJldHVybiB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvck9mO1xuICB9XG4gIHNldCBjZGtWaXJ0dWFsRm9yT2YodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JPZiddKSB7XG4gICAgdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzLmNka1ZpcnR1YWxGb3JPZiA9IHZhbHVlO1xuICAgIHRoaXMuaXRlbXMuYWxsID0gdmFsdWUgYXMgVFtdO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c1RyYWNrQnknKVxuICBnZXQgY2RrVmlydHVhbEZvclRyYWNrQnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVHJhY2tCeTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRyYWNrQnkodmFsdWU6IENka1ZpcnR1YWxGb3JJbnB1dHM8VD5bJ2Nka1ZpcnR1YWxGb3JUcmFja0J5J10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRyYWNrQnkgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXM/LmNka1ZpcnR1YWxGb3JJbnB1dHM/LmNka1ZpcnR1YWxGb3JUZW1wbGF0ZTtcbiAgfVxuICBzZXQgY2RrVmlydHVhbEZvclRlbXBsYXRlKHZhbHVlOiBDZGtWaXJ0dWFsRm9ySW5wdXRzPFQ+WydjZGtWaXJ0dWFsRm9yVGVtcGxhdGUnXSkge1xuICAgIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NUZW1wbGF0ZUNhY2hlU2l6ZScpXG4gIGdldCBjZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2RrVmlydHVhbEZvcklucHV0cy5jZGtWaXJ0dWFsRm9yVGVtcGxhdGVDYWNoZVNpemU7XG4gIH1cbiAgc2V0IGNka1ZpcnR1YWxGb3JUZW1wbGF0ZUNhY2hlU2l6ZSh2YWx1ZTogQ2RrVmlydHVhbEZvcklucHV0czxUPlsnY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplJ10pIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHMuY2RrVmlydHVhbEZvclRlbXBsYXRlQ2FjaGVTaXplID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlQ2RrVmlydHVhbEZvcklucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsUm93c0l0ZW1TaXplJylcbiAgZ2V0IGl0ZW1TaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVtU2l6ZTtcbiAgfVxuICBzZXQgaXRlbVNpemUodmFsdWU6IENka0ZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHNbJ2l0ZW1TaXplJ10pIHtcbiAgICB0aGlzLl9pc1VzZXJQcm92aWRlZEl0ZW1TaXplID0gdHJ1ZTtcbiAgICB0aGlzLnVwZGF0ZUl0ZW1TaXplKHZhbHVlKTtcbiAgfVxuXG4gIEBJbnB1dCgnY2xyVmlydHVhbFJvd3NNaW5CdWZmZXJQeCcpXG4gIGdldCBtaW5CdWZmZXJQeCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWluQnVmZmVyUHg7XG4gIH1cbiAgc2V0IG1pbkJ1ZmZlclB4KHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydtaW5CdWZmZXJQeCddKSB7XG4gICAgdGhpcy5fbWluQnVmZmVyUHggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBASW5wdXQoJ2NsclZpcnR1YWxSb3dzTWF4QnVmZmVyUHgnKVxuICBnZXQgbWF4QnVmZmVyUHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heEJ1ZmZlclB4O1xuICB9XG4gIHNldCBtYXhCdWZmZXJQeCh2YWx1ZTogQ2RrRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0c1snbWF4QnVmZmVyUHgnXSkge1xuICAgIHRoaXMuX21heEJ1ZmZlclB4ID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMudXBkYXRlRml4ZWRTaXplVmlydHVhbFNjcm9sbElucHV0cygpO1xuICB9XG5cbiAgQElucHV0KCdjbHJWaXJ0dWFsRGF0YVJhbmdlJylcbiAgc2V0IGRhdGFSYW5nZShyYW5nZTogQ2xyRGF0YWdyaWRWaXJ0dWFsU2Nyb2xsUmFuZ2VJbnRlcmZhY2U8VD4pIHtcbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgIHRoaXMuaXRlbXMuc21hcnRlbkRvd24oKTtcbiAgICB9XG5cbiAgICB0aGlzLnRvdGFsSXRlbXMgPSByYW5nZS50b3RhbDtcblxuICAgIHRoaXMudXBkYXRlRGF0YVJhbmdlKHJhbmdlLnNraXAsIHJhbmdlLmRhdGEpO1xuICB9XG5cbiAgZ2V0IHRvdGFsSXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvdGFsSXRlbXM7XG4gIH1cblxuICBwcml2YXRlIHNldCB0b3RhbEl0ZW1zKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl90b3RhbEl0ZW1zID0gdmFsdWU7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbmplY3Rvci5ydW5JbkNvbnRleHQoKCkgPT4ge1xuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQgPSB0aGlzLmNyZWF0ZVZpcnR1YWxTY3JvbGxWaWV3cG9ydEZvckRhdGFncmlkKFxuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICB0aGlzLm5nWm9uZSxcbiAgICAgICAgdGhpcy5yZW5kZXJlcjIsXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uYWxpdHksXG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzcGF0Y2hlcixcbiAgICAgICAgdGhpcy52aWV3cG9ydFJ1bGVyLFxuICAgICAgICB0aGlzLmRhdGFncmlkRWxlbWVudFJlZixcbiAgICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsU3RyYXRlZ3lcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvciA9IGNyZWF0ZUNka1ZpcnR1YWxGb3JPZkRpcmVjdGl2ZShcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLFxuICAgICAgICB0aGlzLnRlbXBsYXRlUmVmLFxuICAgICAgICB0aGlzLml0ZXJhYmxlRGlmZmVycyxcbiAgICAgICAgdGhpcy52aWV3UmVwZWF0ZXIsXG4gICAgICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgICB0aGlzLm5nWm9uZVxuICAgICAgKTtcblxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQubmdPbkluaXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZ3JpZFJvbGVFbGVtZW50ID0gdGhpcy5kYXRhZ3JpZEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PignW3JvbGU9XCJncmlkXCJdJyk7XG5cbiAgICB0aGlzLnVwZGF0ZUNka1ZpcnR1YWxGb3JJbnB1dHMoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgdGhpcy5pdGVtcy5jaGFuZ2Uuc3Vic2NyaWJlKG5ld0l0ZW1zID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMuc21hcnQpIHtcbiAgICAgICAgICB0aGlzLmNka1ZpcnR1YWxGb3IuY2RrVmlydHVhbEZvck9mID0gbmV3SXRlbXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG91bGRVcGRhdGVBcmlhUm93SW5kZXhlcyA9IHRydWU7XG4gICAgICB9KSxcbiAgICAgIHRoaXMuY2RrVmlydHVhbEZvci5kYXRhU3RyZWFtLnN1YnNjcmliZShkYXRhID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVBcmlhUm93Q291bnQoZGF0YS5sZW5ndGgpO1xuICAgICAgfSksXG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxWaWV3cG9ydC5zY3JvbGxlZEluZGV4Q2hhbmdlLnN1YnNjcmliZShpbmRleCA9PiB7XG4gICAgICAgIHRoaXMudG9wSW5kZXggPSBpbmRleDtcbiAgICAgIH0pLFxuICAgICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQucmVuZGVyZWRSYW5nZVN0cmVhbS5zdWJzY3JpYmUocmVuZGVyZWRSYW5nZSA9PiB7XG4gICAgICAgIHRoaXMucmVuZGVyZWRSYW5nZUNoYW5nZS5lbWl0KHJlbmRlcmVkUmFuZ2UpO1xuICAgICAgICB0aGlzLnNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzID0gdHJ1ZTtcbiAgICAgIH0pLFxuICAgICAgdGhpcy5kYXRhZ3JpZC5yZWZyZXNoLnN1YnNjcmliZShkYXRhZ3JpZFN0YXRlID0+IHtcbiAgICAgICAgaWYgKGRhdGFncmlkU3RhdGUuZmlsdGVycykge1xuICAgICAgICAgIHRoaXMuc2Nyb2xsVG9JbmRleCgwKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICB0aGlzLmNvbHVtbnNTZXJ2aWNlLmNvbHVtbnNTdGF0ZUNoYW5nZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnZpZXdSZXBlYXRlci5kZXRhY2goKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nRG9DaGVjaygpO1xuICAgIGlmICh0aGlzLnNob3VsZFVwZGF0ZUFyaWFSb3dJbmRleGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFyaWFSb3dJbmRleGVzKCk7XG5cbiAgICAgIHRoaXMuc2hvdWxkVXBkYXRlQXJpYVJvd0luZGV4ZXMgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNka1ZpcnR1YWxGb3I/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy52aXJ0dWFsU2Nyb2xsVmlld3BvcnQ/Lm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5tdXRhdGlvbkNoYW5nZXM/LmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZm9yRWFjaChzdWJzY3JpcHRpb24gPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxVcChvZmZzZXQ6IG51bWJlciwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgdGhpcy5zY3JvbGxUb0luZGV4KHRoaXMudG9wSW5kZXggLSBvZmZzZXQsIGJlaGF2aW9yKTtcbiAgfVxuXG4gIHNjcm9sbERvd24ob2Zmc2V0OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMuc2Nyb2xsVG9JbmRleCh0aGlzLnRvcEluZGV4ICsgb2Zmc2V0LCBiZWhhdmlvcik7XG4gIH1cblxuICBzY3JvbGxUb0luZGV4KGluZGV4OiBudW1iZXIsIGJlaGF2aW9yOiBTY3JvbGxCZWhhdmlvciA9ICdhdXRvJykge1xuICAgIHRoaXMudmlydHVhbFNjcm9sbFZpZXdwb3J0Py5zY3JvbGxUb0luZGV4KGluZGV4LCBiZWhhdmlvcik7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUl0ZW1TaXplKHZhbHVlOiBDZGtGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzWydpdGVtU2l6ZSddKSB7XG4gICAgdGhpcy5faXRlbVNpemUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVGaXhlZFNpemVWaXJ0dWFsU2Nyb2xsSW5wdXRzKCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURhdGFSYW5nZShza2lwOiBudW1iZXIsIGRhdGE6IFRbXSkge1xuICAgIGxldCBpdGVtcyA9IHRoaXMuY2RrVmlydHVhbEZvck9mIGFzIFRbXTtcblxuICAgIGlmICghdGhpcy5wZXJzaXN0SXRlbXMgfHwgIWl0ZW1zIHx8IGl0ZW1zPy5sZW5ndGggIT09IHRoaXMudG90YWxJdGVtcykge1xuICAgICAgaXRlbXMgPSBBcnJheSh0aGlzLnRvdGFsSXRlbXMpO1xuICAgIH1cblxuICAgIGl0ZW1zLnNwbGljZShza2lwLCBkYXRhLmxlbmd0aCwgLi4uZGF0YSk7XG5cbiAgICB0aGlzLmNka1ZpcnR1YWxGb3JPZiA9IEFycmF5LmZyb20oaXRlbXMpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVDZGtWaXJ0dWFsRm9ySW5wdXRzKCkge1xuICAgIGlmICh0aGlzLmNka1ZpcnR1YWxGb3IpIHtcbiAgICAgIGZvciAoY29uc3QgY2RrVmlydHVhbEZvcklucHV0S2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY2RrVmlydHVhbEZvcklucHV0cykgYXMgQ2RrVmlydHVhbEZvcklucHV0S2V5W10pIHtcbiAgICAgICAgaWYgKHRoaXMuY2RrVmlydHVhbEZvcltjZGtWaXJ0dWFsRm9ySW5wdXRLZXldICE9PSB0aGlzLmNka1ZpcnR1YWxGb3JJbnB1dHNbY2RrVmlydHVhbEZvcklucHV0S2V5XSkge1xuICAgICAgICAgICh0aGlzLmNka1ZpcnR1YWxGb3IgYXMgYW55KVtjZGtWaXJ0dWFsRm9ySW5wdXRLZXldID0gdGhpcy5jZGtWaXJ0dWFsRm9ySW5wdXRzW2Nka1ZpcnR1YWxGb3JJbnB1dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxJbnB1dHMoKSB7XG4gICAgaWYgKHRoaXMudmlydHVhbFNjcm9sbFN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLnZpcnR1YWxTY3JvbGxTdHJhdGVneS51cGRhdGVJdGVtQW5kQnVmZmVyU2l6ZSh0aGlzLml0ZW1TaXplLCB0aGlzLm1pbkJ1ZmZlclB4LCB0aGlzLm1heEJ1ZmZlclB4KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFSb3dDb3VudChyb3dDb3VudDogbnVtYmVyKSB7XG4gICAgdGhpcy5ncmlkUm9sZUVsZW1lbnQ/LnNldEF0dHJpYnV0ZSgnYXJpYS1yb3djb3VudCcsIHJvd0NvdW50LnRvU3RyaW5nKCkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVBcmlhUm93SW5kZXhlcygpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5nZXQoaSkgYXMgRW1iZWRkZWRWaWV3UmVmPENka1ZpcnR1YWxGb3JPZkNvbnRleHQ8VD4+O1xuXG4gICAgICBjb25zdCByb290RWxlbWVudHM6IEhUTUxFbGVtZW50W10gPSB2aWV3UmVmLnJvb3ROb2RlcztcbiAgICAgIGNvbnN0IGRhdGFncmlkUm93RWxlbWVudCA9IHJvb3RFbGVtZW50cy5maW5kKHJvd0VsZW1lbnQgPT4gcm93RWxlbWVudC50YWdOYW1lID09PSAnQ0xSLURHLVJPVycpO1xuICAgICAgY29uc3Qgcm93Um9sZUVsZW1lbnQgPSBkYXRhZ3JpZFJvd0VsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoJ1tyb2xlPVwicm93XCJdJyk7XG5cbiAgICAgIGNvbnN0IG5ld0FyaWFSb3dJbmRleCA9ICh2aWV3UmVmLmNvbnRleHQuaW5kZXggKyAxKS50b1N0cmluZygpO1xuICAgICAgaWYgKHJvd1JvbGVFbGVtZW50Py5nZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnKSAhPT0gbmV3QXJpYVJvd0luZGV4KSB7XG4gICAgICAgIC8vIGFyaWEtcm93aW5kZXggc2hvdWxkIHN0YXJ0IHdpdGggb25lLCBub3QgemVybywgc28gd2UgaGF2ZSB0byBhZGQgb25lIHRvIHRoZSB6ZXJvLWJhc2VkIGluZGV4XG4gICAgICAgIHJvd1JvbGVFbGVtZW50Py5zZXRBdHRyaWJ1dGUoJ2FyaWEtcm93aW5kZXgnLCBuZXdBcmlhUm93SW5kZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlVmlydHVhbFNjcm9sbFZpZXdwb3J0Rm9yRGF0YWdyaWQoXG4gICAgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIG5nWm9uZTogTmdab25lLFxuICAgIHJlbmRlcmVyMjogUmVuZGVyZXIyLFxuICAgIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBzY3JvbGxEaXNwYXRjaGVyOiBTY3JvbGxEaXNwYXRjaGVyLFxuICAgIHZpZXdwb3J0UnVsZXI6IFZpZXdwb3J0UnVsZXIsXG4gICAgZGF0YWdyaWRFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICB2aXJ0dWFsU2Nyb2xsU3RyYXRlZ3k6IEZpeGVkU2l6ZVZpcnR1YWxTY3JvbGxTdHJhdGVneVxuICApIHtcbiAgICBjb25zdCBkYXRhZ3JpZENvbnRlbnRFbGVtZW50ID0gZGF0YWdyaWRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oJy5kYXRhZ3JpZC1jb250ZW50Jyk7XG4gICAgY29uc3QgZGF0YWdyaWRSb3dzRWxlbWVudCA9IGRhdGFncmlkRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEVsZW1lbnQ+KCcuZGF0YWdyaWQtcm93cycpO1xuXG4gICAgY29uc3QgdmlydHVhbFNjcm9sbFZpZXdwb3J0ID0gY3JlYXRlQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KFxuICAgICAgbmV3IEVsZW1lbnRSZWYoZGF0YWdyaWRDb250ZW50RWxlbWVudCksXG4gICAgICBuZXcgRWxlbWVudFJlZihkYXRhZ3JpZFJvd3NFbGVtZW50KSxcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgcmVuZGVyZXIyLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIG51bGwgYXMgYW55IGFzIENka1ZpcnR1YWxTY3JvbGxhYmxlRWxlbWVudFxuICAgICk7XG5cbiAgICByZXR1cm4gdmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgZGF0YWdyaWREaXZFbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgY29udGVudFdyYXBwZXI6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIG5nWm9uZTogTmdab25lLFxuICByZW5kZXJlcjI6IFJlbmRlcmVyMixcbiAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5OiBWaXJ0dWFsU2Nyb2xsU3RyYXRlZ3ksXG4gIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgc2Nyb2xsRGlzcGF0Y2hlcjogU2Nyb2xsRGlzcGF0Y2hlcixcbiAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgc2Nyb2xsYWJsZTogQ2RrVmlydHVhbFNjcm9sbGFibGVcbikge1xuICBsZXQgdmlld1BvcnQ6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHZpZXdQb3J0ID0gbmV3IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydChcbiAgICAgIGRhdGFncmlkRGl2RWxlbWVudFJlZixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgbmdab25lLFxuICAgICAgdmlydHVhbFNjcm9sbFN0cmF0ZWd5LFxuICAgICAgZGlyZWN0aW9uYWxpdHksXG4gICAgICBzY3JvbGxEaXNwYXRjaGVyLFxuICAgICAgdmlld3BvcnRSdWxlcixcbiAgICAgIHNjcm9sbGFibGVcbiAgICApO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICAgIHBhcmVudDogaW5qZWN0KEVudmlyb25tZW50SW5qZWN0b3IpLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogRWxlbWVudFJlZiwgdXNlVmFsdWU6IGRhdGFncmlkRGl2RWxlbWVudFJlZiB9LFxuICAgICAgICB7IHByb3ZpZGU6IENoYW5nZURldGVjdG9yUmVmLCB1c2VWYWx1ZTogY2hhbmdlRGV0ZWN0b3JSZWYgfSxcbiAgICAgICAgeyBwcm92aWRlOiBOZ1pvbmUsIHVzZVZhbHVlOiBuZ1pvbmUgfSxcbiAgICAgICAgeyBwcm92aWRlOiBSZW5kZXJlcjIsIHVzZVZhbHVlOiByZW5kZXJlcjIgfSxcbiAgICAgICAgeyBwcm92aWRlOiBWSVJUVUFMX1NDUk9MTF9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxTdHJhdGVneSB9LFxuICAgICAgICB7IHByb3ZpZGU6IERpcmVjdGlvbmFsaXR5LCB1c2VWYWx1ZTogZGlyZWN0aW9uYWxpdHkgfSxcbiAgICAgICAgeyBwcm92aWRlOiBTY3JvbGxEaXNwYXRjaGVyLCB1c2VWYWx1ZTogc2Nyb2xsRGlzcGF0Y2hlciB9LFxuICAgICAgICB7IHByb3ZpZGU6IFZpZXdwb3J0UnVsZXIsIHVzZVZhbHVlOiB2aWV3cG9ydFJ1bGVyIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbGFibGUsIHVzZVZhbHVlOiBzY3JvbGxhYmxlIH0sXG4gICAgICAgIHsgcHJvdmlkZTogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0LCB1c2VDbGFzczogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0IH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdmlld1BvcnQgPSB2aXJ0dWFsU2Nyb2xsVmlld3BvcnRJbmplY3Rvci5nZXQoQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0KTtcbiAgfVxuICB2aWV3UG9ydC5fY29udGVudFdyYXBwZXIgPSBjb250ZW50V3JhcHBlcjtcbiAgcmV0dXJuIHZpZXdQb3J0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDZGtWaXJ0dWFsRm9yT2ZEaXJlY3RpdmU8VD4oXG4gIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgaXRlcmFibGVEaWZmZXJzOiBJdGVyYWJsZURpZmZlcnMsXG4gIHZpZXdSZXBlYXRlcjogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneTxULCBULCBDZGtWaXJ0dWFsRm9yT2ZDb250ZXh0PFQ+PixcbiAgdmlydHVhbFNjcm9sbFZpZXdwb3J0OiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsXG4gIG5nWm9uZTogTmdab25lXG4pIHtcbiAgaWYgKCtBTkdVTEFSX1ZFUlNJT04ubWFqb3IgPCAxOSkge1xuICAgIHJldHVybiBuZXcgQ2RrVmlydHVhbEZvck9mPFQ+KFxuICAgICAgdmlld0NvbnRhaW5lclJlZixcbiAgICAgIHRlbXBsYXRlUmVmLFxuICAgICAgaXRlcmFibGVEaWZmZXJzLFxuICAgICAgdmlld1JlcGVhdGVyLFxuICAgICAgdmlydHVhbFNjcm9sbFZpZXdwb3J0LFxuICAgICAgbmdab25lXG4gICAgKTtcbiAgfVxuXG4gIC8vIFByb3ZpZGUgdGhlIHZpZXdwb3J0IHVuZGVyIEJPVEggdGhlIGNsYXNzIHRva2VuICh1c2VkIGJ5IENka1ZpcnR1YWxGb3JPZiBpbiBDREsgMTUtMjApXG4gIC8vIGFuZCB0aGUgZGVkaWNhdGVkIEluamVjdGlvblRva2VuICh1c2VkIGJ5IENka1ZpcnR1YWxGb3JPZiBpbiBDREsgMjErKS4gVGhlIHRva2VuIGlzXG4gIC8vIHJlc29sdmVkIGF0IG1vZHVsZSBsb2FkIHZpYSBpbmRleGVkIGFjY2Vzcywgc28gYWJzZW50IG9uIENESyAxNSBidWlsZHMgd2Ugc2ltcGx5IHNraXAgaXQuXG4gIC8vIFRoaXMgYXZvaWRzIHR5aW5nIHRoZSBkaXNwYXRjaCB0byBBTkdVTEFSX1ZFUlNJT04gKHdoaWNoIG1heSBkaXZlcmdlIGZyb20gQ0RLIHZlcnNpb25cbiAgLy8gaW4gbWl4ZWQgaW5zdGFsbHMgcGVybWl0dGVkIGJ5IG91ciBwZWVyRGVwZW5kZW5jaWVzIHJhbmdlKS5cbiAgY29uc3Qgdmlld3BvcnRQcm92aWRlcnM6IHsgcHJvdmlkZTogdW5rbm93bjsgdXNlVmFsdWU6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9W10gPSBbXG4gICAgeyBwcm92aWRlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHVzZVZhbHVlOiB2aXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSxcbiAgXTtcbiAgaWYgKF9DREtfVklSVFVBTF9TQ1JPTExfVklFV1BPUlQpIHtcbiAgICB2aWV3cG9ydFByb3ZpZGVycy5wdXNoKHsgcHJvdmlkZTogX0NES19WSVJUVUFMX1NDUk9MTF9WSUVXUE9SVCwgdXNlVmFsdWU6IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9KTtcbiAgfVxuXG4gIGNvbnN0IHZpcnR1YWxTY3JvbGxWaWV3cG9ydEluamVjdG9yID0gSW5qZWN0b3IuY3JlYXRlKHtcbiAgICBwYXJlbnQ6IGluamVjdChFbnZpcm9ubWVudEluamVjdG9yKSxcbiAgICBwcm92aWRlcnM6IHZpZXdwb3J0UHJvdmlkZXJzIGFzIHsgcHJvdmlkZTogSW5qZWN0aW9uVG9rZW48dW5rbm93bj47IHVzZVZhbHVlOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfVtdLFxuICB9KTtcblxuICBjb25zdCBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoe1xuICAgIHBhcmVudDogdmlydHVhbFNjcm9sbFZpZXdwb3J0SW5qZWN0b3IsXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICB7IHByb3ZpZGU6IFZpZXdDb250YWluZXJSZWYsIHVzZVZhbHVlOiB2aWV3Q29udGFpbmVyUmVmIH0sXG4gICAgICB7IHByb3ZpZGU6IFRlbXBsYXRlUmVmLCB1c2VWYWx1ZTogdGVtcGxhdGVSZWYgfSxcbiAgICAgIHsgcHJvdmlkZTogSXRlcmFibGVEaWZmZXJzLCB1c2VWYWx1ZTogaXRlcmFibGVEaWZmZXJzIH0sXG4gICAgICAvLyBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSBpcyBpbmplY3RlZCBieSBDZGtWaXJ0dWFsRm9yT2YgaW4gQ0RLIDE5LTIwO1xuICAgICAgLy8gQ0RLIDIxKyByZW1vdmVkIHRoZSB0b2tlbiBhbmQgY3JlYXRlcyBpdHMgb3duIHN0cmF0ZWd5IGludGVybmFsbHkuXG4gICAgICAuLi4oX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1kgPyBbeyBwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlVmFsdWU6IHZpZXdSZXBlYXRlciB9XSA6IFtdKSxcbiAgICAgIHsgcHJvdmlkZTogTmdab25lLCB1c2VWYWx1ZTogbmdab25lIH0sXG4gICAgICB7IHByb3ZpZGU6IENka1ZpcnR1YWxGb3JPZiwgdXNlQ2xhc3M6IENka1ZpcnR1YWxGb3JPZiB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIHJldHVybiBjZGtWaXJ0dWFsRm9ySW5qZWN0b3IuZ2V0KENka1ZpcnR1YWxGb3JPZik7XG59XG4iXX0=