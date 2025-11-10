/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ElementRef, Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { preventArrowKeyScroll } from '../../../utils/focus/key-focus/util';
import { ClrPopoverType } from '../utils/popover-positions';

// Popovers might need to ignore click events on an element
// (eg: popover opens on focus on an input field. Clicks should be ignored in this case)

@Injectable()
export class ClrPopoverService {
  outsideClickClose = true;
  scrollToClose = false;
  anchorElementRef: ElementRef<HTMLElement>;
  closeButtonRef: ElementRef;
  contentRef: ElementRef;
  templateRef: TemplateRef<any>;
  defaultPosition: string;
  panelClass: string[] = [];
  popoverType: ClrPopoverType = ClrPopoverType.DEFAULT;
  availablePositions: ConnectedPosition[] = [];
  hasBackdrop: false;
  overlayRef: OverlayRef;
  overlay: Overlay;
  noFocus: boolean;
  private _position: string;
  private _open = false;
  private _openChange = new Subject<boolean>();
  private _openEvent: Event;
  private _openEventChange = new Subject<Event>();
  private _positionChange = new Subject<string>();
  private _popoverAligned = new Subject<HTMLElement>();
  private _popoverVisible = new Subject<boolean>();

  get position(): string {
    return this._position;
  }
  set position(position: string) {
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

  get popoverAligned(): Observable<HTMLElement> {
    return this._popoverAligned.asObservable();
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

  popoverAlignedEmit(popoverNode: HTMLElement) {
    this._popoverAligned.next(popoverNode);
  }

  setCloseFocus(): void {
    this.closeButtonRef.nativeElement?.focus();
  }

  setOpenedButtonFocus(): void {
    if (this.noFocus) {
      return;
    }

    this.anchorElementRef?.nativeElement?.focus();
  }
}
