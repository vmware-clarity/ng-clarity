/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkflowStrings } from '@clr/addons/workflow/strings';

import { ActivationError } from './interfaces';

@Component({
  selector: 'appfx-error',
  standalone: false,
  templateUrl: 'error.component.html',
  styleUrls: ['error.component.scss'],
})
export class ErrorComponent {
  @Input() error?: ActivationError;

  @Output() onRetry: EventEmitter<any> = new EventEmitter();

  constructor(public workflowStrings: WorkflowStrings) {}

  retry() {
    this.onRetry.emit();
  }
}
