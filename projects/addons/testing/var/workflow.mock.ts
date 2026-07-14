/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OnStepActivate, OnStepValidate, StepModel, StepValidationState } from '@clr/addons/var';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'appfx-mock-page-page',
  standalone: false,
  template: '<div>{{ model.mockPropertyValue }}</div>',
})
export class MockStepComponent implements OnStepValidate, OnStepActivate {
  model: MockStepModel;

  activate() {
    this.model.isActivated = true;
  }

  validate(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.model.isValidated = true;
      })
    );
  }
}

@Component({
  selector: 'appfx-invalid-mock-page-page',
  standalone: false,
  template: '<div></div>',
})
export class InvalidMockComponent extends MockStepComponent {
  override validate(): Observable<boolean> {
    return of(false).pipe(
      tap(() => {
        this.model.isValidated = true;
      })
    );
  }
}

export class MockStepModel implements StepModel {
  isActivated = false;
  isValidated = false;
  readyToComplete: boolean;

  validationState: StepValidationState = new StepValidationState();

  constructor(public mockPropertyValue: string) {}
}

/** Simple mock of {@link WorkflowConfigurationService} used by workflow-dependent tests. */
export class MockWorkflowConfigurationService {
  private debugValue = false;

  get debug(): boolean {
    return this.debugValue;
  }

  set debug(newValue: boolean) {
    this.debugValue = newValue;
  }
}

@NgModule({
  imports: [NoopAnimationsModule],
  declarations: [InvalidMockComponent, MockStepComponent],
})
export class MockWorkflowTestModule {}
