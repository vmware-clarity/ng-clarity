/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Step, StepInternal } from '@clr/addons/var';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { StepState } from '../state/stepper-state.service';

export class MockStepperStateService {
  onStepActivated$: Observable<StepState>;

  private panelState$ = new Subject<StepState>();
  private firstStepExpanded = false;
  private lastStepStates: StepState[] = [];

  constructor() {
    this.onStepActivated$ = this.panelState$.pipe(distinctUntilChanged());
  }

  stepActivated(step: Step, expanded: boolean, index: number): void {
    if (!this.firstStepExpanded && !expanded) {
      return;
    }
    this.firstStepExpanded = true;

    if (this.lastStepStates[index] && this.lastStepStates[index].expanded === expanded) {
      return;
    }
    const isStepValid = this.lastStepStates[index] ? this.lastStepStates[index].valid : false;
    this.lastStepStates[index] = {
      step: step,
      expanded: expanded,
      index: index,
      valid: isStepValid,
    };

    if (expanded) {
      this.panelState$.next(this.lastStepStates[index]);
    }
  }

  markStepValid(step: Step, isValid: boolean): void {
    const index = this.lastStepStates.findIndex(stepState => stepState && stepState.step === step);
    this.lastStepStates[index].valid = isValid;
  }

  resetNextStepsValidStates(): void {
    // no reset necessary.
  }

  getIndexOfFirstIncompleteStep(): number {
    return (
      this.lastStepStates.find(
        stepState => stepState && !(<StepInternal>stepState.step).isSkipped && !stepState.valid
      ) as StepState
    ).index;
  }

  getFirstIncompleteStepContainerIndex(): number {
    return this.lastStepStates
      .filter(stepState => stepState && !(<StepInternal>stepState.step).isSkipped)
      .findIndex(stepState => !stepState.valid);
  }

  areAllStepsCompleted(): boolean {
    return false;
  }

  isStepActivated(): boolean {
    return true;
  }

  isFirstVisibleStep(): boolean {
    return true;
  }
}
