/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { preventArrowKeyScroll } from '../../../utils/focus/key-focus/util';
import { ClrPopoverPosition } from '../utils/popover-positions';

// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)

@Injectable()
export class ClrPopoverService {
  anchorElementRef: ElementRef<HTMLElement>;
  closeButtonRef: ElementRef;
  panelClass: string[] = [];
  private _open = false;
  private _openChange = new Subject<boolean>();
  private _openEvent: Event;
  private _openEventChange = new Subject<Event>();
  private _positionChange = new Subject<string>();
  private _resetPositions = new Subject<void>();
  private _updatePosition = new Subject<void>();
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

  get resetPositionsChange(): Observable<void> {
    return this._resetPositions.asObservable();
  }

  positionChange(position: ClrPopoverPosition) {
    this._positionChange.next(position);
  }

  updatePositionChange(): Observable<void> {
    return this._updatePosition.asObservable();
  }

  getPositionChange(): Observable<string> {
    return this._positionChange.asObservable();
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

  resetPositions() {
    this._resetPositions.next();
  }

  updatePosition() {
    this._updatePosition.next();
  }

  focusCloseButton(): void {
    this.closeButtonRef.nativeElement?.focus();
  }

  focusAnchor(): void {
    this.anchorElementRef?.nativeElement?.focus({ preventScroll: true });
  }
}
