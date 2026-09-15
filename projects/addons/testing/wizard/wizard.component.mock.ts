/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModelChange, Step, WorkflowModel } from '@clr/addons/var';
import { Reason } from '@clr/addons/wizard';

@Component({
  selector: 'appfx-wizard',
  standalone: false,
  template: '',
})
export class MockAppfxWizardComponent {
  @Input() title: string;
  @Input() pages: Step[];
  @Input() wizardModel: WorkflowModel;
  @Input() loading: boolean;
  @Input() size: string;
  @Input() opened: boolean;

  @Output() openedChange = new EventEmitter<boolean>();
  @Output() onModelChange: EventEmitter<ModelChange[]> = new EventEmitter<ModelChange[]>();
  @Output() onFinish: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<Reason> = new EventEmitter<Reason>();
}

@Component({
  selector: 'appfx-wizard',
  standalone: true,
  template: '',
})
export class MockWizardStandaloneComponent extends MockAppfxWizardComponent {}
