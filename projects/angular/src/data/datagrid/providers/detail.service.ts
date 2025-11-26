/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ModalStackService } from '@clr/angular/src/modal';
import { BehaviorSubject, Observable } from 'rxjs';

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
