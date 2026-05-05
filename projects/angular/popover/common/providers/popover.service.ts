/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { ElementRef, Injectable } from '@angular/core';
import { preventArrowKeyScroll } from '@clr/angular/utils';
import { Observable, Subject } from 'rxjs';

import { ClrPopoverPosition } from '../utils/popover-positions';

export interface ClrPopoverPoint {
  x: number;
  y: number;
}

@Injectable()
export class ClrPopoverService {
  pointTargetElement: HTMLElement | undefined;
  origin: FlexibleConnectedPositionStrategyOrigin;
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

  get originElement(): ElementRef<HTMLElement> | null {
    return this.origin instanceof ElementRef ? this.origin : null;
  }

  get originPoint(): ClrPopoverPoint | null {
    return this.origin && 'x' in this.origin && 'y' in this.origin ? (this.origin as ClrPopoverPoint) : null;
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

  /**
   * Opens the popover at a specific screen coordinate.
   * Useful for context menus where the popover should appear at the cursor position.
   */
  openAtPoint(point: ClrPopoverPoint, targetElement?: HTMLElement) {
    if (this._open) {
      this._open = false;
      this._openChange.next(false);
    }

    this.origin = point;
    this.pointTargetElement = targetElement;
    this.open = true;
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

  focusOrigin(): void {
    this.originElement?.nativeElement?.focus({ preventScroll: true });
  }
}
