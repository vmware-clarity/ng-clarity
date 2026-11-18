/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverrideClrStringsDirective } from '@clr/addons/a11y';
import {
  CancelableStepValidation,
  In,
  Mappings,
  ModelChanges,
  OnStepActivate,
  OnStepValidate,
  Out,
  RelevanceService,
  Spinner,
  Step,
  StepContainer,
  StepInternal,
  StepModel,
  StepModelHolder,
  ValidationBanner,
  ValidationBannerInternal,
  Var,
  WorkflowModelManager,
} from '@clr/addons/var';
import { WorkflowStrings } from '@clr/addons/workflow/strings';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { ClrStepperModule, ClrStepperPanel, StepperPanelModel, StepperService } from '@clr/angular/stepper';
import { Observable, of, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import type { Mock } from 'vitest';

import { MockStepperStateService } from './mock/stepper.mock';
import { StepperStateService } from './state/stepper-state.service';
import { StepperComponent } from './stepper.component';
import { SummaryService } from './summary/summary.service';

type Spy<T extends (...args: any[]) => any = (...args: any[]) => any> = Mock<T>;

class MockWizardModel {
  contextObjectId: Var<string> = Var.of('vm-11');
  newContextObjectId: Var<string> = Var.of('host-11');
}

class MockStep1Model implements StepModel {
  loading = false;
  activateCallsCount = 0;
  validateCallsCount = 0;
  readyToComplete: boolean;
  changes: ModelChanges;

  @In() vmId?: string;

  @Out() newVmId: Var<string> = Var.of();
}

@Component({
  selector: 'mock-step-1-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div>Step 1 Content</div>`,
})
class MockStep1Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  model: MockStep1Model;

  activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(true);
  }
}

class MockStep2Model {
  loading = false;
  activateCallsCount = 0;
  validateCallsCount = 0;
  nextValidationResult = false;
  changes: ModelChanges;

  @In() newVmId: string;
}

@Component({
  selector: 'mock-step-2-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div>Step 2 Content</div>`,
})
class MockStep2Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  model: MockStep2Model;

  activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(this.model.nextValidationResult);
  }
}

class MockStep3Model {
  loading = false;
  activateCallsCount = 0;
  validateCallsCount = 0;
  changes: ModelChanges;
}

@Component({
  selector: 'mock-step-3-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div>Step 3 Content</div>`,
})
class MockStep3Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  model: MockStep3Model;

  activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(true);
  }
}

class MockStep4Model implements StepModel {
  validation$ = new Subject<boolean>();

  cancelableValidation: CancelableStepValidation | undefined = undefined;

  canceledValidationCallsCount = 0;
}

@Component({
  selector: 'mock-step-4-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<div>Step 4 Content</div>`,
})
class MockStep4Component implements StepModelHolder {
  model: MockStep4Model;

  validate(): Observable<boolean> {
    this.model.cancelableValidation = {
      cancelButtonLabel: 'cancel-validation',
      cancelValidation: () => {
        this.model.canceledValidationCallsCount++;
        this.model.validation$.next(false);
      },
    };

    return this.model.validation$.asObservable();
  }
}

function isLoadingIndicatorVisible(wizardElement: DebugElement): boolean {
  return !!wizardElement.query(By.css('appfx-spinner'));
}

interface ThisTest {
  fixture: ComponentFixture<StepperComponent>;
  component: StepperComponent;
  wizardModel: MockWizardModel;
  strings: WorkflowStrings;
  step1: StepInternal;
  step1Model: MockStep1Model;
  skippedStep: StepInternal;
  step2: StepInternal;
  step2Model: MockStep2Model;
  step3: StepInternal;
  step3Model: MockStep3Model;
  step4: StepInternal;
  step4Model: MockStep4Model;
  stateService: StepperStateService;
  stepperService: StepperService;
  workflowModelManager: WorkflowModelManager;
  relevanceService: RelevanceService;
}

@NgModule({
  declarations: [MockStep1Component, MockStep2Component, MockStep3Component, MockStep4Component],
})
class AppfxStepperTestModule {}

describe('Stepper', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  let queryNextButton: () => any;
  let queryStepperButtons: () => DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrSpinnerModule, ClrStepperModule, FormsModule, ReactiveFormsModule, AppfxStepperTestModule],
      declarations: [
        StepperComponent,
        StepContainer,
        ValidationBanner,
        ValidationBannerInternal,
        Spinner,
        OverrideClrStringsDirective,
      ],
      providers: [
        ChangeDetectorRef,
        UntypedFormBuilder,
        WorkflowModelManager,
        RelevanceService,
        SummaryService,
        WorkflowStrings,
      ],
    });

    TestBed.overrideComponent(StepperComponent, {
      set: {
        providers: [
          {
            provide: StepperStateService,
            useClass: MockStepperStateService,
          },
        ],
      },
    });

    testContext.fixture = TestBed.createComponent(StepperComponent);
    testContext.component = testContext.fixture.componentInstance;

    testContext.wizardModel = new MockWizardModel();
    testContext.step1Model = new MockStep1Model();
    testContext.step2Model = new MockStep2Model();
    testContext.step3Model = new MockStep3Model();
    testContext.step4Model = new MockStep4Model();

    testContext.step1 = {
      title: 'Page 1 Title',
      navTitle: 'Page 1 Nav',
      componentClass: MockStep1Component,
      model: testContext.step1Model,
      mappings: new Mappings<MockStep1Model, MockWizardModel>()
        .mapStepProp('vmId')
        .to('contextObjectId')
        .mapStepProp('newVmId')
        .to('newContextObjectId'),
    };

    testContext.skippedStep = {
      title: 'Skipped Page Title',
      navTitle: 'Skipped Page Nav',
      componentClass: MockStep3Component,
      model: new MockStep3Model(),
      isSkipped: true,
    };

    testContext.step2 = {
      title: 'Page 2 Title',
      navTitle: 'Page 2 Nav',
      componentClass: MockStep2Component,
      model: testContext.step2Model,
      mappings: new Mappings<MockStep2Model, MockWizardModel>().mapStepProp('newVmId').to('newContextObjectId'),
    };
    testContext.step3 = {
      title: 'Page 3 Title',
      navTitle: 'Page 3 Nav',
      componentClass: MockStep3Component,
      model: testContext.step3Model,
    };
    testContext.step4 = {
      title: 'Page 4 Title',
      navTitle: 'Page 4 Nav',
      componentClass: MockStep4Component,
      model: testContext.step4Model,
    };

    testContext.component.wizardModel = testContext.wizardModel;
    testContext.component.steps = [testContext.step1, testContext.skippedStep, testContext.step2, testContext.step3];

    testContext.stateService = testContext.component.stateService;
    testContext.workflowModelManager = testContext.component['modelMgr'];
    testContext.relevanceService = testContext.component['relevanceService'];

    queryNextButton = () => testContext.fixture.debugElement.nativeElement.querySelector('.clr-step-button');
    queryStepperButtons = () => testContext.fixture.debugElement.queryAll(By.css('button.clr-stepper-header-button'));
  });

  describe('when the stepper is rendered', () => {
    it('THEN displays the loading indicator when needed to do so', () => {
      testContext.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);

      testContext.component.loading = true;
      testContext.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

      testContext.component.loading = false;
      testContext.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);

      // Show indicator when the page model reports loading
      testContext.step1Model.loading = true;
      testContext.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

      // Hide indicator
      testContext.step1Model.loading = false;
      testContext.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);
    });

    it('THEN first step is set as initial and activate function are triggered', () => {
      vi.spyOn(testContext.stateService, 'stepActivated');
      vi.spyOn(testContext.component, 'onStepActivated');
      vi.spyOn(testContext.workflowModelManager, 'injectPropertiesToPendingStep');

      testContext.fixture.detectChanges();

      expect(testContext.component.initialStep).toEqual('step0');
      expect(testContext.stateService.stepActivated).toHaveBeenCalled();
      expect(testContext.component.onStepActivated).toHaveBeenCalled();
      expect(testContext.workflowModelManager.injectPropertiesToPendingStep).toHaveBeenCalled();
      expect(testContext.step1Model.activateCallsCount).toEqual(1);
    });

    it('THEN a form is created with a formgroup for each step', () => {
      testContext.fixture.detectChanges();

      testContext.component.steps.forEach((step: Step, index: number) => {
        expect(testContext.component.form.controls['step' + index]).toBeDefined();
      });
    });

    it('THEN on model change the steps are invalidated', () => {
      testContext.fixture.detectChanges();

      vi.spyOn(testContext.stateService, 'resetNextStepsValidStates');
      vi.spyOn(testContext.component['stepperService'], 'resetPanels');
      vi.spyOn(testContext.component['stepperService'], 'overrideInitialPanel');

      testContext.step1Model.newVmId.value = 'vm-12';

      expect(testContext.stateService.resetNextStepsValidStates).toHaveBeenCalledWith(testContext.step1);
      expect(testContext.component['stepperService'].resetPanels).toHaveBeenCalled();
      expect(testContext.component['stepperService'].overrideInitialPanel).toHaveBeenCalledWith(
        testContext.component.initialStep
      );
    });

    it('WHEN StepModel.readyToComplete=false, Next button must be disabled', () => {
      testContext.fixture.detectChanges();
      testContext.step1Model.readyToComplete = false;
      testContext.fixture.detectChanges();
      expect(testContext.component.isNextButtonDisabled(testContext.step1)).toEqual(true);
    });

    it('WHEN StepModel.readyToComplete=true, Next button must be enabled', () => {
      testContext.fixture.detectChanges();
      testContext.step1Model.readyToComplete = true;
      testContext.fixture.detectChanges();
      expect(testContext.component.isNextButtonDisabled(testContext.step1)).toEqual(false);
    });

    describe('WHEN next is clicked', () => {
      it('WHEN the step has cancelable validation, the cancel validation button is rendered', () => {
        testContext.component.steps = [testContext.step4, testContext.step1];
        testContext.fixture.detectChanges();

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();
        testContext.fixture.detectChanges();

        expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(true);

        expect(
          testContext.fixture.debugElement
            .query(By.css('appfx-spinner button.btn'))
            .nativeElement.innerText.toLowerCase()
        ).toEqual(testContext.step4Model.cancelableValidation?.cancelButtonLabel);

        testContext.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.click();
        testContext.fixture.detectChanges();

        expect(isLoadingIndicatorVisible(testContext.fixture.debugElement)).toEqual(false);
        expect(testContext.step4Model.canceledValidationCallsCount).toEqual(1);
      });

      it('THEN the step is validated, step model properties ejected and stepper service next triggered', () => {
        testContext.fixture.detectChanges();

        vi.spyOn(testContext.stateService, 'markStepValid');
        vi.spyOn(testContext.workflowModelManager, 'ejectPropertiesFromCurrentStep');
        vi.spyOn(testContext.relevanceService, 'checkComplete$');
        vi.spyOn(testContext.component.form.controls['step0'], 'setErrors');

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        testContext.fixture.detectChanges();

        expect(testContext.step1Model.validateCallsCount).toEqual(1);
        expect(testContext.stateService.markStepValid).toHaveBeenCalledWith(testContext.step1, true);
        expect(testContext.workflowModelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(testContext.step1);
        expect(testContext.relevanceService.checkComplete$).toHaveBeenCalled();
        expect(testContext.component.form.controls['step0'].setErrors).toHaveBeenCalledWith(null);

        vi.spyOn(testContext.component.form.controls['step2'], 'setErrors');

        const nextButtonStep2 = queryNextButton();
        nextButtonStep2.click();

        testContext.fixture.detectChanges();

        expect(testContext.stateService.markStepValid).toHaveBeenCalledTimes(2);
        expect(testContext.workflowModelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledTimes(1);
        expect(testContext.relevanceService.checkComplete$).toHaveBeenCalledTimes(1);

        expect(testContext.step2Model.validateCallsCount).toEqual(1);
        expect(vi.mocked(testContext.stateService.markStepValid as Spy).mock.calls[1]).toEqual([
          testContext.step2,
          false,
        ]);
        expect(testContext.component.form.controls['step2'].setErrors).toHaveBeenCalledWith(expect.anything());
      });

      it('THEN next step is activated', () => {
        testContext.fixture.detectChanges();

        const indexOfFirstIncompleteStep = 2;
        vi.spyOn(testContext.stateService, 'getIndexOfFirstIncompleteStep').mockReturnValue(indexOfFirstIncompleteStep);
        vi.spyOn(testContext.component['stepperService'], 'overrideInitialPanel');
        vi.spyOn(testContext.component, 'onStepActivated');

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        testContext.fixture.detectChanges();

        expect(testContext.stateService.getIndexOfFirstIncompleteStep).toHaveBeenCalled();
        expect(testContext.component['stepperService'].overrideInitialPanel).toHaveBeenCalledWith(
          'step' + indexOfFirstIncompleteStep
        );
        expect(testContext.component.onStepActivated).toHaveBeenCalledWith(testContext.step2);
        expect(testContext.component.initialStep).toEqual('step2');
      });
    });

    describe('WHEN finish is clicked', () => {
      it('WHEN last step is not valid THEN onFormSubmit and onFinish are not invoked', fakeAsync(() => {
        // Add only steps that return valid states
        testContext.component.steps = [testContext.step1, testContext.step2];
        testContext.fixture.detectChanges();

        const nextButton = queryNextButton();
        nextButton.click();
        flush();
        testContext.fixture.detectChanges();

        vi.spyOn(testContext.component, 'onFormSubmit');
        vi.spyOn(testContext.stateService, 'areAllStepsCompleted');
        vi.spyOn(testContext.component.onFinish, 'emit');

        const finishButton = queryNextButton();
        finishButton.click();
        testContext.fixture.detectChanges();

        expect(testContext.component.onFormSubmit).not.toHaveBeenCalled();
        expect(testContext.component.onFinish.emit).not.toHaveBeenCalled();
        flush();
      }));

      it('WHEN all steps are valid THEN onFormSubmit and onFinish are invoked', fakeAsync(() => {
        // Add only steps that return valid states
        testContext.component.steps = [testContext.step1, testContext.step3];
        testContext.fixture.detectChanges();

        const nextButton = queryNextButton();
        nextButton.click();
        flush();
        testContext.fixture.detectChanges();

        vi.spyOn(testContext.component, 'onFormSubmit');
        vi.spyOn(testContext.stateService, 'areAllStepsCompleted').mockReturnValue(true);
        vi.spyOn(testContext.component.onFinish, 'emit');

        const finishButton = queryNextButton();
        finishButton.click();
        flush();
        testContext.fixture.detectChanges();

        expect(testContext.component.onFormSubmit).toHaveBeenCalled();
        expect(testContext.component.onFinish.emit).toHaveBeenCalled();
      }));
    });

    describe('#onFormSubmit', () => {
      it('WHEN stateService reports that not all steps are completed THEN onFinish is not emitted', () => {
        testContext.fixture.detectChanges();

        vi.spyOn(testContext.stateService, 'areAllStepsCompleted').mockReturnValue(false);
        vi.spyOn(testContext.component.onFinish, 'emit');

        testContext.component.onFormSubmit();

        expect(testContext.component.onFinish.emit).not.toHaveBeenCalled();
      });
    });

    describe('WHEN navigating using step header', () => {
      beforeEach(fakeAsync(() => {
        testContext.fixture.detectChanges();

        // go to step2 using next
        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();
        flush();
        testContext.fixture.detectChanges();

        // go to step3 using next
        testContext.step2Model.nextValidationResult = true;
        const nextButtonStep2 = queryNextButton();

        nextButtonStep2.click();
        flush();
        testContext.fixture.detectChanges();
      }));

      it('WHEN click on completed step from incomplete step, should not call validate method on incomplete step', () => {
        expect(testContext.step3Model.activateCallsCount).toBe(1);

        // go back to step1 by click step1 header
        const steps = queryStepperButtons();
        steps[0].nativeElement.click();
        testContext.fixture.detectChanges();
        expect(testContext.step3Model.validateCallsCount).toEqual(0);
      });

      it('WHEN click on completed from completed, should call validate method on current step', () => {
        // go back to step1 by click step1 header
        const steps = queryStepperButtons();
        steps[0].nativeElement.click(); // go to step 1 first
        testContext.fixture.detectChanges();
        expect(testContext.step1Model.validateCallsCount).toEqual(1);

        steps[1].nativeElement.click(); // go to step 2 from step 1
        testContext.fixture.detectChanges();
        expect(testContext.step1Model.validateCallsCount).toEqual(2);
      });

      it('WHEN already completed panel gets expanded, collapsed and then expanded again, it remains open', fakeAsync(() => {
        const toggleStepState = (index: number) => {
          steps[index].nativeElement.click();
          testContext.fixture.detectChanges();
        };

        // go back to step1 by click step1 header
        const steps = queryStepperButtons();

        // Go back to step1
        toggleStepState(0);
        // Collapse step1
        toggleStepState(0);
        // Expand again step1
        toggleStepState(0);

        const clrStepperPanels = testContext.fixture.debugElement.queryAll(By.directive(ClrStepperPanel));

        const stepperPanel: ClrStepperPanel = clrStepperPanels[0].componentInstance;
        let panelOpen = false;

        expect(stepperPanel.id).toEqual('step0');

        stepperPanel.panel.pipe(first()).subscribe((stepperPanel: StepperPanelModel) => {
          panelOpen = stepperPanel.open;
        });
        flush();

        expect(panelOpen).toBeTruthy();
        expect(testContext.component.initialStep).toEqual('step0');
      }));

      it('WHEN already completed panel gets expanded, last opened step remains incomplete', () => {
        const steps = queryStepperButtons();

        const toggleStepState = (index: number) => {
          steps[index].nativeElement.click();
          testContext.fixture.detectChanges();
        };

        // Go back to step1
        toggleStepState(0);

        const clrStepperPanels = testContext.fixture.debugElement.queryAll(By.directive(ClrStepperPanel));

        // Make sure that clicking on the first panel does not put the last active
        // panel in Complete state.
        const stepperPanel3: ClrStepperPanel = clrStepperPanels[2].componentInstance;
        expect(stepperPanel3.id).toEqual('step3');

        let panel3Model: StepperPanelModel | undefined;
        stepperPanel3.panel.pipe(first()).subscribe((stepperPanel: StepperPanelModel) => {
          panel3Model = stepperPanel;
        });

        expect(panel3Model).toBeDefined();
        expect(panel3Model?.id).toEqual('step3');
        expect(panel3Model?.status + '').toEqual('inactive');
      });
    });

    describe('Back and Cancel Buttons', () => {
      let onCancelSpy: Mock;
      let queryBackButton: () => DebugElement;
      let queryCancelButton: () => DebugElement;

      beforeEach(() => {
        onCancelSpy = vi.spyOn(testContext.component.onCancel, 'emit').mockImplementation(() => undefined);
        queryBackButton = () => testContext.fixture.debugElement.query(By.css('button[clrStepButton="previous"]'));
        queryCancelButton = () =>
          testContext.fixture.debugElement.query(By.css('button.btn-link:not([clrStepButton])'));
      });

      it('THEN buttons are not rendered by default', () => {
        testContext.fixture.detectChanges();
        expect(queryBackButton()).toBeNull();
        expect(queryCancelButton()).toBeNull();
      });

      it('THEN Cancel button is visible on all steps when showCancelButton is true and emits event', () => {
        testContext.component.showCancelButton = true;
        testContext.fixture.detectChanges();

        const cancelBtn = queryCancelButton();
        expect(cancelBtn).not.toBeNull();
        expect(cancelBtn.nativeElement.innerText.trim().toLowerCase()).toEqual(
          testContext.component.workflowStrings.cancel.toLowerCase()
        );

        cancelBtn.nativeElement.click();
        expect(onCancelSpy).toHaveBeenCalled();
      });

      it('THEN Back button is not visible on the first visible step even if showBackButton is true', () => {
        testContext.component.showBackButton = true;
        testContext.component.steps = [
          testContext.skippedStep,
          testContext.step1,
          testContext.step2,
          testContext.step3,
        ];
        testContext.fixture.detectChanges();

        expect(testContext.component.initialStep).toEqual('step1');
        expect(queryBackButton()).toBeNull();
      });

      it('THEN Back button is visible on the second visible step and has the correct style', fakeAsync(() => {
        testContext.component.showBackButton = true;
        vi.spyOn(testContext.stateService, 'isFirstVisibleStep').mockImplementation((index: number) => {
          return index === 0;
        });
        testContext.fixture.detectChanges();

        // Use the existing "Next" button logic to move to Step 2
        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        // Check that the step is now moved
        flush();
        testContext.fixture.detectChanges();
        testContext.fixture.detectChanges();
        expect(testContext.component.initialStep).toEqual('step2');

        const backBtn = queryBackButton();
        expect(backBtn).not.toBeNull();

        expect(backBtn.attributes['clrStepButton']).toEqual('previous');
        expect(backBtn.nativeElement.innerText.trim().toLowerCase()).toEqual(
          testContext.component.workflowStrings.back.toLowerCase()
        );
      }));

      it('THEN Next button should only have btn-primary class when usePrimaryNextButton is true', () => {
        testContext.component.usePrimaryNextButton = true;
        testContext.fixture.detectChanges();

        const nextButton = queryNextButton();
        // Check if the native element contains the class
        expect(nextButton.classList.contains('btn-primary')).toBeTruthy();

        testContext.component.usePrimaryNextButton = false;
        testContext.fixture.detectChanges();
        expect(nextButton.classList.contains('btn-primary')).toBeFalsy();
      });
    });
  });
});
