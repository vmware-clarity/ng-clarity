/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { ModalStackService } from '@clr/angular/modal';
import { BehaviorSubject, Observable } from 'rxjs';

export const MAX_DETAIL_WIDTH = 100;
export const DEFAULT_DETAIL_WIDTH = 66;
export const MIN_DETAIL_WIDTH = 0;

@Injectable()
export class DetailService {
  id: string;
  detailWidth = DEFAULT_DETAIL_WIDTH;

  private registeredPanes = 0;

  private preventScroll = false;
  private toggleState = false;
  private cache: any;
  private button: HTMLButtonElement;
  private readonly _enabled = signal(false);
  private _state = new BehaviorSubject<boolean | null>(this.toggleState);

  constructor(private readonly modalStackService: ModalStackService) {}

  /**
   * Whether the datagrid has a detail pane (`*clrIfDetail`). Signal-backed, so views reading it are
   * refreshed when a detail pane is added or removed after they were checked.
   */
  get enabled(): boolean {
    return this._enabled();
  }
  set enabled(state: boolean) {
    this._enabled.set(state);
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

  /** Register a detail outlet and release it exactly once when its directive is destroyed. */
  register(): () => void {
    this.registeredPanes++;
    this.enabled = true;
    let registered = true;
    return () => {
      if (!registered) {
        return;
      }
      registered = false;
      if (--this.registeredPanes === 0) {
        this.enabled = false;
        if (this.isOpen) {
          this.close();
        }
        this.cache = undefined;
        this.button = null;
      }
    };
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
