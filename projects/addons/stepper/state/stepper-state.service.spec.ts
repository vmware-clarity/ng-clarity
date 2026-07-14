/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fakeAsync, tick } from '@angular/core/testing';
import { Step, StepInternal } from '@clr/addons/var';
import { take } from 'rxjs/operators';

import { SummaryService } from '../summary/summary.service';
import { StepperStateService, StepState } from './stepper-state.service';

describe('StepperStateService', () => {
  describe('#constructor', () => {
    it('to define onStepActivated observable', () => {
      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      expect(stepperStateService.onStepActivated$).toBeDefined();
    });
  });

  describe('#stepActivated', () => {
    describe('WHEN called with expanded step which was previously collapsed', () => {
      it('THEN onStepActivated$ to emit the new step state for the step', fakeAsync(() => {
        const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
        const expectedStepState: StepState = {
          step: <Step>{},
          expanded: true,
          index: 2,
          valid: false,
        };
        let resultStepState: StepState | undefined;
        stepperStateService.onStepActivated$.subscribe((stepState: StepState) => {
          resultStepState = stepState;
        });

        stepperStateService.stepActivated(<Step>{}, true, 2);

        tick(50);
        expect(resultStepState).toEqual(expectedStepState);
      }));
    });

    describe('WHEN called with collapsed step', () => {
      it('THEN onStepActivated$ to does not emit the new step state for the step', fakeAsync(() => {
        const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
        let resultStepState: StepState | undefined;
        stepperStateService.onStepActivated$.subscribe((stepState: StepState) => {
          resultStepState = stepState;
        });

        stepperStateService.stepActivated(<Step>{}, false, 2);

        tick(50);
        expect(resultStepState).toBeUndefined();
      }));
    });
  });

  describe('#markStepValid', () => {
    it('sets the valid flag in the step state according to the passed state', fakeAsync(function () {
      let stepState1: StepState;
      let stepState2: StepState;

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.onStepActivated$.pipe(take(1)).subscribe((stepState: StepState) => {
        stepState1 = stepState;
      });
      stepperStateService.stepActivated(<Step>{}, true, 0);
      tick(50);
      stepperStateService.onStepActivated$.pipe(take(1)).subscribe((stepState: StepState) => {
        stepState2 = stepState;
      });
      stepperStateService.stepActivated(<Step>{}, false, 1);
      tick(50);
      stepperStateService.stepActivated(<Step>{}, true, 1);
      tick(50);

      stepperStateService.markStepValid(stepState1!.step, true);
      expect(stepState1!.valid).toBeTruthy();
      stepperStateService.markStepValid(stepState2!.step, false);
      expect(stepState2!.valid).toBeFalsy();
    }));
  });

  const panelStateProperty = 'panelState$';
  describe('#resetNextStepsValidStates', () => {
    it('sets the valid states of all steps after the step provided as argument as invalid', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <Step>{};
      const step2: Step = <Step>{};
      const step3: Step = <Step>{};

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, false, 0);
      stepperStateService.stepActivated(step1, true, 1);
      stepperStateService.stepActivated(step2, false, 2);
      stepperStateService.stepActivated(step3, false, 3);
      tick(50);

      const panelStates = stepperStateService[panelStateProperty].value;
      panelStates[0].valid = true;
      panelStates[1].valid = true;
      panelStates[2].valid = true;
      panelStates[3].valid = true;

      stepperStateService.resetNextStepsValidStates(step1);

      expect(panelStates[0].valid).toBeTruthy();
      expect(panelStates[1].valid).toBeTruthy();
      expect(panelStates[2].valid).toBeFalsy();
      expect(panelStates[3].valid).toBeFalsy();
    }));
  });

  describe('#getIndexOfFirstIncompleteStep', () => {
    it('returns the index of first step that is not skipped and not valid', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <StepInternal>{ isSkipped: true };
      const step2: Step = <Step>{};
      const step3: Step = <Step>{};

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, false, 0);
      stepperStateService.stepActivated(step1, true, 1);
      stepperStateService.stepActivated(step2, false, 2);
      stepperStateService.stepActivated(step3, false, 3);
      tick(50);

      const panelStates = stepperStateService[panelStateProperty].value;
      panelStates[0].valid = true;
      panelStates[1].valid = false;
      panelStates[2].valid = false;
      panelStates[3].valid = true;

      const indexOfFirstIncompleteStep = stepperStateService.getIndexOfFirstIncompleteStep();
      expect(indexOfFirstIncompleteStep).toEqual(2);
    }));

    it('returns the correct index of the last not skipped step when all are completed', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <Step>{};
      const step2: Step = <StepInternal>{ isSkipped: true };

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, false, 0);
      stepperStateService.stepActivated(step1, true, 1);
      stepperStateService.stepActivated(step2, false, 2);

      const panelStates = stepperStateService[panelStateProperty].value;
      panelStates[0].valid = true;
      panelStates[1].valid = true;
      panelStates[2].valid = true;

      const indexOfFirstIncompleteStep = stepperStateService.getIndexOfFirstIncompleteStep();
      expect(indexOfFirstIncompleteStep).toEqual(1);
    }));
  });

  describe('#getFirstIncompleteStepContainerIndex', () => {
    it('omits the skipped steps when determining the first invalid step', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <StepInternal>{ isSkipped: true };
      const step2: Step = <StepInternal>{ isSkipped: true };
      const step3: Step = <Step>{};
      const step4: Step = <Step>{};

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, true, 0);
      stepperStateService.stepActivated(step1, false, 1);
      stepperStateService.stepActivated(step2, false, 2);
      stepperStateService.stepActivated(step3, false, 3);
      stepperStateService.stepActivated(step4, false, 4);
      tick(50);

      const panelStates = stepperStateService[panelStateProperty].value;
      panelStates[0].valid = true;
      panelStates[1].valid = true;
      panelStates[2].valid = false;
      panelStates[3].valid = false;
      panelStates[4].valid = false;

      let firstIncompleteStepContainerIndex = stepperStateService.getFirstIncompleteStepContainerIndex();
      expect(firstIncompleteStepContainerIndex).toEqual(1);

      // when all steps are valid return the index of the last one:
      panelStates[0].valid = true;
      panelStates[1].valid = true;
      panelStates[2].valid = true;
      panelStates[3].valid = true;
      panelStates[4].valid = true;

      firstIncompleteStepContainerIndex = stepperStateService.getFirstIncompleteStepContainerIndex();
      expect(firstIncompleteStepContainerIndex).toEqual(2);
    }));
  });

  describe('#areAllStepsCompleted', () => {
    it('determines correctly whether all non-skip steps are valid', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <StepInternal>{ isSkipped: true };
      const step2: Step = <Step>{};

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, false, 0);
      stepperStateService.stepActivated(step1, true, 1);
      stepperStateService.stepActivated(step2, false, 2);

      const panelStates = stepperStateService[panelStateProperty].value;
      panelStates[0].valid = true;
      panelStates[1].valid = false;
      panelStates[2].valid = false;

      let areAllStepsCompleted = stepperStateService.areAllStepsCompleted();
      expect(areAllStepsCompleted).toBeFalsy();

      panelStates[2].valid = true;

      areAllStepsCompleted = stepperStateService.areAllStepsCompleted();
      expect(areAllStepsCompleted).toBeTruthy();
    }));
  });

  describe('#isStepActivated', () => {
    it('determines correctly if step is activated or not based on its expanded state', fakeAsync(function () {
      const step0: Step = <Step>{};
      const step1: Step = <StepInternal>{ isSkipped: true };
      const step2: Step = <Step>{};

      const stepperStateService: StepperStateService = new StepperStateService(new SummaryService());
      stepperStateService.stepActivated(step0, false, 0);
      stepperStateService.stepActivated(step1, true, 1);
      stepperStateService.stepActivated(step2, false, 2);

      const isStep1Activated = stepperStateService.isStepActivated(1);
      expect(isStep1Activated).toBeTruthy();

      const isStep2Activated = stepperStateService.isStepActivated(2);
      expect(isStep2Activated).toBeFalsy();
    }));
  });
});
