/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { CloseHandler, Step } from '@clr/addons/var';
import { AppfxWizardModule } from '@clr/addons/wizard';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
  DemoWorkflowModel,
  NameModel,
  StorageModel,
  WizardStep1Component,
  WizardStep2Component,
} from './wizard-steps';

@Component({
  selector: 'clr-wizard-addon-basic-example',
  templateUrl: './basic.example.html',
  imports: [AppfxWizardModule],
})
export class WizardAddonBasicExample {
  isOpen = false;
  model = new DemoWorkflowModel();
  steps: Step[] = [
    {
      title: 'Virtual Machine Name',
      description: 'Specify a unique name for your virtual machine',
      componentClass: WizardStep1Component,
      model: new NameModel(),
      summary: (builder, m: NameModel) => {
        builder.property('VM Name', m.name.value);
        return builder.build();
      },
    },
    {
      title: 'Select Storage',
      description: 'Choose where to store the virtual machine files',
      componentClass: WizardStep2Component,
      model: new StorageModel(),
    },
  ];

  closeHandler: CloseHandler = {
    onSubmit: (): Observable<void> => of(undefined).pipe(delay(500)),
  };

  open() {
    this.model = new DemoWorkflowModel();
    this.isOpen = true;
  }
}
