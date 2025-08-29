/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StepperService } from './providers/stepper.service';
import { ClrStepper } from './stepper';
import { ClrStepperPanel } from './stepper-panel';
import { ClrStepperModule } from './stepper.module';

@Component({
  template: `
    <form clrStepper [formGroup]="form" (ngSubmit)="submit()" [clrInitialStep]="initialStep">
      <clr-stepper-panel #panel1 formGroupName="group">
        <input formControlName="name" />
      </clr-stepper-panel>
      @if (showSecondStep) {
      <clr-stepper-panel #panel2 formGroupName="group2"></clr-stepper-panel>
      }
    </form>
  `,
  standalone: false,
})
class ReactiveFormsTestComponent {
  @ViewChild(ClrStepper) stepper: ClrStepper;
  @ViewChild('panel1') panel1: ClrStepperPanel;
  @ViewChild('panel2') panel2: ClrStepperPanel;
  showSecondStep = true;
  initialStep = '';
  form = new FormGroup({
    group: new FormGroup({
      name: new FormControl('', Validators.required),
    }),
    group2: new FormGroup({}),
  });

  submit() {
    // Do nothing
  }
}

@Component({
  template: `
    <form clrStepper #testForm="ngForm" (ngSubmit)="submit()">
      <clr-stepper-panel ngModelGroup="group"></clr-stepper-panel>
      @if (showSecondStep) {
      <clr-stepper-panel ngModelGroup="group2"></clr-stepper-panel>
      }
    </form>
  `,
  standalone: false,
})
class TemplateFormsTestComponent {
  @ViewChild(ClrStepper) stepper: ClrStepper;
  @ViewChild('testForm') form: FormGroup;
  showSecondStep = true;
  submit() {
    // Do nothing
  }
}

describe('ClrStepper', () => {
  describe('Template API', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: ReactiveFormsTestComponent;
    let stepperService: StepperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReactiveFormsTestComponent],
        imports: [ReactiveFormsModule, NoopAnimationsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(ReactiveFormsTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('should override the initial panel if developer overrides it via [clrInitialStep]', () => {
      spyOn(stepperService, 'overrideInitialPanel');
      fixture.detectChanges();
      expect(stepperService.overrideInitialPanel).not.toHaveBeenCalled();

      testComponent.initialStep = 'group';
      fixture.detectChanges();
      expect(stepperService.overrideInitialPanel).toHaveBeenCalled();

      testComponent.showSecondStep = false;
      fixture.detectChanges();
      expect(stepperService.overrideInitialPanel).toHaveBeenCalled();
    });

    it('should reset if a previously completed panel is revisited and put into an invalid state', () => {
      // all setup...
      spyOn(stepperService, 'setPanelInvalid');
      const group1 = testComponent.form.controls.group as FormGroup;
      group1.controls.name.setValue('lmnop');
      fixture.detectChanges();

      stepperService.navigateToNextPanel('group', group1.valid);
      fixture.detectChanges();

      // we navigated to the second panel
      expect(group1.valid).toBe(true, 'first panel form is now valid');

      group1.controls.name.setValue(''); // set required input to invalid value
      fixture.detectChanges();

      expect(group1.valid).toBe(false, 'first panel form is now invalid');
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });

    it('should not set the panel status to invalid immediately', () => {
      // setup
      spyOn(stepperService, 'setPanelInvalid');
      const form = testComponent.form.controls.group;

      // act (make form invalid)
      form.controls.name.setValue('');
      fixture.detectChanges();

      // assert
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });

    it('should set the panel status to valid if form was previously invalid', () => {
      // setup
      spyOn(stepperService, 'setPanelValid');
      const form = testComponent.form.controls.group;

      // act 1 (make form invalid)
      form.controls.name.setValue('');
      fixture.detectChanges();

      form.controls.name.markAsTouched();
      form.controls.name.markAsDirty();
      form.controls.name.updateValueAndValidity();

      fixture.detectChanges();

      // act 2 (make form valid)
      form.controls.name.setValue('Bob');
      fixture.detectChanges();

      // assert
      expect(stepperService.setPanelValid).toHaveBeenCalledTimes(1);
    });

    it('should not set the panel status to valid if the form was not previously invalid', () => {
      // setup
      spyOn(stepperService, 'setPanelInvalid');
      const form = testComponent.form.controls.group;

      // act (make form valid)
      form.controls.name.setValue('Bob');
      fixture.detectChanges();

      // assert
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });
  });

  describe('View', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: ReactiveFormsTestComponent;
    let stepperService: StepperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReactiveFormsTestComponent],
        imports: [ReactiveFormsModule, NoopAnimationsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(ReactiveFormsTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('adds a .clr-accordion and .clr-stepper-form class on the host element', () => {
      const stepperElement = fixture.debugElement.query(By.directive(ClrStepper)).nativeElement;
      expect(stepperElement.classList.contains('clr-accordion')).toBe(true);
      expect(stepperElement.classList.contains('clr-stepper-forms')).toBe(true);
    });

    it('should reset panels when form is reset', () => {
      spyOn(stepperService, 'resetPanels');
      testComponent.form.reset();
      fixture.detectChanges();
      expect(stepperService.resetPanels).toHaveBeenCalled();
    });

    it('should not reset panels when form is patched', () => {
      spyOn(stepperService, 'resetPanels');
      testComponent.form.patchValue({});
      fixture.detectChanges();
      expect(stepperService.resetPanels).not.toHaveBeenCalled();
    });

    it('should trigger ngSubmit event when all panels have completed', () => {
      spyOn(testComponent, 'submit');
      (testComponent.form.controls.group as FormGroup).controls.name.setValue('1');
      stepperService.navigateToNextPanel('group');
      stepperService.navigateToNextPanel('group2');
      expect(testComponent.submit).toHaveBeenCalled();
    });

    it('should update panels for form errors', () => {
      spyOn(stepperService, 'setPanelsWithErrors');

      (testComponent.form.controls.group as FormGroup).controls.name.markAsTouched();
      stepperService.navigateToNextPanel('group');
      fixture.detectChanges();
      stepperService.navigateToNextPanel('group2');

      expect(stepperService.setPanelsWithErrors).toHaveBeenCalled();
    });
  });
});

describe('ClrStepper Template Forms', () => {
  describe('View', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: TemplateFormsTestComponent;
    let stepperService: StepperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TemplateFormsTestComponent],
        imports: [FormsModule, NoopAnimationsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(TemplateFormsTestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('should reset steps when form is reset', () => {
      spyOn(stepperService, 'resetPanels');
      testComponent.form.reset();
      fixture.detectChanges();
      expect(stepperService.resetPanels).toHaveBeenCalled();
    });

    it('should trigger ngSubmit event when all steps have completed', () => {
      spyOn(testComponent, 'submit');
      stepperService.navigateToNextPanel('group');
      stepperService.navigateToNextPanel('group2');
      expect(testComponent.submit).toHaveBeenCalled();
    });
  });
});

describe('ClrStepper Error Handling', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [NoopAnimationsModule, ClrStepperModule],
    });
  });

  it('should throw an error if angular form is not detected', () => {
    const stepper = TestBed.createComponent(ClrStepper);
    expect(() => stepper.componentInstance.ngOnInit()).toThrowError(
      'To use stepper a Reactive or Template Form is required.'
    );
  });
});
