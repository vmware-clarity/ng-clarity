/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { preventArrowKeyScroll } from '../../focus/key-focus/util';
import { ClrCDKPopoverPositions } from '../enums/cdk-signpost-position.enum';

// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)

@Injectable()
export class ClrPopoverService {
  outsideClickClose = true;
  scrollToClose = false;
  anchorElementRef: ElementRef;
  closeButtonRef: ElementRef;
  contentRef: ElementRef;
  templateRef: TemplateRef<any>;
  openButtonRef: ElementRef;
  position: string;
  defaultPosition: string;
  panelClass: string;
  popoverPositions: ClrCDKPopoverPositions;
  availablePositions: any;
  private _open = false;
  private _openChange = new Subject<boolean>();
  private _openEvent: Event;
  private _openEventChange = new Subject<Event>();
  private _popoverAligned = new Subject<HTMLElement>();
  private _popoverVisible = new Subject<boolean>();

  get openChange(): Observable<boolean> {
    return this._openChange.asObservable();
  }

  get popoverVisible(): Observable<boolean> {
    return this._popoverVisible.asObservable();
  }

  get openEvent(): Event {
    return this._openEvent;
  }
  set openEvent(event: Event) {
    this._openEvent = event;
    this._openEventChange.next(event);
  }

  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    value = !!value;
    if (this._open !== value) {
      this._open = value;
      this._openChange.next(value);
    }
  }

  // For compatibility with legacy IfOpenService based implementations
  get originalEvent(): Event {
    return this._openEvent;
  }

  get popoverAligned(): Observable<HTMLElement> {
    return this._popoverAligned.asObservable();
  }

  getEventChange(): Observable<Event> {
    return this._openEventChange.asObservable();
  }

  /**
   * Sometimes, we need to remember the event that triggered the toggling to avoid loops.
   * This is for instance the case of components that open on a click, but close on a click outside.
   */
  toggleWithEvent(event: any) {
    preventArrowKeyScroll(event);

    this.openEvent = event;
    this.open = !this.open;
  }

  popoverVisibleEmit(visible: boolean) {
    this._popoverVisible.next(visible);
  }

  popoverAlignedEmit(popoverNode: HTMLElement) {
    this._popoverAligned.next(popoverNode);
  }

  setCloseFocus(): void {
    this.closeButtonRef.nativeElement.focus();
  }

  setOpenedButtonFocus(): void {
    if (this.openButtonRef) {
      this.openButtonRef.nativeElement.focus();
    } else {
      this.anchorElementRef.nativeElement.focus();
    }
  }
}
