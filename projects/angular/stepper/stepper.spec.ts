/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { StepperService } from './providers/stepper.service';
import { ClrStepper } from './stepper';
import { ClrStepperPanel } from './stepper-panel';
import { ClrStepperModule } from './stepper.module';

@Component({
  template: `
    <form clrStepper [formGroup]="form">
      <clr-stepper-panel formGroupName="group">
        <input formControlName="firstName" />
        <input formControlName="lastName" />
      </clr-stepper-panel>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class MultiFieldReactiveFormsTestComponent {
  form = new FormGroup({
    group: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
    }),
  });
}

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
  changeDetection: ChangeDetectionStrategy.Eager,
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
        imports: [ReactiveFormsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(ReactiveFormsTestComponent);
      renderFixture(fixture);
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('should override the initial panel if developer overrides it via [clrInitialStep]', () => {
      vi.spyOn(stepperService, 'overrideInitialPanel').mockImplementation(() => undefined);
      renderFixture(fixture);
      expect(stepperService.overrideInitialPanel).not.toHaveBeenCalled();

      testComponent.initialStep = 'group';
      renderFixture(fixture);
      expect(stepperService.overrideInitialPanel).toHaveBeenCalled();

      testComponent.showSecondStep = false;
      renderFixture(fixture);
      expect(stepperService.overrideInitialPanel).toHaveBeenCalled();
    });

    it('should not call overrideInitialPanel during initial render', () => {
      const localFixture = TestBed.createComponent(ReactiveFormsTestComponent);
      const localStepperService = localFixture.debugElement
        .query(By.directive(ClrStepper))
        .injector.get(StepperService);
      vi.spyOn(localStepperService, 'overrideInitialPanel').mockImplementation(() => undefined);

      renderFixture(localFixture);

      expect(localStepperService.overrideInitialPanel).not.toHaveBeenCalled();
    });

    it('should call overrideInitialPanel when initialStep input changes after initial render', () => {
      vi.spyOn(stepperService, 'overrideInitialPanel').mockImplementation(() => undefined);

      testComponent.initialStep = 'group';
      renderFixture(fixture);

      expect(stepperService.overrideInitialPanel).toHaveBeenCalledWith('group');
    });

    it('should reset if a previously completed panel is revisited and put into an invalid state', () => {
      // all setup...
      vi.spyOn(stepperService, 'setPanelInvalid').mockImplementation(() => undefined);
      const group1 = testComponent.form.controls.group as FormGroup;
      group1.controls.name.setValue('lmnop');
      renderFixture(fixture);

      stepperService.navigateToNextPanel('group', group1.valid);
      renderFixture(fixture);

      // we navigated to the second panel
      expect(group1.valid, 'first panel form is now valid').toBe(true);

      group1.controls.name.setValue(''); // set required input to invalid value
      renderFixture(fixture);

      expect(group1.valid, 'first panel form is now invalid').toBe(false);
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });

    it('should not set the panel status to invalid immediately', () => {
      // setup
      vi.spyOn(stepperService, 'setPanelInvalid').mockImplementation(() => undefined);
      const form = testComponent.form.controls.group;

      // act (make form invalid)
      form.controls.name.setValue('');
      renderFixture(fixture);

      // assert
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });

    it('should set the panel status to valid if form was previously invalid', () => {
      // setup
      vi.spyOn(stepperService, 'setPanelValid').mockImplementation(() => undefined);
      const form = testComponent.form.controls.group;

      // act 1 (make form invalid)
      form.controls.name.setValue('');
      renderFixture(fixture);

      form.controls.name.markAsTouched();
      form.controls.name.markAsDirty();
      form.controls.name.updateValueAndValidity();

      renderFixture(fixture);

      // act 2 (make form valid)
      form.controls.name.setValue('Bob');
      renderFixture(fixture);

      // assert
      expect(stepperService.setPanelValid).toHaveBeenCalledTimes(1);
    });

    it('should not set the panel status to valid if the form was not previously invalid', () => {
      // setup
      vi.spyOn(stepperService, 'setPanelInvalid').mockImplementation(() => undefined);
      const form = testComponent.form.controls.group;

      // act (make form valid)
      form.controls.name.setValue('Bob');
      renderFixture(fixture);

      // assert
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });
  });

  describe('CDE-3088: typing in a single touched control should not validate sibling controls', () => {
    let fixture: ComponentFixture<MultiFieldReactiveFormsTestComponent>;
    let stepperService: StepperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MultiFieldReactiveFormsTestComponent],
        imports: [ReactiveFormsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(MultiFieldReactiveFormsTestComponent);
      renderFixture(fixture);
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('should not call setPanelInvalid when typing in one touched control while the form remains invalid', () => {
      vi.spyOn(stepperService, 'setPanelInvalid').mockImplementation(() => undefined);
      const group = fixture.componentInstance.form.controls.group as FormGroup;

      // simulate blur of firstName (touches it but leaves lastName empty)
      group.controls.firstName.markAsTouched();
      renderFixture(fixture);

      // simulate typing a letter into firstName; the group stays INVALID because lastName is still empty
      group.controls.firstName.setValue('J');
      renderFixture(fixture);

      // the panel status did not actually transition (INVALID -> INVALID), so setPanelInvalid must not fire
      expect(stepperService.setPanelInvalid).not.toHaveBeenCalled();
    });

    it('should not mark sibling controls as touched or dirty when typing in one control', () => {
      const group = fixture.componentInstance.form.controls.group as FormGroup;

      group.controls.firstName.markAsTouched();
      group.controls.firstName.setValue('J');
      renderFixture(fixture);

      expect(group.controls.lastName.touched).toBe(false);
      expect(group.controls.lastName.dirty).toBe(false);
    });

    it('should still call setPanelValid on a genuine INVALID -> VALID transition', () => {
      vi.spyOn(stepperService, 'setPanelValid').mockImplementation(() => undefined);
      const group = fixture.componentInstance.form.controls.group as FormGroup;

      // touch + fill firstName
      group.controls.firstName.markAsTouched();
      group.controls.firstName.setValue('John');
      renderFixture(fixture);

      // touch + fill lastName -> form transitions from INVALID to VALID
      group.controls.lastName.markAsTouched();
      group.controls.lastName.setValue('Doe');
      renderFixture(fixture);

      expect(stepperService.setPanelValid).toHaveBeenCalledTimes(1);
    });
  });

  describe('View', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: ReactiveFormsTestComponent;
    let stepperService: StepperService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ReactiveFormsTestComponent],
        imports: [ReactiveFormsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(ReactiveFormsTestComponent);
      renderFixture(fixture);
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('adds a .clr-stepper-forms class on the host element', () => {
      const stepperElement = fixture.debugElement.query(By.directive(ClrStepper)).nativeElement;
      expect(stepperElement.classList.contains('clr-accordion')).toBe(false);
      expect(stepperElement.classList.contains('clr-stepper-forms')).toBe(true);
    });

    it('should reset panels when form is reset', () => {
      vi.spyOn(stepperService, 'resetPanels').mockImplementation(() => undefined);
      testComponent.form.reset();
      renderFixture(fixture);
      expect(stepperService.resetPanels).toHaveBeenCalled();
    });

    it('should not reset panels when form is patched', () => {
      vi.spyOn(stepperService, 'resetPanels').mockImplementation(() => undefined);
      testComponent.form.patchValue({});
      renderFixture(fixture);
      expect(stepperService.resetPanels).not.toHaveBeenCalled();
    });

    it('should trigger ngSubmit event when all panels have completed', () => {
      vi.spyOn(testComponent, 'submit').mockImplementation(() => undefined);
      (testComponent.form.controls.group as FormGroup).controls.name.setValue('1');
      stepperService.navigateToNextPanel('group');
      stepperService.navigateToNextPanel('group2');
      expect(testComponent.submit).toHaveBeenCalled();
    });

    it('should update panels for form errors', () => {
      vi.spyOn(stepperService, 'setPanelsWithErrors').mockImplementation(() => undefined);

      (testComponent.form.controls.group as FormGroup).controls.name.markAsTouched();
      stepperService.navigateToNextPanel('group');
      renderFixture(fixture);
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
        imports: [FormsModule, ClrStepperModule],
      });

      fixture = TestBed.createComponent(TemplateFormsTestComponent);
      renderFixture(fixture);
      testComponent = fixture.componentInstance;
      stepperService = fixture.debugElement.query(By.directive(ClrStepper)).injector.get(StepperService);
    });

    it('should reset steps when form is reset', () => {
      vi.spyOn(stepperService, 'resetPanels').mockImplementation(() => undefined);
      testComponent.form.reset();
      renderFixture(fixture);
      expect(stepperService.resetPanels).toHaveBeenCalled();
    });

    it('should trigger ngSubmit event when all steps have completed', () => {
      vi.spyOn(testComponent, 'submit').mockImplementation(() => undefined);
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
      imports: [ClrStepperModule],
    });
  });

  it('should throw an error if angular form is not detected', () => {
    const stepper = TestBed.createComponent(ClrStepper);
    expect(() => stepper.componentInstance.ngOnInit()).toThrowError(
      'To use stepper a Reactive or Template Form is required.'
    );
  });
});
