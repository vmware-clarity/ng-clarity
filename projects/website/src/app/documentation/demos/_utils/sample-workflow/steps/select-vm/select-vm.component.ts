/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { OnStepValidate, StepModelHolder } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';
import { Observable, of } from 'rxjs';

import { SelectVmModel } from './select-vm.model';

@Component({
  selector: 'clr-demo-select-vm',
  standalone: true,
  imports: [ClarityModule],
  templateUrl: 'select-vm.component.html',
})
export class SelectVmComponent implements StepModelHolder, OnStepValidate {
  model: SelectVmModel;

  selectNode(resourceId: string, resourceName: string): void {
    this.model.vmId.value = resourceId;
    this.model.vmName.value = resourceName;
    this.model.validationState.errors = [];
  }

  isNodeSelected(resourceId: string): boolean {
    return this.model.vmId.value === resourceId;
  }

  validate(): Observable<boolean> {
    if (!this.model.vmId.value) {
      this.model.validationState.errors = ['You must select a virtual machine'];
      return of(false);
    }
    return of(true);
  }
}
