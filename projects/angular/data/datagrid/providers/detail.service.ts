/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { ModalStackService } from '@clr/angular/modal';
import { BehaviorSubject, Observable } from 'rxjs';

export const MAX_DETAIL_WIDTH = 100;
export const DEFAULT_DETAIL_WIDTH = 66;
export const MIN_DETAIL_WIDTH = 0;

@Injectable()
export class DetailService implements OnDestroy {
  id: string;
  detailWidth = DEFAULT_DETAIL_WIDTH;

  private preventScroll = false;
  private toggleState = false;
  private cache: any;
  private button: HTMLButtonElement;
  private _enabled = false;
  private _state = new BehaviorSubject<boolean | null>(this.toggleState);

  constructor(private readonly modalStackService: ModalStackService) {}

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(state: boolean) {
    this._enabled = state;
  }

  get preventFocusScroll(): boolean {
    return this.preventScroll;
  }
  set preventFocusScroll(preventScroll: boolean) {
    this.preventScroll = preventScroll;
  }

  get state() {
    return this.cache;
  }

  get stateChange(): Observable<boolean | null> {
    return this._state.asObservable();
  }

  get isOpen() {
    return this.toggleState === true;
  }

  /**
   * The detail pane registers itself in the application-wide modal stack when it opens, and only
   * close() takes it back out. A datagrid destroyed with its detail pane open - navigating away
   * from the page, for instance - would otherwise leave this service in that stack forever, and
   * with it the cached row and the detail button element it holds, which is a detached DOM node by
   * then. This does not call close(), because returning focus to a button that is on its way out
   * would steal focus from whatever is being navigated to.
   */
  ngOnDestroy() {
    this.modalStackService.trackModalClose(this);
    this.toggleState = false;
    this.button = null;
    this.cache = null;
  }

  open(item: any, button?: HTMLButtonElement) {
    this.cache = item;
    this.button = button;
    this.toggleState = true;
    this._state.next(this.toggleState);
    this.modalStackService.trackModalOpen(this);
  }

  close() {
    this.toggleState = false;
    this.returnFocus();
    this._state.next(this.toggleState);
    this.modalStackService.trackModalClose(this);
  }

  returnFocus() {
    if (this.button) {
      this.button.focus({ preventScroll: this.preventFocusScroll });
      this.button = null;
    }
  }

  toggle(item: any, button?: HTMLButtonElement) {
    if (this.isRowOpen(item) || !item) {
      this.close();
    } else {
      this.open(item, button);
    }
  }

  isRowOpen(item: any) {
    return !!(this.toggleState && this.cache === item);
  }
}
