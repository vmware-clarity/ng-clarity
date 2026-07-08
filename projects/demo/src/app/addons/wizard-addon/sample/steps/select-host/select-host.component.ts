/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { OnStepValidate, StepModelHolder } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';
import { map, Observable, of } from 'rxjs';

import { SelectHostModel } from './select-host.model';

@Component({
  selector: 'clr-demo-select-host',
  standalone: true,
  imports: [ClarityModule],
  templateUrl: 'select-host.component.html',
})
export class SelectHostComponent implements StepModelHolder, OnStepValidate {
  model: SelectHostModel;

  selectNode(resourceId: string, resourceName: string): void {
    this.model.computeResourceId.value = resourceId;
    this.model.computeResourceName.value = resourceName;
    this.model.validationState.warnings = [];
    this.model.validationState.errors = [];
    if (resourceId === 'host-80') {
      this.model.validationState.warnings.push('Selected host has some warnings');
    }
  }

  isNodeSelected(resourceId: string): boolean {
    return this.model.computeResourceId.value === resourceId;
  }

  validate(): Observable<boolean> {
    this.model.validationState.errors = [];
    if (!this.model.computeResourceId.value) {
      this.model.validationState.errors.push('Select a valid compute resource');
      return of(false);
    }
    return of(false).pipe(
      map(() => {
        if (this.model.computeResourceId.value === 'host-81') {
          this.model.validationState.errors.push('Selected host is not available');
        }
        return this.model.validationState.isValid();
      })
    );
  }
}
