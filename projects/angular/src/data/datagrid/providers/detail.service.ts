/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ModalStackService } from '../../../modal/modal-stack.service';

@Injectable()
export class DetailService {
  private toggleState = false;
  private _state = new BehaviorSubject<boolean | null>(this.toggleState);
  private cache: any;
  private _enabled = false;
  private button: HTMLButtonElement;
  id: string;

  get enabled(): boolean {
    return this._enabled;
  }
  set enabled(state: boolean) {
    this._enabled = state;
  }

  get stateChange(): Observable<boolean | null> {
    return this._state.asObservable();
  }

  constructor(private readonly modalStackService: ModalStackService) {}

  close() {
    this.toggleState = false;
    this._state.next(this.toggleState);
    this.modalStackService.trackModalClose(this);
    if (this.button) {
      this.button.focus();
      this.button = null;
    }
  }

  open(item: any, button?: HTMLButtonElement) {
    this.cache = item;
    this.button = button;
    this.toggleState = true;
    this._state.next(this.toggleState);
    this.modalStackService.trackModalOpen(this);
  }

  toggle(item: any, button?: HTMLButtonElement) {
    if (this.isRowOpen(item) || !item) {
      this.close();
    } else {
      this.open(item, button);
    }
  }

  get state() {
    return this.cache;
  }

  isRowOpen(item: any) {
    return !!(this.toggleState && this.cache === item);
  }

  get isOpen() {
    return this.toggleState === true;
  }
}
