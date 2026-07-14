/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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

import { MockStepperStateService } from './mock/stepper.mock';
import { StepperStateService } from './state/stepper-state.service';
import { StepperComponent } from './stepper.component';
import { SummaryService } from './summary/summary.service';
import Spy = jasmine.Spy;

class MockWizardModel {
  public contextObjectId: Var<string> = Var.of('vm-11');
  public newContextObjectId: Var<string> = Var.of('host-11');
}

class MockStep1Model implements StepModel {
  public loading = false;
  public activateCallsCount = 0;
  public validateCallsCount = 0;
  public readyToComplete: boolean;
  public changes: ModelChanges;

  @In()
  public vmId?: string;

  @Out()
  public newVmId: Var<string> = Var.of();
}

@Component({
  selector: 'mock-step-1-component',
  standalone: false,
  template: `<div>Step 1 Content</div>`,
})
class MockStep1Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  public model: MockStep1Model;

  public activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  public validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(true);
  }
}

class MockStep2Model {
  public loading = false;
  public activateCallsCount = 0;
  public validateCallsCount = 0;
  public nextValidationResult = false;
  public changes: ModelChanges;

  @In()
  public newVmId: string;
}

@Component({
  selector: 'mock-step-2-component',
  standalone: false,
  template: `<div>Step 2 Content</div>`,
})
class MockStep2Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  public model: MockStep2Model;

  public activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  public validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(this.model.nextValidationResult);
  }
}

class MockStep3Model {
  public loading = false;
  public activateCallsCount = 0;
  public validateCallsCount = 0;
  public changes: ModelChanges;
}

@Component({
  selector: 'mock-step-3-component',
  standalone: false,
  template: `<div>Step 3 Content</div>`,
})
class MockStep3Component implements StepModelHolder, OnStepActivate, OnStepValidate {
  public model: MockStep3Model;

  public activate(changes: ModelChanges) {
    this.model.activateCallsCount += 1;
    this.model.changes = changes;
  }

  public validate(): Observable<boolean> {
    this.model.validateCallsCount += 1;
    return of(true);
  }
}

class MockStep4Model implements StepModel {
  public validation$ = new Subject<boolean>();

  public cancelableValidation: CancelableStepValidation | undefined = undefined;

  public canceledValidationCallsCount = 0;
}

@Component({
  selector: 'mock-step-4-component',
  standalone: false,
  template: `<div>Step 4 Content</div>`,
})
class MockStep4Component implements StepModelHolder {
  public model: MockStep4Model;

  public validate(): Observable<boolean> {
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
  let queryNextButton: () => any;
  let queryStepperButtons: () => DebugElement[];

  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [
        ClrSpinnerModule,
        ClrStepperModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        AppfxStepperTestModule,
      ],
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

    this.fixture = TestBed.createComponent(StepperComponent);
    this.component = this.fixture.componentInstance;

    this.wizardModel = new MockWizardModel();
    this.step1Model = new MockStep1Model();
    this.step2Model = new MockStep2Model();
    this.step3Model = new MockStep3Model();
    this.step4Model = new MockStep4Model();

    this.step1 = {
      title: 'Page 1 Title',
      navTitle: 'Page 1 Nav',
      componentClass: MockStep1Component,
      model: this.step1Model,
      mappings: new Mappings<MockStep1Model, MockWizardModel>()
        .mapStepProp('vmId')
        .to('contextObjectId')
        .mapStepProp('newVmId')
        .to('newContextObjectId'),
    };

    this.skippedStep = {
      title: 'Skipped Page Title',
      navTitle: 'Skipped Page Nav',
      componentClass: MockStep3Component,
      model: new MockStep3Model(),
      isSkipped: true,
    };

    this.step2 = {
      title: 'Page 2 Title',
      navTitle: 'Page 2 Nav',
      componentClass: MockStep2Component,
      model: this.step2Model,
      mappings: new Mappings<MockStep2Model, MockWizardModel>().mapStepProp('newVmId').to('newContextObjectId'),
    };
    this.step3 = {
      title: 'Page 3 Title',
      navTitle: 'Page 3 Nav',
      componentClass: MockStep3Component,
      model: this.step3Model,
    };
    this.step4 = {
      title: 'Page 4 Title',
      navTitle: 'Page 4 Nav',
      componentClass: MockStep4Component,
      model: this.step4Model,
    };

    this.component.wizardModel = this.wizardModel;
    this.component.steps = [this.step1, this.skippedStep, this.step2, this.step3];

    this.stateService = this.component.stateService;
    this.workflowModelManager = this.component['modelMgr'];
    this.relevanceService = this.component['relevanceService'];

    queryNextButton = () => this.fixture.debugElement.nativeElement.querySelector('.clr-step-button');
    queryStepperButtons = () => this.fixture.debugElement.queryAll(By.css('button.clr-stepper-header-button'));
  });

  describe('when the stepper is rendered', () => {
    it('THEN displays the loading indicator when needed to do so', function (this: ThisTest) {
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);

      this.component.loading = true;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

      this.component.loading = false;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);

      // Show indicator when the page model reports loading
      this.step1Model.loading = true;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

      // Hide indicator
      this.step1Model.loading = false;
      this.fixture.detectChanges();
      expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);
    });

    it('THEN first step is set as initial and activate function are triggered', function (this: ThisTest) {
      spyOn(this.stateService, 'stepActivated').and.callThrough();
      spyOn(this.component, 'onStepActivated').and.callThrough();
      spyOn(this.workflowModelManager, 'injectPropertiesToPendingStep').and.callThrough();

      this.fixture.detectChanges();

      expect(this.component.initialStep).toEqual('step0');
      expect(this.stateService.stepActivated).toHaveBeenCalled();
      expect(this.component.onStepActivated).toHaveBeenCalled();
      expect(this.workflowModelManager.injectPropertiesToPendingStep).toHaveBeenCalled();
      expect(this.step1Model.activateCallsCount).toEqual(1);
    });

    it('THEN a form is created with a formgroup for each step', function (this: ThisTest) {
      this.fixture.detectChanges();

      this.component.steps.forEach((step: Step, index: number) => {
        expect(this.component.form.controls['step' + index]).toBeDefined();
      });
    });

    it('THEN on model change the steps are invalidated', function (this: ThisTest) {
      this.fixture.detectChanges();

      spyOn(this.stateService, 'resetNextStepsValidStates').and.callThrough();
      spyOn(this.component['stepperService'], 'resetPanels').and.callThrough();
      spyOn(this.component['stepperService'], 'overrideInitialPanel').and.callThrough();

      this.step1Model.newVmId.value = 'vm-12';

      expect(this.stateService.resetNextStepsValidStates).toHaveBeenCalledWith(this.step1);
      expect(this.component['stepperService'].resetPanels).toHaveBeenCalled();
      expect(this.component['stepperService'].overrideInitialPanel).toHaveBeenCalledWith(this.component.initialStep);
    });

    it('WHEN StepModel.readyToComplete=false, Next button must be disabled', function (this: ThisTest) {
      this.fixture.detectChanges();
      this.step1Model.readyToComplete = false;
      this.fixture.detectChanges();
      expect(this.component.isNextButtonDisabled(this.step1)).toEqual(true);
    });

    it('WHEN StepModel.readyToComplete=true, Next button must be enabled', function (this: ThisTest) {
      this.fixture.detectChanges();
      this.step1Model.readyToComplete = true;
      this.fixture.detectChanges();
      expect(this.component.isNextButtonDisabled(this.step1)).toEqual(false);
    });

    describe('WHEN next is clicked', () => {
      it('WHEN the step has cancelable validation, the cancel validation button is rendered', function (this: ThisTest) {
        this.component.steps = [this.step4, this.step1];
        this.fixture.detectChanges();

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();
        this.fixture.detectChanges();

        expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(true);

        expect(
          this.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.innerText.toLowerCase()
        ).toEqual(this.step4Model.cancelableValidation?.cancelButtonLabel);

        this.fixture.debugElement.query(By.css('appfx-spinner button.btn')).nativeElement.click();
        this.fixture.detectChanges();

        expect(isLoadingIndicatorVisible(this.fixture.debugElement)).toEqual(false);
        expect(this.step4Model.canceledValidationCallsCount).toEqual(1);
      });

      it('THEN the step is validated, step model properties ejected and stepper service next triggered', function (this: ThisTest) {
        this.fixture.detectChanges();

        spyOn(this.stateService, 'markStepValid').and.callThrough();
        spyOn(this.workflowModelManager, 'ejectPropertiesFromCurrentStep').and.callThrough();
        spyOn(this.relevanceService, 'checkComplete$').and.callThrough();
        spyOn(this.component.form.controls['step0'], 'setErrors').and.callThrough();

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        this.fixture.detectChanges();

        expect(this.step1Model.validateCallsCount).toEqual(1);
        expect(this.stateService.markStepValid).toHaveBeenCalledWith(this.step1, true);
        expect(this.workflowModelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledWith(this.step1);
        expect(this.relevanceService.checkComplete$).toHaveBeenCalled();
        expect(this.component.form.controls['step0'].setErrors).toHaveBeenCalledWith(null);

        spyOn(this.component.form.controls['step2'], 'setErrors').and.callThrough();

        const nextButtonStep2 = queryNextButton();
        nextButtonStep2.click();

        this.fixture.detectChanges();

        expect(this.stateService.markStepValid).toHaveBeenCalledTimes(2);
        expect(this.workflowModelManager.ejectPropertiesFromCurrentStep).toHaveBeenCalledTimes(1);
        expect(this.relevanceService.checkComplete$).toHaveBeenCalledTimes(1);

        expect(this.step2Model.validateCallsCount).toEqual(1);
        expect((this.stateService.markStepValid as Spy).calls.all()[1].args[0]).toEqual(this.step2, false);
        expect(this.component.form.controls['step2'].setErrors).toHaveBeenCalledWith(jasmine.anything());
      });

      it('THEN next step is activated', function (this: ThisTest) {
        this.fixture.detectChanges();

        const indexOfFirstIncompleteStep = 2;
        spyOn(this.stateService, 'getIndexOfFirstIncompleteStep').and.returnValue(indexOfFirstIncompleteStep);
        spyOn(this.component['stepperService'], 'overrideInitialPanel').and.callThrough();
        spyOn(this.component, 'onStepActivated').and.callThrough();

        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        this.fixture.detectChanges();

        expect(this.stateService.getIndexOfFirstIncompleteStep).toHaveBeenCalled();
        expect(this.component['stepperService'].overrideInitialPanel).toHaveBeenCalledWith(
          'step' + indexOfFirstIncompleteStep
        );
        expect(this.component.onStepActivated).toHaveBeenCalledWith(this.step2);
        expect(this.component.initialStep).toEqual('step2');
      });
    });

    describe('WHEN finish is clicked', () => {
      it('WHEN last step is not valid THEN onFormSubmit and onFinish are not invoked', fakeAsync(function (
        this: ThisTest
      ) {
        // Add only steps that return valid states
        this.component.steps = [this.step1, this.step2];
        this.fixture.detectChanges();

        const nextButton = queryNextButton();
        nextButton.click();
        flush();
        this.fixture.detectChanges();

        spyOn(this.component, 'onFormSubmit').and.callThrough();
        spyOn(this.stateService, 'areAllStepsCompleted').and.callThrough();
        spyOn(this.component.onFinish, 'emit').and.callThrough();

        const finishButton = queryNextButton();
        finishButton.click();
        this.fixture.detectChanges();

        expect(this.component.onFormSubmit).not.toHaveBeenCalled();
        expect(this.component.onFinish.emit).not.toHaveBeenCalled();
        flush();
      }));

      it('WHEN all steps are valid THEN onFormSubmit and onFinish are invoked', fakeAsync(function (this: ThisTest) {
        // Add only steps that return valid states
        this.component.steps = [this.step1, this.step3];
        this.fixture.detectChanges();

        const nextButton = queryNextButton();
        nextButton.click();
        flush();
        this.fixture.detectChanges();

        spyOn(this.component, 'onFormSubmit').and.callThrough();
        spyOn(this.stateService, 'areAllStepsCompleted').and.returnValue(true);
        spyOn(this.component.onFinish, 'emit').and.callThrough();

        const finishButton = queryNextButton();
        finishButton.click();
        flush();
        this.fixture.detectChanges();

        expect(this.component.onFormSubmit).toHaveBeenCalled();
        expect(this.component.onFinish.emit).toHaveBeenCalled();
      }));
    });

    describe('#onFormSubmit', () => {
      it('WHEN stateService reports that not all steps are completed THEN onFinish is not emitted', function (this: ThisTest) {
        this.fixture.detectChanges();

        spyOn(this.stateService, 'areAllStepsCompleted').and.returnValue(false);
        spyOn(this.component.onFinish, 'emit').and.callThrough();

        this.component.onFormSubmit();

        expect(this.component.onFinish.emit).not.toHaveBeenCalled();
      });
    });

    describe('WHEN navigating using step header', () => {
      beforeEach(fakeAsync(function (this: ThisTest) {
        this.fixture.detectChanges();

        // go to step2 using next
        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();
        flush();
        this.fixture.detectChanges();

        // go to step3 using next
        this.step2Model.nextValidationResult = true;
        const nextButtonStep2 = queryNextButton();

        nextButtonStep2.click();
        flush();
        this.fixture.detectChanges();
      }));

      it('WHEN click on completed step from incomplete step, should not call validate method on incomplete step', function (this: ThisTest) {
        expect(this.step3Model.activateCallsCount).toBe(1);

        // go back to step1 by click step1 header
        const steps = queryStepperButtons();
        steps[0].nativeElement.click();
        this.fixture.detectChanges();
        expect(this.step3Model.validateCallsCount).toEqual(0);
      });

      it('WHEN click on completed from completed, should call validate method on current step', function (this: ThisTest) {
        // go back to step1 by click step1 header
        const steps = queryStepperButtons();
        steps[0].nativeElement.click(); // go to step 1 first
        this.fixture.detectChanges();
        expect(this.step1Model.validateCallsCount).toEqual(1);

        steps[1].nativeElement.click(); // go to step 2 from step 1
        this.fixture.detectChanges();
        expect(this.step1Model.validateCallsCount).toEqual(2);
      });

      it('WHEN already completed panel gets expanded, collapsed and then expanded again, it remains open', fakeAsync(function (
        this: ThisTest
      ) {
        const toggleStepState = (index: number) => {
          steps[index].nativeElement.click();
          this.fixture.detectChanges();
        };

        // go back to step1 by click step1 header
        const steps = queryStepperButtons();

        // Go back to step1
        toggleStepState(0);
        // Collapse step1
        toggleStepState(0);
        // Expand again step1
        toggleStepState(0);

        const clrStepperPanels = this.fixture.debugElement.queryAll(By.directive(ClrStepperPanel));

        const stepperPanel: ClrStepperPanel = clrStepperPanels[0].componentInstance;
        let panelOpen = false;

        expect(stepperPanel.id).toEqual('step0');

        stepperPanel.panel.pipe(first()).subscribe((stepperPanel: StepperPanelModel) => {
          panelOpen = stepperPanel.open;
        });
        flush();

        expect(panelOpen).toBeTruthy();
        expect(this.component.initialStep).toEqual('step0');
      }));

      it('WHEN already completed panel gets expanded, last opened step remains incomplete', function (this: ThisTest) {
        const steps = queryStepperButtons();

        const toggleStepState = (index: number) => {
          steps[index].nativeElement.click();
          this.fixture.detectChanges();
        };

        // Go back to step1
        toggleStepState(0);

        const clrStepperPanels = this.fixture.debugElement.queryAll(By.directive(ClrStepperPanel));

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
      let onCancelSpy: jasmine.Spy;
      let queryBackButton: () => DebugElement;
      let queryCancelButton: () => DebugElement;

      beforeEach(function (this: ThisTest) {
        onCancelSpy = spyOn(this.component.onCancel, 'emit');
        queryBackButton = () => this.fixture.debugElement.query(By.css('button[clrStepButton="previous"]'));
        queryCancelButton = () => this.fixture.debugElement.query(By.css('button.btn-link:not([clrStepButton])'));
      });

      it('THEN buttons are not rendered by default', function (this: ThisTest) {
        this.fixture.detectChanges();
        expect(queryBackButton()).toBeNull();
        expect(queryCancelButton()).toBeNull();
      });

      it('THEN Cancel button is visible on all steps when showCancelButton is true and emits event', function (this: ThisTest) {
        this.component.showCancelButton = true;
        this.fixture.detectChanges();

        const cancelBtn = queryCancelButton();
        expect(cancelBtn).not.toBeNull();
        expect(cancelBtn.nativeElement.innerText.trim().toLowerCase()).toEqual(
          this.component.workflowStrings.cancel.toLowerCase()
        );

        cancelBtn.nativeElement.click();
        expect(onCancelSpy).toHaveBeenCalled();
      });

      it('THEN Back button is not visible on the first visible step even if showBackButton is true', function (this: ThisTest) {
        this.component.showBackButton = true;
        this.component.steps = [this.skippedStep, this.step1, this.step2, this.step3];
        this.fixture.detectChanges();

        expect(this.component.initialStep).toEqual('step1');
        expect(queryBackButton()).toBeNull();
      });

      it('THEN Back button is visible on the second visible step and has the correct style', fakeAsync(function (
        this: ThisTest
      ) {
        this.component.showBackButton = true;
        spyOn(this.stateService, 'isFirstVisibleStep').and.callFake((index: number) => {
          return index === 0;
        });
        this.fixture.detectChanges();

        // Use the existing "Next" button logic to move to Step 2
        const nextButtonStep1 = queryNextButton();
        nextButtonStep1.click();

        // Check that the step is now moved
        flush();
        this.fixture.detectChanges();
        this.fixture.detectChanges();
        expect(this.component.initialStep).toEqual('step2');

        const backBtn = queryBackButton();
        expect(backBtn).not.toBeNull();

        expect(backBtn.attributes['clrStepButton']).toEqual('previous');
        expect(backBtn.nativeElement.innerText.trim().toLowerCase()).toEqual(
          this.component.workflowStrings.back.toLowerCase()
        );
      }));

      it('THEN Next button should only have btn-primary class when usePrimaryNextButton is true', function (this: ThisTest) {
        this.component.usePrimaryNextButton = true;
        this.fixture.detectChanges();

        const nextButton = queryNextButton();
        // Check if the native element contains the class
        expect(nextButton.classList.contains('btn-primary')).toBeTruthy();

        this.component.usePrimaryNextButton = false;
        this.fixture.detectChanges();
        expect(nextButton.classList.contains('btn-primary')).toBeFalsy();
      });
    });
  });
});
