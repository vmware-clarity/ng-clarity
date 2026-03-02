/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { ClrComboboxIdentityFunction, ComboboxModel } from '../model/combobox.model';
import { MultiSelectComboboxModel } from '../model/multi-select-combobox.model';

@Injectable()
export class OptionSelectionService<T> {
  loading = false;
  editable = false;
  filtering = true;
  selectionModel: ComboboxModel<T>;
  inputChanged: Observable<string>;

  // Display all options on first open, even if filter text exists.
  // https://github.com/vmware-clarity/ng-clarity/issues/386
  showAllOptions = true;

  private _currentInput = '';
  private _displayField: string;
  private _identityFn: ClrComboboxIdentityFunction<T>;
  private _inputChanged = new BehaviorSubject('');
  private _selectionChanged = new ReplaySubject<ComboboxModel<T>>(1);

  constructor() {
    this.inputChanged = this._inputChanged.asObservable();
  }

  get displayField() {
    return this._displayField;
  }
  set displayField(value: string) {
    this._displayField = value;
    if (this.selectionModel) {
      this.selectionModel.displayField = value;
    }
  }

  get currentInput(): string {
    return this._currentInput;
  }
  set currentInput(input) {
    // clear value in single selection model when input is empty
    if (input === '' && !this.multiselectable) {
      this.setSelectionValue(null);
    }
    this._currentInput = input;
    this._inputChanged.next(input);
  }

  // This observable is for notifying the ClrOption to update its
  // selection by comparing the value
  get selectionChanged(): Observable<ComboboxModel<T>> {
    return this._selectionChanged.asObservable();
  }

  get multiselectable(): boolean {
    return this.selectionModel instanceof MultiSelectComboboxModel;
  }

  get identityFn(): ClrComboboxIdentityFunction<T> {
    return this._identityFn;
  }

  set identityFn(value: ClrComboboxIdentityFunction<T>) {
    this._identityFn = value;
    if (this.selectionModel) {
      this.selectionModel.identityFn = value;
    }
  }

  select(item: T) {
    if (item === null || item === undefined || this.selectionModel.containsItem(item)) {
      return;
    }
    this.selectionModel.select(item);
    this._selectionChanged.next(this.selectionModel);
  }

  toggle(item: T) {
    if (item === null || item === undefined) {
      return;
    }
    if (this.selectionModel.containsItem(item)) {
      this.selectionModel.unselect(item);
    } else {
      this.selectionModel.select(item);
    }
    this._selectionChanged.next(this.selectionModel);
  }

  unselect(item: T) {
    if (item === null || item === undefined || !this.selectionModel.containsItem(item)) {
      return;
    }
    this.selectionModel.unselect(item);
    this._selectionChanged.next(this.selectionModel);
  }

  setSelectionValue(value: T | T[]): void {
    if (!this.selectionModel) {
      return;
    }

    const current = this.selectionModel.model;
    const noChange =
      current === value || (!current && !value) || (this._identityFn && this.valuesEqualByIdentity(current, value));

    if (noChange) {
      return;
    }

    this.selectionModel.model = value;
    this._selectionChanged.next(this.selectionModel);
  }

  parseStringToModel(value: string): T {
    if (this.displayField) {
      return {
        [this.displayField]: value,
      } as T;
    }
    return value as T;
  }

  private valuesEqualByIdentity(current: T | T[], value: T | T[]): boolean {
    if (!current !== !value) {
      return false;
    }
    if (!current && !value) {
      return true;
    }
    const fn = this._identityFn;
    if (this.multiselectable) {
      const cur = current as T[];
      const val = value as T[];
      if (cur.length !== val.length) {
        return false;
      }
      const curIds = cur.map(fn).sort();
      const valIds = val.map(fn).sort();
      return curIds.length === valIds.length && curIds.every((id, i) => id === valIds[i]);
    } else {
      return fn(current as T) === fn(value as T);
    }
  }
}
