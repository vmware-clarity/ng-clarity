/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Mappings, Step, Var } from '@clr/addons/var';
import { delay, Observable, of, tap } from 'rxjs';

import { SampleWorkflowModel } from './sample-workflow.model';
import { CreationTypeComponent } from './steps/creation-type/creation-type.component';
import { CreationType, CreationTypeModel } from './steps/creation-type/creation-type.model';
import { ObjectNameComponent } from './steps/object-name/object-name.component';
import { ObjectNameModel } from './steps/object-name/object-name.model';
import { ReadyToCompleteComponent } from './steps/ready-to-complete/ready-to-complete.component';
import { SelectDatastoreComponent } from './steps/select-datastore/select-datastore.component';
import {
  DatastoreGridItem,
  SelectDatastoreModel,
  StoragePolicy,
} from './steps/select-datastore/select-datastore.model';
import { SelectHostComponent } from './steps/select-host/select-host.component';
import { SelectHostModel } from './steps/select-host/select-host.model';
import { SelectVmComponent } from './steps/select-vm/select-vm.component';
import { SelectVmModel } from './steps/select-vm/select-vm.model';

@Injectable()
export class SampleWorkflowService {
  initModel(vcMoRef: string): SampleWorkflowModel {
    const wizardModel = new SampleWorkflowModel();
    wizardModel.vcRef.value = vcMoRef;
    wizardModel.defaultName = Var.from().by(() => this.retrieveDefaultVmName());
    wizardModel.storagePolicies = Var.from(wizardModel.vcRef)
      .withEagerEval()
      .by(() => this.retrieveStoragePolicies());
    wizardModel.datastores = Var.from(wizardModel.computeResourceId).by((computeResId: string) =>
      this.retrieveDatastores(computeResId)
    );
    return wizardModel;
  }

  buildWizardSteps(workflowModel: SampleWorkflowModel, showSummaryPage = true): Step[] {
    return [
      {
        title: 'Select Creation Type',
        description: 'How would you like to create a virtual machine?',
        navTitle: 'Creation Type',
        componentClass: CreationTypeComponent,
        model: new CreationTypeModel(),
      } as Step,
      {
        title: 'Select Virtual Machine',
        description: 'Select a virtual machine to clone',
        componentClass: SelectVmComponent,
        model: new SelectVmModel(),
        isRelevant: Var.from(workflowModel.creationType).by((creationType: CreationType) =>
          of(creationType === CreationType.cloneExistingVM)
        ),
        mappings: new Mappings<SelectVmModel, SampleWorkflowModel>()
          .mapStepProp('vmId')
          .to('cloneVmId')
          .mapStepProp('vmName')
          .to('cloneVmName'),
        summary: showSummaryPage
          ? (builder, model: SelectVmModel) => {
              builder.property('Clone existing VM', model.vmName.value);
              return builder.build();
            }
          : undefined,
      } as Step,
      ...this.buildCommonSteps(showSummaryPage),
    ];
  }

  buildStepperSteps(workflowModel: SampleWorkflowModel): Step[] {
    return [
      ...this.buildWizardSteps(workflowModel),
      {
        title: 'Ready to Complete',
        description: 'Review your selections before finishing the wizard',
        componentClass: ReadyToCompleteComponent,
      } as Step,
    ];
  }

  apply(): Observable<unknown> {
    return of(true);
  }

  private buildCommonSteps(showSummary = true): Step[] {
    return [
      {
        title: 'Virtual Machine Name',
        description: 'Specify a unique name',
        navTitle: 'Name',
        componentClass: ObjectNameComponent,
        model: new ObjectNameModel(),
        summary: showSummary
          ? (builder, model: ObjectNameModel) => {
              builder.property('VM Name', model.name.value);
              return builder.build();
            }
          : undefined,
      } as Step,
      {
        title: 'Select a Compute Resource',
        description: 'Select the destination compute resource',
        navTitle: 'Compute Resource',
        componentClass: SelectHostComponent,
        model: new SelectHostModel(),
        summary: showSummary
          ? (builder, model: SelectHostModel) => {
              builder.property('Resource Name', model.computeResourceName.value);
              return builder.build();
            }
          : undefined,
      } as Step,
      {
        title: 'Select Storage',
        description: 'Select the storage for the configuration and disk files',
        navTitle: 'Storage',
        componentClass: SelectDatastoreComponent,
        model: new SelectDatastoreModel(),
        summary: showSummary
          ? (builder, model: SelectDatastoreModel) => {
              builder
                .property('Storage Policy', model.selectedPolicyName)
                .property('Datastore', model.selectedDatastoreName);
              return builder.build();
            }
          : undefined,
      } as Step,
    ];
  }

  private retrieveDefaultVmName(): Observable<string> {
    return of('New Virtual Machine').pipe(delay(1000));
  }

  private retrieveStoragePolicies(): Observable<StoragePolicy[]> {
    return of<StoragePolicy[]>([
      { id: 'policy-0', name: 'Datastore Default' },
      { id: 'policy-1', name: 'High Performance Policy' },
      { id: 'policy-2', name: 'No Requirements Policy' },
    ]).pipe(delay(10000));
  }

  private retrieveDatastores(computeResourceId: string): Observable<DatastoreGridItem[]> {
    const clusterDatastores: DatastoreGridItem[] = [
      { id: 'datastore-1', name: 'NFS Datastore 1', capacity: '10 TB', provisioned: '0.5 TB', free: '9.5 TB' },
      { id: 'datastore-2', name: 'NFS Datastore 2', capacity: '10 TB', provisioned: '3.8 TB', free: '6.2 TB' },
    ];
    const map: Record<string, DatastoreGridItem[]> = {
      'host-80': [
        { id: 'datastore-80', name: 'Local Datastore 80', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
        ...clusterDatastores,
      ],
      'host-81': [
        { id: 'datastore-81', name: 'Local Datastore 81', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
        ...clusterDatastores,
      ],
      'host-82': [
        { id: 'datastore-82', name: 'Local Datastore 82', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
        ...clusterDatastores,
      ],
      'host-83': [
        { id: 'datastore-83', name: 'Local Datastore 83', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
        ...clusterDatastores,
      ],
      'host-98': [
        { id: 'datastore-98', name: 'Local Datastore 98', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
      ],
      'host-103': [
        { id: 'datastore-103', name: 'Local Datastore 103', capacity: '1 TB', provisioned: '243 GB', free: '800 GB' },
      ],
      'cluster-01': clusterDatastores,
    };
    return of(map[computeResourceId] || []).pipe(
      delay(1000),
      tap(() => console.log('Datastores loaded for', computeResourceId))
    );
  }
}
