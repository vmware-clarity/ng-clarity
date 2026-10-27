/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrIcon, ClrLoadingModule } from '@clr/angular';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { State, states } from './states';

@Component({
  selector: 'clr-combobox-async-example',
  templateUrl: './async.example.html',
  imports: [AsyncPipe, FormsModule, ClrComboboxModule, ClrIcon, ClrLoadingModule],
})
export class ComboboxAsyncExample {
  loading = false;
  selection: State[] = [];
  asyncStates$: Observable<State[]> | undefined;

  STATES_SERVICE = {
    getStates: (filterString: string) =>
      timer(1500).pipe(
        map(() => states.filter(s => s.name.toLowerCase().indexOf(filterString.toLowerCase()) > -1))
      ),
  };

  fetchStates(filter = '') {
    this.loading = true;
    this.asyncStates$ = this.STATES_SERVICE.getStates(filter).pipe(tap(() => (this.loading = false)));
  }
}
