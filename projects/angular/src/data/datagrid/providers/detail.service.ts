/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ModalStackService } from '../../../modal/modal-stack.service';

@Injectable()
export class DetailService {
  id: string;

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

  open(item: any, button?: HTMLButtonElement) {
    this.cache = item;
    this.button = button;
    this.toggleState = true;
    this._state.next(this.toggleState);
    this.modalStackService.trackModalOpen(this);
  }

  close() {
    this.toggleState = false;
    this._state.next(this.toggleState);
    this.modalStackService.trackModalClose(this);
    // In the case of browser zoom greater than 250%, the detail pane toggle button is not visible on the page.
    // Wait for the detail pane to close, and return focus to the detail toggle button.
    setTimeout(() => this.returnFocus(), 0);
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
