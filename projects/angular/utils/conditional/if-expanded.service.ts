/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, signal } from '@angular/core';
import { ClrLoadingState, LoadingListener } from '@clr/angular/utils/loading';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class IfExpandService implements LoadingListener {
  protected _expandChange = new Subject<boolean>();

  // State is held in signals so that any view reading it through the getters below is refreshed by Angular
  // when it changes, including when it changes after that view was checked (no manual change detection needed).
  private readonly _expandableSignal = signal(0);
  private readonly _hasExpandTemplateSignal = signal(false);
  private readonly _loadingSignal = signal(false);
  private readonly _expandedSignal = signal(false);

  get expandable(): number {
    return this._expandableSignal();
  }
  set expandable(value: number) {
    this._expandableSignal.set(value);
  }

  get hasExpandTemplate(): boolean {
    return this._hasExpandTemplateSignal();
  }
  set hasExpandTemplate(value: boolean) {
    this._hasExpandTemplateSignal.set(value);
  }

  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    value = !!value;
    if (value !== this._loading) {
      this._loading = value;
    }
  }

  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    value = !!value;
    if (value !== this._expanded) {
      this._expanded = value;
      this._expandChange.next(value);
    }
  }

  get expandChange(): Observable<boolean> {
    return this._expandChange.asObservable();
  }

  /**
   * Raw loading state, kept as a protected accessor for subclasses. Backed by a signal.
   */
  protected get _loading(): boolean {
    return this._loadingSignal();
  }
  protected set _loading(value: boolean) {
    this._loadingSignal.set(value);
  }

  /**
   * Raw expanded state, kept as a protected accessor for subclasses (e.g. `DatagridIfExpandService`).
   * Backed by a signal.
   */
  protected get _expanded(): boolean {
    return this._expandedSignal();
  }
  protected set _expanded(value: boolean) {
    this._expandedSignal.set(value);
  }

  toggle() {
    this.expanded = !this._expanded;
  }

  loadingStateChange(state: ClrLoadingState): void {
    switch (state) {
      case ClrLoadingState.LOADING:
        this.loading = true;
        break;
      default:
        this.loading = false;
        break;
    }
  }
}
