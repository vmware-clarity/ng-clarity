/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal, TemplateRef } from '@angular/core';

// Signal-backed like ClrWizardPage, so OnPush views that read a mock page refresh when a spec changes it.
export class MockPage {
  id: string;
  navTitle: TemplateRef<any>;

  private readonly _disabled = signal(false);
  private readonly _current = signal(false);
  private readonly _completed = signal(false);
  private readonly _readyToComplete = signal(false);
  private readonly _hasError = signal(false);

  constructor(pageIndex: number) {
    this.id = 'this-is-my-page-id-' + pageIndex++;
  }

  get disabled(): boolean {
    return this._disabled();
  }
  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  get current(): boolean {
    return this._current();
  }
  set current(value: boolean) {
    this._current.set(value);
  }

  get completed(): boolean {
    return this._completed();
  }
  set completed(value: boolean) {
    this._completed.set(value);
  }

  get readyToComplete(): boolean {
    return this._readyToComplete();
  }
  set readyToComplete(value: boolean) {
    this._readyToComplete.set(value);
  }

  get hasError(): boolean {
    return this._hasError();
  }
  set hasError(value: boolean) {
    this._hasError.set(value);
  }

  reset(): void {
    this.disabled = false;
    this.current = false;
    this.completed = false;
    this.readyToComplete = false;
    this.hasError = false;
  }
}
