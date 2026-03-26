/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrComboboxModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrLoadingModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { State, states } from './states';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

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
      <clr-icon shape="home" role="img" aria-label="welcome home"></clr-icon>
      {{ selected?.name }}
    </ng-container>
    <clr-options>
      <clr-option
        *clrOptionItems="let state of $any(asyncStates$ | async); field: 'name'"
        [clrValue]="state"
      >
        <clr-icon shape="world" role="img" aria-label="World is turning"></clr-icon>
        {{ state.name }}
        <clr-icon shape="sun" role="img" aria-label="Sun is shining"></clr-icon>
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
import { timer, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { states, State } from './states';
import { ClrComboboxModule, ClrFormsModule, ClrIcon, ClrLoadingModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [CommonModule, FormsModule, ClrIcon, ClrFormsModule, ClrLoadingModule, ClrComboboxModule],
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

const additionalFiles = {
  'states.ts': require('!raw-loader!./states.ts').default,
};

@Component({
  selector: 'clr-combobox-async-demo',
  templateUrl: './combobox-async.demo.html',
  imports: [
    ClrComboboxModule,
    ClrCommonFormsModule,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    FormsModule,
    ClrLoadingModule,
    ClrIcon,
    ClrIconModule,
    StackblitzExampleComponent,
    AsyncPipe,
  ],
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
