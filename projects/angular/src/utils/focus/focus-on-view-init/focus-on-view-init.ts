/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FOCUS_ON_VIEW_INIT } from './focus-on-view-init.provider';

const enum FocusType {
  AlreadyFocused,
  Direct,
  TabIndex,
}

/*  This directive is for guiding the document focus to the newly added content when its view is initialized
    so that assistive technologies can read its content. */
@Directive({
  selector: '[clrFocusOnViewInit]',
})
export class ClrFocusOnViewInit implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(FOCUS_ON_VIEW_INIT) private focusOnViewInit: boolean,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    ngZone: NgZone
  ) {
    this._isEnabled = this.focusOnViewInit;

    ngZone.runOutsideAngular(() =>
      fromEvent(el.nativeElement, 'focusout')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.focusType === FocusType.TabIndex) {
            // manually set attributes and styles should be removed
            this.renderer.removeAttribute(this.el.nativeElement, 'tabindex');
            this.renderer.setStyle(this.el.nativeElement, 'outline', null);
          }
        })
    );
  }

  private focusType: FocusType;

  private _isEnabled: boolean;
  @Input('clrFocusOnViewInit')
  set isEnabled(value: boolean | string) {
    if (this.focusOnViewInit && typeof value === 'boolean') {
      this._isEnabled = value;
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && this._isEnabled) {
      this.focusType = focusElement(this.document, this.renderer, this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

function focusElement(document: Document, renderer: Renderer2, element: HTMLElement) {
  if (document.activeElement === element) {
    return FocusType.AlreadyFocused;
  }

  element.focus();

  if (document.activeElement === element) {
    return FocusType.Direct;
  } else {
    // if it's not directly focused now, it means it was a non-interactive element
    // so we need to give it a tabindex.
    renderer.setAttribute(element, 'tabindex', '-1');
    renderer.setStyle(element, 'outline', 'none');
    element.focus();

    return FocusType.TabIndex;
  }
}
