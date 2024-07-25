/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { states } from './states';

@Component({
  templateUrl: './combobox.demo.html',
  styles: [],
})
export class ComboboxDemo {
  loading = false;
  open = false;

  states0 = [
    {
      name: 'Alabama',
      abbreviation: 'AL',
    },
    {
      name: 'Alaska',
      abbreviation: 'AK',
    },
    {
      name: 'American Samoa',
      abbreviation: 'AS',
    },
    {
      name: 'Arizona',
      abbreviation: 'AZ',
    },
    {
      name: 'Arkansas',
      abbreviation: 'AR',
    },
  ];

  states = states;

  vertical = {
    one: '3',
    two: '2',
    three: this.states[1],
    four: [this.states[3], this.states[4]],
    five: [this.states[2], this.states[3]],
  };

  horizontal = {
    one: '',
    two: '2',
    three: this.states[1],
    four: [this.states[3], this.states[4]],
    five: [this.states[2], this.states[3]],
  };

  compact = {
    one: '',
    two: '2',
    three: this.states[1],
    four: [this.states[3], this.states[13]],
    five: [this.states[5], this.states[8], this.states[10], this.states[15]],
  };

  validateOnBlur: string;

  asyncStates$: Observable<any>;

  STATES_SERVICE = {
    getStates: (filterString: string) =>
      timer(1500).pipe(
        map(() => this.states.filter(s => s.name.toLowerCase().indexOf(filterString.toLowerCase()) > -1))
      ),
  };

  form = new FormGroup({
    model: new FormControl(this.states[15], Validators.required),
  });

  formOnBlur = new FormGroup({
    model: new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
  });

  private _disabled = false;

  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
      this.form.disable();
      this.formOnBlur.disable();
    } else {
      this.form.enable();
      this.formOnBlur.enable();
    }
  }

  fetchStates(filter = '') {
    this.loading = true;
    this.asyncStates$ = this.STATES_SERVICE.getStates(filter).pipe(tap(() => (this.loading = false)));
  }
}
