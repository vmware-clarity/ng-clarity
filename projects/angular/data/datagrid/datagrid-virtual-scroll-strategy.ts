/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Virtual scroll strategy for the datagrid. It behaves exactly like CDK's
 * FixedSizeVirtualScrollStrategy (every row is `itemSize` tall), except that a row can report an
 * extra height on top of `itemSize` via `setItemExtraHeight()` - used for any row whose real
 * rendered height ends up taller than itemSize, for whatever reason (expandable detail content,
 * dynamically sized cell content, etc.). Total content size and the scroll offset / rendered-
 * range math both account for that extra height so the CDK viewport stays in sync with the real
 * DOM instead of the fixed-size assumption.
 *
 * When no row reports extra height this strategy is numerically identical to
 * FixedSizeVirtualScrollStrategy: every `offsetForIndex(i)` call reduces to `i * itemSize`.
 *
 * This is deliberately not @angular/cdk-experimental's AutoSizeVirtualScrollStrategy. That
 * strategy assumes item sizes are entirely unknown and tracks a running *average* from whatever
 * is currently rendered, estimating everything else from it - which is why it can't support
 * scrollToIndex/scrolledIndexChange (an averaged position isn't precise) and needs drift-
 * correction machinery (offset correction while scrolling, backing off when an estimated removal
 * turns out unsafe) to cope with its own estimates being wrong. The datagrid has a known,
 * deterministic itemSize; rows are that size except when something (expansion, dynamic content)
 * makes a specific one taller. Tracking exact extra height per row we've actually measured - and
 * assuming itemSize for anything we haven't - gives exact (not estimated) math, so none of that
 * drift-correction is needed and scrollToIndex/scrolledIndexChange stay precise.
 */
export class ClrDatagridVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange: Observable<number>;

  private readonly _scrolledIndexChange = new Subject<number>();
  private viewport: CdkVirtualScrollViewport | null = null;

  // Extra height (beyond itemSize) contributed by an expanded row's detail content, keyed by
  // data index. A row with no entry here is assumed to be exactly itemSize tall. Entries are
  // deliberately kept for rows that scroll out of the rendered range - we can no longer measure
  // them, but their real height still counts towards the total scrollable content size, so
  // clearing them here would shrink the scrollbar every time an expanded row is virtualized away.
  private extraHeights = new Map<number, number>();
  private sortedIndexesDirty = false;
  private sortedIndexes: number[] = [];
  private prefixExtraHeights: number[] = [];

  constructor(
    private itemSize: number,
    private minBufferPx: number,
    private maxBufferPx: number
  ) {
    this.scrolledIndexChange = this._scrolledIndexChange.pipe(distinctUntilChanged());
  }

  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  detach() {
    this._scrolledIndexChange.complete();
    this.viewport = null;
  }

  updateItemAndBufferSize(itemSize: number, minBufferPx: number, maxBufferPx: number) {
    if (maxBufferPx < minBufferPx) {
      throw Error('CDK virtual scroll: maxBufferPx must be greater than or equal to minBufferPx');
    }
    this.itemSize = itemSize;
    this.minBufferPx = minBufferPx;
    this.maxBufferPx = maxBufferPx;
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  onContentScrolled() {
    this.updateRenderedRange();
  }

  onDataLengthChanged() {
    this.updateTotalContentSize();
    this.updateRenderedRange();
  }

  onContentRendered() {
    /* no-op, matches FixedSizeVirtualScrollStrategy */
  }

  onRenderedOffsetChanged() {
    /* no-op, matches FixedSizeVirtualScrollStrategy */
  }

  scrollToIndex(index: number, behavior: ScrollBehavior) {
    this.viewport?.scrollToOffset(this.offsetForIndex(index), behavior);
  }

  /**
   * Registers the real measured height of a row so the scroll math accounts for it. Pass an
   * extraHeight <= 0 to reset the row back to the base itemSize.
   */
  setItemExtraHeight(index: number, extraHeight: number) {
    if (this.applyItemExtraHeight(index, extraHeight)) {
      this.updateTotalContentSize();
      this.updateRenderedRange();
    }
  }

  /**
   * Same as calling setItemExtraHeight() for every entry, but recomputes total content size and
   * rendered range only once for the whole batch rather than once per row - use this when several
   * rows are measured at the same time (e.g. from a single ResizeObserver callback).
   */
  setItemExtraHeights(extraHeightsByIndex: ReadonlyMap<number, number>) {
    let changed = false;
    for (const [index, extraHeight] of extraHeightsByIndex) {
      changed = this.applyItemExtraHeight(index, extraHeight) || changed;
    }
    if (changed) {
      this.updateTotalContentSize();
      this.updateRenderedRange();
    }
  }

  clearItemExtraHeight(index: number) {
    if (this.extraHeights.delete(index)) {
      this.sortedIndexesDirty = true;
      this.updateTotalContentSize();
      this.updateRenderedRange();
    }
  }

  /** Updates the extraHeights map for a single row. Returns whether anything changed. */
  private applyItemExtraHeight(index: number, extraHeight: number): boolean {
    if (extraHeight <= 0) {
      if (!this.extraHeights.delete(index)) {
        return false;
      }
    } else if (this.extraHeights.get(index) === extraHeight) {
      return false;
    } else {
      this.extraHeights.set(index, extraHeight);
    }
    this.sortedIndexesDirty = true;
    return true;
  }

  private rebuildSortedIndexesIfNeeded() {
    if (!this.sortedIndexesDirty) {
      return;
    }
    this.sortedIndexes = Array.from(this.extraHeights.keys()).sort((a, b) => a - b);
    let sum = 0;
    this.prefixExtraHeights = this.sortedIndexes.map(index => (sum += this.extraHeights.get(index) as number));
    this.sortedIndexesDirty = false;
  }

  /** Sum of extra heights for every expanded row at a data index strictly less than `index`. */
  private cumulativeExtraHeightBefore(index: number): number {
    this.rebuildSortedIndexesIfNeeded();
    if (!this.sortedIndexes.length) {
      return 0;
    }
    let low = 0;
    let high = this.sortedIndexes.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (this.sortedIndexes[mid] < index) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low === 0 ? 0 : this.prefixExtraHeights[low - 1];
  }

  private totalExtraHeight(): number {
    this.rebuildSortedIndexesIfNeeded();
    return this.prefixExtraHeights.length ? this.prefixExtraHeights[this.prefixExtraHeights.length - 1] : 0;
  }

  /** Pixel offset of the top edge of `index`, accounting for any expanded rows before it. */
  private offsetForIndex(index: number): number {
    return index * this.itemSize + this.cumulativeExtraHeightBefore(index);
  }

  /** Largest index in [0, dataLength] whose offsetForIndex() does not exceed `offset`. */
  private indexForOffset(offset: number, dataLength: number): number {
    if (offset <= 0 || dataLength <= 0) {
      return 0;
    }
    let low = 0;
    let high = dataLength;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (this.offsetForIndex(mid) <= offset) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }
    return low;
  }

  /** Smallest index in [0, dataLength] whose offsetForIndex() is at least `offset`. */
  private endIndexForOffset(offset: number, dataLength: number): number {
    if (offset <= 0) {
      return 0;
    }
    if (this.offsetForIndex(dataLength) <= offset) {
      return dataLength;
    }
    let low = 0;
    let high = dataLength;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.offsetForIndex(mid) < offset) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  }

  private updateTotalContentSize() {
    if (!this.viewport) {
      return;
    }
    const dataLength = this.viewport.getDataLength();
    this.viewport.setTotalContentSize(dataLength * this.itemSize + this.totalExtraHeight());
  }

  private updateRenderedRange() {
    if (!this.viewport) {
      return;
    }
    const renderedRange = this.viewport.getRenderedRange();
    const newRange: ListRange = { start: renderedRange.start, end: renderedRange.end };
    const viewportSize = this.viewport.getViewportSize();
    const dataLength = this.viewport.getDataLength();
    let scrollOffset = this.viewport.measureScrollOffset();

    if (newRange.end > dataLength) {
      // Walking back from the end of the list, find the start index whose remaining content
      // still fills the viewport - mirrors FixedSizeVirtualScrollStrategy's tail-clamping.
      const newStart = this.indexForOffset(this.offsetForIndex(dataLength) - viewportSize, dataLength);
      if (newStart !== newRange.start) {
        newRange.start = newStart;
        scrollOffset = this.offsetForIndex(newStart);
      }
      newRange.end = Math.max(0, Math.min(dataLength, this.endIndexForOffset(scrollOffset + viewportSize, dataLength)));
    }

    const startBuffer = scrollOffset - this.offsetForIndex(newRange.start);
    if (startBuffer < this.minBufferPx && newRange.start !== 0) {
      newRange.start = Math.max(0, this.indexForOffset(scrollOffset - this.maxBufferPx, dataLength));
      newRange.end = Math.min(
        dataLength,
        this.endIndexForOffset(scrollOffset + viewportSize + this.minBufferPx, dataLength)
      );
    } else {
      const endBuffer = this.offsetForIndex(newRange.end) - (scrollOffset + viewportSize);
      if (endBuffer < this.minBufferPx && newRange.end !== dataLength) {
        const newEnd = Math.min(
          dataLength,
          this.endIndexForOffset(scrollOffset + viewportSize + this.maxBufferPx, dataLength)
        );
        if (newEnd > newRange.end) {
          newRange.end = newEnd;
          newRange.start = Math.max(0, this.indexForOffset(scrollOffset - this.minBufferPx, dataLength));
        }
      }
    }

    this.viewport.setRenderedRange(newRange);
    this.viewport.setRenderedContentOffset(Math.round(this.offsetForIndex(newRange.start)));
    this._scrolledIndexChange.next(this.indexForOffset(scrollOffset, dataLength));
  }
}
