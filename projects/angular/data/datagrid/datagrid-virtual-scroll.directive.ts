/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ListRange } from '@angular/cdk/collections';
import {
  CDK_VIRTUAL_SCROLL_VIEWPORT,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualForOfContext,
  CdkVirtualScrollable,
  CdkVirtualScrollableElement,
  CdkVirtualScrollViewport,
  ScrollDispatcher,
  ViewportRuler,
  VIRTUAL_SCROLL_STRATEGY,
  VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  DoCheck,
  ElementRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  EventEmitter,
  forwardRef,
  Inject,
  inject,
  Injector,
  Input,
  IterableDiffers,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  runInInjectionContext,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridVirtualScrollStrategy } from './datagrid-virtual-scroll-strategy';
import { ClrDatagridVirtualScrollRangeInterface } from './interfaces/virtual-scroll-data-range.interface';
import { Items } from './providers/items';

type CdkVirtualForInputKey =
  | 'cdkVirtualForOf'
  | 'cdkVirtualForTrackBy'
  | 'cdkVirtualForTemplate'
  | 'cdkVirtualForTemplateCacheSize';

type CdkVirtualForInputs<T> = Partial<Pick<CdkVirtualForOf<T>, CdkVirtualForInputKey>>;

type CdkFixedSizeVirtualScrollInputs = Pick<CdkFixedSizeVirtualScroll, 'itemSize' | 'minBufferPx' | 'maxBufferPx'>;

@Directive({
  selector: '[clrVirtualScroll],[ClrVirtualScroll]',
  providers: [Items],
  standalone: false,
})
export class ClrDatagridVirtualScrollDirective<T> implements AfterViewInit, DoCheck, OnDestroy {
  @Output() renderedRangeChange = new EventEmitter<ListRange>();
  @Input('clrVirtualPersistItems') persistItems = true;

  private _isUserProvidedItemSize = false;
  private _itemSize = 33;
  private _minBufferPx = 200;
  private _maxBufferPx = 400;

  private shouldUpdateAriaRowIndexes = false;

  private readonly datagridElementRef: ElementRef<HTMLElement>;

  private gridRoleElement: HTMLElement | null | undefined;
  private readonly virtualScrollStrategy: ClrDatagridVirtualScrollStrategy;
  private virtualScrollViewport: CdkVirtualScrollViewport;
  private cdkVirtualFor: CdkVirtualForOf<T>;
  private subscriptions: Subscription[] = [];
  private topIndex = 0;

  /**
   * ResizeObserver watching every currently rendered row individually (rather than the rows
   * container as a whole), so any DOM change that makes a row taller or shorter than itemSize -
   * expandable detail content, dynamically sized cell content, anything - is reported to
   * virtualScrollStrategy. That keeps its total-content-size and scroll-offset math correct for
   * the real (variable) row heights instead of assuming every row is exactly itemSize.
   */
  private rowsResizeObserver: ResizeObserver | null = null;

  // @deprecated remove the mutation observer when `datagrid-compact` class is deleted
  private mutationChanges: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      // it is possible this to be called twice because the old class is removed and the new added
      if (
        !this._isUserProvidedItemSize &&
        (mutation.target as HTMLElement).classList.contains('datagrid-compact') &&
        this.itemSize > 25
      ) {
        this.updateItemSize(25);
      }
    });
  });

  private cdkVirtualForInputs: CdkVirtualForInputs<T> = {
    cdkVirtualForTrackBy: index => index,
  };
  private _totalItems: number;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private iterableDiffers: IterableDiffers,
    private items: Items<T>,
    private readonly ngZone: NgZone,
    private readonly renderer2: Renderer2,
    private readonly templateRef: TemplateRef<CdkVirtualForOfContext<T>>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly directionality: Directionality,
    private readonly scrollDispatcher: ScrollDispatcher,
    private readonly viewportRuler: ViewportRuler,
    @Inject(forwardRef(() => ClrDatagrid)) private readonly datagrid: ClrDatagrid,
    private readonly injector: EnvironmentInjector
  ) {
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

    this.virtualScrollStrategy = new ClrDatagridVirtualScrollStrategy(
      this.itemSize,
      this.minBufferPx,
      this.maxBufferPx
    );
  }

  get totalContentHeight() {
    return this.virtualScrollViewport?._totalContentHeight() || '';
  }

  @Input('clrVirtualRowsOf')
  get cdkVirtualForOf() {
    return this.cdkVirtualForInputs.cdkVirtualForOf;
  }
  set cdkVirtualForOf(value: CdkVirtualForInputs<T>['cdkVirtualForOf']) {
    this.cdkVirtualForInputs.cdkVirtualForOf = value;
    this.items.all = value as T[];
    this.updateCdkVirtualForInputs();
  }

  @Input('clrVirtualRowsTrackBy')
  get cdkVirtualForTrackBy() {
    return this.cdkVirtualForInputs.cdkVirtualForTrackBy;
  }
  set cdkVirtualForTrackBy(value: CdkVirtualForInputs<T>['cdkVirtualForTrackBy']) {
    this.cdkVirtualForInputs.cdkVirtualForTrackBy = value;
    this.updateCdkVirtualForInputs();
  }

  @Input('clrVirtualRowsTemplate')
  get cdkVirtualForTemplate() {
    return this?.cdkVirtualForInputs?.cdkVirtualForTemplate;
  }
  set cdkVirtualForTemplate(value: CdkVirtualForInputs<T>['cdkVirtualForTemplate']) {
    this.cdkVirtualForInputs.cdkVirtualForTemplate = value;
    this.updateCdkVirtualForInputs();
  }

  @Input('clrVirtualRowsTemplateCacheSize')
  get cdkVirtualForTemplateCacheSize() {
    return this.cdkVirtualForInputs.cdkVirtualForTemplateCacheSize;
  }
  set cdkVirtualForTemplateCacheSize(value: CdkVirtualForInputs<T>['cdkVirtualForTemplateCacheSize']) {
    this.cdkVirtualForInputs.cdkVirtualForTemplateCacheSize = coerceNumberProperty(value);
    this.updateCdkVirtualForInputs();
  }

  @Input('clrVirtualRowsItemSize')
  get itemSize() {
    return this._itemSize;
  }
  set itemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']) {
    this._isUserProvidedItemSize = true;
    this.updateItemSize(value);
  }

  @Input('clrVirtualRowsMinBufferPx')
  get minBufferPx() {
    return this._minBufferPx;
  }
  set minBufferPx(value: CdkFixedSizeVirtualScrollInputs['minBufferPx']) {
    this._minBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('clrVirtualRowsMaxBufferPx')
  get maxBufferPx() {
    return this._maxBufferPx;
  }
  set maxBufferPx(value: CdkFixedSizeVirtualScrollInputs['maxBufferPx']) {
    this._maxBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('clrVirtualDataRange')
  set dataRange(range: ClrDatagridVirtualScrollRangeInterface<T>) {
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

  private set totalItems(value: number) {
    this._totalItems = value;
  }

  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      this.virtualScrollViewport = this.createVirtualScrollViewportForDatagrid(
        this.changeDetectorRef,
        this.ngZone,
        this.renderer2,
        this.directionality,
        this.scrollDispatcher,
        this.viewportRuler,
        this.datagridElementRef,
        this.virtualScrollStrategy
      );

      this.cdkVirtualFor = createCdkVirtualForOfDirective(
        this.viewContainerRef,
        this.templateRef,
        this.iterableDiffers,
        this.virtualScrollViewport,
        this.ngZone
      );

      this.virtualScrollViewport.ngOnInit();
    });

    this.gridRoleElement = this.datagridElementRef.nativeElement.querySelector<HTMLElement>('[role="grid"]');

    // A single ResizeObserver instance observes every rendered row individually (rows are added
    // to it as they render, see observeRenderedRows()). ResizeObserver fires once immediately per
    // element on observe(), so this also measures rows that start out already taller than
    // itemSize - no separate "first fire" handling needed.
    if (typeof ResizeObserver !== 'undefined') {
      this.rowsResizeObserver = new ResizeObserver(entries => {
        // Run inside NgZone so Angular change detection and the CDK viewport layout cycle are
        // triggered correctly for any total-content-size / rendered-range change this causes.
        this.ngZone.run(() => {
          this.updateRowHeightsForEntries(entries);
        });
      });
    }

    this.updateCdkVirtualForInputs();

    this.subscriptions.push(
      this.items.change.subscribe(newItems => {
        if (this.items.smart) {
          this.cdkVirtualFor.cdkVirtualForOf = newItems;
        }
        this.shouldUpdateAriaRowIndexes = true;
      }),
      this.cdkVirtualFor.dataStream.subscribe(data => {
        this.updateAriaRowCount(data.length);
      }),
      this.virtualScrollViewport.scrolledIndexChange.subscribe(index => {
        this.topIndex = index;
      }),
      this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
        this.renderedRangeChange.emit(renderedRange);
        this.shouldUpdateAriaRowIndexes = true;
      }),
      this.datagrid.refresh.subscribe(datagridState => {
        if (datagridState.filters) {
          this.scrollToIndex(0);
        }
      })
    );
  }

  ngDoCheck() {
    this.cdkVirtualFor?.ngDoCheck();
    if (this.shouldUpdateAriaRowIndexes) {
      this.updateAriaRowIndexes();
      this.observeRenderedRows();

      this.shouldUpdateAriaRowIndexes = false;
    }
  }

  ngOnDestroy() {
    this.cdkVirtualFor?.ngOnDestroy();
    this.virtualScrollViewport?.ngOnDestroy();
    this.mutationChanges?.disconnect();
    this.rowsResizeObserver?.disconnect();
    this.rowsResizeObserver = null;
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  scrollUp(offset: number, behavior: ScrollBehavior = 'auto') {
    this.scrollToIndex(this.topIndex - offset, behavior);
  }

  scrollDown(offset: number, behavior: ScrollBehavior = 'auto') {
    this.scrollToIndex(this.topIndex + offset, behavior);
  }

  scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
    this.virtualScrollViewport?.scrollToIndex(index, behavior);
  }

  private updateDataRange(skip: number, data: T[]) {
    let items = this.cdkVirtualForOf as T[];

    if (!this.persistItems || !items || items?.length !== this.totalItems) {
      items = Array(this.totalItems);
    }

    items.splice(skip, data.length, ...data);

    this.cdkVirtualForOf = Array.from(items);
  }

  private updateItemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']) {
    this._itemSize = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  private updateCdkVirtualForInputs() {
    if (this.cdkVirtualFor) {
      for (const cdkVirtualForInputKey of Object.keys(this.cdkVirtualForInputs) as CdkVirtualForInputKey[]) {
        if (this.cdkVirtualFor[cdkVirtualForInputKey] !== this.cdkVirtualForInputs[cdkVirtualForInputKey]) {
          (this.cdkVirtualFor as any)[cdkVirtualForInputKey] = this.cdkVirtualForInputs[cdkVirtualForInputKey];
        }
      }
    }
  }

  private updateFixedSizeVirtualScrollInputs() {
    if (this.virtualScrollStrategy) {
      this.virtualScrollStrategy.updateItemAndBufferSize(this.itemSize, this.minBufferPx, this.maxBufferPx);
    }
  }

  private updateAriaRowCount(rowCount: number) {
    this.gridRoleElement?.setAttribute('aria-rowcount', rowCount.toString());
  }

  private updateAriaRowIndexes() {
    for (let i = 0; i < this.viewContainerRef.length; i++) {
      const viewRef = this.viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<T>>;
      const rowRoleElement = this.getRowMasterElement(viewRef);

      const newAriaRowIndex = (viewRef.context.index + 1).toString();
      if (rowRoleElement?.getAttribute('aria-rowindex') !== newAriaRowIndex) {
        // aria-rowindex should start with one, not zero, so we have to add one to the zero-based index
        rowRoleElement?.setAttribute('aria-rowindex', newAriaRowIndex);
      }
    }
  }

  // Registers every currently rendered row with rowsResizeObserver. observe() is a no-op for a
  // target that's already being observed, so this is safe to call on every rendered-range change
  // without tracking which rows we've already seen.
  private observeRenderedRows() {
    if (!this.rowsResizeObserver) {
      return;
    }
    for (let i = 0; i < this.viewContainerRef.length; i++) {
      const viewRef = this.viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<T>>;
      const rowMasterElement = this.getRowMasterElement(viewRef);
      if (rowMasterElement) {
        this.rowsResizeObserver.observe(rowMasterElement);
      }
    }
  }

  private updateRowHeightsForEntries(entries: ResizeObserverEntry[]) {
    const indexByRowMasterElement = new Map<Element, number>();
    for (let i = 0; i < this.viewContainerRef.length; i++) {
      const viewRef = this.viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<T>>;
      const rowMasterElement = this.getRowMasterElement(viewRef);
      if (rowMasterElement) {
        indexByRowMasterElement.set(rowMasterElement, viewRef.context.index);
      }
    }

    // Collect the whole batch before touching virtualScrollStrategy, so a resize that affects
    // several rows at once (e.g. a bulk expand, or a window resize reflowing every row) triggers
    // one total-content-size/rendered-range recompute instead of one per row.
    const extraHeightsByIndex = new Map<number, number>();
    for (const entry of entries) {
      const index = indexByRowMasterElement.get(entry.target);
      if (index === undefined) {
        // The row this element used to belong to has since scrolled out and been recycled for a
        // different index (or destroyed); its real height doesn't affect anything we can act on.
        continue;
      }
      extraHeightsByIndex.set(index, (entry.target as HTMLElement).offsetHeight - this.itemSize);
    }
    this.virtualScrollStrategy.setItemExtraHeights(extraHeightsByIndex);
  }

  private getRowMasterElement(viewRef: EmbeddedViewRef<CdkVirtualForOfContext<T>>): HTMLElement | null {
    const rootElements: HTMLElement[] = viewRef.rootNodes;
    const datagridRowElement = rootElements.find(rowElement => rowElement.tagName === 'CLR-DG-ROW');
    return datagridRowElement?.querySelector<HTMLElement>('[role="row"]') ?? null;
  }

  private createVirtualScrollViewportForDatagrid(
    changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    renderer2: Renderer2,
    directionality: Directionality,
    scrollDispatcher: ScrollDispatcher,
    viewportRuler: ViewportRuler,
    datagridElementRef: ElementRef<HTMLElement>,
    virtualScrollStrategy: ClrDatagridVirtualScrollStrategy
  ) {
    const datagridContentElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-content');
    const datagridRowsElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-rows');

    const virtualScrollViewport = createCdkVirtualScrollViewport(
      new ElementRef(datagridContentElement),
      new ElementRef(datagridRowsElement),
      changeDetectorRef,
      ngZone,
      renderer2,
      virtualScrollStrategy,
      directionality,
      scrollDispatcher,
      viewportRuler,
      null as any as CdkVirtualScrollableElement
    );

    return virtualScrollViewport;
  }
}

function createCdkVirtualScrollViewport(
  datagridDivElementRef: ElementRef<HTMLElement>,
  contentWrapper: ElementRef<HTMLElement>,
  changeDetectorRef: ChangeDetectorRef,
  ngZone: NgZone,
  renderer2: Renderer2,
  virtualScrollStrategy: VirtualScrollStrategy,
  directionality: Directionality,
  scrollDispatcher: ScrollDispatcher,
  viewportRuler: ViewportRuler,
  scrollable: CdkVirtualScrollable
) {
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
  const viewPort = virtualScrollViewportInjector.get(CdkVirtualScrollViewport);
  viewPort._contentWrapper = contentWrapper;
  return viewPort;
}

function createCdkVirtualForOfDirective<T>(
  viewContainerRef: ViewContainerRef,
  templateRef: TemplateRef<CdkVirtualForOfContext<T>>,
  iterableDiffers: IterableDiffers,
  virtualScrollViewport: CdkVirtualScrollViewport,
  ngZone: NgZone
) {
  const virtualScrollViewportInjector = Injector.create({
    parent: inject(EnvironmentInjector),
    providers: [{ provide: CDK_VIRTUAL_SCROLL_VIEWPORT, useValue: virtualScrollViewport }],
  });

  const cdkVirtualForInjector = Injector.create({
    parent: virtualScrollViewportInjector,
    providers: [
      { provide: ViewContainerRef, useValue: viewContainerRef },
      { provide: TemplateRef, useValue: templateRef },
      { provide: IterableDiffers, useValue: iterableDiffers },
      { provide: NgZone, useValue: ngZone },
      { provide: CdkVirtualForOf, useClass: CdkVirtualForOf },
    ],
  });

  return cdkVirtualForInjector.get(CdkVirtualForOf);
}
