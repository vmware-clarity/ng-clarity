/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnStepActivate, OnStepValidate, StepModelHolder } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';
import { delay, filter, first, interval, map, Observable, of, race, Subject, tap } from 'rxjs';

import { ObjectNameModel } from './object-name.model';

@Component({
  selector: 'clr-demo-object-name',
  standalone: true,
  imports: [ClarityModule, FormsModule],
  templateUrl: 'object-name.component.html',
})
export class ObjectNameComponent implements StepModelHolder, OnStepActivate, OnStepValidate {
  model: ObjectNameModel;

  activate(): void {
    if (!this.model.name.value && this.model.defaultName) {
      this.model.name.value = this.model.defaultName;
    }
  }

  validate(): Observable<boolean> {
    this.model.validationState.errors = [];

    const cancelValidation$ = new Subject<boolean>();
    this.model.cancelableValidation = {
      cancelButtonLabel: 'Cancel name validation',
      cancelValidation: () => cancelValidation$.next(false),
    };
    this.model.progressStatus = 'Validating VM name: 0%';

    const name: string = this.model.name.value;
    if (!name || name.length < 3 || name.length > 20) {
      this.model.validationState.errors.push('Name must be between 3 and 20 characters.');
      return of(false);
    }

    return race(
      cancelValidation$,
      of(true).pipe(delay(3500)),
      interval(500).pipe(
        tap(v => {
          this.model.progressStatus = `Validating VM name: ${(v + 1) * 12}%`;
        }),
        filter(() => false),
        map(() => true)
      )
    ).pipe(first());
  }
}
