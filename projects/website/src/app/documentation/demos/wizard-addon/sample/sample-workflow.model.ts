/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Var } from '@clr/addons/var';

import { CreationType } from './steps/creation-type/creation-type.model';
import { DatastoreGridItem, StoragePolicy } from './steps/select-datastore/select-datastore.model';

export class SampleWorkflowModel {
  readonly vcRef: Var<string> = Var.of<string>();
  readonly creationType: Var<CreationType> = Var.of(CreationType.newVM);
  readonly cloneVmId: Var<string> = Var.of();
  readonly cloneVmName: Var<string> = Var.of();
  defaultName: Var<string>;
  readonly name: Var<string> = Var.of<string>();
  readonly computeResourceId: Var<string> = Var.of<string>();
  readonly computeResourceName: Var<string> = Var.of<string>();
  datastores: Var<DatastoreGridItem[]>;
  storagePolicies: Var<StoragePolicy[]>;
  readonly selectedStoragePolicyId: Var<string> = Var.of<string>();
  readonly selectedDatastoreId: Var<string> = Var.of<string>();
}
