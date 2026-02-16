/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { State, states } from './states';

const basicHTML = `
<clr-combobox-container>
  <label>My State</label>
  <clr-combobox
    [(ngModel)]="selection"
    name="myState"
    clrMulti="true"
    required
    [clrLoading]="loading"
    (clrInputChange)="fetchStates($event)"
    (clrOpenChange)="$event ? fetchStates() : null"
  >
    <ng-container *clrOptionSelected="let selected">
      <cds-icon shape="home" role="img" aria-label="welcome home"></cds-icon>
      {{ selected?.name }}
    </ng-container>
    <clr-options>
      <clr-option
        *clrOptionItems="let state of $any(asyncStates$ | async); field: 'name'"
        [clrValue]="state"
      >
        <cds-icon shape="world" role="img" aria-label="World is turning"></cds-icon>
        {{ state.name }}
        <cds-icon shape="sun" role="img" aria-label="Sun is shining"></cds-icon>
      </clr-option>
    </clr-options>
  </clr-combobox>
  <clr-control-helper>Helper text</clr-control-helper>
  <clr-control-error>There was an error</clr-control-error>
</clr-combobox-container>
`;

const basicComponent = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrComboboxModule, ClrIconModule, ClrFormsModule, ClrLoadingModule } from '@clr/angular';
import { timer, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { states, State } from './states';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [
    CommonModule,
    FormsModule,
    ClrIconModule,
    ClrFormsModule,
    ClrLoadingModule,
    ClrComboboxModule,
  ],
})
export class ExampleComponent {
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
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};
/* eslint-enable @typescript-eslint/no-var-requires */

@Component({
  selector: 'clr-combobox-async-demo',
  templateUrl: './combobox-async.demo.html',
  standalone: false,
})
export class ComboboxAsyncDemo {
  basicHTML = basicHTML;
  basicComponent = basicComponent;
  additionalFiles = additionalFiles;

  loading = false;
  selection: State[] = [];
  asyncStates$: Observable<State[]> | undefined;

  STATES_SERVICE = {
    getStates: (filterString: string) =>
      timer(1500).pipe(map(() => states.filter(s => s.name.toLowerCase().indexOf(filterString.toLowerCase()) > -1))),
  };

  fetchStates(filter = '') {
    this.loading = true;
    this.asyncStates$ = this.STATES_SERVICE.getStates(filter).pipe(tap(() => (this.loading = false)));
  }
}
