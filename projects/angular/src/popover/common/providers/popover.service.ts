/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { preventArrowKeyScroll } from '../../../utils/focus/key-focus/util';
import { ClrPopoverPosition, ClrPopoverType } from '../utils/popover-positions';

// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)

@Injectable()
export class ClrPopoverService {
  scrollToClose = false;
  anchorElementRef: ElementRef<HTMLElement>;
  closeButtonRef: ElementRef;
  panelClass: string[] = [];
  popoverType: ClrPopoverType = ClrPopoverType.DEFAULT;
  availablePositions: ConnectedPosition[] = [];
  overlayRef: OverlayRef;
  lastKeydownEvent: KeyboardEvent;
  private _position = ClrPopoverPosition.BOTTOM_LEFT;
  private _open = false;
  private _openChange = new Subject<boolean>();
  private _openEvent: Event;
  private _openEventChange = new Subject<Event>();
  private _positionChange = new Subject<string>();
  private _positionUpdate = new Subject<boolean>();
  private _popoverVisible = new Subject<boolean>();

  get position(): ClrPopoverPosition {
    return this._position;
  }
  set position(position: ClrPopoverPosition) {
    this._position = position;

    this._positionChange.next(position);
  }

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

  updatePositonChange(): Observable<boolean> {
    return this._positionUpdate.asObservable();
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

  updatePositionEmit(status: boolean) {
    this._positionUpdate.next(status);
  }

  focusCloseButton(): void {
    this.closeButtonRef.nativeElement?.focus();
  }

  focusAnchor(): void {
    this.anchorElementRef?.nativeElement?.focus({ preventScroll: true });
  }
}
