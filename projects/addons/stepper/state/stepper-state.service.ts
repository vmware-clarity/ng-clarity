/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Step, StepInternal } from '@clr/addons/var';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import { SummaryService } from '../summary/summary.service';

/**
 * ClrStepper component has very limited API. It does not provide public information
 * about the expanded state of the step panels. Also it does not provide straight forward
 * API for notification when a panel get expanded.
 * This class is responsible for exposing the state of Clarity stepper component.
 * It monitors the current state of all panels. When a panel is expanded,
 * {@link onStepActivated$} observable emits.
 */
@Injectable()
export class StepperStateService {
  /**
   * Observable that emits when the user expands a ClrStepper panel.
   */
  onStepActivated$: Observable<StepState>;

  /**
   * Current state of all panels.
   */
  private panelState$ = new BehaviorSubject<StepState[]>([]);

  /**
   * Panel state on the previous user interaction.
   */
  private lastExpandedState: StepState[] = [];

  constructor(private summaryService: SummaryService) {
    this.onStepActivated$ = this.initOnStepActivated$();
  }

  /**
   * Must be invoked when {@link ClrAccordionPanel#panelOpenChange} EventEmitter emits.
   * `panelOpenChange` emits when a panel changes its opened state.
   * One would expect this listener to be invoked once per panel transition (current panel
   * is closed and the next is opened). Unfortunately this is not the case. The listener
   * is invoked every time for all panels on every transition and sometimes even multiple times
   * for one and the same panel just for a single transition.
   * The panels states are pushed to {@link panelState$} subject, that is debounced.
   *
   * @param step Step, rendered by the Clarity stepper
   * @param expanded Expanded state of the step
   * @param index Step index (different than the panel index, as some steps might be skipped)
   */
  stepActivated(step: Step, expanded: boolean, index: number): void {
    const expandedState = this.panelState$.value;
    if (expandedState[index] && expandedState[index].expanded === expanded) {
      // Current and previous expanded state is the same. Do nothing.
      return;
    }

    const isStepValid = expandedState[index] ? expandedState[index].valid : false;
    // console.log(`Step ${name} expanded: ${expanded} index: ${index}`);
    expandedState[index] = {
      step: step,
      expanded: expanded,
      index: index,
      valid: isStepValid,
    };
    this.panelState$.next(expandedState);
  }

  /**
   * Marks a step as valid or not depending on the passed state.
   * @param {Step} step Step, which has be marked as valid
   * @param {boolean} isValid The valid state of the step
   */
  markStepValid(step: Step, isValid: boolean): void {
    const stepState = this.panelState$.value.find((panelState: StepState) => panelState && panelState.step === step);
    if (stepState) {
      stepState.valid = isValid;
    }
  }

  /**
   * Reset the valid states of the next steps
   * @param {Step} step Step after which all next steps to be reset
   */
  resetNextStepsValidStates(step: Step): void {
    const stepStateIndex = this.panelState$.value.findIndex(
      currentStepState => currentStepState && currentStepState.step === step
    );
    this.panelState$.value.forEach(currentStepState => {
      if (currentStepState && currentStepState.index > stepStateIndex) {
        currentStepState.valid = false;
        (<StepInternal>currentStepState.step).initialDescription = this.summaryService.getDescription(
          currentStepState.step
        );
      }
    });
  }

  /**
   * Finds the index of the first step in the list which is not skipped and not-valid/incomplete.
   * This method always considers the last not skipped step in the stepper as incomplete.
   * @returns {number} The index of the first incomplete step or the index of the last step if all are completed.
   */
  getIndexOfFirstIncompleteStep(): number {
    const notValidStep = this.panelState$.value.find(
      stepState => stepState && !(<StepInternal>stepState.step).isSkipped && !stepState.valid
    );
    if (notValidStep) {
      return notValidStep.index;
    } else {
      // If all steps are valid then return the last valid step as incomplete.
      const validSteps = this.panelState$.value.filter(
        stepState => stepState && !(<StepInternal>stepState.step).isSkipped && stepState.valid
      );
      return validSteps.length ? validSteps[validSteps.length - 1].index : 0;
    }
  }

  /**
   * Finds the index of the first visible step container which is not-valid/incomplete.
   * This method always considers the last visible step in the stepper as incomplete.
   *
   * Note that since skipped steps are not rendered there are no step containers for those.
   * E.g if we have the following steps:
   * 0 - step 1, valid
   * 1 - step 2, valid & skipped,
   * 2 - step 3, invalid
   * The method will return 1 because step 2 will not be rendered at all and we will have only
   * two step containers.
   *
   * @returns {number} The index of the first incomplete step container or the index of the
   * last one if all are completed.
   */
  getFirstIncompleteStepContainerIndex(): number {
    // filter out all skipped steps as they are not rendered.
    const visibleSteps = this.panelState$.value.filter(
      stepState => stepState && !(<StepInternal>stepState.step).isSkipped
    );

    const firstInvalidStepIndex = visibleSteps.findIndex(stepState => !stepState.valid);
    if (firstInvalidStepIndex >= 0) {
      return firstInvalidStepIndex;
    }

    return visibleSteps.length ? visibleSteps.length - 1 : 0;
  }

  /**
   * Checks if all steps are in completed state.
   * @returns {boolean} True if all steps are completed, False otherwise.
   */
  areAllStepsCompleted(): boolean {
    return this.panelState$.value.every(
      stepState => stepState && ((<StepInternal>stepState.step).isSkipped || stepState.valid)
    );
  }

  /**
   * Method to find out if the step at a given index is expanded or not.
   * List of step states are retrieved and based on the index; 'expanded'
   * property lets us know if the step is currently open or not.
   * @param {number} index of the step
   * @returns {boolean}
   */
  isStepActivated(index: number): boolean {
    const panelState = this.panelState$.value;
    if (panelState[index]) {
      return panelState[index].expanded;
    } else {
      return true;
    }
  }

  /**
   * Determines if a step at a specific index is the first visible step in the provided list.
   * @param index The index to check.
   * @param steps The list of internal steps to evaluate for skipped status.
   * @returns True if the index is the first non-skipped step, false otherwise.
   */
  isFirstVisibleStep(index: number, steps: StepInternal[]): boolean {
    const firstVisible = steps.findIndex(s => !s.isSkipped);
    return index === firstVisible;
  }

  private initOnStepActivated$(): Observable<StepState> {
    return <Observable<StepState>>this.panelState$.pipe(
      debounceTime(50),
      map((currentState: StepState[]) => {
        // Find a step that is now expanded and was previously collapsed.
        const expandedStep = currentState.find(
          (currExpanded: StepState, index: number) =>
            // current state is expanded
            currExpanded &&
            currExpanded.expanded &&
            // AND previous state was collapsed or it is a newly added panel
            (!this.lastExpandedState[index] || !this.lastExpandedState[index].expanded)
        );

        this.lastExpandedState = currentState.concat();

        return expandedStep;
      }),
      filter((stepState: StepState | undefined) => !!stepState)
    );
  }
}

export interface StepState {
  step: Step;
  expanded: boolean;
  index: number;
  valid?: boolean;
}
