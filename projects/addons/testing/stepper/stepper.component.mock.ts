/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModelChange, Step, WorkflowModel } from '@clr/addons/var';

@Component({
  selector: 'appfx-stepper',
  standalone: false,
  template: '<ng-content></ng-content>',
})
export class MockStepperComponent {
  @Input() steps: Step[];
  @Input() wizardModel: WorkflowModel;
  @Input() loading: boolean;

  @Output() onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
  selector: 'appfx-stepper',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MockStepperStandaloneComponent extends MockStepperComponent {}
