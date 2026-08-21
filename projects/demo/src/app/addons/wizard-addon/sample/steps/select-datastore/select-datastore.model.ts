/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { In, Out, StepModel, StepValidationState, Var } from '@clr/addons/var';

export interface StoragePolicy {
  id: string;
  name: string;
}

export interface DatastoreGridItem {
  id: string;
  name: string;
  capacity: string;
  provisioned: string;
  free: string;
}

export class SelectDatastoreModel implements StepModel {
  loading = false;
  validationState = new StepValidationState();

  @In() storagePolicies: StoragePolicy[];

  @In() datastores: DatastoreGridItem[];

  @In({ optional: true })
  @Out()
  readonly selectedStoragePolicyId: Var<string> = Var.of();

  @In({ optional: true })
  @Out()
  readonly selectedDatastoreId: Var<string> = Var.of();

  selectedPolicyName: string;
  selectedDatastoreNames: DatastoreGridItem[];

  get selectedDatastoreName(): string {
    return this.selectedDatastoreNames?.[0]?.name || '';
  }
}
