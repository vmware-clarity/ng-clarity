/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModelChanges, OnStepActivate, OnStepValidate, StepModelHolder } from '@clr/addons/var';
import { ClarityModule } from '@clr/angular';
import { delay, Observable, of } from 'rxjs';

import { DatastoreGridItem, SelectDatastoreModel, StoragePolicy } from './select-datastore.model';

@Component({
  selector: 'clr-demo-select-datastore',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: 'select-datastore.component.html',
  styleUrl: 'select-datastore.component.scss',
})
export class SelectDatastoreComponent implements StepModelHolder, OnStepActivate, OnStepValidate {
  model: SelectDatastoreModel;
  selectedPolicy: StoragePolicy;
  selectedDatastores: DatastoreGridItem[] = [];

  activate(stepModelChanges: ModelChanges): void {
    this.preselectStoragePolicy();
    this.preselectDatastore(stepModelChanges);
  }

  validate(): Observable<boolean> {
    this.model.validationState.errors = [];
    if (this.selectedDatastores.length === 0) {
      this.model.validationState.errors.push('You must select a datastore');
      this.model.selectedDatastoreNames = [];
      return of(false);
    }
    this.model.selectedDatastoreNames = this.selectedDatastores;
    this.model.selectedPolicyName = this.selectedPolicy.name;
    return of(true).pipe(delay(1000));
  }

  selectPolicy(policy: StoragePolicy): void {
    this.selectedPolicy = policy;
    this.model.selectedStoragePolicyId.value = policy.id;
  }

  onSelectDatastore(): void {
    if (this.selectedDatastores.length > 0) {
      this.model.validationState.errors = [];
      this.model.selectedDatastoreId.value = this.selectedDatastores[0].id;
    }
  }

  private preselectStoragePolicy(): void {
    if (this.selectedPolicy === undefined && this.model.storagePolicies?.length) {
      const match = this.model.selectedStoragePolicyId.value
        ? this.model.storagePolicies.find(p => p.id === this.model.selectedStoragePolicyId.value)
        : undefined;
      this.selectPolicy(match || this.model.storagePolicies[0]);
    }
  }

  private preselectDatastore(stepModelChanges: ModelChanges): void {
    if (stepModelChanges['datastores']) {
      if (stepModelChanges['selectedDatastoreId']) {
        if (this.model.selectedDatastoreId.value && this.model.datastores?.length) {
          this.selectedDatastores = this.model.datastores.filter(d => d.id === this.model.selectedDatastoreId.value);
        }
      } else {
        this.selectedDatastores = [];
      }
    }
  }
}
