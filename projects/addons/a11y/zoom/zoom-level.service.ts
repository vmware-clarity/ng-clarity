/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
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
  private observer: ResizeObserver;
  private resizeSubject = new ReplaySubject<ZoomLevel>(1);
  private lastZoomLevel: ZoomLevel | undefined;

  /**
   * Emits when the zoom level is changed.
   *
   * NOTE: This observable emits <b>outside Angular</b>. You might need to explicitly invoke
   * <code>ChangeDetectorRef.detectChanges()</code> to trigger Angular change detection.
   */
  // debounceTime() operator is added to avoid the following error:
  // "ResizeObserver loop limit exceeded thrown"
  // This error means that ResizeObserver was not able to deliver all observations within
  // a single animation frame. This happens if a change detection is run inside the subscriber.
  private _onChange: Observable<ZoomLevel> = this.resizeSubject.pipe(debounceTime(10));

  constructor(@Inject(DOCUMENT) private document: Document) {
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

    if (newResponsiveBreakpoint?.zoomLevel === this.lastZoomLevel) {
      return;
    }

    this.lastZoomLevel = newResponsiveBreakpoint?.zoomLevel;
    this.resizeSubject.next(this.lastZoomLevel as ZoomLevel);
  }
}
