/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { zoomBreakpoints, ZoomLevel } from './zoom-level.model';

/**
 * Service for detecting zoom level based on document body size. Uses
 * ResizeObserver for detecting body size changes.
 * @private
 *  ResizeObserver spec: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 */
@Injectable()
export class ZoomLevelService implements OnDestroy {
  /**
   * The current zoom level, `undefined` until the document is first measured.
   * Read it in a template or a `computed()`: views that read it refresh when it changes, OnPush ones included.
   */
  readonly level: Signal<ZoomLevel | undefined>;

  private observer!: ResizeObserver;
  private resizeSubject = new ReplaySubject<ZoomLevel>(1);
  private readonly currentLevel = signal<ZoomLevel | undefined>(undefined);

  /**
   * Emits when the zoom level is changed.
   *
   * NOTE: This observable emits <b>outside Angular</b>. To render the zoom level, read
   * <code>level</code> instead: it needs no explicit change detection.
   */
  // debounceTime() operator is added to avoid the following error:
  // "ResizeObserver loop limit exceeded thrown"
  // This error means that ResizeObserver was not able to deliver all observations within
  // a single animation frame. This happens if a change detection is run inside the subscriber.
  private _onChange: Observable<ZoomLevel> = this.resizeSubject.pipe(debounceTime(10));

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.level = this.currentLevel.asReadonly();
    this.observe();
  }

  get onChange(): Observable<ZoomLevel> {
    return this._onChange;
  }
  set onChange(value: Observable<ZoomLevel>) {
    this._onChange = value;
  }

  ngOnDestroy() {
    this.unobserve();
    this.resizeSubject.complete();
  }

  private observe(): void {
    this.observer = new ResizeObserver((entries: any[]) => {
      const entry: any = entries && entries[0];
      if (!entry) {
        return;
      }
      this.detectZoomLevelChange(entry);
    });
    this.observer.observe(this.document.documentElement);
  }

  private unobserve() {
    this.observer.unobserve(this.document.documentElement);
  }

  private detectZoomLevelChange(entry: any): void {
    const docCurrentWidth = entry.contentRect.width;

    const newResponsiveBreakpoint = zoomBreakpoints.find(breakpoint => {
      return breakpoint.maxWidth >= docCurrentWidth;
    });

    const zoomLevel = newResponsiveBreakpoint?.zoomLevel;
    if (zoomLevel === this.currentLevel()) {
      return;
    }

    this.currentLevel.set(zoomLevel);
    this.resizeSubject.next(zoomLevel as ZoomLevel);
  }
}
