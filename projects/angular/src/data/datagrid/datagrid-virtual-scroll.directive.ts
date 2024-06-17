/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { _RecycleViewRepeaterStrategy, ListRange } from '@angular/cdk/collections';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualForOfContext,
  CdkVirtualScrollableElement,
  CdkVirtualScrollViewport,
  FixedSizeVirtualScrollStrategy,
  ScrollDispatcher,
  ViewportRuler,
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
  Input,
  IterableDiffers,
  NgZone,
  OnDestroy,
  Output,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { Items } from './providers/items';

type CdkVirtualForInputKey =
  | 'cdkVirtualForOf'
  | 'cdkVirtualForTrackBy'
  | 'cdkVirtualForTemplate'
  | 'cdkVirtualForTemplateCacheSize';

type CdkVirtualForInputs<T> = Partial<Pick<CdkVirtualForOf<T>, CdkVirtualForInputKey>>;

type CdkFixedSizeVirtualScrollInputs = Pick<CdkFixedSizeVirtualScroll, 'itemSize' | 'minBufferPx' | 'maxBufferPx'>;

const defaultCdkFixedSizeVirtualScrollInputs: CdkFixedSizeVirtualScrollInputs = {
  itemSize: 32,
  minBufferPx: 200,
  maxBufferPx: 400,
};

@Directive({
  selector: '[ClrVirtualScroll]',
  providers: [Items],
})
export class ClrDatagridVirtualScrollDirective<T> implements AfterViewInit, DoCheck, OnDestroy {
  @Output() renderedRangeChange = new EventEmitter<ListRange>();

  private _cdkFixedSizeVirtualScrollInputs = { ...defaultCdkFixedSizeVirtualScrollInputs };

  private readonly datagridElementRef: ElementRef<HTMLElement>;

  private gridRoleElement: HTMLElement | null | undefined;
  private readonly virtualScrollStrategy: FixedSizeVirtualScrollStrategy;
  private virtualScrollViewport: CdkVirtualScrollViewport;
  private cdkVirtualFor: CdkVirtualForOf<T>;
  private subscriptions: Subscription[] = [];
  private mutationChanges: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
    mutations.forEach((mutation: MutationRecord) => {
      // it is possible this to be called twice because the old class is removed and the new added
      if ((mutation.target as HTMLElement).classList.contains('datagrid-compact') && this.itemSize > 24) {
        this.itemSize = 24;
      }
    });
  });

  private cdkVirtualForInputs: CdkVirtualForInputs<T> = {
    cdkVirtualForTrackBy: index => index,
  };

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private iterableDiffers: IterableDiffers,
    @SkipSelf() private items: Items<T>,
    private readonly ngZone: NgZone,
    private readonly templateRef: TemplateRef<CdkVirtualForOfContext<T>>,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly directionality: Directionality,
    private readonly scrollDispatcher: ScrollDispatcher,
    private readonly viewportRuler: ViewportRuler,
    private readonly datagrid: ClrDatagrid,
    private readonly injector: EnvironmentInjector
  ) {
    this.items.smartenUp();
    this.datagrid.hasVirtualScroller = true;
    this.datagrid.detailService.preventFocusScroll = true;

    this.datagridElementRef = this.datagrid.el;

    this.mutationChanges.observe(this.datagridElementRef.nativeElement, {
      attributeFilter: ['class'],
      attributeOldValue: true,
    });

    this.virtualScrollStrategy = new FixedSizeVirtualScrollStrategy(
      this._cdkFixedSizeVirtualScrollInputs.itemSize,
      this._cdkFixedSizeVirtualScrollInputs.minBufferPx,
      this._cdkFixedSizeVirtualScrollInputs.maxBufferPx
    );
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
    return this._cdkFixedSizeVirtualScrollInputs.itemSize;
  }
  set itemSize(value: CdkFixedSizeVirtualScrollInputs['itemSize']) {
    this._cdkFixedSizeVirtualScrollInputs.itemSize = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('clrVirtualRowsMinBufferPx')
  get minBufferPx() {
    return this._cdkFixedSizeVirtualScrollInputs.minBufferPx;
  }
  set minBufferPx(value: CdkFixedSizeVirtualScrollInputs['minBufferPx']) {
    this._cdkFixedSizeVirtualScrollInputs.minBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  @Input('clrVirtualRowsMaxBufferPx')
  get maxBufferPx() {
    return this._cdkFixedSizeVirtualScrollInputs.maxBufferPx;
  }
  set maxBufferPx(value: CdkFixedSizeVirtualScrollInputs['maxBufferPx']) {
    this._cdkFixedSizeVirtualScrollInputs.maxBufferPx = coerceNumberProperty(value);
    this.updateFixedSizeVirtualScrollInputs();
  }

  ngAfterViewInit() {
    this.injector.runInContext(() => {
      this.virtualScrollViewport = this.createVirtualScrollViewportForDatagrid(
        this.changeDetectorRef,
        this.ngZone,
        this.directionality,
        this.scrollDispatcher,
        this.viewportRuler,
        this.datagridElementRef,
        this.virtualScrollStrategy
      );

      this.cdkVirtualFor = new CdkVirtualForOf<T>(
        this.viewContainerRef,
        this.templateRef,
        this.iterableDiffers,
        new _RecycleViewRepeaterStrategy<T, T, CdkVirtualForOfContext<T>>(),
        this.virtualScrollViewport,
        this.ngZone
      );

      this.virtualScrollViewport.ngOnInit();
    });

    this.gridRoleElement = this.datagridElementRef.nativeElement.querySelector<HTMLElement>('[role="grid"]');

    this.updateCdkVirtualForInputs();

    this.subscriptions.push(
      this.items.change.subscribe(newItems => {
        this.cdkVirtualFor.cdkVirtualForOf = newItems;
      }),
      this.cdkVirtualFor.dataStream.subscribe(data => {
        this.updateAriaRowCount(data.length);
      }),
      this.virtualScrollViewport.renderedRangeStream.subscribe(renderedRange => {
        this.renderedRangeChange.emit(renderedRange);
      }),
      this.datagrid.refresh.subscribe(datagridState => {
        if (datagridState.filters) {
          this.virtualScrollViewport.scrollToIndex(0);
        }
      })
    );
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
      this.virtualScrollStrategy.updateItemAndBufferSize(
        this._cdkFixedSizeVirtualScrollInputs.itemSize,
        this._cdkFixedSizeVirtualScrollInputs.minBufferPx,
        this._cdkFixedSizeVirtualScrollInputs.maxBufferPx
      );
    }
  }

  private updateAriaRowCount(rowCount: number) {
    this.gridRoleElement?.setAttribute('aria-rowcount', rowCount.toString());
  }

  private updateAriaRowIndexes() {
    for (let i = 0; i < this.viewContainerRef.length; i++) {
      const viewRef = this.viewContainerRef.get(i) as EmbeddedViewRef<CdkVirtualForOfContext<T>>;

      const rootElements: HTMLElement[] = viewRef.rootNodes;
      const datagridRowElement = rootElements.find(rowElement => rowElement.tagName === 'CLR-DG-ROW');
      const rowRoleElement = datagridRowElement?.querySelector('[role="row"]');

      // aria-rowindex should start with one, not zero, so we have to add one to the zero-based index
      rowRoleElement?.setAttribute('aria-rowindex', (viewRef.context.index + 1).toString());
    }
  }

  private createVirtualScrollViewportForDatagrid(
    changeDetectorRef: ChangeDetectorRef,
    ngZone: NgZone,
    directionality: Directionality,
    scrollDispatcher: ScrollDispatcher,
    viewportRuler: ViewportRuler,
    datagridElementRef: ElementRef<HTMLElement>,
    virtualScrollStrategy: FixedSizeVirtualScrollStrategy
  ) {
    const datagridDivElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid');
    const datagridTableElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-table');
    const datagridRowsElement = datagridElementRef.nativeElement.querySelector<HTMLElement>('.datagrid-rows');
    const datagridDivElementRef: ElementRef<HTMLElement> = { nativeElement: datagridDivElement };

    let topOffset = 0;
    let totalContentSize = 0;

    function updateDatagridElementStyles() {
      datagridRowsElement.style.transform = `translateY(${topOffset}px)`;
      datagridRowsElement.style.height = `${totalContentSize - topOffset}px`;
    }

    const virtualScrollViewport = new CdkVirtualScrollViewport(
      datagridDivElementRef,
      changeDetectorRef,
      ngZone,
      virtualScrollStrategy,
      directionality,
      scrollDispatcher,
      viewportRuler,
      null as any as CdkVirtualScrollableElement
    );

    virtualScrollViewport._contentWrapper = {
      nativeElement: {
        style: {
          set transform(value: any) {
            topOffset = value === undefined ? 0 : +/translateY\(([0-9]+)px\)/.exec(value)?.[1];
            updateDatagridElementStyles();
          },
        },
      },
    } as ElementRef;

    virtualScrollViewport.setTotalContentSize = (value: number) => {
      totalContentSize = value;
      datagridTableElement.style.height = `${totalContentSize}px`;
      updateDatagridElementStyles();
    };

    return virtualScrollViewport;
  }
}
